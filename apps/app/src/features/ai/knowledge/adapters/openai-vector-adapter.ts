'use client'

import { KnowledgeItem, KnowledgeSources, SearchOptions, EmbeddingVector } from '../types'
import { extractMetadataFromContent } from '../utilities'

interface VectorEntry {
  id: string
  embedding: number[]
  metadata: {
    title: string
    content: string
    contentType: string
    source: string
    summary?: string
    tags?: string[]
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

export class OpenAIVectorAdapter implements KnowledgeSource {
  private apiKey: string | undefined
  private apiEndpoint: string
  private mockVectors: VectorEntry[] = [] // Temporary mock data

  constructor(
    apiKey = process.env.OPENAI_API_KEY,
    apiEndpoint = 'https://api.openai.com/v1/embeddings'
  ) {
    this.apiKey = apiKey
    this.apiEndpoint = apiEndpoint
    
    // Initialize with some mock vectors for demonstration
    this.initializeMockVectors()
  }

  private initializeMockVectors() {
    // Create mock vector entries for demonstration
    this.mockVectors = [
      {
        id: 'vec-' + Math.random().toString(36).substring(2, 11),
        embedding: Array(128).fill(0).map(() => Math.random() * 2 - 1), // Random embedding
        metadata: {
          title: 'Understanding UAP Propulsion Systems',
          content: 'This research paper explores theoretical models for UAP propulsion...',
          contentType: 'text',
          source: 'research-papers/uap-propulsion.txt',
          summary: 'Analysis of theoretical propulsion systems for UAPs',
          tags: ['propulsion', 'physics', 'theory']
        },
        createdAt: '2023-05-10T09:15:00Z',
        updatedAt: '2023-05-10T09:15:00Z'
      },
      {
        id: 'vec-' + Math.random().toString(36).substring(2, 11),
        embedding: Array(128).fill(0).map(() => Math.random() * 2 - 1), // Random embedding
        metadata: {
          title: 'Nimitz Encounter Analysis',
          content: 'A detailed analysis of the 2004 USS Nimitz UAP encounter...',
          contentType: 'text',
          source: 'case-studies/nimitz-2004.txt',
          summary: 'Technical breakdown of the 2004 USS Nimitz UAP sighting',
          tags: ['nimitz', 'navy', 'case study', 'military']
        },
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z'
      },
      {
        id: 'vec-' + Math.random().toString(36).substring(2, 11),
        embedding: Array(128).fill(0).map(() => Math.random() * 2 - 1), // Random embedding
        metadata: {
          title: 'Historical Pattern Analysis: UAP Sightings 1950-2020',
          content: 'This document presents a statistical analysis of UAP sightings...',
          contentType: 'text',
          source: 'statistics/historical-patterns.txt',
          summary: 'Statistical patterns in UAP sightings over 70 years',
          tags: ['statistics', 'patterns', 'history', 'analysis']
        },
        createdAt: '2022-11-05T11:45:00Z',
        updatedAt: '2022-11-05T11:45:00Z'
      }
    ]
  }

  async listItems(): Promise<KnowledgeItem[]> {
    // Convert vector entries to KnowledgeItem format
    return this.mockVectors.map(vector => this.vectorToKnowledgeItem(vector))
  }

  async getItem(id: string): Promise<KnowledgeItem | null> {
    const vector = this.mockVectors.find(v => v.id === id)
    return vector ? this.vectorToKnowledgeItem(vector) : null
  }

  async search(query: string, options?: SearchOptions): Promise<KnowledgeItem[]> {
    if (!query) return this.listItems()

    // In a real implementation, this would:
    // 1. Convert query to embedding using OpenAI API
    // 2. Perform vector similarity search
    
    // For now, we'll simulate this with basic text matching
    const queryEmbedding = await this.textToEmbedding(query)
    
    // Calculate similarity scores
    const scoredVectors = this.mockVectors.map(vector => {
      const similarityScore = this.cosineSimilarity(queryEmbedding, vector.embedding)
      return { vector, score: similarityScore }
    })
    
    // Sort by similarity score
    scoredVectors.sort((a, b) => b.score - a.score)
    
    // Apply any filters if specified
    let filteredVectors = scoredVectors
    if (options?.filters) {
      filteredVectors = scoredVectors.filter(({ vector }) => {
        // Filter by content type
        if (options.filters.contentType && 
            !options.filters.contentType.includes(vector.metadata.contentType)) {
          return false
        }
        
        // Filter by tags
        if (options.filters.tags && vector.metadata.tags && 
            !options.filters.tags.some(tag => vector.metadata.tags!.includes(tag))) {
          return false
        }
        
        // Filter by date range
        if (options.filters.dateRange) {
          const vectorDate = new Date(vector.updatedAt)
          if (options.filters.dateRange.start) {
            const startDate = new Date(options.filters.dateRange.start)
            if (vectorDate < startDate) return false
          }
          if (options.filters.dateRange.end) {
            const endDate = new Date(options.filters.dateRange.end)
            if (vectorDate > endDate) return false
          }
        }
        
        // Filter by metadata 
        if (options.filters.metadata) {
          for (const [key, value] of Object.entries(options.filters.metadata)) {
            if (vector.metadata[key] !== value) return false
          }
        }
        
        return true
      })
    }

    // Apply limit if specified
    const limitedVectors = options?.limit
      ? filteredVectors.slice(0, options.limit)
      : filteredVectors

    // Convert to KnowledgeItem format
    return limitedVectors.map(({ vector }) => this.vectorToKnowledgeItem(vector))
  }

  async createItem(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    if (!item.title) throw new Error('Title is required')
    if (!item.content) throw new Error('Content is required')
    
    // Generate embedding for the content
    const embedding = await this.textToEmbedding(item.content)
    
    const id = 'vec-' + Math.random().toString(36).substring(2, 11)
    const contentType = item.contentType || 'text'
    const now = new Date().toISOString()
    
    // Create new vector entry
    const newVector: VectorEntry = {
      id,
      embedding,
      metadata: {
        title: item.title,
        content: item.content,
        contentType,
        source: item.source || `vector/${id}`,
        summary: item.summary,
        tags: item.tags,
        ...item.metadata
      },
      createdAt: now,
      updatedAt: now
    }
    
    // In a real implementation, this would store in OpenAI's vector database
    // For now, we'll add to our mock array
    this.mockVectors.push(newVector)
    
    return this.vectorToKnowledgeItem(newVector)
  }

  async updateItem(id: string, item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const vectorIndex = this.mockVectors.findIndex(v => v.id === id)
    if (vectorIndex === -1) {
      throw new Error(`Item with ID ${id} not found`)
    }
    
    const existingVector = this.mockVectors[vectorIndex]
    const updatedMetadata = { ...existingVector.metadata }
    
    // Update fields in metadata
    if (item.title) updatedMetadata.title = item.title
    if (item.content) updatedMetadata.content = item.content
    if (item.summary) updatedMetadata.summary = item.summary
    if (item.contentType) updatedMetadata.contentType = item.contentType
    if (item.source) updatedMetadata.source = item.source
    if (item.tags) updatedMetadata.tags = item.tags
    if (item.metadata) {
      Object.assign(updatedMetadata, item.metadata)
    }
    
    // Generate new embedding if content changed
    let embedding = existingVector.embedding
    if (item.content && item.content !== existingVector.metadata.content) {
      embedding = await this.textToEmbedding(item.content)
    }
    
    // Create updated vector
    const updatedVector: VectorEntry = {
      ...existingVector,
      embedding,
      metadata: updatedMetadata,
      updatedAt: new Date().toISOString()
    }
    
    // In a real implementation, this would update the vector database
    // For now, we'll update our mock array
    this.mockVectors[vectorIndex] = updatedVector
    
    return this.vectorToKnowledgeItem(updatedVector)
  }

  async deleteItem(id: string): Promise<boolean> {
    const initialLength = this.mockVectors.length
    this.mockVectors = this.mockVectors.filter(v => v.id !== id)
    
    // Return true if an item was removed
    return this.mockVectors.length < initialLength
  }

  // Helper methods
  private vectorToKnowledgeItem(vector: VectorEntry): KnowledgeItem {
    return {
      id: vector.id,
      title: vector.metadata.title,
      content: vector.metadata.content,
      summary: vector.metadata.summary,
      contentType: vector.metadata.contentType,
      source: vector.metadata.source,
      sourceType: KnowledgeSources.VECTOR,
      metadata: { ...vector.metadata },
      vector: vector.embedding,
      createdAt: vector.createdAt,
      updatedAt: vector.updatedAt,
      tags: vector.metadata.tags
    }
  }

  private async textToEmbedding(text: string): Promise<EmbeddingVector> {
    // In a real implementation, this would call the OpenAI API
    // For now, generate a random embedding
    // This is where you would call:
    // const response = await fetch(`${this.apiEndpoint}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.apiKey}`
    //   },
    //   body: JSON.stringify({
    //     input: text,
    //     model: 'text-embedding-ada-002'
    //   })
    // });
    // const data = await response.json();
    // return data.data[0].embedding;
    
    // Generate a random embedding for demonstration
    return Array(128).fill(0).map(() => Math.random() * 2 - 1)
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length')
    }
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}