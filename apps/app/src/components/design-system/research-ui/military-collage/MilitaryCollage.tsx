'use client'

import {useMemo, useState} from 'react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

type DocData = {
  pageTitle: string
  docId: string
  classification: string
  timestamp: string
  location: string
}

type Props = {
  data?: DocData
}

const DEFAULT_DATA: DocData = {
  pageTitle: '{pageTitle}',
  docId: '{docId}',
  classification: '{classification}',
  timestamp: '{timestamp}',
  location: '{location}',
}

// Utility to clamp and round
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

// Generate random integer between [min, max]
const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export function MilitaryCollage({data = DEFAULT_DATA}: Props) {
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 1000000))
  const [isHighNoise, setIsHighNoise] = useState<boolean>(false)
  const [isChaos, setIsChaos] = useState<boolean>(false)

  // Derived randomized positions for floating oblongs and debris pieces
  const layout = useMemo(() => {
    const rand = (i: number) => {
      const x = Math.sin(seed + i) * 10000
      return x - Math.floor(x)
    }

    const discs = Array.from({length: 5}).map((_, i) => {
      const left = Math.max(5, Math.min(85, Math.floor(rand(i) * 100)))
      const top = Math.max(8, Math.min(24, Math.floor(24 + (rand(i + 50) - 0.5) * 16) - i * 2))
      const rotate = Math.max(-30, Math.min(30, Math.floor(rand(i + 1) * 60) - 30))
      const scale = Math.max(0.85, Math.min(1.35, 0.85 + rand(i + 2) * 0.5))
      return {left, top, rotate, scale}
    })

    const debris = Array.from({length: 18}).map((_, i) => {
      const left = Math.max(4, Math.min(96, Math.floor(rand(i + 20) * 100)))
      const top = Math.max(22, Math.min(82, Math.floor(rand(i + 30) * 60) + 22))
      const w = Math.max(8, Math.min(22, Math.floor(8 + rand(i + 31) * 14)))
      const h = Math.max(2, Math.min(6, Math.floor(2 + rand(i + 32) * 4)))
      const r = Math.max(-90, Math.min(90, Math.floor(rand(i + 40) * 180) - 90))
      return {left, top, w, h, r}
    })

    const particles = Array.from({length: 24}).map((_, i) => {
      const left = Math.max(2, Math.min(98, Math.floor(rand(i + 60) * 100)))
      const bottom = Math.max(0, Math.min(100, Math.floor(rand(i + 61) * 100)))
      const size = Math.max(1, Math.min(3, Math.floor(1 + rand(i + 62) * 3)))
      const dur = Math.max(6000, Math.min(14000, Math.floor(6000 + rand(i + 63) * 8000)))
      const delay = Math.floor(rand(i + 64) * -4000)
      return {left, bottom, size, dur, delay}
    })

    return {discs, debris, particles}
  }, [seed])

  const coords = useMemo(() => {
    const f = (i: number) => {
      const x = Math.sin(seed + i) * 10000
      return x - Math.floor(x)
    }
    const lat = -60 + f(99) * 120 // range [-60, 60]
    const lon = -180 + f(100) * 360 // range [-180, 180]
    const alt = Math.floor(50 + f(101) * 950) // 50–1000 m
    return {lat, lon, alt}
  }, [seed])

  return (
    <div
      className={cn(
        'collage-container paper-bg relative overflow-hidden rounded-[8px] border border-neutral-800',
        isHighNoise ? 'collage-noise-strong' : 'collage-noise',
        isChaos && 'chaos-static'
      )}
      aria-label='Military documentary collage composition'>
      {/* Overlays */}
      <div className='paper-texture' aria-hidden='true' />
      <div className='scratch-overlay' aria-hidden='true' />
      <div className='scan-lines' aria-hidden='true' />
      <div className='grid-overlay' aria-hidden='true' />
      <div className='halftone-overlay' aria-hidden='true' />
      <div className='tear-lines' aria-hidden='true' />
      <div className='vignette' aria-hidden='true' />

      {/* Controls */}
      <div className='pointer-events-none absolute right-[16px] top-[16px] z-[30] flex gap-[8px]'>
        <div className='pointer-events-auto'>
          <Button
            variant='secondary'
            size='sm'
            className='uppercase tracking-[1px]'
            onClick={() => setSeed(Math.floor(Math.random() * 1000000))}>
            Shuffle
          </Button>
        </div>
        <div className='pointer-events-auto'>
          <Button
            variant='secondary'
            size='sm'
            className={cn(
              'uppercase tracking-[1px]',
              isHighNoise && 'bg-neutral-900 text-neutral-100'
            )}
            onClick={() => setIsHighNoise((v) => !v)}
            aria-pressed={isHighNoise}>
            Noise
          </Button>
        </div>
        <div className='pointer-events-auto'>
          <Button
            variant='secondary'
            size='sm'
            className={cn('uppercase tracking-[1px]', isChaos && 'bg-neutral-900 text-neutral-100')}
            onClick={() => setIsChaos((v) => !v)}
            aria-pressed={isChaos}>
            Distress
          </Button>
        </div>
      </div>

      {/* Header / Technical doc strip */}
      <header className='relative z-[10] flex items-baseline justify-between px-[24px] pt-[24px] my-0 mb-8'>
        <h1
          className='heading-main'
          style={{
            fontFamily:
              '"DIN Condensed","DIN Alternate","Eurostile","Bank Gothic","Orbitron","Rajdhani","Oxanium","Exo 2","Agency FB","Bahnschrift","Arial Narrow","Helvetica Neue",Arial,sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
          aria-label='Technical classified document title'>
          {data.pageTitle}
        </h1>
        <div className='text-right'>
          <div className='data-label'>{data.classification}</div>
          <div className='data-label'>{data.docId}</div>
        </div>
      </header>

      {/* Japanese vertical text (replaced with coordinates) */}
      <div className='jp-vertical' aria-label='Geographic coordinates'>
        {`${coords.lat >= 0 ? 'N' : 'S'} ${Math.abs(coords.lat).toFixed(4)}° / ${coords.lon >= 0 ? 'E' : 'W'} ${Math.abs(coords.lon).toFixed(4)}° / ALT ${coords.alt} m`}
      </div>

      {/* Top floating football-shaped objects */}

      {/* Center collage: explosive scenes, smoke plumes, debris */}
      <section className='relative z-[6] mx-[24px] mt-[8px] grid grid-cols-12 gap-[12px] mb-8'>
        {/* Left tall photo */}
        <figure
          className='photo-frame col-span-4 h-[360px] rotate-[-3deg]'
          aria-label='Explosive scene photograph A'>
          <img
            src='/explosive-combat-bw.png'
            alt='Explosive combat scene with smoke plumes and debris'
          />
          <figcaption className='sr-only'>Explosive combat scene</figcaption>
        </figure>

        {/* Center wide photo with plumes */}
        <figure
          className='photo-frame col-span-5 h-[280px] translate-y-[40px] rotate-[2deg]'
          aria-label='Explosive scene photograph B'>
          <img src='/placeholder-t4rkd.png' alt='Explosion with dramatic smoke plumes' />
          <figcaption className='sr-only'>Explosion with smoke</figcaption>
          <div className='smoke-plume smoke-plume-a' aria-hidden='true' />
          <div className='smoke-plume smoke-plume-b' aria-hidden='true' />
        </figure>

        {/* Right stack: table + photo */}
        <div className='col-span-3 flex flex-col gap-[12px]'>
          <div className='data-table'>
            <table>
              <tbody>
                <tr>
                  <td>DOC</td>
                  <td>{data.docId}</td>
                  <td>TS</td>
                  <td>{data.timestamp}</td>
                </tr>
                <tr>
                  <td>LOC</td>
                  <td colSpan={3}>{data.location}</td>
                </tr>
                <tr>
                  <td>STAT</td>
                  <td colSpan={3}>ACTIVE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <figure
            className='photo-frame h-[180px] rotate-[-1deg]'
            aria-label='Explosive scene photograph C'>
            <img src='/war-archive-smoke-ruins.png' alt='Archive war photograph, monochrome' />
          </figure>
        </div>

        {/* Debris shards */}
        {layout.debris.map((p, i) => (
          <div
            key={`debris-${i}`}
            className='debris'
            style={{
              left: `${p.left}vw`,
              top: `${p.top}vh`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              transform: `translate(-50%, -50%) rotate(${p.r}deg)`,
            }}
            aria-hidden='true'
          />
        ))}
      </section>

      {/* Cryptic text fragments */}
      <div className='cryptic-strip'>
        <span className='text-fragment'>
          "{'{'}SIG: #A7F-42{'}}'}"
        </span>
        <span className='text-fragment'>
          "{'{'}CHK: CRC-19C3{'}}'}"
        </span>
        <span className='text-fragment'>
          "{'{'}CHAN: HF-07{'}}'}"
        </span>
        <span className='text-fragment'>
          "{'{'}AUTH: {data.classification}
          {'}}'}"
        </span>
      </div>

      {/* Bottom nighttime fire photo */}
      <figure className='photo-strip' aria-label='Nighttime fire photograph'>
        <img src='/nighttime-fire-bw-long-exposure.png' alt='Night fire scene long exposure' />
        <div className='fire-flicker' aria-hidden='true' />
      </figure>

      {/* Official stamp bottom-right */}
      <div className='stamp' aria-label='Official classification stamp'>
        <div className='stamp-inner'>{'機密'}</div>
        <div className='stamp-ring' aria-hidden='true' />
      </div>

      {/* Footer technical signature */}
      <footer className='relative z-[10] flex items-center justify-between px-[24px] pb-[24px] pt-[12px]'>
        <div className='data-fragment'>
          "{'{'}ORIGIN: {data.location}
          {'}}'}"
        </div>
        <div className='data-fragment'>
          "{'{'}TIME: {data.timestamp}
          {'}}'}"
        </div>
        <div className='data-fragment'>
          "{'{'}VER: 1.0.0{'}}'}"
        </div>
      </footer>
    </div>
  )
}
