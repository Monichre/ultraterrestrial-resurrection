import type {CSSProperties} from 'react'
import {RedactedText} from './RedactedText'
import type {TextColumnSpec} from '../types/paper-document'

const CANVAS_W = 900
const CANVAS_H = 1350

/** Redacted mono paragraph columns pinned left/right on the canvas. */
export function TextColumns({columns}: {columns: TextColumnSpec[]}) {
  return (
    <>
      {columns.map((c, i) => (
        <div
          key={i}
          className='pointer-events-none absolute'
          style={
            {
              top: `${(c.topPx / CANVAS_H) * 100}%`,
              [c.side]: '6.2%',
              width: `${(c.widthPx / CANVAS_W) * 100}%`,
              zIndex: 30,
            } as CSSProperties
          }>
          <RedactedText spec={c.block} align={c.side} />
        </div>
      ))}
    </>
  )
}
