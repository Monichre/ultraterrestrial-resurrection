/* eslint-disable react/display-name */
'use client'
import {memo, useEffect, useState, useCallback, Suspense} from 'react'
import {Handle, Position, useNodesData, useUpdateNodeInternals} from '@xyflow/react'
import {AskAI} from '@/features/mindmap/components/ask-ai'
import {useEntity} from '@/hooks'
import {renderEntity} from '@/features/mindmap/components/cards/render-entity-card'
import type {FC, ReactElement} from 'react'
import {
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverForm,
  PopoverRoot,
  PopoverSubmitButton,
  PopoverTextarea,
  PopoverTrigger,
} from '@/components/animated'
import {AiStarIcon, ConnectionsIcon} from '@/components/icons'
import {AddNote} from '@/components/note/AddNote'
import {Button} from '@/components/ui/button'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {TestimonyCoreNodeBottom} from '@/features/mindmap/components/cards/testimony-card'
import {
  CoreNodeBottom,
  CoreNodeContainer,
  CoreNodeContent,
  CoreNodeTop,
} from '@/features/mindmap/nodes/core-node-ui'
import {ICON_GREEN, cn} from '@/utils'
import {Lightbulb} from 'lucide-react'

interface Photo {
  id: string
  name: string
  mediaType: string
  enablePublicUrl: boolean
  signedUrlTimeout: number
  uploadUrlTimeout: number
  size: number
  version: number
  url: string
}

export const IconMenuWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div
      className='flex items-center gap-1 rounded-full bg-neutral-200 py-1 pl-2 pr-2.5 text-neutral-700 text-neutral-400 border border-white/50'
      style={{
        borderColor: 'rgba(255, 255, 255, 0.5)',
        transform: 'translateX(0px)',
      }}>
      <div className=''>
        <span
          className='relative flex align-middle items-center content-center justify-start shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer shadow duration-200 pointer-events-none'
          data-state='closed'
          // style={{
          //   borderColor: 'rgba(255, 255, 255, 0.5)',
          //   transform: 'translateX(0px)',
          // }}
        >
          {children}
        </span>
      </div>
      <span className='text-neutral-600 text-neutral-400'></span>
    </div>
  )
}

type EntityType =
  | 'personnel'
  | 'organizations'
  | 'events'
  | 'artifact'
  | 'documents'
  | 'testimonies'
  | 'topics'

interface Analysis {
  text: string
  records: unknown[]
}

interface EntityNodeProps {
  id: string
  data: {
    type: EntityType
    handles?: string[]
    entities?: Array<{data: {name: string}}>
    input?: string
  }
}

const AskAIWrapper: FC<{
  question: string
  table: EntityType
  updateAnalysis: (analysis: Analysis) => void
}> = ({question, table, updateAnalysis}): ReactElement => (
  <Suspense fallback={<div className='text-sm text-neutral-400'>Loading...</div>}>
    <AskAI question={question} table={table} updateAnalysis={updateAnalysis} />
  </Suspense>
)

const EntityNode: FC<EntityNodeProps> = memo(function EntityNode(props): ReactElement {
  const {id, data} = props
  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles] = useState<string[]>([])
  const [showAskAI, setShowAskAI] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  const toggleShowAskAI = useCallback(() => {
    setShowAskAI((prev) => !prev)
  }, [])

  const updateAnalysis = useCallback((newAnalysis: Analysis) => {
    setAnalysis(newAnalysis)
  }, [])

  const nodeData = useNodesData(id)
  const type = data.type

  const component = renderEntity({
    type: data.type,
    data: {
      ...data,
      id,
    },
  })

  const {
    entity,
    saveNote,
    updateNote,
    userNote,
    connectionListConnections,
    handleHoverEnter,
    findConnections,
  } = useEntity({
    card: {
      ...data,
      id,
    },
  })

  useEffect(() => {
    updateNodeInternals(id)
    if (data?.handles?.length) {
      updateNodeInternals(id)
      setHandles(data.handles)
    }
  }, [id, data, updateNodeInternals])

  const askQuestion = useCallback(
    ({entities, input, type}: {entities: string[]; input: string; type: string}) => {
      const names = entities.join(', ')
      return `Given the following ${type}s: ${names}, what are some related data points and related avenues worth exploring in regard to their story in its own right and their role in the state of disclosure as we know it??`
    },
    []
  )

  return (
    <>
      <PopoverRoot>
        <Handle type='target' position={Position.Top} />
        <CoreNodeContainer
          className={cn(
            'motion-opacity-in-0 min-w-[200px] w-content core-node-container overflow-visible'
          )}
          id={id}>
          <CoreNodeTop>
            <div className='flex justify-between w-content align-center items-center ml-auto' />
          </CoreNodeTop>
          <CoreNodeContent className='min-h-[100xp] max-w-[300px]'>
            {component}

            {handles?.length > 0 &&
              handles.map((handleId) => (
                <Handle
                  key={handleId}
                  type='source'
                  position={Position.Bottom}
                  id={handleId}
                  isConnectable={true}
                />
              ))}
          </CoreNodeContent>
          <CoreNodeBottom>
            <div className='flex items-center gap-1 rounded-full py-1 pl-2 pr-2.5  bg-neutral-800 text-neutral-400'>
              <div className='size-5'>
                <span
                  className='relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none'
                  data-state='closed'
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateX(0px)',
                  }}>
                  <AiStarIcon
                    stroke={'#fff'}
                    className='w-4 h-4 stroke-1'
                    onClick={toggleShowAskAI}
                  />
                  {showAskAI &&
                    data.entities &&
                    data.entities.length > 0 &&
                    data.type &&
                    data.input && (
                      <AskAIWrapper
                        question={askQuestion({
                          entities: data.entities.map(({data}) => data.name),
                          input: data.input,
                          type: data.type,
                        })}
                        table={data.type}
                        updateAnalysis={updateAnalysis}
                      />
                    )}
                </span>
              </div>
              <span className='text-neutral-400' />
            </div>
            <span className='flex items-center gap-1'>
              <AddNote saveNote={saveNote} popover={false} />
            </span>
          </CoreNodeBottom>
        </CoreNodeContainer>
      </PopoverRoot>
    </>
  )
})

export {EntityNode}
