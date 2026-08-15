#!/usr/bin/env python3
"""
Quick delta check between local knowledge base and what should be in vector store
"""

import os
from pathlib import Path
import json

def main():
    # Get the knowledge base path
    kb_path = Path(__file__).parent
    
    print("🔍 Knowledge Base Delta Check")
    print("=" * 50)
    
    # Count local files
    print("\n📁 Local Files:")
    
    # PDF files in sources/files/
    pdfs = list(kb_path.glob("sources/files/*.pdf"))
    print(f"   PDFs: {len(pdfs)}")
    
    # Transcript files in sources/transcripts/
    transcripts = list(kb_path.glob("sources/transcripts/**/*.txt"))
    print(f"   Transcripts: {len(transcripts)}")
    
    # Web content files
    web_files = list(kb_path.glob("sources/web/**/*"))
    web_files = [f for f in web_files if f.is_file()]
    print(f"   Web content files: {len(web_files)}")
    
    # Metadata files
    metadata_files = list(kb_path.glob("metadata/*.json"))
    print(f"   Metadata files: {len(metadata_files)}")
    
    total_files = len(pdfs) + len(transcripts) + len(web_files) + len(metadata_files)
    print(f"\n📊 Total: {total_files} files")
    
    # Check for external resources
    external_path = kb_path / "external_resources.json"
    if external_path.exists():
        print("✅ External resources file exists")
    else:
        print("❌ External resources file missing")
    
    # TODO: Compare with OpenAI vector store once API is fixed
    print("\n⚠️  OpenAI vector store comparison blocked by API changes")
    print("   Need to fix vector_store_query.py first")

if __name__ == "__main__":
    main()