'use client';

import { useEffect, useMemo } from 'react';
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  type EdgeTypes,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { TourDefinition, WaypointId } from '../types/tour-definition';
import type { NuclearTourEdge, NuclearTourNode } from '../types/flow-model';
import { compileTourGraph } from '../graph/compile-tour-graph';
import { useTourStore } from '../state/tour-store';
import { WaypointNode } from '../nodes/WaypointNode';
import { NarrativeEdge } from '../edges/NarrativeEdge';
import { TourChoreographer } from '../choreography/TourChoreographer';
import { TourHUD } from './TourHUD';
import { EvidenceDrawer } from './EvidenceDrawer';
import { WaypointInspector } from './WaypointInspector';

const nodeTypes: NodeTypes = {
  'nuclear-shadow-waypoint': WaypointNode,
};

const edgeTypes: EdgeTypes = {
  'narrative-edge': NarrativeEdge,
};

export function TourFlowCanvas({ definition }: { definition: TourDefinition }) {
  return (
    <ReactFlowProvider>
      <TourFlowCanvasInner definition={definition} />
    </ReactFlowProvider>
  );
}

function TourFlowCanvasInner({ definition }: { definition: TourDefinition }) {
  const runtime = useTourStore((state) => state.runtime);
  const dispatch = useTourStore((state) => state.dispatch);

  const graph = useMemo(
    () => (runtime ? compileTourGraph(definition, runtime) : { nodes: [], edges: [] }),
    [definition, runtime],
  );

  const canvasLocked =
    runtime?.phase === 'arriving' ||
    runtime?.phase === 'departing' ||
    runtime?.interactionsLocked === true;

  const handleWaypointClick = (waypointId: WaypointId) => {
    if (!runtime || runtime.interactionsLocked) return;
    if (waypointId === runtime.activeWaypointId) {
      dispatch({ type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' });
      return;
    }
    if (runtime.visitedWaypointIds.includes(waypointId)) {
      dispatch({ type: 'VISITED_WAYPOINT_REQUESTED', waypointId });
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, select, textarea, button, a')) return;

      if (event.key === 'ArrowRight') {
        dispatch({ type: 'NEXT_REQUESTED' });
      } else if (event.key === 'ArrowLeft' && runtime?.previousWaypointId) {
        dispatch({
          type: 'VISITED_WAYPOINT_REQUESTED',
          waypointId: runtime.previousWaypointId,
        });
      } else if (event.key.toLowerCase() === 'r') {
        dispatch({ type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' });
      } else if (event.key === 'Escape') {
        dispatch({ type: 'EVIDENCE_DRAWER_CLOSED' });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, runtime?.previousWaypointId]);

  useEffect(() => {
    if (!runtime?.activeWaypointId) return;
    if (runtime.phase !== 'investigating' && runtime.phase !== 'ready-to-depart') return;
    const element = document.getElementById(`waypoint-${runtime.activeWaypointId}`);
    element?.focus({ preventScroll: true });
  }, [runtime?.activeWaypointId, runtime?.phase]);

  if (!runtime) return <div className="ut-loading">Initializing classified archive...</div>;

  return (
    <main className="ut-tour-shell">
      <ReactFlow<NuclearTourNode, NuclearTourEdge>
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={definition.viewport.minZoom}
        maxZoom={definition.viewport.maxZoom}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={!canvasLocked}
        panOnDrag={!canvasLocked}
        zoomOnScroll={!canvasLocked}
        zoomOnPinch={!canvasLocked}
        zoomOnDoubleClick={false}
        preventScrolling
        onMoveStart={() => dispatch({ type: 'USER_VIEWPORT_INTERACTION_STARTED' })}
        onNodeClick={(_, node) => handleWaypointClick(node.id as WaypointId)}
        aria-label="Nuclear Shadow guided-tour evidence graph"
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={0.65} />
        <TourChoreographer definition={definition} />
      </ReactFlow>

      <TourHUD definition={definition} />
      <WaypointInspector definition={definition} />
      <EvidenceDrawer definition={definition} />

      {runtime.phase === 'error' ? (
        <div className="ut-error" role="alert">
          <strong>{runtime.error?.code}</strong>
          <p>{runtime.error?.message}</p>
        </div>
      ) : null}

      {runtime.phase === 'complete' ? (
        <div className="ut-completion-modal nodrag nopan">
          <span className="ut-kicker">ACT I COMPLETE</span>
          <h2>The Architecture of Secrecy</h2>
          <p>
            You traced the machinery from Manhattan to Roswell without treating the
            machinery as proof of what it may conceal.
          </p>
          <button className="ut-button" onClick={() => dispatch({ type: 'TOUR_RESET' })}>
            Restart tour
          </button>
        </div>
      ) : null}
    </main>
  );
}
