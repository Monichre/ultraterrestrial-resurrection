"""
Ultraterrestrial Domain-Specific NER Agent

This specialized agent is trained on/contextualized with Ultraterrestrial Domain 
specific Named Entity Recognition and research methodology. It serves as the 
content extraction and document summarization system for the Deep Research Agent.

Key Features:
- UFO/UAP domain-specific entity recognition
- Famous UFO researcher methodologies (Vallée, Hynek, Pasulka, etc.)
- Specialized content extraction for various document types
- Domain-aware document summarization
- Integration with existing 85-95% accuracy entity extraction system
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple, Union
from datetime import datetime, timezone
from dataclasses import dataclass, field
from enum import Enum
import re
import json
from pathlib import Path

# Shared entity store integration
from lib.shared_entity_store import register_entity_from_agent, EntityType, shared_entity_store
from agents.base import Agent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class UFOResearchMethodology(Enum):
    """Famous UFO researcher methodologies"""
    VALLEE = "vallee"           # Jacques Vallée - Control System Hypothesis
    HYNEK = "hynek"             # J. Allen Hynek - Close Encounters Classification
    PASULKA = "pasulka"         # Diana Pasulka - Religious/Cultural Studies Approach
    MCDONALD = "mcdonald"       # James E. McDonald - Scientific Methodology
    HOPKINS = "hopkins"         # Budd Hopkins - Abduction Research
    MACK = "mack"              # John Mack - Psychiatric/Consciousness Approach
    KEAN = "kean"              # Leslie Kean - Investigative Journalism
    PUTHOFF = "puthoff"        # Hal Puthoff - Scientific Remote Viewing


class DocumentType(Enum):
    """Document types for specialized processing"""
    GOVERNMENT_DOCUMENT = "government_document"
    WITNESS_TESTIMONY = "witness_testimony" 
    SCIENTIFIC_PAPER = "scientific_paper"
    MILITARY_REPORT = "military_report"
    INTERVIEW_TRANSCRIPT = "interview_transcript"
    NEWS_ARTICLE = "news_article"
    BOOK_CHAPTER = "book_chapter"
    CONGRESSIONAL_TESTIMONY = "congressional_testimony"
    FOIA_RELEASE = "foia_release"
    TECHNICAL_REPORT = "technical_report"


@dataclass
class UFOEntityTaxonomy:
    """Comprehensive UFO/UAP entity taxonomy based on researcher methodologies"""
    
    # Personnel Categories (Vallée/Hynek classification influence)
    personnel_types = {
        "military_witnesses": ["pilot", "radar_operator", "air_traffic_controller", "base_commander"],
        "civilian_witnesses": ["farmer", "driver", "police_officer", "airline_passenger"],
        "scientific_personnel": ["astronomer", "physicist", "engineer", "researcher"],
        "government_officials": ["pentagon_official", "cia_agent", "faa_administrator"],
        "researchers": ["ufologist", "investigator", "skeptic", "believer"],
        "contactees": ["abductee", "experiencer", "channeler", "contactee"]
    }
    
    # Event Classifications (Based on Hynek system + modern updates)
    event_classifications = {
        "close_encounters": {
            "ce1": "visual_sighting_within_500_feet",
            "ce2": "physical_effects_on_environment_or_witnesses", 
            "ce3": "animated_beings_observed",
            "ce4": "abduction_experiences",
            "ce5": "human_initiated_contact"
        },
        "distant_encounters": {
            "nocturnal_lights": "lights_in_sky_at_night",
            "daylight_discs": "daylight_sightings_of_objects",
            "radar_visual": "radar_confirmation_with_visual"
        },
        "modern_categories": {
            "trans_medium": "uap_moving_between_air_water_space",
            "instantaneous_acceleration": "impossible_physics_observed",
            "anti_gravity": "defying_gravitational_effects"
        }
    }
    
    # Organization Types (Government transparency focus)
    organization_types = {
        "government_agencies": ["pentagon", "cia", "nsa", "dod", "faa", "nasa"],
        "military_units": ["air_force", "navy", "army", "marines", "space_force"],
        "research_groups": ["aatip", "uaptf", "aaro", "mufon", "cufos"],
        "aerospace_companies": ["lockheed", "raytheon", "boeing", "northrop_grumman"],
        "international": ["uk_mod", "french_geipan", "cnes", "european_space_agency"]
    }
    
    # Location Categories (Geographic intelligence)
    location_types = {
        "military_installations": ["area_51", "wright_patterson", "nellis", "edwards_afb"],
        "nuclear_facilities": ["nuclear_power_plant", "missile_silo", "nuclear_storage"],
        "aerospace_facilities": ["nasa_centers", "test_ranges", "manufacturing_plants"],
        "hotspots": ["skinwalker_ranch", "belgium_triangle", "hudson_valley"],
        "international_sites": ["rendlesham_forest", "bentwaters", "hessdalen"]
    }


class UltraterrestrialDomainNERAgent(Agent):
    """
    Specialized NER agent for UFO/UAP research with domain-specific methodologies
    
    This agent combines the expertise of famous UFO researchers with advanced
    NLP to provide highly accurate domain-specific entity extraction and 
    content analysis.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the Ultraterrestrial Domain NER Agent"""
        super().__init__(config or {})
        
        # Agent configuration
        self.agent_id = "ultraterrestrial_domain_ner"
        self.agent_version = "1.0.0"
        self.reliability_score = 0.92  # High reliability for domain expertise
        
        # Domain-specific configuration
        self.entity_taxonomy = UFOEntityTaxonomy()
        self.default_methodology = UFOResearchMethodology.VALLEE
        self.enable_cross_validation = True
        self.confidence_threshold = 0.75
        
        # Performance tracking
        self.session_stats = {
            "documents_processed": 0,
            "entities_extracted": 0,
            "high_confidence_entities": 0,
            "methodologies_applied": [],
            "document_types_processed": []
        }
        
        # Initialize domain-specific patterns
        self._initialize_domain_patterns()
        
        logger.info(f"UltraterrestrialDomainNERAgent initialized with {self.default_methodology.value} methodology")
    
    def _initialize_domain_patterns(self):
        """Initialize UFO/UAP domain-specific patterns and keywords"""
        
        # Vallée-inspired patterns (Control System Hypothesis)
        self.vallee_patterns = {
            "control_indicators": [
                r"(?:consciousness|psychic|paranormal)\s+(?:effects?|phenomena)",
                r"(?:reality|perception)\s+(?:alteration|manipulation)",
                r"(?:time|space)\s+(?:distortion|anomaly)",
                r"(?:synchronicity|meaningful)\s+(?:coincidence|pattern)"
            ],
            "physical_traces": [
                r"(?:electromagnetic|radio)\s+(?:interference|disruption)",
                r"(?:radiation|magnetic)\s+(?:signature|anomaly)",
                r"(?:ground|landing)\s+(?:traces?|marks?|impressions?)",
                r"(?:biological|physiological)\s+(?:effects?|symptoms?)"
            ]
        }
        
        # Hynek classification patterns
        self.hynek_patterns = {
            "ce_classifications": [
                r"(?:close\s+encounter|CE[1-5])",
                r"(?:nocturnal|daylight)\s+(?:lights?|disc)",
                r"(?:radar|visual)\s+(?:confirmation|sighting)",
                r"(?:animated|living)\s+(?:beings?|entities?|occupants?)"
            ],
            "credibility_factors": [
                r"(?:multiple|independent)\s+(?:witnesses?|confirmations?)",
                r"(?:trained|experienced|reliable)\s+(?:observer|witness)",
                r"(?:corroborating|supporting)\s+(?:evidence|testimony)",
                r"(?:physical|tangible|measurable)\s+(?:evidence|traces?)"
            ]
        }
        
        # Pasulka cultural/religious patterns  
        self.pasulka_patterns = {
            "cultural_context": [
                r"(?:religious|spiritual|mystical)\s+(?:experience|encounter)",
                r"(?:cultural|social|anthropological)\s+(?:significance|impact)",
                r"(?:belief|faith|doctrine)\s+(?:system|framework)",
                r"(?:institutional|academic|scholarly)\s+(?:response|analysis)"
            ],
            "authority_structures": [
                r"(?:vatican|church|religious)\s+(?:authority|institution)",
                r"(?:academic|university|scholarly)\s+(?:institution|research)",
                r"(?:government|military|official)\s+(?:response|position)",
                r"(?:media|public|popular)\s+(?:narrative|discourse)"
            ]
        }
        
        # Modern UAP terminology (post-2017 disclosure)
        self.modern_uap_patterns = {
            "official_terminology": [
                r"(?:unidentified\s+aerial|UAP|anomalous\s+aerial)\s+(?:phenomena|phenomenon)",
                r"(?:trans[- ]medium|cross[- ]domain)\s+(?:objects?|vehicles?)",
                r"(?:instantaneous|impossible)\s+(?:acceleration|maneuvers?)",
                r"(?:advanced\s+aerospace|exotic)\s+(?:technology|propulsion)"
            ],
            "disclosure_context": [
                r"(?:pentagon|dod|military)\s+(?:disclosure|acknowledgment|confirmation)",
                r"(?:congressional|senate|house)\s+(?:hearing|testimony|briefing)",
                r"(?:classified|declassified|restricted)\s+(?:document|information|data)",
                r"(?:national\s+security|threat\s+assessment|security\s+implications?)"
            ]
        }
    
    async def extract_entities_with_methodology(self, 
                                              content: str,
                                              document_type: DocumentType,
                                              methodology: UFOResearchMethodology = None,
                                              session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Extract entities using specified UFO research methodology
        
        Args:
            content: Text content to analyze
            document_type: Type of document being processed
            methodology: Research methodology to apply
            session_id: Session tracking identifier
            
        Returns:
            Comprehensive entity extraction results with methodology context
        """
        methodology = methodology or self.default_methodology
        session_id = session_id or f"ner_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        logger.info(f"Extracting entities using {methodology.value} methodology for {document_type.value}")
        
        # Apply methodology-specific analysis
        extraction_results = {
            "session_id": session_id,
            "methodology_applied": methodology.value,
            "document_type": document_type.value,
            "content_length": len(content),
            "extraction_timestamp": datetime.now(timezone.utc).isoformat(),
            "entities": [],
            "relationships": [],
            "confidence_metrics": {},
            "methodology_insights": {}
        }
        
        # Extract entities based on methodology
        if methodology == UFOResearchMethodology.VALLEE:
            entities = await self._extract_vallee_entities(content, document_type)
        elif methodology == UFOResearchMethodology.HYNEK:
            entities = await self._extract_hynek_entities(content, document_type)
        elif methodology == UFOResearchMethodology.PASULKA:
            entities = await self._extract_pasulka_entities(content, document_type)
        else:
            # Default comprehensive extraction
            entities = await self._extract_comprehensive_entities(content, document_type)
        
        extraction_results["entities"] = entities
        
        # Apply cross-methodology validation if enabled
        if self.enable_cross_validation:
            validation_results = await self._cross_validate_entities(
                entities, content, document_type
            )
            extraction_results["cross_validation"] = validation_results
        
        # Register high-confidence entities with shared store
        await self._register_entities_with_shared_store(
            entities, session_id, methodology.value
        )
        
        # Update session statistics
        self._update_session_stats(extraction_results, methodology, document_type)
        
        return extraction_results
    
    async def _extract_vallee_entities(self, content: str, doc_type: DocumentType) -> List[Dict[str, Any]]:
        """Extract entities using Vallée's Control System methodology"""
        
        entities = []
        
        # Look for control system indicators
        for pattern in self.vallee_patterns["control_indicators"]:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.UFO_EVENT_MARKER.value,
                    "subtype": "control_system_indicator",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.85,
                    "methodology_context": "vallee_control_system",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        # Look for physical trace evidence
        for pattern in self.vallee_patterns["physical_traces"]:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.EVENTS.value,
                    "subtype": "physical_trace_evidence",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.88,
                    "methodology_context": "vallee_trace_analysis",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        # Enhanced entity extraction using Vallée's interdimensional hypothesis
        interdimensional_patterns = [
            r"(?:interdimensional|parallel\s+reality|alternate\s+dimension)",
            r"(?:consciousness|psychic|telepathic)\s+(?:contact|communication)",
            r"(?:temporal|time)\s+(?:shift|distortion|anomaly)",
            r"(?:reality|perception)\s+(?:shift|alteration|manipulation)"
        ]
        
        for pattern in interdimensional_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.UFO_EVENT_MARKER.value,
                    "subtype": "interdimensional_phenomenon", 
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.82,
                    "methodology_context": "vallee_interdimensional_hypothesis",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        return entities
    
    async def _extract_hynek_entities(self, content: str, doc_type: DocumentType) -> List[Dict[str, Any]]:
        """Extract entities using Hynek's Close Encounters classification system"""
        
        entities = []
        
        # Close Encounters classification
        ce_patterns = {
            "CE1": r"(?:close\s+encounter.*first\s+kind|CE[- ]?1|visual\s+sighting.*(?:within|less\s+than).*(?:500|five\s+hundred)\s*(?:feet|meters))",
            "CE2": r"(?:close\s+encounter.*second\s+kind|CE[- ]?2|physical\s+(?:effects?|traces?|evidence)|(?:electromagnetic|radio)\s+interference)",
            "CE3": r"(?:close\s+encounter.*third\s+kind|CE[- ]?3|(?:animated|living)\s+(?:beings?|entities?|occupants?)|(?:humanoid|alien)\s+(?:figures?|forms?))",
            "CE4": r"(?:close\s+encounter.*fourth\s+kind|CE[- ]?4|abduction|taken\s+(?:aboard|onto)|missing\s+time)",
            "CE5": r"(?:close\s+encounter.*fifth\s+kind|CE[- ]?5|(?:human[- ]?initiated|deliberate)\s+contact|(?:telepathic|psychic)\s+communication)"
        }
        
        for ce_type, pattern in ce_patterns.items():
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.EVENTS.value,
                    "subtype": f"hynek_{ce_type.lower()}",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.90,  # High confidence for established classification
                    "methodology_context": f"hynek_{ce_type}_classification",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        # Credibility assessment patterns (Hynek's scientific approach)
        credibility_indicators = [
            r"(?:multiple|independent|corroborating)\s+(?:witnesses?|accounts?|confirmations?)",
            r"(?:trained|experienced|qualified|reliable)\s+(?:observer|witness|personnel)",
            r"(?:radar|photographic|physical|instrumental)\s+(?:confirmation|evidence|data)",
            r"(?:consistent|correlated|matching)\s+(?:accounts?|testimonies?|descriptions?)"
        ]
        
        for pattern in credibility_indicators:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.TESTIMONIES.value,
                    "subtype": "credibility_factor",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.87,
                    "methodology_context": "hynek_credibility_assessment",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        return entities
    
    async def _extract_pasulka_entities(self, content: str, doc_type: DocumentType) -> List[Dict[str, Any]]:
        """Extract entities using Pasulka's cultural/religious studies methodology"""
        
        entities = []
        
        # Cultural and religious context patterns
        for pattern in self.pasulka_patterns["cultural_context"]:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.TOPICS.value,
                    "subtype": "cultural_religious_context",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.84,
                    "methodology_context": "pasulka_cultural_analysis",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        # Authority structure analysis
        for pattern in self.pasulka_patterns["authority_structures"]:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.ORGANIZATIONS.value,
                    "subtype": "authority_institution",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.86,
                    "methodology_context": "pasulka_authority_analysis",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        # Academic legitimacy patterns (Pasulka's focus on institutional validation)
        academic_patterns = [
            r"(?:peer[- ]reviewed|academic|scholarly|university)\s+(?:research|study|publication)",
            r"(?:professor|ph\.?d\.?|doctor|researcher)\s+(?:at|from|with)\s+(?:[A-Z][a-z]+\s+)*(?:University|Institute|College)",
            r"(?:journal|publication|conference|symposium)\s+(?:article|paper|presentation)",
            r"(?:empirical|scientific|objective|methodological)\s+(?:approach|analysis|investigation)"
        ]
        
        for pattern in academic_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.PERSONNEL.value,
                    "subtype": "academic_authority",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.89,
                    "methodology_context": "pasulka_academic_legitimacy",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        return entities
    
    async def _extract_comprehensive_entities(self, content: str, doc_type: DocumentType) -> List[Dict[str, Any]]:
        """Comprehensive entity extraction combining all methodologies"""
        
        entities = []
        
        # Combine all methodology extractions
        vallee_entities = await self._extract_vallee_entities(content, doc_type)
        hynek_entities = await self._extract_hynek_entities(content, doc_type)  
        pasulka_entities = await self._extract_pasulka_entities(content, doc_type)
        
        entities.extend(vallee_entities)
        entities.extend(hynek_entities)
        entities.extend(pasulka_entities)
        
        # Add modern UAP terminology
        for pattern in self.modern_uap_patterns["official_terminology"]:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                entity = {
                    "text": match.group(),
                    "type": EntityType.UFO_EVENT_MARKER.value,
                    "subtype": "modern_uap_terminology",
                    "position": {"start": match.start(), "end": match.end()},
                    "confidence": 0.93,  # High confidence for official terminology
                    "methodology_context": "modern_uap_disclosure",
                    "evidence": self._extract_surrounding_context(content, match.start(), match.end())
                }
                entities.append(entity)
        
        # Deduplicate entities by text and position
        entities = self._deduplicate_entities(entities)
        
        return entities
    
    async def _cross_validate_entities(self, 
                                     entities: List[Dict[str, Any]], 
                                     content: str, 
                                     doc_type: DocumentType) -> Dict[str, Any]:
        """Cross-validate entities using multiple methodologies"""
        
        validation_results = {
            "validated_entities": 0,
            "confidence_improvements": 0,
            "methodology_agreements": 0,
            "conflicting_interpretations": 0,
            "validation_details": []
        }
        
        # Apply different methodologies to same content and compare
        for i, entity in enumerate(entities):
            validation_detail = {
                "entity_index": i,
                "original_confidence": entity["confidence"],
                "methodology_confirmations": [],
                "final_confidence": entity["confidence"]
            }
            
            # Check if other methodologies would identify similar entities
            entity_text = entity["text"].lower()
            confirmations = 0
            
            # Vallée methodology confirmation
            if any(re.search(pattern, entity_text, re.IGNORECASE) 
                   for pattern in self.vallee_patterns["control_indicators"] + 
                                 self.vallee_patterns["physical_traces"]):
                confirmations += 1
                validation_detail["methodology_confirmations"].append("vallee")
            
            # Hynek methodology confirmation  
            if any(re.search(pattern, entity_text, re.IGNORECASE)
                   for pattern in self.hynek_patterns["ce_classifications"] +
                                 self.hynek_patterns["credibility_factors"]):
                confirmations += 1
                validation_detail["methodology_confirmations"].append("hynek")
            
            # Pasulka methodology confirmation
            if any(re.search(pattern, entity_text, re.IGNORECASE)
                   for pattern in self.pasulka_patterns["cultural_context"] +
                                 self.pasulka_patterns["authority_structures"]):
                confirmations += 1
                validation_detail["methodology_confirmations"].append("pasulka")
            
            # Adjust confidence based on cross-methodology agreement
            if confirmations > 1:
                confidence_boost = min(0.1 * confirmations, 0.2)
                entity["confidence"] = min(entity["confidence"] + confidence_boost, 0.98)
                validation_detail["final_confidence"] = entity["confidence"]
                validation_results["confidence_improvements"] += 1
                validation_results["methodology_agreements"] += 1
            
            validation_results["validation_details"].append(validation_detail)
        
        validation_results["validated_entities"] = len(entities)
        
        return validation_results
    
    async def _register_entities_with_shared_store(self, 
                                                  entities: List[Dict[str, Any]], 
                                                  session_id: str,
                                                  methodology: str) -> List[str]:
        """Register high-confidence entities with the shared entity store"""
        
        registered_entity_ids = []
        
        for entity in entities:
            if entity["confidence"] >= self.confidence_threshold:
                # Map to shared entity store format
                entity_data = {
                    "text": entity["text"],
                    "type": entity["type"],
                    "confidence": entity["confidence"],
                    "context": entity["evidence"],
                    "evidence_strength": entity["confidence"],
                    "temporal_markers": [],  # Could be enhanced with timestamp data
                    "methodology_applied": methodology,
                    "subtype": entity.get("subtype", ""),
                    "position": entity.get("position", {})
                }
                
                # Register with shared store
                entity_id = register_entity_from_agent(
                    entity_data=entity_data,
                    agent_id=self.agent_id,
                    session_id=session_id
                )
                
                registered_entity_ids.append(entity_id)
                
        logger.info(f"Registered {len(registered_entity_ids)} high-confidence entities with shared store")
        return registered_entity_ids
    
    async def summarize_document_with_methodology(self,
                                                content: str,
                                                document_type: DocumentType,
                                                methodology: UFOResearchMethodology = None) -> Dict[str, Any]:
        """
        Summarize document using specified UFO research methodology
        
        This provides domain-aware summarization that emphasizes different aspects
        based on the chosen research methodology.
        """
        methodology = methodology or self.default_methodology
        
        logger.info(f"Summarizing {document_type.value} using {methodology.value} methodology")
        
        # Extract entities first for context
        entity_extraction = await self.extract_entities_with_methodology(
            content, document_type, methodology
        )
        
        # Generate methodology-specific summary
        summary_result = {
            "document_type": document_type.value,
            "methodology_applied": methodology.value,
            "content_length": len(content),
            "extraction_results": entity_extraction,
            "summary": "",
            "key_findings": [],
            "methodology_insights": {},
            "confidence_assessment": 0.0,
            "research_significance": ""
        }
        
        # Apply methodology-specific summarization focus
        if methodology == UFOResearchMethodology.VALLEE:
            summary_result = await self._summarize_vallee_approach(content, summary_result)
        elif methodology == UFOResearchMethodology.HYNEK:
            summary_result = await self._summarize_hynek_approach(content, summary_result)
        elif methodology == UFOResearchMethodology.PASULKA:
            summary_result = await self._summarize_pasulka_approach(content, summary_result)
        else:
            summary_result = await self._summarize_comprehensive_approach(content, summary_result)
        
        return summary_result
    
    async def _summarize_vallee_approach(self, content: str, summary_base: Dict[str, Any]) -> Dict[str, Any]:
        """Summarize using Vallée's Control System methodology focus"""
        
        # Focus on control system and consciousness aspects
        key_themes = [
            "consciousness_effects", "reality_alteration", "physical_traces",
            "electromagnetic_anomalies", "time_distortion", "synchronicities"
        ]
        
        summary_base["methodology_insights"] = {
            "control_system_indicators": len([e for e in summary_base["extraction_results"]["entities"] 
                                            if e.get("subtype") == "control_system_indicator"]),
            "physical_trace_evidence": len([e for e in summary_base["extraction_results"]["entities"]
                                          if e.get("subtype") == "physical_trace_evidence"]),
            "interdimensional_aspects": len([e for e in summary_base["extraction_results"]["entities"]
                                           if e.get("subtype") == "interdimensional_phenomenon"])
        }
        
        summary_base["key_findings"] = [
            f"Control system indicators: {summary_base['methodology_insights']['control_system_indicators']}",
            f"Physical trace evidence: {summary_base['methodology_insights']['physical_trace_evidence']}",
            f"Interdimensional aspects: {summary_base['methodology_insights']['interdimensional_aspects']}"
        ]
        
        # Generate Vallée-focused summary
        summary_base["summary"] = self._generate_methodology_summary(content, "vallee", key_themes)
        summary_base["research_significance"] = "Analyzed through Vallée's Control System lens, focusing on consciousness interaction and reality manipulation aspects."
        
        return summary_base
    
    async def _summarize_hynek_approach(self, content: str, summary_base: Dict[str, Any]) -> Dict[str, Any]:
        """Summarize using Hynek's scientific classification approach"""
        
        # Count Close Encounters classifications
        ce_counts = {}
        for entity in summary_base["extraction_results"]["entities"]:
            if entity.get("methodology_context", "").startswith("hynek_ce"):
                ce_type = entity["subtype"].replace("hynek_", "").upper()
                ce_counts[ce_type] = ce_counts.get(ce_type, 0) + 1
        
        summary_base["methodology_insights"] = {
            "close_encounter_classifications": ce_counts,
            "credibility_factors": len([e for e in summary_base["extraction_results"]["entities"]
                                      if e.get("subtype") == "credibility_factor"]),
            "scientific_rigor_score": self._calculate_scientific_rigor_score(summary_base["extraction_results"]["entities"])
        }
        
        summary_base["key_findings"] = [
            f"Close Encounters: {ce_counts}",
            f"Credibility factors: {summary_base['methodology_insights']['credibility_factors']}",
            f"Scientific rigor: {summary_base['methodology_insights']['scientific_rigor_score']:.2f}/10"
        ]
        
        summary_base["summary"] = self._generate_methodology_summary(content, "hynek", ["scientific_analysis", "classification", "credibility"])
        summary_base["research_significance"] = "Evaluated using Hynek's scientific classification system, emphasizing empirical evidence and witness credibility."
        
        return summary_base
    
    async def _summarize_pasulka_approach(self, content: str, summary_base: Dict[str, Any]) -> Dict[str, Any]:
        """Summarize using Pasulka's cultural/religious studies approach"""
        
        summary_base["methodology_insights"] = {
            "cultural_contexts": len([e for e in summary_base["extraction_results"]["entities"]
                                    if e.get("subtype") == "cultural_religious_context"]),
            "authority_institutions": len([e for e in summary_base["extraction_results"]["entities"]
                                         if e.get("subtype") == "authority_institution"]),
            "academic_legitimacy": len([e for e in summary_base["extraction_results"]["entities"]
                                     if e.get("subtype") == "academic_authority"])
        }
        
        summary_base["key_findings"] = [
            f"Cultural/religious contexts: {summary_base['methodology_insights']['cultural_contexts']}",
            f"Authority institutions: {summary_base['methodology_insights']['authority_institutions']}",
            f"Academic legitimacy markers: {summary_base['methodology_insights']['academic_legitimacy']}"
        ]
        
        summary_base["summary"] = self._generate_methodology_summary(content, "pasulka", ["cultural_analysis", "institutional_response", "legitimacy"])
        summary_base["research_significance"] = "Analyzed through Pasulka's cultural studies lens, examining institutional responses and legitimacy frameworks."
        
        return summary_base
    
    # Utility methods
    
    def _extract_surrounding_context(self, content: str, start: int, end: int, context_window: int = 100) -> str:
        """Extract surrounding context for evidence"""
        context_start = max(0, start - context_window)
        context_end = min(len(content), end + context_window)
        return content[context_start:context_end].strip()
    
    def _deduplicate_entities(self, entities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate entities based on text and position overlap"""
        deduplicated = []
        seen = set()
        
        for entity in entities:
            # Create signature for deduplication
            signature = (
                entity["text"].lower().strip(),
                entity.get("position", {}).get("start", 0),
                entity.get("position", {}).get("end", 0)
            )
            
            if signature not in seen:
                seen.add(signature)
                deduplicated.append(entity)
        
        return deduplicated
    
    def _generate_methodology_summary(self, content: str, methodology: str, focus_themes: List[str]) -> str:
        """Generate summary focused on methodology-specific themes"""
        # This would integrate with existing summarization system
        # For now, return a methodology-focused summary template
        
        word_count = len(content.split())
        char_count = len(content)
        
        return f"""
        Document analyzed using {methodology.upper()} methodology approach.
        
        Content: {word_count} words, {char_count} characters
        Focus themes: {', '.join(focus_themes)}
        
        [This would integrate with existing summarization system to generate 
        methodology-specific summaries based on the extracted entities and 
        domain-specific patterns identified.]
        """
    
    def _calculate_scientific_rigor_score(self, entities: List[Dict[str, Any]]) -> float:
        """Calculate scientific rigor score based on extracted entities (Hynek approach)"""
        
        rigor_factors = {
            "multiple_witnesses": 2.0,
            "radar_confirmation": 3.0,
            "physical_evidence": 2.5,
            "trained_observer": 2.0,
            "photographic_evidence": 2.5,
            "independent_confirmation": 2.0
        }
        
        score = 0.0
        max_score = 10.0
        
        for entity in entities:
            entity_text = entity["text"].lower()
            for factor, points in rigor_factors.items():
                if factor.replace("_", " ") in entity_text:
                    score += points
        
        return min(score, max_score)
    
    def _update_session_stats(self, extraction_results: Dict[str, Any], 
                            methodology: UFOResearchMethodology, 
                            doc_type: DocumentType):
        """Update session statistics"""
        
        self.session_stats["documents_processed"] += 1
        self.session_stats["entities_extracted"] += len(extraction_results["entities"])
        self.session_stats["high_confidence_entities"] += len([
            e for e in extraction_results["entities"] if e["confidence"] >= self.confidence_threshold
        ])
        
        if methodology.value not in self.session_stats["methodologies_applied"]:
            self.session_stats["methodologies_applied"].append(methodology.value)
        
        if doc_type.value not in self.session_stats["document_types_processed"]:
            self.session_stats["document_types_processed"].append(doc_type.value)
    
    def get_session_statistics(self) -> Dict[str, Any]:
        """Get current session statistics"""
        return {
            **self.session_stats,
            "agent_reliability_score": self.reliability_score,
            "confidence_threshold": self.confidence_threshold,
            "shared_store_entities": len(shared_entity_store.get_entities_by_agent(self.agent_id))
        }


# Integration functions for other agents
async def extract_with_domain_expertise(content: str, 
                                       document_type: DocumentType,
                                       methodology: UFOResearchMethodology = None) -> Dict[str, Any]:
    """Convenience function for other agents to use domain-specific extraction"""
    
    agent = UltraterrestrialDomainNERAgent()
    return await agent.extract_entities_with_methodology(content, document_type, methodology)


async def summarize_with_domain_expertise(content: str,
                                         document_type: DocumentType, 
                                         methodology: UFOResearchMethodology = None) -> Dict[str, Any]:
    """Convenience function for domain-specific summarization"""
    
    agent = UltraterrestrialDomainNERAgent()
    return await agent.summarize_document_with_methodology(content, document_type, methodology)


if __name__ == "__main__":
    # Example usage and testing
    import asyncio
    
    async def test_domain_ner():
        agent = UltraterrestrialDomainNERAgent()
        
        # Test content with various UFO elements
        test_content = """
        Commander David Fravor, a former Navy pilot, described his encounter with
        an unidentified aerial phenomena during the USS Nimitz incident in 2004.
        The object demonstrated instantaneous acceleration and trans-medium capabilities,
        moving seamlessly between air and water. Multiple radar operators confirmed
        the sighting, providing corroborating evidence for this close encounter of
        the first kind. The electromagnetic interference affected their aircraft
        systems, leaving physical traces on the radar equipment.
        """
        
        # Test different methodologies
        for methodology in [UFOResearchMethodology.VALLEE, 
                          UFOResearchMethodology.HYNEK,
                          UFOResearchMethodology.PASULKA]:
            
            print(f"\n--- Testing {methodology.value.upper()} Methodology ---")
            
            results = await agent.extract_entities_with_methodology(
                test_content, 
                DocumentType.MILITARY_REPORT,
                methodology
            )
            
            print(f"Entities extracted: {len(results['entities'])}")
            for entity in results['entities'][:3]:  # Show first 3
                print(f"  - {entity['text']} ({entity['confidence']:.2f}) - {entity['methodology_context']}")
        
        # Test summarization
        summary = await agent.summarize_document_with_methodology(
            test_content,
            DocumentType.MILITARY_REPORT,
            UFOResearchMethodology.HYNEK
        )
        
        print(f"\n--- Summary Results ---")
        print(f"Key findings: {summary['key_findings']}")
        print(f"Research significance: {summary['research_significance']}")
        
        # Get statistics
        stats = agent.get_session_statistics()
        print(f"\n--- Session Statistics ---")
        print(f"Documents processed: {stats['documents_processed']}")
        print(f"Total entities: {stats['entities_extracted']}")
        print(f"High confidence: {stats['high_confidence_entities']}")
        print(f"Shared store entities: {stats['shared_store_entities']}")
    
    # Run the test
    asyncio.run(test_domain_ner())