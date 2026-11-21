// Knowledge source types
export enum KnowledgeSources {
  LOCAL = 'local',
  VECTOR = 'vector',
  R2R = 'r2r',
  DATABASE = 'database'
}

// Base knowledge item interface
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  contentType: string; // 'text', 'pdf', 'html', etc.
  source: string; // URL, file path, etc.
  sourceType: KnowledgeSources;
  metadata: Record<string, any>;
  vector?: EmbeddingVector;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Vector embedding type
export type EmbeddingVector = number[];

// Search options
export interface SearchOptions {
  sources?: KnowledgeSources[];
  limit?: number;
  filters?: {
    contentType?: string[];
    tags?: string[];
    dateRange?: {
      start?: string;
      end?: string;
    };
    metadata?: Record<string, any>;
  };
  semanticSearch?: boolean;
}

// Knowledge source interface
export interface KnowledgeSource {
  listItems(): Promise<KnowledgeItem[]>;
  getItem(id: string): Promise<KnowledgeItem | null>;
  search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]>;
  createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem>;
  updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem>;
  deleteItem(id: string): Promise<boolean>;
}