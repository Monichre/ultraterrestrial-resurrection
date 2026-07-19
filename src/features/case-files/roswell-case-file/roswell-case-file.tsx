'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {CaseFileCover} from './case-file-cover'
import {CaseFileDetailPanel} from './case-file-detail-panel'
import {CaseFileScene} from './case-file-scene'
import type {CaseFileLayer} from './data'
import {roswellCaseFile, roswellLayers} from './data'

export function RoswellCaseFile() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<CaseFileLayer | null>(null)

  return (
    <div className='relative h-screen w-full overflow-hidden bg-neutral-950'>
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #a3a3a3 1px, transparent 0)',
          backgroundSize: '20px',
        }}
      />

      <header className='pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-6'>
        <div>
          <p className='font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600'>
            Investigative Desk
          </p>
          <h1 className='font-mono text-sm font-bold uppercase tracking-wide text-neutral-300'>
            Case File · {roswellCaseFile.name}
          </h1>
        </div>

        {isOpen && (
          <button
            type='button'
            onClick={() => {
              setIsOpen(false)
              setSelectedLayer(null)
            }}
            className='pointer-events-auto rounded border border-neutral-800 bg-black/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-neutral-400 backdrop-blur-sm transition-colors hover:border-neutral-600 hover:text-neutral-200'>
            Close File
          </button>
        )}
      </header>

      <CaseFileScene layers={roswellLayers} isOpen={isOpen} onSelectLayer={setSelectedLayer} />

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{opacity: 1}}
            exit={{opacity: 0}}
            className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
            <CaseFileCover record={roswellCaseFile} onOpen={() => setIsOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <CaseFileDetailPanel layer={selectedLayer} onClose={() => setSelectedLayer(null)} />

      {isOpen && !selectedLayer && (
        <motion.p
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.6}}
          className='pointer-events-none absolute inset-x-0 bottom-6 text-center font-mono text-[10px] uppercase tracking-widest text-neutral-600'>
          Drag to orbit · Click a layer to read
        </motion.p>
      )}
    </div>
  )
}
