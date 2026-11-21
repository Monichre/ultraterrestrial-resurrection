#!/usr/bin/env python3
"""
Quick CSV Analysis for Triple RAG Integration
Date: July 9, 2025 at 07:35 PST
"""

import pandas as pd
import ast

# Load and analyze CSV
csv_path = "/data/queue/documents.csv"
print("📊 Loading documents.csv...")

df = pd.read_csv(csv_path)
print(f"Total documents: {len(df)}")
print(f"Columns: {list(df.columns)}")

# Check embeddings
if 'embedding' in df.columns:
    print("\n🎯 Analyzing embeddings...")

    # Check first few embeddings
    for i in range(min(3, len(df))):
        embedding_str = df['embedding'].iloc[i]
        if pd.notna(embedding_str) and isinstance(embedding_str, str):
            try:
                embedding = ast.literal_eval(embedding_str)
                print(f"  Row {i}: {len(embedding)} dimensions")
                if i == 0:
                    print(f"    Sample values: {embedding[:5]}...")
            except:
                print(f"  Row {i}: Parse error")

# Check content quality
print(f"\n📝 Content analysis:")
print(f"  Documents with title: {df['title'].notna().sum()}")
print(f"  Documents with summary: {df['summary'].notna().sum()}")
print(f"  Documents with file: {df['file'].notna().sum()}")

# Sample documents
print(f"\n📄 Sample documents:")
for i in range(min(2, len(df))):
    row = df.iloc[i]
    print(f"\nDocument {i+1}:")
    print(f"  Title: {row['title']}")
    print(f"  File: {row['file']}")
    print(f"  Summary: {str(row['summary'])[:100]}...")
