#!/usr/bin/env python3
"""
Simple backup vector store using FAISS
This is the ONE backup to avoid OpenAI vendor lock-in
"""

import os
import json
import pickle
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import logging

logger = logging.getLogger(__name__)


class SimpleBackupVector:
    """Simple FAISS-based backup vector store"""

    def __init__(self, storage_path: str = "./backup_vectors"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)

        # Use a lightweight model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

        # Initialize or load existing index
        self.index_file = self.storage_path / "faiss.index"
        self.metadata_file = self.storage_path / "metadata.json"

        self._load_or_create_index()

    def _load_or_create_index(self):
        """Load existing index or create new one"""
        if self.index_file.exists() and self.metadata_file.exists():
            # Load existing
            self.index = faiss.read_index(str(self.index_file))
            with open(self.metadata_file, 'r') as f:
                self.metadata = json.load(f)
            logger.info(
                f"Loaded backup vector index with {len(self.metadata)} documents")
        else:
            # Create new
            dimension = 384  # all-MiniLM-L6-v2 dimension
            self.index = faiss.IndexFlatL2(dimension)
            self.metadata = {}
            logger.info("Created new backup vector index")

    def add_document(self, doc_id: str, content: str, title: str, source: str) -> bool:
        """Add a document to the backup vector store"""
        try:
            # Generate embedding
            embedding = self.model.encode([content], convert_to_numpy=True)[0]

            # Add to FAISS
            self.index.add(embedding.reshape(1, -1))

            # Store metadata
            self.metadata[doc_id] = {
                'title': title,
                'source': source,
                'index_id': self.index.ntotal - 1  # FAISS index position
            }

            # Save to disk
            self._save_index()

            logger.info(f"Added {doc_id} to backup vector store")
            return True

        except Exception as e:
            logger.error(f"Failed to add to backup vector store: {e}")
            return False

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search the backup vector store"""
        try:
            # Generate query embedding
            query_embedding = self.model.encode([query], convert_to_numpy=True)

            # Search
            distances, indices = self.index.search(
                query_embedding, min(top_k, self.index.ntotal))

            # Get results with metadata
            results = []
            for dist, idx in zip(distances[0], indices[0]):
                if idx == -1:  # FAISS returns -1 for empty results
                    continue

                # Find metadata by index_id
                for doc_id, meta in self.metadata.items():
                    if meta['index_id'] == idx:
                        results.append({
                            'doc_id': doc_id,
                            'title': meta['title'],
                            'source': meta['source'],
                            'distance': float(dist),
                            # Convert to similarity
                            'score': float(1 / (1 + dist))
                        })
                        break

            return results

        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []

    def _save_index(self):
        """Save index and metadata to disk"""
        faiss.write_index(self.index, str(self.index_file))
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)

    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the backup store"""
        return {
            'total_documents': len(self.metadata),
            'index_size': self.index.ntotal,
            'storage_path': str(self.storage_path),
            'model': 'all-MiniLM-L6-v2'
        }
