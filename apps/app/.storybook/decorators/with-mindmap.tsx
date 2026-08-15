import React from 'react'
import {ReactFlowProvider} from '@xyflow/react'
import {StateOfDisclosureProvider} from '../../src/contexts/state-of-disclosure-provider'
import {MindMapProvider} from '../../src/contexts/mindmap/mindmap-context'

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
      {id: 'events-root-node', data: {type: 'events', label: 'Events'}},
      {id: 'topics-root-node', data: {type: 'topics', label: 'Topics'}},
    ],
    links: [],
  },
}

// Error boundary for mindmap context issues
class MindMapErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean; error?: Error}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error}
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('MindMap context error in Storybook:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <h3 className="text-red-400 font-bold mb-2">MindMap Context Error</h3>
          <p className="text-red-300 text-sm">
            This component requires MindMap context but failed to load properly in Storybook.
          </p>
          <details className="mt-2">
            <summary className="text-red-400 cursor-pointer">Error details</summary>
            <pre className="text-xs mt-1 text-red-300 whitespace-pre-wrap">
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export function withMindmapProviders(Story: any, context: any) {
  const title: string = (context?.title ?? context?.kind ?? '') as string
  
  // Components that definitely need MindMap context
  const needsMindMapContext = 
    title.startsWith('Mindmap/') ||
    title.includes('MindMap') ||
    title.includes('Connected Records') ||
    title.includes('Bottom Menu') ||
    title.includes('Smart Bottom') ||
    title.includes('Proximity') ||
    title.includes('Spatial Grouping') ||
    title.includes('Location Visualization') ||
    title.includes('Node Dropdown') ||
    title.includes('Dynamic Toolbar') ||
    title.includes('Sibling Edge') ||
    // Add common patterns that indicate mindmap usage
    context?.parameters?.needsMindMap === true

  // If component doesn't need mindmap context, render without providers
  if (!needsMindMapContext) {
    return <Story />
  }

  const fixture = context?.parameters?.mindmap?.fixture ?? DEFAULT_FIXTURE

  return (
    <MindMapErrorBoundary>
      <StateOfDisclosureProvider
        stateOfDisclosure={{
          records: fixture.records,
          connections: fixture.connections,
          graphData: fixture.graphData,
        }}>
        <ReactFlowProvider>
          <MindMapProvider>
            <div className='min-h-screen bg-black'>
              <Story />
            </div>
          </MindMapProvider>
        </ReactFlowProvider>
      </StateOfDisclosureProvider>
    </MindMapErrorBoundary>
  )
}
