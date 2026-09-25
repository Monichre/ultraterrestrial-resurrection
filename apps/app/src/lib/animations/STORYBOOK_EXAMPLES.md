# Storybook Examples Guide

This guide shows you how to run and explore the animation library stories in Storybook.

## 🚀 Running Storybook

```bash
# From the apps/app directory
npm run storybook
# or
bun run storybook

# Storybook will open at http://localhost:6006
```

## 📚 Available Stories

### Hooks

#### 1. **useGSAPTimeline**

Location: `Animations/Hooks/useGSAPTimeline`

**Stories:**

- Basic - Manual timeline control
- AutoPlay - Timeline starts automatically
- WithCallbacks - Lifecycle callbacks
- SequentialAnimation - Multiple sequential animations
- StaggeredAnimation - Staggered grid animation

**Key Features Demonstrated:**

- Timeline control methods (play, pause, restart, reverse)
- Sequential vs parallel animations
- Stagger effects
- Lifecycle callbacks

#### 2. **useScrambleText**

Location: `Animations/Hooks/useScrambleText`

**Stories:**

- Interactive - Full control panel
- OnHoverGlitch - Hover-triggered glitch
- ContinuousScramble - Auto-cycling messages
- CustomCharacters - Different character sets
- TerminalStyle - Multi-line terminal sequence
- DifferentSpeeds - Speed comparison

**Key Features Demonstrated:**

- Scramble to new text
- Glitch effects
- Reveal original text
- Custom scramble characters
- Speed variations

#### 3. **useSplitTextHover**

Location: `Animations/Hooks/useSplitTextHover`

**Stories:**

- Basic - Simple hover effect
- NavigationMenu - Multiple nav links
- LargeXOffset - Dramatic movement
- FastStagger - Quick wave effect
- SlowStagger - Slow motion
- SplitByWords - Word-based splitting
- CardGrid - Multiple cards
- HeroHeading - Hero with gradient
- ManualTrigger - Button-controlled

**Key Features Demonstrated:**

- Character-by-character hover animation
- Word-based splitting
- Configurable offset and stagger
- Manual trigger control

### Components

#### 4. **TextScramble**

Location: `Animations/Components/TextScramble`

**Stories:**

- Basic - Simple scramble
- ShortDuration - Fast reveal (1s)
- LongDuration - Slow reveal (4s)
- WithDelay - Delayed start
- CustomStyling - Gradient text
- SequentialReveal - Chained animations
- HeroSection - Complete hero
- TerminalOutput - Multi-line terminal
- MultipleInstances - Grid of scrambles
- LongText - Long passages
- WithSpaces - Space handling

**Key Features Demonstrated:**

- Duration control
- Delay control
- Sequential reveals with onComplete
- Custom styling
- Multiple instances

#### 5. **TerminalPreloader**

Location: `Animations/Components/TerminalPreloader`

**Stories:**

- Basic - Standard preloader
- FastPreloader - 3 second load
- SlowPreloader - 10 second load
- WithoutProgress - No progress bar
- NoGlitches - Clean animation
- ManyGlitches - Intense glitching
- CustomScrambleChars - Binary characters
- SystemBootSequence - 7-line boot
- MinimalPreloader - Single line
- UAP_Database_Loading - Themed example
- WithCustomStyling - Custom colors
- WithCallback - onComplete handler
- CenteredSingleLine - Centered text
- QuantumEncryption - Block characters

**Key Features Demonstrated:**

- Multi-line terminal text
- Progress bar sync
- Glitch effects
- Custom scramble characters
- Duration control
- Callbacks

#### 6. **AnimatedMenu**

Location: `Animations/Components/AnimatedMenu`

**Stories:**

- Basic - Simple menu
- WithFeaturedImage - Background image
- CustomBrandLogo - Logo component
- WithFooter - Footer content
- FastAnimation - Quick transitions
- SlowAnimation - Dramatic timing
- ManyItems - 8 navigation items
- UFO_ResearchMenu - Themed example
- CustomButtonLabels - Custom labels
- WithCallbacks - Event handlers
- CompleteExample - All features
- MinimalMenu - Minimal design
- DarkTheme - Pure black background

**Key Features Demonstrated:**

- Full-screen overlay
- Clip-path reveals
- Featured images
- Split-text hover on links
- Staggered animations
- Custom branding

## 🎨 Using Controls

Storybook includes interactive controls for most properties:

1. **Navigate to any story**
2. **Open the "Controls" panel** at the bottom
3. **Adjust values** to see changes in real-time

### Example: Adjusting TerminalPreloader

1. Go to `Animations/Components/TerminalPreloader/Basic`
2. In Controls panel:
   - Adjust `duration` slider (2-10 seconds)
   - Toggle `showProgress` checkbox
   - Change `glitchCount` (0-10)
3. Click "Remount component" to see changes

## 📖 Code Examples

### Copy-Paste Ready Code

Each story includes the source code in the "Docs" tab. You can:

1. Click on any story
2. Click the **"Docs"** tab at the top
3. View the full component documentation
4. Copy code examples directly

### Quick Access Pattern

