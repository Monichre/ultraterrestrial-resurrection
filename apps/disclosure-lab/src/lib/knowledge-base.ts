import { promises as fs } from 'node:fs'
import path from 'node:path'
import { KB_INDEX_PATH, KB_ROOT } from './paths'

type KnowledgeBaseFileRef = {
  name: string
  path: string
  size: number
  type: string
}

type KnowledgeBaseDocument = {
  title: string
  doc_type: string
  path: string
  source?: string
  youtube_id?: string
  created_at: string
  updated_at: string
  tags: string[]
  files?: KnowledgeBaseFileRef[]
  metadata?: {
    original_path?: string
    [key: string]: unknown
  }
}

type KnowledgeBaseIndex = {
  documents: Record<string, KnowledgeBaseDocument>
  tags: Record<string, string[]>
  last_updated: string
}

export const TEXT_PREVIEW_MAX_BYTES = 50_000
const TEXT_EXTS = new Set(['.md', '.txt', '.json', '.html', '.htm', '.vtt', '.csv', '.xml'])

type CachedIndex = {
  mtimeMs: number
  index: KnowledgeBaseIndex
}

let cache: CachedIndex | null = null

export type KnowledgeBaseHit = {
  id: string
  title: string
  docType: string
  path: string
  tags: string[]
  source?: string
  originalPath?: string
}

async function loadIndex(): Promise<KnowledgeBaseIndex> {
  const stat = await fs.stat(KB_INDEX_PATH)
  if (cache && cache.mtimeMs === stat.mtimeMs) return cache.index
  const raw = await fs.readFile(KB_INDEX_PATH, 'utf8')
  const index = JSON.parse(raw) as KnowledgeBaseIndex
  cache = { mtimeMs: stat.mtimeMs, index }
  return index
}

export async function knowledgeBaseStats() {
  const index = await loadIndex()
  const byType: Record<string, number> = {}
  for (const doc of Object.values(index.documents)) {
    const type = doc.doc_type || 'unknown'
    byType[type] = (byType[type] ?? 0) + 1
  }
  return {
    root: 'packages/knowledge-base',
    documentCount: Object.keys(index.documents).length,
    tagCount: Object.keys(index.tags ?? {}).length,
    lastUpdated: index.last_updated,
    byType,
  }
}

export async function searchKnowledgeBase(query: string, limit = 25): Promise<KnowledgeBaseHit[]> {
  const index = await loadIndex()
  const needle = query.trim().toLowerCase()
  const hits: KnowledgeBaseHit[] = []

  for (const [id, doc] of Object.entries(index.documents)) {
    const haystack = [
      doc.title,
      doc.doc_type,
      doc.path,
      doc.source,
      doc.youtube_id,
      doc.metadata?.original_path,
      ...(doc.tags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    if (needle && !haystack.includes(needle)) continue
    hits.push(toHit(id, doc))
    if (hits.length >= limit) break
  }

  return hits
}

export async function getKnowledgeBaseDocument(id: string) {
  const index = await loadIndex()
  const doc = index.documents[id]
  if (!doc) return null

  const previewPath = pickPreviewPath(doc)
  const preview = previewPath ? await readPreview(previewPath) : null

  return {
    id,
    ...toHit(id, doc),
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    youtubeId: doc.youtube_id ?? null,
    files: (doc.files ?? []).map((file) => ({
      name: file.name,
      path: file.path,
      size: file.size,
      type: file.type,
    })),
    metadata: doc.metadata ?? {},
    preview,
  }
}

function toHit(id: string, doc: KnowledgeBaseDocument): KnowledgeBaseHit {
  return {
    id,
    title: doc.title,
    docType: doc.doc_type,
    path: doc.path,
    tags: doc.tags ?? [],
    source: doc.source,
    originalPath: typeof doc.metadata?.original_path === 'string' ? doc.metadata.original_path : undefined,
  }
}

function pickPreviewPath(doc: KnowledgeBaseDocument): string | null {
  const original = doc.metadata?.original_path
  if (typeof original === 'string' && isTextPath(original)) return original

  const files = doc.files ?? []
  const preferred = files.find((file) => {
    const name = file.name.toLowerCase()
    return isTextPath(file.path) && !name.includes('_metadata') && !name.includes('_rag_pipeline')
  })
  if (preferred) return preferred.path

  const anyText = files.find((file) => isTextPath(file.path))
  return anyText?.path ?? null
}

function isTextPath(relPath: string) {
  return TEXT_EXTS.has(path.extname(relPath).toLowerCase())
}

async function readPreview(relPath: string) {
  const abs = resolveKbFile(relPath)
  if (!abs) {
    return { path: relPath, error: 'path escapes knowledge-base root', text: null, truncated: false }
  }

  try {
    const stat = await fs.stat(abs)
    if (!stat.isFile()) {
      return { path: relPath, error: 'not a file', text: null, truncated: false }
    }
    const handle = await fs.open(abs, 'r')
    try {
      const size = Math.min(stat.size, TEXT_PREVIEW_MAX_BYTES)
      const buf = Buffer.alloc(size)
      const { bytesRead } = await handle.read(buf, 0, size, 0)
      return {
        path: relPath,
        bytes: stat.size,
        truncated: stat.size > TEXT_PREVIEW_MAX_BYTES,
        text: buf.subarray(0, bytesRead).toString('utf8'),
        error: null,
      }
    } finally {
      await handle.close()
    }
  } catch (err) {
    return { path: relPath, error: String(err), text: null, truncated: false }
  }
}

function resolveKbFile(relPath: string): string | null {
  const normalized = path.normalize(relPath).replace(/^(\.\.[/\\])+/, '')
  const abs = path.resolve(KB_ROOT, normalized)
  const root = path.resolve(KB_ROOT) + path.sep
  if (!abs.startsWith(root) && abs !== path.resolve(KB_ROOT)) return null
  return abs
}
