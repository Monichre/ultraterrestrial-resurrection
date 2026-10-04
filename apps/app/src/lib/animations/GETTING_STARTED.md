# Getting Started with GSAP Animation Library

Welcome! This guide will get you up and running with the GSAP Animation Library in 5 minutes.

---

## 🎨 Interactive Storybook

**The fastest way to explore the library is through Storybook!**

```bash
# Run Storybook
npm run storybook
# or
bun run storybook
```

Then navigate to `http://localhost:6006` and explore:

- 📖 Introduction with live examples
- 🎯 All components with interactive controls
- 📝 Copy-paste ready code
- 🎬 Real-time property adjustments

See [STORYBOOK_EXAMPLES.md](./STORYBOOK_EXAMPLES.md) for a complete guide.

---

## 📦 Installation

The library is already integrated into your project. You just need to import and use it!

```bash
# No installation needed - it's already here!
# GSAP and plugins should be installed:
npm install gsap
```

---

## 🚀 Your First Animation

### Step 1: Import a Component

```tsx
// In any page or component file
import { TerminalPreloader } from '@/components/animations';
```

### Step 2: Use It

```tsx
export default function MyPage() {
  return (
    <TerminalPreloader
      lines={[
        {
          id: 'welcome',
          content: 'Welcome to your app!',
          scramble: true,
          top: '50%'
        }
      ]}
      duration={3}
      showProgress
    >
      {/* Your page content */}
      <div>
        <h1>Hello World!</h1>
      </div>
    </TerminalPreloader>
  );
}
```

### Step 3: See the Magic ✨

That's it! You now have a terminal-style preloader with scramble effects and a progress bar.

---

## 🎬 Complete Hero Page Animation

We now have a complete, production-ready hero page animation system! Check out [`HERO_ANIMATION_COMPLETE.md`](../../../../../../../HERO_ANIMATION_COMPLETE.md) for the full guide.

**Quick Start:**

```bash
# The hero animation is now live on your homepage!
bun run dev
```

---

## 🆕 New: TextScramble Component

Create stunning matrix-style text animations with our new TextScramble component:

```tsx
import { TextScramble } from '@/lib/animations/text-scramble';
import { motion, AnimatePresence } from 'framer-motion';

function HeroTitle() {
  const [showSubtitle, setShowSubtitle] = useState(false);

  return (
    <div className='flex flex-col items-center gap-8'>
      {/* Main Title */}
      <h1 className='text-6xl font-bold'>
        <TextScramble 
          text="ULTRATERRESTRIAL"
          duration={2500}
          className="bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent"
          onComplete={() => setShowSubtitle(true)}
        />
      </h1>
      
      {/* Delayed Subtitle */}
      <AnimatePresence>
        {showSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 italic"
          >
            <TextScramble
              text="The truth is out there..."
              duration={3000}
              delay={200}
            />
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### TextScramble Props

- `text` (string) - The text to animate
- `duration` (number) - Animation duration in milliseconds
- `delay` (number) - Delay before animation starts
- `className` (string) - CSS classes to apply
- `onComplete` () => void - Callback when animation completes

---

## 🎨 Common Use Cases

### 1. Add Scramble Effect to Any Text

#### Option A: Using the TextScramble Component (NEW!)

```tsx
import { TextScramble } from '@/lib/animations/text-scramble';

function MyComponent() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <h1>
      <TextScramble 
        text="HELLO WORLD"
        duration={2500}
        delay={100}
        className="text-white font-bold"
        onComplete={() => setIsComplete(true)}
      />
    </h1>
  );
}
```

#### Option B: Using the Hook

```tsx
import { useScrambleText } from '@/lib/animations/hooks';

function MyComponent() {
  const { textRef, scramble } = useScrambleText({ autoStore: true });

  return (
    <h1 
      ref={textRef}
      onClick={() => scramble('New Text!')}
    >
      Click Me!
    </h1>
  );
}
```

### 2. Create Hover Effects

```tsx
import { useSplitTextHover } from '@/lib/animations/hooks';

function NavLink({ href, children }) {
  const { textRef } = useSplitTextHover();

  return (
    <a href={href} ref={textRef}>
      {children}
    </a>
  );
}
```

### 3. Create Literary Quote Animation

```tsx
import { TextScramble } from '@/lib/animations/text-scramble';
import { motion, AnimatePresence } from 'framer-motion';

function LovecraftQuote() {
  const QUOTE = "The most merciful thing in the world... is the inability of the human mind to correlate all its contents.";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      className="max-w-3xl text-center"
    >
      <TextScramble
        text={QUOTE}
        duration={3000}
        delay={200}
        className="text-gray-300 font-light italic"
      />
      <motion.p 
        className="mt-4 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
      >
        — H.P. Lovecraft
      </motion.p>
    </motion.div>
  );
}
```

### 4. Build Custom Animations

```tsx
import { useGSAPTimeline } from '@/lib/animations/hooks';
import { useEffect } from 'react';

