'use client'

import {useState, useCallback} from 'react'
import {Slider} from '@/components/ui/slider'
import {Button} from '@/components/ui/button'
import {Calendar, Clock, MapPin, Users} from 'lucide-react'

interface TimelineEvent {
  year: number
  label: string
  type: 'milestone' | 'wave' | 'disclosure' | 'hearing'
  description: string
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 1947,
    label: 'Roswell Incident',
    type: 'milestone',
    description: 'The Roswell UFO incident',
  },
  {
    year: 1952,
    label: 'Washington D.C. Wave',
    type: 'wave',
    description: 'Mass UFO sightings over Washington',
  },
  {
    year: 1969,
    label: 'Project Blue Book Ends',
    type: 'milestone',
    description: 'Official Air Force investigation concludes',
  },
  {
    year: 2004,
    label: 'Nimitz Encounter',
    type: 'milestone',
    description: 'USS Nimitz Tic Tac encounter',
  },
  {
    year: 2017,
    label: 'NYT Disclosure',
    type: 'disclosure',
    description: 'New York Times breaks Pentagon UFO story',
  },
  {
    year: 2020,
    label: 'Pentagon Confirms',
    type: 'disclosure',
    description: 'Pentagon officially confirms UAP videos',
  },
  {
    year: 2023,
    label: 'Congressional Hearing',
    type: 'hearing',
    description: 'Historic UAP Congressional hearing',
  },
  {
    year: 2024,
    label: 'AARO Report',
    type: 'disclosure',
    description: 'All-domain Anomaly Resolution Office report',
  },
]

export function TimelineScrubber() {
  const [currentYear, setCurrentYear] = useState(2024)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)

  const handleYearChange = useCallback((value: number[]) => {
    const year = value[0]
    setCurrentYear(year)

    // Find closest event
    const closestEvent = TIMELINE_EVENTS.reduce((prev, curr) =>
      Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev
    )
    setSelectedEvent(closestEvent)
  }, [])

  const jumpToEvent = useCallback((event: TimelineEvent) => {
    setCurrentYear(event.year)
    setSelectedEvent(event)
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <MapPin className='w-3 h-3' />
      case 'wave':
        return <Users className='w-3 h-3' />
      case 'disclosure':
        return <Calendar className='w-3 h-3' />
      case 'hearing':
        return <Clock className='w-3 h-3' />
      default:
        return <Calendar className='w-3 h-3' />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'text-red-400'
      case 'wave':
        return 'text-blue-400'
      case 'disclosure':
        return 'text-green-400'
      case 'hearing':
        return 'text-yellow-400'
      default:
        return 'text-neutral-400'
    }
  }

  return (
    <div className='bg-neutral-800 rounded-lg p-4 shadow-lg border border-neutral-700 min-w-[280px]'>
      <div className='text-white text-sm font-medium mb-4 flex items-center gap-2'>
        <Clock className='w-4 h-4' />
        Timeline Scrubber
      </div>

      {/* Year Display */}
      <div className='text-center mb-4'>
        <div className='text-2xl font-bold text-white'>{currentYear}</div>
        {selectedEvent && (
          <div className='text-xs text-neutral-400 mt-1'>{selectedEvent.description}</div>
        )}
      </div>

      {/* Timeline Slider */}
      <div className='mb-4'>
        <Slider
          value={[currentYear]}
          onValueChange={handleYearChange}
          min={1940}
          max={2024}
          step={1}
          className='w-full'
        />
        <div className='flex justify-between text-xs text-neutral-500 mt-1'>
          <span>1940</span>
          <span>2024</span>
        </div>
      </div>

      {/* Timeline Events */}
      <div className='space-y-2 max-h-48 overflow-y-auto'>
        <div className='text-xs text-neutral-400 mb-2'>Key Events</div>
        {TIMELINE_EVENTS.map((event) => (
          <button
            key={event.year}
            onClick={() => jumpToEvent(event)}
            className={`w-full flex items-center gap-2 px-2 py-1 text-left text-xs rounded transition-colors ${
              selectedEvent?.year === event.year
                ? 'bg-neutral-700 text-white'
                : 'hover:bg-neutral-700/50 text-neutral-300'
            }`}>
            <div className={`${getEventColor(event.type)}`}>{getEventIcon(event.type)}</div>
            <div className='flex-1'>
              <div className='font-medium'>{event.label}</div>
              <div className='text-neutral-500'>{event.year}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Jump Buttons */}
      <div className='flex gap-1 mt-4'>
        <Button
          size='sm'
          variant='outline'
          onClick={() => jumpToEvent(TIMELINE_EVENTS[0])}
          className='flex-1 text-xs h-7'>
          1947
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => jumpToEvent(TIMELINE_EVENTS[3])}
          className='flex-1 text-xs h-7'>
          2004
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => jumpToEvent(TIMELINE_EVENTS[4])}
          className='flex-1 text-xs h-7'>
          2017
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => jumpToEvent(TIMELINE_EVENTS[6])}
          className='flex-1 text-xs h-7'>
          2023
        </Button>
      </div>
    </div>
  )
}
