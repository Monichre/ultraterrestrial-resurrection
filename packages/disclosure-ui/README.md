# @repo/disclosure-ui

Internal design system for Ultraterrestrial apps: **design tokens**, **React components**, **style-guide metadata**, and an **image gallery catalog**.

Canon for registers and vocabulary: `docs/vision/DESIGN_REGISTERS.md`, `docs/vision/UX_LANGUAGE_GUIDE.md`. Root `DESIGN.md` is a limited Microfilm Dark chrome sketch only.

## Install (workspace)

```json
"@repo/disclosure-ui": "workspace:*"
```

Add to the consuming app's `transpilePackages` (Next.js):

```ts
transpilePackages: ['@repo/disclosure-ui']
```

Import global token CSS once in the app shell:

```ts
import '@repo/disclosure-ui/styles/tokens.css'
```

## Exports

| Subpath | Contents |
| --------- | ---------- |
| `@repo/disclosure-ui` | Barrel — tokens, components, style-guide, gallery |
| `@repo/disclosure-ui/tokens` | OKLCH registers, entity colors, CSS variable map |
| `@repo/disclosure-ui/components` | Shared primitives (`TagPill`, `SectionHeading`, `ClassificationStamp`, chrome, meters) |
| `@repo/disclosure-ui/style-guide` | Structured sections for Storybook / internal docs UIs |
| `@repo/disclosure-ui/gallery` | Typed catalog of textures, motifs, and reference imagery |
| `@repo/disclosure-ui/styles/tokens.css` | `--du-*` primitives plus assembling-components aliases (`--color-*`, `--spacing-*`, `--font-size-*`, `--radius-*`, `--shadow-*`, `--chart-color-*`, `--z-*`, `--duration-*`) |

## Usage

```tsx
import { TagPill, READING_ROOM_TOKENS } from '@repo/disclosure-ui'
import { IMAGE_GALLERY } from '@repo/disclosure-ui/gallery'

export function Example() {
  return (
    <div style={{ color: READING_ROOM_TOKENS.ink }}>
      <TagPill label="CONFIDENTIAL" variant="bronze" />
      <img src={IMAGE_GALLERY.textures.groove.src} alt={IMAGE_GALLERY.textures.groove.alt} />
    </div>
  )
}
```

## Assets

Texture files live in `packages/disclosure-ui/assets` and are served at `/disclosure-ui/...`.

- Storybook: `staticDirs` maps the folder to `/disclosure-ui`
- Next app: `apps/app/public/disclosure-ui` is a symlink to this package's `assets/`

## Migration note

`apps/app` research-ui shells re-export tokens and primitives from this package via `shells/shared/`. Product shells stay in the app.
