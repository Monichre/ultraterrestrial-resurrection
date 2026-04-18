import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ThreeDTimelineJourney } from '@/features/3d/3d-timeline-journey'
import { getXataClient } from '@db'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

dayjs.extend(utc)

const xata = getXataClient()

export default async function Index() {
  const records = await xata.db.events
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

  const expertPersonnel = await xata.db['event-subject-matter-experts']
    .select( [
      'event.id',
      'subject-matter-expert.id',
      'subject-matter-expert.name',
      'subject-matter-expert.photo',
    ] )
    .getAll()

  const personnel = expertPersonnel
    .toSerializable()
    .map( ( { event, ...rest } ) => ( {
      ...rest['subject-matter-expert'],
      eventId: event?.id,
    } ) )

  const data = records.toSerializable()

  const events = data.map( ( event ) => {
    if ( event?.experts?.records ) {
      const experts = event.experts.records.map( ( expert ) => expert )
      return {
        ...event,
        experts,
      }
    }
    return event
  } )

  const removeEmptyKeys = ( obj: Record<string, unknown[]> ) => {
    const newObj: Record<string, unknown[]> = {}
    for ( const key in obj ) {
      if ( obj[key] && ( obj[key] as unknown[] ).length ) {
        newObj[key] = obj[key] as unknown[]
      }
    }
    return newObj
  }

  function removeLeadingZero( input: string ) {
    const str = String( input )
    return str.startsWith( '0' ) ? str.slice( 1 ) : str
  }

  const eventsByYear = removeEmptyKeys(
    events.reduce( ( acc: Record<string, unknown[]>, item ) => {
      const year = removeLeadingZero( item.date.split( '-' )[0] )

      if ( acc[year] ) {
        acc[year].push( item )
      } else {
        acc[year] = []
        acc[year].push( item )
      }
      return acc
    }, {} )
  )

  return (
    <Suspense fallback={null}>
      <ThreeDTimelineJourney events={eventsByYear} experts={personnel} />
    </Suspense>
  )
}
