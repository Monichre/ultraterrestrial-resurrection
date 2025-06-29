#!/usr/bin/env python3
"""
Entity Processing Utility
Process entities for documents that haven't been processed yet
Usage: python process_entities.py [--latest] [--all] [--doc-id DOC_ID]
Date: June 25, 2025
"""

import sys
import argparse
import os
from pathlib import Path

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from lib.state_manager import get_state_manager
from lib.interactive_entity_processor import process_summary_file_interactive

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
    
    args = parser.parse_args()
    
    state_manager = get_state_manager()
    
    if args.status:
        state_manager.print_status_summary()
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
        print("\n")
        state_manager.print_status_summary()

if __name__ == "__main__":
    main()