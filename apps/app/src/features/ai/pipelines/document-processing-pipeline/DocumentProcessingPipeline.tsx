import {Suspense} from 'react'

import {Skeleton} from '@/components/ui/skeleton'
import {DocumentSearch, DocumentsList} from '@/features/ai/pipelines'
import {UploadZoneWrapper} from '@/features/ai/pipelines/document-processing-pipeline/UploadZone'

export function DocumentProcessingPipeline() {
  return (
    <div className='container max-w-5xl py-6 space-y-8'>
      <div className='flex flex-col items-start pt-6 pb-4 justify-start text-left'>
        <div className='flex gap-2 items-center'>
          <SupabaseIcon className='size-8' />
          <div className='flex flex-col items-start justify-start text-left'>
            <p className='text-sm text-muted-foreground'>Vector Embedding</p>
            <h1 className='text-2xl lg:text-3xl  font-bold'>Document Processor Pipeline</h1>
          </div>
        </div>
        <p className='text-muted-foreground  text-pretty text-sm max-w-2xl'>
          This pipeline allows users to upload documents and store them in supabase. Then once
          uploaded the files are parsed, analyzed, and turned into chunked vector embedding
          documents.
        </p>
      </div>
      <UploadZoneWrapper />
      {/* Documents List */}
      <div className='space-y-4'>
        <DocumentSearch />

        <Suspense
          fallback={
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground animate-pulse'>Loading Documents...</p>
              <Skeleton className='h-24 rounded-3xl' />
              <Skeleton className='h-24 rounded-3xl' />
            </div>
          }>
          <DocumentsList />
        </Suspense>
      </div>
    </div>
  )
}

function SupabaseIcon(props: any) {
  return (
    <svg
      viewBox='0 0 109 113'
      width='109'
      height='113'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}>
      <path
        d='M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347Z'
        fill='url(#a)'
      />
      <path
        d='M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347Z'
        fill='url(#b)'
        fillOpacity='.2'
      />
      <path
        d='M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.072Z'
        fill='#3ECF8E'
      />
      <defs>
        <linearGradient
          id='a'
          x1='53.974'
          y1='54.974'
          x2='94.163'
          y2='71.829'
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#249361' />
          <stop offset='1' stopColor='#3ECF8E' />
        </linearGradient>
        <linearGradient
          id='b'
          x1='36.156'
          y1='30.578'
          x2='54.484'
          y2='65.081'
          gradientUnits='userSpaceOnUse'>
          <stop />
          <stop offset='1' stopOpacity='0' />
        </linearGradient>
      </defs>
    </svg>
  )
}
