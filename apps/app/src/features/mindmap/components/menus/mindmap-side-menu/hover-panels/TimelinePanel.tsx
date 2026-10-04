"use client"

import {Clock, Pause, Play} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Slider} from '@/components/ui/slider'
import {Badge} from '@/components/ui/badge'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {CalendarIcon, ChevronLeftIcon, ChevronRightIcon} from '@radix-ui/react-icons'

const TIMELINE_ERAS = [
  {name: 'Ancient', range: 'Pre-1800', start: 1600, end: 1800, events: 23},
  {name: 'Industrial', range: '1800-1900', start: 1800, end: 1900, events: 45},
  {name: 'Early Modern', range: '1900-1947', start: 1900, end: 1947, events: 127},
  {name: 'Modern UFO Era', range: '1947-1990', start: 1947, end: 1990, events: 2341},
  {name: 'Contemporary', range: '1990-Present', start: 1990, end: 2024, events: 1876},
]

const KEY_DATES = [
  {year: 1947, label: 'Roswell Incident', type: 'event'},
  {year: 1952, label: 'Project Blue Book', type: 'program'},
  {year: 1969, label: 'Blue Book Closure', type: 'program'},
  {year: 2004, label: 'Nimitz Encounter', type: 'event'},
  {year: 2017, label: 'Pentagon Disclosure', type: 'disclosure'},
  {year: 2020, label: 'UAP Task Force', type: 'program'},
  {year: 2023, label: 'Grusch Testimony', type: 'disclosure'},
]

const EVENT_TYPES = {
  event: 'bg-red-500/20 text-red-400 border-red-500/30',
  program: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  disclosure: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export type TimelineRequestPayload = {
  year: number
  era: string
  dateRange?: {
    startYear: number
    endYear: number
  }
}

export interface TimelinePanelProps {
  year: number
  era: string
  isPlaying: boolean
  playbackSpeed: string
  onYearChange: (year: number) => void
  onEraChange: (era: string) => void
  onTogglePlay: () => void
  onPlaybackSpeedChange: (speed: string) => void
  onRequestData?: (payload: TimelineRequestPayload) => void
}

const resolveEraForYear = (year: number) =>
  TIMELINE_ERAS.find((era) => year >= era.start && year <= era.end)

export function TimelinePanel({
  year,
  era,
  isPlaying,
  playbackSpeed,
  onYearChange,
  onEraChange,
  onTogglePlay,
  onPlaybackSpeedChange,
  onRequestData,
}: TimelinePanelProps) {
  const currentEra = TIMELINE_ERAS.find((entry) => entry.name === era)
  const nearbyEvents = KEY_DATES.filter((date) => Math.abs(date.year - year) <= 5).sort(
    (a, b) => Math.abs(a.year - year) - Math.abs(b.year - year),
  )

  const applyEra = (nextEra: (typeof TIMELINE_ERAS)[number], targetYear: number) => {
    onEraChange(nextEra.name)
    onRequestData?.({
      year: targetYear,
      era: nextEra.name,
      dateRange: {
        startYear: nextEra.start,
        endYear: nextEra.end,
      },
    })
  }

  const jumpToDate = (nextYear: number) => {
    onYearChange(nextYear)
    const nextEra = resolveEraForYear(nextYear)
    if (nextEra) {
      onEraChange(nextEra.name)
      onRequestData?.({
        year: nextYear,
        era: nextEra.name,
        dateRange: {
          startYear: nextEra.start,
          endYear: nextEra.end,
        },
      })
    }
  }

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-blue-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-white">Timeline Scrubber</h3>
        </div>
        <p className="text-xs text-gray-400">Navigate through centuries of UFO history</p>
      </header>

      <div className="p-3 space-y-4">
        {/* Current Year Display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{year}</div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {currentEra?.name || 'Unknown Era'}
          </Badge>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>1600</span>
            <span>2024</span>
          </div>
          <Slider
            value={[year]}
            onValueChange={(value) => {
              const nextYear = value[0]
              onYearChange(nextYear)
              const nextEra = resolveEraForYear(nextYear)
              if (nextEra) {
                onEraChange(nextEra.name)
                onRequestData?.({
                  year: nextYear,
                  era: nextEra.name,
                  dateRange: {
                    startYear: nextEra.start,
                    endYear: nextEra.end,
                  },
                })
              }
            }}
            max={2024}
            min={1600}
            step={1}
            className="w-full"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => jumpToDate(Math.max(1600, year - 10))}>
            <ChevronLeftIcon size={14} strokeWidth={2} />
          </Button>

          <Button size="sm" variant="ghost" onClick={onTogglePlay} className="px-3">
            {isPlaying ? <Pause size={14} strokeWidth={2} /> : <Play size={14} strokeWidth={2} />}
          </Button>

          <Button size="sm" variant="ghost" onClick={() => jumpToDate(Math.min(2024, year + 10))}>
            <ChevronRightIcon size={14} strokeWidth={2} />
          </Button>

          <Select value={playbackSpeed} onValueChange={onPlaybackSpeedChange}>
            <SelectTrigger className="w-16 h-8 bg-neutral-900 border-[#292f35]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-[#292f35]">
              <SelectItem value="0.5x">0.5x</SelectItem>
              <SelectItem value="1x">1x</SelectItem>
              <SelectItem value="2x">2x</SelectItem>
              <SelectItem value="5x">5x</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Era Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Historical Eras</h4>
          <div className="grid grid-cols-1 gap-1">
            {TIMELINE_ERAS.map((era) => (
              <Button
                key={era.name}
                size="sm"
                variant={currentEra?.name === era.name ? "default" : "ghost"}
                onClick={() => {
                  const nextYear = Math.floor((era.start + era.end) / 2)
                  onYearChange(nextYear)
                  applyEra(era, nextYear)
                }}
                className="justify-between h-auto py-2"
              >
                <div className="text-left">
                  <div className="text-xs font-medium">{era.name}</div>
                  <div className="text-xs text-gray-400">{era.range}</div>
                </div>
                <Badge className="bg-neutral-700 text-white text-xs">{era.events}</Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Key Dates */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon size={14} strokeWidth={2} />
            Key Dates Near {year}
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {nearbyEvents.length > 0 ? (
              nearbyEvents.map((event) => (
                <Button
                  key={event.year}
                  size="sm"
                  variant="ghost"
                  onClick={() => jumpToDate(event.year)}
                  className="w-full justify-between h-auto py-2"
                >
                  <div className="text-left">
                    <div className="text-xs font-medium">{event.label}</div>
                    <div className="text-xs text-gray-400">{event.year}</div>
                  </div>
                  <Badge className={`text-xs ${EVENT_TYPES[event.type as keyof typeof EVENT_TYPES]}`}>
                    {event.type}
                  </Badge>
                </Button>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">No key events near this time period</p>
            )}
          </div>
        </div>

        {/* Quick Jump */}
        <div className="pt-2 border-t border-white/5">
          <h4 className="text-sm font-medium mb-2">Quick Jump</h4>
          <div className="grid grid-cols-3 gap-1">
            {[1947, 2004, 2017].map((year) => (
              <Button key={year} size="sm" variant="ghost" onClick={() => jumpToDate(year)} className="text-xs">
                {year}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
