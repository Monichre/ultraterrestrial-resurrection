# Polaroids Component Specification

## Purpose

The Polaroid system provides reusable field-evidence photography components for the Ultraterrestrial Research Platform. These components should feel like physical evidence recovered from a classified archive, taped to a dossier, pinned to a research board, or arranged in a surveillance contact sheet.

## Working Directory

```text
apps/app/src/components/design-system/research-ui/photography/polaroids/
```

## Suggested File Structure

```text
polaroids/
├── PolaroidFrame.tsx
├── PolaroidEvidenceCard.tsx
├── DistressedPolaroid.tsx
├── TapedPolaroid.tsx
├── PolaroidStack.tsx
├── PolaroidContactSheet.tsx
├── polaroid-textures.css
├── polaroid.types.ts
└── index.ts
```

## Visual Mode

Primary mode: `field-evidence`

Allowed secondary modes:

* `archive-document`
* `noir-research-canvas`
* `dystopian-collage`, only for hero/case-cover use

Avoid combining Polaroids with heavy HUD overlays unless used in a research workspace.

## Component: PolaroidFrame

Base photographic evidence container.

### Required Features

* Off-white photo border.
* Larger bottom caption area.
* Slight rotation prop.
* Optional handwritten caption.
* Optional timestamp.
* Optional evidence ID.
* Optional classification tag.
* Grayscale, sepia, contrast, and aged-photo filters.
* Tape/corner attachment options.

### TypeScript Props

```ts
export type ClassificationLevel =
    | "unclassified"
    | "confidential"
    | "secret"
    | "top-secret";

export type PolaroidVariant =
    | "clean"
    | "aged"
    | "burned"
    | "water-damaged"
    | "surveillance";

export type TapeVariant =
    | "none"
    | "top"
    | "corners"
    | "diagonal";

export type PolaroidFrameProps = {
    src: string;
    alt: string;
    caption?: string;
    evidenceId?: string;
    timestamp?: string;
    classification?: ClassificationLevel;
    rotation?: number;
    variant?: PolaroidVariant;
    tape?: TapeVariant;
    className?: string;
};
```

### Behavior

* Rotation should be controlled by CSS variable.
* Caption should use handwritten or typewriter style depending on prop or variant.
* Decorative texture overlays must be `aria-hidden="true"`.
* Image `alt` is required.

### Example JSX

```tsx
<PolaroidFrame
    src="/evidence/sighting-0424.jpg"
    alt="Blurred nighttime object above a desert horizon"
    caption="Object held position for 47 seconds"
    evidenceId="UT-NM-1964-0424-PHOTO-01"
    timestamp="1964-04-24T17:45:00Z"
    classification="secret"
    rotation={-2}
    variant="aged"
    tape="top"
/>
```

## Component: PolaroidEvidenceCard

A Polaroid designed for case files and evidence stacks.

### Required Features

* Evidence number.
* Chain-of-custody status.
* Source reliability.
* Associated case ID.
* Optional redaction overlay.
* Optional annotation pins.
* Metadata rail or footer.

### Suggested Props

```ts
export type ChainOfCustodyStatus =
    | "unknown"
    | "partial"
    | "documented"
    | "verified";

export type SourceReliabilityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type PolaroidEvidenceCardProps = PolaroidFrameProps & {
    caseId: string;
    evidenceNumber: string;
    chainOfCustody?: ChainOfCustodyStatus;
    reliability?: SourceReliabilityLevel;
    redacted?: boolean;
    analystNote?: string;
};
```

## Component: DistressedPolaroid

Cinematic damaged archive variant.

### Distress Options

* Scratches.
* Dust.
* Fingerprints.
* Burn marks.
* Water stains.
* Torn corners.
* Emulsion damage.
* Chemical discoloration.

### Suggested Props

```ts
export type DistressLevel = 0 | 1 | 2 | 3;

export type DistressedPolaroidProps = PolaroidFrameProps & {
    distressLevel?: DistressLevel;
    scratches?: boolean;
    waterDamage?: boolean;
    burnDamage?: boolean;
    tornCorners?: boolean;
    fingerprints?: boolean;
};
```

