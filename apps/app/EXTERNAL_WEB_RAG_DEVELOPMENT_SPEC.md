# External Web Resources RAG Pipeline Development Specification

**Project:** Prometheus Knowledge Base Enhancement  
**Date:** August 7, 2025  
**Status:** Development Specification  
**Version:** 1.0  

## Executive Summary

This specification outlines the development of an External Web Resources RAG Pipeline for the Prometheus AI knowledge base system. The pipeline will extend the existing RAG functionality by automatically ingesting, monitoring, and maintaining up-to-date knowledge from reputable online UFO/UAP disclosure resources, combining the capabilities of Firestarter (website-to-knowledge-base conversion) and Firecrawl Observer (content change monitoring).

### Key Objectives

- **Extend RAG Coverage**: Add real-time web content to complement existing database and research-backed RAG pipeline
- **Automated Knowledge Ingestion**: Convert 32 core external resources into searchable knowledge bases
- **Dynamic Content Updates**: Monitor and update knowledge bases when source content changes
- **Seamless Integration**: Integrate with existing Prometheus AI system and contextual intelligence
- **Quality Assurance**: Maintain high-quality, relevant content through AI-powered filtering

## Current Architecture Analysis

### Existing Prometheus System

**Core Components:**
- **Prometheus AI** (`src/features/agents/prometheus.tsx`) - Main OpenAI Assistant interface
- **Contextual Intelligence** (`src/features/mindmap/utils/contextual-intelligence.ts`) - Smart filtering and context analysis
- **OpenAI Assistant + Vector Store** - Primary RAG backend (asst_sdNxYC9p05iGpeKXtL496cyh, vs_meWOEnUiUxtQWf0W6NBsNpCG)
- **Xata Database** - 230,998+ records across 29 models
- **FireCrawl Integration** - Existing web scraping capabilities

**Current RAG Architecture:**
1. **Primary Layer**: Xata database with vector search
2. **Research Layer**: Python RAG system (apps/disclosure-rag) with triple backend
3. **Processing Layer**: Document analysis and contextual intelligence

### External Resources Inventory

**Source File**: `src/utils/constants/resources.ts` (92 resources)  
**Target File**: `src/utils/constants/core-resources.ts` (32 curated resources)  

**Core Resources Include:**
- Government archives (archives.gov, theblackvault.com)
- Research organizations (MUFON, CUFOS, NARCAP)
- News and analysis (thedebrief.org, openminds.tv)
- Academic initiatives (Harvard Galileo Project, AARO)
- Documentation hubs (uap.guide, ufos.wiki)

## Technical Architecture

### External Web RAG Pipeline Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROMETHEUS KNOWLEDGE BASE                     │
├─────────────────────────────────────────────────────────────────┤
│  Existing RAG Layers:                                           │
│  ├── OpenAI Assistant + Vector Store                           │
│  ├── Xata Database (230K+ records)                            │
│  └── Python Triple RAG System                                 │
├─────────────────────────────────────────────────────────────────┤
│  NEW: External Web Resources RAG Pipeline                       │
│  ├── Web Knowledge Bases (Firestarter)                        │
│  ├── Content Change Monitoring (Firecrawl Observer)           │
│  ├── AI-Powered Content Filtering                             │
│  └── Contextual Intelligence Integration                       │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### 1. Web Knowledge Base Generator (Firestarter Integration)

**Purpose**: Convert each core external resource into a searchable knowledge base

**Implementation**:
```typescript
// src/services/external-rag/web-knowledge-generator.ts
interface WebKnowledgeBase {
  id: string;
  url: string;
  name: string;
  upstashIndexId: string;
  lastUpdated: Date;
  status: 'active' | 'error' | 'updating';
  metadata: {
    crawlDepth: number;
    documentCount: number;
    lastCrawlDuration: number;
  };
}

class WebKnowledgeGenerator {
  async createKnowledgeBase(resource: CoreResource): Promise<WebKnowledgeBase>
  async updateKnowledgeBase(knowledgeBaseId: string): Promise<void>
  async searchKnowledgeBase(knowledgeBaseId: string, query: string): Promise<SearchResult[]>
}
```

