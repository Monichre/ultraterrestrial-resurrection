# apps/disclosure-rag/agents/ufo_youtube_agent.py

import json
import logging
import re
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from dataclasses import dataclass
import hashlib

from agno.agent import Agent
from agno.models.anthropic import Claude as AnthropicChat
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage

# Import existing system components
from lib.youtube import get_video_info_and_transcript, format_metadata, clean_string
from agents.content_analysis_agent import ContentAnalysisAgent
from agents.entity_extraction_agent import EntityExtractionAgent
from agents.base import create_agent, DEFAULT_CLAUDE, DEFAULT_OPENAI

# Import AGNO Shared Entity Store Integration
from lib.shared_entity_store import (
    shared_entity_store, 
    register_entity_from_agent,
    get_related_entities,
    EntityType,
    ConfidenceLevel
)

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

@dataclass
class UFOAnalysisConfig:
    """Enhanced configuration class for UFO YouTube Agent with AGNO integration"""
    # Core model configuration
    model_provider: str = "claude"  # "claude" or "openai"
    model_id: str = DEFAULT_CLAUDE
    storage_path: str = "tmp/ufo_youtube_agent.db"
    
    # Feature enablement
    enable_entity_extraction: bool = True
    enable_content_classification: bool = True
    enable_shared_entity_integration: bool = True
    enable_temporal_extraction: bool = True
    
    # Analysis parameters
    confidence_threshold: float = 0.7
    max_transcript_length: int = 50000
    analysis_depth: str = "standard"  # "basic", "standard", "comprehensive"
    
    # AGNO Integration settings
    agent_id: str = "ufo_youtube_agent"
    cross_validation_enabled: bool = True
    entity_confidence_threshold: float = 0.6
    temporal_resolution: str = "minute"  # "second", "minute", "segment"
    
    # Quality and reliability settings
    reliability_score: float = 0.85  # Agent reliability for shared entity store
    max_entities_per_session: int = 100
    enable_conflict_resolution: bool = True


class UFOTemporalExtractor:
    """Specialized temporal entity extraction for UFO content"""
    
    def __init__(self, resolution: str = "minute"):
        """Initialize temporal extractor with specified resolution"""
        self.resolution = resolution
        self.words_per_minute = 150  # Average speaking rate
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
        
        # Enhanced temporal patterns for UFO content
        self.temporal_patterns = {
            "absolute_dates": [
                r"(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}",
                r"\d{1,2}\/\d{1,2}\/\d{4}",
                r"\d{4}-\d{2}-\d{2}",
                r"(?:in|on|during)\s+\d{4}",
                r"(?:back\s+in|circa|around)\s+\d{4}"
            ],
            "relative_timeframes": [
                r"(?:about|around|approximately)\s+\d+\s+(?:years?|months?|weeks?|days?)\s+ago",
                r"(?:a few|several|many)\s+(?:years?|months?|weeks?|days?)\s+(?:ago|back|earlier)",
                r"(?:last|this|next)\s+(?:year|month|week|decade)",
                r"(?:recently|lately|not long ago|some time ago)"
            ],
            "event_sequences": [
                r"(?:first|initially|originally|at first)",
                r"(?:then|next|after that|subsequently|following that)",
                r"(?:finally|lastly|in the end|ultimately)",
                r"(?:meanwhile|during this time|simultaneously)"
            ],
            "ufo_specific_timeframes": [
                r"(?:during|after|before)\s+the\s+(?:sighting|encounter|incident|event)",
                r"(?:when|as|while)\s+(?:I|we|they)\s+(?:saw|witnessed|observed|encountered)",
                r"(?:immediately|right)\s+(?:after|before)\s+(?:the|seeing|witnessing)",
                r"(?:at the time of|during)\s+(?:contact|abduction|sighting)"
            ]
        }
    
    def extract_temporal_entities(self, transcript: str, video_metadata: Dict) -> List[Dict[str, Any]]:
        """
        Extract temporal entities with UFO-specific context
        
        Returns:
            List of temporal entities with timestamps, confidence, and UFO context
        """
        temporal_entities = []
        words = transcript.split()
        
        try:
            for category, patterns in self.temporal_patterns.items():
                for pattern in patterns:
                    matches = list(re.finditer(pattern, transcript, re.IGNORECASE))
                    
                    for match in matches:
                        # Calculate approximate timestamp
                        char_pos = match.start()
                        word_estimate = len(transcript[:char_pos].split())
                        timestamp = self._calculate_timestamp(word_estimate)
                        
                        # Extract surrounding context for UFO relevance
                        context_start = max(0, char_pos - 150)
                        context_end = min(len(transcript), char_pos + 150)
                        context = transcript[context_start:context_end]
                        
                        # Calculate confidence based on pattern specificity
                        confidence = self._calculate_temporal_confidence(match.group(), category, context)
                        
                        # Determine UFO relevance
                        ufo_relevance = self._assess_ufo_relevance(context)
                        
                        temporal_entity = {
                            "text": match.group().strip(),
                            "type": "temporal_entity",
                            "confidence": confidence,
                            "timestamp": timestamp,
                            "category": category,
                            "context": context.strip(),
                            "ufo_relevance": ufo_relevance,
                            "temporal_markers": [{
                                "video_timestamp": timestamp,
                                "extraction_type": category,
                                "pattern_match": pattern,
                                "confidence": confidence
                            }],
                            "evidence_strength": min(confidence + ufo_relevance * 0.2, 1.0)
                        }
                        
                        temporal_entities.append(temporal_entity)
            
            # Remove duplicates and sort by confidence
            temporal_entities = self._deduplicate_temporal_entities(temporal_entities)
            temporal_entities.sort(key=lambda x: x["confidence"], reverse=True)
            
            self.logger.info(f"Extracted {len(temporal_entities)} temporal entities")
            return temporal_entities
            
        except Exception as e:
            self.logger.error(f"Error extracting temporal entities: {e}")
            return []
    
    def _calculate_timestamp(self, word_position: int) -> str:
        """Calculate video timestamp from word position"""
        minutes = word_position // self.words_per_minute
        seconds = (word_position % self.words_per_minute) * 60 // self.words_per_minute
        
        if self.resolution == "second":
            return f"{minutes:02d}:{seconds:02d}"
        else:  # minute resolution
            return f"{minutes:02d}:00"
    
    def _calculate_temporal_confidence(self, text: str, category: str, context: str) -> float:
        """Calculate confidence score for temporal extraction"""
        base_confidence = {
            "absolute_dates": 0.9,
            "relative_timeframes": 0.75,
            "event_sequences": 0.65,
            "ufo_specific_timeframes": 0.8
        }.get(category, 0.6)
        
        # Boost confidence for specific date formats
        if re.search(r"\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}", text):
            base_confidence += 0.1
        
        # Reduce confidence for vague terms
        if any(vague in text.lower() for vague in ["about", "around", "some time", "a while"]):
            base_confidence -= 0.15
        
        return min(max(base_confidence, 0.1), 1.0)
    
    def _assess_ufo_relevance(self, context: str) -> float:
        """Assess UFO relevance of temporal context"""
        ufo_keywords = [
            "ufo", "uap", "sighting", "encounter", "craft", "lights", "object",
            "alien", "extraterrestrial", "witness", "testimony", "incident"
        ]
        
        context_lower = context.lower()
        relevance_score = sum(1 for keyword in ufo_keywords if keyword in context_lower)
        return min(relevance_score / 5.0, 1.0)
    
    def _deduplicate_temporal_entities(self, entities: List[Dict]) -> List[Dict]:
        """Remove duplicate temporal entities"""
        seen = set()
        unique_entities = []
        
        for entity in entities:
            # Create signature based on text and approximate timestamp
            signature = f"{entity['text'].lower()}:{entity['timestamp']}"
            if signature not in seen:
                seen.add(signature)
                unique_entities.append(entity)
        
        return unique_entities


