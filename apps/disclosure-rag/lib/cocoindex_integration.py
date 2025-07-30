#!/usr/bin/env python3
"""
CocoIndex Integration Processor for Disclosure RAG
Handles CocoIndex ETL processing and knowledge graph operations
"""

import os
import logging
import subprocess
import tempfile
import json
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)

class CocoIndexProcessor:
    """Handles CocoIndex ETL processing for disclosure-rag content"""
    
    def __init__(self):
        self.cocoindex_available = self._check_cocoindex_availability()
        self.flow_file = Path(__file__).parent / "cocoindex_flows.py"
        self.neo4j_available = self._check_neo4j_availability()
        
    def _check_cocoindex_availability(self) -> bool:
        """Check if CocoIndex is available and properly configured"""
        try:
            import cocoindex
            # Check required environment variables
            required_vars = [
                "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"
            ]
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            if missing_vars:
                logger.warning(f"CocoIndex PostgreSQL configuration incomplete. Missing: {missing_vars}")
                # Don't fail completely, just log warning
            
            # Neo4j is optional
            neo4j_vars = ["NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD"]
            missing_neo4j = [var for var in neo4j_vars if not os.getenv(var)]
            if missing_neo4j:
                logger.info(f"Neo4j configuration incomplete. Missing: {missing_neo4j}")
                logger.info("Knowledge graph will use PostgreSQL only")
                
            return True
        except ImportError:
            logger.warning("CocoIndex not available - install with: pip install cocoindex")
            return False
    
    def _check_neo4j_availability(self) -> bool:
        """Check if Neo4j is available and configured"""
        neo4j_vars = ["NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD"]
        missing_neo4j = [var for var in neo4j_vars if not os.getenv(var)]
        return len(missing_neo4j) == 0
    
    def setup_cocoindex_flow(self) -> Dict[str, Any]:
        """
        Setup CocoIndex flow for the first time.
        
        Returns:
            Setup results and metadata
        """
        if not self.cocoindex_available:
            logger.warning("CocoIndex not available, skipping flow setup")
            return {"status": "skipped", "reason": "cocoindex_not_available"}
        
        try:
            logger.info("Setting up CocoIndex flow for UAP knowledge graph")
            
            # Run CocoIndex setup
            cmd = ["cocoindex", "setup", str(self.flow_file)]
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                logger.info("CocoIndex flow setup completed successfully")
                return {
                    "status": "success",
                    "stdout": result.stdout,
                    "setup_time": datetime.now().isoformat()
                }
            else:
                logger.error(f"CocoIndex flow setup failed: {result.stderr}")
                return {
                    "status": "error", 
                    "error": result.stderr,
                    "stdout": result.stdout
                }
                
        except subprocess.TimeoutExpired:
            logger.error("CocoIndex flow setup timed out")
            return {"status": "timeout"}
        except Exception as e:
            logger.error(f"CocoIndex flow setup exception: {e}")
            return {"status": "exception", "error": str(e)}
    
    def process_document_knowledge_graph(self, doc_id: str, force_update: bool = False) -> Dict[str, Any]:
        """
        Trigger CocoIndex ETL processing for a specific document.
        
        Args:
            doc_id: Document ID to process
            force_update: Whether to force reprocessing even if already processed
            
        Returns:
            Processing results and metadata
        """
        if not self.cocoindex_available:
            logger.warning("CocoIndex not available, skipping knowledge graph processing")
            return {"status": "skipped", "reason": "cocoindex_not_available"}
        
        try:
            logger.info(f"Processing knowledge graph for document: {doc_id}")
            
            # Run CocoIndex ETL for the specific document
            cmd = [
                "cocoindex", "update", str(self.flow_file),
                "--filter", f"id='{doc_id}'"
            ]
            
            if force_update:
                cmd.append("--force")
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=600  # 10 minute timeout for individual document
            )
            
            if result.returncode == 0:
                logger.info(f"CocoIndex processing completed for document {doc_id}")
                
                # Parse output for metrics
                entities_processed = self._extract_entities_count(result.stdout)
                relationships_processed = self._extract_relationships_count(result.stdout)
                
                return {
                    "status": "success",
                    "doc_id": doc_id,
                    "stdout": result.stdout,
                    "entities_processed": entities_processed,
                    "relationships_processed": relationships_processed,
                    "processing_time": self._extract_processing_time(result.stdout)
                }
            else:
                logger.error(f"CocoIndex processing failed for document {doc_id}: {result.stderr}")
                return {
                    "status": "error", 
                    "doc_id": doc_id,
                    "error": result.stderr,
                    "stdout": result.stdout
                }
                
        except subprocess.TimeoutExpired:
            logger.error(f"CocoIndex processing timed out for document {doc_id}")
            return {"status": "timeout", "doc_id": doc_id}
        except Exception as e:
            logger.error(f"CocoIndex processing exception for document {doc_id}: {e}")
            return {"status": "exception", "doc_id": doc_id, "error": str(e)}
    
    def bulk_process_knowledge_graph(self, limit: Optional[int] = None, batch_size: int = 10) -> Dict[str, Any]:
        """
        Process all documents in the knowledge base through CocoIndex ETL.
        
        Args:
            limit: Optional limit on number of documents to process
            batch_size: Number of documents to process per batch
            
        Returns:
            Bulk processing results
        """
        if not self.cocoindex_available:
            return {"status": "skipped", "reason": "cocoindex_not_available"}
        
        try:
            logger.info("Starting CocoIndex bulk processing")
            
            cmd = ["cocoindex", "update", str(self.flow_file)]
            if limit:
                cmd.extend(["--limit", str(limit)])
            
            # Add batch processing if available
            cmd.extend(["--batch-size", str(batch_size)])
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=3600  # 1 hour timeout for bulk processing
            )
            
            if result.returncode == 0:
                logger.info("CocoIndex bulk processing completed")
                
                # Parse output for comprehensive metrics
                documents_processed = self._extract_doc_count(result.stdout)
                entities_processed = self._extract_entities_count(result.stdout)
                relationships_processed = self._extract_relationships_count(result.stdout)
                
                return {
                    "status": "success",
                    "stdout": result.stdout,
                    "documents_processed": documents_processed,
                    "entities_processed": entities_processed,
                    "relationships_processed": relationships_processed,
                    "processing_time": self._extract_processing_time(result.stdout)
                }
            else:
                logger.error(f"CocoIndex bulk processing failed: {result.stderr}")
                return {
                    "status": "error", 
                    "error": result.stderr,
                    "stdout": result.stdout
                }
                
        except subprocess.TimeoutExpired:
            logger.error("CocoIndex bulk processing timed out")
            return {"status": "timeout"}
        except Exception as e:
            logger.error(f"CocoIndex bulk processing exception: {e}")
            return {"status": "exception", "error": str(e)}
    
    def get_processing_status(self, doc_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get processing status for documents.
        
        Args:
            doc_id: Optional specific document ID to check
            
        Returns:
            Processing status information
        """
        if not self.cocoindex_available:
            return {"status": "skipped", "reason": "cocoindex_not_available"}
        
        try:
            # Connect to PostgreSQL to check processing status
            import psycopg2
            from psycopg2.extras import RealDictCursor
            
            conn_params = {
                "host": os.getenv("DB_HOST", "localhost"),
                "port": int(os.getenv("DB_PORT", "5432")),
                "database": os.getenv("DB_NAME", "disclosure_rag"),
                "user": os.getenv("DB_USER"),
                "password": os.getenv("DB_PASSWORD")
            }
            
            with psycopg2.connect(**conn_params) as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    if doc_id:
                        # Check specific document
                        cur.execute("""
                            SELECT doc_id, last_processed, processing_status, 
                                   entities_extracted, relationships_extracted, error_message
                            FROM kg_processing_status 
                            WHERE doc_id = %s
                        """, (doc_id,))
                        result = cur.fetchone()
                        return {"status": "success", "document": dict(result) if result else None}
                    else:
                        # Get overall statistics
                        cur.execute("""
                            SELECT 
                                COUNT(*) as total_documents,
                                COUNT(*) FILTER (WHERE processing_status = 'completed') as completed,
                                COUNT(*) FILTER (WHERE processing_status = 'failed') as failed,
                                COUNT(*) FILTER (WHERE processing_status = 'processing') as processing,
                                SUM(entities_extracted) as total_entities,
                                SUM(relationships_extracted) as total_relationships
                            FROM kg_processing_status
                        """)
                        stats = cur.fetchone()
                        return {"status": "success", "statistics": dict(stats)}
                        
        except Exception as e:
            logger.error(f"Error getting processing status: {e}")
            return {"status": "error", "error": str(e)}
    
    def query_knowledge_graph(self, query: str, query_type: str = "cypher", parameters: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Query the CocoIndex-generated knowledge graph.
        
        Args:
            query: Graph query (Cypher for Neo4j, SQL for PostgreSQL)
            query_type: Type of query language ("cypher", "sql")
            parameters: Optional query parameters
            
        Returns:
            Query results
        """
        if not self.cocoindex_available:
            return {"status": "skipped", "reason": "cocoindex_not_available"}
        
        if query_type.lower() == "cypher" and self.neo4j_available:
            return self._query_neo4j(query, parameters)
        elif query_type.lower() == "sql":
            return self._query_postgresql(query, parameters)
        else:
            return {"status": "error", "error": f"Unsupported query type: {query_type}"}
    
    def _query_neo4j(self, query: str, parameters: Optional[Dict] = None) -> Dict[str, Any]:
        """Execute Cypher query against Neo4j"""
        try:
            from neo4j import GraphDatabase
            
            uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
            user = os.getenv("NEO4J_USER", "neo4j") 
            password = os.getenv("NEO4J_PASSWORD", "disclosure_kg")
            
            with GraphDatabase.driver(uri, auth=(user, password)) as driver:
                with driver.session() as session:
                    result = session.run(query, parameters or {})
                    records = [record.data() for record in result]
                    
            return {
                "status": "success",
                "query": query,
                "query_type": "cypher",
                "results": records,
                "count": len(records)
            }
            
        except Exception as e:
            logger.error(f"Neo4j query failed: {e}")
            return {"status": "error", "error": str(e)}
    
    def _query_postgresql(self, query: str, parameters: Optional[Dict] = None) -> Dict[str, Any]:
        """Execute SQL query against PostgreSQL knowledge graph tables"""
        try:
            import psycopg2
            from psycopg2.extras import RealDictCursor
            
            conn_params = {
                "host": os.getenv("DB_HOST", "localhost"),
                "port": int(os.getenv("DB_PORT", "5432")),
                "database": os.getenv("DB_NAME", "disclosure_rag"),
                "user": os.getenv("DB_USER"),
                "password": os.getenv("DB_PASSWORD")
            }
            
            with psycopg2.connect(**conn_params) as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(query, parameters or {})
                    records = [dict(record) for record in cur.fetchall()]
                    
            return {
                "status": "success",
                "query": query,
                "query_type": "sql", 
                "results": records,
                "count": len(records)
            }
            
        except Exception as e:
            logger.error(f"PostgreSQL query failed: {e}")
            return {"status": "error", "error": str(e)}
    
    def get_entity_relationships(self, entity_name: str, entity_type: str, max_depth: int = 2) -> Dict[str, Any]:
        """
        Get relationships for a specific entity.
        
        Args:
            entity_name: Name of the entity
            entity_type: Type of entity (person, organization, etc.)
            max_depth: Maximum relationship depth to traverse
            
        Returns:
            Entity relationships and connected entities
        """
        if self.neo4j_available:
            # Use Neo4j for graph traversal
            cypher_query = f"""
            MATCH (e:Entity {{name: $entity_name, type: $entity_type}})
            OPTIONAL MATCH path = (e)-[*1..{max_depth}]-(connected)
            WITH e, path, connected
            RETURN e.name as entity,
                   e.type as entity_type,
                   collect(DISTINCT {{
                       name: connected.name,
                       type: connected.type,
                       distance: length(path)
                   }}) as connections,
                   count(DISTINCT connected) as connection_count
            """
            
            return self.query_knowledge_graph(
                cypher_query, 
                "cypher", 
                {"entity_name": entity_name, "entity_type": entity_type}
            )
        else:
            # Use PostgreSQL for relationship lookup
            sql_query = """
            SELECT 
                r.subject_entity,
                r.subject_type,
                r.predicate,
                r.object_entity,
                r.object_type,
                r.confidence,
                r.context
            FROM kg_relationships r
            WHERE (r.subject_entity = %(entity_name)s AND r.subject_type = %(entity_type)s)
               OR (r.object_entity = %(entity_name)s AND r.object_type = %(entity_type)s)
            ORDER BY r.confidence DESC
            LIMIT 50
            """
            
            return self.query_knowledge_graph(
                sql_query,
                "sql",
                {"entity_name": entity_name, "entity_type": entity_type}
            )
    
    def get_document_entities(self, doc_id: str) -> Dict[str, Any]:
        """
        Get all entities extracted from a specific document.
        
        Args:
            doc_id: Document ID
            
        Returns:
            Entities and relationships found in the document
        """
        sql_query = """
        SELECT 
            em.entity_name,
            em.entity_type,
            em.confidence,
            em.context
        FROM kg_entity_mentions em
        WHERE em.document_id = %(doc_id)s
        ORDER BY em.confidence DESC, em.entity_type
        """
        
        return self.query_knowledge_graph(sql_query, "sql", {"doc_id": doc_id})
    
    # Helper methods for parsing CocoIndex output
    def _extract_doc_count(self, stdout: str) -> int:
        """Extract number of processed documents from CocoIndex output"""
        import re
        patterns = [
            r'documents:\s*(\d+)\s*added',
            r'(\d+)\s*documents\s*processed',
            r'processed\s*(\d+)\s*documents'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, stdout, re.IGNORECASE)
            if match:
                return int(match.group(1))
        return 0
    
    def _extract_entities_count(self, stdout: str) -> int:
        """Extract number of processed entities from CocoIndex output"""
        import re
        patterns = [
            r'entities:\s*(\d+)\s*added',
            r'(\d+)\s*entities\s*processed',
            r'extracted\s*(\d+)\s*entities'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, stdout, re.IGNORECASE)
            if match:
                return int(match.group(1))
        return 0
    
    def _extract_relationships_count(self, stdout: str) -> int:
        """Extract number of processed relationships from CocoIndex output"""
        import re
        patterns = [
            r'relationships:\s*(\d+)\s*added',
            r'(\d+)\s*relationships\s*processed',
            r'extracted\s*(\d+)\s*relationships'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, stdout, re.IGNORECASE)
            if match:
                return int(match.group(1))
        return 0
    
    def _extract_processing_time(self, stdout: str) -> Optional[str]:
        """Extract processing time from CocoIndex output"""
        import re
        patterns = [
            r'completed\s*in\s*([\d.]+)\s*seconds',
            r'processing\s*time:\s*([\d.]+)\s*s',
            r'elapsed:\s*([\d.]+)\s*sec'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, stdout, re.IGNORECASE)
            if match:
                return f"{match.group(1)}s"
        return None

# Global processor instance
cocoindex_processor = CocoIndexProcessor()

# Convenience functions for backward compatibility
def process_document_kg(doc_id: str, force_update: bool = False) -> Dict[str, Any]:
    """Convenience function for processing a single document"""
    return cocoindex_processor.process_document_knowledge_graph(doc_id, force_update)

def bulk_process_kg(limit: Optional[int] = None) -> Dict[str, Any]:
    """Convenience function for bulk processing"""
    return cocoindex_processor.bulk_process_knowledge_graph(limit)

def query_kg(query: str, query_type: str = "cypher", parameters: Optional[Dict] = None) -> Dict[str, Any]:
    """Convenience function for querying knowledge graph"""
    return cocoindex_processor.query_knowledge_graph(query, query_type, parameters)

if __name__ == "__main__":
    # Simple test
    processor = CocoIndexProcessor()
    print(f"CocoIndex available: {processor.cocoindex_available}")
    print(f"Neo4j available: {processor.neo4j_available}")
    
    if processor.cocoindex_available:
        # Test setup
        setup_result = processor.setup_cocoindex_flow()
        print(f"Setup result: {setup_result}")
        
        # Test status query
        status_result = processor.get_processing_status()
        print(f"Status result: {status_result}")
    else:
        print("Install CocoIndex with: pip install cocoindex")