import { Radar } from './Radar'
import { OrbitArcs } from './OrbitArcs'
import { PlanetMarker } from './PlanetMarker'
import { YourPosition } from './YourPosition'
import type { PlanetName } from './icons/planets'

/**
 * Coordinates are % of map area. Matched against reference layout where
 * planets sit roughly on the dashed orbital arcs bowing from upper-left
 * through the middle and back to the lower-right.
 */
const MAP_PLANETS: ReadonlyArray<{
  name: PlanetName
  x: number
  y: number
  labelSide?: 'right' | 'bottom'
}> = [
  { name: 'Jupiter', x: 56, y: 18 },
  { name: 'Venus', x: 26, y: 32 },
  { name: 'Sun', x: 10, y: 58 },
  { name: 'Earth', x: 38, y: 64 },
  { name: 'Uranus', x: 86, y: 62 },
  { name: 'Mars', x: 58, y: 72 },
  { name: 'Neptune', x: 92, y: 78 },
  { name: 'Mercury', x: 26, y: 90 },
  { name: 'Saturn', x: 70, y: 78, labelSide: 'bottom' },
]

export const SolarMap = () => (
  <main
    aria-label="Solar system map"
    className="relative h-full"
    style={{ isolation: 'isolate' }}
  >
    <OrbitArcs />
    <Radar />
    {MAP_PLANETS.map((p) => (
      <PlanetMarker key={p.name} {...p} />
    ))}
    <YourPosition x={50} y={50} />
  </main>
)
