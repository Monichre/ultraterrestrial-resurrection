import { describe, expect, it } from 'vitest';
import { nuclearShadowDefinition } from '../nuclear-shadow.definition';
import { validateTourDefinition } from '../../shared/graph/validate-tour-definition';

// Relative import above intentionally tests that the feature remains self-contained.
describe('Nuclear Shadow definition', () => {
  it('passes canonical validation', () => {
    const result = validateTourDefinition(nuclearShadowDefinition);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it('contains the complete Act I route', () => {
    expect(nuclearShadowDefinition.route).toHaveLength(8);
    expect(nuclearShadowDefinition.waypoints).toHaveLength(8);
    expect(nuclearShadowDefinition.transitions).toHaveLength(7);
  });
});
