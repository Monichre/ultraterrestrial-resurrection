'use  client'

import { memo, type FunctionComponent } from 'react'

import { ConnectionsIcon } from '@/components/icons'
import { Button } from '@/components/ui/button/button'
import { Separator } from '@/components/ui/separator'

interface EntityCardUtilityMenuProps {
  updateNote: any
  bookmarked: boolean

  saveNote: any
  userNote: any
  findConnections?: any
}

export const EM: FunctionComponent<EntityCardUtilityMenuProps> = ( {
  updateNote,
  userNote,

  saveNote,
  findConnections,
} ) => {
  return (
    <div className='w-auto flex'>
      <Button variant='ghost' onClick={findConnections} className='p-0'>
        <ConnectionsIcon className='h-5 w-5 text-white stroke-1' />
      </Button>
      <Separator orientation='vertical' className='ml-4' />
      {/* <AddNote saveNote={saveNote} userNote={userNote} updateNote={updateNote} /> */}
    </div>
  )
}
EM.displayName = 'EntityCardUtilityMenu'
export const EntityCardUtilityMenu = memo( EM )
