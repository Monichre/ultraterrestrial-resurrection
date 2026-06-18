### Pill Component

**Location**: `apps/app/src/components/animated/pill.tsx`

**Export**: Named export `{ Pill }` (re-exported from `components/animated/index.tsx`).

**Description**
Animated pill UI with an active item and a sliding background indicator. Shows an info button matching the active item's color scheme, and can expand to show a short description.

**Usage**

```tsx
import { Pill } from '@/components/animated'

export function Example() {
  return (
    <div className='h-28'>
      <Pill />
    </div>
  )
}
```

**Notes**

- Uses Framer Motion for transitions and Lucide icons.
- Hover moves the background indicator; clicking changes active; button toggles description.
