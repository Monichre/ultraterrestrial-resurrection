'use client'

import { KnowledgeItem, KnowledgeSources, SearchOptions } from '../types'

interface R2RDocument {
  id: string
  title: string
  content: string
  metadata: {
    source: string
    summary?: string
    contentType: string
    [key: string]: any
  }
  tags?: string[]
  createdAt: string
  updatedAt: string
}

interface R2RSearchResponse {
  documents: R2RDocument[]
  total: number
}

export class R2RAdapter implements KnowledgeSource {
  private apiKey: string | undefined
  private apiUrl: string
  private mockDocuments: R2RDocument[] = [] // Temporary mock data

  constructor(
    apiKey = process.env.R2R_API_KEY,
    apiUrl = process.env.R2R_API_URL || 'https://api.r2r.example.com'
  ) {
    this.apiKey = apiKey
    this.apiUrl = apiUrl
    
    // Initialize with some mock documents for demonstration
    this.initializeMockDocuments()
  }

  private initializeMockDocuments() {
    this.mockDocuments = [
      {
        id: 'r2r-' + Math.random().toString(36).substring(2, 11),
        title: 'The Pentagon\'s Advanced Aerospace Threat Identification Program',
        content: 'In December 2017, the New York Times broke a story about the Pentagon\'s secret program...',
        metadata: {
          source: 'https://www.nytimes.com/2017/12/16/us/politics/pentagon-program-ufo-harry-reid.html',
          contentType: 'article',
          author: 'Helene Cooper, Ralph Blumenthal and Leslie Kean',
          publication: 'The New York Times',
          summary: 'Overview of the Pentagon\'s Advanced Aerospace Threat Identification Program'
        },
        tags: ['AATIP', 'Pentagon', 'government', 'disclosure'],
        createdAt: '2022-03-15T13:20:00Z',
        updatedAt: '2022-03-15T13:20:00Z'
      },
      {
        id: 'r2r-' + Math.random().toString(36).substring(2, 11),
        title: 'Scientific Coalition for UAP Studies Technical Report',
        content: 'This technical report analyzes radar, visual, and infrared data related to the USS Nimitz encounter...',
        metadata: {
          source: 'https://www.explorescu.org/post/nimitz_strike_group_2004',
          contentType: 'report',
          author: 'SCU Research Team',
          organization: 'Scientific Coalition for UAP Studies',
          summary: 'Technical analysis of the 2004 USS Nimitz UAP encounter'
        },
        tags: ['SCU', 'research', 'technical', 'analysis', 'Nimitz'],
        createdAt: '2022-06-10T09:45:00Z',
        updatedAt: '2022-06-10T09:45:00Z'
      },
      {
        id: 'r2r-' + Math.random().toString(36).substring(2, 11),
        title: 'American Institute of Aeronautics and Astronautics Paper on UAP',
        content: 'This peer-reviewed scientific paper examines the physical characteristics of Unidentified Aerial Phenomena...',
        metadata: {
          source: 'https://www.aiaa.org/papers/example-uap-paper',
          contentType: 'scientific-paper',
          author: 'Dr. Kevin Knuth et al.',
          journal: 'Journal of Aerospace Engineering',
          summary: 'Scientific analysis of UAP physical characteristics'
        },
        tags: ['scientific', 'peer-reviewed', 'physics', 'aerospace'],
        createdAt: '2022-09-22T15:30:00Z',
        updatedAt: '2022-09-22T15:30:00Z'
      }
    ]
  }

