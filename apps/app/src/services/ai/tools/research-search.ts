import Exa from 'exa-js'
import {z} from 'zod'
import {searchDatabase} from '@db/postgres'
import {embedQuery} from '@/services/ai/openai/embed-query'

export const TRUSTED_UAP_DOMAINS = [
  'mufon.com',
  'theblackvault.com',
  'openminds.tv',
  'nationalufocenter.com',
  'cufos.org',
  'nicap.org',
  'project1947.com',
  'ufoevidence.org',
]

export const EXCLUDED_EXTERNAL_DOMAINS = [
  'reddit.com',
  'pinterest.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'tiktok.com',
  'youtube.com',
]

export const DATABASE_SEARCH_DESCRIPTION =
  'Search the local UAP research database using full-text and semantic retrieval. Treat results as source records, not as proof.'

export const EXTERNAL_SEARCH_DESCRIPTION =
  'Search established external UAP research sources for corroboration, contradiction, and additional traces.'

export const databaseSearchInputSchema = z.object({
  query: z.string().min(1).describe('Natural-language research query'),
  table: z.string().optional().describe('Optional database table to search'),
  search_terms: z.array(z.string()).optional().describe('Specific entity names or terms'),
  search_fields: z.array(z.string()).optional().describe('Optional fields to search'),
  limit: z.number().int().min(1).max(20).optional().describe('Maximum results'),
})

export const externalSearchInputSchema = z.object({
  query: z.string().min(1).describe('External research query'),
  limit: z.number().int().min(1).max(10).optional().describe('Maximum results'),
  includeDomains: z.array(z.string()).optional().describe('Specific trusted domains'),
  type: z.enum(['neural', 'keyword']).optional().describe('Semantic or exact-match search'),
  livecrawl: z.enum(['always', 'fallback', 'never']).optional().describe('Live crawling policy'),
})

export const databaseSearchJsonSchema = {
  type: 'object',
  properties: {
    query: {type: 'string', description: 'Natural-language research query'},
    table: {type: 'string', description: 'Optional database table to search'},
    search_terms: {
      type: 'array',
      items: {type: 'string'},
      description: 'Specific entity names or terms',
    },
    search_fields: {
      type: 'array',
      items: {type: 'string'},
      description: 'Optional fields to search',
    },
    limit: {type: 'number', minimum: 1, maximum: 20, description: 'Maximum results'},
  },
  required: ['query'],
} as const

export const externalSearchJsonSchema = {
  type: 'object',
  properties: {
    query: {type: 'string', description: 'External research query'},
    limit: {type: 'number', minimum: 1, maximum: 10, description: 'Maximum results'},
    includeDomains: {
      type: 'array',
      items: {type: 'string'},
      description: 'Specific trusted domains',
    },
    type: {type: 'string', enum: ['neural', 'keyword'], description: 'Search type'},
    livecrawl: {
      type: 'string',
      enum: ['always', 'fallback', 'never'],
      description: 'Live crawling policy',
    },
  },
  required: ['query'],
} as const

export async function executeDatabaseSearch(input: z.infer<typeof databaseSearchInputSchema>) {
  const query = input.query.trim()
  const searchTerms = (input.search_terms || []).map((term) => term.trim()).filter(Boolean)
  const embedding = await embedQuery(query)
  const results = await searchDatabase({
    table: input.table,
    searchTerms: searchTerms.length ? searchTerms : [query],
    searchFields: input.search_fields,
    embedding: embedding.length ? embedding : undefined,
    limit: input.limit ?? 6,
  })

  return {
    query,
    table: input.table ?? 'all',
    results,
    totalResults: results.length,
    embeddingUsed: embedding.length > 0,
  }
}

export async function executeExternalSearch(input: z.infer<typeof externalSearchInputSchema>) {
  if (!process.env.EXA_API_KEY) throw new Error('EXA_API_KEY is not configured')

  const client = new Exa(process.env.EXA_API_KEY)
  const results = await client.searchAndContents({
    query: input.query,
    numResults: Math.min(input.limit ?? 5, 10),
    type: input.type ?? 'neural',
    includeDomains: input.includeDomains ?? TRUSTED_UAP_DOMAINS,
    excludeDomains: EXCLUDED_EXTERNAL_DOMAINS,
    livecrawl: input.livecrawl ?? 'fallback',
    contents: {text: {maxCharacters: 6000}},
  })

  return {
    query: input.query,
    results: results.results || [],
    totalResults: results.results?.length ?? 0,
  }
}
