import type { PaperDocumentVariant } from "../types/paper-document"

/**
 * Five variant records — one per supplied reference poster.
 * px values are relative to a 900 x 1350 (2:3) canvas and are approx.
 * All titles reproduce the (degraded) glyphs visible in the references.
 * `imageSrc` is intentionally omitted so the duotone placeholder renders;
 * drop a scorched-terrain photo in to complete the recreation.
 */

// IMAGE 1 — embossed seal over ash plain, red triangle + red underline
const ashfield: PaperDocumentVariant = {
  id: "ashfield",
  substrate: "#EAE6DA",
  tone: "light",
  rotationDeg: -0.2,
  header: {
    left: { lines: 2, charsPerLine: 16, seed: 11, sizePx: 9, opacity: 0.7 },
    right: { lines: 2, charsPerLine: 14, seed: 12, sizePx: 9, opacity: 0.6 },
  },
  title: { text: "ULTERTRAL", align: "left", sizePx: 52, eroded: true, topPx: 290 },
  subtitle: { lines: 3, charsPerLine: 14, seed: 13, sizePx: 10, opacity: 0.75 },
  plate: {
    box: { x: 70, y: 620, w: 760, h: 520 },
    emblem: "seal",
    fireGlow: true,
    alt: "Scorched ash plain with low flame lines and rocks",
  },
  frames: [
    { x: 340, y: 315, w: 400, h: 800, corners: true },
    { x: 70, y: 355, w: 480, h: 760, corners: false, opacity: 0.7 },
  ],
  textColumns: [
    { side: "left", topPx: 470, widthPx: 210, block: { lines: 8, charsPerLine: 26, seed: 21, sizePx: 8, opacity: 0.5 } },
    { side: "right", topPx: 470, widthPx: 170, block: { lines: 9, charsPerLine: 20, seed: 22, sizePx: 8, opacity: 0.5 } },
    { side: "right", topPx: 820, widthPx: 150, block: { lines: 6, charsPerLine: 16, seed: 23, sizePx: 8, opacity: 0.5 } },
  ],
  footer: {
    left: { lines: 4, charsPerLine: 40, seed: 31, sizePx: 8, opacity: 0.55 },
    center: "UIMU",
    accent: "redUnderline",
  },
  accent: { type: "redTriangle", xPx: 772, yPx: 660 },
}

// IMAGE 2 — pink flame column, big "94", hat-figure inset thumb
const undefeat: PaperDocumentVariant = {
  id: "undefeat",
  substrate: "#E8E4D8",
  tone: "light",
  rotationDeg: 0.15,
  header: {
    left: { lines: 3, charsPerLine: 16, seed: 41, sizePx: 9, opacity: 0.7 },
    right: { bigNumber: "94", sub: { lines: 2, charsPerLine: 12, seed: 42, sizePx: 8, opacity: 0.6 } },
  },
  title: { text: "UN— DEFEA ALL", align: "right", sizePx: 58, eroded: true, topPx: 150 },
  plate: {
    box: { x: 105, y: 355, w: 720, h: 700 },
    emblem: "none",
    insetThumb: true,
    fireGlow: true,
    torn: true,
    alt: "Mountain horizon with central flame column and scattered fires",
  },
  frames: [
    { x: 105, y: 355, w: 700, h: 660, corners: true },
    { x: 120, y: 400, w: 250, h: 90, corners: false, opacity: 0.8 },
  ],
  textColumns: [
    { side: "right", topPx: 300, widthPx: 150, block: { lines: 3, charsPerLine: 18, seed: 43, sizePx: 9, opacity: 0.6 } },
    { side: "left", topPx: 470, widthPx: 40, block: { lines: 5, charsPerLine: 4, seed: 44, sizePx: 8, opacity: 0.55 } },
  ],
  footer: {
    left: { lines: 5, charsPerLine: 30, seed: 45, sizePx: 8, opacity: 0.5 },
    accent: "none",
  },
  accent: { type: "none" },
}

