#!/usr/bin/env python3
"""
Analyze CSV structure and prepare for Triple RAG integration
Date: July 9, 2025 at 07:29 PST
"""

import pandas as pd
import ast
import json
from pathlib import Path

def analyze_csv_structure():
    """Analyze the documents.csv structure and prepare for integration"""
    
    csv_path = Path("data/raw/documents.csv")
    if not csv_path.exists():
        print(f"❌ CSV file not found: {csv_path}")
        return
        
    print("🔍 Analyzing documents.csv structure...")
    
    # Read just the first few rows to understand structure
    df = pd.read_csv(csv_path, nrows=5)
    
    print(f"📊 CSV Shape (first 5 rows): {df.shape}")
    print(f"📋 Columns: {list(df.columns)}")
    
    # Check data types
    print("\n📈 Data Types:")
    for col, dtype in df.dtypes.items():
        print(f"  {col}: {dtype}")
    
    # Check for embedding column
    if 'embedding' in df.columns:
        print("\n🎯 Found embedding column!")
        
        # Check first embedding to understand format
        first_embedding = df['embedding'].iloc[0]
        print(f"   First embedding preview: {str(first_embedding)[:100]}...")
        
        # Try to parse embedding format
        try:
            if isinstance(first_embedding, str):
                # Try to parse as JSON array
                if first_embedding.startswith('['):
                    parsed_embedding = ast.literal_eval(first_embedding)
                    print(f"   ✅ Embedding format: JSON array")
                    print(f"   ✅ Embedding dimensions: {len(parsed_embedding)}")
                else:
                    print(f"   ❓ Embedding format: String (unknown format)")
            else:
                print(f"   ❓ Embedding format: {type(first_embedding)}")
        except Exception as e:
            print(f"   ❌ Error parsing embedding: {e}")
    
    # Check for essential columns
    essential_columns = ['title', 'content', 'summary']
    print(f"\n📝 Essential columns check:")
    for col in essential_columns:
        if col in df.columns:
            print(f"   ✅ {col}: Found")
        else:
            print(f"   ❌ {col}: Missing")
    
    # Sample data preview
    print(f"\n📄 Sample data:")
    for idx, row in df.iterrows():
        print(f"   Row {idx}:")
        for col in ['title', 'content', 'summary']:
            if col in df.columns:
                value = str(row[col])[:100] if pd.notna(row[col]) else "N/A"
                print(f"     {col}: {value}...")
        print()
    
    return df

def get_total_document_count():
    """Get total number of documents in CSV"""
    try:
        csv_path = Path("data/raw/documents.csv")
        df = pd.read_csv(csv_path, usecols=[0])  # Just read first column to count
        total_count = len(df)
        print(f"📊 Total documents in CSV: {total_count}")
        return total_count
    except Exception as e:
        print(f"❌ Error counting documents: {e}")
        return 0

def check_embedding_dimensions():
    """Check embedding dimensions in the CSV"""
    try:
        csv_path = Path("data/raw/documents.csv")
        # Read just embedding column for first 10 rows
        df = pd.read_csv(csv_path, usecols=['embedding'], nrows=10)
        
        dimensions = []
        for idx, embedding_str in enumerate(df['embedding']):
            if pd.notna(embedding_str):
                try:
                    if isinstance(embedding_str, str) and embedding_str.startswith('['):
                        embedding = ast.literal_eval(embedding_str)
                        dimensions.append(len(embedding))
                        if idx < 3:  # Show first 3
                            print(f"   Row {idx}: {len(embedding)} dimensions")
                except Exception as e:
                    print(f"   Row {idx}: Error parsing - {e}")
        
        if dimensions:
            unique_dims = set(dimensions)
            print(f"\n📏 Embedding dimensions found: {unique_dims}")
            if len(unique_dims) == 1:
                print(f"   ✅ Consistent dimensions: {list(unique_dims)[0]}")
            else:
                print(f"   ⚠️ Inconsistent dimensions detected!")
                for dim in unique_dims:
                    count = dimensions.count(dim)
                    print(f"     {dim}D: {count} embeddings")
        
        return dimensions
        
    except Exception as e:
        print(f"❌ Error checking embedding dimensions: {e}")
        return []

if __name__ == "__main__":
    print("=" * 60)
    print("📄 Document CSV Analysis for Triple RAG Integration")
    print("=" * 60)
    
    # Analyze structure
    df = analyze_csv_structure()
    
    if df is not None:
        print("\n" + "=" * 60)
        print("📊 Document Count Analysis")
        print("=" * 60)
        
        # Get total count
        total_count = get_total_document_count()
        
        print("\n" + "=" * 60)
        print("🎯 Embedding Analysis")
        print("=" * 60)
        
        # Check embedding dimensions
        dimensions = check_embedding_dimensions()
        
        print("\n" + "=" * 60)
        print("🚀 Integration Readiness Assessment")
        print("=" * 60)
        
        if 'embedding' in df.columns and dimensions:
            if 384 in set(dimensions):
                print("✅ Ready for 384D Triple RAG integration")
            elif 1536 in set(dimensions):
                print("⚠️ Found 1536D embeddings - need conversion to 384D")
                print("   → Run migration script to convert dimensions")
            else:
                print(f"❓ Found {set(dimensions)}D embeddings - check compatibility")
        else:
            print("❌ No valid embeddings found - need to generate embeddings")
        
        print(f"\n🎯 Next Steps:")
        print(f"1. Create CSV import script for Triple RAG system")
        print(f"2. Process {total_count} documents through CocoIndex")
        print(f"3. Test complete ingestion pipeline")
        print(f"4. Verify search functionality across all backends")