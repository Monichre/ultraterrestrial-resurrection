'use client'
import {useEffect, useRef, useState} from 'react'
import {annotate} from 'rough-notation'

const MENU_OPTIONS: Array<{
  label: string
  type: 'highlight' | 'underline' | 'circle'
  color: string
}> = [
  {label: 'Highlight', type: 'highlight', color: '#fff59d'},
  {label: 'Underline', type: 'underline', color: '#e6a933'},
  {label: 'Circle', type: 'circle', color: '#e6a933'},
]

interface MenuState {
  visible: boolean
  x: number
  y: number
}

export default function SelectionAnnotator() {
  const [menu, setMenu] = useState<MenuState>({visible: false, x: 0, y: 0})
  const [range, setRange] = useState<Range | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const annotsRef = useRef<unknown[]>([])

  // Listen for text selection
  useEffect(() => {
    function handleSelection() {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const r = sel.getRangeAt(0)
        const rect = r.getBoundingClientRect()
        // Only consider in-page selections
        if (rect.width > 0 && rect.height > 0) {
          setRange(r.cloneRange())
          setMenu({
            visible: true,
            x: window.scrollX + rect.left + rect.width / 2,
            y: window.scrollY + rect.top - 10, // slight offset above selection
          })
          return
        }
      }
      setMenu((m) => ({...m, visible: false}))
    }
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
    }
  }, [])

  // Hide menu on outside click or ESC
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu((m) => ({...m, visible: false}))
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenu((m) => ({...m, visible: false}))
    }
    if (menu.visible) {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [menu.visible])

  // Apply annotation
  function annotateSelection(type: 'highlight' | 'underline' | 'circle', color: string) {
    if (!range) return
    const selectedText = range.toString()
    if (!selectedText.trim()) return
    // Wrap selection in a span
    const span = document.createElement('span')
    span.className = 'rough-selection-annotated'
    span.style.background = 'inherit'
    range.surroundContents(span)
    const a = annotate(span, {
      type,
      color,
      animationDuration: 700,
      padding: 2,
      multiline: true,
      strokeWidth: 2,
    })
    a.show()
    annotsRef.current.push(a)
    setMenu((m) => ({...m, visible: false}))
    window.getSelection()?.removeAllRanges()
  }

  // Style for annotation menu
  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: menu.y,
    left: menu.x,
    background: '#232323',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: 6,
    display: menu.visible ? 'flex' : 'none',
    zIndex: 20000,
    gap: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
    border: '1px solid #444',
    fontSize: 14,
    userSelect: 'none',
    alignItems: 'center',
  }

  return menu.visible ? (
    <div ref={menuRef} style={menuStyle}>
      {MENU_OPTIONS.map((opt) => (
        <button
          key={opt.type}
          style={{
            background: 'none',
            border: 'none',
            color: opt.color,
            cursor: 'pointer',
            fontWeight: 700,
            padding: '3px 7px',
            borderRadius: 3,
            transition: 'background 0.2s',
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            annotateSelection(opt.type, opt.color)
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  ) : null
}
