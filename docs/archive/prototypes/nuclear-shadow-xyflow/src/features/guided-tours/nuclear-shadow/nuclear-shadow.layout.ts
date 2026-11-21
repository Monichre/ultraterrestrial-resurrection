import type { WaypointId } from '../shared/types/tour-definition';

export const nuclearShadowIds = {
  secretMachine: 'ut.tour.nuclear-shadow.wp-secret-machine',
  trinity: 'ut.tour.nuclear-shadow.wp-trinity',
  controlledRevelation: 'ut.tour.nuclear-shadow.wp-controlled-revelation',
  bornSecret: 'ut.tour.nuclear-shadow.wp-born-secret',
  twoSecrecyUniverses: 'ut.tour.nuclear-shadow.wp-two-secrecy-universes',
  blackArchitecture: 'ut.tour.nuclear-shadow.wp-black-architecture',
  propulsionFork: 'ut.tour.nuclear-shadow.wp-propulsion-fork',
  roswell: 'ut.tour.nuclear-shadow.wp-roswell',
} as const satisfies Record<string, WaypointId>;

export const nuclearShadowLayout = {
  [nuclearShadowIds.secretMachine]: { x: 0, y: 40 },
  [nuclearShadowIds.trinity]: { x: 520, y: 160 },
  [nuclearShadowIds.controlledRevelation]: { x: 1040, y: 40 },
  [nuclearShadowIds.bornSecret]: { x: 1570, y: -120 },
  [nuclearShadowIds.twoSecrecyUniverses]: { x: 2100, y: 80 },
  [nuclearShadowIds.blackArchitecture]: { x: 2650, y: -100 },
  [nuclearShadowIds.propulsionFork]: { x: 3200, y: 160 },
  [nuclearShadowIds.roswell]: { x: 3800, y: 20 },
} satisfies Record<WaypointId, { x: number; y: number }>;
