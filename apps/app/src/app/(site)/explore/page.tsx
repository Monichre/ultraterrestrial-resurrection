import {EntityNetworkGraph3D} from '@/features/3d/entity-network-graph-3d'
import {getEntityNetworkGraphData} from '@db/src/xata-typescript-sdk/api'
import {InAppNavbar} from '@/components/navbar/navbar'
import {Suspense} from 'react'

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
