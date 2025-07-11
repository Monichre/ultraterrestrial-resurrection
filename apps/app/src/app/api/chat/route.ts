import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { Langbase } from 'langbase';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

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

// Initialize Langbase client
const langbaseClient = new Langbase({
  apiKey: process.env.LANGBASE_API_KEY!,
});

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
        content: `Analyze this document for hidden patterns, insights, and important details:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, CONTENT_PREVIEW_LENGTH)}

Look for:
1. Subtle patterns or correlations
2. Implications not explicitly stated
3. Gaps or inconsistencies in information
4. Potential significance or importance
5. Questions raised by the content`
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
        content: `Generate relevant classification tags for this document:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, TAGS_CONTENT_LENGTH)}

Return tags as a JSON array covering:
- Document type/format
- Main subject areas  
- Content themes
- Quality/credibility indicators
- Research relevance

Return ${MIN_TAGS}-${MAX_TAGS} tags as: ["tag1", "tag2", "tag3"]`
      }]
    });

    const tags = await result.text;
    return {
      type: 'tags',
      fileName,
      result: parseJsonArray(tags, []),
    };
  }
};

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body = await req.json();
    const { messages, system, tools: frontendToolsConfig } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    // Update metrics
    metricsStore.requests++;

    const result = await streamText({
      model: openai(MODEL_NAME),
      system: system || SYSTEM_PROMPTS.main,
      messages,
      tools: {
        searchUAP: tool({
          description: 'Search the UAP/UFO knowledge base for relevant information',
          parameters: z.object({
            query: z.string().describe('Search query for UAP/UFO information'),
            limit: z.number().optional().default(DEFAULT_SEARCH_LIMIT).describe('Maximum number of results to return'),
          }),
          execute: async ({ query, limit = DEFAULT_SEARCH_LIMIT }) => {
            try {
              const response = await langbaseClient.search({
                query,
                limit,
              });

              const searchResult: SearchResult = {
                query,
                results: response.results?.map((result: any) => ({
                  content: truncateContent(result.content || '', CONTENT_PREVIEW_LENGTH),
                  relevance: result.score?.toString() || 'N/A',
                  source: result.metadata?.source || 'Unknown',
                })) || [],
                totalResults: response.results?.length || 0,
              };

              return searchResult;
            } catch (error) {
              console.error('UAP search error:', error);
              return {
                query,
                results: [],
                totalResults: 0,
                error: 'Search service temporarily unavailable',
              };
            }
          },
        }),

        processDocument: tool({
          description: 'Process uploaded documents with various analysis options',
          parameters: z.object({
            fileContent: z.string().describe('Content of the file to process'),
            fileName: z.string().describe('Name of the file'),
            fileType: z.string().optional().describe('Type of the file'),
            fileSizeKB: z.string().optional().describe('Size of the file in KB'),
            action: z.enum(['summarize', 'extractTopics', 'analyzeSentiment', 'connectTheDots', 'findInsights', 'generateTags']).describe('Analysis action to perform'),
          }),
          execute: async ({ fileContent, fileName, fileType = 'unknown', fileSizeKB = '0', action }) => {
            try {
              const actionFunction = documentActions[action];
              if (!actionFunction) {
                throw new Error(`Unknown action: ${action}`);
              }

              return await actionFunction(fileContent, fileName, fileType, fileSizeKB);
            } catch (error) {
              console.error(`Document processing error (${action}):`, error);
              return {
                type: action,
                fileName,
                error: `Failed to ${action} document: ${error instanceof Error ? error.message : 'Unknown error'}`,
              };
            }
          },
        }),

        // Include frontend tools if provided
        ...frontendToolsConfig ? frontendTools(frontendToolsConfig) : {},
      },
    });

    // Update success metrics
    metricsStore.successful++;
    const responseTime = Date.now() - startTime;
    metricsStore.avgResponseTime = (metricsStore.avgResponseTime + responseTime) / 2;

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Update failure metrics
    metricsStore.failed++;

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    metrics: {
      ...metricsStore,
      uptime: Date.now() - metricsStore.lastReset,
    },
  });
}