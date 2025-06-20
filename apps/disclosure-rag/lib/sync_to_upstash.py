#!/usr/bin/env python3
"""
Sync local disclosure-rag knowledge base to Upstash Vector DB
This enables the Next.js frontend to access documents without depending on local system
Date: June 20, 2025
"""

import os
import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
import logging

from upstash_vector import Index, Vector
from knowledge_base_crud import KnowledgeBaseCRUD, Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Upstash Vector Index
index = Index(
    url="https://known-bobcat-28794-us1-vector.upstash.io",
    token="ABYFMGtub3duLWJvYmNhdC0yODc5NC11czFhZG1pbllUZ3daREJqT1RRdFpUTmtZUzAwWTJGaExUZzNNelV0WlRGaE9USmxZelJpWXpnMg=="
)

class KnowledgeBaseSyncer:
    """Sync local knowledge base to Upstash for cloud access"""
    
    def __init__(self, kb_path: str = None):
        self.kb_crud = KnowledgeBaseCRUD(kb_path)
        self.sync_state_file = Path(self.kb_crud.metadata_path) / "upstash_sync_state.json"
        self.sync_state = self._load_sync_state()
        
    def _load_sync_state(self) -> Dict[str, Any]:
        """Load sync state from disk"""
        if self.sync_state_file.exists():
            with open(self.sync_state_file, 'r') as f:
                return json.load(f)
        return {
            "last_sync": None,
            "synced_documents": {},
            "total_synced": 0
        }
    
    def _save_sync_state(self):
        """Save sync state to disk"""
        with open(self.sync_state_file, 'w') as f:
            json.dump(self.sync_state, f, indent=2)
    
    def _generate_vector_id(self, doc_id: str, suffix: str = "") -> str:
        """Generate consistent vector ID from document ID"""
        return f"kb_{doc_id}{suffix}"
    
    def sync_document(self, doc: Document) -> bool:
        """Sync a single document to Upstash"""
        try:
            # Check if document needs syncing
            doc_sync_info = self.sync_state["synced_documents"].get(doc.id, {})
            if doc_sync_info.get("updated_at") == doc.updated_at:
                logger.info(f"Document {doc.id} already up to date")
                return True
            
            # Prepare metadata for Upstash
            metadata = {
                "doc_id": doc.id,
                "title": doc.title,
                "source": doc.source,
                "doc_type": doc.doc_type,
                "created_at": doc.created_at,
                "updated_at": doc.updated_at,
                "tags": json.dumps(doc.tags),  # Upstash requires strings
                "metadata": json.dumps(doc.metadata),
                "content_length": len(doc.content)
            }
            
            # Create vectors for both full content and title
            vectors = [
                # Full content vector
                Vector(
                    id=self._generate_vector_id(doc.id, "_content"),
                    data=doc.content,
                    metadata={**metadata, "vector_type": "content"}
                ),
                # Title vector for better search
                Vector(
                    id=self._generate_vector_id(doc.id, "_title"),
                    data=f"{doc.title}\n{doc.source}\n{' '.join(doc.tags)}",
                    metadata={**metadata, "vector_type": "title"}
                )
            ]
            
            # If content is long, create a summary vector
            if len(doc.content) > 1000:
                summary = doc.content[:500] + "..." + doc.content[-500:]
                vectors.append(
                    Vector(
                        id=self._generate_vector_id(doc.id, "_summary"),
                        data=summary,
                        metadata={**metadata, "vector_type": "summary"}
                    )
                )
            
            # Upload to Upstash
            response = index.upsert(vectors=vectors)
            
            # Update sync state
            self.sync_state["synced_documents"][doc.id] = {
                "updated_at": doc.updated_at,
                "synced_at": datetime.now().isoformat(),
                "vector_ids": [v.id for v in vectors]
            }
            
            logger.info(f"Synced document {doc.id}: {doc.title}")
            return True
            
        except Exception as e:
            logger.error(f"Error syncing document {doc.id}: {e}")
            return False
    
    def sync_all(self, force: bool = False) -> Dict[str, Any]:
        """Sync all documents to Upstash"""
        logger.info("Starting full knowledge base sync to Upstash...")
        
        results = {
            "total_documents": 0,
            "synced": 0,
            "failed": 0,
            "skipped": 0,
            "errors": []
        }
        
        # Get all documents
        all_docs = []
        for doc_type in ["case_file", "transcript", "article", "research"]:
            docs = self.kb_crud.list_documents(doc_type=doc_type, limit=1000)
            for doc_info in docs:
                doc = self.kb_crud.get_document(doc_info["id"])
                if doc:
                    all_docs.append(doc)
        
        results["total_documents"] = len(all_docs)
        
        # Sync each document
        for doc in all_docs:
            try:
                # Check if force sync or document needs update
                if not force:
                    doc_sync_info = self.sync_state["synced_documents"].get(doc.id, {})
                    if doc_sync_info.get("updated_at") == doc.updated_at:
                        results["skipped"] += 1
                        continue
                
                if self.sync_document(doc):
                    results["synced"] += 1
                else:
                    results["failed"] += 1
                    
            except Exception as e:
                results["failed"] += 1
                results["errors"].append({
                    "doc_id": doc.id,
                    "error": str(e)
                })
        
        # Update sync state
        self.sync_state["last_sync"] = datetime.now().isoformat()
        self.sync_state["total_synced"] = results["synced"] + results["skipped"]
        self._save_sync_state()
        
        logger.info(f"Sync complete: {results}")
        return results
    
    def verify_sync(self, sample_size: int = 5) -> Dict[str, Any]:
        """Verify sync by querying some documents"""
        logger.info("Verifying sync with Upstash...")
        
        results = {
            "verified": 0,
            "failed": 0,
            "samples": []
        }
        
        # Get random sample of synced documents
        synced_ids = list(self.sync_state["synced_documents"].keys())[:sample_size]
        
        for doc_id in synced_ids:
            try:
                # Query by document ID
                vector_id = self._generate_vector_id(doc_id, "_content")
                response = index.fetch([vector_id])
                
                if response and len(response) > 0:
                    results["verified"] += 1
                    results["samples"].append({
                        "doc_id": doc_id,
                        "vector_id": vector_id,
                        "found": True
                    })
                else:
                    results["failed"] += 1
                    results["samples"].append({
                        "doc_id": doc_id,
                        "vector_id": vector_id,
                        "found": False
                    })
                    
            except Exception as e:
                results["failed"] += 1
                logger.error(f"Error verifying {doc_id}: {e}")
        
        return results
    
    def get_sync_stats(self) -> Dict[str, Any]:
        """Get sync statistics"""
        kb_stats = self.kb_crud.get_statistics()
        
        return {
            "knowledge_base": kb_stats,
            "sync_state": {
                "last_sync": self.sync_state["last_sync"],
                "total_synced": self.sync_state["total_synced"],
                "documents_tracked": len(self.sync_state["synced_documents"])
            }
        }

