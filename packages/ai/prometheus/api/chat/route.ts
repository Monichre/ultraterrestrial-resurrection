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

// Export runtime configuration
export const runtime = 'edge';

// Main POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
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
              const response = await langbaseClient.pipes.run({
                name: 'prometheus',
                messages: [
                  {
                    role: 'user',
                    content: `Search for information about: ${query}`,
                  },
                ],
                stream: false,
              });

              return {
                query,
                results: [
                  {
                    content: response.completion,
                    relevance: 'high',
                    source: 'langbase-uap-corpus',
                  },
                ],
                totalResults: 1,
              };
            } catch (error) {
              console.error('Langbase search error:', error);
              return {
                query,
                results: [],
                error: 'Failed to search UAP knowledge base',
                totalResults: 0,
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
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request';
    const statusCode = error instanceof SyntaxError ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}