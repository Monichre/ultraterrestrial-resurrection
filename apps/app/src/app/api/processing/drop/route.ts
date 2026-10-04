/**
 * POST /api/processing/drop — Drop-to-Canvas ingest (T-060).
 *
 * A file dropped on the research canvas is extracted to text, embedded once,
 * and fanned out against the existing corpus. The response is the artifact plus
 * ranked corpus matches; the canvas renders it as a node with edges.
 *
 * READ-ONLY against the corpus. Nothing here INSERTs into `documents`,
 * `document_chunks`, or any entity table (contract §2.1). The dropped
 * artifact's vector is session-scoped and never persisted — the only TypeScript
 * INSERT path in this repo is agent-inferences.ts:54, and corpus ingestion is
 * Python (Lane A) on top of a still-open md5-vs-sha256 dedup decision.
 * Persisting a drop into the corpus is a separate, human-confirmed action.
 *
 * The `/api/processing/*` prefix is load-bearing: `middleware.ts:9-11` gates
 * exactly that prefix with Clerk. Moving this route makes it a public,
 * unmetered file-upload endpoint that calls paid embeddings.
 *
 * Contract: docs/plans/2026-08-13-canvas-drop-ingest-contract.md
 */
import {NextResponse} from 'next/server'
import {put} from '@vercel/blob'
import {getSql, searchDatabase} from '@db/postgres'
import {embedQuery} from '@/services/ai/openai/embed-query'
import {ExtractFailedError, extractDropText} from '@/services/processing/drop/extract'
import {tablesSearched, toDropMatches} from '@/services/processing/drop/matches'
import {
  DEFAULT_MATCH_LIMIT,
  EMBED_CHAR_LIMIT,
  EXCERPT_CHARS,
  MAX_DROP_BYTES,
  isAcceptedMime,
  kindForMime,
  type DropError,
  type DropErrorCode,
  type DropResponse,
} from '@/services/processing/drop/types'

// pdfjs and the vision SDKs need Node built-ins; the edge runtime cannot host
// this route.
export const runtime = 'nodejs'
// Vision captioning walks up to four providers at 30s each in the worst case.
export const maxDuration = 120

const STATUS_FOR_CODE: Record<DropErrorCode, number> = {
  TOO_LARGE: 413,
  UNSUPPORTED_TYPE: 415,
  EXTRACT_FAILED: 422,
  EMBED_FAILED: 502,
  SEARCH_FAILED: 502,
}

function fail(code: DropErrorCode, error: string) {
  return NextResponse.json<DropError>({error, code}, {status: STATUS_FOR_CODE[code]})
}

/** Upload the raw bytes for later display. Missing or broken blob storage
 *  degrades to `blobUrl: null` — losing the preview is not a reason to fail a
 *  drop whose research value (the matches) is fully intact. */
