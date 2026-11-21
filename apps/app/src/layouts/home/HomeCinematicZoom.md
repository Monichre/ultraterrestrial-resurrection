# HomeCinematicZoom — Implementation

**Updated:** 2026-08-11
**Decision:** Descent shot · Act 1 autorun (before wordmark) · dramatic fall (start far)
**Source:** camera choreography ported from `Makio64/threejs-cinematic-world-zoom` (MIT)

## What changed
The Act-1 intro now opens with a cinematic *fall from orbit*: the Earth camera
runs a geometric (log-distance) Descent from deep space onto the composed hero
framing, landing exactly where Act 2's scroll rig begins so the hand-off is
seamless.

## Files
| File | Change |
|------|--------|
| `lib/animations/cinematic-shot.ts` | Pure choreography (log-distance, per-channel easing, FOV/roll). Unit-tested. |
| `lib/animations/apply-orbit-state.ts` | Resolves a ShotState onto the orbiting camera (no DOM scale). |
| `hooks/useUltraterrestrialAnimation.tsx` | New `introProgress` ref; intro timeline tweens it 0→1 across the fall window; exposed in return; set to 1 on skip/fast-forward/reduced-motion, 0 on restart. |
| `components/earth/Earth.tsx` | `EarthIntroRig` samples the Descent shot by `introProgress` and applies it; renders during intro, then yields to `EarthJourneyRig`. Journey rig now also damps FOV→45 for a clean hand-off. |
| `layouts/home/home-animated.tsx` | Passes `introRef` + `introActive` to Earth. |

## Seamless hand-off contract
- Descent lands at: distance `6.8`, azimuth `0` (via `startAzimuthDeg = -sweep`),
  pitch ≈ `0`, fov ≈ `45` → matches Act-2 `EarthJourneyRig` p=0 state.
- `introActive = !introComplete && !staticMode` — only one rig drives the camera
  at a time (never both).
- Reduced motion / forced reveal → `introProgress = 1` (lands at rest, no fall).

## Timing (CINEMATIC_TIMING)
- `EARTH_FALL_START = 4.0s` (as stars/earth fade in)
- `EARTH_FALL_DURATION = 4.0s` (lands ~8.0s, before NAV at 9.2s)
- Wordmark still reveals at 5.8s — over the still-descending globe.

## Drama
`startDistance = 80`, `endDistance = 6.8` → ~1.2 orders of magnitude of fall.

## Constraints honored
- No DOM scale/blur on WebGL canvases — camera-driven only.
- Act 2 scroll journey untouched.
