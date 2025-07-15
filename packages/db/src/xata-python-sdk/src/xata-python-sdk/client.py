"""
Xata Python client implementation
Provides async HTTP client for Xata database operations
"""

import os
import httpx
from typing import Dict, Any, Optional, List
from contextlib import asynccontextmanager


class XataClient:
    """
    Async HTTP client for Xata database operations
    Mirrors the functionality of the TypeScript Xata client
    """
    
    def __init__(
        self,
        database_url: Optional[str] = None,
        api_key: Optional[str] = None,
        base_url: str = "https://api.xata.io"
    ):
        self.database_url = database_url or os.getenv("XATA_DATABASE_URL")
        self.api_key = api_key or os.getenv("XATA_API_KEY")
        self.base_url = base_url
        
        if not self.database_url:
            raise ValueError("XATA_DATABASE_URL must be provided or set in environment")
        if not self.api_key:
            raise ValueError("XATA_API_KEY must be provided or set in environment")
        
        # Extract database name from URL for API calls
        self.database_name = self._extract_database_name(self.database_url)
        
        # Initialize async HTTP client
        self._client = httpx.AsyncClient(
            base_url=f"{self.base_url}/db/{self.database_name}",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            timeout=30.0
        )
    
    def _extract_database_name(self, url: str) -> str:
        """Extract database name from Xata URL"""
        # Example: https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial
        # Should return: ultraterrestrial
        parts = url.rstrip('/').split('/')
        return parts[-1]
    
    async def __aenter__(self):
        """Async context manager entry"""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.close()
    
    async def close(self):
        """Close the HTTP client"""
        await self._client.aclose()
    
    # Core CRUD operations
    async def create_record(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record in the specified table"""
        response = await self._client.post(f"/tables/{table}/data", json=data)
        response.raise_for_status()
        return response.json()
    
    async def get_record(self, table: str, record_id: str, columns: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """Get a record by ID"""
        params = {}
        if columns:
            params["columns"] = ",".join(columns)
        
        response = await self._client.get(f"/tables/{table}/data/{record_id}", params=params)
        
        if response.status_code == 404:
            return None
        
        response.raise_for_status()
        return response.json()
    
    async def update_record(self, table: str, record_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a record by ID"""
        response = await self._client.patch(f"/tables/{table}/data/{record_id}", json=data)
        response.raise_for_status()
        return response.json()
    
    async def delete_record(self, table: str, record_id: str) -> bool:
        """Delete a record by ID"""
        response = await self._client.delete(f"/tables/{table}/data/{record_id}")
        
        if response.status_code == 404:
            return False
        
        response.raise_for_status()
        return True
    
    async def query_records(
        self,
        table: str,
        filter_params: Optional[Dict[str, Any]] = None,
        sort: Optional[List[Dict[str, str]]] = None,
        columns: Optional[List[str]] = None,
        page: Optional[int] = None,
        size: Optional[int] = None
    ) -> Dict[str, Any]:
        """Query records with filtering, sorting, and pagination"""
        query_data = {}
        
        if filter_params:
            query_data["filter"] = filter_params
        
        if sort:
            query_data["sort"] = sort
        
        if columns:
            query_data["columns"] = columns
        
        if page and size:
            query_data["page"] = {
                "size": size,
                "offset": (page - 1) * size
            }
        
        response = await self._client.post(f"/tables/{table}/query", json=query_data)
        response.raise_for_status()
        return response.json()
    
    # Search operations
    async def search_records(
        self,
        table: str,
        query: str,
        fuzziness: int = 1,
        prefix: str = "phrase",
        target: Optional[List[str]] = None,
        filter_params: Optional[Dict[str, Any]] = None,
        size: int = 20
    ) -> Dict[str, Any]:
        """Full-text search in table records"""
        search_data = {
            "query": query,
            "fuzziness": fuzziness,
            "prefix": prefix,
            "size": size
        }
        
        if target:
            search_data["target"] = target
        
        if filter_params:
            search_data["filter"] = filter_params
        
        response = await self._client.post(f"/tables/{table}/search", json=search_data)
        response.raise_for_status()
        return response.json()
    
    async def vector_search(
        self,
        table: str,
        column: str,
        query_vector: List[float],
        size: int = 10,
        filter_params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Vector similarity search"""
        search_data = {
            "column": column,
            "queryVector": query_vector,
            "size": size
        }
        
        if filter_params:
            search_data["filter"] = filter_params
        
        response = await self._client.post(f"/tables/{table}/vectorSearch", json=search_data)
        response.raise_for_status()
        return response.json()
    
    # AI-powered Ask operations
    async def ask_question(
        self,
        table: str,
        question: str,
        rules: Optional[List[str]] = None,
        search_type: str = "keyword",
        search_config: Optional[Dict[str, Any]] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Ask AI-powered questions to the database"""
        ask_data = {
            "question": question,
            "searchType": search_type
        }
        
        if rules:
            ask_data["rules"] = rules
        
        if search_config:
            ask_data["search"] = search_config
        
        endpoint = f"/tables/{table}/ask"
        if session_id:
            endpoint += f"/{session_id}"
        
        response = await self._client.post(endpoint, json=ask_data)
        response.raise_for_status()
        return response.json()
    
    # Batch operations
    async def create_multiple_records(self, table: str, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Create multiple records in a single request"""
        response = await self._client.post(f"/tables/{table}/data", json=records)
        response.raise_for_status()
        return response.json()
    
    # Global search across all tables
    async def global_search(
        self,
        query: str,
        tables: Optional[List[str]] = None,
        fuzziness: int = 1,
        prefix: str = "phrase",
        size: int = 20
    ) -> Dict[str, Any]:
        """Search across all tables or specified tables"""
        search_data = {
            "query": query,
            "fuzziness": fuzziness,
            "prefix": prefix,
            "size": size
        }
        
        if tables:
            search_data["tables"] = [{"table": table} for table in tables]
        
        response = await self._client.post("/search", json=search_data)
        response.raise_for_status()
        return response.json()


# Singleton instance
_xata_client: Optional[XataClient] = None


def get_xata_client() -> XataClient:
    """Get or create singleton Xata client instance"""
    global _xata_client
    if _xata_client is None:
        _xata_client = XataClient()
    return _xata_client


@asynccontextmanager
async def xata_client():
    """Async context manager for Xata client"""
    client = get_xata_client()
    try:
        yield client
    finally:
        pass  # Keep singleton alive


# Export the client instance
xata = get_xata_client()