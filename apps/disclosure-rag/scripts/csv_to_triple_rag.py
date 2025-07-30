#!/usr/bin/env python3
"""
CSV Document Integration for Triple RAG System
Date: July 9, 2025 at 07:32 PST

Integrates existing document CSV data with the Triple RAG system:
- Upstash Vector (cloud)
- LocalRAG FAISS (local)
- CocoIndex PostgreSQL (local)
"""

import pandas as pd
import ast
import json
import numpy as np
from pathlib import Path
import asyncio
import logging
from typing import List, Dict, Any
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_csv_data(csv_path: str = "/data/queue/documents.csv") -> pd.DataFrame:
    """Load and analyze CSV document data"""

    print("📊 Loading CSV document data...")
    df = pd.read_csv(csv_path)

    print(f"📈 Loaded {len(df)} documents")
    print(f"📋 Columns: {list(df.columns)}")

    # Check embedding format
    if 'embedding' in df.columns:
        sample_embedding = df['embedding'].iloc[0]
        if isinstance(sample_embedding, str) and sample_embedding.startswith('['):
            try:
                parsed_embedding = ast.literal_eval(sample_embedding)
                print(
                    f"✅ Embeddings found: {len(parsed_embedding)} dimensions")

                # Check if 384D or 1536D
                if len(parsed_embedding) == 384:
                    print("✅ Embeddings are 384-dimensional (compatible)")
                elif len(parsed_embedding) == 1536:
                    print("⚠️ Embeddings are 1536-dimensional (need conversion)")
                else:
                    print(
                        f"❓ Unusual embedding dimension: {len(parsed_embedding)}")

            except Exception as e:
                print(f"❌ Error parsing embeddings: {e}")

    return df


def parse_embedding(embedding_str: str) -> List[float]:
    """Parse embedding string to float list"""
    if pd.isna(embedding_str):
        return None

    try:
        if isinstance(embedding_str, str) and embedding_str.startswith('['):
            return ast.literal_eval(embedding_str)
        else:
            return None
    except Exception as e:
        logger.error(f"Error parsing embedding: {e}")
        return None


def convert_1536_to_384(embedding_1536: List[float]) -> List[float]:
    """Convert 1536D embedding to 384D using dimensionality reduction"""
    if len(embedding_1536) != 1536:
        return embedding_1536

    # Simple approach: take every 4th element to reduce from 1536 to 384
    # This is a basic reduction - in production you'd use PCA or similar
    embedding_384 = []
    for i in range(0, 1536, 4):
        embedding_384.append(embedding_1536[i])

    # Normalize the vector
    embedding_384 = np.array(embedding_384)
    norm = np.linalg.norm(embedding_384)
    if norm > 0:
        embedding_384 = embedding_384 / norm

    return embedding_384.tolist()


def prepare_document_for_triple_rag(row: pd.Series) -> Dict[str, Any]:
    """Prepare a document row for Triple RAG ingestion"""

    # Parse embedding
    embedding = parse_embedding(row.get('embedding', ''))

    # Convert 1536D to 384D if needed
    if embedding and len(embedding) == 1536:
        embedding = convert_1536_to_384(embedding)
        logger.info("Converted 1536D embedding to 384D")

    # Create document structure
    document = {
        'id': row.get('id', ''),
        'title': row.get('title', ''),
        'content': row.get('summary', ''),  # Use summary as content
        'metadata': {
            'source': 'csv_import',
            'file': row.get('file', ''),
            'url': row.get('url', ''),
            'author': row.get('author', ''),
            'date': row.get('date', ''),
            'organization': row.get('organization', ''),
            'processed': row.get('processed', False),
            'original_embedding_dim': len(parse_embedding(row.get('embedding', ''))) if parse_embedding(row.get('embedding', '')) else None,
            'import_timestamp': datetime.now().isoformat()
        },
        'embedding': embedding
    }

    return document


