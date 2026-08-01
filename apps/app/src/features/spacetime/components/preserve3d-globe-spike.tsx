'use client'

import {useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {SpacetimeCanvasShell} from './spacetime-canvas-shell'
import {useSpacetimeStore} from '../state/spacetime-store'

/**
 * M0.1 — Frame-timing spike
 *
 * Mounts a live Mapbox map inside the fixed background slot while a
 * preserve-3d narrative sibling scrolls with matrix3d-ish transforms.
 *
 * Measure: does continuous WebGL re-paint + CSS preserve-3d sibling jank?
 * If median frame > ~20ms under scroll, D2 fallback (static plates) engages.
 *
 * This is measurement scaffolding — not product UI.
 */

const SAMPLE_WAYPOINTS = [
  {year: 1947, title: 'Roswell', subtitle: 'Debris recovery · New Mexico'},
  {year: 1952, title: 'Washington National', subtitle: 'Radar–visual wave · D.C.'},
  {year: 1964, title: 'Socorro', subtitle: 'Landing trace · Lonnie Zamora'},
  {year: 1966, title: 'Westall', subtitle: 'Schoolyard sighting · Australia'},
  {year: 1997, title: 'Phoenix Lights', subtitle: 'Mass visual · Arizona'},
]

function SpikeBackgroundMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [status, setStatus] = useState<'booting' | 'ready' | 'no-token' | 'error'>('booting')

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN
    if (!token) {
      setStatus('no-token')
      return
    }
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = token
    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98.5, 39.8],
        zoom: 3.2,
        attributionControl: false,
        interactive: false,
      })
      map.on('load', () => setStatus('ready'))
      map.on('error', () => setStatus('error'))
      mapRef.current = map
    } catch {
      setStatus('error')
    }

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className='relative h-full w-full'>
      <div ref={containerRef} className='absolute inset-0' />
      {status !== 'ready' ? (
        <div className='absolute inset-0 flex items-center justify-center bg-neutral-950/80 text-xs tracking-widest text-neutral-400 uppercase'>
          {status === 'no-token' && 'Mapbox token missing — CSS plate fallback'}
          {status === 'booting' && 'Booting map…'}
          {status === 'error' && 'Map failed — CSS plate fallback'}
        </div>
      ) : null}
      {status !== 'ready' ? (
        <div
          aria-hidden
          className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a2332_0%,_#0a0a0a_70%)]'
        />
      ) : null}
    </div>
  )
}

function SpikeNarrative() {
  return (
    <div className='flex flex-col gap-[70vh] px-6 pt-[20vh] pb-[40vh]'>
      {SAMPLE_WAYPOINTS.map((wp, i) => (
        <article
          key={wp.year}
          className='mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-black/55 p-6 text-white shadow-2xl backdrop-blur-md will-change-transform'
          style={{
            transform: `translateZ(${-40 * i}px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <p className='font-mono text-xs tracking-[0.2em] text-amber-200/80'>{wp.year}</p>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight'>{wp.title}</h2>
          <p className='mt-1 text-sm text-neutral-300'>{wp.subtitle}</p>
          <p className='mt-4 text-xs text-neutral-500'>
            Spike card {i + 1}/{SAMPLE_WAYPOINTS.length} — scroll to stress the compositor.
          </p>
        </article>
      ))}
    </div>
  )
}

function SpikeChrome() {
  const lastFrameMs = useSpacetimeStore((s) => s.lastFrameMs)
  const scrollProgress = useSpacetimeStore((s) => s.scrollProgress)
  const cursor = useSpacetimeStore((s) => s.temporalCursor)

  const cursorLabel =
    cursor.mode === 'range'
      ? `${cursor.start} → ${cursor.end}`
      : cursor.mode === 'station'
        ? `${cursor.stationId} @ ${cursor.timestamp}`
        : `${cursor.timestamp} (${cursor.precision})`

  const jank =
    lastFrameMs == null ? '—' : lastFrameMs > 20 ? `JANK ${lastFrameMs.toFixed(1)}ms` : `${lastFrameMs.toFixed(1)}ms`

  return (
    <div className='absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 font-mono text-[11px] text-neutral-300'>
      <div className='rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur'>
        <div className='text-neutral-500'>M0.1 SPIKE · FRAME</div>
        <div className={lastFrameMs != null && lastFrameMs > 20 ? 'text-rose-300' : 'text-emerald-300'}>
          {jank}
        </div>
      </div>
      <div className='rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur'>
        <div className='text-neutral-500'>SCROLL</div>
        <div>{(scrollProgress * 100).toFixed(0)}%</div>
      </div>
      <div className='rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur'>
        <div className='text-neutral-500'>CURSOR</div>
        <div className='max-w-[40ch] truncate'>{cursorLabel}</div>
      </div>
    </div>
  )
}

function useFrameTiming() {
  const setLastFrameMs = useSpacetimeStore((s) => s.setLastFrameMs)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const samples: number[] = []

    const tick = (now: number) => {
      const delta = now - last
      last = now
      samples.push(delta)
      if (samples.length >= 30) {
        const median = [...samples].sort((a, b) => a - b)[Math.floor(samples.length / 2)] ?? delta
        setLastFrameMs(median)
        samples.length = 0
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [setLastFrameMs])
}

function useScrollProgressBridge() {
  const setScrollProgress = useSpacetimeStore((s) => s.setScrollProgress)
  const setTemporalCursor = useSpacetimeStore((s) => s.setTemporalCursor)

  useEffect(() => {
    const narrative = document.querySelector('[data-spacetime-layer="narrative"]')
    if (!(narrative instanceof HTMLElement)) return

    const onScroll = () => {
      const max = narrative.scrollHeight - narrative.clientHeight
      const progress = max > 0 ? narrative.scrollTop / max : 0
      setScrollProgress(progress)

      // guided mode: scroll writes cursor (station approximation from sample waypoints)
      const idx = Math.min(
        SAMPLE_WAYPOINTS.length - 1,
        Math.floor(progress * SAMPLE_WAYPOINTS.length),
      )
      const wp = SAMPLE_WAYPOINTS[idx]
      if (!wp) return
      setTemporalCursor({
        mode: 'station',
        stationId: `spike-${wp.year}`,
        timestamp: `${wp.year}-01-01T00:00:00.000Z`,
      })
    }

    narrative.addEventListener('scroll', onScroll, {passive: true})
    onScroll()
    return () => narrative.removeEventListener('scroll', onScroll)
  }, [setScrollProgress, setTemporalCursor])
}

export function Preserve3dGlobeSpike() {
  useFrameTiming()
  useScrollProgressBridge()

  return (
    <SpacetimeCanvasShell
      background={<SpikeBackgroundMap />}
      narrative={<SpikeNarrative />}
      chrome={<SpikeChrome />}
    />
  )
}
