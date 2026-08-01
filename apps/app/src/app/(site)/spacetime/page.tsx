import {SpacetimeCanvas} from '@/features/spacetime'
import {loadSpacetimeEvents} from '@/features/spacetime/actions/load-spacetime-events'
import {SpacetimeSpikeClient} from './spike-client'

/**
 * /spacetime — Spacetime Canvas
 *
 * Sibling to /research-canvas (D3: sits beside /sightings + /timeline for M0).
 * Server-preloads a bounded sightings window so first paint has stations + pins.
 * `?spike=1` hosts the M0.1 frame-timing measurement harness.
 */
export default async function SpacetimePage({
  searchParams,
}: {
  searchParams: Promise<{spike?: string}>
}) {
  const params = await searchParams
  if (params.spike === '1') {
    return <SpacetimeSpikeClient />
  }

  const initialData = await loadSpacetimeEvents({
    startYear: 1940,
    endYear: new Date().getUTCFullYear(),
    limit: 400,
  })

  return <SpacetimeCanvas initialData={initialData} />
}
