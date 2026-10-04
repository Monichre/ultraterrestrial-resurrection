import { DESIGN_REGISTERS } from '../tokens/registers'

export type StyleGuideSection = {
  id: string
  title: string
  description: string
  register?: 'archival-material' | 'techno-analytical' | 'neutral'
  tokenKeys?: string[]
  componentIds?: string[]
}

export const STYLE_GUIDE_SECTIONS: StyleGuideSection[] = [
  {
    id: 'registers',
    title: 'Design registers',
    description:
      'Two content registers coexist on the same surfaces — archival material and techno-analytical. See docs/vision/DESIGN_REGISTERS.md.',
    register: 'neutral',
  },
  {
    id: 'reading-room-tokens',
    title: 'Reading room tokens',
    description: 'Archival OKLCH palette for dossiers, stamps, and paper surfaces.',
    register: 'archival-material',
    tokenKeys: [
      'ink',
      'paper',
      'leather',
      'bronze',
      'bronzeSoft',
      'metal',
      'stamp',
      'panel',
      'line',
    ],
  },
  {
    id: 'research-desk-tokens',
    title: 'Research desk tokens',
    description: 'HUD / analytical palette for canvas chrome and entity nodes.',
    register: 'techno-analytical',
    tokenKeys: ['base', 'panel', 'card', 'line', 'ink', 'muted', 'amber', 'teal', 'purple', 'green'],
  },
  {
    id: 'entity-categories',
    title: 'Entity category colors',
    description: 'Graph and badge colors keyed to Postgres entity types.',
    register: 'techno-analytical',
    tokenKeys: ['documents', 'people', 'events', 'sightings', 'locations', 'artifacts', 'hypotheses', 'organizations'],
  },
  {
    id: 'primitives',
    title: 'Primitives',
    description: 'Shared React components exported from @repo/disclosure-ui/components.',
    register: 'neutral',
    componentIds: [
      'TagPill',
      'SectionHeading',
      'ClassificationStamp',
      'StatusIndicator',
      'PostItNote',
      'MetaList',
      'PanelTabs',
      'IconRail',
      'ProgressMeter',
      'UserIdentity',
      'ResearchAppChrome',
    ],
  },
  {
    id: 'gallery',
    title: 'Image gallery',
    description: 'Catalog of textures and motifs — paths resolve at `/disclosure-ui/textures/`.',
    register: 'neutral',
  },
]

export { DESIGN_REGISTERS }

export function getStyleGuideSection( id: string ): StyleGuideSection | undefined {
  return STYLE_GUIDE_SECTIONS.find( ( section ) => section.id === id )
}
