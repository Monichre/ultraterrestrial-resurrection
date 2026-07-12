import type { VintagePosterBProps } from "@/types/documents"

const DEFAULT_PROPS: Required<VintagePosterBProps> = {
  titleISTA: "ISTAFRLD",
  subtitleISTA: "Orbital surveillance protocol active",
  verticalTitle: "Daænti",
  heroImage: "/placeholder.svg?height=420&width=600",
  bottomNumber: "886",
}

export function VintagePosterB(props: VintagePosterBProps = {}) {
  const config = { ...DEFAULT_PROPS, ...props }
  const { titleISTA, subtitleISTA, verticalTitle, bottomNumber } = config
  return (
    <article className="poster paper-bg paper-texture vignette">
      <div className="crosshair-x"></div>
      <div className="crosshair-y"></div>
      <div className="grain"></div>

      <div
        className="h-title"
        style={{ fontSize: "36px", position: "absolute", left: "96px", top: "220px", letterSpacing: "-1px" }}
      >
        {config.titleISTA}
      </div>
      <div className="mono mono-md" style={{ position: "absolute", left: "96px", top: "260px", opacity: 0.8 }}>
        {config.subtitleISTA}
      </div>

      <div
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          width: "72px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="h-title"
          style={{ fontSize: "28px", letterSpacing: "2px", transform: "rotate(90deg)", opacity: 0.9 }}
        >
          {config.verticalTitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "204px",
          top: "320px",
          width: "360px",
          height: "360px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.0) 200px)",
          filter: "blur(8px)",
          opacity: 0.25,
        }}
      ></div>

      <div
        className="mono mono-lg"
        style={{ position: "absolute", left: "352px", top: "1026px", color: "#1a1a1a", fontWeight: 600 }}
      >
        {config.bottomNumber}
      </div>
    </article>
  )
}
