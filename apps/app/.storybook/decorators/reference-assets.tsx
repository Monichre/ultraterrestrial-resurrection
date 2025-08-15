import type {DecoratorFunction} from '@storybook/types'
import type {ReactRenderer} from '@storybook/react'
import React from 'react'

type RefItem = {
  src: string
  alt?: string
  caption?: string
  href?: string
}

type RefAssetsParams = {
  title?: string
  position?: 'top' | 'bottom'
  maxWidth?: number | string
  items?: RefItem[]
  images?: RefItem[]
  assets?: RefItem[]
}

function resolveItems(params?: RefAssetsParams): RefItem[] {
  if (!params) return []
  return params.items || params.images || params.assets || []
}

export const withReferenceAssets: DecoratorFunction<ReactRenderer, any> = (Story, context) => {
  const cfg = (context.parameters as any).referenceAssets as RefAssetsParams | undefined
  const items = resolveItems(cfg)
  if (!cfg || items.length === 0) return <Story />

  const section = (
    <section
      className='w-full max-w-6xl mx-auto my-4 px-4'
      style={{maxWidth: cfg.maxWidth || '1200px'}}>
      <div className='mb-2 text-xs uppercase tracking-[0.35em] text-zinc-400'>
        {cfg.title || 'Reference Images'}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {items.map((it, idx) => (
          <figure key={idx} className='rounded border border-white/10 bg-white/5 overflow-hidden'>
            {it.href ? (
              <a href={it.href} target='_blank' rel='noreferrer'>
                <img
                  src={it.src}
                  alt={it.alt || 'reference'}
                  className='w-full h-48 object-cover'
                />
              </a>
            ) : (
              <img src={it.src} alt={it.alt || 'reference'} className='w-full h-48 object-cover' />
            )}
            {(it.caption || it.alt) && (
              <figcaption className='p-2 text-[11px] text-zinc-300'>
                {it.caption || it.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )

  return (
    <>
      {cfg.position === 'top' ? section : null}
      <Story />
      {cfg.position !== 'top' ? section : null}
    </>
  )
}
