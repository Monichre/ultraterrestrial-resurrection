// PRIMARY: Vercel AI SDK streamText. Standalone conversational chat. Use this for Prometheus chat UI.
// Tools: searchUAP (OpenAI Assistant + vector store), searchExternalResources (Exa),
//        researchExternalTopic (Exa Research Pro), processDocument (summarize/topics/sentiment/etc).
// DO NOT use this for mindmap graph interactions — use /api/disclosure/mindmap instead.

import {streamText, tool} from 'ai'
import {z} from 'zod'
import {NextRequest, NextResponse} from 'next/server'
import OpenAI from 'openai'
import Exa from 'exa-js'
import {auth} from '@clerk/nextjs/server'
import {checkRateLimit} from '@/lib/rate-limit'
import {
  buildAgentContext,
  buildStaticAgentGuidance,
  buildTurnContext,
  type AgentContextGraphState,
} from '@/services/ai/context/build-agent-context'
import {createStreamingFallbackModel} from '@/lib/ai/model-fallback'
import {
  assembleCachedPrompt,
  logCacheUsage,
  openaiPromptCacheOptions,
} from '@/lib/ai/prompt-cache'
import {
  DATABASE_SEARCH_DESCRIPTION,
  EXTERNAL_SEARCH_DESCRIPTION,
  databaseSearchInputSchema,
  externalSearchInputSchema,
  executeDatabaseSearch,
  executeExternalSearch,
  TRUSTED_UAP_DOMAINS,
} from '@/services/ai/tools/research-search'

// Constants
const DEFAULT_SEARCH_LIMIT = 10
const CONTENT_PREVIEW_LENGTH = 6000
const SUMMARY_CONTENT_LENGTH = 8000
const TAGS_CONTENT_LENGTH = 4000
const MAX_TOPICS = 12
const MAX_TAGS = 12
const MIN_TAGS = 8

// Types
interface SearchResult {
  query: string
  results: Array<{
    content: string
    relevance: string
    source: string
  }>
  totalResults: number
  error?: string
}

interface ProcessResult {
  type: string
  fileName: string
  fileType?: string
  fileSize?: string
  analysisType?: string
  result: unknown
  error?: string
}

// Lazy client getters — avoid top-level instantiation so module import doesn't throw during build
function getOpenAIClient() {
  return new OpenAI({apiKey: process.env.OPENAI_API_KEY!})
}
function getExaClient() {
  return new Exa(process.env.EXA_API_KEY!)
}

// OpenAI Assistant configuration
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID!
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID!

