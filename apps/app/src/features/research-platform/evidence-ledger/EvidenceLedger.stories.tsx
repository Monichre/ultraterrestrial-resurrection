import type { Meta, StoryObj } from '@storybook/react'
import { EvidenceLedger } from './EvidenceLedger'
import type {
  IndexCategory,
  ClaimData,
  SourceData,
  ComparisonRow,
  ProvenanceStep,
  MetricData,
} from './types'

const categories: IndexCategory[] = [
  { id: 'claims', icon: '▤', label: 'Claims', count: '214', active: true },
  { id: 'primary', icon: '◈', label: 'Primary sources', count: '1,842' },
  { id: 'testimonies', icon: '◫', label: 'Testimonies', count: '603' },
  { id: 'organizations', icon: '⌬', label: 'Organizations', count: '188' },
  { id: 'hypotheses', icon: '◇', label: 'Hypotheses', count: '34' },
  { id: 'contradictions', icon: '⚠', label: 'Contradictions', count: '87' },
  { id: 'circular', icon: '⌁', label: 'Circular citations', count: '19' },
]

const filters: string[] = ['Nuclear', '1945–1975', 'Primary', '≥ 0.60']

const claim: ClaimData = {
  id: 'C-0187',
  headline:
    'A recovered object was publicly described as a “flying disc” before the official explanation changed.',
  status: 'Contested',
  statusDotColor: '#c98f46',
  confidence: '0.73',
  supportingCount: 7,
  challengingCount: 5,
  question:
    'What is established, what is inferred, and where does the source chain break?',
  interpretation:
    'The existence of the original press release is verified. The nature of the recovered material remains unresolved. Later accounts frequently cite one another, creating a provenance problem that must be separated from the primary 1947 record.',
}

const supportingSources: SourceData[] = [
  {
    id: 'raaf',
    title: 'RAAF press release · July 8, 1947',
    description: 'Direct contemporary statement announcing recovery of a “flying disc.”',
    sourceType: 'Primary source',
    scoreLabel: 'Authority 9.1',
    accentColor: '#728f72',
    lane: 'support',
  },
  {
    id: 'roswell-record',
    title: 'Roswell Daily Record front page',
    description: 'Contemporary newspaper publication preserving the original wording.',
    sourceType: 'Independent archive',
    scoreLabel: 'Integrity 8.8',
    accentColor: '#6ca8ad',
    lane: 'support',
  },
  {
    id: 'haut-affidavit',
    title: 'Walter Haut later affidavit',
    description: 'Retrospective testimony consistent with parts of the initial announcement.',
    sourceType: 'Testimony',
    scoreLabel: 'Reliability 6.4',
    accentColor: '#7a6d9b',
    lane: 'support',
  },
]

const challengingSources: SourceData[] = [
  {
    id: 'weather-balloon',
    title: 'Weather balloon explanation',
    description:
      'Official reversal attributes the material to a conventional balloon and radar target.',
    sourceType: 'Official statement',
    scoreLabel: 'Consistency 6.0',
    accentColor: '#a4534d',
    lane: 'challenge',
  },
  {
    id: 'project-mogul',
    title: 'Project Mogul reconstruction',
    description:
      'Later historical analysis proposes a classified balloon program as the source.',
    sourceType: 'Secondary analysis',
    scoreLabel: 'Coverage 7.2',
    accentColor: '#c98f46',
    lane: 'challenge',
  },
  {
    id: 'testimony-variance',
    title: 'Retrospective testimony variance',
    description: 'Several witness accounts change in scope and detail across decades.',
    sourceType: 'Contradiction cluster',
    scoreLabel: 'Severity high',
    accentColor: '#a4534d',
    lane: 'challenge',
  },
]

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Temporal proximity',
    primaryValue: 'Immediate',
    reconstructionValue: '30–50 years later',
    primarySentiment: 'good',
    reconstructionSentiment: 'bad',
  },
  {
    label: 'Chain of custody',
    primaryValue: 'Documented archive',
    reconstructionValue: 'Mixed / indirect',
    primarySentiment: 'good',
    reconstructionSentiment: 'bad',
  },
  {
    label: 'Internal consistency',
    primaryValue: 'Moderate',
    reconstructionValue: 'Variable',
    primarySentiment: 'neutral',
    reconstructionSentiment: 'bad',
  },
]

const provenanceSteps: ProvenanceStep[] = [
  {
    number: 1,
    title: 'Original press office statement',
    subtitle: 'Roswell Army Air Field · 1947',
  },
  {
    number: 2,
    title: 'Newspaper publication',
    subtitle: 'Contemporary print archive',
  },
  {
    number: 3,
    title: 'Microfilm scan',
    subtitle: 'Archive copy · hash verified',
  },
  {
    number: 4,
    title: 'OCR extraction',
    subtitle: 'Confidence 98.2% · page anchored',
  },
]

const metrics: MetricData[] = [
  { label: 'Source authority', width: '91%' },
  { label: 'Provenance integrity', width: '88%' },
  { label: 'Corroboration', width: '71%' },
  { label: 'Consistency', width: '62%' },
  { label: 'Alt. explanation', width: '74%' },
]

const meta: Meta<typeof EvidenceLedger> = {
  title: 'Features/Research Platform/Evidence Ledger',
  component: EvidenceLedger,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b0d0e' }],
    },
  },
}

export default meta

type Story = StoryObj<typeof EvidenceLedger>

export const Default: Story = {
  args: {
    categories,
    filters,
    claim,
    supportingSources,
    challengingSources,
    comparisonRows,
    primaryHeader: '1947 primary record',
    reconstructionHeader: 'Later reconstruction',
    lineageTitle: 'Source lineage',
    provenanceSteps,
    metrics,
    aiTitle: 'Evidence Agent',
    aiSuggestion:
      'Three later sources in the supporting lane appear to depend on the same 1980 account. Consider collapsing them into one citation family.',
  },
}
