'use client'

import { KnowledgeItem, KnowledgeSources, SearchOptions } from '../types'

export class XataAdapter implements KnowledgeSource {
  private mockItems: KnowledgeItem[] = [] // Temporary mock data

  constructor() {
    // Initialize with some mock items for demonstration
    this.initializeMockItems()
  }

  private initializeMockItems() {
    this.mockItems = [
      {
        id: 'xata-' + Math.random().toString(36).substring(2, 11),
        title: 'Dr. Steven Greer: Disclosure Project',
        content: 'Dr. Steven Greer is the founder of the Disclosure Project, which has gathered testimonies from hundreds of military and government witnesses to UFO events and projects.',
        contentType: 'profile',
        source: 'xata:key-figures',
        sourceType: KnowledgeSources.DATABASE,
        metadata: {
          role: 'Researcher',
          organization: 'Disclosure Project',
          verified: true,
          dateOfBirth: '1955-06-28',
        },
        createdAt: '2022-01-05T08:30:00Z',
        updatedAt: '2022-01-05T08:30:00Z',
        tags: ['disclosure', 'ce5', 'researcher', 'whistleblower']
      },
      {
        id: 'xata-' + Math.random().toString(36).substring(2, 11),
        title: 'Phoenix Lights Incident',
        content: 'The Phoenix Lights were a series of widely sighted unidentified flying objects observed in the skies over the U.S. states of Arizona and Nevada, and the Mexican state of Sonora on March 13, 1997.',
        contentType: 'event',
        source: 'xata:events',
        sourceType: KnowledgeSources.DATABASE,
        metadata: {
          date: '1997-03-13',
          location: 'Phoenix, Arizona',
          witnesses: 'Thousands',
          officialExplanation: 'Military flares',
        },
        createdAt: '2022-02-10T14:22:00Z',
        updatedAt: '2022-02-10T14:22:00Z',
        tags: ['mass-sighting', 'lights', 'arizona', 'documented']
      },
      {
        id: 'xata-' + Math.random().toString(36).substring(2, 11),
        title: 'Project Blue Book',
        content: 'Project Blue Book was one of a series of systematic studies of unidentified flying objects conducted by the United States Air Force from 1952 to 1969.',
        contentType: 'project',
        source: 'xata:projects',
        sourceType: KnowledgeSources.DATABASE,
        metadata: {
          startDate: '1952-03-01',
          endDate: '1969-12-17',
          organization: 'United States Air Force',
          director: 'Edward J. Ruppelt (initial)',
          caseCount: 12618,
        },
        createdAt: '2022-03-15T09:40:00Z',
        updatedAt: '2022-03-15T09:40:00Z',
        tags: ['government', 'investigation', 'military', 'historical']
      }
    ]
  }

  async listItems(): Promise<KnowledgeItem[]> {
    try {
      // In a real implementation, this would query the Xata database
      // For demonstration purposes, we'll return mock data
      return this.mockItems
    } catch (error) {
      console.error('Error listing items from Xata:', error)
      return []
    }
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    try {
      // In a real implementation, this would query the Xata database by ID
      const item = this.mockItems.find(item => item.id === id)
      return item || null
    } catch (error) {
      console.error(`Error fetching item ${id} from Xata:`, error)
      return null
    }
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    try {
      if (!query) return this.listItems()

      // In a real implementation, this would use Xata's search capabilities
      // For demonstration, we'll perform a simple search on our mock data
      const queryLower = query.toLowerCase()
      let results = this.mockItems.filter(item => {
        // Search in title and content
        if (item.title.toLowerCase().includes(queryLower)) return true
        if (item.content.toLowerCase().includes(queryLower)) return true
        
        // Search in metadata values
        if (Object.values(item.metadata).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(queryLower)
        )) return true
        
        // Search in tags
        if (item.tags?.some(tag => tag.toLowerCase().includes(queryLower))) return true
        
        return false
      })
      
      // Apply filters if specified
      if (options?.filters) {
        results = results.filter(item => {
          // Filter by content type
          if (options.filters.contentType && 
              !options.filters.contentType.includes(item.contentType)) {
            return false
          }
          
          // Filter by tags
          if (options.filters.tags && item.tags && 
              !options.filters.tags.some(tag => item.tags!.includes(tag))) {
            return false
          }
          
          // Filter by date range
          if (options.filters.dateRange) {
            const itemDate = new Date(item.updatedAt)
            if (options.filters.dateRange.start) {
              const startDate = new Date(options.filters.dateRange.start)
              if (itemDate < startDate) return false
            }
            if (options.filters.dateRange.end) {
              const endDate = new Date(options.filters.dateRange.end)
              if (itemDate > endDate) return false
            }
          }
          
          // Filter by metadata
          if (options.filters.metadata) {
            for (const [key, value] of Object.entries(options.filters.metadata)) {
              if (item.metadata[key] !== value) return false
            }
          }
          
          return true
        })
      }
      
      // Apply limit if specified
      if (options?.limit && results.length > options.limit) {
        results = results.slice(0, options.limit)
      }
      
      return results
    } catch (error) {
      console.error('Error searching items in Xata:', error)
      return []
    }
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    try {
      if (!item.title) throw new Error('Title is required')
      if (!item.content) throw new Error('Content is required')
      
      const id = 'xata-' + Math.random().toString(36).substring(2, 11)
      const contentType = item.contentType || 'text'
      const now = new Date().toISOString()
      
      // In a real implementation, this would insert into Xata database
      // For demonstration, we'll create a mock item
      const newItem: KnowledgeItem = {
        id,
        title: item.title,
        content: item.content,
        summary: item.summary,
        contentType,
        source: item.source || `xata:items`,
        sourceType: KnowledgeSources.DATABASE,
        metadata: item.metadata || {},
        createdAt: now,
        updatedAt: now,
        tags: item.tags || []
      }
      
      this.mockItems.push(newItem)
      return newItem
    } catch (error) {
      console.error('Error creating item in Xata:', error)
      throw error
    }
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    try {
      const itemIndex = this.mockItems.findIndex(i => i.id === id)
      if (itemIndex === -1) {
        throw new Error(`Item with ID ${id} not found`)
      }
      
      const existingItem = this.mockItems[itemIndex]
      
      // In a real implementation, this would update the Xata database
      // For demonstration, we'll update the mock item
      const updatedItem: KnowledgeItem = {
        ...existingItem,
        title: item.title || existingItem.title,
        content: item.content || existingItem.content,
        summary: item.summary || existingItem.summary,
        contentType: item.contentType || existingItem.contentType,
        source: item.source || existingItem.source,
        metadata: { ...existingItem.metadata, ...item.metadata },
        updatedAt: new Date().toISOString(),
        tags: item.tags || existingItem.tags
      }
      
      this.mockItems[itemIndex] = updatedItem
      return updatedItem
    } catch (error) {
      console.error(`Error updating item ${id} in Xata:`, error)
      throw error
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      // In a real implementation, this would delete from Xata database
      // For demonstration, we'll remove from our mock array
      const initialLength = this.mockItems.length
      this.mockItems = this.mockItems.filter(item => item.id !== id)
      
      // Return true if an item was removed
      return this.mockItems.length < initialLength
    } catch (error) {
      console.error(`Error deleting item ${id} from Xata:`, error)
      return false
    }
  }
}