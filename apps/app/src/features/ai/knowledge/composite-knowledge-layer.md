# Composite Knowledge Layer Specification

## Overview

This document outlines the design and implementation of a unified data layer that seamlessly integrates multiple knowledge sources:

1. **Local Files** - PDFs/transcripts from `/packages/knowledge-base`
2. **OpenAI Vector Storage** - Embedding database via OpenAI API
3. **R2R Integration** - External RAG implementation (Read, Retrieve, Route)
4. **Existing Databases** - Current Xata and Supabase data stores

The goal is to create a consistent interface for the AI pipelines to interact with all knowledge sources through a single API, with automatic source selection, blending, and transformation capabilities.

## Architecture

![Knowledge Layer Architecture Diagram]

The architecture follows a layered approach:

1. **Data Source Adapters** - Interface with individual knowledge sources
2. **Unified Knowledge API** - Common interface for all knowledge operations
3. **Knowledge Context Provider** - React context for UI components
4. **Cross-Source Utilities** - Functions that work across multiple sources

## 1. Data Source Adapters

### 1.1 Local Files Adapter

```typescript
// src/features/ai/knowledge/adapters/local-files-adapter.ts

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { KnowledgeItem, KnowledgeSource } from '../types';

export class LocalFilesAdapter implements KnowledgeSource {
  private basePath: string;

  constructor(basePath = process.env.KNOWLEDGE_BASE_PATH || '/packages/knowledge-base') {
    this.basePath = basePath;
  }

  async listItems(): Promise<KnowledgeItem[]> {
    // Implementation to recursively list all files in the knowledge base
    // Transform file metadata to KnowledgeItem format
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    // Retrieve a specific file by ID
    // Parse content based on file type (PDF, text, etc.)
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    // Basic text search within file contents
    // Could use simple regex or integrate with a local search library
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Write a new file to the knowledge base directory
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Update an existing file
  }

  async deleteItem(id: string): Promise<boolean> {
    // Delete a file from the knowledge base
  }

  // Helper methods for file operations
  private async readFileContent(filePath: string): Promise<string> {
    // Read and parse file content based on extension
  }

  private generateId(filePath: string): string {
    // Create a consistent ID based on file path
    return createHash('md5').update(filePath).digest('hex');
  }
}
```

### 1.2 OpenAI Vector Adapter

```typescript
// src/features/ai/knowledge/adapters/openai-vector-adapter.ts

import { OpenAIClient } from '@/lib/openai';
import { KnowledgeItem, KnowledgeSource, EmbeddingVector } from '../types';

export class OpenAIVectorAdapter implements KnowledgeSource {
  private client: OpenAIClient;
  
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.client = new OpenAIClient(apiKey);
  }

  async listItems(): Promise<KnowledgeItem[]> {
    // List all vector entries from OpenAI
    // Transform to standard KnowledgeItem format
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    // Fetch specific vector entry by ID
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    // Convert query to embedding
    // Perform vector similarity search
    // Return matching items
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Generate embedding for item content
    // Store in OpenAI vector storage
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Update vector entry
  }

  async deleteItem(id: string): Promise<boolean> {
    // Delete vector entry
  }

  // Helper methods
  private async textToEmbedding(text: string): Promise<EmbeddingVector> {
    // Use OpenAI to convert text to vector embedding
  }
}
```

### 1.3 R2R Adapter

```typescript
// src/features/ai/knowledge/adapters/r2r-adapter.ts

import { R2RClient } from '@/lib/r2r/r2r-client';
import { KnowledgeItem, KnowledgeSource } from '../types';

export class R2RAdapter implements KnowledgeSource {
  private client: R2RClient;
  
  constructor(apiKey = process.env.R2R_API_KEY, apiUrl = process.env.R2R_API_URL) {
    this.client = new R2RClient(apiKey, apiUrl);
  }

  async listItems(): Promise<KnowledgeItem[]> {
    // List all documents from R2R
    // Transform to standard KnowledgeItem format
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    // Fetch specific document by ID
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    // Use R2R search capabilities
    // Return matching items
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Ingest document to R2R
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Update document in R2R
  }

  async deleteItem(id: string): Promise<boolean> {
    // Delete document from R2R
  }
}
```

