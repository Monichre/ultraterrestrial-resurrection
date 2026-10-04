import type { Meta, StoryObj } from '@storybook/react'
import { ReactFlowProvider, ReactFlow, type Node, type Edge } from '@xyflow/react'
import { ProximityAnalyzer } from './proximity-analyzer'
import { ProximityEnhancedMindmap } from './proximity-enhanced-mindmap'
import { useMindMapStore } from '@/features/mindmap/store'
import { useEffect } from 'react'

const meta: Meta<typeof ProximityAnalyzer> = {
  title: 'Mindmap/ProximityAnalyzer',
  component: ProximityAnalyzer,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'slate', value: '#1e293b' }
      ]
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Mock nodes for proximity testing
const mockNodes: Node[] = [
  {
    id: 'person-1',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { 
      name: 'Dr. Elena Vasquez',
      type: 'personnel',
      label: 'Dr. Elena Vasquez'
    }
  },
  {
    id: 'event-1', 
    type: 'default',
    position: { x: 200, y: 120 }, // Close to person-1
    data: {
      name: 'Phoenix Lights Incident',
      type: 'events',
      label: 'Phoenix Lights Incident'
    }
  },
  {
    id: 'doc-1',
    type: 'default',
    position: { x: 400, y: 300 }, // Far from others
    data: {
      name: 'Project Blue Book Report',
      type: 'documents', 
      label: 'Project Blue Book Report'
    }
  },
  {
    id: 'person-2',
    type: 'default',
    position: { x: 180, y: 200 }, // Close to event-1
    data: {
      name: 'Commander Jake Morrison',
      type: 'personnel',
      label: 'Commander Jake Morrison'
    }
  }
]

const mockEdges: Edge[] = []

// Story wrapper that sets up the mindmap store
function StoryWrapper({ children, nodes = mockNodes }: { children: React.ReactNode, nodes?: Node[] }) {
  const { setNodes, setEdges } = useMindMapStore()
  
  useEffect(() => {
    setNodes(nodes)
    setEdges(mockEdges)
  }, [setNodes, setEdges, nodes])
  
  return <>{children}</>
}

export const Default: Story = {
  render: (args) => (
    <ReactFlowProvider>
      <StoryWrapper>
        <div className="h-screen bg-slate-900 p-4">
          <ProximityAnalyzer
            {...args}
            onCreateResearchSession={(analysis) => 
              console.log('Create research session:', analysis)
            }
            onConnectNodes={(sourceId, targetId, reason) =>
              console.log('Connect nodes:', { sourceId, targetId, reason })
            }
          />
        </div>
      </StoryWrapper>
    </ReactFlowProvider>
  )
}

export const WithProximityGroups: Story = {
  render: (args) => {
    // Nodes positioned close together to trigger proximity
    const closeNodes: Node[] = [
      {
        id: 'person-1',
        type: 'default',
        position: { x: 100, y: 100 },
        data: { 
          name: 'Dr. Elena Vasquez',
          type: 'personnel',
          label: 'Dr. Elena Vasquez'
        }
      },
      {
        id: 'event-1', 
        type: 'default',
        position: { x: 150, y: 120 }, // Very close (70px distance)
        data: {
          name: 'Phoenix Lights Incident',
          type: 'events',
          label: 'Phoenix Lights Incident'
        }
      },
      {
        id: 'person-2',
        type: 'default',
        position: { x: 200, y: 140 }, // Close to both (about 100px)
        data: {
          name: 'Commander Jake Morrison',
          type: 'personnel',
          label: 'Commander Jake Morrison'
        }
      }
    ]
    
    return (
      <ReactFlowProvider>
        <StoryWrapper nodes={closeNodes}>
          <div className="h-screen bg-slate-900 p-4">
            <ProximityAnalyzer
              {...args}
              onCreateResearchSession={(analysis) => 
                console.log('Create research session:', analysis)
              }
              onConnectNodes={(sourceId, targetId, reason) =>
                console.log('Connect nodes:', { sourceId, targetId, reason })
              }
            />
          </div>
        </StoryWrapper>
      </ReactFlowProvider>
    )
  }
}

