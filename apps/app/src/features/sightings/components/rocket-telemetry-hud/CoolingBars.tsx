const HEIGHTS = [65, 80, 55, 90, 50, 95, 70, 35] as const

export const CoolingBars = () => (
  <div className="flex flex-col gap-3">
    <h3 className="text-[12px] font-medium uppercase tracking-[0.1em] text-hud-text-primary">
      COOLING SYSTEM
    </h3>
    <div
      className="relative flex items-end justify-between"
      style={{ height: 96 }}
      role="img"
      aria-label="Cooling system bar chart, 8 channels D1 through D8"
    >
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="hud-anim-bar"
          style={{
            width: 8,
            height: `${h}%`,
            background:
              i === HEIGHTS.length - 1
                ? 'var(--hud-accent-dim)'
                : 'var(--hud-accent)',
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
    <div className="flex justify-between text-[9px] uppercase tracking-[0.08em] text-hud-text-secondary">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} style={{ width: 8, textAlign: 'center' }}>
          D{i + 1}
        </span>
      ))}
    </div>
  </div>
)
