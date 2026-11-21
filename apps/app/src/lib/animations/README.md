# GSAP Animation Library

A comprehensive, modular, and reusable GSAP animation system following SOLID principles.

## 📦 What's Included

### **Utility Functions** (`gsap-utils.ts`)

- Clip-path helpers for reveal animations
- Scramble text animation factory
- Staggered animation creators
- SplitText utilities
- Timeline management helpers

### **Custom Hooks**

- `useGSAPTimeline` - Manage GSAP timelines with React lifecycle
- `useProgressBar` - Animated progress bars synced with timelines
- `useScrambleText` - Scramble text effects on elements
- `useSplitTextHover` - Hover animations for split text

### **Components**

- `TerminalPreloader` - Animated terminal-style preloader
- `AnimatedMenu` - Full-screen animated menu with clip-path reveals

---

## 📚 Storybook

**Interactive examples and documentation available in Storybook!**

```bash
# Run Storybook
npm run storybook
# or
bun run storybook

# Opens at http://localhost:6006
```

**Explore:**

- 📖 [Introduction & Overview](/story/animations-introduction)
- 🎨 All components with live demos
- ⚡ Interactive controls
- 📝 Copy-paste ready code
- 🎯 Real-world examples

See [STORYBOOK_EXAMPLES.md](./STORYBOOK_EXAMPLES.md) for a complete guide.

---

## 🚀 Quick Start

### Basic Scramble Text Animation

```tsx
import { useScrambleText } from '@/lib/animations/hooks';

function MyComponent() {
  const { textRef, scramble, glitch } = useScrambleText({
    autoStore: true
  });

  return (
    <span 
      ref={textRef}
      onClick={() => scramble('New Text!')}
      onMouseEnter={() => glitch()}
    >
      Original Text
    </span>
  );
}
```

### Terminal Preloader

```tsx
import { TerminalPreloader } from '@/components/animations';

function App() {
  const lines = [
    {
      id: '1',
      content: '[SYSTEM] Initializing...',
      scramble: true,
      top: '30%'
    },
    {
      id: '2',
      content: '[STATUS] Loading resources...',
      scramble: true,
      top: '50%'
    }
  ];

  return (
    <TerminalPreloader
      lines={lines}
      duration={5}
      showProgress
      onComplete={() => console.log('Preloader complete!')}
    >
      <YourAppContent />
    </TerminalPreloader>
  );
}
```

### Animated Menu

```tsx
import { AnimatedMenu } from '@/components/animations';

function Navigation() {
  const menuItems = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' },
    { id: '3', label: 'Contact', href: '/contact' }
  ];

  return (
    <AnimatedMenu
      items={menuItems}
      featuredImage="/images/bg.jpg"
      brandLogo={<Logo />}
      onItemClick={(item) => console.log('Clicked:', item.label)}
    />
  );
}
```

### Split Text Hover

```tsx
import { useSplitTextHover } from '@/lib/animations/hooks';

function NavLink({ href, children }) {
  const { textRef } = useSplitTextHover({
    xOffset: 0.5,
    stagger: 0.015
  });

  return (
    <a href={href} ref={textRef}>
      {children}
    </a>
  );
}
```

### Custom Timeline

```tsx
import { useGSAPTimeline } from '@/lib/animations/hooks';
import { useEffect } from 'react';

function AnimatedComponent() {
  const { timeline, play } = useGSAPTimeline({
    paused: true,
    onComplete: () => console.log('Animation complete')
  });

  useEffect(() => {
    if (timeline) {
      timeline
        .to('.element', { x: 100, duration: 1 })
        .to('.element', { y: 50, duration: 0.5 })
        .to('.element', { rotation: 360, duration: 1 });
      
      play();
    }
  }, [timeline, play]);

  return <div className="element">Animate Me</div>;
}
```

---

## 🎯 API Reference

### Hooks

#### `useGSAPTimeline(config)`

Manages a GSAP timeline with React lifecycle.

**Config:**

