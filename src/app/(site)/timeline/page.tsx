import { getXataClient, type EventsRecord } from '@/db/xata'
import { type JSONData } from '@xata.io/client'
import { TimelineViews } from './timeline-views'

const xata = getXataClient()

export default async function TimelinePage() {
  const events: JSONData<EventsRecord>[] = await xata.db.events
    .filter( {
      category: { $includes: "historic" },
    } )
    .sort( 'date', 'desc' )
    .select( [
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
    ] )
    .getAll()
    .then( ( data ) => data.toSerializable() )

  return <TimelineViews events={events} />
}
