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
    
    // Use the existing search endpoint from the disclosure-rag API
    const response = await fetch(`${baseUrl}/search?` + new URLSearchParams({
      query,
      limit: '5',
      ...(filters?.type && { type: filters.type })
    }), {
      method: 'GET',
      headers: this.getHeaders()
    })

    if (!response.ok) {
      console.error('RAG search failed:', response.statusText)
      return []
    }

    const data = await response.json()
    
    // Transform the response to match our expected format
    if (data.results && Array.isArray(data.results)) {
      return data.results.map((item: any) => ({
        id: item.id || item._id,
        title: item.title || item.name,
        summary: item.summary || item.description || '',
        score: item.score || item._score || 0,
        type: item.type || item.category || 'document'
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
    
    // This would need to be implemented in the disclosure-rag API
    const response = await fetch(`${baseUrl}/api/rag/index`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(document)
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