'use client'

import {motion} from 'framer-motion'
import {
  AlignLeft,
  Bold,
  Clock,
  Heading2,
  Italic,
  List,
  ListOrdered,
  RotateCcw,
  Underline,
} from 'lucide-react'
import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react'
import {DEFAULT_LETTER_SIGNATURE, DEFAULT_LETTER_TITLE, DEFAULT_WIDGET_PARAGRAPHS} from './fixtures'
import {NoteLetterContent} from './NoteLetterContent'
import {NoteLetterShell} from './NoteLetterShell'
import '../writers-desk-notes.css'

const TOOL_BUTTONS: Array<{
  command: string
  icon: ReactNode
  title: string
  arg?: string
}> = [
  {command: 'bold', icon: <Bold className='h-3.5 w-3.5' />, title: 'Bold'},
  {command: 'italic', icon: <Italic className='h-3.5 w-3.5' />, title: 'Italic'},
  {command: 'underline', icon: <Underline className='h-3.5 w-3.5' />, title: 'Underline'},
  {
    command: 'formatBlock',
    icon: <Heading2 className='h-3.5 w-3.5' />,
    title: 'Heading',
    arg: 'h2',
  },
  {
    command: 'insertUnorderedList',
    icon: <List className='h-3.5 w-3.5' />,
    title: 'Bullet list',
  },
  {
    command: 'insertOrderedList',
    icon: <ListOrdered className='h-3.5 w-3.5' />,
    title: 'Numbered list',
  },
  {command: 'justifyLeft', icon: <AlignLeft className='h-3.5 w-3.5' />, title: 'Align left'},
]

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const

export interface NoteWidgetProps {
  className?: string
}

export function NoteWidget({className}: NoteWidgetProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [charCount, setCharCount] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set())

  const refreshActiveCommands = useCallback(() => {
    const cmds = [
      'bold',
      'italic',
      'underline',
      'justifyLeft',
      'insertUnorderedList',
      'insertOrderedList',
    ]
    const active = new Set<string>()
    cmds.forEach((cmd) => {
      try {
        if (document.queryCommandState(cmd)) active.add(cmd)
      } catch {
        /* queryCommandState unsupported for some cmds */
      }
    })
    setActiveCommands(active)
  }, [])

  const execCmd = useCallback(
    (command: string, arg?: string) => {
      document.execCommand(command, false, arg)
      editorRef.current?.focus()
      refreshActiveCommands()
    },
    [refreshActiveCommands]
  )

  const handleInput = useCallback(() => {
    const text = editorRef.current?.innerText ?? ''
    setCharCount(text.length)
    refreshActiveCommands()
    setLastSaved(new Date())
  }, [refreshActiveCommands])

  const insertTimestamp = useCallback(() => {
    const ts = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
    document.execCommand(
      'insertHTML',
      false,
      `<em style="color:#9ca3af;font-size:0.75rem;">${ts} — </em>`
    )
    editorRef.current?.focus()
  }, [])

  const clearEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = ''
      setCharCount(0)
      setLastSaved(null)
      editorRef.current.focus()
    }
  }, [])

  useEffect(() => {
    editorRef.current?.focus()
  }, [])

  return (
    <motion.div
      className={[
        'wd-paper-drafting mt-8 grid grid-cols-1 gap-6 rounded-2xl border border-divider p-6 lg:grid-cols-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      initial={{opacity: 0, y: 16}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.32, ease: EASE_OUT_EXPO, delay: 0.1}}>
      <div className='flex flex-col'>
        <p className='mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted'>
          Founder Letter
        </p>
        <div className='flex-1'>
          <NoteLetterShell compact>
            <NoteLetterContent
              title={DEFAULT_LETTER_TITLE}
              paragraphs={DEFAULT_WIDGET_PARAGRAPHS}
              signature={DEFAULT_LETTER_SIGNATURE}
            />
          </NoteLetterShell>
        </div>
      </div>

      <div className='flex flex-col'>
        <p className='mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted'>
          My Notes
        </p>

        <div className='flex flex-1 flex-col overflow-hidden rounded-xl border border-divider bg-canvas-elevated shadow-sheet1'>
          <div className='flex items-center gap-0.5 border-b border-divider-subtle bg-canvas-overlay px-3 py-2'>
            {TOOL_BUTTONS.map((btn) => (
              <button
                key={btn.command + (btn.arg ?? '')}
                type='button'
                onMouseDown={(e) => {
                  e.preventDefault()
                  execCmd(btn.command, btn.arg)
                }}
                title={btn.title}
                aria-label={btn.title}
                aria-pressed={activeCommands.has(btn.command)}
                className={`flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-divider hover:text-ink-strong ${activeCommands.has(btn.command) ? 'bg-divider text-ink-strong' : ''}`}>
                {btn.icon}
              </button>
            ))}

            <div className='mx-1 h-4 w-px bg-divider' aria-hidden='true' />

            <button
              type='button'
              onMouseDown={(e) => {
                e.preventDefault()
                insertTimestamp()
              }}
              title='Insert timestamp'
              aria-label='Insert timestamp'
              className='flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-divider hover:text-ink-strong'>
              <Clock className='h-3.5 w-3.5' />
            </button>

            <button
              type='button'
              onMouseDown={(e) => {
                e.preventDefault()
                clearEditor()
              }}
              title='Clear notes'
              aria-label='Clear notes'
              className='ml-auto flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-divider hover:text-ink-strong'>
              <RotateCcw className='h-3.5 w-3.5' />
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyUp={refreshActiveCommands}
            onMouseUp={refreshActiveCommands}
            data-placeholder='Start typing your notes…'
            aria-label='Notes editor'
            className='min-h-[260px] flex-1 overflow-y-auto bg-canvas-elevated px-5 py-4 text-sm leading-relaxed text-ink caret-ink-strong focus:outline-none [&_em]:italic [&_em]:text-ink [&_h2]:mb-1 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink-strong [&_li]:my-0.5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-ink-strong [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 empty:before:text-ink-muted/50 empty:before:content-[attr(data-placeholder)]'
          />

          <div className='flex items-center justify-between border-t border-divider-subtle bg-canvas-overlay px-4 py-2'>
            <span className='text-[10px] text-ink-muted'>
              {charCount > 0 ? `${charCount} chars` : 'Empty'}
            </span>
            <span className='text-[10px] text-ink-muted'>
              {lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})}`
                : 'Unsaved'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
