# Ultraterrestrial is designed to be an AI profuse collaborate research canvas for exploring the past, present and future of the Disclosure topic. As such the application's heart and soul - its core feature - is the State of Disclosure Mindmap

This feature and the complex architecture that it stands on is powered by a 3 tier data orchestration layer that I've begun to call Prometheus (as in the light bringer, bringer of fire, friend and guardian of mankind, review your Greek history people). Its composed of three ingestion pipelines.

1. An OpenAI Vector Storage instance that houses thousands of UFO + Disclosure related resources, transcripts etc (we can get into the details later) and serves as the brain and knowledge base for (anything that integrates with its RAG embedding API) Ultraterrestrial's Flagship custom OpenAI Assistant "Prometheus". file_search, and RAG capabilities are built in with little effort simply by attaching the vector storage instance to the prometheus AI assistant. In addition, the agent/assistant spec provides a slick handling of custom tool use...
2. Xata is our AI enriched relational database (Postgres) that is in charge of maintaing and orchestrating Disclosure data in a more structure and relational format, allowing all core domain model records to persist and benefit from all major CRUD functionality while remaining available for enhanced network and graph related record linking. Prometheus becomes even more powerful with his custom tooling allowing him to wield an additionally powerful structured DB with a whole suite of insane AI functionality itself.
3. Finally, our core external resources. Disclosure and Ufology data provided by those scholars who have come before us...and made a website.

## Core Reference andd Documentation Files

`apps/app/CORE_MINDMAP_FEATURE.md`
`apps/app/CORE_APP_AI_ARCHITECTURE_OVERVIEW.md`
`apps/app/CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE.md`
`apps/app/CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md`
`apps/app/MINDMAP_ADD_ENTITY_WORK_SESSION.md`
`apps/app/AGENTIC_ADD_ENTITY_TO_MINDMAP_FLOW.md`
`apps/app/CONTEXTUAL_INTELLIGENCE_REVIEW_PREFACE.md`
`apps/app/CONTEXTUAL_INTELLIGENCE_DOCUMENTATION.md`

## Prometheus External Resource Skill + Ingestion Pipeline

I propose we build it pretty much entirely from these repos:
<https://github.com/mendableai/firestarter>  
<https://github.com/mendableai/firecrawl-observer>
<https://github.com/mendableai/open-researcher>

## Prometheus Analysis Pipeline

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

## 🎯 Overview

This document details the **core functionality** of the UFO/UAP research platform: how Prometheus AI leverages Xata's built-in reasoning capabilities to create intelligent mindmap connections with meaningful edge annotations.

**Key Feature**: When a user selects an event, the system creates 3 contextually related child nodes with edges that display **Prometheus' reasoning** for why each connection was made.

## 🔄 Complete Data Flow

### 1. User Interaction

```
User selects event → User input node created → Prometheus AI activated
```

### 2. Prometheus Analysis Pipeline

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

### 3. Mindmap Visualization

```
Records + Reasoning → Child nodes created → Smart edges with annotations
```

## 🛠️ Technical Implementation

### Enhanced searchDatabase Function

**File**: `/src/services/ai/openai/tools/search-database.ts`

#### Xata SDK Integration

```typescript
// Use Xata's native search API for built-in reasoning
const searchResults = await xata.search.all(searchQuery, {
  tables: [
    {
      table: table,
      target: searchFields || ['name', 'title', 'description', 'summary'],
      boosters: [
        {
          dateBooster: {
            column: 'xata.createdAt',
            decay: 0.3,
            scale: '365d',
            factor: 2
          }
        }
      ]
    }
  ],
  page: { size: limit, offset: 0 },
  fuzziness: 1, // Typo tolerance
  highlight: { enabled: true }
})
```

#### Built-in Reasoning Extraction

```typescript
// Enhanced records with Xata's built-in reasoning
const enhancedRecords = searchResults.records?.map((result: any) => {
  const xataMetadata = result.xata || {}
  const highlights = xataMetadata.highlight || {}
  const score = xataMetadata.score || 0
  
  // Generate reasoning from Xata's relevancy data
  const highlightReasons = Object.entries(highlights).map(([field, matches]) => {
    return `matched in ${field}: ${matches}`
  }).join('; ')
  
  const relevancyReason = score > 0.5 ? 'high relevance' : 
                         score > 0.2 ? 'moderate relevance' : 'low relevance'
  
  return {
    ...record,
    xataReasoning: {
      score: score,
      relevancyLevel: relevancyReason,
      highlightReasons: highlightReasons || 'General content match',
      explanation: `Selected with ${relevancyReason} (score: ${score.toFixed(3)}) because it ${highlightReasons}`
    }
  }
})
```

### Prometheus Instructions Enhancement

**File**: `/src/app/api/disclosure/mindmap/route.ts`

```typescript
additional_instructions: `
# CRITICAL: Edge Reasoning Requirements
When you analyze database records, you MUST provide specific reasoning for WHY each record was selected and how it connects to the original query.

