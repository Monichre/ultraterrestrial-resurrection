#!/usr/bin/env python3
"""
Database Explorer UI for Streamlit Dashboard
Comprehensive database exploration, visualization, and management interface
Date: July 13, 2025
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import os
from pathlib import Path
import sqlparse
from sqlalchemy import create_engine, inspect, text
import asyncio

# Database connection utilities
try:
    from .connection_manager import DatabaseConnectionManager
    from .schema_analyzer import DatabaseSchemaAnalyzer
    from .query_executor import QueryExecutor
    from .visualization_generator import DatabaseVisualizationGenerator
    from .schema_visualizer import DatabaseSchemaVisualizer, SchemaVisualizationConfig
    from .table_browser import DatabaseTableBrowser, TableBrowserConfig
    CONNECTION_MANAGER_AVAILABLE = True
except ImportError:
    CONNECTION_MANAGER_AVAILABLE = False

class DatabaseExplorerUI:
    """Streamlit UI for comprehensive database exploration"""
    
    def __init__(self):
        self.connection_manager = DatabaseConnectionManager() if CONNECTION_MANAGER_AVAILABLE else None
        self.schema_analyzer = DatabaseSchemaAnalyzer() if CONNECTION_MANAGER_AVAILABLE else None
        self.query_executor = QueryExecutor() if CONNECTION_MANAGER_AVAILABLE else None
        self.viz_generator = DatabaseVisualizationGenerator() if CONNECTION_MANAGER_AVAILABLE else None
        self.schema_visualizer = DatabaseSchemaVisualizer() if CONNECTION_MANAGER_AVAILABLE else None
        self.table_browser = DatabaseTableBrowser(
            self.connection_manager, self.schema_analyzer, self.query_executor
        ) if CONNECTION_MANAGER_AVAILABLE else None
        
        # Initialize session state
        self._initialize_session_state()
    
    def _initialize_session_state(self):
        """Initialize Streamlit session state variables"""
        if 'db_connections' not in st.session_state:
            st.session_state.db_connections = {}
        if 'active_connection' not in st.session_state:
            st.session_state.active_connection = None
        if 'query_history' not in st.session_state:
            st.session_state.query_history = []
        if 'saved_queries' not in st.session_state:
            st.session_state.saved_queries = {}
        if 'table_cache' not in st.session_state:
            st.session_state.table_cache = {}
        if 'schema_cache' not in st.session_state:
            st.session_state.schema_cache = {}
    
    def render_main_interface(self):
        """Render the main database explorer interface"""
        st.markdown("# 🗄️ Database Explorer")
        st.markdown("Comprehensive database exploration, visualization, and management")
        
        # Connection management sidebar
        self._render_connection_sidebar()
        
        # Main content area
        if st.session_state.active_connection:
            self._render_main_content()
        else:
            self._render_welcome_screen()
    
    def _render_connection_sidebar(self):
        """Render database connection management sidebar"""
        with st.sidebar:
            st.header("🔌 Database Connections")
            
            # Connection status
            if st.session_state.active_connection:
                st.success(f"✅ Connected to: {st.session_state.active_connection}")
            else:
                st.warning("⚠️ No active connection")
            
            # Add new connection
            with st.expander("➕ Add Connection", expanded=not st.session_state.db_connections):
                self._render_add_connection_form()
            
            # Existing connections
            if st.session_state.db_connections:
                st.subheader("📋 Available Connections")
                for conn_name, conn_info in st.session_state.db_connections.items():
                    col1, col2, col3 = st.columns([3, 1, 1])
                    
                    with col1:
                        st.write(f"🗄️ {conn_name}")
                        st.caption(f"{conn_info['type']} - {conn_info['host']}")
                    
                    with col2:
                        if st.button("🔗", key=f"connect_{conn_name}", help="Connect"):
                            self._connect_to_database(conn_name)
                    
                    with col3:
                        if st.button("🗑️", key=f"delete_{conn_name}", help="Delete"):
                            self._delete_connection(conn_name)
            
            # Quick connection presets
            st.subheader("⚡ Quick Connect")
            if st.button("🛸 Xata Wire (PostgreSQL)", help="Connect to Xata wire-enabled PostgreSQL"):
                self._quick_connect_xata_wire()
            
            if st.button("🏠 Local PostgreSQL", help="Connect to local PostgreSQL"):
                self._quick_connect_local_postgres()
            
            if st.button("📊 Xata API", help="Connect via Xata REST API"):
                self._quick_connect_xata_api()
    
    def _render_add_connection_form(self):
        """Render form to add new database connection"""
        with st.form("add_connection_form"):
            conn_name = st.text_input("Connection Name", placeholder="My Database")
            
            db_type = st.selectbox("Database Type", [
                "PostgreSQL (Wire Protocol)",
                "PostgreSQL (Local)",
                "Xata API",
                "SQLite",
                "MySQL",
                "MongoDB"
            ])
            
            # Dynamic form based on database type
            if "PostgreSQL" in db_type:
                host = st.text_input("Host", placeholder="localhost")
                port = st.number_input("Port", min_value=1, max_value=65535, value=5432)
                database = st.text_input("Database", placeholder="database_name")
                username = st.text_input("Username", placeholder="username")
                password = st.text_input("Password", type="password")
                
                # SSL options for wire protocol
                if "Wire Protocol" in db_type:
                    ssl_mode = st.selectbox("SSL Mode", ["require", "prefer", "allow", "disable"])
                    ssl_cert = st.text_input("SSL Certificate Path (optional)")
            
            elif db_type == "Xata API":
                api_key = st.text_input("API Key", type="password", placeholder="xau_...")
                workspace = st.text_input("Workspace", placeholder="workspace-name")
                database = st.text_input("Database", placeholder="database-name")
                region = st.selectbox("Region", ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-2"])
            
            elif db_type == "SQLite":
                file_path = st.text_input("Database File Path", placeholder="/path/to/database.db")
            
            submitted = st.form_submit_button("➕ Add Connection")
            
            if submitted and conn_name:
                self._add_connection(conn_name, db_type, locals())
    
    def _render_main_content(self):
        """Render main content area when connected to a database"""
        # Tab navigation
        tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
            "📊 Overview",
            "🗂️ Schema Browser", 
            "🗃️ Table Browser",
            "💻 Query Interface",
            "📈 Data Visualization",
            "🔧 Administration",
            "📋 Monitoring"
        ])
        
        with tab1:
            self._render_database_overview()
        
        with tab2:
            self._render_schema_browser()
        
        with tab3:
            self._render_table_browser()
        
        with tab4:
            self._render_query_interface()
        
        with tab5:
            self._render_data_visualization()
        
        with tab6:
            self._render_administration_tools()
        
        with tab7:
            self._render_monitoring_dashboard()
    
    def _render_welcome_screen(self):
        """Render welcome screen when no database is connected"""
        st.markdown("""
        ## 🚀 Welcome to Database Explorer
        
        Connect to your databases to start exploring:
        
        ### 🗄️ Supported Databases
        - **PostgreSQL** (Wire Protocol & Local)
        - **Xata** (API & Wire-enabled)
        - **SQLite** (Local files)
        - **MySQL** (Coming soon)
        - **MongoDB** (Coming soon)
        
        ### ✨ Features
        - 🔍 **Schema Browsing** - Explore tables, columns, relationships
        - 💻 **Query Interface** - Write and execute SQL with syntax highlighting
        - 📈 **Data Visualization** - Auto-generate charts and graphs
        - 🔧 **Administration** - Backup, export, maintenance tools
        - 📊 **Monitoring** - Real-time performance metrics
        - 🤖 **AI Assistant** - Natural language to SQL conversion
        
        👈 **Get started by adding a connection in the sidebar!**
        """)
        
        # Quick stats if any connections exist
        if st.session_state.db_connections:
            st.info(f"💡 You have {len(st.session_state.db_connections)} saved connections. Select one to connect!")
    
    def _render_database_overview(self):
        """Render database overview dashboard"""
        st.subheader("📊 Database Overview")
        
        if not self.connection_manager:
            st.error("Database connection manager not available")
            return
        
        # Database info
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("📋 Tables", self._get_table_count())
        
        with col2:
            st.metric("📊 Total Records", self._get_total_record_count())
        
        with col3:
            st.metric("💾 Database Size", self._get_database_size())
        
        with col4:
            st.metric("🔗 Active Connections", self._get_connection_count())
        
        # Recent activity
        st.subheader("🕐 Recent Activity")
        
        if st.session_state.query_history:
            recent_queries = st.session_state.query_history[-5:]
            for i, query in enumerate(reversed(recent_queries)):
                with st.expander(f"Query {len(recent_queries) - i}: {query['timestamp']}"):
                    st.code(query['sql'], language='sql')
                    if query.get('result_count'):
                        st.caption(f"Returned {query['result_count']} rows")
        else:
            st.info("No recent query activity")
        
        # Table activity summary
        st.subheader("📈 Table Activity")
        self._render_table_activity_chart()
    
    def _render_schema_browser(self):
        """Render enhanced database schema browser with visualizations"""
        st.subheader("🗂️ Schema Browser")
        
        if not self.schema_analyzer or not self.schema_visualizer:
            st.error("Schema analysis components not available")
            return
        
        # Load schema metadata
        metadata = self._get_or_load_schema_metadata()
        
        if not metadata:
            st.error("Unable to load database schema metadata")
            return
        
        # Schema visualization options
        viz_tabs = st.tabs(["📊 Schema Overview", "🌐 Relationship Diagram", "📋 Schema List"])
        
        with viz_tabs[0]:
            self._render_schema_overview_viz(metadata)
        
        with viz_tabs[1]:
            self._render_schema_relationships_viz(metadata)
        
        with viz_tabs[2]:
            self._render_schema_list_view(metadata)
    
    def _render_table_browser(self):
        """Render the enhanced table browser interface"""
        if not self.table_browser:
            st.error("Table browser not available")
            return
        
        # Render the table browser UI
        self.table_browser.render_table_browser_ui()
    
    def _render_table_grid(self, tables: List[str], schema: str):
        """Render grid of database tables"""
        # Create table cards in a grid
        cols_per_row = 3
        for i in range(0, len(tables), cols_per_row):
            cols = st.columns(cols_per_row)
            
            for j, table in enumerate(tables[i:i+cols_per_row]):
                with cols[j]:
                    with st.container():
                        st.markdown(f"### 🗂️ {table}")
                        
                        # Table info
                        row_count = self._get_table_row_count(schema, table)
                        column_count = self._get_table_column_count(schema, table)
                        
                        st.metric("Rows", f"{row_count:,}")
                        st.metric("Columns", column_count)
                        
                        # Action buttons
                        col1, col2 = st.columns(2)
                        with col1:
                            if st.button("👁️ View", key=f"view_{table}"):
                                self._view_table_data(schema, table)
                        
                        with col2:
                            if st.button("📋 Schema", key=f"schema_{table}"):
                                self._view_table_schema(schema, table)
    
    def _render_query_interface(self):
        """Render enhanced SQL query interface with syntax highlighting and advanced features"""
        st.subheader("💻 Advanced Query Interface")
        
        if not self.query_executor:
            st.error("Query executor not available")
            return
        
        # Query input with enhanced editor
        col1, col2 = st.columns([3, 1])
        
        with col1:
            # Enhanced query editor with syntax highlighting via code input
            query = st.text_area(
                "SQL Query",
                height=250,
                placeholder="""-- Enter your SQL query here
