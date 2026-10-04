# GSAP Animation Library - Quick Reference

Quick lookup guide for common tasks.

## 🎯 Common Tasks

### Task: Create a Loading Screen

```tsx
import { TerminalPreloader } from '@/components/animations';

<TerminalPreloader
  lines={[
    { id: '1', content: 'Loading...', scramble: true, top: '50%' }
  ]}
  duration={5}
  showProgress
  onComplete={() => console.log('Done')}
>
  <YourApp />
</TerminalPreloader>
```

---

### Task: Add Scramble Effect to Text

```tsx
import { useScrambleText } from '@/lib/animations/hooks';

const { textRef, scramble } = useScrambleText({ autoStore: true });

<span ref={textRef} onClick={() => scramble('New Text')}>
  Original Text
</span>
```

---

### Task: Create Hover Animation

```tsx
import { useSplitTextHover } from '@/lib/animations/hooks';

const { textRef } = useSplitTextHover();

<a href="#" ref={textRef}>Hover Me</a>
```

---

### Task: Build Animated Menu

```tsx
import { AnimatedMenu } from '@/components/animations';

<AnimatedMenu
  items={[
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' }
  ]}
  featuredImage="/bg.jpg"
/>
```

---

### Task: Create Custom Timeline

```tsx
import { useGSAPTimeline } from '@/lib/animations/hooks';

const { timeline, play } = useGSAPTimeline({ paused: true });

useEffect(() => {
  if (!timeline) return;
  timeline.to('.element', { x: 100 });
  play();
}, [timeline, play]);
```

---

### Task: Track Progress

```tsx
import { useProgressBar } from '@/lib/animations/hooks';

const { progress, progressRef } = useProgressBar({ timeline });

<div ref={progressRef} style={{ width: `${progress}%` }} />
```

---

### Task: Glitch Text Effect

```tsx
import { useScrambleText } from '@/lib/animations/hooks';

const { textRef, glitch } = useScrambleText({ autoStore: true });

<span ref={textRef} onMouseEnter={() => glitch()}>
  Text
</span>
```

---

### Task: Staggered Fade In

```tsx
import { useGSAPTimeline } from '@/lib/animations/hooks';

const { timeline } = useGSAPTimeline();

useEffect(() => {
  if (!timeline) return;
  
  timeline.fromTo(
    '.item',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.1 }
  );
}, [timeline]);
```

---

### Task: Clip Path Reveal

```tsx
import { clipPaths } from '@/lib/animations/gsap-utils';

gsap.to('.overlay', {
  clipPath: clipPaths.presets.visible,
  duration: 0.64
});
```

---

## 📚 Import Cheatsheet

```tsx
// Components
import { TerminalPreloader, AnimatedMenu } from '@/components/animations';

// Hooks
import {
  useGSAPTimeline,
  useProgressBar,
  useScrambleText,
  useSplitTextHover,
} from '@/lib/animations/hooks';

// Utilities
import {
  clipPaths,
  createScrambleTextAnim,
  createStaggeredSlide,
  ANIMATION_CONSTANTS,
} from '@/lib/animations/gsap-utils';
```

---

## 🎨 Constants

```tsx
import { ANIMATION_CONSTANTS } from '@/lib/animations/gsap-utils';

ANIMATION_CONSTANTS.SLIDE_EASE;        // 'cubic-bezier(0.65,0.05,0.36,1)'
ANIMATION_CONSTANTS.SPECIAL_CHARS;     // '▪'
ANIMATION_CONSTANTS.DEFAULT_DURATION;  // 0.64
ANIMATION_CONSTANTS.STAGGER_DELAY;     // 0.075
```

---

## 🔧 Common Patterns

### Pattern: Multi-Stage Animation

```tsx
const { timeline } = useGSAPTimeline();

useEffect(() => {
  timeline
    .to('.stage-1', { opacity: 1 })
    .to('.stage-2', { x: 0 }, '-=0.3')
    .to('.stage-3', { scale: 1 });
}, [timeline]);
```

### Pattern: Conditional Animation

```tsx
const { timeline } = useGSAPTimeline();

useEffect(() => {
  if (condition) {
    timeline.to('.element', { x: 100 });
  } else {
    timeline.to('.element', { x: -100 });
  }
}, [timeline, condition]);
```

### Pattern: Sequential Scrambles

```tsx
const line1 = useScrambleText();
const line2 = useScrambleText();

timeline
  .call(() => line1.reveal())
  .call(() => line2.reveal(), [], '+=0.5');
```

---

## ⚡ Performance Tips

1. **Use paused timelines**: Start with `paused: true`
2. **Batch DOM reads/writes**: Group GSAP operations
3. **Use will-change**: Add CSS hint for animated properties
4. **Lazy load**: Only import what you need
5. **Cleanup**: Let hooks handle cleanup automatically

---

## 🐛 Debugging

### Timeline not playing?

```tsx
const { timeline, play } = useGSAPTimeline({ paused: true });
console.log('Timeline active?', timeline?.isActive());
play(); // Don't forget to call play()!
```

### Ref not attaching?

```tsx
useEffect(() => {
  console.log('Ref attached?', textRef.current);
}, [textRef]);
```

### Animation looks wrong?

```tsx
// Check GSAP's current values
console.log(gsap.getProperty('.element', 'x'));
console.log(gsap.getProperty('.element', 'opacity'));
```

---

## 📖 More Resources

- Full API: [README.md](./README.md)
- Examples: [EXAMPLES.md](./EXAMPLES.md)
- Migration: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- GSAP Docs: <https://greensock.com/docs/>

---

*Last updated: 2025-10-03*