def main():
    """Main sync function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Sync knowledge base to Upstash")
    parser.add_argument("--force", action="store_true", help="Force sync all documents")
    parser.add_argument("--verify", action="store_true", help="Verify sync after completion")
    parser.add_argument("--stats", action="store_true", help="Show sync statistics")
    args = parser.parse_args()
    
    syncer = KnowledgeBaseSyncer()
    
    if args.stats:
        stats = syncer.get_sync_stats()
        print(json.dumps(stats, indent=2))
        return
    
    # Run sync
    results = syncer.sync_all(force=args.force)
    
    print(f"\n📊 Sync Results:")
    print(f"   Total Documents: {results['total_documents']}")
    print(f"   Synced: {results['synced']}")
    print(f"   Skipped: {results['skipped']}")
    print(f"   Failed: {results['failed']}")
    
    if results['errors']:
        print(f"\n❌ Errors:")
        for error in results['errors']:
            print(f"   - {error['doc_id']}: {error['error']}")
    
    # Verify if requested
    if args.verify:
        print(f"\n🔍 Verifying sync...")
        verify_results = syncer.verify_sync()
        print(f"   Verified: {verify_results['verified']}")
        print(f"   Failed: {verify_results['failed']}")
    
    print(f"\n✅ Sync complete! Documents are now available in Upstash for frontend access.")

if __name__ == "__main__":
    main()