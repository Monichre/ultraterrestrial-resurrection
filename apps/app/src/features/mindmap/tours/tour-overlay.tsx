'use client'

/**
 * TourOverlay — the narrative surface of a Guided Tour. Renders the current
 * waypoint's story, chronological progress, and navigation. Mounts inside
 * the canvas and renders nothing while no tour is active.
 */
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Compass, Flag } from 'lucide-react'

import { useGuidedTour } from './use-guided-tour'

export function TourOverlay() {
  const { status, stepIndex, waypoints, tourTitle, tourSubtitle, nextStep, prevStep, goToStep, endTour } =
    useGuidedTour()

  const waypoint = waypoints[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === waypoints.length - 1

  return (
    <AnimatePresence>
      {status === 'resolving' && (
        <motion.div
          key='tour-resolving'
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className='absolute left-1/2 top-6 z-30 -translate-x-1/2 rounded-xl border border-white/10 bg-black/80 px-5 py-3 backdrop-blur-md'
        >
          <div className='flex items-center gap-3'>
            <Compass className='size-4 animate-pulse text-emerald-400' />
            <div>
              <p className='text-sm font-medium text-white/90'>{tourTitle}</p>
              <p className='text-[11px] text-white/50'>Resolving waypoints against the archive…</p>
            </div>
          </div>
        </motion.div>
      )}

      {status === 'running' && waypoint && (
        <motion.div
          key='tour-card'
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='absolute left-1/2 top-6 z-30 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl'
        >
          {/* Eyebrow */}
          <div className='flex items-center gap-2 border-b border-white/10 px-4 py-2'>
            <Compass className='size-3.5 text-emerald-400' />
            <span className='text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/90'>
              Guided Tour
            </span>
            <span className='truncate text-[10px] uppercase tracking-[0.14em] text-white/40'>
              {tourTitle}
            </span>
            <button
              type='button'
              onClick={endTour}
              className='ml-auto rounded-md p-1 text-white/40 transition hover:bg-white/10 hover:text-white'
              aria-label='End tour'
            >
              <X className='size-3.5' />
            </button>
          </div>

          {/* Narrative */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
              className='px-5 py-4'
            >
              <div className='flex items-baseline gap-3'>
                <span className='font-mono text-sm text-emerald-400'>{waypoint.year}</span>
                <h3 className='text-lg font-semibold text-white'>{waypoint.title}</h3>
              </div>
              <p className='mt-2 text-[13px] leading-relaxed text-white/70'>
                {waypoint.narrative}
              </p>
              {!waypoint.recordId && (
                <p className='mt-2 text-[11px] text-amber-400/80'>
                  No archive record resolved for this stop — narrative only.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress + navigation */}
          <div className='flex items-center gap-3 border-t border-white/10 px-4 py-3'>
            <div className='flex items-center gap-1.5'>
              {waypoints.map((w, i) => (
                <button
                  key={`${w.searchQuery}-${i}`}
                  type='button'
                  onClick={() => goToStep(i)}
                  aria-label={`Go to ${w.title}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIndex
                      ? 'w-6 bg-emerald-400'
                      : i < stepIndex
                        ? 'w-1.5 bg-emerald-400/50'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <span className='text-[10px] tabular-nums text-white/40'>
              {stepIndex + 1} / {waypoints.length}
            </span>
            <div className='ml-auto flex items-center gap-2'>
              <button
                type='button'
                onClick={prevStep}
                disabled={isFirst}
                className='flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-30'
              >
                <ChevronLeft className='size-3.5' />
                Back
              </button>
              <button
                type='button'
                onClick={nextStep}
                className='flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-400/15 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/25'
              >
                {isLast ? 'Finish' : 'Continue'}
                {isLast ? <Flag className='size-3.5' /> : <ChevronRight className='size-3.5' />}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {status === 'completed' && (
        <motion.div
          key='tour-complete'
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className='absolute left-1/2 top-6 z-30 w-[min(480px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-emerald-400/25 bg-black/85 px-5 py-4 backdrop-blur-xl'
        >
          <div className='flex items-start gap-3'>
            <span className='rounded-lg bg-emerald-400/15 p-2 text-emerald-400'>
              <Flag className='size-4' />
            </span>
            <div className='flex-1'>
              <p className='text-sm font-semibold text-white'>Tour complete</p>
              <p className='mt-1 text-[12px] leading-relaxed text-white/60'>
                {tourSubtitle} — the full chronology is now on your canvas. The suggestion dock has
                switched back to whole-canvas analysis; follow the documented links to go deeper.
              </p>
              <button
                type='button'
                onClick={endTour}
                className='mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10'
              >
                Explore freely
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