### 1.4 Database Adapter (Xata/Supabase)

```typescript
// src/features/ai/knowledge/adapters/database-adapter.ts

import { DataStorage } from '@/lib/data/data-storage';
import { KnowledgeItem, KnowledgeSource } from '../types';

export class DatabaseAdapter implements KnowledgeSource {
  private storage: DataStorage;
  
  constructor() {
    this.storage = new DataStorage();
  }

  async listItems(): Promise<KnowledgeItem[]> {
    // List all knowledge items from database
    // Using the dual storage abstraction
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    // Fetch specific item by ID
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    // Search in database
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Create new item in database
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Update item in database
  }

  async deleteItem(id: string): Promise<boolean> {
    // Delete item from database
  }
}
```

## 2. Unified Knowledge API

```typescript
// src/features/ai/knowledge/unified-knowledge-api.ts

import { KnowledgeItem, KnowledgeSource, SearchOptions, KnowledgeSources } from './types';
import { LocalFilesAdapter } from './adapters/local-files-adapter';
import { OpenAIVectorAdapter } from './adapters/openai-vector-adapter';
import { R2RAdapter } from './adapters/r2r-adapter';
import { DatabaseAdapter } from './adapters/database-adapter';

export class UnifiedKnowledgeAPI {
  private sources: Record<KnowledgeSources, KnowledgeSource>;
  
  constructor() {
    this.sources = {
      [KnowledgeSources.LOCAL]: new LocalFilesAdapter(),
      [KnowledgeSources.VECTOR]: new OpenAIVectorAdapter(),
      [KnowledgeSources.R2R]: new R2RAdapter(),
      [KnowledgeSources.DATABASE]: new DatabaseAdapter(),
    };
  }

  async listItems(sources?: KnowledgeSources[]): Promise<KnowledgeItem[]> {
    // If sources specified, only query those
    const targetSources = sources || Object.values(KnowledgeSources);
    
    // Get items from all requested sources
    const itemPromises = targetSources.map(source => 
      this.sources[source].listItems().catch(err => {
        console.error(`Error fetching from ${source}:`, err);
        return [];
      })
    );
    
    // Combine results and deduplicate
    const allItems = (await Promise.all(itemPromises)).flat();
    return this.deduplicateItems(allItems);
  }

  async getItem(id: string, preferredSource?: KnowledgeSources): Promise<KnowledgeItem | null> {
    // If preferred source specified, try that first
    if (preferredSource) {
      const item = await this.sources[preferredSource].getItem(id).catch(() => null);
      if (item) return item;
    }
    
    // Otherwise try all sources in priority order
    for (const source of Object.values(KnowledgeSources)) {
      if (source === preferredSource) continue; // Skip if already tried
      
      const item = await this.sources[source].getItem(id).catch(() => null);
      if (item) return item;
    }
    
    return null;
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    // Determine which sources to search
    const targetSources = options?.sources || Object.values(KnowledgeSources);
    
    // Search in all requested sources
    const searchPromises = targetSources.map(source => 
      this.sources[source].search(query, options).catch(err => {
        console.error(`Error searching in ${source}:`, err);
        return [];
      })
    );
    
    // Combine, deduplicate, and rank results
    const allResults = (await Promise.all(searchPromises)).flat();
    const dedupedResults = this.deduplicateItems(allResults);
    
    return this.rankSearchResults(dedupedResults, query);
  }

  async createItem(item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]): Promise<KnowledgeItem> {
    // Determine target sources for creation
    const sources = targetSources || [KnowledgeSources.DATABASE]; // Default to database only
    
    // Create in all specified sources
    const createPromises = sources.map(source => 
      this.sources[source].createItem(item)
    );
    
    // Wait for all creations to complete
    const createdItems = await Promise.all(createPromises);
    
    // Return first created item (all should be essentially the same)
    return createdItems[0];
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]): Promise<KnowledgeItem> {
    // Similar to createItem but for updates
  }

  async deleteItem(id: string, targetSources?: KnowledgeSources[]): Promise<boolean> {
    // Similar to createItem but for deletion
  }

  // Cross-source operations
  
  async migrateItem(id: string, fromSource: KnowledgeSources, toSource: KnowledgeSources): Promise<KnowledgeItem> {
    // Copy item from one source to another
  }

  async syncSources(sources?: KnowledgeSources[]): Promise<void> {
    // Ensure specified sources have the same items
  }

  // Helper methods
  
  private deduplicateItems(items: KnowledgeItem[]): KnowledgeItem[] {
    // Remove duplicates based on content hash or other criteria
  }
  
  private rankSearchResults(items: KnowledgeItem[], query: string): KnowledgeItem[] {
    // Rank search results by relevance
  }
}
```

