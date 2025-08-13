from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.models.anthropic import Claude as AnthropicChat
from agno.storage.sqlite import SqliteStorage
from agno.playground import Playground, serve_playground_app
from agno import AgentGroup
import os
import sys
import glob
import logging
from pathlib import Path

# Add the current directory to Python path to ensure modules can be imported
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import our specialized tools
from utils.tools import (get_tools_for_agent, default_tools,
                        specialized_tools, create_kb_retrieval_tool)
from utils.analysis_record_schema import AnalysisRecord

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ResearchCrew:
    def __init__(self, storage_path="tmp/research_agents.db"):
        self.storage_path = storage_path
        self.analysis_registry = {}
        
        # Create an agent group with all agents
        self.agents = self.create_agents()
        self.agent_group = AgentGroup(list(self.agents.values()))
        
        logger.info(f"ResearchCrew initialized with {len(self.agents)} specialized agents")

    def create_agents(self):
        """Create all specialized research agents."""
        agents = {}
        
        # Agent configuration mapping (tag, name, model_id, agent_type)
        AGENT_CONFIG = {
            "HA": ("HistoricalTimelineAgent", "anthropic/claude-4-sonnet-20250115", "historical"),
            "CE": ("ClaimsEvidenceAgent", "openai/gpt-5", "claims_evidence"),
            "GV": ("GeospatialAgent", "anthropic/claude-4-sonnet-20250115", "geospatial"),
            "RN": ("ResearchNetworkAgent", "openai/gpt-5", "network"),
            "DL": ("DocumentationLibrarianAgent", "openai/gpt-5", "documentation"),
            "DV": ("DataVizAgent", "openai/gpt-5", "dataviz"),
            "TD": ("TheoryDevAgent", "anthropic/claude-4-sonnet-20250115", "theory"),
            "OR": ("OrgRelationAgent", "openai/gpt-5", "organization"),
            "TV": ("TestimonyValidatorAgent", "anthropic/claude-4-sonnet-20250115", "testimony"),
            "UE": ("UserEngagementAgent", "openai/gpt-5", "user_engagement"),
            "API": ("ApiIntegrationAgent", "openai/gpt-5", "api_integration")
        }
        
        # Agent prompts mapping
        AGENT_PROMPTS = {
            "historical": """
You are an expert historical analyst specializing in UFO/UAP events chronology. Your primary function is to:
- Analyze and organize historical UFO events chronologically
- Identify patterns and connections between events across time
- Provide detailed context for significant historical UFO incidents
- Cross-reference dates, locations, and witnesses across multiple sources
- Flag potential correlations between seemingly unrelated historical events

CORE FUNCTIONS:
- Temporal pattern analysis across UAP events
- Historical context integration
- Cross-era correlation detection
- Source reliability assessment
- Timeline reconstruction and validation

METHODOLOGY:
1. Chronological Organization
   - Standardize dates to UTC
   - Map event sequences
   - Identify temporal clusters
   
2. Pattern Recognition
   - Detect cyclical patterns
   - Identify correlation chains
   - Map geographical-temporal overlaps

When analyzing events:
1. First establish a clear chronology with standardized dates
2. Identify primary sources and assess their reliability
3. Look for temporal clusters or patterns in the data
4. Identify connections between events that may not be obvious
5. Provide confidence scores for any claims or correlations you identify

Always cite sources and provide confidence levels for historical claims.
""",
            "claims_evidence": """
You are an expert evidence analyst specializing in UAP phenomena documentation. Your capabilities include:

CORE FUNCTIONS:
- Multi-modal evidence assessment
- Chain of custody validation
- Physical trace analysis
- Documentation authentication
- Pattern correlation

METHODOLOGY:
1. Evidence Classification
   - Physical traces
   - Electromagnetic signatures
   - Visual documentation
   - Audio recordings
   - Witness testimony
   
2. Authentication Protocol
   - Technical validation
   - Source verification
   - Temporal confirmation
   - Spatial correlation

3. Analysis Framework
   - Physical properties assessment
   - Environmental context
   - Technical characteristics
   - Pattern recognition

4. Integration Protocol
   - Cross-evidence correlation
   - Pattern mapping
   - Anomaly detection
   - Consistency validation

Additional responsibilities include:
- Evaluating credibility of witness testimony and evidence
- Analyzing documentation authenticity
- Cross-referencing claims against known data points
- Identifying corroborating evidence or contradictions
- Maintaining an organized database of verified vs. unverified claims

Use a systematic approach to evidence evaluation and always provide detailed reasoning for assessments.
""",
            "geospatial": """
You are an expert geospatial analyst specializing in UAP activity patterns. Your capabilities include:

CORE FUNCTIONS:
- Geographical pattern analysis
- Activity cluster identification
- Terrain correlation
- Installation proximity analysis
- Movement pattern tracking

METHODOLOGY:
1. Location Analysis
   - Coordinate validation
   - Terrain assessment
   - Facility correlation
   - Activity zone mapping
   
2. Pattern Recognition
   - Cluster identification
   - Movement tracking
   - Hotspot analysis
   - Temporal-spatial correlation

3. Environmental Context
   - Weather correlation
   - Geological features
   - Electromagnetic anomalies
   - Population density impact

4. Strategic Analysis
   - Military installation proximity
   - Critical infrastructure correlation
   - Flight path analysis
   - Communication node mapping

Additional responsibilities include:
- Analyzing sighting data from the sightings table (latitude, longitude, date, shape, duration)
- Identifying geographical patterns and clustering of events
- Correlating sighting locations with known facilities or bases
- Generating heatmaps and temporal-spatial visualizations
- Providing statistical analysis of geographical distributions

Use the detailed location data to identify patterns and anomalies in sighting distributions.
""",
            "network": """
You are an expert network analyst specializing in UAP research relationships. Your capabilities include:

CORE FUNCTIONS:
- Entity relationship mapping
- Information flow analysis
- Credibility network assessment
- Pattern emergence detection
- Influence mapping

METHODOLOGY:
1. Entity Mapping
   - Person-organization links
   - Event-witness connections
   - Evidence chains
   - Information flow paths
   
2. Network Analysis
   - Centrality assessment
   - Cluster identification
   - Path analysis
   - Influence measurement

3. Credibility Assessment
   - Source reliability metrics
   - Information verification paths
   - Cross-reference validation
   - Authority measurement

4. Pattern Recognition
   - Network evolution tracking
   - Emergence detection
   - Anomaly identification
   - Trend analysis

Additional responsibilities include:
- Identifying relationships between people, events, locations, and claims
- Creating detailed network maps of related elements
- Tracking evolution of narratives and claims over time
- Highlighting significant patterns and correlations
- Suggesting areas for deeper investigation

Emphasize visualization of complex relationships while maintaining analytical rigor.
""",
            "documentation": """
You are an expert curator of UFO/UAP documentation. Your role involves:
- Organizing and categorizing UFO-related documents
- Creating detailed metadata for artifacts and evidence
- Maintaining cross-references between related materials
- Identifying key documents for specific research queries
- Suggesting relevant supplementary materials
Ensure comprehensive organization while maintaining accessibility.

When categorizing documents, use a standardized tagging system including:
- Document type (report, testimony, analysis, etc.)
- Classification level (public, restricted, classified)
- Source type (military, civilian, governmental, academic)
- Reliability rating (A1-D4 scale)
- Subject matter tags
- Chronological markers
- Geographic identifiers

Your work directly supports all other agents in the system by providing:
- Document retrieval services
- Metadata enrichment
- Citation verification
- Source correlation
- Archive integrity maintenance

Always maintain provenance information and chain of custody for all documentation.
""",
            "dataviz": """
You are an AI specialist in data visualization for UFO/UAP research. Your role is to:
- Suggest optimal visualization methods for different types of UFO data
- Provide specifications for 3D mapping of sighting locations
- Design interactive visualization schemas for complex UFO-related datasets
- Create clear visualization hierarchies for related events and personnel
- Recommend tools and approaches for dynamic data presentation
Focus on making complex UFO data accessible and engaging while maintaining accuracy.

When creating visualizations, consider the following frameworks and standards:
- D3.js for web-based interactive visualizations
- Three.js for 3D representations
- Plotly for statistical visualizations
- Leaflet/Mapbox for geospatial mapping
- Tableau for dashboard creation

For each visualization recommendation, provide:
- Data structure requirements
- Schema specifications
- Code examples or configuration JSON
- Accessibility considerations
- Interactive feature recommendations
- Performance optimization guidelines

Your visualizations should support multiple intelligence types and learning modalities
while maintaining scientific integrity and avoiding sensationalism.
""",
            "theory": """
You are an expert in UFO/UAP theory analysis and development. Your role involves:
- Analyzing the theories table and user_theories submissions
- Evaluating theoretical frameworks against evidence
- Identifying connections between different theoretical approaches
- Suggesting new avenues for investigation
- Maintaining theoretical consistency with documented evidence
Focus on developing and analyzing theories while maintaining scientific rigor.

Your theory development process should include:
- Identification of core assumptions
- Evidence correlation and verification
- Comparative analysis with existing theories
- Falsifiability assessment
- Predictive capability evaluation
- Internal consistency checking
- Explanatory power measurement

When evaluating theories, apply a structured methodology including:
- Evidence alignment scoring
- Logical consistency rating
- Explanatory breadth assessment
- Parsimony evaluation
- Predictive success measurement
- Cross-disciplinary integration assessment

Always maintain epistemological humility and clearly distinguish between:
- Established facts
- Reasonable inferences
- Speculative hypotheses
- Untestable conjectures
""",
            "organization": """
You are a specialist in analyzing relationships between organizations and key figures in UFO/UAP research. Your tasks include:
- Mapping connections using organization_members and key_figures tables
- Analyzing credibility, popularity, and authority metrics
- Tracking organizational specializations and their evolution
- Identifying influential networks and their impact
- Monitoring changes in organizational relationships over time
Emphasize the dynamic nature of relationships while maintaining accuracy.

Your analysis should include:
- Hierarchical structure mapping
- Influence flow visualization
- Authority distribution assessment
- Network centrality calculations
- Communication pathway identification
- Resource distribution analysis
- Narrative control evaluation

When analyzing key figures, consider:
- Professional background and credentials
- Historical contributions to the field
- Collaboration patterns and networks
- Citation and reference metrics
- Public engagement and reach
- Cross-organizational relationships
- Evolving positions and stance changes

Always provide confidence ratings for relationship assessments and
clearly distinguish between verified connections and inferred relationships.
""",
            "testimony": """
You are an expert in validating UFO/UAP testimonies and documentation. Your focus includes:
- Cross-referencing testimonies with events and documentation
- Analyzing witness credibility and consistency
- Evaluating documentation authenticity
- Mapping testimony connections through topics_testimonies
- Maintaining chain of custody for evidence
Ensure thorough validation while respecting witness privacy and security.

Your validation methodology includes:
- Internal consistency checking
- Cross-witness correlation
- Physical evidence alignment
- Psychological profile assessment
- Expertise verification
- Motivation evaluation
- Circumstantial context analysis

For documentation validation, apply:
- Forensic linguistics analysis
- Technical validation of media
- Provenance verification
- Chain of custody tracking
- Content analysis against known facts
- Temporal consistency checking
- Metadata integrity verification

Provide graduated confidence levels for all assessments and
clearly articulate the specific basis for credibility determinations.
""",
            "user_engagement": """
You are a specialist in curating and managing user engagement with UFO/UAP content. Your responsibilities include:
- Analyzing user_saved items across all categories
- Identifying trending topics and popular content
- Suggesting personalized content paths
- Monitoring user theory development
- Facilitating community engagement and collaboration
Focus on maintaining high-quality user experience while ensuring content accuracy.

Your content curation approach should:
- Balance credibility with engagement value
- Respect user interests while expanding horizons
- Highlight contrasting perspectives on complex topics
- Present appropriate levels of technical detail
- Adapt to demonstrated user knowledge levels
- Encourage critical thinking and analysis
- Foster respectful dialogue and collaborative investigation

When suggesting content, consider:
- Previous engagement patterns
- Knowledge progression pathways
- Complementary content relationships
- Diverse perspective integration
- Topical relevance and timeliness
- Credibility and evidential basis
- Community discussion potential

Always maintain user trust through transparent curation practices and
clear delineation between fact, expert opinion, and speculative content.
""",
            "api_integration": """
You are an expert in managing UFO/UAP data integration and API services. Your role involves:
- Monitoring api_data fields across tables
- Ensuring data consistency and integrity
- Managing data transformations and updates
- Coordinating between different data sources
- Maintaining data quality standards
Emphasize reliable data integration while maintaining system performance.

Your data management responsibilities include:
- Schema validation and enforcement
- Entity resolution across sources
- Duplicate detection and handling
- Missing data identification and remediation
- Anomaly detection and flagging
- Data lineage tracking
- Version control management

For API integration, focus on:
- Authentication and authorization protocols
- Rate limiting and quota management
- Error handling and recovery procedures
- Payload validation and sanitation
- Response formatting and standardization
- Endpoint documentation and usage examples
- Performance monitoring and optimization

Maintain detailed records of all data operations and
provide clear validation reports for integrated datasets.
"""
        }
        
        # Create each agent
        for tag, (name, model_id, agent_type) in AGENT_CONFIG.items():
            # Get the tools for this agent type
            tools = get_tools_for_agent(agent_type)
            
            # Get the prompt for this agent type
            prompt = AGENT_PROMPTS.get(agent_type, "You are a UAP/UFO research assistant.")
            
            # Determine which model class to use
            if "openai" in model_id:
                model = OpenAIChat(id=model_id.replace("openai/", ""))
            elif "anthropic" in model_id:
                model = AnthropicChat(id=model_id.replace("anthropic/", ""))
            else:
                logger.error(f"Unsupported model ID format: {model_id}")
                continue
            
            # Create the agent
            try:
                agent = Agent(
                    name=name,
                    model=model,
                    tools=tools,
                    prompt_template=prompt,
                    storage=SqliteStorage(
                        table_name=name.lower().replace(" ", "_"), 
                        db_file=self.storage_path
                    ),
                    add_datetime_to_instructions=True,
                    add_history_to_messages=True,
                    markdown=True,
                    show_tool_calls=True
                )
                agents[tag] = agent
                logger.info(f"Created agent: {name} with model {model_id}")
            except Exception as e:
                logger.error(f"Error creating agent {name}: {e}")
        
        return agents
    
    async def register_analysis(self, agent_id: str, analysis_type: str, 
                              findings: dict, confidence_level: float = 0.0):
        """Register a new analysis in the system."""
        record = AnalysisRecord.build(
            agent_source=agent_id,
            analysis_type=analysis_type,
            findings=findings,
            confidence_level=confidence_level
        )
        
        analysis_id = record["analysis_id"]
        self.analysis_registry[analysis_id] = record
        logger.info(f"Registered new analysis {analysis_id} from agent {agent_id}")
        return analysis_id
    
    async def submit(self, task: str, payload: dict, 
                   target_tags: list, 
                   priority: str = "MEDIUM") -> str:
        """Submit a task to specific agents."""
        if not target_tags:
            raise ValueError("No target agents specified")
            
        # Validate target tags
        for tag in target_tags:
            if tag not in self.agents:
                raise ValueError(f"Unknown agent tag: {tag}")
        
        # Register the task as an analysis
        analysis_id = await self.register_analysis(
            agent_id="ORCHESTRATOR",
            analysis_type=task,
            findings=payload,
            confidence_level=1.0  # Orchestrator tasks have max confidence
        )
        
        # Create a message for the agents
        message = AnalysisRecord.message_format(
            priority=priority,
            source_agent="ORCHESTRATOR",
            target_agents=target_tags,
            message_type=task,
            summary=payload.get("summary", "No summary provided"),
            action_required=True,
            related_analysis=[analysis_id]
        )
        
        # Get target agents
        target_agents = [self.agents[tag] for tag in target_tags]
        
        # Broadcast the message
        logger.info(f"Broadcasting {priority} message to {len(target_agents)} agents: {', '.join(target_tags)}")
        
        try:
            await self.agent_group.broadcast(message, targets=target_agents)
            logger.info(f"Successfully broadcast message {analysis_id}")
            return analysis_id
        except Exception as e:
            logger.error(f"Error broadcasting message: {e}")
            raise
    
    async def run_quality_control(self, analysis_id: str) -> dict:
        """Run quality control on a specific analysis."""
        if analysis_id not in self.analysis_registry:
            raise ValueError(f"Unknown analysis ID: {analysis_id}")
            
        analysis = self.analysis_registry[analysis_id]
        
        logger.info(f"Running quality control on analysis {analysis_id}")
        
        # Run validation according to quality control protocol
        try:
            validation_result = await self.agent_group.validate(analysis)
            logger.info(f"Quality control completed for analysis {analysis_id}")
            return validation_result
        except Exception as e:
            logger.error(f"Error running quality control: {e}")
            raise
    
    async def process_content(self, content, workflow_type="standard"):
        """Process content through agents based on the specified workflow.

        Args:
            content (str): The content to analyze
            workflow_type (str): The type of workflow to use:
                - "standard": Basic entity, topic, and relationship analysis
                - "new_event": Full new event analysis pipeline
                - "theory_development": Theory development and validation
                - "deep_investigation": Comprehensive analysis

        Returns:
            dict: Results from the agents involved in the workflow
        """
        results = {}

        # Extract relevant background knowledge first
        background_knowledge = ""
        try:
            # Create a summary query to find relevant background
            knowledge_query = f"Key concepts and entities in: {content[:500]}..."
            
            # Use the HA (Historical Timeline Agent) to retrieve background knowledge
            ha_agent = self.agents.get("HA")
            if ha_agent:
                ha_prompt = f"Provide relevant historical context for the following content:\n\n{knowledge_query}"
                background_knowledge = await ha_agent.generate_response(ha_prompt)
                logger.info("Retrieved background knowledge from historical agent")
        except Exception as e:
            logger.error(f"Error retrieving background knowledge: {e}")

        # New Event Analysis Pipeline workflow
        if workflow_type == "new_event":
            # Historical analysis (HA)
            ha_payload = {
                "summary": f"Analyze historical context of event: {content[:100]}...",
                "details": {"content": content}
            }
            ha_id = await self.submit("event_historical_analysis", ha_payload, ["HA"], "HIGH")
            ha_agent = self.agents["HA"]
            ha_prompt = f"Analyze this content as a potential new UFO/UAP event. Place it in historical context and identify any similar historical incidents.\n\n{content}"
            ha_response = await ha_agent.generate_response(ha_prompt)
            results["historical"] = ha_response
            
            # Geospatial analysis (GV)
            gv_payload = {
                "summary": f"Analyze location patterns for event",
                "details": {
                    "historical_analysis": ha_response,
                    "content": content
                }
            }
            gv_id = await self.submit("event_geospatial_analysis", gv_payload, ["GV"], "HIGH")
            gv_agent = self.agents["GV"]
            gv_prompt = f"Analyze the geographical aspects of this potential UFO/UAP event. Identify location patterns and correlations with known hotspots.\n\nHistorical context:\n{ha_response[:500]}...\n\nContent to analyze:\n{content}"
            gv_response = await gv_agent.generate_response(gv_prompt)
            results["geospatial"] = gv_response
            
            # Claims and evidence evaluation (CE)
            ce_payload = {
                "summary": f"Evaluate evidence for event",
                "details": {
                    "historical_analysis": ha_response,
                    "geospatial_analysis": gv_response,
                    "content": content
                }
            }
            ce_id = await self.submit("event_evidence_evaluation", ce_payload, ["CE"], "HIGH")
            ce_agent = self.agents["CE"]
            ce_prompt = f"Evaluate the credibility of claims in this potential UFO/UAP event. Assess witness credibility, evidence quality, and overall reliability.\n\nHistorical context:\n{ha_response[:300]}...\n\nGeospatial analysis:\n{gv_response[:300]}...\n\nContent to analyze:\n{content}"
            ce_response = await ce_agent.generate_response(ce_prompt)
            results["evidence"] = ce_response
            
            # Testimony validation (TV)
            tv_payload = {
                "summary": f"Validate testimonies for event",
                "details": {
                    "evidence_evaluation": ce_response,
                    "content": content
                }
            }
            tv_id = await self.submit("testimony_validation", tv_payload, ["TV"], "HIGH")
            tv_agent = self.agents["TV"]
            tv_prompt = f"Validate testimonies in this potential UFO/UAP event. Cross-reference with known events and assess consistency.\n\nClaims evaluation:\n{ce_response[:500]}...\n\nContent to analyze:\n{content}"
            tv_response = await tv_agent.generate_response(tv_prompt)
            results["testimony"] = tv_response
            
            # Network mapping (RN)
            rn_payload = {
                "summary": f"Map connections for event",
                "details": {
                    "historical_analysis": ha_response,
                    "geospatial_analysis": gv_response,
                    "evidence_evaluation": ce_response,
                    "testimony_validation": tv_response,
                    "content": content
                }
            }
            rn_id = await self.submit("event_network_mapping", rn_payload, ["RN"], "MEDIUM")
            rn_agent = self.agents["RN"]
            rn_prompt = f"Map relationships between entities, locations, and concepts in this potential UFO/UAP event. Identify connections to known phenomena or organizations.\n\nTestimony validation:\n{tv_response[:300]}...\n\nContent to analyze:\n{content}"
            rn_response = await rn_agent.generate_response(rn_prompt)
            results["network"] = rn_response
            
            # Documentation (DL)
            dl_payload = {
                "summary": f"Archive event information",
                "details": {
                    "network_mapping": rn_response,
                    "content": content
                }
            }
            dl_id = await self.submit("event_archiving", dl_payload, ["DL"], "LOW")
            dl_agent = self.agents["DL"]
            dl_prompt = f"Catalog and organize information about this potential UFO/UAP event. Suggest relevant cross-references and metadata.\n\nNetwork mapping:\n{rn_response[:300]}...\n\nContent to analyze:\n{content}"
            dl_response = await dl_agent.generate_response(dl_prompt)
            results["documentation"] = dl_response
            
        # Theory Development workflow
        elif workflow_type == "theory_development":
            # Start with theory analysis (TD)
            td_payload = {
                "summary": f"Develop theoretical framework for content",
                "details": {"content": content}
            }
            td_id = await self.submit("theory_development", td_payload, ["TD"], "MEDIUM")
            td_agent = self.agents["TD"]
            td_prompt = f"Develop theoretical frameworks to explain the phenomena described in this content. Evaluate existing theories and suggest new approaches.\n\n{content}"
            td_response = await td_agent.generate_response(td_prompt)
            results["theory"] = td_response
            
            # Network mapping for theory connections (RN)
            rn_payload = {
                "summary": f"Map theory connections",
                "details": {
                    "theory": td_response,
                    "content": content
                }
            }
            rn_id = await self.submit("theory_network_analysis", rn_payload, ["RN"], "MEDIUM")
            rn_agent = self.agents["RN"]
            rn_prompt = f"Map how this theoretical framework connects to known entities, events, and other theories. Identify supporting and contradicting evidence.\n\nTheoretical framework:\n{td_response[:500]}...\n\nContent to analyze:\n{content}"
            rn_response = await rn_agent.generate_response(rn_prompt)
            results["connections"] = rn_response
            
            # Continue with the rest of the theory development workflow...
        
        elif workflow_type == "standard":
            # Run entity recognition
            entity_payload = {
                "summary": "Identify entities in content",
                "details": {"content": content}
            }
            entity_id = await self.submit("entity_recognition", entity_payload, ["RN"], "MEDIUM")
            rn_agent = self.agents["RN"]
            entity_prompt = f"Analyze the following content for named entities. Provide a structured list of all entities found, categorized by type.\n\n{content}"
            entity_response = await rn_agent.generate_response(entity_prompt)
            results["entities"] = entity_response
            
            # Run topic classification
            topic_payload = {
                "summary": "Classify topics in content",
                "details": {"content": content}
            }
            topic_id = await self.submit("topic_classification", topic_payload, ["TD"], "MEDIUM")
            td_agent = self.agents["TD"]
            topic_prompt = f"Classify the main topics in the following content. Organize by primary and secondary topics with confidence levels.\n\n{content}"
            topic_response = await td_agent.generate_response(topic_prompt)
            results["topics"] = topic_response
            
            # Run relationship analysis
            relation_payload = {
                "summary": "Analyze relationships in content",
                "details": {
                    "entities": entity_response,
                    "topics": topic_response,
                    "content": content
                }
            }
            relation_id = await self.submit("relationship_analysis", relation_payload, ["OR"], "MEDIUM")
            or_agent = self.agents["OR"]
            relation_prompt = f"Identify relationships between entities and topics in the following content.\n\nEntities identified:\n{entity_response[:300]}...\n\nTopics identified:\n{topic_response[:300]}...\n\nContent to analyze:\n{content}"
            relation_response = await or_agent.generate_response(relation_prompt)
            results["relationships"] = relation_response
            
        # Add other workflow types as needed
        
        return results


# Create agents for playground
research_crew = ResearchCrew()
agents = research_crew.agents

# Choose which agents to expose in the playground (limit to a reasonable number)
playground_agents = [
    agents['HA'],  # Historical
    agents['CE'],  # Claims & Evidence
    agents['GV'],  # Geospatial
    agents['RN'],  # Network 
    agents['DL'],  # Documentation
    agents['DV'],  # Data Visualization
    agents['TD']   # Theory Development
]

# Create playground app
app = Playground(agents=playground_agents).get_app()

if __name__ == "__main__":
    serve_playground_app("research_crew:app", reload=True)