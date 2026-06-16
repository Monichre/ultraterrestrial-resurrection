'use client'

import {CustomCursor} from '@/components/cursor-ui/CustomCursor'
import type {EventsRecord} from '@db/postgres'
import {HistoricalEventsTimeline} from '@/layouts/historical-events-timeline/historical-events-timeline'
import type {ViewMode} from '@/layouts/historical-events-timeline/types'
import {ViewSelector} from '@/layouts/historical-events-timeline/view-selector'
import type {JSONData} from '@xata.io/client'
import {useState} from 'react'
import {ZAxisTimeline3D} from '@/features/timeline/3d-z-axis-timeline'

interface TimelinePageClientProps {
  events: JSONData<EventsRecord>[]
}

export function TimelineViews({events}: TimelinePageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')

  return (
    <div className='timeline-page relative'>
      <CustomCursor />
      <div className='absolute top-5 left-4 z-50'>
        <ViewSelector value={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === 'timeline' && <HistoricalEventsTimeline events={events} />}

      {viewMode === 'worldmap' && (
        <div className='h-screen w-full flex items-center justify-center text-white'>
          World Map View Coming Soon
        </div>
      )}

      {viewMode === 'journey' && <ZAxisTimeline3D events={events} />}
    </div>
  )
}
