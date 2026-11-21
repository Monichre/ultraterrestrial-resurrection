'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { UnifiedKnowledgeAPI } from './unified-knowledge-api'
import { KnowledgeItem, SearchOptions, KnowledgeSources } from './types'
import { useAssistantRuntime } from '@assistant-ui/react'

interface KnowledgeContextType {
  // State
  items: KnowledgeItem[]
  selectedItem: KnowledgeItem | null
  isLoading: boolean
  searchResults: KnowledgeItem[]
  
  // Actions
  listItems: (sources?: KnowledgeSources[]) => Promise<void>
  getItem: (id: string, preferredSource?: KnowledgeSources) => Promise<KnowledgeItem | null>
  search: (query: string, options?: SearchOptions) => Promise<KnowledgeItem[]>
  createItem: (item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => Promise<KnowledgeItem>
  updateItem: (id: string, item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => Promise<KnowledgeItem>
  deleteItem: (id: string, targetSources?: KnowledgeSources[]) => Promise<boolean>
  selectItem: (item: KnowledgeItem | null) => void
  
  // Utilities
  getItemContent: (id: string) => Promise<string | null>
  extractMetadata: (item: KnowledgeItem) => any
  formatForPipeline: (item: KnowledgeItem, pipelineType: string) => any
}

const KnowledgeContext = createContext<KnowledgeContextType | null>(null)

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const api = new UnifiedKnowledgeAPI()
  const assistantRuntime = useAssistantRuntime()
  
  // State
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([])
  
  // Actions
  const listItems = useCallback(async (sources?: KnowledgeSources[]) => {
    setIsLoading(true)
    try {
      const fetchedItems = await api.listItems(sources)
      setItems(fetchedItems)
    } catch (error) {
      console.error('Error listing items:', error)
    } finally {
      setIsLoading(false)
    }
  }, [api])
  
  const getItem = useCallback(async (id: string, preferredSource?: KnowledgeSources) => {
    setIsLoading(true)
    try {
      const item = await api.getItem(id, preferredSource)
      return item
    } catch (error) {
      console.error('Error getting item:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [api])
  
  const search = useCallback(async (query: string, options?: SearchOptions) => {
    setIsLoading(true)
    try {
      const results = await api.search(query, options)
      setSearchResults(results)
      return results
    } catch (error) {
      console.error('Error searching:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [api])
  
  const createItem = useCallback(async (item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => {
    setIsLoading(true)
    try {
      const createdItem = await api.createItem(item, targetSources)
      setItems(prev => [...prev, createdItem])
      return createdItem
    } catch (error) {
      console.error('Error creating item:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [api])
  
  const updateItem = useCallback(async (id: string, item: Partial<KnowledgeItem>, targetSources?: KnowledgeSources[]) => {
    setIsLoading(true)
    try {
      const updatedItem = await api.updateItem(id, item, targetSources)
      
      // Update the item in the items array
      setItems(prev => prev.map(i => i.id === id ? updatedItem : i))
      
      // Update selected item if it's the one that was updated
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(updatedItem)
      }
      
      return updatedItem
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [api, selectedItem])
  
  const deleteItem = useCallback(async (id: string, targetSources?: KnowledgeSources[]) => {
    setIsLoading(true)
    try {
      const success = await api.deleteItem(id, targetSources)
      
      if (success) {
        // Remove the item from the items array
        setItems(prev => prev.filter(i => i.id !== id))
        
        // Clear selected item if it's the one that was deleted
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(null)
        }
      }
      
      return success
    } catch (error) {
      console.error('Error deleting item:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [api, selectedItem])
  
  const selectItem = useCallback((item: KnowledgeItem | null) => {
    setSelectedItem(item)
  }, [])
  
  // Utilities
  const getItemContent = useCallback(async (id: string) => {
    const item = await getItem(id)
    return item ? item.content : null
  }, [getItem])
  
  const extractMetadata = useCallback((item: KnowledgeItem) => {
    return { ...item.metadata }
  }, [])
  
  const formatForPipeline = useCallback((item: KnowledgeItem, pipelineType: string) => {
    // Format item for specific pipeline type
    switch (pipelineType) {
      case 'document':
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          contentType: item.contentType,
          source: item.source,
          metadata: item.metadata
        }
      case 'web':
        return {
          url: item.source,
          title: item.title,
          content: item.content,
          summary: item.summary
        }
      case 'agent':
        return {
          context: item.content,
          metadata: extractMetadata(item),
          source: item.source,
          title: item.title
        }
      default:
        return item
    }
  }, [extractMetadata])
  
  // Register with AI Assistant
  useEffect(() => {
    // Register functions for AI to call
    const unregisterFunctions = assistantRuntime.registerFunctions({
      searchKnowledge: async (query: string) => {
        const results = await search(query)
        return {
          count: results.length,
          results: results.map(r => ({
            id: r.id,
            title: r.title,
            summary: r.summary || r.content?.substring(0, 200),
            source: r.source
          }))
        }
      },
      getKnowledgeItem: async (id: string) => {
        const item = await getItem(id)
        return item ? {
          id: item.id,
          title: item.title,
          content: item.content,
          source: item.source
        } : null
      }
    })
    
    // Register context for AI awareness
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
    })
    
    return () => {
      unregisterFunctions()
      unregisterContext()
    }
  }, [assistantRuntime, search, getItem, items, selectedItem])
  
  // Initial load
  useEffect(() => {
    listItems()
  }, [listItems])
  
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
  }
  
  return (
    <KnowledgeContext.Provider value={contextValue}>
      {children}
    </KnowledgeContext.Provider>
  )
}

export function useKnowledge() {
  const context = useContext(KnowledgeContext)
  if (!context) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider')
  }
  return context
}