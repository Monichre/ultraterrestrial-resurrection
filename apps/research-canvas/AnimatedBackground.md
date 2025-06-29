# Animated Background Component

## Overview
A complex animated SVG background component that creates a futuristic grid system with animated lines, circles, and geometric shapes.

## Key Features
- **Animated Grid Lines**: Horizontal and vertical lines that grow from zero width
- **Intersection Circles**: Small circles that fade in at grid intersections
- **Geometric Shapes**: Animated rectangles and paths with stroke animations
- **Gradient Effects**: Multiple linear and radial gradients for visual depth
- **Backdrop Filters**: Blur effects on circle elements

## Architecture

### Animation System
- Uses Framer Motion for all animations
- Four main animation variants:
  - `rectGrowVariants`: For growing line animations
  - `circleVariants`: For circle fade-in and stroke drawing
  - `dashVariants`: For geometric shape stroke animations
  - `lineVariants`: For path drawing animations

### Component Structure
- **SVG Container**: Fixed positioned, centered background element
- **Gradient Definitions**: Complex gradient system for visual effects
- **Filter Definitions**: Backdrop blur filters for depth
- **Animated Elements**: Motion components for each animated element

### Data Flow
1. Component mounts and sets `isVisible` to true
2. All motion elements animate from "hidden" to "visible" state
3. Different animation timings create staggered effect
4. Animations run once on mount

## Usage
\`\`\`tsx
import AnimatedBackground from "./AnimatedBackground"

export default function Page() {
  return (
    <div className="relative">
      <AnimatedBackground />
      {/* Your content */}
    </div>
  )
}
\`\`\`

## Customization
- Modify animation durations in variant objects
- Adjust gradient colors in SVG definitions
- Change positioning via CSS classes
- Add new animated elements following existing patterns
