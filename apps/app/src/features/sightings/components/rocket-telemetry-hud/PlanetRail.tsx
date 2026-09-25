import {PLANET_GLYPHS, type PlanetName} from './icons/planets'
import type {HudHotspotFocus, HudHotspotRow} from './types'

const DEFAULT_ROWS: ReadonlyArray<{name: PlanetName; value: string}> = [
  {name: 'Mercury', value: '4,879 KM'},
  {name: 'Venus', value: '12,104 KM'},
  {name: 'Earth', value: '12,742 KM'},
  {name: 'Mars', value: '6,779 KM'},
  {name: 'Jupiter', value: '139,820 KM'},
  {name: 'Saturn', value: '116,460 KM'},
  {name: 'Uranus', value: '50,724 KM'},
  {name: 'Neptune', value: '49,244 KM'},
]

type PlanetRailProps = {
  /** When provided, renders sightings hotspots instead of planet diameters. */
  hotspots?: ReadonlyArray<HudHotspotRow>
  onHotspotFocus?: (hotspot: HudHotspotFocus | null) => void
  activeHotspotName?: string | null
}

export const PlanetRail = ({hotspots, onHotspotFocus, activeHotspotName}: PlanetRailProps) => {
  if (hotspots && hotspots.length > 0) {
    return (
      <aside aria-label='Sighting hotspots' className='flex min-h-0 flex-col gap-2'>
        {hotspots.slice(0, 8).map((row) => {
          const isActive = activeHotspotName === row.name
          const canFocus = row.lat != null && row.lon != null
          return (
            <button
              key={row.name}
              type='button'
              disabled={!canFocus}
              className={`flex w-full items-center gap-3 border bg-transparent px-3 text-left transition-colors ${
                isActive
                  ? 'border-hud-accent text-hud-text-primary'
                  : 'border-hud-border hover:border-hud-accent'
              } ${canFocus ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
              style={{height: 44}}
              onMouseEnter={() => {
                if (canFocus && onHotspotFocus) {
                  onHotspotFocus({lat: row.lat!, lon: row.lon!, name: row.name})
                }
              }}
              onMouseLeave={() => onHotspotFocus?.(null)}
              onFocus={() => {
                if (canFocus && onHotspotFocus) {
                  onHotspotFocus({lat: row.lat!, lon: row.lon!, name: row.name})
                }
              }}
              onBlur={() => onHotspotFocus?.(null)}>
              <span
                className='flex shrink-0 items-center justify-center border border-hud-border text-[10px] text-hud-accent'
                style={{width: 22, height: 22}}
                aria-hidden>
                ▶
              </span>
              <span className='truncate text-[11px] font-medium uppercase tracking-[0.1em] text-hud-text-primary'>
                {row.name}
              </span>
              <span className='ml-auto text-[11px] tabular-nums text-hud-text-primary'>
                <span aria-hidden className='text-hud-text-secondary'>
                  —{' '}
                </span>
                {row.value}
              </span>
            </button>
          )
        })}
      </aside>
    )
  }

  return (
    <aside aria-label='Planet distances' className='flex flex-col gap-2'>
      {DEFAULT_ROWS.map(({name, value}) => {
        const Glyph = PLANET_GLYPHS[name]
        return (
          <div
            key={name}
            className='flex items-center gap-3 border border-hud-border bg-transparent px-3 transition-colors hover:border-hud-accent'
            style={{height: 44}}>
            <span
              className='flex shrink-0 items-center justify-center border border-hud-border'
              style={{width: 22, height: 22}}
              aria-hidden>
              <Glyph width={14} height={14} stroke='var(--hud-accent)' strokeWidth={1.25} />
            </span>
            <span className='text-[11px] font-medium uppercase tracking-[0.1em] text-hud-text-primary'>
              {name.toUpperCase()}
            </span>
            <span className='ml-auto text-[11px] tabular-nums text-hud-text-primary'>
              <span aria-hidden className='text-hud-text-secondary'>
                —{' '}
              </span>
              {value}
            </span>
          </div>
        )
      })}
    </aside>
  )
}
