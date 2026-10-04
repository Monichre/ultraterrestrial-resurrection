'use client'

/**
 * Drop-to-Canvas (T-060) — the single owner of drop behaviour.
 *
 * Everything that happens between "a file is released over the canvas" and
 * "the artifact and its fan-out are on the graph" lives here: client-side
 * pre-flight, the POST, the error taxonomy, node/edge construction and
 * placement. The canvas components below it are presentational.
 *
 * Contract: docs/plans/2026-08-13-canvas-drop-ingest-contract.md
 *
 * Why a hook and not a fourth upload component (contract §2.3): the repo
 * already carries three upload surfaces. Putting the logic in one hook means
 * the canvas overlay is a thin affordance and the existing
 * `@/components/file-upload` component can serve the click-to-choose
 * fallback unchanged. No new upload component is introduced.
 */
import {useCallback, useRef} from 'react'
import type {Edge, Node} from '@xyflow/react'

import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'

import {
  DROP_ENDPOINT,
  DROP_FAILURE_COPY,
  type DropFailureCode,
  type DropMatch,
  type DropResponse,
  formatBytes,
  inferDropKind,
  validateDropFile,
} from './drop-contract'
import {buildDropFixture, resolveDropFixture} from './drop-fixture'

/** Namespaced so it cannot collide with an existing node-types key. */
export const DROPPED_ARTIFACT_NODE_TYPE = 'utDroppedArtifactNode'

/** Fallback node type for corpus tables with no dedicated node component. */
const MATCH_NODE_FALLBACK = 'enhancedEntityNodePOC'

/**
 * Corpus table -> existing node type (contract §4 instructs reusing corpus
 * node types for matches rather than inventing parallel ones).
 *
 * `sightings` and `artifacts` are named in contract §4 but have NO entry in
 * `config/node-types.tsx`, so they fall through to `enhancedEntityNodePOC` —
 * the same type the live mindmap agent path uses (graph.tsx:55).
 */
const MATCH_NODE_TYPE_BY_TABLE: Record<string, string> = {
  documents: 'documentNode',
  document_chunks: 'documentNode',
  people: 'personnelNode',
  personnel: 'personnelNode',
  organizations: 'organizationsNode',
  events: 'eventsNode',
  testimonies: 'testimoniesNode',
  topics: 'topicsNode',
}

export function matchNodeType(table: string): string {
  return MATCH_NODE_TYPE_BY_TABLE[table] ?? MATCH_NODE_FALLBACK
}

/**
 * Relative visual weight for a match edge, derived from RANK POSITION, not
 * from the score's magnitude.
 *
 * This is deliberate. RRF scores are rank-agreement numbers whose absolute
 * values carry no calibrated meaning — dividing by the max would manufacture
 * a "how similar" ratio that the data does not support. Rank order is the
 * only thing RRF actually asserts, so rank order is the only thing the
 * visual encoding is allowed to express.
 */
export function edgeWeightForRank(rank: number, total: number): {opacity: number; width: number} {
  if (total <= 1) return {opacity: 0.75, width: 1.9}
  const t = rank / (total - 1) // 0 = strongest rank, 1 = weakest
  return {
    opacity: Number((0.78 - t * 0.5).toFixed(3)),
    width: Number((1.9 - t * 0.95).toFixed(2)),
  }
}

/** Radial fan-out around the artifact. Explicit non-(0,0) positions matter:
 *  the canvas auto-layout effect (graph.tsx) runs with
 *  `preserveExistingLayout: true`, which only re-positions nodes whose
 *  position is falsy or exactly (0,0) (organizeNodeLayout.ts:157-159).
 *  Giving every node a real position is what keeps the fan-out where it was
 *  placed instead of being re-flowed a moment later. */
function fanOutPosition(origin: {x: number; y: number}, index: number, total: number) {
  const radius = total <= 6 ? 340 : 420
  // Arc opens downward-and-outward so the artifact stays visually "on top"
  // of the records it pulled up, reading as source -> derived.
  const spread = Math.PI * 1.15
  const start = Math.PI / 2 - spread / 2
  const angle = total === 1 ? Math.PI / 2 : start + (spread * index) / (total - 1)
  const ring = index % 2 === 0 ? radius : radius * 1.28
  return {
    x: origin.x + Math.cos(angle) * ring * 1.15,
    y: origin.y + Math.sin(angle) * ring * 0.78,
  }
}

function newArtifactNodeId(): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  return `ut-drop-${rand}`
}

