import type {PageAccent} from '../types/paper-document'

const CANVAS_W = 900
const CANVAS_H = 1350

/**
 * PageAccent — the single scarce color mark per poster.
 *  - redTriangle: small red pointer at a frame edge (image 1)
 *  - yellowLogo:  angular emblem + orange label top-right (image 3)
 */
export function PageAccentMark({accent}: {accent?: PageAccent}) {
  if (!accent) return null

  switch (accent.type) {
    case 'none':
      return null

    case 'redTriangle':
      return (
        <span
          aria-hidden='true'
          className='absolute'
          style={{
            left: `${(accent.xPx / CANVAS_W) * 100}%`,
            top: `${(accent.yPx / CANVAS_H) * 100}%`,
            width: 10,
            height: 14,
            background: 'var(--pd-accent-red)',
            clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)',
            zIndex: 40,
          }}
        />
      )

    case 'yellowLogo':
      return (
        <div
          aria-hidden='true'
          className='absolute flex items-center gap-1'
          style={{
            left: `${(accent.xPx / CANVAS_W) * 100}%`,
            top: `${(accent.yPx / CANVAS_H) * 100}%`,
            zIndex: 40,
          }}>
          <span
            style={{
              display: 'inline-block',
              width: 22,
              height: 22,
              background: 'var(--pd-accent-yellow)',
              clipPath: 'polygon(50% 0%, 100% 100%, 50% 70%, 0% 100%)',
            }}
          />
          {accent.label && (
            <span
              className='font-mono font-bold'
              style={{fontSize: 9, letterSpacing: '0.15em', color: '#c46a1a'}}>
              {accent.label}
            </span>
          )}
        </div>
      )

    default: {
      const _exhaustive: never = accent
      return _exhaustive
    }
  }
}
