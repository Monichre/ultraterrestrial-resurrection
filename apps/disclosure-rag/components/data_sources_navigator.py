#!/usr/bin/env python3
"""
Data Sources Navigator - Comprehensive UI for Knowledge Base Navigation
Displays all data sources with statistics, search, and navigation capabilities
"""

import streamlit as st
import pandas as pd
import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go
from collections import defaultdict, Counter
import re

# Import database stats component
try:
    from .database_stats import render_database_stats
    HAS_DATABASE_STATS = True
except ImportError:
    HAS_DATABASE_STATS = False


class DataSourcesNavigator:
    """Comprehensive data sources navigator for the knowledge base"""

    def __init__(self):
        # Update paths to use sources/ directory structure
        self.knowledge_base_path = Path(__file__).parent.parent.parent / "packages" / "knowledge-base"
        self.sources_path = self.knowledge_base_path / "sources"
        self.transcripts_path = self.sources_path / "transcripts"
        self.articles_path = self.knowledge_base_path / "articles"
        self.research_path = self.knowledge_base_path / "research"
        self.metadata_path = self.knowledge_base_path / "metadata"

        # Try to load indexed data
        self.index_file = self.metadata_path / "index.json"
        self.use_index = self.index_file.exists()

        # Initialize data cache
        if 'data_sources_cache' not in st.session_state:
            st.session_state.data_sources_cache = None
            st.session_state.last_scan_time = None

    def scan_knowledge_base(self) -> Dict[str, Any]:
        """Comprehensive scan of all knowledge base sources"""

        with st.spinner("🔍 Scanning knowledge base..."):
            if self.use_index:
                # Use index file if available
                data_sources = self._scan_with_index()
            else:
                # Fallback to filesystem scan
                data_sources = self._scan_filesystem()

            # Cache results
            st.session_state.data_sources_cache = data_sources
            st.session_state.last_scan_time = datetime.now()

        return data_sources

    def _scan_with_index(self) -> Dict[str, Any]:
        """Scan using index.json file"""
        try:
            # Load index file
            with open(self.index_file, 'r', encoding='utf-8') as f:
                index_data = json.load(f)

            # Initialize data structure
            data_sources = {
                'files': {'files': [], 'count': 0, 'total_size_mb': 0, 'categories': Counter()},
                'transcripts': {'files': [], 'count': 0, 'date_folders': [], 'date_range': {}, 'total_size_kb': 0, 'topics': Counter()},
                'articles': {'files': [], 'count': 0, 'total_size_kb': 0, 'file_types': Counter()},
                'research': {'files': [], 'count': 0, 'total_size_kb': 0, 'file_types': Counter()},
                'metadata': {
                    'index_file': {
                        'path': 'metadata/index.json',
                        'documents_count': len(index_data.get('documents', {})),
                        'tags_count': len(index_data.get('tags', {})),
                        'last_updated': index_data.get('last_updated', 'unknown')
                    },
                    'status': 'active'
                },
                'summary': {},
                'scan_time': datetime.now().isoformat()
            }

            # Process documents by type
            for doc_id, doc_info in index_data.get('documents', {}).items():
                doc_type = doc_info['doc_type']

                file_info = {
                    'name': doc_info['title'],
                    'id': doc_id,
                    'path': doc_info['metadata'].get('original_path', f"{doc_type}/{doc_id}"),
                    'modified': doc_info['updated_at'],
                    'type': doc_info['metadata'].get('file_type', 'Unknown'),
                    'tags': doc_info['tags']
                }

                if doc_type == 'case_file':
                    file_info['size_mb'] = doc_info['metadata'].get(
                        'file_size', 0) / (1024 * 1024) if doc_info['metadata'].get('file_size') else 0
                    file_info['category'] = self._categorize_case_file(
                        doc_info['title'])
                    data_sources['files']['files'].append(file_info)
                    data_sources['files']['count'] += 1
                    data_sources['files']['total_size_mb'] += file_info['size_mb']
                    data_sources['files']['categories'][file_info['category']] += 1

                elif doc_type == 'transcript':
                    file_info['size_kb'] = doc_info['metadata'].get(
                        'file_size', 0) / 1024 if doc_info['metadata'].get('file_size') else 0
                    file_info['topic'] = self._extract_transcript_topic(
                        doc_info['title'])
                    file_info['date_folder'] = doc_info['metadata'].get(
                        'date_folder', 'unknown')

                    data_sources['transcripts']['files'].append(file_info)
                    data_sources['transcripts']['count'] += 1
                    data_sources['transcripts']['total_size_kb'] += file_info['size_kb']
                    data_sources['transcripts']['topics'][file_info['topic']] += 1

                    if file_info['date_folder'] not in data_sources['transcripts']['date_folders']:
                        data_sources['transcripts']['date_folders'].append(
                            file_info['date_folder'])

                elif doc_type == 'article':
                    file_info['size_kb'] = doc_info['metadata'].get(
                        'file_size', 0) / 1024 if doc_info['metadata'].get('file_size') else 0
                    data_sources['articles']['files'].append(file_info)
                    data_sources['articles']['count'] += 1
                    data_sources['articles']['total_size_kb'] += file_info['size_kb']
                    data_sources['articles']['file_types'][file_info['type']] += 1

                elif doc_type == 'research':
                    file_info['size_kb'] = doc_info['metadata'].get(
                        'file_size', 0) / 1024 if doc_info['metadata'].get('file_size') else 0
                    data_sources['research']['files'].append(file_info)
                    data_sources['research']['count'] += 1
                    data_sources['research']['total_size_kb'] += file_info['size_kb']
                    data_sources['research']['file_types'][file_info['type']] += 1

            # Set date range for transcripts
            date_folders = sorted(data_sources['transcripts']['date_folders'])
            data_sources['transcripts']['date_range'] = {
                'earliest': date_folders[0] if date_folders else None,
                'latest': date_folders[-1] if date_folders else None
            }

            # Generate summary
            data_sources['summary'] = self._generate_summary(data_sources)

            return data_sources

        except Exception as e:
            st.error(f"Error scanning with index: {e}")
            # Fallback to filesystem scan
            return self._scan_filesystem()

    def _scan_filesystem(self) -> Dict[str, Any]:
        """Fallback filesystem scan method"""
        data_sources = {
            'files': self._scan_files(),
            'transcripts': self._scan_transcripts(),
            'articles': self._scan_articles(),
            'research': self._scan_research(),
            'metadata': self._scan_metadata(),
            'summary': {},
            'scan_time': datetime.now().isoformat()
        }

        # Generate summary statistics
        data_sources['summary'] = self._generate_summary(data_sources)

        return data_sources

    def _scan_files(self) -> Dict[str, Any]:
        """Scan PDF case files"""
        files = []

        if self.files_path.exists():
            for file_path in self.files_path.glob("**/*.pdf"):
                try:
                    stat = file_path.stat()
                    files.append({
                        'name': file_path.name,
                        'path': str(file_path.relative_to(self.knowledge_base_path)),
                        'size_mb': round(stat.st_size / (1024 * 1024), 2),
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        'type': 'PDF',
                        'category': self._categorize_case_file(file_path.name)
                    })
                except Exception as e:
                    st.warning(f"Error reading {file_path.name}: {e}")

        return {
            'files': files,
            'count': len(files),
            'total_size_mb': sum(f['size_mb'] for f in files),
            'categories': Counter(f['category'] for f in files)
        }

    def _scan_transcripts(self) -> Dict[str, Any]:
        """Scan transcript files organized by date"""
        transcripts = []
        date_folders = []

        if self.transcripts_path.exists():
            # Get all date folders
            for date_folder in sorted(self.transcripts_path.glob("*")):
                if date_folder.is_dir():
                    date_folders.append(date_folder.name)

                    # Scan files in date folder
                    for file_path in date_folder.glob("**/*.txt"):
                        try:
                            stat = file_path.stat()
                            transcripts.append({
                                'name': file_path.name,
                                'path': str(file_path.relative_to(self.knowledge_base_path)),
                                'date_folder': date_folder.name,
                                'size_kb': round(stat.st_size / 1024, 2),
                                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                                'type': 'Transcript',
                                'topic': self._extract_transcript_topic(file_path.name)
                            })
                        except Exception as e:
                            st.warning(f"Error reading {file_path.name}: {e}")

        return {
            'files': transcripts,
            'count': len(transcripts),
            'date_folders': sorted(date_folders),
            'date_range': {
                'earliest': min(date_folders) if date_folders else None,
                'latest': max(date_folders) if date_folders else None
            },
            'total_size_kb': sum(f['size_kb'] for f in transcripts),
            'topics': Counter(f['topic'] for f in transcripts)
        }

    def _scan_articles(self) -> Dict[str, Any]:
        """Scan articles directory"""
        articles = []

        if self.articles_path.exists():
            for file_path in self.articles_path.glob("**/*.*"):
                if file_path.is_file():
                    try:
                        stat = file_path.stat()
                        articles.append({
                            'name': file_path.name,
                            'path': str(file_path.relative_to(self.knowledge_base_path)),
                            'size_kb': round(stat.st_size / 1024, 2),
                            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                            'type': file_path.suffix.upper(),
                            'category': 'Article'
                        })
                    except Exception as e:
                        st.warning(f"Error reading {file_path.name}: {e}")

        return {
            'files': articles,
            'count': len(articles),
            'total_size_kb': sum(f['size_kb'] for f in articles),
            'file_types': Counter(f['type'] for f in articles)
        }

    def _scan_research(self) -> Dict[str, Any]:
        """Scan research directory"""
        research_files = []

        if self.research_path.exists():
            for file_path in self.research_path.glob("**/*.*"):
                if file_path.is_file():
                    try:
                        stat = file_path.stat()
                        research_files.append({
                            'name': file_path.name,
                            'path': str(file_path.relative_to(self.knowledge_base_path)),
                            'size_kb': round(stat.st_size / 1024, 2),
                            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                            'type': file_path.suffix.upper(),
                            'category': 'Research'
                        })
                    except Exception as e:
                        st.warning(f"Error reading {file_path.name}: {e}")

        return {
            'files': research_files,
            'count': len(research_files),
            'total_size_kb': sum(f['size_kb'] for f in research_files),
            'file_types': Counter(f['type'] for f in research_files)
        }

    def _scan_metadata(self) -> Dict[str, Any]:
        """Scan metadata and configuration files"""
        metadata_info = {
            'index_file': None,
            'config_files': [],
            'status': 'unknown'
        }

        # Check main index file
        index_path = self.metadata_path / "index.json"
        if index_path.exists():
            try:
                with open(index_path, 'r') as f:
                    index_data = json.load(f)
                metadata_info['index_file'] = {
                    'path': str(index_path.relative_to(self.knowledge_base_path)),
                    'documents_count': len(index_data.get('documents', {})),
                    'tags_count': len(index_data.get('tags', {})),
                    'last_updated': index_data.get('last_updated', 'unknown')
                }
                metadata_info['status'] = 'active'
            except Exception as e:
                metadata_info['status'] = f'error: {e}'

        # Scan for other config files
        for file_path in self.knowledge_base_path.glob("*.json"):
            if file_path.name != "index.json":
                try:
                    stat = file_path.stat()
                    metadata_info['config_files'].append({
                        'name': file_path.name,
                        'size_kb': round(stat.st_size / 1024, 2),
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                    })
                except Exception:
                    pass

        return metadata_info

    def _generate_summary(self, data_sources: Dict[str, Any]) -> Dict[str, Any]:
        """Generate overall summary statistics"""

        total_files = (
            data_sources['files']['count'] +
            data_sources['transcripts']['count'] +
            data_sources['articles']['count'] +
            data_sources['research']['count']
        )

        total_size_mb = (
            data_sources['files']['total_size_mb'] +
            (data_sources['transcripts']['total_size_kb'] / 1024) +
            (data_sources['articles']['total_size_kb'] / 1024) +
            (data_sources['research']['total_size_kb'] / 1024)
        )

        return {
            'total_files': total_files,
            'total_size_mb': round(total_size_mb, 2),
            'file_types': {
                'Case Files (PDFs)': data_sources['files']['count'],
                'Transcripts': data_sources['transcripts']['count'],
                'Articles': data_sources['articles']['count'],
                'Research Files': data_sources['research']['count']
            },
            'date_coverage': data_sources['transcripts']['date_range'],
            'metadata_status': data_sources['metadata']['status']
        }

    def _categorize_case_file(self, filename: str) -> str:
        """Categorize case files based on filename patterns"""
        filename_lower = filename.lower()

        if 'cia' in filename_lower or 'rdp' in filename_lower:
            return 'CIA Documents'
        elif 'ufo' in filename_lower or 'uap' in filename_lower:
            return 'UFO/UAP Reports'
        elif 'roswell' in filename_lower:
            return 'Roswell Incident'
        elif 'bluebook' in filename_lower or 'blue book' in filename_lower:
            return 'Project Blue Book'
        elif 'congress' in filename_lower or 'hearing' in filename_lower:
            return 'Congressional Hearings'
        elif 'testimony' in filename_lower:
            return 'Witness Testimony'
        elif 'crop circle' in filename_lower:
            return 'Crop Circles'
        elif 'mars' in filename_lower:
            return 'Mars/Space Related'
        else:
            return 'Other Documents'

    def _extract_transcript_topic(self, filename: str) -> str:
        """Extract topic from transcript filename"""
        # Remove common prefixes/suffixes
        clean_name = filename.replace('.txt', '').replace('Summary', '')

        # Common topic patterns
        if 'rogan' in clean_name.lower():
            return 'Joe Rogan Podcast'
        elif 'disclosure' in clean_name.lower():
            return 'Disclosure Related'
        elif 'ufo' in clean_name.lower() or 'uap' in clean_name.lower():
            return 'UFO/UAP Discussion'
        elif 'alien' in clean_name.lower() or 'et' in clean_name.lower():
            return 'Alien/ET Related'
        elif 'navy' in clean_name.lower() or 'military' in clean_name.lower():
            return 'Military/Navy'
        elif 'testimony' in clean_name.lower():
            return 'Witness Testimony'
        elif 'grusch' in clean_name.lower():
            return 'David Grusch'
        elif 'elizondo' in clean_name.lower():
            return 'Luis Elizondo'
        else:
            return 'General Discussion'

    def render_overview_dashboard(self, data_sources: Dict[str, Any]):
        """Render the main overview dashboard"""

        st.header("🗂️ Knowledge Base Data Sources")

        # Summary metrics
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric(
                "Total Files",
                f"{data_sources['summary']['total_files']:,}",
                help="Total number of files across all categories"
            )

        with col2:
            st.metric(
                "Total Size",
                f"{data_sources['summary']['total_size_mb']:.1f} MB",
                help="Total storage size of all files"
            )

        with col3:
            date_range = data_sources['summary']['date_coverage']
            if date_range['earliest'] and date_range['latest']:
                st.metric(
                    "Date Coverage",
                    f"{date_range['earliest']} to {date_range['latest']}",
                    help="Earliest to latest transcript dates"
                )
            else:
                st.metric("Date Coverage", "No data",
                          help="No transcript dates found")

        with col4:
            status = data_sources['summary']['metadata_status']
            st.metric(
                "Metadata Status",
                "✅ Active" if status == 'active' else "⚠️ Issues",
                help=f"Metadata index status: {status}"
            )

        # File type distribution
        st.subheader("📊 File Type Distribution")

        file_types = data_sources['summary']['file_types']
        if file_types:
            fig = px.pie(
                values=list(file_types.values()),
                names=list(file_types.keys()),
                title="Distribution of Files by Type"
            )
            fig.update_traces(textposition='inside', textinfo='percent+label')
            st.plotly_chart(fig, use_container_width=True)

        # Recent activity timeline
        self._render_activity_timeline(data_sources)

    def _render_activity_timeline(self, data_sources: Dict[str, Any]):
        """Render activity timeline showing recent additions"""

        st.subheader("📅 Recent Activity Timeline")

        # Collect all files with timestamps
        all_files = []

        for category in ['files', 'transcripts', 'articles', 'research']:
            for file_info in data_sources[category]['files']:
                all_files.append({
                    'name': file_info['name'],
                    'category': category.replace('_', ' ').title(),
                    'modified': pd.to_datetime(file_info['modified']),
                    'size': file_info.get('size_mb', file_info.get('size_kb', 0))
                })

        if all_files:
            # Sort by modification date and take recent files
            df = pd.DataFrame(all_files)
            df_recent = df.nlargest(20, 'modified')

            # Create timeline
            fig = px.scatter(
                df_recent,
                x='modified',
                y='category',
                size='size',
                hover_data=['name'],
                title="Recent File Activity (Last 20 Files)",
                labels={'modified': 'Last Modified', 'category': 'Category'}
            )
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)

    def render_detailed_browser(self, data_sources: Dict[str, Any]):
        """Render detailed file browser with search and filtering"""

        st.header("🔍 Detailed File Browser")

        # Category selector
        categories = ['All', 'Case Files',
                      'Transcripts', 'Articles', 'Research']
        selected_category = st.selectbox("Select Category", categories)

        # Search functionality
        search_term = st.text_input(
            "🔍 Search files", placeholder="Enter filename or content keywords...")

        # Date filter for transcripts
        if selected_category in ['All', 'Transcripts']:
            date_folders = data_sources['transcripts']['date_folders']
            if date_folders:
                selected_dates = st.multiselect(
                    "Filter by Date (Transcripts)",
                    date_folders,
                    help="Select specific date folders to filter transcripts"
                )

        # Build filtered file list
        filtered_files = self._filter_files(
            data_sources, selected_category, search_term)

        if filtered_files:
            # Display results
            st.subheader(f"📄 Found {len(filtered_files)} files")

            # Create DataFrame for display
            df = pd.DataFrame(filtered_files)

            # Configure display columns
            display_columns = ['name', 'category',
                               'type', 'size_display', 'modified']
            column_config = {
                'name': st.column_config.TextColumn("File Name", width="large"),
                'category': st.column_config.TextColumn("Category", width="medium"),
                'type': st.column_config.TextColumn("Type", width="small"),
                'size_display': st.column_config.TextColumn("Size", width="small"),
                'modified': st.column_config.DatetimeColumn("Modified", width="medium")
            }

            # Display table with selection
            selected_rows = st.dataframe(
                df[display_columns],
                column_config=column_config,
                use_container_width=True,
                hide_index=True,
                on_select="rerun",
                selection_mode="single-row"
            )

            # File details panel
            if selected_rows and selected_rows.selection.rows:
                selected_idx = selected_rows.selection.rows[0]
                selected_file = filtered_files[selected_idx]
                self._render_file_details(selected_file)

        else:
            st.info("No files found matching your criteria.")

    def _filter_files(self, data_sources: Dict[str, Any], category: str, search_term: str) -> List[Dict]:
        """Filter files based on category and search term"""

        all_files = []

        # Collect files based on category filter
        categories_to_include = []
        if category == 'All':
            categories_to_include = ['files',
                                     'transcripts', 'articles', 'research']
        elif category == 'Case Files':
            categories_to_include = ['files']
        elif category == 'Transcripts':
            categories_to_include = ['transcripts']
        elif category == 'Articles':
            categories_to_include = ['articles']
        elif category == 'Research':
            categories_to_include = ['research']

        for cat in categories_to_include:
            for file_info in data_sources[cat]['files']:
                # Add display fields
                file_copy = file_info.copy()
                file_copy['category'] = cat.replace('_', ' ').title()

                # Format size display
                if 'size_mb' in file_info:
                    file_copy['size_display'] = f"{file_info['size_mb']} MB"
                elif 'size_kb' in file_info:
                    file_copy['size_display'] = f"{file_info['size_kb']} KB"
                else:
                    file_copy['size_display'] = "Unknown"

                # Convert modified to datetime
                file_copy['modified'] = pd.to_datetime(file_info['modified'])

                all_files.append(file_copy)

        # Apply search filter
        if search_term:
            search_lower = search_term.lower()
            filtered_files = []
            for file_info in all_files:
                if (search_lower in file_info['name'].lower() or
                    search_lower in file_info.get('topic', '').lower() or
                        search_lower in file_info.get('category', '').lower()):
                    filtered_files.append(file_info)
            return filtered_files

        return all_files

    def _render_file_details(self, file_info: Dict[str, Any]):
        """Render detailed information about selected file"""

        st.subheader("📋 File Details")

        col1, col2 = st.columns(2)

        with col1:
            st.write("**File Information**")
            st.write(f"**Name:** {file_info['name']}")
            st.write(f"**Category:** {file_info['category']}")
            st.write(f"**Type:** {file_info['type']}")
            st.write(f"**Size:** {file_info['size_display']}")
            st.write(
                f"**Modified:** {file_info['modified'].strftime('%Y-%m-%d %H:%M:%S')}")

        with col2:
            st.write("**File Path**")
            st.code(file_info['path'])

            if 'topic' in file_info:
                st.write(f"**Topic:** {file_info['topic']}")

            if 'date_folder' in file_info:
                st.write(f"**Date Folder:** {file_info['date_folder']}")

        # Action buttons
        st.write("**Actions**")
        col1, col2, col3 = st.columns(3)

        with col1:
            if st.button("📖 View Content", help="Open file content"):
                self._show_content_viewer(file_info)

        with col2:
            if st.button("🔍 Search Similar", help="Find similar files"):
                st.info("Similar file search coming soon!")

        with col3:
            if st.button("📤 Export Info", help="Export file information"):
                st.info("Export feature coming soon!")

    def _show_content_viewer(self, file_info: Dict[str, Any]):
        """Show content viewer for the selected file"""
        if self.use_index and 'id' in file_info:
            # Try to read content from original file
            try:
                st.subheader(f"📄 Content: {file_info['name']}")

                # Show metadata
                with st.expander("📋 Document Metadata"):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"**ID:** {file_info['id']}")
                        st.write(f"**Type:** {file_info['type']}")
                        st.write(f"**Path:** {file_info['path']}")
                    with col2:
                        st.write(f"**Modified:** {file_info['modified']}")
                        st.write(
                            f"**Tags:** {', '.join(file_info['tags']) if file_info['tags'] else 'None'}")

                # Try to read content from original file
                file_path = self.knowledge_base_path / file_info['path']
                if file_path.exists():
                    st.subheader("📝 Content")
                    if file_info['type'] == 'PDF':
                        st.info(
                            "PDF content extraction not yet implemented. Showing file information only.")
                        st.write(f"PDF file: {file_path.name}")
                        st.write(
                            f"Size: {file_path.stat().st_size / (1024*1024):.1f} MB")
                    else:
                        # Read text content
                        try:
                            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()

                            if len(content) > 1000:
                                st.text_area(
                                    "Document Content",
                                    value=content,
                                    height=400,
                                    help="Full document content"
                                )
                            else:
                                st.text(content)
                        except Exception as e:
                            st.error(f"Could not read file content: {e}")
                else:
                    st.warning(f"Original file not found: {file_path}")

            except Exception as e:
                st.error(f"Error loading content: {e}")
        else:
            # Fallback: show content preview if available
            if 'content_preview' in file_info:
                st.text_area(
                    "Content Preview",
                    value=file_info['content_preview'],
                    height=200,
                    help="Preview of document content"
                )
            else:
                st.info("Content viewing not available for this file")

    def render_statistics_panel(self, data_sources: Dict[str, Any]):
        """Render detailed statistics panel"""

        st.header("📈 Knowledge Base Statistics")

        # Detailed category breakdown
        st.subheader("Category Breakdown")

        categories = ['files', 'transcripts', 'articles', 'research']

        for category in categories:
            with st.expander(f"📁 {category.replace('_', ' ').title()} Details"):
                cat_data = data_sources[category]

                col1, col2, col3 = st.columns(3)

                with col1:
                    st.metric("File Count", cat_data['count'])

                with col2:
                    if 'total_size_mb' in cat_data:
                        st.metric("Total Size",
                                  f"{cat_data['total_size_mb']} MB")
                    elif 'total_size_kb' in cat_data:
                        st.metric("Total Size",
                                  f"{cat_data['total_size_kb']} KB")

                with col3:
                    if category == 'files' and 'categories' in cat_data:
                        st.write("**Top Categories:**")
                        for cat, count in cat_data['categories'].most_common(3):
                            st.write(f"• {cat}: {count}")
                    elif category == 'transcripts' and 'topics' in cat_data:
                        st.write("**Top Topics:**")
                        for topic, count in cat_data['topics'].most_common(3):
                            st.write(f"• {topic}: {count}")

    def render_main_interface(self):
        """Main interface for data sources navigator"""

        # Header with refresh button
        col1, col2 = st.columns([3, 1])
        with col1:
            st.title("🗂️ Knowledge Base Data Sources")
        with col2:
            if st.button("🔄 Refresh Data"):
                st.session_state.data_sources_cache = None

        # Get or scan data
        if st.session_state.data_sources_cache is None:
            data_sources = self.scan_knowledge_base()
        else:
            data_sources = st.session_state.data_sources_cache

        # Display last scan time
        if st.session_state.last_scan_time:
            st.caption(
                f"Last scanned: {st.session_state.last_scan_time.strftime('%Y-%m-%d %H:%M:%S')}")

        # Tab interface
        if HAS_DATABASE_STATS:
            tab1, tab2, tab3, tab4 = st.tabs(
                ["📊 Overview", "🔍 File Browser", "📈 Statistics", "🗄️ Database"])
        else:
            tab1, tab2, tab3 = st.tabs(
                ["📊 Overview", "🔍 File Browser", "📈 Statistics"])

        with tab1:
            self.render_overview_dashboard(data_sources)

        with tab2:
            self.render_detailed_browser(data_sources)

        with tab3:
            self.render_statistics_panel(data_sources)

        if HAS_DATABASE_STATS:
            with tab4:
                render_database_stats()

# Convenience function for streamlit app


def render_data_sources_navigator():
    """Render the data sources navigator interface"""
    navigator = DataSourcesNavigator()
    navigator.render_main_interface()


if __name__ == "__main__":
    # For testing
    st.set_page_config(page_title="Data Sources Navigator", layout="wide")
    render_data_sources_navigator()