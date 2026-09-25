# Ultraterrestrial GSAP Animation Setup Guide

## Overview
This animation creates a cinematic entrance sequence for your ultraterrestrial application with the following phases:

1. **Complete Darkness** (0-2s)
2. **Dimensional Flashes** (0.5-3s) 
3. **Orb Manifestations** (2-5s)
4. **Big Bang Effect** (5-6s)
5. **Cosmic Environment Reveal** (5.5-8s)
6. **Celestial Bodies Emergence** (6-9s)
7. **Camera Fly-Through** (8-11s)
8. **UI Elements Materialization** (9-12s)
9. **Ambient Animations** (12s+)

## Installation

```bash
cd apps/app
npm install gsap
```

## Integration Steps

### 1. Install GSAP
```bash
npm install gsap@latest
```

### 2. Update your home.tsx file
Replace your current home.tsx with the animated version:

```tsx
// Import the animation hook
import { useUltraterrestrialAnimation } from '@/hooks/useUltraterrestrialAnimation'

// In your component
const { pauseAnimation, resumeAnimation, restartAnimation, skipToEnd } = useUltraterrestrialAnimation()
```

### 3. Add CSS classes to components
Make sure your components have these wrapper classes:
- `.cosmic-nav` - wraps the CosmicNav component
- `.shooting-stars` - wraps the ShootingStars component  
- `.stars-background` - wraps the StarsBackground component
- `#moon-canvas` - already exists on Moon component
- `#earth-canvas` - already exists on Earth component
- `.astronaut` - already exists on title wrapper

### 4. Optional: Keyboard Controls
The animation includes keyboard shortcuts for testing:
- **Space** - Pause animation
- **Enter** - Resume animation
- **R** - Restart animation
- **S** - Skip to end

## Animation Features

### Dimensional Flashes
- Creates mysterious light flashes using a radial gradient overlay
- Uses your theme color `#adf0dd` (pale turquoise)
- Mix-blend-mode: screen for ethereal effect

### Orb Manifestations
- 7 luminous orbs appear at different positions
- Each orb has unique size and timing
- Orbs converge to center before disappearing
- Creates anticipation for the "big bang"

### Big Bang Effect
- Bright flash expanding from center
- Transitions into the cosmic environment reveal

### Celestial Bodies
- Earth emerges from deep space with rotation
- Moon slides in from the side
- Both have blur-to-focus transitions

### Camera Movement
- Simulates flying through space
- Earth and Moon adjust positions for optimal composition
- Creates depth and dimensionality

### UI Elements
- Navigation fades in smoothly
- Title letters animate with 3D rotation
- Staggered animation from center outward

### Ambient Effects
- Subtle floating animations for celestial bodies
- Glow pulse effect for atmosphere
- Continuous but non-distracting movement

## Customization

### Timing Adjustments
Edit the timeline positions in `useUltraterrestrialAnimation.tsx`:

```tsx
// Example: Make earth appear earlier
tl.fromTo("#earth-canvas", {
  // ... properties
}, {
  // ... properties
}, 4) // Change this number to adjust when it starts
```

### Color Scheme
The animation uses `#adf0dd` (your theme color). To change:

```tsx
// In orb styles
background: radial-gradient(circle at 30% 30%, 
  rgba(173,240,221,1) 0%, // Change RGB values here
  rgba(173,240,221,0.6) 30%, 
  rgba(173,240,221,0.2) 60%, 
  transparent 100%);
```

### Number of Orbs
Add or remove orbs in the `orbPositions` array:

```tsx
const orbPositions = [
  { x: 20, y: 30, size: 60 },
  // Add more positions here
]
```

### Animation Easing
Two custom eases are included:
- `cosmic` - Smooth, space-like movement
- `dimensional` - More dramatic, portal-like effect

## Performance Considerations

1. **GPU Acceleration**: All transforms use 3D properties for GPU acceleration
2. **Dynamic Creation**: Effects are created/destroyed to minimize DOM pollution
3. **Conditional Loading**: Components use dynamic imports with SSR disabled
4. **Cleanup**: All animations and elements are properly cleaned up on unmount

## Troubleshooting

### Animation not starting
- Check that GSAP is properly installed
- Ensure the hook is imported and initialized
- Check browser console for errors

### Performance issues
- Reduce the number of orbs
- Simplify the blur effects
- Disable some ambient animations

### Elements not animating
- Verify CSS classes/IDs match
- Check z-index values don't conflict
- Ensure elements exist before animation starts

## Future Enhancements

1. **Audio Integration**: Sync with dramatic sound effects
2. **Interactive Elements**: Click/hover interactions during animation  
3. **Device Adaptation**: Simplified version for mobile
4. **Skip Animation**: Button to skip for returning visitors
5. **Progress Indicator**: Show animation progress
6. **Particle Systems**: Add more complex particle effects

## Demo Controls

For development/testing, keyboard controls are enabled:
- **Space**: Pause
- **Enter**: Resume  
- **R**: Restart
- **S**: Skip to end

These can be removed for production by commenting out the keyboard event listener in the component.
