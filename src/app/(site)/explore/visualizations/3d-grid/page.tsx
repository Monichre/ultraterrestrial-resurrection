import { ThreeDGrid } from '@/components/visualizations/3d-grid/3d-grid'

import { getXataClient } from '@/db/xata'
import { Suspense } from 'react'
const xata = getXataClient()

export default async function Index() {
  // const serializedRecords = records.toSerializable();
  const events = await xata.db.events.getAll()

  const topics = await xata.db.topics.getAll()

  const testimonies = await xata.db.testimonies.getAll()

  const organizations = await xata.db.organizations.getAll()

  const personnel = await xata.db.personnel.getAll()

  // const { events, personnel, topics, testimonies, organizations } =
  //   await getData()
  const data = [
    ...events.toSerializable(),
    ...topics.toSerializable(),
    ...testimonies.toSerializable(),
    ...organizations.toSerializable(),
    ...personnel.toSerializable(),
  ]

  console.log( 'data: ', data )

  return (
    <Suspense fallback={null}>
      <ThreeDGrid data={data} />
    </Suspense>
  )
}
