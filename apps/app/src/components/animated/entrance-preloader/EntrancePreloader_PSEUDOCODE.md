# EntrancePreloader - Pseudocode and Design Process

This document explains the design decisions and implementation process for the EntrancePreloader component.

## Component Design Strategy

1. **Component vs Hook**: Split functionality between a React component (`EntrancePreloader`) for the UI and a custom hook (`useEntrancePreloader`) for animation logic.

2. **Animation Approach**: Use GSAP's native timeline with multiple sub-timelines for complex sequencing. Leverage ScrambleTextPlugin for the text scrambling effect.

3. **Cleanup Strategy**: Use GSAP's `contextSafe` and React 18's lifecycle with `useGSAP` to ensure proper animation cleanup on component unmount.

4. **Customization API**: Allow full customization of text content, timings, and behavior through props and options.

## TypeScript Types Pseudocode

```typescript
// Terminal line configuration
interface TerminalLine {
  text: string;           // Text content to display
  type: 'highlight' | 'faded';  // Text style
  position: number;       // Vertical position in pixels
  scramble?: boolean;     // Whether to apply scramble effect
}

// Main component props
interface EntrancePreloaderProps {
  onComplete?: () => void;  // Callback for completion
  duration?: number;        // Animation duration
  title?: string;           // Header title
  subtitle?: string;        // Header subtitle
  ...other customization options...
  children?: React.ReactNode; // Content to reveal
}

// Hook options
interface UseEntrancePreloaderOptions {
  duration?: number;
  onComplete?: () => void;
  specialChars?: string;
}

// Hook return value
interface UseEntrancePreloaderReturn {
  start: () => void;       // Start animation
  skip: () => void;        // Skip to end
  reset: () => void;       // Reset to beginning
  isAnimating: boolean;
  isComplete: boolean;
}
```

## Component Pseudocode

```typescript
function EntrancePreloader(props: EntrancePreloaderProps) {
  // Create container reference
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use the animation hook
  const { start, isComplete } = useEntrancePreloader(containerRef, {
    duration: props.duration,
    onComplete: props.onComplete,
    specialChars: props.specialChars,
  });
  
  // Start the animation when component mounts
  useEffect(() => { start(); }, [start]);
  
  // Render the preloader and content
  return (
    <div ref={containerRef}>
      <div className="preloader">
        <div className="terminal-preloader">
          {/* Header section */}
          <div className="border-top">
            <span>{props.title}</span>
            <span>{props.subtitle}</span>
          </div>
          
          {/* Terminal content */}
          <div className="terminal-container">
            {/* Render all lines */}
            {props.lines.map((line, index) => (
              <div className="terminal-line" style={{ top: line.position }}>
                <span className={line.type} data-scramble={line.scramble}>
                  {line.text}
                </span>
              </div>
            ))}
            
            {/* Progress bar */}
            <div className="progress-line">
              <span className="progress-label">{props.progressLabel}</span>
              <div className="progress-container">
                <div className="progress-bar" id="progress-bar"></div>
              </div>
              <span className="highlight" data-scramble="true">
                {props.progressAction}
              </span>
            </div>
          </div>
          
          {/* Footer section */}
          <div className="border-bottom">
            <span>{props.footerLeft}</span>
            <span>{props.footerRight}</span>
          </div>
        </div>
      </div>
      
      {/* Content container that will be revealed */}
      <div className="content-container">
        {props.children}
      </div>
      
      {/* CSS styling */}
      <style jsx>{`...`}</style>
    </div>
  );
}
```

## Hook Pseudocode

```typescript
function useEntrancePreloader(
  containerRef: React.RefObject<HTMLDivElement>,
  options: UseEntrancePreloaderOptions
): UseEntrancePreloaderReturn {
  // State to track animation status
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Reference to the GSAP timeline
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // Function to update progress bar
  const updateProgress = useCallback((percent: number) => {
    if (!containerRef.current) return;
    
    const progressBar = containerRef.current.querySelector('#progress-bar');
    if (progressBar instanceof HTMLElement) {
      progressBar.style.width = `${percent}%`;
    }
  }, [containerRef]);
  
  // Set up GSAP context safety for the container
  const { contextSafe } = useGSAP({ scope: containerRef });
  
  // Function to store the original text content
  const storeOriginalText = useCallback(() => {
    // Store original text content for scrambling
  }, [containerRef]);
  
  // Create main animation timeline
  const createTimeline = useCallback(() => {
    // 1. Store original text
    // 2. Reset progress bar
    // 3. Create main timeline
    // 4. Get all terminal lines
    // 5. Create text reveal timeline
    // 6. Process each line for text reveal
    // 7. Apply scramble effect to text
    // 8. Add periodic "glitch" effects
    // 9. Add disappearing effect at the end
    // 10. Set up progress bar synchronization
    
    return timeline;
  }, [containerRef, options.duration, /* other dependencies */]);
  
  // Function to reveal content
  const revealContent = useCallback(() => {
    // 1. Get preloader and content elements
    // 2. Create timeline for transition
    // 3. Animate preloader out (clip-path)
    // 4. Fade in content
    
    return timeline;
  }, [containerRef]);
  
  // Start the animation
  const start = contextSafe(() => {
    if (isAnimating || isComplete) return;
    
    setIsAnimating(true);
    setIsComplete(false);
    
    // 1. Set up initial state
    // 2. Create timeline
    // 3. Play timeline
    // 4. After completion, reveal content
  });
  
  // Skip animation
  const skip = contextSafe(() => {
    if (isComplete) return;
    
    // 1. Kill running animations
    // 2. Update state
    // 3. Set progress to 100%
    // 4. Immediately reveal content
    // 5. Call completion callback
  });
  
  // Reset animation
  const reset = contextSafe(() => {
    // 1. Kill running animations
    // 2. Reset state
    // 3. Reset DOM elements
  });
  
  // Cleanup on unmount
  useGSAP(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    }
  }, { scope: containerRef });
  
  return {
    start,
    skip,
    reset,
    isAnimating,
    isComplete
  };
}
```

## Animation Strategy

The animation sequence follows these steps:

1. **Initial Setup**: Position elements and hide content
2. **Text Reveal**: Gradually show text lines with scramble effect
3. **Progress Bar**: Synchronize progress bar with overall timeline
4. **Random Glitches**: Add periodic scramble effects for "glitches"
5. **Fade Out**: Staggered fade out of text elements
6. **Transition**: Animate preloader out using clip-path
7. **Reveal Content**: Fade in the actual content

## Design Considerations

### Why GSAP?

- **Animation Power**: GSAP provides precise control over timing, easing, and complex sequences
- **Plugin Support**: ScrambleTextPlugin provides the text scrambling effect
- **Browser Compatibility**: GSAP ensures consistent animation across browsers
- **Performance**: GSAP is optimized for animation performance with minimal reflows

### Component Structure

- **Separation of Concerns**: UI in component, animation logic in hook
- **Reusability**: Hook can be used separately for custom implementations
- **Customization**: Props allow for custom text, timings, and behavior

### Styling Strategy

- **Scoped Styles**: Uses CSS-in-JS with scoped styles to prevent global conflicts
- **Flexibility**: Allows styling customization through className prop
- **Responsive Design**: Container adapts to different screen sizes

### Performance Optimizations

- **Proper Cleanup**: Ensures all animations are properly killed on unmount
- **Memoization**: Uses useCallback to prevent unnecessary function recreations
- **Context Safety**: Uses GSAP's contextSafe for proper cleanup
- **No React State for Animation**: Uses GSAP for animation state to minimize React renders