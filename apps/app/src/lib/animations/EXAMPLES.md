# GSAP Animation Library - Usage Examples

Complete code examples showing how to use the animation library in real-world scenarios.

---

## Example 1: Converting Original Code to Modular Components

### Original Code (Vanilla JS)

```javascript
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrambleTextPlugin, SplitText);
  
  const terminalLines = document.querySelectorAll(".terminal-line");
  const tl = gsap.timeline({
    onComplete: function () {
      revealContent();
    }
  });
  
  // Complex animation code...
});
```

### New Modular Approach (React + TypeScript)

```tsx
import { TerminalPreloader } from '@/components/animations';

export default function App() {
  const lines = [
    {
      id: 'sys-init',
      content: '[SYSTEM] Initializing...',
      scramble: true,
      top: '30%'
    },
    {
      id: 'load-data',
      content: '[LOADING] Processing data...',
      scramble: true,
      top: '45%'
    },
    {
      id: 'status',
      content: '[STATUS] Ready',
      scramble: true,
      top: '60%'
    }
  ];

  return (
    <TerminalPreloader
      lines={lines}
      duration={6}
      showProgress
      onComplete={() => console.log('Preloader done!')}
    >
      <MainContent />
    </TerminalPreloader>
  );
}
```

---

## Example 2: Building a Custom Preloader

```tsx
'use client';

import { useEffect } from 'react';
import { useGSAPTimeline } from '@/lib/animations/hooks';
import { useProgressBar } from '@/lib/animations/hooks';
import { useScrambleText } from '@/lib/animations/hooks';
import {
  createStaggeredFadeOut,
  ANIMATION_CONSTANTS,
} from '@/lib/animations/gsap-utils';

export function CustomPreloader({ onComplete }: { onComplete: () => void }) {
  // Timeline for orchestration
  const { timeline, play } = useGSAPTimeline({
    paused: true,
    onComplete
  });

  // Progress bar
  const { progress, progressRef } = useProgressBar({ timeline });

  // Scramble text for each line
  const line1 = useScrambleText({ autoStore: true });
  const line2 = useScrambleText({ autoStore: true });
  const line3 = useScrambleText({ autoStore: true });

  useEffect(() => {
    if (!timeline) return;

    const duration = 5;

    // Reveal line 1
    timeline.call(() => {
      line1.reveal({ speed: 0.3 });
    }, [], 0.5);

    // Reveal line 2
    timeline.call(() => {
      line2.reveal({ speed: 0.3 });
    }, [], 1.5);

    // Reveal line 3
    timeline.call(() => {
      line3.reveal({ speed: 0.3 });
    }, [], 2.5);

    // Add glitch effects
    timeline.call(() => {
      line1.glitch(0.2);
    }, [], 3);

    timeline.call(() => {
      line2.glitch(0.2);
    }, [], 3.5);

    // Fade out all lines
    timeline.add(
      createStaggeredFadeOut([
        line1.textRef.current!,
        line2.textRef.current!,
        line3.textRef.current!,
      ], 0.1),
      duration - 1
    );

    play();
  }, [timeline, play, line1, line2, line3]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="space-y-8 text-green-500 font-mono">
        <div ref={line1.textRef}>[SYSTEM] Initializing core systems...</div>
        <div ref={line2.textRef}>[AUTH] Verifying credentials...</div>
        <div ref={line3.textRef}>[STATUS] System ready</div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-10 left-10 right-10 h-1 bg-white/20">
        <div
          ref={progressRef}
          className="h-full bg-green-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

---

## Example 3: Animated Navigation Menu

```tsx
'use client';

import { AnimatedMenu } from '@/components/animations';
import { useRouter } from 'next/navigation';

export function SiteNavigation() {
  const router = useRouter();

  const menuItems = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' },
    { id: '3', label: 'Projects', href: '/projects' },
    { id: '4', label: 'Blog', href: '/blog' },
    { id: '5', label: 'Contact', href: '/contact' }
  ];

  const handleItemClick = (item: any) => {
    router.push(item.href);
  };

  return (
    <AnimatedMenu
      items={menuItems}
      featuredImage="/images/menu-bg.jpg"
      brandLogo={
        <div className="text-2xl font-bold text-white">
          Your Brand
        </div>
      }
      footer={
        <div className="flex gap-6 text-white/60">
          <a href="https://twitter.com">Twitter</a>
          <a href="https://github.com">GitHub</a>
          <span>© 2025 Your Brand</span>
        </div>
      }
      menuButtonLabel="MENU"
      closeButtonLabel="CLOSE"
      duration={0.64}
      stagger={0.075}
      onOpen={() => console.log('Menu opened')}
      onClose={() => console.log('Menu closed')}
      onItemClick={handleItemClick}
      className="custom-menu-overlay"
    >
      {/* Your main content goes here */}
      <div className="container mx-auto">
        <h1>Welcome</h1>
      </div>
    </AnimatedMenu>
  );
}
```

---

## Example 4: Hover Effects on Links

```tsx
'use client';

