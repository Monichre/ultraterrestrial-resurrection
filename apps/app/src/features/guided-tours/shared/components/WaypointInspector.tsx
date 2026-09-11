'use client';

import type {
  CorpusAnchor,
  EvidenceReference,
  ResolvedAnchor,
  TourDefinition,
} from '../types/tour-definition';
import { useTourStore } from '../state/tour-store';
import { canDepartWaypoint } from '../state/tour-reducer';
import { selectActiveWaypoint } from '../state/tour-selectors';

export type PlaceRecordHandler = (
  resolved: Extract<ResolvedAnchor, { state: 'resolved' }>,
  waypointTitle: string,
) => void;

const recordTitle = (record: Record<string, unknown>): string => {
  for (const key of ['name', 'title', 'label']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.replace(/\s+/g, ' ').trim();
  }
  return String(record.id ?? 'record');
};

/**
 * Says, in words, what binding this waypoint has to the live archive. The
 * three outcomes are deliberately distinct sentences: "no record exists",
 * "we searched and found nothing", and "here is the record" must never blur.
 */
function AnchorNote({
  anchor,
  resolved,
  waypointTitle,
  onPlaceRecord,
}: {
  anchor: CorpusAnchor;
  resolved: ResolvedAnchor | undefined;
  waypointTitle: string;
  onPlaceRecord?: PlaceRecordHandler;
}) {
  if (anchor.kind === 'none') {
    return (
      <p className="ut-anchor-note" data-anchor-state="narrative-only">
        <strong>Narrative only — no record in corpus</strong>
        {anchor.reason}
      </p>
    );
  }

  if (!resolved) {
    return (
      <p className="ut-anchor-note" data-anchor-state="resolving">
        <strong>Resolving archive record…</strong>
        Searching {anchor.table.replace(/_/g, ' ')}.
      </p>
    );
  }

  if (resolved.state === 'unresolved') {
    return (
      <p className="ut-anchor-note" data-anchor-state="unresolved">
        <strong>Searched · no record found</strong>
        Looked in {resolved.table.replace(/_/g, ' ')} for “{resolved.searchQuery}”. The archive may
        hold this under another name, or not at all.
      </p>
    );
  }

  if (resolved.state === 'narrative-only') {
    return (
      <p className="ut-anchor-note" data-anchor-state="narrative-only">
        <strong>Narrative only — no record in corpus</strong>
        {resolved.reason}
      </p>
    );
  }

  return (
    <div className="ut-anchor-note" data-anchor-state="resolved">
      <strong>Archive record · {resolved.table.replace(/_/g, ' ')}</strong>
      {recordTitle(resolved.record)}
      {onPlaceRecord ? (
        <button
          type="button"
          className="ut-button ut-button--quiet"
          onClick={() => onPlaceRecord(resolved, waypointTitle)}
        >
          Place record on canvas
        </button>
      ) : null}
    </div>
  );
}

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

export function WaypointInspector({
  definition,
  onPlaceRecord,
}: {
  definition: TourDefinition;
  /** Supplied by the canvas host; absent = the button is not offered. */
  onPlaceRecord?: PlaceRecordHandler;
}) {
  const runtime = useTourStore((state) => state.runtime);
  const dispatch = useTourStore((state) => state.dispatch);
  const resolvedAnchors = useTourStore((state) => state.resolvedAnchors);
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
        <AnchorNote
          anchor={waypoint.corpusAnchor}
          resolved={resolvedAnchors[waypoint.id]}
          waypointTitle={waypoint.title}
          onPlaceRecord={onPlaceRecord}
        />
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
