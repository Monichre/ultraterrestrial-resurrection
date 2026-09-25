'use client'

import { useMemo, useState } from 'react'

import { SectionHeading } from '../components/section-heading'
import { TagPill } from '../components/tag-pill'

import { GALLERY_SECTIONS, listGalleryImages } from './catalog'
import type { GalleryImage } from './types'

const REGISTERS: Array<GalleryImage['register'] | 'all'> = [
  'all',
  'archival-material',
  'techno-analytical',
  'neutral',
]

export function Gallery() {
  const [register, setRegister] = useState<(typeof REGISTERS)[number]>('all')
  const [tag, setTag] = useState<string | null>(null)

  const tags = useMemo(() => {
    const all = GALLERY_SECTIONS.flatMap((section) => section.items.flatMap((item) => item.tags))
    return [...new Set(all)]
  }, [])

  const items = listGalleryImages({
    register: register === 'all' ? undefined : register,
    tag: tag ?? undefined,
  })

  return (
    <div className="space-y-8 bg-[oklch(0.12_0.02_255)] p-8 text-zinc-200">
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.72_0.1_195)]">
          Image gallery
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Textures and motifs</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Assets live in packages/disclosure-ui/assets and are served at /disclosure-ui.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {REGISTERS.map((value) => (
          <TagPill
            key={value}
            label={value}
            variant={register === value ? 'teal' : 'outline'}
            isActive={register === value}
            onClick={() => setRegister(value)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((value) => (
          <TagPill
            key={value}
            label={value}
            variant={tag === value ? 'amber' : 'slate'}
            isActive={tag === value}
            onClick={() => setTag((current) => (current === value ? null : value))}
          />
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure
            key={item.id}
            className="overflow-hidden rounded-sm border border-white/10 bg-black/25"
          >
            <div
              className="h-36 w-full bg-zinc-900 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.src})` }}
              role="img"
              aria-label={item.alt}
            />
            <figcaption className="space-y-1 p-3">
              <SectionHeading title={item.id} subtitle={item.alt} />
              <p className="font-mono text-[10px] text-zinc-500">{item.src}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
