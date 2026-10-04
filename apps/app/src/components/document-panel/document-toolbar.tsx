'use client'

import * as React from 'react'
import {
  AtSign,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  IndentIncrease,
  Italic,
  LayoutTemplate,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Quote,
  Table2,
  Underline,
} from 'lucide-react'

type ToolId =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'ul'
  | 'ol'
  | 'checklist'
  | 'indent'
  | 'table'
  | 'image'
  | 'quote'
  | 'mention'
  | 'link'

type Tool = {
  id: ToolId
  label: string
  icon: React.ReactNode
  toggle?: boolean
  disabled?: boolean
}

const ICON = {width: 14, height: 14, strokeWidth: 1.8} as const

const TOOL_GROUPS: Tool[][] = [
  [
    {id: 'h1', label: 'Heading 1', icon: <Heading1 {...ICON} aria-hidden />, toggle: true},
    {id: 'h2', label: 'Heading 2', icon: <Heading2 {...ICON} aria-hidden />, toggle: true},
    {id: 'h3', label: 'Heading 3', icon: <Heading3 {...ICON} aria-hidden />, toggle: true},
  ],
  [
    {id: 'bold', label: 'Bold', icon: <Bold {...ICON} aria-hidden />, toggle: true},
    {id: 'italic', label: 'Italic', icon: <Italic {...ICON} aria-hidden />, toggle: true},
    {id: 'underline', label: 'Underline', icon: <Underline {...ICON} aria-hidden />, toggle: true},
  ],
  [
    {id: 'ul', label: 'Bulleted list', icon: <List {...ICON} aria-hidden />, toggle: true},
    {id: 'ol', label: 'Numbered list', icon: <ListOrdered {...ICON} aria-hidden />, toggle: true},
    {
      id: 'checklist',
      label: 'Checklist',
      icon: <ListChecks {...ICON} aria-hidden />,
      toggle: true,
    },
  ],
  [
    {id: 'indent', label: 'Increase indent', icon: <IndentIncrease {...ICON} aria-hidden />},
    {id: 'table', label: 'Insert table', icon: <Table2 {...ICON} aria-hidden />},
    {
      id: 'image',
      label: 'Insert image',
      icon: <ImageIcon {...ICON} aria-hidden />,
      disabled: true,
    },
  ],
  [
    {id: 'quote', label: 'Block quote', icon: <Quote {...ICON} aria-hidden />, toggle: true},
    {id: 'mention', label: 'Mention record', icon: <AtSign {...ICON} aria-hidden />},
    {id: 'link', label: 'Insert link', icon: <Link2 {...ICON} aria-hidden />},
  ],
]

type DocumentToolbarProps = {
  activeTools: ReadonlySet<ToolId>
  onToggleTool: (id: ToolId) => void
  onOpenTemplates: () => void
}

export function DocumentToolbar({
  activeTools,
  onToggleTool,
  onOpenTemplates,
}: DocumentToolbarProps) {
  return (
    <div className='dp-toolbar' role='toolbar' aria-label='Document formatting'>
      {TOOL_GROUPS.map((group, groupIndex) => (
        <React.Fragment key={group[0].id}>
          {groupIndex > 0 ? <span className='dp-tool-sep' aria-hidden='true' /> : null}
          {group.map((tool) => (
            <button
              key={tool.id}
              type='button'
              className='dp-tool'
              aria-label={tool.label}
              aria-pressed={tool.toggle ? activeTools.has(tool.id) : undefined}
              disabled={tool.disabled}
              onClick={() => onToggleTool(tool.id)}
            >
              {tool.icon}
            </button>
          ))}
        </React.Fragment>
      ))}

      <button
        type='button'
        className='dp-templates'
        aria-haspopup='menu'
        onClick={onOpenTemplates}
      >
        <LayoutTemplate width={12} height={12} strokeWidth={1.8} aria-hidden />
        Templates
      </button>
    </div>
  )
}

export type {ToolId}
