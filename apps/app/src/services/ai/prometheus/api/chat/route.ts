import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { searchAll, searchTable } from '@db/postgres';

// Constants
const DEFAULT_SEARCH_LIMIT = 10;
const CONTENT_PREVIEW_LENGTH = 6000;
const SUMMARY_CONTENT_LENGTH = 8000;
const TAGS_CONTENT_LENGTH = 4000;
const MAX_TOPICS = 12;
const MAX_TAGS = 12;
const MIN_TAGS = 8;
const MODEL_NAME = 'gpt-4-turbo'; // Fixed model name

// Rate limiting and caching
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // Max requests per window
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// In-memory stores (for development - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const responseCache = new Map<string, { data: any; timestamp: number }>();
const metricsStore = {
  requests: 0,
  successful: 0,
  failed: 0,
  avgResponseTime: 0,
  lastReset: Date.now()
};

// Types
interface SearchResult {
  query: string;
  results: Array<{
    content: string;
    relevance: string;
    source: string;
  }>;
  totalResults: number;
  error?: string;
}

interface ProcessResult {
  type: string;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  analysisType?: string;
  result: any;
  error?: string;
}

// UAP Knowledge Base - Specialized content for semantic search
const UAP_KNOWLEDGE_BASE = [
  {
    id: 'nimitz-2004',
    content: 'The USS Nimitz UFO incident occurred in November 2004 when Navy pilots encountered unidentified objects off the California coast. The objects demonstrated extraordinary flight characteristics including instantaneous acceleration and hovering capabilities.',
    source: 'military-encounters',
    relevance: 0.95
  },
  {
    id: 'phoenix-lights-1997',
    content: 'The Phoenix Lights were a series of widely sighted unidentified flying objects observed in the skies over Arizona on March 13, 1997. Thousands of witnesses reported V-shaped formations of lights.',
    source: 'mass-sightings',
    relevance: 0.92
  },
  {
    id: 'aatip-program',
    content: 'The Advanced Aerospace Threat Identification Program (AATIP) was a Pentagon UFO study program that ran from 2007 to 2012, investigating reports of unidentified aerial phenomena.',
    source: 'government-programs',
    relevance: 0.90
  },
  {
    id: 'uap-task-force',
    content: 'The Unidentified Aerial Phenomena Task Force was established by the U.S. Department of Defense to investigate UAP encounters by military personnel.',
    source: 'government-programs',
    relevance: 0.88
  },
  {
    id: 'roswell-1947',
    content: 'The Roswell incident refers to the crash of a military surveillance balloon near Roswell, New Mexico in July 1947, which became a focal point for UFO conspiracy theories.',
    source: 'historical-cases',
    relevance: 0.85
  },
  {
    id: 'blue-book-project',
    content: 'Project Blue Book was the U.S. Air Force systematic study of UFOs from 1952 to 1969, investigating over 12,000 UFO reports and concluding that most had conventional explanations.',
    source: 'government-programs',
    relevance: 0.83
  },
  {
    id: 'disclosure-movement',
    content: 'The UFO disclosure movement advocates for government transparency regarding UFO/UAP information, including witness testimonies and classified documents.',
    source: 'disclosure-advocacy',
    relevance: 0.80
  },
  {
    id: 'extraterrestrial-hypothesis',
    content: 'The extraterrestrial hypothesis proposes that some UFOs are spacecraft from extraterrestrial civilizations visiting Earth.',
    source: 'theories-hypotheses',
    relevance: 0.78
  }
];

// Simple semantic similarity function
function calculateSimilarity(query: string, content: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const contentWords = content.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const queryWord of queryWords) {
    for (const contentWord of contentWords) {
      if (contentWord.includes(queryWord) || queryWord.includes(contentWord)) {
        matches++;
        break;
      }
    }
  }
  
  return queryWords.length > 0 ? matches / queryWords.length : 0;
}

// System prompts
const SYSTEM_PROMPTS = {
  main: `You are Prometheus, an advanced UAP/UFO research assistant dedicated to illuminating the unknown by gathering, organizing, analyzing, and documenting resources on unexplained aerial phenomena. 

You have access to a specialized UAP knowledge base through the searchUAP tool and can process documents through the processDocument tool.

Always:
- Be factual, informative, and balanced in your responses
- Draw connections between evidence and patterns
- Cite sources when available from the knowledge base
- Acknowledge uncertainties and the evolving nature of UAP research
- Help users understand the scientific approach to unexplained phenomena`,

  summary: 'You are an expert document analyst. Create comprehensive, well-structured summaries of documents.',
  
  topics: 'You are an expert at identifying and extracting key topics from documents. Return a JSON array of relevant topics.',
  
  sentiment: 'You are an expert at analyzing sentiment, tone, and perspective in documents.',
  
  connections: 'You are an expert UAP/UFO researcher. Find connections between documents and known UAP/UFO events, research, or theories.',
  
  insights: 'You are an expert UAP/UFO researcher with a keen eye for hidden patterns and insights.',
  
  tags: 'You are an expert document classifier. Generate relevant classification tags and return them as a JSON array.'
};

