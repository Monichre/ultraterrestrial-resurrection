# PlanetaryIntro

Cinematic, single-canvas planetary intro animation. Replaces the previous setup
which mounted two separate `<Canvas>` instances (Earth + Moon) and a
Framer-Motion title overlay with three independent animation systems. Now a
single R3F scene is choreographed by one GSAP master timeline.

## Module Architecture

```
src/layouts/home/planetary-intro/
├── PlanetaryIntro.tsx   # Top-level: <Canvas>, CameraRig, GSAP timeline, DOM title
├── SceneObjects.tsx     # Planet, MoonOrbit, StarField (R3F) + atmosphere shader
└── index.ts             # Public re-export
```

### `SceneObjects.tsx`
- **`Planet`** — Earth sphere (96×96) with `meshStandardMaterial` (color/normal/AO
  textures from `/assets/earth2/*`), wrapped by **two additive fresnel atmosphere
  shells** (`BackSide` shaders, 1.06× and 1.18× scale) producing a layered rim
  glow + outer haze. Exposes a `PlanetHandle` (`group`, `mesh`, `atmoUniforms`)
  via `forwardRef` so GSAP can tween scale, rotation, and the `uIntensity`
  uniform directly.
- **`MoonOrbit`** — Loads `/assets/moon/moon.glb` and places it on an offset
  position inside a **pivot group**. Animating the pivot's `rotation.y` swings
  the moon along an orbital arc around the planet. Exposes `MoonHandle`
  (`pivot`, `material`) so GSAP can fade `material.opacity` from 0 → 1.
- **`StarField`** — 3,500 additive points distributed on a spherical shell
  (radius 40–100), slowly rotating to add subtle parallax depth.

### `PlanetaryIntro.tsx`
- **`CameraRig`** — bridges R3F's `useThree().camera` into a ref so GSAP can
  tween `camera.position`, while a `requestAnimationFrame` loop applies smoothed
  mouse parallax independent of the timeline.
- **GSAP master timeline** (built inside `useGSAP({ scope: rootRef })`) waits
  via `requestAnimationFrame` until all three handles (camera/planet/moon) are
  mounted, then plays once.
- **Char-split title** — splits `ULTRATERRESTRIAL` and `RESURRECTION` into
  `<span>` characters at runtime and staggers them with `yPercent`, `opacity`,
  and `filter: blur()` for a cinematic reveal.

## Data Flow

```
PlanetaryIntro
  ├─ refs: rootRef, titleRef, subtitleRef
  ├─ refs: cameraRef, planetHandleRef, moonHandleRef, parallax
  │
  ├─ <Canvas>
  │    ├─ <CameraRig cameraRef parallax />        ── writes cameraRef
  │    ├─ <Planet ref={planetHandleRef} />        ── writes PlanetHandle
  │    └─ <MoonOrbit ref={moonHandleRef} />       ── writes MoonHandle
  │
  ├─ window 'mousemove' ──► parallax.current  +  gsap.to(planet.group.rotation)
  │
  └─ useGSAP():
        waits for refs ──► gsap.timeline()
          ├─ camera.position.z      14 → 7.5 → 4.8
          ├─ planet.group.scale     0.001 → 1   (back.out)
          ├─ planet.atmoUniforms.uIntensity   0 → 1
          ├─ planet.mesh.rotation.y  += 0.6π   (spin-in)
          ├─ moon.pivot.rotation.y  -1.1π → 0  (orbital swing)
          ├─ moon.material.opacity  0 → 1
          ├─ titleChars             stagger reveal (y/opacity/blur)
          ├─ subtitleChars          stagger reveal
          └─ planet.group.position.y  yoyo idle breath (repeat -1)
```

## Master Timeline (seconds)

| t      | target                          | tween                     |
| ------ | ------------------------------- | ------------------------- |
| 0.0    | `camera.position.z`             | 14 → 7.5 (`power3.inOut`) |
| 0.2    | `planet.group.scale`            | 0.001 → 1 (`back.out`)    |
| 0.4    | `planet.mesh.rotation.y`        | += 0.6π                   |
| 0.6    | `atmoUniforms.uIntensity`       | 0 → 1                     |
| 1.4    | `camera.position.z`             | 7.5 → 4.8                 |
| 1.4    | `moon.pivot.rotation.y`         | -1.1π → 0 (`power3.out`)  |
| 1.8    | `moon.material.opacity`         | 0 → 1                     |
| 1.6    | `titleChars`                    | stagger reveal (`expo.out`) |
| 2.4    | `subtitleChars`                 | stagger reveal            |
| ~3+    | `planet.group.position.y`       | yoyo breath (loop)        |

## Key Decisions

- **Single Canvas.** Removed the duplicate `<Canvas>` instances (Earth + Moon)
  in the original `home.tsx`. Two GL contexts is wasteful and prevents shared
  lighting / postprocessing.
- **Imperative refs over R3F state.** GSAP wants stable mutable targets
  (`THREE.Vector3`, uniforms, `Material`). Forwarding handles avoids React
  re-renders during the animation.
- **Pivot orbit.** Putting the moon mesh at an offset inside a pivot group lets
  one rotation tween produce a real orbital path.
- **Two-shell atmosphere.** A single fresnel shell looks flat; an inner tight
  shell + outer haze shell gives painterly layered scattering.
- **Postprocessing.** `Bloom` (mipmapBlur, threshold 0.35) ties the additive
  star/atmosphere/title glow together.
- **Parallax loop is RAF, not GSAP.** Continuous low-amplitude follow is
  cheaper as a lerp inside `requestAnimationFrame` than an overwriting tween.

## Public API

```tsx
import { PlanetaryIntro } from '@/layouts/home/planetary-intro'

<PlanetaryIntro />
```

No props — fully self-contained. Used in `src/layouts/home/home.tsx`.

## Performance Notes

- Sphere geometry: 96 segments for Earth, 64/48 for atmosphere shells.
- `dpr={[1, 2]}` caps device pixel ratio on retina.
- `powerPreference: "high-performance"`.
- Star points use `AdditiveBlending` + `depthWrite: false`.
- `useGLTF.preload` warms the moon GLB at module load.
