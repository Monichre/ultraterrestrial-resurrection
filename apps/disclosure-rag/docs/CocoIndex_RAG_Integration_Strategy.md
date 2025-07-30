# CocoIndex RAG Integration Strategy
## Comprehensive ETL and Knowledge Graph Integration for Disclosure RAG

### Executive Summary

This document outlines the integration of CocoIndex's ETL processing and knowledge graph capabilities into all facets of the disclosure-rag processing pipeline. The integration will create a unified architecture where:

1. **Every document processed** through main.py triggers CocoIndex knowledge graph ETL
2. **Entity extraction** generates both traditional embeddings AND graph relationships
3. **RAG queries** leverage both vector similarity AND graph traversal
4. **Real-time updates** maintain consistency between vector store and knowledge graph

## Current Architecture Analysis

### main.py Processing Flow
1. **Input Processing**: URLs, files, YouTube transcripts
2. **Content Extraction**: Text extraction and cleaning
3. **Knowledge Base Storage**: Local PostgreSQL + vector embeddings
4. **Entity Processing**: AI-powered entity extraction with Xata search
5. **Queue Management**: Upstash integration for workflow orchestration

### entity_extraction_agent.py Capabilities
1. **Structured Extraction**: 9 entity types (topics, personnel, events, etc.)
2. **Relationship Mapping**: Entity-to-entity relationship extraction
3. **Confidence Scoring**: Quality assessment for extracted entities
4. **Database Integration**: Xata search for entity validation
5. **Vector Embeddings**: OpenAI embedding generation for entities

## CocoIndex Integration Architecture

### Phase 1: Core ETL Integration

#### 1.1 CocoIndex Flow Definition for UAP Research

