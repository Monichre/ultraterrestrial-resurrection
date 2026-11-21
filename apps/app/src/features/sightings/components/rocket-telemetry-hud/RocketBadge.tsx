import type {CSSProperties} from 'react'
import {Rocket} from './icons/planets'

/**
 * 96x96 outlined square holding a centered rocket SVG with small edge ticks.
 */
export const RocketBadge = () => {
  const TICK = 'var(--hud-border)'
  return (
    <div
      className='relative flex items-center justify-center'
      style={{width: 96, height: 96, border: '1px solid var(--hud-border-faint)'}}
      aria-hidden>
      {/* edge ticks */}
      <span style={tick({top: -1, left: 8, w: 12, h: 1}, TICK)} />
      <span style={tick({top: -1, right: 8, w: 12, h: 1}, TICK)} />
      <span style={tick({bottom: -1, left: 8, w: 12, h: 1}, TICK)} />
      <span style={tick({bottom: -1, right: 8, w: 12, h: 1}, TICK)} />
      <span style={tick({left: -1, top: 8, w: 1, h: 12}, TICK)} />
      <span style={tick({left: -1, bottom: 8, w: 1, h: 12}, TICK)} />
      <span style={tick({right: -1, top: 8, w: 1, h: 12}, TICK)} />
      <span style={tick({right: -1, bottom: 8, w: 1, h: 12}, TICK)} />
      <Rocket width={56} height={56} stroke='var(--hud-text-primary)' strokeWidth={1.25} />
    </div>
  )
}

function tick(
  pos: {top?: number; bottom?: number; left?: number; right?: number; w: number; h: number},
  color: string
): CSSProperties {
  return {
    position: 'absolute',
    width: pos.w,
    height: pos.h,
    background: color,
    top: pos.top,
    bottom: pos.bottom,
    left: pos.left,
    right: pos.right,
  }
}
