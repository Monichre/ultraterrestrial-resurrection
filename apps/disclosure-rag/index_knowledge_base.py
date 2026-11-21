#!/usr/bin/env python3
"""
Knowledge Base Indexer
Scans and indexes all files in the knowledge base for the CRUD system
"""

import os
import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class KnowledgeBaseIndexer:
    """Indexes local knowledge base files into the metadata system"""

    def __init__(self):
        # Use absolute path to packages/knowledge-base
        project_root = Path(__file__).parent.parent.parent
        self.kb_path = project_root / "packages" / "knowledge-base"
        self.sources_path = self.kb_path / "sources"
        self.files_path = self.sources_path / "files"
        self.transcripts_path = self.sources_path / "transcripts"
        self.articles_path = self.sources_path / "web"
        self.research_path = self.kb_path / "research"
        self.metadata_path = self.kb_path / "metadata"
        self.index_file = self.metadata_path / "index.json"

        # Create metadata directory if it doesn't exist
        self.metadata_path.mkdir(parents=True, exist_ok=True)

    def _generate_id(self, file_path: Path) -> str:
        """Generate a unique ID for a file based on its path and content hash"""
        try:
            # Use file path and modification time for consistent ID
            content = f"{file_path.name}_{file_path.stat().st_mtime}"
            return hashlib.md5(content.encode()).hexdigest()[:12]
        except Exception:
            # Fallback to path-based ID
            return hashlib.md5(str(file_path).encode()).hexdigest()[:12]

    def _extract_content(self, file_path: Path) -> str:
        """Extract text content from file"""
        try:
            if file_path.suffix.lower() == '.pdf':
                # For PDFs, we'll store the filename as content for now
                # Could add PDF text extraction later
                return f"PDF Document: {file_path.name}"
            else:
                # Read text files
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
        except Exception as e:
            logger.warning(f"Could not read {file_path}: {e}")
            return f"File: {file_path.name} (content not readable)"

    def _categorize_file(self, file_path: Path, doc_type: str) -> List[str]:
        """Generate tags for a file based on its content and location"""
        tags = [doc_type]
        filename_lower = file_path.name.lower()

        # Add tags based on filename patterns
        if 'ufo' in filename_lower or 'uap' in filename_lower:
            tags.append('ufo')
        if 'cia' in filename_lower:
            tags.append('cia')
        if 'navy' in filename_lower or 'military' in filename_lower:
            tags.append('military')
        if 'roswell' in filename_lower:
            tags.append('roswell')
        if 'testimony' in filename_lower:
            tags.append('testimony')
        if 'disclosure' in filename_lower:
            tags.append('disclosure')
        if 'grusch' in filename_lower:
            tags.append('grusch')
        if 'elizondo' in filename_lower:
            tags.append('elizondo')
        if 'rogan' in filename_lower:
            tags.append('podcast')

        # Add date-based tags for transcripts
        if doc_type == 'transcript':
            parent_folder = file_path.parent.name
            if parent_folder.count('-') == 2:  # Date format YYYY-MM-DD
                year = parent_folder.split('-')[0]
                tags.append(f'year_{year}')

        return tags

    def index_files(self) -> List[Dict[str, Any]]:
        """Index PDF case files"""
        indexed = []

        if not self.files_path.exists():
            logger.warning(
                f"Case files directory not found: {self.files_path}")
            return indexed

        logger.info("Indexing case files...")
        for file_path in self.files_path.glob("**/*.pdf"):
            try:
                doc_id = self._generate_id(file_path)
                content = self._extract_content(file_path)
                tags = self._categorize_file(file_path, 'case_file')

                # Extract title from filename
                title = file_path.stem.replace(
                    '_', ' ').replace('-', ' ').title()

                doc_info = {
                    'id': doc_id,
                    'title': title,
                    'content': content,
                    'source': str(file_path),
                    'doc_type': 'case_file',
                    'created_at': datetime.fromtimestamp(file_path.stat().st_ctime).isoformat(),
                    'updated_at': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                    'metadata': {
                        'file_size': file_path.stat().st_size,
                        'file_type': 'PDF',
                        'original_path': str(file_path.relative_to(self.kb_path))
                    },
                    'tags': tags
                }

                indexed.append(doc_info)
                logger.info(f"Indexed case file: {title}")

            except Exception as e:
                logger.error(f"Error indexing {file_path}: {e}")

        return indexed

    def index_transcripts(self) -> List[Dict[str, Any]]:
        """Index transcript files"""
        indexed = []

        if not self.transcripts_path.exists():
            logger.warning(
                f"Transcripts directory not found: {self.transcripts_path}")
            return indexed

        logger.info("Indexing transcripts...")
        for file_path in self.transcripts_path.glob("**/*.txt"):
            try:
                doc_id = self._generate_id(file_path)
                content = self._extract_content(file_path)
                tags = self._categorize_file(file_path, 'transcript')

                # Extract title from filename
                title = file_path.stem.replace('_', ' ').replace('-', ' ')
                if 'Summary' in title:
                    title = title.replace('Summary', '').strip()
                title = title.title()

                doc_info = {
                    'id': doc_id,
                    'title': title,
                    'content': content,
                    'source': str(file_path),
                    'doc_type': 'transcript',
                    'created_at': datetime.fromtimestamp(file_path.stat().st_ctime).isoformat(),
                    'updated_at': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                    'metadata': {
                        'file_size': file_path.stat().st_size,
                        'file_type': 'TXT',
                        'date_folder': file_path.parent.name,
                        'original_path': str(file_path.relative_to(self.kb_path))
                    },
                    'tags': tags
                }

                indexed.append(doc_info)
                logger.info(f"Indexed transcript: {title}")

            except Exception as e:
                logger.error(f"Error indexing {file_path}: {e}")

        return indexed

    def index_articles(self) -> List[Dict[str, Any]]:
        """Index article files"""
        indexed = []

        if not self.articles_path.exists():
            logger.warning(
                f"Articles directory not found: {self.articles_path}")
            return indexed

        logger.info("Indexing articles...")
        for file_path in self.articles_path.glob("**/*.*"):
            if file_path.is_file() and file_path.suffix.lower() in ['.md', '.txt', '.html']:
                try:
                    doc_id = self._generate_id(file_path)
                    content = self._extract_content(file_path)
                    tags = self._categorize_file(file_path, 'article')

                    # Extract title from filename or first line
                    title = file_path.stem.replace(
                        '_', ' ').replace('-', ' ').title()
                    if content.startswith('#'):
                        first_line = content.split('\n')[0]
                        title = first_line.strip('#').strip()

                    doc_info = {
                        'id': doc_id,
                        'title': title,
                        'content': content,
                        'source': str(file_path),
                        'doc_type': 'article',
                        'created_at': datetime.fromtimestamp(file_path.stat().st_ctime).isoformat(),
                        'updated_at': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                        'metadata': {
                            'file_size': file_path.stat().st_size,
                            'file_type': file_path.suffix.upper(),
                            'original_path': str(file_path.relative_to(self.kb_path))
                        },
                        'tags': tags
                    }

                    indexed.append(doc_info)
                    logger.info(f"Indexed article: {title}")

                except Exception as e:
                    logger.error(f"Error indexing {file_path}: {e}")

        return indexed

    def index_research(self) -> List[Dict[str, Any]]:
        """Index research files"""
        indexed = []

        if not self.research_path.exists():
            logger.warning(
                f"Research directory not found: {self.research_path}")
            return indexed

        logger.info("Indexing research files...")
        for file_path in self.research_path.glob("**/*.*"):
            if file_path.is_file() and file_path.suffix.lower() in ['.md', '.txt', '.html', '.pdf']:
                try:
                    doc_id = self._generate_id(file_path)
                    content = self._extract_content(file_path)
                    tags = self._categorize_file(file_path, 'research')

                    # Extract title from filename or first line
                    title = file_path.stem.replace(
                        '_', ' ').replace('-', ' ').title()
                    if content.startswith('#'):
                        first_line = content.split('\n')[0]
                        title = first_line.strip('#').strip()

                    doc_info = {
                        'id': doc_id,
                        'title': title,
                        'content': content,
                        'source': str(file_path),
                        'doc_type': 'research',
                        'created_at': datetime.fromtimestamp(file_path.stat().st_ctime).isoformat(),
                        'updated_at': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                        'metadata': {
                            'file_size': file_path.stat().st_size,
                            'file_type': file_path.suffix.upper(),
                            'original_path': str(file_path.relative_to(self.kb_path))
                        },
                        'tags': tags
                    }

                    indexed.append(doc_info)
                    logger.info(f"Indexed research file: {title}")

                except Exception as e:
                    logger.error(f"Error indexing {file_path}: {e}")

        return indexed

    def build_index(self) -> bool:
        """Build complete index of all knowledge base files"""
        logger.info("Starting knowledge base indexing...")

        # Index all file types
        all_documents = []
        all_documents.extend(self.index_files())
        all_documents.extend(self.index_transcripts())
        all_documents.extend(self.index_articles())
        all_documents.extend(self.index_research())

        # Build index structure
        index = {
            'documents': {},
            'tags': {},
            'last_updated': datetime.now().isoformat()
        }

        # Add documents to index
        for doc in all_documents:
            doc_id = doc['id']
            index['documents'][doc_id] = {
                'title': doc['title'],
                'doc_type': doc['doc_type'],
                'path': str(Path(doc['source']).parent),
                'created_at': doc['created_at'],
                'updated_at': doc['updated_at'],
                'tags': doc['tags'],
                'metadata': doc['metadata']
            }

            # Build tag index
            for tag in doc['tags']:
                if tag not in index['tags']:
                    index['tags'][tag] = []
                index['tags'][tag].append(doc_id)

        # Save index
        try:
            with open(self.index_file, 'w', encoding='utf-8') as f:
                json.dump(index, f, indent=2, ensure_ascii=False)

            logger.info(
                f"✅ Successfully indexed {len(all_documents)} documents")
            logger.info(f"📊 Index saved to: {self.index_file}")
            logger.info(f"🏷️ Created {len(index['tags'])} tag categories")

            # Print summary
            doc_types = {}
            for doc in all_documents:
                doc_type = doc['doc_type']
                if doc_type not in doc_types:
                    doc_types[doc_type] = 0
                doc_types[doc_type] += 1

            logger.info("📋 Document breakdown:")
            for doc_type, count in doc_types.items():
                logger.info(f"  • {doc_type}: {count} files")

            return True

        except Exception as e:
            logger.error(f"Failed to save index: {e}")
            return False


def main():
    """Main indexing function"""
    indexer = KnowledgeBaseIndexer()

    print("🗂️ Knowledge Base Indexer")
    print("=" * 50)

    success = indexer.build_index()

    if success:
        print("\n✅ Indexing completed successfully!")
        print(f"📁 Index file: {indexer.index_file}")
        print("\nThe knowledge base is now ready for use with the CRUD system.")
    else:
        print("\n❌ Indexing failed!")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())