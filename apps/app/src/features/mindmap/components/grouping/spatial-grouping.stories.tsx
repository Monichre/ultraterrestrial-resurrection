import type { Meta, StoryObj } from '@storybook/react'
import { ReactFlowProvider, ReactFlow, type Node, type Edge } from '@xyflow/react'
import { SpatialGroupingOverlay } from './spatial-grouping-overlay'
import { EnhancedMindmapWithGrouping } from './enhanced-mindmap-with-grouping'
import { useMindMapStore } from '@/features/mindmap/store'
import { useEffect } from 'react'

const meta: Meta<typeof SpatialGroupingOverlay> = {
  title: 'Mindmap/SpatialGrouping',
  component: SpatialGroupingOverlay,
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

// Mock nodes positioned to form groups
const mockNodesWithGroups: Node[] = [
  // Group 1: Personnel cluster (top-left)
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
    id: 'person-2',
    type: 'default',
    position: { x: 180, y: 120 }, // Close to person-1
    data: {
      name: 'Commander Jake Morrison',
      type: 'personnel',
      label: 'Commander Jake Morrison'
    }
  },
  {
    id: 'person-3',
    type: 'default',
    position: { x: 140, y: 180 }, // Close to both above
    data: {
      name: 'Lt. Colonel Sarah Mitchell',
      type: 'personnel',
      label: 'Lt. Colonel Sarah Mitchell'
    }
  },
  
  // Group 2: Events cluster (center)
  {
    id: 'event-1',
    type: 'default',
    position: { x: 400, y: 200 },
    data: {
      name: 'Phoenix Lights Incident',
      type: 'events',
      label: 'Phoenix Lights Incident'
    }
  },
  {
    id: 'event-2',
    type: 'default',
    position: { x: 480, y: 240 }, // Close to event-1
    data: {
      name: 'USS Nimitz Encounter',
      type: 'events',
      label: 'USS Nimitz Encounter'
    }
  },
  
  // Group 3: Documents cluster (bottom-right)
  {
    id: 'doc-1',
    type: 'default',
    position: { x: 600, y: 400 },
    data: {
      name: 'Project Blue Book Report',
      type: 'documents',
      label: 'Project Blue Book Report'
    }
  },
  {
    id: 'doc-2',
    type: 'default',
    position: { x: 680, y: 420 }, // Close to doc-1
    data: {
      name: 'AATIP Assessment',
      type: 'documents',
      label: 'AATIP Assessment'
    }
  },
  {
    id: 'doc-3',
    type: 'default',
    position: { x: 640, y: 480 }, // Close to both above
    data: {
      name: 'Disclosure Timeline',
      type: 'documents',
      label: 'Disclosure Timeline'
    }
  },
  
  // Isolated nodes (should not form groups)
  {
    id: 'location-1',
    type: 'default',
    position: { x: 200, y: 400 }, // Far from others
    data: {
      name: 'Area 51',
      type: 'locations',
      label: 'Area 51'
    }
  },
  {
    id: 'org-1',
    type: 'default',
    position: { x: 500, y: 100 }, // Far from others
    data: {
      name: 'Pentagon UAP Task Force',
      type: 'organizations',
      label: 'Pentagon UAP Task Force'
    }
  }
]

const mockEdges: Edge[] = []

// Story wrapper that sets up the mindmap store
function StoryWrapper({ children, nodes = mockNodesWithGroups }: { children: React.ReactNode, nodes?: Node[] }) {
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
        <div className="h-screen bg-slate-900 relative">
          <ReactFlow
            nodes={mockNodesWithGroups}
            edges={mockEdges}
            fitView
            className="bg-slate-900"
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
          />
          <SpatialGroupingOverlay
            {...args}
            onCreateResearchSession={(group) => 
              console.log('Create research session for group:', group)
            }
            onAnalyzeGroup={(group) =>
              console.log('Analyze group:', group)
            }
            onGroupAction={(action, group) =>
              console.log('Group action:', action, group)
            }
          />
        </div>
      </StoryWrapper>
    </ReactFlowProvider>
  )
}

