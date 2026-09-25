#!/usr/bin/env python3
"""
Extract complete file inventory from OpenAI vector store for transparency
Date: December 20, 2024
Purpose: Data integrity and transparency - show what agents are trained on
"""

import os
import json
import csv
from datetime import datetime
from openai import OpenAI
import time

client = OpenAI()
vector_store_id = "vs_meWOEnUiUxtQWf0W6NBsNpCG"

def extract_complete_file_inventory():
    """Extract all file names and metadata for transparency"""
    
    print("🔍 Extracting complete file inventory for transparency...")
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    # Get vector store info
    try:
        vector_store = client.vector_stores.retrieve(vector_store_id)
        print(f"📚 Vector Store: {vector_store.name}")
        print(f"🆔 ID: {vector_store.id}")
        print(f"📊 File Counts: {vector_store.file_counts}")
        print(f"✅ Status: {vector_store.status}")
        print()
    except Exception as e:
        print(f"❌ Error getting vector store info: {e}")
        return None
    
    all_files = []
    after = None
    batch_count = 0
    
    try:
        while True:
            batch_count += 1
            print(f"📦 Processing batch {batch_count}...")
            
            # Get batch of files
            response = client.vector_stores.files.list(
                vector_store_id=vector_store_id,
                limit=100,
                after=after
            )
            
            if not response.data:
                print("✅ No more files to process")
                break
            
            print(f"   Found {len(response.data)} files in batch {batch_count}")
            
            # Process each file in batch
            for i, file in enumerate(response.data):
                try:
                    # Get file details
                    file_details = client.files.retrieve(file.id)
                    
                    file_info = {
                        'file_id': file.id,
                        'filename': getattr(file_details, 'filename', f"{file.id}.unknown"),
                        'bytes': getattr(file_details, 'bytes', 0),
                        'purpose': getattr(file_details, 'purpose', 'unknown'),
                        'created_at': file.created_at,
                        'status': file.status,
                        'usage_bytes': getattr(file, 'usage_bytes', 0),
                        'vector_store_created': file.created_at
                    }
                    
                    all_files.append(file_info)
                    
                    # Show progress every 50 files
                    if len(all_files) % 50 == 0:
                        print(f"   📄 Processed {len(all_files)} files...")
                    
                except Exception as e:
                    print(f"   ⚠️  Error processing file {file.id}: {e}")
                    # Still add basic info
                    all_files.append({
                        'file_id': file.id,
                        'filename': f"ERROR_RETRIEVING_{file.id}",
                        'bytes': 0,
                        'purpose': 'unknown',
                        'created_at': file.created_at,
                        'status': file.status,
                        'error': str(e)
                    })
            
            # Get next page cursor
            after = response.last_id if hasattr(response, 'last_id') else None
            if not after:
                break
            
            # Small delay to be nice to API
            time.sleep(0.1)
    
    except Exception as e:
        print(f"❌ Error during extraction: {e}")
        print(f"📊 Partial results: {len(all_files)} files extracted before error")
    
    print(f"\n✅ Extraction complete: {len(all_files)} files")
    return {
        'vector_store_info': {
            'id': vector_store.id,
            'name': vector_store.name,
            'status': vector_store.status,
            'file_counts': vector_store.file_counts,
            'created_at': vector_store.created_at
        },
        'files': all_files,
        'extraction_date': datetime.now().isoformat(),
        'total_extracted': len(all_files)
    }

def analyze_file_inventory(inventory):
    """Analyze the file inventory for transparency report"""
    
    files = inventory['files']
    
    # Categorize files
    categories = {
        'pdfs': [],
        'transcripts': [],
        'json_data': [],
        'text_files': [],
        'other': []
    }
    
    sources = {}
    file_sizes = []
    
    for file in files:
        filename = file['filename'].lower()
        size = file['bytes']
        file_sizes.append(size)
        
        # Categorize by extension
        if filename.endswith('.pdf'):
            categories['pdfs'].append(file)
        elif filename.endswith('.txt'):
            categories['transcripts'].append(file)
        elif filename.endswith('.json'):
            categories['json_data'].append(file)
        elif any(filename.endswith(ext) for ext in ['.md', '.html', '.csv']):
            categories['text_files'].append(file)
        else:
            categories['other'].append(file)
        
        # Track sources by directory/path
        if '/' in file['filename']:
            source_path = '/'.join(file['filename'].split('/')[:-1])
            sources[source_path] = sources.get(source_path, 0) + 1
    
    analysis = {
        'categories': {k: len(v) for k, v in categories.items()},
        'top_sources': sorted(sources.items(), key=lambda x: x[1], reverse=True)[:20],
        'size_stats': {
            'total_bytes': sum(file_sizes),
            'average_bytes': sum(file_sizes) / len(file_sizes) if file_sizes else 0,
            'largest_file': max(file_sizes) if file_sizes else 0,
            'smallest_file': min(file_sizes) if file_sizes else 0
        }
    }
    
    return analysis, categories

