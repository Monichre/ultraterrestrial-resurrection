'use client'

/**
 * Shared "place a database record on the canvas" primitive used by the
 * Research Suggestions dock and the Guided Tour engine. Handles node-type
 * mapping per table, collision-avoiding placement near a source node, and
 * the justified edge back to whatever prompted the addition.
 */
import { useCallback } from 'react'
import type { Node } from '@xyflow/react'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'

const NODE_TYPE_BY_TABLE: Record<string, string> = {
  events: 'eventsNode',
  key_figures: 'personnelNode',
  personnel: 'personnelNode',
  topics: 'topicsNode',
  organizations: 'organizationsNode',
  testimonies: 'testimoniesNode',
  documents: 'documentNode',
  artifacts: 'entityNode',
  sightings: 'entityNode',
}

const DATA_TYPE_BY_TABLE: Record<string, string> = {
  key_figures: 'personnel',
}

const PLACEMENT_RADIUS = 380
const MIN_NODE_DISTANCE = 240

export type AddRecordParams = {
  id: string
  table: string
  title: string
  record: Record<string, unknown>
  /** node to connect from (and place around); omit for free placement */
  sourceNodeId?: string
  /** rendered on the edge — the WHY of the connection */
  edgeLabel?: string
  edgeReasoning?: string
  /** explicit position override (used by the tour's chronological spine) */
  position?: { x: number; y: number }
  /** extra data merged into node.data (e.g. tour metadata) */
  extraData?: Record<string, unknown>
}

export function useAddRecordNode() {
  const { addNodes, addEdges, getNodes } = useMindMap()

  const addRecordNode = useCallback(
    (params: AddRecordParams): string | null => {
      const { id, table, title, record, sourceNodeId, edgeLabel, edgeReasoning, position, extraData } = params
      const existingNodes = getNodes()
      if (existingNodes.some((n: Node) => n.id === id)) {
        // Node already on canvas — still draw the justifying edge if missing.
        if (sourceNodeId && sourceNodeId !== id) {
          addEdges([
            {
              id: `related-${sourceNodeId}-${id}`,
              source: sourceNodeId,
              target: id,
              type: 'siblingEdge',
              ...(edgeLabel ? { label: edgeLabel } : {}),
              data: { ...(edgeReasoning ? { reasoning: edgeReasoning } : {}) },
            },
          ])
        }
        return id
      }

      const source = sourceNodeId
        ? existingNodes.find((n: Node) => n.id === sourceNodeId)
        : undefined

      let resolvedPosition = position
      if (!resolvedPosition) {
        const anchor = source?.position ?? { x: 0, y: 0 }
        // Golden-angle spiral around the anchor, skipping occupied space.
        let placed: { x: number; y: number } | null = null
        for (let i = 0; i < 24 && !placed; i++) {
          const angle = i * 2.399963
          const radius = PLACEMENT_RADIUS + Math.floor(i / 8) * 160
          const candidate = {
            x: anchor.x + radius * Math.cos(angle),
            y: anchor.y + radius * Math.sin(angle),
          }
          const collides = existingNodes.some((n: Node) => {
            const dx = n.position.x - candidate.x
            const dy = n.position.y - candidate.y
            return Math.sqrt(dx * dx + dy * dy) < MIN_NODE_DISTANCE
          })
          if (!collides) placed = candidate
        }
        resolvedPosition = placed ?? {
          x: anchor.x + PLACEMENT_RADIUS,
          y: anchor.y + PLACEMENT_RADIUS,
        }
      }

      const nodeType = NODE_TYPE_BY_TABLE[table] ?? 'entityNode'
      const dataType = DATA_TYPE_BY_TABLE[table] ?? table

      addNodes([
        {
          id,
          type: nodeType,
          position: resolvedPosition,
          data: {
            ...record,
            label: title,
            title: typeof record.title === 'string' && record.title ? record.title : title,
            name: typeof record.name === 'string' && record.name ? record.name : title,
            type: dataType,
            table,
            ...(extraData ?? {}),
          },
        },
      ])

      if (sourceNodeId && sourceNodeId !== id) {
        addEdges([
          {
            id: `related-${sourceNodeId}-${id}`,
            source: sourceNodeId,
            target: id,
            type: 'siblingEdge',
            ...(edgeLabel ? { label: edgeLabel } : {}),
            data: { ...(edgeReasoning ? { reasoning: edgeReasoning } : {}) },
          },
        ])
      }

      return id
    },
    [addEdges, addNodes, getNodes],
  )

  return { addRecordNode }
}
