import type {
  ArchiveTreeNode,
  FieldReportDocument,
  LinkedAttachment,
  ReadingRoomDetailsProps,
} from './types'

const DEMO_ROSWELL = '/assets/research-shells/demo-roswell.png'
const PRESS = '/assets/research-shells/press.png'
const DC = '/assets/research-shells/dc.png'

export const SAMPLE_ARCHIVE_TREE: ArchiveTreeNode[] = [
  {
    id: 'gov',
    label: 'Government Releases',
    kind: 'folder',
    count: 214,
    children: [
      { id: 'gov-foia', label: 'FOIA Packets', kind: 'file' },
      { id: 'gov-aaro', label: 'AARO Briefings', kind: 'file' },
    ],
  },
  {
    id: 'roswell',
    label: 'Roswell Incident',
    kind: 'folder',
    count: 48,
    children: [
      { id: 'roswell-field', label: 'Field Report 07-08-1947', kind: 'file' },
      { id: 'roswell-debris', label: 'Debris Inventory', kind: 'file' },
      { id: 'roswell-radio', label: 'KGFL Radio Transcript', kind: 'file' },
    ],
  },
  {
    id: 'classic',
    label: 'Classic Case Files',
    kind: 'folder',
    count: 132,
    children: [
      { id: 'classic-socorro', label: 'Socorro Landing', kind: 'file' },
      { id: 'classic-rendlesham', label: 'Rendlesham Forest', kind: 'file' },
      { id: 'classic-phoenix', label: 'Phoenix Lights', kind: 'file' },
    ],
  },
  {
    id: 'testimony',
    label: 'Witness Testimony',
    kind: 'folder',
    count: 89,
  },
]

export const SAMPLE_FIELD_REPORT: FieldReportDocument = {
  id: 'roswell-field',
  title: 'Roswell Incident: Field Report',
  classification: 'DECLASSIFIED',
  sealLabel: 'AAF',
  stampLabel: 'DECLASSIFIED',
  fields: [
    { label: 'Date', value: '08 July 1947' },
    { label: 'Location', value: 'Roswell Army Air Field, NM' },
    { label: 'Coordinates', value: '33.3943° N, 104.5230° W' },
    { label: 'Reporting Officer', value: 'Maj. Jesse A. Marcel' },
  ],
  paragraphs: [
    'Debris recovered northwest of the base exhibits anomalous tensile properties inconsistent with known meteorological apparatus. Fragments retain shape memory after compression and display a dull violet sheen under ultraviolet inspection.',
    'Local ranch personnel report a brief nocturnal flash preceding discovery. No residual radiation detected above background. Chain-of-custody initiated under Project MOGUL cover pending higher review.',
    'Recommend transfer of selected samples to Wright Field for materials analysis. Photographic plates attached. Witness statements filed separately under Docket R-47-081.',
  ],
  media: [
    {
      id: 'm1',
      src: DEMO_ROSWELL,
      alt: 'Grainy debris photograph',
      caption: 'Plate A',
      kind: 'photo',
    },
    {
      id: 'm2',
      src: PRESS,
      alt: 'Field officers with recovered material',
      caption: 'Plate B',
      kind: 'photo',
    },
    {
      id: 'm3',
      src: DC,
      alt: 'Technical line drawing of fragment',
      caption: 'Fig. 3',
      kind: 'diagram',
    },
  ],
}

export const SAMPLE_ATTACHMENTS: LinkedAttachment[] = [
  { id: 'a1', title: 'Debris Photos', subtitle: '7 images', imageSrc: DEMO_ROSWELL },
  { id: 'a2', title: 'Ranch Affidavit', subtitle: '3 pages', imageSrc: PRESS },
  { id: 'a3', title: 'Radio Log', subtitle: 'KGFL · 1947', imageSrc: DC },
  { id: 'a4', title: 'Base Memo', subtitle: 'AAF internal', imageSrc: DEMO_ROSWELL },
  { id: 'a5', title: 'Material Notes', subtitle: 'Wright Field', imageSrc: PRESS },
  { id: 'a6', title: 'Press Clippings', subtitle: '12 scans', imageSrc: DC },
]

export const SAMPLE_DETAILS: Omit<ReadingRoomDetailsProps, 'activeTabId' | 'onTabChange' | 'className'> =
{
  provenance: [
    { label: 'Originating Agency', value: 'Army Air Forces' },
    { label: 'Docket', value: 'R-47-081' },
    { label: 'Release Date', value: '1994-09-08' },
    { label: 'Integrity Hash', value: 'sha256:7f3a…c91e' },
    { label: 'Custody', value: 'Verified · 4 hops' },
  ],
  summary:
    'Primary field report from the July 1947 recovery near Roswell Army Air Field. Documents debris morphology, witness timing, and the initial MOGUL cover recommendation prior to Wright Field transfer.',
  topics: ['Roswell', 'Crash Retrieval', 'Materials', 'MOGUL', 'Wright Field', 'Chain of Custody'],
  relatedFiles: [
    { id: 'rf1', title: 'Debris Inventory Sheet', date: '1947-07-09' },
    { id: 'rf2', title: 'Marcel Interview Notes', date: '1978-12-01' },
    { id: 'rf3', title: 'GAO Remit Correspondence', date: '1994-07-28' },
  ],
  relatedCases: [
    { id: 'rc1', label: 'Aztec 1948' },
    { id: 'rc2', label: 'Kecksburg' },
    { id: 'rc3', label: 'Socorro' },
    { id: 'rc4', label: 'Rendlesham' },
  ],
}
