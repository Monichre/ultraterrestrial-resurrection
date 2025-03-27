import {getXataClient} from '@/db/xata'
const xata = getXataClient()

import dynamic from 'next/dynamic'
import {Suspense} from 'react'

const Loading = dynamic(() => import('@/components/loaders/loading').then((mod) => mod.Loading))

const WordCloud = dynamic(() =>
  import('@/features/3d/visualizations/word-cloud').then((mod) => mod.WordCloud)
)

const Spotlight = dynamic(() =>
  import('@/components/animated/spotlight').then((mod) => mod.Spotlight)
)

const StarsBackground = dynamic(() =>
  import('@/components/backgrounds/shooting-stars').then((mod) => mod.StarsBackground)
)

import {computeWordRefsWithPosition} from '@/utils/functions'

export default async function Index() {
  const events = await xata.db.events
    .sort('date', 'desc')
    .select(['name', 'location', 'photos', 'photos.signedUrl', 'photos.enablePublicUrl', 'date'])
    .getAll()
    .then((res) =>
      res.toSerializable().map(({xata: xataData, ...record}) => ({...record, type: 'events'}))
    )

  const topics = await xata.db.topics
    .getAll()
    .then((res) =>
      res.toSerializable().map(({xata: xataData, ...record}) => ({...record, type: 'topics'}))
    )

  const testimonies = await xata.db.testimonies
    .select([
      '*',
      'witness.id',
      'witness.name',
      'witness.role',
      'witness.photo',
      'witness.photo.signedUrl',
      'event.id',
      'event.name',
      'event.date',
    ])
    .getAll()
    .then((res) =>
      res.toSerializable().map(({xata: xataData, ...record}) => ({
        ...record,
        type: 'testimonies',
      }))
    )

  const organizations = await xata.db.organizations.getAll().then((res) =>
    res.toSerializable().map(({xata: xataData, ...record}) => ({
      ...record,
      type: 'organizations',
    }))
  )

  const personnel = await xata.db.personnel
    .select(['name', 'role', 'photo', 'photo.signedUrl', 'photo.enablePublicUrl'])
    .getAll()
    .then((res) =>
      res.toSerializable().map(({xata: xataData, ...record}) => ({
        ...record,
        type: 'personnel',
      }))
    )

  const topicsExpertsConnections = await xata.db['topic-subject-matter-experts'].getAll()
  const eventsExpertsConnections = await xata.db['event-subject-matter-experts'].getAll()

  const organizationsMembers = await xata.db['organization-members'].getAll()

  // This is a 3 way link. How to handle?
  const eventsTopicsExpertsConnections = await xata.db[
    'event-topic-subject-matter-experts'
  ].getAll()

  const topicsTestimoniesConnections = await xata.db['topics-testimonies'].getAll()

  const recordsWithoutPositioning = [
    ...events,
    ...topics,
    ...testimonies,
    ...personnel,
    ...organizations,
  ]
  const positionsByRecordId: any = {}
  const records = computeWordRefsWithPosition(positionsByRecordId, recordsWithoutPositioning)

  const formatConnections = (connectionsArray: any) => {
    return connectionsArray.map(({id, ...rest}: any) => {
      const [sourceData, targetData] = Object.entries(rest)

      const [sourceType, sourceObj]: any = sourceData
      const [targetType, targetObj]: any = targetData

      const sourceNodeExists = recordsWithoutPositioning.find(
        (record) => record.id === sourceObj.id
      )
      console.log('sourceNodeExists: ', sourceNodeExists)
      const targetNodeExists = recordsWithoutPositioning.find(
        (record) => record.id === targetObj.id
      )
      console.log('targetNodeExists: ', targetNodeExists)

      if (sourceNodeExists && targetNodeExists) {
        const end = positionsByRecordId[targetNodeExists.id]
        console.log('end: ', end)
        const start = positionsByRecordId[sourceNodeExists.id]

        console.log('start: ', start)
        return {id, source: sourceObj.id, target: targetObj.id, start, end}
      }
    })
  }
  const connections = formatConnections([
    ...topicsExpertsConnections.toSerializable(),
    ...eventsExpertsConnections.toSerializable(),
    ...organizationsMembers.toSerializable(),
    ...eventsTopicsExpertsConnections.toSerializable(),
    ...topicsTestimoniesConnections.toSerializable(),
  ])

  return (
    // bg-dot-white/[0.2]
    <Suspense fallback={<Loading />}>
      <div className='h-[100vw] overflow-hidden w-screen word-cloud-page bg-black relative '>
        <Spotlight className='-top-40 left-0 md:left-60 md:-top-20' fill='white' />

        <WordCloud records={records} connections={connections} />
        <StarsBackground />
      </div>
    </Suspense>
  )
}
