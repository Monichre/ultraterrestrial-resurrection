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
import { getKnowledgeBaseDocument, searchKnowledgeBase } from '@/lib/knowledge-base'
import { fetchVectorStoreFile, searchVectorStore } from '@/lib/vector-store'
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
    system: `You are the Disclosure Lab assistant — a read-only analyst over three retrieval surfaces:
1. Neon Postgres entity tables (schema, SQL, FTS/pgvector)
2. Local knowledge-base archive (packages/knowledge-base metadata/index.json + source files)
3. OpenAI Vector Store (same search/fetch contract as openai-vector-store-mcp; this is what Prometheus file_search sees)

You MUST NOT mutate data. You have no write tools. If asked to write/delete, explain that only the human GUI can INSERT/UPDATE (DELETE is blocked in v1).
When checking whether a source exists, search knowledge-base AND vector-store — they can diverge.
One vector-store search, then fetch only the top hit unless corroboration needs more. Fetch text may be truncated.
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
      searchKnowledgeBase: tool({
        description: 'Search the local knowledge-base archive (titles, tags, paths). Disk corpus, not Neon.',
        inputSchema: z.object({
          query: z.string(),
          limit: z.number().optional(),
        }),
        execute: async ({ query, limit }) => searchKnowledgeBase(query, limit ?? 20),
      }),
      getKnowledgeBaseDocument: tool({
        description: 'Fetch one knowledge-base document by id, including a text preview when the source is readable',
        inputSchema: z.object({ id: z.string() }),
        execute: async ({ id }) => getKnowledgeBaseDocument(id),
      }),
      searchVectorStore: tool({
        description: 'Search the OpenAI Vector Store (same surface as openai-vector-store-mcp search / Prometheus file_search)',
        inputSchema: z.object({ query: z.string() }),
        execute: async ({ query }) => searchVectorStore(query),
      }),
      fetchVectorStoreFile: tool({
        description: 'Fetch full text of a vector-store file by id returned from searchVectorStore',
        inputSchema: z.object({ id: z.string() }),
        execute: async ({ id }) => fetchVectorStoreFile(id, 12_000),
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
