'use client'

import { Panel, Smallcaps } from '@/features/research-platform/shared'
import type { Layer, SavedView } from './types'

export type LayersDockProps = {
  layers: Layer[]
  savedViews: SavedView[]
}

export function LayersDock({ layers, savedViews }: LayersDockProps) {
  return (
    <div className="lrc-leftdock ut-panel">
      <Smallcaps>Layers</Smallcaps>
      {layers.map((layer) => (
        <div key={layer.id} className={`lrc-layer ${layer.active ? 'active' : ''}`}>
          <span className="sw" style={{ background: layer.color }} />
          {layer.label}
          {typeof layer.count === 'number' && <span className="count">{layer.count}</span>}
        </div>
      ))}
      <div className="lrc-divider" />
      <Smallcaps>Saved views</Smallcaps>
      {savedViews.map((view) => (
        <div key={view.id} className="lrc-layer">
          {view.label}
        </div>
      ))}
    </div>
  )
}
