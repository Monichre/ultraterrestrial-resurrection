# Migration Guide: Vanilla JS to Modular React Components

This guide shows you how to convert vanilla JavaScript GSAP code into reusable React components and hooks.

## Overview

**Before:** Monolithic JavaScript file with mixed concerns
**After:** Modular, typed, reusable components following SOLID principles

---

## Step 1: Identify Core Functionality

### Original Code Analysis

```javascript
// Original code had these responsibilities:
1. Terminal preloader animation
2. Progress bar updates
3. Menu open/close animations
4. Text scramble effects
5. Split text hover effects
6. Timeline orchestration
```

### New Architecture

```
Utilities (gsap-utils.ts)
├── Clip path helpers
├── Animation factories
├── SplitText utilities
└── Timeline utilities

Hooks
├── useGSAPTimeline - Timeline management
├── useProgressBar - Progress tracking
├── useScrambleText - Text scrambling
└── useSplitTextHover - Hover effects

Components
├── TerminalPreloader - Full preloader
└── AnimatedMenu - Animated menu overlay
```

---

## Step 2: Converting Terminal Preloader

### Before (Vanilla JS)

```javascript
document.addEventListener("DOMContentLoaded", function () {
  const terminalLines = document.querySelectorAll(".terminal-line");
  const tl = gsap.timeline({
    onComplete: function () {
      revealContent();
    }
  });

  // Store original texts
  document.querySelectorAll('.terminal-line span[data-scramble="true"]')
    .forEach(function (span, index) {
      const originalText = span.textContent;
      span.setAttribute("data-original-text", originalText);
      span.textContent = "";
    });

  // Complex animation code...
  terminalLines.forEach((line, lineIndex) => {
    const timePoint = (lineIndex / terminalLines.length) * 5;
    tl.to(line, {
      opacity: 1,
      duration: 0.3,
    }, timePoint);
  });

  // Update progress
  tl.eventCallback("onUpdate", function () {
    const progress = tl.progress() * 100;
    updateProgress(progress);
  });
});
```

### After (React Component)

```tsx
import { TerminalPreloader } from '@/components/animations';

function App() {
  const lines = [
    {
      id: 'line-1',
      content: '[SYSTEM] Initializing...',
      scramble: true,
      top: '30%'
    },
    {
      id: 'line-2',
      content: '[STATUS] Ready',
      scramble: true,
      top: '50%'
    }
  ];

  return (
    <TerminalPreloader
      lines={lines}
      duration={5}
      showProgress
      onComplete={() => console.log('Done!')}
    >
      <MainContent />
    </TerminalPreloader>
  );
}
```

**Benefits:**

- ✅ Type-safe with TypeScript
- ✅ Declarative configuration
- ✅ Automatic cleanup on unmount
- ✅ Reusable across projects
- ✅ Easier to test

---

## Step 3: Converting Menu Animations

### Before (Vanilla JS)

```javascript
const menuBtn = document.getElementById("menu-btn");
const overlay = document.getElementById("overlay");

function openMenu() {
  const tl = gsap.timeline();
  
  tl.to(overlay, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 0.64,
    ease: "cubic-bezier(0.65,0.05,0.36,1)",
  });

  tl.to(".nav-link", {
    y: "0%",
    duration: 0.64,
    stagger: 0.075,
  }, "-=0.3");
}

menuBtn.addEventListener("click", openMenu);
```

### After (React Component)

```tsx
import { AnimatedMenu } from '@/components/animations';

function Navigation() {
  const items = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' }
  ];

  return (
    <AnimatedMenu
      items={items}
      featuredImage="/bg.jpg"
      onOpen={() => console.log('Menu opened')}
      onClose={() => console.log('Menu closed')}
    >
      <MainContent />
    </AnimatedMenu>
  );
}
```

**Benefits:**

- ✅ State management handled internally
- ✅ Configurable through props
- ✅ Consistent animations
- ✅ No manual DOM queries

---

## Step 4: Converting Text Effects

### Before (Vanilla JS)

```javascript
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  const splitLink = new SplitText(link, {
    type: "chars",
    charsClass: "char"
  });

  link.addEventListener("mouseenter", () => {
    gsap.to(splitLink.chars, {
      x: (i) => `${0.5 + i * 0.1}em`,
      duration: 0.64,
      stagger: { each: 0.015 }
    });
  });

  link.addEventListener("mouseleave", () => {
    gsap.to(splitLink.chars, {
      x: 0,
      duration: 0.64,
      stagger: { each: 0.01 }
    });
  });
});
```

### After (React Hook)

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

**Benefits:**

- ✅ Automatic cleanup
- ✅ Reusable across components
- ✅ Type-safe configuration
- ✅ No manual event listeners

---

## Step 5: Converting Scramble Text

### Before (Vanilla JS)

