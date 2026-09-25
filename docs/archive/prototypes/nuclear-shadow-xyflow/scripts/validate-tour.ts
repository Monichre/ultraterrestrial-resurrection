import { nuclearShadowDefinition } from '../src/features/guided-tours/nuclear-shadow/nuclear-shadow.definition';
import { validateTourDefinition } from '../src/features/guided-tours/shared/graph/validate-tour-definition';

const result = validateTourDefinition(nuclearShadowDefinition);

if (!result.valid) {
  console.error('Nuclear Shadow definition is invalid:');
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Validated ${nuclearShadowDefinition.waypoints.length} waypoints, ${nuclearShadowDefinition.transitions.length} transitions, and ${nuclearShadowDefinition.waypoints.reduce((total, waypoint) => total + waypoint.claims.length, 0)} canonical claims.`,
);
