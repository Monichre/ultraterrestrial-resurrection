import type {Metadata} from 'next'
import {NoteApp} from '@/components/writers-desk/note-app'
import {NoteWidget} from '@/components/writers-desk/note-letter'
import {PaperSurface} from '@/components/writers-desk/PaperSurface'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Research notes, founder letter, and editor workspace.',
}

export default function ResearchPage() {
  return (
    <PaperSurface as='div' variant='research' className='min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mt-8'>
          <NoteApp />
        </div>
        <NoteWidget />
      </div>
    </PaperSurface>
  )
}