**Key Features**:
- Automatic Firecrawl-based content extraction
- Upstash Search vector indexing
- Configurable crawl depth per resource type
- Parallel knowledge base creation
- Error handling and retry mechanisms

#### 2. Content Change Monitor (Firecrawl Observer Integration)

**Purpose**: Track content changes across monitored resources and trigger updates

**Implementation**:
```typescript
// src/services/external-rag/content-monitor.ts
interface ChangeDetection {
  resourceId: string;
  changeType: 'content' | 'structure' | 'new_pages';
  confidence: number;
  aiAnalysis: string;
  detectedAt: Date;
  processed: boolean;
}

class ContentMonitor {
  async setupMonitoring(resource: CoreResource): Promise<string>
  async processChangeNotification(changeData: ChangeDetection): Promise<void>
  async getChangeHistory(resourceId: string): Promise<ChangeDetection[]>
}
```

**Key Features**:
- AI-powered change filtering (ignore minor updates, focus on significant content)
- Configurable monitoring intervals per resource
- Webhook-based change notifications
- Change impact assessment
- Automatic knowledge base updates for significant changes

#### 3. External RAG Search Orchestrator

**Purpose**: Coordinate searches across external web knowledge bases with existing RAG layers

**Implementation**:
```typescript
// src/services/external-rag/search-orchestrator.ts
interface SearchRequest {
  query: string;
  context?: GraphContext;
  searchLayers: ('database' | 'assistant' | 'external')[];
  maxResultsPerLayer: number;
}

interface AggregatedSearchResult {
  databaseResults: SearchResult[];
  assistantResults: SearchResult[];
  externalResults: ExternalSearchResult[];
  confidence: number;
  relevanceScores: LayerRelevanceScore[];
}

class ExternalRAGOrchestrator {
  async search(request: SearchRequest): Promise<AggregatedSearchResult>
  async intelligentLayerSelection(query: string, context?: GraphContext): Promise<string[]>
  async rankAndMergeResults(results: AggregatedSearchResult): Promise<SearchResult[]>
}
```

**Key Features**:
- Contextual Intelligence integration for smart resource selection
- Multi-layer search coordination
- Result relevance scoring and deduplication
- Query-context matching for targeted searches
- Performance optimization with parallel searches

#### 4. AI Content Quality Filter

**Purpose**: Ensure only high-quality, relevant content enters the knowledge base

**Implementation**:
```typescript
// src/services/external-rag/quality-filter.ts
interface ContentQuality {
  relevanceScore: number;
  credibilityScore: number;
  freshnessScore: number;
  uniquenessScore: number;
  overallScore: number;
  reasoning: string;
}

class AIQualityFilter {
  async assessContent(content: string, sourceUrl: string): Promise<ContentQuality>
  async shouldIncludeContent(quality: ContentQuality): Promise<boolean>
  async filterSearchResults(results: SearchResult[]): Promise<SearchResult[]>
}
```

**Key Features**:
- Multi-dimensional quality assessment
- Credibility scoring based on source reputation
- Duplicate content detection
- Relevance to UFO/UAP disclosure topics
- Configurable quality thresholds

### Integration Points

#### 1. Prometheus AI Enhancement

**File**: `src/app/api/prometheus/chat/route.ts`