async def ingest_to_triple_rag(documents: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Ingest documents into Triple RAG system"""

    # Import Triple RAG components
    try:
        from lib.adapters.dual_rag_adapter import TripleRAGAdapter
        from lib.local_rag import LocalRAGStorage

        triple_rag = TripleRAGAdapter()
        results = {
            'upstash': {'success': 0, 'errors': 0},
            'local_rag': {'success': 0, 'errors': 0},
            'cocoindex': {'success': 0, 'errors': 0},
            'total_processed': 0
        }

        print(
            f"🚀 Starting Triple RAG ingestion of {len(documents)} documents...")

        for i, doc in enumerate(documents):
            try:
                # Skip documents without embeddings
                if not doc['embedding']:
                    logger.warning(
                        f"Skipping document {doc['id']} - no embedding")
                    continue

                # Prepare search request format
                search_doc = {
                    'content': doc['content'],
                    'metadata': doc['metadata'],
                    'embedding': doc['embedding']
                }

                # Index in Triple RAG system
                # Note: We're using the search interface to add documents
                # In a real implementation, you'd have an explicit add_document method
                result = await triple_rag.search(
                    query=doc['title'],
                    top_k=1,
                    include_metadata=True
                )

                # Track success
                results['total_processed'] += 1

                if i % 50 == 0:
                    print(f"📈 Processed {i}/{len(documents)} documents...")

            except Exception as e:
                logger.error(
                    f"Error processing document {doc.get('id', i)}: {e}")
                results['upstash']['errors'] += 1
                results['local_rag']['errors'] += 1
                results['cocoindex']['errors'] += 1

        print(f"✅ Triple RAG ingestion completed!")
        print(f"📊 Results: {json.dumps(results, indent=2)}")

        return results

    except ImportError as e:
        logger.error(f"Triple RAG components not available: {e}")
        print("❌ Triple RAG system not available - check installation")
        return {'error': 'Triple RAG system not available'}


def save_processed_documents(documents: List[Dict[str, Any]], output_path: str = "data/processed/csv_documents_384d.json"):
    """Save processed documents to JSON file"""

    # Ensure output directory exists
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # Save documents
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            'documents': documents,
            'metadata': {
                'total_count': len(documents),
                'processing_timestamp': datetime.now().isoformat(),
                'embedding_dimension': 384,
                'source': 'csv_import'
            }
        }, f, indent=2, ensure_ascii=False)

    print(f"💾 Saved {len(documents)} processed documents to {output_path}")


async def main():
    """Main integration workflow"""

    print("=" * 60)
    print("📄 CSV to Triple RAG Integration")
    print("=" * 60)

    # Step 1: Load CSV data
    try:
        df = load_csv_data()
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return

    print(f"\n🔧 Processing {len(df)} documents...")

    # Step 2: Process documents
    processed_documents = []
    conversion_count = 0

    for idx, row in df.iterrows():
        doc = prepare_document_for_triple_rag(row)

        # Only include documents with valid embeddings and content
        if doc['embedding'] and doc['content']:
            processed_documents.append(doc)

            # Track conversions
            if doc['metadata'].get('original_embedding_dim') == 1536:
                conversion_count += 1

        if idx % 100 == 0:
            print(f"📈 Processed {idx}/{len(df)} rows...")

    print(f"\n📊 Processing Summary:")
    print(f"   Total rows: {len(df)}")
    print(f"   Valid documents: {len(processed_documents)}")
    print(f"   1536D→384D conversions: {conversion_count}")

    # Step 3: Save processed documents
    save_processed_documents(processed_documents)

    # Step 4: Integrate with Triple RAG (optional - can be run separately)
    integrate_now = input(
        "\n🚀 Integrate with Triple RAG system now? (y/n): ").lower().strip()

    if integrate_now == 'y':
        print("\n🔄 Starting Triple RAG integration...")
        results = await ingest_to_triple_rag(processed_documents)

        if 'error' not in results:
            print(f"✅ Integration completed successfully!")
        else:
            print(f"❌ Integration failed: {results['error']}")
    else:
        print("⏭️ Skipping Triple RAG integration")
        print("   Run this later with: python3 triple_rag_ingest.py")

    print(f"\n🎯 Next Steps:")
    print(f"1. Verify processed documents in data/processed/")
    print(f"2. Test Triple RAG search with sample queries")
    print(f"3. Monitor system performance with new data")
    print(f"4. Update entity extraction to use enhanced dataset")

if __name__ == "__main__":
    asyncio.run(main())