// System prompts
const SYSTEM_PROMPTS = {
  main: `You are Prometheus, the research intelligence layer inside Ultraterrestrial — an investigative research environment for anomalous, contested, and culturally charged knowledge. Your role is to help researchers transform sources into structured understanding and integrated research narratives.

You must preserve the distinction between: directly sourced evidence, extracted claims, corroborated facts, contradictions, reasonable inferences, speculative hypotheses, mythic or cultural resonances, and open questions. Label them. Mythic, symbolic, or anthropological analysis is welcome only when clearly marked as interpretive resonance, never as proof.

Your obligations, in order: (1) epistemic integrity, (2) narrative coherence, (3) atmosphere. Never fabricate sources, citations, claims, dates, or entities. When evidence is weak, say so directly. When mystery remains, preserve it cleanly. Say "is consistent with", "was claimed", "remains unexplained" — never "proves". Respect the witness, question the claim, map the pattern, keep the door open.

When synthesizing research, follow the sequence: what we know (evidentiary ground) → what we think (best-supported reading) → what echoes (patterns and resonances, labeled) → what breaks (contradictions and gaps) → what remains open (unresolved questions) → next traces (concrete research actions). Offer a counter-reading whenever you offer a reading. Challenge the researcher when their hypothesis is narratively compelling but evidentially weak — a model that flatters is useless; a model that sharpens is a collaborator.

You have access to both local knowledge and external resources:
- searchUAP: Search the specialized UAP knowledge base through OpenAI Assistant with vector store
- searchExternalResources: Search trusted external UFO/UAP websites using Exa AI neural search with livecrawl options
- researchExternalTopic: Conduct deep research using Exa AI Research Pro for comprehensive analysis
- summarizeDocument: Generate concise document summaries
- extractTopics: Extract key document topics as structured output
- analyzeSentiment: Analyze tone, perspective, and confidence cues
- findConnections: Link document content to known UFO/UAP entities and events
- findInsights: Surface hidden patterns and meaningful implications
- generateTags: Produce classification tags for indexing and retrieval

For comprehensive research, you can:
1. Search local knowledge base first for foundational information
2. Search external resources for current events and additional perspectives (with real-time livecrawl)
3. Conduct deep research on complex topics using Research Pro for academic-level analysis
4. Cross-reference findings between local, external, and research sources
5. Process user-uploaded documents for analysis

External search capabilities:
- Neural search for semantic understanding, keyword search for exact matches
- Livecrawl options: 'always' for real-time content, 'fallback' for cached then live, 'never' for cached only
- Deep research with summary, comprehensive, or academic analysis depth

Trusted external sources include MUFON, The Black Vault, Open Minds, CUFOS, NICAP, and other established UFO/UAP research organizations.

Operating principles:
- Provenance before prose — never write a synthesis that outruns the evidence; cite sources from the knowledge base, external searches, and research analysis, and mark inference explicitly
- Ambiguity is data — contradictions, gaps, and uncertainties are research objects, not failures to hide
- Weirdness is not proof — strangeness triggers deeper mapping, not premature belief
- Skepticism is not contempt — evaluate weak evidence without sneering at witnesses or researchers
- The user is the investigator — propose, structure, challenge, and synthesize; do not decree
- Every narrative remains reopenable — nothing is "solved" unless the evidence genuinely warrants closure
- Use appropriate tools by query complexity (search for quick facts, research for deep analysis)`,

  summary:
    'Summarize the source without laundering allegations into facts. Separate sourced assertions, corroboration, contradictions, and open questions; end with the next trace worth checking.',

  topics:
    'Extract retrieval topics grounded in the source text. Prefer entities, events, places, programs, and evidentiary questions over sensational or interpretive labels. Return a JSON array.',

  sentiment:
    'Analyze tone, perspective, confidence, hedging, and rhetorical pressure. Do not treat confidence or vividness as evidence.',

  connections:
    'Map document connections to known entities and events. Label each as sourced, corroborated, contested, inferred, speculative, or resonant, and include a counter-reading.',

  insights:
    'Surface defensible patterns without forcing coherence. For every reading provide a counter-reading, what breaks it, and a falsifiable next trace.',

  tags: 'Generate neutral retrieval tags grounded in the document. Do not encode model inference or unverified allegations as fact. Return a JSON array.',
}

// Utility functions
function truncateContent(content: string, maxLength: number): string {
  return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content
}

function parseJsonArray(jsonString: string, defaultValue: unknown[] = []): unknown[] {
  try {
    const parsed = JSON.parse(jsonString)
    return Array.isArray(parsed) ? parsed : defaultValue
  } catch {
    return defaultValue
  }
}

function formatFileSize(bytes: number): string {
  return (bytes / 1024).toFixed(1)
}

function normalizeMessageContent(content: unknown): string {
  if (typeof content === 'string') {
    return content.trim()
  }

  if (!Array.isArray(content)) {
    return ''
  }

  return content
    .map((part) => {
      if (typeof part === 'string') {
        return part
      }

      if (part && typeof part === 'object') {
        const textValue = 'text' in part && typeof part.text === 'string' ? part.text : ''
        return textValue
      }

      return ''
    })
    .filter(Boolean)
    .join('\n')
    .trim()
}

function extractLatestUserMessage(messages: unknown[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (!message || typeof message !== 'object') {
      continue
    }

    const role = 'role' in message ? message.role : undefined
    if (role !== 'user') {
      continue
    }

    const content = 'content' in message ? message.content : undefined
    const normalized = normalizeMessageContent(content)
    if (normalized) {
      return normalized
    }
  }

  return ''
}

