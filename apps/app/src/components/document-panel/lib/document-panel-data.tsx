import * as React from 'react'
import {FileText, FolderClosed, Radar, ScrollText} from 'lucide-react'

export type PanelTab = {
  id: string
  label: string
}

export type LinkedRecord = {
  id: string
  title: string
  type: string
  date: string
  icon: React.ReactNode
}

export type QuickNote = {
  id: string
  category: string
  body: string
  signature?: string
  tone: 'gold' | 'green' | 'blue'
}

export type RelatedNote = {
  id: string
  title: string
  updatedLabel: string
}

export type AnatomyItem = {
  number: number
  title: string
  description: string
}

export type VariantItem = {
  id: 'default' | 'collapsed' | 'reader'
  title: string
  description: string
}

export type ApiRow = {
  prop: string
  type: string
  required: 'Yes' | 'No'
  defaultValue: string
  description: string
}

export type DocumentTag = {
  id: string
  label: string
  tone: 'gold' | 'neutral'
}

export const PANEL_TABS: PanelTab[] = [
  {id: 'notes', label: 'Notes'},
  {id: 'inspector', label: 'Inspector'},
  {id: 'provenance', label: 'Provenance'},
]

export const DOCUMENT_TAGS: DocumentTag[] = [
  {id: 't1', label: '#hypothesis', tone: 'gold'},
  {id: 't2', label: '#nuclear', tone: 'neutral'},
  {id: 't3', label: '#roswell', tone: 'neutral'},
  {id: 't4', label: '#majestic12', tone: 'neutral'},
]

const iconProps = {width: 12, height: 12, strokeWidth: 1.8} as const

export const LINKED_RECORDS: LinkedRecord[] = [
  {
    id: 'r1',
    title: 'RAAF Press Release',
    type: 'Document',
    date: 'Jul 8, 1947',
    icon: <FileText {...iconProps} aria-hidden />,
  },
  {
    id: 'r2',
    title: 'Malmstrom AFB',
    type: 'Sighting',
    date: 'Mar 1967',
    icon: <Radar {...iconProps} aria-hidden />,
  },
  {
    id: 'r3',
    title: 'Walter Haut Affidavit',
    type: 'Testimony',
    date: 'Jul 13, 1947',
    icon: <ScrollText {...iconProps} aria-hidden />,
  },
  {
    id: 'r4',
    title: 'Project Sign',
    type: 'Document',
    date: '1963',
    icon: <FolderClosed {...iconProps} aria-hidden />,
  },
]

export const QUICK_NOTES: QuickNote[] = [
  {
    id: 'n1',
    category: 'Lead',
    body: 'Check library microfilm for Roswell Daily Record archives.',
    signature: '— L.E.',
    tone: 'gold',
  },
  {
    id: 'n2',
    category: 'Hypothesis Test',
    body: 'Compare isotopic signatures with known meteoritic samples.',
    tone: 'green',
  },
  {
    id: 'n3',
    category: 'Next Steps',
    body: 'Schedule interview with Col. Salas (follow up).',
    tone: 'blue',
  },
]

export const RELATED_NOTES: RelatedNote[] = [
  {id: 'rn1', title: 'Roswell Debris Analysis', updatedLabel: 'Updated 2d ago'},
  {id: 'rn2', title: 'Project Sign Background', updatedLabel: 'Updated 3d ago'},
  {id: 'rn3', title: 'Witness Correlation Summary', updatedLabel: 'Updated 1w ago'},
]

export const ANATOMY_ITEMS: AnatomyItem[] = [
  {
    number: 1,
    title: 'Panel Header',
    description: 'Tab navigation, panel title, and actions.',
  },
  {
    number: 2,
    title: 'Document Toolbar',
    description: 'Text formatting, structure, insert, and template tools.',
  },
  {
    number: 3,
    title: 'Document Canvas',
    description: 'Rich text editor area with annotations and highlights.',
  },
  {
    number: 4,
    title: 'Linked Records',
    description: 'Records connected to this document.',
  },
  {
    number: 5,
    title: 'Quick Notes',
    description: 'Personal sticky notes for fast capture.',
  },
  {
    number: 6,
    title: 'Related Notes',
    description: 'Other notes in this collection or context.',
  },
]

export const VARIANT_ITEMS: VariantItem[] = [
  {
    id: 'default',
    title: 'Default',
    description: 'Full document workspace with all sections.',
  },
  {
    id: 'collapsed',
    title: 'Collapsed Sections',
    description: 'Linked, quick, and related sections can collapse.',
  },
  {
    id: 'reader',
    title: 'Reader Mode',
    description: 'Focus on document canvas with minimal chrome.',
  },
]

export const BEHAVIOR_ITEMS: string[] = [
  'Panel is resizable within the right rail.',
  'Sections can be collapsed/expanded independently.',
  'Notes and records are draggable and reorderable.',
  'Autosave indicator appears in header when editing.',
]

export const ACCESSIBILITY_ITEMS: string[] = [
  'All controls keyboard accessible.',
  'Focus states use 2px outline with warm gold.',
  'Sufficient contrast for text and UI elements.',
  'Screen reader labels for icons and actions.',
]

export const API_ROWS: ApiRow[] = [
  {
    prop: 'title',
    type: 'string',
    required: 'Yes',
    defaultValue: '—',
    description: 'Title of the document / notebook.',
  },
  {
    prop: 'document',
    type: 'object',
    required: 'Yes',
    defaultValue: '—',
    description: 'Document data: { id, title, content, tags, linkedRecords }',
  },
  {
    prop: 'sections',
    type: 'object',
    required: 'No',
    defaultValue: 'All',
    description: 'Visibility config: { linked: true, quickNotes: true, related: true }',
  },
  {
    prop: 'templates',
    type: 'array',
    required: 'No',
    defaultValue: '[]',
    description: 'Available template groups for the Templates menu.',
  },
  {
    prop: 'onSave',
    type: 'function',
    required: 'No',
    defaultValue: '—',
    description: 'Callback when document content is saved.',
  },
  {
    prop: 'onAddLink',
    type: 'function',
    required: 'No',
    defaultValue: '—',
    description: 'Callback when Add Link is triggered.',
  },
  {
    prop: 'onCreateNote',
    type: 'function',
    required: 'No',
    defaultValue: '—',
    description: 'Callback when New Note is created.',
  },
  {
    prop: 'collapsible',
    type: 'boolean',
    required: 'No',
    defaultValue: 'true',
    description: 'Allow sections to collapse/expand.',
  },
  {
    prop: 'variant',
    type: 'enum',
    required: 'No',
    defaultValue: 'default',
    description: "UI variant: 'default' | 'collapsed' | 'reader'.",
  },
  {
    prop: 'width',
    type: 'string | number',
    required: 'No',
    defaultValue: '360px',
    description: 'Panel width (px or CSS value).',
  },
]
