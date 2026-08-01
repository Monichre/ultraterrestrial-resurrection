/**
 * Deterministic simulated-illegible text generator.
 * ------------------------------------------------------------------
 * Produces stable, seedable "redacted document" glyph noise. Output is
 * DECORATIVE ONLY — never real words, brands, or product copy. Consumers
 * must mark it aria-hidden.
 */

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;-_/\\|"
const BLOCKS = ["▮", "▬", "■", "▪", "█"]

/** Small, fast, stable PRNG (mulberry32). */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface GeneratedLine {
  text: string
  /** per-line opacity jitter multiplier (0..1) */
  fade: number
}

export interface GenerateOptions {
  lines: number
  charsPerLine?: number
  redactChance?: number
  seed?: number
}

/**
 * Generate an array of decorative illegible lines.
 * Words are broken into short degraded runs with occasional block-outs
 * to mimic OCR-failed / stamped-over archival text.
 */
export function generateRedacted({
  lines,
  charsPerLine = 42,
  redactChance = 0.12,
  seed = 1,
}: GenerateOptions): GeneratedLine[] {
  const rand = mulberry32(seed)
  const out: GeneratedLine[] = []

  for (let i = 0; i < lines; i++) {
    const targetLen = Math.max(
      6,
      Math.round(charsPerLine * (0.55 + rand() * 0.55)),
    )
    let line = ""
    while (line.length < targetLen) {
      // occasional solid block-out run
      if (rand() < redactChance) {
        const block = BLOCKS[Math.floor(rand() * BLOCKS.length)]
        const runLen = 2 + Math.floor(rand() * 6)
        line += block.repeat(runLen) + " "
        continue
      }
      // a short degraded "word"
      const wordLen = 2 + Math.floor(rand() * 6)
      let word = ""
      for (let c = 0; c < wordLen; c++) {
        word += GLYPHS[Math.floor(rand() * GLYPHS.length)]
      }
      line += word + " "
    }
    out.push({
      text: line.trim().slice(0, targetLen),
      fade: 0.55 + rand() * 0.45,
    })
  }

  return out
}
