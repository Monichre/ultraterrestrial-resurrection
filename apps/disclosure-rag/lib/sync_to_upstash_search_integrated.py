#!/usr/bin/env python3
"""
Integrated Upstash Search sync that works WITH existing QStash/Vector workflow
This adds document browsing capabilities without disrupting existing processing
Date: June 20, 2025
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging
from .knowledge_base_crud import KnowledgeBaseCRUD, Document

# Configure logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import upstash queue if available
try:
    from upstash.queue import add_processed_content_to_queue  # Existing workflow
    UPSTASH_QUEUE_AVAILABLE = True
except ImportError:
    logger.warning("upstash.queue not available - queue functionality disabled")
    UPSTASH_QUEUE_AVAILABLE = False
    
    def add_processed_content_to_queue(*args, **kwargs):
        logger.warning("Queue functionality not available - upstash package not installed")
        return None


class IntegratedUpstashSyncer:
    """Sync to Upstash Search while preserving existing QStash/Vector workflow"""

    def __init__(self, search_url: str, search_token: str, kb_path: str = None):
        self.kb_crud = KnowledgeBaseCRUD(kb_path)
        self.search_url = search_url.rstrip('/')
        self.search_headers = {
            "Authorization": f"Bearer {search_token}",
            "Content-Type": "application/json"
        }
        self.sync_state_file = Path(
            self.kb_crud.metadata_path) / "upstash_search_sync_state.json"
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

    def sync_document_to_search(self, doc: Document) -> bool:
        """Sync a single document to Upstash Search (for browsing)"""
        try:
            # Check if document needs syncing
            doc_sync_info = self.sync_state["synced_documents"].get(doc.id, {})
            if doc_sync_info.get("updated_at") == doc.updated_at:
                logger.debug(f"Document {doc.id} already up to date in Search")
                return True

            # Prepare document for Upstash Search (browsing/filtering)
            search_doc = {
                # Prefix to distinguish from vector IDs
                "id": f"search_{doc.id}",
                "data": doc.content,
                "metadata": {
                    "original_doc_id": doc.id,
                    "title": doc.title,
                    "source": doc.source,
                    "doc_type": doc.doc_type,
                    "created_at": doc.created_at,
                    "updated_at": doc.updated_at,
                    "tags": doc.tags,
                    **doc.metadata
                }
            }

            # Upsert to Upstash Search
            response = requests.post(
                f"{self.search_url}/upsert",
                headers=self.search_headers,
                json=search_doc
            )

            if response.status_code == 200:
                # Update sync state
                self.sync_state["synced_documents"][doc.id] = {
                    "updated_at": doc.updated_at,
                    "synced_at": datetime.now().isoformat(),
                    "search_id": search_doc["id"]
                }
                logger.info(f"Synced to Search: {doc.id} - {doc.title}")
                return True
            else:
                logger.error(
                    f"Failed to sync to Search {doc.id}: {response.status_code}")
                return False

        except Exception as e:
            logger.error(f"Error syncing document {doc.id} to Search: {e}")
            return False

    def process_and_sync_document(self, doc: Document, trigger_existing_workflow: bool = True) -> Dict[str, Any]:
        """
        Process document through BOTH existing workflow AND new Search sync
        This preserves your existing QStash/Vector processing while adding Search
        """
        results = {
            "doc_id": doc.id,
            "search_sync": False,
            "existing_workflow": False,
            "errors": []
        }

        # 1. Sync to Upstash Search (for frontend browsing)
        try:
            results["search_sync"] = self.sync_document_to_search(doc)
        except Exception as e:
            results["errors"].append(f"Search sync error: {e}")

        # 2. Trigger existing QStash/Vector workflow if requested
        if trigger_existing_workflow:
            try:
                # Create temporary files for existing workflow
                temp_dir = Path(self.kb_crud.metadata_path) / "temp_sync"
                temp_dir.mkdir(exist_ok=True)

                content_file = temp_dir / f"{doc.id}_content.md"
                metadata_file = temp_dir / f"{doc.id}_metadata.json"

                # Write content and metadata
                with open(content_file, 'w', encoding='utf-8') as f:
                    f.write(doc.content)

                with open(metadata_file, 'w', encoding='utf-8') as f:
                    json.dump({
                        "title": doc.title,
                        "source": doc.source,
                        "doc_type": doc.doc_type,
                        "tags": doc.tags,
                        **doc.metadata
                    }, f, indent=2)

                # Trigger existing workflow (QStash + Vector)
                queue_result = add_processed_content_to_queue(
                    metadata=str(metadata_file),
                    summary_file=str(content_file),
                    full_content_file=str(content_file)
                )

                results["existing_workflow"] = queue_result.get(
                    "vector_upload", {}).get("success", False)
                results["qstash_response"] = queue_result.get(
                    "qstash_response")

                # Cleanup temp files
                content_file.unlink(missing_ok=True)
                metadata_file.unlink(missing_ok=True)

            except Exception as e:
                results["errors"].append(f"Existing workflow error: {e}")

        return results

    def sync_new_documents_only(self, trigger_existing_workflow: bool = True) -> Dict[str, Any]:
        """Sync only documents that haven't been processed yet"""
        logger.info(
            "Syncing new documents to both Search and existing workflow...")

        results = {
            "total_documents": 0,
            "new_documents": 0,
            "search_synced": 0,
            "workflow_processed": 0,
            "failed": 0,
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

        # Process only new/updated documents
        for doc in all_docs:
            doc_sync_info = self.sync_state["synced_documents"].get(doc.id, {})
            if doc_sync_info.get("updated_at") == doc.updated_at:
                continue  # Skip already synced

            results["new_documents"] += 1

            # Process through both systems
            doc_result = self.process_and_sync_document(
                doc, trigger_existing_workflow)

            if doc_result["search_sync"]:
                results["search_synced"] += 1

            if doc_result["existing_workflow"]:
                results["workflow_processed"] += 1

            if doc_result["errors"]:
                results["failed"] += 1
                results["errors"].extend(doc_result["errors"])

        # Update sync state
        self.sync_state["last_sync"] = datetime.now().isoformat()
        self._save_sync_state()

        logger.info(f"Sync complete: {results}")
        return results

    def search_documents(self, query: str, limit: int = 10, filter: Optional[Dict] = None) -> Dict[str, Any]:
        """Search documents in Upstash Search"""
        try:
            payload = {
                "q": query,
                "topK": limit
            }

            if filter:
                payload["filter"] = filter

            response = requests.post(
                f"{self.search_url}/query",
                headers=self.search_headers,
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


def main():
    """Main function that preserves existing workflow"""
    import argparse

    parser = argparse.ArgumentParser(
        description="Integrated Upstash sync (Search + existing workflow)")
    parser.add_argument("--search-url", required=True,
                        help="Upstash Search URL")
    parser.add_argument("--search-token", required=True,
                        help="Upstash Search token")
    parser.add_argument("--new-only", action="store_true",
                        help="Only sync new/updated documents")
    parser.add_argument("--skip-workflow", action="store_true",
                        help="Skip existing QStash/Vector workflow")
    parser.add_argument("--search", help="Test search with a query")
    args = parser.parse_args()

    syncer = IntegratedUpstashSyncer(args.search_url, args.search_token)

    if args.search:
        results = syncer.search_documents(args.search)
        print(json.dumps(results, indent=2))
        return

    # Run sync
    trigger_workflow = not args.skip_workflow
    results = syncer.sync_new_documents_only(
        trigger_existing_workflow=trigger_workflow)

    print(f"\n📊 Integrated Sync Results:")
    print(f"   Total Documents: {results['total_documents']}")
    print(f"   New Documents: {results['new_documents']}")
    print(f"   Search Synced: {results['search_synced']}")
    print(f"   Workflow Processed: {results['workflow_processed']}")
    print(f"   Failed: {results['failed']}")

    if results['errors']:
        print(f"\n❌ Errors:")
        for error in results['errors']:
            print(f"   - {error}")

    print(f"\n✅ Both systems updated! Search enabled for frontend, existing workflow preserved.")


if __name__ == "__main__":
    main()
