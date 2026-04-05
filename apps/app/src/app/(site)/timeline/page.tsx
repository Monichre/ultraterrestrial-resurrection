import {getXataClient, type EventsRecord} from '@db'
import type {JSONData} from '@xata.io/client'
import {TimelineViews} from './timeline-views'
import {CustomCursor} from '@/components/cursor-ui/CustomCursor'

const xata = getXataClient()

const TIMELINE_PAGE_SIZE = 100

async function getHistoricEvents() {
  const events: JSONData<EventsRecord>[] = []
  const baseQuery = xata.db.events
    .filter({
      category: {$includes: 'historic'},
    })
    .sort('date', 'desc')
    .select([
      'name',
      'description',
      'location',
      'latitude',
      'longitude',
      'date',
      'photos',
      'photos.signedUrl',
      'photos.enablePublicUrl',
      {
        name: '<-event-subject-matter-experts.event',
        columns: ['*'],
        as: 'experts',
      },
    ])

  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await baseQuery.getPaginated({
      pagination: {size: TIMELINE_PAGE_SIZE, offset: (page - 1) * TIMELINE_PAGE_SIZE},
    })

    events.push(...result.records.map((record) => record.toSerializable()))
    const nextPageExists = typeof result.hasNextPage === 'function' ? result.hasNextPage() : !!result.hasNextPage
    hasNextPage = nextPageExists && result.records.length > 0
    page += 1
  }

  return events
}

export default async function TimelinePage() {
  const events = await getHistoricEvents()

  return (
    <div className='h-screen w-screen'>
      <CustomCursor />
      <TimelineViews events={events} />
    </div>
  )
}
