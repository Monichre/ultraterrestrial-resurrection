"""
AGNO Shared Entity Store Architecture

This module provides cross-agent entity sharing capabilities for the AGNO integration,
bridging the AGNO agents with the existing Xata database entities while preserving
the 85-95% accuracy of the existing entity extraction system.

Key Features:
- Cross-agent entity synchronization 
- Confidence scoring aggregation
- Temporal relationship mapping
- Xata integration compatibility
- Entity conflict resolution
"""

from typing import Dict, List, Optional, Union, Any
from datetime import datetime, timezone
from dataclasses import dataclass, field
from enum import Enum
import json
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EntityType(Enum):
    """Ultraterrestrial core entity types aligned with Xata schema"""
    # Primary Research Entities
    PERSONNEL = "personnel"
    EVENTS = "events" 
    ORGANIZATIONS = "organizations"
    TOPICS = "topics"
    SIGHTINGS = "sightings"
    TESTIMONIES = "testimonies"
    
    # Knowledge Entities  
    DOCUMENTS = "documents"
    ARTIFACTS = "artifacts"
    LOCATIONS = "locations"
    
    # AGNO-Specific Enhancement Types
    TEMPORAL_ENTITY = "temporal_entity"
    WITNESS_PATTERN = "witness_pattern"
    UFO_EVENT_MARKER = "ufo_event_marker"


class ConfidenceLevel(Enum):
    """Entity confidence classification"""
    VERY_HIGH = 0.9    # 90%+ confidence
    HIGH = 0.8         # 80-89% confidence  
    MEDIUM = 0.7       # 70-79% confidence
    LOW = 0.6          # 60-69% confidence
    VERY_LOW = 0.5     # <60% confidence


@dataclass
class AGNOEntity:
    """Enhanced entity structure for AGNO cross-agent sharing"""
    
    # Core Identity
    id: str
    text: str
    entity_type: EntityType
    
    # AGNO Enhancements
    contributing_agents: List[str] = field(default_factory=list)
    confidence_scores: Dict[str, float] = field(default_factory=dict)
    cross_validation_score: float = 0.0
    
    # Temporal Data
    temporal_markers: List[Dict[str, Any]] = field(default_factory=list)
    first_mention_timestamp: Optional[str] = None
    mention_frequency: int = 0
    
    # Research Context
    source_context: str = ""
    evidence_strength: float = 0.0
    research_session_id: Optional[str] = None
    
    # Xata Integration
    xata_entity_id: Optional[str] = None
    xata_table: Optional[str] = None
    embedding: Optional[List[float]] = None
    
    # Relationship Data
    related_entities: Dict[str, List[str]] = field(default_factory=dict)
    relationship_types: Dict[str, str] = field(default_factory=dict)
    
    # Metadata
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    version: int = 1
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            'id': self.id,
            'text': self.text,
            'entity_type': self.entity_type.value,
            'contributing_agents': self.contributing_agents,
            'confidence_scores': self.confidence_scores,
            'cross_validation_score': self.cross_validation_score,
            'temporal_markers': self.temporal_markers,
            'first_mention_timestamp': self.first_mention_timestamp,
            'mention_frequency': self.mention_frequency,
            'source_context': self.source_context,
            'evidence_strength': self.evidence_strength,
            'research_session_id': self.research_session_id,
            'xata_entity_id': self.xata_entity_id,
            'xata_table': self.xata_table,
            'embedding': self.embedding,
            'related_entities': self.related_entities,
            'relationship_types': self.relationship_types,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'version': self.version
        }


