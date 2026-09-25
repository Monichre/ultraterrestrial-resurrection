# Home GSAP Animation System

> **2026-07-19:** Production `/` uses `HomeAnimated` + `useHomeHeroSequence` (see `ANIMATION_SEQUENCE.md`). This doc describes the parallel `HomeGSAP` / `useHomeAnimations` path kept for Storybook comparison.

## Overview

A sophisticated GSAP (GreenSock) animation system for the Ultraterrestrial home page featuring complex entrance sequences, continuous animations, and interactive parallax effects.

## Components

### 1. **home-gsap.tsx**

Main component that renders the animated home page layout with ref assignments for GSAP targeting.

### 2. **useHomeAnimations.ts**

Custom React hook that manages all GSAP animations using the `useGSAP` hook for proper cleanup.

### 3. **TitleAltGSAP.tsx**

Enhanced title component with individual letter spans for character-based animations.

## Animation Sequence

### Phase 1: Initial Setup (0ms)

- All elements start hidden with `opacity: 0` and `scale: 0.8`
- Moon positioned at `y: -200` with `rotation: -180`
- Earth scaled to `0` with `rotation: -90`
- Navigation at `y: -100`
- Title at `scale: 0.5` and `y: 50`

### Phase 2: Entrance Animations

1. **Stars Background** (0-2000ms)
   - Fades in with `opacity: 1` and `scale: 1`
   - Easing: `power2.inOut`

2. **Moon** (500-2500ms)
   - Slides down from top with elastic bounce
   - Rotates from -180° to 0°
   - Easing: `elastic.out(1, 0.5)`

3. **Earth** (700-3200ms)
   - Scales up from center with bounce effect
   - Includes dynamic glow effect during animation
   - Easing: `elastic.out(1, 0.3)`

4. **Cosmic Navigation** (1000-2000ms)
   - Slides down from top
   - Easing: `power3.out`

5. **Title Letters** (1500-3000ms)
   - Main title scales and fades in
   - Individual letters animate with:
     - 3D rotation from -90° to 0°
     - Staggered timing from center outward
     - Easing: `back.out(1.7)`

6. **UI Elements** (2500-4000ms)
   - Shooting stars and cursor fade in
   - Staggered by 200ms

### Phase 3: Continuous Animations

After the entrance sequence completes:

1. **Moon Float**
   - Gentle vertical float: `y: +=30px`
   - Subtle rotation: `rotation: +=10°`
   - Duration: 4s, infinite yoyo

2. **Earth Rotation**
   - Continuous 360° rotation
   - Duration: 120s per revolution

3. **Title Pulse**
   - Subtle scale pulse: 1.0 to 1.05
   - Duration: 3s, infinite yoyo

### Interactive Features

1. **Mouse Parallax**
   - Moon: 50px horizontal, 30px vertical movement
   - Stars: -20px horizontal, -15px vertical (inverse)
   - Title: 15px horizontal, 10px vertical
   - Smooth easing with `power2.out`

2. **Scroll Effects**
   - Earth scales up to 120% based on scroll position
   - Only active within first viewport height

## Usage

To use the animated version instead of the static one:

```tsx
// In your page component
import { HomeGSAP } from '@/layouts/home/home-gsap'

export default function Page() {
  return <HomeGSAP />
}
```

## Required Updates

To complete the implementation, update `home-gsap.tsx`:

```tsx
// Replace this import
import {TitleAlt} from '@/layouts/home/TitleAlt'

// With this
import {TitleAltGSAP} from '@/layouts/home/TitleAltGSAP'

// And update the usage
<TitleAltGSAP />
```

## Performance Considerations

- All animations use GPU-accelerated properties (transform, opacity)
- Dynamic imports for heavy components
- Proper cleanup on unmount
- Debounced mouse/scroll handlers
- `transform-gpu` class on animated elements

## Browser Support

- Requires browsers with ES6+ support
- WebGL support needed for Three.js components
- Tested on Chrome 90+, Firefox 88+, Safari 14+

## Dependencies

- `gsap`: ^3.12.0
- `@gsap/react`: ^2.0.0
- React 18+
- Next.js 13+

## Future Enhancements

1. Add ScrollTrigger for section-based animations
2. Implement sound effects synchronized with animations
3. Add particle effects during entrance
4. Create animation presets for different devices/performance levels
5. Add animation speed controls for accessibility
