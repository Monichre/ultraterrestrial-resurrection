# HomeCelestial Design Lab — Pseudocode

## Goal
Explore improved home-hero 3D + 2 elite planetary variations (Mars, Neptune) using new GLTF packs, without mutating production `home-animated` until a winner is chosen.

## Assets (installed)
- `/assets/planets/mars/scene.gltf`
- `/assets/planets/neptune/scene.gltf`
- `/assets/planets/moon-2/scene.gltf`
- Earth stays prod stack: `/assets/earth2/{color,normal,occlusion}`

## Shared `CelestialStage`
```
props: primary: 'earth'|'mars'|'neptune'
       secondary: 'moon2'|'none'
       framing: 'prod-shoulder'|'cinematic-full'|'dual-ghost'
       light: 'crescent'|'cold'|'ochre'

load primary GLTF or Earth textured sphere
load secondary moon-2 when requested
normalize each scene to unit sphere via Box3
apply hardenMaterialMaps + ACES canvas
spin primary slowly; secondary slower counter-spin
framing:
  prod-shoulder → moon group at [-1.6, 1.1, -1.2] scale 0.35
  cinematic-full → moon centered, camera push sample
  dual-ghost → secondary at opacity 0.35 behind primary
```

## Variants
- A: Earth + moon-2, prod-shoulder, crescent (baseline upgrade)
- B: Mars + moon-2, ochre crescent (elite 1)
- C: Neptune + moon-2, cold rim (elite 2)
- D: Earth + moon-2, cinematic-full with fake scrub scrubber
- E: Mars primary + Neptune ghost (expressive dual)

## Lab route
`/design-lab/home-celestial` + FeedbackOverlay
```
