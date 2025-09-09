### ProductSwapCard

Reference: [SHSF UI Product Swap Card](https://www.shsfui.com/primitives/cards/product-swap-card)

**Location**: `apps/app/src/components/ui/card/product-swap-card.tsx`

**Export**: Named export `{ ProductSwapCard }` (re-exported from `ui/card/index.tsx`).

**Description**
Animated product card that swaps between images with smooth vertical transitions and shows metadata with tech stack badges.

**Usage**

```tsx
import { ProductSwapCard } from '@/components/ui/card'

export function Example() {
  return (
    <div className='max-w-96'>
      <ProductSwapCard />
    </div>
  )
}
```

**Notes**

- Uses `@/utils/cn` (present in this repo) and shadcn UI primitives.
- `product.createdAt` is a display string; if sourced from metadata, prefer ISO and render via date-fns per project rules.
