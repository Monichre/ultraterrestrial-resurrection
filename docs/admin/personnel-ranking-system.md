# Personnel Ranking System Admin Guide

## Overview

The Personnel Ranking System is an automated service that calculates and maintains ranking scores for all key figures in the database. This guide explains how to use, monitor, and configure the system.

## How Rankings Work

The system evaluates each key figure (personnel) by analyzing their connections across the knowledge graph:

1. **Data Sources**: The ranking algorithm considers:
   - Topic expertise connections
   - Event subject matter expertise
   - Organization memberships
   - Testimony authorships
   - Document creations
   - (Future) Quotes and references

2. **Scoring Formula**:
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

3. **Database Fields**:
   - `rank` - The raw numerical score
   - `authority` - Percentile rank (0-100) compared to other personnel

## Automated Updates

Rankings are automatically updated daily at 2:00 AM UTC via a Vercel cron job configuration.

### Monitoring Executions

To check when rankings were last updated:

1. Check the Vercel dashboard under "Deployments" → "Functions" → "Cron Jobs"
2. Look for the `/api/cron/update-rankings` endpoint execution history

## Manual Controls

### Trigger Immediate Update

To manually trigger a ranking update (for example, after significant data changes):

```bash
# Using curl
curl -X POST https://your-domain.com/api/admin/trigger-ranking-update \
  -H "Authorization: Bearer dev_admin_token" \
  -H "Content-Type: application/json" \
  -d '{}'

# Using a web browser
# Visit the Admin Dashboard and use the "Update Rankings" button
```

### Update with Custom Weights

You can adjust the weighting factors to emphasize different types of connections:

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

## Testing and Previewing Changes

For testing impact before applying changes to the database, use the test endpoint:

```bash
# Preview calculation without saving to database (dry run)
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

# Get current rankings for all personnel
curl https://your-domain.com/api/admin/test-ranking-system
```

The response will show expected changes to rankings without modifying the database.

## Troubleshooting

If ranking updates fail:

1. Check the Vercel Function logs for errors
2. Verify database connectivity
3. Make sure the personnel table has appropriate permissions
4. Check for any data consistency issues

Common errors:
- Database connection timeout
- Permission issues
- Data integrity problems

## Future Enhancements

Planned improvements:
- Advanced analytics dashboard for ranking trends
- More sophisticated weighting algorithms
- Additional connection types (quotes, mentions)
- Historical tracking of ranking changes