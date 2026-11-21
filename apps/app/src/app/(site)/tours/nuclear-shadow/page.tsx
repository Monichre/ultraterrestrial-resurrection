import {redirect} from 'next/navigation'

/**
 * Deep-link alias (T-050 subtask 3). The Nuclear Shadow tour no longer has a
 * canvas of its own — it renders on the research canvas' single ReactFlow.
 * `?resume=1` is forwarded so saved progress still restores.
 */
export default async function NuclearShadowTourPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const resume = params.resume === '1' ? '&resume=1' : ''
  redirect(`/research-canvas?tour=nuclear-shadow${resume}`)
}
