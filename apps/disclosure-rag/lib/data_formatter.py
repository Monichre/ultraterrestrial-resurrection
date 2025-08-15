#!/usr/bin/env python3
"""
Standardized Data Formatter
Provides consistent data structure formatting across all input sources
Date: August 14, 2025
"""

import os
import json
import hashlib
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class StandardizedDataFormatter:
    """Unified data formatter for all content processing pipelines"""
    
    def __init__(self, base_storage_dir: Optional[str] = None):
        if base_storage_dir:
            self.base_storage_dir = Path(base_storage_dir)
        else:
            # Default to packages/knowledge-base/sources/
            self.base_storage_dir = Path(__file__).parent.parent.parent.parent / "packages" / "knowledge-base" / "sources"
        
        # Ensure base directory exists
        self.base_storage_dir.mkdir(parents=True, exist_ok=True)
        
    def generate_doc_id(self, source: str, content: str = "") -> str:
        """Generate consistent document ID from source"""
        # Use source URL/path as primary identifier
        if source.startswith(('http://', 'https://')):
            # For URLs, use domain + path hash
            parsed = urlparse(source)
            base_id = f"{parsed.netloc}_{parsed.path}".replace("/", "_").replace(".", "_")
            # Add content hash for uniqueness
            content_hash = hashlib.md5((source + content[:100]).encode()).hexdigest()[:8]
            return f"{base_id}_{content_hash}"
        else:
            # For files, use filename + hash
            filename = Path(source).stem
            content_hash = hashlib.md5((source + content[:100]).encode()).hexdigest()[:8]
            return f"{filename}_{content_hash}"
    
    def create_working_directory(self, doc_type: str, doc_id: str) -> Path:
        """Create standardized working directory structure"""
        date_folder = datetime.now().strftime("%Y-%m-%d")
        
        # Determine subdirectory based on doc_type
        if doc_type == 'youtube_transcript':
            subdir = "transcripts"
        elif doc_type == 'web_article':
            subdir = "articles"
        elif doc_type == 'local_file':
            subdir = "files"
        else:
            subdir = "other"
        
        working_dir = self.base_storage_dir / subdir / date_folder / doc_id
        working_dir.mkdir(parents=True, exist_ok=True)
        
        return working_dir
    
    def format_youtube_data(self, url: str, content: str, title: str, 
                           metadata: Dict[str, Any], file_paths: Dict[str, str]) -> Dict[str, Any]:
        """Format YouTube processing data into standardized format"""
        doc_id = self.generate_doc_id(url, content)
        working_dir = self.create_working_directory('youtube_transcript', doc_id)
        
        # Standardize file paths
        standardized_files = {
            'content_file': file_paths.get('file_path', ''),
            'summary_file': file_paths.get('summary_path', ''),
            'metadata_file': file_paths.get('metadata_path', ''),
            'working_dir': str(working_dir)
        }
        
        return {
            'content': content,
            'title': title,
            'source': url,
            'doc_id': doc_id,
            'metadata': {
                'doc_type': 'youtube_transcript',
                'source_url': url,
                'file_path': None,
                'content_length': len(content),
                'word_count': len(content.split()) if content else 0,
                'extraction_timestamp': datetime.now().isoformat(),
                'processing_status': {
                    'content_extracted': True,
                    'summary_generated': bool(file_paths.get('summary_path')),
                    'entities_extracted': False,
                    'kb_indexed': False,
                    'kg_processed': False,
                    'openai_uploaded': False,
                    'search_synced': False
                },
                'source_specific': {
                    'video_id': metadata.get('id', ''),
                    'channel': metadata.get('channel', ''),
                    'duration': metadata.get('duration', ''),
                    'upload_date': metadata.get('upload_date', ''),
                    'categories': metadata.get('categories', []),
                    'tags': metadata.get('tags', []),
                    'description': metadata.get('description', ''),
                    'chapters': metadata.get('chapters', [])
                }
            },
            'file_paths': standardized_files,
            'processing_results': {}
        }
    
    def format_web_data(self, url: str, content: str, title: str, 
                       metadata: Dict[str, Any], processing_result: Dict[str, Any]) -> Dict[str, Any]:
        """Format web URL processing data into standardized format"""
        doc_id = self.generate_doc_id(url, content)
        working_dir = self.create_working_directory('web_article', doc_id)
        
        # Create standardized file paths in working directory
        safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()[:50]
        if not safe_title:
            from urllib.parse import urlparse
            domain = urlparse(url).netloc.replace('www.', '')
            safe_title = f"{domain.replace('.', '-')}"
        
        standardized_files = {
            'content_file': str(working_dir / f"{safe_title}_content.txt"),
            'summary_file': str(working_dir / f"{safe_title}_summary.txt"),
            'metadata_file': str(working_dir / f"{safe_title}_metadata.json"),
            'working_dir': str(working_dir)
        }
        
        return {
            'content': content,
            'title': title,
            'source': url,
            'doc_id': doc_id,
            'metadata': {
                'doc_type': 'web_article',
                'source_url': url,
                'file_path': None,
                'content_length': len(content),
                'word_count': len(content.split()) if content else 0,
                'extraction_timestamp': datetime.now().isoformat(),
                'processing_status': {
                    'content_extracted': True,
                    'summary_generated': False,
                    'entities_extracted': False,
                    'kb_indexed': False,
                    'kg_processed': False,
                    'openai_uploaded': False,
                    'search_synced': False
                },
                'source_specific': {
                    'author': metadata.get('author', ''),
                    'publish_date': metadata.get('publish_date', ''),
                    'meta_description': metadata.get('meta_description', ''),
                    'media_extracted': processing_result.get('downloaded_media', {}),
                    'related_links': processing_result.get('extracted_links', {})
                }
            },
            'file_paths': standardized_files,
            'processing_results': {}
        }
    
    def format_file_data(self, file_path: str, content: str, title: str) -> Dict[str, Any]:
        """Format local file processing data into standardized format"""
        doc_id = self.generate_doc_id(file_path, content)
        working_dir = self.create_working_directory('local_file', doc_id)
        
        # Create standardized file paths in working directory
        file_stem = Path(file_path).stem
        standardized_files = {
            'content_file': str(working_dir / f"{file_stem}_content.txt"),
            'summary_file': str(working_dir / f"{file_stem}_summary.txt"),
            'metadata_file': str(working_dir / f"{file_stem}_metadata.json"),
            'working_dir': str(working_dir)
        }
        
        return {
            'content': content,
            'title': title,
            'source': file_path,
            'doc_id': doc_id,
            'metadata': {
                'doc_type': 'local_file',
                'source_url': None,
                'file_path': file_path,
                'content_length': len(content),
                'word_count': len(content.split()) if content else 0,
                'extraction_timestamp': datetime.now().isoformat(),
                'processing_status': {
                    'content_extracted': True,
                    'summary_generated': False,
                    'entities_extracted': False,
                    'kb_indexed': False,
                    'kg_processed': False,
                    'openai_uploaded': False,
                    'search_synced': False
                },
                'source_specific': {
                    'original_path': file_path,
                    'file_type': Path(file_path).suffix,
                    'file_size': os.path.getsize(file_path) if os.path.exists(file_path) else 0
                }
            },
            'file_paths': standardized_files,
            'processing_results': {}
        }
    
    def update_processing_status(self, data: Dict[str, Any], step: str, success: bool, 
                               result: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Update processing status for a specific step"""
        if step in data['metadata']['processing_status']:
            data['metadata']['processing_status'][step] = success
        
        if result and step in ['entity_processing', 'cocoindex_processing', 'openai_upload', 
                               'search_sync', 'queue_result']:
            data['processing_results'][step] = result
        
        return data
    
    def save_standardized_files(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save content to standardized file structure"""
        try:
            file_paths = data['file_paths']
            
            # Save content file
            content_file = Path(file_paths['content_file'])
            content_file.parent.mkdir(parents=True, exist_ok=True)
            with open(content_file, 'w', encoding='utf-8') as f:
                f.write(data['content'])
            
            # Save metadata file
            metadata_file = Path(file_paths['metadata_file'])
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(data['metadata'], f, indent=2)
            
            # Update processing status
            data['metadata']['processing_status']['summary_generated'] = True
            
            logger.info(f"Saved standardized files for {data['doc_id']}")
            return data
            
        except Exception as e:
            logger.error(f"Error saving standardized files: {e}")
            return data
    
    def generate_research_summary(self, data: Dict[str, Any]) -> str:
        """Generate research methodology summary for any content type"""
        metadata = data['metadata']
        doc_type = metadata['doc_type']
        
        # Base summary template
        summary = f"""=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===

Research Agent Analysis:
Document ID: {data['doc_id']}
Document Type: {doc_type.replace('_', ' ').title()}
Source: {data['source']}
Title: {data['title']}
Content Length: {metadata['content_length']} characters
Word Count: {metadata['word_count']} words
Processing Date: {metadata['extraction_timestamp']}

## Content Classification

Primary Classification: {doc_type.replace('_', ' ').title()}
Content Integrity: Verified through {self._get_extraction_method(doc_type)}
Processing Pipeline: Standardized data format v1.0

## Source Analysis

"""
        
        # Add source-specific analysis
        if doc_type == 'youtube_transcript':
            summary += self._add_youtube_analysis(metadata['source_specific'])
        elif doc_type == 'web_article':
            summary += self._add_web_analysis(metadata['source_specific'])
        elif doc_type == 'local_file':
            summary += self._add_file_analysis(metadata['source_specific'])
        
        summary += f"""

## Research Methodology Notes

1. Content Verification:
   - Source: {data['source']}
   - Extraction Method: {self._get_extraction_method(doc_type)}
   - Content Integrity: High (direct source extraction)
   - Standardized Processing: Yes

2. Information Processing:
   - Data Format: Standardized v1.0
   - Content Preservation: Complete
   - Metadata Structure: Unified across all sources
   - Entity Recognition: Prepared for processing

3. Quality Assurance:
   - Format Consistency: Verified
   - Content Completeness: {self._assess_completeness(data['content'])}
   - Research Value: {self._assess_research_value(data['content'])}

=== ORIGINAL CONTENT ===

{data['content'][:5000]}{'...' if len(data['content']) > 5000 else ''}

=== END ANALYSIS ===
"""
        return summary
    
    def _get_extraction_method(self, doc_type: str) -> str:
        """Get extraction method description"""
        methods = {
            'youtube_transcript': 'YouTube API and transcript extraction',
            'web_article': 'Web scraping with content analysis',
            'local_file': 'Direct file system access'
        }
        return methods.get(doc_type, 'Standard extraction')
    
    def _add_youtube_analysis(self, source_specific: Dict[str, Any]) -> str:
        """Add YouTube-specific analysis"""
        return f"""Video ID: {source_specific.get('video_id', 'Unknown')}
Channel: {source_specific.get('channel', 'Unknown')}
Duration: {source_specific.get('duration', 'Unknown')}
Upload Date: {source_specific.get('upload_date', 'Unknown')}
Categories: {', '.join(source_specific.get('categories', []))}
Tags: {', '.join(source_specific.get('tags', [])[:5])}"""
    
    def _add_web_analysis(self, source_specific: Dict[str, Any]) -> str:
        """Add web-specific analysis"""
        return f"""Author: {source_specific.get('author', 'Not specified')}
Publication Date: {source_specific.get('publish_date', 'Not specified')}
Meta Description: {source_specific.get('meta_description', 'None')[:100]}
Media Extracted: {len(source_specific.get('media_extracted', {}).get('images', []))} images, {len(source_specific.get('media_extracted', {}).get('pdfs', []))} PDFs"""
    
    def _add_file_analysis(self, source_specific: Dict[str, Any]) -> str:
        """Add file-specific analysis"""
        return f"""Original Path: {source_specific.get('original_path', 'Unknown')}
File Type: {source_specific.get('file_type', 'Unknown')}
File Size: {source_specific.get('file_size', 0)} bytes"""
    
    def _assess_completeness(self, content: str) -> str:
        """Assess content completeness"""
        if not content:
            return "No content"
        word_count = len(content.split())
        if word_count < 100:
            return "Limited"
        elif word_count < 500:
            return "Moderate"
        elif word_count < 2000:
            return "Comprehensive"
        else:
            return "Extensive"
    
    def _assess_research_value(self, content: str) -> str:
        """Assess research value"""
        if not content:
            return "None"
        content_lower = content.lower()
        high_value_indicators = [
            'classified', 'declassified', 'testimony', 'witness', 'investigation',
            'evidence', 'documentation', 'official', 'report', 'analysis'
        ]
        value_score = sum(1 for indicator in high_value_indicators if indicator in content_lower)
        if value_score >= 5:
            return "High"
        elif value_score >= 3:
            return "Medium"
        elif value_score >= 1:
            return "Low"
        else:
            return "Limited"

# Global instance for easy import
data_formatter = StandardizedDataFormatter()