```python
# apps/disclosure-rag/lib/cocoindex_flows.py

import dataclasses
import cocoindex
from typing import List, Dict, Any, Optional
from datetime import datetime

# Database connections
postgres_conn_spec = cocoindex.add_auth_entry(
    "PostgreSQLConnection",
    cocoindex.targets.PostgreSQLConnection(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.getenv("DB_NAME", "disclosure_rag"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
)

neo4j_conn_spec = cocoindex.add_auth_entry(
    "Neo4jConnection", 
    cocoindex.targets.Neo4jConnection(
        uri=os.getenv("NEO4J_URI", "bolt://localhost:7687"),
        user=os.getenv("NEO4J_USER", "neo4j"),
        password=os.getenv("NEO4J_PASSWORD", "disclosure_kg")
    )
)

@dataclasses.dataclass
class UAPDocumentSummary:
    """Enhanced document summary for UAP research materials."""
    title: str
    summary: str
    document_type: str  # transcript, article, case_file, research
    confidence_score: float
    key_topics: List[str]
    extraction_metadata: Dict[str, Any]

@dataclasses.dataclass
class UAPRelationship:
    """UAP-specific relationships between entities."""
    subject: str
    predicate: str
    object: str
    confidence: float
    context: str
    document_source: str
    relationship_metadata: Dict[str, Any]

@dataclasses.dataclass  
class UAPEntity:
    """Enhanced entity with UAP-specific attributes."""
    name: str
    type: str  # personnel, organization, location, event, technology, sighting
    confidence: float
    context: str
    metadata: Dict[str, Any]

@cocoindex.flow_def(name="UAPDisclosureKG")
def uap_disclosure_kg_flow(
    flow_builder: cocoindex.FlowBuilder, 
    data_scope: cocoindex.DataScope
) -> None:
    """
    Comprehensive UAP disclosure knowledge graph ETL flow.
    Processes all disclosure-rag content types into unified knowledge graph.
    """
    
    # Data collectors for different entity types
    document_node = data_scope.add_collector()
    entity_node = data_scope.add_collector()
    relationship_edge = data_scope.add_collector()
    entity_mention = data_scope.add_collector()
    sighting_node = data_scope.add_collector()
    timeline_event = data_scope.add_collector()
    
    # Multi-source document ingestion
    data_scope["documents"] = flow_builder.add_source(
        cocoindex.sources.PostgreSQL(
            connection=postgres_conn_spec,
            query="""
                SELECT 
                    id,
                    title,
                    content,
                    metadata,
                    doc_type,
                    source_url,
                    created_at,
                    updated_at
                FROM knowledge_base_documents 
                WHERE content IS NOT NULL
                AND length(content) > 100
            """
        )
    )
    
    with data_scope["documents"].row() as doc:
        # Enhanced document summarization with UAP context
        doc["enhanced_summary"] = doc["content"].transform(
            cocoindex.functions.ExtractByLlm(
                llm_spec=cocoindex.LlmSpec(
                    api_type=cocoindex.LlmApiType.OPENAI,
                    model="gpt-4o"
                ),
                output_type=UAPDocumentSummary,
                instruction="""
                Analyze this UAP/UFO disclosure document and provide:
                1. Comprehensive summary focused on disclosure aspects
                2. Document type classification (transcript, article, case_file, research)
                3. Confidence score for information reliability
                4. Key topics related to UAP phenomena
                5. Extraction metadata including sources and credibility indicators
                
                Focus on: government disclosure, witness testimonies, technical specifications,
                organizational involvement, timeline events, and geographical patterns.
                """
            )
        )
        
        # Collect enhanced document nodes
        document_node.collect(
            doc_id=doc["id"],
            title=doc["enhanced_summary"]["title"],
            summary=doc["enhanced_summary"]["summary"],
            document_type=doc["enhanced_summary"]["document_type"],
            confidence_score=doc["enhanced_summary"]["confidence_score"],
            source_url=doc["source_url"],
            content_hash=cocoindex.GeneratedField.MD5(doc["content"]),
            created_at=doc["created_at"],
            metadata=doc["metadata"]
        )
        
        # Advanced entity and relationship extraction
        doc["entities_and_relationships"] = doc["content"].transform(
            cocoindex.functions.ExtractByLlm(
                llm_spec=cocoindex.LlmSpec(
                    api_type=cocoindex.LlmApiType.OPENAI,
                    model="gpt-4o"
                ),
                output_type={
                    "entities": list[UAPEntity],
                    "relationships": list[UAPRelationship]
                },
                instruction="""
                Extract comprehensive entities and relationships from this UAP disclosure content:
                
                ENTITIES to extract:
                1. Personnel (witnesses, officials, researchers, military personnel)
                2. Organizations (government agencies, military units, companies, research institutions)
                3. Locations (facilities, sighting locations, coordinates, military bases)
                4. Events (incidents, meetings, observations, disclosure events)
                5. Technologies (craft descriptions, propulsion systems, detection equipment)
                6. Sightings (specific UAP observations with characteristics)
                7. Artifacts (physical evidence, documents, recordings)
                8. Dates/Timeframes (incident dates, publication dates, disclosure timelines)
                
                RELATIONSHIPS to extract:
                1. Personnel relationships (works_for, reports_to, witnessed_with)
                2. Organizational relationships (oversees, investigates, coordinates_with)
                3. Location relationships (stationed_at, occurred_at, near)
                4. Event relationships (led_to, caused_by, resulted_in)
                5. Technology relationships (uses, develops, manufactures)
                6. Temporal relationships (before, after, during, concurrent_with)
                
                For each entity/relationship, provide:
                - High confidence scores based on evidence strength
                - Rich contextual information
                - Source attribution within document
                - UAP-specific metadata (classification levels, credibility, verification status)
                """
            )
        )
        
        # Process extracted entities
        with doc["entities_and_relationships"]["entities"].row() as entity:
            entity_node.collect(
                entity_id=cocoindex.GeneratedField.UUID,
                name=entity["name"],
                type=entity["type"],
                confidence=entity["confidence"],
                context=entity["context"],
                source_document=doc["id"],
                metadata=entity["metadata"],
                created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
            )
            
            # Entity mentions in documents
            entity_mention.collect(
                id=cocoindex.GeneratedField.UUID,
                entity_name=entity["name"],
                entity_type=entity["type"],
                document_id=doc["id"],
                confidence=entity["confidence"],
                context=entity["context"]
            )
            
            # Special handling for sighting entities
            with entity.when(entity["type"] == "sighting") as sighting:
                sighting_node.collect(
                    sighting_id=cocoindex.GeneratedField.UUID,
                    description=entity["name"],
                    confidence=entity["confidence"],
                    context=entity["context"],
                    source_document=doc["id"],
                    sighting_metadata=entity["metadata"],
                    created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                )
        
        # Process extracted relationships
        with doc["entities_and_relationships"]["relationships"].row() as relationship:
            relationship_edge.collect(
                relationship_id=cocoindex.GeneratedField.UUID,
                subject=relationship["subject"],
                predicate=relationship["predicate"],
                object=relationship["object"],
                confidence=relationship["confidence"],
                context=relationship["context"],
                source_document=doc["id"],
                metadata=relationship["relationship_metadata"],
                created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
            )
    
    # Export to multiple targets
    
    # 1. Enhanced PostgreSQL storage (existing system integration)
    document_node.export(
        "enhanced_documents",
        cocoindex.targets.PostgreSQL(
            connection=postgres_conn_spec,
            table="kg_enhanced_documents",
            upsert_key_fields=["doc_id"]
        ),
        primary_key_fields=["doc_id"]
    )
    
    entity_node.export(
        "kg_entities", 
        cocoindex.targets.PostgreSQL(
            connection=postgres_conn_spec,
            table="kg_entities",
            upsert_key_fields=["entity_id"]
        ),
        primary_key_fields=["entity_id"]
    )
    
    # 2. Neo4j Knowledge Graph
    flow_builder.declare(
        cocoindex.targets.Neo4jDeclaration(
            connection=neo4j_conn_spec,
            nodes_label="Document",
            primary_key_fields=["doc_id"]
        )
    )
    
    flow_builder.declare(
        cocoindex.targets.Neo4jDeclaration(
            connection=neo4j_conn_spec,
            nodes_label="Entity", 
            primary_key_fields=["name", "type"]
        )
    )
    
    # Export document nodes to Neo4j
    document_node.export(
        "neo4j_documents",
        cocoindex.targets.Neo4j(
            connection=neo4j_conn_spec,
            mapping=cocoindex.targets.Nodes(label="Document")
        ),
        primary_key_fields=["doc_id"]
    )
    
    # Export relationships to Neo4j
    relationship_edge.export(
        "neo4j_relationships",
        cocoindex.targets.Neo4j(
            connection=neo4j_conn_spec,
            mapping=cocoindex.targets.Relationships(
                rel_type="RELATES_TO",
                source=cocoindex.targets.NodeFromFields(
                    label="Entity",
                    fields=[
                        cocoindex.targets.TargetFieldMapping(
                            source="subject", target="name"
                        )
                    ]
                ),
                target=cocoindex.targets.NodeFromFields(
                    label="Entity", 
                    fields=[
                        cocoindex.targets.TargetFieldMapping(
                            source="object", target="name"
                        )
                    ]
                )
            )
        ),
        primary_key_fields=["relationship_id"]
    )
    
    # Export entity mentions (Document-Entity relationships)
    entity_mention.export(
        "neo4j_mentions",
        cocoindex.targets.Neo4j(
            connection=neo4j_conn_spec,
            mapping=cocoindex.targets.Relationships(
                rel_type="MENTIONS",
                source=cocoindex.targets.NodeFromFields(
                    label="Document",
                    fields=[cocoindex.targets.TargetFieldMapping("document_id", "doc_id")]
                ),
                target=cocoindex.targets.NodeFromFields(
                    label="Entity",
                    fields=[
                        cocoindex.targets.TargetFieldMapping("entity_name", "name"),
                        cocoindex.targets.TargetFieldMapping("entity_type", "type")
                    ]
                )
            )
        ),
        primary_key_fields=["id"]
    )

@cocoindex.main_fn()
def run_uap_kg_flow():
    """Main function to execute UAP knowledge graph flow"""
    pass
```

