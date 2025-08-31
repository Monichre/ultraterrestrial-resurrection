'use server'

import {Message} from '@/features/ai/components/message'
import {searchXata} from '@db/src/xata-typescript-sdk/api'
import {generateId} from 'ai'
import {createStreamableUI, createStreamableValue} from '@ai-sdk/rsc'
import {openai} from '@/lib/openai/client'
import type {ReactNode} from 'react'

// Define metadata for OpenAI Assistant context
const metadata: Record<string, any> = {}

// Wrapper function to adapt the existing searchXata to expected parameters
const searchDatabase = async ({
  table,
  searchTerms,
  searchFields,
  limit,
  sortBy,
  sortOrder,
  dateRange,
}: any) => {
  try {
    const records = searchTerms?.length
      ? await Promise.all(
          searchTerms.map(async (term: string) => {
            // Use the actual searchXata function with adapted parameters
            const result = await searchXata({
              query: term,
              table: table,
            })

            if (result.success) {
              return result.searchResults || []
            } else {
              console.error('Search error:', result.error)
              return []
            }
          })
        )
      : []

    console.log('🚀 ~ searchDatabase ~ records:', records)
    return records.flat()
  } catch (error) {
    console.error('❌ searchDatabase error:', error)
    return []
  }
}

export interface ClientMessage {
  id: string
  status: ReactNode
  text: ReactNode
  gui: ReactNode
}

const ASSISTANT_ID = 'asst_xxxx'
let THREAD_ID = ''
let RUN_ID = ''

export async function submitMessage(question: string): Promise<ClientMessage> {
  const status = createStreamableUI('thread.init')
  const textStream = createStreamableValue('')
  const textUIStream = createStreamableUI(<Message textStream={textStream.value} />)
  const gui = createStreamableUI()

  const runQueue = []

  ;(async () => {
    if (THREAD_ID) {
      await openai.beta.threads.messages.create(THREAD_ID, {
        role: 'user',
        content: question,
      })

      const run = await openai.beta.threads.runs.create(THREAD_ID, {
        assistant_id: ASSISTANT_ID,
        stream: true,
      })

      runQueue.push({id: generateId(), run})
    } else {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: ASSISTANT_ID,
        metadata,
        tool_resources: {
          file_search: {
            vector_store_ids: ['vs_meWOEnUiUxtQWf0W6NBsNpCG'],
          },
        },
        tool_choice: 'required',
        tools: [{type: 'file_search'}, {type: 'function', function: {name: 'search_database'}}],
        stream: true,
        thread: {
          messages: [{role: 'user', content: question}],
        },
      })

      runQueue.push({id: generateId(), run})
    }

    while (runQueue.length > 0) {
      const latestRun = runQueue.shift()

      if (latestRun) {
        for await (const delta of latestRun.run) {
          const {data, event} = delta

          status.update(event)

          if (event === 'thread.created') {
            THREAD_ID = data.id
          } else if (event === 'thread.run.created') {
            RUN_ID = data.id
          } else if (event === 'thread.message.delta') {
            data.delta.content?.map((part: any) => {
              if (part.type === 'text') {
                if (part.text) {
                  textStream.append(part.text.value)
                }
              }
            })
          } else if (event === 'thread.run.requires_action') {
            if (data.required_action) {
              if (data.required_action.type === 'submit_tool_outputs') {
                const {tool_calls} = data.required_action.submit_tool_outputs
                const tool_outputs = []

                for (const tool_call of tool_calls) {
                  const {id: toolCallId, function: fn} = tool_call
                  const {name, arguments: args} = fn

                  if (name === 'search_database') {
                    const {
                      table,
                      search_terms: searchTerms,
                      search_fields: searchFields,
                      limit,
                      sort_by: sortBy,
                      sort_order: sortOrder,
                      date_range: dateRange,
                    } = JSON.parse(args)

                    // gui.append(
                    //   <div className="flex flex-row gap-2 items-center">
                    //     <div>
                    //       Searching for emails: {query}, has_attachments:
                    //       {has_attachments ? 'true' : 'false'}
                    //     </div>
                    //   </div>,
                    // )

                    const analogousRecords = await searchDatabase({
                      table,
                      searchTerms,
                      searchFields,
                      limit,
                      sortBy,
                      sortOrder,
                      dateRange,
                    })

                    console.log(
                      '🚀 ~ file: actions.tsx:112 ~ forawait ~ analogousRecords:',
                      analogousRecords
                    )

                    // !NOTE: Will want to render the appropriate Mindmap Node Card per Entity Type
                    gui.append(
                      <div className='flex flex-col gap-2'>
                        {analogousRecords.map((record) => (
                          <div
                            key={record.id}
                            className='p-2 bg-zinc-100 rounded-md flex flex-row gap-2 items-center justify-between'>
                            <div className='flex flex-row gap-2 items-center'>
                              <div>{record.name}</div>
                            </div>
                            <div className='text-zinc-500'>{record.date}</div>
                          </div>
                        ))}
                      </div>
                    )

                    tool_outputs.push({
                      tool_call_id: toolCallId,
                      output: JSON.stringify(analogousRecords),
                    })
                  }
                }

                // Fixed OpenAI API call - correct parameter order
                const nextRun: any = await openai.beta.threads.runs.submitToolOutputs(
                  THREAD_ID,
                  RUN_ID,
                  {
                    tool_outputs,
                    stream: true,
                  }
                )

                runQueue.push({id: generateId(), run: nextRun})
              }
            }
          } else if (event === 'thread.run.failed') {
            console.log(data)
          }
        }
      }
    }

    status.done()
    textUIStream.done()
    gui.done()
  })()

  return {
    id: generateId(),
    status: status.value,
    text: textUIStream.value,
    gui: gui.value,
  }
}