export const WithDenseGroups: Story = {
  render: (args) => {
    // Create more densely packed nodes for better grouping demonstration
    const denseNodes: Node[] = [
      // Large personnel cluster
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `person-${i + 1}`,
        type: 'default' as const,
        position: { 
          x: 100 + (i % 3) * 80, 
          y: 100 + Math.floor(i / 3) * 60 
        },
        data: {
          name: `Person ${i + 1}`,
          type: 'personnel',
          label: `Person ${i + 1}`
        }
      })),
      
      // Events cluster
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `event-${i + 1}`,
        type: 'default' as const,
        position: { 
          x: 400 + (i % 2) * 100, 
          y: 200 + Math.floor(i / 2) * 80 
        },
        data: {
          name: `UFO Event ${i + 1}`,
          type: 'events',
          label: `UFO Event ${i + 1}`
        }
      })),
      
      // Documents cluster
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `doc-${i + 1}`,
        type: 'default' as const,
        position: { 
          x: 600 + (i % 3) * 70, 
          y: 400 + Math.floor(i / 3) * 50 
        },
        data: {
          name: `Document ${i + 1}`,
          type: 'documents',
          label: `Document ${i + 1}`
        }
      }))
    ]
    
    return (
      <ReactFlowProvider>
        <StoryWrapper nodes={denseNodes}>
          <div className="h-screen bg-slate-900 relative">
            <ReactFlow
              nodes={denseNodes}
              edges={mockEdges}
              fitView
              className="bg-slate-900"
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            />
            <SpatialGroupingOverlay
              {...args}
              onCreateResearchSession={(group) => 
                console.log('Create research session for group:', group)
              }
              onAnalyzeGroup={(group) =>
                console.log('Analyze group:', group)
              }
              onGroupAction={(action, group) =>
                console.log('Group action:', action, group)
              }
            />
          </div>
        </StoryWrapper>
      </ReactFlowProvider>
    )
  }
}

export const FullEnhancedMindmap: Story = {
  render: (args) => (
    <ReactFlowProvider>
      <StoryWrapper>
        <div className="h-screen bg-slate-900">
          <EnhancedMindmapWithGrouping
            onCreateResearchSession={(source) => {
              console.log('Create research session:', source)
              alert(`Research session created for: ${
                'nodes' in source 
                  ? source.nodes.map(n => n.data?.name).join(' & ')
                  : source.groupId
              }`)
            }}
            onConnectNodes={(sourceId, targetId, reason) => {
              console.log('Connect nodes:', { sourceId, targetId, reason })
              alert(`Connected: ${sourceId} → ${targetId}\nReason: ${reason}`)
            }}
            onGroupAction={(action, group) => {
              console.log('Group action:', action, group)
            }}
          >
            <ReactFlow
              nodes={mockNodesWithGroups}
              edges={mockEdges}
              fitView
              className="bg-slate-900"
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            />
          </EnhancedMindmapWithGrouping>
        </div>
      </StoryWrapper>
    </ReactFlowProvider>
  )
}

export const InteractiveGroupingDemo: Story = {
  render: (args) => {
    return (
      <ReactFlowProvider>
        <StoryWrapper>
          <div className="h-screen bg-slate-900 flex">
            {/* Instructions panel */}
            <div className="w-80 p-6 bg-slate-800 border-r border-slate-700 overflow-y-auto">
              <h3 className="text-xl font-bold text-green-400 mb-4">
                Spatial Grouping Demo
              </h3>
              
              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">How Grouping Works:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Drag nodes close together (within 150px)</li>
                    <li>Groups form automatically after 2 seconds</li>
                    <li>Group boundaries appear with labels</li>
                    <li>Click groups to see management options</li>
                    <li>Groups become persistent over time</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">Group Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Visual Boundaries:</strong> Color-coded by entity type</li>
                    <li><strong>Smart Labels:</strong> Show entity counts and types</li>
                    <li><strong>Persistence:</strong> Groups survive node movement</li>
                    <li><strong>Confidence Scoring:</strong> Based on AI analysis</li>
                    <li><strong>Collapse/Expand:</strong> Manage workspace density</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">Group Actions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Analyze:</strong> AI relationship analysis</li>
                    <li><strong>Research Session:</strong> Create investigation workspace</li>
                    <li><strong>Collapse:</strong> Minimize visual footprint</li>
                    <li><strong>Dissolve:</strong> Break apart the group</li>
                  </ul>
                </div>
                
                <div className="bg-green-500/10 border border-green-400/30 rounded p-3">
                  <h4 className="font-semibold text-green-300 mb-1">Try This:</h4>
                  <p className="text-green-300 text-xs">
                    Group the personnel together, then create a research session 
                    to investigate their relationships. Notice how different entity 
                    types get different colored boundaries.
                  </p>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-400/30 rounded p-3">
                  <h4 className="font-semibold text-blue-300 mb-1">Color Coding:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-purple-400 rounded"></div>
                      <span>Personnel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-blue-400 rounded"></div>
                      <span>Events</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-green-400 rounded"></div>
                      <span>Documents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-amber-400 rounded"></div>
                      <span>Locations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mindmap area */}
            <div className="flex-1 relative">
              <EnhancedMindmapWithGrouping
                onCreateResearchSession={(source) => {
                  console.log('Create research session:', source)
                  const entityNames = 'nodes' in source 
                    ? source.nodes.map(n => n.data?.name).join(' & ')
                    : `Group ${source.groupId.slice(0, 8)}...`
                  alert(`✅ Research session created!\n\nEntities: ${entityNames}\n\nThis would open a new research workspace with these entities ready for investigation.`)
                }}
                onConnectNodes={(sourceId, targetId, reason) => {
                  console.log('Connect nodes:', { sourceId, targetId, reason })
                  alert(`🔗 Nodes connected!\n\n${sourceId} → ${targetId}\n\nReason: ${reason}`)
                }}
                onGroupAction={(action, group) => {
                  console.log('Group action:', action, group)
                  if (action === 'analyze') {
                    alert(`🧠 Analyzing group...\n\nEntities: ${group.nodes.length}\nType: ${group.metadata.dominantType}\nConfidence: ${Math.round(group.metadata.confidence * 100)}%`)
                  }
                }}
              >
                <ReactFlow
                  nodes={mockNodesWithGroups}
                  edges={mockEdges}
                  fitView
                  className="bg-slate-900"
                  nodesDraggable={true}
                  nodesConnectable={true}
                  elementsSelectable={true}
                />
              </EnhancedMindmapWithGrouping>
            </div>
          </div>
        </StoryWrapper>
      </ReactFlowProvider>
    )
  }
}

