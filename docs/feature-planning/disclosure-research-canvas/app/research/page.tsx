'use client'
import {useState} from 'react'
import ClassifiedDocumentViewer from '@/components/research-base/classified-document-viewer'
import HUDInterface from '@/components/research-base/hud-interface'

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<'hud' | 'document'>('document')

  return (
    <main className='research-base min-h-screen p-4'>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-bold mb-6 text-neutral-300 font-mono'>
          ULTRATERRESTRIAL RESEARCH PLATFORM
        </h1>

        <div className='w-full'>
          <div className='w-full bg-black border border-neutral-800 rounded-sm mb-4 flex'>
            <button
              onClick={() => setActiveTab('hud')}
              className={`font-mono text-xs px-4 py-2 ${
                activeTab === 'hud'
                  ? 'bg-neutral-900 text-[#adf0dd]'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              HEADS-UP DISPLAY
            </button>
            <button
              onClick={() => setActiveTab('document')}
              className={`font-mono text-xs px-4 py-2 ${
                activeTab === 'document'
                  ? 'bg-neutral-900 text-[#adf0dd]'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              CLASSIFIED DOCUMENT VIEWER
            </button>
          </div>

          <div className='mt-0'>
            {activeTab === 'hud' && <HUDInterface />}
            {activeTab === 'document' && <ClassifiedDocumentViewer />}
          </div>
        </div>
      </div>
    </main>
  )
}
