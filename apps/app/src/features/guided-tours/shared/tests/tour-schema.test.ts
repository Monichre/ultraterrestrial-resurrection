import { describe, expect, it } from 'vitest';
import { nuclearShadowDefinition } from '../../nuclear-shadow/nuclear-shadow.definition';
import { FAMOUS_EVENTS_TOUR } from '@/features/mindmap/tours/famous-events-tour';
import {
  anyTourDefinitionSchema,
  spineTourDefinitionSchema,
  tourDefinitionSchema,
} from '../schemas/tour-definition.schema';
import { hasCorpusAnchor, isNarrativeOnly } from '../types/tour-definition';

describe('unified tour definition schema', () => {
  it('accepts the evidence-graph tour through the mode-discriminated union', () => {
    const parsed = anyTourDefinitionSchema.parse(nuclearShadowDefinition);
    expect(parsed.mode).toBe('evidence-graph');
  });

  it('accepts the spine tour through the mode-discriminated union', () => {
    const parsed = anyTourDefinitionSchema.parse(FAMOUS_EVENTS_TOUR);
    expect(parsed.mode).toBe('spine');
  });

  it('rejects a spine tour submitted as an evidence-graph tour', () => {
    expect(() =>
      tourDefinitionSchema.parse({ ...FAMOUS_EVENTS_TOUR, mode: 'evidence-graph' }),
    ).toThrow();
  });

  it('rejects an evidence-graph tour submitted as a spine tour', () => {
    expect(() =>
      spineTourDefinitionSchema.parse({ ...nuclearShadowDefinition, mode: 'spine' }),
    ).toThrow();
  });

  it('rejects a tour with no mode at all — the discriminant is not optional', () => {
    const withoutMode = { ...nuclearShadowDefinition, mode: undefined };
    expect(() => anyTourDefinitionSchema.parse(withoutMode)).toThrow();
  });
});

describe('corpus anchors', () => {
  it('requires an explicit anchor on every evidence-graph waypoint', () => {
    for (const waypoint of nuclearShadowDefinition.waypoints) {
      expect(waypoint.corpusAnchor, `${waypoint.shortLabel} has no corpusAnchor`).toBeDefined();
    }
  });

  it('rejects a waypoint whose anchor was simply omitted', () => {
    const [first, ...rest] = nuclearShadowDefinition.waypoints;
    const anchorless = { ...first, corpusAnchor: undefined };
    expect(() =>
      tourDefinitionSchema.parse({
        ...nuclearShadowDefinition,
        waypoints: [anchorless, ...rest],
      }),
    ).toThrow();
  });

  it('distinguishes "no record exists" from "not yet resolved"', () => {
    const narrativeOnly = { kind: 'none', reason: 'No declassified record names this program.' } as const;
    const resolvable = { kind: 'query', table: 'events', searchQuery: 'Trinity test' } as const;

    expect(isNarrativeOnly(narrativeOnly)).toBe(true);
    expect(hasCorpusAnchor(narrativeOnly)).toBe(false);

    expect(isNarrativeOnly(resolvable)).toBe(false);
    expect(hasCorpusAnchor(resolvable)).toBe(true);
  });

  it('forces a stated reason on narrative-only waypoints so the UI can say why', () => {
    const [first, ...rest] = nuclearShadowDefinition.waypoints;
    expect(() =>
      tourDefinitionSchema.parse({
        ...nuclearShadowDefinition,
        waypoints: [{ ...first, corpusAnchor: { kind: 'none' } }, ...rest],
      }),
    ).toThrow();
  });

  it('anchors the three waypoints with real records in the corpus', () => {
    const anchored = nuclearShadowDefinition.waypoints
      .filter((waypoint) => hasCorpusAnchor(waypoint.corpusAnchor))
      .map((waypoint) => waypoint.shortLabel);

    expect(anchored).toEqual(
      expect.arrayContaining(['Manhattan Project', 'Trinity', 'Roswell']),
    );
  });

  it('marks the black-budget waypoints narrative-only rather than implying a record', () => {
    const byLabel = new Map(
      nuclearShadowDefinition.waypoints.map((waypoint) => [waypoint.shortLabel, waypoint]),
    );

    for (const label of ['Restricted Data', 'RD / NSI', 'SAPs']) {
      const anchor = byLabel.get(label)?.corpusAnchor;
      expect(isNarrativeOnly(anchor!), `${label} should be narrative-only`).toBe(true);
      expect(anchor).toHaveProperty('reason');
    }
  });
});
