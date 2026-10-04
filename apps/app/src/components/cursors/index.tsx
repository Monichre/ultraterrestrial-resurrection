import { NeonCursor } from '@/components/cursors/neon-cursor'


import { GooeyCursor } from '@/components/cursors/mindmap-cursor'


export const MindMapCursor = ( { type }: { type: 'neon' | 'gooey' } ) => {
  if ( type === 'neon' ) {
    return <NeonCursor />
  }
  return <GooeyCursor />
}
