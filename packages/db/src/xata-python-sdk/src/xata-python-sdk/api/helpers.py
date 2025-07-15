"""
Helper functions for Xata Python SDK
Mirrors the TypeScript helpers.ts functionality
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import json

from ..client import XataClient
from ..models.events import EventsRecord


async def fetch_records(
    client: XataClient,
    table: str,
    page_size: int = 50,
    max_pages: Optional[int] = None
) -> List[Dict[str, Any]]:
    """
    Fetch records with pagination
    """
    all_records = []
    page = 1
    
    while True:
        if max_pages and page > max_pages:
            break
        
        result = await client.query_records(
            table,
            page=page,
            size=page_size
        )
        
        records = result.get("records", [])
        if not records:
            break
        
        all_records.extend(records)
        page += 1
    
    return all_records


async def fetch_next_mindmap_records(
    client: XataClient,
    table: str,
    last_record_id: Optional[str] = None,
    page_size: int = 20
) -> Dict[str, Any]:
    """
    Fetch next batch of records for mindmap operations
    """
    try:
        # Build filter for pagination
        filter_params = {}
        if last_record_id:
            filter_params["id"] = {"$gt": last_record_id}
        
        result = await client.query_records(
            table,
            filter_params=filter_params,
            sort=[{"id": "asc"}],
            size=page_size
        )
        
        records = result.get("records", [])
        
        return {
            "success": True,
            "records": records,
            "hasMore": len(records) == page_size,
            "lastRecordId": records[-1]["id"] if records else None
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error),
            "records": [],
            "hasMore": False,
            "lastRecordId": None
        }


async def get_connection_results(
    client: XataClient,
    source_table: str,
    source_id: str,
    connection_tables: List[str]
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get connected records across multiple tables
    """
    results = {}
    
    for table in connection_tables:
        try:
            # Look for records that reference the source record
            filter_params = {
                f"{source_table.rstrip('s')}": {"id": source_id}
            }
            
            result = await client.query_records(
                table,
                filter_params=filter_params
            )
            
            results[table] = result.get("records", [])
            
        except Exception as error:
            print(f"Error fetching connections from {table}: {error}")
            results[table] = []
    
    return results


async def get_join_tables_data(
    client: XataClient,
    main_table: str,
    main_record_id: str,
    join_tables: List[str]
) -> Dict[str, Any]:
    """
    Get data from join tables for a main record
    """
    join_data = {}
    
    for join_table in join_tables:
        try:
            # Look for join records that reference the main record
            filter_params = {
                f"{main_table.rstrip('s')}": {"id": main_record_id}
            }
            
            result = await client.query_records(
                join_table,
                filter_params=filter_params
            )
            
            join_data[join_table] = result.get("records", [])
            
        except Exception as error:
            print(f"Error fetching join data from {join_table}: {error}")
            join_data[join_table] = []
    
    return join_data


async def batch_create_records(
    client: XataClient,
    table: str,
    records: List[Dict[str, Any]],
    batch_size: int = 50
) -> Dict[str, Any]:
    """
    Create records in batches
    """
    try:
        all_created = []
        
        # Process in batches
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            
            created_batch = await client.create_multiple_records(table, batch)
            all_created.extend(created_batch)
        
        return {
            "success": True,
            "created": all_created,
            "count": len(all_created)
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error),
            "created": [],
            "count": 0
        }


async def batch_update_records(
    client: XataClient,
    table: str,
    updates: List[Dict[str, Any]],
    batch_size: int = 50
) -> Dict[str, Any]:
    """
    Update records in batches
    Each update should have 'id' and the fields to update
    """
    try:
        updated_count = 0
        failed_updates = []
        
        # Process in batches
        for i in range(0, len(updates), batch_size):
            batch = updates[i:i + batch_size]
            
            for update in batch:
                try:
                    record_id = update.pop("id")
                    await client.update_record(table, record_id, update)
                    updated_count += 1
                except Exception as error:
                    failed_updates.append({"id": record_id, "error": str(error)})
        
        return {
            "success": True,
            "updated": updated_count,
            "failed": failed_updates,
            "failedCount": len(failed_updates)
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error),
            "updated": 0,
            "failed": [],
            "failedCount": 0
        }


