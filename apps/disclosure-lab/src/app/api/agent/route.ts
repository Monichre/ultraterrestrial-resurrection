import { openai } from '@ai-sdk/openai'
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from 'ai'
import { z } from 'zod'
import {
  describeSchema,
  getRecord,
  listRecords,
  listTables,
  runAggregate,
  runSearch,
  runSqlRead,
} from '@/lib/lab-tools'
import { ensureDbEnv } from '@/lib/db'

ensureDbEnv()

export const maxDuration = 60

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: UIMessage[]
    selection?: { table: string; id: string; title?: string } | null
  }

  const selectionHint = body.selection
    ? `Current operator selection context: table=${body.selection.table} id=${body.selection.id} title=${body.selection.title ?? ''}. Prefer tools scoped to this record when relevant.`
    : 'No record is currently selected in the tables pane.'

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-4.1-mini'),
    system: `You are the Disclosure Lab assistant — a read-only Neon Postgres analyst for the Ultraterrestrial corpus.
You help the human operator inspect schema, search records, run read-only SQL, and summarize aggregates.
You MUST NOT mutate data. You have no write tools. If asked to write/delete, explain that only the human GUI can INSERT/UPDATE (DELETE is blocked in v1).
${selectionHint}
Be concise and factual. Prefer tool results over speculation.`,
    messages: await convertToModelMessages(body.messages),
    stopWhen: stepCountIs(8),
    tools: {
      listTables: tool({
        description: 'List entity and writable tables',
        inputSchema: z.object({}),
        execute: async () => listTables(),
      }),
      describeSchema: tool({
        description: 'Describe columns for a table, or list all public tables',
        inputSchema: z.object({ table: z.string().optional() }),
        execute: async ({ table }) => describeSchema(table),
      }),
      searchDatabase: tool({
        description: 'FTS/vector search over Neon entity tables',
        inputSchema: z.object({
          query: z.string(),
          table: z.string().optional(),
          limit: z.number().optional(),
        }),
        execute: async ({ query, table, limit }) => runSearch(query, table, limit ?? 15),
      }),
      runSqlRead: tool({
        description: 'Run read-only SQL (SELECT/WITH/EXPLAIN only)',
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => runSqlRead(query),
      }),
      listRecords: tool({
        description: 'Paginated rows from a table',
        inputSchema: z.object({
          table: z.string(),
          size: z.number().optional(),
          offset: z.number().optional(),
        }),
        execute: async ({ table, size, offset }) =>
          listRecords(table, size ?? 25, offset ?? 0),
      }),
      getRecord: tool({
        description: 'Fetch one row by id',
        inputSchema: z.object({ table: z.string(), id: z.string() }),
        execute: async ({ table, id }) => getRecord(table, id),
      }),
      aggregate: tool({
        description: 'Table counts, embedding coverage, events-by-year',
        inputSchema: z.object({}),
        execute: async () => runAggregate(),
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
