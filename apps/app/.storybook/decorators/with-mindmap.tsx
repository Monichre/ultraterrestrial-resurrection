import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { StateOfDisclosureProvider } from '../../src/contexts/state-of-disclosure-provider'
import { MindMapProvider } from '../../src/contexts/mindmap'

// Minimal default fixture for StateOfDisclosureProvider and MindMap stories
const DEFAULT_FIXTURE = {
  records: {
    topics: [],
    events: [],
    personnel: [],
    testimonies: [],
    organizations: [],
    documents: [],
    artifacts: [],
  },
  connections: {
    topicsExpertsConnections: [],
    eventsExpertsConnections: [],
    eventsTopicsExpertsConnections: [],
    topicsTestimoniesConnections: [],
    organizationsPersonnelConnections: [],
  },
  graphData: {
    nodes: [
      { id: 'events-root-node', data: { type: 'events', label: 'Events' } },
      { id: 'topics-root-node', data: { type: 'topics', label: 'Topics' } },
    ],
    links: [],
  },
}

export function withMindmapProviders(Story: any, context: any) {
  const title: string = (context?.title ?? context?.kind ?? '') as string
  if (!title.startsWith('Mindmap/')) {
    return <Story />
  }
  const fixture = context?.parameters?.mindmap?.fixture ?? DEFAULT_FIXTURE
  return (
    <ReactFlowProvider>
      <StateOfDisclosureProvider
        stateOfDisclosure={{
          records: fixture.records,
          connections: fixture.connections,
          graphData: fixture.graphData,
        }}
      >
        <MindMapProvider>
          <div className="min-h-screen bg-black">
            <Story />
          </div>
        </MindMapProvider>
      </StateOfDisclosureProvider>
    </ReactFlowProvider>
  )
}