#### 1.2 Integration with main.py Processing Pipeline

```python
# apps/disclosure-rag/lib/cocoindex_integration.py

import os
import logging
from typing import Dict, Any, Optional
from pathlib import Path
import subprocess
import tempfile

logger = logging.getLogger(__name__)

class CocoIndexProcessor:
    """Handles CocoIndex ETL processing for disclosure-rag content"""
    
    def __init__(self):
        self.cocoindex_available = self._check_cocoindex_availability()
        self.flow_file = Path(__file__).parent / "cocoindex_flows.py"
        
    def _check_cocoindex_availability(self) -> bool:
        """Check if CocoIndex is available and properly configured"""
        try:
            import cocoindex
            # Check required environment variables
            required_vars = [
                "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME",
                "NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD"
            ]
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            if missing_vars:
                logger.warning(f"CocoIndex configuration incomplete. Missing: {missing_vars}")
                return False
            return True
        except ImportError:
            logger.warning("CocoIndex not available - install with: pip install cocoindex")
            return False
    
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
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                logger.info(f"CocoIndex processing completed for document {doc_id}")
                return {
                    "status": "success",
                    "doc_id": doc_id,
                    "stdout": result.stdout,
                    "processing_time": "N/A"  # TODO: extract from output
                }
            else:
                logger.error(f"CocoIndex processing failed for document {doc_id}: {result.stderr}")
                return {
                    "status": "error", 
                    "doc_id": doc_id,
                    "error": result.stderr
                }
                
        except subprocess.TimeoutExpired:
            logger.error(f"CocoIndex processing timed out for document {doc_id}")
            return {"status": "timeout", "doc_id": doc_id}
        except Exception as e:
            logger.error(f"CocoIndex processing exception for document {doc_id}: {e}")
            return {"status": "exception", "doc_id": doc_id, "error": str(e)}
    
    def bulk_process_knowledge_graph(self, limit: Optional[int] = None) -> Dict[str, Any]:
        """
        Process all documents in the knowledge base through CocoIndex ETL.
        
        Args:
            limit: Optional limit on number of documents to process
            
        Returns:
            Bulk processing results
        """
        if not self.cocoindex_available:
            return {"status": "skipped", "reason": "cocoindex_not_available"}
        
        try:
            cmd = ["cocoindex", "update", str(self.flow_file)]
            if limit:
                cmd.extend(["--limit", str(limit)])
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=1800)  # 30 min timeout
            
            if result.returncode == 0:
                logger.info("CocoIndex bulk processing completed")
                return {
                    "status": "success",
                    "stdout": result.stdout,
                    "documents_processed": self._extract_doc_count(result.stdout)
                }
            else:
                logger.error(f"CocoIndex bulk processing failed: {result.stderr}")
                return {"status": "error", "error": result.stderr}
                
        except Exception as e:
            logger.error(f"CocoIndex bulk processing exception: {e}")
            return {"status": "exception", "error": str(e)}
    
    def _extract_doc_count(self, stdout: str) -> int:
        """Extract number of processed documents from CocoIndex output"""
        # TODO: Parse CocoIndex output to extract actual counts
        return 0
    
    def query_knowledge_graph(self, query: str, query_type: str = "cypher") -> Dict[str, Any]:
        """
        Query the CocoIndex-generated knowledge graph.
        
        Args:
            query: Graph query (Cypher for Neo4j)
            query_type: Type of query language
            
        Returns:
            Query results
        """
        if not self.cocoindex_available:
            return {"status": "skipped", "reason": "cocoindex_not_available"}
        
        try:
            # Connect to Neo4j and execute query
            from neo4j import GraphDatabase
            
            uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
            user = os.getenv("NEO4J_USER", "neo4j") 
            password = os.getenv("NEO4J_PASSWORD", "disclosure_kg")
            
            with GraphDatabase.driver(uri, auth=(user, password)) as driver:
                with driver.session() as session:
                    result = session.run(query)
                    records = [record.data() for record in result]
                    
            return {
                "status": "success",
                "query": query,
                "results": records,
                "count": len(records)
            }
            
        except Exception as e:
            logger.error(f"Knowledge graph query failed: {e}")
            return {"status": "error", "error": str(e)}

# Global processor instance
cocoindex_processor = CocoIndexProcessor()
```

