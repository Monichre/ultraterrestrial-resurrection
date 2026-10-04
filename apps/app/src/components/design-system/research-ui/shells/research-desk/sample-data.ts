import type {
  AiSuggestion,
  CanvasEdgeData,
  CanvasNodeData,
  ClusterCell,
  LibraryCategory,
  TimelinePoint,
} from './types'
import type { PostItNoteProps } from '../shared'

export const SAMPLE_LIBRARY: LibraryCategory[] = [
  {
    id: 'documents',
    label: 'Documents',
    category: 'documents',
    count: 128,
    records: [
      { id: 'd1', title: 'Field Report 07-08-1947', subtitle: 'Roswell · AAF', category: 'documents', isActive: true },
      { id: 'd2', title: 'Wright Field Transfer Memo', subtitle: '1947-07-09', category: 'documents' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    category: 'people',
    count: 64,
    records: [
      { id: 'p1', title: 'Jesse Marcel', subtitle: 'Intelligence Officer', category: 'people' },
      { id: 'p2', title: 'Walter Haut', subtitle: 'Public Information', category: 'people' },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    category: 'events',
    count: 41,
    records: [
      { id: 'e1', title: 'Ranch Debris Recovery', subtitle: '1947-07-07', category: 'events' },
    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    category: 'locations',
    count: 22,
    records: [
      { id: 'l1', title: 'Roswell Army Air Field', subtitle: 'New Mexico', category: 'locations' },
      { id: 'l2', title: 'Foster Ranch', subtitle: 'Corona, NM', category: 'locations' },
    ],
  },
  {
    id: 'hypotheses',
    label: 'Hypotheses',
    category: 'hypotheses',
    count: 9,
    records: [
      {
        id: 'h1',
        title: 'Nuclear Technology Recovery Program',
        subtitle: 'Confidence 0.68',
        category: 'hypotheses',
      },
    ],
  },
]

export const SAMPLE_NODES: CanvasNodeData[] = [
  {
    id: 'hyp',
    label: 'Nuclear Technology Recovery Program',
    category: 'hypotheses',
    x: 42,
    y: 38,
    confidence: 0.68,
    meta: 'Hypothesis',
  },
  { id: 'marcel', label: 'Jesse Marcel', category: 'people', x: 18, y: 22, meta: 'Witness' },
  { id: 'debris', label: 'Memory Metal Debris', category: 'artifacts', x: 70, y: 20, meta: 'Artifact' },
  { id: 'raaf', label: 'Roswell AAF', category: 'locations', x: 16, y: 62, meta: 'Location' },
  { id: 'mogul', label: 'Project MOGUL', category: 'organizations', x: 74, y: 64, meta: 'Cover story' },
  { id: 'wright', label: 'Wright Field Lab', category: 'locations', x: 48, y: 72, meta: 'Transfer' },
]

export const SAMPLE_EDGES: CanvasEdgeData[] = [
  { id: 'e1', from: 'marcel', to: 'hyp', label: 'Official Account', style: 'dashed' },
  { id: 'e2', from: 'debris', to: 'hyp', label: 'Physical Evidence', style: 'solid' },
  { id: 'e3', from: 'raaf', to: 'hyp', label: 'Chain of Custody', style: 'dashed' },
  { id: 'e4', from: 'mogul', to: 'hyp', label: 'Counterclaim', style: 'dashed' },
  { id: 'e5', from: 'wright', to: 'debris', label: 'Analysis', style: 'solid' },
]

export const SAMPLE_TIMELINE: TimelinePoint[] = [
  { id: 't1', year: 1947, label: 'Recovery' },
  { id: 't2', year: 1948, label: 'Transfer' },
  { id: 't3', year: 1978, label: 'Marcel interview' },
  { id: 't4', year: 1994, label: 'GAO review' },
  { id: 't5', year: 2023, label: 'AARO note' },
]

export const SAMPLE_CLUSTERS: ClusterCell[] = [
  { id: 'c1', label: 'Technology Exploitation', intensity: 0.9 },
  { id: 'c2', label: 'Crash Retrieval', intensity: 0.75 },
  { id: 'c3', label: 'Cover Stories', intensity: 0.6 },
  { id: 'c4', label: 'Witness Networks', intensity: 0.45 },
  { id: 'c5', label: 'Materials Science', intensity: 0.8 },
  { id: 'c6', label: 'Nuclear Nexus', intensity: 0.7 },
]

export const SAMPLE_SUGGESTIONS: AiSuggestion[] = [
  {
    id: 's1',
    label: 'Link Wright Field → Nuclear Labs',
    confidence: 0.71,
    rationale: 'Shared transfer codes appear in two dockets.',
  },
  {
    id: 's2',
    label: 'Compare MOGUL balloon specs',
    confidence: 0.64,
    rationale: 'Debris morphology conflicts with published balloon foil.',
  },
]

export const SAMPLE_POSTITS: PostItNoteProps[] = [
  { content: 'Check Haut press release timing vs. debris photos', color: 'yellow', rotation: -3 },
  { content: 'Need radiation survey raw numbers', color: 'green', rotation: 2 },
  { content: 'Interview notes contradict base log', color: 'blue', rotation: -1 },
]
