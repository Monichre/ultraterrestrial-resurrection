/**
 * Drop-to-Canvas (T-060) — shared types and limits for POST /api/processing/drop.
 *
 * These mirror `docs/plans/2026-08-13-canvas-drop-ingest-contract.md` §3–§5,
 * which is the fixed seam between the server half and the canvas half. Field
 * names here are contract surface: renaming one is a contract change, not a
 * refactor.
 */

export type DropKind = 'text' | 'pdf' | 'image'
export type DropDerivedVia = 'utf8' | 'pdf-parse' | 'vision-caption'

export interface DropArtifact {
  /** Session-scoped UUID minted by the route. NOT a database id — the drop
   *  path never writes to Postgres (contract §2.1). */
  id: string
  filename: string
  mime: string
  bytes: number
  kind: DropKind
  /** @vercel/blob URL, or null when blob storage is unconfigured/unreachable. */
  blobUrl: string | null
  /** How the embedded text was obtained. 'vision-caption' means the user is
   *  seeing connections to a *description* of their image, not the image. */
  derivedVia: DropDerivedVia
  extractedChars: number
  /** First ~500 chars of extracted text, for display on the node. */
  excerpt: string
}

export interface DropMatch {
  /** Corpus table the record lives in, e.g. 'documents', 'people',
   *  'document_chunks'. */
  table: string
  id: string
  /** For `document_chunks` this is the PARENT document's title — search.ts
   *  LEFT JOINs `documents` and returns it as `document_title`. */
  title: string
  /** The text that matched, for edge tooltips and the inspector. */
  snippet: string
  /** `_rrfScore` from searchDatabase. Reciprocal Rank Fusion — a
   *  RANK-AGREEMENT number, not a cosine similarity and not a percentage. */
  score: number
  url: string | null
}

export interface DropMeta {
  embeddingModel: 'text-embedding-3-small'
  dims: 1536
  /** Which corpus tables actually returned candidates — derived from the
   *  result rows, not from the VECTOR_TABLES constant. */
  tablesSearched: string[]
  tookMs: number
  /** True when extraction exceeded the 8,000-char embed window. */
  truncated: boolean
}

export interface DropResponse {
  artifact: DropArtifact
  matches: DropMatch[]
  meta: DropMeta
}

export type DropErrorCode =
  | 'TOO_LARGE'
  | 'UNSUPPORTED_TYPE'
  | 'EXTRACT_FAILED'
  | 'EMBED_FAILED'
  | 'SEARCH_FAILED'

export interface DropError {
  /** Human-readable, safe to display. */
  error: string
  code: DropErrorCode
}

/** Contract §3. 10 MB. */
export const MAX_DROP_BYTES = 10 * 1024 * 1024

/** Contract §3 — one document-level embedding over the first 8,000 chars. */
export const EMBED_CHAR_LIMIT = 8_000

/** Contract §4 — excerpt shown on the artifact node. */
export const EXCERPT_CHARS = 500

/** Contract §4 — default fan-out width. */
export const DEFAULT_MATCH_LIMIT = 12

/** Exact MIME types accepted beyond the `text/*` prefix rule (contract §3). */
export const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/webp',
])

export function isAcceptedMime(mime: string): boolean {
  const normalized = mime.split(';')[0].trim().toLowerCase()
  return normalized.startsWith('text/') || ACCEPTED_MIME_TYPES.has(normalized)
}

export function kindForMime(mime: string): DropKind {
  const normalized = mime.split(';')[0].trim().toLowerCase()
  if (normalized === 'application/pdf') return 'pdf'
  if (normalized.startsWith('image/')) return 'image'
  return 'text'
}
