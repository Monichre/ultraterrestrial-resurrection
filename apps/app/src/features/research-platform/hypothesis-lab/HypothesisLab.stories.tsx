import type { Meta, StoryObj } from '@storybook/react'
import { HypothesisLab } from './HypothesisLab'
import type { HypothesisData, RankingItem, MatrixBlob, MatrixAxisLabel, DecisionData } from './types'

const hypotheses: HypothesisData[] = [
  {
    id: 'hyp-a',
    label: 'Hypothesis A',
    title: 'External technological intelligence',
    fitScore: '0.68',
    description:
      'A non-human technological actor monitors, probes, or signals around strategic nuclear infrastructure.',
    glowColor: '#6c98a0',
    evidence: [
      {
        id: 'a-supports',
        title: 'Supports',
        content:
          'Multi-sensor military cases; repeated proximity to sensitive sites; reported performance beyond known aircraft.',
        variant: 'support',
      },
      {
        id: 'a-challenges',
        title: 'Challenges',
        content:
          'No publicly verified craft or origin; strong selection bias; inconsistent phenomenology across cases.',
        variant: 'challenge',
      },
      {
        id: 'a-strongest',
        title: 'Strongest evidence',
        content: 'Malmstrom, Nimitz, selected radar-supported encounters.',
        variant: 'support',
      },
      {
        id: 'a-weakness',
        title: 'Critical weakness',
        content: 'Inference from anomaly to origin remains underdetermined.',
        variant: 'challenge',
      },
    ],
    prediction:
      'Future high-quality events should cluster around strategic systems and produce repeatable multi-sensor signatures.',
  },
  {
    id: 'hyp-b',
    label: 'Hypothesis B',
    title: 'Secret terrestrial programs',
    fitScore: '0.61',
    description:
      'Some sightings reflect classified aerospace, surveillance, electronic-warfare, or counterintelligence operations.',
    glowColor: '#8d7352',
    evidence: [
      {
        id: 'b-supports',
        title: 'Supports',
        content:
          'Proximity to restricted ranges; known history of cover stories; technical compartmentalization.',
        variant: 'support',
      },
      {
        id: 'b-challenges',
        title: 'Challenges',
        content:
          'Long historical span; operations near own strategic assets; performance claims may exceed plausible development.',
        variant: 'challenge',
      },
      {
        id: 'b-strongest',
        title: 'Strongest evidence',
        content: 'Documented black programs and intelligence deception practices.',
        variant: 'support',
      },
      {
        id: 'b-weakness',
        title: 'Critical weakness',
        content: 'Cannot parsimoniously explain all high-strangeness testimony.',
        variant: 'challenge',
      },
    ],
    prediction:
      'Case clusters should map to program development cycles, test ranges, contractors, and classification boundaries.',
  },
]

const rankingItems: RankingItem[] = [
  { rank: 1, title: 'Mixed-origin explanation', score: '0.74' },
  { rank: 2, title: 'External intelligence', score: '0.68' },
  { rank: 3, title: 'Secret programs', score: '0.61' },
  { rank: 4, title: 'Psychosocial model', score: '0.53' },
]

const matrixBlobs: MatrixBlob[] = [
  { width: 72, height: 72, left: 45, top: 45, color: 'rgba(108,168,173,.45)' },
  { width: 82, height: 82, left: 112, top: 28, color: 'rgba(201,143,70,.38)' },
  { width: 65, height: 65, left: 167, top: 66, color: 'rgba(122,109,155,.42)' },
]

const matrixAxisLabels: MatrixAxisLabel[] = [
  { text: 'Conventional', style: { left: '8px', bottom: '6px' } },
  { text: 'Anomalous', style: { right: '8px', bottom: '6px' } },
  { text: 'Low provenance', style: { left: '8px', top: '6px' } },
]

const decision: DecisionData = {
  smallcaps: 'Strategic synthesis agent',
  title: 'Bounded conclusion',
  conclusion:
    'The present evidence does not justify a single-origin theory. A mixed model currently explains more of the record with fewer unsupported assumptions.',
  questions: [
    { id: 'q1', text: '01 · Which cases retain anomaly after conventional explanations?' },
    { id: 'q2', text: '02 · Which sources are genuinely independent?' },
    { id: 'q3', text: '03 · What prediction would distinguish monitoring from coincidence?' },
  ],
  actions: [
    { id: 'open', label: 'Open synthesis', variant: 'primary' },
    { id: 'challenge', label: 'Challenge' },
  ],
}

const meta = {
  title: 'Features/Research Platform/Hypothesis Lab',
  component: HypothesisLab,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b0d0e' }],
    },
  },
} satisfies Meta<typeof HypothesisLab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    smallcaps: 'Hypothesis lab / Comparative model',
    title: 'What best explains the nuclear-site pattern?',
    subtitle:
      'Evidence is distributed across competing explanations; no hypothesis is privileged by default.',
    actions: [
      { id: 'add', label: 'Add competing model' },
      { id: 'falsify', label: 'Run falsification pass' },
      { id: 'synthesize', label: 'Synthesize selection', variant: 'primary' },
    ],
    hypotheses,
    ranking: {
      smallcaps: 'Current ranking',
      title: 'Model comparison',
      items: rankingItems,
    },
    matrix: {
      smallcaps: 'Evidence-space matrix',
      title: 'Explanatory coverage',
      blobs: matrixBlobs,
      axisLabels: matrixAxisLabels,
    },
    decision,
  },
}