export const FullMindmapIntegration: Story = {
  render: (args) => (
    <ReactFlowProvider>
      <StoryWrapper>
        <div className="h-screen bg-slate-900">
          <ProximityEnhancedMindmap
            onCreateResearchSession={(analysis) => 
              console.log('Create research session:', analysis)
            }
            onConnectNodes={(sourceId, targetId, reason) =>
              console.log('Connect nodes:', { sourceId, targetId, reason })
            }
         >
            <ReactFlow
              nodes={mockNodes}
              edges={mockEdges}
              fitView
              className="bg-slate-900"
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            />
          </ProximityEnhancedMindmap>
        </div>
      </StoryWrapper>
    </ReactFlowProvider>
  )
}

export const InteractiveDemo: Story = {
  render: (args) => {
    return (
      <ReactFlowProvider>
        <StoryWrapper>
          <div className="h-screen bg-slate-900 flex">
            {/* Instructions */}
            <div className="w-80 p-6 bg-slate-800 border-r border-slate-700">
              <h3 className="text-xl font-bold text-green-400 mb-4">
                Proximity Analysis Demo
              </h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">How to test:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Drag nodes close together (within 150px)</li>
                    <li>Wait 2 seconds for AI analysis to trigger</li>
                    <li>View relationships and suggested connections</li>
                    <li>Create research sessions or auto-connect nodes</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Real-time proximity detection</li>
                    <li>AI-powered relationship analysis</li>
                    <li>Automatic research session creation</li>
                    <li>Smart node connection suggestions</li>
                    <li>Event history tracking</li>
                  </ul>
                </div>
                
                <div className="bg-green-500/10 border border-green-400/30 rounded p-3">
                  <p className="text-green-300 text-xs">
                    <strong>Tip:</strong> Try grouping personnel with events, 
                    or documents with locations to see different analysis patterns.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mindmap with proximity analysis */}
            <div className="flex-1 relative">
              <ProximityEnhancedMindmap
                onCreateResearchSession={(analysis) => {
                  console.log('Create research session:', analysis)
                  alert(`Research session created for: ${analysis.nodes.map(n => n.data?.name).join(' & ')}`)
                }}
                onConnectNodes={(sourceId, targetId, reason) => {
                  console.log('Connect nodes:', { sourceId, targetId, reason })
                  alert(`Connected nodes: ${sourceId} → ${targetId}\nReason: ${reason}`)
                }}
             >
                <ReactFlow
                  nodes={mockNodes}
                  edges={mockEdges}
                  fitView
                  className="bg-slate-900"
                  nodesDraggable={true}
                  nodesConnectable={true}
                  elementsSelectable={true}
                />
              </ProximityEnhancedMindmap>
            </div>
          </div>
        </StoryWrapper>
      </ReactFlowProvider>
    )
  }
}

export const CompactSidebar: Story = {
  render: (args) => (
    <ReactFlowProvider>
      <StoryWrapper>
        <div className="h-screen bg-slate-900 flex">
          <div className="flex-1 bg-slate-800 p-4">
            <h3 className="text-white text-lg mb-4">Main Mindmap Area</h3>
            <p className="text-slate-400">
              Proximity analyzer can be used as a sidebar component
            </p>
          </div>
          <div className="w-80 border-l border-slate-700">
            <ProximityAnalyzer
              {...args}
              className="h-full rounded-none border-0"
              onCreateResearchSession={(analysis) => 
                console.log('Create research session:', analysis)
              }
              onConnectNodes={(sourceId, targetId, reason) =>
                console.log('Connect nodes:', { sourceId, targetId, reason })
              }
            />
          </div>
        </div>
      </StoryWrapper>
    </ReactFlowProvider>
  )
}