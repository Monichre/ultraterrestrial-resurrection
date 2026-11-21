import type {Metadata} from 'next'
import {NoteLetter} from '@/components/writers-desk/note-letter'
import {PaperSurface} from '@/components/writers-desk/PaperSurface'

export const metadata: Metadata = {
  title: 'Introducing Interfere',
  description: 'Interfere is building the self-healing layer of the internet.',
}

export default function NotePage() {
  return (
    <PaperSurface as='main' variant='desk' className='flex min-h-screen items-start justify-center'>
      <NoteLetter />
    </PaperSurface>
  )
}
