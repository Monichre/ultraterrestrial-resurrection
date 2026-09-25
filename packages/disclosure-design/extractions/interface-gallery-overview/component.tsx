import type { ReactNode } from 'react'

export interface GalleryCell {
  id: string
  caption: string
  thumbnail?: ReactNode
}

export interface InterfaceGalleryGridProps {
  cells: GalleryCell[]
  onSelect?: (id: string) => void
}

export const InterfaceGalleryGrid = ({ cells, onSelect }: InterfaceGalleryGridProps) => {
  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-lg)',
        background: 'var(--color-bg-primary)',
        listStyle: 'none',
        margin: 0,
      }}
    >
      {cells.map((cell) => (
        <li key={cell.id}>
          <button
            type="button"
            onClick={() => onSelect?.(cell.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'transparent',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-sm)',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
            }}
          >
            <div style={{ aspectRatio: '4 / 3', overflow: 'hidden' }}>{cell.thumbnail}</div>
            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-xs)',
              }}
            >
              {cell.caption}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
