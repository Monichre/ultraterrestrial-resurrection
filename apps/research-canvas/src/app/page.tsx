'use client'
import IntegratedDashboard from '@/components/integrated-dashboard'
import KnowledgeBaseBrowser from '@/components/knowledge-base-browser'
import './globals.css'
import {TapedNote} from '@/components/taped-note/taped-note'
import AnimatedFolder from '@/components/animated-folder'

import DeskFiles from '@/components/desk-files'
import ClassifiedDocumentViewer from '@/components/research-base/classified-document-viewer'
import {Database} from 'lucide-react'
import DatabaseWithRestApi from 'database-animation'
import EvidenceConnectionsPage from '@/components/evidence-connections-page'

export default async function Index() {
  // Mock record for TapedNote component
  const mockRecord = {
    id: 1,
    year: '2024',
    type: 'Research',
    category: 'CLASSIFIED',
    title: 'ULTRATERRESTRIAL RESEARCH',
    image: '/placeholder-logo.png',
    isLocked: false,
  }

  return (
    <div className='min-h-screen bg-neutral-950 pt-20 p-12'>
      <IntegratedDashboard />
      <KnowledgeBaseBrowser />
      <ClassifiedDocumentViewer />
      <TapedNote record={mockRecord} />
      <AnimatedFolder
        folder={{
          id: 'folder-1',
          name: 'Folder 1',
          files: [
            {id: 'file-1', name: 'File 1', type: 'file'},
            {id: 'file-2', name: 'File 2', type: 'file'},
          ],
        }}
      />
      <AnimatedFolder
        folder={{
          id: 'folder-2',
          name: 'Folder 2',
          files: [],
        }}
      />
      <AnimatedFolder
        folder={{
          id: 'folder-3',
          name: 'Folder 3',
          files: [],
        }}
      />
      <DeskFiles />
      <DatabaseWithRestApi />
      <EvidenceConnectionsPage />
    </div>
  )
}
