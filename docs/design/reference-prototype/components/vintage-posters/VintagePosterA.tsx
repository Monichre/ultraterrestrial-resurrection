import type { VintagePosterAProps } from "@/types/documents"

const DEFAULT_PROPS: Required<VintagePosterAProps> = {
  pageTitleLine1: "UNDECFIL",
  pageTitleLine2: "DEPTAL",
  stampCode: "DISC00AE-128E",
  dateCode: "IO SOI 2034",
  heroImage: "/placeholder.svg?height=360&width=640",
  insetImage: "/placeholder.svg?height=84&width=140",
  insetCaption: "Subject identification\nClassification: UNKNOWN",
  rightRail1: "PRIORITY",
  rightRail2: "SECURE",
  rightRail3: "ANALYZE",
  ledgerParagraphs: "Language analysis complete. Subject demonstrates advanced cognitive patterns. Recommend immediate containment protocols. Additional surveillance required for full assessment of capabilities and potential threat level.",
}

export function VintagePosterA(props: VintagePosterAProps = {}) {
  const config = { ...DEFAULT_PROPS, ...props }
  const { pageTitleLine1, pageTitleLine2, stampCode, dateCode, insetCaption, rightRail1, rightRail2, rightRail3, ledgerParagraphs } = config;
  return (
    <article className="poster paper-bg paper-texture vignette">
      <div className="grain"></div>

      <header style={{ position: "absolute", left: "48px", top: "48px" }}>
        <h1 className="h-title h-title--xl">{config.pageTitleLine1}</h1>
        <h2 className="h-title h-title--lg" style={{ marginTop: "4px" }}>
          {config.pageTitleLine2}
        </h2>
        <span className="stamp" style={{ marginTop: "8px", display: "inline-block" }}>
          {config.stampCode}
        </span>
      </header>

      <div
        className="mono mono-lg"
        style={{ position: "absolute", right: "48px", top: "40px", letterSpacing: "3px", opacity: 0.9 }}
      >
        {config.dateCode}
      </div>

      <div className="circle-micro" style={{ left: "144px", top: "180px" }}></div>

      <div
        className="mono mono-sm"
        style={{ position: "absolute", left: "520px", top: "248px", width: "160px", opacity: 0.85 }}
      >
        {config.insetCaption.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div
        className="mono mono-sm"
        style={{
          position: "absolute",
          left: "648px",
          top: "440px",
          width: "56px",
          lineHeight: "12px",
          opacity: 0.85,
          textAlign: "left",
        }}
      >
        {config.rightRail1}
        <br />
        {config.rightRail2}
        <br />
        {config.rightRail3}
      </div>

      <section
        className="mono mono-sm"
        style={{ position: "absolute", left: "64px", top: "980px", width: "640px", height: "120px" }}
      >
        {config.ledgerParagraphs}
      </section>
    </article>
  )
}
