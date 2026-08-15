'use client'

import { Btn, H1, Pill, ResearchShell, Smallcaps } from '@/features/research-platform/shared'
import { CanvasCard } from './CanvasCard'
import { CanvasPin } from './CanvasPin'
import { ConnectionThreads } from './ConnectionThreads'
import { EntityInspector } from './EntityInspector'
import { LayersDock } from './LayersDock'
import type { CanvasCardData, ConnectionThread, EntityFact, Layer, SavedView } from './types'
import './canvas.css'

export type LivingResearchCanvasProps = {
  title: string
  subtitle: string
  smallcapsLabel: string
  layers: Layer[]
  savedViews: SavedView[]
  threads: ConnectionThread[]
  cards: CanvasCardData[]
  entity: {
    name: string
    status: string
    quote: string
    facts: EntityFact[]
    scoreLabel: string
    scoreValue: string | number
    scoreBarWidth?: string
    scoreFooter?: React.ReactNode
    aiTitle: string
    aiBody: string
  }
  scrollHint?: string
  contextLabel?: string
  contextTrail?: string
}

export function LivingResearchCanvas({
  title,
  subtitle,
  smallcapsLabel,
  layers,
  savedViews,
  threads,
  cards,
  entity,
  scrollHint = 'SPACE + DRAG TO PAN · ⌘K SEARCH · 68% ZOOM',
  contextLabel = 'Living Research Canvas',
  contextTrail = 'Roswell → Present',
}: LivingResearchCanvasProps) {
  return (
    <ResearchShell
      activeRail="canvas"
      context={{ label: contextLabel, trail: contextTrail }}
    >
      <section className="lrc-canvas">
        <div className="lrc-boardtitle">
          <Smallcaps>{smallcapsLabel}</Smallcaps>
          <H1>{title}</H1>
          <p>{subtitle}</p>
          <div className="lrc-toolrow">
            <Btn variant="primary">+ Add Pin</Btn>
            <Btn>Connect</Btn>
            <Btn>Run Proximity Analysis</Btn>
            <Pill dotColor="var(--ut-amber)">Epistemic overlay</Pill>
          </div>
        </div>

        <LayersDock layers={layers} savedViews={savedViews} />

        <ConnectionThreads threads={threads} />

        {cards.map((card) => (
          <CanvasCard key={card.id} card={card} />
        ))}

        {cards.map((card) => (
          <CanvasPin key={`pin-${card.id}`} left={card.pin.left} top={card.pin.top} />
        ))}

        <EntityInspector {...entity} />

        <div className="lrc-scrollhint">{scrollHint}</div>
      </section>
    </ResearchShell>
  )
}
