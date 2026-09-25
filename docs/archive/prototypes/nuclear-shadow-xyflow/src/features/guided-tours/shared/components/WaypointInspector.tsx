'use client';

import type { EvidenceReference, TourDefinition } from '../types/tour-definition';
import { useTourStore } from '../state/tour-store';
import { canDepartWaypoint } from '../state/tour-reducer';
import { selectActiveWaypoint } from '../state/tour-selectors';

function EvidenceButton({
  item,
  reviewed,
  onOpen,
}: {
  item: EvidenceReference;
  reviewed: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className={`ut-evidence-card ${reviewed ? 'ut-evidence-card--reviewed' : ''}`}
      onClick={onOpen}
    >
      <span>{item.role}</span>
      <strong>{item.title}</strong>
      <small>{item.sourceLabel}</small>
    </button>
  );
}

export function WaypointInspector({ definition }: { definition: TourDefinition }) {
  const runtime = useTourStore((state) => state.runtime);
  const dispatch = useTourStore((state) => state.dispatch);
  if (!runtime) return null;

  const waypoint = selectActiveWaypoint(definition, runtime);
  if (!waypoint) return null;
  const progress = runtime.progressByWaypoint[waypoint.id];
  const canDepart = canDepartWaypoint(runtime, waypoint.id);
  const isFinal = !waypoint.transition;

  const visible = (item: EvidenceReference) =>
    item.requiredForThresholds.includes(runtime.evidenceThreshold);

  const openEvidence = (item: EvidenceReference) => {
    dispatch({ type: 'EVIDENCE_DRAWER_OPENED', evidenceId: item.id });
    dispatch({
      type: 'EVIDENCE_OPENED',
      waypointId: waypoint.id,
      evidenceId: item.id,
      role: item.role,
    });
  };

  return (
    <section className="ut-waypoint-inspector nodrag nopan" aria-live="polite">
      <header>
        <span className="ut-kicker">
          WAYPOINT {String(waypoint.ordinal).padStart(2, '0')} / {definition.waypoints.length}
        </span>
        <h2>{waypoint.title}</h2>
        <p>{waypoint.dateRange.display}</p>
      </header>

      <div className="ut-inspector-scroll">
        <blockquote>{waypoint.narrative.entryClaim}</blockquote>
        <h3>{waypoint.narrative.question}</h3>

        {!progress.narrationCompleted ? (
          <button
            type="button"
            className="ut-button"
            onClick={() => dispatch({ type: 'NARRATION_COMPLETED', waypointId: waypoint.id })}
          >
            Acknowledge core claim
          </button>
        ) : (
          <p className="ut-complete-note">Core claim encountered.</p>
        )}

        <div className="ut-inspector-section">
          <h4>Supporting record</h4>
          {waypoint.evidence.supporting.filter(visible).map((item) => (
            <EvidenceButton
              key={item.id}
              item={item}
              reviewed={progress.openedEvidenceIds.includes(item.id)}
              onOpen={() => openEvidence(item)}
            />
          ))}
        </div>

        <div className="ut-inspector-section">
          <h4>Strongest challenge</h4>
          {waypoint.evidence.counterpoints.filter(visible).map((item) => (
            <EvidenceButton
              key={item.id}
              item={item}
              reviewed={progress.openedCounterpointIds.includes(item.id)}
              onOpen={() => openEvidence(item)}
            />
          ))}
        </div>

        <div className="ut-residue">
          <h4>Anomalous residue</h4>
          <p>{waypoint.narrative.completionStatement}</p>
          <ul>
            {waypoint.epistemic.openQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
          {!progress.acknowledgedResidue ? (
            <button
              type="button"
              className="ut-button ut-button--quiet"
              onClick={() =>
                dispatch({ type: 'RESIDUE_ACKNOWLEDGED', waypointId: waypoint.id })
              }
            >
              Preserve as unresolved
            </button>
          ) : (
            <p className="ut-complete-note">Uncertainty preserved.</p>
          )}
        </div>
      </div>

      <footer>
        <div className="ut-gate-summary">
          {Object.entries(progress.gates).map(([key, value]) => (
            <span key={key} data-complete={value}>
              {key}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="ut-button ut-button--primary"
          disabled={!canDepart || runtime.interactionsLocked}
          onClick={() => dispatch({ type: 'NEXT_REQUESTED' })}
        >
          {isFinal ? 'Complete Act I' : 'Animate to next marker'}
        </button>
      </footer>
    </section>
  );
}
