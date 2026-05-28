# PlanetaryIntro — Pseudocode

## Goal
Cinematic, single-canvas planetary intro choreographed by a GSAP master timeline.

## Modules
- `PlanetaryIntro.tsx` — top-level wrapper (Canvas + DOM title overlay)
- `Scene.tsx` — R3F scene graph (camera rig, planet, moon, atmosphere, stars)
- `Planet.tsx` — Earth mesh + atmosphere fresnel shader
- `MoonOrbit.tsx` — GLB moon on a pivot group, orbits + self-rotates
- `StarField.tsx` — points-based additive starfield
- `IntroTitle.tsx` — DOM-rendered title, char-split GSAP reveal
- `useIntroTimeline.ts` — builds gsap.timeline, exposes refs

## Data flow
- Refs (camera, planetGroup, atmoUniforms, moonPivot, titleEl) -> `useIntroTimeline`
- Timeline plays once on mount; mouse parallax uses gsap.quickTo on camera/planet

## Timeline (master tl)
0.0  set initial: camera.z=14, planet.scale=0.001, atmo.intensity=0, moon.opacity=0, title chars y=120, opacity=0, blur=20
0.0  -> 1.6  camera.z 14 -> 7.5 (power3.inOut)
0.2  -> 2.0  planet.scale 0.001 -> 1 (back.out(1.4))
0.4  -> 2.4  planet.rotation.y += 2.5 spin
0.8  -> 2.0  atmo.intensity 0 -> 1.0
1.4  -> 2.6  camera.z 7.5 -> 4.6 (subtle push)
1.4  -> 3.0  moonPivot.rotation.y -PI -> 0 (moon swings into view)
1.4  -> 2.4  moon material opacity 0 -> 1
1.6  title chars stagger: y 120->0, blur 20->0, opacity 0->1, dur 1.0, stagger 0.04, ease expo.out
2.4  subtitle fade in
ongoing useFrame: planet self-rotate, moon self-rotate, atmo time uniform, star twinkle

## Mouse parallax
- gsap.quickTo for camera.position.x/y (range ±0.4)
- gsap.quickTo for planetGroup.rotation.x/y (range ±0.08)

## Cleanup
- useGSAP scope; tl.kill on unmount; geometries/materials disposed by R3F
