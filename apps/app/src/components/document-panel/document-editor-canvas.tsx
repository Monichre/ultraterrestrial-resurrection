'use client'

import * as React from 'react'
import {Check, Paperclip, Plus} from 'lucide-react'
import {
  DOCUMENT_TAGS,
  type DocumentTag,
} from '@/components/document-panel/lib/document-panel-data'

type ChecklistItem = {id: string; label: string}

const KEY_QUESTIONS: ChecklistItem[] = [
  {id: 'q1', label: 'What materials were recovered?'},
  {id: 'q2', label: 'Where were they taken initially?'},
  {id: 'q3', label: 'Which programs held ultimate authority?'},
  {id: 'q4', label: 'How deep does congressional knowledge go?'},
]

const SUPPORTING_THREADS: string[] = [
  'Eyewitness testimony from military personnel (Sarbacher, Haut, Marcel)',
  'Documented missile site anomalies (1957 Malmstrom incident)',
  'AEC involvement in exotic materials research',
  'Pattern of cover stories and media management',
]

function TagList({tags, onAddTag}: {tags: DocumentTag[]; onAddTag: () => void}) {
  return (
    <div className='dp-tagrow'>
      {tags.map((tag) => (
        <span key={tag.id} className={tag.tone === 'gold' ? 'dp-tag dp-tag--gold' : 'dp-tag'}>
          {tag.label}
        </span>
      ))}
      <button type='button' className='dp-tag-add' aria-label='Add tag' onClick={onAddTag}>
        <Plus width={11} height={11} strokeWidth={2} aria-hidden />
      </button>
    </div>
  )
}

function PaperclipDetail() {
  return (
    <>
      <span className='dp-clip' style={{top: '112px', height: '66px'}} aria-hidden='true' />
      <Paperclip
        className='dp-clip-icon'
        width={17}
        height={17}
        strokeWidth={1.7}
        aria-hidden='true'
      />
    </>
  )
}

function HandwrittenAnnotation() {
  return (
    <>
      <span className='dp-annotation dp-hand-1' aria-hidden='true'>
        Check AEC
        <br />
        finance logs
        <br />
        1951&ndash;1953
        <svg className='dp-hand-squiggle' viewBox='0 0 82 5' fill='none' aria-hidden='true'>
          <path
            d='M1 3.4C12 1.6 24 4.2 36 2.4 48 0.7 60 3.9 81 1.8'
            stroke='currentColor'
            strokeWidth='1.1'
            strokeLinecap='round'
          />
        </svg>
      </span>

      <span className='dp-annotation dp-hand-star' aria-hidden='true'>
        <svg width='13' height='13' viewBox='0 0 14 14' fill='none'>
          <path
            d='M7 0.8 L8.2 5.1 L12.9 6.3 L8.2 7.5 L7 12.3 L5.8 7.5 L1.1 6.3 L5.8 5.1 Z'
            stroke='currentColor'
            strokeWidth='0.9'
            strokeLinejoin='round'
          />
        </svg>
      </span>

      <span className='dp-annotation dp-hand-box' aria-hidden='true'>
        Follow up:
        <br />
        Budget black
        <br />
        projects?
      </span>
    </>
  )
}

type DocumentEditorCanvasProps = {
  onAddTag: () => void
  onEdit: () => void
}

export function DocumentEditorCanvas({onAddTag, onEdit}: DocumentEditorCanvasProps) {
  const [checked, setChecked] = React.useState<ReadonlySet<string>>(new Set())

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    onEdit()
  }

  return (
    <div className='dp-canvas dp-grain'>
      <span className='dp-canvas-corner dp-canvas-corner--l' aria-hidden='true' />
      <span className='dp-canvas-corner dp-canvas-corner--r' aria-hidden='true' />

      <div className='dp-canvas-scroll' tabIndex={0} role='region' aria-label='Document content'>
        <PaperclipDetail />
        <HandwrittenAnnotation />

        <div className='dp-column'>
          <h3 className='dp-doc-h1'>Nuclear Technology Recovery Program</h3>
          <TagList tags={DOCUMENT_TAGS} onAddTag={onAddTag} />

          <section style={{marginTop: '20px'}}>
            <h4 className='dp-doc-h2'>1. Core Premise</h4>
            <p className='dp-doc-p' style={{marginTop: '5px'}}>
              Evidence suggests recovered non-human technology was{' '}
              <mark className='dp-mark'>
                integrated into US nuclear programs during the early Cold War.
              </mark>{' '}
              High-level coordination between military, intelligence, and AEC facilitated reverse
              engineering and compartmentalization.
            </p>
          </section>

          <section style={{marginTop: '18px'}}>
            <h4 className='dp-doc-h2'>2. Supporting Threads</h4>
            <ul className='dp-doc-ul' style={{marginTop: '6px'}}>
              {SUPPORTING_THREADS.map((thread) => (
                <li key={thread} className='dp-doc-li'>
                  {thread}
                </li>
              ))}
              <li className='dp-doc-li'>
                Technological leaps align with <span className='dp-underline'>recovery timeline</span>
              </li>
            </ul>
          </section>

          <section style={{marginTop: '18px'}}>
            <h4 className='dp-doc-h2'>3. Key Questions</h4>
            <div style={{marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '1px'}}>
              {KEY_QUESTIONS.map((item) => {
                const isChecked = checked.has(item.id)
                return (
                  <button
                    key={item.id}
                    type='button'
                    className='dp-check'
                    data-checked={isChecked}
                    aria-pressed={isChecked}
                    onClick={() => toggle(item.id)}
                  >
                    <span className='dp-check-box' aria-hidden='true'>
                      {isChecked ? <Check width={8} height={8} strokeWidth={3} /> : null}
                    </span>
                    <span className='dp-check-label'>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
