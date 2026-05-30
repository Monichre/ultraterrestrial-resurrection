"use client"

import { useState } from "react"
import { Clock, ChevronLeft, ChevronRight, Play, Calendar } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PanelWrapper } from "./PanelWrapper"

const HISTORICAL_ERAS = [
  { name: "Ancient", period: "Pre-1800", count: 23, startYear: 0, endYear: 1800 },
  { name: "Industrial", period: "1800-1900", count: 45, startYear: 1800, endYear: 1900 },
  { name: "Early Modern", period: "1900-1947", count: 127, startYear: 1900, endYear: 1947 },
  { name: "Modern UFO Era", period: "1947-1990", count: 2341, startYear: 1947, endYear: 1990 },
  { name: "Contemporary", period: "1990-Present", count: 1876, startYear: 1990, endYear: 2024 },
]

const KEY_EVENTS = [
  { name: "Nimitz Encounter", year: 2004 },
  { name: "Roswell Incident", year: 1947 },
  { name: "Phoenix Lights", year: 1997 },
]

const QUICK_JUMP_YEARS = [1947, 2004, 2017]

export function TimelinePanel() {
  const [currentYear, setCurrentYear] = useState(2004)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const getCurrentEra = (year: number) => {
    return HISTORICAL_ERAS.find(era => year >= era.startYear && year < era.endYear) || HISTORICAL_ERAS[HISTORICAL_ERAS.length - 1]
  }
  
  const currentEra = getCurrentEra(currentYear)
  
  const handleSliderChange = (value: number[]) => {
    const year = Math.round(1600 + (value[0] / 100) * (2024 - 1600))
    setCurrentYear(year)
  }
  
  const sliderValue = ((currentYear - 1600) / (2024 - 1600)) * 100

  return (
    <PanelWrapper texture="grid" className="w-96 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800/50">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock size={16} />
          Timeline Scrubber
        </h3>
        <p className="text-xs text-neutral-500 mt-1">Navigate through centuries of UFO history</p>
      </div>
      
      {/* Year Display */}
      <div className="p-4 border-b border-neutral-800/50">
        <div className="text-center">
          <div className="text-4xl font-bold text-white tabular-nums">{currentYear}</div>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
            {currentEra.name}
          </span>
        </div>
        
        {/* Slider */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>1600</span>
            <span>2024</span>
          </div>
          <Slider 
            value={[sliderValue]} 
            max={100} 
            step={0.5} 
            onValueChange={handleSliderChange}
            className="w-full" 
          />
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button 
            className="p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-400 hover:text-white transition-colors"
            onClick={() => setCurrentYear(Math.max(1600, currentYear - 10))}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-emerald-500 text-white' : 'bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-400 hover:text-white'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Play size={16} />
          </button>
          <button 
            className="p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-400 hover:text-white transition-colors"
            onClick={() => setCurrentYear(Math.min(2024, currentYear + 10))}
          >
            <ChevronRight size={16} />
          </button>
          <Select defaultValue="1">
            <SelectTrigger className="w-16 h-8 bg-neutral-800/50 border-neutral-700/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Historical Eras */}
      <div className="p-4 border-b border-neutral-800/50">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Historical Eras</h4>
        <div className="space-y-1">
          {HISTORICAL_ERAS.map((era) => (
            <button
              key={era.name}
              onClick={() => setCurrentYear(era.startYear + Math.floor((era.endYear - era.startYear) / 2))}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                currentEra.name === era.name 
                  ? 'bg-white/5 text-white' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-300'
              }`}
            >
              <div className="text-left">
                <div className="text-sm font-medium">{era.name}</div>
                <div className="text-xs text-neutral-500">{era.period}</div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                currentEra.name === era.name 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-neutral-800/50 text-neutral-500'
              }`}>
                {era.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Key Dates */}
      <div className="p-4 border-b border-neutral-800/50">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar size={12} />
          Key Dates Near {currentYear}
        </h4>
        <div className="space-y-1">
          {KEY_EVENTS.filter(e => Math.abs(e.year - currentYear) <= 20).slice(0, 3).map((event) => (
            <button
              key={event.name}
              onClick={() => setCurrentYear(event.year)}
              className="w-full flex items-center justify-between p-2 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-neutral-300 transition-colors"
            >
              <div className="text-left">
                <div className="text-sm">{event.name}</div>
                <div className="text-xs text-neutral-500">{event.year}</div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-rose-500/20 text-rose-400 rounded">
                event
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Quick Jump */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Quick Jump</h4>
        <div className="flex items-center gap-2">
          {QUICK_JUMP_YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setCurrentYear(year)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentYear === year
                  ? 'bg-white text-neutral-900'
                  : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50 hover:text-white'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </PanelWrapper>
  )
}
