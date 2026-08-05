'use client'

import Link from 'next/link'
import {useEffect} from 'react'

import {TourFlowCanvas} from '../shared/components/TourFlowCanvas'
import {tourProgressRepository} from '../shared/persistence/tour-progress.repository'
import {serializeProgress} from '../shared/persistence/tour-progress.serializer'
import {validateTourDefinition} from '../shared/graph/validate-tour-definition'
import {useTourStore} from '../shared/state/tour-store'
import {nuclearShadowDefinition} from './nuclear-shadow.definition'

import './nuclear-shadow-tour.css'

export function NuclearShadowTour() {
  const loadDefinition = useTourStore((state) => state.loadDefinition)
  const runtime = useTourStore((state) => state.runtime)
  const dispatch = useTourStore((state) => state.dispatch)

  useEffect(() => {
    const validation = validateTourDefinition(nuclearShadowDefinition)
    if (!validation.valid) {
      throw new Error(`Invalid Nuclear Shadow definition:\n${validation.errors.join('\n')}`)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Fresh session each mount unless ?resume=1 — avoids stuck empty overview from bad localStorage.
    const params = new URLSearchParams(window.location.search)
    const shouldResume = params.get('resume') === '1'
    const persisted = shouldResume
      ? tourProgressRepository.load(nuclearShadowDefinition.id)
      : undefined
    if (!shouldResume) {
      tourProgressRepository.clear(nuclearShadowDefinition.id)
    }
    loadDefinition(nuclearShadowDefinition, persisted, reducedMotion)
  }, [loadDefinition])

  useEffect(() => {
    if (!runtime?.hydrated) return
    const progress = serializeProgress(runtime)
    if (progress) tourProgressRepository.save(progress)
  }, [runtime])

  return (
    <>
      <div className='ut-tour-back'>
        <Link href='/research-canvas' className='ut-button ut-button--quiet'>
          ← Research Canvas
        </Link>
        <button
          type='button'
          className='ut-button ut-button--quiet'
          onClick={() => {
            tourProgressRepository.clear(nuclearShadowDefinition.id)
            dispatch({type: 'TOUR_RESET'})
            loadDefinition(nuclearShadowDefinition, undefined, runtime?.reducedMotion ?? false)
          }}>
          Restart
        </button>
      </div>
      <TourFlowCanvas definition={nuclearShadowDefinition} />
    </>
  )
}
