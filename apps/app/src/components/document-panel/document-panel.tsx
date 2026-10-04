'use client'

import * as React from 'react'
import {Link2, PanelRightOpen, Plus} from 'lucide-react'
import {clamp} from '@/components/document-panel/lib/utils'
import {
  LINKED_RECORDS,
  PANEL_TABS,
  QUICK_NOTES,
  RELATED_NOTES,
  type LinkedRecord,
  type QuickNote,
  type RelatedNote,
} from '@/components/document-panel/lib/document-panel-data'
import {CalloutBadge} from '@/components/document-panel/callout-badge'
import {PanelTabBar} from '@/components/document-panel/panel-tab-bar'
import {
  DocumentPanelHeader,
  type SaveState,
} from '@/components/document-panel/document-panel-header'
import {DocumentToolbar, type ToolId} from '@/components/document-panel/document-toolbar'
import {DocumentEditorCanvas} from '@/components/document-panel/document-editor-canvas'
import {PanelSection} from '@/components/document-panel/panel-section'
import {LinkedRecordCard} from '@/components/document-panel/linked-record-card'
import {QuickNoteCard} from '@/components/document-panel/quick-note-card'
import {RelatedNoteRow} from '@/components/document-panel/related-note-row'
import {SectionEmptyState} from '@/components/document-panel/section-empty-state'

const DEFAULT_WIDTH = 684
const MIN_WIDTH = 560
const MAX_WIDTH = 780
const STEP = 16

