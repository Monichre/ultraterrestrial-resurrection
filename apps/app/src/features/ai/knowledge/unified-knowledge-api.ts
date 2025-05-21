'use client'

import { KnowledgeItem, KnowledgeSources, SearchOptions } from './types'
import { LocalFilesAdapter } from './adapters/local-files-adapter'
import { OpenAIVectorAdapter } from './adapters/openai-vector-adapter'
import { R2RAdapter } from './adapters/r2r-adapter'
import { XataAdapter } from './adapters/xata-adapter'
import { compareContent } from './utilities'

export class UnifiedKnowledgeAPI {
  private sources: Record<KnowledgeSources, any>;
  
  constructor() {
    this.sources = {
      [KnowledgeSources.LOCAL]: new LocalFilesAdapter(),
      [KnowledgeSources.VECTOR]: new OpenAIVectorAdapter(),
      [KnowledgeSources.R2R]: new R2RAdapter(),
      [KnowledgeSources.DATABASE]: new XataAdapter(),
    };
  }

  /**
   * Lists items from all specified knowledge sources
   * @param sources Optional array of sources to query (defaults to all)
   * @returns Array of knowledge items from all sources
   */
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

  /**
   * Gets a specific item by ID from the preferred source or any source
   * @param id The item ID to fetch
   * @param preferredSource Optional preferred source to try first
   * @returns The knowledge item or null if not found
   */
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

  /**
   * Searches across all specified knowledge sources
   * @param query The search query
   * @param options Optional search options
   * @returns Array of matching knowledge items, ranked by relevance
   */
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