**New Tool Integration**:
```typescript
searchExternalResources: tool({
  description: 'Search external UFO/UAP resources for additional context and recent information',
  parameters: z.object({
    query: z.string().describe('Search query for external resources'),
    context: z.object({}).optional().describe('Current graph context for targeted search'),
    sources: z.array(z.string()).optional().describe('Specific sources to search'),
    limit: z.number().optional().describe('Maximum results per source'),
  }),
  execute: async ({ query, context, sources, limit }) => {
    const orchestrator = new ExternalRAGOrchestrator();
    return await orchestrator.search({
      query,
      context,
      searchLayers: ['external'],
      maxResultsPerLayer: limit || 5,
    });
  },
}),

monitorResourceUpdates: tool({
  description: 'Check for recent updates across monitored external resources',
  parameters: z.object({
    timeframe: z.string().optional().describe('Time range for updates (24h, 7d, 30d)'),
    resourceIds: z.array(z.string()).optional().describe('Specific resources to check'),
  }),
  execute: async ({ timeframe = '7d', resourceIds }) => {
    const monitor = new ContentMonitor();
    return await monitor.getRecentUpdates(timeframe, resourceIds);
  },
}),
```

#### 2. Core Resources Management

**Enhancement**: `src/utils/constants/core-resources.ts`

```typescript
export interface CoreResource {
  url: string;
  name: string;
  category: 'government' | 'research' | 'news' | 'academic' | 'documentation';
  priority: 'high' | 'medium' | 'low';
  monitoringConfig: {
    interval: number; // hours
    changeThreshold: number; // AI confidence threshold
    enableNotifications: boolean;
  };
  crawlConfig: {
    maxDepth: number;
    includePatterns?: string[];
    excludePatterns?: string[];
  };
}

export const CORE_RESOURCES: CoreResource[] = [
  {
    url: "https://thedebrief.org/category/uap/",
    name: "The Debrief - UAP Coverage",
    category: "news",
    priority: "high",
    monitoringConfig: {
      interval: 6,
      changeThreshold: 0.8,
      enableNotifications: true,
    },
    crawlConfig: {
      maxDepth: 3,
      includePatterns: ["/uap/", "/ufo/"],
      excludePatterns: ["/ads/", "/comments/"],
    },
  },
  // ... other resources
];
```

#### 3. Database Schema Extensions

**New Tables** (via Xata):
```typescript
// External Web Knowledge Bases tracking
interface ExternalKnowledgeBases {
  id: string;
  resourceId: string;
  upstashIndexId: string;
  status: 'active' | 'error' | 'updating';
  lastCrawled: Date;
  lastUpdated: Date;
  documentCount: number;
  crawlDuration: number;
  errorMessage?: string;
}

// Content change tracking
interface ContentChanges {
  id: string;
  resourceId: string;
  changeType: string;
  confidence: number;
  aiAnalysis: string;
  detectedAt: Date;
  processed: boolean;
  updateTriggered: boolean;
}

// Search analytics
interface ExternalSearchAnalytics {
  id: string;
  query: string;
  resourceIds: string[];
  resultCount: number;
  responseTime: number;
  userSatisfaction?: number;
  createdAt: Date;
}
```

## Implementation Strategy

### Phase 1: Core Infrastructure (Weeks 1-2)

**Goals**: Establish foundation components and basic integration

**Tasks**:
1. **Environment Setup**
   - Configure Firestarter dependencies (Upstash, Firecrawl API keys)
   - Set up Firecrawl Observer with Convex backend
   - Create development environment variables

2. **Core Service Implementation**
   - Implement `WebKnowledgeGenerator` class
   - Create `ContentMonitor` service skeleton
   - Build basic `ExternalRAGOrchestrator`
   - Implement `AIQualityFilter` with OpenAI integration

3. **Database Schema Updates**
   - Add new Xata tables for external knowledge base tracking
   - Create migration scripts for schema updates
   - Implement data access layer functions

4. **API Route Creation**
   - Create `/api/external-rag/knowledge-bases` endpoints
   - Implement `/api/external-rag/monitoring` webhooks
   - Add `/api/external-rag/search` orchestration endpoint

**Deliverables**:
- Basic external RAG infrastructure
- Core resource configuration system
- Initial knowledge base creation capability
- Database schema updates