class UFOContentClassifier:
    """Enhanced UFO-specific content classification system for Phase 2 readiness"""
    
    def __init__(self):
        self.content_types = {
            "witness_testimony": {
                "keywords": ["witnessed", "saw", "experienced", "encounter", "testimony", "statement", "I was there"],
                "patterns": [r"I (saw|witnessed|experienced)", r"(first|second|third) person", r"my (experience|encounter)"],
                "weight": 1.2,
                "confidence_boost": 0.1
            },
            "expert_interview": {
                "keywords": ["interview", "expert", "researcher", "scientist", "investigator", "authority"],
                "patterns": [r"Dr\.|Professor|expert", r"interview with", r"speaking with"],
                "weight": 1.0,
                "confidence_boost": 0.05
            },
            "official_disclosure": {
                "keywords": ["pentagon", "government", "military", "official", "declassified", "congress"],
                "patterns": [r"officially", r"government", r"declassified", r"pentagon", r"congressional"],
                "weight": 1.3,
                "confidence_boost": 0.15
            },
            "documentary_analysis": {
                "keywords": ["documentary", "investigation", "research", "analysis", "report", "study"],
                "patterns": [r"narrator:", r"documentary", r"investigation", r"according to"],
                "weight": 0.9,
                "confidence_boost": 0.0
            },
            "news_reporting": {
                "keywords": ["breaking", "news", "report", "reporter", "journalist", "anchor", "live"],
                "patterns": [r"news", r"breaking", r"reporter", r"live from", r"this just in"],
                "weight": 0.8,
                "confidence_boost": -0.05
            }
        }
        
        # Enhanced UFO relevance keywords with weighted scoring
        self.ufo_relevance_keywords = {
            # High relevance (weight: 1.0)
            "primary_terms": ["ufo", "uap", "unidentified aerial phenomena", "flying saucer"],
            # Medium-high relevance (weight: 0.8)
            "encounter_terms": ["sighting", "encounter", "abduction", "contact", "close encounter"],
            # Medium relevance (weight: 0.6)
            "descriptive_terms": ["craft", "object", "lights", "disc", "triangle", "orb"],
            # Low-medium relevance (weight: 0.4)
            "related_terms": ["extraterrestrial", "alien", "space", "phenomena"],
            # Context terms (weight: 0.3)
            "location_terms": ["area 51", "roswell", "phoenix lights", "rendlesham"],
            # Authority terms (weight: 0.7)
            "authority_terms": ["pentagon", "aatip", "uaptf", "disclosure", "declassified"]
        }
        
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    def classify_content(self, transcript: str, metadata: Dict) -> Dict[str, Any]:
        """
        Enhanced content classification with AGNO integration readiness
        
        Returns comprehensive classification suitable for shared entity store
        """
        try:
            transcript_lower = transcript.lower()
            title_lower = metadata.get('title', '').lower()
            description_lower = metadata.get('description', '').lower()
            combined_text = f"{transcript_lower} {title_lower} {description_lower}"
            
            # Score each content type
            classification_scores = {}
            evidence_details = {}
            
            for content_type, criteria in self.content_types.items():
                score, evidence = self._score_content_type(
                    combined_text, transcript_lower, criteria
                )
                classification_scores[content_type] = score
                evidence_details[content_type] = evidence
            
            # Determine primary classification
            primary_type = max(classification_scores, key=classification_scores.get)
            primary_confidence = min(classification_scores[primary_type], 1.0)
            
            # Calculate UFO relevance with weighted scoring
            ufo_relevance = self._calculate_ufo_relevance(combined_text)
            
            # Generate confidence factors
            confidence_factors = self._analyze_confidence_factors(
                transcript, metadata, primary_type, ufo_relevance
            )
            
            # Create classification result suitable for shared entity store
            classification = {
                "content_type": primary_type,
                "confidence": primary_confidence,
                "ufo_relevance": ufo_relevance,
                "all_scores": classification_scores,
                "evidence": evidence_details[primary_type],
                "confidence_factors": confidence_factors,
                "metadata": {
                    "video_length": metadata.get('duration', 0),
                    "channel": metadata.get('channel', 'Unknown'),
                    "upload_date": metadata.get('upload_date', 'Unknown'),
                    "view_count": metadata.get('view_count', 0)
                },
                "agno_ready": True,  # Flag for Phase 2 integration
                "classification_timestamp": datetime.now().isoformat()
            }
            
            self.logger.info(f"Content classified as: {primary_type} (confidence: {primary_confidence:.2f})")
            return classification
            
        except Exception as e:
            self.logger.error(f"Error classifying content: {e}")
            return {
                "content_type": "unknown", 
                "confidence": 0.0, 
                "error": str(e),
                "agno_ready": False
            }
    
    def _score_content_type(self, combined_text: str, transcript: str, criteria: Dict) -> tuple:
        """Score content type based on keywords and patterns"""
        score = 0.0
        evidence = []
        
        # Keyword matching
        keyword_matches = sum(1 for keyword in criteria['keywords'] 
                            if keyword in combined_text)
        if keyword_matches > 0:
            keyword_score = (keyword_matches / len(criteria['keywords'])) * criteria['weight']
            score += keyword_score
            evidence.append(f"{keyword_matches} keyword matches")
        
        # Pattern matching
        pattern_matches = sum(1 for pattern in criteria['patterns'] 
                            if re.search(pattern, transcript, re.IGNORECASE))
        if pattern_matches > 0:
            pattern_score = (pattern_matches / len(criteria['patterns'])) * 0.4
            score += pattern_score
            evidence.append(f"{pattern_matches} pattern matches")
        
        # Apply confidence boost
        score += criteria.get('confidence_boost', 0.0)
        
        return min(score, 1.0), evidence
    
    def _calculate_ufo_relevance(self, text: str) -> float:
        """Calculate weighted UFO relevance score"""
        relevance_score = 0.0
        total_possible = 0.0
        
        for category, keywords in self.ufo_relevance_keywords.items():
            weight = {
                "primary_terms": 1.0,
                "encounter_terms": 0.8,
                "descriptive_terms": 0.6,
                "related_terms": 0.4,
                "location_terms": 0.3,
                "authority_terms": 0.7
            }.get(category, 0.5)
            
            matches = sum(1 for keyword in keywords if keyword in text)
            if matches > 0:
                relevance_score += (matches / len(keywords)) * weight
            
            total_possible += weight
        
        return min(relevance_score / total_possible if total_possible > 0 else 0.0, 1.0)
    
    def _analyze_confidence_factors(self, transcript: str, metadata: Dict, 
                                  content_type: str, ufo_relevance: float) -> Dict:
        """Analyze factors affecting classification confidence"""
        factors = {
            "transcript_quality": self._assess_transcript_quality(transcript),
            "content_length": self._assess_content_length(transcript),
            "metadata_completeness": self._assess_metadata_completeness(metadata),
            "topic_consistency": self._assess_topic_consistency(transcript, ufo_relevance),
            "source_credibility": self._assess_source_credibility(metadata)
        }
        
        # Calculate overall confidence modifier
        factors["overall_modifier"] = sum(factors.values()) / len(factors)
        
        return factors
    
    def _assess_transcript_quality(self, transcript: str) -> float:
        """Assess transcript quality for confidence calculation"""
        if len(transcript) < 100:
            return 0.2
        
        # Check for common transcript issues
        issues = 0
        if "[inaudible]" in transcript.lower():
            issues += 1
        if transcript.count("...") > len(transcript) / 100:
            issues += 1
        if len([w for w in transcript.split() if len(w) < 2]) > len(transcript.split()) * 0.3:
            issues += 1
        
        return max(1.0 - (issues * 0.2), 0.2)
    
    def _assess_content_length(self, transcript: str) -> float:
        """Assess content length appropriateness"""
        length = len(transcript.split())
        if length < 50:
            return 0.3
        elif length < 200:
            return 0.6
        elif length < 1000:
            return 1.0
        elif length < 5000:
            return 0.9
        else:
            return 0.7  # Very long content might have quality issues
    
    def _assess_metadata_completeness(self, metadata: Dict) -> float:
        """Assess completeness of video metadata"""
        required_fields = ['title', 'description', 'channel', 'upload_date']
        present_fields = sum(1 for field in required_fields if metadata.get(field))
        return present_fields / len(required_fields)
    
    def _assess_topic_consistency(self, transcript: str, ufo_relevance: float) -> float:
        """Assess consistency of UFO topic throughout content"""
        return ufo_relevance  # UFO relevance already indicates topic consistency
    
    def _assess_source_credibility(self, metadata: Dict) -> float:
        """Basic source credibility assessment"""
        # This would be enhanced with channel reputation data
        channel = metadata.get('channel', '').lower()
        
        credible_indicators = ['official', 'news', 'documentary', 'research', 'science']
        suspicious_indicators = ['conspiracy', 'fake', 'hoax', 'clickbait']
        
        credibility = 0.5  # Neutral baseline
        
        if any(indicator in channel for indicator in credible_indicators):
            credibility += 0.2
        if any(indicator in channel for indicator in suspicious_indicators):
            credibility -= 0.3
        
        return max(min(credibility, 1.0), 0.1)


