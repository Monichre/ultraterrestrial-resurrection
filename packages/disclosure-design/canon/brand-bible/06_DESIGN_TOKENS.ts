export const ultraterrestrialTokens = {
    colors: {
        archiveBone: "#D8CFB8",
        oxidizedPaper: "#B9AE95",
        charcoalInk: "#171717",
        fadedGraphite: "#4A4A44",
        burntUmber: "#5A3524",
        signalAmber: "#F06A2A",
        coldSaucerLight: "#C8D8DD",
        classifiedRed: "#A1231E",
        blackBudgetGreen: "#1B2A24",
        deadSilver: "#A7AAA4",
        voidBlack: "#090909",
        documentWhite: "#EEE6D4",

        bgPaper: "#f4f1e8",
        bgPaperAged: "#e8e2d5",
        inkBlack: "#1a1a1a",
        inkFaded: "#4a4a4a",
        fireOrange: "#ff6b35",
        fireYellow: "#ffd23f",
        smokeGray: "#7d8491",
        skyDusk: "#8b95a7",

        classification: {
            unclassified: "#16a34a",
            confidential: "#eab308",
            secret: "#ea580c",
            topSecret: "#dc2626",
        },
    },

    typography: {
        display: "condensed uppercase grotesk",
        body: "clean readable sans-serif",
        mono: "technical monospace",
        annotation: "handwritten / scanned marginalia style",
        archival: "Courier New, Special Elite, OCR-A-style monospace",
        stamped: "Anton, Impact, Bank Gothic / DIN-inspired technical sans",
        handwritten: "Caveat, Just Another Hand, Kalam",
        ui: "PP Neue Montreal, Monument Grotesk, Neue Haas Grotesk, Noto Sans",
    },

    radii: {
        none: "0px",
        small: "2px",
        card: "4px",
        soft: "8px",
    },

    borders: {
        hairline: "1px solid rgba(23, 23, 23, 0.25)",
        document: "1px solid rgba(23, 23, 23, 0.45)",
        redacted: "2px solid #171717",
    },

    shadows: {
        paperLift: "0 6px 18px rgba(0, 0, 0, 0.22)",
        evidencePhoto: "0 12px 30px rgba(0, 0, 0, 0.35)",
        blacksitePanel: "0 0 40px rgba(200, 216, 221, 0.08)",
    },

    texture: {
        paperOpacity: 0.18,
        scanlineOpacity: 0.08,
        grainOpacity: 0.12,
        redactionOpacity: 0.92,
        foldSeamOpacity: 0.12,
        handwritingOpacity: 0.45,
        backgroundGlyphOpacity: 0.06,
    },

    motion: {
        fast: "120ms",
        standard: "220ms",
        slow: "480ms",
        archival: "900ms",
    },

    visualModes: [
        "archive-document",
        "dystopian-collage",
        "noir-research-canvas",
        "ai-war-room",
        "technical-blueprint",
        "field-evidence",
    ] as const,
} as const;

export type ResearchVisualMode =
    | "archive-document"
    | "dystopian-collage"
    | "noir-research-canvas"
    | "ai-war-room"
    | "technical-blueprint"
    | "field-evidence";

export type ResearchComponentMetadata = {
    visualMode: ResearchVisualMode;
    secondaryMode?: ResearchVisualMode;
    archivalIntensity: 0 | 1 | 2 | 3;
    digitalOverlayIntensity: 0 | 1 | 2 | 3;
    textureIntensity: 0 | 1 | 2 | 3;
};

export type ClassificationLevel =
    | "unclassified"
    | "confidential"
    | "secret"
    | "top-secret";

export type PolaroidVariant =
    | "clean"
    | "aged"
    | "burned"
    | "water-damaged"
    | "surveillance";

export type TapeVariant =
    | "none"
    | "top"
    | "corners"
    | "diagonal";

export type PolaroidFrameProps = {
    src: string;
    alt: string;
    caption?: string;
    evidenceId?: string;
    timestamp?: string;
    classification?: ClassificationLevel;
    rotation?: number;
    variant?: PolaroidVariant;
    tape?: TapeVariant;
    className?: string;
};
