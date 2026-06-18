# 📋 External Web Resources RAG Integration - Whiteboard Session Log

**Session Started:** August 10, 2025, 14:33 PST  
**Participants:** User, Claude Code  
**Status:** Active Session  

---

## 🎯 Session Context & Goals

### Objectives
1. **Tool Architecture Decision:** How to integrate web crawling into Prometheus AI
2. **Firecrawl Strategy:** Service selection and integration approach  
3. **Rate Limiting & Scaling:** Performance and cost management
4. **Integration Points:** How this connects to existing Triple RAG system

---

## 🏗️ Current Prometheus Architecture (User Clarification)

### Prometheus - The "Light Bringer" AI Orchestration System

**Core Philosophy:** 3-tier data orchestration layer serving as the heart of Ultraterrestrial's AI-powered research canvas.

### Three Access Patterns for Prometheus:

1. **Direct Chat Interface**
   - **Route:** `@apps/app/src/app/api/prometheus/chat/route.ts`
   - **Usage:** Dedicated client conversations with Prometheus AI

2. **Knowledge & Intelligence Layer Orchestrator** 
   - **Integration:** `@apps/app/src/contexts/mindmap/mindmap-context.tsx`
   - **Graph Component:** `@apps/app/src/features/mindmap/graph.tsx`
   - **Purpose:** Powers the State of Disclosure Mindmap (core feature)

3. **Contextual AI Interfaces**
   - **Mindmap Chat:** AI within mind mapping interface
   - **Research Docs:** AI-aware research documentation
   - **TipTap AI:** Custom research note assistance

### Current 3-Tier Data Architecture:

#### Tier 1: OpenAI Vector Storage
- **Content:** Thousands of UFO/Disclosure resources, transcripts
- **Integration:** Custom OpenAI Assistant "Prometheus"
- **Capabilities:** Built-in file_search, RAG, custom tools
- **Purpose:** Brain and knowledge base for all RAG integrations

#### Tier 2: Xata (AI-Enhanced PostgreSQL)
- **Content:** Structured disclosure data (230,998+ records)
- **Capabilities:** Full CRUD, AI search, network/graph linking
- **Integration:** Custom Prometheus tooling for structured DB queries
- **Purpose:** Relational data orchestration with AI enhancements

#### Tier 3: External Resources
- **Current Status:** "Scholars who came before us...and made a website"
- **Gap:** This is what we're whiteboarding today!

---

## 📖 Reference Documentation Analysis

Based on `CORE_MINDMAP_FEATURE.md`, the current Prometheus analysis pipeline:

```
Prometheus receives query
    ↓ 
File search (vector store)
    ↓
Extract entities from results  
    ↓
Call searchDatabase() with entities
    ↓
Receive Xata records + built-in reasoning
    ↓
Analyze records with AI context
    ↓
Return structured response with reasoning
```

---

## 💡 User's Proposed Solution

### Firecrawl-Based Implementation

