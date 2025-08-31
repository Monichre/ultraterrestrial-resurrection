import {Suspense} from 'react'

import {MindMap} from '@/features/mindmap'

import {Loading} from '@/features/data-viz/sightings/components/loaders/loading'
import {
  type NetworkGraphPayload,
  getEntityNetworkGraphData,
} from '@/features/mindmap/actions/get-entity-network-graph-data'
import {InAppNavbar} from '@/components/navbar/navbar'

// import {MindMapCursor} from '@/components/cursors'
import {MindMapProvider, StateOfDisclosureProvider} from '@/contexts'
import {EnhancedMindmapWithTourIntegration} from '@/features/mindmap/components/enhanced-mindmap-with-tour-integration'
import {ReactFlowProvider} from '@xyflow/react'

// import { useChatRuntime } from "@assistant-ui/react-ai-sdk"

export default async function Index() {
  const data: NetworkGraphPayload = await getEntityNetworkGraphData()

  console.log('🚀 ~ Index ~ data:', data)

  return (
    // <AssistantRuntimeProvider runtime={runtime}>

    <Suspense fallback={<Loading />}>
      {/* <MindMapCursor type="gooey" /> */}
      <InAppNavbar color='white' />
      <StateOfDisclosureProvider stateOfDisclosure={data}>
        <ReactFlowProvider>
          <MindMapProvider>
            <EnhancedMindmapWithTourIntegration>
              <MindMap />
            </EnhancedMindmapWithTourIntegration>
          </MindMapProvider>
        </ReactFlowProvider>
      </StateOfDisclosureProvider>
    </Suspense>

    // </AssistantRuntimeProvider>
  )
}
