import type { VintagePosterDProps } from "../types/documents"

const DEFAULT_PROPS: Required<VintagePosterDProps> = {
  title: "UN:DEFECTAL",
  avatar: "/placeholder.svg?height=88&width=88",
  avatarLabel: "ROCO.TD",
  heroImage: "/placeholder.svg?height=416&width=656",
  colA: "Subject exhibits anomalous behavioral patterns. Recommend continued observation.",
  colB: "Environmental factors suggest extraterrestrial influence. Containment protocols active.",
  colC: "Analysis pending. Classification level: RESTRICTED ACCESS ONLY.",
  stampText: "ISTO: 95",
}

export function VintagePosterD(props: VintagePosterDProps = {}) {
  const config = { ...DEFAULT_PROPS, ...props }
  const { title, avatarLabel, colA, colB, colC, stampText } = config;
  return (
    <article className="poster paper-bg paper-texture vignette mb-12">
      <div className="frame-border"></div>
      <div className="grain"></div>

      {/* Header Section */}
      <div className="absolute inset-x-14 top-10 mb-8">
        <div className="flex justify-between items-start">
          <div className="h-title" style={{ fontSize: "48px", letterSpacing: "-1px" }}>
            {config.title}
          </div>
          <div className="w-65">
            <div className="mono mono-sm ledger-line" style={{ paddingTop: "8px" }}></div>
            <div className="mono mono-sm hairline" style={{ paddingTop: "8px" }}></div>
            <div className="mono mono-sm hairline" style={{ paddingTop: "8px" }}></div>
            <div className="mono mono-sm hairline" style={{ paddingTop: "8px" }}></div>
            <div className="mono mono-sm hairline" style={{ paddingTop: "8px" }}></div>
            <div className="mono mono-sm hairline" style={{ paddingTop: "8px" }}></div>
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="absolute left-14 top-32 mb-12">
        <div className="w-22 h-22 bg-gray-300 mb-6"></div>
        <div className="mono mono-md">{config.avatarLabel}</div>
      </div>

      {/* Visual Effect Section */}
      <div className="absolute left-14 top-105 mb-16">
        <div
          style={{
            width: "1000px",
            height: "500px",
            borderRadius: "9999px",
            transform: "translateX(-172px)",
            overflow: "hidden",
            pointerEvents: "none",
            opacity: 0.55,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "auto auto 0 0",
              width: "100%",
              height: "50%",
              background: "radial-gradient(ellipse at 50% 100%, rgba(207,213,216,0.25) 0px, rgba(207,213,216,0.0) 60%)",
              borderTop: "2px solid rgba(0,0,0,0.5)",
            }}
          ></div>
        </div>
      </div>

      {/* Content Grid Section */}
      <section className="absolute left-14 bottom-32 mb-8">
        <div
          style={{
            width: "656px",
            display: "grid",
            gridTemplateColumns: "200px 200px 200px",
            gap: "16px",
          }}
        >
          <p className="mono mono-sm">{config.colA}</p>
          <p className="mono mono-sm">{config.colB}</p>
          <p className="mono mono-sm">{config.colC}</p>
        </div>
      </section>

      {/* Stamp Section */}
      <div className="absolute right-14 bottom-10">
        <div className="big-stamp">{config.stampText}</div>
      </div>
    </article>
  )
}