- `paused?: boolean` - Start paused (default: true)
- `autoRemoveChildren?: boolean` - Auto-remove completed tweens (default: true)
- `onComplete?: () => void` - Callback when timeline completes
- `onStart?: () => void` - Callback when timeline starts
- `onUpdate?: () => void` - Callback on each frame update

**Returns:**

- `timeline: Timeline | null` - GSAP timeline instance
- `play: () => void` - Play the timeline
- `pause: () => void` - Pause the timeline
- `restart: () => void` - Restart from beginning
- `reverse: () => void` - Reverse playback
- `seek: (time) => void` - Jump to specific time
- `progress: (value?) => number` - Get/set progress (0-1)
- `isActive: () => boolean` - Check if timeline is running
- `kill: () => void` - Kill the timeline

---

#### `useScrambleText(config)`

Creates scramble text animations.

**Config:**

- `scrambleChars?: string` - Characters for scrambling (default: '▪')
- `duration?: number` - Animation duration (default: 0.8)
- `autoStore?: boolean` - Auto-store original text (default: true)

**Returns:**

- `textRef: RefObject<HTMLElement>` - Ref to attach to element
- `scramble: (text, config?) => Tween` - Scramble to new text
- `glitch: (duration?) => Tween` - Quick glitch effect
- `reveal: (config?) => Tween` - Reveal original text
- `storeOriginalText: () => void` - Store current text
- `getOriginalText: () => string` - Get stored text
- `clear: () => void` - Clear text content

---

#### `useProgressBar(config)`

Manages animated progress bar.

**Config:**

- `timeline?: Timeline` - Timeline to sync with
- `onUpdate?: (progress) => void` - Progress update callback
- `transitionDuration?: number` - Transition duration (default: 0.3)

**Returns:**

- `progress: number` - Current progress (0-100)
- `setProgress: (value) => void` - Set progress directly
- `animateProgress: (value, duration?) => void` - Animate to value
- `reset: () => void` - Reset to 0
- `progressRef: RefObject<HTMLDivElement>` - Ref for progress element

---

#### `useSplitTextHover(config)`

Creates hover animations for split text.

**Config:**

- `splitType?: 'chars' | 'words' | 'lines'` - Split type (default: 'chars')
- `xOffset?: number` - X offset for hover (default: 0.5)
- `duration?: number` - Animation duration (default: 0.64)
- `stagger?: number` - Stagger delay (default: 0.015)
- `enabled?: boolean` - Enable/disable effect (default: true)

**Returns:**

- `textRef: RefObject<HTMLElement>` - Ref to attach to element
- `splitText: SplitText | null` - SplitText instance
- `triggerEnter: () => void` - Manually trigger enter animation
- `triggerLeave: () => void` - Manually trigger leave animation
- `revert: () => void` - Revert split and cleanup

---

### Components

#### `<TerminalPreloader />`

Animated terminal-style preloader.

**Props:**

- `lines?: TerminalLine[]` - Terminal lines to display
- `duration?: number` - Total animation duration (default: 6)
- `glitchCount?: number` - Number of glitch effects (default: 3)
- `showProgress?: boolean` - Show progress bar (default: true)
- `scrambleChars?: string` - Scramble characters (default: '▪')
- `onComplete?: () => void` - Completion callback
- `autoStart?: boolean` - Auto-start on mount (default: true)
- `className?: string` - Custom className
- `style?: CSSProperties` - Custom styles
- `children?: ReactNode` - Content to show after preloader

**TerminalLine:**

```typescript
{
  id: string;
  content: string | ReactNode;
  scramble?: boolean;
  opacity?: number;
  top?: string;
}
```

---

#### `<AnimatedMenu />`

Full-screen animated menu.

**Props:**

- `items?: MenuItem[]` - Menu items
- `featuredImage?: string` - Featured image URL
- `brandLogo?: ReactNode` - Brand logo
- `footer?: ReactNode` - Footer content
- `menuButtonLabel?: string` - Menu button text (default: 'Menu')
- `closeButtonLabel?: string` - Close button text (default: 'Close')
- `duration?: number` - Animation duration (default: 0.64)
- `stagger?: number` - Stagger delay (default: 0.075)
- `onOpen?: () => void` - Open callback
- `onClose?: () => void` - Close callback
- `onItemClick?: (item) => void` - Item click callback
- `className?: string` - Custom className
- `children?: ReactNode` - Primary navigation content

