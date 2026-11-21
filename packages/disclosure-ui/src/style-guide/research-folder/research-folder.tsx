'use client'

/*
Adapted from Cojeev Motion Drawer (stack variant):
https://github.com/luv-jeri/cojeev-ui
MIT License

Copyright (c) 2026 Sanjay Kumar
Copyright (c) 2024 UI LAYOUT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from 'motion/react'
import type { MotionStyle } from 'motion/react'
import { X } from 'lucide-react'
import { stackOutline } from './stack-outline'
import './research-folder.css'

export interface ResearchFolderPanel {
  id: string
  label: string
  children: ReactNode
}

export interface ResearchFolderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  panels: ResearchFolderPanel[]
  value: string
  onValueChange: (value: string) => void
  width?: number
  paperGrain?: number
  bodyType?: 'technical' | 'artifact' | 'ui'
  stiffness?: number
  damping?: number
  stackStagger?: number
  side?: 'left' | 'right'
  returnFocusRef?: RefObject<HTMLElement | null>
}

/** Stack-only study: paper geometry from Cojeev, kept non-modal beside the desk. */
export function ResearchFolder({
  open,
  onOpenChange,
  title,
  panels,
  value,
  onValueChange,
  width = 540,
  paperGrain = 0.12,
  bodyType = 'technical',
  stiffness = 280,
  damping = 32,
  stackStagger = 0.045,
  side = 'right',
  returnFocusRef,
}: ResearchFolderProps) {
  const reduced = useReducedMotion()
  const groupId = useId()
  const drawerRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  const [size, setSize] = useState({ width: 540, height: 720 })
  const dragControls = useDragControls()
  const activeIndex = Math.max(
    0,
    panels.findIndex((panel) => panel.id === value),
  )
  const edge = side === 'right' ? 1 : -1
  const spring = { type: 'spring' as const, stiffness, damping }

  useLayoutEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    if (!drawer) return
    const measure = () => {
      const rect = drawer.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(drawer)
    return () => observer.disconnect()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    const drawer = drawerRef.current
    if (drawer) {
      drawer.inert = false
      drawer.removeAttribute('aria-hidden')
    }
    closeRef.current?.focus({ preventScroll: true })
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        onOpenChangeRef.current(false)
      }
    }
    window.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('keydown', escape)
      const focusWasInside = drawer?.contains(document.activeElement)
      // Presence keeps the paper mounted for exit; hide its controls immediately.
      if (drawer) {
        drawer.inert = true
        drawer.setAttribute('aria-hidden', 'true')
      }
      const target = returnFocusRef?.current ?? previousFocus
      if (
        target instanceof HTMLElement &&
        target.isConnected &&
        (focusWasInside || document.activeElement === document.body)
      ) {
        target.focus({ preventScroll: true })
      }
    }
  }, [open, returnFocusRef])

  const selectAndFocus = (index: number) => {
    onValueChange(panels[index].id)
    tabRefs.current[index]?.focus()
  }

  return (
    <AnimatePresence>
      {open && panels.length > 0 && (
        <motion.aside
          ref={drawerRef}
          aria-label={title}
          className="du-research-folder"
          data-side={side}
          data-body-type={bodyType}
          style={
            {
              '--folder-width': `${width}px`,
              '--folder-grain': Math.max(0, Math.min(0.3, paperGrain)),
            } as MotionStyle
          }
          initial={reduced ? false : { x: edge * (width + 48), opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={
            reduced ? { opacity: 0 } : { x: edge * (width + 48), opacity: 0 }
          }
          transition={reduced ? { duration: 0 } : spring}
          drag="x"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={
            side === 'right' ? { left: 0, right: 0.6 } : { left: 0.6, right: 0 }
          }
          onDragEnd={(_, info) => {
            if (info.offset.x * edge > size.width * 0.25) onOpenChange(false)
          }}
        >
          <div
            className="du-folder-tablist"
            role="tablist"
            aria-label={`${title} sections`}
          >
            {panels.map((panel, index) => (
              <button
                key={panel.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${groupId}-tab-${index}`}
                aria-controls={`${groupId}-panel-${index}`}
                aria-selected={index === activeIndex}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => onValueChange(panel.id)}
                onKeyDown={(event) => {
                  let next: number | undefined
                  if (event.key === 'ArrowRight')
                    next = (index + 1) % panels.length
                  if (event.key === 'ArrowLeft')
                    next = (index - 1 + panels.length) % panels.length
                  if (event.key === 'Home') next = 0
                  if (event.key === 'End') next = panels.length - 1
                  if (next !== undefined) {
                    event.preventDefault()
                    selectAndFocus(next)
                  }
                }}
              >
                {panel.label}
              </button>
            ))}
          </div>
          {panels.map((panel, index) => {
            const active = index === activeIndex
            const depth = active
              ? 0
              : (index - activeIndex + panels.length) % panels.length
            return (
              <motion.section
                key={panel.id}
                className="du-folder-card"
                data-active={active}
                style={{
                  zIndex: active ? panels.length : panels.length - depth,
                }}
                initial={
                  reduced ? false : { x: edge * (36 + index * 10), opacity: 0 }
                }
                animate={{
                  x: active ? 0 : -edge * Math.min(8, depth * 3),
                  y: depth * 2,
                  opacity: 1,
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { ...spring, delay: index * stackStagger }
                }
              >
                <svg
                  className="du-folder-outline"
                  viewBox={`0 0 ${size.width} ${size.height}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={stackOutline(
                      size.width,
                      size.height,
                      index,
                      panels.length,
                      44,
                    )}
                  />
                </svg>
                <div
                  className="du-folder-surface"
                  hidden={!active}
                  inert={!active}
                >
                  <header
                    className="du-folder-header"
                    onPointerDown={(event) => {
                      if (
                        event.button === 0 &&
                        !(event.target as HTMLElement).closest('button')
                      ) {
                        dragControls.start(event)
                      }
                    }}
                  >
                    <span>{title}</span>
                    <button
                      ref={active ? closeRef : undefined}
                      type="button"
                      aria-label="Close research folder"
                      onClick={() => onOpenChange(false)}
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  </header>
                  <div
                    className="du-folder-content"
                    role="tabpanel"
                    id={`${groupId}-panel-${index}`}
                    aria-labelledby={`${groupId}-tab-${index}`}
                    tabIndex={0}
                  >
                    {panel.children}
                  </div>
                  <footer className="du-folder-footer">
                    <span>
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {String(panels.length).padStart(2, '0')}
                    </span>
                    <span>Research folder</span>
                  </footer>
                </div>
              </motion.section>
            )
          })}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
