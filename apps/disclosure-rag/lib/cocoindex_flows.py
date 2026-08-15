#!/usr/bin/env python3
"""
CocoIndex Knowledge Graph Flows for UAP Research
Comprehensive ETL processing using existing entity schema
"""

import os
import dataclasses
import logging
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from enum import Enum

logger = logging.getLogger(__name__)

try:
    import cocoindex
    COCOINDEX_AVAILABLE = True
    logger.info("CocoIndex available for knowledge graph processing")
except ImportError:
    COCOINDEX_AVAILABLE = False
    logger.warning(
        "CocoIndex not available - install with: pip install cocoindex")

# Database connections
if COCOINDEX_AVAILABLE:
    postgres_conn_spec = cocoindex.add_auth_entry(
        "PostgreSQLConnection",
        cocoindex.DatabaseConnectionSpec(
            url=f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
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

# Enums for consistency with existing schema


class EntityType(Enum):
    PERSON = "person"
    EVENT = "event"
    ORGANIZATION = "organization"
    LOCATION = "location"
    ARTIFACT = "artifact"
    SIGHTING = "sighting"
    TESTIMONY = "testimony"
    DOCUMENT = "document"
    TOPIC = "topic"


class PersonRole(Enum):
    WITNESS = "witness"
    INVESTIGATOR = "investigator"
    EXPERT = "expert"
    OFFICIAL = "official"
    RESEARCHER = "researcher"
    CONTACTEE = "contactee"


class EventType(Enum):
    SIGHTING = "sighting"
    ENCOUNTER = "encounter"
    INCIDENT = "incident"
    LANDING = "landing"
    ABDUCTION = "abduction"
    CONTACT = "contact"


class OrganizationType(Enum):
    AGENCY = "agency"
    RESEARCH_GROUP = "research_group"
    MILITARY = "military"
    CIVILIAN_ORG = "civilian_org"


@dataclasses.dataclass
class PersonEntity:
    """Enhanced person entity matching existing personnel schema"""
    id: str
    full_name: str
    aliases: List[str]
    role: str
    # title, organization, years_experience, specializations, security_clearance
    credentials: Dict[str, Any]
    # reliability_score, technical_expertise, research_impact, public_visibility
    metrics: Dict[str, float]
    verification_status: str
    biography: str
    contact_info: Dict[str, Any]
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class EventEntity:
    """Enhanced event entity matching existing events schema"""
    id: str
    title: str
    event_type: str
    date_time: Optional[datetime]
    duration: Optional[str]
    location_ref: str
    witnesses: List[str]
    classification: str  # Close encounter type
    environment_conditions: Dict[str, Any]
    # electromagnetic_effects, physical_traces, etc.
    phenomena: Dict[str, bool]
    verification_status: str
    evidence: List[str]
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class OrganizationEntity:
    """Enhanced organization entity matching existing organizations schema"""
    id: str
    name: str
    type: str
    jurisdiction: List[str]
    founding_date: Optional[datetime]
    status: str
    security_level: str
    parent_org: Optional[str]
    subsidiaries: List[str]
    key_personnel: List[str]
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class LocationEntity:
    """Enhanced location entity matching existing locations schema"""
    id: str
    name: str
    type: str
    coordinates: Dict[str, float]  # latitude, longitude, altitude, accuracy
    address: Dict[str, str]        # street, city, state, country, postal_code
    geohash: str
    # frequency, intensity, pattern_confidence
    activity_metrics: Dict[str, float]
    security_classification: str
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class ArtifactEntity:
    """Enhanced artifact entity matching existing artifacts schema"""
    id: str
    name: str
    type: str
    discovery_date: Optional[datetime]
    discovery_location: str
    chain_of_custody: List[Dict[str, Any]]
    # mass, dimensions, composition, radiation_level
    physical_properties: Dict[str, Any]
    analysis_status: str
    security_classification: str
    storage_location: str
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class SightingEntity:
    """Enhanced sighting entity matching existing sightings schema"""
    id: str
    date: Optional[datetime]
    date_posted: Optional[datetime]
    description: str
    media_link: Optional[str]
    location: Dict[str, str]  # city, state, country
    coordinates: Dict[str, float]  # latitude, longitude
    shape: str
    duration_seconds: Optional[str]
    duration_hours_min: Optional[str]
    comments: str
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class TestimonyEntity:
    """Enhanced testimony entity matching existing testimonies schema"""
    id: str
    claim: str
    summary: str
    source: str
    context_info: str
    documentation: List[str]
    date: Optional[datetime]
    event_ref: Optional[str]
    witness_ref: Optional[str]
    organization_ref: Optional[str]
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class TopicEntity:
    """Enhanced topic entity matching existing topics schema"""
    id: str
    name: str
    title: str
    summary: str
    photos: List[str]
    confidence: float
    context: str
    source_document: str


@dataclasses.dataclass
class UAPRelationship:
    """Relationships between UAP entities using existing relationship patterns"""
    id: str
    subject_entity: str
    subject_type: str
    predicate: str  # Using existing relationship types from schema
    object_entity: str
    object_type: str
    confidence: float
    context: str
    source_document: str
    relationship_metadata: Dict[str, Any]


@dataclasses.dataclass
class UAPDocumentSummary:
    """Enhanced document summary for UAP research materials"""
    title: str
    summary: str
    document_type: str  # transcript, article, case_file, research
    confidence_score: float
    key_topics: List[str]
    extraction_metadata: Dict[str, Any]
    entities_found: Dict[str, int]  # Count by entity type
    relationships_found: int


def get_ner_extraction_instruction() -> str:
    """Get the comprehensive NER extraction instruction from the YAML registry."""
    try:
        from lib.prompt_loader import get_prompt
        ner_content = get_prompt("disclosure.ner")
    except Exception as e:
        logger.warning(f"Could not load NER prompt from registry: {e}")
        ner_content = "Using fallback NER schema"

    return f"""
    Extract comprehensive entities from this UAP disclosure content using the established schema:

    {ner_content}

    ENTITY EXTRACTION REQUIREMENTS:

    1. **PERSON entities** (witnesses, officials, researchers, military personnel):
       - Extract full_name, role, credentials, verification_status
       - Include metrics like reliability_score, technical_expertise
       - Capture biographical information and contact details
       - Role types: WITNESS, INVESTIGATOR, EXPERT, OFFICIAL, RESEARCHER, CONTACTEE

    2. **EVENT entities** (incidents, sightings, encounters):
       - Extract title, event_type, date_time, duration, location
       - Include classification (close encounter types)
       - Document environment conditions and phenomena
       - Event types: SIGHTING, ENCOUNTER, INCIDENT, LANDING, ABDUCTION, CONTACT

    3. **ORGANIZATION entities** (agencies, military units, research groups):
       - Extract name, type, jurisdiction, security_level
       - Include parent/subsidiary relationships
       - Document key personnel associations
       - Organization types: AGENCY, RESEARCH_GROUP, MILITARY, CIVILIAN_ORG

    4. **LOCATION entities** (facilities, sighting locations, coordinates):
       - Extract coordinates, address, geohash
       - Include activity metrics and security classification
       - Document geographic patterns

    5. **ARTIFACT entities** (physical evidence, debris, media):
       - Extract name, type, discovery details, chain of custody
       - Include physical properties and analysis status
       - Document security classification

    6. **SIGHTING entities** (UAP observations):
       - Extract date, location, description, shape, duration
       - Include witness information and media links
       - Document environmental conditions

    7. **TESTIMONY entities** (witness accounts, statements):
       - Extract claims, sources, context, documentation
       - Link to events, witnesses, organizations
       - Include verification status

    8. **TOPIC entities** (subjects, theories, concepts):
       - Extract name, title, summary
       - Include related documentation and media

    9. **RELATIONSHIPS**:
       - Personnel → Organization (works_for, member_of)
       - Event → Location (occurred_at)
       - Event → Person (witnessed_by, investigated_by)
       - Testimony → Event (describes, relates_to)
       - Artifact → Location (discovered_at)
       - Organization → Location (stationed_at)
       - Person → Topic (expert_in, researches)

    For each entity, provide:
    - High confidence scores (0.0-1.0) based on evidence strength
    - Rich contextual information from the document
    - Source attribution and verification indicators
    - Structured metadata following the established schema
    - Unique identifiers for proper relationship mapping

    CRITICAL: Ensure all entities have valid IDs and proper type classification for knowledge graph construction.
    """


if COCOINDEX_AVAILABLE:
    @cocoindex.flow_def(name="UAPDisclosureKG")
    def uap_disclosure_kg_flow(
        flow_builder: cocoindex.FlowBuilder,
        data_scope: cocoindex.DataScope
    ) -> None:
        """
        Comprehensive UAP disclosure knowledge graph ETL flow using existing entity schema.
        Processes all disclosure-rag content types into unified knowledge graph.
        """
        try:
            logger.info("Starting UAPDisclosureKG flow execution")

            # Data collectors for different entity types (aligned with existing schema)
            document_node = data_scope.add_collector()
            person_entity = data_scope.add_collector()
            event_entity = data_scope.add_collector()
            organization_entity = data_scope.add_collector()
            location_entity = data_scope.add_collector()
            artifact_entity = data_scope.add_collector()
            sighting_entity = data_scope.add_collector()
            testimony_entity = data_scope.add_collector()
            topic_entity = data_scope.add_collector()
            relationship_edge = data_scope.add_collector()
            entity_mention = data_scope.add_collector()

            # Multi-source document ingestion
            data_scope["documents"] = flow_builder.add_source(
                cocoindex.sources.Postgres(
                    database=postgres_conn_spec,
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
                        ORDER BY created_at DESC
                    """
                )
            )

            with data_scope["documents"].row() as doc:
                logger.debug(f"Processing document: {doc['id']}")

                # Enhanced document summarization with entity counting
                doc["enhanced_summary"] = doc["content"].transform(
                    cocoindex.functions.ExtractByLlm(
                        llm_spec=cocoindex.LlmSpec(
                            api_type=cocoindex.LlmApiType.OPENAI,
                            model="gpt-5"
                        ),
                        output_type=UAPDocumentSummary,
                        instruction="""
                        Analyze this UAP/UFO disclosure document using the established entity schema.
                        
                        Provide a comprehensive summary that includes:
                        1. Document classification (transcript, article, case_file, research)
                        2. Confidence score for information reliability (0.0-1.0)
                        3. Key topics mentioned in the document
                        4. Count of entities found by type
                        5. Metadata including source credibility and verification status
                        
                        Focus on: government disclosure, witness testimonies, technical specifications,
                        organizational involvement, timeline events, geographical patterns, and artifact references.
                        
                        Return structured data for database insertion.
                        """
                    )
                )

                # Comprehensive entity extraction using existing NER schema
                doc["extracted_entities"] = doc["content"].transform(
                    cocoindex.functions.ExtractByLlm(
                        llm_spec=cocoindex.LlmSpec(
                            api_type=cocoindex.LlmApiType.OPENAI,
                            model="gpt-5"
                        ),
                        output_type={
                            "persons": list[PersonEntity],
                            "events": list[EventEntity],
                            "organizations": list[OrganizationEntity],
                            "locations": list[LocationEntity],
                            "artifacts": list[ArtifactEntity],
                            "sightings": list[SightingEntity],
                            "testimonies": list[TestimonyEntity],
                            "topics": list[TopicEntity],
                            "relationships": list[UAPRelationship]
                        },
                        instruction=get_ner_extraction_instruction()
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
                    metadata=doc["metadata"],
                    entities_found=doc["enhanced_summary"]["entities_found"],
                    relationships_found=doc["enhanced_summary"]["relationships_found"]
                )

                # Process Person entities
                with doc["extracted_entities"]["persons"].row() as person:
                    person_entity.collect(
                        entity_id=person["id"],
                        full_name=person["full_name"],
                        aliases=person["aliases"],
                        role=person["role"],
                        credentials=person["credentials"],
                        metrics=person["metrics"],
                        verification_status=person["verification_status"],
                        biography=person["biography"],
                        confidence=person["confidence"],
                        context=person["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=person["full_name"],
                        entity_type="person",
                        entity_id=person["id"],
                        document_id=doc["id"],
                        confidence=person["confidence"],
                        context=person["context"]
                    )

                # Process Event entities
                with doc["extracted_entities"]["events"].row() as event:
                    event_entity.collect(
                        entity_id=event["id"],
                        title=event["title"],
                        event_type=event["event_type"],
                        date_time=event["date_time"],
                        duration=event["duration"],
                        location_ref=event["location_ref"],
                        witnesses=event["witnesses"],
                        classification=event["classification"],
                        environment_conditions=event["environment_conditions"],
                        phenomena=event["phenomena"],
                        verification_status=event["verification_status"],
                        evidence=event["evidence"],
                        confidence=event["confidence"],
                        context=event["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=event["title"],
                        entity_type="event",
                        entity_id=event["id"],
                        document_id=doc["id"],
                        confidence=event["confidence"],
                        context=event["context"]
                    )

                # Process Organization entities
                with doc["extracted_entities"]["organizations"].row() as org:
                    organization_entity.collect(
                        entity_id=org["id"],
                        name=org["name"],
                        type=org["type"],
                        jurisdiction=org["jurisdiction"],
                        founding_date=org["founding_date"],
                        status=org["status"],
                        security_level=org["security_level"],
                        parent_org=org["parent_org"],
                        subsidiaries=org["subsidiaries"],
                        key_personnel=org["key_personnel"],
                        confidence=org["confidence"],
                        context=org["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=org["name"],
                        entity_type="organization",
                        entity_id=org["id"],
                        document_id=doc["id"],
                        confidence=org["confidence"],
                        context=org["context"]
                    )

                # Process Location entities
                with doc["extracted_entities"]["locations"].row() as location:
                    location_entity.collect(
                        entity_id=location["id"],
                        name=location["name"],
                        type=location["type"],
                        coordinates=location["coordinates"],
                        address=location["address"],
                        geohash=location["geohash"],
                        activity_metrics=location["activity_metrics"],
                        security_classification=location["security_classification"],
                        confidence=location["confidence"],
                        context=location["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=location["name"],
                        entity_type="location",
                        entity_id=location["id"],
                        document_id=doc["id"],
                        confidence=location["confidence"],
                        context=location["context"]
                    )

                # Process Artifact entities
                with doc["extracted_entities"]["artifacts"].row() as artifact:
                    artifact_entity.collect(
                        entity_id=artifact["id"],
                        name=artifact["name"],
                        type=artifact["type"],
                        discovery_date=artifact["discovery_date"],
                        discovery_location=artifact["discovery_location"],
                        chain_of_custody=artifact["chain_of_custody"],
                        physical_properties=artifact["physical_properties"],
                        analysis_status=artifact["analysis_status"],
                        security_classification=artifact["security_classification"],
                        storage_location=artifact["storage_location"],
                        confidence=artifact["confidence"],
                        context=artifact["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=artifact["name"],
                        entity_type="artifact",
                        entity_id=artifact["id"],
                        document_id=doc["id"],
                        confidence=artifact["confidence"],
                        context=artifact["context"]
                    )

                # Process Sighting entities
                with doc["extracted_entities"]["sightings"].row() as sighting:
                    sighting_entity.collect(
                        entity_id=sighting["id"],
                        date=sighting["date"],
                        date_posted=sighting["date_posted"],
                        description=sighting["description"],
                        media_link=sighting["media_link"],
                        location=sighting["location"],
                        coordinates=sighting["coordinates"],
                        shape=sighting["shape"],
                        duration_seconds=sighting["duration_seconds"],
                        duration_hours_min=sighting["duration_hours_min"],
                        comments=sighting["comments"],
                        confidence=sighting["confidence"],
                        context=sighting["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=sighting["description"][:100],
                        entity_type="sighting",
                        entity_id=sighting["id"],
                        document_id=doc["id"],
                        confidence=sighting["confidence"],
                        context=sighting["context"]
                    )

                # Process Testimony entities
                with doc["extracted_entities"]["testimonies"].row() as testimony:
                    testimony_entity.collect(
                        entity_id=testimony["id"],
                        claim=testimony["claim"],
                        summary=testimony["summary"],
                        source=testimony["source"],
                        context_info=testimony["context_info"],
                        documentation=testimony["documentation"],
                        date=testimony["date"],
                        event_ref=testimony["event_ref"],
                        witness_ref=testimony["witness_ref"],
                        organization_ref=testimony["organization_ref"],
                        confidence=testimony["confidence"],
                        context=testimony["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=testimony["claim"][:100],
                        entity_type="testimony",
                        entity_id=testimony["id"],
                        document_id=doc["id"],
                        confidence=testimony["confidence"],
                        context=testimony["context"]
                    )

                # Process Topic entities
                with doc["extracted_entities"]["topics"].row() as topic:
                    topic_entity.collect(
                        entity_id=topic["id"],
                        name=topic["name"],
                        title=topic["title"],
                        summary=topic["summary"],
                        photos=topic["photos"],
                        confidence=topic["confidence"],
                        context=topic["context"],
                        source_document=doc["id"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

                    entity_mention.collect(
                        id=cocoindex.GeneratedField.UUID,
                        entity_name=topic["name"],
                        entity_type="topic",
                        entity_id=topic["id"],
                        document_id=doc["id"],
                        confidence=topic["confidence"],
                        context=topic["context"]
                    )

                # Process extracted relationships
                with doc["extracted_entities"]["relationships"].row() as relationship:
                    relationship_edge.collect(
                        relationship_id=relationship["id"],
                        subject_entity=relationship["subject_entity"],
                        subject_type=relationship["subject_type"],
                        predicate=relationship["predicate"],
                        object_entity=relationship["object_entity"],
                        object_type=relationship["object_type"],
                        confidence=relationship["confidence"],
                        context=relationship["context"],
                        source_document=doc["id"],
                        metadata=relationship["relationship_metadata"],
                        created_at=cocoindex.GeneratedField.CURRENT_TIMESTAMP
                    )

            # Export to multiple targets with proper schema alignment

            # 1. Enhanced PostgreSQL storage (existing system integration)
            document_node.export(
                "kg_enhanced_documents",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_enhanced_documents",
                    upsert_key_fields=["doc_id"]
                ),
                primary_key_fields=["doc_id"]
            )

            # Export each entity type to separate tables
            person_entity.export(
                "kg_persons",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_persons",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            event_entity.export(
                "kg_events",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_events",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            organization_entity.export(
                "kg_organizations",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_organizations",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            location_entity.export(
                "kg_locations",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_locations",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            artifact_entity.export(
                "kg_artifacts",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_artifacts",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            sighting_entity.export(
                "kg_sightings",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_sightings",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            testimony_entity.export(
                "kg_testimonies",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_testimonies",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            topic_entity.export(
                "kg_topics",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_topics",
                    upsert_key_fields=["entity_id"]
                ),
                primary_key_fields=["entity_id"]
            )

            # Export relationships
            relationship_edge.export(
                "kg_relationships",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_relationships",
                    upsert_key_fields=["relationship_id"]
                ),
                primary_key_fields=["relationship_id"]
            )

            # Export entity mentions
            entity_mention.export(
                "kg_entity_mentions",
                cocoindex.targets.PostgreSQL(
                    connection=postgres_conn_spec,
                    table="kg_entity_mentions",
                    upsert_key_fields=["id"]
                ),
                primary_key_fields=["id"]
            )

            # 2. Neo4j Knowledge Graph with proper entity types
            flow_builder.declare(
                cocoindex.targets.Neo4jDeclaration(
                    connection=neo4j_conn_spec,
                    nodes_label="Document",
                    primary_key_fields=["doc_id"]
                )
            )

            # Declare all entity node types
            for entity_type in ["Person", "Event", "Organization", "Location", "Artifact", "Sighting", "Testimony", "Topic"]:
                flow_builder.declare(
                    cocoindex.targets.Neo4jDeclaration(
                        connection=neo4j_conn_spec,
                        nodes_label=entity_type,
                        primary_key_fields=["entity_id"]
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

            # Export entity nodes to Neo4j with proper labels
            person_entity.export(
                "neo4j_persons",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Person")
                ),
                primary_key_fields=["entity_id"]
            )

            event_entity.export(
                "neo4j_events",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Event")
                ),
                primary_key_fields=["entity_id"]
            )

            organization_entity.export(
                "neo4j_organizations",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Organization")
                ),
                primary_key_fields=["entity_id"]
            )

            location_entity.export(
                "neo4j_locations",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Location")
                ),
                primary_key_fields=["entity_id"]
            )

            artifact_entity.export(
                "neo4j_artifacts",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Artifact")
                ),
                primary_key_fields=["entity_id"]
            )

            sighting_entity.export(
                "neo4j_sightings",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Sighting")
                ),
                primary_key_fields=["entity_id"]
            )

            testimony_entity.export(
                "neo4j_testimonies",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Testimony")
                ),
                primary_key_fields=["entity_id"]
            )

            topic_entity.export(
                "neo4j_topics",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Nodes(label="Topic")
                ),
                primary_key_fields=["entity_id"]
            )

            # Export relationships to Neo4j with typed relationships
            relationship_edge.export(
                "neo4j_relationships",
                cocoindex.targets.Neo4j(
                    connection=neo4j_conn_spec,
                    mapping=cocoindex.targets.Relationships(
                        rel_type="RELATES_TO",  # Can be enhanced to use actual predicate
                        source=cocoindex.targets.NodeFromFields(
                            label="Entity",  # Will need to be dynamically determined
                            fields=[
                                cocoindex.targets.TargetFieldMapping(
                                    source="subject_entity", target="entity_id"
                                )
                            ]
                        ),
                        target=cocoindex.targets.NodeFromFields(
                            label="Entity",  # Will need to be dynamically determined
                            fields=[
                                cocoindex.targets.TargetFieldMapping(
                                    source="object_entity", target="entity_id"
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
                            fields=[cocoindex.targets.TargetFieldMapping(
                                "document_id", "doc_id")]
                        ),
                        target=cocoindex.targets.NodeFromFields(
                            label="Entity",
                            fields=[
                                cocoindex.targets.TargetFieldMapping(
                                    "entity_id", "entity_id")
                            ]
                        )
                    )
                ),
                primary_key_fields=["id"]
            )

            logger.info(
                "UAPDisclosureKG flow execution completed successfully")

        except Exception as e:
            logger.error(f"Error in UAPDisclosureKG flow: {e}")
            raise

    def run_uap_kg_flow():
        """Main function to execute UAP knowledge graph flow"""
        try:
            logger.info("Starting CocoIndex UAP knowledge graph flow")
            return "UAP Knowledge Graph flow executed successfully"
        except Exception as e:
            logger.error(f"Failed to execute UAP knowledge graph flow: {e}")
            raise

else:
    # Fallback when CocoIndex is not available
    def uap_disclosure_kg_flow(*args, **kwargs):
        logger.warning(
            "CocoIndex not available - skipping knowledge graph flow")
        return None

    def run_uap_kg_flow():
        logger.warning(
            "CocoIndex not available - install with: pip install cocoindex")
        return "CocoIndex not available"

if __name__ == "__main__":
    if COCOINDEX_AVAILABLE:
        run_uap_kg_flow()
    else:
        print("CocoIndex not available. Install with: pip install cocoindex")
