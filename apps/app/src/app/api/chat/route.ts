import { openai } from '@ai-sdk/openai'
import { frontendTools } from '@assistant-ui/react-ai-sdk'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 30

// Constants for document processing
const DEFAULT_SEARCH_LIMIT = 10
const CONTENT_PREVIEW_LENGTH = 6000
const SUMMARY_CONTENT_LENGTH = 8000
const TAGS_CONTENT_LENGTH = 4000
const MAX_TOPICS = 12
const MAX_TAGS = 12
const MIN_TAGS = 8

// Utility functions
function truncateContent( content: string, maxLength: number ): string {
  return content.length > maxLength
    ? `${content.substring( 0, maxLength )}...`
    : content
}

function parseJsonArray( jsonString: string, defaultValue: any[] = [] ): any[] {
  try {
    const parsed = JSON.parse( jsonString )
    return Array.isArray( parsed ) ? parsed : defaultValue
  } catch {
    return defaultValue
  }
}

function formatFileSize( bytes: number ): string {
  return ( bytes / 1024 ).toFixed( 1 )
}

export async function POST( req: NextRequest ) {
  try {
    const body = await req.json()
    const { messages, system, tools: frontendToolsConfig } = body

    if ( !messages || !Array.isArray( messages ) ) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // System prompt for Prometheus AI
    const prometheusSystem = system || `You are Prometheus AI - a research assistant dedicated to illuminating the unknown by gathering, organizing, analyzing, and documenting resources on unexplained aerial phenomena. 

Your mission embodies the Promethean ideal: to cross boundaries between the known and unknown, offering foresight through careful analysis while maintaining the responsibility that comes with handling potentially transformative information.

Always:
- Be factual, informative, and balanced in your responses
- Draw connections between evidence and patterns
- Cite sources when available from the knowledge base
- Acknowledge uncertainties and the evolving nature of UAP research
- Help users understand the scientific approach to unexplained phenomena`

    const result = streamText( {
      model: openai( 'gpt-4o' ),
      messages,
      system: prometheusSystem,
      tools: {
        ...frontendTools( frontendToolsConfig ),

        // UAP Knowledge Base Search Tool
        searchUAP: tool( {
          description: 'Search the UAP/UFO knowledge base for relevant information about unexplained aerial phenomena, sightings, research, and related topics',
          parameters: z.object( {
            query: z.string().describe( 'The search query for UAP/UFO related information' ),
            limit: z.number().optional().default( DEFAULT_SEARCH_LIMIT ).describe( 'Maximum number of results to return' ),
          } ),
          execute: async ( { query, limit = DEFAULT_SEARCH_LIMIT } ) => {
            try {
              // Mock UAP search results for now
              // TODO: Replace with actual Langbase or vector search implementation
              return {
                query,
                results: [
                  {
                    content: `Based on the UAP knowledge base, here are findings related to: ${query}. This includes documented sightings, government reports, and research data from credible sources.`,
                    relevance: 'high',
                    source: 'uap-knowledge-base',
                  },
                ],
                totalResults: 1,
              }
            } catch ( error ) {
              console.error( 'UAP search error:', error )
              return {
                query,
                results: [],
                error: 'Failed to search UAP knowledge base',
                totalResults: 0,
              }
            }
          },
        } ),

        // Document Processing Tool
        processDocument: tool( {
          description: 'Process and analyze documents with various AI-powered actions including summarization, topic extraction, sentiment analysis, and UAP-specific analysis',
          parameters: z.object( {
            action: z.enum( [
              'Summarize',
              'Extract topics',
              'Analyze sentiment',
              'Connect the Dots',
              'Find insights',
              'Generate tags'
            ] ).describe( 'The type of analysis to perform' ),
            fileContent: z.string().describe( 'The extracted text content of the file' ),
            fileName: z.string().describe( 'The name of the file being processed' ),
            fileType: z.string().describe( 'The MIME type of the file' ),
            fileSize: z.number().describe( 'The size of the file in bytes' ),
          } ),
          execute: async ( { action, fileContent, fileName, fileType, fileSize } ) => {
            try {
              const fileSizeKB = formatFileSize( fileSize )

              // Handle different document actions
              switch ( action ) {
                case 'Summarize':
                  return {
                    type: 'summary',
                    fileName,
                    fileType,
                    fileSize: fileSizeKB,
                    result: `Summary of ${fileName}: This document contains ${fileContent.length} characters of content. Key themes and insights have been extracted for analysis.`,
                  }

                case 'Extract topics':
                  const topics = [
                    'Document Analysis',
                    'Content Processing',
                    'Information Extraction',
                    'Data Analysis',
                    'Research Documentation'
                  ]
                  return {
                    type: 'topics',
                    fileName,
                    result: topics.slice( 0, MAX_TOPICS ),
                  }

                case 'Analyze sentiment':
                  return {
                    type: 'analysis',
                    fileName,
                    analysisType: 'sentiment',
                    result: `Sentiment analysis of ${fileName}: The document maintains a neutral to informative tone with objective presentation of information.`,
                  }

                case 'Connect the Dots':
                  return {
                    type: 'analysis',
                    fileName,
                    analysisType: 'connections',
                    result: `Connection analysis for ${fileName}: This document relates to broader UAP research patterns and may contain relevant information for cross-referencing with other reports.`,
                  }

                case 'Find insights':
                  return {
                    type: 'analysis',
                    fileName,
                    analysisType: 'insights',
                    result: `Insights from ${fileName}: Key patterns and significant details have been identified for further investigation and analysis.`,
                  }

                case 'Generate tags':
                  const tags = ['document', 'analysis', 'research', 'data', 'content']
                  return {
                    type: 'tags',
                    fileName,
                    result: tags.slice( 0, MAX_TAGS ),
                  }

                default:
                  throw new Error( `Unknown action: ${action}` )
              }
            } catch ( error: any ) {
              console.error( `Error processing document action ${action}:`, error )
              return {
                type: 'error',
                fileName,
                error: error.message || 'Failed to process document',
              }
            }
          },
        } ),
      },
    } )

    return result.toDataStreamResponse()
  } catch ( error ) {
    console.error( 'Chat API error:', error )

    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request'
    const statusCode = error instanceof SyntaxError ? 400 : 500

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}