#### 1.3 Enhanced main.py Integration

```python
# Additions to apps/disclosure-rag/main.py

# Add imports at the top
from lib.cocoindex_integration import cocoindex_processor

# Modify the add_to_knowledge_base call in all processing functions
def process_file(file_path: str, upload: bool = False, add_to_kb: bool = True) -> Optional[Dict[str, Any]]:
    """Process a local file with CocoIndex integration"""
    # ... existing code ...
    
    # Add to knowledge base
    if add_to_kb:
        doc_type = 'research' if file_path.endswith('.pdf') else 'case_file'
        doc_id = add_to_knowledge_base(data, doc_type)
        data['doc_id'] = doc_id
        
        # NEW: CocoIndex Knowledge Graph Processing
        if doc_id:
            try:
                from lib.terminal_display import display
                display.print_stage("🕸️ KNOWLEDGE GRAPH PROCESSING", "🕸️")
                display.start_spinner("🔗 Building knowledge graph relationships...")
                
                # Process document through CocoIndex ETL
                kg_result = cocoindex_processor.process_document_knowledge_graph(doc_id)
                data['knowledge_graph_processing'] = kg_result
                
                if kg_result['status'] == 'success':
                    display.stop_spinner("✅ Knowledge graph updated successfully")
                    logger.info(f"Knowledge graph processing completed for document {doc_id}")
                else:
                    display.stop_spinner(f"⚠️ Knowledge graph processing {kg_result['status']}")
                    logger.warning(f"Knowledge graph processing issue: {kg_result}")
                    
            except Exception as e:
                display.stop_spinner("❌ Knowledge graph processing failed")
                logger.error(f"Knowledge graph processing error: {e}")
                # Don't fail the entire process if KG processing fails
        
        # ... rest of existing entity processing code ...

# Similar modifications for process_youtube_url_original and process_web_url_original
```

### Phase 2: Enhanced Entity Extraction Integration

#### 2.1 CocoIndex-Powered Entity Extraction

