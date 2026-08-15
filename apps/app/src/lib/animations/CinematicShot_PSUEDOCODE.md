# CinematicShot — Pseudocode

Adapted from `Makio64/threejs-cinematic-world-zoom` (MIT). Ported the camera
*choreography*, not the geo/tiles/sun/recorder stack.

## The three load-bearing ideas
1. Distance interpolated geometrically: `mixLog(d0,d1,t) = d0·(d1/d0)^t`.
   Constant zoom rate == constant rate of change of log distance.
2. Every channel (distance/azimuth/pitch/fov/roll) on its own easing curve.
3. FOV is a real channel — the lens does work (hyperzoom 62°→14°).

## Modules
```
lib/animations/cinematic-shot.ts     # pure, no three.js — unit-tested
  easing: clamp01 smoothstep smootherstep cubicInOut sineInOut mixLog
          bezier delayed cinematic coast coastFromRest track smoothTrack
  SHOT_PRESETS: descent | dive | orbit | flyby | hyperzoom
  createOrbitShot({preset,startDistance,endDistance,startAzimuthDeg,duration})
    -> sample(seconds) / sampleAtProgress(0..1) -> ShotState
       ShotState = {distance, azimuth(rad), pitch(rad), fov(deg), roll(rad), t}

lib/animations/apply-orbit-state.ts  # three.js glue
  applyOrbitState(camera, state, {aim=origin})
    dir = (cosP·sinA, sinP, cosP·cosA); eye = dir·distance
    camera.position=eye; lookAt(aim); rotateZ(roll); set fov
```

## Design-lab preview
```
app/design-lab/home-celestial/cinematic/
  CinematicStage.tsx   # real Earth PBR + starfield; play + scrub; tune far/near/duration
  page.tsx             # lab shell + FeedbackOverlay
```

## Wiring target (after pick)
- Replace `EarthJourneyRig` sample-stops in `components/earth/Earth.tsx` with
  `createOrbitShot(...).sampleAtProgress(journeyRef.current)` + `applyOrbitState`.
- Optionally drive Act-1 arrival with `sample(seconds)` on the intro timeline.
- Keep: no DOM scale/blur on WebGL; damp toward sampled state for scrub smoothing.
```
