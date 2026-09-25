import type { Meta, StoryObj } from '@storybook/react'
import { LivingResearchCanvas } from './LivingResearchCanvas'
import type {
  CanvasCardData,
  ConnectionThread,
  EntityFact,
  Layer,
  SavedView,
} from './types'

const layers: Layer[] = [
  { id: 'all', label: 'All research objects', color: '#c98f46', count: 27, active: true },
  { id: 'corroboration', label: 'Corroboration', color: '#6ca8ad', count: 14 },
  { id: 'contradictions', label: 'Contradictions', color: '#a4534d', count: 6 },
  { id: 'hypotheses', label: 'Hypotheses', color: '#7a6d9b', count: 4 },
  { id: 'verified', label: 'Verified records', color: '#728f72', count: 9 },
]

const savedViews: SavedView[] = [
  { id: 'nuclear', label: 'Nuclear facilities' },
  { id: 'chronology', label: 'Disclosure chronology' },
  { id: 'witness', label: 'Witness conflicts' },
]

const threads: ConnectionThread[] = [
  { id: 't1', d: 'M430 310 C520 270 600 380 720 340', stroke: '#7b2931', strokeWidth: 5, opacity: 0.78 },
  { id: 't2', d: 'M490 340 C560 420 650 420 770 450', stroke: '#9b3037', strokeWidth: 3, opacity: 0.82 },
  { id: 't3', d: 'M365 555 C510 600 610 540 760 590', stroke: '#5f8b92', strokeWidth: 4, opacity: 0.8 },
  { id: 't4', d: 'M700 340 C760 300 845 290 920 325', stroke: '#8f7cbd', strokeWidth: 3.5, opacity: 0.78 },
  { id: 't5', d: 'M760 590 C825 540 870 455 920 325', stroke: '#b5945d', strokeWidth: 2.8, opacity: 0.82 },
  { id: 't6', d: 'M525 650 C650 705 780 690 900 630', stroke: '#6b8a70', strokeWidth: 3.2, opacity: 0.78 },
  { id: 't7', d: 'M920 325 C965 355 1000 390 1030 440', stroke: '#6f8f98', strokeWidth: 3, opacity: 0.7 },
]

const cards: CanvasCardData[] = [
  {
    id: 'roswell-photo',
    type: 'photo',
    typeLabel: 'Artifact',
    title: 'Roswell debris photograph',
    meta: { left: 'Artifact', right: '1947-07' },
    position: { left: 320, top: 225, width: 170 },
    rotation: -2,
    cardVariant: 'photo',
    pin: { left: 426, top: 304 },
    photoTitleSize: 13,
  },
  {
    id: 'raaf',
    type: 'government-record',
    typeLabel: 'Government record',
    title: 'RAAF Press Release',
    description:
      'Original public statement announcing recovery of a “flying disc,” followed by rapid reversal.',
    meta: { left: 'Primary source', right: 'Contested' },
    position: { left: 575, top: 255, width: 190 },
    rotation: 1.2,
    cardVariant: 'paper',
    pin: { left: 693, top: 333 },
  },
  {
    id: 'aec',
    type: 'organization',
    typeLabel: 'Organization',
    title: 'Atomic Energy Commission',
    description:
      'Institutional node linking early nuclear infrastructure, policy, and security programs.',
    meta: { left: '1946–1974', right: 'Verified' },
    position: { left: 840, top: 245, width: 185 },
    rotation: -1,
    cardVariant: 'gray',
    background: 'linear-gradient(145deg,#d8d2c7,#b7b0a4)',
    pin: { left: 913, top: 318 },
  },
  {
    id: 'malmstrom',
    type: 'event',
    typeLabel: 'Event',
    title: 'Malmstrom missile shutdowns',
    description:
      'Reported simultaneous interference involving multiple ICBM systems and anomalous aerial observations.',
    meta: { left: '1967-03', right: 'Corroborated' },
    position: { left: 280, top: 490, width: 210 },
    rotation: 1.6,
    cardVariant: 'paper',
    background: 'linear-gradient(145deg,#d5ccb9,#bba98f)',
    pin: { left: 356, top: 549 },
  },
  {
    id: 'salas',
    type: 'testimony',
    typeLabel: 'Testimony',
    title: 'Robert Salas account',
    description:
      'Later testimony describing missile-system failure during reported aerial activity.',
    meta: { left: 'Witness', right: 'Reliability 7.8' },
    position: { left: 640, top: 520, width: 190 },
    rotation: -1.5,
    cardVariant: 'paper',
    background: 'linear-gradient(145deg,#d8cdb6,#bfa984)',
    pin: { left: 754, top: 583 },
  },
  {
    id: 'hypothesis',
    type: 'hypothesis',
    typeLabel: 'Hypothesis',
    title: 'Nuclear-site monitoring pattern',
    description:
      'Non-random concentration of anomalous reports around strategic nuclear infrastructure.',
    meta: { left: 'Human-authored', right: 'Plausible' },
    position: { left: 820, top: 590, width: 205 },
    rotation: 1,
    cardVariant: 'gray',
    background: 'linear-gradient(145deg,#d7d0c7,#b4aea7)',
    pin: { left: 895, top: 625 },
  },
]

const entityFacts: EntityFact[] = [
  { label: 'Published', value: 'July 8, 1947' },
  { label: 'Issuer', value: 'Roswell Army Air Field' },
  { label: 'Status', value: 'Contested · superseded publicly' },
  { label: 'Connections', value: '8 direct · 17 indirect' },
  { label: 'Provenance', value: 'Newspaper archive → scan → OCR' },
]

const meta = {
  title: 'Features/Research Platform/Living Research Canvas',
  component: LivingResearchCanvas,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#0b0d0e' }] },
    chromatic: { delay: 500 },
  },
} satisfies Meta<typeof LivingResearchCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Roswell → Present: The Nuclear Thread',
    subtitle: '27 entities · 41 relationships · 6 unresolved contradictions',
    smallcapsLabel: 'Canvas / Guided Investigation',
    layers,
    savedViews,
    threads,
    cards,
    entity: {
      name: 'RAAF Press Release',
      status: 'Primary source',
      quote: '“The many rumors regarding the flying disc became a reality yesterday…”',
      facts: entityFacts,
      scoreLabel: 'Credibility model',
      scoreValue: '7.8',
      scoreBarWidth: '78%',
      scoreFooter: (
        <>
          <span>Source authority 9.1</span>
          <span>Consistency 6.2</span>
        </>
      ),
      aiTitle: 'Evidence Agent · suggested link',
      aiBody:
        'This document may be directly connected to the later weather-balloon reversal. Confidence 0.84. Review the newspaper chronology before accepting.',
    },
  },
}
