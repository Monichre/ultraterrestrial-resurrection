'use client'

import type {
  EventsRecord,
  PersonnelRecord,
  TopicsRecord,
  TestimoniesRecord,
  OrganizationsRecord,
} from '@db/xata'

// Helper to get count from paginated or array response
function getCount<T>(data: T[] | { records: T[] }): number {
  if (Array.isArray(data)) {
    return data.length
  }
  return data?.records?.length || 0
}

interface AdminDashboardProps {
  events: EventsRecord[] | { records: EventsRecord[] }
  keyFigures: PersonnelRecord[] | { records: PersonnelRecord[]; pagination?: unknown }
  topics: TopicsRecord[] | { records: TopicsRecord[] }
  testimonies: TestimoniesRecord[] | { records: TestimoniesRecord[] }
  organizations: OrganizationsRecord[] | { records: OrganizationsRecord[]; pagination?: unknown }
}

export function AdminDashboard({
  events,
  keyFigures,
  topics,
  testimonies,
  organizations,
}: AdminDashboardProps) {
  const eventsCount = getCount(events)
  const keyFiguresCount = getCount(keyFigures)
  const topicsCount = getCount(topics)
  const testimoniesCount = getCount(testimonies)
  const organizationsCount = getCount(organizations)

  return (
    <div className="relative z-10 h-full overflow-y-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Events Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">Events</h2>
          <p className="text-4xl font-bold text-purple-400">{eventsCount}</p>
          <p className="text-sm text-gray-400 mt-1">Total events in database</p>
        </div>

        {/* Key Figures Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">Key Figures</h2>
          <p className="text-4xl font-bold text-blue-400">{keyFiguresCount}</p>
          <p className="text-sm text-gray-400 mt-1">Personnel records</p>
        </div>

        {/* Topics Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">Topics</h2>
          <p className="text-4xl font-bold text-green-400">{topicsCount}</p>
          <p className="text-sm text-gray-400 mt-1">Research topics</p>
        </div>

        {/* Testimonies Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">Testimonies</h2>
          <p className="text-4xl font-bold text-yellow-400">{testimoniesCount}</p>
          <p className="text-sm text-gray-400 mt-1">Witness accounts</p>
        </div>

        {/* Organizations Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">Organizations</h2>
          <p className="text-4xl font-bold text-red-400">{organizationsCount}</p>
          <p className="text-sm text-gray-400 mt-1">Associated organizations</p>
        </div>
      </div>
    </div>
  )
}
