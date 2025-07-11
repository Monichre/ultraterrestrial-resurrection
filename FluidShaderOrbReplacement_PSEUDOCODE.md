# Fluid Shader Orb Replacement - Pseudocode

## Overview

Replace the green orbs in the beginning animation with a fluid shader component that creates interactive white metaballs that follow mouse movement with trailing effects.

## Current Implementation Analysis

- Location: `apps/app/src/hooks/useUltraterrestrialAnimation.tsx`
- Current orbs: 5 green orbs created with CSS radial gradients
- Animation timeline: Orbs appear at 1-4s, move to center and disappear at 3s
- Current orb properties:
  - Positions: Various screen positions (20%, 30%, etc.)
  - Sizes: 40-100px
  - Color: rgba(173,240,221,*) - green theme color
  - Animation: Scale up, then converge to center

## New Fluid Shader Component Structure

### 1. Create FluidShaderOrbs Component

```typescript
// apps/app/src/components/animated/FluidShaderOrbs.tsx
interface FluidShaderOrbsProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

const FluidShaderOrbs: React.FC<FluidShaderOrbsProps> = ({
  isVisible,
  onComplete,
  duration = 3000
}) => {
  // Component implementation
}
```

### 2. Convert Vanilla JS to React Component

- Convert the provided vanilla JavaScript Three.js code to React
- Use useRef for DOM manipulation
- Use useEffect for initialization and cleanup
- Adapt mouse tracking to work within React lifecycle

### 3. Integration Points

- Replace orb creation section in useUltraterrestrialAnimation.tsx
- Maintain same timing in animation timeline (1-4s)
- Ensure proper cleanup when animation completes
- Integrate with existing GSAP timeline

## Implementation Steps

### Step 1: Create FluidShaderOrbs Component

```typescript
// Create new component file
// Convert Three.js vanilla code to React
// Handle WebGL context and Three.js scene setup
// Implement mouse tracking within React component
// Add visibility controls for animation timeline
```

### Step 2: Modify Animation Hook

```typescript
// In useUltraterrestrialAnimation.tsx
// Remove existing orb creation code (lines ~130-200)
// Add FluidShaderOrbs component integration
// Maintain same timing in GSAP timeline
// Add proper cleanup for WebGL context
```

### Step 3: Integration with GSAP Timeline

```typescript
// Timeline structure:
// 1-4s: Show fluid shader orbs
// 3s: Start fade out / convergence effect
// 4s: Hide orbs, continue with flash effect
```

## Technical Considerations

### WebGL Context Management

- Ensure proper WebGL context cleanup
- Handle WebGL context loss gracefully
- Optimize for performance on different devices

### Mouse Tracking

- Adapt mouse tracking to work within React component
- Handle touch events for mobile devices
- Ensure smooth performance during animation

### Shader Uniforms

- iTime: Animation time
- iMouse: Mouse position (0-1 normalized)
- iPrevMouse: Trail positions array
- iOpacity: Fade control for animation timeline

### Performance Optimization

- Dispose of Three.js objects properly
- Use requestAnimationFrame efficiently
- Minimize shader complexity for mobile devices

## File Structure

```
apps/app/src/
├── components/
│   └── animated/
│       └── FluidShaderOrbs.tsx (NEW)
├── hooks/
│   └── useUltraterrestrialAnimation.tsx (MODIFIED)
└── types/
    └── three-extensions.d.ts (NEW - if needed)
```

## Animation Timeline Integration

```typescript
// Current timeline (maintain timing):
// 0-2s: Flashes
// 1-4s: Orbs (REPLACE WITH FLUID SHADER)
// 3s: Orbs converge to center
// 4s: Big flash
// 4.5s: Earth appears
```

## Color Scheme Adaptation

- Original: Green theme (rgba(173,240,221,*))
- New: White metaballs with bloom effect
- Maintain visual consistency with rest of animation
- Ensure proper contrast against black background

## Error Handling

- WebGL not supported fallback
- Three.js loading errors
- Shader compilation errors
- Performance degradation detection

## Testing Strategy

- Test on various devices and browsers
- Verify WebGL compatibility
- Performance testing (FPS monitoring)
- Animation timing verification
- Mouse/touch interaction testing
