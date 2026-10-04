import * as THREE from 'three'

const COLOR_MAP_KEYS = ['map', 'emissiveMap'] as const
const MAP_KEYS = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'emissiveMap',
  'bumpMap',
] as const

/**
 * Max anisotropy + correct color spaces for GLTF textures.
 * Call once after load / clone so home hero canvases stay sharp at DPR 2.
 */
export const hardenMaterialMaps = (
  material: THREE.Material | THREE.Material[],
  maxAnisotropy = 8
): void => {
  const materials = Array.isArray(material) ? material : [material]
  for (const mat of materials) {
    for (const key of MAP_KEYS) {
      const texture = (mat as THREE.MeshStandardMaterial)[key] as THREE.Texture | null | undefined
      if (!texture) continue
      texture.anisotropy = maxAnisotropy
      if ((COLOR_MAP_KEYS as readonly string[]).includes(key)) {
        texture.colorSpace = THREE.SRGBColorSpace
      }
      texture.needsUpdate = true
    }
    mat.needsUpdate = true
  }
}

export const hardenGltfObject = (
  root: THREE.Object3D,
  maxAnisotropy = 8
): THREE.Object3D => {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh || !mesh.material) return
    hardenMaterialMaps(mesh.material, maxAnisotropy)
  })
  return root
}

export const configureHeroRenderer = (
  gl: THREE.WebGLRenderer,
  exposure = 1.12,
  clearAlpha = 1
): void => {
  // clearAlpha 0 lets a hero canvas composite over the layers beneath it
  // (stars / orbs / moon) instead of painting an opaque black plate.
  gl.setClearColor('#000000', clearAlpha)
  gl.outputColorSpace = THREE.SRGBColorSpace
  gl.toneMapping = THREE.ACESFilmicToneMapping
  gl.toneMappingExposure = exposure
}