**MenuItem:**

```typescript
{
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}
```

---

### Utility Functions

#### Clip Paths

```typescript
import { clipPaths } from '@/lib/animations/gsap-utils';

// Dynamic clip paths
clipPaths.bottomToTop(0.5); // 50% visible from bottom
clipPaths.topToBottom(0.75); // 75% visible from top

// Presets
clipPaths.presets.hidden;
clipPaths.presets.visible;
clipPaths.presets.hiddenTop;
```

#### Animation Factories

```typescript
import {
  createScrambleTextAnim,
  createClipPathReveal,
  createStaggeredFadeOut,
  createStaggeredSlide,
} from '@/lib/animations/gsap-utils';

// Scramble text animation
const scrambleAnim = createScrambleTextAnim({
  text: 'Hello World',
  chars: '▪',
  speed: 0.3
});

// Clip path reveal
const reveal = createClipPathReveal('.element', {
  duration: 0.64,
  direction: 'bottom'
});

// Staggered fade out
const fadeOut = createStaggeredFadeOut(elements, 0.1);

// Staggered slide
const slide = createStaggeredSlide(elements, {
  y: '-100%',
  duration: 0.64,
  stagger: 0.075
});
```

#### SplitText Utilities

```typescript
import {
  createSplitText,
  createSplitTextHover,
} from '@/lib/animations/gsap-utils';

// Create split text
const split = createSplitText('.text', 'chars');

// Create hover handlers
const { onEnter, onLeave } = createSplitTextHover(split, {
  xOffset: 0.5,
  stagger: 0.015
});

element.addEventListener('mouseenter', onEnter);
element.addEventListener('mouseleave', onLeave);
```

---

## 🎨 Examples

### Advanced Terminal Preloader

```tsx
import { TerminalPreloader } from '@/components/animations';

const lines = [
  {
    id: 'init',
    content: '[SYSTEM] Initializing core systems...',
    scramble: true,
    opacity: 1,
    top: '20%'
  },
  {
    id: 'auth',
    content: '[AUTH] Verifying credentials...',
    scramble: true,
    opacity: 0.8,
    top: '30%'
  },
  {
    id: 'data',
    content: '[DATABASE] Loading data records...',
    scramble: true,
    opacity: 0.9,
    top: '40%'
  },
  {
    id: 'ready',
    content: '[STATUS] System ready',
    scramble: true,
    opacity: 1,
    top: '60%'
  }
];

<TerminalPreloader
  lines={lines}
  duration={8}
  glitchCount={5}
  showProgress
  scrambleChars="01▪█"
  onComplete={() => {
    console.log('System initialized');
  }}
  style={{
    backgroundColor: '#0a0a0a',
    fontFamily: '"Fira Code", monospace'
  }}
>
  <MainApp />
</TerminalPreloader>
```

### Complex Menu with Custom Footer

```tsx
import { AnimatedMenu } from '@/components/animations';

const menuItems = [
  { id: '1', label: 'Discover', href: '/discover' },
  { id: '2', label: 'Research', href: '/research' },
  { id: '3', label: 'Timeline', href: '/timeline' },
  { id: '4', label: 'Contact', href: '/contact' }
];

const footer = (
  <div className="flex gap-4">
    <a href="/twitter">Twitter</a>
    <a href="/github">GitHub</a>
    <span>© 2025</span>
  </div>
);

<AnimatedMenu
  items={menuItems}
  featuredImage="/images/hero.jpg"
  brandLogo={<Logo />}
  footer={footer}
  duration={0.8}
  stagger={0.1}
  onItemClick={(item) => {
    analytics.track('menu_click', { item: item.label });
  }}
  className="custom-menu"
/>
```

### Multi-Stage Animation

