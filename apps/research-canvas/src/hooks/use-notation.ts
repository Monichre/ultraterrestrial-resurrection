"use client"

import { useEffect, useRef } from "react"
import { createAnnotation, createAnnotationGroup, type NotationOptions } from "@/utils/notation"

// Hook for single element annotation
export function useNotation(options: NotationOptions = {}) {
  const elementRef = useRef<HTMLElement | null>(null)
  const annotationRef = useRef<any>(null)

  useEffect(() => {
    if (elementRef.current && !annotationRef.current) {
      annotationRef.current = createAnnotation(elementRef.current, options)

      if (options.animate !== false) {
        setTimeout(() => {
          annotationRef.current?.show()
        }, options.animationDelay || 0)
      }
    }

    return () => {
      annotationRef.current?.remove()
    }
  }, [options])

  return elementRef
}

// Hook for multiple element annotations
export function useNotationGroup(optionsArray: NotationOptions[] = []) {
  const elementsRef = useRef<HTMLElement[]>([])
  const groupRef = useRef<any>(null)

  const setRef = (index: number) => (el: HTMLElement | null) => {
    if (el) {
      elementsRef.current[index] = el
    }
  }

  useEffect(() => {
    if (elementsRef.current.length > 0 && elementsRef.current.every((el) => el) && !groupRef.current) {
      groupRef.current = createAnnotationGroup(elementsRef.current, optionsArray)

      setTimeout(() => {
        groupRef.current?.show()
      }, 100)
    }

    return () => {
      if (groupRef.current) {
        groupRef.current.hide()
      }
    }
  }, [optionsArray])

  return { setRef }
}
