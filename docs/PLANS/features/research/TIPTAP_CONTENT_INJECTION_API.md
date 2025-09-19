# Tiptap Collaboration Content Injection API Documentation

**Generated:** January 9, 2025  
**Version:** 1.0  
**Source:** [Tiptap Content Injection Documentation](https://tiptap.dev/docs/collaboration/documents/content-injection#create-a-document)  
**Target Implementation:** @apps/app/ and @apps/disclosure-rag/  
**Integration:** Tiptap Collaboration Documents + RAG System  

---

## Overview

The Tiptap Content Injection API enables server-side content manipulation of collaborative documents. This feature is essential for integrating AI-generated content, automated research findings, and dynamic data updates into the Ultraterrestrial Resurrection research platform.

## Key Features

- **Server-side content injection** into collaborative documents
- **Version history tracking** for all injected content
- **Real-time collaboration** compatibility
- **Multiple content formats** (JSON, binary, base64)
- **Node-specific updates** using UniqueID extension
- **Conflict-free merging** with concurrent edits

## Use Cases for Ultraterrestrial Platform

### 1. AI Research Integration

- **Live translation** of UFO/UAP research documents
- **Automated fact-checking** and citation insertion
- **Dynamic research updates** from RAG system
- **Entity relationship mapping** in real-time

### 2. Document Automation

- **Programmatic content tagging** for UFO sightings
- **Server-side component integration** (SQL query results)
- **Automated report generation** from database queries
- **Research timeline updates** based on new evidence

### 3. Collaborative Research

- **Multi-researcher document collaboration**
- **Version history** for research iterations
- **Conflict resolution** for concurrent edits
- **Research workflow automation**

## API Endpoints

### Update Existing Document

```http
PATCH /api/documents/:identifier?format=:format
```

**Parameters:**

- `identifier`: Document identifier (URI-encoded if necessary)
- `format`: Content format (`json`, `binary`, or `base64`)

**Response Codes:**

- `204`: Successful update
- `404`: Document not found
- `422`: Invalid payload or update failed

**Example cURL:**

```bash
curl --location --request PATCH 'https://YOUR_APP_ID.collab.tiptap.cloud/api/documents/DOCUMENT_NAME' \
--header 'Authorization: YOUR_SECRET_FROM_SETTINGS_AREA' \
--data '@yjsUpdate.binary'
```

### Create New Document

```http
POST /api/documents/:identifier?format=:format
```

**Response Codes:**

- `204`: Successful creation
- `409`: Document already exists
- `422`: Creation failed

## Content Formats

### 1. JSON Format (Recommended)

The JSON format allows for precise document manipulation and is ideal for AI-generated content.

**Advantages:**

- Human-readable and debuggable
- Precise node targeting with UniqueID
- Automatic conflict detection
- Append mode for non-destructive updates

**Example Implementation:**

```typescript
// @apps/app/src/lib/tiptap/content-injection.ts
import axios from 'axios'

interface TiptapDocument {
  content: Array<{
    type: string
    attrs?: Record<string, any>
    content?: any[]
  }>
}

export class TiptapContentInjector {
  private appId: string
  private secret: string
  private baseUrl: string

  constructor(appId: string, secret: string) {
    this.appId = appId
    this.secret = secret
    this.baseUrl = `https://${appId}.collab.tiptap.cloud`
  }

  async updateDocument(
    documentName: string, 
    content: TiptapDocument,
    options?: {
      nodeAttributeName?: string
      nodeAttributeValue?: string | string[]
      mode?: 'replace' | 'append'
      checksum?: string
    }
  ) {
    const params = new URLSearchParams()
    
    if (options?.nodeAttributeName) {
      params.append('nodeAttributeName', options.nodeAttributeName)
    }
    
    if (options?.nodeAttributeValue) {
      const values = Array.isArray(options.nodeAttributeValue) 
        ? options.nodeAttributeValue 
        : [options.nodeAttributeValue]
      values.forEach(value => params.append('nodeAttributeValue', value))
    }
    
    if (options?.mode) {
      params.append('mode', options.mode)
    }
    
    if (options?.checksum) {
      params.append('checksum', options.checksum)
    }

    const url = `${this.baseUrl}/api/documents/${documentName}?format=json&${params.toString()}`

    try {
      const response = await axios.patch(url, content, {
        headers: {
          'Authorization': this.secret,
          'Content-Type': 'application/json'
        }
      })
      
      return response.status === 204
    } catch (error) {
      console.error('Failed to update document:', error)
      throw error
    }
  }

  async createDocument(documentName: string, content: TiptapDocument) {
    const url = `${this.baseUrl}/api/documents/${documentName}?format=json`

    try {
      const response = await axios.post(url, content, {
        headers: {
          'Authorization': this.secret,
          'Content-Type': 'application/json'
        }
      })
      
      return response.status === 204
    } catch (error) {
      console.error('Failed to create document:', error)
      throw error
    }
  }

  async getDocument(documentName: string): Promise<TiptapDocument> {
    const url = `${this.baseUrl}/api/documents/${documentName}?format=json`

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': this.secret
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to get document:', error)
      throw error
    }
  }
}
```

### 2. Binary Format

Direct Yjs update messages for maximum performance.

```typescript
export class BinaryContentInjector extends TiptapContentInjector {
  async updateDocumentBinary(documentName: string, yjsUpdate: Uint8Array) {
    const url = `${this.baseUrl}/api/documents/${documentName}?format=binary`

    try {
      const response = await axios.patch(url, yjsUpdate, {
        headers: {
          'Authorization': this.secret,
          'Content-Type': 'application/octet-stream'
        }
      })
      
      return response.status === 204
    } catch (error) {
      console.error('Failed to update document with binary:', error)
      throw error
    }
  }
}
```

### 3. Base64 Format

Binary content encoded as Base64 string for text-based transmission.

```typescript
export class Base64ContentInjector extends TiptapContentInjector {
  async updateDocumentBase64(documentName: string, base64Content: string) {
    const url = `${this.baseUrl}/api/documents/${documentName}?format=base64`

    try {
      const response = await axios.patch(url, base64Content, {
        headers: {
          'Authorization': this.secret,
          'Content-Type': 'text/plain'
        }
      })
      
      return response.status === 204
    } catch (error) {
      console.error('Failed to update document with base64:', error)
      throw error
    }
  }
}
```

## Node-Specific Updates

### Using UniqueID Extension

For precise node targeting, use the UniqueID extension with specific node attributes.

```typescript
// @apps/app/src/lib/tiptap/node-updater.ts
export class NodeUpdater {
  constructor(private injector: TiptapContentInjector) {}