def generate_transparency_reports(inventory, analysis, categories):
    """Generate multiple transparency reports"""
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # 1. Complete file inventory (CSV)
    csv_file = f'file_inventory_complete_{timestamp}.csv'
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        if inventory['files']:
            writer = csv.DictWriter(f, fieldnames=inventory['files'][0].keys())
            writer.writeheader()
            writer.writerows(inventory['files'])
    
    # 2. Summary report (JSON)
    summary_file = f'file_inventory_summary_{timestamp}.json'
    summary = {
        'generation_date': datetime.now().isoformat(),
        'vector_store_info': inventory['vector_store_info'],
        'summary_stats': {
            'total_files': inventory['total_extracted'],
            'categories': analysis['categories'],
            'size_stats': analysis['size_stats']
        },
        'top_source_directories': analysis['top_sources'],
        'data_transparency_note': "This inventory shows all files used to train our RAG system for full transparency"
    }
    
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    
    # 3. Human-readable transparency report (Markdown)
    md_file = f'TRANSPARENCY_REPORT_{timestamp}.md'
    with open(md_file, 'w') as f:
        f.write(f"""# Data Transparency Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Purpose:** Full transparency of RAG system training data

## Vector Store Overview

- **Name:** {inventory['vector_store_info']['name']}
- **ID:** {inventory['vector_store_info']['id']}
- **Status:** {inventory['vector_store_info']['status']}
- **Total Files:** {inventory['total_extracted']}

## File Categories

""")
        
        for category, count in analysis['categories'].items():
            f.write(f"- **{category.title()}:** {count} files\n")
        
        f.write(f"""

## Data Sources

The top source directories for our training data:

""")
        
        for source, count in analysis['top_sources'][:10]:
            f.write(f"- `{source}`: {count} files\n")
        
        f.write(f"""

## Size Statistics

- **Total Data:** {analysis['size_stats']['total_bytes']:,} bytes ({analysis['size_stats']['total_bytes'] / 1024 / 1024:.1f} MB)
- **Average File Size:** {analysis['size_stats']['average_bytes']:,.0f} bytes
- **Largest File:** {analysis['size_stats']['largest_file']:,} bytes
- **Smallest File:** {analysis['size_stats']['smallest_file']:,} bytes

## Transparency Statement

This report provides complete visibility into all data used to train our RAG (Retrieval-Augmented Generation) system. Every file listed above contributes to the knowledge base that powers our AI agents and research tools.

For the complete file-by-file inventory, see: `{csv_file}`

**Data Integrity Commitment:** We believe in full transparency about our training data sources to ensure trust and accountability in our AI research tools.
""")
    
    return csv_file, summary_file, md_file

def main():
    print("🛸 OpenAI Vector Store Transparency Report Generator")
    print("Purpose: Extract complete file inventory for data integrity")
    print("=" * 70)
    
    # Extract complete inventory
    inventory = extract_complete_file_inventory()
    
    if not inventory or not inventory['files']:
        print("❌ Failed to extract file inventory")
        return
    
    print(f"\n📊 Analyzing {len(inventory['files'])} files...")
    
    # Analyze inventory
    analysis, categories = analyze_file_inventory(inventory)
    
    # Generate transparency reports
    csv_file, summary_file, md_file = generate_transparency_reports(inventory, analysis, categories)
    
    print(f"\n✅ Transparency reports generated:")
    print(f"   📄 Complete inventory: {csv_file}")
    print(f"   📊 Summary: {summary_file}")
    print(f"   📖 Human-readable: {md_file}")
    
    print(f"\n🔍 Quick Summary:")
    print(f"   📚 Total files: {inventory['total_extracted']}")
    print(f"   📄 PDFs: {analysis['categories']['pdfs']}")
    print(f"   📝 Transcripts: {analysis['categories']['transcripts']}")
    print(f"   📊 JSON data: {analysis['categories']['json_data']}")
    print(f"   📁 Other: {analysis['categories']['text_files'] + analysis['categories']['other']}")
    
    print(f"\n💡 These files show exactly what data our RAG agents use")
    print(f"   Share these reports for full transparency!")

if __name__ == "__main__":
    main()