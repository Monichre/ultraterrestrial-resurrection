'use client'

import { createHash } from 'crypto'
import { KnowledgeItem, KnowledgeSources, SearchOptions } from '../types'
import { detectFileType, extractMetadataFromContent } from '../utilities'

export class LocalFilesAdapter implements KnowledgeSource {
  private basePath: string
  private mockFiles: KnowledgeItem[] = [] // Temporary mock data for demonstration

  constructor(basePath = process.env.KNOWLEDGE_BASE_PATH || '/packages/knowledge-base') {
    this.basePath = basePath
    
    // Initialize with some mock files for demonstration purposes
    // In a real implementation, this would scan the actual directory
    this.initializeMockFiles()
  }

  private initializeMockFiles() {
    this.mockFiles = [
      {
        id: this.generateId('testimony1.md'),
        title: 'Testimony: Thomas Campbell',
        content: '# Thomas Campbell Testimony\n\nOn June 15, 2022, Thomas Campbell provided testimony about his experiences...',
        contentType: 'markdown',
        source: `${this.basePath}/testimonies/thomas-campbell.md`,
        sourceType: KnowledgeSources.LOCAL,
        metadata: {
          author: 'Thomas Campbell',
          date: '2022-06-15',
          category: 'testimony'
        },
        createdAt: '2022-06-16T10:30:00Z',
        updatedAt: '2022-06-16T10:30:00Z',
        tags: ['testimony', 'expert witness', 'consciousness']
      },
      {
        id: this.generateId('document1.pdf'),
        title: 'UAP Task Force Report 2021',
        content: 'This report provides an overview of the UAP Task Force findings...',
        contentType: 'pdf',
        source: `${this.basePath}/reports/uap-task-force-2021.pdf`,
        sourceType: KnowledgeSources.LOCAL,
        metadata: {
          author: 'UAP Task Force',
          date: '2021-06-25',
          category: 'official report'
        },
        createdAt: '2021-06-25T14:00:00Z',
        updatedAt: '2021-06-25T14:00:00Z',
        tags: ['official', 'report', 'government', 'UAP']
      },
      {
        id: this.generateId('transcript1.txt'),
        title: 'Interview Transcript: Dr. Jacques Vallée',
        content: 'Interviewer: What led you to research UFO phenomena?\nVallée: Well, it began when I was a young astronomer...',
        contentType: 'text',
        source: `${this.basePath}/transcripts/vallee-interview.txt`,
        sourceType: KnowledgeSources.LOCAL,
        metadata: {
          author: 'Dr. Jacques Vallée',
          date: '2019-03-12',
          interviewer: 'Science Magazine',
          category: 'interview'
        },
        createdAt: '2019-03-15T09:45:00Z',
        updatedAt: '2019-03-15T09:45:00Z',
        tags: ['interview', 'expert', 'researcher']
      }
    ]
  }

  async listItems(): Promise<KnowledgeItem[]> {
    // In a real implementation, this would read the directory
    // For now, return the mock files
    return this.mockFiles
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    const item = this.mockFiles.find(file => file.id === id)
    return item || null
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    if (!query) return this.mockFiles

    const queryLower = query.toLowerCase()
    const results = this.mockFiles.filter(file => {
      // Simple text search in title and content
      if (file.title.toLowerCase().includes(queryLower)) return true
      if (file.content.toLowerCase().includes(queryLower)) return true
      
      // Search in metadata
      if (Object.values(file.metadata).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(queryLower)
      )) return true
      
      // Search in tags
      if (file.tags?.some(tag => tag.toLowerCase().includes(queryLower))) return true
      
      return false
    })

    // Apply filters if specified
    if (options?.filters) {
      return results.filter(file => {
        // Filter by content type
        if (options.filters.contentType && 
            !options.filters.contentType.includes(file.contentType)) {
          return false
        }
        
        // Filter by tags
        if (options.filters.tags && file.tags && 
            !options.filters.tags.some(tag => file.tags!.includes(tag))) {
          return false
        }
        
        // Filter by date range
        if (options.filters.dateRange) {
          const fileDate = new Date(file.updatedAt)
          if (options.filters.dateRange.start) {
            const startDate = new Date(options.filters.dateRange.start)
            if (fileDate < startDate) return false
          }
          if (options.filters.dateRange.end) {
            const endDate = new Date(options.filters.dateRange.end)
            if (fileDate > endDate) return false
          }
        }
        
        // Filter by metadata (simple match for now)
        if (options.filters.metadata) {
          for (const [key, value] of Object.entries(options.filters.metadata)) {
            if (file.metadata[key] !== value) return false
          }
        }
        
        return true
      })
    }

    // Apply limit if specified
    if (options?.limit && results.length > options.limit) {
      return results.slice(0, options.limit)
    }

    return results
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    // Validate and prepare the item
    if (!item.title) throw new Error('Title is required')
    if (!item.content) throw new Error('Content is required')
    
    const filename = this.sanitizeFilename(item.title)
    const contentType = item.contentType || detectFileType(filename, item.content)
    const filePath = `${this.basePath}/${filename}`
    
    // In a real implementation, this would write to a file
    // For now, we'll just add to our mock array
    const newItem: KnowledgeItem = {
      id: this.generateId(filePath),
      title: item.title,
      content: item.content,
      summary: item.summary,
      contentType,
      source: filePath,
      sourceType: KnowledgeSources.LOCAL,
      metadata: item.metadata || extractMetadataFromContent(item.content, contentType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: item.tags || []
    }
    
    this.mockFiles.push(newItem)
    return newItem
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const existingItemIndex = this.mockFiles.findIndex(file => file.id === id)
    if (existingItemIndex === -1) {
      throw new Error(`Item with ID ${id} not found`)
    }
    
    const existingItem = this.mockFiles[existingItemIndex]
    
    // Update the item
    const updatedItem: KnowledgeItem = {
      ...existingItem,
      ...item,
      updatedAt: new Date().toISOString()
    }
    
    // In a real implementation, this would update the file
    // For now, we'll just update our mock array
    this.mockFiles[existingItemIndex] = updatedItem
    
    return updatedItem
  }

  async deleteItem(id: string): Promise<boolean> {
    const initialLength = this.mockFiles.length
    this.mockFiles = this.mockFiles.filter(file => file.id !== id)
    
    // Return true if an item was removed
    return this.mockFiles.length < initialLength
  }

  // Helper methods
  private generateId(filePath: string): string {
    return createHash('md5').update(filePath).digest('hex')
  }

  private sanitizeFilename(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '.txt'
  }
}