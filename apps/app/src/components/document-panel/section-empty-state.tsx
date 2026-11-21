import {Inbox} from 'lucide-react'

export function SectionEmptyState({message}: {message: string}) {
  return (
    <p className='dp-empty'>
      <Inbox width={13} height={13} strokeWidth={1.7} aria-hidden />
      {message}
    </p>
  )
}
