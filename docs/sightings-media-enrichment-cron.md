# Sightings Media Enrichment Cron Job - Implementation Plan

This document outlines the implementation plan for a cron job that enriches the sightings database with relevant media and news items based on the sighting's location, date, and description details.

## Overview

The cron job will:
1. Process the sightings table in manageable batches
2. For each sighting without media, perform a web search to find relevant media/news
3. Update the sighting record with discovered media links
4. Track progress and provide monitoring statistics

## Implementation Components

### 1. Cron Route Handler

```typescript
// src/app/api/cron/enrich-sightings/route.ts
import { NextResponse } from 'next/server';
import { getXataClient } from '@/db/xata/client';
import { enrichSightingWithMedia } from '@/services/sightings/actions/media-enrichment';

// Process a limited batch of records per run
const BATCH_SIZE = 25;

export async function GET(req: Request) {
  // Basic auth check for cron security
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && (!authHeader || !authHeader.includes(process.env.CRON_SECRET))) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const xata = getXataClient();
    
    // Get sightings without media, process a limited batch
    const sightingsToProcess = await xata.db.sightings
      .filter({
        $not: {
          $exists: {
            media: true 
          }
        }
      })
      .sort('date', 'desc')
      .getPaginated({
        pagination: {
          size: BATCH_SIZE
        }
      });
    
    // Process each sighting in sequence to avoid rate limiting
    const results = [];
    for (const sighting of sightingsToProcess.records) {
      const result = await enrichSightingWithMedia(sighting);
      results.push(result);
    }
    
    return NextResponse.json({
      processed: results.length,
      remaining: sightingsToProcess.pagination?.remaining || 0,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });
  } catch (error) {
    console.error('Sightings enrichment cron error:', error);
    return NextResponse.json({ error: 'Failed to process sightings batch' }, { status: 500 });
  }
}
```

### 2. Enrichment Service

```typescript
// src/services/sightings/actions/media-enrichment.ts
import { tavily } from '@tavily/core';
import { SightingsRecord } from '@/db/xata/xata';
import { getXataClient } from '@/db/xata/client';

// Initialize the Tavily client for web search
const tavilyClient = tavily({ 
  apiKey: process.env.TAVILY_API_KEY || ''
});

/**
 * Enriches a sighting record with media and news items from web search
 */
export async function enrichSightingWithMedia(sighting: SightingsRecord) {
  if (!process.env.TAVILY_API_KEY) {
    return { 
      id: sighting.id,
      success: false, 
      error: 'Tavily API key not configured' 
    };
  }

  try {
    // Construct search query using location, date and description
    const year = sighting.date ? new Date(sighting.date).getFullYear() : '';
    const location = [sighting.city, sighting.state, sighting.country]
      .filter(Boolean)
      .join(', ');
      
    // Build search string from the available data
    let searchQuery = `UFO sighting ${location} ${year}`;
    
    // Add description keywords if available
    if (sighting.description) {
      // Extract keywords from description, limit to keep query focused
      const keywords = extractKeywords(sighting.description, 3);
      if (keywords.length > 0) {
        searchQuery += ` ${keywords.join(' ')}`;
      }
    }
    
    // Add comments keywords if available (often contains additional details)
    if (sighting.comments) {
      const keywords = extractKeywords(sighting.comments, 2);
      if (keywords.length > 0) {
        searchQuery += ` ${keywords.join(' ')}`;
      }
    }
    
    // Add shape if available (important detail for UFO sightings)
    if (sighting.shape) {
      searchQuery += ` ${sighting.shape}`;
    }
    
    // Search for relevant media and news
    const searchResults = await tavilyClient.search(searchQuery, {
      includeImages: true,
      includeRawContent: true,
      maxResults: 5,
      includeAnswer: false,
      searchDepth: 'advanced'
    });
    
    // Process and extract relevant links
    const mediaLinks = processSearchResults(searchResults, sighting);
    
    // Only update if we found relevant media
    if (mediaLinks.length > 0) {
      // Update the sighting record with the found media links
      const xata = getXataClient();
      await xata.db.sightings.update(sighting.id, {
        media: mediaLinks.join(',')
      });
      
      return { 
        id: sighting.id, 
        success: true, 
        mediaCount: mediaLinks.length 
      };
    }
    
    return { 
      id: sighting.id, 
      success: true, 
      mediaCount: 0,
      message: 'No relevant media found'
    };
  } catch (error) {
    console.error(`Error enriching sighting ${sighting.id}:`, error);
    return { 
      id: sighting.id, 
      success: false, 
      error: String(error) 
    };
  }
}

/**
 * Extract the most relevant keywords from text
 */
function extractKeywords(text: string, limit: number): string[] {
  // Remove common stop words
  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'like'];
  
  // Get all words, convert to lower case, and filter out stop words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  // Get frequency of each word
  const wordFrequency: Record<string, number> = {};
  for (const word of words) {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  }
  
  // Return top keywords based on frequency
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
}

/**
 * Process search results and extract relevant media links
 */
function processSearchResults(searchResults: any, sighting: SightingsRecord): string[] {
  const mediaLinks: string[] = [];
  
  // Extract image URLs if available
  if (searchResults.images && searchResults.images.length > 0) {
    const imageUrls = searchResults.images.map((img: any) => img.url);
    mediaLinks.push(...imageUrls);
  }
  
  // Look for video links in search results
  for (const result of searchResults.results) {
    // Check if the result is from video platforms
    if (
      result.url.includes('youtube.com') || 
      result.url.includes('vimeo.com') ||
      result.url.includes('dailymotion.com')
    ) {
      mediaLinks.push(result.url);
      continue;
    }
    
    // Check raw content for video links if available
    if (result.rawContent) {
      const videoLinks = extractVideoLinks(result.rawContent);
      if (videoLinks.length > 0) {
        mediaLinks.push(...videoLinks);
      }
    }
    
    // Check if it's a news article about the sighting
    if (isRelevantNewsArticle(result, sighting)) {
      mediaLinks.push(result.url);
    }
  }
  
  // Return unique links, limited to prevent overly long strings
  return [...new Set(mediaLinks)].slice(0, 10);
}

/**
 * Extract video links from HTML content
 */
function extractVideoLinks(content: string): string[] {
  const videoLinks: string[] = [];
  
  // Simple regex to find video URLs in HTML
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
  const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/g;
  
  let match;
  
  // Extract YouTube links
  while ((match = youtubeRegex.exec(content)) !== null) {
    videoLinks.push(`https://www.youtube.com/watch?v=${match[1]}`);
  }
  
  // Extract Vimeo links
  while ((match = vimeoRegex.exec(content)) !== null) {
    videoLinks.push(`https://vimeo.com/${match[1]}`);
  }
  
  return videoLinks;
}

