# Personnel Ranking System

## Overview

The Personnel Ranking System automatically calculates and maintains ranking scores for key figures (personnel) in the database by analyzing their connections across the knowledge graph.

## Key Features

- **Automated Analysis**: Daily calculation of importance and influence scores
- **Multiple Data Sources**: Analyzes connections across events, topics, organizations, testimonies, and documents
- **Normalized Scores**: Raw scores and percentile-based authority ranking
- **Configurable Weights**: Can be adjusted to prioritize different types of connections
- **Optimized Performance**: Uses Xata's aggregation methods for efficient data processing

## Technical Architecture

### Core Components

1. **Ranking Service** (`personnel-ranking.service.ts`)
   - Calculates scores with configurable weights
   - Uses Xata's aggregation methods for efficient data collection
   - Normalizes rankings and calculates percentiles
   - Updates personnel records in Xata database

2. **Scheduled Job** (Vercel Cron)
   - Daily execution at 2:00 AM UTC (configured in `vercel.json`)
   - Endpoint at `/api/cron/update-rankings`

3. **Admin APIs**
   - Manual Trigger: `/api/admin/trigger-ranking-update`
   - Testing: `/api/admin/test-ranking-system`

### How It Works

1. **Data Collection**: The system uses Xata's aggregation methods to efficiently collect connection data:
   - `aggregate()` with `count` operator on join tables to count relationships
   - `groupBy` to organize counts by personnel ID
   - Single database query per relationship type instead of per-person queries

2. **Score Calculation**: The core formula is:
   ```
   Rank Score = (
     (event_expert_count × EVENT_WEIGHT) +
     (topic_expert_count × TOPIC_WEIGHT) +
     (organization_member_count × ORG_WEIGHT) +
     (testimony_count × TESTIMONY_WEIGHT) +
     (document_count × DOCUMENT_WEIGHT) +
     (quote_count × QUOTE_WEIGHT)
   )
   ```

3. **Database Updates**: Stores two values for each personnel:
   - `rank`: Raw numerical score
   - `authority`: Percentile rank (0-100) compared to other personnel

4. **Statistics**: Uses Xata's `summarize()` method for calculating aggregate statistics

## Usage Guide

### Automated Updates

Rankings automatically update daily via the Vercel cron job. No additional configuration is required.

### Manual Controls

To manually trigger a ranking update (e.g., after significant data changes):

```bash
# Using curl
curl -X POST https://your-domain.com/api/admin/trigger-ranking-update \
  -H "Authorization: Bearer dev_admin_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Custom Weights

You can adjust the weighting factors:

```bash
curl -X POST https://your-domain.com/api/admin/trigger-ranking-update \
  -H "Authorization: Bearer dev_admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "weights": {
      "EVENT_PARTICIPATION": 1.2,
      "TOPIC_EXPERTISE": 1.5,
      "ORGANIZATIONAL_ROLE": 0.8,
      "DOCUMENTED_EVIDENCE": 1.3,
      "TESTIMONY_COUNT": 1.0,
      "QUOTE_COUNT": 1.5
    }
  }'
```

### Testing Features

For testing the ranking system without affecting the database:

```bash
# Preview calculation without saving (dry run)
curl -X POST https://your-domain.com/api/admin/test-ranking-system \
  -H "Content-Type: application/json" \
  -d '{
    "dryRun": true,
    "weights": {
      "EVENT_PARTICIPATION": 1.2,
      "TOPIC_EXPERTISE": 1.0,
      "ORGANIZATIONAL_ROLE": 1.0,
      "DOCUMENTED_EVIDENCE": 1.0,
      "TESTIMONY_COUNT": 1.0,
      "QUOTE_COUNT": 1.5
    }
  }'

# Get current rankings and statistics
curl https://your-domain.com/api/admin/test-ranking-system
```

## Developer Notes

### Performance Optimizations

1. **Xata Aggregation Methods**
   - `aggregate()` with `count` operator for efficient relationship counting
   - `summarize()` for statistical calculations
   - These methods run calculations in the database instead of in memory
   - Significant reduction in database queries (from N per personnel to 5 total)

2. **Helper Utilities**
   - The `processAggregationResults()` function consolidates aggregation results efficiently
   - Pagination is used in endpoints returning large datasets

### Future Enhancements

1. **Logging Infrastructure**
   - Create a `ranking-logs` table in Xata
   - Comment out the implementation in `logRankingExecution()`

2. **Additional Metrics**
   - Add quotes/mentions when that table is implemented
   - Consider secondary connection influence (indirect references)

3. **Further Performance Optimization**
   - Consider using more complex aggregations for compound metrics
   - Add automated indexing of frequently queried fields

### Security Considerations

- In production, secure the admin endpoints with proper authentication
- Uncomment and configure the auth check in the cron endpoint
- Set up environment variables for API tokens

## Troubleshooting

- Check Vercel Function logs for execution details
- Use the test endpoint to diagnose ranking calculation issues
- For manual intervention, see the admin documentation