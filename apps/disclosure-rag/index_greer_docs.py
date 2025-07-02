#!/usr/bin/env python3
"""
Index Stephen Greer Document Collection
Date: June 29, 2025

Script to index a large collection of UFO/disclosure documents using CocoIndex
"""

import os
import sys
from pathlib import Path
import argparse

def setup_cocoindex():
    """Install and setup CocoIndex"""
    try:
        import cocoindex
        print("✓ CocoIndex already available")
        return True
    except ImportError:
        print("Installing CocoIndex...")
        os.system("pip install cocoindex sentence-transformers")
        try:
            import cocoindex
            print("✓ CocoIndex installed")
            return True
        except ImportError:
            print("✗ Failed to install CocoIndex")
            return False

def create_indexing_flow(docs_path, db_name="greer_documents"):
    """Create CocoIndex flow for document collection"""
    
    flow_code = f'''
import cocoindex
from pathlib import Path

@cocoindex.flow_def(name="GreerDocuments")
def greer_flow(flow_builder, data_scope):
    print("📁 Indexing documents from: {docs_path}")
    
    # Add document source
    data_scope["documents"] = flow_builder.add_source(
        cocoindex.sources.LocalFile(
            path="{docs_path}",
            recursive=True,
            file_types=[".pdf", ".txt", ".doc", ".docx", ".md", ".html"]
        )
    )
    
    # Convert PDFs to text (important for scanned documents)
    data_scope["text"] = flow_builder.add_transformation(
        cocoindex.transformations.PdfToMarkdown()
    )
    
    # Chunk documents for better search
    data_scope["chunks"] = flow_builder.add_transformation(
        cocoindex.transformations.TextChunker(
            chunk_size=1000,
            chunk_overlap=200
        )
    )
    
    # Create embeddings using local model
    data_scope["embeddings"] = flow_builder.add_transformation(
        cocoindex.transformations.SentenceTransformer(
            model="all-mpnet-base-v2"  # Better quality for research docs
        )
    )
    
    # Export to SQLite
    flow_builder.add_export(
        cocoindex.exports.SQLite(
            database="{db_name}.db",
            table="documents"
        )
    )

if __name__ == "__main__":
    print("Setting up Greer document index...")
    cocoindex.setup(__file__)
    print("Processing documents (this may take a while)...")
    cocoindex.update(__file__)
    print("✓ Greer documents indexed successfully!")
'''
    
    # Write the flow file
    flow_file = Path("greer_flow.py")
    with open(flow_file, 'w') as f:
        f.write(flow_code)
    
    return flow_file

def test_search(query="disclosure"):
    """Test searching the indexed documents"""
    try:
        import cocoindex
        
        print(f"\n🔍 Testing search for: '{query}'")
        print("=" * 50)
        
        # Load the flow
        flow = cocoindex.load_flow("GreerDocuments")
        
        # Search
        results = flow.search(query, k=5)
        
        if results:
            for i, result in enumerate(results, 1):
                print(f"\n{i}. Score: {result.score:.3f}")
                print(f"   Content: {result.content[:150]}...")
                if hasattr(result, 'metadata') and result.metadata:
                    source = result.metadata.get('source_file', 'Unknown')
                    print(f"   Source: {Path(source).name}")
        else:
            print("No results found")
        
        return True
        
    except Exception as e:
        print(f"Search test failed: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Index Stephen Greer document collection")
    parser.add_argument("docs_path", help="Path to your document collection")
    parser.add_argument("--db-name", default="greer_documents", help="Database name")
    parser.add_argument("--test-query", default="disclosure", help="Test search query")
    
    args = parser.parse_args()
    
    # Validate documents path
    docs_path = Path(args.docs_path)
    if not docs_path.exists():
        print(f"❌ Documents path does not exist: {docs_path}")
        return False
    
    # Count documents
    doc_files = []
    for ext in [".pdf", ".txt", ".doc", ".docx", ".md", ".html"]:
        doc_files.extend(docs_path.rglob(f"*{ext}"))
    
    print(f"📊 Found {len(doc_files)} documents to index")
    if len(doc_files) == 0:
        print("No supported document types found")
        return False
    
    # Show sample files
    print("📄 Sample files:")
    for i, file in enumerate(doc_files[:5]):
        print(f"  {i+1}. {file.name}")
    if len(doc_files) > 5:
        print(f"  ... and {len(doc_files) - 5} more")
    
    # Confirm
    response = input(f"\nProceed with indexing? (y/N): ")
    if response.lower() != 'y':
        print("Indexing cancelled")
        return False
    
    print("\n🚀 Starting indexing process...")
    print("=" * 50)
    
    # Setup CocoIndex
    if not setup_cocoindex():
        return False
    
    # Create flow
    print("Creating indexing flow...")
    flow_file = create_indexing_flow(str(docs_path.absolute()), args.db_name)
    print(f"✓ Created flow: {flow_file}")
    
    # Run indexing
    print("\\n⚙️ Running indexing (this may take several minutes)...")
    try:
        os.system(f"python {flow_file}")
        print("✓ Indexing complete!")
    except Exception as e:
        print(f"❌ Indexing failed: {e}")
        return False
    
    # Test search
    print("\\n🧪 Testing search functionality...")
    if test_search(args.test_query):
        print("✓ Search test passed!")
    else:
        print("⚠️ Search test failed")
    
    # Instructions
    print("\\n" + "=" * 50)
    print("🎉 Setup Complete!")
    print("=" * 50)
    print(f"Database: {args.db_name}.db")
    print(f"Flow file: {flow_file}")
    print("\\nTo use in your app:")
    print("1. Set COCOINDEX_ENABLED=true in your .env file")
    print("2. Set COCOINDEX_FLOW_NAME=GreerDocuments in your .env file")
    print("3. Start disclosure-rag server: python api_server.py")
    print("4. Start main app: npm run dev")
    print("5. Use @ mentions and RAG commands in TipTap editor")
    
    print("\\n🔍 Try searching for:")
    print("- 'disclosure project'")
    print("- 'extraterrestrial contact'") 
    print("- 'government cover-up'")
    print("- 'CE-5 protocols'")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)