  async updateNodeAttributes(
    documentName: string,
    nodeId: string,
    attributes: Record<string, any>
  ) {
    const url = `${this.injector.baseUrl}/api/documents/${documentName}?format=json&nodeAttributeName=id&nodeAttributeValue=${nodeId}&mode=attrs`

    try {
      const response = await axios.patch(url, attributes, {
        headers: {
          'Authorization': this.injector.secret,
          'Content-Type': 'application/json'
        }
      })
      
      return response.status === 204
    } catch (error) {
      console.error('Failed to update node attributes:', error)
      throw error
    }
  }

  async appendToNode(
    documentName: string,
    nodeId: string,
    content: any[]
  ) {
    // First, get the current document
    const document = await this.injector.getDocument(documentName)
    
    // Find the target node
    const targetNode = this.findNodeById(document, nodeId)
    if (!targetNode) {
      throw new Error(`Node with ID ${nodeId} not found`)
    }

    // Append content to the node
    if (!targetNode.content) {
      targetNode.content = []
    }
    targetNode.content.push(...content)

    // Update the document
    return this.injector.updateDocument(documentName, document, {
      nodeAttributeName: 'id',
      nodeAttributeValue: nodeId
    })
  }

  private findNodeById(document: TiptapDocument, nodeId: string): any {
    const searchNodes = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.attrs?.id === nodeId) {
          return node
        }
        if (node.content) {
          const found = searchNodes(node.content)
          if (found) return found
        }
      }
      return null
    }

    return searchNodes(document.content)
  }
}
```

## Integration with RAG System

### Automated Research Updates

```typescript
// @apps/app/src/lib/tiptap/rag-integration.ts
import { RAGLLMHandler } from './custom-llm-handler'
import { TiptapContentInjector } from './content-injection'

export class RAGTiptapIntegration {
  constructor(
    private ragHandler: RAGLLMHandler,
    private tiptapInjector: TiptapContentInjector
  ) {}

