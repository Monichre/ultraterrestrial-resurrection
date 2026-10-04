#!/usr/bin/env python3
"""
Entity Processing Utility
Process entities for documents and browse entity index for selective processing

Usage: 
  python process_entities.py [--latest] [--all] [--doc-id DOC_ID]
  python process_entities.py [--index] [--recent] [--entities TYPE]

Entity Index Options:
  --index          Show comprehensive entity index summary (menu)
  --recent         Show all recent entities by type  
  --entities TYPE  Show recent entities for specific type (personnel, organizations, etc.)

Processing Options:
  --latest         Process the latest document
  --all            Process all incomplete documents  
  --doc-id DOC_ID  Process specific document ID
  --interactive    Use interactive mode with user confirmations

Date: Updated July 25, 2025 - Added entity index integration
"""

import sys
import argparse
import os
from pathlib import Path

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from lib.state_manager import get_state_manager
from lib.entity_extraction.processors.interactive_entity_processor import process_summary_file_interactive
import json
from datetime import datetime

def load_entity_index():
    """Load the entity index for browsing and selection"""
    index_file = Path(__file__).parent / "lib" / "entity_extraction" / "entity_index.json"
    
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def print_entity_index_summary():
    """Print a summary of the entity index for menu-style selection"""
    index_data = load_entity_index()
    
    if not index_data:
        print("📊 No entity index found - process some files first to create the index")
        return
    
    print("📊 Entity Index Summary")
    print("=" * 50)
    print(f"📁 Total processed files: {index_data['total_processed_files']}")
    print(f"🔍 Total extracted entities: {index_data['total_extracted_entities']}")
    print(f"✅ Total matched entities: {index_data['total_matched_entities']}")
    print(f"🆕 Total created entities: {index_data['total_created_entities']}")
    print(f"📅 Last updated: {index_data['last_updated']}")
    
    print("\n📋 Entity Types Summary:")
    for entity_type, stats in index_data['entity_summary'].items():
        if stats['extracted'] > 0:
            print(f"  {entity_type}: {stats['extracted']} extracted, {stats['matched']} matched, {stats['created']} created")
    
    print(f"\n📄 Recent Files (last {len(index_data['processed_files'])}):")
    for i, file_info in enumerate(index_data['processed_files'][-5:], 1):
        print(f"  {i}. {file_info['document_id']} - {file_info['statistics']['total_entities']} entities ({file_info['processed_date'][:10]})")

def print_recent_entities_by_type(entity_type: str = None):
    """Print recent entities for a specific type or all types"""
    index_data = load_entity_index()
    
    if not index_data:
        print("📊 No entity index found")
        return
    
    if entity_type:
        if entity_type in index_data['recent_entities']:
            entities = index_data['recent_entities'][entity_type]
            print(f"🔍 Recent {entity_type}: {', '.join(entities[:10])}")
        else:
            print(f"❌ Entity type '{entity_type}' not found")
    else:
        print("🔍 Recent Entities by Type:")
        for etype, entities in index_data['recent_entities'].items():
            if entities:
                print(f"  {etype}: {', '.join(entities[:5])}")
                if len(entities) > 5:
                    print(f"    ... and {len(entities) - 5} more")

def process_document_entities(doc_id: str, interactive: bool = False) -> bool:
    """Process entities for a specific document"""
    state_manager = get_state_manager()
    
    # Get document info
    index = state_manager.load_index()
    doc = index.get("documents", {}).get(doc_id)
    
    if not doc:
        print(f"❌ Document {doc_id} not found")
        return False
    
    print(f"📄 Processing entities for: {doc['title']}")
    
    # Get file paths
    file_paths = state_manager.get_files_for_processing(doc_id)
    summary_file = file_paths.get('summary_path') or file_paths.get('summary_file')
    
    if not summary_file:
        print(f"❌ No summary file found for {doc_id}")
        return False
    
    if not os.path.exists(summary_file):
        print(f"❌ Summary file does not exist: {summary_file}")
        return False
    
    print(f"📝 Using summary file: {summary_file}")
    
    try:
        # Process entities
        entity_results = process_summary_file_interactive(summary_file, doc_id, interactive=interactive)
        
        # Update state
        if entity_results.get('status') == 'completed':
            state_manager.update_processing_status(doc_id, 'entity_processed', True)
            
            total_entities = entity_results.get('total_entities', 0)
            total_matches = entity_results.get('total_matches', 0)
            print(f"✅ Entity processing complete!")
            print(f"   Extracted: {total_entities} entities")
            print(f"   Found: {total_matches} Xata matches")
            return True
        else:
            print(f"❌ Entity processing failed: {entity_results.get('status', 'unknown')}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing entities: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Process entities for documents")
    parser.add_argument("--latest", action="store_true", help="Process the latest document")
    parser.add_argument("--all", action="store_true", help="Process all incomplete documents")
    parser.add_argument("--doc-id", help="Process specific document ID")
    parser.add_argument("--interactive", action="store_true", help="Use interactive mode")
    parser.add_argument("--status", action="store_true", help="Show processing status summary")
    
    # New entity index options
    parser.add_argument("--index", action="store_true", help="Show entity index summary (menu)")
    parser.add_argument("--entities", help="Show recent entities by type (personnel, organizations, etc.)")
    parser.add_argument("--recent", action="store_true", help="Show all recent entities by type")
    
    args = parser.parse_args()
    
    state_manager = get_state_manager()
    
    if args.status:
        state_manager.print_status_summary()
        return
    
    # Handle entity index options
    if args.index:
        print_entity_index_summary()
        return
    
    if args.recent:
        print_recent_entities_by_type()
        return
    
    if args.entities:
        print_recent_entities_by_type(args.entities)
        return
    
    if args.latest:
        # Process latest document
        latest_doc = state_manager.get_latest_document()
        if latest_doc:
            doc_id = latest_doc['id']
            print(f"🎯 Processing latest document: {doc_id}")
            success = process_document_entities(doc_id, args.interactive)
            if success:
                print(f"✅ Latest document processed successfully")
            else:
                print(f"❌ Failed to process latest document")
        else:
            print("❌ No documents found")
    
    elif args.all:
        # Process all incomplete documents
        incomplete_docs = state_manager.get_incomplete_documents('entity_processed')
        print(f"🔄 Found {len(incomplete_docs)} documents needing entity processing")
        
        success_count = 0
        for doc in incomplete_docs:
            doc_id = doc['id']
            print(f"\n📄 Processing {doc_id}: {doc['title'][:50]}...")
            
            if process_document_entities(doc_id, interactive=False):
                success_count += 1
            
        print(f"\n✅ Processed {success_count}/{len(incomplete_docs)} documents successfully")
    
    elif args.doc_id:
        # Process specific document
        doc_id = args.doc_id
        print(f"🎯 Processing document: {doc_id}")
        success = process_document_entities(doc_id, args.interactive)
        if success:
            print(f"✅ Document {doc_id} processed successfully")
        else:
            print(f"❌ Failed to process document {doc_id}")
    
    else:
        # Show help and status
        parser.print_help()
        print("\n" + "="*60)
        print("📊 Entity Index Status:")
        print_entity_index_summary()
        print("\n" + "="*60)
        print("📋 Processing Status:")
        state_manager.print_status_summary()

if __name__ == "__main__":
    main()