async def get_record_with_connections(
    client: XataClient,
    table: str,
    record_id: str,
    connection_tables: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Get a record with its connected records
    """
    try:
        # Get main record
        main_record = await client.get_record(table, record_id)
        
        if not main_record:
            return {
                "success": False,
                "error": "Record not found",
                "record": None,
                "connections": {}
            }
        
        # Get connections if specified
        connections = {}
        if connection_tables:
            connections = await get_connection_results(
                client, table, record_id, connection_tables
            )
        
        return {
            "success": True,
            "record": main_record,
            "connections": connections
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error),
            "record": None,
            "connections": {}
        }


async def search_and_aggregate(
    client: XataClient,
    table: str,
    query: str,
    aggregation_field: str,
    aggregation_type: str = "count"
) -> Dict[str, Any]:
    """
    Search records and perform aggregation
    """
    try:
        # Perform search
        search_result = await client.search_records(
            table,
            query=query,
            size=1000  # Get more results for aggregation
        )
        
        records = search_result.get("records", [])
        
        if not records:
            return {
                "success": True,
                "aggregation": {},
                "totalRecords": 0
            }
        
        # Perform aggregation
        aggregation = {}
        
        if aggregation_type == "count":
            for record in records:
                value = record.get(aggregation_field, "Unknown")
                aggregation[value] = aggregation.get(value, 0) + 1
        
        elif aggregation_type == "sum":
            for record in records:
                value = record.get(aggregation_field, 0)
                if isinstance(value, (int, float)):
                    aggregation["sum"] = aggregation.get("sum", 0) + value
        
        elif aggregation_type == "avg":
            values = []
            for record in records:
                value = record.get(aggregation_field, 0)
                if isinstance(value, (int, float)):
                    values.append(value)
            
            if values:
                aggregation["average"] = sum(values) / len(values)
                aggregation["count"] = len(values)
        
        return {
            "success": True,
            "aggregation": aggregation,
            "totalRecords": len(records)
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error),
            "aggregation": {},
            "totalRecords": 0
        }


async def get_table_statistics(
    client: XataClient,
    table: str
) -> Dict[str, Any]:
    """
    Get basic statistics for a table
    """
    try:
        # Get a sample of records to analyze
        result = await client.query_records(
            table,
            size=1000
        )
        
        records = result.get("records", [])
        
        if not records:
            return {
                "success": True,
                "totalRecords": 0,
                "sampleSize": 0,
                "fieldAnalysis": {}
            }
        
        # Analyze fields
        field_analysis = {}
        
        for record in records:
            for field, value in record.items():
                if field not in field_analysis:
                    field_analysis[field] = {
                        "type": type(value).__name__,
                        "nullCount": 0,
                        "uniqueValues": set(),
                        "sampleValues": []
                    }
                
                if value is None:
                    field_analysis[field]["nullCount"] += 1
                else:
                    field_analysis[field]["uniqueValues"].add(str(value))
                    if len(field_analysis[field]["sampleValues"]) < 5:
                        field_analysis[field]["sampleValues"].append(value)
        
        # Convert sets to counts and lists for JSON serialization
        for field_info in field_analysis.values():
            field_info["uniqueCount"] = len(field_info["uniqueValues"])
            field_info["uniqueValues"] = list(field_info["uniqueValues"])[:10]  # Limit to 10 examples
        
        return {
            "success": True,
            "totalRecords": len(records),  # This is just the sample size
            "sampleSize": len(records),
            "fieldAnalysis": field_analysis
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error),
            "totalRecords": 0,
            "sampleSize": 0,
            "fieldAnalysis": {}
        }


def format_date_for_query(date: datetime) -> str:
    """
    Format datetime for Xata queries
    """
    return date.isoformat()


def parse_xata_date(date_str: str) -> datetime:
    """
    Parse Xata date string to datetime
    """
    return datetime.fromisoformat(date_str.replace('Z', '+00:00'))


def build_filter_from_params(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build Xata filter from query parameters
    """
    filter_params = {}
    
    for key, value in params.items():
        if key.endswith('_gte'):
            field = key[:-4]
            filter_params[field] = filter_params.get(field, {})
            filter_params[field]["$gte"] = value
        
        elif key.endswith('_lte'):
            field = key[:-4]
            filter_params[field] = filter_params.get(field, {})
            filter_params[field]["$lte"] = value
        
        elif key.endswith('_ne'):
            field = key[:-3]
            filter_params[field] = {"$ne": value}
        
        elif key.endswith('_contains'):
            field = key[:-9]
            filter_params[field] = {"$contains": value}
        
        elif key.endswith('_in'):
            field = key[:-3]
            filter_params[field] = {"$in": value}
        
        else:
            filter_params[key] = value
    
    return filter_params


def validate_embedding_vector(embedding: List[float]) -> bool:
    """
    Validate that an embedding vector is properly formatted
    """
    if not isinstance(embedding, list):
        return False
    
    if len(embedding) != 1536:
        return False
    
    return all(isinstance(x, (int, float)) for x in embedding)


def calculate_embedding_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Calculate cosine similarity between two embedding vectors
    """
    if len(vec1) != len(vec2):
        raise ValueError("Vectors must have the same length")
    
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude1 = sum(a * a for a in vec1) ** 0.5
    magnitude2 = sum(a * a for a in vec2) ** 0.5
    
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
    
    return dot_product / (magnitude1 * magnitude2)