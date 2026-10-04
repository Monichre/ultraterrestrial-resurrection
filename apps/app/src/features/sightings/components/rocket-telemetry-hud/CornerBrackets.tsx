import type {CSSProperties} from 'react'

type Props = {
  className?: string
  /** leg length in px */
  size?: number
  /** stroke color, defaults to var(--hud-accent) */
  color?: string
  /** stroke width in px */
  stroke?: number
  /** corner inset from parent edges in px */
  inset?: number
}

/**
 * Four red L-corner brackets, absolutely positioned inside a relative parent.
 * Render `<CornerBrackets />` as a sibling within `position: relative` containers.
 */
export const CornerBrackets = ({
  className = '',
  size = 12,
  color = 'var(--hud-accent)',
  stroke = 1.5,
  inset = 0,
}: Props) => {
  const common: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    borderColor: color,
    borderStyle: 'solid',
    pointerEvents: 'none',
  }
  return (
    <div className={className} aria-hidden>
      <span
        style={{
          ...common,
          top: inset,
          left: inset,
          borderWidth: `${stroke}px 0 0 ${stroke}px`,
        }}
      />
      <span
        style={{
          ...common,
          top: inset,
          right: inset,
          borderWidth: `${stroke}px ${stroke}px 0 0`,
        }}
      />
      <span
        style={{
          ...common,
          bottom: inset,
          left: inset,
          borderWidth: `0 0 ${stroke}px ${stroke}px`,
        }}
      />
      <span
        style={{
          ...common,
          bottom: inset,
          right: inset,
          borderWidth: `0 ${stroke}px ${stroke}px 0`,
        }}
      />
    </div>
  )
}
