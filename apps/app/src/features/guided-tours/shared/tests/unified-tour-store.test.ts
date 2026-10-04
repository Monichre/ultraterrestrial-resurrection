import { beforeEach, describe, expect, it } from 'vitest';
import { nuclearShadowDefinition } from '../../nuclear-shadow/nuclear-shadow.definition';
import { FAMOUS_EVENTS_TOUR } from '@/features/mindmap/tours/famous-events-tour';
import { useGuidedTourStore } from '@/features/mindmap/tours/guided-tour-store';
import { useTourStore } from '../state/tour-store';
import { useUnifiedTourStore, type SpineWaypoint } from '../state/unified-tour-store';

const resolved = (index: number): SpineWaypoint => ({
  ...FAMOUS_EVENTS_TOUR.waypoints[index],
  recordId: `rec-${index}`,
  record: { id: `rec-${index}` },
});

describe('unified tour store', () => {
  beforeEach(() => {
    useUnifiedTourStore.getState().reset();
    useUnifiedTourStore.getState().unloadDefinition();
  });

  it('is one store — both legacy hooks are the same instance', () => {
    expect(useGuidedTourStore).toBe(useUnifiedTourStore);
    expect(useTourStore).toBe(useUnifiedTourStore);
  });

  it('preserves the spine engine surface end to end', () => {
    const store = useUnifiedTourStore.getState();
    store.beginResolving(FAMOUS_EVENTS_TOUR);
    expect(useUnifiedTourStore.getState().status).toBe('resolving');
    expect(useUnifiedTourStore.getState().tourTitle).toBe(FAMOUS_EVENTS_TOUR.title);

    useUnifiedTourStore.getState().beginRunning([resolved(0), resolved(1)]);
    expect(useUnifiedTourStore.getState().status).toBe('running');

    useUnifiedTourStore.getState().goTo(1);
    expect(useUnifiedTourStore.getState().stepIndex).toBe(1);

    useUnifiedTourStore.getState().goTo(99);
    expect(useUnifiedTourStore.getState().stepIndex, 'out-of-range goTo is ignored').toBe(1);

    useUnifiedTourStore.getState().markPlaced('rec-0');
    useUnifiedTourStore.getState().markPlaced('rec-0');
    expect(useUnifiedTourStore.getState().placedNodeIds, 'markPlaced dedupes').toEqual(['rec-0']);

    useUnifiedTourStore.getState().complete();
    expect(useUnifiedTourStore.getState().status).toBe('completed');
  });

  it('preserves the evidence-graph engine surface end to end', () => {
    useUnifiedTourStore.getState().loadDefinition(nuclearShadowDefinition);
    const runtime = useUnifiedTourStore.getState().runtime;

    expect(runtime?.phase).toBe('overview');
    expect(runtime?.activeWaypointId).toBe(nuclearShadowDefinition.entryWaypointId);
    expect(runtime?.hydrated).toBe(true);
    expect(runtime?.interactionsLocked).toBe(true);
  });

  it('keeps the two engines from clobbering each other', () => {
    useUnifiedTourStore.getState().loadDefinition(nuclearShadowDefinition);
    useUnifiedTourStore.getState().beginResolving(FAMOUS_EVENTS_TOUR);
    useUnifiedTourStore.getState().beginRunning([resolved(0)]);

    const state = useUnifiedTourStore.getState();
    expect(state.status, 'spine half advanced').toBe('running');
    expect(state.definition, 'evidence-graph half survived').not.toBeNull();
    expect(state.runtime?.activeWaypointId).toBe(nuclearShadowDefinition.entryWaypointId);
  });

  it('unloads the evidence-graph half without disturbing spine progress', () => {
    useUnifiedTourStore.getState().loadDefinition(nuclearShadowDefinition);
    useUnifiedTourStore.getState().beginResolving(FAMOUS_EVENTS_TOUR);
    useUnifiedTourStore.getState().beginRunning([resolved(0)]);

    useUnifiedTourStore.getState().unloadDefinition();

    const state = useUnifiedTourStore.getState();
    expect(state.definition, 'a stale definition would render evidence overlays').toBeNull();
    expect(state.runtime).toBeNull();
    expect(state.status, 'unload is evidence-graph-scoped').toBe('running');
    expect(state.waypoints).toHaveLength(1);
  });

  it('ignores dispatch when no evidence-graph tour is loaded', () => {
    useUnifiedTourStore.getState().dispatch({ type: 'OVERVIEW_COMPLETED' });
    expect(useUnifiedTourStore.getState().runtime).toBeNull();
  });

  it('clears spine progress on reset without touching the evidence-graph half', () => {
    useUnifiedTourStore.getState().loadDefinition(nuclearShadowDefinition);
    useUnifiedTourStore.getState().beginResolving(FAMOUS_EVENTS_TOUR);
    useUnifiedTourStore.getState().beginRunning([resolved(0)]);
    useUnifiedTourStore.getState().markPlaced('rec-0');

    useUnifiedTourStore.getState().reset();

    const state = useUnifiedTourStore.getState();
    expect(state.status).toBe('idle');
    expect(state.waypoints).toEqual([]);
    expect(state.placedNodeIds).toEqual([]);
    expect(state.tourId).toBeNull();
    expect(state.definition, 'reset is spine-scoped').not.toBeNull();
  });
});
