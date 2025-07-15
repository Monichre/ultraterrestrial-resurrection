'use client'
import IntegratedDashboard from '@/components/integrated-dashboard'
import KnowledgeBaseBrowser from '@/components/knowledge-base-browser'
import './globals.css'
import {TapedNote} from '@/components/taped-note/taped-note'
import AnimatedFolder from '@/components/animated-folder'
import DeskFiles from '@/components/desk-files'
import ClassifiedDocumentViewer from '@/components/research-base/classified-document-viewer'
import {Database} from 'lucide-react'
import DatabaseWithRestApi from '@/database-animation'
import EvidenceConnectionsPage from '@/components/evidence-connections-page'

// Additional components
import ClassificationBanner from '@/components/classification-banner'
import Dashboard from '@/components/dashboard'
import DataGrid from '@/components/data-grid'
import EvidenceBrowser from '@/components/evidence-browser'
import EvidenceCard from '@/components/evidence-card'
import EvidenceConnections from '@/components/evidence-connections'
import EvidenceDetailSidebar from '@/components/evidence-detail-sidebar'
import EvidenceNetwork from '@/components/evidence-network'
import FileCard from '@/components/file-card'
import {GridBackground} from '@/components/grid-background'
import {GridOverlay} from '@/components/grid-overlay'
import NavigationBar from '@/components/navigation-bar'

import {SectionHeader} from '@/components/section-header'
import {SpaceHud} from '@/components/space-hud/space-hud'
import {StackedCards} from '@/components/stacked-cards'
import {TechCorners} from '@/components/tech-corners'
import {TechGridBackground} from '@/components/tech-grid-background'
import {TechSection} from '@/components/tech-section'
import {TerminalDisplay} from '@/components/terminal-display'
import {Terminal} from '@/components/terminal/terminal'
import {GraphPaperBackground} from '@/components/graph-paper-background/graph-paper-background'

// Research base components
import AlternativeGlobe from '@/components/research-base/alternative-globe'
import CodepenGlobe from '@/components/research-base/codepen-globe'
import DocumentSecurityControls from '@/components/research-base/document-security-controls'
import GlobeVisualization from '@/components/research-base/globe-visualization'
import Globe from '@/components/research-base/globe'
import HudInterface from '@/components/research-base/hud-interface'
import ResearchBase from '@/components/research-base/research-base'
import ResearchDocuments from '@/components/research-base/research-documents'
import SightingDatabase from '@/components/research-base/sighting-database'

// TipTap editor components
import {SimpleEditor} from '@/components/tiptap/tiptap-templates/simple/simple-editor'
import {RAGEnhancedEditor} from '@/components/tiptap/tiptap-templates/rag-enhanced/rag-enhanced-editor'

