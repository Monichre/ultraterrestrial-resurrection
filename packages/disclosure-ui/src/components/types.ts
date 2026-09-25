import type { ReactNode } from 'react'

export type TagPillVariant =
  | 'bronze'
  | 'slate'
  | 'amber'
  | 'teal'
  | 'purple'
  | 'green'
  | 'outline'

export type TagPillProps = {
  label: string
  variant?: TagPillVariant
  size?: 'sm' | 'md'
  className?: string
  onClick?: () => void
  isActive?: boolean
}

export type SectionHeadingProps = {
  title: string
  subtitle?: string
  meta?: ReactNode
  className?: string
}

export type ClassificationLevel = 'unclassified' | 'confidential' | 'secret' | 'top-secret'

export type ClassificationStampProps = {
  level?: ClassificationLevel
  label?: string
  className?: string
}

export type PanelTabId = string

export type PanelTab = {
  id: PanelTabId
  label: string
  badge?: string | number
}

export type StatusIndicatorProps = {
  label: string
  tone?: 'live' | 'idle' | 'warn' | 'offline'
  className?: string
}

export type UserIdentityProps = {
  name: string
  role?: string
  avatarUrl?: string
  initials?: string
  className?: string
  onClick?: () => void
}

export type ProgressMeterProps = {
  label: string
  value: number
  max: number
  helperText?: string
  className?: string
}

export type IconRailItem = {
  id: string
  label: string
  icon: ReactNode
  isActive?: boolean
  onSelect?: () => void
}

export type IconRailProps = {
  items: IconRailItem[]
  className?: string
  tone?: 'leather' | 'slate'
}

export type PanelTabsProps = {
  tabs: PanelTab[]
  activeTabId: PanelTabId
  onTabChange: ( id: PanelTabId ) => void
  className?: string
  tone?: 'bronze' | 'slate'
}

export type MetaListItem = {
  label: string
  value: ReactNode
}

export type MetaListProps = {
  items: MetaListItem[]
  className?: string
  tone?: 'bronze' | 'slate'
}

export type PostItNoteProps = {
  content: string
  color?: 'yellow' | 'green' | 'blue' | 'pink'
  rotation?: number
  author?: string
  className?: string
  onClick?: () => void
}

export type ResearchAppChromeProps = {
  brand: string
  brandMark?: ReactNode
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: ( value: string ) => void
  searchShortcutHint?: string
  status?: StatusIndicatorProps
  user: UserIdentityProps
  actions?: ReactNode
  tone?: 'leather' | 'slate'
  className?: string
  onThemeToggle?: () => void
}
