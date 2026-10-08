/**
 * POST /api/processing/drop — Drop-to-Canvas ingest (T-060).
 *
 * A file, page URL, or YouTube link dropped on the research canvas is
 * extracted to text, embedded once, and fanned out against the existing
 * corpus. The response is the artifact plus ranked corpus matches.
 *
 * READ-ONLY against the corpus. Nothing here INSERTs into `documents`,
 * `document_chunks`, or any entity table (contract §2.1). URL/YouTube
 * drops unfurl page text via the existing scrape helper + oEmbed — they
 * do not call `processResource` and they do not fetch transcripts.
 *
 * The `/api/processing/*` prefix is load-bearing: `middleware.ts:9-11` gates
 * exactly that prefix with Clerk. Moving this route makes it a public,
 * unmetered file-upload endpoint that calls paid embeddings.
 *
 * Contract: docs/plans/2026-08-13-canvas-drop-ingest-contract.md
 */
import {NextResponse} from 'next/server'
import {getSql, searchDatabase} from '@db/postgres'
import {embedQuery} from '@/services/ai/openai/embed-query'
import {ExtractFailedError, extractDropText} from '@/services/processing/drop/extract'
import {extractDropUrl} from '@/services/processing/drop/extract-url'
import {tablesSearched, toDropMatches} from '@/services/processing/drop/matches'
import {normalizePublicHttpUrl} from '@/services/processing/drop/parse-url'
import {
  DEFAULT_MATCH_LIMIT,
  EMBED_CHAR_LIMIT,
  EXCERPT_CHARS,
  MAX_DROP_BYTES,
  effectiveDropMime,
  isAcceptedMime,
  kindForMime,
  type DropArtifact,
  type DropError,
  type DropErrorCode,
  type DropKind,
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
  INVALID_URL: 400,
  EXTRACT_FAILED: 422,
  EMBED_FAILED: 502,
  SEARCH_FAILED: 502,
}

function fail(code: DropErrorCode, error: string) {
  return NextResponse.json<DropError>({error, code}, {status: STATUS_FOR_CODE[code]})
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

  let form: FormData
  try {
    form = await request.formData()
  } catch (error) {
    console.error('[drop] multipart parse failed:', error)
    return fail('EXTRACT_FAILED', 'The upload could not be read.')
  }

  const fileCandidate = form.get('file')
  const urlCandidate = form.get('url')
  const file = fileCandidate instanceof File ? fileCandidate : null
  const rawUrl = typeof urlCandidate === 'string' ? urlCandidate : null

  if (file) {
    return respondFromFile(file, startedAt)
  }
  if (rawUrl) {
    return respondFromUrl(rawUrl, startedAt)
  }
  return fail('EXTRACT_FAILED', 'No file or URL was included in the request.')
}

async function respondFromFile(file: File, startedAt: number) {
  if (file.size > MAX_DROP_BYTES) {
    return fail('TOO_LARGE', 'That file is larger than the 10 MB drop limit.')
  }
  const mime = effectiveDropMime(file.type, file.name)
  if (!isAcceptedMime(mime)) {
    return fail(
      'UNSUPPORTED_TYPE',
      `${file.type || 'That file type'} cannot be read yet. Drop text, JSON, PDF, a PNG/JPEG/WebP image, or a page / YouTube URL.`
    )
  }

  let extraction: Awaited<ReturnType<typeof extractDropText>>
  try {
    extraction = await extractDropText(file, mime)
  } catch (error) {
    if (error instanceof ExtractFailedError) return fail('EXTRACT_FAILED', error.message)
    console.error('[drop] extraction failed:', error)
    return fail('EXTRACT_FAILED', 'The file could not be read.')
  }

  return respondFromText({
    startedAt,
    text: extraction.text,
    filename: file.name || 'dropped-file',
    mime,
    bytes: file.size,
    kind: kindForMime(mime),
    derivedVia: extraction.derivedVia,
    sourceUrl: null,
    logExtra: extraction.visionTierId ? ` via ${extraction.visionTierId}` : '',
  })
}

async function respondFromUrl(rawUrl: string, startedAt: number) {
  const url = normalizePublicHttpUrl(rawUrl)
  if (!url) {
    return fail('INVALID_URL', 'That drop is not a public http(s) page or YouTube link.')
  }

  let extraction: Awaited<ReturnType<typeof extractDropUrl>>
  try {
    extraction = await extractDropUrl(url)
  } catch (error) {
    if (error instanceof ExtractFailedError) return fail('EXTRACT_FAILED', error.message)
    console.error('[drop] url extraction failed:', error)
    return fail('EXTRACT_FAILED', 'The URL could not be read.')
  }

  return respondFromText({
    startedAt,
    text: extraction.text,
    filename: extraction.title,
    mime: 'text/uri-list',
    bytes: new TextEncoder().encode(extraction.text).length,
    kind: extraction.kind,
    derivedVia: extraction.derivedVia,
    sourceUrl: extraction.sourceUrl,
    logExtra: '',
  })
}

async function respondFromText({
  startedAt,
  text,
  filename,
  mime,
  bytes,
  kind,
  derivedVia,
  sourceUrl,
  logExtra,
}: {
  startedAt: number
  text: string
  filename: string
  mime: string
  bytes: number
  kind: DropKind
  derivedVia: DropArtifact['derivedVia']
  sourceUrl: string | null
  logExtra: string
}) {
  const truncated = text.length > EMBED_CHAR_LIMIT
  const embedText = truncated ? text.slice(0, EMBED_CHAR_LIMIT) : text

  // The raw file remains request-scoped. A public Blob upload would outlive
  // the canvas session and expose user-supplied material at a durable URL.
  const embedding = await embedQuery(embedText)

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

  // vectorSearch swallows per-table errors and returns []. A SELECT 1 would
  // prove connectivity but miss a broken vector operator or table. Probe one
  // actual nearest-neighbor query before calling the empty result genuine.
  if (matches.length === 0) {
    try {
      await getSql().query(
        `SELECT id FROM document_chunks WHERE embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector LIMIT 1`,
        [`[${embedding.join(',')}]`]
      )
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
      filename,
      mime,
      bytes,
      kind,
      blobUrl: null,
      sourceUrl,
      derivedVia,
      extractedChars: text.length,
      excerpt: text.slice(0, EXCERPT_CHARS),
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
      `${derivedVia}${logExtra}, ` +
      `${body.artifact.extractedChars} chars, ${matches.length} matches across ` +
      `[${body.meta.tablesSearched.join(', ')}] in ${body.meta.tookMs}ms`
  )

  return NextResponse.json<DropResponse>(body)
}
