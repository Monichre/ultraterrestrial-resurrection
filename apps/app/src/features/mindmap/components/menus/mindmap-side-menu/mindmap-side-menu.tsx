/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aLUPWlh
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  FloatingPanelBody,
  FloatingPanelButton,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelForm,
  FloatingPanelRoot,
  FloatingPanelSubmitButton,
  FloatingPanelTextarea,
  FloatingPanelTrigger,
} from '@/components/animated'

import {Button} from '@/components/ui/button'
import {useMindMap} from '@/contexts/mindmap'
import {saveEventForUser} from '@/features/user/api/save-event'
import {ICON_GREEN} from '@/utils'
import {useAuth} from '@clerk/nextjs'

import {ArrowDown, FileSearch, Lightbulb, Plus} from 'lucide-react'
import {useCallback, useEffect, useRef, useState} from 'react'

import type {MindMapNode} from '@/features/mindmap/actions/fetch-next-mindmap-records'
import {QuickActionsFloatingPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/QuickActionsFloatingPanel'

export interface UserNode extends MindMapNode {
  type: 'userInputNode'
  data: {
    label: string
    input: string
    entities: MindMapNode[]
    type: string
  }
}

export function MindMapSideMenu() {
  const {
    showLocationVisualization,
    locationsToVisualize,
    toggleLocationVisualization,
    conciseViewActive,
    toggleConciseView,
    saveMindMap,
  } = useMindMap()

  const [bookmarked, setBookmarked] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [note, setNote] = useState<string>('')

  const saveNote = async () => {
    setBookmarked(true)
    // const model = objectMapToSingular[card?.type]

    const saved = await saveEventForUser({
      user,
      event: {id: null},
      userNote: {title: noteTitle, content: note},
      theory: 'test',
    })
  }

  const updateNote = ({target: {value}}: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(value)
  }

  const userAuth = useAuth()
  const user = userAuth?.userId ? userAuth : null

  const [isConcise, setIsConcise] = useState(conciseViewActive)
  const pressed = isConcise
    ? {
        color: 'rgb(244 244 245 / var(--tw-text-opacity))',
        backgroundColor: 'rgb(75 85 99 / var(--tw-bg-opacity))',
      }
    : {}

  useEffect(() => {
    setIsConcise(conciseViewActive)
  }, [conciseViewActive])

  const handleSavingNote = () => {
    saveNote()
  }

  const handleSubmit = () => {
    handleSavingNote()
  }
  const [crossed, setCrossed] = useState(false)
  const handleClick = () => {
    setCrossed(!crossed)
  }

  return (
    // max-w-max m-auto
    <FloatingPanelRoot>
      <div className='flex flex-col shadow items-center justify-between rounded-full p-1 border border-white/50 dark:border-neutral-700 text-neutral-500 bg-gradient-to-b from-card/70 rounded-[calc(var(--radius)-2px)]'>
        <div className='flex flex-col items-center relative'>
          <QuickActionsFloatingPanel />
          {/* <Button
          variant='ghost'
          size='icon'
          className='text-zinc-100 rounded-full hover:bg-gray-600 hover:text-zinc-100 m-2'
          onClick={toggleLocationVisualization}
        >
          <SketchyGlobe className='stroke-1 h-5 w-5 block' />
          <span className='sr-only'>Open menu</span>
        </Button> */}

          <Button
            variant='ghost'
            size='icon'
            className='text-zinc-100 rounded-full hover:bg-gray-600 hover:text-zinc-100 m-2'
            onClick={saveMindMap}>
            <ArrowDown className='stroke-1 h-5 w-5 block' stroke={ICON_GREEN} />
            <span className='sr-only'>Open menu</span>
          </Button>
        </div>
      </div>
    </FloatingPanelRoot>
  )
}
