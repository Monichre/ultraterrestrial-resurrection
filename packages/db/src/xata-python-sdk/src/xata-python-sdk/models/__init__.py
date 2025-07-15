"""
Models module for Xata Python SDK
Exports all model classes and functions
"""

# Base classes
from .base import (
    BaseModelOperations,
    XataRecord,
    DatabaseOperationError,
    PaginationResult,
    QueryOptions
)

# Events model
from .events import (
    EventsModel,
    EventsRecord,
    EventInput,
    EventUpdateInput,
    create_event,
    get_event_by_id,
    get_event_by_title,
    get_all_events,
    update_event,
    delete_event,
    search_events,
    semantic_search_events,
    get_events_by_location
)

# Export all
__all__ = [
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
    "get_events_by_location"
]