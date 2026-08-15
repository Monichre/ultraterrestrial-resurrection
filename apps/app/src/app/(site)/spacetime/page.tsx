import {SpacetimeCanvas} from '@/features/spacetime'
import {loadSpacetimeEvents} from '@/features/spacetime/actions/load-spacetime-events'
import {SpacetimeSpikeClient} from './spike-client'

/**
 * /spacetime — Spacetime Canvas
 *
 * Sibling to /research-canvas (D3: sits beside /sightings + /timeline for M0).
 * Server-preloads the curated `events` corpus so first paint has stations +
 * pins. The range is left to the action's default, which spans antiquity to
 * the present — pinning it to 1940 here would drop the deep-time records.
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

  const initialData = await loadSpacetimeEvents({limit: 400})

  return <SpacetimeCanvas initialData={initialData} />
}