### Phase 2: Knowledge Base Generation (Weeks 3-4)

**Goals**: Create knowledge bases for all 32 core resources

**Tasks**:
1. **Bulk Knowledge Base Creation**
   - Implement parallel processing for multiple resources
   - Add error handling and retry mechanisms
   - Create progress tracking and reporting
   - Optimize Firecrawl configuration per resource type

2. **Quality Assurance System**
   - Implement AI-powered content filtering
   - Create relevance scoring algorithms
   - Add duplicate detection and deduplication
   - Build content quality metrics dashboard

3. **Integration Testing**
   - Test knowledge base creation for each resource category
   - Validate search functionality across generated knowledge bases
   - Performance testing with concurrent operations
   - Error handling and recovery testing

4. **Monitoring Setup**
   - Configure Firecrawl Observer for each resource
   - Set up webhook endpoints for change notifications
   - Implement change impact assessment
   - Create monitoring dashboard

**Deliverables**:
- 32 active external knowledge bases
- Content quality assurance system
- Change monitoring infrastructure
- Performance and monitoring dashboards

### Phase 3: Prometheus Integration (Weeks 5-6)

**Goals**: Integrate external RAG with existing Prometheus AI system

**Tasks**:
1. **Prometheus Enhancement**
   - Add new search tools to Prometheus chat interface
   - Implement contextual intelligence integration
   - Create result aggregation and ranking system
   - Add external source attribution

2. **Contextual Intelligence Integration**
   - Enhance `getGraphContext` to include external resource hints
   - Implement intelligent resource selection based on context
   - Create query-to-source matching algorithms
   - Add temporal context for news vs. historical content

3. **User Experience Enhancement**
   - Add external source indicators in search results
   - Create source credibility displays
   - Implement result explanation and reasoning
   - Add user feedback mechanisms for result quality

4. **Performance Optimization**
   - Implement search result caching
   - Add parallel search execution
   - Optimize query routing to relevant sources
   - Create search analytics and monitoring

**Deliverables**:
- Enhanced Prometheus AI with external RAG capabilities
- Contextual intelligence integration
- Improved user experience with external source integration
- Performance optimization and analytics

### Phase 4: Production Readiness (Weeks 7-8)

**Goals**: Prepare system for production deployment and ongoing operation

**Tasks**:
1. **Production Infrastructure**
   - Set up production Upstash and Convex environments
   - Configure production API keys and security
   - Implement proper error handling and logging
   - Set up monitoring and alerting

2. **Operational Procedures**
   - Create knowledge base maintenance procedures
   - Implement automated health checking
   - Create backup and recovery procedures
   - Document troubleshooting guides

3. **Performance Monitoring**
   - Set up comprehensive system monitoring
   - Create performance dashboards
   - Implement cost tracking and optimization
   - Add user satisfaction metrics

4. **Documentation and Training**
   - Create user documentation for new external RAG features
   - Document operational procedures
   - Create troubleshooting and FAQ guides
   - Train team on new system capabilities

**Deliverables**:
- Production-ready external RAG system
- Comprehensive monitoring and alerting
- Operational documentation and procedures
- Team training and knowledge transfer

## Data Flow Architecture

### 1. Knowledge Base Creation Flow
```
Core Resources → Firestarter → Upstash Indexing → Knowledge Base Registry → Search Availability
     ↓              ↓              ↓                    ↓                      ↓
Config Load → Web Crawl → Vector Embedding → Database Update → Search Testing
```

### 2. Content Monitoring Flow
```
Firecrawl Observer → Change Detection → AI Analysis → Update Decision → Knowledge Base Refresh
        ↓                 ↓              ↓              ↓                 ↓
Resource Monitor → Content Diff → Quality Score → Trigger Update → Search Re-index
```

### 3. Search Request Flow
```
User Query → Context Analysis → Source Selection → Parallel Search → Result Aggregation → Response
     ↓            ↓                ↓               ↓                 ↓                 ↓
Prometheus → Graph Context → Resource Match → Multi-RAG Query → Ranking/Dedup → Formatted Answer
```