```python
# apps/disclosure-rag/agents/cocoindex_entity_agent.py

import asyncio
import logging
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import json

from .entity_extraction_agent import EntityExtractionAgent, ExtractedEntity
from lib.cocoindex_integration import cocoindex_processor

logger = logging.getLogger(__name__)

@dataclass
class GraphEntity:
    """Entity with graph context from CocoIndex knowledge graph"""
    name: str
    type: str
    confidence: float
    context: str
    graph_connections: List[Dict[str, Any]]
    centrality_score: float
    metadata: Dict[str, Any]

class CocoIndexEntityAgent(EntityExtractionAgent):
    """Enhanced entity extraction agent with CocoIndex knowledge graph integration"""
    
    def __init__(self, ai_provider: str = "openai", model: str = None):
        super().__init__(ai_provider, model)
        self.cocoindex_processor = cocoindex_processor
        
    async def extract_with_graph_context(
        self,
        text: str,
        doc_id: str,
        domain_context: str = "UAP/UFO research",
        use_graph_context: bool = True
    ) -> Dict[str, Any]:
        """
        Extract entities with knowledge graph context for enhanced accuracy.
        
        Args:
            text: Text to analyze
            doc_id: Document ID for graph context
            domain_context: Domain for specialized extraction
            use_graph_context: Whether to use existing graph for context
            
        Returns:
            Enhanced extraction results with graph relationships
        """
        # Step 1: Standard entity extraction
        standard_result = await self.extract_and_search_entities(
            text, domain_context, search_entities=True
        )
        
        if not use_graph_context or not self.cocoindex_processor.cocoindex_available:
            return standard_result
        
        # Step 2: Get graph context for entities
        graph_enhanced_entities = []
        
        if standard_result.get("extraction_result"):
            extraction = standard_result["extraction_result"]
            all_entities = (
                extraction.topics + extraction.personnel + extraction.events +
                extraction.organizations + extraction.locations + extraction.technologies +
                extraction.artifacts + extraction.sightings
            )
            
            for entity in all_entities:
                # Query knowledge graph for entity context
                graph_context = await self._get_entity_graph_context(entity.name, entity.type)
                
                graph_entity = GraphEntity(
                    name=entity.name,
                    type=entity.type,
                    confidence=entity.confidence,
                    context=entity.context,
                    graph_connections=graph_context.get("connections", []),
                    centrality_score=graph_context.get("centrality", 0.0),
                    metadata={**entity.metadata, "graph_metadata": graph_context}
                )
                graph_enhanced_entities.append(graph_entity)
        
        # Step 3: Graph-informed relationship discovery
        enhanced_relationships = await self._discover_graph_relationships(
            graph_enhanced_entities, doc_id
        )
        
        # Step 4: Create enhanced result
        enhanced_result = {
            **standard_result,
            "graph_enhanced_entities": graph_enhanced_entities,
            "graph_relationships": enhanced_relationships,
            "graph_insights": await self._generate_graph_insights(graph_enhanced_entities)
        }
        
        return enhanced_result
    
    async def _get_entity_graph_context(self, entity_name: str, entity_type: str) -> Dict[str, Any]:
        """Get existing knowledge graph context for an entity"""
        try:
            # Query Neo4j for entity connections and centrality
            cypher_query = f"""
            MATCH (e:Entity {{name: $entity_name, type: $entity_type}})
            OPTIONAL MATCH (e)-[r]-(connected)
            WITH e, 
                 count(r) as connection_count,
                 collect({{
                     relation: type(r),
                     connected_entity: connected.name,
                     connected_type: connected.type
                 }}) as connections,
                 apoc.stats.betweenness([e]) as centrality
            RETURN e, connection_count, connections, centrality
            """
            
            result = self.cocoindex_processor.query_knowledge_graph(cypher_query)
            
            if result["status"] == "success" and result["results"]:
                record = result["results"][0]
                return {
                    "connections": record.get("connections", []),
                    "connection_count": record.get("connection_count", 0),
                    "centrality": record.get("centrality", 0.0)
                }
            
        except Exception as e:
            logger.warning(f"Failed to get graph context for {entity_name}: {e}")
        
        return {"connections": [], "connection_count": 0, "centrality": 0.0}
    
    async def _discover_graph_relationships(
        self, 
        entities: List[GraphEntity], 
        doc_id: str
    ) -> List[Dict[str, Any]]:
        """Discover relationships using knowledge graph patterns"""
        relationships = []
        
        try:
            # Find relationship patterns between entities in this document
            entity_names = [e.name for e in entities]
            
            if len(entity_names) < 2:
                return relationships
            
            cypher_query = f"""
            MATCH (e1:Entity)-[r]-(e2:Entity)
            WHERE e1.name IN $entity_names AND e2.name IN $entity_names
            RETURN e1.name as entity1, e1.type as type1,
                   type(r) as relationship,
                   e2.name as entity2, e2.type as type2,
                   r.confidence as confidence
            """
            
            result = self.cocoindex_processor.query_knowledge_graph(
                cypher_query, {"entity_names": entity_names}
            )
            
            if result["status"] == "success":
                for record in result["results"]:
                    relationships.append({
                        "from_entity": record["entity1"],
                        "from_type": record["type1"],
                        "relationship_type": record["relationship"],
                        "to_entity": record["entity2"],
                        "to_type": record["type2"],
                        "confidence": record.get("confidence", 0.8),
                        "source": "knowledge_graph",
                        "doc_id": doc_id
                    })
            
        except Exception as e:
            logger.warning(f"Failed to discover graph relationships: {e}")
        
        return relationships
    
    async def _generate_graph_insights(self, entities: List[GraphEntity]) -> Dict[str, Any]:
        """Generate insights based on knowledge graph analysis"""
        insights = {
            "high_centrality_entities": [],
            "novel_entities": [],
            "connected_clusters": [],
            "relationship_patterns": []
        }
        
        try:
            # Find high centrality entities (important in the graph)
            high_centrality = [e for e in entities if e.centrality_score > 0.1]
            insights["high_centrality_entities"] = [
                {"name": e.name, "type": e.type, "centrality": e.centrality_score}
                for e in high_centrality
            ]
            
            # Find novel entities (not well connected in graph)
            novel_entities = [e for e in entities if len(e.graph_connections) == 0]
            insights["novel_entities"] = [
                {"name": e.name, "type": e.type, "confidence": e.confidence}
                for e in novel_entities
            ]
            
            # Analyze connection patterns
            connection_counts = {}
            for entity in entities:
                for conn in entity.graph_connections:
                    rel_type = conn.get("relation", "unknown")
                    connection_counts[rel_type] = connection_counts.get(rel_type, 0) + 1
            
            insights["relationship_patterns"] = [
                {"type": rel_type, "count": count}
                for rel_type, count in connection_counts.items()
            ]
            
        except Exception as e:
            logger.warning(f"Failed to generate graph insights: {e}")
        
        return insights
```

#### 2.2 Integration with Existing Entity Processing