  async injectResearchFindings(
    documentName: string,
    query: string,
    targetNodeId?: string
  ) {
    try {
      // Search RAG system for relevant information
      const findings = await this.ragHandler.searchDocuments(query, {
        topK: 5,
        includeMetadata: true
      })

      // Format findings as Tiptap content
      const content = this.formatResearchFindings(findings)

      if (targetNodeId) {
        // Inject into specific node
        const nodeUpdater = new NodeUpdater(this.tiptapInjector)
        await nodeUpdater.appendToNode(documentName, targetNodeId, content)
      } else {
        // Append to document
        await this.tiptapInjector.updateDocument(documentName, {
          content: content
        }, { mode: 'append' })
      }

      return { success: true, findingsCount: findings.length }
    } catch (error) {
      console.error('Failed to inject research findings:', error)
      throw error
    }
  }

  private formatResearchFindings(findings: any[]) {
    return findings.map(finding => ({
      type: 'researchFinding',
      attrs: {
        id: `finding-${finding.id}`,
        source: finding.source,
        confidence: finding.confidence,
        timestamp: new Date().toISOString()
      },
      content: [
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [
            {
              type: 'text',
              text: finding.title
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: finding.summary
            }
          ]
        },
        {
          type: 'paragraph',
          attrs: { class: 'citation' },
          content: [
            {
              type: 'text',
              text: `Source: ${finding.source} (Confidence: ${Math.round(finding.confidence * 100)}%)`
            }
          ]
        }
      ]
    }))
  }

  async injectFactCheck(
    documentName: string,
    textToCheck: string,
    targetNodeId: string
  ) {
    try {
      // Perform fact check using RAG system
      const factCheck = await this.ragHandler.getSuggestions(textToCheck, {
        type: 'factCheck'
      })

      // Create fact check annotation
      const annotation = {
        type: 'factCheckAnnotation',
        attrs: {
          id: `factcheck-${Date.now()}`,
          verified: factCheck.verified,
          confidence: factCheck.confidence,
          sources: factCheck.sources
        },
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: factCheck.explanation
              }
            ]
          }
        ]
      }

      // Inject annotation
      const nodeUpdater = new NodeUpdater(this.tiptapInjector)
      await nodeUpdater.appendToNode(documentName, targetNodeId, [annotation])

      return { success: true, verified: factCheck.verified }
    } catch (error) {
      console.error('Failed to inject fact check:', error)
      throw error
    }
  }
}
```

## Server Actions Integration

### Next.js Server Actions for Content Injection

```typescript
// @apps/app/src/app/actions/tiptap-injection.ts
'use server'

import { TiptapContentInjector } from '@/lib/tiptap/content-injection'
import { RAGTiptapIntegration } from '@/lib/tiptap/rag-integration'
import { RAGLLMHandler } from '@/lib/tiptap/custom-llm-handler'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const tiptapInjector = new TiptapContentInjector(
  process.env.TIPTAP_APP_ID!,
  process.env.TIPTAP_SECRET!
)

const ragHandler = new RAGLLMHandler()
const ragIntegration = new RAGTiptapIntegration(ragHandler, tiptapInjector)

export async function injectResearchFindings(
  documentName: string,
  query: string,
  targetNodeId?: string
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  try {
    const result = await ragIntegration.injectResearchFindings(
      documentName,
      query,
      targetNodeId
    )
    
    return { success: true, ...result }
  } catch (error) {
    console.error('Research injection failed:', error)
    return { success: false, error: error.message }
  }
}

export async function injectFactCheck(
  documentName: string,
  textToCheck: string,
  targetNodeId: string
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  try {
    const result = await ragIntegration.injectFactCheck(
      documentName,
      textToCheck,
      targetNodeId
    )
    
    return { success: true, ...result }
  } catch (error) {
    console.error('Fact check injection failed:', error)
    return { success: false, error: error.message }
  }
}

export async function updateDocumentContent(
  documentName: string,
  content: any,
  options?: {
    nodeAttributeName?: string
    nodeAttributeValue?: string | string[]
    mode?: 'replace' | 'append'
  }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  try {
    const success = await tiptapInjector.updateDocument(
      documentName,
      content,
      options
    )
    
    return { success }
  } catch (error) {
    console.error('Document update failed:', error)
    return { success: false, error: error.message }
  }
}
```

## Error Handling and Conflict Resolution

### Checksum-based Conflict Detection

```typescript
// @apps/app/src/lib/tiptap/conflict-resolution.ts
export class ConflictResolver {
  constructor(private injector: TiptapContentInjector) {}