// IMAGE 3 — ember disc, yellow logo, blueprint stamp, handwritten marginalia
const ultrerial: PaperDocumentVariant = {
  id: "ultrerial",
  substrate: "#E4DECB",
  tone: "light",
  rotationDeg: -0.3,
  header: {
    left: { lines: 1, charsPerLine: 14, seed: 51, sizePx: 10, opacity: 0.75 },
    right: { lines: 1, charsPerLine: 6, seed: 52, sizePx: 9, opacity: 0.5 },
  },
  title: { text: "ULTRERIAL", align: "left", sizePx: 48, eroded: true, topPx: 300 },
  plate: {
    box: { x: 250, y: 600, w: 500, h: 520 },
    emblem: "none",
    fireGlow: true,
    alt: "Burnt field disc with rising ember sparks and smoke smear",
  },
  frames: [
    { x: 340, y: 320, w: 440, h: 800, corners: true },
    { x: 70, y: 355, w: 300, h: 340, corners: false, opacity: 0.6 },
  ],
  textColumns: [
    { side: "left", topPx: 400, widthPx: 240, block: { lines: 3, charsPerLine: 26, seed: 61, sizePx: 8, opacity: 0.5 } },
    { side: "left", topPx: 520, widthPx: 220, block: { lines: 3, charsPerLine: 24, seed: 62, sizePx: 8, opacity: 0.5 } },
    { side: "left", topPx: 640, widthPx: 240, block: { lines: 4, charsPerLine: 26, seed: 63, sizePx: 8, opacity: 0.5 } },
    { side: "right", topPx: 440, widthPx: 130, block: { lines: 10, charsPerLine: 14, seed: 64, sizePx: 7, opacity: 0.45 } },
  ],
  footer: {
    left: { lines: 4, charsPerLine: 34, seed: 65, sizePx: 8, opacity: 0.5 },
    accent: "none",
  },
  marginalia: true,
  accent: { type: "yellowLogo", xPx: 730, yPx: 90, label: "TERRESTRIAL" },
}

// IMAGE 4 — glowing white halo/disc altar, ULTERESAL / CTHUU
const ulteresal: PaperDocumentVariant = {
  id: "ulteresal",
  substrate: "#E6E0D0",
  tone: "light",
  rotationDeg: 0.25,
  header: {
    left: { lines: 1, charsPerLine: 12, seed: 71, sizePx: 9, opacity: 0.7 },
    right: { lines: 1, charsPerLine: 12, seed: 72, sizePx: 9, opacity: 0.7 },
    centerBracket: true,
  },
  title: { text: "ULTERESAL", align: "left", sizePx: 54, eroded: true, topPx: 300 },
  secondaryTitle: { text: "CTHUU", sizePx: 40, pos: "bottomLeft" },
  plate: {
    box: { x: 90, y: 350, w: 720, h: 730 },
    emblem: "halo",
    fireGlow: true,
    alt: "Rocky altar with glowing white halo disc and flames below",
  },
  frames: [
    { x: 340, y: 300, w: 400, h: 780, corners: true },
    { x: 90, y: 350, w: 640, h: 730, corners: false, opacity: 0.65 },
  ],
  textColumns: [
    { side: "right", topPx: 480, widthPx: 110, block: { lines: 8, charsPerLine: 10, seed: 81, sizePx: 8, opacity: 0.5 } },
    { side: "left", topPx: 400, widthPx: 200, block: { lines: 1, charsPerLine: 30, seed: 82, sizePx: 8, opacity: 0.5 } },
  ],
  footer: {
    left: { lines: 4, charsPerLine: 42, seed: 83, sizePx: 8, opacity: 0.5 },
    accent: "none",
  },
  accent: { type: "none" },
}

// IMAGE 5 — halftone dark, concentric crosshair, standing figure + bonfire
const undectel: PaperDocumentVariant = {
  id: "undectel",
  substrate: "#B9B7AE",
  tone: "halftone",
  rotationDeg: 0,
  header: {
    left: { lines: 2, charsPerLine: 18, seed: 91, sizePx: 9, opacity: 0.8 },
    right: { lines: 3, charsPerLine: 10, seed: 92, sizePx: 9, opacity: 0.7 },
  },
  title: { text: "UN-DECTEL DRISD", align: "left", sizePx: 40, eroded: true, topPx: 110 },
  plate: {
    box: { x: 60, y: 250, w: 780, h: 1040 },
    emblem: "crosshair",
    insetThumb: true,
    fireGlow: true,
    alt: "Dark scorched field with concentric crosshair, distant figure and bonfire",
  },
  frames: [
    { x: 200, y: 420, w: 460, h: 560, corners: true },
    { x: 60, y: 250, w: 780, h: 60, corners: false, opacity: 0.8 },
    { x: 640, y: 300, w: 200, h: 220, corners: false, opacity: 0.7 },
  ],
  textColumns: [
    { side: "right", topPx: 340, widthPx: 200, block: { lines: 8, charsPerLine: 22, seed: 93, sizePx: 8, opacity: 0.6 } },
    { side: "right", topPx: 760, widthPx: 200, block: { lines: 6, charsPerLine: 20, seed: 94, sizePx: 8, opacity: 0.6 } },
    { side: "left", topPx: 300, widthPx: 320, block: { lines: 6, charsPerLine: 34, seed: 95, sizePx: 8, opacity: 0.55 } },
  ],
  footer: {
    left: { lines: 2, charsPerLine: 30, seed: 96, sizePx: 8, opacity: 0.6 },
    accent: "none",
  },
  accent: { type: "none" },
}

export const paperDocuments: Record<PaperDocumentVariant["id"], PaperDocumentVariant> = {
  ashfield,
  undefeat,
  ultrerial,
  ulteresal,
  undectel,
}

export const paperDocumentList: PaperDocumentVariant[] = [
  ashfield,
  undefeat,
  ultrerial,
  ulteresal,
  undectel,
]
