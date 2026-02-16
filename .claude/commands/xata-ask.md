---
command: "/xata-ask"
category: "db, Xata, AI, search"
purpose: "AI-powered natural language queries and intelligent search across Xata database"
wave-enabled: false
performance-profile: "optimization"
---

# Xata AI Ask & Search Command

<agent>
🤖 ai-database-agent (#06b6d4)
</agent>

<task>
You are an AI database assistant. Execute natural language queries and intelligent searches against the Xata database using AI-powered analysis to answer questions and find relevant information.
</task>

<context>
Docs: @packages/db/docs/XATA_METHODS.md, @packages/db/docs/XATA_EXAMPLES.md
Project Database: @packages/db/
AI Functions: @packages/db/src/xata-typescript-sdk/api/ask.ts, @packages/db/src/xata-typescript-sdk/api/search.ts
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users, user-notes, tags, theories
Import Pattern: `import { askXata, searchXata } from '@packages/db/src/xata-typescript-sdk/api'`
</context>

<operation>
Execute AI-powered natural language queries and searches:

**Arguments**:

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `question` | ✓ | string | Natural language question or search query | - |
| `table` | - | string | Target table for focused search | auto-detect |
| `mode` | - | string | Query mode: ask, search, hybrid | hybrid |
| `limit` | - | number | Maximum results to return | 10 |
| `format` | - | string | Output format: text, json, summary | text |

**Flags**:

- `--ask` - Use AI ask mode for direct questions
- `--search` - Use vector/text search mode
- `--hybrid` - Combine ask and search (default)
- `--comprehensive` - Include detailed AI analysis
- `--context` - Show context and reasoning
- `--sources` - Include source references
- `--related` - Show related queries/suggestions

**Examples**:

```bash
# Natural language questions
/xata-ask question="What UFO events happened in Nevada in 1947?"
/xata-ask question="Who are the most credible UFO witnesses?" --comprehensive
/xata-ask question="What classified documents mention crash retrievals?" --sources

# Focused table queries
/xata-ask question="Find testimonies about military encounters" table=testimonies
/xata-ask question="Show recent disclosure events" table=events --context

# Search operations
/xata-ask question="Roswell incident details" --search --related
/xata-ask question="Project Blue Book analysis" mode=search limit=20

# Advanced queries
/xata-ask question="Correlation between sightings and military bases" --hybrid --comprehensive
/xata-ask question="Timeline of government disclosure" format=json --sources
```

</operation>

<implementation>
1. Parse natural language question and parameters
2. Import AI functions and determine optimal query strategy
3. Execute query based on mode:
   - **Ask**: Direct AI question answering with context
   - **Search**: Vector/text search across database
   - **Hybrid**: Combine both approaches for comprehensive results
4. Apply table targeting and result limiting
5. Generate contextual responses with source attribution
6. Provide related query suggestions

**Code Template**:

```typescript
import { askXata, searchXata } from '@packages/db/src/xata-typescript-sdk/api';

// Parse arguments
const { 
  question, 
  table, 
  mode = 'hybrid', 
  limit = 10, 
  format = 'text',
  comprehensive = false,
  context = false,
  sources = false,
  related = false
} = args;

// Execute query based on mode
let results = {};

switch (mode) {
  case 'ask':
    results = await executeAskQuery(question, table, { comprehensive, context });
    break;
  case 'search':
    results = await executeSearchQuery(question, { table, limit, sources });
    break;
  default:
    // Hybrid approach
    const askResults = await executeAskQuery(question, table, { comprehensive: false });
    const searchResults = await executeSearchQuery(question, { table, limit: limit/2 });
    results = await combineResults(askResults, searchResults);
}

// Add related suggestions if requested
if (related) {
  results.related = await generateRelatedQueries(question, results);
}

// Format output
return formatResponse(results, format, { sources, context });
```

</implementation>

<output_format>

```text
🤖 XATA AI QUERY RESULTS
Question: "{question}"
Mode: {mode}
Table(s): {tables_searched}
Found: {results_count} results
Response Time: {response_time}ms

═══════════════════════════════════════════════

💡 AI ANSWER
{ai_generated_answer}

📊 SUPPORTING DATA
{relevant_records_summary}

🔍 SEARCH RESULTS
{search_results_list}

═══════════════════════════════════════════════

📚 SOURCES (if --sources)
{source_references}

🧠 REASONING (if --context)
{ai_reasoning_explanation}

🔗 RELATED QUERIES (if --related)
- {related_question_1}
- {related_question_2}
- {related_question_3}

💡 SUGGESTIONS
{query_improvement_suggestions}

🔗 FOLLOW-UP COMMANDS
- Deep research: /xata-research query="{related_research_query}"
- Specific data: /xata-read table={relevant_table} filter={suggested_filter}
- Analysis: /xata-analyze table={relevant_table} type=distribution

⚡ Tip: Use --comprehensive for deeper AI analysis
```

</output_format>

<query_modes>

**Ask Mode**:
- Direct AI question answering
- Natural language understanding
- Contextual responses with reasoning
- Cross-table relationship understanding
- Conversational follow-up capability

**Search Mode**:
- Vector similarity search
- Full-text search across fields
- Relevance scoring and ranking
- Metadata and field filtering
- Fuzzy matching capabilities

**Hybrid Mode**:
- Combines ask and search approaches
- AI-guided search refinement
- Contextual result interpretation
- Comprehensive coverage
- Balanced precision and recall

</query_modes>

<ai_capabilities>

**Natural Language Processing**:
- Question intent recognition
- Entity extraction from queries
- Temporal and spatial understanding
- Context maintenance across queries
- Ambiguity resolution

**Knowledge Integration**:
- Cross-table relationship mapping
- Historical context awareness
- Domain-specific understanding (UFO/UAP)
- Credibility assessment integration
- Pattern recognition in responses

**Response Generation**:
- Evidence-based answers
- Source attribution and citations
- Confidence scoring
- Alternative interpretations
- Follow-up question suggestions

</ai_capabilities>

<error_handling>

- Handle ambiguous or unclear questions gracefully
- Provide query clarification suggestions
- Fall back to search if AI ask fails
- Handle empty or insufficient results
- Explain limitations in AI understanding
- Suggest query reformulations
- Handle timeout scenarios for complex queries
- Provide partial results if full query fails

</error_handling>

<validation>
- Validate natural language question format
- Check table existence if specified
- Ensure query is actionable and specific enough
- Verify AI service availability
- Confirm sufficient context for meaningful results
- Validate output format options
- Check permissions for sensitive data access
</validation>