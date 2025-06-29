'use client'

import {Database, FileText, Search, BarChart3, Network} from 'lucide-react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {Badge} from './ui/badge'
import {useKnowledgeBaseStats} from '../hooks/use-knowledge-base'
import ClassificationBanner from './classification-banner'
import EvidenceCard from './evidence-card'
import DataGrid from './data-grid'
import EvidenceNetwork from './evidence-network'
import KnowledgeBaseBrowser from './knowledge-base-browser'

export default function IntegratedDashboard() {
  const {stats, loading: statsLoading} = useKnowledgeBaseStats()

  return (
    <div className='min-h-screen bg-neutral-950 pt-20 p-12'>
      <div className='mx-auto max-w-7xl space-y-8'>
        <ClassificationBanner />

        {/* Main Navigation Tabs */}
        <Tabs defaultValue='research' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 bg-neutral-900 border-neutral-800'>
            <TabsTrigger
              value='research'
              className='data-[state=active]:bg-neutral-800 data-[state=active]:text-white flex items-center gap-2'
            >
              <BarChart3 className='h-4 w-4' />
              Research Canvas
            </TabsTrigger>
            <TabsTrigger
              value='knowledge-base'
              className='data-[state=active]:bg-neutral-800 data-[state=active]:text-white flex items-center gap-2'
            >
              <Database className='h-4 w-4' />
              Knowledge Base
              {stats && (
                <Badge
                  variant='secondary'
                  className='ml-1 bg-cyan-900 text-cyan-300 text-xs'
                >
                  {stats.total_documents}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value='evidence'
              className='data-[state=active]:bg-neutral-800 data-[state=active]:text-white flex items-center gap-2'
            >
              <FileText className='h-4 w-4' />
              Evidence Analysis
            </TabsTrigger>
            <TabsTrigger
              value='network'
              className='data-[state=active]:bg-neutral-800 data-[state=active]:text-white flex items-center gap-2'
            >
              <Network className='h-4 w-4' />
              Connection Map
            </TabsTrigger>
          </TabsList>

          {/* Research Canvas Tab */}
          <TabsContent value='research' className='mt-8'>
            <div className='space-y-8'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-white mb-2'>
                  Research Canvas
                </h2>
                <p className='text-neutral-400'>
                  Interactive evidence analysis and case management
                </p>
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                <EvidenceCard
                  caseNumber='X-37B'
                  classification='top-secret'
                  timestamp='2077-03-15T21:27:18'
                  title='Quantum State Collapse'
                  description='Probability wave function deviation detected in quantum system observation.'
                  credibilityScore={undefined}
                  sourceVerified={false}
                />
                <EvidenceCard
                  caseNumber='X-38C'
                  classification='classified'
                  timestamp='2077-03-15T18:15:32'
                  title='Eigenvalue Anomaly'
                  description='Linear transformation matrices showing unexpected eigenvalue patterns.'
                  credibilityScore={0.92}
                  sourceVerified={true}
                />
              </div>

              <DataGrid />
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value='knowledge-base' className='mt-8'>
            <KnowledgeBaseBrowser />
          </TabsContent>

          {/* Evidence Analysis Tab */}
          <TabsContent value='evidence' className='mt-8'>
            <div className='space-y-8'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-white mb-2'>
                  Evidence Analysis
                </h2>
                <p className='text-neutral-400'>
                  Detailed analysis of collected evidence and materials
                </p>
              </div>

              {/* Knowledge Base Stats Integration */}
              {stats && !statsLoading && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  <Card className='bg-neutral-900 border-neutral-800'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-cyan-400 text-sm font-medium'>
                        Case Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold text-white'>
                        {stats.documents_by_type.case_file || 0}
                      </div>
                      <CardDescription className='text-xs text-neutral-500'>
                        CIA documents, reports, testimonies
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className='bg-neutral-900 border-neutral-800'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-cyan-400 text-sm font-medium'>
                        Transcripts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold text-white'>
                        {stats.documents_by_type.transcript || 0}
                      </div>
                      <CardDescription className='text-xs text-neutral-500'>
                        Interviews, testimonies, podcasts
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className='bg-neutral-900 border-neutral-800'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-cyan-400 text-sm font-medium'>
                        Research Papers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold text-white'>
                        {stats.documents_by_type.article || 0}
                      </div>
                      <CardDescription className='text-xs text-neutral-500'>
                        Academic research, analysis
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className='bg-neutral-900 border-neutral-800'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-cyan-400 text-sm font-medium'>
                        Total Archive
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold text-white'>
                        {stats.total_size_mb.toFixed(0)} MB
                      </div>
                      <CardDescription className='text-xs text-neutral-500'>
                        Complete data archive
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className='grid gap-6 md:grid-cols-2'>
                <EvidenceCard
                  caseNumber='KBD-001'
                  classification='classified'
                  timestamp='2024-06-25T15:30:00'
                  title='Knowledge Base Integration'
                  description='Successfully integrated access to 448 classified documents including CIA files, testimonies, and research papers.'
                  credibilityScore={0.98}
                  sourceVerified={true}
                />
                <EvidenceCard
                  caseNumber='API-001'
                  classification='restricted'
                  timestamp='2024-06-25T15:30:00'
                  title='Real-time Data Access'
                  description='Established secure API connection to knowledge base with search, filtering, and categorization capabilities.'
                  credibilityScore={0.95}
                  sourceVerified={true}
                />
              </div>
            </div>
          </TabsContent>

          {/* Network Analysis Tab */}
          <TabsContent value='network' className='mt-8'>
            <div className='space-y-8'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-white mb-2'>
                  Connection Network
                </h2>
                <p className='text-neutral-400'>
                  Visualize relationships between evidence, entities, and cases
                </p>
              </div>

              <EvidenceNetwork />

              {/* Popular Tags from Knowledge Base */}
              {stats && !statsLoading && (
                <Card className='bg-neutral-900 border-neutral-800'>
                  <CardHeader>
                    <CardTitle className='text-white'>
                      Popular Research Topics
                    </CardTitle>
                    <CardDescription className='text-neutral-400'>
                      Most referenced topics in the knowledge base
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {stats.popular_tags.slice(0, 15).map(([tag, count]) => (
                        <Badge
                          key={tag}
                          variant='outline'
                          className='border-cyan-600 text-cyan-300 hover:bg-cyan-900 cursor-pointer'
                        >
                          {tag} ({count})
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
