# Key Figures Ranking System Design

## Overview
The ranking system evaluates the significance and connectivity of key figures across the database by analyzing their relationships with other entities and their presence in various contexts.

## 1. Data Sources & Connections

### Primary Tables
- `key_figures` (base table)
- `testimonies`
- `organization_members`
- `event_subject_matter_experts`
- `topic_subject_matter_experts`
- `event_topic_subject_matter_experts`
- `quotes` (from recent scraping)

### Connection Types
1. **Direct Connections**
   - Testimony authorship
   - Organization membership
   - Event expertise
   - Topic expertise
   - Direct quotes

2. **Indirect Connections**
   - Referenced in other testimonies
   - Related events
   - Topic associations

## 2. Weight Distribution

### Primary Weights (1.0)
- Testimony authorship
- Organization membership
- Event subject matter expertise
- Topic subject matter expertise

### Enhanced Weights (1.5)
- Direct quotes and statements
- Primary event involvement
- Key organizational roles

### Secondary Weights (0.5)
- Indirect references
- Related topic connections
- Secondary organizational associations

## 3. Ranking Formula

```
Rank Score = (
    (direct_testimony_count × 1.0) +
    (organization_member_count × 1.0) +
    (event_expert_count × 1.0) +
    (topic_expert_count × 1.0) +
    (quote_count × 1.5) +
    (indirect_reference_count × 0.5)
) / max_possible_score
```

### Normalization
- Scores are normalized to a 0-1 scale
- Percentile rankings are calculated
- Historical ranking changes are tracked

## 4. Implementation

### Database Structure
```sql
CREATE TABLE key_figure_rankings (
    id SERIAL PRIMARY KEY,
    key_figure_id INTEGER REFERENCES key_figures(id),
    total_score DECIMAL(10,2),
    normalized_rank DECIMAL(5,4),
    percentile INTEGER,
    
    -- Component Scores
    testimony_score DECIMAL(10,2),
    organization_score DECIMAL(10,2),
    event_score DECIMAL(10,2),
    topic_score DECIMAL(10,2),
    quote_score DECIMAL(10,2),
    
    -- Counts
    testimony_count INTEGER,
    organization_count INTEGER,
    event_count INTEGER,
    topic_count INTEGER,
    quote_count INTEGER,
    
    -- Metadata
    last_updated TIMESTAMP,
    rank_change INTEGER
);
```

### Monitoring Table
```sql
CREATE TABLE ranking_calculation_log (
    id SERIAL PRIMARY KEY,
    calculation_time TIMESTAMP,
    records_processed INTEGER,
    max_score DECIMAL(10,2),
    min_score DECIMAL(10,2),
    avg_score DECIMAL(10,2),
    execution_time_ms INTEGER,
    status TEXT
);
```

## 5. Cron Job Specifications

### Schedule
- Frequency: Daily
- Recommended time: 02:00 AM UTC
- Backup ranking snapshot: Weekly

### Process Flow
1. Calculate raw scores
2. Normalize rankings
3. Update percentiles
4. Track changes
5. Log execution metrics

### Error Handling
- Retry logic for failed calculations
- Alert on significant ranking changes
- Maintain previous rankings until successful update

## 6. Monitoring & Maintenance

### Key Metrics
- Distribution of scores
- Ranking volatility
- Processing time
- Error rates

### Regular Maintenance
- Weekly review of ranking distributions
- Monthly analysis of weight effectiveness
- Quarterly adjustment of weights if needed

## 7. Future Enhancements

### Potential Additions
- Machine learning-based weight adjustment
- Temporal relevance factors
- Confidence scores for connections
- API for real-time ranking access

### Planned Features
- Historical trend analysis
- Influence network mapping
- Automated anomaly detection