async function uploadRaw(file: File): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null
  try {
    // addRandomSuffix because @vercel/blob v1 stores public-access blobs at a
    // guessable URL: without it, two users dropping "notes.pdf" collide and the
    // second overwrites the first's publicly reachable file.
    const blob = await put(`drops/${file.name || 'dropped-file'}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || undefined,
    })
    return blob.url
  } catch (error) {
    console.warn(
      '[drop] blob upload failed, continuing without a raw file URL:',
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now()

  // Check the declared length before touching formData(): that call buffers the
  // whole body, so a size check afterwards has already paid the cost it exists
  // to avoid.
  const declaredLength = Number(request.headers.get('content-length') ?? '')
  if (Number.isFinite(declaredLength) && declaredLength > MAX_DROP_BYTES) {
    return fail('TOO_LARGE', 'That file is larger than the 10 MB drop limit.')
  }

  let file: File
  try {
    const form = await request.formData()
    const candidate = form.get('file')
    if (!(candidate instanceof File)) {
      return fail('EXTRACT_FAILED', 'No file was included in the request.')
    }
    file = candidate
  } catch (error) {
    console.error('[drop] multipart parse failed:', error)
    return fail('EXTRACT_FAILED', 'The upload could not be read as a file.')
  }

  if (file.size > MAX_DROP_BYTES) {
    return fail('TOO_LARGE', 'That file is larger than the 10 MB drop limit.')
  }
  if (!isAcceptedMime(file.type)) {
    return fail(
      'UNSUPPORTED_TYPE',
      `${file.type || 'That file type'} cannot be read yet. Drop text, JSON, PDF, or a PNG/JPEG/WebP image.`
    )
  }

  let extraction: Awaited<ReturnType<typeof extractDropText>>
  try {
    extraction = await extractDropText(file)
  } catch (error) {
    if (error instanceof ExtractFailedError) return fail('EXTRACT_FAILED', error.message)
    console.error('[drop] extraction failed:', error)
    return fail('EXTRACT_FAILED', 'The file could not be read.')
  }

  const truncated = extraction.text.length > EMBED_CHAR_LIMIT
  const embedText = truncated ? extraction.text.slice(0, EMBED_CHAR_LIMIT) : extraction.text

  // Blob upload and embedding are independent; run them together. Both start
  // only after extraction succeeds, so a 422 never leaves a stray blob behind.
  const [embedding, blobUrl] = await Promise.all([embedQuery(embedText), uploadRaw(file)])

  // embedQuery swallows provider errors and returns [] so FTS-only callers can
  // degrade. This path has no query string to fall back to — an embedding-less
  // fan-out would search nothing — so an empty vector is a hard failure.
  if (!embedding.length) {
    return fail('EMBED_FAILED', 'The embedding service is unavailable, so this drop could not be compared to the archive.')
  }

  let rows: Record<string, unknown>[]
  try {
    // No `table`: one call fans out across every VECTOR_TABLES member via
    // vectorSearchAll and fuses with RRF (search.ts:348). Looping tables here
    // would duplicate that and lose the fusion.
    rows = await searchDatabase({embedding, limit: DEFAULT_MATCH_LIMIT})
  } catch (error) {
    console.error('[drop] corpus fan-out failed:', error)
    return fail('SEARCH_FAILED', 'The archive could not be searched just now.')
  }

  const matches = toDropMatches(rows)

  // vectorSearch swallows per-table errors and returns [] (search.ts:242), so a
  // database outage arrives here shaped exactly like "nothing resembles this
  // file" — observed 2026-08-13, a Neon `fetch failed` produced a cheerful 200
  // with matches: []. An empty result is only honest if the corpus was actually
  // reachable, so confirm that before claiming it. One trivial query, and only
  // on the empty path.
  if (matches.length === 0) {
    try {
      await getSql()`SELECT 1`
    } catch (error) {
      console.error('[drop] corpus unreachable behind an empty result:', error)
      return fail('SEARCH_FAILED', 'The archive could not be searched just now.')
    }
  }

  // matches: [] is a 200. "No connections found" is a real research result and
  // the canvas renders it as one (contract §5).
  const body: DropResponse = {
    artifact: {
      id: crypto.randomUUID(),
      filename: file.name || 'dropped-file',
      mime: file.type,
      bytes: file.size,
      kind: kindForMime(file.type),
      blobUrl,
      derivedVia: extraction.derivedVia,
      extractedChars: extraction.text.length,
      excerpt: extraction.text.slice(0, EXCERPT_CHARS),
    },
    matches,
    meta: {
      embeddingModel: 'text-embedding-3-small',
      dims: 1536,
      tablesSearched: tablesSearched(matches),
      tookMs: Date.now() - startedAt,
      truncated,
    },
  }

  console.log(
    `[drop] ${body.artifact.filename} (${body.artifact.kind}, ${body.artifact.bytes}B) -> ` +
      `${extraction.derivedVia}${extraction.visionTierId ? ` via ${extraction.visionTierId}` : ''}, ` +
      `${body.artifact.extractedChars} chars, ${matches.length} matches across ` +
      `[${body.meta.tablesSearched.join(', ')}] in ${body.meta.tookMs}ms`
  )

  return NextResponse.json<DropResponse>(body)
}
