# Home Animation Sequence Documentation

## Overview
The home page features a sophisticated multi-phase animation sequence that creates an immersive cosmic experience.

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
- Controlled via React state for smooth transitions

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
  - 3s scramble duration
  - Italic, light gray text
- **Navigation** slides down from top (13s)
  - CosmicNav component
  - Fixed position

## Component Hierarchy (Z-Index Layers)

```
z-[50] - Navigation (CosmicNav)
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

- `animationPhase`: 'loading' | 'title' | 'quote' | 'complete'
- `titleVisible`: Controls title animation
- `quoteVisible`: Controls quote animation
- `navVisible`: Controls navigation reveal
- `showFluidOrbs`: Controlled by GSAP timeline

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
- Motion divs for opacity and position animations
- Mode='wait' prevents overlapping animations

### GSAP Timeline Control
- Master timeline orchestrates all phases
- Precise timing control
- Pause/resume/restart capabilities

## Performance Optimizations

1. **Dynamic Imports**: Heavy 3D components loaded on-demand
2. **SSR Disabled**: 3D components skip server rendering
3. **State-Based Rendering**: Components only render when needed
4. **Dev-Only Features**: Keyboard shortcuts and logging only in development

## Customization Points

### Timing Adjustments
Edit the timeout values in `useEffect` for phase timing:
```javascript
8500  // Title appears
11500 // Quote appears
13000 // Navigation appears
```

### Animation Durations
Adjust in respective components:
- TextScramble duration prop
- Motion transition durations
- GSAP timeline durations in useUltraterrestrialAnimation

### Visual Effects
- Text shadows and gradients in TitleAlt
- Opacity values for ethereal effects
- Position offsets for celestial bodies

## Dependencies

- **Framer Motion**: Declarative animations
- **GSAP**: Complex timeline orchestration
- **React Three Fiber**: 3D celestial bodies
- **Custom Hooks**: useUltraterrestrialAnimation for timeline control

## Troubleshooting

### Animation Not Playing
- Check `isReady` state from useUltraterrestrialAnimation
- Verify component mounting order
- Check browser console for GSAP errors

### Performance Issues
- Reduce particle counts in 3D components
- Disable shooting stars on low-end devices
- Use CSS transforms instead of complex filters

### Timing Conflicts
- Ensure phase delays don't overlap
- Account for animation durations when setting delays
- Use animation callbacks for precise sequencing