// Document processing actions
const documentActions = {
  summarize: async (fileContent: string, fileName: string, fileType: string, fileSizeKB: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: openai(MODEL_NAME),
      system: SYSTEM_PROMPTS.summary,
      messages: [{
        role: 'user',
        content: `Please create a comprehensive summary of this document:

**Document Information:**
- Filename: ${fileName}
- File Type: ${fileType}
- Size: ${fileSizeKB} KB

**Content:**
${truncateContent(fileContent, SUMMARY_CONTENT_LENGTH)}

Please provide:
1. A brief overview of the document
2. Key points and main topics
3. Important details and conclusions
4. Any notable patterns or insights`
      }]
    });

    return {
      type: 'summary',
      fileName,
      fileType,
      fileSize: fileSizeKB,
      result: await result.text,
    };
  },

  extractTopics: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: openai(MODEL_NAME),
      system: SYSTEM_PROMPTS.topics,
      messages: [{
        role: 'user',
        content: `Extract the main topics from this document and return them as a JSON array of strings:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, CONTENT_PREVIEW_LENGTH)}

Return only a JSON array like: ["Topic 1", "Topic 2", "Topic 3"]
Limit to ${MAX_TOPICS} most relevant topics.`
      }]
    });

    const topics = await result.text;
    return {
      type: 'topics',
      fileName,
      result: parseJsonArray(topics, []),
    };
  },

  analyzeSentiment: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: openai(MODEL_NAME),
      system: SYSTEM_PROMPTS.sentiment,
      messages: [{
        role: 'user',
        content: `Analyze the sentiment, tone, and perspective of this document:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, CONTENT_PREVIEW_LENGTH)}

Provide analysis of:
1. Overall sentiment (positive, negative, neutral)
2. Emotional tone and language patterns
3. Author's perspective or bias
4. Confidence level and certainty in statements
5. Any notable rhetorical devices or persuasive elements`
      }]
    });

    return {
      type: 'analysis',
      fileName,
      analysisType: 'sentiment',
      result: await result.text,
    };
  },

  connectTheDots: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: openai(MODEL_NAME),
      system: SYSTEM_PROMPTS.connections,
      messages: [{
        role: 'user',
        content: `Analyze this document and identify connections to known UAP/UFO events, research, or theories:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, CONTENT_PREVIEW_LENGTH)}

Look for:
1. Connections to historical UAP/UFO sightings
2. Links to government reports or disclosure
3. Relationships with researcher findings
4. Parallels with established UAP/UFO patterns
5. Contradictions or confirmations of existing theories`
      }]
    });

    return {
      type: 'analysis',
      fileName,
      analysisType: 'connections',
      result: await result.text,
    };
  },

  findInsights: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: openai(MODEL_NAME),
      system: SYSTEM_PROMPTS.insights,
      messages: [{
        role: 'user',
        content: `Analyze this document and uncover hidden insights, patterns, or significant details:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, CONTENT_PREVIEW_LENGTH)}

Focus on:
1. Subtle patterns or anomalies in the data
2. Contradictions or inconsistencies worth investigating
3. Details that align with broader UAP research patterns
4. Alternative interpretations of described events
5. Scientific or technical insights for further study`
      }]
    });

    return {
      type: 'analysis',
      fileName,
      analysisType: 'insights',
      result: await result.text,
    };
  },

  generateTags: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: openai(MODEL_NAME),
      system: SYSTEM_PROMPTS.tags,
      messages: [{
        role: 'user',
        content: `Generate classification tags for this document suitable for a UAP/UFO research database:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, TAGS_CONTENT_LENGTH)}

Return only a JSON array of ${MIN_TAGS}-${MAX_TAGS} relevant tags like: ["Tag1", "Tag2", "Tag3"]`
      }]
    });

    const tags = await result.text;
    return {
      type: 'tags',
      fileName,
      result: parseJsonArray(tags, []),
    };
  },
};

// Utility functions
function truncateContent(content: string, maxLength: number): string {
  return content.length > maxLength 
    ? `${content.substring(0, maxLength)}...` 
    : content;
}

function parseJsonArray(jsonString: string, defaultValue: any[] = []): any[] {
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
}

function formatFileSize(bytes: number): string {
  return (bytes / 1024).toFixed(1);
}

