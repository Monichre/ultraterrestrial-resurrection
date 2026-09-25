"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface ContextMenuPosition {
  x: number
  y: number
}

interface UseTextAnnotationProps {
  containerRef: React.RefObject<HTMLElement>
}

interface Annotation {
  id: string
  text: string
  type: string
  timestamp: string
}

export function useTextAnnotation({ containerRef }: UseTextAnnotationProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null)
  const [selectedText, setSelectedText] = useState("")
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const handleTextSelection = () => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        setSelectedText(selection.toString())
        setContextMenu({
          x: rect.left + rect.width / 2,
          y: rect.bottom + window.scrollY,
        })
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setContextMenu(null)
        setSelectedText("")
      }
    }

    containerRef.current.addEventListener("mouseup", handleTextSelection)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseup", handleTextSelection)
      }
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [containerRef, contextMenu])

  const closeContextMenu = () => {
    setContextMenu(null)
    setSelectedText("")
  }

  const createAnnotation = (type: string) => {
    if (!selectedText) return

    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      text: selectedText,
      type,
      timestamp: new Date().toISOString(),
    }

    setAnnotations((prev) => [...prev, newAnnotation])
    closeContextMenu()
  }

  const clearAnnotations = () => {
    setAnnotations([])
  }

  return {
    contextMenu,
    closeContextMenu,
    createAnnotation,
    clearAnnotations,
    annotations,
    selectedText
  }
}