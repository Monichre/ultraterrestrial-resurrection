#!/usr/bin/env python3
"""
Sync local disclosure-rag knowledge base to Upstash Search
Uses the new Upstash Search service for better document handling
Date: June 20, 2025
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging
from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD, Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UpstashSearchSyncer:
    """Sync local knowledge base to Upstash Search for cloud access"""
    
    def __init__(self, url: str, token: str, kb_path: str = None):
        self.kb_crud = KnowledgeBaseCRUD(kb_path)
        self.base_url = url.rstrip('/')
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        self.sync_state_file = Path(self.kb_crud.metadata_path) / "upstash_search_sync_state.json"
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
    
    def upsert_document(self, doc: Document) -> bool:
        """Upsert a single document to Upstash Search"""
        try:
            # Prepare document for Upstash Search
            search_doc = {
                "id": doc.id,
                "data": doc.content,  # The actual content to be searched
                "metadata": {
                    "title": doc.title,
                    "source": doc.source,
                    "doc_type": doc.doc_type,
                    "created_at": doc.created_at,
                    "updated_at": doc.updated_at,
                    "tags": doc.tags,
                    **doc.metadata  # Include any additional metadata
                }
            }
            
            # Upsert to Upstash Search
            response = requests.post(
                f"{self.base_url}/upsert",
                headers=self.headers,
                json=search_doc
            )
            
            if response.status_code == 200:
                # Update sync state
                self.sync_state["synced_documents"][doc.id] = {
                    "updated_at": doc.updated_at,
                    "synced_at": datetime.now().isoformat()
                }
                logger.info(f"Synced document {doc.id}: {doc.title}")
                return True
            else:
                logger.error(f"Failed to sync {doc.id}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error syncing document {doc.id}: {e}")
            return False
    
    def bulk_upsert(self, documents: List[Document]) -> Dict[str, Any]:
        """Bulk upsert multiple documents"""
        try:
            # Prepare documents for bulk upsert
            search_docs = []
            for doc in documents:
                search_docs.append({
                    "id": doc.id,
                    "data": doc.content,
                    "metadata": {
                        "title": doc.title,
                        "source": doc.source,
                        "doc_type": doc.doc_type,
                        "created_at": doc.created_at,
                        "updated_at": doc.updated_at,
                        "tags": doc.tags,
                        **doc.metadata
                    }
                })
            
            # Send bulk upsert request
            response = requests.post(
                f"{self.base_url}/upsert-bulk",
                headers=self.headers,
                json=search_docs
            )
            
            if response.status_code == 200:
                # Update sync state for all documents
                for doc in documents:
                    self.sync_state["synced_documents"][doc.id] = {
                        "updated_at": doc.updated_at,
                        "synced_at": datetime.now().isoformat()
                    }
                
                return {
                    "success": True,
                    "count": len(documents)
                }
            else:
                return {
                    "success": False,
                    "error": f"{response.status_code} - {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Error in bulk upsert: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def sync_all(self, force: bool = False, batch_size: int = 50) -> Dict[str, Any]:
        """Sync all documents to Upstash Search"""
        logger.info("Starting full knowledge base sync to Upstash Search...")
        
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
        
        # Filter documents that need syncing
        docs_to_sync = []
        for doc in all_docs:
            if not force:
                doc_sync_info = self.sync_state["synced_documents"].get(doc.id, {})
                if doc_sync_info.get("updated_at") == doc.updated_at:
                    results["skipped"] += 1
                    continue
            docs_to_sync.append(doc)
        
        # Sync in batches
        for i in range(0, len(docs_to_sync), batch_size):
            batch = docs_to_sync[i:i + batch_size]
            logger.info(f"Syncing batch {i//batch_size + 1} ({len(batch)} documents)...")
            
            result = self.bulk_upsert(batch)
            if result["success"]:
                results["synced"] += result["count"]
            else:
                results["failed"] += len(batch)
                results["errors"].append(result["error"])
        
        # Update sync state
        self.sync_state["last_sync"] = datetime.now().isoformat()
        self.sync_state["total_synced"] = len(self.sync_state["synced_documents"])
        self._save_sync_state()
        
        logger.info(f"Sync complete: {results}")
        return results
    
    def search(self, query: str, limit: int = 10, filter: Optional[Dict] = None) -> Dict[str, Any]:
        """Search documents in Upstash Search"""
        try:
            payload = {
                "q": query,
                "topK": limit
            }
            
            if filter:
                payload["filter"] = filter
            
            response = requests.post(
                f"{self.base_url}/query",
                headers=self.headers,
                json=payload
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "results": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"{response.status_code} - {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Error searching: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document from Upstash Search"""
        try:
            response = requests.post(
                f"{self.base_url}/delete",
                headers=self.headers,
                json={"id": doc_id}
            )
            
            if response.status_code == 200:
                # Remove from sync state
                if doc_id in self.sync_state["synced_documents"]:
                    del self.sync_state["synced_documents"][doc_id]
                    self._save_sync_state()
                return True
            else:
                logger.error(f"Failed to delete {doc_id}: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error deleting document {doc_id}: {e}")
            return False
    
    def get_info(self) -> Dict[str, Any]:
        """Get information about the search index"""
        try:
            response = requests.get(
                f"{self.base_url}/info",
                headers=self.headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"{response.status_code} - {response.text}"}
                
        except Exception as e:
            logger.error(f"Error getting info: {e}")
            return {"error": str(e)}
    
    def verify_sync(self, sample_queries: List[str] = None) -> Dict[str, Any]:
        """Verify sync by running sample searches"""
        logger.info("Verifying sync with Upstash Search...")
        
        if not sample_queries:
            sample_queries = ["UFO", "disclosure", "witness", "Pentagon", "craft"]
        
        results = {
            "info": self.get_info(),
            "queries": []
        }
        
        for query in sample_queries:
            search_result = self.search(query, limit=3)
            results["queries"].append({
                "query": query,
                "success": search_result.get("success", False),
                "count": len(search_result.get("results", [])) if search_result.get("success") else 0
            })
        
        return results

def main():
    """Main sync function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Sync knowledge base to Upstash Search")
    parser.add_argument("--url", required=True, help="Upstash Search URL")
    parser.add_argument("--token", required=True, help="Upstash Search token")
    parser.add_argument("--force", action="store_true", help="Force sync all documents")
    parser.add_argument("--verify", action="store_true", help="Verify sync after completion")
    parser.add_argument("--search", help="Test search with a query")
    parser.add_argument("--info", action="store_true", help="Get search index info")
    args = parser.parse_args()
    
    syncer = UpstashSearchSyncer(args.url, args.token)
    
    if args.info:
        info = syncer.get_info()
        print(json.dumps(info, indent=2))
        return
    
    if args.search:
        results = syncer.search(args.search)
        print(json.dumps(results, indent=2))
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
            print(f"   - {error}")
    
    # Verify if requested
    if args.verify:
        print(f"\n🔍 Verifying sync...")
        verify_results = syncer.verify_sync()
        print(f"\n📊 Index Info:")
        print(json.dumps(verify_results["info"], indent=2))
        print(f"\n🔎 Sample Searches:")
        for query_result in verify_results["queries"]:
            print(f"   '{query_result['query']}': {query_result['count']} results")
    
    print(f"\n✅ Documents are now searchable in Upstash Search!")

if __name__ == "__main__":
    main()