'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { GateKey } from '../types/tour-runtime';
import type { NuclearTourNode } from '../types/flow-model';

const gateOrder: GateKey[] = ['claim', 'evidence', 'challenge', 'residue'];

/**
 * The anchor stamp says, on the node itself, whether this waypoint is bound to
 * a live archive record. Solid = a record exists; dashed = the archive holds
 * nothing (narrative-only) or the lookup found nothing (unresolved). "No
 * record" must never read as "not loaded yet", so each state has its own copy.
 */
const ANCHOR_COPY: Record<NuclearTourNode['data']['anchorState'], string> = {
  resolving: 'Resolving record…',
  resolved: 'Archive record',
  unresolved: 'Searched · no record found',
  'narrative-only': 'Narrative only · no record',
};

export const WaypointNode = memo(function WaypointNode({ data }: NodeProps<NuclearTourNode>) {
  const active = data.status === 'active' || data.status === 'complete';
  const anchorLabel =
    data.anchorState === 'resolved' && data.anchorTable
      ? `${ANCHOR_COPY.resolved} · ${data.anchorTable.replace(/_/g, ' ')}`
      : ANCHOR_COPY[data.anchorState];

  return (
    <article
      id={`waypoint-${data.waypointId}`}
      className={`ut-waypoint ut-waypoint--${data.status} ut-waypoint--${data.visualMode} nodrag nopan`}
      aria-current={data.status === 'active' ? 'step' : undefined}
      tabIndex={data.status === 'hidden' ? -1 : 0}
    >
      <Handle type="target" position={Position.Left} className="ut-handle" isConnectable={false} />

      <motion.div
        className="ut-waypoint__body"
        animate={
          active
            ? { scale: [1, 1.018, 1], opacity: 1 }
            : { scale: 1, opacity: data.status === 'ghost' ? 0.58 : 1 }
        }
        transition={{ duration: active ? 3.2 : 0.2, repeat: active ? Infinity : 0 }}
      >
        <header className="ut-waypoint__header">
          <span className="ut-waypoint__ordinal">{String(data.ordinal).padStart(2, '0')}</span>
          <span className="ut-waypoint__date">{data.dateDisplay}</span>
        </header>

        <h3>{data.title}</h3>
        {data.subtitle ? <p>{data.subtitle}</p> : null}

        <span
          className="ut-waypoint__anchor"
          data-anchor-state={data.anchorState}
          title={anchorLabel}
        >
          {anchorLabel}
        </span>

        <div
          className="ut-completion-ring"
          aria-label={`${gateOrder.filter((gate) => data.progress.gates[gate]).length} of 4 waypoint requirements completed`}
        >
          {gateOrder.map((gate) => (
            <span
              key={gate}
              title={gate}
              data-gate={gate}
              data-complete={data.progress.gates[gate]}
              className="ut-completion-ring__segment"
            />
          ))}
        </div>
      </motion.div>

      <Handle type="source" position={Position.Right} className="ut-handle" isConnectable={false} />
    </article>
  );
});
