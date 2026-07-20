'use client';

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import type { NuclearTourEdge } from '../types/flow-model';

const dashByKind = {
  chronological: undefined,
  evidentiary: '8 7',
  hypothesis: '2 8',
  'institutional-inheritance': undefined,
  contradiction: '12 4 2 4',
} as const;

export function NarrativeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<NuclearTourEdge>) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 20,
    offset: 48,
  });

  const visible = data?.status !== 'hidden';
  const active = data?.status === 'active';

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        className={`ut-narrative-edge ut-narrative-edge--${data?.kind} ut-narrative-edge--${data?.status}`}
        style={{
          opacity: visible ? undefined : 0,
          strokeDasharray: data ? dashByKind[data.kind] : undefined,
          strokeWidth: data?.kind === 'institutional-inheritance' ? 3 : 1.5,
        }}
      />

      {active && !data?.reducedMotion ? (
        <circle r="5" className="ut-narrative-edge__traveler">
          <animateMotion dur={`${data.durationMs}ms`} path={path} fill="freeze" />
        </circle>
      ) : null}

      {data?.label && visible ? (
        <EdgeLabelRenderer>
          <div
            className={`ut-edge-label ut-edge-label--${data.kind} nodrag nopan`}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
