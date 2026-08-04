'use client'

import Link from 'next/link'
import {useEffect, useRef} from 'react'

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
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const validation = validateTourDefinition(nuclearShadowDefinition)
    if (!validation.valid) {
      throw new Error(`Invalid Nuclear Shadow definition:\n${validation.errors.join('\n')}`)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const persisted = tourProgressRepository.load(nuclearShadowDefinition.id)
    loadDefinition(nuclearShadowDefinition, persisted, reducedMotion)
  }, [loadDefinition])

  useEffect(() => {
    if (!runtime?.hydrated) return
    const progress = serializeProgress(runtime)
    if (progress) tourProgressRepository.save(progress)
  }, [runtime])

  return (
    <>
      <Link href='/research-canvas' className='ut-button ut-button--quiet ut-tour-back'>
        ← Research Canvas
      </Link>
      <TourFlowCanvas definition={nuclearShadowDefinition} />
    </>
  )
}
