# Xata Ask SDK - Comprehensive Implementation for UFO/UAP Research

## Overview

This implementation provides a complete wrapper around Xata's Ask SDK with advanced features specifically designed for UFO/UAP research. It includes comprehensive search configurations, domain-specific rules, and specialized functions for different types of research scenarios.

## Table of Contents

1. [Core Features](#core-features)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [UFO/UAP Research Enhancements](#ufo-uap-research-enhancements)
5. [Research Conversation Builder](#research-conversation-builder)
6. [Multi-table Research](#multi-table-research)
7. [Streaming Capabilities](#streaming-capabilities)
8. [Configuration Examples](#configuration-examples)
9. [Best Practices](#best-practices)

## Core Features

### Basic Ask Functions
- `askXata()` - Core function with full SDK support
- `askXataWithAi()` - Enhanced version that fetches actual record data
- `askFollowUp()` - Session-based follow-up questions
- `askXataComprehensive()` - Full feature set matching SDK documentation
- `askStream()` - Streaming responses for real-time updates

### Enhanced Features
- **Rules System**: Pre-configured AI guidance rules
- **Search Types**: Keyword and vector search support
- **Boosters**: Value and numeric boosters for relevance scoring
- **Target Columns**: Weighted column targeting
- **Session Management**: Conversation continuity
- **Record Fetching**: Automatic conversion from IDs to full records

## Basic Usage

### Simple Question

```typescript
import { askXata } from '@db/xata/api';

const result = await askXata(
  'events', 
  'What are the most credible UFO sightings?'
);

console.log(result.answer);
console.log(`Session ID: ${result.sessionId}`);
console.log(`Found ${result.records.length} relevant records`);
```

### Getting Full Record Data

```typescript
import { askXataWithAi } from '@db/xata/api';

const result = await askXataWithAi({
  table: 'events',
  question: 'Tell me about UFO sightings with military witnesses',
  rules: [
    'Focus on incidents with military or official witnesses',
    'Include details about radar confirmation or official investigations'
  ]
});

// result.records contains actual record objects, not just IDs
result.records.forEach(record => {
  console.log(`Event: ${record.name}`);
  console.log(`Location: ${record.location}`);
  console.log(`Date: ${record.date}`);
});
```

## Advanced Features

### Custom Search Configuration

```typescript
import { askXata } from '@db/xata/api';

const result = await askXata('events', 'Find UFO incidents with government involvement', {
  rules: [
    'Prioritize cases with official government acknowledgment',
    'Include classification status and investigation details'
  ],
  searchType: 'keyword',
  search: {
    fuzziness: 1,
    prefix: 'phrase',
    target: [
      'description',
      { column: 'name', weight: 3 },
      { column: 'government_acknowledgment', weight: 2.5 }
    ],
    boosters: [{
      valueBooster: {
        column: 'government_involvement',
        value: 'confirmed',
        factor: 2.0
      }
    }, {
      numericBooster: {
        column: 'credibility_score',
        factor: 1.5
      }
    }],
    filter: {
      classification_status: { $ne: 'classified' }
    }
  }
});
```

### Vector Search

```typescript
import { askXata } from '@db/xata/api';

const result = await askXata('testimonies', 'Find similar witness descriptions', {
  searchType: 'vector',
  vectorSearch: {
    column: 'description_embedding',
    contentColumn: 'description',
    filter: {
      witness_credibility: 'high'
    }
  }
});
```

## UFO/UAP Research Enhancements

### Pre-configured Research Types

```typescript
import { ufoResearch } from '@db/xata/api';

// Credibility-focused analysis
const credibleSightings = await ufoResearch.askCredibilityAnalysis(
  'events',
  'What are the most scientifically documented UFO cases?',
  {
    includeDebunked: false,
    minCredibilityScore: 7
  }
);

// Government disclosure research
const disclosureInfo = await ufoResearch.askGovernmentDisclosure(
  'events',
  'Which UFO cases led to official government acknowledgment?',
  {
    includeClassified: false,
    officialOnly: true
  }
);

// Historical timeline analysis
const historicalAnalysis = await ufoResearch.askHistoricalTimeline(
  'events',
  'How have UFO incidents evolved since the 1940s?',
  {
    startYear: 1940,
    endYear: 2024,
    includeAncient: false
  }
);

// Geographic pattern analysis
const geographicPatterns = await ufoResearch.askGeographicPatterns(
  'events',
  'Are there UFO hotspots in the southwestern United States?',
  {
    region: 'United States',
    centerLat: 35.0,
    centerLng: -106.0,
    radius: 500 // kilometers
  }
);
```

### Available Research Rules

#### Scientific Analysis
```typescript
const rules = ufoResearch.RULES.SCIENTIFIC_ANALYSIS;
// - Always prioritize scientifically documented incidents
// - Include details about official investigations
// - Focus on incidents with physical evidence
// - Distinguish between explained and unexplained cases
```

#### Historical Context
```typescript
const rules = ufoResearch.RULES.HISTORICAL_CONTEXT;
// - Provide historical context including time period
// - Consider witness credibility
// - Include subsequent investigations
```

#### Disclosure Focused
```typescript
const rules = ufoResearch.RULES.DISCLOSURE_FOCUSED;
// - Emphasize government transparency cases
// - Include congressional hearings and official reports
// - Focus on policy-changing cases
```

#### Pattern Analysis
```typescript
const rules = ufoResearch.RULES.PATTERN_ANALYSIS;
// - Look for patterns in locations and timing
// - Compare incidents across time periods
// - Identify common technology descriptions
```

## Research Conversation Builder

### Complex Investigation Sessions

```typescript
import { ufoResearch } from '@db/xata/api';

// Start a research conversation
const investigation = new ufoResearch.UFOResearchConversation('events');

// Begin investigation
const initial = await investigation.startInvestigation(
  'What are the most credible military UFO encounters?',
  'SCIENTIFIC_ANALYSIS'
);

console.log('Initial findings:', initial.answer);

// Ask follow-up questions
const followUp1 = await investigation.askFollowUp(
  'Which of these cases had radar confirmation?',
  'CREDIBLE_SIGHTINGS'
);

const followUp2 = await investigation.askFollowUp(
  'Were any of these cases officially investigated?',
  'GOVERNMENT_DISCLOSURE'
);

// Generate comprehensive report
const report = await investigation.generateInvestigationReport();
console.log('Investigation Report:', report);

// Get conversation summary
const summary = investigation.getConversationSummary();
console.log(`Asked ${summary.totalQuestions} questions`);
console.log('Session ID:', summary.sessionId);
```

## Multi-table Research

### Cross-table Analysis

```typescript
import { ufoResearch } from '@db/xata/api';

const comprehensiveResults = await ufoResearch.askMultiTableResearch(
  'What evidence exists for UFO technology reverse engineering?',
  {
    tables: ['events', 'personnel', 'testimonies', 'documents'],
    researchType: 'SCIENTIFIC_ANALYSIS'
  }
);

console.log('Combined Analysis:', comprehensiveResults.combinedAnswer);

// Access individual table results
console.log('Events found:', comprehensiveResults.tableResults.events);
console.log('Personnel involved:', comprehensiveResults.tableResults.personnel);
console.log('Testimonies:', comprehensiveResults.tableResults.testimonies);
```

## Streaming Capabilities

### Real-time Response Streaming

```typescript
import { askStream } from '@db/xata/api';

const stream = await askStream('events', 'Analyze UFO incident patterns', {
  rules: ['Provide detailed analysis with evidence'],
  searchType: 'keyword',
  search: {
    fuzziness: 1,
    target: ['description', 'name', 'summary']
  }
});

const reader = stream.getReader();

try {
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    if (value.answer) {
      console.log('Streaming response:', value.answer);
    }
    
    if (value.records) {
      console.log('Found records:', value.records);
    }
  }
} finally {
  reader.releaseLock();
}
```

## Configuration Examples

### Building Complex Search Configurations

```typescript
import { createAskConfig } from '@db/xata/api';

// Create a comprehensive search configuration
const config = createAskConfig({
  rules: [
    'Focus on high-credibility incidents',
    'Include official investigations'
  ],
  searchType: 'keyword',
  fuzziness: 1,
  prefix: 'phrase',
  targets: [
    'description',
    { column: 'name', weight: 3 },
    { column: 'witness_credibility', weight: 2 }
  ],
  valueBooters: [{
    column: 'official_investigation',
    value: 'confirmed',
    factor: 2.0
  }],
  filter: {
    credibility_score: { $gte: 6 },
    debunked: { $ne: true }
  }
});

const result = await askXata('events', 'Find the most credible UFO cases', config);
```

### Pre-configured Search Templates

```typescript
import { ufoResearch } from '@db/xata/api';

// Use pre-configured search for credible sightings
const credibleConfig = ufoResearch.CONFIGS.CREDIBLE_SIGHTINGS;

// Use pre-configured search for government disclosure
const disclosureConfig = ufoResearch.CONFIGS.GOVERNMENT_DISCLOSURE;

// Use pre-configured search for historical analysis
const historicalConfig = ufoResearch.CONFIGS.HISTORICAL_TIMELINE;

// Use pre-configured search for geographic patterns
const geographicConfig = ufoResearch.CONFIGS.GEOGRAPHIC_PATTERNS;
```

## Best Practices

### 1. Choose the Right Search Type

```typescript
// Use keyword search for text-based queries
searchType: 'keyword'

// Use vector search for semantic similarity
searchType: 'vector'
```

### 2. Optimize Target Columns

```typescript
// Weight important columns higher
target: [
  { column: 'name', weight: 3 },      // Most important
  { column: 'summary', weight: 2 },   // Secondary
  'description'                        // Standard weight (1)
]
```

### 3. Use Appropriate Fuzziness

```typescript
// Exact matches for proper nouns/names
fuzziness: 0

// Some tolerance for general text
fuzziness: 1

// High tolerance for fuzzy matching
fuzziness: 2
```

### 4. Apply Relevant Filters

```typescript
// Filter out debunked cases for credibility research
filter: {
  debunked: { $ne: true },
  credibility_score: { $gte: 5 }
}

// Filter by date range for historical analysis
filter: {
  date: {
    $gte: new Date('1947-01-01'),
    $lte: new Date('2024-12-31')
  }
}
```

### 5. Use Boosters Strategically

```typescript
// Boost confirmed government cases
boosters: [{
  valueBooster: {
    column: 'government_involvement',
    value: 'confirmed',
    factor: 2.0
  }
}, {
  // Boost based on witness count
  numericBooster: {
    column: 'witness_count',
    factor: 1.5
  }
}]
```

### 6. Maintain Session Context

```typescript
// Keep session ID for follow-up questions
const initial = await askXata('events', 'What are credible UFO cases?');
const sessionId = initial.sessionId;

// Use session for context-aware follow-ups
const followUp = await askFollowUp(
  'events', 
  'Which had physical evidence?', 
  sessionId
);
```

### 7. Handle Errors Gracefully

```typescript
try {
  const result = await askXata('events', question, options);
  return result;
} catch (error) {
  console.error('Ask query failed:', error);
  
  // Fallback to simpler query
  return await askXata('events', question, {
    searchType: 'keyword',
    search: { fuzziness: 1 }
  });
}
```

## TypeScript Types

All functions are fully typed for excellent developer experience:

```typescript
interface XataAskOptions {
  rules?: string[];
  searchType?: 'keyword' | 'vector';
  search?: {
    fuzziness?: number;
    prefix?: 'phrase' | 'disabled';
    target?: (string | { column: string; weight?: number })[];
    boosters?: Array<{
      valueBooster?: {
        column: string;
        value: string;
        factor: number;
      };
      numericBooster?: {
        column: string;
        factor: number;
        modifier?: 'log' | 'log1p' | 'log2p' | 'ln' | 'ln1p' | 'ln2p' | 'square' | 'sqrt' | 'reciprocal';
      };
    }>;
    filter?: Record<string, any>;
  };
  vectorSearch?: {
    column: string;
    contentColumn?: string;
    filter?: Record<string, any>;
  };
  sessionId?: string;
}

interface AskResponseWithRecords {
  answer: string;
  sessionId: string;
  records: any[];
}
```

This implementation provides a comprehensive solution for UFO/UAP research using Xata's Ask SDK with advanced features, domain-specific optimizations, and excellent TypeScript support. 