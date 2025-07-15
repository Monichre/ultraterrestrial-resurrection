"""
Ask API for Xata Python SDK
Mirrors the TypeScript ask.ts functionality with AI-powered question answering
"""

from typing import List, Optional, Dict, Any, AsyncGenerator
from pydantic import BaseModel
from enum import Enum
import json
import asyncio

from ..client import XataClient


class SearchType(str, Enum):
    KEYWORD = "keyword"
    VECTOR = "vector"


class AskOptions(BaseModel):
    """Options for ask operations"""
    rules: Optional[List[str]] = None
    search_type: Optional[SearchType] = SearchType.KEYWORD
    search: Optional[Dict[str, Any]] = None
    vector_search: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None


class AskResponse(BaseModel):
    """Response from ask operation"""
    answer: str
    session_id: str
    records: List[Dict[str, Any]]


class AskStreamChunk(BaseModel):
    """Chunk from streaming ask operation"""
    answer: Optional[str] = None
    session_id: Optional[str] = None
    records: Optional[List[Dict[str, Any]]] = None
    done: Optional[bool] = None


# UFO Research-specific rules and configurations
class UFOResearchRules:
    """Pre-configured rules for UFO/UAP research"""
    
    SCIENTIFIC_ANALYSIS = [
        "Always prioritize scientifically documented incidents with multiple independent witnesses",
        "Include details about official investigations, military involvement, or government acknowledgment",
        "Focus on incidents with physical evidence, radar confirmation, or photographic documentation",
        "Distinguish between explained phenomena and genuinely unexplained cases"
    ]
    
    HISTORICAL_CONTEXT = [
        "Provide historical context including the time period, geopolitical situation, and technological capabilities of the era",
        "Consider the credibility of witnesses, including military personnel, pilots, and trained observers",
        "Include information about subsequent investigations, debunking attempts, or confirmations"
    ]
    
    DISCLOSURE_FOCUSED = [
        "Emphasize cases involving government transparency, official disclosure, or declassified documents",
        "Include information about congressional hearings, official reports, or military acknowledgments",
        "Focus on cases that contributed to policy changes or increased government transparency"
    ]
    
    PATTERN_ANALYSIS = [
        "Look for patterns in locations, timing, witness descriptions, and reported capabilities",
        "Compare similar incidents across different time periods and geographical regions",
        "Identify common characteristics in technology descriptions, entity encounters, or environmental effects"
    ]


class UFOSearchConfigs:
    """Pre-configured search configurations for UFO research"""
    
    CREDIBLE_SIGHTINGS = {
        "search_type": SearchType.KEYWORD,
        "search": {
            "fuzziness": 1,
            "prefix": "phrase",
            "target": [
                "description",
                {"column": "name", "weight": 3},
                {"column": "summary", "weight": 2},
                "location",
                "witness_credibility"
            ],
            "boosters": [
                {
                    "valueBooster": {
                        "column": "credibility_score",
                        "value": "high",
                        "factor": 2.0
                    }
                },
                {
                    "numericBooster": {
                        "column": "witness_count",
                        "factor": 1.5
                    }
                }
            ]
        }
    }
    
    GOVERNMENT_DISCLOSURE = {
        "search_type": SearchType.KEYWORD,
        "search": {
            "fuzziness": 0,
            "prefix": "phrase",
            "target": [
                {"column": "description", "weight": 2},
                {"column": "official_investigation", "weight": 3},
                {"column": "government_acknowledgment", "weight": 3},
                "classification_status"
            ],
            "boosters": [
                {
                    "valueBooster": {
                        "column": "government_involvement",
                        "value": "confirmed",
                        "factor": 2.5
                    }
                },
                {
                    "valueBooster": {
                        "column": "classification_status",
                        "value": "declassified",
                        "factor": 2.0
                    }
                }
            ]
        }
    }


async def ask_xata(
    client: XataClient,
    table: str,
    question: str,
    options: Optional[AskOptions] = None
) -> AskResponse:
    """
    Ask AI-powered questions to the database
    Mirrors the TypeScript askXata function
    """
    if not options:
        options = AskOptions()
    
    try:
        result = await client.ask_question(
            table=table,
            question=question,
            rules=options.rules,
            search_type=options.search_type.value if options.search_type else "keyword",
            search_config=options.search,
            session_id=options.session_id
        )
        
        return AskResponse(
            answer=result.get("answer", ""),
            session_id=result.get("sessionId", ""),
            records=result.get("records", [])
        )
        
    except Exception as error:
        raise Exception(f"Failed to ask question: {str(error)}")


async def ask_xata_with_ai(
    client: XataClient,
    table: str,
    question: str,
    rules: Optional[List[str]] = None,
    search_type: Optional[str] = None,
    search: Optional[Dict[str, Any]] = None,
    session_id: Optional[str] = None
) -> AskResponse:
    """
    Enhanced ask function that mirrors TypeScript askXataWithAi
    """
    options = AskOptions(
        rules=rules,
        search_type=SearchType(search_type) if search_type else SearchType.KEYWORD,
        search=search,
        session_id=session_id
    )
    
    return await ask_xata(client, table, question, options)


