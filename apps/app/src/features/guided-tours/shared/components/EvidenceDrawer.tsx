'use client';

import type { TourDefinition } from '../types/tour-definition';
import { useTourStore } from '../state/tour-store';

function findEvidence(definition: TourDefinition, evidenceId: string | null) {
  if (!evidenceId) return null;
  for (const waypoint of definition.waypoints) {
    const found = [
      ...waypoint.evidence.supporting,
      ...waypoint.evidence.counterpoints,
      ...waypoint.evidence.contextual,
    ].find((item) => item.id === evidenceId);
    if (found) return found;
  }
  return null;
}

export function EvidenceDrawer({ definition }: { definition: TourDefinition }) {
  const runtime = useTourStore((state) => state.runtime);
  const dispatch = useTourStore((state) => state.dispatch);
  if (!runtime?.evidenceDrawer.open) return null;

  const item = findEvidence(definition, runtime.evidenceDrawer.evidenceId);
  if (!item) return null;

  return (
    <aside className="ut-evidence-drawer nodrag nopan" aria-label="Evidence review">
      <button
        type="button"
        aria-label="Close evidence drawer"
        className="ut-evidence-drawer__close"
        onClick={() => dispatch({ type: 'EVIDENCE_DRAWER_CLOSED' })}
      >
        Close
      </button>

      <span className="ut-kicker">{item.type.replaceAll('-', ' ')}</span>
      <h2>{item.title}</h2>
      <p>{item.summary}</p>

      <dl>
        <div>
          <dt>Source</dt>
          <dd>{item.sourceLabel}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{item.role}</dd>
        </div>
        <div>
          <dt>Evidence class</dt>
          <dd>{item.confidence}</dd>
        </div>
        {item.sourceDate ? (
          <div>
            <dt>Date</dt>
            <dd>{item.sourceDate}</dd>
          </div>
        ) : null}
      </dl>

      {item.sourceUrl ? (
        <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="ut-button">
          Open source
        </a>
      ) : (
        <p className="ut-note">This item is a project note or requires a database source binding.</p>
      )}
    </aside>
  );
}