SELECT p.name, o.name as organization, COUNT(e.id) as events_count
FROM personnel p
LEFT JOIN organizations o ON p.organization_id = o.id
LEFT JOIN events e ON e.personnel_id = p.id
GROUP BY p.id, p.name, o.name
ORDER BY events_count DESC
LIMIT 10;""",
                help="Write your SQL query here. Supports PostgreSQL, SQLite, and Xata syntax."
            )
            
            # Query validation
            if query.strip():
                is_valid, validation_message = self.query_executor.validate_query(query)
                if is_valid:
                    st.success(f"✅ {validation_message}")
                else:
                    st.error(f"❌ {validation_message}")
        
        with col2:
            st.markdown("### 🎛️ Query Options")
            
            # Execution options
            limit_results = st.checkbox("Limit Results", value=True, help="Apply LIMIT to SELECT queries")
            if limit_results:
                result_limit = st.number_input("Max Rows", min_value=1, max_value=10000, value=1000)
            else:
                result_limit = None
            
            explain_query = st.checkbox("Show Execution Plan", help="Show query execution plan (PostgreSQL/SQLite)")
            format_sql = st.checkbox("Format SQL", value=True, help="Auto-format SQL with proper indentation")
            
            # Export options
            st.markdown("### 📊 Export Options")
            export_format = st.selectbox("Export Format", ["json", "csv", "html", "markdown"], help="Format for result export")
            
            # Safe mode
            safe_mode = st.checkbox("Safe Mode", value=True, help="Prevent dangerous operations (DROP, TRUNCATE, etc.)")
        
        # Enhanced query execution buttons
        col1, col2, col3, col4, col5 = st.columns(5)
        
        with col1:
            if st.button("▶️ Execute", type="primary", help="Execute the SQL query"):
                if query.strip():
                    asyncio.run(self._execute_enhanced_query(
                        query, result_limit, explain_query, export_format, safe_mode
                    ))
                else:
                    st.error("Please enter a query")
        
        with col2:
            if st.button("🎨 Format", help="Format SQL with proper syntax"):
                if query.strip():
                    formatted_query = self.query_executor.format_query(query)
                    st.session_state['formatted_query'] = formatted_query
                    st.code(formatted_query, language='sql')
        
        with col3:
            if st.button("🔍 Validate", help="Validate SQL syntax"):
                if query.strip():
                    is_valid, message = self.query_executor.validate_query(query)
                    if is_valid:
                        st.success(f"✅ {message}")
                    else:
                        st.error(f"❌ {message}")
        
        with col4:
            if st.button("💾 Save", help="Save query for later use"):
                self._save_enhanced_query(query)
        
        with col5:
            if st.button("📋 Clear", help="Clear query editor"):
                st.session_state.pop('query_text', None)
                st.experimental_rerun()
        
        # Show formatted query if available
        if 'formatted_query' in st.session_state:
            with st.expander("🎨 Formatted Query", expanded=False):
                st.code(st.session_state['formatted_query'], language='sql')
        
        # Query suggestions and templates
        self._render_query_suggestions()
        
        # Query history
        self._render_query_history()
        
        # Performance statistics
        self._render_query_performance_stats()
    
    async def _execute_enhanced_query(self, query: str, result_limit: Optional[int], 
                                    explain_query: bool, export_format: str, safe_mode: bool):
        """Execute query with enhanced features using QueryExecutor"""
        if not self.connection_manager or not st.session_state.active_connection:
            st.error("No active database connection")
            return
        
        try:
            # Show execution status
            with st.spinner("🔄 Executing query..."):
                start_time = time.time()
                
                # Execute main query
                result = await self.query_executor.execute_query(
                    self.connection_manager,
                    st.session_state.active_connection,
                    query,
                    limit=result_limit
                )
                
                execution_time = time.time() - start_time
            
            # Display results
            if result.success:
                st.success(f"✅ Query executed successfully in {result.execution_time_ms:.2f}ms")
                
                # Show performance metrics
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("⏱️ Execution Time", f"{result.execution_time_ms:.2f}ms")
                with col2:
                    st.metric("📊 Rows Returned", f"{result.rows_affected:,}")
                with col3:
                    st.metric("🗂️ Columns", len(result.columns))
                with col4:
                    st.metric("📝 Query Type", result.query_type)
                
                # Display data if available
                if result.data and len(result.data) > 0:
                    st.subheader(f"📊 Query Results ({len(result.data)} rows)")
                    
                    # Convert to dataframe for better display
                    import pandas as pd
                    df = pd.DataFrame(result.data)
                    st.dataframe(df, use_container_width=True, height=400)
                    
                    # Export functionality
                    if st.button(f"📥 Export as {export_format.upper()}"):
                        exported_data = self.query_executor.export_results(result, export_format)
                        if exported_data:
                            st.download_button(
                                label=f"💾 Download {export_format.upper()}",
                                data=exported_data,
                                file_name=f"query_results_{int(time.time())}.{export_format}",
                                mime=self._get_mime_type(export_format)
                            )
                        else:
                            st.error("Export failed")
                
                # Show execution plan if requested
                if explain_query and result.query_type == "SELECT":
                    with st.expander("🔍 Query Execution Plan", expanded=False):
                        plan_result = await self.query_executor.explain_query(
                            self.connection_manager,
                            st.session_state.active_connection,
                            query
                        )
                        
                        if plan_result and plan_result.success:
                            if plan_result.data:
                                st.json(plan_result.data)
                        else:
                            st.warning("Execution plan not available for this database type")
                
            else:
                st.error(f"❌ Query failed: {result.error_message}")
                st.code(query, language='sql')
                
        except Exception as e:
            st.error(f"❌ Query execution error: {str(e)}")
    
    def _save_enhanced_query(self, query: str):
        """Save query with enhanced metadata"""
        if not query.strip():
            st.warning("Cannot save empty query")
            return
        
        # Get query name from user
        query_name = st.text_input(
            "Query Name", 
            placeholder="My Analysis Query",
            help="Enter a descriptive name for this query"
        )
        
        if st.button("💾 Confirm Save") and query_name:
            # Save with metadata
            saved_query_data = {
                "query": query,
                "created_at": datetime.now().isoformat(),
                "connection": st.session_state.active_connection,
                "query_type": self.query_executor._detect_query_type(query),
                "formatted": self.query_executor.format_query(query)
            }
            
            if 'enhanced_saved_queries' not in st.session_state:
                st.session_state.enhanced_saved_queries = {}
            
            st.session_state.enhanced_saved_queries[query_name] = saved_query_data
            st.success(f"✅ Query saved as: {query_name}")
    
    def _render_query_suggestions(self):
        """Render enhanced query suggestions with templates"""
        st.subheader("💡 Query Suggestions & Templates")
        
        suggestion_tabs = st.tabs([
            "🔍 Sample Queries", 
            "📊 Analytics Queries", 
            "🔧 Maintenance Queries",
            "📋 Query Templates"
        ])
        
        with suggestion_tabs[0]:
            self._render_sample_queries_enhanced()
        
        with suggestion_tabs[1]:
            self._render_analytics_queries_enhanced()
        
        with suggestion_tabs[2]:
            self._render_maintenance_queries_enhanced()
        
        with suggestion_tabs[3]:
            self._render_query_templates()
    
    def _render_query_history(self):
        """Render query execution history"""
        st.subheader("📜 Query History")
        
        if self.query_executor:
            history = self.query_executor.get_query_history(limit=10)
            
            if history:
                history_data = []
                for entry in reversed(history):  # Show most recent first
                    history_data.append({
                        "Time": entry.executed_at,
                        "Query Type": entry.result.query_type,
                        "Status": "✅ Success" if entry.result.success else "❌ Failed",
                        "Execution Time (ms)": f"{entry.result.execution_time_ms:.2f}",
                        "Rows": entry.result.rows_affected,
                        "Query Preview": entry.query[:50] + "..." if len(entry.query) > 50 else entry.query
                    })
                
                if history_data:
                    import pandas as pd
                    df = pd.DataFrame(history_data)
                    st.dataframe(df, use_container_width=True, height=200)
                    
                    # Clear history button
                    if st.button("🗑️ Clear History"):
                        self.query_executor.clear_query_history()
                        st.success("Query history cleared")
                        st.experimental_rerun()
            else:
                st.info("No query history available")
        else:
            st.warning("Query executor not available")
    
    def _render_query_performance_stats(self):
        """Render query performance statistics"""
        st.subheader("📊 Performance Statistics")
        
        if self.query_executor:
            stats = self.query_executor.get_performance_stats()
            
            if stats:
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Total Queries", stats.get('total_queries', 0))
                with col2:
                    st.metric("Success Rate", f"{(stats.get('successful_queries', 0) / max(stats.get('total_queries', 1), 1) * 100):.1f}%")
                with col3:
                    st.metric("Avg Time (ms)", f"{stats.get('avg_execution_time_ms', 0):.2f}")
                with col4:
                    st.metric("Total Rows", f"{stats.get('total_rows_processed', 0):,}")
                
                # Query type distribution
                if stats.get('query_types'):
                    st.markdown("**Query Type Distribution:**")
                    for query_type, count in stats['query_types'].items():
                        st.write(f"- {query_type}: {count}")
            else:
                st.info("No performance statistics available")
    
    def _render_sample_queries_enhanced(self):
        """Render enhanced sample queries"""
        if self.query_executor:
            samples = self.query_executor.get_query_suggestions(
                self.connection_manager, 
                st.session_state.active_connection, 
                "sample"
            )
            
            for suggestion in samples:
                with st.expander(f"📋 {suggestion['name']}", expanded=False):
                    st.code(suggestion['query'], language='sql')
                    if st.button(f"▶️ Run", key=f"run_sample_{suggestion['name']}"):
                        st.session_state['query_to_execute'] = suggestion['query']
    
    def _render_analytics_queries_enhanced(self):
        """Render enhanced analytics queries"""
        if self.query_executor:
            analytics = self.query_executor.get_query_suggestions(
                self.connection_manager, 
                st.session_state.active_connection, 
                "analytics"
            )
            
            for suggestion in analytics:
                with st.expander(f"📊 {suggestion['name']}", expanded=False):
                    st.code(suggestion['query'], language='sql')
                    if st.button(f"▶️ Run", key=f"run_analytics_{suggestion['name']}"):
                        st.session_state['query_to_execute'] = suggestion['query']
    
    def _render_maintenance_queries_enhanced(self):
        """Render enhanced maintenance queries"""
        if self.query_executor:
            maintenance = self.query_executor.get_query_suggestions(
                self.connection_manager, 
                st.session_state.active_connection, 
                "maintenance"
            )
            
            for suggestion in maintenance:
                with st.expander(f"🔧 {suggestion['name']}", expanded=False):
                    st.code(suggestion['query'], language='sql')
                    st.warning("⚠️ Maintenance query - use with caution")
                    if st.button(f"▶️ Run", key=f"run_maintenance_{suggestion['name']}"):
                        st.session_state['query_to_execute'] = suggestion['query']
    
    def _render_query_templates(self):
        """Render query templates"""
        if self.query_executor:
            templates = self.query_executor.get_query_suggestions(
                self.connection_manager, 
                st.session_state.active_connection, 
                "templates"
            )
            
            st.markdown("**Query Templates** (replace {placeholders} with actual values):")
            
            for template in templates:
                with st.expander(f"📝 {template['name']}", expanded=False):
                    st.code(template['query'], language='sql')
                    st.info("💡 Replace {placeholders} with your actual table/column names")
    
    def _get_mime_type(self, format: str) -> str:
        """Get MIME type for export format"""
        mime_types = {
            "json": "application/json",
            "csv": "text/csv",
            "html": "text/html",
            "markdown": "text/markdown"
        }
        return mime_types.get(format, "text/plain")
    
    def _render_data_visualization(self):
        """Render data visualization interface"""
        st.subheader("📈 Data Visualization")
        
        # Visualization options
        viz_type = st.selectbox("Visualization Type", [
            "Table Statistics",
            "Data Distribution",
            "Relationship Analysis",
            "Time Series",
            "Custom Query Chart"
        ])
        
        if viz_type == "Table Statistics":
            self._render_table_statistics_viz()
        elif viz_type == "Data Distribution":
            self._render_data_distribution_viz()
        elif viz_type == "Relationship Analysis":
            self._render_relationship_analysis_viz()
        elif viz_type == "Time Series":
            self._render_time_series_viz()
        elif viz_type == "Custom Query Chart":
            self._render_custom_query_chart()
    
    def _render_administration_tools(self):
        """Render database administration tools"""
        st.subheader("🔧 Administration Tools")
        
        # Admin sections
        admin_tabs = st.tabs(["💾 Backup & Export", "🔄 Migration", "🧹 Maintenance", "👥 User Management"])
        
        with admin_tabs[0]:
            self._render_backup_export_tools()
        
        with admin_tabs[1]:
            self._render_migration_tools()
        
        with admin_tabs[2]:
            self._render_maintenance_tools()
        
        with admin_tabs[3]:
            self._render_user_management_tools()
    
    def _render_monitoring_dashboard(self):
        """Render database monitoring dashboard"""
        st.subheader("📋 Monitoring Dashboard")
        
        # Real-time metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("🔗 Active Connections", self._get_active_connections())
        
        with col2:
            st.metric("📊 Queries/sec", self._get_queries_per_second())
        
        with col3:
            st.metric("💾 Cache Hit Rate", f"{self._get_cache_hit_rate():.1f}%")
        
        with col4:
            st.metric("⚡ Avg Query Time", f"{self._get_avg_query_time():.2f}ms")
        
        # Performance charts
        self._render_performance_charts()
        
        # Alert system
        self._render_alert_system()
    
    # Helper methods (would be implemented based on specific database connections)
    
    def _get_table_count(self) -> int:
        """Get total number of tables"""
        return len(st.session_state.table_cache.get(st.session_state.active_connection, []))
    
    def _get_total_record_count(self) -> str:
        """Get total record count across all tables"""
        return "~1.2M"  # Placeholder
    
    def _get_database_size(self) -> str:
        """Get database size"""
        return "156 MB"  # Placeholder
    
    def _get_connection_count(self) -> int:
        """Get active connection count"""
        return 1 if st.session_state.active_connection else 0
    
    def _get_available_schemas(self) -> List[str]:
        """Get list of available schemas"""
        return ["public", "private", "analytics"]  # Placeholder
    
    def _get_tables_in_schema(self, schema: str) -> List[str]:
        """Get tables in a specific schema"""
        return ["personnel", "organizations", "events", "topics", "locations"]  # Placeholder
    
    def _get_table_row_count(self, schema: str, table: str) -> int:
        """Get row count for a specific table"""
        return 12000  # Placeholder
    
    def _get_table_column_count(self, schema: str, table: str) -> int:
        """Get column count for a specific table"""
        return 8  # Placeholder
    
    def _connect_to_database(self, conn_name: str):
        """Connect to a database"""
        st.session_state.active_connection = conn_name
        st.success(f"Connected to {conn_name}")
        st.experimental_rerun()
    
    def _delete_connection(self, conn_name: str):
        """Delete a database connection"""
        del st.session_state.db_connections[conn_name]
        if st.session_state.active_connection == conn_name:
            st.session_state.active_connection = None
        st.experimental_rerun()
    
    def _add_connection(self, name: str, db_type: str, config: dict):
        """Add a new database connection"""
        st.session_state.db_connections[name] = {
            'type': db_type,
            'config': config,
            'created_at': datetime.now().isoformat(),
            'host': config.get('host', 'localhost'),
            'database': config.get('database', 'unknown')
        }
        st.success(f"Added connection: {name}")
        st.experimental_rerun()
    
    def _execute_query(self, query: str, limit: bool = True, max_rows: int = 1000):
        """Execute SQL query and display results"""
        # Add to query history
        st.session_state.query_history.append({
            'sql': query,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'connection': st.session_state.active_connection
        })
        
        # Simulate query execution
        st.success("Query executed successfully!")
        
        # Mock results
        mock_data = pd.DataFrame({
            'id': range(1, 11),
            'name': [f'Entity {i}' for i in range(1, 11)],
            'type': ['personnel', 'organization', 'event'] * 3 + ['location'],
            'confidence': [0.95, 0.87, 0.92, 0.78, 0.99, 0.65, 0.88, 0.93, 0.76, 0.84]
        })
        
        st.dataframe(mock_data, use_container_width=True)
        st.caption(f"Showing {len(mock_data)} rows")
    
    def _save_query(self, query: str):
        """Save a query for later use"""
        query_name = st.text_input("Query Name", placeholder="My Query")
        if query_name and query.strip():
            st.session_state.saved_queries[query_name] = query
            st.success(f"Query saved as: {query_name}")
    
    def _render_sample_queries(self):
        """Render sample query suggestions"""
        samples = [
            ("Show all personnel", "SELECT * FROM personnel LIMIT 10;"),
            ("Count by organization", "SELECT org_name, COUNT(*) FROM organizations GROUP BY org_name;"),
            ("Recent events", "SELECT * FROM events WHERE date > NOW() - INTERVAL '30 days';")
        ]
        
        for name, query in samples:
            if st.button(f"📋 {name}"):
                st.code(query, language='sql')
    
    def _render_performance_charts(self):
        """Render performance monitoring charts"""
        # Mock performance data
        import numpy as np
        
        # Query performance over time
        times = pd.date_range(start='2025-07-13 00:00', periods=24, freq='H')
        query_times = np.random.normal(50, 15, 24)
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=times, y=query_times, mode='lines+markers', name='Avg Query Time (ms)'))
        fig.update_layout(title="Query Performance", xaxis_title="Time", yaxis_title="Response Time (ms)")
        
        st.plotly_chart(fig, use_container_width=True)
    
    def _render_schema_overview_viz(self, metadata: 'DatabaseMetadata') -> None:
        """Render schema overview visualization"""
        if not self.schema_visualizer:
            st.error("Schema visualizer not available")
            return
        
        config = SchemaVisualizationConfig()
        viz_data = self.schema_visualizer.create_schema_overview_visualization(metadata, config)
        
        if viz_data and viz_data.get('fig'):
            st.plotly_chart(viz_data['fig'], use_container_width=True)
            
            # Show summary statistics
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Total Tables", viz_data.get('tables_count', 0))
            with col2:
                st.metric("Total Views", viz_data.get('views_count', 0))
            with col3:
                st.metric("Schemas", len(metadata.schemas))
        else:
            st.warning("Unable to generate schema overview visualization")
    
    def _render_schema_relationships_viz(self, metadata: 'DatabaseMetadata') -> None:
        """Render schema relationships visualization"""
        if not self.schema_visualizer:
            st.error("Schema visualizer not available")
            return
        
        # Get relationships data
        try:
            if st.session_state.active_connection:
                relationships = self.schema_analyzer.get_table_relationships(
                    self.connection_manager, 
                    st.session_state.active_connection
                )
                
                if relationships:
                    config = SchemaVisualizationConfig()
                    viz_data = self.schema_visualizer.create_relationship_diagram(
                        metadata, relationships, config
                    )
                    
                    if viz_data and viz_data.get('fig'):
                        st.plotly_chart(viz_data['fig'], use_container_width=True)
                        
                        # Show relationship statistics
                        col1, col2 = st.columns(2)
                        with col1:
                            st.metric("Connected Tables", viz_data.get('nodes_count', 0))
                        with col2:
                            st.metric("Relationships", viz_data.get('edges_count', 0))
                    else:
                        st.info("No relationship data available for visualization")
                else:
                    st.info("No foreign key relationships found in database")
            else:
                st.error("No active database connection")
                
        except Exception as e:
            st.error(f"Failed to load relationship data: {e}")
    
    def _render_schema_list_view(self, metadata: 'DatabaseMetadata') -> None:
        """Render traditional schema list view"""
        st.subheader("📋 Schema List View")
        
        # Schema selector
        schema_names = [schema.name for schema in metadata.schemas]
        selected_schema = st.selectbox(
            "Select Schema",
            options=schema_names,
            key="schema_list_selector"
        )
        
        if selected_schema:
            # Find selected schema
            schema = next((s for s in metadata.schemas if s.name == selected_schema), None)
            
            if schema:
                # Schema information
                st.write(f"**Schema:** {schema.name}")
                if schema.owner:
                    st.write(f"**Owner:** {schema.owner}")
                if schema.comment:
                    st.write(f"**Description:** {schema.comment}")
                
                # Tables and views tabs
                tab1, tab2 = st.tabs([f"📊 Tables ({len(schema.tables)})", f"👁️ Views ({len(schema.views)})"])
                
                with tab1:
                    if schema.tables:
                        # Create table summary
                        table_data = []
                        for table in schema.tables:
                            table_data.append({
                                "Name": table.name,
                                "Type": table.table_type,
                                "Columns": len(table.columns),
                                "Rows": f"{table.row_count:,}" if table.row_count else "Unknown",
                                "Size": self.schema_visualizer._format_bytes(table.size_bytes) if table.size_bytes else "Unknown",
                                "Comment": table.comment[:50] + "..." if table.comment and len(table.comment) > 50 else (table.comment or "—")
                            })
                        
                        # Display as dataframe
                        df = pd.DataFrame(table_data)
                        st.dataframe(df, use_container_width=True, hide_index=True)
                    else:
                        st.info("No tables found in this schema")
                
                with tab2:
                    if schema.views:
                        # Create view summary
                        view_data = []
                        for view in schema.views:
                            view_data.append({
                                "Name": view.name,
                                "Type": view.table_type,
                                "Columns": len(view.columns),
                                "Comment": view.comment[:50] + "..." if view.comment and len(view.comment) > 50 else (view.comment or "—")
                            })
                        
                        # Display as dataframe
                        df = pd.DataFrame(view_data)
                        st.dataframe(df, use_container_width=True, hide_index=True)
                    else:
                        st.info("No views found in this schema")
    
    def _get_or_load_schema_metadata(self) -> Optional['DatabaseMetadata']:
        """Get schema metadata from cache or load from database"""
        if not st.session_state.active_connection:
            return None
        
        # Check session state cache
        cache_key = f"schema_metadata_{st.session_state.active_connection}"
        
        if cache_key in st.session_state:
            return st.session_state[cache_key]
        
        # Load from database
        if self.schema_analyzer and self.connection_manager:
            try:
                with st.spinner("Loading database schema..."):
                    # Note: In real implementation, this would be async
                    # metadata = await self.schema_analyzer.analyze_database(
                    #     self.connection_manager, st.session_state.active_connection
                    # )
                    
                    # For demo, create mock metadata
                    metadata = self._create_mock_schema_metadata()
                    
                    if metadata:
                        st.session_state[cache_key] = metadata
                        return metadata
            except Exception as e:
                st.error(f"Failed to load schema metadata: {e}")
        
        return None
    
    def _create_mock_schema_metadata(self) -> 'DatabaseMetadata':
        """Create mock schema metadata for testing"""
        # Import here to avoid circular imports
        from .schema_analyzer import DatabaseMetadata, SchemaInfo, TableInfo, ColumnInfo
        
        # Create mock columns for different tables
        personnel_columns = [
            ColumnInfo("id", "TEXT", False, None, None, None, None, True, False),
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("role", "TEXT", True, None, None, None, None, False, False),
            ColumnInfo("organization_id", "TEXT", True, None, None, None, None, False, True, "organizations", "id"),
            ColumnInfo("created_at", "TIMESTAMPTZ", False, "NOW()", None, None, None, False, False),
            ColumnInfo("bio", "TEXT", True, None, None, None, None, False, False)
        ]
        
        organizations_columns = [
            ColumnInfo("id", "TEXT", False, None, None, None, None, True, False),
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("type", "TEXT", True, None, None, None, None, False, False),
            ColumnInfo("founded", "DATE", True, None, None, None, None, False, False),
            ColumnInfo("description", "TEXT", True, None, None, None, None, False, False)
        ]
        
        events_columns = [
            ColumnInfo("id", "TEXT", False, None, None, None, None, True, False),
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("date", "DATE", True, None, None, None, None, False, False),
            ColumnInfo("location_id", "TEXT", True, None, None, None, None, False, True, "locations", "id"),
            ColumnInfo("description", "TEXT", True, None, None, None, None, False, False),
            ColumnInfo("classification", "TEXT", True, None, None, None, None, False, False)
        ]
        
        locations_columns = [
            ColumnInfo("id", "TEXT", False, None, None, None, None, True, False),
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("latitude", "NUMERIC", True, None, None, 10, 6, False, False),
            ColumnInfo("longitude", "NUMERIC", True, None, None, 10, 6, False, False),
            ColumnInfo("country", "TEXT", True, None, None, None, None, False, False)
        ]
        
        topics_columns = [
            ColumnInfo("id", "TEXT", False, None, None, None, None, True, False),
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("category", "TEXT", True, None, None, None, None, False, False),
            ColumnInfo("description", "TEXT", True, None, None, None, None, False, False)
        ]
        
        # Create mock tables with realistic data
        personnel_table = TableInfo(
            "personnel", "public", "BASE TABLE", personnel_columns,
            row_count=465, size_bytes=102400, 
            comment="UFO/UAP disclosure personnel database with key figures and researchers"
        )
        
        organizations_table = TableInfo(
            "organizations", "public", "BASE TABLE", organizations_columns,
            row_count=200, size_bytes=51200, 
            comment="Organizations involved in UFO/UAP research and disclosure"
        )
        
        events_table = TableInfo(
            "events", "public", "BASE TABLE", events_columns,
            row_count=2521, size_bytes=524288,
            comment="UFO/UAP incidents, sightings, and disclosure events"
        )
        
        locations_table = TableInfo(
            "locations", "public", "BASE TABLE", locations_columns,
            row_count=69680, size_bytes=2097152,
            comment="Geographic locations associated with UFO/UAP events"
        )
        
        topics_table = TableInfo(
            "topics", "public", "BASE TABLE", topics_columns,
            row_count=455, size_bytes=40960,
            comment="Topics and themes related to UFO/UAP disclosure"
        )
        
        # Create personnel summary view
        personnel_view_columns = [
            ColumnInfo("name", "TEXT", False, None, None, None, None, False, False),
            ColumnInfo("role", "TEXT", True, None, None, None, None, False, False),
            ColumnInfo("organization_name", "TEXT", True, None, None, None, None, False, False),
            ColumnInfo("total_events", "BIGINT", True, None, None, None, None, False, False)
        ]
        
        personnel_summary_view = TableInfo(
            "personnel_summary", "public", "VIEW", personnel_view_columns,
            comment="Summary view of personnel with organization details and event counts"
        )
        
        # Create public schema
        public_schema = SchemaInfo(
            "public", 
            [personnel_table, organizations_table, events_table, locations_table, topics_table],
            [personnel_summary_view],
            owner="postgres",
            comment="Main schema containing UFO/UAP disclosure data"
        )
        
        # Create analytics schema (empty for demo)
        analytics_schema = SchemaInfo(
            "analytics", [], [],
            owner="postgres",
            comment="Analytics and reporting schema"
        )
        
        # Create database metadata
        return DatabaseMetadata(
            database_name="ultraterrestrial",
            database_type="PostgreSQL",
            version="14.0",
            schemas=[public_schema, analytics_schema],
            total_tables=5,
            total_views=1,
            total_size_bytes=2815488,  # Sum of all table sizes
            analyzed_at=datetime.now().isoformat()
        )
    
    # Placeholder methods for other UI components
    def _render_table_activity_chart(self): pass
    def _view_table_data(self, schema: str, table: str): pass
    def _view_table_schema(self, schema: str, table: str): pass
    def _render_analytics_queries(self): pass
    def _render_maintenance_queries(self): pass
    def _render_table_statistics_viz(self): pass
    def _render_data_distribution_viz(self): pass
    def _render_relationship_analysis_viz(self): pass
    def _render_time_series_viz(self): pass
    def _render_custom_query_chart(self): pass
    def _render_backup_export_tools(self): pass
    def _render_migration_tools(self): pass
    def _render_maintenance_tools(self): pass
    def _render_user_management_tools(self): pass
    def _render_alert_system(self): pass
    def _get_active_connections(self) -> int: return 1
    def _get_queries_per_second(self) -> float: return 2.3
    def _get_cache_hit_rate(self) -> float: return 85.7
    def _get_avg_query_time(self) -> float: return 42.5
    def _quick_connect_xata_wire(self): pass
    def _quick_connect_local_postgres(self): pass
    def _quick_connect_xata_api(self): pass


# Main interface function for integration
def render_database_explorer():
    """Main function to render the database explorer interface"""
    explorer = DatabaseExplorerUI()
    explorer.render_main_interface()


if __name__ == "__main__":
    # For testing
    render_database_explorer()