/**
 * Drop-to-Canvas (T-060) — the client's copy of the shared API contract.
 *
 * Source of truth: `docs/plans/2026-08-13-canvas-drop-ingest-contract.md`.
 * This module mirrors §3 (request limits), §4 (response shape) and §5 (error
 * taxonomy) exactly. If a field here disagrees with that document, the
 * document wins and this file is the bug — do not "fix" it by inventing a
 * field locally (contract §7, shared seam).
 */

/** Contract §3 — max upload size. Enforced client-side AND server-side. */
export const DROP_MAX_BYTES = 10 * 1024 * 1024

/**
 * Contract §3 — accepted MIME allowlist. `text/*` is a prefix rule, the rest
 * are exact matches, which is why this is split into two constants rather
 * than one flat list.
 */
export const DROP_ACCEPTED_MIME_EXACT = [
  'application/pdf',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/webp',
] as const

export const DROP_ACCEPTED_MIME_PREFIXES = ['text/'] as const

/** `accept` attribute for the click-to-choose fallback input. */
export const DROP_ACCEPT_ATTR = 'text/*,application/pdf,application/json,image/png,image/jpeg,image/webp'

/** Contract §4 — how the embedded text was obtained. */
export type DropDerivedVia = 'utf8' | 'pdf-parse' | 'vision-caption'

/** Contract §4 — coarse artifact classification, drives the node's icon. */
export type DropKind = 'text' | 'pdf' | 'image'

/** Contract §5 — the closed set of server error codes. */
export type DropErrorCode =
  | 'TOO_LARGE'
  | 'UNSUPPORTED_TYPE'
  | 'EXTRACT_FAILED'
  | 'EMBED_FAILED'
  | 'SEARCH_FAILED'

/**
 * Client-only failure codes. These are NOT in contract §5 because they never
 * come from the route — they describe failures that happen before or around
 * the request (offline, Clerk redirect, non-JSON body). Kept in a separate
 * union so nobody mistakes them for server contract surface.
 */
export type DropClientErrorCode = 'NETWORK_FAILED' | 'UNAUTHENTICATED' | 'BAD_RESPONSE'

export type DropFailureCode = DropErrorCode | DropClientErrorCode

/** Contract §5 error body. */
export interface DropError {
  error: string
  code: DropErrorCode
}

/** Contract §4 — a single corpus record the artifact resembles. */
export interface DropMatch {
  /** Corpus table, e.g. 'documents' | 'sightings' | 'people' | 'document_chunks'. */
  table: string
  id: string
  title: string
  snippet: string
  /**
   * `_rrfScore` — a Reciprocal Rank Fusion RANK-AGREEMENT number. NOT a
   * cosine similarity, NOT a probability, NOT a percentage. It is used
   * ONLY to order matches and to derive relative visual weight from that
   * ordering. It is never rendered, in any form, in user-facing text
   * (UX_LANGUAGE_GUIDE §6.6: scores never appear in UI copy).
   */
  score: number
  url: string | null
}

/** Contract §4 — the dropped file as the route saw it. */
export interface DropArtifact {
  /** Session-scoped UUID minted by the route. NOT a database id. */
  id: string
  filename: string
  mime: string
  bytes: number
  kind: DropKind
  blobUrl: string | null
  derivedVia: DropDerivedVia
  extractedChars: number
  excerpt: string
}

/** Contract §4 — `200 OK` body. */
export interface DropResponse {
  artifact: DropArtifact
  matches: DropMatch[]
  meta: {
    embeddingModel: 'text-embedding-3-small'
    dims: 1536
    tablesSearched: string[]
    tookMs: number
    truncated: boolean
  }
}

export const DROP_ENDPOINT = '/api/processing/drop'

/**
 * Human-readable, honest copy for each failure. Clinical register, no
 * exclamation, no blame, and each one says what the user can actually do
 * next (UX_LANGUAGE_GUIDE §6: clinical, never campy, no enterprise filler).
 */
export const DROP_FAILURE_COPY: Record<DropFailureCode, {title: string; detail: string}> = {
  TOO_LARGE: {
    title: 'File exceeds the 10 MB limit',
    detail: 'Extraction runs in a single request. Split the file or drop a smaller excerpt.',
  },
  UNSUPPORTED_TYPE: {
    title: 'That file type cannot be read',
    detail: 'Accepted: plain text, PDF, JSON, and PNG / JPEG / WebP images.',
  },
  EXTRACT_FAILED: {
    title: 'No readable text could be extracted',
    detail: 'The file was received but yielded no usable text — a scanned page or an empty document behaves this way.',
  },
  EMBED_FAILED: {
    title: 'The file could not be embedded',
    detail: 'The embedding service did not respond. The corpus was not queried.',
  },
  SEARCH_FAILED: {
    title: 'The corpus could not be queried',
    detail: 'The file was read and embedded, but the archive search failed. Nothing was written.',
  },
  NETWORK_FAILED: {
    title: 'The request did not complete',
    detail: 'The connection dropped before a response arrived. Nothing was written to the archive.',
  },
  UNAUTHENTICATED: {
    title: 'Sign-in required to read a dropped file',
    detail: 'The ingest endpoint is session-gated. The canvas itself remains open.',
  },
  BAD_RESPONSE: {
    title: 'The response could not be read',
    detail: 'The server replied in an unexpected format. This is a defect, not a limit — nothing was written.',
  },
}

/**
 * Client-side pre-flight against contract §3. Returns the same codes the
 * route would return, so the UI has ONE failure vocabulary regardless of
 * where the rejection happened. Doing this before the POST avoids sending a
 * 10 MB body just to be told it is 10 MB.
 */
export function validateDropFile(file: {name: string; size: number; type: string}): DropErrorCode | null {
  if (file.size > DROP_MAX_BYTES) return 'TOO_LARGE'
  if (!isAcceptedMime(file.type, file.name)) return 'UNSUPPORTED_TYPE'
  return null
}

/**
 * MIME check with a filename fallback: the OS reports an empty `type` for
 * some drags (and for extensionless files), in which case rejecting on MIME
 * alone would refuse legitimate .txt/.md drops. The server re-validates
 * regardless, so a permissive fallback here cannot widen what is accepted.
 */
export function isAcceptedMime(mime: string, filename?: string): boolean {
  const normalized = (mime || '').toLowerCase().split(';')[0].trim()

  if (normalized) {
    if (DROP_ACCEPTED_MIME_PREFIXES.some((p) => normalized.startsWith(p))) return true
    return (DROP_ACCEPTED_MIME_EXACT as readonly string[]).includes(normalized)
  }

  if (!filename) return false
  const ext = filename.toLowerCase().split('.').pop() ?? ''
  return ['txt', 'md', 'markdown', 'csv', 'json', 'pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext)
}

/** Contract §4 `kind`, derived locally for optimistic pre-response display. */
export function inferDropKind(mime: string, filename: string): DropKind {
  const normalized = (mime || '').toLowerCase()
  if (normalized.startsWith('image/')) return 'image'
  if (normalized === 'application/pdf') return 'pdf'
  const ext = filename.toLowerCase().split('.').pop() ?? ''
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  return 'text'
}

/** Byte count for display. Sizes are file facts, not scores — safe to render. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