import { useSplitTextHover } from '@/lib/animations/hooks';
import Link from 'next/link';

interface AnimatedLinkProps {
  href: string;
  children: string;
}

export function AnimatedLink({ href, children }: AnimatedLinkProps) {
  const { textRef } = useSplitTextHover({
    xOffset: 0.5,
    duration: 0.64,
    stagger: 0.015
  });

  return (
    <Link
      href={href}
      ref={textRef as any}
      className="text-2xl font-bold hover:text-blue-500 transition-colors"
    >
      {children}
    </Link>
  );
}

// Usage
export function Navigation() {
  return (
    <nav className="flex gap-8">
      <AnimatedLink href="/">Home</AnimatedLink>
      <AnimatedLink href="/about">About</AnimatedLink>
      <AnimatedLink href="/contact">Contact</AnimatedLink>
    </nav>
  );
}
```

---

## Example 5: Dynamic Scramble Button

```tsx
'use client';

import { useScrambleText } from '@/lib/animations/hooks';
import { useState } from 'react';

const MESSAGES = [
  'Click Me!',
  'Try Again!',
  'One More!',
  'Keep Going!',
  'Last One!'
];

export function ScrambleButton() {
  const [index, setIndex] = useState(0);
  const { textRef, scramble } = useScrambleText({
    autoStore: true,
    scrambleChars: '█▓▒░'
  });

  const handleClick = () => {
    const nextIndex = (index + 1) % MESSAGES.length;
    scramble(MESSAGES[nextIndex], { speed: 0.5 });
    setIndex(nextIndex);
  };

  return (
    <button
      onClick={handleClick}
      className="px-8 py-4 bg-blue-600 text-white font-mono text-xl rounded"
    >
      <span ref={textRef}>{MESSAGES[0]}</span>
    </button>
  );
}
```

---

## Example 6: Multi-Stage Page Transition

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useGSAPTimeline } from '@/lib/animations/hooks';
import { clipPaths } from '@/lib/animations/gsap-utils';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  const { timeline, play } = useGSAPTimeline({
    paused: true,
    onComplete: () => setIsReady(true)
  });

  useEffect(() => {
    if (!timeline) return;

    // Stage 1: Reveal overlay
    timeline.to('.transition-overlay', {
      clipPath: clipPaths.presets.visible,
      duration: 0.64,
      ease: 'cubic-bezier(0.65,0.05,0.36,1)'
    });

    // Stage 2: Fade in content
    timeline.to('.page-content', {
      opacity: 1,
      duration: 0.5
    }, '-=0.2');

    // Stage 3: Hide overlay
    timeline.to('.transition-overlay', {
      clipPath: clipPaths.presets.hiddenTop,
      duration: 0.64,
      ease: 'cubic-bezier(0.65,0.05,0.36,1)'
    }, '+=0.3');

    play();
  }, [timeline, play]);

  return (
    <>
      <div
        className="transition-overlay fixed inset-0 bg-black z-50"
        style={{ clipPath: clipPaths.presets.hidden }}
      />
      <div
        className="page-content"
        style={{ opacity: 0 }}
      >
        {children}
      </div>
    </>
  );
}
```

---

## Example 7: Loading Progress with Sync

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useGSAPTimeline, useProgressBar } from '@/lib/animations/hooks';

