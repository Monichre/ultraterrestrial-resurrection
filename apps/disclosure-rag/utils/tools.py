import os
import logging
from typing import Dict, Any, List, Optional, Union
import json
from pathlib import Path

from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.web import WebBrowserTools
from agno.tools.mcp import MCPTools

# Import the knowledge base
from lib.knowledge_base import KnowledgeBase, create_kb_retrieval_tool

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize shared knowledge base
try:
    kb = KnowledgeBase()
    logger.info("Knowledge base initialized successfully")
except Exception as e:
    logger.error(f"Error initializing knowledge base: {e}")
    kb = None

def initialize_tools():
    """Initialize all tools for agents."""
    tools = []
    
    # Add DuckDuckGo search tool
    try:
        duckduckgo_tool = DuckDuckGoTools()
        tools.append(duckduckgo_tool)
        logger.info("DuckDuckGo search tool initialized")
    except Exception as e:
        logger.error(f"Error initializing DuckDuckGo tool: {e}")
    
    # Add web browser tool
    try:
        web_tool = WebBrowserTools()
        tools.append(web_tool)
        logger.info("Web browser tool initialized")
    except Exception as e:
        logger.error(f"Error initializing web browser tool: {e}")
    
    # Add knowledge base tool if available
    if kb and kb.vector_store:
        try:
            kb_tool = create_kb_retrieval_tool(kb)
            tools.append(kb_tool)
            logger.info("Knowledge base retrieval tool initialized")
        except Exception as e:
            logger.error(f"Error initializing knowledge base tool: {e}")
    
    # Initialize MCP tools if available
    try:
        # Get the repository root path
        repo_root = Path(__file__).parent.parent.parent.parent
        kb_path = repo_root / "knowledge-base"
        
        # Create MCP tools for filesystem access (limited to knowledge-base directory)
        fs_mcp = MCPTools(f"npx -y @modelcontextprotocol/server-filesystem {kb_path}")
        tools.append(fs_mcp)
        logger.info("Filesystem MCP tool initialized")
        
        # Create MCP tools for database access (if DB exists)
        db_path = repo_root / "db" / "uap_research.db"
        if db_path.exists():
            db_mcp = MCPTools(f"npx -y @modelcontextprotocol/server-database 'sqlite:///{db_path}'")
            tools.append(db_mcp)
            logger.info(f"Database MCP tool initialized with {db_path}")
        
        # Create MCP tools for HTTP access
        http_mcp = MCPTools(f"npx -y @modelcontextprotocol/server-http")
        tools.append(http_mcp)
        logger.info("HTTP MCP tool initialized")
        
    except Exception as e:
        logger.error(f"Error initializing MCP tools: {e}")
    
    return tools

# Add specialized tools for specific agents

def create_geospatial_tool():
    """Create a specialized tool for geospatial analysis."""
    
    async def analyze_coordinates(latitude: float, longitude: float, radius_km: float = 10):
        """Analyze geographical coordinates and identify nearby features of interest."""
        try:
            # This would typically call an external API or service
            # For now, we'll simulate the response
            return {
                "coordinates": f"{latitude}, {longitude}",
                "radius_km": radius_km,
                "nearby_features": [
                    {"type": "military", "name": "Example Base", "distance_km": 8.5, "confidence": 0.85},
                    {"type": "airport", "name": "Example Airport", "distance_km": 12.3, "confidence": 0.92}
                ],
                "terrain_features": ["mountainous", "coastal"],
                "population_density": "medium",
                "notes": "This is simulated data. In a real implementation, this would fetch data from GIS services."
            }
        except Exception as e:
            logger.error(f"Error in geospatial analysis: {e}")
            return f"Error analyzing coordinates: {str(e)}"
    
    return {
        "name": "geospatial_analysis",
        "description": "Analyzes geographical coordinates to identify nearby features of interest",
        "parameters": {
            "type": "object",
            "properties": {
                "latitude": {
                    "type": "number",
                    "description": "Latitude coordinate"
                },
                "longitude": {
                    "type": "number",
                    "description": "Longitude coordinate"
                },
                "radius_km": {
                    "type": "number",
                    "description": "Search radius in kilometers",
                    "default": 10
                }
            },
            "required": ["latitude", "longitude"]
        },
        "func": analyze_coordinates
    }

def create_timeline_tool():
    """Create a tool for historical timeline analysis."""
    
    async def analyze_date(date: str, context: Optional[str] = None):
        """Analyze a date for historical UFO/UAP events and correlations."""
        try:
            # In a real implementation, this would query a database of historical events
            # For now, we'll simulate the response
            return {
                "query_date": date,
                "context": context,
                "note": "This is simulated data. In a real implementation, this would search a comprehensive historical database.",
                "similar_dates": [
                    {"date": "1947-06-24", "event": "Kenneth Arnold UFO sighting", "similarity": "First widely reported UFO sighting"},
                    {"date": "1952-07-19", "event": "Washington D.C. UFO incident", "similarity": "Multiple radar confirmations"},
                ],
                "historical_context": "Analyze historical events around this time period for correlation patterns."
            }
        except Exception as e:
            logger.error(f"Error in timeline analysis: {e}")
            return f"Error analyzing date: {str(e)}"
    
    return {
        "name": "historical_timeline",
        "description": "Analyzes dates for historical UFO/UAP events and correlations",
        "parameters": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "string",
                    "description": "Date in YYYY-MM-DD format"
                },
                "context": {
                    "type": "string",
                    "description": "Additional context for the analysis"
                }
            },
            "required": ["date"]
        },
        "func": analyze_date
    }

