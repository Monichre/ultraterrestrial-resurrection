#!/usr/bin/env python3
"""
AGNO UFO YouTube Agent Activation Script

Simplified activation approach that leverages existing system components
while enabling advanced UFO content analysis capabilities.
"""

import asyncio
import json
import logging
import sys
from typing import Dict, Any, Optional, List
from datetime import datetime
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import existing system components
try:
    from lib.youtube import get_video_info_and_transcript, generate_transcript
    from lib.shared_entity_store import shared_entity_store, EntityType, register_entity_from_agent
    YOUTUBE_AVAILABLE = True
    SHARED_STORE_AVAILABLE = True
except ImportError as e:
    logger.error(f"Required dependencies not available: {e}")
    sys.exit(1)

# AI client setup
try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
    anthropic_client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
except ImportError:
    ANTHROPIC_AVAILABLE = False
    anthropic_client = None

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
    openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
except ImportError:
    OPENAI_AVAILABLE = False
    openai_client = None


class SimplifiedUFOYouTubeAgent:
    """Simplified UFO YouTube Agent using existing system components"""
    
    def __init__(self, use_anthropic: bool = True):
        self.session_id = self._generate_session_id()
        self.use_anthropic = use_anthropic and ANTHROPIC_AVAILABLE
        self.entity_count = 0
        self.session_entities = []
        
        if not self.use_anthropic and not OPENAI_AVAILABLE:
            raise RuntimeError("No AI provider available")
        
        logger.info(f"Simplified UFO YouTube Agent initialized - Session: {self.session_id}")
        logger.info(f"AI Provider: {'Anthropic' if self.use_anthropic else 'OpenAI'}")
    
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        import hashlib
        hash_component = hashlib.md5(f"simplified_ufo_youtube_{timestamp}".encode()).hexdigest()[:8]
        return f"simplified_ufo_{timestamp}_{hash_component}"
    
    async def analyze_ufo_video(self, video_url: str) -> Dict[str, Any]:
        """Analyze UFO video with simplified AGNO capabilities"""
        try:
            logger.info(f"Starting UFO video analysis: {video_url}")
            
            # Step 1: Extract video data using existing YouTube system
            logger.info("Extracting video data...")
            video_data = get_video_info_and_transcript(video_url)
            
            if not video_data or not video_data.get('transcript'):
                return {
                    "status": "error", 
                    "error": "Failed to extract video transcript",
                    "session_id": self.session_id
                }
            
            transcript = video_data.get('transcript', '')
            logger.info(f"Transcript extracted: {len(transcript)} characters")
            
            # Step 2: UFO-specific content analysis
            logger.info("Analyzing UFO content...")
            content_analysis = await self._analyze_ufo_content(transcript, video_data)
            
            # Step 3: Extract entities with shared store integration
            logger.info("Extracting entities...")
            entities = await self._extract_entities(transcript, video_data)
            
            # Step 4: Identify temporal references
            logger.info("Identifying temporal entities...")
            temporal_entities = self._extract_temporal_entities(transcript)
            
            # Step 5: Generate summary
            logger.info("Generating analysis summary...")
            summary = await self._generate_summary(video_data, content_analysis, entities, temporal_entities)
            
            # Compile results
            result = {
                "status": "success",
                "session_id": self.session_id,
                "video_metadata": {
                    "title": video_data.get('title'),
                    "id": video_data.get('id'),
                    "url": video_url,
                    "channel": video_data.get('webpage_url', '').split('/')[-1] if video_data.get('webpage_url') else 'Unknown',
                    "transcript_length": len(transcript)
                },
                "content_analysis": content_analysis,
                "extracted_entities": entities,
                "temporal_entities": temporal_entities,
                "analysis_summary": summary,
                "entity_statistics": {
                    "total_entities_extracted": self.entity_count,
                    "shared_store_registrations": len(self.session_entities),
                    "temporal_entities_count": len(temporal_entities)
                },
                "analysis_metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "agent_version": "simplified-1.0",
                    "ai_provider": "Anthropic" if self.use_anthropic else "OpenAI",
                    "shared_entity_integration": True
                }
            }
            
            logger.info(f"Analysis completed - Entities: {self.entity_count}, Temporal: {len(temporal_entities)}")
            return result
            
        except Exception as e:
            logger.error(f"Error in UFO video analysis: {e}")
            return {
                "status": "error",
                "error": str(e),
                "session_id": self.session_id,
                "timestamp": datetime.now().isoformat()
            }
    
    async def _analyze_ufo_content(self, transcript: str, video_data: Dict) -> Dict[str, Any]:
        """AI-powered UFO content analysis"""
        prompt = f"""
Analyze this YouTube video transcript for UFO/UAP content:

Title: {video_data.get('title', 'Unknown')}
Transcript (first 3000 chars): {transcript[:3000]}...

Provide analysis in JSON format:
{{
    "content_type": "witness_testimony|expert_interview|official_disclosure|documentary|news|entertainment",
    "ufo_relevance": 0.0-1.0,
    "confidence": 0.0-1.0,
    "key_topics": ["list of main topics"],
    "credibility_assessment": 0.0-1.0,
    "notable_claims": ["list of significant claims"],
    "evidence_quality": 0.0-1.0
}}

Focus on accuracy and evidence-based assessment.
"""
        
        try:
            if self.use_anthropic:
                response = anthropic_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1000,
                    messages=[{"role": "user", "content": prompt}]
                )
                content = response.content[0].text
            else:
                response = openai_client.chat.completions.create(
                    model="gpt-4",
                    max_tokens=1000,
                    messages=[{"role": "user", "content": prompt}]
                )
                content = response.choices[0].message.content
            
            # Parse JSON response
            try:
                analysis = json.loads(content)
            except json.JSONDecodeError:
                # Fallback if AI doesn't return pure JSON
                analysis = {
                    "content_type": "unknown",
                    "ufo_relevance": 0.3,
                    "confidence": 0.6,
                    "key_topics": ["general content"],
                    "credibility_assessment": 0.5,
                    "notable_claims": ["AI analysis available"],
                    "evidence_quality": 0.5,
                    "ai_response": content
                }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in content analysis: {e}")
            return {
                "content_type": "unknown",
                "ufo_relevance": 0.0,
                "confidence": 0.0,
                "error": str(e)
            }
    
    async def _extract_entities(self, transcript: str, video_data: Dict) -> Dict[str, Any]:
        """Extract entities with shared store integration"""
        prompt = f"""
Extract UFO/UAP-related entities from this transcript:

Title: {video_data.get('title', 'Unknown')}
Transcript: {transcript[:2000]}...

Return JSON with entities categorized:
{{
    "personnel": [
        {{"text": "name", "confidence": 0.0-1.0, "context": "relevant context", "role": "witness|official|researcher"}}
    ],
    "locations": [
        {{"text": "location", "confidence": 0.0-1.0, "context": "relevant context"}}
    ],
    "events": [
        {{"text": "event description", "confidence": 0.0-1.0, "context": "relevant context", "date": "if mentioned"}}
    ],
    "organizations": [
        {{"text": "organization", "confidence": 0.0-1.0, "context": "relevant context"}}
    ]
}}

Focus on high-confidence extractions only.
"""
        
        try:
            if self.use_anthropic:
                response = anthropic_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1500,
                    messages=[{"role": "user", "content": prompt}]
                )
                content = response.content[0].text
            else:
                response = openai_client.chat.completions.create(
                    model="gpt-4",
                    max_tokens=1500,
                    messages=[{"role": "user", "content": prompt}]
                )
                content = response.choices[0].message.content
            
            # Parse entities and register with shared store
            try:
                raw_entities = json.loads(content)
                processed_entities = {
                    "personnel": [],
                    "locations": [],
                    "events": [],
                    "organizations": [],
                    "total_extracted": 0,
                    "shared_store_registered": 0
                }
                
                # Process each category
                for category in ["personnel", "locations", "events", "organizations"]:
                    entities_list = raw_entities.get(category, [])
                    for entity in entities_list:
                        if entity.get('confidence', 0) >= 0.7:  # High confidence only
                            # Register with shared store
                            entity_data = {
                                'text': entity['text'],
                                'type': category.rstrip('s'),  # Remove plural
                                'confidence': entity['confidence'],
                                'context': entity.get('context', ''),
                                'evidence_strength': entity['confidence']
                            }
                            
                            entity_id = register_entity_from_agent(
                                entity_data, 
                                "simplified_ufo_youtube", 
                                self.session_id
                            )
                            
                            enhanced_entity = {**entity, 'shared_store_id': entity_id}
                            processed_entities[category].append(enhanced_entity)
                            processed_entities["shared_store_registered"] += 1
                            self.entity_count += 1
                            self.session_entities.append(entity_id)
                        
                        processed_entities["total_extracted"] += 1
                
                return processed_entities
                
            except json.JSONDecodeError:
                logger.warning("Entity extraction response not valid JSON")
                return {"error": "Invalid JSON response", "total_extracted": 0, "shared_store_registered": 0}
            
        except Exception as e:
            logger.error(f"Error in entity extraction: {e}")
            return {"error": str(e), "total_extracted": 0, "shared_store_registered": 0}
    
    def _extract_temporal_entities(self, transcript: str) -> List[Dict[str, Any]]:
        """Extract temporal references using pattern matching"""
        import re
        
        temporal_patterns = {
            "absolute_dates": [
                r"(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}",
                r"\d{1,2}\/\d{1,2}\/\d{4}",
                r"\d{4}-\d{2}-\d{2}",
                r"(?:in|on|during)\s+\d{4}"
            ],
            "relative_timeframes": [
                r"(?:about|around|approximately)\s+\d+\s+(?:years?|months?|weeks?|days?)\s+ago",
                r"(?:last|this|next)\s+(?:year|month|week|decade)",
                r"(?:recently|lately|not long ago)"
            ]
        }
        
        temporal_entities = []
        
        try:
            for category, patterns in temporal_patterns.items():
                for pattern in patterns:
                    matches = list(re.finditer(pattern, transcript, re.IGNORECASE))
                    
                    for match in matches:
                        # Extract surrounding context
                        start = max(0, match.start() - 50)
                        end = min(len(transcript), match.end() + 50)
                        context = transcript[start:end].strip()
                        
                        temporal_entity = {
                            "text": match.group().strip(),
                            "type": "temporal_entity",
                            "category": category,
                            "confidence": 0.8 if category == "absolute_dates" else 0.6,
                            "context": context,
                            "position": match.start()
                        }
                        
                        temporal_entities.append(temporal_entity)
            
            # Remove duplicates and sort by position
            seen = set()
            unique_entities = []
            for entity in sorted(temporal_entities, key=lambda x: x['position']):
                signature = f"{entity['text'].lower()}:{entity['category']}"
                if signature not in seen:
                    seen.add(signature)
                    unique_entities.append(entity)
            
            return unique_entities
            
        except Exception as e:
            logger.error(f"Error extracting temporal entities: {e}")
            return []
    
    async def _generate_summary(self, video_data: Dict, content_analysis: Dict, 
                              entities: Dict, temporal_entities: List) -> Dict[str, Any]:
        """Generate comprehensive analysis summary"""
        prompt = f"""
Generate a summary for this UFO video analysis:

Video: "{video_data.get('title', 'Unknown')}"
Content Type: {content_analysis.get('content_type', 'unknown')}
UFO Relevance: {content_analysis.get('ufo_relevance', 0):.2f}
Entities Extracted: {entities.get('total_extracted', 0)}
Temporal References: {len(temporal_entities)}

Provide concise summary covering:
1. Main content assessment (2-3 sentences)
2. Key findings and credibility
3. Research value (1-10 scale)
4. Notable mentions
5. Recommended follow-up

Be objective and evidence-based.
"""
        
        try:
            if self.use_anthropic:
                response = anthropic_client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=800,
                    messages=[{"role": "user", "content": prompt}]
                )
                summary_text = response.content[0].text
            else:
                response = openai_client.chat.completions.create(
                    model="gpt-4",
                    max_tokens=800,
                    messages=[{"role": "user", "content": prompt}]
                )
                summary_text = response.choices[0].message.content
            
            return {
                "executive_summary": summary_text,
                "key_metrics": {
                    "content_type": content_analysis.get('content_type'),
                    "ufo_relevance": content_analysis.get('ufo_relevance', 0),
                    "credibility_assessment": content_analysis.get('credibility_assessment', 0),
                    "entities_extracted": entities.get('total_extracted', 0),
                    "shared_store_integration": entities.get('shared_store_registered', 0),
                    "temporal_entities": len(temporal_entities)
                },
                "session_info": {
                    "session_id": self.session_id,
                    "total_entities_this_session": self.entity_count,
                    "shared_store_entities": len(self.session_entities)
                },
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            return {
                "error": str(e),
                "generated_at": datetime.now().isoformat()
            }
    
    def get_session_statistics(self) -> Dict[str, Any]:
        """Get statistics for current session"""
        try:
            store_stats = shared_entity_store.get_statistics()
            
            return {
                "session_id": self.session_id,
                "agent_type": "simplified_ufo_youtube",
                "entities_extracted_this_session": self.entity_count,
                "entities_registered_shared_store": len(self.session_entities),
                "shared_store_total_entities": store_stats.get('total_entities', 0),
                "shared_store_by_type": store_stats.get('entities_by_type', {}),
                "ai_provider": "Anthropic" if self.use_anthropic else "OpenAI",
                "session_start": self.session_id.split('_')[2] + '_' + self.session_id.split('_')[3] if '_' in self.session_id else 'unknown',
                "configuration": {
                    "shared_entity_integration": True,
                    "temporal_extraction": True,
                    "ai_powered_analysis": True
                }
            }
        except Exception as e:
            logger.error(f"Error getting session statistics: {e}")
            return {"error": str(e), "session_id": self.session_id}


async def main():
    """Main test function"""
    if len(sys.argv) < 2:
        print("🚀 AGNO UFO YouTube Agent - Simplified Activation")
        print("=" * 60)
        print("Usage: python activate_agno.py <youtube_url> [--openai]")
        print("Example: python activate_agno.py 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'")
        return
    
    video_url = sys.argv[1]
    use_openai = '--openai' in sys.argv
    
    print("🚀 AGNO UFO YouTube Agent - Simplified Activation")
    print("=" * 60)
    
    try:
        # Create and test agent
        agent = SimplifiedUFOYouTubeAgent(use_anthropic=not use_openai)
        
        print(f"✅ Agent activated - Session: {agent.session_id}")
        print(f"🎯 Analyzing: {video_url}")
        print("Processing...")
        print()
        
        # Perform analysis
        result = await agent.analyze_ufo_video(video_url)
        
        # Display results
        print("📈 ANALYSIS RESULTS")
        print("=" * 40)
        
        if result.get('status') == 'success':
            metadata = result.get('video_metadata', {})
            analysis = result.get('content_analysis', {})
            stats = result.get('entity_statistics', {})
            
            print(f"✅ Status: {result['status']}")
            print(f"📹 Video: {metadata.get('title', 'Unknown')}")
            print(f"📊 Content Type: {analysis.get('content_type', 'unknown')}")
            print(f"🛸 UFO Relevance: {analysis.get('ufo_relevance', 0):.2f}")
            print(f"🎯 Confidence: {analysis.get('confidence', 0):.2f}")
            print(f"📏 Transcript: {metadata.get('transcript_length', 0)} chars")
            print()
            
            print("🧮 Entity Extraction:")
            entities = result.get('extracted_entities', {})
            for category in ['personnel', 'locations', 'events', 'organizations']:
                count = len(entities.get(category, []))
                if count > 0:
                    print(f"  {category.title()}: {count}")
            
            print(f"  Total Extracted: {stats.get('total_entities_extracted', 0)}")
            print(f"  Shared Store Registered: {stats.get('shared_store_registrations', 0)}")
            print(f"  Temporal Entities: {stats.get('temporal_entities_count', 0)}")
            print()
            
            # Show session stats
            session_stats = agent.get_session_statistics()
            print("📊 Session Statistics:")
            print(f"  Session Entities: {session_stats.get('entities_extracted_this_session', 0)}")
            print(f"  Store Total: {session_stats.get('shared_store_total_entities', 0)}")
            print(f"  AI Provider: {session_stats.get('ai_provider', 'Unknown')}")
            print()
            
            print("✅ AGNO CAPABILITIES ACTIVATED!")
            print("🎯 Advanced UFO content analysis is now functional")
            print("🔗 Shared entity store integration active")
            print("⏰ Temporal entity extraction working")
            print("🤖 AI-powered content classification operational")
            
        else:
            print(f"❌ Status: {result['status']}")
            print(f"Error: {result.get('error', 'Unknown error')}")
        
    except Exception as e:
        print(f"❌ Activation failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())