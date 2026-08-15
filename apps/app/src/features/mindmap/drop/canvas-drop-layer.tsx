'use client'

/**
 * Drop-to-Canvas (T-060) — the canvas-level drop chrome.
 *
 * Two presentational pieces that sit above the graph:
 *   - the drag affordance, shown while a file is over the canvas
 *   - the failure notice, for rejections that never produced a node
 *     (an oversized or unsupported file is refused before the POST, so
 *     there is no artifact node to carry the message)
 *
 * Both are `pointer-events: none` except the notice's dismiss control. The
 * affordance must never intercept a click after a drag ends — that is the
 * classic way a drop overlay silently breaks the canvas underneath it.
 */
import {X} from 'lucide-react'

import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'
import './canvas-drop.css'

export function CanvasDropAffordance() {
  const isDragActive = useMindMapUiStore((s) => s.drop.isDragActive)
  const dragRejected = useMindMapUiStore((s) => s.drop.dragRejected)

  return (
    <div
      className='ut-drop-affordance'
      data-active={isDragActive ? 'true' : 'false'}
      data-rejected={dragRejected ? 'true' : 'false'}
      aria-hidden={!isDragActive}>
      <span className='ut-drop-corner ut-drop-corner-tl' />
      <span className='ut-drop-corner ut-drop-corner-tr' />
      <span className='ut-drop-corner ut-drop-corner-bl' />
      <span className='ut-drop-corner ut-drop-corner-br' />

      <div className='ut-drop-affordance-label'>
        <div className='ut-mono text-[10px]' style={{opacity: 0.9}}>
          {dragRejected ? 'Unsupported file type' : 'Release to place on the canvas'}
        </div>
        <div className='mt-2 text-[11px]' style={{opacity: 0.6}}>
          {dragRejected
            ? 'Accepted: text, PDF, JSON, PNG, JPEG, WebP'
            : 'The file is read and compared against the corpus. Nothing is added to the archive.'}
        </div>
      </div>
    </div>
  )
}

/**
 * Pre-flight rejections (contract §3) surface here rather than as a toast:
 * a toast implies something went wrong in the system, whereas an oversized
 * file is the system correctly stating a limit. It stays until dismissed.
 */
export function CanvasDropNotice() {
  const failure = useMindMapUiStore((s) => s.drop.failure)
  const clearDropFailure = useMindMapUiStore((s) => s.clearDropFailure)

  if (!failure) return null

  return (
    <div className='ut-drop-notice pointer-events-auto max-w-[380px] p-3 pr-9 relative'>
      <button
        type='button'
        onClick={clearDropFailure}
        aria-label='Dismiss'
        className='absolute right-2 top-2 rounded-sm p-1 opacity-60 transition-opacity hover:opacity-100'>
        <X className='size-3.5' style={{color: 'var(--ut-paper)'}} />
      </button>

      <div
        className='ut-mono text-[8.5px]'
        style={{color: 'var(--ut-stamp)'}}>
        File not read
      </div>
      <div
        className='mt-1.5 text-[12px] font-medium'
        style={{color: 'var(--ut-paper)'}}>
        {failure.title}
      </div>
      <div
        className='mt-1 text-[11px] leading-relaxed'
        style={{color: 'var(--ut-ink-dim)'}}>
        {failure.detail}
      </div>
      <div
        className='ut-mono mt-2 truncate text-[8.5px]'
        style={{color: 'var(--ut-ink-faint)'}}
        title={failure.filename}>
        {failure.filename}
      </div>
    </div>
  )
}
