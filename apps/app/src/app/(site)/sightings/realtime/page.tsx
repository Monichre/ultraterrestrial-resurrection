'use client'

import {Suspense} from 'react'
import {RealtimeSightingsInterface} from '@/features/sightings/components/realtime-sightings-interface'

// This page is now a client-side interface for real-time sightings

export default function RealtimeSightingsPage() {
  return (
    <div className='min-h-screen bg-black'>
      <Suspense
        fallback={
          <div className='w-full h-screen flex items-center justify-center'>
            <div className='text-white font-mono'>Loading real-time sightings...</div>
          </div>
        }>
        <RealtimeSightingsInterface />
      </Suspense>
    </div>
  )
}