  async listItems(): Promise<KnowledgeItem[]> {
    // In a real implementation, this would fetch documents from R2R API
    // For now, return mock documents
    return this.mockDocuments.map(doc => this.r2rDocToKnowledgeItem(doc))
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    // In a real implementation, this would fetch a specific document from R2R API
    const document = this.mockDocuments.find(doc => doc.id === id)
    return document ? this.r2rDocToKnowledgeItem(document) : null
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    if (!query) return this.listItems()

    // In a real implementation, this would call the R2R search API
    // For now, we'll simulate this with basic text matching
    const queryLower = query.toLowerCase()
    let results = this.mockDocuments.filter(doc => {
      if (doc.title.toLowerCase().includes(queryLower)) return true
      if (doc.content.toLowerCase().includes(queryLower)) return true
      if (doc.metadata.summary && doc.metadata.summary.toLowerCase().includes(queryLower)) return true
      if (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(queryLower))) return true
      
      // Check metadata values
      for (const [_, value] of Object.entries(doc.metadata)) {
        if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
          return true
        }
      }
      
      return false
    })
    
    // Apply filters if specified
    if (options?.filters) {
      results = results.filter(doc => {
        // Filter by content type
        if (options.filters.contentType && 
            !options.filters.contentType.includes(doc.metadata.contentType)) {
          return false
        }
        
        // Filter by tags
        if (options.filters.tags && doc.tags && 
            !options.filters.tags.some(tag => doc.tags!.includes(tag))) {
          return false
        }
        
        // Filter by date range
        if (options.filters.dateRange) {
          const docDate = new Date(doc.updatedAt)
          if (options.filters.dateRange.start) {
            const startDate = new Date(options.filters.dateRange.start)
            if (docDate < startDate) return false
          }
          if (options.filters.dateRange.end) {
            const endDate = new Date(options.filters.dateRange.end)
            if (docDate > endDate) return false
          }
        }
        
        // Filter by metadata
        if (options.filters.metadata) {
          for (const [key, value] of Object.entries(options.filters.metadata)) {
            if (doc.metadata[key] !== value) return false
          }
        }
        
        return true
      })
    }
    
    // Apply limit if specified
    if (options?.limit && results.length > options.limit) {
      results = results.slice(0, options.limit)
    }
    
    return results.map(doc => this.r2rDocToKnowledgeItem(doc))
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    if (!item.title) throw new Error('Title is required')
    if (!item.content) throw new Error('Content is required')
    
    const contentType = item.contentType || 'text'
    const id = 'r2r-' + Math.random().toString(36).substring(2, 11)
    const now = new Date().toISOString()
    
    // Create new R2R document
    const newDoc: R2RDocument = {
      id,
      title: item.title,
      content: item.content,
      metadata: {
        source: item.source || `r2r/${id}`,
        contentType,
        summary: item.summary,
        ...item.metadata
      },
      tags: item.tags,
      createdAt: now,
      updatedAt: now
    }
    
    // In a real implementation, this would call the R2R API to store the document
    // For now, we'll add to our mock array
    this.mockDocuments.push(newDoc)
    
    return this.r2rDocToKnowledgeItem(newDoc)
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const docIndex = this.mockDocuments.findIndex(doc => doc.id === id)
    if (docIndex === -1) {
      throw new Error(`Item with ID ${id} not found`)
    }
    
    const existingDoc = this.mockDocuments[docIndex]
    
    // Update the document
    const updatedDoc: R2RDocument = {
      ...existingDoc,
      title: item.title || existingDoc.title,
      content: item.content || existingDoc.content,
      metadata: {
        ...existingDoc.metadata,
        ...item.metadata,
        summary: item.summary || existingDoc.metadata.summary,
        contentType: item.contentType || existingDoc.metadata.contentType,
        source: item.source || existingDoc.metadata.source
      },
      tags: item.tags || existingDoc.tags,
      updatedAt: new Date().toISOString()
    }
    
    // In a real implementation, this would call the R2R API to update the document
    // For now, we'll update our mock array
    this.mockDocuments[docIndex] = updatedDoc
    
    return this.r2rDocToKnowledgeItem(updatedDoc)
  }

  async deleteItem(id: string): Promise<boolean> {
    // In a real implementation, this would call the R2R API to delete the document
    const initialLength = this.mockDocuments.length
    this.mockDocuments = this.mockDocuments.filter(doc => doc.id !== id)
    
    // Return true if an item was removed
    return this.mockDocuments.length < initialLength
  }

  // Helper method to convert R2R document to KnowledgeItem
  private r2rDocToKnowledgeItem(doc: R2RDocument): KnowledgeItem {
    return {
      id: doc.id,
      title: doc.title,
      content: doc.content,
      summary: doc.metadata.summary,
      contentType: doc.metadata.contentType,
      source: doc.metadata.source,
      sourceType: KnowledgeSources.R2R,
      metadata: { ...doc.metadata },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      tags: doc.tags
    }
  }
}