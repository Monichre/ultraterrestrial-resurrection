/**
 * PaperTexture — grain + vignette + edge stains.
 * Pure CSS/SVG, decorative, non-interactive. Sits at the lowest z-layer.
 */
interface Props {
  tone: "light" | "dark" | "halftone"
}

export function PaperTexture({ tone }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ zIndex: 0 }}>
      {/* fractal grain */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          opacity: tone === "halftone" ? 0.32 : 0.14,
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.72\" numOctaves=\"4\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.85\"/></svg>')",
        }}
      />

      {/* halftone dot screen (image 5 only) */}
      {tone === "halftone" && (
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            opacity: 0.4,
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.55) 0.6px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      )}

      {/* soft stains */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(ellipse at 22% 18%, rgba(90,70,40,0.10) 0px, transparent 260px)," +
            "radial-gradient(ellipse at 82% 76%, rgba(70,55,35,0.09) 0px, transparent 300px)," +
            "radial-gradient(ellipse at 60% 92%, rgba(60,50,35,0.08) 0px, transparent 240px)",
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,0.28) 100%)",
        }}
      />
    </div>
  )
}