## 3. Knowledge Context Provider

```tsx
// src/features/ai/knowledge/KnowledgeContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UnifiedKnowledgeAPI } from './unified-knowledge-api';
import { KnowledgeItem, SearchOptions, KnowledgeSources } from './types';
import { useAssistantRuntime } from '@assistant-ui/react';

interface KnowledgeContextType {
  // State
  items: KnowledgeItem[];
  selectedItem: KnowledgeItem | null;
  isLoading: boolean;
  searchResults: KnowledgeItem[];
  
  // Actions
  listItems: (sources?: KnowledgeSources[]) => Promise<void>;
  getItem: (id: string, preferredSource?: KnowledgeSources) => Promise<KnowledgeItem | null>;
  search: (query: string, options?: SearchOptions) => Promise<KnowledgeItem[]>;
  createItem: (item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => Promise<KnowledgeItem>;
  updateItem: (id: string, item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => Promise<KnowledgeItem>;
  deleteItem: (id: string, targetSources?: KnowledgeSources[]) => Promise<boolean>;
  selectItem: (item: KnowledgeItem | null) => void;
  
  // Utilities
  getItemContent: (id: string) => Promise<string | null>;
  extractMetadata: (item: KnowledgeItem) => any;
  formatForPipeline: (item: KnowledgeItem, pipelineType: string) => any;
}

const KnowledgeContext = createContext<KnowledgeContextType | null>(null);

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const api = new UnifiedKnowledgeAPI();
  const assistantRuntime = useAssistantRuntime();
  
  // State
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([]);
  
  // Actions
  const listItems = useCallback(async (sources?: KnowledgeSources[]) => {
    setIsLoading(true);
    try {
      const fetchedItems = await api.listItems(sources);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error listing items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  const getItem = useCallback(async (id: string, preferredSource?: KnowledgeSources) => {
    setIsLoading(true);
    try {
      const item = await api.getItem(id, preferredSource);
      return item;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  const search = useCallback(async (query: string, options?: SearchOptions) => {
    setIsLoading(true);
    try {
      const results = await api.search(query, options);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  const createItem = useCallback(async (item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => {
    setIsLoading(true);
    try {
      const createdItem = await api.createItem(item, targetSources);
      setItems(prev => [...prev, createdItem]);
      return createdItem;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  const updateItem = useCallback(async (id: string, item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => {
    // Implementation
  }, [api]);
  
  const deleteItem = useCallback(async (id: string, targetSources?: KnowledgeSources[]) => {
    // Implementation
  }, [api]);
  
  const selectItem = useCallback((item: KnowledgeItem | null) => {
    setSelectedItem(item);
  }, []);
  
  // Utilities
  const getItemContent = useCallback(async (id: string) => {
    const item = await getItem(id);
    return item ? item.content : null;
  }, [getItem]);
  
  const extractMetadata = useCallback((item: KnowledgeItem) => {
    // Extract and normalize metadata from item
  }, []);
  
  const formatForPipeline = useCallback((item: KnowledgeItem, pipelineType: string) => {
    // Format item for specific pipeline type
    switch (pipelineType) {
      case 'document':
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          // Document pipeline specific formatting
        };
      case 'web':
        return {
          url: item.source,
          content: item.content,
          // Web pipeline specific formatting
        };
      case 'agent':
        return {
          context: item.content,
          metadata: extractMetadata(item),
          // Agent pipeline specific formatting
        };
      default:
        return item;
    }
  }, [extractMetadata]);
  
  // Register with AI Assistant
  useEffect(() => {
    const unregisterFunctions = assistantRuntime.registerFunctions({
      searchKnowledge: async (query: string) => {
        const results = await search(query);
        return {
          count: results.length,
          results: results.map(r => ({
            id: r.id,
            title: r.title,
            summary: r.summary || r.content?.substring(0, 200),
            source: r.source
          }))
        };
      },
      getKnowledgeItem: async (id: string) => {
        const item = await getItem(id);
        return item ? {
          id: item.id,
          title: item.title,
          content: item.content,
          source: item.source
        } : null;
      }
    });
    
    const unregisterContext = assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `
          # Knowledge Context
          
          Available knowledge sources:
          - Local files: ${items.filter(i => i.sourceType === KnowledgeSources.LOCAL).length} items
          - Vector database: ${items.filter(i => i.sourceType === KnowledgeSources.VECTOR).length} items
          - R2R: ${items.filter(i => i.sourceType === KnowledgeSources.R2R).length} items
          - Database: ${items.filter(i => i.sourceType === KnowledgeSources.DATABASE).length} items
          
          ${selectedItem ? `
          Currently selected item:
          - ID: ${selectedItem.id}
          - Title: ${selectedItem.title}
          - Source: ${selectedItem.source}
          - Type: ${selectedItem.sourceType}
          ` : 'No item currently selected'}
          
          You can search the knowledge base using the searchKnowledge function,
          and retrieve specific items using the getKnowledgeItem function.
        `
      })
    });
    
    return () => {
      unregisterFunctions();
      unregisterContext();
    };
  }, [assistantRuntime, search, getItem, items, selectedItem]);
  
  // Initial load
  useEffect(() => {
    listItems();
  }, [listItems]);
  
  const contextValue: KnowledgeContextType = {
    // State
    items,
    selectedItem,
    isLoading,
    searchResults,
    
    // Actions
    listItems,
    getItem,
    search,
    createItem,
    updateItem,
    deleteItem,
    selectItem,
    
    // Utilities
    getItemContent,
    extractMetadata,
    formatForPipeline
  };
  
  return (
    <KnowledgeContext.Provider value={contextValue}>
      {children}
    </KnowledgeContext.Provider>
  );
}

export function useKnowledge() {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider');
  }
  return context;
}
```

