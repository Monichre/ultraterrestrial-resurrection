'use client'

import {Experimental} from '@/components/design-system/research-ui/documents/Experimental'
import {Recon} from '@/components/design-system/research-ui/documents/Recon'

export default function Page() {
  return (
    <main className='min-h-screen w-full bg-[#0a0a0a] py-8 text-white'>
      <div className='mx-auto w-full max-w-6xl px-4 pb-6'>
        <h1 className='text-xs tracking-[0.35em] uppercase text-zinc-300'>
          Classified Dossier — Two Documents
        </h1>
      </div>

      {/* Document 1: Experimental (Impact preset) */}
      <Experimental />

      {/* Spacer between documents */}
      <div className='h-20' />

      {/* Document 2: Recon */}
      <Recon />

      <div className='h-20' />
    </main>
  )
}
