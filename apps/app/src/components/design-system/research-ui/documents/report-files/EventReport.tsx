import Image from 'next/image'

import {cn} from '@/lib/utils'

export function ClassifiedDocumentPage() {
  return (
    <div className='relative w-full max-w-2xl font-special-elite bg-[#e9e4d8] shadow-2xl shadow-black/50 p-8 md:p-12 text-black/80 rounded-sm'>
      {/* Background Texture */}
      <div
        className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-30 mix-blend-multiply"
        style={{backgroundSize: 'cover'}}
      />

      {/* Header */}
      <header className='relative'>
        <h1 className={cn('text-4xl md:text-6xl font-anton tracking-wider text-neutral-800')}>
          SOCORRO INCIDENT
        </h1>
        <h2 className={cn('text-3xl md:text-5xl font-anton tracking-wider text-neutral-800/90')}>
          — APRIL 1964
        </h2>
        <div className='absolute top-8 right-0 md:right-4 transform rotate-[15deg] border-4 border-red-700/80 px-4 py-1'>
          <span className={cn('text-2xl font-anton text-red-700/80 tracking-widest')}>
            CLASSIFIED
          </span>
        </div>
      </header>

      {/* Content */}
      <div className='relative mt-8 border-t-2 border-black/50 pt-4'>
        <h3 className='text-lg font-bold tracking-widest text-neutral-800/90'>
          POLICE DISPATCHSCRIPT
        </h3>
        <p className='text-sm text-neutral-700/90'>18410-144</p>

        <div className='mt-4 space-y-4 text-lg text-neutral-900'>
          <p className='font-bold'>UNIT CALL:</p>
          <div className='grid grid-cols-[auto_1fr] gap-x-4 items-start'>
            <p>19 55</p>
            <p>→ Unknown fire</p>
            <p>ann,</p>
            <p>at tantown</p>
            <p>south af</p>
            <p>dynamite shack.</p>
          </div>
          <div className='grid grid-cols-[auto_1fr] gap-x-4 items-start'>
            <p>19-4</p>
            <p>→ A large flame, possible crash</p>
          </div>
        </div>

        {/* Handwritten Notes */}
        <p
          className={cn(
            'absolute bottom-4 left-12 text-4xl text-black/70 transform -rotate-6',
            FONT_CAVEAT.className
          )}>
          flaming disc
        </p>
        <p
          className={cn(
            'absolute -bottom-4 right-8 text-4xl text-black/75 transform rotate-2',
            FONT_CAVEAT.className
          )}>
          Sheriff Chavez
        </p>
      </div>

      {/* Polaroid Photo */}
      <div className='absolute top-[45%] right-4 md:right-8 w-48 h-56 md:w-56 md:h-64 bg-white p-3 shadow-lg transform rotate-6'>
        <div className='relative w-full h-full bg-black'>
          <Image
            src='/placeholder.svg?width=200&height=220'
            alt='Photograph of the unidentified object'
            fill
            className='object-cover'
          />
          {/* Burnt Edges Effect */}
          <div className='absolute -top-2 -right-3 w-20 h-20 bg-yellow-900/50 rounded-full blur-lg transform scale-y-50' />
          <div className='absolute -bottom-2 -left-2 w-16 h-16 bg-yellow-800/40 rounded-full blur-md' />
        </div>
      </div>
    </div>
  )
}