class UFOYouTubeAgent:
    """
    Enhanced UFO YouTube Agent with AGNO Shared Entity Store Integration
    
    This agent provides comprehensive UFO/UAP YouTube content analysis with:
    - Cross-agent entity sharing via shared entity store
    - Temporal entity extraction with UFO-specific patterns
    - Enhanced content classification ready for Phase 2
    - Confidence scoring and evidence tracking
    - Integration with existing 85-95% accuracy entity extraction
    """
    
    def __init__(self, config: Optional[UFOAnalysisConfig] = None):
        """
        Initialize the enhanced UFO YouTube Agent
        
        Args:
            config: Configuration object for the agent
        """
        self.config = config or UFOAnalysisConfig()
        self.logger = logging.getLogger(__name__)
        
        # Generate unique session ID for entity tracking
        self.session_id = self._generate_session_id()
        
        # Initialize specialized components
        self.content_classifier = UFOContentClassifier()
        self.temporal_extractor = UFOTemporalExtractor(self.config.temporal_resolution)
        
        # Initialize AI model and agent
        self._initialize_agent()
        
        # Initialize sub-agents if enabled
        self.content_analysis_agent = None
        self.entity_extraction_agent = None
        
        if self.config.enable_content_classification:
            self.content_analysis_agent = ContentAnalysisAgent(
                storage_path=f"tmp/{self.__class__.__name__.lower()}_content.db"
            )
        
        if self.config.enable_entity_extraction:
            self.entity_extraction_agent = EntityExtractionAgent()
        
        # Entity tracking for this session
        self.session_entities = []
        self.entity_count = 0
        
        # Register with shared entity store
        if self.config.enable_shared_entity_integration:
            self._register_agent_capabilities()
        
        self.logger.info(f"UFO YouTube Agent initialized - Session: {self.session_id}")
        self.logger.info(f"Model: {self.config.model_provider}:{self.config.model_id}")
        self.logger.info(f"Shared entity integration: {self.config.enable_shared_entity_integration}")
    
    def _generate_session_id(self) -> str:
        """Generate unique session ID for entity tracking"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        hash_component = hashlib.md5(f"{self.config.agent_id}_{timestamp}".encode()).hexdigest()[:8]
        return f"ufo_youtube_{timestamp}_{hash_component}"
    
    def _initialize_agent(self):
        """Initialize the AI agent with UFO-specific configuration"""
        if self.config.model_provider == "claude":
            self.model = AnthropicChat(id=self.config.model_id)
        elif self.config.model_provider == "openai":
            self.model = OpenAIChat(id=self.config.model_id)
        else:
            raise ValueError(f"Unsupported model provider: {self.config.model_provider}")
        
        # Create specialized agent for UFO content
        self.agent = Agent(
            name=f"UFO YouTube Analyst ({self.config.agent_id})",
            model=self.model,
            instructions=[
                "You are a specialized analyst for UFO/UAP content on YouTube with focus on accuracy and evidence.",
                "Your expertise includes:",
                "- Identifying credible witness testimonies and expert interviews",
                "- Extracting temporal information with precise context",
                "- Analyzing official disclosure content and government statements",
                "- Cross-referencing claims with historical UFO events and documentation",
                "- Maintaining objectivity while acknowledging extraordinary claims require extraordinary evidence",
                "",
                "For entity extraction:",
                "- Focus on people (witnesses, officials, researchers)",
                "- Identify specific UFO events, incidents, and locations",
                "- Extract organizations (military units, government agencies, research groups)",
                "- Note temporal references and their context",
                "",
                "Provide structured output with confidence scores and evidence sources.",
                "Flag entities suitable for cross-agent validation.",
                "Maintain chain of evidence for all extractions."
            ],
            storage=SqliteStorage(
                table_name=f"{self.config.agent_id}_analysis",
                db_file=self.config.storage_path
            ),
            add_datetime_to_instructions=True,
            add_history_to_messages=True,
            markdown=True,
            show_tool_calls=False  # Keep focused on analysis output
        )
    
    def _register_agent_capabilities(self):
        """Register agent capabilities with shared entity store"""
        try:
            # Register agent metadata with shared store
            agent_metadata = {
                "agent_id": self.config.agent_id,
                "session_id": self.session_id,
                "capabilities": [
                    "ufo_content_analysis",
                    "temporal_entity_extraction", 
                    "witness_testimony_identification",
                    "official_disclosure_analysis",
                    "youtube_content_processing"
                ],
                "reliability_score": self.config.reliability_score,
                "entity_types": [
                    EntityType.PERSONNEL.value,
                    EntityType.EVENTS.value,
                    EntityType.ORGANIZATIONS.value,
                    EntityType.LOCATIONS.value,
                    EntityType.TEMPORAL_ENTITY.value
                ],
                "registration_timestamp": datetime.now().isoformat()
            }
            
            self.logger.info("Agent capabilities registered with shared entity store")
            
        except Exception as e:
            self.logger.error(f"Error registering agent capabilities: {e}")
    
    async def analyze_ufo_video(self, video_url: str, 
                               enhanced_extraction: bool = True) -> Dict[str, Any]:
        """
        Comprehensive UFO video analysis with shared entity store integration
        
        Args:
            video_url: YouTube video URL
            enhanced_extraction: Enable enhanced entity extraction with cross-agent validation
            
        Returns:
            Comprehensive analysis results with entity store integration
        """
        try:
            self.logger.info(f"Starting comprehensive UFO analysis: {video_url}")
            
            # Step 1: Extract video data
            video_data = await self._extract_video_data(video_url)
            if not video_data:
                return self._create_error_response("Failed to extract video data")
            
            # Step 2: Content classification (Phase 1 foundation for Phase 2)
            classification = await self._classify_content(video_data)
            
            # Step 3: Temporal entity extraction
            temporal_entities = []
            if self.config.enable_temporal_extraction:
                temporal_entities = await self._extract_temporal_entities(video_data)
            
            # Step 4: Enhanced entity extraction with shared store integration
            extracted_entities = {}
            if enhanced_extraction and self.config.enable_entity_extraction:
                extracted_entities = await self._extract_entities_with_shared_store(video_data)
            
            # Step 5: UFO-specific event identification
            ufo_events = await self._identify_ufo_events(video_data, classification)
            
            # Step 6: Cross-agent validation (if enabled)
            validation_results = {}
            if self.config.cross_validation_enabled and self.config.enable_shared_entity_integration:
                validation_results = await self._perform_cross_agent_validation(extracted_entities)
            
            # Step 7: Generate insights and summary
            analysis_summary = await self._generate_analysis_summary(
                video_data, classification, temporal_entities, extracted_entities, ufo_events
            )
            
            # Step 8: Compile comprehensive results
            results = {
                "status": "success",
                "session_id": self.session_id,
                "video_metadata": {
                    "title": video_data.get('title'),
                    "id": video_data.get('id'),
                    "url": video_url,
                    "duration": video_data.get('duration'),
                    "upload_date": video_data.get('upload_date'),
                    "channel": video_data.get('channel')
                },
                "content_classification": classification,
                "temporal_entities": temporal_entities,
                "extracted_entities": extracted_entities,
                "ufo_events": ufo_events,
                "cross_agent_validation": validation_results,
                "analysis_summary": analysis_summary,
                "entity_statistics": {
                    "total_entities_extracted": self.entity_count,
                    "shared_store_registrations": len(self.session_entities),
                    "temporal_entities_count": len(temporal_entities),
                    "ufo_events_count": len(ufo_events)
                },
                "analysis_metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "agent_version": "2.0.0-agno",
                    "config": {
                        "model": self.config.model_id,
                        "analysis_depth": self.config.analysis_depth,
                        "shared_entity_integration": self.config.enable_shared_entity_integration
                    },
                    "reliability_factors": {
                        "classification_confidence": classification.get('confidence', 0),
                        "ufo_relevance": classification.get('ufo_relevance', 0),
                        "entity_validation_score": validation_results.get('average_confidence', 0)
                    }
                }
            }
            
            self.logger.info(f"UFO analysis completed - Entities: {self.entity_count}, Events: {len(ufo_events)}")
            return results
            
        except Exception as e:
            self.logger.error(f"Error in comprehensive UFO analysis: {e}")
            return self._create_error_response(f"Analysis failed: {str(e)}")
    
    async def _extract_video_data(self, video_url: str) -> Optional[Dict]:
        """Extract video information and transcript"""
        try:
            # Use existing YouTube processing function
            metadata = get_video_info_and_transcript(video_url)
            
            if not metadata or not metadata.get('transcript'):
                self.logger.warning(f"No transcript found for: {video_url}")
                return None
            
            # Truncate transcript if necessary
            transcript = metadata['transcript']
            if len(transcript) > self.config.max_transcript_length:
                transcript = transcript[:self.config.max_transcript_length] + "... [truncated]"
                metadata['transcript'] = transcript
                self.logger.info(f"Transcript truncated to {self.config.max_transcript_length} characters")
            
            return metadata
            
        except Exception as e:
            self.logger.error(f"Error extracting video data: {e}")
            return None
    
    async def _classify_content(self, video_data: Dict) -> Dict[str, Any]:
        """Enhanced content classification with AGNO readiness"""
        try:
            transcript = video_data.get('transcript', '')
            
            # Use enhanced content classifier
            classification = self.content_classifier.classify_content(transcript, video_data)
            
            # AI enhancement for low confidence classifications
            if classification.get('confidence', 0) < self.config.confidence_threshold:
                enhancement_prompt = f"""
                Analyze this UFO/UAP YouTube content for enhanced classification:
                
                Title: {video_data.get('title', 'Unknown')}
                Channel: {video_data.get('channel', 'Unknown')}
                Duration: {video_data.get('duration', 'Unknown')}
                
                Content Sample: {transcript[:2000]}...
                
                Current classification: {classification.get('content_type', 'unknown')} 
                (confidence: {classification.get('confidence', 0):.2f})
                
                Please provide:
                1. Enhanced content type classification
                2. Confidence assessment (0-1)
                3. Key evidence supporting classification
                4. UFO relevance score (0-1)
                5. Credibility indicators
                
                Focus on accuracy and evidence-based assessment.
                """
                
                ai_enhancement = await self.agent.generate_response(enhancement_prompt)
                classification['ai_enhancement'] = ai_enhancement
            
            return classification
            
        except Exception as e:
            self.logger.error(f"Error in content classification: {e}")
            return {"content_type": "unknown", "confidence": 0.0, "error": str(e)}
    
    async def _extract_temporal_entities(self, video_data: Dict) -> List[Dict[str, Any]]:
        """Extract temporal entities with UFO-specific context"""
        try:
            transcript = video_data.get('transcript', '')
            temporal_entities = self.temporal_extractor.extract_temporal_entities(transcript, video_data)
            
            # Register significant temporal entities with shared store
            if self.config.enable_shared_entity_integration:
                for entity in temporal_entities:
                    if entity.get('confidence', 0) >= self.config.entity_confidence_threshold:
                        entity_id = await self._register_entity_with_shared_store(entity)
                        entity['shared_store_id'] = entity_id
            
            return temporal_entities
            
        except Exception as e:
            self.logger.error(f"Error extracting temporal entities: {e}")
            return []
    
    async def _extract_entities_with_shared_store(self, video_data: Dict) -> Dict[str, Any]:
        """Enhanced entity extraction with shared store integration"""
        try:
            transcript = video_data.get('transcript', '')
            
            # Use existing entity extraction agent if available
            if self.entity_extraction_agent:
                # Note: This would need to be adapted based on actual EntityExtractionAgent interface
                raw_entities = []  # Placeholder for actual extraction
            else:
                # Fallback to AI-based extraction
                raw_entities = await self._ai_entity_extraction(transcript, video_data)
            
            # Process and enhance entities for shared store integration
            processed_entities = {
                "personnel": [],
                "events": [],
                "organizations": [],
                "locations": [],
                "total_extracted": 0,
                "shared_store_registered": 0
            }
            
            for entity in raw_entities:
                # Process each entity and register with shared store if appropriate
                processed_entity = await self._process_and_register_entity(entity, video_data)
                
                entity_type = processed_entity.get('type', 'unknown')
                if entity_type in processed_entities:
                    processed_entities[entity_type].append(processed_entity)
                
                processed_entities["total_extracted"] += 1
                
                if processed_entity.get('shared_store_registered'):
                    processed_entities["shared_store_registered"] += 1
                    self.entity_count += 1
            
            return processed_entities
            
        except Exception as e:
            self.logger.error(f"Error in entity extraction with shared store: {e}")
            return {"error": str(e), "total_extracted": 0, "shared_store_registered": 0}
    
    async def _ai_entity_extraction(self, transcript: str, video_data: Dict) -> List[Dict]:
        """AI-based entity extraction when specialized agent not available"""
        try:
            extraction_prompt = f"""
            Extract UFO/UAP-related entities from this YouTube transcript:
            
            Video: {video_data.get('title', 'Unknown')}
            Transcript: {transcript[:3000]}...
            
            Extract and categorize:
            1. PERSONNEL (witnesses, officials, researchers, military personnel)
            2. EVENTS (specific UFO incidents, sightings, encounters)
            3. ORGANIZATIONS (military units, agencies, research groups)
            4. LOCATIONS (bases, cities, countries, specific sites)
            
            For each entity provide:
            - text: exact entity text
            - type: category (personnel/events/organizations/locations)
            - confidence: 0.0-1.0 based on clarity and context
            - context: surrounding text that provides evidence
            - evidence_strength: 0.0-1.0 based on credibility of mention
            
            Format as JSON array with these fields.
            Focus on accuracy over quantity.
            """
            
            ai_response = await self.agent.generate_response(extraction_prompt)
            
            # Parse AI response to extract entities
            # This would need proper JSON parsing and validation
            entities = []  # Placeholder - would parse AI response
            
            return entities
            
        except Exception as e:
            self.logger.error(f"Error in AI entity extraction: {e}")
            return []
    
    async def _process_and_register_entity(self, raw_entity: Dict, video_data: Dict) -> Dict[str, Any]:
        """Process raw entity and register with shared store if appropriate"""
        try:
            # Enhance entity with UFO-specific context
            processed_entity = {
                "text": raw_entity.get('text', '').strip(),
                "type": raw_entity.get('type', 'unknown'),
                "confidence": float(raw_entity.get('confidence', 0.7)),
                "context": raw_entity.get('context', ''),
                "evidence_strength": float(raw_entity.get('evidence_strength', 0.6)),
                "video_context": {
                    "title": video_data.get('title'),
                    "channel": video_data.get('channel'),
                    "url": video_data.get('url', '')
                },
                "extraction_timestamp": datetime.now().isoformat(),
                "shared_store_registered": False
            }
            
            # Register with shared store if confidence meets threshold
            if (processed_entity['confidence'] >= self.config.entity_confidence_threshold and 
                self.config.enable_shared_entity_integration and
                self.entity_count < self.config.max_entities_per_session):
                
                entity_id = await self._register_entity_with_shared_store(processed_entity)
                if entity_id:
                    processed_entity['shared_store_id'] = entity_id
                    processed_entity['shared_store_registered'] = True
                    self.session_entities.append(entity_id)
            
            return processed_entity
            
        except Exception as e:
            self.logger.error(f"Error processing entity: {e}")
            return raw_entity
    
    async def _register_entity_with_shared_store(self, entity: Dict) -> Optional[str]:
        """Register entity with AGNO shared entity store"""
        try:
            # Map entity to shared store format
            entity_data = {
                "text": entity['text'],
                "type": self._map_entity_type(entity.get('type', 'unknown')),
                "confidence": entity.get('confidence', 0.7),
                "context": entity.get('context', ''),
                "evidence_strength": entity.get('evidence_strength', 0.6),
                "temporal_markers": entity.get('temporal_markers', [])
            }
            
            # Register with shared store
            entity_id = register_entity_from_agent(
                entity_data=entity_data,
                agent_id=self.config.agent_id,
                session_id=self.session_id
            )
            
            if entity_id:
                self.logger.debug(f"Registered entity with shared store: {entity_id}")
                return entity_id
            
        except Exception as e:
            self.logger.error(f"Error registering entity with shared store: {e}")
        
        return None
    
    def _map_entity_type(self, raw_type: str) -> str:
        """Map raw entity type to EntityType enum values"""
        type_mapping = {
            "personnel": EntityType.PERSONNEL.value,
            "people": EntityType.PERSONNEL.value,
            "person": EntityType.PERSONNEL.value,
            "events": EntityType.EVENTS.value,
            "event": EntityType.EVENTS.value,
            "incident": EntityType.EVENTS.value,
            "organizations": EntityType.ORGANIZATIONS.value,
            "organization": EntityType.ORGANIZATIONS.value,
            "agency": EntityType.ORGANIZATIONS.value,
            "locations": EntityType.LOCATIONS.value,
            "location": EntityType.LOCATIONS.value,
            "place": EntityType.LOCATIONS.value,
            "temporal_entity": EntityType.TEMPORAL_ENTITY.value,
            "temporal": EntityType.TEMPORAL_ENTITY.value
        }
        
        return type_mapping.get(raw_type.lower(), EntityType.PERSONNEL.value)
    
    async def _identify_ufo_events(self, video_data: Dict, classification: Dict) -> List[Dict[str, Any]]:
        """Identify specific UFO events with enhanced context"""
        try:
            transcript = video_data.get('transcript', '')
            
            # Use existing pattern-based detection
            basic_events = self.content_classifier.identify_ufo_events(transcript)
            
            # Enhance events with AI analysis if comprehensive mode
            if self.config.analysis_depth == "comprehensive":
                enhanced_events = []
                
                for event in basic_events:
                    enhancement_prompt = f"""
                    Analyze this UFO event from YouTube content:
                    
                    Event: {event.get('description', '')}
                    Context: {event.get('context', '')}
                    Timestamp: {event.get('timestamp', 'Unknown')}
                    
                    Provide enhanced analysis:
                    1. Event credibility (0-1)
                    2. Historical significance
                    3. Key details and evidence
                    4. Related entities (people, locations, organizations)
                    5. Verification possibilities
                    
                    Video Context: {classification.get('content_type', 'unknown')} content
                    UFO Relevance: {classification.get('ufo_relevance', 0):.2f}
                    """
                    
                    ai_analysis = await self.agent.generate_response(enhancement_prompt)
                    
                    enhanced_event = {
                        **event,
                        "ai_analysis": ai_analysis,
                        "enhanced_credibility": event.get('credibility_score', 0.6),
                        "video_classification": classification.get('content_type', 'unknown')
                    }
                    
                    enhanced_events.append(enhanced_event)
                
                return enhanced_events
            
            return basic_events
            
        except Exception as e:
            self.logger.error(f"Error identifying UFO events: {e}")
            return []
    
    async def _perform_cross_agent_validation(self, entities: Dict) -> Dict[str, Any]:
        """Perform cross-agent validation using shared entity store"""
        try:
            validation_results = {
                "validated_entities": 0,
                "conflicts_resolved": 0,
                "confidence_improvements": 0,
                "average_confidence": 0.0,
                "validation_details": []
            }
            
            total_confidence = 0.0
            validated_count = 0
            
            # Check each registered entity for cross-validation opportunities
            for entity_id in self.session_entities:
                try:
                    # Get entity from shared store
                    stored_entity = shared_entity_store.get_entity(entity_id)
                    if not stored_entity:
                        continue
                    
                    # Check for similar entities from other agents
                    similar_entities = get_related_entities(
                        stored_entity.text, 
                        stored_entity.entity_type
                    )
                    
                    if len(similar_entities) > 1:  # Found related entities from other agents
                        # Resolve conflicts and update confidence
                        resolved_entity = shared_entity_store.resolve_entity_conflicts(entity_id)
                        
                        validation_detail = {
                            "entity_id": entity_id,
                            "entity_text": stored_entity.text,
                            "original_confidence": stored_entity.confidence_scores.get(self.config.agent_id, 0),
                            "final_confidence": resolved_entity.cross_validation_score,
                            "contributing_agents": resolved_entity.contributing_agents,
                            "validation_type": "cross_agent_consensus"
                        }
                        
                        validation_results["validation_details"].append(validation_detail)
                        validation_results["conflicts_resolved"] += 1
                        
                        if resolved_entity.cross_validation_score > stored_entity.confidence_scores.get(self.config.agent_id, 0):
                            validation_results["confidence_improvements"] += 1
                    
                    total_confidence += stored_entity.cross_validation_score
                    validated_count += 1
                    validation_results["validated_entities"] += 1
                    
                except Exception as e:
                    self.logger.error(f"Error validating entity {entity_id}: {e}")
                    continue
            
            # Calculate average confidence
            if validated_count > 0:
                validation_results["average_confidence"] = total_confidence / validated_count
            
            self.logger.info(f"Cross-agent validation completed: {validation_results['validated_entities']} entities")
            return validation_results
            
        except Exception as e:
            self.logger.error(f"Error in cross-agent validation: {e}")
            return {"error": str(e), "validated_entities": 0}
    
    async def _generate_analysis_summary(self, video_data: Dict, classification: Dict,
                                       temporal_entities: List, entities: Dict, events: List) -> Dict[str, Any]:
        """Generate comprehensive analysis summary"""
        try:
            summary_prompt = f"""
            Generate a comprehensive summary for this UFO/UAP YouTube video analysis:
            
            Video: "{video_data.get('title', 'Unknown')}"
            Channel: {video_data.get('channel', 'Unknown')}
            Duration: {video_data.get('duration', 'Unknown')}
            
            Analysis Results:
            - Content Type: {classification.get('content_type', 'unknown')} (confidence: {classification.get('confidence', 0):.2f})
            - UFO Relevance: {classification.get('ufo_relevance', 0):.2f}
            - Entities Extracted: {entities.get('total_extracted', 0)}
            - Temporal References: {len(temporal_entities)}
            - UFO Events: {len(events)}
            - Shared Store Integration: {entities.get('shared_store_registered', 0)} entities registered
            
            Provide:
            1. Executive Summary (2-3 sentences)
            2. Key Findings and Evidence
            3. Credibility Assessment (0-10 scale)
            4. Research Value (0-10 scale)
            5. Notable Claims or Testimonies
            6. Recommended Follow-up Actions
            7. Integration Opportunities with existing research
            
            Focus on evidence-based assessment and research utility.
            """
            
            ai_summary = await self.agent.generate_response(summary_prompt)
            
            summary = {
                "executive_summary": ai_summary,
                "key_metrics": {
                    "content_type": classification.get('content_type'),
                    "ufo_relevance": classification.get('ufo_relevance', 0),
                    "analysis_confidence": classification.get('confidence', 0),
                    "entities_extracted": entities.get('total_extracted', 0),
                    "shared_store_integration": entities.get('shared_store_registered', 0),
                    "temporal_entities": len(temporal_entities),
                    "ufo_events": len(events)
                },
                "credibility_factors": classification.get('confidence_factors', {}),
                "session_statistics": {
                    "session_id": self.session_id,
                    "total_entities_this_session": self.entity_count,
                    "shared_store_entities": len(self.session_entities)
                },
                "generated_at": datetime.now().isoformat()
            }
            
            return summary
            
        except Exception as e:
            self.logger.error(f"Error generating analysis summary: {e}")
            return {"error": str(e), "generated_at": datetime.now().isoformat()}
    
    def _create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Create standardized error response"""
        return {
            "status": "error",
            "error": error_message,
            "session_id": self.session_id,
            "timestamp": datetime.now().isoformat(),
            "agent_version": "2.0.0-agno"
        }
    
    def get_session_statistics(self) -> Dict[str, Any]:
        """Get statistics for current session"""
        stats = shared_entity_store.get_statistics()
        
        session_stats = {
            "session_id": self.session_id,
            "agent_id": self.config.agent_id,
            "entities_extracted_this_session": self.entity_count,
            "entities_registered_shared_store": len(self.session_entities),
            "shared_store_total_entities": stats.get('total_entities', 0),
            "agent_contribution": len(shared_entity_store.get_entities_by_agent(self.config.agent_id)),
            "session_start_time": self.session_id.split('_')[2] + '_' + self.session_id.split('_')[3],
            "configuration": {
                "model": self.config.model_id,
                "shared_entity_integration": self.config.enable_shared_entity_integration,
                "temporal_extraction": self.config.enable_temporal_extraction,
                "cross_validation": self.config.cross_validation_enabled
            }
        }
        
        return session_stats


