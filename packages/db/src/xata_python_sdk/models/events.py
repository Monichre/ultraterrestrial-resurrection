"""
Events model for Xata Python SDK
Mirrors the TypeScript events.ts functionality
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime
import math

from .base import BaseModelOperations, XataRecord, DatabaseOperationError
from ..client import XataClient


class EventsRecord(XataRecord):
    """Events record model matching Xata schema"""
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    date: Optional[datetime] = None
    photos: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    title: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[List[str]] = None
    embedding: Optional[List[float]] = None


class EventInput(BaseModel):
    """Input model for creating events"""
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    date: Optional[datetime] = None
    photos: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    title: str  # Required field
    summary: Optional[str] = None
    category: Optional[List[str]] = None
    embedding: Optional[List[float]] = None
    
    @validator('embedding')
    def validate_embedding(cls, v):
        if v is not None and len(v) != 1536:
            raise ValueError('Embedding must have 1536 dimensions')
        return v


class EventUpdateInput(BaseModel):
    """Input model for updating events"""
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    date: Optional[datetime] = None
    photos: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[List[str]] = None
    embedding: Optional[List[float]] = None
    
    @validator('embedding')
    def validate_embedding(cls, v):
        if v is not None and len(v) != 1536:
            raise ValueError('Embedding must have 1536 dimensions')
        return v


class EventsModel(BaseModelOperations[EventsRecord, EventInput, EventUpdateInput]):
    """Events model with CRUD operations"""
    
    def __init__(self, client: XataClient):
        super().__init__(client, "events")
    
    def _get_record_class(self) -> type:
        return EventsRecord
    
    async def _validate_create_data(self, data: EventInput, index: Optional[int] = None) -> None:
        """Validate event data before creation"""
        if not data.title:
            error_msg = "Event title is required"
            if index is not None:
                error_msg = f"Event at index {index} is missing required title field"
            
            raise self._create_error(
                error_msg,
                "MISSING_REQUIRED_FIELD",
                "create_event"
            )
    
    async def get_by_title(self, title: str, columns: Optional[List[str]] = None) -> Optional[EventsRecord]:
        """Get event by title (unique field)"""
        try:
            if not title:
                raise self._create_error(
                    "Event title is required",
                    "MISSING_TITLE",
                    "get_by_title"
                )
            
            result = await self.client.query_records(
                self.table_name,
                filter_params={"title": title},
                columns=columns
            )
            
            records = result.get("records", [])
            if not records:
                return None
            
            return EventsRecord(**records[0])
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to get event by title '{title}': {str(e)}",
                "GET_BY_TITLE_FAILED",
                "get_by_title",
                e
            )
    
    async def get_by_location(
        self,
        latitude: float,
        longitude: float,
        radius_km: float
    ) -> List[EventsRecord]:
        """Get events within a geographic radius using Haversine formula"""
        try:
            # Convert radius to degrees (approximate)
            radius_degrees = radius_km / 111.32
            
            # Calculate bounding box for initial filtering
            filter_params = {
                "$and": [
                    {"latitude": {"$gte": latitude - radius_degrees}},
                    {"latitude": {"$lte": latitude + radius_degrees}},
                    {"longitude": {"$gte": longitude - radius_degrees}},
                    {"longitude": {"$lte": longitude + radius_degrees}}
                ]
            }
            
            result = await self.client.query_records(
                self.table_name,
                filter_params=filter_params
            )
            
            records = [EventsRecord(**record) for record in result.get("records", [])]
            
            # Further filter by exact distance using Haversine formula
            filtered_records = []
            for event in records:
                if event.latitude is not None and event.longitude is not None:
                    distance = self._calculate_distance(
                        latitude, longitude, event.latitude, event.longitude
                    )
                    if distance <= radius_km:
                        filtered_records.append(event)
            
            return filtered_records
            
        except Exception as e:
            raise self._create_error(
                f"Failed to get events by location: {str(e)}",
                "LOCATION_SEARCH_FAILED",
                "get_by_location",
                e
            )
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance using Haversine formula"""
        R = 6371  # Earth's radius in km
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(d_lat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(d_lon / 2) ** 2)
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c
    
    async def update_many(
        self,
        filter_params: Dict[str, Any],
        update_data: EventUpdateInput
    ) -> int:
        """Update multiple events matching the filter"""
        try:
            if not filter_params:
                raise self._create_error(
                    "Filter criteria is required",
                    "MISSING_FILTER",
                    "update_many"
                )
            
            update_dict = update_data.model_dump(exclude_none=True)
            if not update_dict:
                raise self._create_error(
                    "Update data is required",
                    "MISSING_DATA",
                    "update_many"
                )
            
            # Get records matching the filter
            records = await self.get_all(QueryOptions(filter=filter_params))
            
            if not records:
                return 0
            
            # Update each record
            updated_count = 0
            for record in records:
                try:
                    await self.client.update_record(self.table_name, record.id, update_dict)
                    updated_count += 1
                except Exception:
                    # Continue with other records if one fails
                    continue
            
            return updated_count
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to update multiple events: {str(e)}",
                "BULK_UPDATE_FAILED",
                "update_many",
                e
            )


# Convenience functions (matching TypeScript pattern)
async def create_event(client: XataClient, data: EventInput) -> EventsRecord:
    """Create a new event record"""
    model = EventsModel(client)
    return await model.create(data)


async def get_event_by_id(client: XataClient, id: str, columns: Optional[List[str]] = None) -> Optional[EventsRecord]:
    """Get an event by ID"""
    model = EventsModel(client)
    return await model.get_by_id(id, columns)


async def get_event_by_title(client: XataClient, title: str, columns: Optional[List[str]] = None) -> Optional[EventsRecord]:
    """Get an event by title"""
    model = EventsModel(client)
    return await model.get_by_title(title, columns)


async def get_all_events(client: XataClient, **kwargs) -> List[EventsRecord]:
    """Get all events with optional filtering"""
    model = EventsModel(client)
    return await model.get_all(**kwargs)


async def update_event(client: XataClient, id: str, data: EventUpdateInput) -> Optional[EventsRecord]:
    """Update an event by ID"""
    model = EventsModel(client)
    return await model.update(id, data)


async def delete_event(client: XataClient, id: str) -> bool:
    """Delete an event by ID"""
    model = EventsModel(client)
    return await model.delete(id)


async def search_events(client: XataClient, query: str, **kwargs) -> List[EventsRecord]:
    """Search events using full-text search"""
    model = EventsModel(client)
    return await model.search(query, **kwargs)


async def semantic_search_events(client: XataClient, embedding: List[float], **kwargs) -> List[EventsRecord]:
    """Semantic search events using vector embeddings"""
    model = EventsModel(client)
    return await model.vector_search(embedding, **kwargs)


async def get_events_by_location(client: XataClient, latitude: float, longitude: float, radius_km: float) -> List[EventsRecord]:
    """Get events within a geographic radius"""
    model = EventsModel(client)
    return await model.get_by_location(latitude, longitude, radius_km)