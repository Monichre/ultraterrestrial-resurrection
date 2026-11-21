'use client'

import {useRouter} from 'next/navigation'

import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Progress} from '@/components/ui/progress'
import {formatDistanceToNow} from 'date-fns'
import {ChevronRight, AlertCircle, Loader2, X} from 'lucide-react'
import type {Database} from '../lib/db/types'
import {
  Drawer,
  DrawerHeader,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'

import {DocumentViewer} from './document'
import {ScrollArea} from '@/components/ui/scroll-area'

import {PdfFileIcon} from './upload-zone'
import {Doc01Icon} from './upload-zone'
import {Txt01Icon} from './upload-zone'
import React from 'react'
import {cn} from '@/lib/utils'

type Document = Database['public']['Tables']['doc_processor_documents']['Row']
type ProcessingTask = Database['public']['Tables']['doc_processor_processing_tasks']['Row']
type Chunk = Database['public']['Tables']['doc_processor_document_chunks']['Row']
type Entity = Database['public']['Tables']['doc_processor_document_entities']['Row']
interface DocumentCardProps {
  document: Document
  tasks: ProcessingTask[]
  chunks: Chunk[]
  entities: Entity[]
}

const FILE_ICON_MAP = {
  pdf: {Icon: PdfFileIcon, bgColor: 'bg-red-500/5', color: 'text-red-500/90'},
  docx: {
    Icon: Doc01Icon,
    bgColor: 'bg-green-500/5',
    color: 'text-green-500/90',
  },
  txt: {Icon: Txt01Icon, bgColor: 'bg-blue-500/5', color: 'text-blue-500/90'},
} as const

export function DocumentCard({document, tasks, chunks, entities}: DocumentCardProps) {
  const router = useRouter()

  const getDocumentProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.status === 'processed').length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const getLatestTask = () => {
    return tasks.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
  }

  const progress = getDocumentProgress()
  const latestTask = getLatestTask()
  const isProcessing = document.status === 'processing'
  const isError = document.status === 'error'

  const fileTypeConfig = FILE_ICON_MAP[document.file_type] || FILE_ICON_MAP.txt

  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger asChild>
        <div
          className='group p-4 hover:bg-accent/50 transition-colors cursor-pointer relative overflow-hidden shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)] rounded-3xl  '
          onClick={() => router.push(`?documentId=${document.id}`)}>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'rounded-xl  p-2 text-primary',
                  'shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]',
                  fileTypeConfig.bgColor
                )}>
                {React.createElement(fileTypeConfig.Icon, {
                  className: cn(
                    'size-7 transition-transform duration-200',
                    fileTypeConfig.color,
                    'drop-shadow-sm hover:drop-shadow-md'
                  ),
                })}
              </div>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-medium leading-none'>{document.title}</h3>
                  <Badge
                    variant={document.status === 'processed' ? 'outline' : 'secondary'}
                    className='font-normal'>
                    {document.status}
                  </Badge>
                </div>
                <div className='text-sm text-muted-foreground'>
                  Uploaded{' '}
                  {formatDistanceToNow(new Date(document.created_at), {
                    addSuffix: true,
                  })}
                </div>
                {isProcessing && latestTask && (
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Loader2 className='h-3 w-3 animate-spin' />
                    <span className='capitalize'>{latestTask.task_type}...</span>
                  </div>
                )}
                {isError && document.error && (
                  <div className='flex items-center gap-2 text-sm text-destructive'>
                    <AlertCircle className='h-3 w-3' />
                    {document.error}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
          {isProcessing && (
            <Progress
              value={progress}
              className='absolute bottom-0 left-0 right-0 h-1 rounded-none bg-muted/50'
            />
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className='container relative  mx-auto h-[calc(100vh-10rem)] flex flex-col py-4 max-w-4xl'>
          <DrawerHeader className='flex-none  bg-secondary/50 px-1 py-1 rounded-[1.05rem] shadow-inner'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div
                  className={cn(
                    'rounded-l-[0.8rem] rounded-r-sm  p-2 text-primary ',
                    'shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]',
                    fileTypeConfig.bgColor
                  )}>
                  {React.createElement(fileTypeConfig.Icon, {
                    className: cn(
                      'size-5 transition-transform duration-200',
                      fileTypeConfig.color,
                      'drop-shadow-sm hover:drop-shadow-md ml-1'
                    ),
                  })}
                </div>
                <DrawerTitle className='text-sm md:text-base  tracking-tighter lg:font-light'>
                  {document.title}
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className={cn(
                    'rounded-r-[0.8rem] rounded-l-sm  p-2 text-primary ',
                    'shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]'
                  )}>
                  <X className='h-4 w-4' />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <ScrollArea className='flex-1 -mx-1 pl-3  px-4'>
            <div className='py-2'>
              <DocumentViewer
                document={document}
                tasks={tasks}
                chunks={chunks}
                entities={entities}
              />
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