  async updateWithConflictResolution(
    documentName: string,
    content: any,
    options?: {
      nodeAttributeName?: string
      nodeAttributeValue?: string | string[]
      maxRetries?: number
    }
  ) {
    const maxRetries = options?.maxRetries || 3
    let attempts = 0

    while (attempts < maxRetries) {
      try {
        // Get current document with checksum
        const response = await axios.get(
          `${this.injector.baseUrl}/api/documents/${documentName}?format=json`,
          {
            headers: { 'Authorization': this.injector.secret }
          }
        )
        
        const checksum = response.headers['x-tiptap-checksum']
        
        // Attempt update with checksum
        const success = await this.injector.updateDocument(
          documentName,
          content,
          {
            ...options,
            checksum
          }
        )
        
        if (success) {
          return { success: true, attempts: attempts + 1 }
        }
      } catch (error) {
        if (error.response?.status === 409) {
          // Checksum mismatch - retry
          attempts++
          await this.delay(1000 * attempts) // Exponential backoff
          continue
        }
        throw error
      }
    }

    throw new Error(`Failed to update document after ${maxRetries} attempts`)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// @apps/app/src/tests/tiptap-injection.test.ts
import { TiptapContentInjector } from '@/lib/tiptap/content-injection'
import { mockAxios } from './mocks'

describe('Tiptap Content Injection', () => {
  let injector: TiptapContentInjector

  beforeEach(() => {
    injector = new TiptapContentInjector('test-app', 'test-secret')
    mockAxios()
  })

  it('should update document with JSON content', async () => {
    const content = {
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Test content' }]
        }
      ]
    }

    const result = await injector.updateDocument('test-doc', content)
    expect(result).toBe(true)
  })

  it('should handle node-specific updates', async () => {
    const content = {
      content: [
        {
          type: 'paragraph',
          attrs: { id: 'test-node' },
          content: [{ type: 'text', text: 'Updated content' }]
        }
      ]
    }

    const result = await injector.updateDocument('test-doc', content, {
      nodeAttributeName: 'id',
      nodeAttributeValue: 'test-node'
    })
    
    expect(result).toBe(true)
  })

  it('should handle conflict resolution', async () => {
    const conflictResolver = new ConflictResolver(injector)
    
    const content = {
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Conflicting content' }]
        }
      ]
    }

    const result = await conflictResolver.updateWithConflictResolution(
      'test-doc',
      content
    )
    
    expect(result.success).toBe(true)
    expect(result.attempts).toBeGreaterThan(0)
  })
})
```

## Security Considerations

### Authentication and Authorization

```typescript
// @apps/app/src/lib/tiptap/security.ts
export class TiptapSecurity {
  static validateDocumentAccess(
    documentName: string,
    userId: string,
    userRole: string
  ): boolean {
    // Implement document-level access control
    const allowedRoles = ['admin', 'researcher', 'editor']
    return allowedRoles.includes(userRole)
  }

  static sanitizeContent(content: any): any {
    // Remove potentially dangerous content
    const sanitized = JSON.parse(JSON.stringify(content))
    
    // Remove script tags and dangerous attributes
    this.removeScriptTags(sanitized)
    this.removeDangerousAttributes(sanitized)
    
    return sanitized
  }

  private static removeScriptTags(content: any) {
    if (content.content) {
      content.content = content.content.filter((node: any) => 
        node.type !== 'script' && node.attrs?.tag !== 'script'
      )
      content.content.forEach((node: any) => this.removeScriptTags(node))
    }
  }

  private static removeDangerousAttributes(content: any) {
    if (content.attrs) {
      const dangerousAttrs = ['onclick', 'onload', 'onerror', 'javascript:']
      dangerousAttrs.forEach(attr => delete content.attrs[attr])
    }
    
    if (content.content) {
      content.content.forEach((node: any) => this.removeDangerousAttributes(node))
    }
  }
}
```

## Performance Optimization

### Caching and Batching

```typescript
// @apps/app/src/lib/tiptap/performance.ts
export class TiptapPerformanceOptimizer {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private batchQueue: Array<{ documentName: string; content: any; options?: any }> = []
  private batchTimer?: NodeJS.Timeout

  constructor(private injector: TiptapContentInjector) {}