```python
# Modifications to apps/disclosure-rag/main.py entity processing section

# Replace existing entity processing with CocoIndex-enhanced version
if doc_id:
    try:
        from lib.terminal_display import display
        display.print_stage("🧠 ENHANCED ENTITY PROCESSING", "🧠")
        
        # Import enhanced agent
        from agents.cocoindex_entity_agent import CocoIndexEntityAgent
        
        # Create enhanced agent
        enhanced_agent = CocoIndexEntityAgent(ai_provider="openai")
        
        display.start_spinner("🔍 Extracting entities with knowledge graph context...")
        logger.info("Starting enhanced entity processing with graph context...")
        
        # Use enhanced extraction with graph context
        entity_results = await enhanced_agent.extract_with_graph_context(
            content, doc_id, domain_context="UAP/UFO research"
        )
        
        # Add enhanced entity processing results to metadata
        data['metadata']['enhanced_entity_processing'] = entity_results
        
        # Extract metrics for display
        total_entities = entity_results.get('summary', {}).get('total_entities_extracted', 0)
        graph_entities = len(entity_results.get('graph_enhanced_entities', []))
        graph_relationships = len(entity_results.get('graph_relationships', []))
        
        display.stop_spinner(
            f"✅ Extracted {total_entities} entities, {graph_entities} with graph context, {graph_relationships} graph relationships"
        )
        logger.info(f"Enhanced entity processing complete: {entity_results.get('summary', {})}")
        
    except Exception as e:
        display.stop_spinner("❌ Enhanced entity processing failed")
        logger.error(f"Enhanced entity processing failed: {e}")
        # Fallback to standard entity processing
        # ... existing entity processing code ...
```

### Phase 3: Unified RAG + Knowledge Graph Query Architecture

#### 3.1 Hybrid Query Engine

