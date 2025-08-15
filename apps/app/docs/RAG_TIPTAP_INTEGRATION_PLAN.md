# RAG-TipTap Integration Plan

## Executive Summary

This document outlines the integration plan for connecting the Disclosure RAG system (@apps/disclosure-rag/) with TipTap AI in the main application (@apps/app/).

## Architecture Overview

### 1. API Layer Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   TipTap Editor     │────▶│    API Gateway      │────▶│   RAG Python API    │
│   (React/TS)        │◀────│   (Node.js/TS)      │◀────│   (FastAPI)         │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                     │                              │
                                     ▼                              ▼
                            ┌─────────────────┐           ┌─────────────────┐
                            │  TipTap Doc     │           │   Vector Store   │
                            │    Server       │           │   (Upstash)      │
                            └─────────────────┘           └─────────────────┘
```

### 2. Component Structure

#### A. Python RAG API Wrapper (New)

Location: `@apps/disclosure-rag/api/`

- FastAPI application exposing REST endpoints
- Endpoints:
  - `/search` - Semantic search in knowledge base
  - `/suggestions` - Real-time editor suggestions
  - `/citations` - Get citation details
  - `/analyze` - Deep document analysis (async)
  - `/agents/{agent_type}` - Access specific agents

#### B. API Gateway (New)

Location: `@apps/app/src/services/rag-gateway/`

- Authentication middleware
- Rate limiting
- Request transformation
- WebSocket support for real-time features
- Credential management for TipTap

#### C. TipTap RAG Extension (New)

Location: `@apps/app/src/components/tiptap-extension/rag/`

- Custom TipTap extension for RAG features
- Citation node type
- Suggestion plugin
- Context window management

## Integration Points

### 1. Research Editor Enhancement

```typescript
// @apps/app/src/components/research/research-editor.tsx
import { RagExtension } from '@/components/tiptap-extension/rag';
import { useRagContext } from '@/hooks/use-rag-context';

const extensions = [
  // Existing extensions...
  RagExtension.configure({
    apiEndpoint: process.env.NEXT_PUBLIC_RAG_API,
    suggestionTrigger: '@@',
    citationFormat: 'inline',
    contextWindow: 2000,
  }),
];
```

### 2. AI Menu Integration

```typescript
// Add to AIDropdown.tsx
const ragActions = [
  {
    label: 'Research Context',
    icon: <SearchIcon />,
    action: 'rag-search',
  },
  {
    label: 'Fact Check',
    icon: <CheckIcon />,
    action: 'rag-verify',
  },
  {
    label: 'Add Citation',
    icon: <QuoteIcon />,
    action: 'rag-cite',
  },
];
```

## Security Implementation

### 1. Credential Management

```typescript
// @apps/app/src/lib/tiptap/config.ts
export const tiptapConfig = {
  docServer: {
    id: process.env.TIPTAP_DOC_SERVER_ID,
    environment: process.env.TIPTAP_ENV_NAME,
  },
  // Never expose secrets client-side
  // API Gateway handles authentication
};

// Server-side only (@apps/app/src/services/rag-gateway/auth.ts)
const tiptapSecrets = {
  appSecret: process.env.TIPTAP_APP_SECRET,
  apiSecret: process.env.TIPTAP_API_SECRET,
};
```

### 2. Environment Variables

```bash
# .env.local
TIPTAP_DOC_SERVER_ID=09xopqy9
TIPTAP_ENV_NAME=ultraterrestrial-doc-server
TIPTAP_APP_SECRET=<encrypted>
TIPTAP_API_SECRET=<encrypted>
RAG_API_URL=http://localhost:8000
RAG_API_KEY=<generated>
```

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)

- [ ] Create FastAPI wrapper for RAG system
- [ ] Set up API Gateway with authentication
- [ ] Implement secure credential storage
- [ ] Basic health check endpoints

### Phase 2: TipTap Extension (Week 3-4)

- [ ] Develop RAG TipTap extension
- [ ] Implement suggestion plugin
- [ ] Create citation node type
- [ ] Add context window management

### Phase 3: Feature Integration (Week 5-6)

- [ ] Integrate with Research Editor
- [ ] Enhance AI menu with RAG options
- [ ] Implement real-time suggestions
- [ ] Add citation management UI

### Phase 4: Advanced Features (Week 7-8)

- [ ] Agent-specific integrations
- [ ] Background analysis tasks
- [ ] WebSocket real-time updates
- [ ] Performance optimization

## API Specifications

### RAG API Endpoints

#### 1. Search Endpoint

```http
POST /api/rag/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "string",
  "context": "string",
  "topK": 5,
  "filters": {
    "documentType": ["files", "research"],
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    }
  }
}
```

#### 2. Suggestions Endpoint

```http
POST /api/rag/suggestions
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "string",
  "cursor": 123,
  "contextBefore": "string",
  "contextAfter": "string",
  "maxSuggestions": 5
}
```

#### 3. TipTap Document Server Integration

```http
POST /api/tiptap/documents
Authorization: Bearer <tiptap-token>
Content-Type: application/json

{
  "documentId": "string",
  "content": "string",
  "metadata": {
    "ragContext": ["citation-ids"],
    "entities": ["entity-ids"]
  }
}
```

## Performance Considerations

### 1. Caching Strategy

- Redis cache for frequent queries
- Edge caching for static knowledge
- Client-side suggestion cache

### 2. Rate Limiting

```typescript
const rateLimits = {
  search: '10 requests per minute',
  suggestions: '30 requests per minute',
  analysis: '5 requests per hour',
};
```

### 3. Optimization Techniques

- Debounced suggestion requests
- Prefetch common queries
- Progressive context loading

## Monitoring & Observability

### 1. Metrics to Track

- API response times
- Suggestion relevance scores
- Citation accuracy rates
- User engagement metrics

### 2. Logging Strategy

```typescript
// Structured logging
logger.info('rag.suggestion', {
  userId: user.id,
  query: query.substring(0, 50),
  responseTime: duration,
  resultCount: results.length,
});
```

## Testing Strategy

### 1. Unit Tests

- RAG API endpoints
- TipTap extension functionality
- Authentication/authorization

### 2. Integration Tests

- End-to-end suggestion flow
- Citation management
- Real-time updates

### 3. Performance Tests

- Load testing API endpoints
- Suggestion latency testing
- Concurrent user scenarios

## Rollout Plan

### 1. Beta Testing

- Internal team testing
- Limited user group
- Feedback collection

### 2. Gradual Rollout

- Feature flags for progressive enablement
- A/B testing for UI variations
- Performance monitoring

### 3. Full Launch

- Documentation updates
- User training materials
- Support preparation

## Success Metrics

1. **Performance**
   - Suggestion latency < 200ms
   - 99.9% API uptime
   - < 1% error rate

2. **User Engagement**
   - 50% adoption rate among active users
   - Average 10+ RAG interactions per session
   - 80% user satisfaction score

3. **Content Quality**
   - 90% citation accuracy
   - 85% suggestion relevance
   - 95% fact-check accuracy

## Next Steps

1. Review and approve architecture
2. Set up development environments
3. Begin Phase 1 implementation
4. Schedule weekly progress reviews