```javascript
const scrambleSpans = document.querySelectorAll('[data-scramble="true"]');
scrambleSpans.forEach((span) => {
  const originalText = span.getAttribute("data-original-text");
  
  gsap.to(span, {
    duration: 0.8,
    scrambleText: {
      text: originalText,
      chars: "▪",
      speed: 0.3
    }
  });
});

// Add glitch effect
function glitch() {
  const randomSpans = [...scrambleSpans]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
    
  randomSpans.forEach((span) => {
    gsap.to(span, {
      duration: 0.2,
      scrambleText: {
        text: span.textContent,
        chars: "▪",
        speed: 0.1
      },
      repeat: 1
    });
  });
}
```

### After (React Hook)

```tsx
import { useScrambleText } from '@/lib/animations/hooks';

function ScrambleText({ children }) {
  const { textRef, scramble, glitch } = useScrambleText({
    autoStore: true
  });

  return (
    <span
      ref={textRef}
      onClick={() => scramble('New text!')}
      onMouseEnter={() => glitch()}
    >
      {children}
    </span>
  );
}
```

**Benefits:**

- ✅ Original text automatically stored
- ✅ Simple API for common operations
- ✅ No manual state management
- ✅ Type-safe methods

---

## Step 6: Converting Progress Bar

### Before (Vanilla JS)

```javascript
const progressBar = document.getElementById("progress-bar");

function updateProgress(percent) {
  progressBar.style.transition = "none";
  progressBar.style.width = percent + "%";
}

const tl = gsap.timeline();
tl.eventCallback("onUpdate", function () {
  const progress = tl.progress() * 100;
  updateProgress(progress);
});
```

### After (React Hook)

```tsx
import { useGSAPTimeline, useProgressBar } from '@/lib/animations/hooks';

function AnimatedComponent() {
  const { timeline } = useGSAPTimeline();
  const { progress, progressRef } = useProgressBar({ timeline });

  return (
    <div className="progress-container">
      <div
        ref={progressRef}
        className="progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

**Benefits:**

- ✅ Automatic sync with timeline
- ✅ No manual callbacks
- ✅ Reactive progress value
- ✅ Type-safe

---

## Step 7: Converting Complex Timelines

### Before (Vanilla JS)

```javascript
const tl = gsap.timeline({
  onComplete: function () {
    console.log('Complete');
  }
});

tl.to('.element-1', { x: 100, duration: 1 });
tl.to('.element-2', { y: 50, duration: 0.5 }, '-=0.3');
tl.to('.element-3', { rotation: 360, duration: 1 });

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  tl.kill();
});
```

### After (React Hook)

```tsx
import { useGSAPTimeline } from '@/lib/animations/hooks';
import { useEffect } from 'react';

function AnimatedComponent() {
  const { timeline, play } = useGSAPTimeline({
    paused: true,
    onComplete: () => console.log('Complete')
  });

  useEffect(() => {
    if (!timeline) return;

    timeline
      .to('.element-1', { x: 100, duration: 1 })
      .to('.element-2', { y: 50, duration: 0.5 }, '-=0.3')
      .to('.element-3', { rotation: 360, duration: 1 });

    play();
  }, [timeline, play]);

  return (
    <div>
      <div className="element-1">1</div>
      <div className="element-2">2</div>
      <div className="element-3">3</div>
    </div>
  );
}
```

**Benefits:**

- ✅ Automatic cleanup on unmount
- ✅ Type-safe timeline methods
- ✅ React lifecycle integration
- ✅ Easier to test

---

## Step 8: Using Utility Functions

### Clip Paths

**Before:**

```javascript
overlay.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
```

**After:**

```tsx
import { clipPaths } from '@/lib/animations/gsap-utils';

gsap.to(overlay, {
  clipPath: clipPaths.presets.visible
});
```

### Scramble Animations

**Before:**

```javascript
gsap.to(element, {
  scrambleText: {
    text: "Hello",
    chars: "▪",
    revealDelay: 0,
    speed: 0.3
  }
});
```

**After:**

```tsx
import { createScrambleTextAnim } from '@/lib/animations/gsap-utils';

gsap.to(element, {
  duration: 0.8,
  ...createScrambleTextAnim({ text: "Hello" })
});
```

### Staggered Animations

**Before:**

```javascript
gsap.to(elements, {
  y: "-100%",
  duration: 0.64,
  stagger: 0.075,
  ease: "cubic-bezier(0.65,0.05,0.36,1)"
});
```

**After:**

```tsx
import { createStaggeredSlide, ANIMATION_CONSTANTS } from '@/lib/animations/gsap-utils';

