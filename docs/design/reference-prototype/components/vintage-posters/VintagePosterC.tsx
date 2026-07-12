import type { VintagePosterCProps } from "@/types/documents"

const DEFAULT_PROPS: Required<VintagePosterCProps> = {
  headerLeft: "INCFRESEMENT 263 ......",
  headerRight: "INO UNNEIC 16",
  heroImage: "/placeholder.svg?height=520&width=768",
  signature: "A..Greys.GiGrane",
}

export function VintagePosterC(props: VintagePosterCProps = {}) {
  const config = { ...DEFAULT_PROPS, ...props }
  const { headerLeft, headerRight, signature } = config;
  return (
    <article className="poster paper-bg paper-texture vignette fold-mid fold-hoz">
      <div className="grain"></div>

      <header
        style={{
          position: "absolute",
          left: "48px",
          top: "40px",
          right: "48px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="mono mono-lg" style={{ letterSpacing: "1px" }}>
          {config.headerLeft}
        </div>
        <div className="mono mono-lg" style={{ fontWeight: 600 }}>
          {config.headerRight}
        </div>
      </header>

      <div className="beam"></div>
      <div className="scanlines" style={{ top: "420px", height: "520px" }}></div>

      <div className="mono mono-md" style={{ position: "absolute", right: "48px", bottom: "64px" }}>
        {config.signature}
      </div>
    </article>
  )
}
