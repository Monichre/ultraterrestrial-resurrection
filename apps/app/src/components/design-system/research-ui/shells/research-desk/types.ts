import type { ReactNode } from 'react'

import type { EntityCategory } from '../shared'
import type { PanelTabId, PostItNoteProps } from '../shared'

export interface EntityRecord {
  id: string
  title: string
  subtitle?: string
  category: EntityCategory
  isActive?: boolean
}

export interface LibraryCategory {
  id: string
  label: string
  category: EntityCategory
  count: number
  records: EntityRecord[]
  icon?: ReactNode
}

export interface EntityRecordCardProps {
  record: EntityRecord
  onSelect?: ( id: string ) => void
  className?: string
}

export interface LibrarySidebarProps {
  title?: string
  categories: LibraryCategory[]
  expandedIds: string[]
  onToggleExpand: ( id: string ) => void
  onSelectRecord: ( id: string ) => void
  className?: string
}

export interface CanvasNodeData {
  id: string
  label: string
  category: EntityCategory
  x: number
  y: number
  confidence?: number
  meta?: string
}

export interface CanvasEdgeData {
  id: string
  from: string
  to: string
  label?: string
  style?: 'solid' | 'dashed'
}

export interface CanvasEntityNodeProps {
  node: CanvasNodeData
  isSelected?: boolean
  onSelect?: ( id: string ) => void
  className?: string
}

export interface TheoryCanvasPanelProps {
  title?: string
  tabs: Array<{ id: string; label: string }>
  activeTabId: string
  onTabChange: ( id: string ) => void
  nodes: CanvasNodeData[]
  edges: CanvasEdgeData[]
  selectedNodeId?: string
  onSelectNode?: ( id: string ) => void
  collaborators?: Array<{ id: string; initials: string }>
  onShare?: () => void
  className?: string
}

export interface TimelinePoint {
  id: string
  year: number
  label: string
}

export interface ClusterCell {
  id: string
  label: string
  intensity: number
}

export interface AiSuggestion {
  id: string
  label: string
  confidence: number
  rationale: string
}

export interface InsightWidgetsProps {
  timeline: TimelinePoint[]
  mapLabel?: string
  clusters: ClusterCell[]
  suggestions: AiSuggestion[]
  onSuggestionClick?: ( id: string ) => void
  className?: string
}

export interface ResearchNotebookProps {
  activeTabId: PanelTabId
  onTabChange: ( id: PanelTabId ) => void
  noteTitle: string
  noteBody: string
  tags: string[]
  postIts: PostItNoteProps[]
  handwrittenNotes?: string[]
  className?: string
  onTagClick?: ( tag: string ) => void
}

export interface ResearchDeskShellProps {
  brand?: string
  userName?: string
  userRole?: string
  searchValue?: string
  onSearchChange?: ( value: string ) => void
  library: Omit<LibrarySidebarProps, 'className'>
  canvas: Omit<TheoryCanvasPanelProps, 'className'>
  insights: Omit<InsightWidgetsProps, 'className'>
  notebook: Omit<ResearchNotebookProps, 'className'>
  className?: string
}
