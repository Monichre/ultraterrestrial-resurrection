'use client'

import {ClassifiedComposition} from '@/components/design-system/research-ui/documents/case-files/classified-composition/ClassifiedComposition'

export type ReconProps = {
  grainOpacity?: number
  scratchOpacity?: number
}

export function Recon({grainOpacity = 0, scratchOpacity = 0}: ReconProps) {
  return (
    <section aria-label='Recon Document' className='mx-auto w-full max-w-6xl px-2'>
      <div className='mb-3 px-1'>
        <h2 className='sr-only'>Recon Document</h2>
        <span className='text-[10px] uppercase tracking-[0.35em] text-zinc-500'>
          Document: Recon
        </span>
      </div>
      <ClassifiedComposition
        grainOpacity={grainOpacity}
        scratchOpacity={scratchOpacity}
        variant='recon'
      />
    </section>
  )
}
