import { FloatingPanelCloseButton, FloatingPanelContent, FloatingPanelFooter, FloatingPanelForm, FloatingPanelRoot, FloatingPanelSubmitButton, FloatingPanelTextarea, FloatingPanelTrigger } from "@/components/animated"
import { Lightbulb } from "lucide-react"

export function AddNoteFloatingPanel( { saveNote, ...rest }: { saveNote: any } ) {
  return (
    <FloatingPanelRoot>


      <FloatingPanelTrigger className='bg-black'> <Lightbulb className='text-white stroke-1' size='16' /></FloatingPanelTrigger>

      <FloatingPanelContent className='bg-black text-white border border-indigo-500/20'>
        <FloatingPanelForm onSubmit={saveNote}>
          {/* <FloatingPanelLabel htmlFor="note-input">Add Note</FloatingPanelLabel> */}
          <FloatingPanelTextarea id="note-input" />
          <FloatingPanelFooter>
            <FloatingPanelCloseButton />
            <FloatingPanelSubmitButton />
          </FloatingPanelFooter>
        </FloatingPanelForm>
      </FloatingPanelContent>



    </FloatingPanelRoot >
  )
}
