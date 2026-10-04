import type { TourDefinition } from '../types/tour-definition';
import { tourDefinitionSchema } from '../schemas/tour-definition.schema';

export interface DefinitionValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTourDefinition(
  definition: TourDefinition,
): DefinitionValidationResult {
  const parsed = tourDefinitionSchema.safeParse(definition);
  const errors: string[] = parsed.success
    ? []
    : parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

  const waypointIds = new Set(definition.waypoints.map(({ id }) => id));
  const ordinals = definition.waypoints.map(({ ordinal }) => ordinal);

  if (!waypointIds.has(definition.entryWaypointId)) {
    errors.push('Entry waypoint does not exist.');
  }

  if (new Set(definition.route).size !== definition.route.length) {
    errors.push('Canonical route contains duplicate waypoints.');
  }

  if (new Set(ordinals).size !== ordinals.length) {
    errors.push('Waypoint ordinals must be unique.');
  }

  for (const routeId of definition.route) {
    if (!waypointIds.has(routeId)) errors.push(`Route waypoint is missing: ${routeId}`);
  }

  for (const transition of definition.transitions) {
    if (!waypointIds.has(transition.sourceWaypointId)) {
      errors.push(`Missing source waypoint: ${transition.sourceWaypointId}`);
    }
    if (!waypointIds.has(transition.targetWaypointId)) {
      errors.push(`Missing target waypoint: ${transition.targetWaypointId}`);
    }
  }

  for (const waypoint of definition.waypoints) {
    const evidenceIds = new Set([
      ...waypoint.evidence.supporting,
      ...waypoint.evidence.counterpoints,
      ...waypoint.evidence.contextual,
    ].map((item) => item.id));

    for (const claim of waypoint.claims) {
      for (const evidenceId of claim.evidenceIds) {
        if (!evidenceIds.has(evidenceId)) {
          errors.push(`${waypoint.id}: claim ${claim.id} references missing ${evidenceId}.`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