  /**
   * Creates a new item in specified knowledge sources
   * @param item The item to create
   * @param targetSources Optional sources to create in (defaults to DATABASE)
   * @returns The created knowledge item
   */
  async createItem(item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]): Promise<KnowledgeItem> {
    // Determine target sources for creation
    const sources = targetSources || [KnowledgeSources.DATABASE]; // Default to database only
    
    // Create in all specified sources
    const createPromises = sources.map(source => 
      this.sources[source].createItem(item).catch(err => {
        console.error(`Error creating item in ${source}:`, err);
        throw err; // Rethrow to indicate failure
      })
    );
    
    // Wait for all creations to complete
    const createdItems = await Promise.all(createPromises);
    
    // Return first created item (all should be essentially the same)
    return createdItems[0];
  }

  /**
   * Updates an item across specified knowledge sources
   * @param id The ID of the item to update
   * @param item The partial item data to update
   * @param targetSources Optional sources to update in (defaults to all)
   * @returns The updated knowledge item
   */
  async updateItem(id: string, item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]): Promise<KnowledgeItem> {
    // Find which sources have this item
    let existingSources: KnowledgeSources[] = [];
    
    if (targetSources) {
      existingSources = targetSources;
    } else {
      // Check each source for the item
      for (const source of Object.values(KnowledgeSources)) {
        const existingItem = await this.sources[source].getItem(id).catch(() => null);
        if (existingItem) {
          existingSources.push(source);
        }
      }
    }
    
    if (existingSources.length === 0) {
      throw new Error(`Item with ID ${id} not found in any knowledge source`);
    }
    
    // Update in all relevant sources
    const updatePromises = existingSources.map(source => 
      this.sources[source].updateItem(id, item).catch(err => {
        console.error(`Error updating item in ${source}:`, err);
        return null; // Don't throw to allow partial updates
      })
    );
    
    const updatedItems = (await Promise.all(updatePromises)).filter(Boolean);
    
    if (updatedItems.length === 0) {
      throw new Error(`Failed to update item ${id} in any knowledge source`);
    }
    
    // Return first successfully updated item
    return updatedItems[0];
  }

  /**
   * Deletes an item from specified knowledge sources
   * @param id The ID of the item to delete
   * @param targetSources Optional sources to delete from (defaults to all)
   * @returns True if successfully deleted from at least one source
   */
  async deleteItem(id: string, targetSources?: KnowledgeSources[]): Promise<boolean> {
    // Determine which sources to delete from
    let sourcesToDelete: KnowledgeSources[] = [];
    
    if (targetSources) {
      sourcesToDelete = targetSources;
    } else {
      // Check each source for the item
      for (const source of Object.values(KnowledgeSources)) {
        const existingItem = await this.sources[source].getItem(id).catch(() => null);
        if (existingItem) {
          sourcesToDelete.push(source);
        }
      }
    }
    
    if (sourcesToDelete.length === 0) {
      // Item not found in any source
      return false;
    }
    
    // Delete from all relevant sources
    const deletePromises = sourcesToDelete.map(source => 
      this.sources[source].deleteItem(id).catch(err => {
        console.error(`Error deleting item from ${source}:`, err);
        return false;
      })
    );
    
    const results = await Promise.all(deletePromises);
    
    // Return true if successfully deleted from at least one source
    return results.some(result => result === true);
  }

  /**
   * Copies an item from one knowledge source to another
   * @param id The ID of the item to migrate
   * @param fromSource The source to copy from
   * @param toSource The source to copy to
   * @returns The migrated knowledge item
   */
  async migrateItem(id: string, fromSource: KnowledgeSources, toSource: KnowledgeSources): Promise<KnowledgeItem> {
    // Get the item from the source
    const item = await this.sources[fromSource].getItem(id);
    if (!item) {
      throw new Error(`Item with ID ${id} not found in ${fromSource}`);
    }
    
    // Create a new item in the target source (omit ID to get new ID)
    const { id: _, ...itemWithoutId } = item;
    const newItem = await this.sources[toSource].createItem(itemWithoutId);
    
    return newItem;
  }

  /**
   * Ensures specified sources have the same items
   * @param sources Optional sources to sync (defaults to all)
   */
  async syncSources(sources?: KnowledgeSources[]): Promise<void> {
    // Determine which sources to sync
    const sourcesToSync = sources || Object.values(KnowledgeSources);
    if (sourcesToSync.length < 2) {
      return; // Need at least 2 sources to sync
    }
    
    // Use first source as primary
    const primarySource = sourcesToSync[0];
    const primaryItems = await this.sources[primarySource].listItems();
    
    // For each other source, sync items
    for (const secondarySource of sourcesToSync.slice(1)) {
      const secondaryItems = await this.sources[secondarySource].listItems();
      
      // Find items in primary not in secondary (need to be created)
      for (const primaryItem of primaryItems) {
        const matchingItem = secondaryItems.find(item => 
          // Try to match by content similarity if no direct ID match
          item.id === primaryItem.id || compareContent(item, primaryItem) > 0.9
        );
        
        if (!matchingItem) {
          // Create in secondary
          const { id: _, ...itemWithoutId } = primaryItem;
          await this.sources[secondarySource].createItem(itemWithoutId).catch(err => {
            console.error(`Error syncing item to ${secondarySource}:`, err);
          });
        }
      }
    }
  }

  /**
   * Removes duplicate items from an array based on content similarity
   * @param items Array of knowledge items
   * @returns Deduplicated array
   */
  private deduplicateItems(items: KnowledgeItem[]): KnowledgeItem[] {
    const uniqueItems: KnowledgeItem[] = [];
    
    for (const item of items) {
      // Check if this item is similar to any existing unique item
      const isDuplicate = uniqueItems.some(uniqueItem => 
        // First check by ID
        uniqueItem.id === item.id ||
        // Then check by content similarity
        (uniqueItem.title === item.title && compareContent(uniqueItem, item) > 0.8)
      );
      
      if (!isDuplicate) {
        uniqueItems.push(item);
      }
    }
    
    return uniqueItems;
  }
  
  /**
   * Ranks search results by relevance to the query
   * @param items Items to rank
   * @param query The search query
   * @returns Ranked array of items
   */
  private rankSearchResults(items: KnowledgeItem[], query: string): KnowledgeItem[] {
    // Score each item based on relevance to query
    const scoredItems = items.map(item => {
      let score = 0;
      const queryLower = query.toLowerCase();
      
      // Title match (weighted heavily)
      if (item.title.toLowerCase().includes(queryLower)) {
        score += 10;
        // Exact title match gets even higher score
        if (item.title.toLowerCase() === queryLower) {
          score += 15;
        }
      }
      
      // Content match
      if (item.content.toLowerCase().includes(queryLower)) {
        score += 5;
        // Higher score for frequency of occurrence
        const occurrences = (item.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
        score += Math.min(occurrences, 5); // Cap at 5 to avoid overweighting
      }
      
      // Summary match
      if (item.summary && item.summary.toLowerCase().includes(queryLower)) {
        score += 7;
      }
      
      // Tag match
      if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
        score += 8;
      }
      
      // Metadata match
      for (const [_, value] of Object.entries(item.metadata)) {
        if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
          score += 3;
        }
      }
      
      // Prefer more recent items
      score += new Date(item.updatedAt).getTime() / 1000000000000; // Small bonus for recency
      
      return { item, score };
    });
    
    // Sort by score descending
    scoredItems.sort((a, b) => b.score - a.score);
    
    // Return just the items in ranked order
    return scoredItems.map(si => si.item);
  }
}