## Component: TapedPolaroid

Polaroid attached to a dossier surface.

### Features

* Masking tape strips.
* Rotation.
* Shadow lift.
* Tape opacity.
* Torn-tape edge simulation.
* Optional pin or staple.

### Tape Placement

```ts
export type TapePlacement =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "corners"
    | "diagonal"
    | "cross";
```

## Component: PolaroidStack

Layered stack of multiple evidence photos.

### Features

* Controlled random rotation.
* Stacked z-index.
* Hover/focus reveal.
* Keyboard-accessible cycling.
* Optional selected photo state.
* Optional count badge.

### Accessibility

* Stack must expose photo count.
* Keyboard users must be able to focus or cycle through photos.
* Selected photo must have visible state and ARIA label.

## Component: PolaroidContactSheet

Surveillance/evidence review grid.

### Features

* Grid of small frames.
* Numbered cells.
* Red grease-pencil circles.
* Crosshair overlays.
* Timestamp strips.
* Analyst notes.
* Optional “selected” state.

### Use Cases

* Evidence review.
* Surveillance sequence.
* Contact sheet from field camera.
* Witness photo comparison.

## CSS Starter

```css
.polaroid-frame {
    --polaroid-rotation: -1deg;
    position: relative;
    display: inline-block;
    padding: 10px 10px 34px;
    background: #f7f3e8;
    border: 1px solid rgba(23, 23, 23, 0.18);
    box-shadow:
        0 8px 20px rgba(0, 0, 0, 0.25),
        inset 0 0 0 1px rgba(255, 255, 255, 0.45);
    transform: rotate(var(--polaroid-rotation));
    filter: contrast(1.04) saturate(0.92);
}

.polaroid-frame__image-wrap {
    position: relative;
    overflow: hidden;
    background: #111;
    aspect-ratio: 1 / 1;
}

.polaroid-frame__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.35) contrast(1.12) sepia(0.12);
}

.polaroid-frame__caption {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 8px;
    font-family: var(--font-caveat, "Kalam", cursive);
    font-size: 14px;
    color: var(--ink-faded, #4a4a4a);
    transform: rotate(-0.8deg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.polaroid-frame__texture,
.polaroid-frame__scratches,
.polaroid-frame__dust,
.polaroid-frame__burn,
.polaroid-frame__tape {
    position: absolute;
    pointer-events: none;
}

.polaroid-frame__texture {
    inset: 0;
    opacity: 0.18;
    mix-blend-mode: multiply;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(90, 53, 36, 0.18), transparent 8px),
        radial-gradient(circle at 78% 64%, rgba(90, 53, 36, 0.14), transparent 6px);
}

.polaroid-frame__tape {
    width: 64px;
    height: 24px;
    background: linear-gradient(
        135deg,
        rgba(220, 220, 210, 0.92),
        rgba(245, 240, 220, 0.82)
    );
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    opacity: 0.86;
}

.polaroid-frame__tape--top {
    top: -12px;
    left: 50%;
    transform: translateX(-50%) rotate(-4deg);
}

.polaroid-frame:hover {
    transform: rotate(var(--polaroid-rotation)) translateY(-2px) scale(1.01);
}

.polaroid-frame:focus-within {
    outline: 2px solid var(--fire-orange, #ff6b35);
    outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
    .polaroid-frame,
    .polaroid-frame:hover {
        transition: none;
        transform: rotate(var(--polaroid-rotation));
    }
}
```

## Storybook Coverage

Stories should include:

* Clean Polaroid.
* Aged Polaroid.
* Burned Polaroid.
* Water-damaged Polaroid.
* Secret evidence photo.
* Top Secret evidence photo.
* Taped to dossier.
* Polaroid stack.
* Contact sheet.
* Mobile layout.
* Reduced motion preview.
* Accessibility example.

## Quality Checklist

* Required `alt` text.
* Metadata does not overpower image.
* Texture is decorative and screen-reader hidden.
* Classification is readable.
* Rotation does not break layout.
* Works in narrow containers.
* Focus state is visible.
* Motion respects user preference.
