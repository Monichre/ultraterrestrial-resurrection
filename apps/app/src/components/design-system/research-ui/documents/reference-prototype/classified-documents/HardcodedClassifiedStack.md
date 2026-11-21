# HardcodedClassifiedStack

## Purpose

Visual-reference dual-document stack (UCASEWEIL + Gordon Cooper / Mercury 9) migrated from the Downloads donor `classified-document.tsx`.

## Why separate from ClassifiedDocument

`ClassifiedDocument.tsx` is the data-driven / props-based classified document. This component preserves the **hardcoded donor composition** (polaroids, tape, aged stains, CLASSIFIED stamp) for design review without overwriting that API.

## Architecture

| Piece | Role |
| --- | --- |
| `HardcodedClassifiedStack` | Named (+ default) export; two `<Card>` documents stacked |
| `PhotoCaption` | Shared caption primitive from `../PhotoCaption` |
| `Card` | App UI card (`@/components/ui/card`) |

## Data flow

None — fully hardcoded markup and remote image URL. No props.

## Storybook

`Design Sources/Reference Prototype/Document Library` → `HardcodedClassifiedStack`

## Provenance

- Donor: `/Users/liamellis/Downloads/classified-document.tsx`
- Migrated: 2026-07-24
