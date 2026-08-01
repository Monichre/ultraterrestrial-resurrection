'use client'

import {Preserve3dGlobeSpike} from '@/features/spacetime'

/**
 * /spacetime — Spacetime Canvas entry
 *
 * Currently hosts the M0.1 frame-timing spike (globe under preserve-3d).
 * Product shell lands after D1/D2/D3 confirmations — see T-047 and
 * docs/PLANS/2026-08-01-spacetime-canvas-implementation.md.
 *
 * Sibling to /research-canvas: ideas vs evidence-in-spacetime.
 */
export default function SpacetimePage() {
  return <Preserve3dGlobeSpike />
}
