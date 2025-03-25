// ./src/components/timeline/TimelineExample.tsx
import React from 'react'
import { Timeline } from './Timeline'

export const events = [
  {
    year: '1993',
    title: 'Pablo Honey',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_pablo-honey.webp'
  },
  {
    year: '1995',
    title: 'The Bends',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_the-bends.webp'
  },
  {
    year: '1997',
    title: 'OK Computer',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_ok-computer.webp'
  },
  // Add more events as needed
]

export const TimelineExample: React.FC = () => {
  return (
    <Timeline
      events={events}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800"
    />
  )
}