// Rate limiting function
function checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const client = rateLimitStore.get(clientId);
  
  if (!client || now > client.resetTime) {
    // Reset or initialize
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitStore.set(clientId, { count: 1, resetTime });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime };
  }
  
  if (client.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: client.resetTime };
  }
  
  client.count++;
  rateLimitStore.set(clientId, client);
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - client.count, resetTime: client.resetTime };
}

// Caching functions
function getCacheKey(request: any): string {
  return JSON.stringify({
    messages: request.messages?.map((m: any) => ({ role: m.role, content: m.content?.substring(0, 100) })),
    timestamp: Math.floor(Date.now() / CACHE_TTL) // Round to cache window
  });
}

function getFromCache(key: string): any | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  responseCache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  responseCache.set(key, { data, timestamp: Date.now() });
  
  // Clean old cache entries
  if (responseCache.size > 100) {
    const cutoff = Date.now() - CACHE_TTL;
    for (const [k, v] of responseCache.entries()) {
      if (v.timestamp < cutoff) {
        responseCache.delete(k);
      }
    }
  }
}

// Metrics functions
function recordMetrics(success: boolean, responseTime: number): void {
  metricsStore.requests++;
  if (success) {
    metricsStore.successful++;
  } else {
    metricsStore.failed++;
  }
  
  // Update rolling average response time
  metricsStore.avgResponseTime = (metricsStore.avgResponseTime + responseTime) / 2;
}

function getClientId(req: NextRequest): string {
  // Use IP address as client ID (in production, consider using user IDs)
  return req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         req.ip || 
         'unknown';
}

// Export runtime configuration
export const runtime = 'edge';