## OpenAI Deep Research API Integration Opportunity

### Enhanced Research Capabilities (2025)

**OpenAI Deep Research Models**:
- `o3-deep-research-2025-06-26` (comprehensive synthesis)
- `o4-mini-deep-research-2025-06-26` (latency-sensitive)

**Key Integration Points**:
1. **Upgrade Prometheus AI** (`src/app/api/prometheus/chat/route.ts`) with deep research models
2. **Enhanced Vector Store Capabilities** - Direct vector search via Vector Store API
3. **File Search Tool** - Hosted RAG tool in Responses API with metadata filtering
4. **MCP Server Support** - Extend with private knowledge stores

**Implementation Strategy**:
```typescript
// Enhanced external search tool for Prometheus
deepResearchTool: tool({
  description: 'Conduct comprehensive multi-step research on UAP/UFO topics with external sources',
  parameters: z.object({
    query: z.string(),
    depth: z.enum(['comprehensive', 'fast']),
    includeExternalSources: z.boolean().default(true)
  }),
  execute: async ({ query, depth, includeExternalSources }) => {
    const model = depth === 'comprehensive' ? 
      'o3-deep-research-2025-06-26' : 
      'o4-mini-deep-research-2025-06-26'
    
    return await streamText({
      model: openai(model),
      tools: [
        { type: 'web_search_preview' },
        { 
          type: 'file_search',
          vector_store_ids: [VECTOR_STORE_ID]
        }
      ]
    })
  }
})
```

**Benefits for External RAG Pipeline**:
- **Autonomous research planning** for complex UFO/UAP investigations
- **Multi-step reasoning** across external sources and internal knowledge base
- **Structured report generation** with citations from external web resources
- **Background processing** for long-form research tasks

## Technical Requirements

### Infrastructure Dependencies

**Required Services**:
- **Upstash Search**: Vector database for knowledge base storage
- **Firecrawl API**: Web scraping and content extraction
- **Convex**: Real-time database for Firecrawl Observer
- **OpenAI API**: Content quality assessment and search enhancement

**Configuration Requirements**:
```env
# Firestarter Configuration
UPSTASH_SEARCH_URL=your_upstash_search_url
UPSTASH_SEARCH_TOKEN=your_upstash_search_token
FIRECRAWL_API_KEY=your_firecrawl_api_key

# Firecrawl Observer Configuration
CONVEX_DEPLOYMENT=your_convex_deployment
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# AI Content Analysis
OPENAI_API_KEY=your_openai_api_key

# Monitoring Configuration
EXTERNAL_RAG_WEBHOOK_SECRET=your_webhook_secret
MONITORING_NOTIFICATION_EMAIL=your_notification_email
```

### Performance Requirements

**Search Performance**:
- External RAG search response time: < 2 seconds
- Knowledge base creation time: < 30 minutes per resource
- Content monitoring latency: < 1 hour for change detection
- Concurrent search capacity: 50+ simultaneous queries

**Storage Requirements**:
- Estimated vector storage: 500MB - 2GB per knowledge base
- Total storage for 32 resources: 16GB - 64GB
- Search index size: 10-20% of source content size
- Backup storage: 2x primary storage requirement

**API Rate Limits**:
- Firecrawl API: 100 requests/hour for crawling
- Upstash Search: 10,000 requests/day for search operations
- OpenAI API: 3,500 RPM for content analysis
- Total estimated cost: $200-500/month at full capacity

### Security Requirements

**API Security**:
- All external API keys encrypted and stored securely
- Webhook endpoints secured with HMAC signatures
- Rate limiting on all public endpoints
- Input validation and sanitization

**Data Security**:
- Vector embeddings stored encrypted at rest
- Search queries logged without sensitive content
- User data anonymized in analytics
- GDPR compliance for EU users

