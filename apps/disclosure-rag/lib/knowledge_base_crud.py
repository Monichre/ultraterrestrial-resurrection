"""
Enhanced Knowledge Base CRUD Operations
Provides Create, Read, Update, Delete functionality for the knowledge base
"""

import os
import json
import shutil
import logging
import fcntl
from contextlib import contextmanager
from pathlib import Path
from typing import List, Optional, Dict, Any, Union, Tuple
from datetime import datetime
import hashlib
from dataclasses import dataclass, asdict

logger = logging.getLogger(__name__)


@dataclass
class Document:
    """Document model for the knowledge base"""
    id: str
    title: str
    content: str
    source: str
    doc_type: str  # 'case_file', 'transcript', 'article', 'research'
    created_at: str
    updated_at: str
    metadata: Dict[str, Any]
    tags: List[str]
    # Full (unabridged) content hash. `id` is only the first 12 hex chars of
    # this same hash, kept short for filenames/dir names; other systems
    # depend on that `id` scheme, so it is not changed. Default keeps
    # loading of pre-existing metadata.json records (written before this
    # field existed) backward compatible.
    content_hash: str = ""

    def to_dict(self):
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        return cls(**data)


class KnowledgeBaseCRUD:
    """Enhanced CRUD operations for the knowledge base"""

    def __init__(self, kb_path: Optional[str] = None):
        # Use the packages/knowledge-base workspace, not a local knowledge-base directory
        self.kb_path = Path(kb_path or os.path.join(
            os.path.dirname(os.path.dirname(
                os.path.dirname(os.path.dirname(__file__)))),
            "packages", "knowledge-base"
        ))
        self.metadata_path = self.kb_path / "metadata"
        self.sources_path = self.kb_path / "sources"
        self.files_path = self.sources_path / "files"
        self.transcripts_path = self.sources_path / "transcripts"
        self.articles_path = self.sources_path / "web"
        self.research_path = self.kb_path / "research"

        # Create directories if they don't exist
        for path in [self.metadata_path, self.sources_path, self.files_path,
                     self.transcripts_path, self.articles_path, self.research_path]:
            path.mkdir(parents=True, exist_ok=True)

        # Initialize metadata index
        self.index_file = self.metadata_path / "index.json"
        self._init_index()

    def _init_index(self):
        """Initialize or load the document index"""
        if not self.index_file.exists():
            self.index = {"documents": {}, "tags": {}, "last_updated": ""}
            self._save_index()
        else:
            with open(self.index_file, 'r') as f:
                self.index = json.load(f)

    def _save_index(self):
        """Save the index to disk atomically.

        Writes to a temp file in the same directory then `os.replace()`s it
        onto the target, so a crash mid-write can never leave index.json
        truncated or partially written (mirrors the pattern in
        scripts/playlist_ingestion.py::save_state).
        """
        self.index["last_updated"] = datetime.now().isoformat()
        tmp_file = self.index_file.parent / f"{self.index_file.name}.tmp"
        with open(tmp_file, 'w') as f:
            json.dump(self.index, f, indent=2)
        os.replace(tmp_file, self.index_file)

    @contextmanager
    def _locked_index(self):
        """Exclusive OS-level lock spanning an index read-modify-write cycle.

        Acquires an flock() on a dedicated lock file (not index.json itself,
        so readers/writers never fight over the atomic-replace target), then
        reloads self.index from disk while holding the lock so this process
        observes any writes made by other concurrent processes/instances
        instead of trusting a possibly-stale in-memory copy. Callers should
        do all of their index reads *and* writes inside this context.

        Only the methods in this file that perform create/update/delete use
        this. lib/knowledge_base_service.py's YouTube ingest path calls
        self.kb_crud._save_index() directly without holding this lock; that
        file is owned elsewhere and out of scope here, so its writes remain
        unlocked (still atomic per-write, just not race-free end-to-end).
        """
        lock_path = self.metadata_path / "index.json.lock"
        lock_file = open(lock_path, "a+")
        try:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
            if self.index_file.exists():
                with open(self.index_file, 'r') as f:
                    self.index = json.load(f)
            else:
                self.index = {"documents": {}, "tags": {}, "last_updated": ""}
            yield self.index
        finally:
            try:
                fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)
            finally:
                lock_file.close()

    def _content_hash(self, content: str) -> str:
        """Full md5 hex digest of document content (dedup key / integrity check)."""
        return hashlib.md5(content.encode()).hexdigest()

    def _generate_id(self, content: str) -> str:
        """Generate a unique ID for a document (first 12 hex chars of its content hash)."""
        return self._content_hash(content)[:12]

    def _generate_filename(self, title: str) -> str:
        """Generate a descriptive filename from document title"""
        # Clean the title to make it filesystem-safe
        import re
        # Remove special characters and replace spaces with hyphens
        filename = re.sub(r'[^\w\s-]', '', title).strip()
        filename = re.sub(r'[-\s]+', '-', filename)
        # Limit length and ensure it's not empty
        filename = filename[:50].strip('-') or "document"
        return f"{filename.lower()}.md"

    def _generate_dir_name(self, title: str, doc_id: str) -> str:
        """Generate a meaningful directory name from document title with ID suffix for uniqueness"""
        import re
        # Clean the title to make it filesystem-safe
        dir_name = re.sub(r'[^\w\s-]', '', title).strip()
        dir_name = re.sub(r'[-\s]+', '-', dir_name)
        # Limit length and ensure it's not empty
        dir_name = dir_name[:40].strip('-') or "document"
        # Add short ID suffix for uniqueness (first 8 chars of hash)
        short_id = doc_id[:8]
        return f"{dir_name.lower()}-{short_id}"

    def _get_doc_path(self, doc_type: str, doc_id: str, filename: str, title: str = None) -> Path:
        """Get the file path for a document with date-based organization"""
        from datetime import datetime

        base_paths = {
            "file": self.files_path,
            "transcript": self.transcripts_path,
            "web": self.articles_path,
            "research": self.research_path
        }
        base_path = base_paths.get(doc_type, self.kb_path)

        # Use date-based organization: YYYY-MM-DD/meaningful-dir-name/
        date_folder = datetime.now().strftime("%Y-%m-%d")

        if title:
            # Use meaningful directory name based on title
            dir_name = self._generate_dir_name(title, doc_id)
        else:
            # Fallback to doc_id for backward compatibility
            dir_name = doc_id

        return base_path / date_folder / dir_name / filename

    # CREATE
    def create_document(self,
                        title: str,
                        content: str,
                        source: str,
                        doc_type: str,
                        metadata: Optional[Dict[str, Any]] = None,
                        tags: Optional[List[str]] = None,
                        force: bool = False) -> Document:
        """Create a new document in the knowledge base.

        `doc_id` is a content hash, so re-ingesting byte-identical content is
        expected to happen (e.g. a re-run of an ingest script) and is a
        no-op by default: the existing record is returned unchanged. Pass
        force=True to deliberately overwrite the existing record's content
        and metadata in place.

        Paths are date-stamped (YYYY-MM-DD/...), so the same content
        ingested on a later day would, without this guard, compute a new
        directory while sharing the old doc_id — silently repointing the
        index and stranding the original files with nothing referencing
        them ("orphaning"). That case is always refused and reported,
        regardless of `force`: this method never deletes or abandons a
        directory another index entry still points at. Use
        update_document() to edit a record's content in place instead.
        """
        content_hash = self._content_hash(content)
        doc_id = content_hash[:12]
        now = datetime.now().isoformat()

        with self._locked_index():
            existing_info = self.index["documents"].get(doc_id)
            existing_doc = self.get_document(doc_id) if existing_info else None

            content_filename = self._generate_filename(title)
            doc_dir = self._get_doc_path(
                doc_type, doc_id, content_filename, title).parent

            created_at = now

            if existing_info and existing_doc:
                existing_path = Path(existing_info["path"])

                if existing_path != doc_dir:
                    # Orphaning case: writing here would repoint the index
                    # entry for doc_id away from existing_path, leaving
                    # those files on disk but unreachable through the KB.
                    # Refuse unconditionally and leave everything as-is.
                    logger.warning(
                        f"Refusing to re-ingest document {doc_id} ({title!r}): "
                        f"existing record lives at {existing_path} but this "
                        f"content would now write to {doc_dir} (date-folder "
                        f"drift). This would orphan the original files. "
                        f"Returning the existing record unchanged; nothing "
                        f"at {existing_path} was touched. Use "
                        f"update_document({doc_id!r}, ...) to edit it in place."
                    )
                    return existing_doc

                if not force:
                    logger.info(
                        f"Document {doc_id} ({title!r}) already exists at "
                        f"{existing_path} — identical content, skipping "
                        f"re-ingest. Pass force=True to overwrite in place."
                    )
                    return existing_doc

                logger.info(
                    f"Overwriting existing document {doc_id} ({title!r}) at "
                    f"{existing_path} (force=True)."
                )
                # Preserve the original acquisition date; only updated_at
                # should move on a legitimate re-ingest/overwrite.
                created_at = existing_info.get("created_at", now)
            elif existing_info and not existing_doc:
                # Index points at a record whose metadata.json is missing
                # (corrupt/partial prior write) — nothing reliable to
                # preserve; recreate it fresh at the freshly computed path.
                logger.warning(
                    f"Index referenced document {doc_id} but its metadata "
                    f"file was missing under {existing_info.get('path')}; "
                    f"recreating the record."
                )

            # Create document object
            doc = Document(
                id=doc_id,
                title=title,
                content=content,
                source=source,
                doc_type=doc_type,
                created_at=created_at,
                updated_at=now,
                metadata=metadata or {},
                tags=tags or [],
                content_hash=content_hash,
            )

            # Create document directory with meaningful name
            doc_dir.mkdir(parents=True, exist_ok=True)

            # Save content with descriptive filename
            content_file = self._get_doc_path(
                doc_type, doc_id, content_filename, title)
            with open(content_file, 'w', encoding='utf-8') as f:
                f.write(content)

            # Save metadata
            meta_file = self._get_doc_path(
                doc_type, doc_id, "metadata.json", title)
            with open(meta_file, 'w', encoding='utf-8') as f:
                json.dump(doc.to_dict(), f, indent=2)

            # Update index with meaningful directory path
            date_folder = datetime.now().strftime("%Y-%m-%d")
            meaningful_dir_name = self._generate_dir_name(title, doc_id)
            self.index["documents"][doc_id] = {
                "title": title,
                "doc_type": doc_type,
                "path": str(doc_dir),
                "date_folder": date_folder,
                "meaningful_dir_name": meaningful_dir_name,
                "content_hash": content_hash,
                "created_at": created_at,
                "updated_at": now,
                "tags": tags or []
            }

            # Update tag index (deduped — re-ingests must not pile up
            # repeated doc_id entries under the same tag)
            for tag in (tags or []):
                tag_docs = self.index["tags"].setdefault(tag, [])
                if doc_id not in tag_docs:
                    tag_docs.append(doc_id)

            self._save_index()

        logger.info(f"Created document: {doc_id} - {title}")
        return doc

    # READ
    def get_document(self, doc_id: str) -> Optional[Document]:
        """Retrieve a document by ID"""
        if doc_id not in self.index["documents"]:
            return None

        doc_info = self.index["documents"][doc_id]
        meta_file = Path(doc_info["path"]) / "metadata.json"

        if not meta_file.exists():
            logger.error(f"Metadata file not found for document {doc_id}")
            return None

        with open(meta_file, 'r', encoding='utf-8') as f:
            doc_data = json.load(f)

        return Document.from_dict(doc_data)

    def list_documents(self,
                       doc_type: Optional[str] = None,
                       tags: Optional[List[str]] = None,
                       limit: int = 100,
                       offset: int = 0) -> List[Dict[str, Any]]:
        """List documents with optional filtering"""
        docs = []

        for doc_id, doc_info in self.index["documents"].items():
            # Filter by type
            if doc_type and doc_info["doc_type"] != doc_type:
                continue

            # Filter by tags
            if tags and not any(tag in doc_info["tags"] for tag in tags):
                continue

            docs.append({
                "id": doc_id,
                "title": doc_info["title"],
                "doc_type": doc_info["doc_type"],
                "created_at": doc_info["created_at"],
                "updated_at": doc_info["updated_at"],
                "tags": doc_info["tags"]
            })

        # Sort by updated_at descending
        docs.sort(key=lambda x: x["updated_at"], reverse=True)

        # Apply pagination
        return docs[offset:offset + limit]

    def search_documents(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Simple text search across document titles and content"""
        results = []
        query_lower = query.lower()

        for doc_id, doc_info in self.index["documents"].items():
            # Search in title
            if query_lower in doc_info["title"].lower():
                doc = self.get_document(doc_id)
                if doc:
                    results.append({
                        "id": doc_id,
                        "title": doc.title,
                        "doc_type": doc.doc_type,
                        "snippet": doc.content[:200] + "...",
                        "score": 1.0  # Title match gets higher score
                    })
                continue

            # Search in content
            doc = self.get_document(doc_id)
            if doc and query_lower in doc.content.lower():
                # Find context around the match
                idx = doc.content.lower().find(query_lower)
                start = max(0, idx - 100)
                end = min(len(doc.content), idx + 100)
                snippet = "..." + doc.content[start:end] + "..."

                results.append({
                    "id": doc_id,
                    "title": doc.title,
                    "doc_type": doc.doc_type,
                    "snippet": snippet,
                    "score": 0.5  # Content match gets lower score
                })

        # Sort by score
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:limit]

    # UPDATE
    def update_document(self,
                        doc_id: str,
                        title: Optional[str] = None,
                        content: Optional[str] = None,
                        metadata: Optional[Dict[str, Any]] = None,
                        tags: Optional[List[str]] = None) -> Optional[Document]:
        """Update an existing document in place. created_at is never touched
        here — only updated_at moves — so the original acquisition date
        always survives a legitimate update."""
        with self._locked_index():
            doc = self.get_document(doc_id)
            if not doc:
                return None

            # Update fields
            if title:
                doc.title = title
            if content:
                doc.content = content
                doc.content_hash = self._content_hash(content)
                # Find existing content file or create new one with meaningful name
                doc_dir = self._get_doc_path(
                    doc.doc_type, doc_id, "metadata.json", doc.title).parent
                content_files = list(doc_dir.glob("*.md"))

                if content_files:
                    # Use existing content file
                    content_file = content_files[0]
                else:
                    # Create new file with meaningful name
                    content_filename = self._generate_filename(doc.title)
                    content_file = self._get_doc_path(
                        doc.doc_type, doc_id, content_filename, doc.title)

                with open(content_file, 'w', encoding='utf-8') as f:
                    f.write(content)
            if metadata:
                doc.metadata.update(metadata)
            if tags is not None:
                # Remove old tags from index
                for old_tag in doc.tags:
                    if old_tag in self.index["tags"] and doc_id in self.index["tags"][old_tag]:
                        self.index["tags"][old_tag].remove(doc_id)

                # Add new tags (deduped)
                doc.tags = tags
                for tag in tags:
                    tag_docs = self.index["tags"].setdefault(tag, [])
                    if doc_id not in tag_docs:
                        tag_docs.append(doc_id)

            doc.updated_at = datetime.now().isoformat()

            # Save updated metadata
            meta_file = self._get_doc_path(
                doc.doc_type, doc_id, "metadata.json", doc.title)
            with open(meta_file, 'w', encoding='utf-8') as f:
                json.dump(doc.to_dict(), f, indent=2)

            # Update index (created_at deliberately omitted — preserved as-is)
            self.index["documents"][doc_id].update({
                "title": doc.title,
                "content_hash": doc.content_hash,
                "updated_at": doc.updated_at,
                "tags": doc.tags
            })
            self._save_index()

        logger.info(f"Updated document: {doc_id}")
        return doc

    # DELETE
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document from the knowledge base"""
        with self._locked_index():
            if doc_id not in self.index["documents"]:
                return False

            doc_info = self.index["documents"][doc_id]
            doc_path = Path(doc_info["path"])

            # Remove from tag index
            for tag in doc_info["tags"]:
                if tag in self.index["tags"] and doc_id in self.index["tags"][tag]:
                    self.index["tags"][tag].remove(doc_id)
                    if not self.index["tags"][tag]:
                        del self.index["tags"][tag]

            # Delete files
            if doc_path.exists():
                shutil.rmtree(doc_path)

            # Remove from index
            del self.index["documents"][doc_id]
            self._save_index()

        logger.info(f"Deleted document: {doc_id}")
        return True

    # BULK OPERATIONS
    def bulk_import(self, directory: str, doc_type: str) -> List[Document]:
        """Bulk import documents from a directory"""
        imported_docs = []
        dir_path = Path(directory)

        if not dir_path.exists():
            logger.error(f"Directory not found: {directory}")
            return imported_docs

        # Process all markdown and text files
        for file_path in dir_path.rglob("*"):
            if file_path.suffix in ['.md', '.txt']:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Extract title from filename or first line
                    title = file_path.stem.replace('_', ' ').title()
                    if content.startswith('#'):
                        first_line = content.split('\n')[0]
                        title = first_line.strip('#').strip()

                    doc = self.create_document(
                        title=title,
                        content=content,
                        source=str(file_path),
                        doc_type=doc_type,
                        metadata={"original_path": str(file_path)}
                    )
                    imported_docs.append(doc)

                except Exception as e:
                    logger.error(f"Error importing {file_path}: {e}")

        logger.info(
            f"Imported {len(imported_docs)} documents from {directory}")
        return imported_docs

    def export_document(self, doc_id: str, output_dir: str) -> Optional[str]:
        """Export a document to a directory"""
        doc = self.get_document(doc_id)
        if not doc:
            return None

        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        # Save content
        filename = f"{doc.title.replace(' ', '_').lower()}.md"
        file_path = output_path / filename

        with open(file_path, 'w', encoding='utf-8') as f:
            # Write metadata header
            f.write(f"# {doc.title}\n\n")
            f.write(f"**Source:** {doc.source}\n")
            f.write(f"**Type:** {doc.doc_type}\n")
            f.write(f"**Created:** {doc.created_at}\n")
            f.write(f"**Tags:** {', '.join(doc.tags)}\n\n")
            f.write("---\n\n")
            f.write(doc.content)

        return str(file_path)

    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        stats = {
            "total_documents": len(self.index["documents"]),
            "documents_by_type": {},
            "total_tags": len(self.index["tags"]),
            "popular_tags": [],
            "last_updated": self.index.get("last_updated", "")
        }

        # Count documents by type
        for doc_info in self.index["documents"].values():
            doc_type = doc_info["doc_type"]
            if doc_type not in stats["documents_by_type"]:
                stats["documents_by_type"][doc_type] = 0
            stats["documents_by_type"][doc_type] += 1

        # Get popular tags
        tag_counts = [(tag, len(docs))
                      for tag, docs in self.index["tags"].items()]
        tag_counts.sort(key=lambda x: x[1], reverse=True)
        stats["popular_tags"] = tag_counts[:10]

        return stats