export function DataLoader() {
  const [data, setData] = useState(null);
  const [loadingStage, setLoadingStage] = useState('Initializing');

  const { timeline, play } = useGSAPTimeline({ paused: true });
  const { progress, progressRef } = useProgressBar({ timeline });

  useEffect(() => {
    if (!timeline) return;

    const stages = [
      { label: 'Connecting to server', duration: 1 },
      { label: 'Fetching data', duration: 2 },
      { label: 'Processing', duration: 1.5 },
      { label: 'Complete', duration: 0.5 }
    ];

    let currentTime = 0;

    stages.forEach((stage) => {
      timeline.call(() => {
        setLoadingStage(stage.label);
      }, [], currentTime);
      currentTime += stage.duration;
    });

    timeline.call(() => {
      setData({ loaded: true });
    }, [], currentTime);

    play();
  }, [timeline, play]);

  if (data) {
    return <div>Data loaded!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4 text-xl font-mono">{loadingStage}...</div>
      
      <div className="w-96 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
```

---

## Example 8: Glitch Text Effect on Hover

```tsx
'use client';

import { useScrambleText } from '@/lib/animations/hooks';

export function GlitchText({ children }: { children: string }) {
  const { textRef, glitch, reveal } = useScrambleText({
    autoStore: true,
    scrambleChars: '!@#$%^&*()_+=[]{}|;:,.<>?'
  });

  return (
    <span
      ref={textRef}
      onMouseEnter={() => glitch(0.3)}
      onMouseLeave={() => reveal()}
      className="cursor-pointer font-mono"
    >
      {children}
    </span>
  );
}

// Usage
export function GlitchHeading() {
  return (
    <h1 className="text-4xl font-bold">
      Welcome to <GlitchText>The Matrix</GlitchText>
    </h1>
  );
}
```

---

## Example 9: Staggered Card Reveal

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useGSAPTimeline } from '@/lib/animations/hooks';

interface Card {
  id: string;
  title: string;
  description: string;
}

export function CardGrid({ cards }: { cards: Card[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { timeline, play } = useGSAPTimeline({ paused: true });

  useEffect(() => {
    if (!timeline || !containerRef.current) return;

    const cardElements = containerRef.current.querySelectorAll('.card');

    timeline.fromTo(
      cardElements,
      {
        y: 50,
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );

    play();
  }, [timeline, play]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-3 gap-6"
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className="card p-6 bg-white rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-gray-600">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Example 10: Complete Landing Page with Animations

```tsx
'use client';

import { TerminalPreloader } from '@/components/animations';
import { AnimatedMenu } from '@/components/animations';
import { useSplitTextHover } from '@/lib/animations/hooks';
import { useEffect } from 'react';
import { useGSAPTimeline } from '@/lib/animations/hooks';

function HeroSection() {
  const { timeline, play } = useGSAPTimeline({ paused: true });

  useEffect(() => {
    if (!timeline) return;

    timeline
      .fromTo(
        '.hero-title',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
      .fromTo(
        '.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        '.hero-cta',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6 },
        '-=0.3'
      );

    play();
  }, [timeline, play]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="hero-title text-6xl font-bold mb-4">
        Welcome to the Future
      </h1>
      <p className="hero-subtitle text-xl text-gray-600 mb-8">
        Experience next-generation web animations
      </p>
      <button className="hero-cta px-8 py-4 bg-blue-600 text-white rounded-lg">
        Get Started
      </button>
    </section>
  );
}

export default function LandingPage() {
  const menuItems = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Features', href: '/features' },
    { id: '3', label: 'Pricing', href: '/pricing' },
    { id: '4', label: 'Contact', href: '/contact' }
  ];

  const preloaderLines = [
    {
      id: '1',
      content: '[SYSTEM] Loading experience...',
      scramble: true,
      top: '40%'
    },
    {
      id: '2',
      content: '[STATUS] Ready',
      scramble: true,
      top: '55%'
    }
  ];

  return (
    <TerminalPreloader
      lines={preloaderLines}
      duration={4}
      showProgress
    >
      <AnimatedMenu
        items={menuItems}
        featuredImage="/hero-bg.jpg"
        brandLogo={<div className="text-2xl font-bold">Brand</div>}
      >
        <HeroSection />
      </AnimatedMenu>
    </TerminalPreloader>
  );
}
```

---

## Best Practices from Examples

1. **Always handle cleanup**: Hooks automatically cleanup on unmount
2. **Check refs before animating**: Ensure refs are attached
3. **Use timeline for orchestration**: Coordinate multiple animations
4. **Leverage stagger for visual flow**: Create smooth, cascading effects
5. **Sync progress bars with timelines**: Use `timeline` prop in `useProgressBar`
6. **Store original text for scrambles**: Enable `autoStore` option
7. **Configure easing consistently**: Use `ANIMATION_CONSTANTS.SLIDE_EASE`

---

*For more examples and patterns, see the main [README.md](./README.md)*
