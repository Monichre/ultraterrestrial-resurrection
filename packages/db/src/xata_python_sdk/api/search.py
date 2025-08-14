"""
Search API for Xata Python SDK
Mirrors the TypeScript search.ts functionality
"""

from typing import List, Optional, Dict, Any
from ..client import XataClient


async def search_xata(
    client: XataClient,
    query: str,
    id: Optional[str] = None,
    table: Optional[str] = None
) -> Dict[str, Any]:
    """
    Search Xata database with different scopes
    Mirrors the TypeScript searchXata function
    """
    try:
        if not query:
            return {"success": False, "error": "Query is required"}
        
        if table and id:
            # Search within a specific table and record (not directly supported by HTTP API)
            # Fall back to table-level search
            result = await client.search_records(table, query, fuzziness=1, prefix="phrase")
            search_results = result.get("records", [])
        
        elif table:
            # Search within a specific table
            result = await client.search_records(table, query, fuzziness=1, prefix="phrase")
            search_results = result.get("records", [])
        
        else:
            # Global search across all tables
            result = await client.global_search(query, fuzziness=1, prefix="phrase")
            search_results = result.get("records", [])
        
        return {
            "success": True,
            "searchResults": search_results
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


async def search_table(
    client: XataClient,
    table: str,
    query: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Search within a specific table with advanced options
    """
    try:
        if not query:
            return {"success": False, "error": "Query is required"}
        
        # Default options
        search_options = {
            "fuzziness": 1,
            "prefix": "phrase",
            "size": 20,
            "target": None,
            "filter_params": None
        }
        
        # Override with provided options
        if options:
            search_options.update(options)
        
        result = await client.search_records(
            table,
            query=query,
            fuzziness=search_options["fuzziness"],
            prefix=search_options["prefix"],
            target=search_options["target"],
            filter_params=search_options["filter_params"],
            size=search_options["size"]
        )
        
        return {
            "success": True,
            "searchResults": result.get("records", [])
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


async def search_multiple_tables(
    client: XataClient,
    query: str,
    tables: List[str],
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Search across multiple specified tables
    """
    try:
        if not query:
            return {"success": False, "error": "Query is required"}
        
        if not tables:
            return {"success": False, "error": "At least one table must be specified"}
        
        # Default options
        search_options = {
            "fuzziness": 1,
            "prefix": "phrase",
            "size": 20
        }
        
        # Override with provided options
        if options:
            search_options.update(options)
        
        result = await client.global_search(
            query,
            tables=tables,
            fuzziness=search_options["fuzziness"],
            prefix=search_options["prefix"],
            size=search_options["size"]
        )
        
        return {
            "success": True,
            "searchResults": result.get("records", [])
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


async def vector_search_table(
    client: XataClient,
    table: str,
    embedding: List[float],
    column: str = "embedding",
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Perform vector similarity search on a table
    """
    try:
        if not embedding:
            return {"success": False, "error": "Embedding vector is required"}
        
        if len(embedding) != 1536:
            return {"success": False, "error": "Embedding must have 1536 dimensions"}
        
        # Default options
        search_options = {
            "size": 10,
            "filter_params": None
        }
        
        # Override with provided options
        if options:
            search_options.update(options)
        
        result = await client.vector_search(
            table,
            column=column,
            query_vector=embedding,
            size=search_options["size"],
            filter_params=search_options["filter_params"]
        )
        
        return {
            "success": True,
            "searchResults": result.get("records", [])
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


async def search_with_filters(
    client: XataClient,
    table: str,
    query: str,
    filters: Dict[str, Any],
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Search with additional filters applied
    """
    try:
        if not query:
            return {"success": False, "error": "Query is required"}
        
        if not filters:
            return {"success": False, "error": "Filters are required"}
        
        # Default options
        search_options = {
            "fuzziness": 1,
            "prefix": "phrase",
            "size": 20,
            "target": None
        }
        
        # Override with provided options
        if options:
            search_options.update(options)
        
        result = await client.search_records(
            table,
            query=query,
            fuzziness=search_options["fuzziness"],
            prefix=search_options["prefix"],
            target=search_options["target"],
            filter_params=filters,
            size=search_options["size"]
        )
        
        return {
            "success": True,
            "searchResults": result.get("records", [])
        }
        
    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


async def search_by_category(
    client: XataClient,
    table: str,
    query: str,
    category: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Search within a specific category
    """
    filters = {
        "category": {"$contains": category}
    }
    
    return await search_with_filters(client, table, query, filters, options)


async def search_by_date_range(
    client: XataClient,
    table: str,
    query: str,
    start_date: str,
    end_date: str,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Search within a date range
    """
    filters = {
        "date": {
            "$gte": start_date,
            "$lte": end_date
        }
    }
    
    return await search_with_filters(client, table, query, filters, options)


async def search_by_location(
    client: XataClient,
    table: str,
    query: str,
    latitude: float,
    longitude: float,
    radius_km: float,
    options: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Search within a geographic radius
    """
    # Convert radius to degrees (approximate)
    radius_degrees = radius_km / 111.32
    
    filters = {
        "$and": [
            {"latitude": {"$gte": latitude - radius_degrees}},
            {"latitude": {"$lte": latitude + radius_degrees}},
            {"longitude": {"$gte": longitude - radius_degrees}},
            {"longitude": {"$lte": longitude + radius_degrees}}
        ]
    }
    
    return await search_with_filters(client, table, query, filters, options)