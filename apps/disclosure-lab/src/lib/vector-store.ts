import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'dotenv'
import OpenAI from 'openai'
import { LAB_ROOT, REPO_ROOT } from './paths'

export const VECTOR_FETCH_MAX_CHARS = 20_000

export type VectorStoreSearchHit = {
  id: string
  title: string
  url: string
}

const OPENAI_ENV_FILES = [
  path.join(REPO_ROOT, '.env'),
  path.join(REPO_ROOT, '.env.local'),
  path.join(REPO_ROOT, 'apps/app/.env.local'),
  path.join(LAB_ROOT, '.env.local'),
]

function cleanOpenAiId(raw: string | undefined): string {
  if (!raw) return ''
  return raw.trim().split(/\s+/)[0].split('#')[0].trim()
}

function readEnvFile(file: string): Record<string, string> {
  if (!existsSync(file)) return {}
  return parse(readFileSync(file))
}

function firstEnv(names: string[]): string {
  for (const file of OPENAI_ENV_FILES) {
    const parsed = readEnvFile(file)
    for (const name of names) {
      const value = cleanOpenAiId(parsed[name])
      if (value) return value
    }
  }
  for (const name of names) {
    const value = cleanOpenAiId(process.env[name])
    if (value) return value
  }
  return ''
}

export function resolveVectorStoreId(): string {
  return firstEnv(['OPENAI_VECTOR_STORE_ID', 'VECTOR_STORE_ID'])
}

function citationUrl(fileId: string) {
  return `https://platform.openai.com/storage/files/${fileId}`
}

function getClient() {
  const apiKey = firstEnv(['OPENAI_API_KEY'])
  if (!apiKey) throw new Error('OPENAI_API_KEY is required for vector-store search')
  const storeId = resolveVectorStoreId()
  if (!storeId) throw new Error('OPENAI_VECTOR_STORE_ID is required for vector-store search')
  return { client: new OpenAI({ apiKey }), storeId }
}

export async function vectorStoreMeta() {
  const { client, storeId } = getClient()
  const store = await client.vectorStores.retrieve(storeId)
  return {
    idSuffix: storeId.slice(-8),
    name: store.name,
    status: store.status,
    fileCounts: store.file_counts,
  }
}

/** Same contract as packages/openai-vector-store-mcp `search`. Dedupes duplicate file_ids. */
export async function searchVectorStore(query: string): Promise<{ results: VectorStoreSearchHit[] }> {
  if (!query.trim()) return { results: [] }
  const { client, storeId } = getClient()
  const response = await client.vectorStores.search(storeId, { query })
  const seen = new Set<string>()
  const results: VectorStoreSearchHit[] = []

  for (const [index, item] of (response.data ?? []).entries()) {
    const id = item.file_id || `vs_${index}`
    if (seen.has(id)) continue
    seen.add(id)
    results.push({
      id,
      title: item.filename || `Document ${index + 1}`,
      url: citationUrl(id),
    })
  }

  return { results }
}

/** Same contract as packages/openai-vector-store-mcp `fetch`. */
export async function fetchVectorStoreFile(id: string, maxChars = VECTOR_FETCH_MAX_CHARS) {
  const fileId = id.trim()
  if (!fileId) throw new Error('Document ID is required')

  const { client, storeId } = getClient()
  const [contentResponse, fileInfo, fileMeta] = await Promise.all([
    client.vectorStores.files.content(fileId, { vector_store_id: storeId }),
    client.vectorStores.files.retrieve(fileId, { vector_store_id: storeId }),
    client.files.retrieve(fileId),
  ])

  const parts: string[] = []
  for (const item of contentResponse.data ?? []) {
    if (item.text) parts.push(item.text)
  }

  const fullText = parts.join('\n') || 'No content available'
  const truncated = fullText.length > maxChars
  const attributes = fileInfo.attributes

  return {
    id: fileId,
    title: fileMeta.filename || `Document ${fileId}`,
    text: truncated ? fullText.slice(0, maxChars) : fullText,
    url: citationUrl(fileId),
    metadata: attributes && Object.keys(attributes).length > 0 ? attributes : null,
    truncated,
    charCount: fullText.length,
  }
}