export function useCanvasDrop() {
  const {addNodes, addEdges, updateNodeData, screenToFlowPosition, getNodes} = useMindMap()
  const beginDrop = useMindMapUiStore((s) => s.beginDrop)
  const setDropStatus = useMindMapUiStore((s) => s.setDropStatus)
  const resolveDropState = useMindMapUiStore((s) => s.resolveDrop)
  const failDrop = useMindMapUiStore((s) => s.failDrop)
  const setDropDragActive = useMindMapUiStore((s) => s.setDropDragActive)
  const addSessionEvent = useMindMapUiStore((s) => s.addSessionEvent)

  // Guards against a second drop landing while one is still resolving; two
  // concurrent artifacts would fight over the same status slice.
  const inFlight = useRef(false)

  const fail = useCallback(
    (code: DropFailureCode, filename: string, artifactNodeId: string | null) => {
      const copy = DROP_FAILURE_COPY[code]
      failDrop({code, title: copy.title, detail: copy.detail, filename})
      if (artifactNodeId) {
        updateNodeData(artifactNodeId, {
          dropStatus: 'failed',
          failure: {code, ...copy},
        })
      }
      addSessionEvent({
        type: 'analysis',
        label: 'Dropped file not resolved',
        detail: `${filename} — ${copy.title}`,
      })
    },
    [addSessionEvent, failDrop, updateNodeData]
  )

  const handleFile = useCallback(
    async (file: File, screenPoint: {x: number; y: number}) => {
      if (inFlight.current) return
      setDropDragActive(false)

      // --- Pre-flight (contract §3). Rejecting here rather than after a
      // 10 MB upload is both faster and makes the limit legible offline.
      const violation = validateDropFile(file)
      if (violation) {
        fail(violation, file.name, null)
        return
      }

      const artifactNodeId = newArtifactNodeId()
      const rawPosition = screenToFlowPosition
        ? screenToFlowPosition(screenPoint)
        : {x: 0, y: 0}
      // Exactly (0,0) is the sentinel the layout pass treats as "unplaced".
      // A one-pixel nudge keeps a literal centre-of-origin drop pinned.
      const position = {
        x: rawPosition.x === 0 && rawPosition.y === 0 ? 1 : rawPosition.x,
        y: rawPosition.y,
      }

      inFlight.current = true
      const startedAt = Date.now()
      beginDrop({artifactNodeId, filename: file.name})

      // The node appears immediately, at the cursor, in a pending state —
      // the file is on the canvas before the round trip resolves.
      addNodes([
        {
          id: artifactNodeId,
          type: DROPPED_ARTIFACT_NODE_TYPE,
          position,
          data: {
            dropStatus: 'pending',
            filename: file.name,
            mime: file.type,
            bytes: file.size,
            sizeLabel: formatBytes(file.size),
            kind: inferDropKind(file.type, file.name),
            startedAt,
          },
        } as Node,
      ])

      addSessionEvent({
        type: 'query',
        label: 'File dropped on canvas',
        detail: file.name,
      })

      try {
        setDropStatus('awaiting')
        const payload = await requestDrop(file)

        if (payload.kind === 'error') {
          fail(payload.code, file.name, artifactNodeId)
          return
        }

        const {artifact, matches, meta} = payload.response

        updateNodeData(artifactNodeId, {
          dropStatus: 'resolved',
          filename: artifact.filename,
          mime: artifact.mime,
          bytes: artifact.bytes,
          sizeLabel: formatBytes(artifact.bytes),
          kind: artifact.kind,
          artifact,
          matches,
          meta,
          matchCount: matches.length,
        })

        if (matches.length > 0) {
          const {nodes, edges} = buildFanOut({
            artifactNodeId,
            origin: position,
            matches,
            derivedViaCaption: artifact.derivedVia === 'vision-caption',
            existingNodeIds: new Set(getNodes().map((n) => n.id)),
          })
          if (nodes.length) addNodes(nodes)
          if (edges.length) addEdges(edges)
        }

        resolveDropState()
        addSessionEvent({
          type: 'nodes_added',
          label:
            matches.length === 0
              ? 'No corpus connections found'
              : `Dropped file connected to ${matches.length} record${matches.length === 1 ? '' : 's'}`,
          detail: artifact.filename,
        })
      } catch (error) {
        console.error('[T-060] drop failed:', error)
        fail('NETWORK_FAILED', file.name, artifactNodeId)
      } finally {
        inFlight.current = false
      }
    },
    [
      addEdges,
      addNodes,
      addSessionEvent,
      beginDrop,
      fail,
      getNodes,
      resolveDropState,
      screenToFlowPosition,
      setDropDragActive,
      setDropStatus,
      updateNodeData,
    ]
  )

  return {handleFile}
}

type DropOutcome =
  | {kind: 'ok'; response: DropResponse}
  | {kind: 'error'; code: DropFailureCode}

