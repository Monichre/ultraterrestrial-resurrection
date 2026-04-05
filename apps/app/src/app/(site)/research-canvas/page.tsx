import {Suspense} from 'react'

import {MindMap} from '@/features/mindmap'

import {Loading} from '@/features/sightings/components/loaders/loading'
import {
  type NetworkGraphPayload,
  getBoundedInitialGraphData,
} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {StateOfDisclosureProvider} from '@/contexts'

export default async function Index() {
  const data: NetworkGraphPayload = await getBoundedInitialGraphData({ maxNodesPerType: 30 })

  return (
    <Suspense fallback={<Loading />}>
      <StateOfDisclosureProvider stateOfDisclosure={data}>
        <MindMap />
      </StateOfDisclosureProvider>
    </Suspense>
  )
}
