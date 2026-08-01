'use client'

import {useSearchParams} from 'next/navigation'
import {Suspense} from 'react'
import {Preserve3dGlobeSpike, SpacetimeCanvas} from '@/features/spacetime'

/**
 * /spacetime — Spacetime Canvas
 *
 * Sibling to /research-canvas (D3: sits beside /sightings + /timeline for M0).
 * `?spike=1` hosts the M0.1 frame-timing measurement harness.
 */
function SpacetimePageInner() {
  const params = useSearchParams()
  if (params.get('spike') === '1') {
    return <Preserve3dGlobeSpike />
  }
  return <SpacetimeCanvas />
}

export default function SpacetimePage() {
  return (
    <Suspense fallback={<div className='min-h-dvh bg-neutral-950' />}>
      <SpacetimePageInner />
    </Suspense>
  )
}
