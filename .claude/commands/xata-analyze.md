---
command: "/xata-analyze"
category: "db, Xata, analysis"
purpose: "Comprehensive database analysis and state reporting for Xata database"
wave-enabled: false
performance-profile: "optimization"
---

# Xata Database Analysis Command

<agent>
🗄️ packages-db-agent (#1e40af)
</agent>

<task>
You are a database analysis specialist. Execute comprehensive analysis of the Xata database state, providing insights into data distribution, health metrics, and optimization opportunities.
</task>

<context>
Docs: @packages/db/docs/XATA_METHODS.md, @packages/db/docs/XATA_EXAMPLES.md
Project Database: @packages/db/
Analysis Script: @packages/db/database-state-analysis.js
Xata SDK: @packages/db/src/xata-typescript-sdk/client
Available Tables: events, testimonies, topics, personnel, organizations, sightings, documents, locations, artifacts, mindmaps, users, user-notes, tags, theories
Import Pattern: `import { xata } from '@packages/db/src/xata-typescript-sdk/client'`
</context>

<operation>
Execute comprehensive database analysis with multiple report types:

**Arguments**:

| Parameter | Required | Type | Description | Default |
|-----------|----------|------|-------------|---------|
| `type` | - | string | Analysis type: full, health, distribution, schema, performance | full |
| `table` | - | string | Specific table to analyze (optional) | all |
| `format` | - | string | Output format: text, json, csv | text |
| `save` | - | boolean | Save report to file | false |

**Flags**:

- `--health` - Focus on database health metrics
- `--distribution` - Analyze data distribution across tables
- `--schema` - Schema analysis and recommendations
- `--performance` - Performance metrics and optimization tips
- `--export` - Export results to JSON/CSV file

**Examples**:

```bash
# Full database analysis
/xata-analyze

# Specific analysis types
/xata-analyze type=health
/xata-analyze type=distribution --export
/xata-analyze type=schema table=events

# Performance analysis
/xata-analyze type=performance format=json

# Table-specific analysis
/xata-analyze table=sightings type=distribution
/xata-analyze table=personnel --health --schema
```

</operation>

<implementation>
1. Import xata client and analysis utilities
2. Parse command arguments and determine analysis scope
3. Execute analysis based on type:
   - **Full**: All tables, counts, relationships, health
   - **Health**: Record counts, data quality, integrity checks
   - **Distribution**: Data distribution, temporal analysis, geographic spread
   - **Schema**: Field usage, type analysis, relationship mapping
   - **Performance**: Query performance, indexing recommendations
4. Format results according to specified format
5. Optionally save results to file

**Code Template**:

```typescript
import { xata } from '@packages/db/src/xata-typescript-sdk/client';

// Parse arguments
const { type = 'full', table, format = 'text', save = false } = args;

// Available tables for analysis
const tables = table ? [table] : [
  'events', 'testimonies', 'topics', 'personnel', 'organizations', 
  'sightings', 'documents', 'locations', 'artifacts', 'mindmaps', 
  'users', 'user-notes', 'tags', 'theories'
];

// Execute analysis based on type
let analysisResults = {};

switch (type) {
  case 'health':
    analysisResults = await performHealthAnalysis(tables);
    break;
  case 'distribution':
    analysisResults = await performDistributionAnalysis(tables);
    break;
  case 'schema':
    analysisResults = await performSchemaAnalysis(tables);
    break;
  case 'performance':
    analysisResults = await performPerformanceAnalysis(tables);
    break;
  default:
    analysisResults = await performFullAnalysis(tables);
}

// Format and return results
return formatResults(analysisResults, format, save);
```

</implementation>

<output_format>

```text
📊 XATA DATABASE ANALYSIS REPORT
Generated: {timestamp}
Analysis Type: {type}
Tables Analyzed: {table_count}

═══════════════════════════════════════════════

📈 SUMMARY METRICS
Total Records: {total_records:,}
Total Tables: {table_count}
Database Size: {estimated_size}
Last Updated: {last_update}

📋 TABLE BREAKDOWN
{table_name}                 {record_count:>8,} records
{table_name}                 {record_count:>8,} records
...

🔍 DATA QUALITY INSIGHTS
✅ Health Score: {health_score}/100
⚠️  Issues Found: {issue_count}
🎯 Recommendations: {recommendation_count}

═══════════════════════════════════════════════

📊 DETAILED ANALYSIS
{detailed_analysis_content}

💡 RECOMMENDATIONS
{recommendations_list}

🔗 RELATED COMMANDS
- Seed: /xata-seed table={table}
- Query: /xata-read table={table} limit=10
- Research: /xata-research query="analysis insights"

📁 Report saved to: {file_path} (if --save flag used)
```

</output_format>

<analysis_types>

**Health Analysis**:
- Record counts per table
- Data integrity checks
- Missing critical fields
- Orphaned relationships
- Data freshness assessment

**Distribution Analysis**:
- Temporal data distribution
- Geographic data spread
- Category distributions
- Data density patterns
- Growth trends

**Schema Analysis**:
- Field usage statistics
- Data type utilization
- Relationship mapping
- Index recommendations
- Schema optimization tips

**Performance Analysis**:
- Query performance metrics
- Slow query identification
- Index effectiveness
- Optimization recommendations
- Resource utilization

</analysis_types>

<error_handling>

- Handle connection timeouts gracefully
- Validate table names against available schema
- Provide partial results if some tables fail
- Handle large datasets with pagination
- Memory-efficient processing for big analyses
- Clear error messages for analysis failures
- Suggest fixes for common database issues
- Fallback to basic analysis if advanced features fail

</error_handling>

<validation>
- Verify database connection before analysis
- Check table accessibility and permissions
- Validate analysis type parameters
- Ensure sufficient permissions for schema inspection
- Confirm output format is supported
- Validate file save permissions if export requested
</validation>