import React from 'react'
import {
  ExpandIcon as ArrowsExpand,
  ListChecks,
  Network,
  Lightbulb,
  Tag,
  Zap,
  ChevronRight,
} from 'lucide-react'
import {cn} from '@/lib/utils'
import {FileAttachment} from '../prometheus-file-handler'

interface DocumentActionProps {
  selectedFile: FileAttachment
  onAction: (action: string) => void
  className?: string
}

export function DocumentActions({
  selectedFile,
  onAction,
  className,
}: DocumentActionProps) {
  const actions = [
    {
      id: 'summarize',
      label: 'Summarize',
      icon: <ArrowsExpand className='w-4 h-4' />,
      description: 'Generate a concise summary of the document',
    },
    {
      id: 'extract-topics',
      label: 'Extract topics',
      icon: <ListChecks className='w-4 h-4' />,
      description: 'Identify key topics and themes',
    },
    {
      id: 'Connect the Dots',
      label: 'Connect the Dots',
      icon: <Network className='w-4 h-4' />,
      description: 'Find connections with other UAP events',
    },
    {
      id: 'Find insights',
      label: 'Find insights',
      icon: <Lightbulb className='w-4 h-4' />,
      description: 'Uncover hidden insights within the document',
    },
    {
      id: 'Generate tags',
      label: 'Generate tags',
      icon: <Tag className='w-4 h-4' />,
      description: 'Create tags for document classification',
    },
    {
      id: 'Analyze sentiment',
      label: 'Analyze sentiment',
      icon: <Zap className='w-4 h-4' />,
      description: 'Determine the sentiment and perspective',
      hasSubmenu: true,
    },
  ]

  return (
    <div className={cn('py-1', className)}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.label)}
          className='w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.05] rounded-lg transition-colors text-left'
          title={action.description}
        >
          <div className='flex items-center gap-3'>
            {action.icon}
            <span>{action.label}</span>
          </div>
          {action.hasSubmenu && (
            <ChevronRight className='w-4 h-4 text-white/40' />
          )}
        </button>
      ))}
    </div>
  )
}
