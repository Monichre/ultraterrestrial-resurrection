'use client'

import {useEffect, useMemo, useRef} from 'react'
import {format} from 'date-fns'
import './terminal.css'

type TerminalMetrics = {
  totalSightings: number
  eventsCount: number
  topShape?: string
  topCity?: string
  latestSightingISO?: string
  timeRange?: {startYear?: number; endYear?: number; selectedYear?: number}
}

interface TerminalProps {
  metrics?: TerminalMetrics
  status?: 'ACTIVE' | 'DEGRADED' | 'OFFLINE'
  progress?: number
  logs?: string[]
}

export function Terminal({metrics, status = 'ACTIVE', progress = 100, logs = []}: TerminalProps) {
  const terminalLinesRef = useRef<HTMLDivElement[]>([])
  const progressFillRef = useRef<HTMLDivElement>(null)
  const terminalWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show the terminal window
    if (terminalWindowRef.current) {
      setTimeout(() => {
        terminalWindowRef.current!.style.opacity = '1'
        terminalWindowRef.current!.style.width = '100%'
        animateTerminalText()
      }, 500)
    }

    // Fill the progress bar to the provided percentage
    if (progressFillRef.current) {
      setTimeout(() => {
        progressFillRef.current!.style.width = `${Math.max(0, Math.min(100, progress))}%`
      }, 600)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  // Function to animate terminal text
  const animateTerminalText = () => {
    // Make all lines visible with a staggered delay
    terminalLinesRef.current.forEach((line, index) => {
      if (line) {
        setTimeout(() => {
          line.style.opacity = '1'
          line.classList.add('visible')
        }, index * 80) // 80ms delay between each line
      }
    })
  }

  // Function to set terminal line refs
  const setTerminalLineRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      terminalLinesRef.current[index] = el
    }
  }

  const uiDate = (iso?: string) => {
    try {
      return iso ? format(new Date(iso), 'MMMM do yyyy') : 'N/A'
    } catch {
      return 'N/A'
    }
  }

  // Build terminal output lines from real metrics
  const terminalLines = useMemo(() => {
    const m = metrics || {
      totalSightings: 0,
      eventsCount: 0,
    }

    const rangeSuffix = m?.timeRange?.selectedYear
      ? `Year ${m.timeRange.selectedYear}`
      : m?.timeRange?.startYear && m?.timeRange?.endYear
        ? `${m.timeRange.startYear}–${m.timeRange.endYear}`
        : ''

    const dynamicLines: string[] = [
      '$ system.initialize()',
      'Initializing systems...',
      "<span class='success'>SUCCESS:</span> Runtime ready",
      '&nbsp;',
      '$ loadFeeds()',
      `- sightings: <span class='success'>${m.totalSightings.toLocaleString()}</span> records`,
      `- events: <span class='success'>${m.eventsCount.toLocaleString()}</span> records`,
      rangeSuffix ? `- range: ${rangeSuffix}` : '- range: N/A',
      '&nbsp;',
      '$ analyze()',
      `Top shape: ${m.topShape || 'N/A'}`,
      `Hotspot city: ${m.topCity || 'N/A'}`,
      `Latest sighting: ${uiDate(m.latestSightingISO)}`,
      '&nbsp;',
      '$ status()',
      `System Status: ${status}`,
      'Threat Level: LOW',
      'Data Integrity: 99.7%',
      '&nbsp;',
      ...logs,
      '$ _',
    ]
    return dynamicLines
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, status, logs?.length])

  return (
    <div className='terminal-container w-full p-2'>
      {/* Terminal Window */}
      <div className='terminal-window w-full' ref={terminalWindowRef}>
        <div className='terminal-header'>
          <span className='terminal-title'>SYS_TERM_V42.EXE</span>
          <div className='terminal-controls'>
            <span className='terminal-control'></span>
            <span className='terminal-control'></span>
            <span className='terminal-control'></span>
          </div>
        </div>
        <div className='terminal-content'>
          {terminalLines.map((line, index) => (
            <div
              key={index}
              className='terminal-line'
              ref={(el) => setTerminalLineRef(el, index)}
              dangerouslySetInnerHTML={{__html: line}}></div>
          ))}
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className='progress-container'>
        <div className='progress-label'>TERMINAL</div>
        <div className='progress-bar'>
          <div className='progress-fill' ref={progressFillRef}></div>
        </div>
        <div className='progress-close'>[X]</div>
      </div>
    </div>
  )
}
