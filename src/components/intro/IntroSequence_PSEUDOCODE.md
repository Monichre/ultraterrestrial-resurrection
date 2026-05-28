# Intro Sequence — Pseudocode

## Master timeline (single GSAP timeline, mirrored in TitleAlt by absolute delays)

t = 0.0  Camera at (0, 0, 80) looking at Earth. Stars streak past.
t = 0.0 → 3.0  Camera dolly: distance 80 → 5, ease "expo.out". Earth visible, growing.
t = 2.6 → 3.6  Atmosphere fresnel uIntensity 0 → 1.2.
t = 3.0 → 3.4  Brief micro-flash (ambient light flare).
t = 3.2 → 7.0  Orbital pivot: angle 0 → -π·0.6 around Earth. Camera continues looking at Earth.
t = 3.4 → 5.4  Moon enters from behind-left: moonAngle π·1.05 → π·0.55, scale 0 → 1.
t = 5.4 → 11.0 Moon continues orbital arc: moonAngle drifts further; camera orbit continues angle → -π·1.05.
t = 4.0 → 8.5  Flicker events (3–4 random pulses): UFO orbs flash in for 120ms each, pointLight bursts.
t = 7.5 → 9.0  Intermittent glitch micro-pulses (uGlitch 0 → 0.25 → 0).
t = 9.0 → 9.6  Hard blackout fades in (uBlackout 0 → 1, ease "power4.in").
t = 9.6 → 10.4 Static/glitch shader sweeps in (uStatic 0 → 0.85, uGlitch 0 → 1).
t = 10.4 → end ASCII dither overlay reveals (uAscii 0 → 1). uBlackout eases 1 → 0.55 so static is visible.
t = 10.6 → end Lovecraft quote types/fades over the static.

## Title overlay timing (TitleAlt)

t = 3.2  Title "ULTRATERRESTRIAL" begins reveal (stagger from center).
t = 9.0  Title yPercent/blur out as blackout begins.
t = 10.6 Lovecraft quote fade + per-line slide up.

## Camera rig

state ref { distance, angle, height, lookAtY }
useFrame: camera.position.x = sin(angle) * distance
          camera.position.z = cos(angle) * distance
          camera.position.y = height
          camera.lookAt(0, lookAtY, 0)

## Postprocessing IntroFX

Custom Effect (postprocessing.Effect) with fragmentShader uniforms:
  uGlitch, uBlackout, uAscii, uStatic, uTime
- Glitch: scanline horizontal displacement + chromatic aberration scaled by uGlitch.
- Static: hash noise per pixel mixed by uStatic.
- ASCII: cell-quantize luminance into discrete buckets; tint green-grey; mix by uAscii.
- Blackout: multiply final rgb by (1 - uBlackout).

A control ref { glitch, blackout, ascii, static } is tweened by GSAP; useFrame syncs values into uniforms each frame.
