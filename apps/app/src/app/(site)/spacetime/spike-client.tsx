'use client'

import {Preserve3dGlobeSpike} from '@/features/spacetime'

/** Client boundary for the M0.1 spike harness (`/spacetime?spike=1`). */
export function SpacetimeSpikeClient() {
  return <Preserve3dGlobeSpike />
}
