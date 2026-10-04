export type DesignRegister = 'archival-material' | 'techno-analytical'

export const DESIGN_REGISTERS: Record<
  DesignRegister,
  { id: DesignRegister; title: string; description: string }
> = {
  'archival-material': {
    id: 'archival-material',
    title: 'Archival material',
    description:
      'Paper, grain, stamps, redaction — dossier and evidence objects. Reading-room token set.',
  },
  'techno-analytical': {
    id: 'techno-analytical',
    title: 'Techno-analytical',
    description:
      'HUD, coordinates, graphs, inference overlays. Research-desk token set.',
  },
}
