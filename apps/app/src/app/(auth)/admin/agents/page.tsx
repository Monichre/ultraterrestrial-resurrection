'use client'

import WebProcessingPipeline from '@/features/ai/pipelines/web-processing-pipeline/WebProcessingPipeline'

export default function AgentsPage() {
  return (
    <div className='flex h-screen w-screen flex-col justify-center items-center p-8'>
      <h1 className='text-2xl font-bold'>Agents</h1>
      <WebProcessingPipeline />
    </div>
  )
}