async def ask_follow_up(
    client: XataClient,
    table: str,
    question: str,
    session_id: str,
    options: Optional[AskOptions] = None
) -> AskResponse:
    """
    Ask a follow-up question in an existing conversation
    """
    if not options:
        options = AskOptions()
    
    options.session_id = session_id
    
    return await ask_xata(client, table, question, options)


async def ask_ufo_credibility_analysis(
    client: XataClient,
    table: str,
    question: str,
    min_credibility_score: Optional[float] = None,
    include_debunked: bool = False,
    session_id: Optional[str] = None
) -> AskResponse:
    """
    Specialized function for UFO credibility analysis
    """
    search_config = UFOSearchConfigs.CREDIBLE_SIGHTINGS["search"].copy()
    
    # Add filters based on options
    filters = {}
    if min_credibility_score is not None:
        filters["credibility_score"] = {"$gte": min_credibility_score}
    
    if not include_debunked:
        filters["debunked"] = {"$ne": True}
    
    if filters:
        search_config["filter"] = filters
    
    options = AskOptions(
        rules=UFOResearchRules.SCIENTIFIC_ANALYSIS,
        search_type=SearchType.KEYWORD,
        search=search_config,
        session_id=session_id
    )
    
    return await ask_xata(client, table, question, options)


async def ask_government_disclosure(
    client: XataClient,
    table: str,
    question: str,
    include_classified: bool = False,
    official_only: bool = False,
    session_id: Optional[str] = None
) -> AskResponse:
    """
    Specialized function for government disclosure research
    """
    search_config = UFOSearchConfigs.GOVERNMENT_DISCLOSURE["search"].copy()
    
    # Add filters based on options
    filters = {}
    if not include_classified:
        filters["classification_status"] = {"$ne": "classified"}
    
    if official_only:
        filters["government_involvement"] = "confirmed"
    
    if filters:
        search_config["filter"] = filters
    
    options = AskOptions(
        rules=UFOResearchRules.DISCLOSURE_FOCUSED,
        search_type=SearchType.KEYWORD,
        search=search_config,
        session_id=session_id
    )
    
    return await ask_xata(client, table, question, options)


async def ask_historical_timeline(
    client: XataClient,
    table: str,
    question: str,
    start_year: Optional[int] = None,
    end_year: Optional[int] = None,
    include_ancient: bool = False,
    session_id: Optional[str] = None
) -> AskResponse:
    """
    Specialized function for historical timeline analysis
    """
    search_config = {
        "fuzziness": 1,
        "prefix": "disabled",
        "target": [
            "description",
            {"column": "name", "weight": 2},
            "date",
            "historical_significance"
        ],
        "boosters": [
            {
                "numericBooster": {
                    "column": "date",
                    "factor": 1.0,
                    "modifier": "log"
                }
            }
        ]
    }
    
    # Add date filters
    filters = {}
    if start_year:
        filters["date"] = filters.get("date", {})
        filters["date"]["$gte"] = f"{start_year}-01-01"
    
    if end_year:
        filters["date"] = filters.get("date", {})
        filters["date"]["$lte"] = f"{end_year}-12-31"
    
    if not include_ancient:
        filters["date"] = filters.get("date", {})
        filters["date"]["$gte"] = "1900-01-01"
    
    if filters:
        search_config["filter"] = filters
    
    options = AskOptions(
        rules=UFOResearchRules.HISTORICAL_CONTEXT,
        search_type=SearchType.KEYWORD,
        search=search_config,
        session_id=session_id
    )
    
    return await ask_xata(client, table, question, options)


async def ask_geographic_patterns(
    client: XataClient,
    table: str,
    question: str,
    region: Optional[str] = None,
    radius: Optional[float] = None,
    center_lat: Optional[float] = None,
    center_lng: Optional[float] = None,
    session_id: Optional[str] = None
) -> AskResponse:
    """
    Specialized function for geographic pattern analysis
    """
    search_config = {
        "fuzziness": 2,
        "prefix": "phrase",
        "target": [
            {"column": "location", "weight": 3},
            {"column": "coordinates", "weight": 2},
            "description",
            "regional_patterns"
        ],
        "boosters": [
            {
                "numericBooster": {
                    "column": "latitude",
                    "factor": 1.2
                }
            },
            {
                "numericBooster": {
                    "column": "longitude",
                    "factor": 1.2
                }
            }
        ]
    }
    
    # Add geographic filters
    filters = {}
    if region:
        filters["location"] = {"$contains": region}
    
    if center_lat and center_lng and radius:
        # Convert radius to degrees (approximate)
        radius_degrees = radius / 111
        filters["latitude"] = {
            "$gte": center_lat - radius_degrees,
            "$lte": center_lat + radius_degrees
        }
        filters["longitude"] = {
            "$gte": center_lng - radius_degrees,
            "$lte": center_lng + radius_degrees
        }
    
    if filters:
        search_config["filter"] = filters
    
    options = AskOptions(
        rules=UFOResearchRules.PATTERN_ANALYSIS,
        search_type=SearchType.KEYWORD,
        search=search_config,
        session_id=session_id
    )
    
    return await ask_xata(client, table, question, options)


