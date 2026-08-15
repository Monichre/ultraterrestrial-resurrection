import {cn} from '@/lib/utils'

import {SectionHeading} from '../shared'

import type {LinkedAttachmentsProps} from './types'

export function LinkedAttachments({
  items,
  title = 'Linked Attachments',
  onSelect,
  className,
}: LinkedAttachmentsProps) {
  return (
    <section
      className={cn(
        'border-t border-[oklch(0.55_0.04_75_/_0.3)] bg-[oklch(0.14_0.015_55_/_0.85)] px-4 py-3',
        className
      )}>
      <SectionHeading title={`${title} (${items.length})`} className='mb-3' />
      <div className='flex gap-2 overflow-x-auto pb-1'>
        {items.map((item) => {
          const Comp = onSelect ? 'button' : 'div'
          return (
            <Comp
              key={item.id}
              type={onSelect ? 'button' : undefined}
              onClick={onSelect ? () => onSelect(item.id) : undefined}
              className={cn(
                'w-[128px] shrink-0 rounded-sm border border-[oklch(0.55_0.04_75_/_0.35)] bg-black/25 p-2 text-left',
                'transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]',
                onSelect &&
                  'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70'
              )}>
              <div className='mb-2 aspect-square overflow-hidden rounded-[2px] bg-zinc-800'>
                {item.imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageSrc} alt='' className='size-full object-cover opacity-90' />
                ) : null}
              </div>
              <p className='truncate text-xs font-medium text-zinc-100'>{item.title}</p>
              <p className='truncate text-[10px] uppercase tracking-[0.1em] text-zinc-500'>
                {item.subtitle}
              </p>
            </Comp>
          )
        })}
      </div>
    </section>
  )
}