export default async function Index() {
  // Mock data for components
  const mockRecord = {
    id: 1,
    year: '2024',
    type: 'Research',
    category: 'CLASSIFIED',
    title: 'ULTRATERRESTRIAL RESEARCH',
    image: '/placeholder-logo.png',
    isLocked: false,
  }

  const mockEvidence = {
    id: '1',
    title: 'Sample Evidence',
    description: 'Test evidence item',
    category: 'Sighting',
    date: '2024-01-01',
    location: 'Unknown',
  }

  const mockFile = {
    id: '1',
    name: 'Sample File',
    type: 'document',
    size: '1.2MB',
    date: '2024-01-01',
  }

  return (
    <div className='min-h-screen bg-neutral-950 text-white'>
      {/* Component Showcase */}
      <div className='p-8 space-y-16'>
        {/* Header */}
        <div className='text-center py-8'>
          <h1 className='text-4xl font-bold text-green-400 mb-4'>
            Component Showcase
          </h1>
          <p className='text-gray-400'>All components displayed for review</p>
        </div>

        {/* Navigation & Layout Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Navigation & Layout
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Classification Banner
            </h3>
            <ClassificationBanner />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Navigation Bar
            </h3>
            <NavigationBar />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Section Header
            </h3>
            <SectionHeader title='Sample Section' />
          </div>
        </section>

        {/* Dashboard Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Dashboard Components
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Integrated Dashboard
            </h3>
            <IntegratedDashboard />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Dashboard
            </h3>
            <Dashboard />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Data Grid
            </h3>
            <DataGrid />
          </div>
        </section>

        {/* Evidence & Research Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Evidence & Research
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Evidence Browser
            </h3>
            <EvidenceBrowser />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Evidence Card
            </h3>
            <EvidenceCard evidence={mockEvidence} />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Evidence Connections
            </h3>
            <EvidenceConnections />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Evidence Connections Page
            </h3>
            <EvidenceConnectionsPage />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Evidence Network
            </h3>
            <EvidenceNetwork />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Knowledge Base Browser
            </h3>
            <KnowledgeBaseBrowser />
          </div>
        </section>

        {/* File & Document Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            File & Document Management
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              File Card
            </h3>
            <FileCard file={mockFile} />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Taped Note
            </h3>
            <TapedNote record={mockRecord} />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Animated Folder
            </h3>
            <AnimatedFolder
              folder={{
                id: 'folder-1',
                name: 'Sample Folder',
                files: [
                  {id: 'file-1', name: 'Document 1.pdf', type: 'file'},
                  {id: 'file-2', name: 'Image 1.jpg', type: 'file'},
                ],
              }}
            />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Desk Files
            </h3>
            <DeskFiles />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Stacked Cards
            </h3>
            <StackedCards />
          </div>
        </section>

        {/* Research Base Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Research Base
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Classified Document Viewer
            </h3>
            <ClassifiedDocumentViewer />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Research Base
            </h3>
            <ResearchBase />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Research Documents
            </h3>
            <ResearchDocuments />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Document Security Controls
            </h3>
            <DocumentSecurityControls />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Sighting Database
            </h3>
            <SightingDatabase />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Anomaly Detection
            </h3>
            <AnomolyDetection />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              HUD Interface
            </h3>
            <HudInterface />
          </div>
        </section>

        {/* Visual & Interface Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Visual & Interface
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Globe Visualization
            </h3>
            <GlobeVisualization />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>Globe</h3>
            <Globe />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Alternative Globe
            </h3>
            <AlternativeGlobe />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Codepen Globe
            </h3>
            <CodepenGlobe />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Space HUD
            </h3>
            <SpaceHud />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Pulsing Disk
            </h3>
            <PulsingDisk />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Tech Corners
            </h3>
            <TechCorners />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Tech Section
            </h3>
            <TechSection />
          </div>
        </section>

        {/* Background Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Background Components
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64 overflow-hidden'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Grid Background
            </h3>
            <GridBackground />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64 overflow-hidden'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Grid Overlay
            </h3>
            <GridOverlay />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64 overflow-hidden'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Tech Grid Background
            </h3>
            <TechGridBackground />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg relative h-64 overflow-hidden'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Graph Paper Background
            </h3>
            <GraphPaperBackground />
          </div>
        </section>

        {/* Terminal Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Terminal Components
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Terminal Display
            </h3>
            <TerminalDisplay />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Terminal
            </h3>
            <Terminal />
          </div>
        </section>

        {/* Editor Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Editor Components
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Simple Editor
            </h3>
            <SimpleEditor />
          </div>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              RAG Enhanced Editor
            </h3>
            <RagEnhancedEditor />
          </div>
        </section>

        {/* Database Components */}
        <section className='space-y-8'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Database Components
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Database Animation
            </h3>
            <DatabaseWithRestApi />
          </div>
        </section>

        {/* Detail Components */}
        <section className='space-y-8 mb-16'>
          <h2 className='text-2xl font-bold text-green-400 border-b border-green-400 pb-2'>
            Detail Components
          </h2>

          <div className='bg-neutral-900 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold mb-4 text-gray-300'>
              Evidence Detail Sidebar
            </h3>
            <EvidenceDetailSidebar />
          </div>
        </section>
      </div>
    </div>
  )
}