```tsx
// Navigate to story > Docs tab > Scroll to "Show code"
// Example for TextScramble:
import { TextScramble } from '@/lib/animations'

<TextScramble 
  text="HELLO WORLD"
  duration={2000}
  className="text-green-400"
/>
```

## 🎯 Interactive Features

### Try These Interactions

#### useScrambleText Stories

- Click buttons to scramble to different text
- Hover over "OnHoverGlitch" story
- Watch "ContinuousScramble" cycle automatically

#### useSplitTextHover Stories

- Hover over text to see character animation
- Compare different offset values
- Try manual trigger buttons

#### AnimatedMenu Stories

- Click "Menu" button in top right
- Hover over navigation links
- Notice staggered reveal

#### TerminalPreloader Stories

- Watch progress bar sync
- Count glitch effects
- Compare different durations

## 🔍 Best Practices Demonstrated

### 1. **Progressive Enhancement**

See how `SequentialReveal` story chains animations:

- Main title completes
- Triggers subtitle animation
- Then triggers footer

### 2. **User Control**

See `ManualTrigger` story for programmatic control:

- Button to trigger enter animation
- Button to trigger leave animation
- No hover required

### 3. **Theming**

See `UFO_ResearchMenu` and `UAP_Database_Loading`:

- Custom colors
- Themed content
- Consistent styling

### 4. **Performance**

See `MultipleInstances` story:

- Multiple simultaneous animations
- Staggered start times
- Efficient rendering

## 🚦 Testing in Storybook

### Visual Regression Testing

1. Navigate to story
2. Click "Canvas" tab
3. Use viewport toolbar to test responsive behavior
4. Screenshot for visual comparison

### Accessibility Testing

1. Install Storybook a11y addon (if not installed)
2. Open story
3. Check "Accessibility" panel for issues

### Performance Testing

1. Open Chrome DevTools
2. Go to Performance tab
3. Record while story animates
4. Analyze animation frames

## 💡 Tips for Exploration

### Keyboard Shortcuts

- `/` - Search stories
- `F` - Toggle fullscreen
- `S` - Show shortcuts panel
- `A` - Toggle addons panel

### Compare Stories

1. Open story in new tab
2. Arrange windows side by side
3. Compare animations simultaneously

### Extract Code

1. Right-click on Canvas
2. "View Page Source"
3. Find component implementation
4. Copy to your project

## 🎬 Suggested Exploration Order

### For Beginners

1. Start with `TextScramble/Basic`
2. Try `useScrambleText/Interactive`
3. Explore `TerminalPreloader/Basic`
4. Check out `AnimatedMenu/Basic`

### For Advanced Users

1. Study `SequentialReveal` for chaining
2. Examine `SystemBootSequence` for complex sequences
3. Review `CompleteExample` for full integration
4. Analyze `ManualTrigger` for programmatic control

### For Theme Designers

1. `CustomStyling` stories
2. `UFO_ResearchMenu`
3. `UAP_Database_Loading`
4. `DarkTheme`

## 📱 Responsive Testing

Use Storybook's viewport toolbar to test:

- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)
- Large Desktop (1920px)

## 🐛 Debugging Tips

### Animation Not Playing?

1. Check browser console for errors
2. Ensure GSAP plugins are loaded
3. Verify refs are attached

### Stutter or Lag?

1. Check Chrome DevTools Performance
2. Reduce glitch count in TerminalPreloader
3. Increase stagger delay

### Text Not Scrambling?

1. Verify `scramble={true}` attribute
2. Check scrambleChars prop
3. Ensure ScrambleTextPlugin is registered

## 📦 Exporting Stories

To use a story configuration in your project:

1. Navigate to story
2. Click "Docs" tab
3. Copy the `args` object
4. Paste into your component usage

Example:

```tsx
// From TerminalPreloader/SystemBootSequence story
const lines = [ /* copied from story */ ]

<TerminalPreloader
  lines={lines}
  duration={8}
  glitchCount={5}
  showProgress
/>
```

## 🎨 Customization Examples

### Combining Animations

```tsx
// Use preloader with menu
<TerminalPreloader
  lines={bootLines}
  duration={5}
  onComplete={() => setLoaded(true)}
>
  {loaded && (
    <AnimatedMenu
      items={menuItems}
      featuredImage="/bg.jpg"
    >
      <MainApp />
    </AnimatedMenu>
  )}
</TerminalPreloader>
```

### Chaining Effects

```tsx
// Sequential scramble reveals
const [show2, setShow2] = useState(false)
const [show3, setShow3] = useState(false)

<div>
  <TextScramble 
    text="First"
    onComplete={() => setShow2(true)}
  />
  {show2 && (
    <TextScramble 
      text="Second"
      onComplete={() => setShow3(true)}
    />
  )}
  {show3 && <TextScramble text="Third" />}
</div>
```

## 🔗 Related Documentation

- [README.md](./README.md) - Full API documentation
- [EXAMPLES.md](./EXAMPLES.md) - Code examples
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick lookup
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup guide
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration help

---

*Happy exploring! 🚀*
