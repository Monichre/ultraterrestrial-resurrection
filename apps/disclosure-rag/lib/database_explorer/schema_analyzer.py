#!/usr/bin/env python3
"""
Database Schema Analyzer
Analyzes database schemas, tables, columns, relationships, and metadata
Date: July 13, 2025
"""

import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import json

logger = logging.getLogger(__name__)

@dataclass
class ColumnInfo:
    """Database column information"""
    name: str
    data_type: str
    is_nullable: bool
    default_value: Optional[str] = None
    max_length: Optional[int] = None
    precision: Optional[int] = None
    scale: Optional[int] = None
    is_primary_key: bool = False
    is_foreign_key: bool = False
    foreign_key_table: Optional[str] = None
    foreign_key_column: Optional[str] = None
    is_unique: bool = False
    is_indexed: bool = False
    comment: Optional[str] = None

@dataclass 
class TableInfo:
    """Database table information"""
    name: str
    schema: str
    table_type: str  # 'table', 'view', 'materialized_view'
    columns: List[ColumnInfo]
    row_count: Optional[int] = None
    size_bytes: Optional[int] = None
    comment: Optional[str] = None
    created_at: Optional[str] = None
    last_modified: Optional[str] = None
    indexes: List[Dict[str, Any]] = None
    constraints: List[Dict[str, Any]] = None

@dataclass
class SchemaInfo:
    """Database schema information"""
    name: str
    tables: List[TableInfo]
    views: List[TableInfo]
    owner: Optional[str] = None
    comment: Optional[str] = None

@dataclass
class DatabaseMetadata:
    """Complete database metadata"""
    database_name: str
    database_type: str
    version: Optional[str] = None
    schemas: List[SchemaInfo]
    total_tables: int = 0
    total_views: int = 0
    total_size_bytes: int = 0
    analyzed_at: str = None

