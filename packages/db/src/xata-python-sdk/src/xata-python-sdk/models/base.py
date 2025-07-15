"""
Base model classes and patterns for Xata Python SDK
Provides generic CRUD operations and error handling
"""

from typing import Generic, TypeVar, List, Optional, Dict, Any
from pydantic import BaseModel, Field
from abc import ABC, abstractmethod
from datetime import datetime
from ..client import XataClient


# Type variables for generic model operations
T = TypeVar('T', bound=BaseModel)
CreateT = TypeVar('CreateT', bound=BaseModel)
UpdateT = TypeVar('UpdateT', bound=BaseModel)


class DatabaseOperationError(Exception):
    """Custom exception for database operations"""
    
    def __init__(self, message: str, code: str, operation: str, details: Any = None):
        super().__init__(message)
        self.code = code
        self.operation = operation
        self.details = details


class XataRecord(BaseModel):
    """Base class for all Xata records"""
    id: str
    xata: Dict[str, Any] = Field(default_factory=dict)


class PaginationResult(BaseModel, Generic[T]):
    """Pagination response wrapper"""
    records: List[T]
    pagination: Dict[str, Any]


class QueryOptions(BaseModel):
    """Options for database queries"""
    filter: Optional[Dict[str, Any]] = None
    sort: Optional[List[Dict[str, str]]] = None
    page: Optional[int] = None
    size: Optional[int] = None
    columns: Optional[List[str]] = None


