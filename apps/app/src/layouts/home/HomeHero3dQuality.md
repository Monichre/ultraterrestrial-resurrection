# HomeHero3dQuality

**Updated:** 2026-08-06 19:35 CT  
**Status:** Implemented — visual audit UNVERIFIED on Retina (automation browser is DPR 1)

## Problem

Home hero Earth/Moon rendering had degraded to soft, smeared, low-fidelity spheres.

### Root causes

1. **Earth** — leftover debug red cube; Canvas lacked DPR / antialias / ACES; local briefly used colorful 8K day/night maps (wrong look vs production).
2. **Moon** — GLB PBR (`Material_39`) replaced by a raymarch shader; `antialias: false`; `TiltShift2 blur={0.35}` smeared craters; Bloom stacked on top.
3. **DOM scale on WebGL** — GSAP scrubbed `scale: 0.6 → 2.35` on the moon wrapper. R3F sized the buffer to the *transformed* rect, then the flyby upscaled a soft bitmap.
4. **CSS `filter: blur()`** on the moon layer during intro compounded the mush.

**Production SoT:** [ultraterrestrial.app](https://www.ultraterrestrial.app/) loads `earth2/color.jpg` + `normal.png` + `occlusion.jpg` and `moon/moon.glb` — grayscale crescent Earth, cratered Moon.

## Architecture

```
page.tsx
  └─ HomeAnimated
       ├─ Earth (full-viewport Canvas, opaque)
       │    └─ EarthGlobe — 8K meshStandardMaterial + atmosphere shell
       │    └─ EarthJourneyRig — camera z/y from journeyProgress
       └─ Moon (full-viewport Canvas, transparent alpha)
            └─ MoonScene — moon.glb Material_39 + mesh visual-scale stops
            └─ MoonJourneyRig — camera z/y from journeyProgress
```

GSAP owns **x / y / opacity / zIndex** on the DOM layers only.  
R3F owns **camera push** and **mesh scale** for cinematic size changes.

## Quality settings

| Surface | DPR | AA | Tone mapping | Assets |
|--------|-----|----|--------------|--------|
| Earth | `[1, 2]` | on | ACES + SRGB, exposure 1.05 | `earth2/{color,normal,occlusion}` (prod) |
| Moon | `[1, 2]` | on | ACES + SRGB, exposure 1.18 | `moon.glb` `Material_39` (prod) |

Shared helpers: `lib/three/harden-gltf-materials.ts` (`hardenMaterialMaps`, `configureHeroRenderer`).

## Files touched

- `components/earth/Earth.tsx`
- `components/moon/Moon.tsx`
- `lib/three/harden-gltf-materials.ts` (new)
- `hooks/useUltraterrestrialAnimation.tsx` — no DOM scale/blur on celestial layers
- `layouts/home/home-animated.tsx` — full-viewport layers; moon transparent
- `layouts/home/ANIMATION_SEQUENCE.md` — synced
- `layouts/home/HomeHero3dQuality_PSUEDOCODE.md` — plan

## Data flow

1. Act 1 intro fades Earth / slides Moon (opacity + translate).
2. Act 2 ScrollTrigger writes `journeyProgress.current ∈ [0,1]`.
3. Rigs sample stops each frame (`sampleStops` + `damp`).
4. Moon mesh scale follows `MOON_VISUAL_SCALE` stops; Earth size via camera only.

## Not done / open

- Dogfood on a Retina display (DPR 2) — automation host reports `devicePixelRatio: 1`.
- Optional cloud layer (`Material_62_baseColor.png` is 34MB — intentionally skipped).
- Day/night terminator shader (emissive cities currently show on day side at low intensity).
- Disk full warning on this machine (`ENOSPC` during Next cache write) — unrelated but may affect HMR.
