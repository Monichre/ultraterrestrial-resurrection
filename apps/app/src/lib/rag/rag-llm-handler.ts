interface RAGSettings {
  mode: 'local' | 'remote'
  localUrl: string
  remoteUrl: string
  apiKey?: string
  enabled: boolean
}

interface RAGSuggestion {
  text: string
  confidence: number
  source?: string
}

interface RAGSearchResult {
  id: string
  title: string
  summary: string
  score: number
  type: string
  system?: string
  badge?: string
  source?: string
}

export class RAGLLMHandler {
  private settings: RAGSettings | null = null
  private settingsLoaded: boolean = false

  constructor() {
    this.loadSettings()
  }

  private async loadSettings(): Promise<void> {
    try {
      const response = await fetch('/api/admin/rag-settings')
      if (response.ok) {
        const data = await response.json()
        this.settings = {
          ...data,
          apiKey: data.hasApiKey ? this.settings?.apiKey || '' : ''
        }
        this.settingsLoaded = true
      }
    } catch (error) {
      console.error('Failed to load RAG settings:', error)
      this.settingsLoaded = true // Mark as loaded even on error
    }
  }

  private async ensureSettings(): Promise<void> {
    if (!this.settingsLoaded) {
      await this.loadSettings()
    }
  }

  private getBaseUrl(): string {
    if (!this.settings?.enabled) {
      throw new Error('RAG integration is disabled')
    }
    
    return this.settings.mode === 'local' 
      ? this.settings.localUrl 
      : this.settings.remoteUrl
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (this.settings?.mode === 'remote' && this.settings.apiKey) {
      headers['Authorization'] = `Bearer ${this.settings.apiKey}`
    }
    
    return headers
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    await this.ensureSettings()
    
    const baseUrl = this.getBaseUrl()
    const response = await fetch(`${baseUrl}/api/rag/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt,
        context: options?.context,
        maxTokens: options?.maxTokens || 500
      })
    })

    if (!response.ok) {
      throw new Error(`RAG generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.text || data.completion || ''
  }

  async getSuggestions(text: string, context?: any): Promise<RAGSuggestion[]> {
    await this.ensureSettings()
    
    const baseUrl = this.getBaseUrl()
    const response = await fetch(`${baseUrl}/api/rag/suggestions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        text,
        contextBefore: context?.before,
        contextAfter: context?.after,
        maxSuggestions: 5
      })
    })

    if (!response.ok) {
      console.error('RAG suggestions failed:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.suggestions || []
  }

  async searchDocuments(query: string, filters?: any): Promise<RAGSearchResult[]> {
    await this.ensureSettings()
    
    const baseUrl = this.getBaseUrl()
    
    // Try the new dual RAG endpoint first
    try {
      const ragResponse = await fetch(`${baseUrl}/rag/search`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query,
          top_k: 5,
          filter_type: filters?.type,
          include_metadata: true
        })
      })

      if (ragResponse.ok) {
        const ragData = await ragResponse.json()
        
        if (ragData.results && Array.isArray(ragData.results)) {
          return ragData.results.map((item: any) => ({
            id: item.id,
            title: item.source || 'Document',
            summary: item.text.substring(0, 200) + '...',
            score: item.score,
            type: item.metadata?.type || 'document',
            system: item.system,
            badge: item.badge,
            source: item.source
          }))
        }
      }
    } catch (error) {
      console.warn('Dual RAG search failed, falling back to legacy search:', error)
    }
    
    // Fallback to legacy search endpoint
    const response = await fetch(`${baseUrl}/search?` + new URLSearchParams({
      q: query,
      limit: '5',
      ...(filters?.type && { doc_type: filters.type })
    }), {
      method: 'GET',
      headers: this.getHeaders()
    })

    if (!response.ok) {
      console.error('Legacy search failed:', response.statusText)
      return []
    }

    const data = await response.json()
    
    // Transform the legacy response
    if (data.documents && Array.isArray(data.documents)) {
      return data.documents.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.title, // Legacy doesn't have summary
        score: 1.0, // Legacy doesn't have score
        type: item.doc_type || 'document',
        system: 'legacy',
        badge: '📄 Legacy',
        source: item.path || 'Unknown'
      }))
    }
    
    return []
  }

  async indexDocument(document: {
    id: string
    content: string
    metadata: any
  }): Promise<void> {
    await this.ensureSettings()
    
    const baseUrl = this.getBaseUrl()
    
    // Use the new dual RAG index endpoint
    const response = await fetch(`${baseUrl}/rag/index`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        content: document.content,
        metadata: {
          ...document.metadata,
          document_id: document.id
        },
        use_system: 'both' // Index in both systems
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to index document: ${response.statusText}`)
    }
  }

  async factCheck(text: string): Promise<{
    verified: boolean
    explanation: string
    sources: string[]
  }> {
    await this.ensureSettings()
    
    const baseUrl = this.getBaseUrl()
    
    // Search for relevant documents
    const searchResults = await this.searchDocuments(text)
    
    // For now, return a simple implementation
    // In production, this would use more sophisticated fact-checking
    return {
      verified: searchResults.length > 0,
      explanation: searchResults.length > 0 
        ? `Found ${searchResults.length} relevant sources`
        : 'No supporting evidence found',
      sources: searchResults.map(r => r.title)
    }
  }
}

// Global instance
export const ragHandler = new RAGLLMHandler()