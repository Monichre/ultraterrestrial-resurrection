import type { DeskNote, NoteTab } from './types'

export const NOTE_TABS: NoteTab[] = ['Notes', 'Projects', 'Archive']

export const INITIAL_NOTES: DeskNote[] = [
  {
    id: '1',
    title: 'Architecture Research',
    content: `The project explores the intersection of digital archives and physical layout systems.

1. Layout Physics
The interface relies on a strict separation of concerns, mimicking a filing cabinet. The tabs at the top provide context switching without losing the sense of permanence.

2. Visual DNA
- Colors: Monochromatic warm greys with high contrast black ink.
- Typography: Functional, grotesque sans-serif.
- Shapes: Softened geometric forms, specifically the tab shape.

To Do:
- [ ] Finalize color contrast ratios
- [ ] Export SVG assets for the folder tabs
- [ ] Review mobile responsiveness logic

Reference material includes early 20th-century Dutch design manuals and industrial filing systems.`,
    preview: 'Notes on the brutalist movement and its impact on modern web design.',
    timestamp: '10:42 AM',
  },
  {
    id: '2',
    title: 'Meeting: Cirkel Sector',
    content:
      'Discuss timeline for the archival project launch. Key stakeholders include design leads and engineering managers.',
    preview: 'Discuss timeline for the archival project launch. Key stakeholders...',
    timestamp: 'Yesterday',
  },
  {
    id: '3',
    title: 'Material Palette',
    content: 'Concrete, raw steel, unbleached paper. Need to source textures from industrial suppliers.',
    preview: 'Concrete, raw steel, unbleached paper. Need to source textures.',
    timestamp: 'Oct 24',
  },
  {
    id: '4',
    title: 'Typography System',
    content: 'Exploring monospace pairings for the header sections. Consider IBM Plex Mono with Inter.',
    preview: 'Exploring monospace pairings for the header sections.',
    timestamp: 'Oct 22',
  },
]
