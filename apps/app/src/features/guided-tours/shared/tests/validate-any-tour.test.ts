import { describe, expect, it } from 'vitest';
import { nuclearShadowDefinition } from '../../nuclear-shadow/nuclear-shadow.definition';
import { FAMOUS_EVENTS_TOUR } from '@/features/mindmap/tours/famous-events-tour';
import { validateAnyTourDefinition } from '../graph/validate-tour-definition';

describe('validateAnyTourDefinition', () => {
  it('validates the shipped spine tour', () => {
    expect(validateAnyTourDefinition(FAMOUS_EVENTS_TOUR)).toEqual({ valid: true, errors: [] });
  });

  it('validates the shipped evidence-graph tour', () => {
    expect(validateAnyTourDefinition(nuclearShadowDefinition)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it('rejects a spine tour with a malformed waypoint', () => {
    const broken = {
      ...FAMOUS_EVENTS_TOUR,
      waypoints: [{ ...FAMOUS_EVENTS_TOUR.waypoints[0], searchQuery: '' }],
    };
    const { valid, errors } = validateAnyTourDefinition(broken);

    expect(valid).toBe(false);
    expect(errors.join(' ')).toContain('searchQuery');
  });

  it('rejects a spine tour with no waypoints', () => {
    expect(validateAnyTourDefinition({ ...FAMOUS_EVENTS_TOUR, waypoints: [] }).valid).toBe(false);
  });

  it('still applies referential checks to evidence-graph tours', () => {
    const broken = {
      ...nuclearShadowDefinition,
      entryWaypointId: 'ut.tour.nuclear-shadow.wp-does-not-exist' as const,
    };
    const { valid, errors } = validateAnyTourDefinition(broken);

    expect(valid).toBe(false);
    expect(errors).toContain('Entry waypoint does not exist.');
  });

  it('rejects a table name outside the corpus whitelist', () => {
    const typo = {
      ...nuclearShadowDefinition,
      waypoints: [
        {
          ...nuclearShadowDefinition.waypoints[0],
          corpusAnchor: { kind: 'query', table: 'evnets', searchQuery: 'Manhattan Project' },
        },
        ...nuclearShadowDefinition.waypoints.slice(1),
      ],
    };

    expect(validateAnyTourDefinition(typo as never).valid).toBe(false);
  });
});
