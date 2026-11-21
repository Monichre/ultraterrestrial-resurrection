import {cn} from '@/lib/utils'

import {PAPER_TEXTURES} from '../shared/tokens'

import type {FieldReportCanvasProps} from './types'

export function FieldReportCanvas({document, className}: FieldReportCanvasProps) {
  return (
    <div className={cn('relative overflow-auto px-4 py-5', className)}>
      <article
        className='relative mx-auto min-h-[520px] max-w-3xl rounded-[2px] border border-[oklch(0.55_0.04_70_/_0.35)] px-8 py-8 shadow-[0_18px_40px_rgba(0,0,0,0.45)]'
        style={{
          backgroundColor: 'oklch(0.9 0.03 90)',
          backgroundImage: `linear-gradient(oklch(0.9 0.03 90 / 0.88), oklch(0.88 0.035 85 / 0.92)), url(${PAPER_TEXTURES.groove})`,
          backgroundRepeat: 'repeat',
          color: 'oklch(0.24 0.03 70)',
        }}>
        <div className='mb-6 flex items-start justify-between gap-4'>
          <div
            className='flex size-16 items-center justify-center rounded-full border-2 border-[oklch(0.35_0.05_70)] text-[10px] font-bold uppercase tracking-[0.14em]'
            style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
            {document.sealLabel ?? 'AAF'}
          </div>
          {document.stampLabel ? (
            <div
              className='rotate-[-8deg] rounded-sm border-[3px] border-[oklch(0.5_0.2_25)] px-3 py-1 text-sm font-bold uppercase tracking-[0.2em] text-[oklch(0.5_0.2_25)] opacity-90'
              style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
              {document.stampLabel}
            </div>
          ) : null}
        </div>

        <h3
          className='mb-5 text-xl font-bold uppercase tracking-[0.06em]'
          style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
          {document.title}
        </h3>

        <div className='mb-6 grid gap-2 sm:grid-cols-2'>
          {document.fields.map((field) => (
            <div key={field.label} className='text-sm'>
              <span
                className='mr-2 uppercase tracking-[0.08em] opacity-70'
                style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
                {field.label}:
              </span>
              <span
                className='border-b border-[oklch(0.35_0.04_70_/_0.45)] pb-0.5'
                style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
                {field.value}
              </span>
            </div>
          ))}
        </div>

        <div className='relative grid gap-6 lg:grid-cols-[1fr_140px]'>
          <div className='space-y-4 text-[13px] leading-relaxed'>
            {document.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className='text-pretty'
                style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
                {paragraph}
              </p>
            ))}
          </div>

          {document.media?.length ? (
            <div className='flex flex-row flex-wrap justify-end gap-3 lg:flex-col lg:items-end'>
              {document.media.map((item, index) => (
                <figure
                  key={item.id}
                  className={cn(
                    'relative w-[120px] border border-[oklch(0.4_0.03_70_/_0.35)] bg-[oklch(0.82_0.02_85)] p-1.5 shadow-[2px_3px_8px_rgba(0,0,0,0.25)]',
                    index % 2 === 0 ? 'rotate-1' : '-rotate-2'
                  )}>
                  <div
                    aria-hidden
                    className='absolute -top-2 left-1/2 h-3 w-10 -translate-x-1/2 rotate-[-2deg] bg-[oklch(0.82_0.04_85_/_0.75)]'
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={cn(
                      'aspect-square w-full object-cover',
                      item.kind === 'diagram' && 'object-contain bg-white p-1'
                    )}
                  />
                  {item.caption ? (
                    <figcaption
                      className='mt-1 text-center text-[10px] uppercase tracking-[0.1em] opacity-70'
                      style={{fontFamily: "var(--font-special-elite), 'Special Elite', monospace"}}>
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </div>
  )
}
