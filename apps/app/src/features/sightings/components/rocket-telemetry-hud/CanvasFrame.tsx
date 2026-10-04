import type {CSSProperties} from 'react'

type Props = {className?: string}

/**
 * Outer canvas frame: 4 large red L-corner brackets and small dashes
 * centered on top and bottom edges of the canvas.
 */
export const CanvasFrame = ({className = ''}: Props) => {
  const ACCENT = 'var(--hud-accent)'
  const LEG = 24
  const STROKE = 1.5
  const INSET = 16

  const corner: CSSProperties = {
    position: 'absolute',
    width: LEG,
    height: LEG,
    borderColor: ACCENT,
    borderStyle: 'solid',
    pointerEvents: 'none',
  }

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <span
        style={{
          ...corner,
          top: INSET,
          left: INSET,
          borderWidth: `${STROKE}px 0 0 ${STROKE}px`,
        }}
      />
      <span
        style={{
          ...corner,
          top: INSET,
          right: INSET,
          borderWidth: `${STROKE}px ${STROKE}px 0 0`,
        }}
      />
      <span
        style={{
          ...corner,
          bottom: INSET,
          left: INSET,
          borderWidth: `0 0 ${STROKE}px ${STROKE}px`,
        }}
      />
      <span
        style={{
          ...corner,
          bottom: INSET,
          right: INSET,
          borderWidth: `0 ${STROKE}px ${STROKE}px 0`,
        }}
      />
      {/* Top center dash */}
      <span
        style={{
          position: 'absolute',
          top: INSET,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 16,
          height: 1,
          background: ACCENT,
        }}
      />
      {/* Bottom center dash */}
      <span
        style={{
          position: 'absolute',
          bottom: INSET,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 16,
          height: 1,
          background: ACCENT,
        }}
      />
    </div>
  )
}
