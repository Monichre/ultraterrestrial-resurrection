import {getHistoricEvents, type EventsRecord} from '@db/postgres'
import {TimelineViews} from './timeline-views'
import {CustomCursor} from '@/components/cursor-ui/CustomCursor'

export const dynamic = 'force-dynamic'

export default async function TimelinePage() {
  const events = await getHistoricEvents(500)

  return (
    <div className='h-screen w-screen'>
      <CustomCursor />
      <TimelineViews events={events} />
    </div>
  )
}