## 4. Type Definitions

```typescript
// src/features/ai/knowledge/types.ts

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
```

## 5. Cross-Source Utilities

```typescript
// src/features/ai/knowledge/utilities.ts

import { KnowledgeItem } from './types';

// Content extraction based on file type
export function extractContent(item: KnowledgeItem): Promise<string> {
  // Extract content based on item.contentType
  // Handle PDFs, HTML, plain text, etc.
}

// Content chunking for large documents
export function chunkContent(content: string, chunkSize = 1000, overlap = 200): string[] {
  // Split content into chunks with overlap
}

// Content transformation utilities
export function htmlToMarkdown(html: string): string {
  // Convert HTML to markdown
}

export function markdownToText(markdown: string): string {
  // Convert markdown to plain text
}

// Metadata extraction
export function extractMetadataFromContent(content: string, contentType: string): Record<string, any> {
  // Extract metadata based on content type
  // For PDF, extract title, author, etc.
  // For HTML, extract meta tags, etc.
}

// File type detection
export function detectFileType(filename: string, content?: string): string {
  // Detect file type based on extension and content
}

// Content comparison
export function compareContent(item1: KnowledgeItem, item2: KnowledgeItem): number {
  // Compare content similarity between two items
}

// Content validation
export function validateContent(content: string, contentType: string): boolean {
  // Validate content based on type
}
```

