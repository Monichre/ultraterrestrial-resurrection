'use client';

import type { TourDefinition } from '../types/tour-definition';
import { useTourStore } from '../state/tour-store';
import { selectProgressPercent } from '../state/tour-selectors';

export function TourHUD({ definition }: { definition: TourDefinition }) {
  const runtime = useTourStore((state) => state.runtime);
  const dispatch = useTourStore((state) => state.dispatch);

  if (!runtime) return null;
  const progress = selectProgressPercent(runtime);

  return (
    <header className="ut-tour-hud nodrag nopan">
      <div>
        <span className="ut-kicker">ULTRATERRESTRIAL / GUIDED TOUR 01</span>
        <h1>{definition.title}</h1>
        <p>{definition.subtitle}</p>
      </div>

      <div className="ut-tour-hud__controls">
        <label>
          Evidence threshold
          <select
            value={runtime.evidenceThreshold}
            onChange={(event) =>
              dispatch({
                type: 'EVIDENCE_THRESHOLD_CHANGED',
                value: event.target.value as typeof runtime.evidenceThreshold,
              })
            }
          >
            <option value="broad-archive">Broad archive</option>
            <option value="corroborated">Corroborated</option>
            <option value="official-record">Official record</option>
            <option value="multimodal-only">Multimodal only</option>
          </select>
        </label>

        <button
          type="button"
          className="ut-button ut-button--quiet"
          onClick={() => dispatch({ type: 'SYSTEM_VIEWPORT_CONTROL_REQUESTED' })}
        >
          Recenter
        </button>

        <div className="ut-progress" aria-label={`${progress}% complete`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>
  );
}