```python
# apps/disclosure-rag/lib/hybrid_query_engine.py

import logging
from typing import Dict, Any, List, Optional, Tuple
import asyncio
from dataclasses import dataclass

from lib.cocoindex_integration import cocoindex_processor
from lib.knowledge_base_service import kb_service

logger = logging.getLogger(__name__)

@dataclass
class QueryResult:
    """Unified result from hybrid RAG + Knowledge Graph query"""
    vector_results: List[Dict[str, Any]]
    graph_results: List[Dict[str, Any]]
    combined_score: float
    query_strategy: str
    execution_time: float
    metadata: Dict[str, Any]

class HybridQueryEngine:
    """Combines vector similarity search with knowledge graph traversal"""
    
    def __init__(self):
        self.kb_service = kb_service
        self.cocoindex_processor = cocoindex_processor
        self.graph_available = cocoindex_processor.cocoindex_available
        
    async def hybrid_query(
        self,
        query: str,
        query_type: str = "auto",  # "vector", "graph", "hybrid", "auto"
        max_results: int = 10,
        vector_weight: float = 0.6,
        graph_weight: float = 0.4
    ) -> QueryResult:
        """
        Execute hybrid query combining vector similarity and graph traversal.
        
        Args:
            query: Natural language query
            query_type: Query strategy to use
            max_results: Maximum number of results to return
            vector_weight: Weight for vector similarity scores
            graph_weight: Weight for graph traversal scores
            
        Returns:
            Unified query results with combined scoring
        """
        start_time = asyncio.get_event_loop().time()
        
        # Determine optimal query strategy
        if query_type == "auto":
            query_type = await self._determine_optimal_strategy(query)
        
        vector_results = []
        graph_results = []
        
        try:
            if query_type in ["vector", "hybrid"]:
                # Execute vector similarity search
                vector_results = await self._vector_query(query, max_results)
            
            if query_type in ["graph", "hybrid"] and self.graph_available:
                # Execute knowledge graph traversal
                graph_results = await self._graph_query(query, max_results)
        
        except Exception as e:
            logger.error(f"Hybrid query execution failed: {e}")
            return QueryResult(
                vector_results=[],
                graph_results=[],
                combined_score=0.0,
                query_strategy=query_type,
                execution_time=0.0,
                metadata={"error": str(e)}
            )
        
        # Combine and rank results
        combined_results = await self._combine_results(
            vector_results, graph_results, vector_weight, graph_weight
        )
        
        execution_time = asyncio.get_event_loop().time() - start_time
        
        return QueryResult(
            vector_results=vector_results[:max_results],
            graph_results=graph_results[:max_results],
            combined_score=self._calculate_combined_score(combined_results),
            query_strategy=query_type,
            execution_time=execution_time,
            metadata={
                "vector_count": len(vector_results),
                "graph_count": len(graph_results),
                "combined_count": len(combined_results)
            }
        )
    
    async def _determine_optimal_strategy(self, query: str) -> str:
        """Determine the best query strategy based on query characteristics"""
        # Simple heuristics - could be enhanced with ML classification
        
        relationship_keywords = [
            "relationship", "connected", "associated", "related", "linked",
            "works for", "investigated by", "witnessed by", "occurred at"
        ]
        
        entity_keywords = [
            "who is", "what is", "where is", "when did", "which organization",
            "person", "official", "witness", "location", "event"
        ]
        
        query_lower = query.lower()
        
        # Check for relationship queries
        if any(keyword in query_lower for keyword in relationship_keywords):
            return "hybrid" if self.graph_available else "vector"
        
        # Check for entity-focused queries
        if any(keyword in query_lower for keyword in entity_keywords):
            return "graph" if self.graph_available else "vector"
        
        # Default to hybrid for complex queries
        return "hybrid" if self.graph_available else "vector"
    
    async def _vector_query(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Execute vector similarity search"""
        try:
            # Use existing knowledge base service for vector search
            results = self.kb_service.search_documents(query, limit=max_results * 2)
            
            # Format results consistently
            formatted_results = []
            for result in results:
                formatted_results.append({
                    "doc_id": result.get("id"),
                    "title": result.get("title", ""),
                    "content": result.get("content", "")[:500],
                    "score": result.get("similarity_score", 0.0),
                    "source": "vector_search",
                    "metadata": result.get("metadata", {})
                })
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"Vector query failed: {e}")
            return []
    
    async def _graph_query(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Execute knowledge graph traversal query"""
        try:
            # Extract entities from query for graph traversal
            query_entities = await self._extract_query_entities(query)
            
            if not query_entities:
                return []
            
            # Build Cypher query for graph traversal
            cypher_query = self._build_graph_query(query_entities, max_results)
            
            # Execute graph query
            graph_result = self.cocoindex_processor.query_knowledge_graph(cypher_query)
            
            if graph_result["status"] != "success":
                return []
            
            # Format graph results
            formatted_results = []
            for record in graph_result["results"]:
                formatted_results.append({
                    "entities": record.get("entities", []),
                    "relationships": record.get("relationships", []),
                    "document_context": record.get("documents", []),
                    "score": record.get("relevance_score", 0.8),
                    "source": "knowledge_graph",
                    "metadata": {"graph_path": record.get("path", [])}
                })
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"Graph query failed: {e}")
            return []
    
    async def _extract_query_entities(self, query: str) -> List[str]:
        """Extract key entities from query for graph traversal"""
        # Simple entity extraction - could be enhanced with NER
        # For now, use basic keyword matching
        
        common_entities = [
            "Lue Elizondo", "David Spergel", "Pentagon", "AATIP", "NASA",
            "UAP", "UFO", "Navy", "Air Force", "DOD", "disclosure"
        ]
        
        found_entities = []
        query_lower = query.lower()
        
        for entity in common_entities:
            if entity.lower() in query_lower:
                found_entities.append(entity)
        
        return found_entities
    
    def _build_graph_query(self, entities: List[str], max_results: int) -> str:
        """Build Cypher query for knowledge graph traversal"""
        if len(entities) == 1:
            # Single entity query - find connections
            return f"""
            MATCH (e:Entity {{name: $entity}})
            OPTIONAL MATCH (e)-[r]-(connected)
            OPTIONAL MATCH (d:Document)-[:MENTIONS]->(e)
            RETURN e.name as entity, 
                   collect(DISTINCT connected.name) as connected_entities,
                   collect(DISTINCT d.title) as documents,
                   count(r) as connection_count
            ORDER BY connection_count DESC
            LIMIT {max_results}
            """
        else:
            # Multi-entity query - find paths between entities
            return f"""
            MATCH path = (e1:Entity)-[*1..3]-(e2:Entity)
            WHERE e1.name IN $entities AND e2.name IN $entities AND e1 <> e2
            WITH path, length(path) as path_length
            ORDER BY path_length ASC
            RETURN [n in nodes(path) | n.name] as entities,
                   [r in relationships(path) | type(r)] as relationships,
                   path_length
            LIMIT {max_results}
            """
    
    async def _combine_results(
        self,
        vector_results: List[Dict[str, Any]],
        graph_results: List[Dict[str, Any]],
        vector_weight: float,
        graph_weight: float
    ) -> List[Dict[str, Any]]:
        """Combine and re-rank results from vector and graph searches"""
        combined = []
        
        # Add vector results with weighted scores
        for result in vector_results:
            combined.append({
                **result,
                "combined_score": result["score"] * vector_weight,
                "result_type": "vector"
            })
        
        # Add graph results with weighted scores
        for result in graph_results:
            combined.append({
                **result,
                "combined_score": result["score"] * graph_weight,
                "result_type": "graph"
            })
        
        # Sort by combined score
        combined.sort(key=lambda x: x["combined_score"], reverse=True)
        
        return combined
    
    def _calculate_combined_score(self, results: List[Dict[str, Any]]) -> float:
        """Calculate overall quality score for the combined results"""
        if not results:
            return 0.0
        
        scores = [r.get("combined_score", 0.0) for r in results]
        return sum(scores) / len(scores)

# Global hybrid query engine instance
hybrid_query_engine = HybridQueryEngine()
```

### Phase 4: Deployment and Monitoring

#### 4.1 Setup and Configuration