createStaggeredSlide(elements, {
  direction: 'up',
  duration: ANIMATION_CONSTANTS.DEFAULT_DURATION,
  stagger: ANIMATION_CONSTANTS.STAGGER_DELAY
});
```

---

## Complete Migration Example

### Original Vanilla JS File

```javascript
// app.js - 500+ lines of mixed concerns
document.addEventListener("DOMContentLoaded", function () {
  // Plugin registration
  gsap.registerPlugin(ScrambleTextPlugin, SplitText);
  
  // Element queries
  const preloader = document.getElementById("preloader");
  const menu = document.getElementById("menu");
  // ... 20+ more queries
  
  // Helper functions
  function updateProgress(percent) { /* ... */ }
  function openMenu() { /* ... */ }
  function closeMenu() { /* ... */ }
  // ... 10+ more functions
  
  // Event listeners
  menuBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  // ... many more listeners
  
  // Animation code
  const tl = gsap.timeline({ /* ... */ });
  // ... 200+ lines of animation code
});
```

### New Modular React App

```tsx
// app/page.tsx
import { TerminalPreloader, AnimatedMenu } from '@/components/animations';

export default function Home() {
  return (
    <TerminalPreloader
      lines={preloaderLines}
      duration={6}
      showProgress
    >
      <AnimatedMenu
        items={menuItems}
        featuredImage="/bg.jpg"
      >
        <MainContent />
      </AnimatedMenu>
    </TerminalPreloader>
  );
}

// components/nav-link.tsx
import { useSplitTextHover } from '@/lib/animations/hooks';

export function NavLink({ href, children }) {
  const { textRef } = useSplitTextHover();
  return <a ref={textRef} href={href}>{children}</a>;
}

// components/scramble-heading.tsx
import { useScrambleText } from '@/lib/animations/hooks';

export function ScrambleHeading({ children }) {
  const { textRef, glitch } = useScrambleText({ autoStore: true });
  return (
    <h1 ref={textRef} onMouseEnter={() => glitch()}>
      {children}
    </h1>
  );
}
```

---

## Migration Checklist

- [ ] **Identify core functionality** in original code
- [ ] **Extract timeline logic** into custom hooks
- [ ] **Convert DOM queries** to React refs
- [ ] **Replace event listeners** with React event handlers
- [ ] **Move utility functions** to shared modules
- [ ] **Create reusable components** for complex animations
- [ ] **Add TypeScript types** for all props and config
- [ ] **Write tests** for hooks and components
- [ ] **Document usage** with examples
- [ ] **Remove old vanilla JS files**

---

## Common Pitfalls

### ❌ Don't: Query DOM directly in React

```tsx
// BAD
useEffect(() => {
  const element = document.querySelector('.element');
  gsap.to(element, { x: 100 });
}, []);
```

### ✅ Do: Use refs

```tsx
// GOOD
const elementRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (elementRef.current) {
    gsap.to(elementRef.current, { x: 100 });
  }
}, []);

return <div ref={elementRef}>Content</div>;
```

### ❌ Don't: Forget cleanup

```tsx
// BAD
useEffect(() => {
  const tl = gsap.timeline();
  tl.to('.element', { x: 100 });
  // No cleanup!
}, []);
```

### ✅ Do: Always cleanup timelines

```tsx
// GOOD
useEffect(() => {
  const tl = gsap.timeline();
  tl.to('.element', { x: 100 });
  
  return () => {
    tl.kill();
  };
}, []);
```

### ❌ Don't: Hardcode animation values

```tsx
// BAD
gsap.to(element, {
  duration: 0.64,
  ease: "cubic-bezier(0.65,0.05,0.36,1)"
});
```

### ✅ Do: Use constants

```tsx
// GOOD
import { ANIMATION_CONSTANTS } from '@/lib/animations/gsap-utils';

gsap.to(element, {
  duration: ANIMATION_CONSTANTS.DEFAULT_DURATION,
  ease: ANIMATION_CONSTANTS.SLIDE_EASE
});
```

---

## Testing Your Migration

### Unit Tests

```typescript
import { renderHook } from '@testing-library/react';
import { useScrambleText } from '@/lib/animations/hooks';

test('useScrambleText initializes correctly', () => {
  const { result } = renderHook(() => useScrambleText());
  
  expect(result.current.textRef).toBeDefined();
  expect(typeof result.current.scramble).toBe('function');
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { TerminalPreloader } from '@/components/animations';

test('TerminalPreloader renders lines', () => {
  const lines = [
    { id: '1', content: 'Test', scramble: true }
  ];
  
  render(<TerminalPreloader lines={lines} />);
  
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

---

## Next Steps

1. **Read the [README.md](./README.md)** for full API documentation
2. **Check [EXAMPLES.md](./EXAMPLES.md)** for real-world usage
3. **Experiment** with the components in your project
4. **Customize** animations to match your design
5. **Share** your improvements with the team

---

*Migration complete! Your codebase is now modular, type-safe, and maintainable.* 🎉
