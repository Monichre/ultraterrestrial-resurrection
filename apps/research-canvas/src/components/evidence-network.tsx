'use client'

import {useState} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import EvidenceBrowser from './evidence-browser'
import EvidenceConnections from './evidence-connections'
import DeskFiles from './desk-files'
import {Card} from '@/components/ui/card'
import {Network, List, FileText} from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'image'
  size?: string
}

export default function EvidenceNetwork() {
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Handle node selection in the connections view
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId)

    // Convert node ID to evidence format for the sidebar
    setSelectedEvidence({
      id: nodeId,
      type: 'document',
      status: 'active',
      date: '2077-03-15',
      details: `Evidence file ${nodeId}`,
      metadata: {
        createdBy: 'System',
        lastModified: '2077-03-15 21:27:18',
        fileSize: '1.2 GB',
        format: 'Quantum Data Stream',
      },
    })
  }

  // Handle file selection in the browser view
  const handleFileSelect = (file: FileItem) => {
    setSelectedEvidence({
      id: file.id,
      type: file.type,
      status: 'active',
      date: '2077-03-15',
      details: `Evidence file: ${file.name}`,
      metadata: {
        createdBy: 'System',
        lastModified: '2077-03-15 21:27:18',
        fileSize: file.size || 'Unknown',
        format: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      },
    })
  }
  return (
    <Card className='border-neutral-800/50 bg-black/20 backdrop-blur-sm h-auto  min-h-[600px] flex flex-col relative'>
      <Tabs defaultValue='connections' className='w-full h-full flex flex-col'>
        <div className='border-b border-neutral-800 p-4'>
          <TabsList className='bg-neutral-900/50 border border-neutral-800'>
            <TabsTrigger
              value='connections'
              className='data-[state=active]:bg-neutral-800'
            >
              <Network className='h-4 w-4 mr-2' />
              Drawing board
            </TabsTrigger>
            <TabsTrigger
              value='browser'
              className='data-[state=active]:bg-neutral-800'
            >
              <List className='h-4 w-4 mr-2' />
              Case Files
            </TabsTrigger>
            <TabsTrigger
              value='details'
              className='data-[state=active]:bg-neutral-800'
            >
              <FileText className='h-4 w-4 mr-2' />
              Desk
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='connections' className='mt-0 flex-1 h-full'>
          <EvidenceConnections onNodeSelect={handleNodeSelect} />
        </TabsContent>

        <TabsContent value='browser' className='mt-0 flex-1 h-full'>
          <EvidenceBrowser />
        </TabsContent>

        <TabsContent
          value='details'
          className='mt-0 flex-1 h-full overflow-hidden'
        >
          <DeskFiles />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
