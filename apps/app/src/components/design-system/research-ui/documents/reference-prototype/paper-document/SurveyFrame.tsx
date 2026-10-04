import type {CSSProperties} from 'react'
import type {FrameSpec} from '../types/paper-document'

const CANVAS_W = 900
const CANVAS_H = 1350

function CornerMark({pos}: {pos: 'tl' | 'tr' | 'bl' | 'br'}) {
  const size = 12
  const base: CSSProperties = {position: 'absolute', width: size, height: size}
  const line = 'var(--pd-line)'
  const styles: Record<string, CSSProperties> = {
    tl: {top: -1, left: -1, borderTop: `1px solid ${line}`, borderLeft: `1px solid ${line}`},
    tr: {top: -1, right: -1, borderTop: `1px solid ${line}`, borderRight: `1px solid ${line}`},
    bl: {bottom: -1, left: -1, borderBottom: `1px solid ${line}`, borderLeft: `1px solid ${line}`},
    br: {
      bottom: -1,
      right: -1,
      borderBottom: `1px solid ${line}`,
      borderRight: `1px solid ${line}`,
    },
  }
  return <span aria-hidden='true' style={{...base, ...styles[pos]}} />
}

/**
 * SurveyFrame — offset 1px technical rectangles (intentionally
 * misregistered) with optional L-bracket corner marks.
 * Positioned as % of the 900x1350 canvas so it scales with the container.
 */
export function SurveyFrame({frames}: {frames: FrameSpec[]}) {
  return (
    <div className='pointer-events-none absolute inset-0' aria-hidden='true' style={{zIndex: 20}}>
      {frames.map((f, i) => (
        <div
          key={i}
          className='absolute'
          style={{
            left: `${(f.x / CANVAS_W) * 100}%`,
            top: `${(f.y / CANVAS_H) * 100}%`,
            width: `${(f.w / CANVAS_W) * 100}%`,
            height: `${(f.h / CANVAS_H) * 100}%`,
            border: '1px solid var(--pd-line)',
            opacity: f.opacity ?? 1,
          }}>
          {f.corners && (
            <>
              <CornerMark pos='tl' />
              <CornerMark pos='tr' />
              <CornerMark pos='bl' />
              <CornerMark pos='br' />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
