# Home Animation Sequence Documentation

## Overview

The home page features a sophisticated multi-phase animation sequence that creates an immersive cosmic experience.

**Implementation:** `HomeAnimated` (`home-animated.tsx`) + `useUltraterrestrialAnimation`  
**Timing constants:** `CINEMATIC_TIMING` in the hook — must match this document.

## Animation Timeline

### Phase 0: Initial Setup (0s)

- All elements hidden
- Background set to black
- Flash overlay created

### Phase 1: Quick Flashes (0-2s)

- Rapid flash pulses (5 repetitions)
- Creates anticipation and energy

### Phase 2: Fluid Shader Orbs (0.5-4.5s)

- Ethereal orbs appear and animate
- Provides visual interest during setup
- Controlled via React state for smooth transitions (`showFluidOrbs`)

### Phase 3: Big Flash Transition (5-6s)

- Major flash at 5s
- Flash expands and fades (scale: 3x)
- Signals transition to main content

### Phase 4: Background Elements (5.2-5.3s)

- Stars fade in (5.2s)
- Shooting stars appear (5.3s)
- Creates cosmic atmosphere

### Phase 5: Celestial Bodies (5.5-11s)

- **Prometheus** fades in ethereally (5.5s, opacity: 0.85)
- **Earth** reveals with fade (5.5s)
- **Moon** orbits in from behind left shoulder (8-11s)
  - Starts hidden
  - Moves to position: x: 25vw, y: -15vh
  - Scales to 0.6
- Earth begins subtle floating animation (9s, infinite)

### Phase 6: UI Elements (8.5-13s)

- **Title** (ULTRATERRESTRIAL) appears with text scramble (8.5s)
  - 2.5s scramble duration
  - Gradient text effect
  - Triggers quote after completion
- **Lovecraft Quote** fades in below title (11.5s)
  - 3s scramble / text-effect duration
  - Italic, light gray text
- **Navigation** slides down from top (13s)
  - Global MenuTrigger chrome (wordmark + hamburger; CosmicNav successor)
  - Fixed position

## Component Hierarchy (Z-Index Layers)

```
z-[50] - Navigation (MenuTrigger chrome)
z-[40] - UI Content (Title, Quote)
z-[20] - Earth
z-[10] - Moon
z-[5]  - Prometheus
z-[3]  - Fluid Shader Orbs (when visible)
z-[2]  - Shooting Stars
z-[1]  - Stars Background
```

## Animation States

The component tracks several animation states:

- `titleVisible`: Controls title animation (8.5s)
- `quoteVisible`: Controls Lovecraft quote (11.5s)
- `navVisible`: Controls navigation reveal (13s)
- `showFluidOrbs`: Controlled by GSAP timeline (0.5–4.5s)

## Keyboard Shortcuts (Dev Mode Only)

- **Space**: Pause animation
- **Enter**: Resume animation
- **R**: Restart animation
- **S**: Skip to end

## Key Features

### Text Scramble Effect

- Custom TextScramble component creates matrix-style text reveal
- Characters scramble through random symbols before revealing
- Supports callbacks for chaining animations

### Framer Motion Integration

- AnimatePresence for smooth mount/unmount transitions
- Motion / TextEffect for quote reveal
- Mode='wait' prevents overlapping animations

### GSAP Timeline Control

- Master timeline orchestrates all phases (`useUltraterrestrialAnimation`)
- Precise timing control via `CINEMATIC_TIMING`
- Pause/resume/restart capabilities

## Performance Optimizations

1. **Dynamic Imports**: Heavy 3D components loaded on-demand
2. **SSR Disabled**: 3D components skip server rendering
3. **State-Based Rendering**: Title/quote only mount when timed
4. **Dev-Only Features**: Keyboard shortcuts only in development
5. **Reduced motion**: `prefers-reduced-motion: reduce` skips to final composed scene

## Customization Points

### Timing Adjustments

Edit `CINEMATIC_TIMING` in `useUltraterrestrialAnimation.tsx` — keep this doc in sync:

```javascript
TITLE: 8.5   // Title appears
QUOTE: 11.5  // Quote appears
NAV: 13.0    // Navigation appears
```

### Animation Durations

- TextScramble duration prop on `TitleAlt` (2500ms)
- GSAP durations in `useUltraterrestrialAnimation`
- Moon orbital: 3s to x: 25vw, y: -15vh, scale 0.6

### Visual Effects

- Text shadows and gradients in TitleAlt
- Opacity 0.85 for Prometheus
- Position offsets for celestial bodies

## Dependencies

- **Framer Motion**: Quote / presence
- **GSAP** + **@gsap/react**: Master timeline
- **React Three Fiber**: Earth, Moon, Prometheus, FluidShaderOrbs
- **Hook**: `useUltraterrestrialAnimation`

## Troubleshooting

### Animation Not Playing

- Check `isReady` from `useUltraterrestrialAnimation`
- Confirm refs attached on moon / earth / prometheus / stars / title / nav
- Confirm `#earth-canvas`, `#moon-canvas`, `.prometheus-container` exist
- Check browser console for GSAP / WebGL errors

### Performance Issues

- Reduce particle counts in 3D components
- Disable shooting stars on low-end devices
- Prefer opacity/transform; moon enter blur is intentional cinematic

### Timing Conflicts

- Do not replace this sequence with a shortened stars→earth-only timeline
- Account for animation durations when adjusting `CINEMATIC_TIMING`
- Use timeline callbacks for phase state (`titleVisible`, `quoteVisible`, `navVisible`)