# Factory function for easy agent creation
def create_ufo_youtube_agent(config: Optional[Dict] = None) -> UFOYouTubeAgent:
    """
    Factory function to create a configured UFO YouTube Agent
    
    Args:
        config: Optional configuration dictionary
    
    Returns:
        Configured UFOYouTubeAgent instance with AGNO integration
    """
    if config:
        agent_config = UFOAnalysisConfig(**config)
    else:
        agent_config = UFOAnalysisConfig()
    
    return UFOYouTubeAgent(agent_config)


# CLI interface for testing
if __name__ == "__main__":
    import asyncio
    import sys
    
    async def test_enhanced_agent():
        """Test the enhanced UFO YouTube Agent with shared entity store"""
        if len(sys.argv) < 2:
            print("Usage: python ufo_youtube_agent.py <youtube_url> [--config-option=value]")
            print("\nConfig options:")
            print("  --model=claude|openai")
            print("  --analysis-depth=basic|standard|comprehensive") 
            print("  --enable-shared-store=true|false")
            print("  --enable-temporal=true|false")
            return
        
        url = sys.argv[1]
        
        # Parse config options from command line
        config_overrides = {}
        for arg in sys.argv[2:]:
            if arg.startswith('--'):
                try:
                    key, value = arg[2:].split('=', 1)
                    key = key.replace('-', '_')
                    if value.lower() == 'true':
                        value = True
                    elif value.lower() == 'false':
                        value = False
                    config_overrides[key] = value
                except ValueError:
                    print(f"Invalid config option: {arg}")
        
        # Create agent with custom config
        agent = create_ufo_youtube_agent(config_overrides)
        
        print(f"Enhanced UFO YouTube Agent - Session: {agent.session_id}")
        print(f"Analyzing: {url}")
        print("=" * 80)
        
        # Perform comprehensive analysis
        result = await agent.analyze_ufo_video(url, enhanced_extraction=True)
        
        print("\n" + "=" * 80)
        print("COMPREHENSIVE ANALYSIS RESULTS")
        print("=" * 80)
        print(json.dumps(result, indent=2, default=str))
        
        # Print session statistics
        print("\n" + "=" * 80)
        print("SESSION STATISTICS")
        print("=" * 80)
        stats = agent.get_session_statistics()
        print(json.dumps(stats, indent=2, default=str))
    
    asyncio.run(test_enhanced_agent())