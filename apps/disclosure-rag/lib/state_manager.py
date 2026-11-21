#!/usr/bin/env python3
"""
State Management for Disclosure RAG Processing Pipeline
Tracks processing status and enables selective reprocessing
Date: June 25, 2025
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)

class ProcessingStateManager:
    """Manages processing state for documents in the knowledge base"""
    
    def __init__(self, kb_path: Optional[str] = None):
        self.kb_path = Path(kb_path or os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
            "packages", "knowledge-base"
        ))
        self.index_path = self.kb_path / "metadata" / "index.json"
    
    def load_index(self) -> Dict[str, Any]:
        """Load the knowledge base index"""
        try:
            with open(self.index_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load index: {e}")
            return {"documents": {}, "tags": {}}
    
    def save_index(self, index: Dict[str, Any]) -> None:
        """Save the knowledge base index"""
        try:
            index["last_updated"] = datetime.now().isoformat()
            with open(self.index_path, 'w', encoding='utf-8') as f:
                json.dump(index, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Failed to save index: {e}")
    
    def get_processing_status(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get processing status for a document"""
        index = self.load_index()
        doc = index.get("documents", {}).get(doc_id)
        if doc:
            return doc.get("metadata", {}).get("processing_status", {})
        return None
    
    def update_processing_status(self, doc_id: str, step: str, status: bool = True) -> None:
        """Update processing status for a specific step"""
        index = self.load_index()
        if doc_id in index.get("documents", {}):
            metadata = index["documents"][doc_id].get("metadata", {})
            if "processing_status" not in metadata:
                metadata["processing_status"] = {}
            
            metadata["processing_status"][step] = status
            metadata["processing_status"]["last_step"] = step
            metadata["processing_status"]["last_updated"] = datetime.now().isoformat()
            
            index["documents"][doc_id]["metadata"] = metadata
            self.save_index(index)
            logger.info(f"Updated {doc_id} status: {step} = {status}")
    
    def get_latest_document(self) -> Optional[Dict[str, Any]]:
        """Get the most recently processed document"""
        index = self.load_index()
        documents = index.get("documents", {})
        
        latest_doc = None
        latest_time = None
        
        for doc_id, doc_data in documents.items():
            created_at = doc_data.get("created_at")
            if created_at:
                if latest_time is None or created_at > latest_time:
                    latest_time = created_at
                    latest_doc = {"id": doc_id, **doc_data}
        
        return latest_doc
    
    def get_incomplete_documents(self, step: str = None) -> List[Dict[str, Any]]:
        """Get documents that haven't completed a specific processing step"""
        index = self.load_index()
        documents = index.get("documents", {})
        incomplete = []
        
        for doc_id, doc_data in documents.items():
            processing_status = doc_data.get("metadata", {}).get("processing_status", {})
            
            if step:
                # Check specific step
                if not processing_status.get(step, False):
                    incomplete.append({"id": doc_id, **doc_data})
            else:
                # Check if any required step is incomplete
                required_steps = ["kb_indexed", "entity_processed"]
                if any(not processing_status.get(s, False) for s in required_steps):
                    incomplete.append({"id": doc_id, **doc_data})
        
        return incomplete
    
    def get_files_for_processing(self, doc_id: str) -> Dict[str, str]:
        """Get file paths for a document that need processing"""
        index = self.load_index()
        doc = index.get("documents", {}).get(doc_id)
        
        if not doc:
            return {}
        
        file_paths = doc.get("metadata", {}).get("file_paths", {})
        
        # Verify files exist
        verified_paths = {}
        for key, path in file_paths.items():
            if os.path.exists(path):
                verified_paths[key] = path
            else:
                logger.warning(f"File not found: {path}")
        
        return verified_paths
    
    def should_process_entities(self, doc_id: str) -> bool:
        """Check if a document needs entity processing"""
        status = self.get_processing_status(doc_id)
        if not status:
            return False
        
        # Process if not done yet or if files were updated after last processing
        return not status.get("entity_processed", False)
    
    def print_status_summary(self) -> None:
        """Print a summary of processing status"""
        index = self.load_index()
        documents = index.get("documents", {})
        
        print(f"\n📊 Knowledge Base Processing Status Summary")
        print(f"{'='*60}")
        print(f"Total documents: {len(documents)}")
        
        # Count by status
        status_counts = {
            "kb_indexed": 0,
            "entity_processed": 0,
            "vector_synced": 0
        }
        
        latest_docs = []
        for doc_id, doc_data in documents.items():
            processing_status = doc_data.get("metadata", {}).get("processing_status", {})
            
            for step in status_counts:
                if processing_status.get(step, False):
                    status_counts[step] += 1
            
            # Collect recent docs
            created_at = doc_data.get("created_at", "")
            if created_at.startswith("2025-06"):  # This month
                latest_docs.append({
                    "id": doc_id,
                    "title": doc_data.get("title", "Unknown"),
                    "created": created_at,
                    "status": processing_status
                })
        
        print(f"\nProcessing Step Completion:")
        for step, count in status_counts.items():
            percentage = (count / len(documents)) * 100 if documents else 0
            print(f"  {step}: {count}/{len(documents)} ({percentage:.1f}%)")
        
        print(f"\nRecent Documents (June 2025):")
        latest_docs.sort(key=lambda x: x["created"], reverse=True)
        for doc in latest_docs[:5]:
            status = doc["status"]
            last_step = status.get("last_step", "none")
            entity_done = "✅" if status.get("entity_processed", False) else "❌"
            print(f"  {doc['id'][:12]}: {doc['title'][:30]:<30} | Last: {last_step:<15} | Entities: {entity_done}")


# Global instance
state_manager = ProcessingStateManager()

def get_state_manager() -> ProcessingStateManager:
    """Get the global state manager instance"""
    return state_manager