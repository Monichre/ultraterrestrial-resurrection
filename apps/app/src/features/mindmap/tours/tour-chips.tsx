'use client'

/**
 * One chip per registered tour, in registry order. Icons are looked up by
 * tour id so adding a tour to `GUIDED_TOURS` is the only step to surface it.
 */
import type { ReactNode } from 'react'
import { Compass, Radiation, Sparkles } from 'lucide-react'

import { ActionChip } from '@/features/mindmap/research-canvas/ActionChip'
import type { AnyTourDefinition } from '@/features/guided-tours/shared/types/tour-definition'

import { GUIDED_TOURS } from './famous-events-tour'

const TOUR_CHIP_ICONS: Record<string, ReactNode> = {
  'ut.tour.nuclear-shadow': <Radiation className='size-4' />,
  'famous-events-chronological': <Sparkles className='size-4' />,
}

const TOUR_CHIP_LABELS: Record<string, string> = {
  'ut.tour.nuclear-shadow': 'Nuclear Shadow',
  'famous-events-chronological': 'Modern UFO Era',
}

export function TourChips({ onStart }: { onStart: (tour: AnyTourDefinition) => void }) {
  return (
    <>
      {GUIDED_TOURS.map((tour) => (
        <ActionChip
          key={tour.id}
          icon={TOUR_CHIP_ICONS[tour.id] ?? <Compass className='size-4' />}
          onClick={() => onStart(tour)}>
          {TOUR_CHIP_LABELS[tour.id] ?? tour.title}
        </ActionChip>
      ))}
    </>
  )
}
