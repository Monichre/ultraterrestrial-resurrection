import type { ReactNode } from 'react'

import type { IconRailItem, MetaListItem, PanelTabId, TagPillProps } from '../shared'

export type ArchiveNavMode = 'collection' | 'timeline'

export interface ArchiveTreeNode {
  id: string
  label: string
  kind: 'folder' | 'file'
  count?: number
  children?: ArchiveTreeNode[]
  icon?: ReactNode
}

export interface ArchiveNavigatorProps {
  title?: string
  query: string
  onQueryChange: ( value: string ) => void
  mode: ArchiveNavMode
  onModeChange: ( mode: ArchiveNavMode ) => void
  nodes: ArchiveTreeNode[]
  activeId?: string
  expandedIds?: string[]
  onToggleExpand?: ( id: string ) => void
  onSelect: ( id: string ) => void
  verifiedCount?: number
  totalCount?: number
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  className?: string
}

export interface FieldReportField {
  label: string
  value: string
}

export interface FieldReportMedia {
  id: string
  src: string
  alt: string
  caption?: string
  kind?: 'photo' | 'diagram'
}

export interface FieldReportDocument {
  id: string
  title: string
  classification?: string
  sealLabel?: string
  stampLabel?: string
  fields: FieldReportField[]
  paragraphs: string[]
  media?: FieldReportMedia[]
}

export interface FieldReportCanvasProps {
  document: FieldReportDocument
  className?: string
}

export interface DocumentViewerHeaderProps {
  title: string
  isStarred?: boolean
  onToggleStar?: () => void
  tags: Array<Pick<TagPillProps, 'label' | 'variant'>>
  onPrev?: () => void
  onNext?: () => void
  onSearch?: () => void
  onShare?: () => void
  className?: string
}

export interface LinkedAttachment {
  id: string
  title: string
  subtitle: string
  imageSrc?: string
}

export interface LinkedAttachmentsProps {
  items: LinkedAttachment[]
  title?: string
  onSelect?: ( id: string ) => void
  className?: string
}

export interface RelatedFileItem {
  id: string
  title: string
  date?: string
}

export interface RelatedCaseItem {
  id: string
  label: string
}

export interface ReadingRoomDetailsProps {
  activeTabId: PanelTabId
  onTabChange: ( id: PanelTabId ) => void
  provenance: MetaListItem[]
  summary: string
  topics: string[]
  relatedFiles: RelatedFileItem[]
  relatedCases: RelatedCaseItem[]
  notesSlot?: ReactNode
  onTopicClick?: ( topic: string ) => void
  onRelatedFileClick?: ( id: string ) => void
  onRelatedCaseClick?: ( id: string ) => void
  className?: string
}

export interface ReadingRoomShellProps {
  brand?: string
  pageTitle?: string
  pageSubtitle?: string
  userName?: string
  userRole?: string
  railItems?: IconRailItem[]
  navigator: Omit<ArchiveNavigatorProps, 'className'>
  documentHeader: DocumentViewerHeaderProps
  document: FieldReportDocument
  attachments: LinkedAttachment[]
  details: Omit<ReadingRoomDetailsProps, 'className'>
  className?: string
}