```tsx
import { useGSAPTimeline } from '@/lib/animations/hooks';
import { useEffect } from 'react';

function MultiStageAnimation() {
  const { timeline, play } = useGSAPTimeline({
    paused: true,
    onComplete: () => console.log('All stages complete')
  });

  useEffect(() => {
    if (!timeline) return;

    // Stage 1: Fade in
    timeline.to('.stage-1', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    });

    // Stage 2: Slide in (0.5s after stage 1 starts)
    timeline.to('.stage-2', {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'cubic-bezier(0.65,0.05,0.36,1)'
    }, '-=0.5');

    // Stage 3: Scale up
    timeline.to('.stage-3', {
      scale: 1,
      opacity: 1,
      duration: 0.6
    });

    // Stage 4: Staggered children
    timeline.to('.stage-4 .child', {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.5
    });

    play();
  }, [timeline, play]);

  return (
    <div>
      <div className="stage-1" style={{ opacity: 0 }}>Stage 1</div>
      <div className="stage-2" style={{ opacity: 0, x: -100 }}>Stage 2</div>
      <div className="stage-3" style={{ opacity: 0, scale: 0 }}>Stage 3</div>
      <div className="stage-4">
        <div className="child" style={{ opacity: 0, y: 20 }}>Child 1</div>
        <div className="child" style={{ opacity: 0, y: 20 }}>Child 2</div>
        <div className="child" style={{ opacity: 0, y: 20 }}>Child 3</div>
      </div>
    </div>
  );
}
```

---

## 🏗️ Architecture

This library follows **SOLID principles**:

- **Single Responsibility**: Each function/hook/component has one clear purpose
- **Open/Closed**: Extensible through configuration, closed for modification
- **Liskov Substitution**: All utilities and hooks are interchangeable
- **Interface Segregation**: Focused, minimal interfaces
- **Dependency Inversion**: Depend on abstractions (GSAP), not implementations

### File Structure

```
src/lib/animations/
├── gsap-utils.ts              # Core utilities and factories
├── hooks/
│   ├── use-gsap-timeline.ts   # Timeline management
│   ├── use-progress-bar.ts    # Progress bar animations
│   ├── use-scramble-text.ts   # Scramble text effects
│   ├── use-split-text-hover.ts # Split text hover
│   └── index.ts               # Hook exports
└── index.ts                   # Main exports

src/components/animations/
├── terminal-preloader.tsx     # Terminal preloader component
├── animated-menu.tsx          # Animated menu component
└── index.ts                   # Component exports
```

---

## 🧪 Testing

```typescript
import { renderHook } from '@testing-library/react';
import { useScrambleText } from '@/lib/animations/hooks';

test('scramble text hook', () => {
  const { result } = renderHook(() => useScrambleText());
  
  expect(result.current.textRef.current).toBeNull();
  // Add more tests...
});
```

---

## 📝 Best Practices

1. **Always cleanup**: Hooks automatically cleanup timelines on unmount
2. **Use refs properly**: Attach refs before calling animation methods
3. **Sync with timeline**: Use `useProgressBar` with `timeline` prop for sync
4. **Store original text**: Enable `autoStore` for scramble effects
5. **Configure durations**: Match durations across related animations
6. **Handle async**: Wait for refs to be attached before animating

---

## 🔧 Troubleshooting

**Animation not playing?**

- Check if timeline is paused: `timeline.paused()`
- Ensure refs are attached before animating
- Verify GSAP plugins are registered

**Scramble text not working?**

- Confirm `data-scramble="true"` attribute is set
- Check if original text is stored
- Verify ScrambleTextPlugin is installed

**Progress bar not syncing?**

- Pass `timeline` prop to `useProgressBar`
- Check timeline has `onUpdate` callback available

---

## 📚 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [SplitText Plugin](https://greensock.com/docs/v3/Plugins/SplitText)
- [ScrambleText Plugin](https://greensock.com/docs/v3/Plugins/ScrambleTextPlugin)

---

*Last updated: 2025-10-03*
