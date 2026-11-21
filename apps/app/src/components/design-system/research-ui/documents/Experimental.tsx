'use client'

import {
  ClassifiedComposition,
  type Variant,
} from '@/components/design-system/research-ui/documents/case-files/classified-composition/ClassifiedComposition'

export type ExperimentalProps = {
  grainOpacity?: number
  scratchOpacity?: number
  variant?: Variant // override if desired; defaults to 'impact'
}

export function Experimental({
  grainOpacity = 0,
  scratchOpacity = 0,
  variant = 'impact',
}: ExperimentalProps) {
  return (
    <section aria-label='Experimental Document' className='mx-auto w-full max-w-6xl px-2'>
      <div className='mb-3 px-1'>
        <h2 className='sr-only'>Experimental Document</h2>
        <span className='text-[10px] uppercase tracking-[0.35em] text-zinc-500'>
          Document: Experimental
        </span>
      </div>
      <ClassifiedComposition
        grainOpacity={grainOpacity}
        scratchOpacity={scratchOpacity}
        variant={variant}
      />
    </section>
  )
}