class BaseModelOperations(ABC, Generic[T, CreateT, UpdateT]):
    """
    Abstract base class for model operations
    Provides standardized CRUD interface matching TypeScript patterns
    """
    
    def __init__(self, client: XataClient, table_name: str):
        self.client = client
        self.table_name = table_name
        self._record_class = self._get_record_class()
    
    @abstractmethod
    def _get_record_class(self) -> type:
        """Return the record class for this model"""
        pass
    
    def _create_error(self, message: str, code: str, operation: str, details: Any = None) -> DatabaseOperationError:
        """Create a standardized database error"""
        return DatabaseOperationError(message, code, operation, details)
    
    async def create(self, data: CreateT) -> T:
        """Create a new record"""
        try:
            # Validate required fields
            await self._validate_create_data(data)
            
            # Convert Pydantic model to dict
            record_data = data.model_dump(exclude_none=True)
            
            # Create record in database
            result = await self.client.create_record(self.table_name, record_data)
            
            # Convert response to record type
            return self._record_class(**result)
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to create {self.table_name} record: {str(e)}",
                "CREATE_FAILED",
                "create",
                e
            )
    
    async def get_by_id(self, id: str, columns: Optional[List[str]] = None) -> Optional[T]:
        """Get a record by ID"""
        try:
            if not id:
                raise self._create_error(
                    f"{self.table_name} ID is required",
                    "MISSING_ID",
                    "get_by_id"
                )
            
            result = await self.client.get_record(self.table_name, id, columns)
            
            if result is None:
                return None
            
            return self._record_class(**result)
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to get {self.table_name} record: {str(e)}",
                "GET_FAILED",
                "get_by_id",
                e
            )
    
    async def get_all(self, options: Optional[QueryOptions] = None) -> List[T]:
        """Get all records with optional filtering and sorting"""
        try:
            query_params = {}
            
            if options:
                if options.filter:
                    query_params["filter_params"] = options.filter
                if options.sort:
                    query_params["sort"] = options.sort
                if options.columns:
                    query_params["columns"] = options.columns
                if options.page and options.size:
                    query_params["page"] = options.page
                    query_params["size"] = options.size
            
            result = await self.client.query_records(self.table_name, **query_params)
            
            records = result.get("records", [])
            return [self._record_class(**record) for record in records]
            
        except Exception as e:
            raise self._create_error(
                f"Failed to get {self.table_name} records: {str(e)}",
                "QUERY_FAILED",
                "get_all",
                e
            )
    
    async def get_with_pagination(
        self,
        page: int = 1,
        size: int = 20,
        filter_params: Optional[Dict[str, Any]] = None,
        columns: Optional[List[str]] = None
    ) -> PaginationResult[T]:
        """Get records with pagination"""
        try:
            # Validate pagination parameters
            if page < 1:
                raise self._create_error(
                    "Page number must be greater than 0",
                    "INVALID_PAGE",
                    "get_with_pagination"
                )
            
            if size < 1 or size > 100:
                raise self._create_error(
                    "Page size must be between 1 and 100",
                    "INVALID_SIZE",
                    "get_with_pagination"
                )
            
            result = await self.client.query_records(
                self.table_name,
                filter_params=filter_params,
                columns=columns,
                page=page,
                size=size
            )
            
            records = [self._record_class(**record) for record in result.get("records", [])]
            
            pagination_info = {
                "page": page,
                "size": size,
                "has_next_page": len(records) == size,  # Simple check
                "total": result.get("totalCount")
            }
            
            return PaginationResult(records=records, pagination=pagination_info)
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to get paginated {self.table_name} records: {str(e)}",
                "PAGINATION_FAILED",
                "get_with_pagination",
                e
            )
    
    async def update(self, id: str, data: UpdateT) -> Optional[T]:
        """Update a record by ID"""
        try:
            if not id:
                raise self._create_error(
                    f"{self.table_name} ID is required",
                    "MISSING_ID",
                    "update"
                )
            
            # Convert Pydantic model to dict, excluding None values
            update_data = data.model_dump(exclude_none=True)
            
            if not update_data:
                raise self._create_error(
                    "Update data is required",
                    "MISSING_DATA",
                    "update"
                )
            
            # Check if record exists
            existing = await self.get_by_id(id)
            if not existing:
                return None
            
            result = await self.client.update_record(self.table_name, id, update_data)
            return self._record_class(**result)
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to update {self.table_name} record: {str(e)}",
                "UPDATE_FAILED",
                "update",
                e
            )
    
    async def delete(self, id: str) -> bool:
        """Delete a record by ID"""
        try:
            if not id:
                raise self._create_error(
                    f"{self.table_name} ID is required",
                    "MISSING_ID",
                    "delete"
                )
            
            return await self.client.delete_record(self.table_name, id)
            
        except Exception as e:
            raise self._create_error(
                f"Failed to delete {self.table_name} record: {str(e)}",
                "DELETE_FAILED",
                "delete",
                e
            )
    
    async def search(
        self,
        query: str,
        fuzziness: int = 1,
        prefix: str = "phrase",
        target: Optional[List[str]] = None,
        filter_params: Optional[Dict[str, Any]] = None,
        size: int = 20
    ) -> List[T]:
        """Full-text search records"""
        try:
            if not query or not query.strip():
                raise self._create_error(
                    "Search query is required",
                    "MISSING_QUERY",
                    "search"
                )
            
            result = await self.client.search_records(
                self.table_name,
                query=query.strip(),
                fuzziness=fuzziness,
                prefix=prefix,
                target=target,
                filter_params=filter_params,
                size=size
            )
            
            records = result.get("records", [])
            return [self._record_class(**record) for record in records]
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to search {self.table_name} records: {str(e)}",
                "SEARCH_FAILED",
                "search",
                e
            )
    
    async def vector_search(
        self,
        embedding: List[float],
        column: str = "embedding",
        max_results: int = 10,
        filter_params: Optional[Dict[str, Any]] = None
    ) -> List[T]:
        """Semantic search using vector embeddings"""
        try:
            if not embedding or len(embedding) != 1536:
                raise self._create_error(
                    "Valid embedding vector with 1536 dimensions is required",
                    "INVALID_EMBEDDING",
                    "vector_search"
                )
            
            result = await self.client.vector_search(
                self.table_name,
                column=column,
                query_vector=embedding,
                size=max_results,
                filter_params=filter_params
            )
            
            records = result.get("records", [])
            return [self._record_class(**record) for record in records]
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed in vector search of {self.table_name} records: {str(e)}",
                "VECTOR_SEARCH_FAILED",
                "vector_search",
                e
            )
    
    async def create_many(self, data: List[CreateT]) -> List[T]:
        """Create multiple records"""
        try:
            if not data:
                raise self._create_error(
                    "Data must be a non-empty list",
                    "INVALID_INPUT",
                    "create_many"
                )
            
            # Validate all records
            for i, item in enumerate(data):
                await self._validate_create_data(item, index=i)
            
            # Convert to dict format
            records_data = [item.model_dump(exclude_none=True) for item in data]
            
            result = await self.client.create_multiple_records(self.table_name, records_data)
            
            return [self._record_class(**record) for record in result]
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to create multiple {self.table_name} records: {str(e)}",
                "BULK_CREATE_FAILED",
                "create_many",
                e
            )
    
    async def delete_many(self, filter_params: Dict[str, Any]) -> int:
        """Delete multiple records matching filter"""
        try:
            if not filter_params:
                raise self._create_error(
                    "Filter criteria is required",
                    "MISSING_FILTER",
                    "delete_many"
                )
            
            # Get records to delete
            records = await self.get_all(QueryOptions(filter=filter_params))
            
            if not records:
                return 0
            
            # Delete each record
            deleted_count = 0
            for record in records:
                if await self.delete(record.id):
                    deleted_count += 1
            
            return deleted_count
            
        except Exception as e:
            if isinstance(e, DatabaseOperationError):
                raise e
            
            raise self._create_error(
                f"Failed to delete multiple {self.table_name} records: {str(e)}",
                "BULK_DELETE_FAILED",
                "delete_many",
                e
            )
    
    async def _validate_create_data(self, data: CreateT, index: Optional[int] = None) -> None:
        """Validate data before creation - to be overridden by subclasses"""
        pass