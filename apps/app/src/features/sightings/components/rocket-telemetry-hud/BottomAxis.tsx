const VALUES = [
  '-3,109.87',
  '-2,457.43',
  '-1,234.50',
  '-620.12',
  '375.00',
  '1,200.65',
  '2,450.30',
  '3,789.99',
] as const

/**
 * Bottom-edge numeric tick row anchored to the viewport. Sits below the map
 * column, between the canvas corner brackets.
 */
export const BottomAxis = () => (
  <div
    className="pointer-events-none absolute"
    style={{ left: 480, right: 400, bottom: 22 }}
    aria-hidden
  >
    <div className="flex items-end justify-between">
      {VALUES.map((v) => (
        <div key={v} className="flex flex-col items-center gap-1">
          <span
            style={{
              width: 6,
              height: 6,
              background: 'var(--hud-text-muted)',
              display: 'block',
            }}
          />
          <span className="text-[10px] tabular-nums text-hud-text-muted">
            {v}
          </span>
        </div>
      ))}
    </div>
  </div>
)
