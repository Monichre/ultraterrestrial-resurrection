"use client"

import { annotate, annotationGroup } from "rough-notation"

// Types of annotations available in rough-notation
export type NotationType = "underline" | "box" | "circle" | "highlight" | "strike-through" | "crossed-off" | "bracket"

// Configuration options for annotations
export interface NotationOptions {
  type?: NotationType
  color?: string
  strokeWidth?: number
  padding?: number
  multiline?: boolean
  iterations?: number
  animate?: boolean
  animationDuration?: number
  animationDelay?: number
}

// Default options for different annotation types
const defaultOptions: Record<NotationType, Partial<NotationOptions>> = {
  underline: { color: "#ff6d00", strokeWidth: 2 },
  box: { color: "#ff6d00", strokeWidth: 2, padding: 5 },
  circle: { color: "#ff6d00", strokeWidth: 2, padding: 5 },
  highlight: { color: "rgba(255, 109, 0, 0.3)", strokeWidth: 2 },
  "strike-through": { color: "#ff6d00", strokeWidth: 2 },
  "crossed-off": { color: "#ff6d00", strokeWidth: 2 },
  bracket: { color: "#ff6d00", strokeWidth: 2, padding: 5 },
}

// Create a single annotation
export const createAnnotation = (element: HTMLElement, options: NotationOptions = {}) => {
  const type = options.type || "highlight"
  const mergedOptions = {
    ...defaultOptions[type],
    ...options,
  }

  return annotate(element, {
    type: type,
    color: mergedOptions.color,
    strokeWidth: mergedOptions.strokeWidth,
    padding: mergedOptions.padding,
    multiline: mergedOptions.multiline,
    iterations: mergedOptions.iterations,
    animationDuration: mergedOptions.animationDuration,
  })
}

// Create a group of annotations that can be shown together
export const createAnnotationGroup = (elements: HTMLElement[], options: NotationOptions[] = []) => {
  const annotations = elements.map((el, index) => createAnnotation(el, options[index] || {}))

  return annotationGroup(annotations)
}
