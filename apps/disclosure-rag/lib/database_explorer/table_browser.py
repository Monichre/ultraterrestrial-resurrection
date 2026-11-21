#!/usr/bin/env python3
"""
Database Table Browser
Interactive table browser with search, filtering, and data preview capabilities
Date: July 13, 2025
"""

import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import json
import re

# Streamlit for UI components
try:
    import streamlit as st
    import pandas as pd
    STREAMLIT_AVAILABLE = True
except ImportError:
    STREAMLIT_AVAILABLE = False
    st = None
    pd = None

from .schema_analyzer import DatabaseMetadata, SchemaInfo, TableInfo, ColumnInfo
from .schema_visualizer import DatabaseSchemaVisualizer, SchemaVisualizationConfig
from .query_executor import QueryExecutor, QueryResult

logger = logging.getLogger(__name__)

@dataclass
class TableBrowserConfig:
    """Configuration for table browser"""
    preview_row_limit: int = 100
    search_case_sensitive: bool = False
    show_system_tables: bool = False
    auto_refresh_interval: int = 30  # seconds
    enable_data_preview: bool = True
    enable_export: bool = True
    max_export_rows: int = 10000

class DatabaseTableBrowser:
    """Interactive database table browser with advanced features"""
    
    def __init__(self, connection_manager, schema_analyzer, query_executor):
        self.connection_manager = connection_manager
        self.schema_analyzer = schema_analyzer
        self.query_executor = query_executor
        self.visualizer = DatabaseSchemaVisualizer()
        self.config = TableBrowserConfig()
        
        # State management
        self.current_metadata = None
        self.current_connection = None
        self.table_cache = {}
        self.search_filters = {}
    
    def render_table_browser_ui(self) -> None:
        """Render the main table browser interface in Streamlit"""
        if not STREAMLIT_AVAILABLE:
            st.error("Streamlit not available for table browser UI")
            return
        
        st.title("🗃️ Database Table Browser")
        
        # Connection selection
        self._render_connection_selector()
        
        if not self.current_connection:
            st.info("Please select a database connection to browse tables")
            return
        
        # Load schema metadata
        if self._load_schema_metadata():
            # Main browser interface
            col1, col2 = st.columns([1, 2])
            
            with col1:
                self._render_schema_navigator()
            
            with col2:
                self._render_table_details()
        else:
            st.error("Failed to load database schema. Check connection status.")
    
    def _render_connection_selector(self) -> None:
        """Render connection selection interface"""
        connections = self.connection_manager.list_connections()
        
        if not connections:
            st.warning("No database connections configured. Please add a connection first.")
            return
        
        # Connection selection
        connection_names = [conn.name for conn in connections]
        selected_name = st.selectbox(
            "Select Database Connection",
            options=connection_names,
            key="table_browser_connection"
        )
        
        if selected_name:
            connection = self.connection_manager.get_connection(selected_name)
            
            # Show connection info
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Database Type", connection.db_type.value)
            with col2:
                status_color = "🟢" if connection.status.value == "connected" else "🔴"
                st.metric("Status", f"{status_color} {connection.status.value.title()}")
            with col3:
                if connection.last_connected:
                    last_connected = connection.last_connected[:19].replace('T', ' ')
                    st.metric("Last Connected", last_connected)
            
            # Connect if not connected
            if not self.connection_manager.is_connected(selected_name):
                if st.button("Connect to Database", key="connect_btn"):
                    with st.spinner("Connecting..."):
                        success, message = st.session_state.get('connection_result', (False, ""))
                        # Note: In real implementation, would call async connect method
                        if success:
                            st.success(f"Connected successfully: {message}")
                            self.current_connection = selected_name
                        else:
                            st.error(f"Connection failed: {message}")
            else:
                self.current_connection = selected_name
                st.success(f"Connected to {selected_name}")
    
    def _load_schema_metadata(self) -> bool:
        """Load schema metadata for current connection"""
        if not self.current_connection:
            return False
        
        try:
            # Check cache first
            cache_key = f"metadata_{self.current_connection}"
            if cache_key in st.session_state:
                self.current_metadata = st.session_state[cache_key]
                return True
            
            # Load metadata (would be async in real implementation)
            with st.spinner("Loading database schema..."):
                # Note: In real implementation, would call:
                # self.current_metadata = await self.schema_analyzer.analyze_database(
                #     self.connection_manager, self.current_connection
                # )
                
                # For demo, create mock metadata
                self.current_metadata = self._create_mock_metadata()
                
                if self.current_metadata:
                    st.session_state[cache_key] = self.current_metadata
                    return True
                
        except Exception as e:
            logger.error(f"Failed to load schema metadata: {e}")
            st.error(f"Failed to load schema: {e}")
        
        return False
    
    def _render_schema_navigator(self) -> None:
        """Render schema and table navigation panel"""
        st.subheader("📊 Database Schema")
        
        if not self.current_metadata:
            st.error("No schema metadata available")
            return
        
        # Search and filter controls
        search_term = st.text_input(
            "🔍 Search Tables",
            placeholder="Enter table name...",
            key="table_search"
        )
        
        # Schema filter
        schema_names = [schema.name for schema in self.current_metadata.schemas]
        selected_schemas = st.multiselect(
            "Filter by Schema",
            options=schema_names,
            default=schema_names,
            key="schema_filter"
        )
        
        # Table type filter
        table_types = st.multiselect(
            "Table Types",
            options=["BASE TABLE", "VIEW", "MATERIALIZED VIEW"],
            default=["BASE TABLE", "VIEW"],
            key="table_type_filter"
        )
        
        # Browser configuration
        with st.expander("⚙️ Browser Settings"):
            self.config.preview_row_limit = st.number_input(
                "Preview Row Limit", 
                min_value=10, max_value=1000, 
                value=self.config.preview_row_limit
            )
            self.config.show_system_tables = st.checkbox(
                "Show System Tables",
                value=self.config.show_system_tables
            )
            self.config.search_case_sensitive = st.checkbox(
                "Case Sensitive Search",
                value=self.config.search_case_sensitive
            )
        
        st.divider()
        
        # Display filtered tables
        filtered_tables = self._filter_tables(search_term, selected_schemas, table_types)
        
        if not filtered_tables:
            st.info("No tables match the current filters")
            return
        
        st.write(f"**Found {len(filtered_tables)} tables**")
        
        # Render table list
        for schema_name, tables in filtered_tables.items():
            with st.expander(f"📁 {schema_name} ({len(tables)} tables)", expanded=True):
                for table in tables:
                    # Table selection button
                    button_key = f"select_{schema_name}_{table.name}"
                    if st.button(
                        f"📋 {table.name} ({table.table_type})",
                        key=button_key,
                        use_container_width=True
                    ):
                        st.session_state.selected_table = (schema_name, table.name)
                    
                    # Show basic info
                    col1, col2 = st.columns(2)
                    with col1:
                        st.caption(f"Columns: {len(table.columns)}")
                    with col2:
                        if table.row_count:
                            st.caption(f"Rows: {table.row_count:,}")
    
    def _render_table_details(self) -> None:
        """Render detailed table information and data preview"""
        selected_table = st.session_state.get('selected_table')
        
        if not selected_table:
            st.info("👈 Select a table from the schema navigator to view details")
            return
        
        schema_name, table_name = selected_table
        table_info = self._get_table_info(schema_name, table_name)
        
        if not table_info:
            st.error(f"Table {schema_name}.{table_name} not found")
            return
        
        # Table header
        st.subheader(f"📋 {schema_name}.{table_name}")
        
        # Table statistics
        stats = self.visualizer.get_table_statistics(table_info)
        self._render_table_statistics(stats)
        
        # Tab interface for different views
        tab1, tab2, tab3, tab4 = st.tabs([
            "📊 Structure", 
            "🔍 Data Preview", 
            "📈 Visualizations",
            "📝 Documentation"
        ])
        
        with tab1:
            self._render_table_structure(table_info)
        
        with tab2:
            self._render_data_preview(table_info)
        
        with tab3:
            self._render_table_visualizations(table_info)
        
        with tab4:
            self._render_table_documentation(table_info)
    
    def _render_table_statistics(self, stats: Dict[str, Any]) -> None:
        """Render table statistics in metrics format"""
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "Total Columns", 
                stats["basic_info"]["total_columns"]
            )
        
        with col2:
            st.metric(
                "Primary Keys",
                stats["column_analysis"]["primary_keys"]
            )
        
        with col3:
            st.metric(
                "Foreign Keys",
                stats["column_analysis"]["foreign_keys"]
            )
        
        with col4:
            if stats["size_info"]["estimated_rows"] != "Unknown":
                st.metric(
                    "Estimated Rows",
                    f"{stats['size_info']['estimated_rows']:,}"
                )
            else:
                st.metric("Estimated Rows", "Unknown")
        
        # Additional info in expandable section
        with st.expander("📊 Detailed Statistics"):
            col1, col2 = st.columns(2)
            
            with col1:
                st.write("**Column Analysis:**")
                st.write(f"- Nullable columns: {stats['column_analysis']['nullable_columns']}")
                st.write(f"- Indexed columns: {stats['column_analysis']['indexed_columns']}")
                st.write(f"- Unique columns: {stats['column_analysis']['unique_columns']}")
            
            with col2:
                st.write("**Size Information:**")
                st.write(f"- Size: {stats['size_info']['size_formatted']}")
                st.write(f"- Type: {stats['basic_info']['type']}")
                if stats["basic_info"]["comment"] != "No description":
                    st.write(f"- Description: {stats['basic_info']['comment']}")
    
    def _render_table_structure(self, table_info: TableInfo) -> None:
        """Render table structure with column details"""
        # Generate column data for display
        columns_data = self.visualizer.create_column_browser_table(table_info)
        
        if not columns_data:
            st.warning("No column information available")
            return
        
        # Convert to DataFrame for display
        df = pd.DataFrame(columns_data)
        
        # Column search and filter
        col1, col2 = st.columns([2, 1])
        with col1:
            column_search = st.text_input(
                "🔍 Search Columns",
                placeholder="Enter column name...",
                key=f"column_search_{table_info.name}"
            )
        
        with col2:
            show_only_keys = st.checkbox(
                "Show only key columns",
                key=f"keys_only_{table_info.name}"
            )
        
        # Apply filters
        filtered_df = df.copy()
        
        if column_search:
            mask = filtered_df['name'].str.contains(
                column_search, 
                case=not self.config.search_case_sensitive,
                na=False
            )
            filtered_df = filtered_df[mask]
        
        if show_only_keys:
            mask = filtered_df['keys'] != "—"
            filtered_df = filtered_df[mask]
        
        # Display table
        st.dataframe(
            filtered_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "position": st.column_config.NumberColumn("Pos", width="small"),
                "name": st.column_config.TextColumn("Column Name", width="medium"),
                "type": st.column_config.TextColumn("Data Type", width="medium"),
                "nullable": st.column_config.TextColumn("Nullable", width="small"),
                "default": st.column_config.TextColumn("Default", width="medium"),
                "keys": st.column_config.TextColumn("Keys", width="medium"),
                "foreign_reference": st.column_config.TextColumn("FK Reference", width="medium"),
                "comment": st.column_config.TextColumn("Comment", width="large")
            }
        )
        
        # Export option
        if st.button("📥 Export Column Schema", key=f"export_schema_{table_info.name}"):
            csv = filtered_df.to_csv(index=False)
            st.download_button(
                "Download CSV",
                csv,
                f"{table_info.schema}_{table_info.name}_schema.csv",
                "text/csv"
            )
    
    def _render_data_preview(self, table_info: TableInfo) -> None:
        """Render data preview with pagination and filtering"""
        if not self.config.enable_data_preview:
            st.info("Data preview is disabled in settings")
            return
        
        # Preview controls
        col1, col2, col3 = st.columns(3)
        
        with col1:
            limit = st.number_input(
                "Rows to preview",
                min_value=1,
                max_value=self.config.preview_row_limit,
                value=min(50, self.config.preview_row_limit),
                key=f"preview_limit_{table_info.name}"
            )
        
        with col2:
            offset = st.number_input(
                "Start from row",
                min_value=0,
                value=0,
                key=f"preview_offset_{table_info.name}"
            )
        
        with col3:
            if st.button("🔄 Refresh Data", key=f"refresh_data_{table_info.name}"):
                # Clear cache and reload
                cache_key = f"data_preview_{table_info.schema}_{table_info.name}"
                if cache_key in st.session_state:
                    del st.session_state[cache_key]
        
        # Custom WHERE clause
        where_clause = st.text_input(
            "Custom WHERE clause (optional)",
            placeholder="e.g., id > 100 AND status = 'active'",
            key=f"where_clause_{table_info.name}"
        )
        
        # Load and display data
        try:
            with st.spinner("Loading data preview..."):
                data = self._load_table_data(table_info, limit, offset, where_clause)
                
                if data:
                    st.dataframe(
                        data,
                        use_container_width=True,
                        height=400
                    )
                    
                    # Data info
                    st.caption(f"Showing {len(data)} rows (offset: {offset})")
                    
                    # Export option
                    if self.config.enable_export and st.button(
                        "📥 Export Preview Data", 
                        key=f"export_data_{table_info.name}"
                    ):
                        csv = data.to_csv(index=False)
                        st.download_button(
                            "Download CSV",
                            csv,
                            f"{table_info.schema}_{table_info.name}_data.csv",
                            "text/csv"
                        )
                else:
                    st.info("No data found or table is empty")
                    
        except Exception as e:
            st.error(f"Failed to load data preview: {e}")
    
    def _render_table_visualizations(self, table_info: TableInfo) -> None:
        """Render table-specific visualizations"""
        config = SchemaVisualizationConfig()
        
        # Table structure visualization
        viz_data = self.visualizer.create_table_detail_view(table_info, config)
        
        if viz_data and viz_data.get('fig'):
            st.plotly_chart(viz_data['fig'], use_container_width=True)
        else:
            st.info("No visualizations available for this table")
        
        # Data distribution charts (if data is available)
        if self.config.enable_data_preview:
            with st.expander("📊 Data Distribution Analysis"):
                self._render_data_distribution_charts(table_info)
    
    def _render_data_distribution_charts(self, table_info: TableInfo) -> None:
        """Render data distribution charts for numeric columns"""
        try:
            # Load sample data for analysis
            sample_data = self._load_table_data(table_info, limit=1000)
            
            if sample_data is None or sample_data.empty:
                st.info("No data available for distribution analysis")
                return
            
            # Find numeric columns
            numeric_columns = sample_data.select_dtypes(include=['number']).columns
            
            if len(numeric_columns) == 0:
                st.info("No numeric columns found for distribution analysis")
                return
            
            # Create distribution charts
            for col in numeric_columns[:5]:  # Limit to first 5 numeric columns
                fig = px.histogram(
                    sample_data,
                    x=col,
                    title=f"Distribution of {col}",
                    template="plotly_dark"
                )
                st.plotly_chart(fig, use_container_width=True)
                
        except Exception as e:
            st.error(f"Failed to create distribution charts: {e}")
    
    def _render_table_documentation(self, table_info: TableInfo) -> None:
        """Render table documentation and metadata"""
        # Basic information
        st.subheader("📋 Table Information")
        
        info_data = {
            "Schema": table_info.schema,
            "Table Name": table_info.name,
            "Table Type": table_info.table_type,
            "Total Columns": len(table_info.columns),
            "Estimated Rows": table_info.row_count or "Unknown",
            "Size": self.visualizer._format_bytes(table_info.size_bytes) if table_info.size_bytes else "Unknown",
            "Created At": table_info.created_at or "Unknown",
            "Last Modified": table_info.last_modified or "Unknown",
            "Comment": table_info.comment or "No description available"
        }
        
        for key, value in info_data.items():
            st.write(f"**{key}:** {value}")
        
        st.divider()
        
        # Generate documentation
        st.subheader("📝 Generated Documentation")
        
        doc = f"## Table: {table_info.schema}.{table_info.name}\n\n"
        
        if table_info.comment:
            doc += f"**Description:** {table_info.comment}\n\n"
        
        doc += f"**Type:** {table_info.table_type}\n"
        doc += f"**Columns:** {len(table_info.columns)}\n\n"
        
        doc += "### Column Details\n\n"
        doc += "| Column | Type | Nullable | Default | Keys | Comment |\n"
        doc += "|--------|------|----------|---------|------|----------|\n"
        
        for col in table_info.columns:
            keys = []
            if col.is_primary_key:
                keys.append("PK")
            if col.is_foreign_key:
                keys.append("FK")
            if col.is_unique:
                keys.append("UQ")
            
            type_info = col.data_type
            if col.max_length:
                type_info += f"({col.max_length})"
            
            doc += f"| {col.name} | {type_info} | {'Yes' if col.is_nullable else 'No'} | {col.default_value or '—'} | {' '.join(keys) or '—'} | {col.comment or '—'} |\n"
        
        st.markdown(doc)
        
        # Download documentation
        if st.button("📥 Download Documentation", key=f"download_doc_{table_info.name}"):
            st.download_button(
                "Download Markdown",
                doc,
                f"{table_info.schema}_{table_info.name}_documentation.md",
                "text/markdown"
            )
    
    def _filter_tables(self, search_term: str, selected_schemas: List[str], 
                      table_types: List[str]) -> Dict[str, List[TableInfo]]:
        """Filter tables based on search criteria"""
        filtered = {}
        
        for schema in self.current_metadata.schemas:
            if schema.name not in selected_schemas:
                continue
            
            schema_tables = []
            
            # Filter tables
            for table in schema.tables:
                if table.table_type not in table_types:
                    continue
                
                if search_term:
                    if self.config.search_case_sensitive:
                        if search_term not in table.name:
                            continue
                    else:
                        if search_term.lower() not in table.name.lower():
                            continue
                
                schema_tables.append(table)
            
            # Filter views
            if "VIEW" in table_types or "MATERIALIZED VIEW" in table_types:
                for view in schema.views:
                    if view.table_type not in table_types:
                        continue
                    
                    if search_term:
                        if self.config.search_case_sensitive:
                            if search_term not in view.name:
                                continue
                        else:
                            if search_term.lower() not in view.name.lower():
                                continue
                    
                    schema_tables.append(view)
            
            if schema_tables:
                filtered[schema.name] = sorted(schema_tables, key=lambda t: t.name)
        
        return filtered
    
    def _get_table_info(self, schema_name: str, table_name: str) -> Optional[TableInfo]:
        """Get table information from metadata"""
        for schema in self.current_metadata.schemas:
            if schema.name == schema_name:
                # Check tables
                for table in schema.tables:
                    if table.name == table_name:
                        return table
                
                # Check views
                for view in schema.views:
                    if view.name == table_name:
                        return view
        
        return None
    
    def _load_table_data(self, table_info: TableInfo, limit: int = 100, 
                        offset: int = 0, where_clause: str = "") -> Optional[pd.DataFrame]:
        """Load data from table for preview"""
        try:
            # Build query
            query = f"SELECT * FROM {table_info.schema}.{table_info.name}"
            
            if where_clause.strip():
                query += f" WHERE {where_clause}"
            
            query += f" LIMIT {limit}"
            
            if offset > 0:
                query += f" OFFSET {offset}"
            
            # Execute query (would be async in real implementation)
            # result = await self.query_executor.execute_query(
            #     self.connection_manager, self.current_connection, query
            # )
            
            # For demo, return mock data
            return self._create_mock_data(table_info, limit)
            
        except Exception as e:
            logger.error(f"Failed to load table data: {e}")
            return None
    
    def _create_mock_metadata(self) -> DatabaseMetadata:
        """Create mock metadata for testing"""
        # This would be replaced with actual metadata loading
        from .schema_analyzer import DatabaseMetadata, SchemaInfo, TableInfo, ColumnInfo
        
        # Create mock columns
        personnel_columns = [
            ColumnInfo("id", "TEXT", False, None, None, None, None, True, False),
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("role", "TEXT", True, None, None, None, None, False, False),
            ColumnInfo("organization_id", "TEXT", True, None, None, None, None, False, True, "organizations", "id"),
        ]
        
        org_columns = [
            ColumnInfo("id", "TEXT", False, None, None, None, None, True, False),
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("type", "TEXT", True, None, None, None, None, False, False),
        ]
        
        # Create mock tables
        personnel_table = TableInfo(
            "personnel", "public", "BASE TABLE", personnel_columns,
            row_count=465, size_bytes=102400, comment="UFO/UAP disclosure personnel database"
        )
        
        organizations_table = TableInfo(
            "organizations", "public", "BASE TABLE", org_columns,
            row_count=200, size_bytes=51200, comment="Organizations involved in UFO/UAP research"
        )
        
        # Create mock schema
        public_schema = SchemaInfo(
            "public", [personnel_table, organizations_table], []
        )
        
        # Create mock metadata
        return DatabaseMetadata(
            "ultraterrestrial", "PostgreSQL", "14.0",
            [public_schema], 2, 0, 153600,
            datetime.now().isoformat()
        )
    
    def _create_mock_data(self, table_info: TableInfo, limit: int) -> pd.DataFrame:
        """Create mock data for testing"""
        if table_info.name == "personnel":
            data = {
                "id": [f"person_{i}" for i in range(1, limit + 1)],
                "name": [f"Person {i}" for i in range(1, limit + 1)],
                "role": [f"Role {i % 5}" for i in range(1, limit + 1)],
                "organization_id": [f"org_{i % 10}" for i in range(1, limit + 1)]
            }
        elif table_info.name == "organizations":
            data = {
                "id": [f"org_{i}" for i in range(1, limit + 1)],
                "name": [f"Organization {i}" for i in range(1, limit + 1)],
                "type": [f"Type {i % 3}" for i in range(1, limit + 1)]
            }
        else:
            # Generic mock data
            data = {col.name: [f"Value {i}" for i in range(1, limit + 1)] 
                   for col in table_info.columns}
        
        return pd.DataFrame(data)


if __name__ == "__main__":
    # Test the table browser
    def test_table_browser():
        print("Database table browser initialized")
        print("Table browser ready for use")
    
    test_table_browser()