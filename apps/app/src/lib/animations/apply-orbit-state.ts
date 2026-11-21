/**
 * applyOrbitState — resolves a pure {@link ShotState} onto a three.js
 * PerspectiveCamera orbiting the scene origin.
 *
 * The eye direction is built analytically from (azimuth, pitch) so it stays
 * continuous through the top-down singularity that `lookAt` degenerates at:
 *
 *   dir = (cos p · sin a, sin p, cos p · cos a)
 *   eye = dir · distance
 *
 * The camera looks at the aim point (origin by default), then banks by `roll`
 * around its own view axis. FOV is written only when it changes to avoid
 * needless projection-matrix rebuilds.
 */

import * as THREE from 'three'
import type {ShotState} from './cinematic-shot'

const _dir = new THREE.Vector3()
const _eye = new THREE.Vector3()

export type ApplyOrbitOptions = {
  /** point the camera orbits and frames (scene units) */
  aim?: THREE.Vector3
}

export const applyOrbitState = (
  camera: THREE.PerspectiveCamera,
  state: ShotState,
  options: ApplyOrbitOptions = {}
): void => {
  const aim = options.aim
  const cosP = Math.cos(state.pitch)
  const sinP = Math.sin(state.pitch)

  _dir.set(cosP * Math.sin(state.azimuth), sinP, cosP * Math.cos(state.azimuth))
  _eye.copy(_dir).multiplyScalar(state.distance)
  if (aim) _eye.add(aim)

  camera.position.copy(_eye)
  camera.up.set(0, 1, 0)
  camera.lookAt(aim ?? _dir.set(0, 0, 0))

  // Bank: roll about the local view axis (camera's local -Z looks forward).
  if (state.roll) camera.rotateZ(state.roll)

  if (camera.fov !== state.fov) {
    camera.fov = state.fov
    camera.updateProjectionMatrix()
  }
}
