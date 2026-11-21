/**
 * Five concentric dashed orbit arcs. The centers sit far to the left of the
 * map so that only the right portion of each circle is visible, giving the
 * "right-opening bow" effect from the reference.
 */
export const OrbitArcs = () => (
  <svg
    aria-hidden
    className="absolute inset-0 h-full w-full"
    viewBox="0 0 1000 1000"
    preserveAspectRatio="none"
  >
    <defs>
      <clipPath id="map-clip">
        <rect x="0" y="0" width="1000" height="1000" />
      </clipPath>
    </defs>
    <g clipPath="url(#map-clip)">
      {[480, 620, 760, 900, 1040].map((r) => (
        <circle
          key={r}
          cx={-260}
          cy={500}
          r={r}
          fill="none"
          stroke="var(--hud-text-secondary)"
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="3 7"
        />
      ))}
    </g>
  </svg>
)
