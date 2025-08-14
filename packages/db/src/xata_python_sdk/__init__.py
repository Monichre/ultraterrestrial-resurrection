"""
Xata Python SDK
Provides standardized database operations for UFO research platform
Mirrors TypeScript SDK functionality with Python-native patterns
"""

# Client and core functionality
from .client import XataClient, get_xata_client, xata_client, xata

# Models
from .models import *

# API functions
from .api import *

# Main exports matching TypeScript structure
__all__ = [
    # Client
    "XataClient",
    "get_xata_client", 
    "xata_client",
    "xata",
    
    # Base classes
    "BaseModelOperations",
    "XataRecord", 
    "DatabaseOperationError",
    "PaginationResult",
    "QueryOptions",
    
    # Events model
    "EventsModel",
    "EventsRecord",
    "EventInput", 
    "EventUpdateInput",
    "create_event",
    "get_event_by_id",
    "get_event_by_title",
    "get_all_events",
    "update_event",
    "delete_event",
    "search_events",
    "semantic_search_events",
    "get_events_by_location",
    
    # Search API
    "search_xata",
    "search_table",
    "search_multiple_tables", 
    "vector_search_table",
    "search_with_filters",
    "search_by_category",
    "search_by_date_range",
    "search_by_location",
    
    # Ask API
    "ask_xata",
    "ask_xata_with_ai",
    "ask_follow_up",
    "ask_ufo_credibility_analysis",
    "ask_government_disclosure", 
    "ask_historical_timeline",
    "ask_geographic_patterns",
    "ask_multi_table_research",
    "UFOResearchConversation",
    "UFOResearchRules",
    "UFOSearchConfigs",
    "ufo_research",
    "AskOptions",
    "AskResponse",
    "AskStreamChunk",
    "SearchType",
    
    # Helper functions
    "fetch_records",
    "fetch_next_mindmap_records",
    "get_connection_results",
    "get_join_tables_data",
    "batch_create_records",
    "batch_update_records",
    "get_record_with_connections",
    "search_and_aggregate",
    "get_table_statistics",
    "format_date_for_query",
    "parse_xata_date",
    "build_filter_from_params",
    "validate_embedding_vector",
    "calculate_embedding_similarity"
]

# Version info
__version__ = "1.0.0"
__author__ = "UFO Research Platform"
__description__ = "Python SDK for Xata database operations"