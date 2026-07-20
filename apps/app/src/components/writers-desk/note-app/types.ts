export type NoteTab = 'Notes' | 'Projects' | 'Archive'

export interface DeskNote {
  id: string
  title: string
  content: string
  preview: string
  timestamp: string
}
