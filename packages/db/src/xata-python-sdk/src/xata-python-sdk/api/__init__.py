"""
API module for Xata Python SDK
Exports all API functions matching TypeScript structure
"""

# Search functions
from .search import (
    search_xata,
    search_table,
    search_multiple_tables,
    vector_search_table,
    search_with_filters,
    search_by_category,
    search_by_date_range,
    search_by_location
)

# Ask functions
from .ask import (
    ask_xata,
    ask_xata_with_ai,
    ask_follow_up,
    ask_ufo_credibility_analysis,
    ask_government_disclosure,
    ask_historical_timeline,
    ask_geographic_patterns,
    ask_multi_table_research,
    UFOResearchConversation,
    UFOResearchRules,
    UFOSearchConfigs,
    ufo_research,
    AskOptions,
    AskResponse,
    AskStreamChunk,
    SearchType
)

# Helper functions
from .helpers import (
    fetch_records,
    fetch_next_mindmap_records,
    get_connection_results,
    get_join_tables_data,
    batch_create_records,
    batch_update_records,
    get_record_with_connections,
    search_and_aggregate,
    get_table_statistics,
    format_date_for_query,
    parse_xata_date,
    build_filter_from_params,
    validate_embedding_vector,
    calculate_embedding_similarity
)

# Export all functions
__all__ = [
    # Search functions
    "search_xata",
    "search_table",
    "search_multiple_tables",
    "vector_search_table",
    "search_with_filters",
    "search_by_category",
    "search_by_date_range",
    "search_by_location",
    
    # Ask functions
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