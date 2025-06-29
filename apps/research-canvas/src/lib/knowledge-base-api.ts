// Knowledge Base API Client - TypeScript functions
// Integrates research-canvas with the disclosure-rag knowledge base API

export interface DocumentSummary {
  id: string;
  title: string;
  doc_type: string;
  path: string;
  modified: string;
  file_type: string;
  tags: string[];
  size_mb?: number;
  size_kb?: number;
  category?: string;
  topic?: string;
  date_folder?: string;
}

export interface DocumentDetail extends DocumentSummary {
  source: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  content?: string;
  content_preview?: string;
}

export interface KnowledgeBaseStats {
  total_documents: number;
  documents_by_type: Record<string, number>;
  total_tags: number;
  popular_tags: [string, number][];
  last_updated: string;
  file_distribution: Record<string, number>;
  total_size_mb: number;
}

export interface SearchResults {
  query: string;
  total_results: number;
  documents: DocumentSummary[];
  facets: Record<string, Record<string, number>>;
}

export interface Tag {
  tag: string;
  count: number;
}

export interface Categories {
  case_file_categories: Record<string, number>;
  transcript_topics: Record<string, number>;
  file_types: Record<string, number>;
}

// Get API base URL from environment or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_KNOWLEDGE_BASE_API_URL || 'http://localhost:8000';

const fetchApi = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// API Functions
export const getStats = (): Promise<KnowledgeBaseStats> => {
  return fetchApi('/stats');
};

export const getDocuments = async (params: {
  docType?: string;
  tags?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<DocumentSummary[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.docType) searchParams.append('doc_type', params.docType);
  if (params.tags) searchParams.append('tags', params.tags);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());

  return fetchApi(`/documents?${searchParams}`);
};

export const getDocument = (documentId: string): Promise<DocumentDetail> => {
  return fetchApi(`/documents/${documentId}`);
};

export const searchDocuments = async (params: {
  query: string;
  docType?: string;
  tags?: string;
  limit?: number;
}): Promise<SearchResults> => {
  const searchParams = new URLSearchParams();
  
  searchParams.append('q', params.query);
  if (params.docType) searchParams.append('doc_type', params.docType);
  if (params.tags) searchParams.append('tags', params.tags);
  if (params.limit) searchParams.append('limit', params.limit.toString());

  return fetchApi(`/search?${searchParams}`);
};

export const getTags = async (): Promise<{ tags: Tag[] }> => {
  return fetchApi('/tags');
};

export const getCategories = (): Promise<Categories> => {
  return fetchApi('/categories');
};

export const healthCheck = (): Promise<{
  status: string;
  timestamp: string;
  index_loaded: boolean;
  crud_available: boolean;
}> => {
  return fetchApi('/health');
};