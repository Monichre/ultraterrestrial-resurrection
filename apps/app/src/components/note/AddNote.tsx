import { AddNoteFloatingPanel } from './AddNoteFloatingPanel'
import { AddNotePopover } from './AddNotePopover'

export const AddNote = ( { popover = true, ...rest }: { popover?: boolean, saveNote: () => void } ) => {
  return popover ? <AddNotePopover {...rest} /> : <AddNoteFloatingPanel {...rest} />
}