/**
 * Check if a search result is a relevant news article
 */
function isRelevantNewsArticle(result: any, sighting: SightingsRecord): boolean {
  // Check if the result is likely a news article
  const isNewsURL = 
    result.url.includes('/news/') || 
    result.url.includes('/article/') ||
    result.url.includes('.news') ||
    result.publishedDate !== undefined;
  
  if (!isNewsURL) return false;
  
  // Check basic relevance - article should mention UFO/UAP
  const content = (result.content || '').toLowerCase();
  const hasUFOTerms = 
    content.includes('ufo') || 
    content.includes('unidentified') || 
    content.includes('flying object') || 
    content.includes('uap') ||
    content.includes('aerial phenomena');
  
  if (!hasUFOTerms) return false;
  
  // If date is mentioned in the article, it should be close to the sighting date
  if (sighting.date && result.content) {
    const sightingDate = new Date(sighting.date);
    const sightingYear = sightingDate.getFullYear();
    
    // Check if article mentions the right year
    const hasRightYear = content.includes(sightingYear.toString());
    if (!hasRightYear) return false;
  }
  
  return true;
}
```

### 3. Monitoring Utilities

```typescript
// src/services/sightings/actions/enrich-status.ts
import { getXataClient } from '@/db/xata/client';

/**
 * Get statistics on sightings enrichment progress
 */
export async function getEnrichmentStats() {
  const xata = getXataClient();
  
  // Count total sightings
  const totalCount = await xata.db.sightings.aggregate({
    totalCount: {
      count: '*'
    }
  });
  
  // Count sightings with media
  const withMediaCount = await xata.db.sightings.filter({
    $exists: {
      media: true
    }
  }).aggregate({
    count: {
      count: '*'
    }
  });
  
  // Count sightings without media
  const noMediaCount = await xata.db.sightings.filter({
    $not: {
      $exists: {
        media: true
      }
    }
  }).aggregate({
    count: {
      count: '*'
    }
  });
  
  return {
    total: totalCount.aggs.totalCount,
    enriched: withMediaCount.aggs.count,
    remaining: noMediaCount.aggs.count,
    percentComplete: Math.round((withMediaCount.aggs.count / totalCount.aggs.totalCount) * 100)
  };
}
```

## Cron Job Configuration

Set up the cron job to run on a regular schedule using Vercel Cron (or equivalent platform):

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/enrich-sightings",
      "schedule": "0 */8 * * *"  // Run every 8 hours
    }
  ]
}
```

## Required Environment Variables

```
TAVILY_API_KEY=your-tavily-api-key
CRON_SECRET=your-cron-secret-key
```

## Implementation Notes

1. **Batch Processing**: The system processes 25 records per cron run to avoid overwhelming external APIs or the database.

2. **Web Search Integration**: Uses the Tavily API to search for media and news related to sightings.

3. **Smart Query Construction**: Builds search queries using location, year, and keywords extracted from descriptions and comments.

4. **Media Types**: Extracts various types of media links:
   - Images 
   - YouTube and Vimeo videos
   - News articles about the sighting

5. **Progress Tracking**: Includes utilities for monitoring enrichment progress.

6. **Rate Limiting**: Processes records sequentially to prevent API rate limit issues.

7. **Security**: Uses basic authorization for the cron endpoint.

## Future Enhancements

1. Implement a retry mechanism for failed searches
2. Add a blacklist for low-quality media sources
3. Improve relevance scoring for better matches
4. Add an admin dashboard to monitor enrichment progress
5. Implement media validation to ensure links are still active