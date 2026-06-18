### DynamicSettingsVariant1

**Location**: `apps/app/src/components/animated/dynamic-settings-variant-1.tsx`

**Export**: Default export, also re-exported as a named export from `components/animated/index.tsx`.

**Description**
Animated settings panel (dimensions, aspect ratio, prompt). Expands with spring animation and highlights the active tab.

**Usage**

```tsx
import { DynamicSettingsVariant1 } from '@/components/animated'

export function Example() {
  return (
    <div className='p-4'>
      <DynamicSettingsVariant1 />
    </div>
  )
}
```

**Notes**

- Uses `motion/react` for AnimatePresence/motion; ensure that package is installed and compatible with current framer-motion setup.
- Displays toasts via `sonner` when applying changes.