## 6. UI Components

### 6.1 Knowledge Picker

```tsx
// src/features/ai/knowledge/components/KnowledgePicker.tsx

import React, { useState, useEffect } from 'react';
import { useKnowledge } from '../KnowledgeContext';
import { KnowledgeItem, KnowledgeSources } from '../types';

interface KnowledgePickerProps {
  onSelect?: (item: KnowledgeItem) => void;
  filter?: {
    sources?: KnowledgeSources[];
    contentTypes?: string[];
    tags?: string[];
  };
  multiSelect?: boolean;
}

export function KnowledgePicker({ onSelect, filter, multiSelect = false }: KnowledgePickerProps) {
  const { items, listItems, search, selectItem } = useKnowledge();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<KnowledgeItem[]>([]);
  const [activeSource, setActiveSource] = useState<KnowledgeSources | 'all'>('all');
  
  // Filter items based on props and active source
  const filteredItems = items.filter(item => {
    if (activeSource !== 'all' && item.sourceType !== activeSource) return false;
    if (filter?.sources && !filter.sources.includes(item.sourceType)) return false;
    if (filter?.contentTypes && !filter.contentTypes.includes(item.contentType)) return false;
    if (filter?.tags && item.tags && !item.tags.some(tag => filter.tags?.includes(tag))) return false;
    return true;
  });
  
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await listItems();
      return;
    }
    
    await search(searchQuery, {
      sources: filter?.sources || Object.values(KnowledgeSources)
    });
  };
  
  // Handle item selection
  const handleSelectItem = (item: KnowledgeItem) => {
    if (multiSelect) {
      // Toggle selection in multi-select mode
      const isSelected = selectedItems.some(i => i.id === item.id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(i => i.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      // Single select mode
      selectItem(item);
      if (onSelect) onSelect(item);
    }
  };
  
  // Group items by source type
  const itemsBySource = Object.values(KnowledgeSources).reduce((acc, source) => {
    acc[source] = filteredItems.filter(item => item.sourceType === source);
    return acc;
  }, {} as Record<KnowledgeSources, KnowledgeItem[]>);
  
  return (
    <div className="knowledge-picker">
      <div className="search-bar">
        <input 
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search knowledge..."
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      
      <div className="source-tabs mt-4">
        <button 
          onClick={() => setActiveSource('all')}
          className={`px-3 py-1 mr-2 rounded ${activeSource === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Sources
        </button>
        {Object.values(KnowledgeSources).map(source => (
          <button
            key={source}
            onClick={() => setActiveSource(source)}
            className={`px-3 py-1 mr-2 rounded ${activeSource === source ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {source.charAt(0).toUpperCase() + source.slice(1)} 
            ({itemsBySource[source].length})
          </button>
        ))}
      </div>
      
      <div className="items-list mt-4 max-h-80 overflow-y-auto">
        {activeSource === 'all' ? (
          // All sources
          Object.entries(itemsBySource).map(([source, sourceItems]) => (
            <div key={source} className="source-group mb-4">
              <h3 className="text-lg font-medium mb-2">
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </h3>
              {sourceItems.length === 0 ? (
                <p className="text-gray-500">No items found</p>
              ) : (
                <ul className="space-y-2">
                  {sourceItems.map(item => (
                    <li 
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-2 border rounded cursor-pointer hover:bg-gray-50 
                        ${selectedItems.some(i => i.id === item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.summary || item.content.substring(0, 100)}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.contentType} • {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          // Single source
          <ul className="space-y-2">
            {itemsBySource[activeSource as KnowledgeSources].map(item => (
              <li 
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-50 
                  ${selectedItems.some(i => i.id === item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-500">{item.summary || item.content.substring(0, 100)}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {item.contentType} • {new Date(item.updatedAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {multiSelect && (
        <div className="selected-items mt-4">
          <h3 className="text-lg font-medium mb-2">Selected Items ({selectedItems.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(item => (
              <div 
                key={item.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"
              >
                <span className="mr-1">{item.title}</span>
                <button 
                  onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}
                  className="text-blue-500 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => {
              if (onSelect && selectedItems.length > 0) {
                // If multi-select with callback, pass all selected items
                onSelect(selectedItems[0]); // This needs adaptation in the parent component
              }
            }}
            disabled={selectedItems.length === 0}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Use Selected
          </button>
        </div>
      )}
    </div>
  );
}
```

### 6.2 Knowledge Viewer

```tsx
// src/features/ai/knowledge/components/KnowledgeViewer.tsx

import React from 'react';
import { useKnowledge } from '../KnowledgeContext';
import { KnowledgeItem, KnowledgeSources } from '../types';
import { markdownToText, htmlToMarkdown } from '../utilities';

interface KnowledgeViewerProps {
  item?: KnowledgeItem;
  itemId?: string;
}

export function KnowledgeViewer({ item: propItem, itemId }: KnowledgeViewerProps) {
  const { selectedItem, getItem } = useKnowledge();
  const [item, setItem] = React.useState<KnowledgeItem | null>(propItem || selectedItem);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Fetch item if not provided and itemId is specified
  React.useEffect(() => {
    if (!propItem && !selectedItem && itemId) {
      setIsLoading(true);
      getItem(itemId)
        .then(fetchedItem => {
          if (fetchedItem) {
            setItem(fetchedItem);
          } else {
            setError(`Item with ID ${itemId} not found`);
          }
        })
        .catch(err => {
          setError(`Error fetching item: ${err.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [propItem, selectedItem, itemId, getItem]);
  
  // Update item when propItem or selectedItem changes
  React.useEffect(() => {
    setItem(propItem || selectedItem);
  }, [propItem, selectedItem]);
  
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  
  if (!item) {
    return <div className="p-4 text-gray-500">No item selected</div>;
  }
  
  // Render content based on content type
  const renderContent = () => {
    switch (item.contentType) {
      case 'pdf':
        return (
          <div className="pdf-viewer">
            <iframe 
              src={`data:application/pdf;base64,${btoa(item.content)}`}
              className="w-full h-[500px] border"
            />
          </div>
        );
      case 'html':
        return (
          <div className="html-viewer">
            <div 
              dangerouslySetInnerHTML={{ __html: item.content }} 
              className="prose max-w-none"
            />
          </div>
        );
      case 'markdown':
        return (
          <div className="markdown-viewer prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }} />
          </div>
        );
      default:
        return (
          <div className="text-viewer whitespace-pre-wrap font-mono text-sm">
            {item.content}
          </div>
        );
    }
  };
  
  // Helper function to convert markdown to HTML
  function markdownToHtml(markdown: string): string {
    // This would use a markdown library like marked or remark
    // For simplicity, returning as-is
    return markdown;
  }
  
  return (
    <div className="knowledge-viewer border rounded-lg overflow-hidden">
      <div className="header bg-gray-100 p-4 border-b">
        <h2 className="text-xl font-medium">{item.title}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span className="mr-4">
            Source: {sourceTypeToLabel(item.sourceType)}
          </span>
          <span className="mr-4">
            Type: {item.contentType.toUpperCase()}
          </span>
          <span>
            Updated: {new Date(item.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="content p-4">
        {renderContent()}
      </div>
      
      {item.metadata && Object.keys(item.metadata).length > 0 && (
        <div className="metadata border-t p-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Metadata</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(item.metadata).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt className="text-gray-600 font-medium">{key}</dt>
                <dd className="text-gray-800">{String(value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

// Helper function to convert source type to display label
function sourceTypeToLabel(sourceType: KnowledgeSources): string {
  switch (sourceType) {
    case KnowledgeSources.LOCAL:
      return 'Local Files';
    case KnowledgeSources.VECTOR:
      return 'Vector Database';
    case KnowledgeSources.R2R:
      return 'R2R';
    case KnowledgeSources.DATABASE:
      return 'Database';
    default:
      return String(sourceType);
  }
}
```

## 7. Integration with Unified Pipeline Interface

```tsx
// src/features/ai/pipelines/unified/KnowledgeEnabledPipeline.tsx

import React from 'react';
import { UnifiedPipelineInterface } from './UnifiedPipelineInterface';
import { KnowledgeProvider } from '../../knowledge/KnowledgeContext';
import { KnowledgePicker } from '../../knowledge/components/KnowledgePicker';
import { KnowledgeViewer } from '../../knowledge/components/KnowledgeViewer';
import { KnowledgeItem } from '../../knowledge/types';

export function KnowledgeEnabledPipeline() {
  const [selectedKnowledge, setSelectedKnowledge] = React.useState<KnowledgeItem | null>(null);
  
  return (
    <KnowledgeProvider>
      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar with knowledge picker */}
        <div className="col-span-1 border-r pr-4">
          <h2 className="text-xl font-medium mb-4">Knowledge Base</h2>
          <KnowledgePicker onSelect={setSelectedKnowledge} />
        </div>
        
        {/* Main content area */}
        <div className="col-span-3">
          {selectedKnowledge ? (
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">Selected Knowledge</h2>
              <KnowledgeViewer item={selectedKnowledge} />
              <div className="mt-4 flex justify-end">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => setSelectedKnowledge(null)}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          ) : null}
          
          {/* Unified pipeline UI with knowledge context */}
          <UnifiedPipelineInterface knowledgeItem={selectedKnowledge} />
        </div>
      </div>
    </KnowledgeProvider>
  );
}
```

## 8. Implementation Steps

### Phase 1: Core Data Layer

1. Set up the type definitions in `types.ts`
2. Implement the knowledge source adapters one by one:
   - Start with LocalFilesAdapter
   - Then implement DatabaseAdapter (using existing data-storage abstractions)
   - Add OpenAIVectorAdapter
   - Finally, implement R2RAdapter
3. Build the UnifiedKnowledgeAPI class
4. Create utility functions

### Phase 2: React Context and Components

1. Implement the KnowledgeContext provider
2. Build the KnowledgePicker component
3. Build the KnowledgeViewer component
4. Write tests for the components

### Phase 3: Integration with Pipelines

1. Modify the UnifiedPipelineInterface to accept knowledge items
2. Create the KnowledgeEnabledPipeline wrapper
3. Update the AI assistant functions to leverage knowledge context
4. Add knowledge-specific functionality to each pipeline:
   - Document pipeline: pre-populate with selected knowledge
   - Web pipeline: extract and compare with knowledge items
   - Agent pipeline: include knowledge context in prompts

### Phase 4: Testing and Documentation

1. Test all knowledge sources and their integration
2. Write documentation for the composite knowledge layer
3. Create example usage patterns
4. Optimize performance for large knowledge bases

## 9. Benefits

1. **Single API**: One consistent interface for all knowledge operations
2. **Cross-Source Search**: Search across all knowledge sources with one query
3. **Source Agnostic**: UI components don't need to know about source details
4. **AI Integration**: Automatic model context for more relevant assistance
5. **Pipeline Enrichment**: All pipelines can leverage the same knowledge sources
6. **Future-Proof**: Easy to add new knowledge sources without changing the API

## 10. Challenges to Address

1. **Performance**: Searching across multiple sources could be slow
   - Solution: Implement caching and parallel requests
   
2. **Consistency**: Items from different sources may have inconsistent formats
   - Solution: Thorough normalization in adapters
   
3. **Duplication**: The same content might exist in multiple sources
   - Solution: Implement robust deduplication based on content hash

4. **Authentication**: Different sources might have different auth requirements
   - Solution: Implement credential management in each adapter

## 11. Future Enhancements

1. **Sync Jobs**: Background jobs to keep sources in sync
2. **Version Control**: Track changes to knowledge items
3. **Collaborative Editing**: Allow multiple users to edit the same items
4. **Knowledge Graphs**: Build relationships between items
5. **Advanced Analytics**: Analyze knowledge usage patterns