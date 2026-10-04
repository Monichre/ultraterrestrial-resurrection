#!/usr/bin/env python3
"""
Database Query Executor
Executes SQL queries with syntax highlighting, result formatting, and performance monitoring
Date: July 13, 2025
"""

import logging
import time
from typing import Dict, List, Any, Optional, Tuple, Union
from dataclasses import dataclass
from datetime import datetime
import re
import json

# SQL parsing and formatting
try:
    import sqlparse
    SQLPARSE_AVAILABLE = True
except ImportError:
    SQLPARSE_AVAILABLE = False
    sqlparse = None

logger = logging.getLogger(__name__)

@dataclass
class QueryResult:
    """Query execution result"""
    success: bool
    data: Optional[List[Dict[str, Any]]] = None
    error_message: Optional[str] = None
    execution_time_ms: float = 0.0
    rows_affected: int = 0
    columns: List[str] = None
    query_type: str = "UNKNOWN"
    performance_stats: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.columns is None:
            self.columns = []
        if self.performance_stats is None:
            self.performance_stats = {}

@dataclass
class QueryHistory:
    """Query execution history"""
    query: str
    result: QueryResult
    executed_at: str
    connection_name: str
    formatted_query: Optional[str] = None

class QueryExecutor:
    """Executes and manages database queries"""
    
    def __init__(self):
        self.query_history: List[QueryHistory] = []
        self.saved_queries: Dict[str, str] = {}
        self.query_templates: Dict[str, str] = self._load_query_templates()
        self.performance_cache: Dict[str, float] = {}
    
    async def execute_query(self, connection_manager, connection_name: str, 
                          query: str, params: Optional[List] = None,
                          limit: Optional[int] = None) -> QueryResult:
        """Execute a SQL query"""
        start_time = time.time()
        
        try:
            # Validate and prepare query
            if not query.strip():
                return QueryResult(
                    success=False,
                    error_message="Empty query provided"
                )
            
            # Apply limit if specified
            if limit and self._is_select_query(query):
                query = self._apply_limit_to_query(query, limit)
            
            # Detect query type
            query_type = self._detect_query_type(query)
            
            # Execute query
            success, data, error_message = await connection_manager.execute_query(
                connection_name, query, params
            )
            
            execution_time_ms = (time.time() - start_time) * 1000
            
            # Process results
            if success and data:
                if isinstance(data, list) and data:
                    columns = list(data[0].keys()) if data[0] else []
                    rows_affected = len(data)
                else:
                    columns = []
                    rows_affected = data.get('affected_rows', 0) if isinstance(data, dict) else 0
            else:
                columns = []
                rows_affected = 0
            
            # Create result
            result = QueryResult(
                success=success,
                data=data if isinstance(data, list) else [],
                error_message=error_message,
                execution_time_ms=execution_time_ms,
                rows_affected=rows_affected,
                columns=columns,
                query_type=query_type,
                performance_stats={
                    'execution_time_ms': execution_time_ms,
                    'rows_returned': rows_affected if query_type == 'SELECT' else 0,
                    'query_length': len(query),
                    'has_params': bool(params)
                }
            )
            
            # Add to history
            self._add_to_history(connection_name, query, result)
            
            return result
            
        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            logger.error(f"Query execution failed: {e}")
            
            result = QueryResult(
                success=False,
                error_message=str(e),
                execution_time_ms=execution_time_ms,
                query_type=self._detect_query_type(query)
            )
            
            self._add_to_history(connection_name, query, result)
            return result
    
    def format_query(self, query: str) -> str:
        """Format SQL query with proper indentation and keywords"""
        if not SQLPARSE_AVAILABLE:
            return query
        
        try:
            formatted = sqlparse.format(
                query,
                reindent=True,
                keyword_case='upper',
                identifier_case='lower',
                strip_comments=False,
                wrap_after=80,
                comma_first=False
            )
            return formatted
        except Exception as e:
            logger.warning(f"Query formatting failed: {e}")
            return query
    
    def validate_query(self, query: str) -> Tuple[bool, str]:
        """Validate SQL query syntax"""
        if not query.strip():
            return False, "Empty query"
        
        try:
            # Basic validation using sqlparse
            if SQLPARSE_AVAILABLE:
                parsed = sqlparse.parse(query)
                if not parsed:
                    return False, "Invalid SQL syntax"
                
                # Check for dangerous operations
                query_upper = query.upper().strip()
                dangerous_patterns = [
                    r'\bDROP\s+DATABASE\b',
                    r'\bDROP\s+SCHEMA\b',
                    r'\bTRUNCATE\s+TABLE\b',
                    r'\bDELETE\s+FROM\s+\w+\s*(?:WHERE\s+1\s*=\s*1|WHERE\s+true)?$',
                    r'\bUPDATE\s+\w+\s+SET\s+.*?\s*(?:WHERE\s+1\s*=\s*1|WHERE\s+true)?$'
                ]
                
                for pattern in dangerous_patterns:
                    if re.search(pattern, query_upper):
                        return False, f"Potentially dangerous operation detected: {pattern}"
            
            return True, "Query appears valid"
            
        except Exception as e:
            return False, f"Validation error: {str(e)}"
    
    def get_query_suggestions(self, connection_manager, connection_name: str, 
                            query_type: str = "sample") -> List[Dict[str, str]]:
        """Get query suggestions based on type"""
        if query_type == "sample":
            return self._get_sample_queries()
        elif query_type == "analytics":
            return self._get_analytics_queries()
        elif query_type == "maintenance":
            return self._get_maintenance_queries()
        elif query_type == "templates":
            return [{"name": name, "query": query} for name, query in self.query_templates.items()]
        
        return []
    
    def save_query(self, name: str, query: str) -> bool:
        """Save a query for later use"""
        try:
            self.saved_queries[name] = query
            self._persist_saved_queries()
            return True
        except Exception as e:
            logger.error(f"Failed to save query: {e}")
            return False
    
    def get_saved_queries(self) -> Dict[str, str]:
        """Get all saved queries"""
        return self.saved_queries.copy()
    
    def delete_saved_query(self, name: str) -> bool:
        """Delete a saved query"""
        try:
            if name in self.saved_queries:
                del self.saved_queries[name]
                self._persist_saved_queries()
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to delete query: {e}")
            return False
    
    def get_query_history(self, limit: int = 50) -> List[QueryHistory]:
        """Get query execution history"""
        return self.query_history[-limit:] if limit else self.query_history
    
    def clear_query_history(self) -> None:
        """Clear query execution history"""
        self.query_history.clear()
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get query performance statistics"""
        if not self.query_history:
            return {}
        
        execution_times = [entry.result.execution_time_ms for entry in self.query_history if entry.result.success]
        
        if not execution_times:
            return {}
        
        return {
            "total_queries": len(self.query_history),
            "successful_queries": len([entry for entry in self.query_history if entry.result.success]),
            "failed_queries": len([entry for entry in self.query_history if not entry.result.success]),
            "avg_execution_time_ms": sum(execution_times) / len(execution_times),
            "min_execution_time_ms": min(execution_times),
            "max_execution_time_ms": max(execution_times),
            "total_rows_processed": sum([entry.result.rows_affected for entry in self.query_history]),
            "query_types": self._get_query_type_distribution()
        }
    
    async def explain_query(self, connection_manager, connection_name: str, query: str) -> Optional[QueryResult]:
        """Get query execution plan"""
        try:
            connection_config = connection_manager.get_connection(connection_name)
            if not connection_config:
                return None
            
            db_type = connection_config.db_type.value
            
            # Add EXPLAIN based on database type
            if "postgresql" in db_type:
                explain_query = f"EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) {query}"
            elif "sqlite" in db_type:
                explain_query = f"EXPLAIN QUERY PLAN {query}"
            else:
                return QueryResult(
                    success=False,
                    error_message=f"EXPLAIN not supported for {db_type}"
                )
            
            return await self.execute_query(connection_manager, connection_name, explain_query)
            
        except Exception as e:
            logger.error(f"Query explain failed: {e}")
            return QueryResult(
                success=False,
                error_message=str(e)
            )
    
    def export_results(self, result: QueryResult, format: str = "json") -> Optional[str]:
        """Export query results in various formats"""
        if not result.success or not result.data:
            return None
        
        try:
            if format == "json":
                return json.dumps(result.data, indent=2, default=str)
            elif format == "csv":
                return self._export_to_csv(result.data, result.columns)
            elif format == "html":
                return self._export_to_html(result.data, result.columns)
            elif format == "markdown":
                return self._export_to_markdown(result.data, result.columns)
            
            return None
            
        except Exception as e:
            logger.error(f"Export failed: {e}")
            return None
    
    def _detect_query_type(self, query: str) -> str:
        """Detect the type of SQL query"""
        query_upper = query.strip().upper()
        
        if query_upper.startswith('SELECT'):
            return 'SELECT'
        elif query_upper.startswith('INSERT'):
            return 'INSERT'
        elif query_upper.startswith('UPDATE'):
            return 'UPDATE'
        elif query_upper.startswith('DELETE'):
            return 'DELETE'
        elif query_upper.startswith('CREATE'):
            return 'CREATE'
        elif query_upper.startswith('DROP'):
            return 'DROP'
        elif query_upper.startswith('ALTER'):
            return 'ALTER'
        elif query_upper.startswith('EXPLAIN'):
            return 'EXPLAIN'
        elif query_upper.startswith('DESCRIBE') or query_upper.startswith('DESC'):
            return 'DESCRIBE'
        elif query_upper.startswith('SHOW'):
            return 'SHOW'
        else:
            return 'OTHER'
    
    def _is_select_query(self, query: str) -> bool:
        """Check if query is a SELECT statement"""
        return query.strip().upper().startswith('SELECT')
    
    def _apply_limit_to_query(self, query: str, limit: int) -> str:
        """Apply LIMIT clause to SELECT query"""
        # Simple implementation - could be more sophisticated
        query = query.strip()
        if query.upper().find('LIMIT') == -1:
            query += f" LIMIT {limit}"
        return query
    
    def _add_to_history(self, connection_name: str, query: str, result: QueryResult) -> None:
        """Add query to execution history"""
        history_entry = QueryHistory(
            query=query,
            result=result,
            executed_at=datetime.now().isoformat(),
            connection_name=connection_name,
            formatted_query=self.format_query(query) if SQLPARSE_AVAILABLE else None
        )
        
        self.query_history.append(history_entry)
        
        # Keep only last 1000 entries
        if len(self.query_history) > 1000:
            self.query_history = self.query_history[-1000:]
    
    def _get_query_type_distribution(self) -> Dict[str, int]:
        """Get distribution of query types from history"""
        distribution = {}
        for entry in self.query_history:
            query_type = entry.result.query_type
            distribution[query_type] = distribution.get(query_type, 0) + 1
        return distribution
    
    def _get_sample_queries(self) -> List[Dict[str, str]]:
        """Get sample queries"""
        return [
            {
                "name": "List all tables",
                "query": "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
            },
            {
                "name": "Show table structure",
                "query": "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'your_table';"
            },
            {
                "name": "Count records in all tables",
                "query": """
                SELECT 
                    schemaname,
                    tablename,
                    n_tup_ins as inserts,
                    n_tup_upd as updates,
                    n_tup_del as deletes,
                    n_live_tup as live_rows,
                    n_dead_tup as dead_rows
                FROM pg_stat_user_tables
                ORDER BY n_live_tup DESC;
                """
            },
            {
                "name": "Show database size",
                "query": "SELECT pg_size_pretty(pg_database_size(current_database()));"
            },
            {
                "name": "Recent activity",
                "query": "SELECT * FROM personnel ORDER BY created_at DESC LIMIT 10;"
            }
        ]
    
    def _get_analytics_queries(self) -> List[Dict[str, str]]:
        """Get analytics queries"""
        return [
            {
                "name": "Entity count by type",
                "query": """
                SELECT 'personnel' as entity_type, COUNT(*) as count FROM personnel
                UNION ALL
                SELECT 'organizations' as entity_type, COUNT(*) as count FROM organizations
                UNION ALL
                SELECT 'events' as entity_type, COUNT(*) as count FROM events
                UNION ALL
                SELECT 'topics' as entity_type, COUNT(*) as count FROM topics
                ORDER BY count DESC;
                """
            },
            {
                "name": "Most referenced organizations",
                "query": """
                SELECT 
                    o.name,
                    COUNT(DISTINCT p.id) as personnel_count,
                    COUNT(DISTINCT e.id) as events_count
                FROM organizations o
                LEFT JOIN personnel p ON p.organization_id = o.id
                LEFT JOIN events e ON e.organization_id = o.id
                GROUP BY o.id, o.name
                ORDER BY (personnel_count + events_count) DESC
                LIMIT 10;
                """
            },
            {
                "name": "Timeline of events",
                "query": """
                SELECT 
                    DATE_TRUNC('year', date) as year,
                    COUNT(*) as event_count
                FROM events
                WHERE date IS NOT NULL
                GROUP BY DATE_TRUNC('year', date)
                ORDER BY year;
                """
            }
        ]
    
    def _get_maintenance_queries(self) -> List[Dict[str, str]]:
        """Get maintenance queries"""
        return [
            {
                "name": "Table sizes",
                "query": """
                SELECT 
                    schemaname,
                    tablename,
                    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
                FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
                """
            },
            {
                "name": "Index usage",
                "query": """
                SELECT 
                    schemaname,
                    tablename,
                    indexname,
                    idx_tup_read,
                    idx_tup_fetch
                FROM pg_stat_user_indexes
                ORDER BY idx_tup_read DESC;
                """
            },
            {
                "name": "Slow queries",
                "query": """
                SELECT 
                    query,
                    calls,
                    total_time,
                    mean_time,
                    rows
                FROM pg_stat_statements
                ORDER BY total_time DESC
                LIMIT 10;
                """
            }
        ]
    
    def _load_query_templates(self) -> Dict[str, str]:
        """Load query templates"""
        return {
            "select_template": "SELECT * FROM {table_name} WHERE {condition} LIMIT 10;",
            "insert_template": "INSERT INTO {table_name} ({columns}) VALUES ({values});",
            "update_template": "UPDATE {table_name} SET {column} = {value} WHERE {condition};",
            "delete_template": "DELETE FROM {table_name} WHERE {condition};",
            "join_template": """
            SELECT t1.*, t2.*
            FROM {table1} t1
            JOIN {table2} t2 ON t1.{join_column} = t2.{join_column}
            WHERE {condition};
            """
        }
    
    def _persist_saved_queries(self) -> None:
        """Persist saved queries to file"""
        try:
            with open("saved_queries.json", "w", encoding="utf-8") as f:
                json.dump(self.saved_queries, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to persist saved queries: {e}")
    
    def _export_to_csv(self, data: List[Dict[str, Any]], columns: List[str]) -> str:
        """Export data to CSV format"""
        if not data or not columns:
            return ""
        
        import csv
        import io
        
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=columns)
        writer.writeheader()
        
        for row in data:
            writer.writerow(row)
        
        return output.getvalue()
    
    def _export_to_html(self, data: List[Dict[str, Any]], columns: List[str]) -> str:
        """Export data to HTML table"""
        if not data or not columns:
            return "<table></table>"
        
        html = "<table border='1'>\n<thead>\n<tr>\n"
        for col in columns:
            html += f"<th>{col}</th>\n"
        html += "</tr>\n</thead>\n<tbody>\n"
        
        for row in data:
            html += "<tr>\n"
            for col in columns:
                value = row.get(col, "")
                html += f"<td>{value}</td>\n"
            html += "</tr>\n"
        
        html += "</tbody>\n</table>"
        return html
    
    def _export_to_markdown(self, data: List[Dict[str, Any]], columns: List[str]) -> str:
        """Export data to Markdown table"""
        if not data or not columns:
            return ""
        
        # Header
        md = "| " + " | ".join(columns) + " |\n"
        md += "| " + " | ".join(["---"] * len(columns)) + " |\n"
        
        # Data rows
        for row in data:
            values = [str(row.get(col, "")) for col in columns]
            md += "| " + " | ".join(values) + " |\n"
        
        return md


if __name__ == "__main__":
    # Test the query executor
    async def test_query_executor():
        executor = QueryExecutor()
        
        # Test query validation
        valid, message = executor.validate_query("SELECT * FROM test;")
        print(f"Query validation: {valid} - {message}")
        
        # Test query formatting
        formatted = executor.format_query("select * from test where id=1")
        print(f"Formatted query: {formatted}")
        
        # Test suggestions
        suggestions = executor.get_query_suggestions(None, "", "sample")
        print(f"Query suggestions: {len(suggestions)} available")
        
        print("Query executor ready for use")
    
    import asyncio
    asyncio.run(test_query_executor())