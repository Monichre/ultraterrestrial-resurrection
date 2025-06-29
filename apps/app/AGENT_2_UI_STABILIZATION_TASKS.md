# Agent 2: UI Stabilization & Tour UI Developer Tasks

## PRIORITY: UI Stabilization Tasks (Do These First)

### 1. Verify Mindmap Bottom Menu Rendering
**Location:** `src/features/mindmap/components/menus/mindmap-bottom-menu/`

**UI Components to Test:**
- `oracle-input.tsx` - Input field and button functionality
- `OracleCommandMenu.tsx` - Command dropdown menu
- `UltraterrestrialModelSelection.tsx` - Model selection interface
- `entity-types.tsx` - Entity type buttons

**Test Cases:**
1. All buttons render correctly without layout issues
2. Input field accepts text and shows proper placeholder
3. Command menu opens/closes when typing `/`
4. Entity selection buttons are clickable and responsive
5. Chat messages display properly in `MindMapMessages.tsx`

### 2. Mobile Responsiveness Check
**Test Scenarios:**
- Mindmap functions on mobile devices
- Bottom menu doesn't overflow viewport
- Touch interactions work for node selection
- Text remains readable at mobile sizes

### 3. Visual State Management
**Check These States:**
- Loading states during AI responses
- Error states for failed operations
- Success feedback for completed actions
- Disabled states during processing

**Key Visual Elements:**
- Oracle icon animation during loading (`oracle-input.tsx:354`)
- Button state changes based on `chatStatus`
- Input field visual feedback
- Message part rendering (text, reasoning, sources, etc.)

### 4. Accessibility Testing
- Screen reader compatibility
- Keyboard navigation through all interactive elements
- ARIA labels are present and descriptive
- Focus management during modal/menu interactions

## THEN: Tour UI Development

### 1. Tour Overlay Component
**File:** `src/features/tours/components/tour-overlay.tsx`

**Features:**
- Floating narrative panel
- Progress indicator (step X of Y)
- Tour navigation controls (prev/next/skip/exit)
- Responsive design for mobile/desktop
- Glassmorphic design matching app aesthetic

**UI Requirements:**
```tsx
interface TourOverlayProps {
  currentStep: number
  totalSteps: number
  narrative: string
  title: string
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  onExit: () => void
}
```

### 2. Tour Navigation Component
**File:** `src/features/tours/components/tour-navigation.tsx`

**Features:**
- Breadcrumb navigation
- Visual progress bar
- Step indicators with completion status
- Tour selection dropdown

### 3. Waypoint Indicators
**File:** `src/features/tours/components/waypoint-indicator.tsx`

**Features:**
- Visual markers on mindmap nodes during tour
- Highlight current tour focus
- Show path progression with connecting lines
- Animated transitions between waypoints

### 4. Enhanced Mindmap Bottom Menu Integration
**Modifications to:** `src/features/mindmap/components/menus/mindmap-bottom-menu/mindmap-bottom-menu.tsx`

**Add Tour Features:**
- "Start Tour" button in entity selection
- Tour mode indicator
- "Back to Tour" floating button when user explores off-path
- Tour-specific command menu items

**Visual Enhancements:**
- Tour path edges with distinct styling (glow/dashed lines)
- Current waypoint highlighting
- Tour mode visual indicators
- Contextual help tooltips

## Design System Integration

### Use Existing Patterns:
- Tailwind CSS classes from current components
- Shadcn UI components for consistency
- Color scheme from `DOMAIN_MODEL_COLORS`
- Icon usage patterns from existing components

### Animation Framework:
- Framer Motion for smooth transitions
- Existing animation patterns from `oracle-input.tsx:8`
- Performance-optimized animations for mobile

### Responsive Design:
- Mobile-first approach
- Consistent with current mindmap mobile experience
- Touch-friendly interaction targets
- Adaptive text sizing

## Integration Points
- Work with Agent 1's tour state management
- Coordinate with Agent 3's contextual intelligence integration
- Maintain compatibility with existing mindmap UI
- Follow current component patterns and naming conventions

## Success Criteria
✅ All current UI components render without errors
✅ Mobile responsiveness works across devices
✅ Tour overlay doesn't interfere with mindmap interaction
✅ Visual progression clearly shows tour pathway
✅ Smooth transitions between tour waypoints
✅ Accessibility standards maintained throughout