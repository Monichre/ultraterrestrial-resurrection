
import { ScrollTimeline } from './scroll-timeline'

const ufoTimelineData = [
  { year: '1947', events: [{ title: 'Kenneth Arnold sighting', description: 'Flying saucer sighting over Mount Rainier' }] },
  { year: '1961', events: [{ title: 'Betty and Barney Hill', description: 'First documented abduction' }] },
  { year: '1976', events: [{ title: 'Tehran Incident', description: 'Iranian jet interceptors encounter UFO' }] },
  { year: '1980', events: [{ title: 'Rendlesham Forest', description: 'UKRAF Bentwaters incident' }] },
  { year: '2004', events: [{ title: 'USS Nimitz', description: 'Tic Tac UFO encounter' }] },
  { year: '2017', events: [{ title: 'NYT Article', description: 'AATIP disclosure to public' }] },
]

export default function HistoryPage() {
  return (
    <div className="w-full h-full relative">
      <ScrollTimeline ufoTimelineData={ufoTimelineData} />
    </div>
  )
}