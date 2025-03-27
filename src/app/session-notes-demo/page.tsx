'use client'

import {SessionNotes} from '@/features/mindmap/components/status-ui/session-notes'

export default function SessionNotesDemo() {
  return (
    <div className='min-h-screen bg-gray-900 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Session Notes Demo</h1>
        <p className='mb-8'>
          This page demonstrates the SessionNotes component with slide-out drawers using Vaul Base.
          Look for the tab on the right side of the screen and click it to open the drawer.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-gray-800 rounded-lg p-6'>
            <h2 className='text-xl font-bold mb-4'>Features</h2>
            <ul className='list-disc list-inside space-y-2'>
              <li>Right-side slide-out drawer</li>
              <li>Stacked tab design</li>
              <li>Nested drawers for detailed view</li>
              <li>Animated transitions</li>
              <li>Mobile-friendly interface</li>
            </ul>
          </div>

          <div className='bg-gray-800 rounded-lg p-6'>
            <h2 className='text-xl font-bold mb-4'>Implementation Details</h2>
            <ul className='list-disc list-inside space-y-2'>
              <li>Built with Vaul Base</li>
              <li>Uses Framer Motion for animations</li>
              <li>Styled with Tailwind CSS</li>
              <li>Fully accessible</li>
              <li>TypeScript implementation</li>
            </ul>
          </div>
        </div>
      </div>

      <SessionNotes />
    </div>
  )
}
