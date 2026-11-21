#!/usr/bin/env python3
"""
Database Statistics Module
Provides PostgreSQL database stats for the data sources navigator
"""

import asyncio
import asyncpg
import streamlit as st
import pandas as pd
from typing import Dict, List, Any, Optional
from datetime import datetime
import os

class DatabaseStatsProvider:
    """Provides statistics from the PostgreSQL database"""
    
    def __init__(self):
        self.database_url = os.getenv('DATABASE_URL', 'postgresql://liamellis@localhost:5432/ultraterrestrial')
        
    async def get_database_stats(self) -> Dict[str, Any]:
        """Get comprehensive database statistics"""
        
        try:
            conn = await asyncpg.connect(self.database_url)
            
            stats = {
                'connection_status': 'connected',
                'tables': {},
                'total_records': 0,
                'last_updated': datetime.now().isoformat()
            }
            
            # Get all tables and their row counts
            tables_query = """
            SELECT 
                table_name,
                (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
            FROM information_schema.tables t
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
            """
            
            tables = await conn.fetch(tables_query)
            
            for table_row in tables:
                table_name = table_row['table_name']
                column_count = table_row['column_count']
                
                try:
                    # Get row count for each table
                    count_result = await conn.fetchval(f"SELECT COUNT(*) FROM {table_name}")
                    
                    stats['tables'][table_name] = {
                        'row_count': count_result,
                        'column_count': column_count,
                        'category': self._categorize_table(table_name)
                    }
                    
                    stats['total_records'] += count_result
                    
                except Exception as e:
                    stats['tables'][table_name] = {
                        'row_count': 0,
                        'column_count': column_count,
                        'error': str(e),
                        'category': self._categorize_table(table_name)
                    }
            
            await conn.close()
            return stats
            
        except Exception as e:
            return {
                'connection_status': 'error',
                'error': str(e),
                'tables': {},
                'total_records': 0,
                'last_updated': datetime.now().isoformat()
            }
    
    def _categorize_table(self, table_name: str) -> str:
        """Categorize database tables"""
        table_lower = table_name.lower()
        
        if 'user' in table_lower:
            return 'User Data'
        elif table_lower in ['personnel', 'organizations', 'key_figures']:
            return 'Entities'
        elif table_lower in ['events', 'sightings', 'testimonies']:
            return 'Events & Incidents'
        elif table_lower in ['documents', 'artifacts']:
            return 'Evidence'
        elif table_lower in ['topics', 'locations']:
            return 'Classification'
        elif 'saved' in table_lower or 'notes' in table_lower:
            return 'User Content'
        elif 'member' in table_lower or 'expert' in table_lower:
            return 'Relationships'
        else:
            return 'Other'

    def render_database_stats(self):
        """Render database statistics in Streamlit"""
        
        st.subheader("🗄️ PostgreSQL Database")
        
        # Get stats (cached)
        if 'db_stats_cache' not in st.session_state:
            st.session_state.db_stats_cache = None
            st.session_state.db_stats_time = None
        
        # Refresh button
        col1, col2 = st.columns([3, 1])
        with col2:
            if st.button("🔄 Refresh DB Stats"):
                st.session_state.db_stats_cache = None
        
        # Get or fetch stats
        if st.session_state.db_stats_cache is None:
            with st.spinner("📊 Loading database statistics..."):
                stats = asyncio.run(self.get_database_stats())
                st.session_state.db_stats_cache = stats
                st.session_state.db_stats_time = datetime.now()
        else:
            stats = st.session_state.db_stats_cache
        
        # Display connection status
        if stats['connection_status'] == 'connected':
            st.success("✅ Database connected successfully")
            
            # Display summary metrics
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Total Tables", len(stats['tables']))
            
            with col2:
                st.metric("Total Records", f"{stats['total_records']:,}")
            
            with col3:
                if st.session_state.db_stats_time:
                    st.metric("Last Updated", st.session_state.db_stats_time.strftime("%H:%M:%S"))
            
            # Category breakdown
            if stats['tables']:
                self._render_category_breakdown(stats['tables'])
                
                # Detailed table list
                with st.expander("📋 Detailed Table Information"):
                    self._render_table_details(stats['tables'])
        
        else:
            st.error(f"❌ Database connection failed: {stats.get('error', 'Unknown error')}")

    def _render_category_breakdown(self, tables: Dict[str, Any]):
        """Render category breakdown of database tables"""
        
        # Group tables by category
        categories = {}
        for table_name, table_info in tables.items():
            category = table_info['category']
            if category not in categories:
                categories[category] = {'tables': 0, 'records': 0}
            
            categories[category]['tables'] += 1
            categories[category]['records'] += table_info.get('row_count', 0)
        
        # Display as metrics
        st.write("**Records by Category:**")
        
        # Create columns for categories
        cols = st.columns(min(len(categories), 4))
        
        for i, (category, info) in enumerate(categories.items()):
            with cols[i % 4]:
                st.metric(
                    category,
                    f"{info['records']:,}",
                    delta=f"{info['tables']} tables"
                )

    def _render_table_details(self, tables: Dict[str, Any]):
        """Render detailed table information"""
        
        # Convert to DataFrame for better display
        table_data = []
        for table_name, table_info in tables.items():
            table_data.append({
                'Table': table_name,
                'Records': table_info.get('row_count', 0),
                'Columns': table_info.get('column_count', 0),
                'Category': table_info.get('category', 'Unknown'),
                'Status': '✅ OK' if 'error' not in table_info else f"❌ {table_info['error']}"
            })
        
        df = pd.DataFrame(table_data)
        df = df.sort_values(['Category', 'Records'], ascending=[True, False])
        
        st.dataframe(
            df,
            use_container_width=True,
            hide_index=True,
            column_config={
                'Records': st.column_config.NumberColumn(format="%d"),
                'Columns': st.column_config.NumberColumn(format="%d"),
            }
        )

# Convenience function
def render_database_stats():
    """Render database statistics"""
    provider = DatabaseStatsProvider()
    provider.render_database_stats()

if __name__ == "__main__":
    # For testing
    st.set_page_config(page_title="Database Stats", layout="wide")
    render_database_stats()