  async getDocumentCached(documentName: string, ttl: number = 300000): Promise<any> {
    const cached = this.cache.get(documentName)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }

    const data = await this.injector.getDocument(documentName)
    this.cache.set(documentName, { data, timestamp: Date.now() })
    
    return data
  }

  queueUpdate(documentName: string, content: any, options?: any) {
    this.batchQueue.push({ documentName, content, options })
    
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.processBatch(), 1000)
    }
  }

  private async processBatch() {
    if (this.batchQueue.length === 0) return

    const batch = [...this.batchQueue]
    this.batchQueue = []
    this.batchTimer = undefined

    // Process updates in parallel
    const promises = batch.map(({ documentName, content, options }) =>
      this.injector.updateDocument(documentName, content, options)
    )

    await Promise.allSettled(promises)
  }
}
```

## Integration Examples

### Research Document Automation

```typescript
// @apps/app/src/lib/tiptap/research-automation.ts
export class ResearchDocumentAutomation {
  constructor(
    private injector: TiptapContentInjector,
    private ragIntegration: RAGTiptapIntegration
  ) {}

  async createResearchDocument(
    topic: string,
    researcherId: string
  ): Promise<string> {
    const documentName = `research-${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    
    // Create initial document structure
    const initialContent = {
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: `Research: ${topic}` }]
        },
        {
          type: 'paragraph',
          attrs: { id: 'research-summary' },
          content: [{ type: 'text', text: 'Research summary will be populated automatically...' }]
        },
        {
          type: 'paragraph',
          attrs: { id: 'key-findings' },
          content: [{ type: 'text', text: 'Key findings will be added here...' }]
        },
        {
          type: 'paragraph',
          attrs: { id: 'sources' },
          content: [{ type: 'text', text: 'Sources and citations will be listed here...' }]
        }
      ]
    }

    await this.injector.createDocument(documentName, initialContent)

    // Populate with initial research
    await this.ragIntegration.injectResearchFindings(
      documentName,
      topic,
      'research-summary'
    )

    return documentName
  }

  async updateResearchWithNewFindings(
    documentName: string,
    newQuery: string
  ) {
    // Add new findings to key findings section
    await this.ragIntegration.injectResearchFindings(
      documentName,
      newQuery,
      'key-findings'
    )

    // Update sources section
    await this.ragIntegration.injectResearchFindings(
      documentName,
      newQuery,
      'sources'
    )
  }
}
```

## Deployment Configuration

### Environment Variables

```bash
# .env.local
TIPTAP_APP_ID=your_app_id
TIPTAP_SECRET=your_secret_key
TIPTAP_BASE_URL=https://your_app_id.collab.tiptap.cloud
```

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  env: {
    TIPTAP_APP_ID: process.env.TIPTAP_APP_ID,
    TIPTAP_SECRET: process.env.TIPTAP_SECRET,
  },
  // ... other config
}
```

## Monitoring and Logging

### Content Injection Analytics

```typescript
// @apps/app/src/lib/tiptap/analytics.ts
export class TiptapAnalytics {
  static trackContentInjection(
    documentName: string,
    injectionType: string,
    success: boolean,
    metadata?: any
  ) {
    // Log to analytics service
    console.log('Content Injection Event:', {
      documentName,
      injectionType,
      success,
      timestamp: new Date().toISOString(),
      metadata
    })

    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to your analytics service
      this.sendToAnalytics({
        event: 'content_injection',
        documentName,
        injectionType,
        success,
        metadata
      })
    }
  }

  private static sendToAnalytics(data: any) {
    // Implementation depends on your analytics service
    // Example: PostHog, Mixpanel, etc.
  }
}
```

---

## Summary

The Tiptap Content Injection API provides powerful capabilities for server-side document manipulation in the Ultraterrestrial Resurrection platform. Key benefits include:

1. **Seamless AI Integration** - Direct injection of RAG-generated content
2. **Real-time Collaboration** - Maintains collaborative editing capabilities
3. **Version History** - Full tracking of all content changes
4. **Conflict Resolution** - Automatic handling of concurrent edits
5. **Performance Optimization** - Efficient content updates with caching

This integration enables sophisticated research automation while maintaining the collaborative nature of the platform's document system.

---

**End of Tiptap Content Injection API Documentation**

*Last Updated: January 9, 2025*
*Integration Status: Ready for Implementation*