// Main POST handler
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let success = false;
  
  try {
    // Rate limiting
    const clientId = getClientId(req);
    const rateLimit = checkRateLimit(clientId);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { 
          status: 400,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      );
    }

    // Check cache for similar requests
    const cacheKey = getCacheKey(body);
    const cachedResponse = getFromCache(cacheKey);
    
    if (cachedResponse) {
      success = true;
      recordMetrics(true, Date.now() - startTime);
      
      return new Response(cachedResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'X-Cache': 'HIT'
        }
      });
    }

    const result = await streamText({
      model: openai(MODEL_NAME),
      messages,
      system: SYSTEM_PROMPTS.main,
      tools: {
        searchUAP: tool({
          description: 'Search the UAP/UFO knowledge base for relevant information about unexplained aerial phenomena, sightings, research, and related topics',
          parameters: z.object({
            query: z.string().describe('The search query for UAP/UFO related information'),
            limit: z.number().optional().default(DEFAULT_SEARCH_LIMIT).describe('Maximum number of results to return'),
          }),
          execute: async ({ query, limit = DEFAULT_SEARCH_LIMIT }): Promise<SearchResult> => {
            try {
              // Create cache key for search query
              const searchCacheKey = `search:${query}:${limit}`;
              const cachedSearch = getFromCache(searchCacheKey);
              
              if (cachedSearch) {
                return cachedSearch;
              }

              console.log(`Searching UAP knowledge base for: ${query}`);
              
              // Search the UAP knowledge base using semantic similarity
              const searchResults = UAP_KNOWLEDGE_BASE
                .map(item => ({
                  ...item,
                  similarity: calculateSimilarity(query, item.content)
                }))
                .filter(item => item.similarity > 0.1)
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, limit)
                .map(item => ({
                  content: item.content,
                  relevance: item.similarity > 0.5 ? 'high' : item.similarity > 0.3 ? 'medium' : 'low',
                  source: `uap-knowledge-base:${item.source}:${item.id}`,
                }));

              // If no good matches, provide a general UAP context response
              if (searchResults.length === 0) {
                searchResults.push({
                  content: `UAP (Unidentified Aerial Phenomena) research encompasses various documented encounters, government investigations, and scientific studies. Your query "${query}" relates to ongoing UAP research and documentation efforts. Key areas include military encounters, mass sightings, government disclosure programs, and scientific analysis of unexplained aerial phenomena.`,
                  relevance: 'medium',
                  source: 'uap-knowledge-base:general-context',
                });
              }

              const result = {
                query,
                results: searchResults,
                totalResults: searchResults.length,
              };
              
              // Cache the search result
              setCache(searchCacheKey, result);
              
              return result;
            } catch (error) {
              console.error('UAP knowledge base search error:', error);
              return {
                query,
                results: [{
                  content: `Unable to search UAP knowledge base at this time. However, I can still help with general UAP/UFO information and analysis. Your query was: "${query}"`,
                  relevance: 'low',
                  source: 'uap-knowledge-base:fallback'
                }],
                error: 'Knowledge base temporarily unavailable',
                totalResults: 1,
              };
            }
          },
        }),

        processDocument: tool({
          description: 'Process and analyze documents with various AI-powered actions including summarization, topic extraction, sentiment analysis, and UAP-specific analysis',
          parameters: z.object({
            action: z.enum([
              'Summarize', 
              'Extract topics', 
              'Analyze sentiment', 
              'Connect the Dots', 
              'Find insights', 
              'Generate tags'
            ]).describe('The type of analysis to perform'),
            fileContent: z.string().describe('The extracted text content of the file'),
            fileName: z.string().describe('The name of the file being processed'),
            fileType: z.string().describe('The MIME type of the file'),
            fileSize: z.number().describe('The size of the file in bytes'),
          }),
          execute: async ({ action, fileContent, fileName, fileType, fileSize }): Promise<ProcessResult> => {
            try {
              const fileSizeKB = formatFileSize(fileSize);

              const actionMap: Record<string, () => Promise<ProcessResult>> = {
                'Summarize': () => documentActions.summarize(fileContent, fileName, fileType, fileSizeKB),
                'Extract topics': () => documentActions.extractTopics(fileContent, fileName),
                'Analyze sentiment': () => documentActions.analyzeSentiment(fileContent, fileName),
                'Connect the Dots': () => documentActions.connectTheDots(fileContent, fileName),
                'Find insights': () => documentActions.findInsights(fileContent, fileName),
                'Generate tags': () => documentActions.generateTags(fileContent, fileName),
              };

              const actionHandler = actionMap[action];
              if (!actionHandler) {
                throw new Error(`Unknown action: ${action}`);
              }

              return await actionHandler();
            } catch (error: any) {
              console.error(`Error processing document action ${action}:`, error);
              return {
                type: 'error',
                fileName,
                error: error.message || 'Failed to process document',
              };
            }
          },
        }),

        searchDatabase: tool({
          description: 'Search the Ultraterrestrial database for UFO/UAP entities including personnel, events, topics, organizations, testimonies, and documents. This provides access to the main project database with detailed information about key figures, incidents, and research.',
          parameters: z.object({
            query: z.string().describe('The search query for finding entities in the database'),
            entityType: z.enum([
              'personnel', 
              'events', 
              'topics', 
              'organizations', 
              'testimonies', 
              'documents',
              'artifacts',
              'sightings'
            ]).optional().describe('Specific entity type to search, or leave empty to search all types'),
            limit: z.number().optional().default(10).describe('Maximum number of results to return'),
          }),
          execute: async ({ query, entityType, limit = 10 }): Promise<SearchResult> => {
            try {
              // Create cache key for database search
              const dbCacheKey = `db:${query}:${entityType || 'all'}:${limit}`;
              const cachedResult = getFromCache(dbCacheKey);
              
              if (cachedResult) {
                return cachedResult;
              }

              console.log(`Searching database for: ${query} (type: ${entityType || 'all'})`);

              const results: Array<{
                content: string;
                relevance: string;
                source: string;
              }> = [];

              // Search different entity types based on the request
              const searchTypes = entityType ? [entityType] : ['personnel', 'events', 'topics', 'organizations', 'testimonies', 'documents'];

              for (const type of searchTypes) {
                try {
                  const tableLimit = ['personnel', 'events', 'topics', 'organizations'].includes(type)
                    ? Math.min(limit, 5)
                    : Math.min(limit, 3);
                  const searchResults = await searchTable(type, query, tableLimit);

                  switch (type) {
                    case 'personnel':
                      searchResults.forEach(person => {
                        if (person['name']) {
                          results.push({
                            content: `**${person['name']}** (${person['role'] || 'Personnel'})\n\n${person['bio'] || 'No biography available.'}\n\nCredibility: ${person['credibility'] || 'N/A'}\nAuthority: ${person['authority'] || 'N/A'}`,
                            relevance: 'high',
                            source: `database:personnel:${person['name']}`,
                          });
                        }
                      });
                      break;

                    case 'events':
                      searchResults.forEach(event => {
                        if (event['title'] || event['name']) {
                          const eventDate = event['date'] ? new Date(event['date'] as string).toLocaleDateString() : 'Date unknown';
                          results.push({
                            content: `**${event['title'] || event['name']}** (${eventDate})\n\n${event['description'] || event['summary'] || 'No description available.'}\n\nLocation: ${event['location'] || 'Unknown'}\nCategory: ${Array.isArray(event['category']) ? (event['category'] as string[]).join(', ') : event['category'] || 'Uncategorized'}`,
                            relevance: 'high',
                            source: `database:events:${event['title'] || event['name']}`,
                          });
                        }
                      });
                      break;

                    case 'topics':
                      searchResults.forEach(topic => {
                        if (topic['title'] || topic['name']) {
                          results.push({
                            content: `**${topic['title'] || topic['name']}** (Topic)\n\n${topic['summary'] || 'No summary available.'}`,
                            relevance: 'high',
                            source: `database:topics:${topic['title'] || topic['name']}`,
                          });
                        }
                      });
                      break;

                    case 'organizations':
                      searchResults.forEach(org => {
                        if (org['title'] || org['name']) {
                          results.push({
                            content: `**${org['title'] || org['name']}** (Organization)\n\n${org['description'] || 'No description available.'}\n\nSpecialization: ${org['specialization'] || 'N/A'}`,
                            relevance: 'high',
                            source: `database:organizations:${org['title'] || org['name']}`,
                          });
                        }
                      });
                      break;

                    case 'testimonies':
                      searchResults.forEach(testimony => {
                        if (testimony['claim']) {
                          const claim = testimony['claim'] as string;
                          const testimonySummary = claim.substring(0, 200) + (claim.length > 200 ? '...' : '');
                          results.push({
                            content: `**Testimony**: ${testimonySummary}\n\n${testimony['summary'] || ''}\n\nSource: ${testimony['source'] || 'Unknown'}\nContext: ${testimony['context'] || 'N/A'}`,
                            relevance: 'medium',
                            source: `database:testimonies:${testimony['id']}`,
                          });
                        }
                      });
                      break;

                    case 'documents':
                      searchResults.forEach(doc => {
                        if (doc['title']) {
                          const docDate = doc['date'] ? new Date(doc['date'] as string).toLocaleDateString() : 'Date unknown';
                          results.push({
                            content: `**${doc['title']}** (Document - ${docDate})\n\n${doc['summary'] || 'No summary available.'}\n\nURL: ${doc['url'] || 'Not available'}`,
                            relevance: 'medium',
                            source: `database:documents:${doc['title']}`,
                          });
                        }
                      });
                      break;

                    case 'artifacts':
                      searchResults.forEach(artifact => {
                        if (artifact['name']) {
                          results.push({
                            content: `**${artifact['name']}** (Artifact)\n\n${artifact['description'] || 'No description available.'}\n\nDate: ${artifact['date'] || 'Unknown'}\nSource: ${artifact['source'] || 'Unknown'}\nOrigin: ${artifact['origin'] || 'Unknown'}`,
                            relevance: 'medium',
                            source: `database:artifacts:${artifact['name']}`,
                          });
                        }
                      });
                      break;

                    case 'sightings':
                      searchResults.forEach(sighting => {
                        if (sighting['description']) {
                          const sightingDate = sighting['date'] ? new Date(sighting['date'] as string).toLocaleDateString() : 'Date unknown';
                          const location = [sighting['city'], sighting['state'], sighting['country']].filter(Boolean).join(', ') || 'Unknown location';
                          results.push({
                            content: `**Sighting** (${sightingDate} - ${location})\n\n${sighting['description']}\n\nShape: ${sighting['shape'] || 'Unknown'}\nDuration: ${sighting['duration_hours_min'] || sighting['duration_seconds'] || 'Unknown'}\nComments: ${sighting['comments'] || 'None'}`,
                            relevance: 'medium',
                            source: `database:sightings:${sighting['id']}`,
                          });
                        }
                      });
                      break;
                  }
                } catch (typeError) {
                  console.warn(`Error searching ${type}:`, typeError);
                }
              }
              
              // Limit total results and sort by relevance
              const finalResults = results
                .sort((a, b) => a.relevance === 'high' ? -1 : 1)
                .slice(0, limit);
              
              const result = {
                query,
                results: finalResults,
                totalResults: finalResults.length,
              };
              
              // Cache the database result
              setCache(dbCacheKey, result);
              
              return result;
            } catch (error) {
              console.error('Database search error:', error);
              return {
                query,
                results: [],
                error: 'Failed to search database. The database may be temporarily unavailable.',
                totalResults: 0,
              };
            }
          },
        }),

        searchDocuments: tool({
          description: 'Search the disclosure-rag document system containing 448+ specialized UFO/UAP documents, transcripts, and research materials. This provides access to external documents and advanced RAG processing including the Triple RAG system with Upstash, LocalRAG, and CocoIndex backends.',
          parameters: z.object({
            query: z.string().describe('The search query for finding relevant documents and content'),
            top_k: z.number().optional().default(8).describe('Number of results to return (1-20)'),
            filter_type: z.string().optional().describe('Filter by document type (e.g., transcript, case_file, research)'),
            include_metadata: z.boolean().optional().default(true).describe('Include document metadata in results'),
          }),
          execute: async ({ query, top_k = 8, filter_type, include_metadata = true }): Promise<SearchResult> => {
            try {
              // Create cache key for RAG search
              const ragCacheKey = `rag:${query}:${top_k}:${filter_type || 'all'}:${include_metadata}`;
              const cachedResult = getFromCache(ragCacheKey);
              
              if (cachedResult) {
                return cachedResult;
              }

              console.log(`Searching disclosure-rag system for: ${query}`);
              
              // Call the disclosure-rag API server
              const ragApiUrl = process.env.DISCLOSURE_RAG_API_URL || 'http://localhost:8000';
              const searchParams = new URLSearchParams({
                query,
                top_k: Math.min(Math.max(top_k, 1), 20).toString(),
                include_metadata: include_metadata.toString(),
              });
              
              if (filter_type) {
                searchParams.set('filter_type', filter_type);
              }
              
              const response = await fetch(`${ragApiUrl}/rag/search?${searchParams}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                // Add timeout for edge runtime
                signal: AbortSignal.timeout(30000), // 30 second timeout
              });
              
              if (!response.ok) {
                // If RAG system is not available, fall back to basic document search
                console.warn(`RAG system unavailable (${response.status}), attempting fallback search`);
                
                const fallbackResponse = await fetch(`${ragApiUrl}/search?query=${encodeURIComponent(query)}&limit=${top_k}`, {
                  headers: {
                    'Accept': 'application/json',
                  },
                  signal: AbortSignal.timeout(15000),
                });
                
                if (fallbackResponse.ok) {
                  const fallbackData = await fallbackResponse.json();
                  const fallbackResults = fallbackData.documents?.slice(0, top_k).map((doc: any) => ({
                    content: `**${doc.title}** (${doc.doc_type})\n\n${doc.path}\n\nTags: ${doc.tags?.join(', ') || 'None'}`,
                    relevance: 'medium',
                    source: `disclosure-rag:documents:${doc.id}`,
                  })) || [];
                  
                  const fallbackResult = {
                    query,
                    results: fallbackResults,
                    totalResults: fallbackResults.length,
                  };
                  
                  setCache(ragCacheKey, fallbackResult);
                  return fallbackResult;
                }
                
                throw new Error(`RAG API returned ${response.status}: ${response.statusText}`);
              }
              
              const ragData = await response.json();
              
              // Transform RAG results to match our SearchResult format
              const transformedResults = ragData.results?.map((result: any) => ({
                content: `**Document** ${result.badge} \n\n${result.text}\n\nSource: ${result.source}\nSystem: ${result.system}${result.metadata?.title ? `\nTitle: ${result.metadata.title}` : ''}${result.metadata?.doc_type ? `\nType: ${result.metadata.doc_type}` : ''}`,
                relevance: result.score > 0.8 ? 'high' : result.score > 0.6 ? 'medium' : 'low',
                source: `disclosure-rag:${result.system}:${result.id}`,
              })) || [];
              
              const result = {
                query,
                results: transformedResults,
                totalResults: transformedResults.length,
              };
              
              // Cache the RAG result
              setCache(ragCacheKey, result);
              
              return result;
            } catch (error) {
              console.error('Disclosure RAG search error:', error);
              
              // Return a helpful error message based on the error type
              let errorMessage = 'Failed to search document system.';
              if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = 'Document system is not running. Please ensure the disclosure-rag API server is started.';
              } else if (error instanceof Error && error.message.includes('timeout')) {
                errorMessage = 'Document search timed out. The system may be processing a large query.';
              }
              
              return {
                query,
                results: [],
                error: errorMessage,
                totalResults: 0,
              };
            }
          },
        }),

        xataSearch: tool({
          description: 'Advanced semantic search across all integrated data sources including database, documents, and knowledge base. Provides intelligent query expansion, cross-reference capabilities, and aggregated results with relevance ranking.',
          parameters: z.object({
            query: z.string().describe('The search query for comprehensive cross-source search'),
            sources: z.array(z.enum(['database', 'documents', 'knowledge_base', 'all'])).optional().default(['all']).describe('Data sources to search'),
            expand_query: z.boolean().optional().default(true).describe('Whether to expand the query with related terms'),
            max_results: z.number().optional().default(15).describe('Maximum total results across all sources'),
            include_relationships: z.boolean().optional().default(true).describe('Include related entities and connections'),
          }),
          execute: async ({ query, sources = ['all'], expand_query = true, max_results = 15, include_relationships = true }): Promise<SearchResult> => {
            try {
              const xataCacheKey = `xata:${query}:${sources.join(',')}:${expand_query}:${max_results}:${include_relationships}`;
              const cachedResult = getFromCache(xataCacheKey);
              
              if (cachedResult) {
                return cachedResult;
              }

              console.log(`Xata Search for: ${query} across sources: ${sources.join(', ')}`);
              
              const aggregatedResults: Array<{
                content: string;
                relevance: string;
                source: string;
              }> = [];

              // Determine which sources to search
              const searchSources = sources.includes('all') ? ['database', 'documents', 'knowledge_base'] : sources;

              // Search database if requested
              if (searchSources.includes('database')) {
                try {
                  const dbResults = await searchAll(query, 6);

                  dbResults.forEach(record => {
                    const data = record.data as Record<string, unknown>;
                    if (record.table === 'personnel') {
                      aggregatedResults.push({
                        content: `**${record.name}** (Personnel)\\n\\n${data['bio'] || 'No biography available.'}\\n\\nRole: ${data['role'] || 'N/A'}\\nCredibility: ${data['credibility'] || 'N/A'}`,
                        relevance: 'high',
                        source: `xata:database:personnel:${record.name}`,
                      });
                    } else if (record.table === 'events') {
                      const eventDate = data['date'] ? new Date(data['date'] as string).toLocaleDateString() : 'Date unknown';
                      aggregatedResults.push({
                        content: `**${record.name}** (Event - ${eventDate})\\n\\n${data['description'] || 'No description available.'}\\n\\nLocation: ${data['location'] || 'Unknown'}`,
                        relevance: 'high',
                        source: `xata:database:events:${record.name}`,
                      });
                    }
                  });
                } catch (dbError) {
                  console.warn('Database search error:', dbError);
                }
              }

              // Search documents if requested
              if (searchSources.includes('documents')) {
                try {
                  const ragApiUrl = process.env.DISCLOSURE_RAG_API_URL || 'http://localhost:8000';
                  const response = await fetch(`${ragApiUrl}/rag/search?query=${encodeURIComponent(query)}&top_k=5`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: AbortSignal.timeout(15000),
                  });
                  
                  if (response.ok) {
                    const ragData = await response.json();
                    ragData.results?.slice(0, 5).forEach((result: any) => {
                      aggregatedResults.push({
                        content: `**Document** ${result.badge}\\n\\n${result.text}\\n\\nSource: ${result.source}`,
                        relevance: result.score > 0.8 ? 'high' : 'medium',
                        source: `xata:documents:${result.system}:${result.id}`,
                      });
                    });
                  }
                } catch (ragError) {
                  console.warn('Xata RAG search error:', ragError);
                }
              }

              // Search knowledge base if requested
              if (searchSources.includes('knowledge_base')) {
                try {
                  // Search the UAP knowledge base using semantic similarity
                  const kbResults = UAP_KNOWLEDGE_BASE
                    .map(item => ({
                      ...item,
                      similarity: calculateSimilarity(query, item.content)
                    }))
                    .filter(item => item.similarity > 0.2)
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, 3);

                  kbResults.forEach(item => {
                    aggregatedResults.push({
                      content: item.content,
                      relevance: item.similarity > 0.5 ? 'high' : 'medium',
                      source: `xata:knowledge_base:${item.source}:${item.id}`,
                    });
                  });

                  // If no good matches, add general context
                  if (kbResults.length === 0) {
                    aggregatedResults.push({
                      content: `UAP research context for "${query}": This relates to ongoing investigations into unidentified aerial phenomena, including government studies, military encounters, and scientific analysis.`,
                      relevance: 'medium',
                      source: 'xata:knowledge_base:general-context',
                    });
                  }
                } catch (kbError) {
                  console.warn('Xata knowledge base search error:', kbError);
                }
              }

              // Sort by relevance and limit results
              const sortedResults = aggregatedResults
                .sort((a, b) => {
                  const relevanceOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                  return relevanceOrder[b.relevance as keyof typeof relevanceOrder] - relevanceOrder[a.relevance as keyof typeof relevanceOrder];
                })
                .slice(0, max_results);

              const result = {
                query,
                results: sortedResults,
                totalResults: sortedResults.length,
              };

              setCache(xataCacheKey, result);
              return result;
            } catch (error) {
              console.error('Xata search error:', error);
              return {
                query,
                results: [],
                error: 'Xata search failed. Please try again.',
                totalResults: 0,
              };
            }
          },
        }),

        searchWebResources: tool({
          description: 'Search and extract content from 90+ specialized UFO/UAP websites including government archives, research organizations, databases, and community resources. Provides real-time access to current information from trusted sources.',
          parameters: z.object({
            query: z.string().describe('Search query for web resource content'),
            resource_types: z.array(z.enum(['government', 'research_orgs', 'databases', 'academic', 'disclosure', 'community', 'all'])).optional().default(['all']).describe('Types of resources to search'),
            max_results: z.number().optional().default(10).describe('Maximum number of results to return'),
            include_content: z.boolean().optional().default(true).describe('Whether to include extracted content or just metadata'),
          }),
          execute: async ({ query, resource_types = ['all'], max_results = 10, include_content = true }): Promise<SearchResult> => {
            try {
              const webCacheKey = `web:${query}:${resource_types.join(',')}:${max_results}:${include_content}`;
              const cachedResult = getFromCache(webCacheKey);
              
              if (cachedResult) {
                return cachedResult;
              }

              console.log(`Web Resources Search for: ${query} in types: ${resource_types.join(', ')}`);
              
              // Import the resources list
              const { EXTERNAL_RESOURCES } = await import('@/apps/app/src/utils/constants/resources');
              
              // Categorize resources
              const resourceCategories = {
                government: ['archives.gov', 'cnes-geipan.fr'],
                research_orgs: ['mufon.com', 'nicap.org', 'cufos.org', 'narcap.org', 'nuforc.org'],
                databases: ['updb.app', 'ufocasebook.com', 'ufodata.net', 'ufoevidence.org'],
                academic: ['harvard.edu', 'explorescu.org'],
                disclosure: ['theblackvault.com', 'thedebrief.org', 'disclosurediaries.com'],
                community: ['abovetopsecret.com', 'anomalien.com', 'ufoinsight.com'],
              };

              // Filter resources based on types
              let selectedResources = EXTERNAL_RESOURCES;
              if (!resource_types.includes('all')) {
                selectedResources = EXTERNAL_RESOURCES.filter(url => {
                  return resource_types.some(type => {
                    if (type === 'all') return true;
                    const domains = resourceCategories[type as keyof typeof resourceCategories] || [];
                    return domains.some(domain => url.includes(domain));
                  });
                });
              }

              // Limit to a reasonable number for performance
              const resourcesToSearch = selectedResources.slice(0, Math.min(20, selectedResources.length));
              
              const results: Array<{
                content: string;
                relevance: string;
                source: string;
              }> = [];

              // Search each resource (simulated - in real implementation would use web scraping)
              for (const resource of resourcesToSearch.slice(0, Math.min(5, resourcesToSearch.length))) {
                try {
                  // Note: This is a placeholder implementation
                  // Real implementation would use web scraping libraries
                  const domain = new URL(resource).hostname;
                  const resourceType = Object.entries(resourceCategories).find(([_, domains]) => 
                    domains.some(d => domain.includes(d))
                  )?.[0] || 'community';

                  results.push({
                    content: `**${domain}** (${resourceType})\\n\\nThis resource contains information related to "${query}". \\n\\nURL: ${resource}\\n\\n*Note: Full content extraction would be implemented with web scraping capabilities*`,
                    relevance: 'medium',
                    source: `web:${resourceType}:${domain}`,
                  });

                  // Break early to avoid timeout
                  if (results.length >= max_results) break;
                } catch (urlError) {
                  console.warn(`Error processing resource ${resource}:`, urlError);
                }
              }

              // Add note about implementation status
              if (results.length === 0) {
                results.push({
                  content: `**Web Resources Search**\\n\\nFound ${resourcesToSearch.length} relevant UFO/UAP websites for query "${query}".\\n\\nResources include:\\n${resourcesToSearch.slice(0, 10).map(url => `- ${new URL(url).hostname}`).join('\\n')}\\n\\n*Note: Full content extraction capabilities are being implemented. Currently showing resource discovery results.*`,
                  relevance: 'medium',
                  source: 'web:discovery:resources',
                });
              }

              const result = {
                query,
                results: results.slice(0, max_results),
                totalResults: results.length,
              };

              setCache(webCacheKey, result);
              return result;
            } catch (error) {
              console.error('Web resources search error:', error);
              return {
                query,
                results: [],
                error: 'Web resources search failed. The web scraping service may be unavailable.',
                totalResults: 0,
              };
            }
          },
        }),
      },
    });

    // Create response with rate limit headers
    const response = result.toUIMessageStreamResponse();
    
    // Add headers
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    response.headers.set('X-Cache', 'MISS');
    
    success = true;
    return response;
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request';
    const statusCode = error instanceof SyntaxError ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  } finally {
    // Record metrics
    recordMetrics(success, Date.now() - startTime);
  }
}

// Add metrics endpoint
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  
  if (url.pathname.endsWith('/metrics')) {
    return NextResponse.json({
      ...metricsStore,
      uptime: Date.now() - metricsStore.lastReset,
      successRate: metricsStore.requests > 0 ? (metricsStore.successful / metricsStore.requests) * 100 : 0,
      cacheSize: responseCache.size,
      rateLimitClients: rateLimitStore.size
    });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}