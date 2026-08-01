import type {EventsRecord} from '@db/postgres'
import {motion} from 'framer-motion'
import Image from 'next/image'

const EVENT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})

export interface ScrollThroughTimelineProps {
  events: EventsRecord[]
  years?: ReadonlyArray<string | number>
  activeYear?: string | number | null
}

const formatEventDate = (dateValue: string | null) => {
  if (!dateValue) return 'Date unrecorded'

  const parsedDate = new Date(dateValue)
  return Number.isNaN(parsedDate.getTime()) ? dateValue : EVENT_DATE_FORMATTER.format(parsedDate)
}

const getEventTitle = (event: EventsRecord) => event.name ?? event.title ?? 'Untitled event'

const isSupportedImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('/')) return true

  try {
    const parsedUrl = new URL(imageUrl)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

const EventTimelineItem = ({event}: {event: EventsRecord}) => {
  const eventTitle = getEventTitle(event)
  const photoUrl = event.photos?.find(isSupportedImageUrl)

  return (
    <motion.article
      className='grid gap-6 border-b border-[var(--ut-line)] py-8 md:grid-cols-[minmax(0,1fr)_minmax(16rem,28rem)]'
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.25, ease: 'easeOut'}}
      viewport={{once: true, amount: 0.25}}>
      <div className='space-y-3'>
        <p className='font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ut-ink-faint)]'>
          {formatEventDate(event.date)}
        </p>
        <h2 className='text-2xl text-[var(--ut-paper)]'>{eventTitle}</h2>
        {event.location && <p className='text-sm text-[var(--ut-ink-dim)]'>{event.location}</p>}
      </div>

      {photoUrl && (
        <div className='relative aspect-[3/2] overflow-hidden border border-[var(--ut-line)]'>
          <Image
            src={photoUrl}
            alt={`Source image for ${eventTitle}`}
            fill
            sizes='(min-width: 768px) 28rem, calc(100vw - 2rem)'
            className='object-cover'
            unoptimized
          />
        </div>
      )}
    </motion.article>
  )
}

export const ScrollThroughTimeline = ({
  events,
  years = [],
  activeYear = null,
}: ScrollThroughTimelineProps) => {
  const normalizedActiveYear = activeYear === null ? null : String(activeYear)
  const visibleEvents = normalizedActiveYear
    ? events.filter((event) => event.date?.startsWith(normalizedActiveYear))
    : events

  return (
    <section className='mx-auto w-full max-w-6xl px-4 py-8'>
      {years.length > 0 && (
        <ol
          aria-label='Timeline years'
          className='mb-8 flex flex-wrap gap-3 border-b border-[var(--ut-line)] pb-4'>
          {years.map((year) => {
            const normalizedYear = String(year)
            const isActive = normalizedYear === normalizedActiveYear

            return (
              <li
                key={normalizedYear}
                aria-current={isActive ? 'date' : undefined}
                className={
                  isActive
                    ? 'font-mono text-xs text-[var(--ut-paper)]'
                    : 'font-mono text-xs text-[var(--ut-ink-faint)]'
                }>
                {normalizedYear}
              </li>
            )
          })}
        </ol>
      )}

      {visibleEvents.length > 0 ? (
        visibleEvents.map((event) => <EventTimelineItem key={event.id} event={event} />)
      ) : (
        <p className='py-12 text-center text-sm text-[var(--ut-ink-dim)]'>
          No event records match this period.
        </p>
      )}
    </section>
  )
}
