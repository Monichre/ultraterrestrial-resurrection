/**
 * Drop-to-Canvas (T-060) — turn a dropped file into embeddable text.
 *
 * Every kind converges on plain text before it ever reaches `embedQuery`.
 * That is a hard constraint, not a convenience: `text-embedding-3-small` @ 1536
 * dims is locked corpus-wide, so an image-native model's vectors would compare
 * to nothing in this corpus and the fan-out would return confident nonsense
 * (contract §2.2).
 */
import {captionImageWithFallback} from '@/lib/ai/vision-fallback'
import {kindForMime, type DropDerivedVia, type DropKind} from './types'

export interface ExtractionResult {
  text: string
  kind: DropKind
  derivedVia: DropDerivedVia
  /** Which vision tier produced the caption, when derivedVia is
   *  'vision-caption'. Logged, not part of the response contract. */
  visionTierId?: string
}

/** A caption shorter than this is treated as a failure to extract rather than
 *  as a short document. Guards the specific failure where a model answers
 *  "I'm unable to view images" (or similar) without throwing — that string
 *  would otherwise be embedded and the user would see confident connections to
 *  a refusal. A length floor needs no brittle refusal-phrase matching. */
const MIN_CAPTION_CHARS = 40

/** Below this, text and PDF extraction is treated as having yielded nothing
 *  usable — an empty file, or a scanned PDF with no text layer. */
const MIN_TEXT_CHARS = 20

/** pdfjs emits one text item per glyph run, so naive joining produces runs of
 *  spaces. Collapse whitespace without destroying paragraph boundaries. */
function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t ]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  // The legacy build is the Node-safe entry point: the default build assumes a
  // browser worker (see features/ai/pipelines/helpers/extract.ts:204, which
  // imports pdf.worker.mjs and only ever ran client-side). Loaded dynamically
  // so a text or image drop never pays pdfjs' module cost.
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')

  const doc = await pdfjs.getDocument({
    data: bytes,
    // No eval, no remote font/cmap fetches — this runs on user-supplied bytes.
    isEvalSupported: false,
    useSystemFonts: false,
    disableFontFace: true,
    verbosity: 0,
  }).promise

  try {
    const pages: string[] = []
    for (let i = 1; i <= doc.numPages; i += 1) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      pages.push(
        content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
      )
      page.cleanup()
    }
    return normalizeWhitespace(pages.join('\n\n'))
  } finally {
    await doc.destroy()
  }
}

/**
 * Extract text from a dropped file. Throws `ExtractFailedError` when the file
 * is readable but yields nothing usable — the route maps that to 422.
 */
export class ExtractFailedError extends Error {}

export async function extractDropText(file: File): Promise<ExtractionResult> {
  const kind = kindForMime(file.type)

  if (kind === 'text') {
    const text = normalizeWhitespace(await file.text())
    if (text.length < MIN_TEXT_CHARS) {
      throw new ExtractFailedError('File contained no readable text.')
    }
    return {text, kind, derivedVia: 'utf8'}
  }

  if (kind === 'pdf') {
    let text: string
    try {
      text = await extractPdfText(new Uint8Array(await file.arrayBuffer()))
    } catch (error) {
      throw new ExtractFailedError(
        `Could not read the PDF: ${error instanceof Error ? error.message : 'unknown error'}`
      )
    }
    if (text.length < MIN_TEXT_CHARS) {
      throw new ExtractFailedError(
        'The PDF has no extractable text layer. Scanned page images are not read yet.'
      )
    }
    return {text, kind, derivedVia: 'pdf-parse'}
  }

  const caption = await captionImageWithFallback({
    image: new Uint8Array(await file.arrayBuffer()),
    mediaType: file.type.split(';')[0].trim().toLowerCase(),
  })

  if (!caption || caption.text.length < MIN_CAPTION_CHARS) {
    throw new ExtractFailedError(
      'No image-reading model is currently available, so this image could not be described.'
    )
  }

  return {
    text: normalizeWhitespace(caption.text),
    kind,
    derivedVia: 'vision-caption',
    visionTierId: caption.tierId,
  }
}