/**
 * Performs the request, or serves a fixture in dev when
 * `?ut_drop_fixture=<scenario>` is present.
 *
 * Response parsing is defensive on purpose: `/api/processing(.*)` is Clerk
 * gated (middleware.ts:9-11), so an unauthenticated canvas gets an HTML
 * redirect rather than the JSON of contract §4. Calling `.json()` on that
 * throws a parse error that reads like a route defect, so the content-type
 * is checked first and a 401/403 is reported as what it is.
 */
async function requestDrop(file: File): Promise<DropOutcome> {
  const fixture = resolveDropFixture()
  if (fixture) {
    const outcome = buildDropFixture(fixture, file)
    await new Promise((r) => setTimeout(r, outcome.delayMs))
    return outcome.kind === 'response'
      ? {kind: 'ok', response: outcome.response}
      : {kind: 'error', code: outcome.code}
  }

  const body = new FormData()
  body.append('file', file)

  const res = await fetch(DROP_ENDPOINT, {method: 'POST', body})

  if (res.status === 401 || res.status === 403) {
    return {kind: 'error', code: 'UNAUTHENTICATED'}
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return {kind: 'error', code: 'BAD_RESPONSE'}
  }

  const json = (await res.json()) as unknown

  if (!res.ok) {
    const code = (json as {code?: string})?.code
    const known: DropFailureCode[] = [
      'TOO_LARGE',
      'UNSUPPORTED_TYPE',
      'EXTRACT_FAILED',
      'EMBED_FAILED',
      'SEARCH_FAILED',
    ]
    return {
      kind: 'error',
      code: known.includes(code as DropFailureCode) ? (code as DropFailureCode) : 'BAD_RESPONSE',
    }
  }

  const response = json as DropResponse
  if (!response?.artifact?.id || !Array.isArray(response.matches)) {
    return {kind: 'error', code: 'BAD_RESPONSE'}
  }

  return {kind: 'ok', response}
}

/**
 * Builds the match nodes and the edges from the artifact to each.
 *
 * Edges are DASHED by the canvas provenance rule (graph.tsx:62-64): dashed
 * marks inference. A drop match is a rank-agreement between an embedding of
 * the user's file and a corpus record — an inference, never an assertion the
 * researcher made.
 */
function buildFanOut({
  artifactNodeId,
  origin,
  matches,
  derivedViaCaption,
  existingNodeIds,
}: {
  artifactNodeId: string
  origin: {x: number; y: number}
  matches: DropMatch[]
  derivedViaCaption: boolean
  existingNodeIds: Set<string>
}): {nodes: Node[]; edges: Edge[]} {
  const nodes: Node[] = []
  const edges: Edge[] = []

  matches.forEach((match, index) => {
    // Namespaced by the artifact so dropping two files that both hit the
    // same corpus record produces two distinct nodes rather than colliding.
    const nodeId = `${artifactNodeId}--${match.table}--${match.id}`
    if (existingNodeIds.has(nodeId)) return

    nodes.push({
      id: nodeId,
      type: matchNodeType(match.table),
      position: fanOutPosition(origin, index, matches.length),
      data: {
        // Fields the existing corpus node components read.
        label: match.title,
        title: match.title,
        name: match.title,
        content: match.snippet,
        description: match.snippet,
        type: match.table,
        table: match.table,
        // Provenance for the inspector. `recordId` (not `id`) so nothing
        // mistakes it for the React Flow node id.
        recordId: match.id,
        url: match.url,
        snippet: match.snippet,
        // Carried for ordering only — never rendered as text.
        rrfRank: index,
        matchOfArtifact: artifactNodeId,
      },
    } as Node)

    const {opacity, width} = edgeWeightForRank(index, matches.length)
    edges.push({
      id: `${artifactNodeId}--edge--${match.table}--${match.id}`,
      source: artifactNodeId,
      target: nodeId,
      type: 'default',
      data: {
        matchIndex: index,
        artifactNodeId,
        // Epistemic tier, chosen not defaulted (Voice Contract): a rank
        // agreement is [Inferred]; when the embedded text was a machine
        // caption of an image, the match is two inferences deep, so those
        // edges carry [Speculative] instead.
        evidentiaryState: derivedViaCaption ? 'Speculative' : 'Inferred',
      },
      style: {
        stroke: derivedViaCaption
          ? `oklch(0.75 0.15 55 / ${opacity})`
          : `oklch(0.93 0.015 90 / ${opacity})`,
        strokeWidth: width,
        strokeDasharray: '5 4',
      },
    } as Edge)
  })

  return {nodes, edges}
}
