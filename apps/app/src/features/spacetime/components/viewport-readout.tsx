'use client'

import {useEffect, useState} from 'react'
import {useSpacetimeStore} from '../state/spacetime-store'

/**
 * Footer instrument strip — concept-01 frame 1 and concept-03 frame 1:
 *
 *   `34.0522° N, 118.2437° W`  ·  `ALT 35,786 KM`  ·  `UTC 2024-05-17 19:42:11`
 *
 * Every figure is live. Lat/long and altitude come from the actual camera (see
 * `SpacetimeViewport.altitudeMeters`); the clock is wall time. The alternative —
 * a static plausible-looking string — is the kind of decoration that makes a
 * research instrument untrustworthy the first time someone checks it.
 */
export function ViewportReadout() {
  const viewport = useSpacetimeStore((s) => s.viewport)
  const [utc, setUtc] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setUtc(new Date().toISOString().replace('T', ' ').slice(0, 19))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const lat = `${Math.abs(viewport.latitude).toFixed(4)}° ${viewport.latitude >= 0 ? 'N' : 'S'}`
  const lng = `${Math.abs(viewport.longitude).toFixed(4)}° ${viewport.longitude >= 0 ? 'E' : 'W'}`

  return (
    /* `pl-28` reserves the left of the bar for Mapbox's attribution logo, which
       is stacked over this bar rather than hidden behind it. */
    <div className='pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between border-t border-[rgba(125,190,210,0.12)] bg-[rgba(5,8,11,0.9)] py-2.5 pr-5 pl-28 font-mono text-[10px] tracking-wide text-[#7d8f95] backdrop-blur-sm'>
      <span>
        {lat}, {lng}
      </span>
      <span>ALT {formatAltitude(viewport.altitudeMeters)}</span>
      {/*
       * Rendered null on the server and on first paint: `new Date()` in render
       * would produce a server string that never matches the client's, which is
       * a hydration mismatch every single load.
       */}
      <span suppressHydrationWarning>{utc ? `UTC ${utc}` : 'UTC ——'}</span>
    </div>
  )
}

function formatAltitude(meters: number | undefined): string {
  if (meters == null || !Number.isFinite(meters)) return '——'
  const km = meters / 1000
  if (km >= 10) return `${Math.round(km).toLocaleString('en-US')} KM`
  if (km >= 1) return `${km.toFixed(1)} KM`
  return `${Math.round(meters).toLocaleString('en-US')} M`
}