For each record returned, explain:
- WHY this specific record is relevant to the query
- WHAT connection or relationship it has to the original topic  
- HOW it relates to other selected records

Format your reasoning clearly so it can be extracted for edge annotations in the mindmap.

Example: "Record 1 (Bob Lazar) was selected because he directly worked at Area 51 and provides first-hand testimony about extraterrestrial technology, making him highly relevant to queries about UFO disclosure."
`
```

### Edge Annotation System

**File**: `/src/features/mindmap/edges/SiblingEdge.tsx`

#### Prometheus Reasoning Display

```typescript
// Get Prometheus reasoning for display
const getPrometheusAnnotation = () => {
  if (data?.prometheusReasoning) {
    const reasoning = data.prometheusReasoning
    return reasoning.length > 120 ? reasoning.substring(0, 120) + '...' : reasoning
  }
  return null
}

// Enhanced edge annotation with reasoning
{prometheusAnnotation && (
  <div className='mt-2 px-2 py-1 bg-black/80 rounded text-[8px] text-white/90 border border-white/20 max-w-[180px] leading-tight'>
    <div className='font-semibold text-emerald-400 mb-1'>Prometheus Analysis:</div>
    <div className='text-wrap'>{prometheusAnnotation}</div>
  </div>
)}
```

## 📊 Xata Reasoning Features Leveraged

### 1. Relevancy Scoring

- **BM25 Algorithm**: Frequency-based relevance ranking
- **Score Range**: 0.0 to 1.0 (higher = more relevant)
- **Usage**: Determines edge styling and reasoning priority

### 2. Highlight Matching  

- **Feature**: `xata.highlight` shows exactly what matched
- **Format**: `{"field": ["<em>term</em> context"]}`
- **Usage**: Explains WHY the record was selected

### 3. Boosters for Contextual Relevance

- **Date Booster**: Prioritizes recent records
- **Numeric Booster**: Uses metrics like view count, importance
- **Value Booster**: Exact match boosting for categories
- **Usage**: Influences reasoning explanations

### 4. Search Targeting

- **Field Targeting**: Search specific columns only
- **Weight Assignment**: Boost certain fields (title=5, description=2)
- **Fuzzy Matching**: Typo tolerance for better results

## 🎨 Visual Result

### Edge Styling Based on Xata Score

```typescript
const getContextualStyle = () => {
  const score = data?.xataReasoning?.score || 0
  
  return {
    stroke: score > 0.5 ? '#10b981' : // High relevance: emerald
            score > 0.2 ? '#6366f1' : // Medium relevance: indigo  
                         '#64748b',  // Low relevance: slate
    strokeWidth: 1 + (score * 2), // Thicker for higher relevance
    strokeDasharray: score > 0.3 ? 'none' : '4,4' // Solid for good matches
  }
}
```

### Sample Edge Annotation

```
┌─────────────────────────────┐
│ Query → Result 1            │
├─────────────────────────────┤
│ Prometheus Analysis:        │
│ Selected with high relevance│
│ (score: 0.743) because it   │
│ matched in name: Bob Lazar, │
│ description: Area 51 worker │
└─────────────────────────────┘
```

## 🔗 Data Structure Flow

### Xata Response

```typescript
{
  "totalCount": 3,
  "records": [
    {
      "record": {
        "id": "rec_123",
        "name": "Bob Lazar",
        "description": "Former Area 51 worker..."
      },
      "xata": {
        "score": 0.743,
        "highlight": {
          "name": ["<em>Bob Lazar</em>"],
          "description": ["<em>Area 51</em> worker"]
        },
        "table": "personnel"
      }
    }
  ]
}
```

### Enhanced Record

```typescript
{
  "id": "rec_123",
  "name": "Bob Lazar",
  "description": "Former Area 51 worker...",
  "xataReasoning": {
    "score": 0.743,
    "relevancyLevel": "high relevance",
    "highlightReasons": "matched in name: Bob Lazar, description: Area 51 worker",
    "explanation": "Selected with high relevance (score: 0.743) because it matched in name: Bob Lazar, description: Area 51 worker"
  }
}
```

### Edge Data

```typescript
{
  "id": "edge-user-123-rec_123",
  "type": "siblingEdge",
  "data": {
    "prometheusReasoning": "Selected with high relevance (score: 0.743) because it matched in name: Bob Lazar, description: Area 51 worker",
    "connectionType": "query-result",
    "xataScore": 0.743,
    "relevancyLevel": "high relevance"
  }
}
```

## 🚀 Benefits of Xata Integration

### 1. **Authentic Reasoning**

- Uses actual search algorithm data (not generated explanations)
- Highlights show exact match reasons
- Relevancy scores provide objective ranking

### 2. **Performance Optimized**

- Built-in search is faster than custom implementations
- Cached search results for repeated queries
- Efficient pagination and filtering

### 3. **Rich Context**

- Multiple relevancy factors (recency, importance, exact matches)
- Configurable boosters for domain-specific ranking
- Typo tolerance for flexible searching

