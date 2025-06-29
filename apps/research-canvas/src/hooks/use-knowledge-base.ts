// React hooks for Knowledge Base data
// Custom hooks for fetching and managing knowledge base data

import { useState, useEffect, useCallback } from 'react';
import { 
  getStats, 
  getDocuments, 
  searchDocuments, 
  getTags, 
  getCategories,
  type KnowledgeBaseStats,
  type DocumentSummary,
  type SearchResults,
  type Tag,
  type Categories
} from '../lib/knowledge-base-api';

// Hook for knowledge base statistics
export const useKnowledgeBaseStats = () => {
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook for documents with pagination and filtering
export const useDocuments = (initialParams: {
  docType?: string;
  tags?: string;
  limit?: number;
} = {}) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadDocuments = useCallback(async (
    params: typeof initialParams = initialParams,
    reset = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentOffset = reset ? 0 : offset;
      const data = await getDocuments({
        ...params,
        offset: currentOffset,
        limit: params.limit || 20
      });

      if (reset) {
        setDocuments(data);
        setOffset(data.length);
      } else {
        setDocuments(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
      }

      setHasMore(data.length === (params.limit || 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [offset, initialParams]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadDocuments();
    }
  }, [loadDocuments, loading, hasMore]);

  const refresh = useCallback((newParams?: typeof initialParams) => {
    setOffset(0);
    loadDocuments(newParams || initialParams, true);
  }, [loadDocuments, initialParams]);

  useEffect(() => {
    refresh();
  }, []);

  return {
    documents,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};

// Hook for search functionality
export const useSearch = () => {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: {
    query: string;
    docType?: string;
    tags?: string;
    limit?: number;
  }) => {
    if (!params.query.trim()) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchDocuments(params);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};

// Hook for tags
export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTags();
      setTags(data.tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, error, refetch: fetchTags };
};

// Hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Categories | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};