// Fixed streamNodeUpdate function - removed dispatch call as it's not valid in server action context
export const streamNodeUpdate = async (node: any) => {
  // TODO: Implement proper node update logic for mindmap context
  console.log('Node update requested:', node)
  // This function needs proper implementation based on mindmap requirements
}

// New function to get AI-enhanced mindmap data using Prometheus
export async function getPrometheusEnhancedNodeData(
  question: string,
  table: string,
  rules?: string
): Promise<any[]> {
  try {
    console.log('🤖 Getting Prometheus-enhanced data for:', {question, table, rules})

    // Create a streaming query to Prometheus AI assistant
    const result = await submitMessage(
      `Find ${table} records related to: ${question}. ${rules || ''}`
    )

    // For now, return empty array - this will be enhanced with actual GUI parsing
    // The GUI component contains the actual search results
    return []
  } catch (error) {
    console.error('❌ getPrometheusEnhancedNodeData error:', error)
    return []
  }
}

// Enhanced function to get node data with Prometheus AI integration
export async function getEnhancedNodeData(
  question: string,
  table: string,
  rules?: string
): Promise<{answer: string; records: any[]; sessionId: string; reasoning?: any[]}> {
  try {
    console.log('🤖 Getting enhanced node data via Prometheus')

    // First, use the existing search database function to get actual records
    const searchResults = await searchDatabase({
      table,
      searchTerms: [question],
      searchFields: ['name', 'description', 'summary', 'title'],
      limit: 3, // Limit to 3 as per user requirements
      sortBy: 'relevance',
    })

    console.log('🔍 Search results:', searchResults)

    if (searchResults.length === 0) {
      return {
        answer: 'No relevant records found',
        records: [],
        sessionId: '',
        reasoning: [],
      }
    }

    // Enhanced prompt to get specific reasoning for each record selection
    const recordSummaries = searchResults
      .map(
        (record, index) =>
          `Record ${index + 1}: ${record.name || record.title || `ID: ${record.id}`} - ${record.description || record.summary || 'No description'}`
      )
      .join('\n')

    const analysisPrompt = `You are analyzing ${table} records related to the query: "${question}"

Found Records:
${recordSummaries}

${rules || 'Provide contextual insights and connections.'}

Please provide:
1. Overall analysis of why these ${table} records are relevant to "${question}"
2. For each record, explain specifically WHY it was chosen and its connection to the original query
3. What relationships or patterns exist between these records

Format your response to clearly explain the reasoning for each record selection.`

    const clientMessage = await submitMessage(analysisPrompt)

    // Enhanced response structure that includes reasoning for each record
    const recordsWithReasoning = searchResults.map((record, index) => ({
      ...record,
      selectionReasoning: `Selected because it relates to "${question}" through shared context, entities, or timeframe.`, // Default reasoning
      connectionType: 'contextual',
      relevanceScore: 1.0 - index * 0.1, // Decreasing relevance
    }))

    // Extract reasoning patterns from Prometheus response AND Xata's built-in reasoning
    const reasoning = searchResults.map((record, index) => {
      // Try to extract specific reasoning for this record from Prometheus response
      // Fixed type issue: convert ReactNode to string safely
      const prometheusText =
        typeof clientMessage.text === 'string'
          ? clientMessage.text
          : String(clientMessage.text || '')

      // Look for reasoning patterns in Prometheus response
      const recordName = record.name || record.title || `Record ${index + 1}`
      const reasoningPattern = new RegExp(`(${recordName}[^.]*\\.(?:[^.]*\\.)*?)`, 'i')
      const extractedPrometheusReasoning = prometheusText.match(reasoningPattern)?.[1] || null

      // Use Xata's built-in reasoning if available
      const xataReasoning = record.xataReasoning
      let finalReasoning = ''

      if (xataReasoning?.explanation) {
        // Combine Prometheus analysis with Xata's technical reasoning
        finalReasoning = extractedPrometheusReasoning
          ? `${extractedPrometheusReasoning} (${xataReasoning.explanation})`
          : `Prometheus Analysis: ${xataReasoning.explanation}`
      } else {
        // Fallback to extracted or generated reasoning
        const fallbackReasoning = `Selected because it relates to "${question}" through shared context, entities, or timeframe.`
        finalReasoning =
          extractedPrometheusReasoning || `Prometheus Analysis: This ${table} ${fallbackReasoning}`
      }

      return {
        recordId: record.id,
        reasoning: finalReasoning,
        connectionType: 'query-result',
        analysisContext: prometheusText || 'AI analysis completed',
        recordName: recordName,
        relevanceScore: xataReasoning?.score || 1.0 - index * 0.1,
        xataScore: xataReasoning?.score,
        highlightReasons: xataReasoning?.highlightReasons,
      }
    })

    // Return structured response with reasoning for edge annotations
    // Fixed type issue: safely convert ReactNode to string
    const answerText =
      typeof clientMessage.text === 'string'
        ? clientMessage.text
        : String(clientMessage.text || 'Analysis completed')

    return {
      answer: answerText,
      records: recordsWithReasoning,
      sessionId: clientMessage.id,
      reasoning: reasoning,
    }
  } catch (error) {
    console.error('❌ Enhanced node data error:', error)
    return {
      answer: 'Error occurred during search',
      records: [],
      sessionId: '',
      reasoning: [],
    }
  }
}