def create_visualization_schema_tool():
    """Create a tool for generating data visualization schemas."""
    
    async def generate_visualization_schema(data_type: str, visualization_type: str, options: Optional[Dict[str, Any]] = None):
        """Generate a visualization schema for UFO/UAP data."""
        try:
            # Define schema templates for different visualization types
            schemas = {
                "heatmap": {
                    "type": "heatmap",
                    "data": {
                        "type": data_type,
                        "coordinates": True,
                        "intensity": "value"
                    },
                    "options": {
                        "radius": 25,
                        "blur": 15,
                        "gradient": {"0.4": "blue", "0.6": "cyan", "0.7": "lime", "0.8": "yellow", "1.0": "red"}
                    },
                    "libraries": ["leaflet", "leaflet-heatmap"]
                },
                "network": {
                    "type": "network",
                    "data": {
                        "type": data_type,
                        "nodes": "entities",
                        "edges": "relationships",
                        "nodeAttributes": ["type", "name", "weight"],
                        "edgeAttributes": ["type", "strength"]
                    },
                    "options": {
                        "physics": True,
                        "hierarchical": False
                    },
                    "libraries": ["vis-network"]
                },
                "timeline": {
                    "type": "timeline",
                    "data": {
                        "type": data_type,
                        "events": "items",
                        "dates": "date",
                        "content": "title"
                    },
                    "options": {
                        "stack": True,
                        "zoomable": True
                    },
                    "libraries": ["vis-timeline"]
                },
                "3d": {
                    "type": "3d",
                    "data": {
                        "type": data_type,
                        "points": "coordinates",
                        "attributes": ["type", "size", "color"]
                    },
                    "options": {
                        "camera": {
                            "position": {"x": 0, "y": 0, "z": 100},
                            "lookAt": {"x": 0, "y": 0, "z": 0}
                        },
                        "controls": "orbit"
                    },
                    "libraries": ["three"]
                }
            }
            
            # Get the base schema for the requested visualization type
            if visualization_type not in schemas:
                return f"Unsupported visualization type: {visualization_type}. Supported types are: {', '.join(schemas.keys())}"
            
            schema = schemas[visualization_type]
            
            # Apply custom options if provided
            if options:
                for key, value in options.items():
                    if key in schema["options"]:
                        schema["options"][key] = value
            
            # Add sample code for implementation
            if visualization_type == "heatmap":
                schema["sample_code"] = """
                // Create heatmap with Leaflet
                const map = L.map('map-container').setView([39.8283, -98.5795], 4);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                
                // Add heatmap layer
                const heatmapLayer = new HeatmapOverlay(heatmapConfig);
                map.addLayer(heatmapLayer);
                heatmapLayer.setData({
                    max: 10,
                    data: sightingData.map(point => ({
                        lat: point.latitude,
                        lng: point.longitude,
                        value: point.intensity
                    }))
                });
                """
            elif visualization_type == "network":
                schema["sample_code"] = """
                // Create network graph with vis-network
                const nodes = new vis.DataSet(entityData.map(entity => ({
                    id: entity.id,
                    label: entity.name,
                    group: entity.type,
                    value: entity.weight
                })));
                
                const edges = new vis.DataSet(relationshipData.map(rel => ({
                    from: rel.source,
                    to: rel.target,
                    label: rel.type,
                    width: rel.strength
                })));
                
                const container = document.getElementById('network-container');
                const data = { nodes, edges };
                const network = new vis.Network(container, data, networkOptions);
                """
            
            return schema
            
        except Exception as e:
            logger.error(f"Error generating visualization schema: {e}")
            return f"Error generating visualization schema: {str(e)}"
    
    return {
        "name": "data_visualization",
        "description": "Generates visualization schemas for UFO/UAP data",
        "parameters": {
            "type": "object",
            "properties": {
                "data_type": {
                    "type": "string",
                    "description": "Type of data to visualize (e.g., sightings, relationships, timeline)"
                },
                "visualization_type": {
                    "type": "string",
                    "description": "Type of visualization (heatmap, network, timeline, 3d)"
                },
                "options": {
                    "type": "object",
                    "description": "Additional options for the visualization"
                }
            },
            "required": ["data_type", "visualization_type"]
        },
        "func": generate_visualization_schema
    }

# Create a dictionary of all specialized tools
def create_specialized_tools():
    """Create a dictionary of specialized tools for each agent type."""
    specialized_tools = {
        "geospatial": create_geospatial_tool(),
        "historical": create_timeline_tool(),
        "dataviz": create_visualization_schema_tool()
    }
    return specialized_tools

# Export default tools
default_tools = initialize_tools()
specialized_tools = create_specialized_tools()

def get_tools_for_agent(agent_type):
    """Get tools for a specific agent type."""
    tools = default_tools.copy()
    
    # Add specialized tools if available
    if agent_type in specialized_tools:
        tools.append(specialized_tools[agent_type])
    
    return tools