```bash
# apps/disclosure-rag/setup_cocoindex.sh

#!/bin/bash
set -e

echo "🚀 Setting up CocoIndex Knowledge Graph Integration"

# Install CocoIndex
echo "📦 Installing CocoIndex..."
pip install cocoindex>=0.1.67

# Install additional dependencies
pip install neo4j>=5.0.0
pip install py2neo>=2021.2.3

# Setup Neo4j database
echo "🗄️ Setting up Neo4j database..."
docker run -d \
    --name disclosure-neo4j \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/disclosure_kg \
    -e NEO4J_PLUGINS='["apoc", "graph-data-science"]' \
    -v neo4j_data:/data \
    neo4j:5.0

# Wait for Neo4j to start
echo "⏳ Waiting for Neo4j to start..."
sleep 30

# Initialize CocoIndex flows
echo "🔧 Initializing CocoIndex flows..."
cd apps/disclosure-rag
cocoindex setup lib/cocoindex_flows.py

# Create database tables for enhanced storage
echo "📊 Setting up enhanced database tables..."
psql $DATABASE_URL -f setup/cocoindex_tables.sql

echo "✅ CocoIndex integration setup complete!"
echo "🌐 Neo4j Browser: http://localhost:7474 (neo4j/disclosure_kg)"
echo "📈 Run initial processing: python -c 'from lib.cocoindex_integration import cocoindex_processor; print(cocoindex_processor.bulk_process_knowledge_graph())'"
```

#### 4.2 Database Schema Extensions

```sql
-- apps/disclosure-rag/setup/cocoindex_tables.sql

-- Enhanced document storage with knowledge graph metadata
CREATE TABLE IF NOT EXISTS kg_enhanced_documents (
    doc_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    document_type TEXT,
    confidence_score FLOAT,
    source_url TEXT,
    content_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Entity storage with graph relationships
CREATE TABLE IF NOT EXISTS kg_entities (
    entity_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    UNIQUE(name, type, source_document)
);

-- Relationship storage
CREATE TABLE IF NOT EXISTS kg_relationships (
    relationship_id UUID PRIMARY KEY,
    subject TEXT NOT NULL,
    predicate TEXT NOT NULL,
    object TEXT NOT NULL,
    confidence FLOAT,
    context TEXT,
    source_document TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Processing status tracking
CREATE TABLE IF NOT EXISTS kg_processing_status (
    doc_id TEXT PRIMARY KEY,
    last_processed TIMESTAMP,
    processing_status TEXT,
    error_message TEXT,
    entities_extracted INTEGER DEFAULT 0,
    relationships_extracted INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_kg_entities_name_type ON kg_entities(name, type);
CREATE INDEX IF NOT EXISTS idx_kg_entities_source ON kg_entities(source_document);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_subject ON kg_relationships(subject);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_object ON kg_relationships(object);
CREATE INDEX IF NOT EXISTS idx_kg_processing_status ON kg_processing_status(processing_status);
```

### Phase 5: Implementation Checklist

#### 5.1 Development Tasks

- [ ] **CocoIndex Flow Development**
  - [ ] Create comprehensive UAP knowledge graph flow
  - [ ] Implement entity and relationship extraction schemas
  - [ ] Set up multi-target exports (PostgreSQL + Neo4j)
  - [ ] Add error handling and retry logic

- [ ] **Integration Layer**
  - [ ] Develop CocoIndexProcessor class
  - [ ] Implement document-level ETL triggers
  - [ ] Add bulk processing capabilities
  - [ ] Create knowledge graph query interface

- [ ] **Enhanced Entity Processing**
  - [ ] Extend EntityExtractionAgent with graph context
  - [ ] Implement graph-informed relationship discovery
  - [ ] Add centrality and importance scoring
  - [ ] Create entity disambiguation using graph data

- [ ] **Hybrid Query Engine**
  - [ ] Develop vector + graph query combination
  - [ ] Implement intelligent query strategy selection
  - [ ] Create result fusion and ranking algorithms
  - [ ] Add performance monitoring

- [ ] **Infrastructure Setup**
  - [ ] Deploy Neo4j instance with proper configuration
  - [ ] Set up database schema extensions
  - [ ] Configure CocoIndex environment
  - [ ] Implement monitoring and logging

#### 5.2 Testing Strategy

- [ ] **Unit Tests**
  - [ ] CocoIndex flow execution tests
  - [ ] Entity extraction accuracy tests
  - [ ] Knowledge graph query tests
  - [ ] Integration layer tests

- [ ] **Integration Tests**
  - [ ] End-to-end document processing pipeline
  - [ ] Hybrid query engine accuracy tests
  - [ ] Performance benchmarks
  - [ ] Error handling and recovery tests

- [ ] **Data Quality Tests**
  - [ ] Entity extraction precision/recall
  - [ ] Relationship accuracy validation
  - [ ] Graph completeness checks
  - [ ] Consistency between vector and graph data

### Implementation Timeline

**Week 1-2: Foundation**
- Set up CocoIndex development environment
- Create basic knowledge graph flow
- Implement PostgreSQL integration

**Week 3-4: Core Integration**
- Integrate with main.py processing pipeline
- Enhance entity extraction with graph context
- Set up Neo4j knowledge graph storage

**Week 5-6: Hybrid Querying**
- Develop hybrid query engine
- Implement result fusion algorithms
- Add performance optimizations

**Week 7-8: Production Deployment**
- Production infrastructure setup
- Comprehensive testing and validation
- Documentation and monitoring setup

This comprehensive integration will transform the disclosure-rag system into a sophisticated knowledge graph-powered research platform, maintaining all existing capabilities while adding powerful graph-based insights and relationships.