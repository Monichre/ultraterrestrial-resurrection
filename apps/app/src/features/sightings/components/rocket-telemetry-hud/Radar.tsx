/**
 * Top-center radar widget: concentric circles, crosshair, sweeping cone.
 */
export const Radar = () => {
  const SIZE = 140
  const C = SIZE / 2
  return (
    <div
      className="absolute"
      style={{ width: SIZE, height: SIZE, left: '50%', top: '4%', transform: 'translateX(-50%)' }}
      aria-hidden
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
        {[0.3, 0.55, 0.8, 1].map((r, i) => (
          <circle
            key={i}
            cx={C}
            cy={C}
            r={(SIZE / 2 - 4) * r}
            fill="none"
            stroke="var(--hud-text-secondary)"
            strokeOpacity={0.35}
            strokeWidth={1}
          />
        ))}
        {/* crosshair */}
        <line x1={4} x2={SIZE - 4} y1={C} y2={C} stroke="var(--hud-text-secondary)" strokeOpacity={0.4} />
        <line x1={C} x2={C} y1={4} y2={SIZE - 4} stroke="var(--hud-text-secondary)" strokeOpacity={0.4} />
        {/* red crosshair through center */}
        <line x1={4} x2={SIZE - 4} y1={C} y2={C} stroke="var(--hud-accent)" strokeOpacity={0.55} strokeWidth={1} />
        <line x1={C} x2={C} y1={4} y2={SIZE - 4} stroke="var(--hud-accent)" strokeOpacity={0.55} strokeWidth={1} />
      </svg>
      {/* sweeping cone */}
      <div
        className="hud-anim-sweep absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          <defs>
            <linearGradient id="hud-radar-cone" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--hud-text-primary)" stopOpacity="0.0" />
              <stop offset="100%" stopColor="var(--hud-text-primary)" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <path
            d={`M ${C} ${C} L ${C - 28} ${4} A ${C - 4} ${C - 4} 0 0 1 ${C + 28} ${4} Z`}
            fill="url(#hud-radar-cone)"
          />
        </svg>
      </div>
    </div>
  )
}
