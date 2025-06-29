'use client'

import {useState} from 'react'
import {Card} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Database, FileText, Globe, Shield} from 'lucide-react'
import GlobeVisualization from './globe-visualization'
import ResearchDocuments from './research-documents'
import SightingDatabase from './sighting-database'
import DocumentSecurityControls from './document-security-controls'
import ClassificationBanner from '../classification-banner'

export default function ResearchBase() {
  const [activeTab, setActiveTab] = useState('globe')

  return (
    <div className='min-h-screen bg-neutral-950 pt-20 p-6 md:p-12 relative'>
      {/* Graph Paper Background */}
      <div
        className='graph-paper-bg absolute inset-0 opacity-30 z-[-5]'
        style={{
          backgroundImage:
            'url(https://www.transparenttextures.com/patterns/graphy.png)',
        }}
      />

      <div className='mx-auto max-w-7xl space-y-6'>
        <ClassificationBanner
          level='top-secret'
          warning='UFOLOGY RESEARCH HQ - AUTHORIZED PERSONNEL ONLY'
        />

        <div className='grid gap-6'>
          <h1 className='text-2xl font-mono font-bold text-neutral-200'>
            Research Base
          </h1>
          <p className='text-neutral-400'>
            Access and analyze global sighting data, research documents, and
            historical records. This system provides comprehensive tools for
            investigating ultraterrestrial phenomena.
          </p>

          <Card className='border-neutral-800/50 bg-black/20 backdrop-blur-sm'>
            <Tabs
              defaultValue='globe'
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <div className='border-b border-neutral-800 p-4'>
                <TabsList className='bg-neutral-900/50 border border-neutral-800'>
                  <TabsTrigger
                    value='globe'
                    className='data-[state=active]:bg-neutral-800'
                  >
                    <Globe className='h-4 w-4 mr-2' />
                    Global Sightings
                  </TabsTrigger>
                  <TabsTrigger
                    value='documents'
                    className='data-[state=active]:bg-neutral-800'
                  >
                    <FileText className='h-4 w-4 mr-2' />
                    Research Documents
                  </TabsTrigger>
                  <TabsTrigger
                    value='database'
                    className='data-[state=active]:bg-neutral-800'
                  >
                    <Database className='h-4 w-4 mr-2' />
                    Sighting Database
                  </TabsTrigger>
                  <TabsTrigger
                    value='security'
                    className='data-[state=active]:bg-neutral-800'
                  >
                    <Shield className='h-4 w-4 mr-2' />
                    Security Controls
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value='globe' className='mt-0 p-4'>
                <GlobeVisualization />
              </TabsContent>

              <TabsContent value='documents' className='mt-0 p-4'>
                <ResearchDocuments />
              </TabsContent>

              <TabsContent value='database' className='mt-0 p-4'>
                <SightingDatabase />
              </TabsContent>

              <TabsContent value='security' className='mt-0 p-4'>
                <DocumentSecurityControls />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
