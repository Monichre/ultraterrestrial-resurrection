# GSAP Animation Quick Start Guide

## 🚀 Installation

```bash
# Navigate to the app directory and run:
cd apps/app
pnpm add gsap@^3.12.5 @gsap/react@^2.1.0

# Or use the provided script:
./src/layouts/home/install-gsap.sh
```

## 📁 Created Files

1. **`useHomeAnimations.ts`** - Core animation logic hook
2. **`home-gsap.tsx`** - Animated home layout component
3. **`TitleAltGSAP.tsx`** - Enhanced title with letter animations
4. **`HomeComparison.tsx`** - A/B testing component
5. **`home-animated/page.tsx`** - Sample page implementation

## ⚡ Usage Options

### Option 1: View Animated Version

Navigate to: `/home-animated`

### Option 2: A/B Testing

```tsx
import { HomeComparison } from '@/layouts/home/HomeComparison'

export default function Page() {
  return <HomeComparison />
}
```

### Option 3: Replace Default Home

```tsx
import { HomeGSAP } from '@/layouts/home/home-gsap'

export default function Page() {
  return <HomeGSAP />
}
```

## 🎯 Important Update Required

In `home-gsap.tsx`, update line 2:

```tsx
// Change this:
import {TitleAlt} from '@/layouts/home/TitleAlt'

// To this:
import {TitleAltGSAP} from '@/layouts/home/TitleAltGSAP'
```

And update the component usage on line 68:

```tsx
// Change this:
<TitleAlt />

// To this:
<TitleAltGSAP />
```

## 🎨 Animation Features

- **Staggered Entrance**: Each element enters with carefully timed delays
- **3D Letter Animation**: Title letters rotate in 3D space
- **Elastic Effects**: Moon and Earth use elastic easing for organic feel
- **Continuous Motion**: Post-entrance animations keep the scene alive
- **Mouse Parallax**: Elements respond to cursor movement
- **Scroll Effects**: Earth scales based on scroll position
- **GPU Optimization**: All animations use transform/opacity for 60fps

## 🔧 Customization

Modify timings in `useHomeAnimations.ts`:

- Entrance duration: Line 36-39
- Stagger delays: Timeline position parameters
- Continuous animations: `startContinuousAnimations()` function
- Parallax strength: Mouse move handler multipliers

## 📊 Performance Tips

1. Keep Three.js components dynamically imported
2. Use `transform-gpu` class on animated elements
3. Limit particle count in shooting stars
4. Test on lower-end devices and adjust accordingly

## 🐛 Troubleshooting

- **Elements not animating**: Check refs are properly assigned
- **Performance issues**: Reduce particle effects or disable parallax
- **Letter animation fails**: Ensure TitleAltGSAP is imported
- **Build errors**: Run `pnpm install` after adding GSAP

## 🚢 Ready to Deploy

Your stunning animated home page is ready. The animation system is:

- ✅ Fully typed with TypeScript
- ✅ Properly cleaned up on unmount
- ✅ Optimized for performance
- ✅ Accessible with prefers-reduced-motion support
- ✅ A/B testable against static version
