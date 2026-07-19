import type {CaseFileLayerType} from './data'

// Depth "tier" a layer type sits at once the file is exploded — lower tiers
// sit closer to the viewer, higher tiers recede into the scene, so the
// stack visibly separates into layers rather than a flat fan.
const TYPE_TIER: Record<CaseFileLayerType, number> = {
  summary: 0,
  photo: 1,
  clipping: 1,
  personnel: 2,
  organization: 2,
  source: 3,
  video: 3,
}

export interface LayerTransform {
  position: [number, number, number]
  rotation: [number, number, number]
}

export function closedTransform(index: number): LayerTransform {
  return {
    position: [0, 0, 0.015 * index],
    rotation: [0, 0, (index % 2 === 0 ? 1 : -1) * 0.02 * index],
  }
}

export function openTransform(
  type: CaseFileLayerType,
  index: number,
  total: number,
): LayerTransform {
  if (type === 'summary') {
    return {position: [0, 0.5, 1.8], rotation: [0, 0, 0]}
  }

  const tier = TYPE_TIER[type]
  const angleSpread = Math.PI * 1.7
  const angle = total > 1 ? -angleSpread / 2 + (index / (total - 1)) * angleSpread : 0
  const radius = 2.6 + tier * 1.0

  const x = Math.sin(angle) * radius
  const z = -Math.cos(angle) * radius * 0.35 - tier * 0.7
  const y = 0.3 + Math.sin(index * 1.3) * 0.3 - tier * 0.15
  const rotY = -angle * 0.7
  const rotZ = Math.sin(index * 2.1) * 0.05

  return {position: [x, y, z], rotation: [0.05, rotY, rotZ]}
}
