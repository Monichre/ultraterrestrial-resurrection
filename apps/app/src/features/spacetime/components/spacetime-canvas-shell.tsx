'use client'

import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

/**
 * Two-layer Spacetime Canvas shell, mirroring the v0 timeline-explorer seam
 * inspected 2026-08-01:
 *
 *   .fixed.inset-0     → BACKGROUND slot (live Mapbox/deck.gl globe)
 *   .absolute.inset-0  → NARRATIVE layer (CSS 3D / preserve-3d scroll cards)
 *
 * The background is a *slot*. Narrative never owns WebGL.
 * Plan: docs/PLANS/2026-08-01-spacetime-canvas-implementation.md §1
 */

export interface SpacetimeCanvasShellProps {
  background: ReactNode
  narrative: ReactNode
  chrome?: ReactNode
  className?: string
}

export function SpacetimeCanvasShell({
  background,
  narrative,
  chrome,
  className,
}: SpacetimeCanvasShellProps) {
  return (
    <div className={cn('relative h-dvh w-full overflow-hidden bg-neutral-950', className)}>
      {/* BACKGROUND SLOT — live globe / era plate lives here */}
      <div
        data-spacetime-layer='background'
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden bg-neutral-950'
      >
        {background}
      </div>

      {/* NARRATIVE LAYER — CSS 3D cards fly toward the viewer on scroll */}
      <div
        data-spacetime-layer='narrative'
        className='absolute inset-0 z-10 overflow-y-auto overscroll-contain'
        style={{perspective: '900px'}}
      >
        <div className='relative min-h-[400vh] w-full' style={{transformStyle: 'preserve-3d'}}>
          {narrative}
        </div>
      </div>

      {/* CHROME — dial, layer mixer, readouts; above narrative */}
      {chrome ? (
        <div data-spacetime-layer='chrome' className='pointer-events-none absolute inset-0 z-20'>
          <div className='pointer-events-auto'>{chrome}</div>
        </div>
      ) : null}
    </div>
  )
}
