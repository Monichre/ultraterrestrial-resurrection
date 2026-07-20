/**
 * Unified Document Types
 * All document components render content via props for maximum reusability
 */

import type React from "react"

// ============================================
// Base Document Types
// ============================================

export interface DocumentFrameProps {
  children: React.ReactNode
  className?: string
}

// ============================================
// Document One Props
// ============================================

export interface DocumentOneProps {
  header?: {
    title?: string
    subtitle?: string
    reference?: string
    classification?: string
  }
  metadata?: {
    justeret?: string
    sektm?: string
    udkstra?: string
    hjhabo?: string
    location?: string
  }
  footer?: {
    leftColumn?: {
      stehat?: string
      studio?: string
      items?: string[]
    }
    rightColumn?: {
      dseys?: string
      astso?: string
    }
  }
}

// ============================================
// Document A Props
// ============================================

export interface DocumentAProps {
  header?: {
    title?: string
    subtitle?: string
    pageNumber?: string
  }
  mainImage?: {
    src?: string
    alt?: string
  }
  sidebar?: {
    figureLabel?: string
    sections?: Array<{
      title: string
      subtitle?: string
      items?: Array<{ label: string; value: string }>
    }>
    notes?: string
  }
  footer?: {
    transcription?: string
    codeReference?: string
  }
  photoCaption?: {
    labelTop?: string
    captionNote?: string
  }
}

// ============================================
// Document B Props
// ============================================

export interface DocumentBProps {
  header?: {
    title?: string
    subtitle?: string
    indexNumber?: string
    codeNumber?: string
  }
  images?: {
    abstract?: { src?: string; alt?: string }
    textstorm?: { src?: string; alt?: string }
    stamp?: { src?: string; alt?: string }
  }
  footer?: {
    caseReference?: string
    specimen?: string
  }
  photoCaptions?: {
    abstract?: { labelTop?: string; captionNote?: string }
    textstorm?: { labelTop?: string; captionNote?: string }
    stamp?: { labelTop?: string; captionNote?: string }
  }
}

// ============================================
// Vintage Poster A Props
// ============================================

export interface VintagePosterAProps {
  pageTitleLine1?: string
  pageTitleLine2?: string
  stampCode?: string
  dateCode?: string
  heroImage?: string
  insetImage?: string
  insetCaption?: string
  rightRail1?: string
  rightRail2?: string
  rightRail3?: string
  ledgerParagraphs?: string
}

// ============================================
// Vintage Poster B Props
// ============================================

export interface VintagePosterBProps {
  titleISTA?: string
  subtitleISTA?: string
  verticalTitle?: string
  heroImage?: string
  bottomNumber?: string
}

// ============================================
// Vintage Poster C Props
// ============================================

export interface VintagePosterCProps {
  headerLeft?: string
  headerRight?: string
  heroImage?: string
  signature?: string
}

// ============================================
// Vintage Poster D Props
// ============================================

export interface VintagePosterDProps {
  title?: string
  avatar?: string
  avatarLabel?: string
  heroImage?: string
  colA?: string
  colB?: string
  colC?: string
  stampText?: string
}

// ============================================
// UFO Document Props
// ============================================

export interface UFODocumentProps {
  title?: string
  subtitle?: string
  reference?: string
  idPhoto?: string
  creatureSketch?: string
  metadata?: Array<Array<string>>
  listItems?: Array<{ letter: string; text: string }>
  stampText?: string
  legalText?: string
}

// ============================================
// Classified Document Props
// ============================================

export interface ClassifiedDocumentSection {
  type: "text" | "image" | "header" | "stamp"
  data: Record<string, unknown>
}

export interface ClassifiedDocumentItem {
  title?: string
  content?: ClassifiedDocumentSection[]
  rotation?: number
}

export interface ClassifiedDocumentProps {
  documents?: ClassifiedDocumentItem[]
}

// ============================================
// UFO Dispatch Document Props
// ============================================

export interface HandwrittenNote {
  text: string
  position: "bottom-left" | "bottom-right" | "top-left" | "top-right"
  rotation?: number
  color?: string
}

export interface UFODispatchDocumentProps {
  incident?: {
    title?: string
    subtitle?: string
    date?: string
  }
  dispatch?: {
    reference?: string
    calls?: Array<{
      time: string
      message: string
    }>
  }
  photo?: {
    src?: string
    alt?: string
  }
  handwrittenNotes?: HandwrittenNote[]
  classification?: {
    text?: string
    rotation?: number
  }
  photoCaption?: {
    labelTop?: string
    captionNote?: string
  }
}

// ============================================
// Weathered Classified Document Props
// ============================================

export interface WeatheredClassifiedDocumentProps {
  showNavigation?: boolean
  incident?: {
    title?: string
    subtitle?: string
  }
  dispatch?: {
    reference?: string
    calls?: Array<{
      time: string
      message: string
    }>
  }
  photo?: {
    src?: string
    alt?: string
  }
  handwrittenNotes?: HandwrittenNote[]
  classification?: {
    text?: string
    rotation?: number
  }
  photoCaption?: {
    labelTop?: string
    captionNote?: string
  }
}

// ============================================
// Photo Caption Props
// ============================================

export interface PhotoCaptionProps {
  labelTop: string
  captionNote: string
  className?: string
}
