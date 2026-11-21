import { RedactedText } from "./RedactedText"
import type { FooterSpec } from "../types/paper-document"

/**
 * DocFooter — bottom row: left redacted code block, optional centered
 * caption word, and an optional scarce red accent (underline / tick).
 */
export function DocFooter({ spec }: { spec: FooterSpec }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-[6.2%] pb-[4.5%]"
      style={{ zIndex: 30 }}
    >
      <RedactedText spec={spec.left} />

      {spec.center && (
        <div
          aria-hidden="true"
          className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.4em", color: "var(--pd-ink)" }}
        >
          {spec.center}
        </div>
      )}

      <div className="relative">
        {spec.accent === "redUnderline" && (
          <span
            aria-hidden="true"
            className="block"
            style={{ width: 46, height: 2, background: "var(--pd-accent-red)" }}
          />
        )}
        {spec.accent === "redTick" && (
          <span
            aria-hidden="true"
            className="block"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "9px solid var(--pd-accent-red)",
            }}
          />
        )}
      </div>
    </div>
  )
}
