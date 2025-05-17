import {EntityNetworkGraph3D} from '@/features/3d/entity-network-graph-3d'
import {
  type NetworkGraphPayload,
  getEntityNetworkGraphData,
} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {Suspense} from 'react'
import {InAppNavbar} from '@/components/navbar/navbar'

export default async function Index() {
  const data: NetworkGraphPayload = await getEntityNetworkGraphData()

  // {/* <Graph models={models} /> */}

  return (
    <Suspense fallback={null}>
      <InAppNavbar color='white' />
      <EntityNetworkGraph3D {...data} />
    </Suspense>
  )
}