class DatabaseSchemaAnalyzer:
    """Analyzes database schemas and metadata"""
    
    def __init__(self):
        self.metadata_cache: Dict[str, DatabaseMetadata] = {}
        self.cache_expiry: Dict[str, datetime] = {}
    
    async def analyze_database(self, connection_manager, connection_name: str, 
                             force_refresh: bool = False) -> Optional[DatabaseMetadata]:
        """Analyze complete database schema"""
        try:
            # Check cache first
            if not force_refresh and self._is_cache_valid(connection_name):
                return self.metadata_cache.get(connection_name)
            
            # Get connection
            conn_obj = connection_manager.get_active_connection(connection_name)
            connection_config = connection_manager.get_connection(connection_name)
            
            if not conn_obj or not connection_config:
                logger.error(f"No active connection found: {connection_name}")
                return None
            
            # Analyze based on database type
            db_type = connection_config.db_type.value
            
            if "postgresql" in db_type:
                metadata = await self._analyze_postgresql(conn_obj, connection_config)
            elif "xata" in db_type:
                metadata = await self._analyze_xata(conn_obj, connection_config)
            elif "sqlite" in db_type:
                metadata = await self._analyze_sqlite(conn_obj, connection_config)
            else:
                logger.error(f"Unsupported database type for analysis: {db_type}")
                return None
            
            if metadata:
                # Cache the results
                self.metadata_cache[connection_name] = metadata
                self.cache_expiry[connection_name] = datetime.now()
                
                logger.info(f"Database analysis complete for {connection_name}: "
                           f"{metadata.total_tables} tables, {metadata.total_views} views")
            
            return metadata
            
        except Exception as e:
            logger.error(f"Database analysis failed for {connection_name}: {e}")
            return None
    
    async def get_table_details(self, connection_manager, connection_name: str, 
                               schema_name: str, table_name: str) -> Optional[TableInfo]:
        """Get detailed information about a specific table"""
        try:
            conn_obj = connection_manager.get_active_connection(connection_name)
            connection_config = connection_manager.get_connection(connection_name)
            
            if not conn_obj or not connection_config:
                return None
            
            db_type = connection_config.db_type.value
            
            if "postgresql" in db_type:
                return await self._get_postgresql_table_details(conn_obj, schema_name, table_name)
            elif "xata" in db_type:
                return await self._get_xata_table_details(conn_obj, schema_name, table_name)
            elif "sqlite" in db_type:
                return await self._get_sqlite_table_details(conn_obj, schema_name, table_name)
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get table details for {schema_name}.{table_name}: {e}")
            return None
    
    async def get_table_relationships(self, connection_manager, connection_name: str) -> Dict[str, List[Dict[str, Any]]]:
        """Get table relationships (foreign keys)"""
        try:
            conn_obj = connection_manager.get_active_connection(connection_name)
            connection_config = connection_manager.get_connection(connection_name)
            
            if not conn_obj or not connection_config:
                return {}
            
            db_type = connection_config.db_type.value
            
            if "postgresql" in db_type:
                return await self._get_postgresql_relationships(conn_obj)
            elif "sqlite" in db_type:
                return await self._get_sqlite_relationships(conn_obj)
            
            return {}
            
        except Exception as e:
            logger.error(f"Failed to get table relationships: {e}")
            return {}
    
    async def get_database_statistics(self, connection_manager, connection_name: str) -> Dict[str, Any]:
        """Get database statistics"""
        try:
            conn_obj = connection_manager.get_active_connection(connection_name)
            connection_config = connection_manager.get_connection(connection_name)
            
            if not conn_obj or not connection_config:
                return {}
            
            db_type = connection_config.db_type.value
            
            if "postgresql" in db_type:
                return await self._get_postgresql_statistics(conn_obj)
            elif "sqlite" in db_type:
                return await self._get_sqlite_statistics(conn_obj)
            
            return {}
            
        except Exception as e:
            logger.error(f"Failed to get database statistics: {e}")
            return {}
    
    def _is_cache_valid(self, connection_name: str, max_age_minutes: int = 30) -> bool:
        """Check if cached metadata is still valid"""
        if connection_name not in self.cache_expiry:
            return False
        
        cache_time = self.cache_expiry[connection_name]
        age_minutes = (datetime.now() - cache_time).total_seconds() / 60
        
        return age_minutes < max_age_minutes
    
    async def _analyze_postgresql(self, conn_obj, connection_config) -> DatabaseMetadata:
        """Analyze PostgreSQL database"""
        # Get database info
        db_info_query = """
        SELECT version() as version, current_database() as database_name
        """
        
        result = await conn_obj.fetch(db_info_query)
        db_info = dict(result[0]) if result else {}
        
        # Get schemas
        schemas_query = """
        SELECT schema_name, schema_owner 
        FROM information_schema.schemata 
        WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'pg_temp_1')
        ORDER BY schema_name
        """
        
        schema_rows = await conn_obj.fetch(schemas_query)
        schemas = []
        
        total_tables = 0
        total_views = 0
        
        for schema_row in schema_rows:
            schema_name = schema_row['schema_name']
            
            # Get tables in schema
            tables = await self._get_postgresql_tables_in_schema(conn_obj, schema_name)
            views = await self._get_postgresql_views_in_schema(conn_obj, schema_name)
            
            schema_info = SchemaInfo(
                name=schema_name,
                tables=tables,
                views=views,
                owner=schema_row.get('schema_owner')
            )
            
            schemas.append(schema_info)
            total_tables += len(tables)
            total_views += len(views)
        
        return DatabaseMetadata(
            database_name=db_info.get('database_name', connection_config.database),
            database_type="PostgreSQL",
            version=db_info.get('version', '').split()[1] if db_info.get('version') else None,
            schemas=schemas,
            total_tables=total_tables,
            total_views=total_views,
            analyzed_at=datetime.now().isoformat()
        )
    
    async def _get_postgresql_tables_in_schema(self, conn_obj, schema_name: str) -> List[TableInfo]:
        """Get tables in PostgreSQL schema"""
        tables_query = """
        SELECT 
            t.table_name,
            t.table_type,
            obj_description(c.oid) as comment
        FROM information_schema.tables t
        LEFT JOIN pg_class c ON c.relname = t.table_name
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
        WHERE t.table_schema = $1 AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name
        """
        
        table_rows = await conn_obj.fetch(tables_query, schema_name)
        tables = []
        
        for table_row in table_rows:
            table_name = table_row['table_name']
            
            # Get columns for this table
            columns = await self._get_postgresql_columns(conn_obj, schema_name, table_name)
            
            # Get table statistics
            stats = await self._get_postgresql_table_stats(conn_obj, schema_name, table_name)
            
            table_info = TableInfo(
                name=table_name,
                schema=schema_name,
                table_type=table_row['table_type'],
                columns=columns,
                row_count=stats.get('row_count'),
                size_bytes=stats.get('size_bytes'),
                comment=table_row.get('comment')
            )
            
            tables.append(table_info)
        
        return tables
    
    async def _get_postgresql_views_in_schema(self, conn_obj, schema_name: str) -> List[TableInfo]:
        """Get views in PostgreSQL schema"""
        views_query = """
        SELECT 
            table_name,
            table_type,
            view_definition
        FROM information_schema.views
        WHERE table_schema = $1
        ORDER BY table_name
        """
        
        view_rows = await conn_obj.fetch(views_query, schema_name)
        views = []
        
        for view_row in view_rows:
            view_name = view_row['table_name']
            
            # Get columns for this view
            columns = await self._get_postgresql_columns(conn_obj, schema_name, view_name)
            
            view_info = TableInfo(
                name=view_name,
                schema=schema_name,
                table_type='VIEW',
                columns=columns,
                comment=view_row.get('view_definition', '')[:200] + "..." if len(view_row.get('view_definition', '')) > 200 else view_row.get('view_definition', '')
            )
            
            views.append(view_info)
        
        return views
    
    async def _get_postgresql_columns(self, conn_obj, schema_name: str, table_name: str) -> List[ColumnInfo]:
        """Get columns for PostgreSQL table"""
        columns_query = """
        SELECT 
            c.column_name,
            c.data_type,
            c.is_nullable,
            c.column_default,
            c.character_maximum_length,
            c.numeric_precision,
            c.numeric_scale,
            CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary_key,
            CASE WHEN fk.column_name IS NOT NULL THEN true ELSE false END as is_foreign_key,
            fk.foreign_table_name,
            fk.foreign_column_name,
            c.is_identity,
            col_description(pgc.oid, c.ordinal_position) as comment
        FROM information_schema.columns c
        LEFT JOIN (
            SELECT ku.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
            WHERE tc.table_schema = $1 AND tc.table_name = $2 AND tc.constraint_type = 'PRIMARY KEY'
        ) pk ON c.column_name = pk.column_name
        LEFT JOIN (
            SELECT 
                ku.column_name,
                ccu.table_name as foreign_table_name,
                ccu.column_name as foreign_column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_schema = $1 AND tc.table_name = $2 AND tc.constraint_type = 'FOREIGN KEY'
        ) fk ON c.column_name = fk.column_name
        LEFT JOIN pg_class pgc ON pgc.relname = c.table_name
        WHERE c.table_schema = $1 AND c.table_name = $2
        ORDER BY c.ordinal_position
        """
        
        column_rows = await conn_obj.fetch(columns_query, schema_name, table_name)
        columns = []
        
        for col_row in column_rows:
            column_info = ColumnInfo(
                name=col_row['column_name'],
                data_type=col_row['data_type'],
                is_nullable=col_row['is_nullable'] == 'YES',
                default_value=col_row.get('column_default'),
                max_length=col_row.get('character_maximum_length'),
                precision=col_row.get('numeric_precision'),
                scale=col_row.get('numeric_scale'),
                is_primary_key=col_row.get('is_primary_key', False),
                is_foreign_key=col_row.get('is_foreign_key', False),
                foreign_key_table=col_row.get('foreign_table_name'),
                foreign_key_column=col_row.get('foreign_column_name'),
                comment=col_row.get('comment')
            )
            
            columns.append(column_info)
        
        return columns
    
    async def _get_postgresql_table_stats(self, conn_obj, schema_name: str, table_name: str) -> Dict[str, Any]:
        """Get PostgreSQL table statistics"""
        stats_query = """
        SELECT 
            schemaname,
            tablename,
            attname,
            n_distinct,
            correlation
        FROM pg_stats 
        WHERE schemaname = $1 AND tablename = $2
        LIMIT 1
        """
        
        size_query = """
        SELECT 
            pg_total_relation_size(c.oid) as total_size,
            pg_relation_size(c.oid) as table_size,
            c.reltuples::bigint as row_count
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = $2 AND n.nspname = $1
        """
        
        try:
            size_result = await conn_obj.fetch(size_query, schema_name, table_name)
            if size_result:
                size_info = dict(size_result[0])
                return {
                    'size_bytes': size_info.get('total_size', 0),
                    'table_size_bytes': size_info.get('table_size', 0),
                    'row_count': size_info.get('row_count', 0)
                }
        except Exception as e:
            logger.warning(f"Failed to get table statistics for {schema_name}.{table_name}: {e}")
        
        return {}
    
    async def _get_postgresql_table_details(self, conn_obj, schema_name: str, table_name: str) -> Optional[TableInfo]:
        """Get detailed PostgreSQL table information"""
        # This would be implemented similar to _get_postgresql_tables_in_schema
        # but for a single table with more detailed information
        pass
    
    async def _get_postgresql_relationships(self, conn_obj) -> Dict[str, List[Dict[str, Any]]]:
        """Get PostgreSQL foreign key relationships"""
        relationships_query = """
        SELECT 
            tc.table_schema,
            tc.table_name,
            kcu.column_name,
            ccu.table_schema as foreign_table_schema,
            ccu.table_name as foreign_table_name,
            ccu.column_name as foreign_column_name,
            tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        ORDER BY tc.table_schema, tc.table_name
        """
        
        try:
            result = await conn_obj.fetch(relationships_query)
            relationships = {}
            
            for row in result:
                table_key = f"{row['table_schema']}.{row['table_name']}"
                if table_key not in relationships:
                    relationships[table_key] = []
                
                relationships[table_key].append({
                    'column': row['column_name'],
                    'references_table': f"{row['foreign_table_schema']}.{row['foreign_table_name']}",
                    'references_column': row['foreign_column_name'],
                    'constraint_name': row['constraint_name']
                })
            
            return relationships
            
        except Exception as e:
            logger.error(f"Failed to get PostgreSQL relationships: {e}")
            return {}
    
    async def _get_postgresql_statistics(self, conn_obj) -> Dict[str, Any]:
        """Get PostgreSQL database statistics"""
        stats_query = """
        SELECT 
            COUNT(*) as total_tables
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        """
        
        size_query = """
        SELECT 
            pg_size_pretty(pg_database_size(current_database())) as database_size,
            pg_database_size(current_database()) as database_size_bytes
        """
        
        try:
            stats_result = await conn_obj.fetch(stats_query)
            size_result = await conn_obj.fetch(size_query)
            
            stats = {}
            if stats_result:
                stats.update(dict(stats_result[0]))
            if size_result:
                stats.update(dict(size_result[0]))
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get PostgreSQL statistics: {e}")
            return {}
    
    # SQLite methods would be implemented similarly
    async def _analyze_sqlite(self, conn_obj, connection_config) -> DatabaseMetadata:
        """Analyze SQLite database"""
        # Implementation for SQLite analysis
        pass
    
    async def _get_sqlite_table_details(self, conn_obj, schema_name: str, table_name: str) -> Optional[TableInfo]:
        """Get detailed SQLite table information"""
        pass
    
    async def _get_sqlite_relationships(self, conn_obj) -> Dict[str, List[Dict[str, Any]]]:
        """Get SQLite foreign key relationships"""
        pass
    
    async def _get_sqlite_statistics(self, conn_obj) -> Dict[str, Any]:
        """Get SQLite database statistics"""
        pass
    
    # Xata methods would be implemented for API-based analysis
    async def _analyze_xata(self, session_obj, connection_config) -> DatabaseMetadata:
        """Analyze Xata database via API"""
        # Implementation for Xata API analysis
        pass
    
    async def _get_xata_table_details(self, session_obj, schema_name: str, table_name: str) -> Optional[TableInfo]:
        """Get detailed Xata table information"""
        pass
    
    def clear_cache(self, connection_name: Optional[str] = None):
        """Clear schema analysis cache"""
        if connection_name:
            self.metadata_cache.pop(connection_name, None)
            self.cache_expiry.pop(connection_name, None)
        else:
            self.metadata_cache.clear()
            self.cache_expiry.clear()
    
    def export_schema_documentation(self, connection_name: str, format: str = "json") -> Optional[str]:
        """Export schema documentation in various formats"""
        if connection_name not in self.metadata_cache:
            return None
        
        metadata = self.metadata_cache[connection_name]
        
        if format == "json":
            return json.dumps(metadata, default=str, indent=2)
        elif format == "markdown":
            return self._generate_markdown_documentation(metadata)
        elif format == "html":
            return self._generate_html_documentation(metadata)
        
        return None
    
    def _generate_markdown_documentation(self, metadata: DatabaseMetadata) -> str:
        """Generate Markdown documentation"""
        md = f"# Database Schema: {metadata.database_name}\n\n"
        md += f"**Database Type:** {metadata.database_type}\n"
        md += f"**Version:** {metadata.version or 'Unknown'}\n"
        md += f"**Analyzed:** {metadata.analyzed_at}\n\n"
        
        md += f"## Summary\n"
        md += f"- **Total Tables:** {metadata.total_tables}\n"
        md += f"- **Total Views:** {metadata.total_views}\n\n"
        
        for schema in metadata.schemas:
            md += f"## Schema: {schema.name}\n\n"
            
            if schema.tables:
                md += f"### Tables ({len(schema.tables)})\n\n"
                for table in schema.tables:
                    md += f"#### {table.name}\n"
                    if table.comment:
                        md += f"{table.comment}\n\n"
                    
                    md += "| Column | Type | Nullable | Default | Key |\n"
                    md += "|--------|------|----------|---------|-----|\n"
                    
                    for col in table.columns:
                        key_info = ""
                        if col.is_primary_key:
                            key_info += "PK "
                        if col.is_foreign_key:
                            key_info += "FK "
                        
                        md += f"| {col.name} | {col.data_type} | {col.is_nullable} | {col.default_value or ''} | {key_info} |\n"
                    
                    md += "\n"
        
        return md
    
    def _generate_html_documentation(self, metadata: DatabaseMetadata) -> str:
        """Generate HTML documentation"""
        # HTML generation implementation
        return f"<html><body><h1>Database Schema: {metadata.database_name}</h1></body></html>"


if __name__ == "__main__":
    # Test the schema analyzer
    async def test_schema_analyzer():
        analyzer = DatabaseSchemaAnalyzer()
        print("Schema analyzer initialized")
        
        # Test would require actual database connection
        print("Schema analyzer ready for use")
    
    import asyncio
    asyncio.run(test_schema_analyzer())