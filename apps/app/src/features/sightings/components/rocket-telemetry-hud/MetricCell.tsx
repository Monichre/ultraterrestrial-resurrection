type Props = { label: string; value: string }

/**
 * Metric cell: red ▶ triangle bullet + small accent label, large value below.
 */
export const MetricCell = ({ label, value }: Props) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="inline-block"
        style={{
          width: 0,
          height: 0,
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderLeft: '6px solid var(--hud-accent)',
        }}
      />
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-hud-accent">
        {label}
      </span>
    </div>
    <div className="text-[22px] font-medium leading-none tracking-[0.02em] text-hud-text-primary">
      {value}
    </div>
  </div>
)
