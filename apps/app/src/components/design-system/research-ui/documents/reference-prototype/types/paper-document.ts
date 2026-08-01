/**
 * Paper Document (Poster) Types
 * ------------------------------------------------------------------
 * A single reusable "aged-paper poster / redacted dossier" component,
 * driven entirely by a per-image data record. Recreates the 5 supplied
 * reference mockups:
 *   - ashfield   (ULTERTRAL, embossed seal, red triangle + red underline)
 *   - undefeat   (UN-DEFEA ALL, pink flame column, big "94", hat-figure thumb)
 *   - ultrerial  (ULTRERIAL, ember disc, yellow logo, handwritten marginalia)
 *   - ulteresal  (ULTERESAL / CTHUU, glowing halo/disc altar)
 *   - undectel   (UN-DECTEL DRISD, halftone dark, concentric crosshair, bonfire)
 *
 * NOTE: All "redacted" text is decorative/simulated illegibility. It must
 * NOT be read as real words, brands, claims, or product copy.
 */

export type PaperVariantId =
  | "ashfield"
  | "undefeat"
  | "ultrerial"
  | "ulteresal"
  | "undectel"

export type PaperTone = "light" | "dark" | "halftone"

/** A block of simulated illegible monospace text. */
export interface RedactedSpec {
  /** number of text lines to generate */
  lines: number
  /** approx. characters per line (varies +/- for realism) */
  charsPerLine?: number
  /** 0..1 opacity of the ink */
  opacity?: number
  /** chance (0..1) a run is replaced by a solid block-out ▮ */
  redactChance?: number
  /** seed so generated glyph noise is stable across renders */
  seed?: number
  /** font size in px */
  sizePx?: number
}

export interface FrameSpec {
  /** px, relative to the 900x1350 canvas */
  x: number
  y: number
  w: number
  h: number
  /** draw L-bracket corner registration marks */
  corners?: boolean
  /** 0..1 line opacity override */
  opacity?: number
}

export interface HeaderSpec {
  left: RedactedSpec
  /** either a redacted block or a large stamped number ("94") */
  right: RedactedSpec | { bigNumber: string; sub?: RedactedSpec }
  /** optional centered bracket segment, e.g. image 4 [▬ ▬] */
  centerBracket?: boolean
}

export interface TitleSpec {
  text: string
  align: "left" | "right"
  sizePx: number
  /** apply the eroded/bitten glyph mask */
  eroded?: boolean
  /** px offset from top of content area */
  topPx: number
}

export interface SecondaryTitleSpec {
  text: string
  sizePx: number
  /** currently only bottom-left is used (CTHUU) */
  pos: "bottomLeft"
}

export type EmblemKind = "seal" | "halo" | "crosshair" | "none"

export interface PlateSpec {
  /** photographic source; falls back to a generated duotone placeholder */
  imageSrc?: string
  alt?: string
  /** px box of the image plate relative to canvas */
  box: { x: number; y: number; w: number; h: number }
  emblem?: EmblemKind
  /** tiny framed portrait thumbnail */
  insetThumb?: boolean
  insetThumbSrc?: string
  /** warm radial highlight where fire sits */
  fireGlow?: boolean
  /** irregular torn-edge mask */
  torn?: boolean
}

export interface TextColumnSpec {
  side: "left" | "right"
  topPx: number
  widthPx: number
  block: RedactedSpec
}

export type FooterAccent = "redUnderline" | "redTick" | "none"

export interface FooterSpec {
  left: RedactedSpec
  center?: string
  accent?: FooterAccent
}

export type PageAccent =
  | { type: "redTriangle"; xPx: number; yPx: number }
  | { type: "yellowLogo"; xPx: number; yPx: number; label?: string }
  | { type: "none" }

export interface PaperDocumentVariant {
  id: PaperVariantId
  substrate: string
  tone: PaperTone
  /** subtle intentional misregistration, approx. -0.6..0.6 deg */
  rotationDeg?: number
  header: HeaderSpec
  title: TitleSpec
  secondaryTitle?: SecondaryTitleSpec
  subtitle?: RedactedSpec
  plate: PlateSpec
  frames: FrameSpec[]
  textColumns: TextColumnSpec[]
  footer: FooterSpec
  marginalia?: boolean
  accent?: PageAccent
}

export interface PaperDocumentProps {
  variant: PaperDocumentVariant
  /** enable implied smoke/ember motion; off by default */
  enableMotion?: boolean
  className?: string
}
