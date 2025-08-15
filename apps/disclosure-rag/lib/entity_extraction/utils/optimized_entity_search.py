#!/usr/bin/env python3
"""
Optimized Entity Search Utility
Provides high-performance batch search with caching, error handling, and fallback strategies
Date: August 15, 2025
"""

import asyncio
import hashlib
import json
import logging
from typing import Dict, List, Any, Optional, Set
from datetime import datetime, timedelta
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class SearchResult:
    """Structured search result"""
    entity_name: str
    status: str  # 'found', 'not_found', 'error'
    xata_record: Optional[Dict[str, Any]] = None
    xata_id: Optional[str] = None
    table: Optional[str] = None
    action_needed: Optional[str] = None
    error: Optional[str] = None
    confidence_score: float = 0.0
    search_method: str = "unknown"


class EntitySearchCache:
    """In-memory cache with disk persistence for entity search results"""
    
    def __init__(self, cache_dir: Optional[str] = None, ttl_hours: int = 24):
        self.cache_dir = Path(cache_dir) if cache_dir else Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(exist_ok=True)
        self.ttl_hours = ttl_hours
        self._memory_cache: Dict[str, Dict] = {}
        self._load_disk_cache()
    
    def _generate_cache_key(self, entity_type: str, entity_names: List[str]) -> str:
        """Generate a cache key for the search request"""
        content = f"{entity_type}:{sorted(entity_names)}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def _load_disk_cache(self):
        """Load cache from disk on startup"""
        cache_file = self.cache_dir / "entity_search_cache.json"
        if cache_file.exists():
            try:
                with open(cache_file, 'r') as f:
                    disk_cache = json.load(f)
                    
                # Filter out expired entries
                now = datetime.now()
                for key, value in disk_cache.items():
                    if 'timestamp' in value:
                        cache_time = datetime.fromisoformat(value['timestamp'])
                        if now - cache_time < timedelta(hours=self.ttl_hours):
                            self._memory_cache[key] = value
                            
                logger.info(f"Loaded {len(self._memory_cache)} cached search results")
            except Exception as e:
                logger.warning(f"Failed to load cache from disk: {e}")
    
    def _save_disk_cache(self):
        """Persist cache to disk"""
        cache_file = self.cache_dir / "entity_search_cache.json"
        try:
            with open(cache_file, 'w') as f:
                json.dump(self._memory_cache, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to save cache to disk: {e}")
    
    def get(self, entity_type: str, entity_names: List[str]) -> Optional[List[SearchResult]]:
        """Get cached search results"""
        cache_key = self._generate_cache_key(entity_type, entity_names)
        
        if cache_key in self._memory_cache:
            cached_data = self._memory_cache[cache_key]
            
            # Check TTL
            cache_time = datetime.fromisoformat(cached_data['timestamp'])
            if datetime.now() - cache_time < timedelta(hours=self.ttl_hours):
                # Convert dict back to SearchResult objects
                results = []
                for result_data in cached_data['results']:
                    results.append(SearchResult(**result_data))
                logger.debug(f"Cache hit for {entity_type} with {len(entity_names)} entities")
                return results
            else:
                # Remove expired entry
                del self._memory_cache[cache_key]
        
        return None
    
    def set(self, entity_type: str, entity_names: List[str], results: List[SearchResult]):
        """Cache search results"""
        cache_key = self._generate_cache_key(entity_type, entity_names)
        
        # Convert SearchResult objects to dicts for JSON serialization
        results_data = []
        for result in results:
            result_dict = {
                'entity_name': result.entity_name,
                'status': result.status,
                'xata_record': result.xata_record,
                'xata_id': result.xata_id,
                'table': result.table,
                'action_needed': result.action_needed,
                'error': result.error,
                'confidence_score': result.confidence_score,
                'search_method': result.search_method
            }
            results_data.append(result_dict)
        
        self._memory_cache[cache_key] = {
            'timestamp': datetime.now().isoformat(),
            'results': results_data
        }
        
        # Periodically save to disk
        if len(self._memory_cache) % 10 == 0:
            self._save_disk_cache()
        
        logger.debug(f"Cached results for {entity_type} with {len(entity_names)} entities")
    
    def clear_expired(self):
        """Remove expired cache entries"""
        now = datetime.now()
        expired_keys = []
        
        for key, value in self._memory_cache.items():
            if 'timestamp' in value:
                cache_time = datetime.fromisoformat(value['timestamp'])
                if now - cache_time >= timedelta(hours=self.ttl_hours):
                    expired_keys.append(key)
        
        for key in expired_keys:
            del self._memory_cache[key]
        
        if expired_keys:
            logger.info(f"Removed {len(expired_keys)} expired cache entries")
            self._save_disk_cache()


class OptimizedEntitySearch:
    """High-performance entity search with multiple strategies and fallbacks"""
    
    def __init__(self, xata_client=None, cache_ttl_hours: int = 24):
        self.xata_client = xata_client
        self.cache = EntitySearchCache(ttl_hours=cache_ttl_hours)
        self.table_mappings = {
            "topics": "topics",
            "personnel": "personnel", 
            "events": "events",
            "organizations": "organizations",
            "locations": "locations",
            "testimonies": "testimonies",
            "documents": "documents",
            "sightings": "sightings",
            "artifacts": "artifacts",
            "key-figures": "key-figures",
            "files": "documents"
        }
        
        # Performance metrics
        self.search_stats = {
            "total_searches": 0,
            "cache_hits": 0,
            "batch_searches": 0,
            "fallback_searches": 0,
            "errors": 0
        }
    
    async def search_entities_optimized(
        self, 
        entities_by_type: Dict[str, List[str]],
        use_vector_search: bool = False,
        confidence_threshold: float = 0.7
    ) -> Dict[str, List[SearchResult]]:
        """
        Optimized entity search with multiple strategies
        
        Args:
            entities_by_type: Dictionary mapping entity types to lists of entity names
            use_vector_search: Whether to use vector search for fuzzy matching
            confidence_threshold: Minimum confidence score for matches
            
        Returns:
            Dictionary mapping entity types to search results
        """
        search_results = {}
        
        if not self.xata_client:
            logger.warning("No Xata client available")
            return search_results
        
        for entity_type, entity_names in entities_by_type.items():
            if not entity_names:
                search_results[entity_type] = []
                continue
            
            # Check cache first
            cached_results = self.cache.get(entity_type, entity_names)
            if cached_results:
                search_results[entity_type] = cached_results
                self.search_stats["cache_hits"] += 1
                continue
            
            # Perform search
            try:
                results = await self._search_entity_type_optimized(
                    entity_type, entity_names, use_vector_search, confidence_threshold
                )
                search_results[entity_type] = results
                
                # Cache the results
                self.cache.set(entity_type, entity_names, results)
                self.search_stats["total_searches"] += 1
                
            except Exception as e:
                logger.error(f"Search failed for {entity_type}: {e}")
                self.search_stats["errors"] += 1
                
                # Return error results
                error_results = []
                for entity_name in entity_names:
                    error_results.append(SearchResult(
                        entity_name=entity_name,
                        status="error",
                        error=str(e),
                        table=self.table_mappings.get(entity_type),
                        search_method="error"
                    ))
                search_results[entity_type] = error_results
        
        return search_results
    
    async def _search_entity_type_optimized(
        self,
        entity_type: str,
        entity_names: List[str],
        use_vector_search: bool,
        confidence_threshold: float
    ) -> List[SearchResult]:
        """Search for entities of a specific type with optimization strategies"""
        
        table_name = self.table_mappings.get(entity_type)
        if not table_name:
            logger.error(f"Unknown entity type: {entity_type}")
            return []
        
        results = []
        
        # Deduplicate and normalize entity names
        normalized_names = list(set(self._normalize_entity_name(name) for name in entity_names))
        
        try:
            # Strategy 1: Batch exact match search
            batch_results = await self._batch_exact_search(table_name, normalized_names)
            found_names = set()
            
            for result in batch_results:
                best_match = self._find_best_name_match(
                    result.get("name", ""), entity_names
                )
                if best_match:
                    results.append(SearchResult(
                        entity_name=best_match,
                        status="found",
                        xata_record=result,
                        xata_id=result.get("id"),
                        table=table_name,
                        confidence_score=1.0,
                        search_method="batch_exact"
                    ))
                    found_names.add(best_match)
            
            # Strategy 2: Fuzzy search for remaining entities
            remaining_names = [name for name in entity_names if name not in found_names]
            if remaining_names and use_vector_search:
                fuzzy_results = await self._fuzzy_search(
                    table_name, remaining_names, confidence_threshold
                )
                results.extend(fuzzy_results)
                found_names.update(result.entity_name for result in fuzzy_results if result.status == "found")
            
            # Strategy 3: Mark remaining as not found
            final_remaining = [name for name in entity_names if name not in found_names]
            for entity_name in final_remaining:
                results.append(SearchResult(
                    entity_name=entity_name,
                    status="not_found",
                    table=table_name,
                    action_needed="create_new",
                    search_method="not_found"
                ))
            
            self.search_stats["batch_searches"] += 1
            
        except Exception as e:
            # Fallback to individual searches
            logger.warning(f"Batch search failed for {entity_type}, using fallback: {e}")
            results = await self._fallback_individual_search(table_name, entity_names)
            self.search_stats["fallback_searches"] += 1
        
        return results
    
    async def _batch_exact_search(self, table_name: str, entity_names: List[str]) -> List[Dict[str, Any]]:
        """Perform batch exact match search"""
        if hasattr(self.xata_client, 'data'):
            search_query = {
                "filter": {
                    "name": {
                        "$any": entity_names
                    }
                },
                "size": len(entity_names) * 2
            }
            
            response = await self.xata_client.data().search_async(table_name, search_query)
            return response.get("records", [])
        else:
            # Fallback to query_records
            response = await self.xata_client.query_records(
                table=table_name,
                filter_params={
                    "name": {"$any": entity_names}
                },
                size=len(entity_names) * 2
            )
            return response.get("records", [])
    
    async def _fuzzy_search(
        self, 
        table_name: str, 
        entity_names: List[str], 
        confidence_threshold: float
    ) -> List[SearchResult]:
        """Perform fuzzy search using vector or keyword search"""
        results = []
        
        for entity_name in entity_names:
            try:
                # Use search_records for fuzzy matching
                response = await self.xata_client.search_records(
                    table=table_name,
                    query=entity_name,
                    target=["name"],
                    fuzziness=2,
                    size=3
                )
                
                best_match = None
                best_score = 0.0
                
                for record in response.get("records", []):
                    # Calculate similarity score (simplified)
                    record_name = record.get("name", "")
                    score = self._calculate_similarity(entity_name, record_name)
                    
                    if score > best_score and score >= confidence_threshold:
                        best_match = record
                        best_score = score
                
                if best_match:
                    results.append(SearchResult(
                        entity_name=entity_name,
                        status="found",
                        xata_record=best_match,
                        xata_id=best_match.get("id"),
                        table=table_name,
                        confidence_score=best_score,
                        search_method="fuzzy"
                    ))
                else:
                    results.append(SearchResult(
                        entity_name=entity_name,
                        status="not_found",
                        table=table_name,
                        action_needed="create_new",
                        confidence_score=best_score,
                        search_method="fuzzy_no_match"
                    ))
                    
            except Exception as e:
                logger.error(f"Fuzzy search error for {entity_name}: {e}")
                results.append(SearchResult(
                    entity_name=entity_name,
                    status="error",
                    error=str(e),
                    table=table_name,
                    search_method="fuzzy_error"
                ))
        
        return results
    
    async def _fallback_individual_search(
        self, table_name: str, entity_names: List[str]
    ) -> List[SearchResult]:
        """Fallback to individual entity searches"""
        results = []
        
        for entity_name in entity_names:
            try:
                response = await self.xata_client.search_records(
                    table=table_name,
                    query=entity_name,
                    target=["name"],
                    size=1
                )
                
                if response.get("records"):
                    record = response["records"][0]
                    results.append(SearchResult(
                        entity_name=entity_name,
                        status="found",
                        xata_record=record,
                        xata_id=record.get("id"),
                        table=table_name,
                        confidence_score=0.8,
                        search_method="fallback_individual"
                    ))
                else:
                    results.append(SearchResult(
                        entity_name=entity_name,
                        status="not_found",
                        table=table_name,
                        action_needed="create_new",
                        search_method="fallback_not_found"
                    ))
                    
            except Exception as e:
                logger.error(f"Individual search error for {entity_name}: {e}")
                results.append(SearchResult(
                    entity_name=entity_name,
                    status="error",
                    error=str(e),
                    table=table_name,
                    search_method="fallback_error"
                ))
        
        return results
    
    def _normalize_entity_name(self, name: str) -> str:
        """Normalize entity name for better matching"""
        return name.strip().lower()
    
    def _find_best_name_match(self, record_name: str, entity_names: List[str]) -> Optional[str]:
        """Find the best matching entity name for a database record"""
        record_name_lower = record_name.lower().strip()
        
        # Exact match
        for entity_name in entity_names:
            if entity_name.lower().strip() == record_name_lower:
                return entity_name
        
        # Fuzzy match (contains)
        for entity_name in entity_names:
            entity_lower = entity_name.lower().strip()
            if entity_lower in record_name_lower or record_name_lower in entity_lower:
                return entity_name
        
        return None
    
    def _calculate_similarity(self, name1: str, name2: str) -> float:
        """Calculate similarity score between two names (simplified)"""
        name1_clean = name1.lower().strip()
        name2_clean = name2.lower().strip()
        
        if name1_clean == name2_clean:
            return 1.0
        
        # Simple containment-based similarity
        if name1_clean in name2_clean or name2_clean in name1_clean:
            longer = max(len(name1_clean), len(name2_clean))
            shorter = min(len(name1_clean), len(name2_clean))
            return shorter / longer
        
        # Token-based similarity (simplified)
        tokens1 = set(name1_clean.split())
        tokens2 = set(name2_clean.split())
        
        if not tokens1 or not tokens2:
            return 0.0
        
        intersection = len(tokens1.intersection(tokens2))
        union = len(tokens1.union(tokens2))
        
        return intersection / union if union > 0 else 0.0
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        total_ops = self.search_stats["total_searches"] + self.search_stats["cache_hits"]
        cache_hit_rate = (self.search_stats["cache_hits"] / total_ops * 100) if total_ops > 0 else 0
        
        return {
            **self.search_stats,
            "cache_hit_rate_percent": round(cache_hit_rate, 2),
            "total_operations": total_ops
        }
    
    def clear_cache(self):
        """Clear the search cache"""
        self.cache._memory_cache.clear()
        self.cache._save_disk_cache()
        logger.info("Search cache cleared")