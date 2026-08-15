/**
 * Multi-line engine temperature trace — one bold accent line + 3 thin
 * support lines on a 5-line gridded chart.
 */
const W = 460
const H = 160
const PAD_L = 18
const PAD_R = 8
const PAD_T = 8
const PAD_B = 18
const STEPS = 60

// Deterministic pseudo-random series (no Math.random — must be SSR-stable).
function series(seed: number, amp: number, base: number) {
  const pts: [number, number][] = []
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    const v =
      base +
      Math.sin(t * 12 + seed) * amp +
      Math.sin(t * 26 + seed * 2.3) * amp * 0.55 +
      Math.cos(t * 6 + seed * 0.7) * amp * 0.4
    const x = PAD_L + t * (W - PAD_L - PAD_R)
    const y = PAD_T + ((5 - v) / 4) * (H - PAD_T - PAD_B)
    pts.push([x, y])
  }
  return pts.map((p) => p.join(',')).join(' ')
}

export const EngineTemperatureChart = () => {
  const innerH = H - PAD_T - PAD_B
  const gridY = (i: number) => PAD_T + (i / 4) * innerH
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      role="img"
      aria-labelledby="engine-temp-title engine-temp-desc"
    >
      <title id="engine-temp-title">Engine temperature</title>
      <desc id="engine-temp-desc">
        Four overlapping waveforms, primary trace in red, oscillating between 1
        and 5.
      </desc>
      {/* gridlines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={PAD_L}
          x2={W - PAD_R}
          y1={gridY(i)}
          y2={gridY(i)}
          stroke="var(--hud-border-faint)"
          strokeWidth={1}
        />
      ))}
      {/* y labels 5..1 top→bottom */}
      {[5, 4, 3, 2, 1].map((label, i) => (
        <text
          key={label}
          x={4}
          y={gridY(i) + 3}
          fontSize={9}
          fill="var(--hud-text-secondary)"
          fontFamily="var(--font-mono)"
        >
          {label}
        </text>
      ))}
      {/* support lines */}
      <polyline
        points={series(1.7, 0.9, 2.6)}
        fill="none"
        stroke="var(--hud-text-muted)"
        strokeWidth={1}
        opacity={0.85}
      />
      <polyline
        points={series(4.2, 0.8, 3.0)}
        fill="none"
        stroke="var(--hud-text-primary)"
        strokeWidth={1}
        opacity={0.55}
      />
      <polyline
        points={series(0.4, 0.7, 3.4)}
        fill="none"
        stroke="var(--hud-text-primary)"
        strokeWidth={1}
        opacity={0.7}
      />
      {/* primary */}
      <polyline
        points={series(2.9, 1.0, 2.8)}
        fill="none"
        stroke="var(--hud-accent)"
        strokeWidth={2}
      />
    </svg>
  )
}