export function DocumentPanel() {
  const [open, setOpen] = React.useState(true)
  const [activeTabId, setActiveTabId] = React.useState(PANEL_TABS[0].id)
  const [width, setWidth] = React.useState<number>(DEFAULT_WIDTH)
  const [dragging, setDragging] = React.useState(false)

  const [records, setRecords] = React.useState<LinkedRecord[]>(LINKED_RECORDS)
  const [notes, setNotes] = React.useState<QuickNote[]>(QUICK_NOTES)
  const [related, setRelated] = React.useState<RelatedNote[]>(RELATED_NOTES)

  const [selectedRecordId, setSelectedRecordId] = React.useState<string | null>(null)
  const [selectedRelatedId, setSelectedRelatedId] = React.useState<string | null>(null)

  const [sectionsOpen, setSectionsOpen] = React.useState({
    linked: true,
    quick: true,
    related: true,
  })

  const [activeTools, setActiveTools] = React.useState<ReadonlySet<ToolId>>(new Set())
  const [saveState, setSaveState] = React.useState<SaveState>('idle')
  const saveTimers = React.useRef<Array<ReturnType<typeof setTimeout>>>([])

  React.useEffect(() => {
    const timers = saveTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const markEdited = React.useCallback(() => {
    setSaveState('saving')
    saveTimers.current.push(setTimeout(() => setSaveState('saved'), 700))
    saveTimers.current.push(setTimeout(() => setSaveState('idle'), 2600))
  }, [])

  const dragOrigin = React.useRef<{x: number; width: number} | null>(null)

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragOrigin.current = {x: event.clientX, width}
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragOrigin.current) return
    const delta = dragOrigin.current.x - event.clientX
    setWidth(clamp(dragOrigin.current.width + delta, MIN_WIDTH, MAX_WIDTH))
  }

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragOrigin.current = null
    setDragging(false)
  }

  const onResizeKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setWidth((w) => clamp(w + STEP, MIN_WIDTH, MAX_WIDTH))
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      setWidth((w) => clamp(w - STEP, MIN_WIDTH, MAX_WIDTH))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setWidth(MIN_WIDTH)
    } else if (event.key === 'End') {
      event.preventDefault()
      setWidth(MAX_WIDTH)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      setWidth(DEFAULT_WIDTH)
    }
  }

  const toggleTool = (id: ToolId) => {
    setActiveTools((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    markEdited()
  }

  const addRecord = () => {
    const index = records.length + 1
    setRecords((prev) => [
      ...prev,
      {
        id: `r-new-${index}`,
        title: `Untitled Record ${index}`,
        type: 'Document',
        date: 'Unfiled',
        icon: <Link2 width={12} height={12} strokeWidth={1.8} aria-hidden />,
      },
    ])
    markEdited()
  }

  const addRelatedNote = () => {
    const index = related.length + 1
    setRelated((prev) => [
      ...prev,
      {id: `rn-new-${index}`, title: `Untitled Note ${index}`, updatedLabel: 'Updated just now'},
    ])
    markEdited()
  }

  if (!open) {
    return (
      <div className='dp-closed' role='status'>
        <span>Document Panel is closed.</span>
        <button type='button' className='dp-restore' onClick={() => setOpen(true)}>
          <PanelRightOpen width={13} height={13} strokeWidth={1.8} aria-hidden />
          Reopen panel
        </button>
      </div>
    )
  }

  const activeTab = PANEL_TABS.find((tab) => tab.id === activeTabId) ?? PANEL_TABS[0]

  return (
    <div
      className='dp-panel-outer'
      style={{width: `${width}px`, maxWidth: '100%', position: 'relative'}}
      data-dragging={dragging}
    >
      <button
        type='button'
        className='dp-resize'
        role='separator'
        aria-orientation='vertical'
        aria-label='Resize document panel'
        aria-valuenow={width}
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        aria-valuetext={`${width} pixels wide`}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onResizeKeyDown}
      />

      <div className='dp-shell dp-grain'>
        <div style={{position: 'relative'}}>
          <CalloutBadge number={1} top={16} />
          <PanelTabBar
            tabs={PANEL_TABS}
            activeTabId={activeTabId}
            onSelect={setActiveTabId}
            onClose={() => setOpen(false)}
          />
        </div>

        <div
          role='tabpanel'
          id={`dp-tabpanel-${activeTab.id}`}
          aria-labelledby={`dp-tab-${activeTab.id}`}
          tabIndex={-1}
        >
          <DocumentPanelHeader
            title='Research Notebook'
            saveState={saveState}
            onToggleTitleMenu={markEdited}
            onAdd={addRecord}
            onOverflow={markEdited}
          />

          <div style={{position: 'relative'}}>
            <CalloutBadge number={2} top={10} />
            <DocumentToolbar
              activeTools={activeTools}
              onToggleTool={toggleTool}
              onOpenTemplates={markEdited}
            />
          </div>

          {activeTabId === 'notes' ? (
            <div className='dp-body'>
              <div className='dp-section'>
                <CalloutBadge number={3} top={10} />
                <DocumentEditorCanvas onAddTag={markEdited} onEdit={markEdited} />
              </div>

              <PanelSection
                id='dp-linked'
                label='Linked Records'
                calloutNumber={4}
                open={sectionsOpen.linked}
                onToggle={() => setSectionsOpen((s) => ({...s, linked: !s.linked}))}
                action={
                  <button type='button' className='dp-section-action' onClick={addRecord}>
                    <Plus width={11} height={11} strokeWidth={2} aria-hidden />
                    Add link
                  </button>
                }
              >
                {records.length === 0 ? (
                  <SectionEmptyState message='No records linked to this document yet.' />
                ) : (
                  <div className='dp-record-grid'>
                    {records.map((record) => (
                      <LinkedRecordCard
                        key={record.id}
                        record={record}
                        selected={selectedRecordId === record.id}
                        onSelect={(id) =>
                          setSelectedRecordId((prev) => (prev === id ? null : id))
                        }
                      />
                    ))}
                  </div>
                )}
              </PanelSection>

              <PanelSection
                id='dp-quick'
                label='Quick Notes'
                calloutNumber={5}
                open={sectionsOpen.quick}
                onToggle={() => setSectionsOpen((s) => ({...s, quick: !s.quick}))}
              >
                {notes.length === 0 ? (
                  <SectionEmptyState message='No quick notes captured yet.' />
                ) : (
                  <div className='dp-note-grid'>
                    {notes.map((note) => (
                      <QuickNoteCard key={note.id} note={note} onOpen={markEdited} />
                    ))}
                  </div>
                )}
              </PanelSection>

              <PanelSection
                id='dp-related'
                label='Related Notes'
                calloutNumber={6}
                open={sectionsOpen.related}
                onToggle={() => setSectionsOpen((s) => ({...s, related: !s.related}))}
                action={
                  <button
                    type='button'
                    className='dp-section-action dp-section-action--emphasis'
                    onClick={addRelatedNote}
                  >
                    <Plus width={11} height={11} strokeWidth={2.2} aria-hidden />
                    New Note
                  </button>
                }
              >
                {related.length === 0 ? (
                  <SectionEmptyState message='No related notes in this collection.' />
                ) : (
                  <div className='dp-related-list'>
                    {related.map((note) => (
                      <RelatedNoteRow
                        key={note.id}
                        note={note}
                        selected={selectedRelatedId === note.id}
                        onSelect={(id) =>
                          setSelectedRelatedId((prev) => (prev === id ? null : id))
                        }
                        onOverflow={markEdited}
                      />
                    ))}
                  </div>
                )}
              </PanelSection>
            </div>
          ) : (
            <div className='dp-body'>
              <div className='dp-canvas dp-grain'>
                <div className='dp-canvas-scroll' style={{minHeight: '320px'}}>
                  <p className='dp-doc-h2'>{activeTab.label}</p>
                  <p className='dp-doc-p' style={{marginTop: '6px'}}>
                    The {activeTab.label.toLowerCase()} view shares the document surface and
                    toolbar. Select the Notes tab to return to the editing workspace.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {notes.length === 0 ? (
        <button
          type='button'
          className='dp-restore'
          style={{position: 'absolute', right: 0, bottom: '-38px'}}
          onClick={() => setNotes(QUICK_NOTES)}
        >
          Restore sample quick notes
        </button>
      ) : null}
    </div>
  )
}