async def ask_multi_table_research(
    client: XataClient,
    question: str,
    tables: Optional[List[str]] = None,
    session_id: Optional[str] = None,
    research_type: str = "SCIENTIFIC_ANALYSIS"
) -> Dict[str, Any]:
    """
    Multi-table research function that queries across multiple tables
    """
    if not tables:
        tables = ["events", "personnel", "testimonies"]
    
    # Get the appropriate rules
    rules_map = {
        "SCIENTIFIC_ANALYSIS": UFOResearchRules.SCIENTIFIC_ANALYSIS,
        "HISTORICAL_CONTEXT": UFOResearchRules.HISTORICAL_CONTEXT,
        "DISCLOSURE_FOCUSED": UFOResearchRules.DISCLOSURE_FOCUSED,
        "PATTERN_ANALYSIS": UFOResearchRules.PATTERN_ANALYSIS
    }
    
    rules = rules_map.get(research_type, UFOResearchRules.SCIENTIFIC_ANALYSIS)
    
    results = {}
    current_session_id = session_id
    
    # Query each table
    for table in tables:
        try:
            result = await ask_xata_with_ai(
                client,
                table,
                question,
                rules=rules,
                session_id=current_session_id
            )
            
            results[table] = result
            current_session_id = result.session_id  # Use for follow-ups
            
        except Exception as error:
            print(f"Error querying table {table}: {error}")
            continue
    
    # Combine results into a comprehensive answer
    combined_answer = "\n\n".join([
        f"**{table.upper()}**: {result.answer}"
        for table, result in results.items()
    ])
    
    return {
        "combinedAnswer": combined_answer,
        "tableResults": results,
        "sessionId": current_session_id or ""
    }


class UFOResearchConversation:
    """
    Research conversation builder for complex investigations
    """
    
    def __init__(self, client: XataClient, table: str):
        self.client = client
        self.table = table
        self.session_id: Optional[str] = None
        self.conversation_history: List[Dict[str, Any]] = []
    
    async def start_investigation(
        self,
        initial_question: str,
        research_type: str = "SCIENTIFIC_ANALYSIS"
    ) -> AskResponse:
        """Start a new investigation"""
        rules_map = {
            "SCIENTIFIC_ANALYSIS": UFOResearchRules.SCIENTIFIC_ANALYSIS,
            "HISTORICAL_CONTEXT": UFOResearchRules.HISTORICAL_CONTEXT,
            "DISCLOSURE_FOCUSED": UFOResearchRules.DISCLOSURE_FOCUSED,
            "PATTERN_ANALYSIS": UFOResearchRules.PATTERN_ANALYSIS
        }
        
        rules = rules_map.get(research_type, UFOResearchRules.SCIENTIFIC_ANALYSIS)
        
        result = await ask_xata_with_ai(
            self.client,
            self.table,
            initial_question,
            rules=rules
        )
        
        self.session_id = result.session_id
        self.conversation_history.append({
            "question": initial_question,
            "answer": result.answer,
            "timestamp": "now",  # You might want to use actual datetime
            "searchType": research_type
        })
        
        return result
    
    async def ask_follow_up(
        self,
        question: str,
        search_config: Optional[str] = None
    ) -> AskResponse:
        """Ask a follow-up question"""
        if not self.session_id:
            raise Exception("No active investigation session. Call start_investigation first.")
        
        # Get search config if specified
        config = None
        if search_config == "CREDIBLE_SIGHTINGS":
            config = UFOSearchConfigs.CREDIBLE_SIGHTINGS["search"]
        elif search_config == "GOVERNMENT_DISCLOSURE":
            config = UFOSearchConfigs.GOVERNMENT_DISCLOSURE["search"]
        
        options = AskOptions(
            session_id=self.session_id,
            search=config
        )
        
        result = await ask_xata(self.client, self.table, question, options)
        
        self.conversation_history.append({
            "question": question,
            "answer": result.answer,
            "timestamp": "now",
            "searchType": search_config
        })
        
        return result
    
    def get_conversation_summary(self) -> Dict[str, Any]:
        """Get conversation summary"""
        return {
            "totalQuestions": len(self.conversation_history),
            "sessionId": self.session_id,
            "history": self.conversation_history
        }


# Export specialized UFO research functions
ufo_research = {
    "ask_credibility_analysis": ask_ufo_credibility_analysis,
    "ask_government_disclosure": ask_government_disclosure,
    "ask_historical_timeline": ask_historical_timeline,
    "ask_geographic_patterns": ask_geographic_patterns,
    "ask_multi_table_research": ask_multi_table_research,
    "UFOResearchConversation": UFOResearchConversation,
    "RULES": UFOResearchRules,
    "CONFIGS": UFOSearchConfigs
}