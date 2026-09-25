import {cn} from '@/lib/utils'

import {SectionHeading} from '../shared'
import {RESEARCH_DESK_TOKENS} from '../shared/tokens'

import type {InsightWidgetsProps} from './types'

export function InsightWidgets({
  timeline,
  mapLabel = 'New Mexico region',
  clusters,
  suggestions,
  onSuggestionClick,
  className,
}: InsightWidgetsProps) {
  const years = timeline.map((point) => point.year)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const span = Math.max(maxYear - minYear, 1)

  return (
    <section className={cn('grid gap-3 md:grid-cols-2 xl:grid-cols-4', className)}>
      <div className='rounded-md border border-white/10 bg-[oklch(0.17_0.02_255)] p-3'>
        <SectionHeading title='Mini Timeline' className='mb-3' />
        <div className='relative h-16'>
          <div className='absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15' />
          {timeline.map((point) => {
            const left = ((point.year - minYear) / span) * 100
            return (
              <div
                key={point.id}
                className='absolute top-1/2 -translate-x-1/2 -translate-y-1/2'
                style={{left: `${left}%`}}
                title={`${point.year}: ${point.label}`}>
                <span
                  className='block size-2.5 rounded-full border border-[oklch(0.17_0.02_255)]'
                  style={{background: RESEARCH_DESK_TOKENS.amber}}
                />
                <span className='absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[9px] tabular-nums text-zinc-500'>
                  {point.year}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className='rounded-md border border-white/10 bg-[oklch(0.17_0.02_255)] p-3'>
        <SectionHeading title='Geospatial Context' className='mb-3' />
        <div className='relative h-24 overflow-hidden rounded-sm border border-white/10 bg-[radial-gradient(circle_at_30%_40%,oklch(0.28_0.04_200),oklch(0.16_0.02_255))]'>
          <span className='absolute left-[42%] top-[48%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300 shadow-[0_0_12px_oklch(0.72_0.1_195)]' />
          <span className='absolute left-[58%] top-[36%] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/90' />
          <p className='absolute bottom-2 left-2 text-[10px] uppercase tracking-[0.12em] text-zinc-400'>
            {mapLabel}
          </p>
        </div>
      </div>

      <div className='rounded-md border border-white/10 bg-[oklch(0.17_0.02_255)] p-3'>
        <SectionHeading title='Theory Cluster Map' className='mb-3' />
        <div className='grid grid-cols-3 gap-1.5'>
          {clusters.map((cell) => (
            <div
              key={cell.id}
              className='aspect-square rounded-[4px] border border-white/10 p-1.5 text-[9px] leading-tight text-zinc-200'
              style={{
                background: `oklch(0.72 0.12 155 / ${0.12 + cell.intensity * 0.35})`,
              }}
              title={cell.label}>
              {cell.label}
            </div>
          ))}
        </div>
      </div>

      <div className='rounded-md border border-white/10 bg-[oklch(0.17_0.02_255)] p-3'>
        <SectionHeading title='AI Suggested Connections' className='mb-3' />
        <ul className='space-y-2'>
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type='button'
                onClick={() => onSuggestionClick?.(item.id)}
                className='w-full rounded-sm border border-emerald-400/20 bg-emerald-400/5 px-2 py-2 text-left transition-colors hover:bg-emerald-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/70'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-xs font-medium text-emerald-100'>{item.label}</span>
                  <span className='text-[10px] tabular-nums text-emerald-300/80'>
                    {item.confidence.toFixed(2)}
                  </span>
                </div>
                <p className='mt-1 text-[11px] leading-snug text-zinc-400'>{item.rationale}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