### 4. **Scalable Architecture**

- Works with any Xata table structure
- Handles large datasets efficiently
- Built-in fallback mechanisms

## 🔧 Configuration Options

### Search Targeting

```typescript
target: [
  { column: 'title', weight: 5 },    // Boost title matches
  { column: 'description', weight: 3 }, // Boost descriptions  
  { column: 'summary', weight: 2 },     // Boost summaries
  '*'                                   // Include all other fields
]
```

### Boosters for UFO/UAP Context

```typescript
boosters: [
  // Boost recent sightings/events
  {
    dateBooster: {
      column: 'xata.createdAt',
      decay: 0.3,
      scale: '365d',
      factor: 2
    }
  },
  // Boost high-credibility sources
  {
    valueBooster: {
      column: 'credibility_level',
      value: 'high',
      factor: 3
    }
  },
  // Boost by witness count
  {
    numericBooster: {
      column: 'witness_count',
      factor: 1.5,
      modifier: 'log1p'
    }
  }
]
```

## 📝 Future Enhancements

### 1. **Dynamic Booster Configuration**

- User-configurable relevancy weights
- Context-aware booster selection
- Machine learning-optimized boosters

### 2. **Enhanced Reasoning Extraction**

- NLP parsing of Prometheus responses
- Structured reasoning templates
- Multi-language reasoning support

### 3. **Advanced Visualizations**

- Relevancy-based edge thickness
- Heat maps for search coverage
- Interactive reasoning explanations

---

## 📈 Current Status

### ✅ **Completed** (as of January 17, 2025 - 15:45 UTC)

1. **Enhanced searchDatabase Function**
   - ✅ Integrated Xata's native search API with relevancy scoring
   - ✅ Added built-in reasoning extraction from highlights and scores
   - ✅ Implemented boosters for UFO/UAP domain relevance
   - ✅ Added fallback mechanism for reliability

2. **Prometheus Instructions Enhancement**  
   - ✅ Updated disclosure/mindmap route with specific reasoning requirements
   - ✅ Added structured reasoning format requirements
   - ✅ Enhanced prompts for edge annotation clarity

3. **Edge Annotation System**
   - ✅ Enhanced SiblingEdge component with Prometheus reasoning display
   - ✅ Added visual styling based on relevancy scores
   - ✅ Implemented contextual edge types and animations

4. **Generic Implementation Validation**
   - ✅ Confirmed system works with ANY entity type (not just events)
   - ✅ Validated table parameter accepts any Xata table
   - ✅ Fixed hardcoded 'events' fallback in askAIAction
   - ✅ Verified user-input-node uses dynamic type from query

### 🔄 **In Progress**

1. **Testing Integration** - Need to verify end-to-end flow
2. **Data Structure Validation** - Ensure reasoning flows through all layers
3. **Edge Rendering Verification** - Confirm annotations display correctly

### ⏭️ **Next Steps** (Priority Order)

1. **IMMEDIATE (Next 30 minutes)**
   - Test the enhanced searchDatabase function with real queries
   - Verify Xata reasoning data flows to edge annotations  
   - Debug any data structure mismatches
   - Ensure user input → 3 child nodes → annotated edges works

2. **SHORT TERM (Next 2 hours)**
   - Refine reasoning extraction patterns for better accuracy
   - Optimize edge annotation layout and readability
   - Add error handling for edge cases
   - Test with various search queries and entity types

3. **MEDIUM TERM (Next day)**
   - Performance optimization for large result sets
   - Enhanced visual feedback for different relevancy levels
   - User testing and feedback integration
   - Documentation refinement

### 🚨 **Critical Dependencies**

- **Xata Search API**: Must be enabled in database settings
- **Prometheus Assistant**: Requires proper tool function registration
- **Vector Store**: File search must be working for entity extraction
- **React Flow**: Edge rendering depends on proper data structure

### 🔧 **Known Issues to Address**

1. **Data Flow Validation**: Need to confirm reasoning data reaches edge components
2. **Type Safety**: Ensure TypeScript interfaces match actual data structures  
3. **Error Handling**: Graceful degradation when Xata search fails
4. **Performance**: Large search results may impact edge rendering

### 📊 **Success Metrics**

- [ ] User selects event → 3 relevant child nodes appear
- [ ] Each edge shows meaningful Prometheus reasoning
- [ ] Reasoning reflects actual Xata search relevancy data
- [ ] Edge annotations are readable and contextually accurate
- [ ] System performs well with real UFO/UAP data

---

**This document captures the core intelligence of the UFO/UAP research platform - the seamless integration between Xata's search capabilities and Prometheus AI reasoning to create meaningful, explainable connections in the mindmap visualization.**

**Last Updated**: January 17, 2025 - 15:45 UTC  
**Status**: Core implementation complete and validated as generic, ready for testing  
**Next Action**: Test end-to-end flow with multiple entity types (personnel, organizations, topics, etc.)