export const GroupManagementShowcase: Story = {
  render: (args) => {
    // Pre-arranged nodes to demonstrate different group states
    const showcaseNodes: Node[] = [
      // Persistent group (personnel)
      {
        id: 'person-a1',
        type: 'default',
        position: { x: 100, y: 100 },
        data: { name: 'Dr. Elena Vasquez', type: 'personnel', label: 'Dr. Elena Vasquez' }
      },
      {
        id: 'person-a2',
        type: 'default',
        position: { x: 170, y: 130 },
        data: { name: 'Commander Morrison', type: 'personnel', label: 'Commander Morrison' }
      },
      
      // Temporary group (events) 
      {
        id: 'event-b1',
        type: 'default',
        position: { x: 350, y: 200 },
        data: { name: 'Phoenix Lights', type: 'events', label: 'Phoenix Lights' }
      },
      {
        id: 'event-b2',
        type: 'default',
        position: { x: 420, y: 220 },
        data: { name: 'USS Nimitz', type: 'events', label: 'USS Nimitz' }
      },
      
      // Mixed type group (documents + locations)
      {
        id: 'doc-c1',
        type: 'default',
        position: { x: 600, y: 150 },
        data: { name: 'Blue Book Report', type: 'documents', label: 'Blue Book Report' }
      },
      {
        id: 'location-c1',
        type: 'default',
        position: { x: 650, y: 190 },
        data: { name: 'Roswell', type: 'locations', label: 'Roswell' }
      }
    ]
    
    return (
      <ReactFlowProvider>
        <StoryWrapper nodes={showcaseNodes}>
          <div className="h-screen bg-slate-900 relative">
            <ReactFlow
              nodes={showcaseNodes}
              edges={mockEdges}
              fitView
              className="bg-slate-900"
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
            />
            <SpatialGroupingOverlay
              {...args}
              onCreateResearchSession={(group) => 
                console.log('Create research session for group:', group)
              }
              onAnalyzeGroup={(group) =>
                console.log('Analyze group:', group)
              }
              onGroupAction={(action, group) =>
                console.log('Group action:', action, group)
              }
            />
            
            {/* Demo info overlay */}
            <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 max-w-sm">
              <h4 className="text-green-400 font-semibold mb-2">Group States Demo</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div>
                  <span className="text-purple-400">■</span> Personnel group (persistent)
                </div>
                <div>
                  <span className="text-blue-400">■</span> Events group (temporary)
                </div>
                <div>
                  <span className="text-green-400">■</span> Mixed type group
                </div>
              </div>
            </div>
          </div>
        </StoryWrapper>
      </ReactFlowProvider>
    )
  }
}