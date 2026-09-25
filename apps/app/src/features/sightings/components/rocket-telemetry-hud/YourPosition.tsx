/**
 * Pulsing red position dot. The leader line goes UP-RIGHT to a small node,
 * then RIGHT to the readout, matching the reference.
 */
type Props = { x: number; y: number }

export const YourPosition = ({ x, y }: Props) => (
  <div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
  >
    {/* dot */}
    <span
      className="hud-anim-pulse block"
      style={{
        width: 12,
        height: 12,
        background: 'var(--hud-marker)',
        boxShadow: '0 0 0 2px rgba(255,31,45,0.18)',
        borderRadius: '9999px',
      }}
    />

    {/* leader: diagonal up-right then horizontal to readout */}
    <svg
      aria-hidden
      style={{ position: 'absolute', left: 6, top: -50, overflow: 'visible' }}
      width={140}
      height={60}
    >
      <polyline
        points="0,52 22,30 84,30"
        fill="none"
        stroke="var(--hud-text-primary)"
        strokeWidth={1}
        strokeOpacity={0.8}
      />
      <circle cx={22} cy={30} r={1.6} fill="var(--hud-text-primary)" />
    </svg>

    {/* readout block */}
    <div
      className="absolute"
      style={{ left: 88, top: -44, whiteSpace: 'nowrap' }}
    >
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-hud-text-primary">
        YOUR POSITION
      </div>
      <div className="mt-1 flex flex-col text-[11px] tabular-nums leading-[1.5] text-hud-text-primary">
        <span>X: 15,234.76 KM</span>
        <span>Y: -8,431.12 KM</span>
        <span>Z:&nbsp; 6,792.45 KM</span>
      </div>
    </div>
  </div>
)