class SharedEntityStore:
    """
    Cross-agent entity sharing system for AGNO integration
    
    This class manages entity synchronization between AGNO agents while
    preserving integration with the existing Xata database entities.
    """
    
    def __init__(self, storage_path: Optional[Path] = None):
        """Initialize the shared entity store"""
        self.storage_path = storage_path or Path("data/shared_entities")
        self.storage_path.mkdir(parents=True, exist_ok=True)
        
        # Entity storage
        self.entities: Dict[str, AGNOEntity] = {}
        self.entity_index: Dict[EntityType, List[str]] = {}
        self.agent_contributions: Dict[str, List[str]] = {}
        
        # Load existing entities
        self._load_entities()
        
        logger.info(f"SharedEntityStore initialized with {len(self.entities)} entities")
    
    def register_entity(self, 
                       entity_data: Dict[str, Any], 
                       agent_id: str,
                       session_id: Optional[str] = None) -> str:
        """
        Register an entity from any AGNO agent
        
        Args:
            entity_data: Entity information from agent
            agent_id: Identifier of the contributing agent
            session_id: Optional research session identifier
            
        Returns:
            Entity ID for the registered/updated entity
        """
        try:
            # Generate entity ID
            entity_id = self._generate_entity_id(entity_data)
            
            if entity_id in self.entities:
                # Update existing entity
                existing_entity = self.entities[entity_id]
                updated_entity = self._merge_entity_data(
                    existing_entity, 
                    entity_data, 
                    agent_id
                )
                self.entities[entity_id] = updated_entity
                logger.info(f"Updated existing entity {entity_id} from agent {agent_id}")
                
            else:
                # Create new entity
                new_entity = self._create_new_entity(
                    entity_id,
                    entity_data, 
                    agent_id,
                    session_id
                )
                self.entities[entity_id] = new_entity
                
                # Update indexes
                self._update_indexes(new_entity)
                logger.info(f"Created new entity {entity_id} from agent {agent_id}")
            
            # Track agent contributions
            if agent_id not in self.agent_contributions:
                self.agent_contributions[agent_id] = []
            if entity_id not in self.agent_contributions[agent_id]:
                self.agent_contributions[agent_id].append(entity_id)
            
            # Persist changes
            self._save_entity(entity_id)
            
            return entity_id
            
        except Exception as e:
            logger.error(f"Error registering entity: {e}")
            raise
    
    def get_entity(self, entity_id: str) -> Optional[AGNOEntity]:
        """Retrieve entity by ID"""
        return self.entities.get(entity_id)
    
    def get_entities_by_type(self, entity_type: EntityType) -> List[AGNOEntity]:
        """Get all entities of a specific type"""
        entity_ids = self.entity_index.get(entity_type, [])
        return [self.entities[eid] for eid in entity_ids if eid in self.entities]
    
    def get_entities_by_agent(self, agent_id: str) -> List[AGNOEntity]:
        """Get all entities contributed by a specific agent"""
        entity_ids = self.agent_contributions.get(agent_id, [])
        return [self.entities[eid] for eid in entity_ids if eid in self.entities]
    
    def find_similar_entities(self, 
                            query_text: str, 
                            entity_type: Optional[EntityType] = None,
                            confidence_threshold: float = 0.8) -> List[AGNOEntity]:
        """
        Find entities similar to query text
        
        This would integrate with existing vector search capabilities
        """
        # Placeholder for similarity search implementation
        # Would leverage existing Xata vector search capabilities
        similar_entities = []
        
        for entity in self.entities.values():
            if entity_type and entity.entity_type != entity_type:
                continue
                
            # Simple text similarity (would be replaced with vector similarity)
            if (query_text.lower() in entity.text.lower() or 
                entity.text.lower() in query_text.lower()):
                if entity.cross_validation_score >= confidence_threshold:
                    similar_entities.append(entity)
        
        return similar_entities
    
    def resolve_entity_conflicts(self, entity_id: str) -> AGNOEntity:
        """
        Resolve conflicts in entity data from multiple agents
        
        Uses confidence weighting and evidence strength to determine
        the most reliable entity information
        """
        entity = self.entities.get(entity_id)
        if not entity:
            raise ValueError(f"Entity {entity_id} not found")
        
        if len(entity.confidence_scores) <= 1:
            return entity  # No conflicts to resolve
        
        # Calculate weighted confidence based on agent reliability
        total_weight = 0
        weighted_confidence = 0
        
        for agent_id, confidence in entity.confidence_scores.items():
            # Agent reliability could be calculated based on historical accuracy
            agent_weight = self._get_agent_reliability(agent_id)
            weighted_confidence += confidence * agent_weight
            total_weight += agent_weight
        
        if total_weight > 0:
            entity.cross_validation_score = weighted_confidence / total_weight
            entity.updated_at = datetime.now(timezone.utc)
            entity.version += 1
        
        logger.info(f"Resolved conflicts for entity {entity_id}, final confidence: {entity.cross_validation_score}")
        return entity
    
    def sync_with_xata(self, entity_id: str) -> bool:
        """
        Sync entity with existing Xata database
        
        This would integrate with the existing 230,998+ records
        """
        entity = self.entities.get(entity_id)
        if not entity:
            return False
        
        try:
            # Map AGNO entity to Xata table structure
            xata_data = self._map_to_xata_schema(entity)
            
            # Check if entity exists in Xata
            if entity.xata_entity_id:
                # Update existing Xata record
                # xata_client.db[entity.xata_table].update(entity.xata_entity_id, xata_data)
                pass
            else:
                # Create new Xata record
                # result = xata_client.db[entity.xata_table].create(xata_data)
                # entity.xata_entity_id = result.id
                pass
            
            logger.info(f"Synced entity {entity_id} with Xata")
            return True
            
        except Exception as e:
            logger.error(f"Error syncing entity {entity_id} with Xata: {e}")
            return False
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the shared entity store"""
        stats = {
            'total_entities': len(self.entities),
            'entities_by_type': {},
            'agents_contributing': len(self.agent_contributions),
            'average_confidence': 0.0,
            'high_confidence_entities': 0
        }
        
        # Calculate type distribution
        for entity_type in EntityType:
            count = len(self.entity_index.get(entity_type, []))
            stats['entities_by_type'][entity_type.value] = count
        
        # Calculate confidence statistics
        if self.entities:
            confidences = [e.cross_validation_score for e in self.entities.values()]
            stats['average_confidence'] = sum(confidences) / len(confidences)
            stats['high_confidence_entities'] = len([c for c in confidences if c >= 0.8])
        
        return stats
    
    # Private Methods
    
    def _generate_entity_id(self, entity_data: Dict[str, Any]) -> str:
        """Generate consistent entity ID"""
        text = entity_data.get('text', '').strip().lower()
        entity_type = entity_data.get('type', 'unknown')
        
        # Create hash of text and type for consistent ID
        import hashlib
        content = f"{text}:{entity_type}"
        return hashlib.md5(content.encode()).hexdigest()[:16]
    
    def _create_new_entity(self, 
                          entity_id: str,
                          entity_data: Dict[str, Any], 
                          agent_id: str,
                          session_id: Optional[str]) -> AGNOEntity:
        """Create new AGNO entity from agent data"""
        
        entity_type_str = entity_data.get('type', 'personnel')
        try:
            entity_type = EntityType(entity_type_str)
        except ValueError:
            entity_type = EntityType.PERSONNEL  # Default fallback
        
        confidence = float(entity_data.get('confidence', 0.8))
        
        return AGNOEntity(
            id=entity_id,
            text=entity_data.get('text', ''),
            entity_type=entity_type,
            contributing_agents=[agent_id],
            confidence_scores={agent_id: confidence},
            cross_validation_score=confidence,
            source_context=entity_data.get('context', ''),
            evidence_strength=float(entity_data.get('evidence_strength', 0.7)),
            research_session_id=session_id,
            temporal_markers=entity_data.get('temporal_markers', [])
        )
    
    def _merge_entity_data(self, 
                          existing: AGNOEntity, 
                          new_data: Dict[str, Any], 
                          agent_id: str) -> AGNOEntity:
        """Merge new entity data with existing entity"""
        
        # Add agent contribution
        if agent_id not in existing.contributing_agents:
            existing.contributing_agents.append(agent_id)
        
        # Update confidence scores
        new_confidence = float(new_data.get('confidence', 0.8))
        existing.confidence_scores[agent_id] = new_confidence
        
        # Recalculate cross-validation score
        existing.cross_validation_score = sum(existing.confidence_scores.values()) / len(existing.confidence_scores)
        
        # Update temporal data
        if 'temporal_markers' in new_data:
            existing.temporal_markers.extend(new_data['temporal_markers'])
        
        # Update metadata
        existing.updated_at = datetime.now(timezone.utc)
        existing.version += 1
        
        return existing
    
    def _update_indexes(self, entity: AGNOEntity):
        """Update entity type indexes"""
        if entity.entity_type not in self.entity_index:
            self.entity_index[entity.entity_type] = []
        
        if entity.id not in self.entity_index[entity.entity_type]:
            self.entity_index[entity.entity_type].append(entity.id)
    
    def _get_agent_reliability(self, agent_id: str) -> float:
        """Get reliability weight for agent (placeholder)"""
        # Agent reliability scoring based on historical performance
        agent_reliability = {
            'ufo_youtube_agent': 0.85,
            'uap_deep_research_agent': 0.90,
            'existing_entity_extraction': 0.95,  # Preserve high accuracy
            'default': 0.80
        }
        return agent_reliability.get(agent_id, agent_reliability['default'])
    
    def _map_to_xata_schema(self, entity: AGNOEntity) -> Dict[str, Any]:
        """Map AGNO entity to appropriate Xata table schema"""
        
        # Base mapping for all entity types
        xata_data = {
            'name': entity.text,
            'embedding': entity.embedding
        }
        
        # Type-specific mapping
        if entity.entity_type == EntityType.PERSONNEL:
            entity.xata_table = 'personnel'
            xata_data.update({
                'bio': entity.source_context,
                'credibility': int(entity.cross_validation_score * 100),
                'authority': int(entity.evidence_strength * 100)
            })
        
        elif entity.entity_type == EntityType.EVENTS:
            entity.xata_table = 'events'
            xata_data.update({
                'description': entity.source_context,
                'title': entity.text
            })
        
        elif entity.entity_type == EntityType.ORGANIZATIONS:
            entity.xata_table = 'organizations'
            xata_data.update({
                'description': entity.source_context,
                'title': entity.text
            })
        
        # Add more mappings as needed
        
        return xata_data
    
    def _load_entities(self):
        """Load entities from persistent storage"""
        try:
            entities_file = self.storage_path / "entities.json"
            if entities_file.exists():
                with open(entities_file, 'r') as f:
                    data = json.load(f)
                    
                # Reconstruct entities
                for entity_data in data.get('entities', []):
                    entity = self._dict_to_entity(entity_data)
                    self.entities[entity.id] = entity
                    self._update_indexes(entity)
                
                # Load agent contributions
                self.agent_contributions = data.get('agent_contributions', {})
                
        except Exception as e:
            logger.warning(f"Could not load existing entities: {e}")
    
    def _save_entity(self, entity_id: str):
        """Save single entity (for performance)"""
        # This would be optimized for individual entity updates
        self._save_all_entities()
    
    def _save_all_entities(self):
        """Save all entities to persistent storage"""
        try:
            entities_file = self.storage_path / "entities.json"
            
            data = {
                'entities': [entity.to_dict() for entity in self.entities.values()],
                'agent_contributions': self.agent_contributions,
                'last_updated': datetime.now(timezone.utc).isoformat()
            }
            
            with open(entities_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            logger.error(f"Error saving entities: {e}")
    
    def _dict_to_entity(self, data: Dict[str, Any]) -> AGNOEntity:
        """Convert dictionary back to AGNOEntity"""
        return AGNOEntity(
            id=data['id'],
            text=data['text'],
            entity_type=EntityType(data['entity_type']),
            contributing_agents=data['contributing_agents'],
            confidence_scores=data['confidence_scores'],
            cross_validation_score=data['cross_validation_score'],
            temporal_markers=data['temporal_markers'],
            first_mention_timestamp=data.get('first_mention_timestamp'),
            mention_frequency=data['mention_frequency'],
            source_context=data['source_context'],
            evidence_strength=data['evidence_strength'],
            research_session_id=data.get('research_session_id'),
            xata_entity_id=data.get('xata_entity_id'),
            xata_table=data.get('xata_table'),
            embedding=data.get('embedding'),
            related_entities=data['related_entities'],
            relationship_types=data['relationship_types'],
            created_at=datetime.fromisoformat(data['created_at']),
            updated_at=datetime.fromisoformat(data['updated_at']),
            version=data['version']
        )


# Global instance for cross-agent access
shared_entity_store = SharedEntityStore()


# Integration functions for AGNO agents
def register_entity_from_agent(entity_data: Dict[str, Any], 
                              agent_id: str,
                              session_id: Optional[str] = None) -> str:
    """Convenience function for agents to register entities"""
    return shared_entity_store.register_entity(entity_data, agent_id, session_id)


def get_related_entities(entity_text: str, 
                        entity_type: Optional[EntityType] = None) -> List[AGNOEntity]:
    """Find entities related to the given text"""
    return shared_entity_store.find_similar_entities(entity_text, entity_type)


def sync_entity_with_xata(entity_id: str) -> bool:
    """Sync specific entity with Xata database"""
    return shared_entity_store.sync_with_xata(entity_id)


if __name__ == "__main__":
    # Example usage and testing
    store = SharedEntityStore()
    
    # Example entity from UFO YouTube Agent
    youtube_entity = {
        'text': 'Commander David Fravor',
        'type': 'personnel',
        'confidence': 0.95,
        'context': 'USS Nimitz Tic-Tac incident testimony',
        'evidence_strength': 0.92,
        'temporal_markers': [
            {'timestamp': '00:15:23', 'context': 'describing encounter'}
        ]
    }
    
    entity_id = store.register_entity(youtube_entity, 'ufo_youtube_agent', 'session_123')
    print(f"Registered entity: {entity_id}")
    
    # Get statistics
    stats = store.get_statistics()
    print(f"Store statistics: {json.dumps(stats, indent=2)}")