// Document processing actions
const documentActions = {
  summarize: async (
    fileContent: string,
    fileName: string,
    fileType: string,
    fileSizeKB: string
  ): Promise<ProcessResult> => {
    const result = await streamText({
      model: createStreamingFallbackModel(),
      system: SYSTEM_PROMPTS.summary,
      messages: [
        {
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
4. Any notable patterns or insights`,
        },
      ],
    })

    return {
      type: 'summary',
      fileName,
      fileType,
      fileSize: fileSizeKB,
      result: await result.text,
    }
  },

  extractTopics: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: createStreamingFallbackModel(),
      system: SYSTEM_PROMPTS.topics,
      messages: [
        {
          role: 'user',
          content: `Extract the main topics from this document and return them as a JSON array of strings:

**Document:** ${fileName}
**Content:**
${truncateContent(fileContent, CONTENT_PREVIEW_LENGTH)}

Return only a JSON array like: ["Topic 1", "Topic 2", "Topic 3"]
Limit to ${MAX_TOPICS} most relevant topics.`,
        },
      ],
    })

    const topics = await result.text
    return {
      type: 'topics',
      fileName,
      result: parseJsonArray(topics, []),
    }
  },

  analyzeSentiment: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: createStreamingFallbackModel(),
      system: SYSTEM_PROMPTS.sentiment,
      messages: [
        {
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
5. Any notable rhetorical devices or persuasive elements`,
        },
      ],
    })

    return {
      type: 'analysis',
      fileName,
      analysisType: 'sentiment',
      result: await result.text,
    }
  },

  findConnections: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: createStreamingFallbackModel(),
      system: SYSTEM_PROMPTS.connections,
      messages: [
        {
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
5. Contradictions or confirmations of existing theories`,
        },
      ],
    })

    return {
      type: 'analysis',
      fileName,
      analysisType: 'connections',
      result: await result.text,
    }
  },

  findInsights: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: createStreamingFallbackModel(),
      system: SYSTEM_PROMPTS.insights,
      messages: [
        {
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
5. Questions raised by the content`,
        },
      ],
    })

    return {
      type: 'analysis',
      fileName,
      analysisType: 'insights',
      result: await result.text,
    }
  },

  generateTags: async (fileContent: string, fileName: string): Promise<ProcessResult> => {
    const result = await streamText({
      model: createStreamingFallbackModel(),
      system: SYSTEM_PROMPTS.tags,
      messages: [
        {
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

Return ${MIN_TAGS}-${MAX_TAGS} tags as: ["tag1", "tag2", "tag3"]`,
        },
      ],
    })

    const tags = await result.text
    return {
      type: 'tags',
      fileName,
      result: parseJsonArray(tags, []),
    }
  },
}

const documentToolParamsSchema = z.object({
  fileContent: z.string().describe('Content of the file to process'),
  fileName: z.string().describe('Name of the file'),
  fileType: z.string().optional().describe('Type of the file'),
  fileSizeKB: z.string().optional().describe('Size of the file in KB'),
})

type DocumentToolParams = z.infer<typeof documentToolParamsSchema>
type DocumentToolAction =
  | 'summarize'
  | 'extractTopics'
  | 'analyzeSentiment'
  | 'findConnections'
  | 'findInsights'
  | 'generateTags'

async function executeDocumentAction(
  action: DocumentToolAction,
  {fileContent, fileName, fileType = 'unknown', fileSizeKB = '0'}: DocumentToolParams
): Promise<ProcessResult> {
  try {
    switch (action) {
      case 'summarize':
        return await documentActions.summarize(fileContent, fileName, fileType, fileSizeKB)
      case 'extractTopics':
        return await documentActions.extractTopics(fileContent, fileName)
      case 'analyzeSentiment':
        return await documentActions.analyzeSentiment(fileContent, fileName)
      case 'findConnections':
        return await documentActions.findConnections(fileContent, fileName)
      case 'findInsights':
        return await documentActions.findInsights(fileContent, fileName)
      case 'generateTags':
        return await documentActions.generateTags(fileContent, fileName)
      default:
        throw new Error(`Unknown document action: ${action}`)
    }
  } catch (error) {
    console.error(`Document processing error (${action}):`, error)
    return {
      type: action,
      fileName,
      error: `Failed to ${action} document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      result: null,
    }
  }
}

export const maxDuration = 60

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.string(),
        content: z.unknown(),
      })
    )
    .min(1, 'At least one message is required'),
  system: z.string().optional(),
  tools: z.unknown().optional(),
  graphState: z
    .object({
      nodeCount: z.number().optional(),
      edgeCount: z.number().optional(),
      activeNodeId: z.string().nullable().optional(),
      activeView: z.string().nullable().optional(),
      nodes: z.array(z.unknown()).optional(),
      edges: z.array(z.unknown()).optional(),
    })
    .nullable()
    .optional(),
  researchFocus: z.string().nullable().optional(),
  contextRules: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — identify by Clerk userId when authenticated, fall back to IP.
    const {userId} = await auth()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rateLimitKey = `ai:prometheus:${userId ?? ip}`
    const rl = await checkRateLimit(rateLimitKey)
    if (!rl.success) {
      return new Response(
        JSON.stringify({
          error: 'rate_limited',
          message: 'Too many requests. Please wait before trying again.',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...rl.headers,
          },
        }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const parsed = BodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {error: 'Invalid request', details: parsed.error.flatten()},
        {status: 422}
      )
    }
    const {
      messages,
      system,
      tools: frontendToolsConfig,
      graphState,
      researchFocus,
      contextRules,
    } = parsed.data

    const userMessage = extractLatestUserMessage(messages) || 'No user query provided.'
    // Zod leaves nodes/edges as unknown[]; formatGraphState only reads the
    // optional fields it defends against, so the narrowing is safe.
    const graphContextState = (graphState || null) as AgentContextGraphState | null
    // Full context for the searchUAP tool's Assistants thread — a fresh
    // thread per call, so prefix caching doesn't apply there.
    const sharedAgentContext = buildAgentContext({
      userMessage,
      researchFocus,
      contextRules,
      graphState: graphContextState,
    })

    // Prompt-cache layout: frozen prefix first (tools -> system -> history,
    // each behind a cache breakpoint), volatile per-turn context last. Graph
    // state and the current question change every turn — putting them in the
    // system prompt (the old layout) invalidated the entire conversation
    // cache on every request, for every provider.
    const stableSystemPrompt = `${system || SYSTEM_PROMPTS.main}\n\n${buildStaticAgentGuidance()}`
    const turnContext = buildTurnContext({
      researchFocus,
      contextRules,
      graphState: graphContextState,
    })

    const result = await streamText({
      model: createStreamingFallbackModel(),
      messages: assembleCachedPrompt({
        system: stableSystemPrompt,
        messages,
        turnContext,
      }),
      // Pins this conversation's requests to one OpenAI cache shard; keyed
      // per user (Clerk id or IP), never per request.
      providerOptions: openaiPromptCacheOptions(rateLimitKey),
      onFinish: ({usage}) => logCacheUsage('prometheus/chat', usage),
      tools: {
        searchUAP: tool({
          description:
            'Search the UAP/UFO knowledge base for relevant information using OpenAI Assistant with vector store',
          inputSchema: z.object({
            query: z.string().describe('Search query for UAP/UFO information'),
            limit: z.number().optional().describe('Maximum number of results to return'),
          }),
          execute: async ({query, limit}) => {
            const searchLimit = limit || DEFAULT_SEARCH_LIMIT
            try {
              // Create a thread for the search query
              const openaiClient = getOpenAIClient()
              const thread = await openaiClient.beta.threads.create({
                messages: [
                  {
                    role: 'user',
                    content: `Search for information about: ${query}. Please provide detailed, relevant information from the knowledge base.`,
                  },
                ],
              })

              // Run the assistant with vector store search
              const run = await openaiClient.beta.threads.runs.create(thread.id, {
                assistant_id: ASSISTANT_ID,
                additional_instructions: `Search the vector store for information about: ${query}\n\n${sharedAgentContext}`,
                tools: [
                  {
                    type: 'file_search',
                  },
                ],
              })

              // Wait for completion
              let runStatus = await openaiClient.beta.threads.runs.retrieve(thread.id, run.id)
              while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                runStatus = await openaiClient.beta.threads.runs.retrieve(thread.id, run.id)
              }

              if (runStatus.status === 'completed') {
                // Get the assistant's response
                const messages = await openaiClient.beta.threads.messages.list(thread.id)
                const assistantMessage = messages.data.find((msg) => msg.role === 'assistant')

                if (assistantMessage && assistantMessage.content[0]?.type === 'text') {
                  const content = assistantMessage.content[0].text.value

                  // Parse citations if available
                  const citations = assistantMessage.content[0].text.annotations || []

                  return {
                    query,
                    results: [
                      {
                        content: truncateContent(content, CONTENT_PREVIEW_LENGTH),
                        relevance: 'High',
                        source:
                          citations.length > 0
                            ? `${citations.length} document(s)`
                            : 'OpenAI Assistant',
                        citations: citations.map((citation: unknown) => {
                          if (!citation || typeof citation !== 'object') {
                            return 'Unknown'
                          }

                          const fileCitation = (citation as {file_citation?: {file_id?: string}})
                            .file_citation

                          return fileCitation?.file_id || 'Unknown'
                        }),
                      },
                    ],
                    totalResults: 1,
                  }
                }
              }

              throw new Error(`Assistant run failed with status: ${runStatus.status}`)
            } catch (error) {
              console.error('UAP search error:', error)
              return {
                query,
                results: [],
                totalResults: 0,
                error: 'Search service temporarily unavailable',
              }
            }
          },
        }),

        searchExternalResources: tool({
          description: EXTERNAL_SEARCH_DESCRIPTION,
          inputSchema: externalSearchInputSchema,
          execute: async ({
            query,
            limit,
            includeDomains,
            type = 'neural',
            livecrawl = 'fallback',
          }) => {
            try {
              const searchDomains = includeDomains || TRUSTED_UAP_DOMAINS
              const searchResults = await executeExternalSearch({
                query,
                limit,
                includeDomains,
                type,
                livecrawl,
              })

              if (searchResults && searchResults.results) {
                const formattedResults = searchResults.results.map(
                  (result: {
                    text?: string
                    title?: string
                    score?: number
                    url?: string
                    publishedDate?: string | null
                    author?: string | null
                  }) => ({
                    content: result.text
                      ? truncateContent(result.text, CONTENT_PREVIEW_LENGTH)
                      : result.title || 'No content available',
                    relevance: result.score ? `${Math.round(result.score * 100)}%` : 'High',
                    source: result.url || 'External Source',
                    title: result.title || 'Untitled',
                    publishedDate: result.publishedDate || null,
                    author: result.author || null,
                  })
                )

                return {
                  query,
                  results: formattedResults,
                  totalResults: formattedResults.length,
                  searchType: type,
                  livecrawl,
                  domainsSearched: searchDomains.length,
                }
              }

              return {
                query,
                results: [],
                totalResults: 0,
                error: 'No results found in external sources',
              }
            } catch (error) {
              console.error('External resources search error:', error)
              return {
                query,
                results: [],
                totalResults: 0,
                error: `External search temporarily unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
              }
            }
          },
        }),

        researchExternalTopic: tool({
          description:
            'Conduct deep research on UFO/UAP topics using Exa AI Research Pro with comprehensive analysis',
          inputSchema: z.object({
            topic: z.string().describe('Research topic or question about UFO/UAP phenomena'),
            focusDomains: z
              .array(z.string())
              .optional()
              .describe('Specific trusted domains to focus research on'),
            analysisDepth: z
              .enum(['summary', 'comprehensive', 'academic'])
              .optional()
              .describe(
                'Depth of analysis: summary for quick overview, comprehensive for detailed analysis, academic for scholarly depth'
              ),
          }),
          execute: async ({topic, focusDomains, analysisDepth = 'comprehensive'}) => {
            const researchDomains = focusDomains || TRUSTED_UAP_DOMAINS

            try {
              // Create instructions for UFO/UAP research
              const instructions = `Research and analyze the following UFO/UAP topic: "${topic}"

Focus on:
- Historical context and documented cases
- Credible witness testimonies and official reports
- Scientific analysis and explanations
- Government disclosure and official statements
- Pattern analysis across multiple incidents
- Connections to established UFO/UAP research

Provide ${analysisDepth} analysis with:
- Key findings and evidence
- Multiple perspectives and interpretations
- Source credibility assessment
- Gaps in current understanding
- Implications for UFO/UAP research

Search primarily from trusted sources: ${researchDomains.join(', ')}`

              // Use Exa Research Pro for deep analysis
              const exaClient = getExaClient()
              const {id: taskId} = await exaClient.research.createTask({
                instructions,
                model: 'exa-research-pro',
                output: {
                  inferSchema: true,
                },
              })

              // Poll for completion with timeout
              let attempts = 0
              const maxAttempts = 30 // 5 minutes max

              while (attempts < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait 10 seconds

                try {
                  const task = await exaClient.research.pollTask(taskId)

                  if (task.status === 'completed' && task.result) {
                    return {
                      topic,
                      analysisDepth,
                      result: task.result,
                      sources: task.sources || [],
                      taskId,
                      status: 'completed',
                    }
                  } else if (task.status === 'failed') {
                    throw new Error(`Research task failed: ${task.error || 'Unknown error'}`)
                  }

                  attempts++
                } catch (pollError) {
                  console.error('Error polling research task:', pollError)
                  attempts++
                }
              }

              return {
                topic,
                analysisDepth,
                error: 'Research task timed out after 5 minutes',
                taskId,
                status: 'timeout',
              }
            } catch (error) {
              console.error('Research task creation error:', error)
              return {
                topic,
                analysisDepth,
                error: `Research unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
                status: 'failed',
              }
            }
          },
        }),

        summarizeDocument: tool({
          description: 'Create a comprehensive summary of an uploaded document',
          inputSchema: documentToolParamsSchema,
          execute: async (params) => executeDocumentAction('summarize', params),
        }),

        extractTopics: tool({
          description: 'Extract key topics from an uploaded document',
          inputSchema: documentToolParamsSchema,
          execute: async (params) => executeDocumentAction('extractTopics', params),
        }),

        analyzeSentiment: tool({
          description: 'Analyze sentiment, tone, and perspective of an uploaded document',
          inputSchema: documentToolParamsSchema,
          execute: async (params) => executeDocumentAction('analyzeSentiment', params),
        }),

        findConnections: tool({
          description: 'Find connections between document content and known UFO/UAP entities',
          inputSchema: documentToolParamsSchema,
          execute: async (params) => executeDocumentAction('findConnections', params),
        }),

        findInsights: tool({
          description: 'Identify hidden insights and patterns in an uploaded document',
          inputSchema: documentToolParamsSchema,
          execute: async (params) => executeDocumentAction('findInsights', params),
        }),

        generateTags: tool({
          description: 'Generate structured classification tags for an uploaded document',
          inputSchema: documentToolParamsSchema,
          execute: async (params) => executeDocumentAction('generateTags', params),
        }),

        // Search the Neon Postgres database (FTS + pgvector semantic search in parallel)
        searchNeonDatabase: tool({
          description: DATABASE_SEARCH_DESCRIPTION,
          inputSchema: databaseSearchInputSchema,
          execute: async (input) => {
            try {
              const {query, table, results, embeddingUsed} = await executeDatabaseSearch(input)
              return {
                query,
                table: table ?? 'all',
                results: results.map((r) => ({
                  id: r.id ?? r.xata_id,
                  table: (r as any)._table ?? table,
                  name: (r as any).name ?? (r as any).title ?? null,
                  description:
                    (r as any).description ?? (r as any).summary ?? (r as any).bio ?? null,
                  score: (r.xata as any)?.score ?? 0,
                  searchMethod: (r.xataReasoning as any)?.highlightReasons ?? 'FTS',
                })),
                totalResults: results.length,
                embeddingUsed,
              }
            } catch (error) {
              console.error('Neon database search error:', error)
              return {
                query: input.query,
                results: [],
                totalResults: 0,
                error: `Database search unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
              }
            }
          },
        }),

        // Include frontend tools if provided
        ...(frontendToolsConfig ? frontendTools(frontendToolsConfig) : {}),
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500}
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
  })
}
