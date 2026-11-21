# EntrancePreloader

A reusable entrance animation utility that displays a terminal-style loading animation before revealing content. This component is inspired by sci-fi interfaces and provides a dynamic, engaging loading experience.

## Features

- Terminal-style text scrambling and reveal effects
- Progress bar animation
- Smooth transition to content
- Fully customizable text and timings
- Built with GSAP for smooth animations
- Self-contained, with proper cleanup of animations

## Installation Dependencies

This component requires the following dependencies:

```bash
npm install gsap @gsap/react clsx tailwind-merge
```

Make sure you have the GSAP plugins registered in your application:

```typescript
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);
```

## Basic Usage

```tsx
import { EntrancePreloader } from '@/components/animated/entrance-preloader';

export default function MyPage() {
  return (
    <EntrancePreloader onComplete={() => console.log('Animation complete')}>
      <div>
        {/* Your page content here */}
        <h1>Welcome to the application</h1>
        <p>This content will be revealed after the entrance animation</p>
      </div>
    </EntrancePreloader>
  );
}
```

## Advanced Usage with Custom Lines

```tsx
import { EntrancePreloader } from '@/components/animated/entrance-preloader';

export default function MyPage() {
  const customLines = [
    {
      text: "System Initialization",
      type: "highlight",
      position: 0,
      scramble: true
    },
    {
      text: "Loading Profile Data",
      type: "faded",
      position: 30,
      scramble: true
    },
    // Add more lines as needed
  ];

  return (
    <EntrancePreloader 
      title="System Boot"
      subtitle="Sequence Initiated"
      footerLeft="Boot Complete"
      footerRight="System Ready"
      progressLabel="Loading"
      progressAction="Data Transfer"
      lines={customLines}
      duration={4}
      onComplete={() => console.log('Animation complete')}
    >
      <div>
        {/* Your page content here */}
        <h1>Welcome to the System</h1>
        <p>All systems operational</p>
      </div>
    </EntrancePreloader>
  );
}
```

## Using the Hook Directly

For more control over the animation, you can use the hook directly:

```tsx
import { useRef } from 'react';
import { useEntrancePreloader } from '@/components/animated/entrance-preloader';

export default function MyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { start, skip, reset, isAnimating, isComplete } = useEntrancePreloader(containerRef, {
    duration: 5,
    onComplete: () => console.log('Animation complete'),
  });

  return (
    <div ref={containerRef}>
      <div className="preloader">
        {/* Your preloader UI here */}
      </div>
      
      <div className="content-container">
        <h1>Welcome</h1>
        <p>Content revealed after animation</p>
        
        {/* Controls */}
        <div className="controls">
          <button onClick={start} disabled={isAnimating || isComplete}>Start Animation</button>
          <button onClick={skip} disabled={isComplete}>Skip Animation</button>
          <button onClick={reset}>Reset Animation</button>
        </div>
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onComplete` | `() => void` | `undefined` | Called when the preloader animation completes |
| `duration` | `number` | `6` | Total duration of the animation in seconds |
| `title` | `string` | `"Dimensional Gateway"` | Title shown in the top border |
| `subtitle` | `string` | `"Traversal Initiated"` | Subtitle shown in the top border |
| `footerLeft` | `string` | `"Traversal Sequence Complete"` | Footer text shown in the bottom border (left) |
| `footerRight` | `string` | `"Dimensional Gateway Open"` | Footer text shown in the bottom border (right) |
| `progressLabel` | `string` | `"Traversing"` | Progress label text |
| `progressAction` | `string` | `"Dimensional Shift"` | Progress action text that appears next to the progress bar |
| `lines` | `TerminalLine[]` | `DEFAULT_LINES` | Custom terminal lines to replace the defaults |
| `specialChars` | `string` | `"▪"` | Special characters used for scrambling effect |
| `className` | `string` | `undefined` | Custom CSS class to apply to the preloader |
| `children` | `React.ReactNode` | `undefined` | Children to reveal after the animation completes |

## Hook API

The `useEntrancePreloader` hook returns the following:

```typescript
{
  start: () => void;       // Start the animation
  skip: () => void;        // Skip the animation and show content
  reset: () => void;       // Reset the animation to initial state
  isAnimating: boolean;    // Whether animation is in progress
  isComplete: boolean;     // Whether animation has completed
}
```

## Performance Considerations

- The component automatically cleans up GSAP animations when unmounted
- Uses React.useCallback and memoization to prevent unnecessary re-renders
- Uses GSAP's contextSafe function for event handlers to ensure proper cleanup

## Browser Compatibility

- Works in all modern browsers that support CSS clip-path (IE11 not supported)
- Falls back gracefully if ScrambleTextPlugin is not available
- SSR-safe with Next.js 