function AnimatedBox() {
  const { timeline, play } = useGSAPTimeline({ paused: true });

  useEffect(() => {
    if (!timeline) return;
    
    timeline
      .to('.box', { x: 100, duration: 1 })
      .to('.box', { y: 50, duration: 0.5 });
    
    play();
  }, [timeline, play]);

  return <div className="box">I will animate!</div>;
}
```

---

## 📚 What's Available?

### Components

- `<TerminalPreloader />` - Loading screen with terminal effects
- `<AnimatedMenu />` - Full-screen animated menu
- `<TextScramble />` - Matrix-style text scramble animation (NEW!)

### Hooks

- `useGSAPTimeline` - Manage GSAP timelines
- `useProgressBar` - Animated progress bars
- `useScrambleText` - Text scramble effects
- `useSplitTextHover` - Hover animations for text

### Utilities

- `clipPaths` - Clip-path helpers
- `createScrambleTextAnim()` - Scramble text factory
- `createStaggeredSlide()` - Staggered animations
- `ANIMATION_CONSTANTS` - Duration, easing, etc.

---

## 📖 Learning Resources

Start with these in order:

1. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⚡
   - Quick lookup for common tasks
   - Copy-paste ready code snippets
   - **Start here if you want to jump right in!**

2. **[EXAMPLES.md](./EXAMPLES.md)** 💡
   - 10 real-world examples
   - Complete code you can use immediately
   - Best practices and patterns

3. **[README.md](./README.md)** 📚
   - Complete API documentation
   - Configuration options
   - Architecture details

4. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** 🔄
   - Converting vanilla JS to React
   - Before/after comparisons
   - Common pitfalls

---

## 💡 Pro Tips

### Tip 1: Start Simple

Don't try to use everything at once. Start with one component or hook and build from there.

### Tip 2: Use TypeScript

The library is fully typed. Let IntelliSense guide you!

```tsx
// Hover over components/hooks to see available props
const { textRef, scramble } = useScrambleText({
  // IntelliSense will show you all options here!
});
```

### Tip 3: Check the Console

Hooks and components log helpful warnings if something is wrong.

### Tip 4: Read the Examples

The examples in `EXAMPLES.md` show real-world usage patterns that you can adapt.

### Tip 5: Use Constants

Don't hardcode animation values:

```tsx
import { ANIMATION_CONSTANTS } from '@/lib/animations/gsap-utils';

// ✅ GOOD
duration: ANIMATION_CONSTANTS.DEFAULT_DURATION,
ease: ANIMATION_CONSTANTS.SLIDE_EASE,

// ❌ BAD
duration: 0.64,
ease: "cubic-bezier(0.65,0.05,0.36,1)",
```

---

## 🐛 Troubleshooting

### Animation Not Playing?

```tsx
// Make sure you're calling play() for paused timelines
const { timeline, play } = useGSAPTimeline({ paused: true });

useEffect(() => {
  if (timeline) {
    // Add animations...
    play(); // Don't forget this!
  }
}, [timeline, play]);
```

### Ref Not Working?

```tsx
// Make sure ref is attached before animating
const { textRef, scramble } = useScrambleText();

// ❌ BAD - ref might not be attached yet
scramble('Text');

// ✅ GOOD - wait for user interaction
<span ref={textRef} onClick={() => scramble('Text')}>
  Click
</span>
```

### TypeScript Errors?

```tsx
// Cast refs if needed for specific element types
ref={textRef as React.RefObject<HTMLAnchorElement>}
```

---

## 🎯 Next Steps

1. **Try the Quick Reference** - [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. **Explore Examples** - [EXAMPLES.md](./EXAMPLES.md)
3. **Read Full Docs** - [README.md](./README.md)
4. **Build Something Cool!** 🚀

---

## 💬 Need Help?

- Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for quick answers
- Read [EXAMPLES.md](./EXAMPLES.md) for usage patterns
- See [README.md](./README.md) for complete API docs
- Review [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) if converting from vanilla JS

---

## 🎉 You're Ready

You now have everything you need to create amazing animations. Start simple, experiment, and have fun!

**Quick Start Summary:**

```tsx
// Option 1: Terminal Preloader
import { TerminalPreloader } from '@/components/animations';

<TerminalPreloader
  lines={[{ id: '1', content: 'Hello!', scramble: true }]}
  duration={3}
/>

// Option 2: Text Scramble (NEW!)
import { TextScramble } from '@/lib/animations/text-scramble';

<TextScramble 
  text="WELCOME TO THE MATRIX" 
  duration={2000}
  className="text-green-400 font-mono"
/>

// 3. Enjoy! ✨
```

---

*Happy animating! 🎨*