**Access Control**:
- Admin-only access to knowledge base management
- User-level access controls for search features
- Audit logging for all system changes
- Regular security assessments and updates

## Risk Assessment

### Technical Risks

**High Risk**:
1. **External API Dependencies**: Failure of Firecrawl or Upstash services could disable external RAG
   - *Mitigation*: Implement fallback to database-only search, service redundancy
   
2. **Content Quality Degradation**: Poor quality content could pollute search results
   - *Mitigation*: Robust AI filtering, manual review processes, user feedback systems

**Medium Risk**:
3. **Performance Impact**: External searches could slow down Prometheus response times
   - *Mitigation*: Parallel search execution, result caching, timeout limits
   
4. **Cost Escalation**: Vector storage and API usage costs could exceed budget
   - *Mitigation*: Usage monitoring, automatic scaling limits, cost alerting

**Low Risk**:
5. **Source Reliability**: External sources could become unreliable or change structure
   - *Mitigation*: Monitoring and alerting, manual fallback procedures, source diversity

### Operational Risks

**Medium Risk**:
1. **Maintenance Overhead**: System requires ongoing maintenance and monitoring
   - *Mitigation*: Automated maintenance procedures, comprehensive monitoring, documentation

2. **Knowledge Base Staleness**: Content could become outdated without proper monitoring
   - *Mitigation*: Automated change detection, regular refresh cycles, freshness indicators

## Success Metrics

### Technical Metrics

**Search Performance**:
- Average response time for external RAG queries: < 2.0 seconds
- Search result relevance score (user feedback): > 4.0/5.0
- Knowledge base coverage: 90%+ of core resources successfully indexed
- System availability: 99.5% uptime

**Content Quality**:
- AI quality filter accuracy: > 85% relevant content retained
- Duplicate content rate: < 5% of total indexed content
- User satisfaction with external source results: > 4.2/5.0
- Content freshness: 80%+ of content updated within 30 days of source changes

### Business Metrics

**User Engagement**:
- Increase in Prometheus query volume: 25%+ growth
- External source result click-through rate: > 15%
- User session duration increase: 20%+ longer research sessions
- Feature adoption rate: 60%+ of active users utilize external RAG

**Knowledge Base Growth**:
- Total indexed documents: 10,000+ documents across all sources
- Knowledge base update frequency: Average 2-3 updates per source per week
- Search query coverage: 80%+ of queries return external results when relevant
- Source diversity: Results from 15+ different external sources per month

### ROI Metrics

**Cost Efficiency**:
- Cost per search query: < $0.05
- Knowledge base maintenance cost: < $1,000/month
- User satisfaction improvement: Measurable increase in research effectiveness
- Time to information: 30%+ reduction in time to find relevant UFO/UAP information

## Conclusion

The External Web Resources RAG Pipeline represents a significant enhancement to the Prometheus knowledge base system, extending its capabilities to include real-time, high-quality information from reputable external sources. By combining the power of Firestarter's knowledge base generation with Firecrawl Observer's change monitoring, integrated through existing contextual intelligence systems, this implementation will provide users with comprehensive, up-to-date access to the broader UFO/UAP disclosure landscape.

The phased implementation approach ensures careful integration with existing systems while maintaining system reliability and performance. Success will be measured through improved search relevance, increased user engagement, and enhanced research effectiveness, ultimately advancing the goal of comprehensive UAP/UFO knowledge accessibility.

**Next Steps**:
1. Stakeholder review and approval of specification
2. Resource allocation and team assignment
3. Phase 1 implementation kickoff
4. Continuous monitoring and optimization throughout development

---

**Document Metadata**:
- **Created**: August 7, 2025, 5:47 PM PST
- **Author**: Claude Code (Sonnet 4)
- **Project**: Ultraterrestrial Resurrection - Prometheus Enhancement
- **Classification**: Development Specification
- **Review Required**: Technical Architecture, Security, Budget Approval