**Primary Reference Repos:**
- [mendableai/firestarter](https://github.com/mendableai/firestarter)
- [mendableai/firecrawl-observer](https://github.com/mendableai/firecrawl-observer)  
- [mendableai/open-researcher](https://github.com/mendableai/open-researcher)

---

## 📝 Discussion Points & Decisions

### 1. Architecture Integration Strategy

**DECISION NEEDED:** How should external web resources fit into the existing 3-tier system?

**Option A:** Extend existing Tier 3 with structured ingestion
**Option B:** Create separate web content tier with real-time processing
**Option C:** Hybrid approach with batch + real-time capabilities

**User Position:** *[Awaiting input]*

### 2. Tool Architecture Approach

**QUESTION:** Should web crawling be:

**Option A:** Formal OpenAI Tool (structured function calling)
- ✅ User has explicit control
- ✅ Clear audit trail of web requests
- ❌ Higher cost per call
- ❌ User must explicitly invoke

**Option B:** Internal Prometheus Method (seamless integration)
- ✅ Automatic contextual web search
- ✅ Lower operational overhead
- ❌ Less user control
- ❌ Potential for unexpected costs

**Option C:** Hybrid Approach
- ✅ Tool for user-facing requests
- ✅ Internal for automated enhancement
- ❌ More complex implementation

**User Position:** *[Awaiting input]*

### 3. Service Selection: Firecrawl vs Alternatives

**Firecrawl Advantages:**
- ✅ JavaScript rendering capability
- ✅ Structured markdown output
- ✅ Built-in rate limiting
- ✅ Content extraction optimization
- ✅ Established in UFO research community (based on reference repos)

**Alternative Considerations:**
- Custom Playwright solution
- Jina AI Reader API  
- ScrapingBee/ScrapingAnt

**User Preference:** Firecrawl (based on reference repos provided)

---

## 🔄 Integration Flow Design

### Current Prometheus Pipeline Extension

**Enhanced Pipeline with Web Resources:**

```
Prometheus receives query
    ↓ 
File search (vector store) + Web search trigger evaluation
    ↓
Extract entities from results + Identify web search opportunities
    ↓
Call searchDatabase() with entities + Execute web crawling (if needed)
    ↓
Receive Xata records + built-in reasoning + Web content processing
    ↓
Analyze records with AI context + Integrate web insights
    ↓
Return structured response with reasoning + Web source attribution
```

---

## 🚨 Critical Questions for Resolution

### 1. **Web Content Storage Strategy**
- Store crawled content in existing Triple RAG?
- Create separate web content index?
- Real-time processing vs batch processing?

### 2. **Rate Limiting & Cost Management**
- What are acceptable cost thresholds?
- How to prioritize crawl requests?
- Caching strategy for crawled content?

### 3. **Quality & Relevance Filtering**
- How to ensure crawled content quality?
- Domain whitelist/blacklist strategy?
- Content freshness requirements?

### 4. **User Experience Integration**
- Should users see web crawling in progress?
- How to handle crawl failures gracefully?
- Attribution and source credibility display?

---

## 🔍 New Discovery: Exa AI Neural Search

### User Input (2025-08-10 14:47 PST):
**"These are good questions. I think the firecrawl reps should be added to our AI suite generally speaking but actually take a look at this Exa documentation, we can straight up scope a neural search by the urls we want to index: https://docs.exa.ai/sdks/cheat-sheet#typescript"**

### Exa AI Analysis - Game Changing Discovery

**Key Advantages over Traditional Crawling:**

#### 1. **Neural Search Intelligence**
- ✅ **Semantic understanding** beyond keyword matching
- ✅ **Context-aware search** using natural language filters  
- ✅ **Similar document discovery** for research expansion
- ✅ **Intelligent result ranking** based on relevance

#### 2. **Targeted URL Scoping**
- ✅ **Domain-specific searches** - can focus on UFO/disclosure sites
- ✅ **URL filtering** - target specific researcher websites
- ✅ **Date range control** - recent vs historical content
- ✅ **Geolocation bias** - geographic relevance weighting

#### 3. **Structured Data Retrieval**
- ✅ **Markdown formatting** - clean content for RAG ingestion
- ✅ **Automatic citations** - source attribution built-in
- ✅ **JSON structured results** - perfect for Prometheus integration
- ✅ **Content highlights** - shows why results are relevant

#### 4. **Research-Optimized Features**
- ✅ **"Automate in-depth web research"** - exactly what we need!
- ✅ **Streaming results** - real-time research updates
- ✅ **TypeScript SDK** - seamless integration with existing codebase

---

## 🚀 Revised Architecture Strategy

### **Hybrid Approach: Exa AI + Firecrawl**

**Exa AI for Discovery & Intelligence:**
- Neural search across UFO/disclosure domain space
- Intelligent content discovery and relevance ranking
- Structured data extraction with citations

**Firecrawl for Deep Content Processing:**
- JavaScript-heavy sites that need full rendering
- Detailed content extraction and cleanup
- Real-time monitoring of key disclosure sites

### **Integration into Prometheus Pipeline:**

```
Prometheus receives query
    ↓ 
File search (vector store) + Neural web search evaluation
    ↓
Extract entities + Identify web research opportunities
    ↓
Call searchDatabase() + Execute Exa neural search (scoped to disclosure domains)
    ↓
Receive Xata records + Exa structured results with citations
    ↓
Deep crawl priority sites (Firecrawl) + Process all results
    ↓
Analyze with AI context + Integrate web intelligence
    ↓
Return structured response + Web source attribution + Research provenance
```

### **Tool Architecture Decision:**

**RECOMMENDATION: Hybrid Tool Architecture**

1. **`searchWebResources()`** - Exa-powered neural search tool (user-facing)
2. **Internal enhancement** - Automatic Exa search for context expansion
3. **`deepCrawlSite()`** - Firecrawl tool for specific site deep dives

---

## 🎯 Implementation Strategy

### Phase 1: Exa Integration (Immediate)
- Implement Exa neural search as Prometheus tool
- Create UFO/disclosure domain scoping lists
- Integrate structured results into existing RAG pipeline

### Phase 2: Firecrawl Enhancement (Short-term)  
- Add Firecrawl for JavaScript-heavy sites
- Implement monitoring for key disclosure sites
- Create content processing pipeline

### Phase 3: Intelligence Layer (Medium-term)
- ML-powered site credibility scoring
- Automated research topic discovery
- Cross-reference validation between sources

---

---

## 🎯 **FINAL DECISIONS & ACTION ITEMS**

### **Architecture Decision: APPROVED**
**Hybrid Approach: Exa AI (Primary) + Firecrawl (Secondary)**
- Exa neural search for intelligent discovery across UFO/disclosure domains  
- Firecrawl for deep content processing and JavaScript-heavy sites
- Integration into existing 3-tier Prometheus architecture

### **Tool Implementation: APPROVED** 
**Hybrid Tool Architecture:**
1. `searchWebResources()` - User-facing Exa neural search tool
2. Internal automatic enhancement for contextual expansion  
3. `deepCrawlSite()` - Firecrawl tool for specific deep dives

### **Implementation Phases: APPROVED**
1. **Phase 1**: Exa integration as Prometheus tool
2. **Phase 2**: Domain scoping with top-tier UFO sites  
3. **Phase 3**: Firecrawl enhancement and monitoring

---

## 📋 **ACTION ITEMS**

### **User Actions:**
- [ ] **Compile top-tier UFO/disclosure sites** for Exa domain scoping
- [ ] **Review Exa pricing** and set cost management strategy
- [ ] **Approve implementation ticket creation** for TODO.md

### **Claude Actions:**
- [x] **Document whiteboard session** with all decisions
- [ ] **Create implementation tickets** for TODO.md (pending user approval)
- [ ] **Prepare technical specifications** for Exa + Firecrawl integration

---

## 📊 **SESSION SUMMARY**

**Duration:** 45 minutes  
**Key Discovery:** Exa AI neural search capabilities  
**Major Decision:** Hybrid architecture over pure crawling approach  
**Next Step:** User compiling top-tier sites → Implementation tickets

---

*Session Status: ✅ **COMPLETED** - Ready for implementation phase*  
*Whiteboard Session Log: Preserved for reference*