# Design Review Notes

## Reviewed Source Materials

The following supplied materials were reviewed and integrated:

* `README.md`
* `RESEARCH_UI_DESIGN_GUIDE.md`
* `DESIGN_SYSTEM.md`
* `ARCHIVAL_DYSTOPIAN_AESTHETIC.md`
* `RESEARCH_CANVAS_AESTHETIC.md`
* `research-ui-agent` spec
* Earlier Ultraterrestrial visual library and brand guidance

## High-Level Review

The supplied documents are strongly aligned. They collectively define a compelling research platform visual system built around:

* Aged government documents.
* Classified UFO/UAP evidence presentation.
* Paper texture and analog degradation.
* Monospace/typewriter text.
* Redacted information.
* Polaroids and field evidence.
* Military-industrial typography.
* Noir investigation mood.
* Subtle AI/HUD overlays.

The direction is strong, but the system needs guardrails to prevent visual overloading.

## Main Risk

The main risk is combining too many aesthetics at once:

* Authentic government document.
* Dystopian UFO collage.
* Noir detective board.
* Futuristic AI HUD.
* Glitch sci-fi interface.
* Fire/portal effects.
* Myth-tech glyphs.

Recommendation:

```text
Each component should have one primary visual mode and at most one secondary accent mode.
```

Good:

```text
PersonnelFileCard = archive-document + subtle handwritten annotation.
```

Good:

```text
ResearchWorkspace = noir-research-canvas + low-opacity AI HUD.
```

Too much:

```text
Case card with aged paper + fire + UFO + red string + neon HUD + glitch + scanlines + handwriting + blueprint grid.
```

## Recommended Visual Mode Metadata

```ts
export type ResearchVisualMode =
    | "archive-document"
    | "dystopian-collage"
    | "noir-research-canvas"
    | "ai-war-room"
    | "technical-blueprint"
    | "field-evidence";

export type ResearchComponentMetadata = {
    visualMode: ResearchVisualMode;
    secondaryMode?: ResearchVisualMode;
    archivalIntensity: 0 | 1 | 2 | 3;
    digitalOverlayIntensity: 0 | 1 | 2 | 3;
    textureIntensity: 0 | 1 | 2 | 3;
};
```

## Review: README.md

### Keep

* Clear overview.
* Good typography examples.
* Good Storybook guidance.
* Solid accessibility and contribution sections.

### Improve

* Add direct links to `RESEARCH_UI_DESIGN_GUIDE.md` and `DESIGN_SYSTEM.md`.
* Replace generic Tailwind examples like `bg-amber-50` with actual design tokens where possible.
* Add classification color variables from the research UI guide.
* Add a visual modes section.

### Suggested Addition

```markdown
## Visual Modes

The design system supports six primary research visual modes:

* `archive-document` — authentic declassified documents.
* `field-evidence` — Polaroids, photos, recovered fragments and witness material.
* `technical-blueprint` — schematics, diagrams and anomalous technology analysis.
* `noir-research-canvas` — corkboards, red string, desk evidence and investigation walls.
* `ai-war-room` — modern analytical HUD overlays and graph interfaces.
* `dystopian-collage` — cinematic classified poster/case-cover compositions.
```

## Review: RESEARCH_UI_DESIGN_GUIDE.md

### Keep

* Strongest and most complete implementation reference.
* Good CSS structure.
* Good component-specific rules.
* Good accessibility coverage.
* Good performance guidance.

### Improve

* Avoid literal CSS `@extend` unless the project uses SCSS.
* `transform: rotate(-1deg to -3deg);` is invalid CSS.
* `aria-hidden: true;` inside CSS is invalid.
* Consider separating implementation CSS from conceptual guidance.

### Correction: Rotation Variance

Invalid:

```css
.document-handwritten {
    transform: rotate(-1deg to -3deg);
}
```

Use:

```css
.document-handwritten {
    --note-rotation: -2deg;
    transform: rotate(var(--note-rotation));
}
```

### Correction: ARIA in CSS

Invalid:

```css
.paper-aging-spots {
    aria-hidden: true;
}
```

Use in JSX:

```tsx
<span className="paper-aging-spots" aria-hidden="true" />
```

## Review: DESIGN_SYSTEM.md

### Keep

* Good global palette.
* Useful dystopian UFO collage CSS.
* Strong cinematic visual vocabulary.
* Good animation ideas.

### Improve

* Full-screen collage styles should not be mixed into standard document cards.
* `100vw` / `100vh` collage containers should be reserved for hero scenes.
* Fire, glitch, and portal effects should be opt-in variants, not defaults.
* Add `prefers-reduced-motion` coverage for all infinite animations.

### Required Reduced-Motion Patch

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
    }
}
```

## Review: ARCHIVAL_DYSTOPIAN_AESTHETIC.md

### Keep

* Excellent prompt-language reference.
* Strong typography direction.
* Useful mood descriptors for classified UFO report aesthetics.
* Good font references: Eurostile, Bank Gothic, DIN, military/industrial sans.

### Improve

* Convert into reusable prompt tokens.
* Avoid using `UN:DEFECTTAL` as a literal unless intentionally part of the fictional document world.
* Define which parts are for image generation versus UI implementation.

### Suggested Prompt Token

```text
UT_DYSTOPIAN_SURVEILLANCE:
stylized classified document aesthetic, sci-fi UFO surveillance report format, dramatic otherworldly landscape photograph, metallic flying saucer, barren rocky terrain, orange-red fire outbreaks, grey mountainous silhouettes, monochromatic scheme with vivid flame accents, technical data margins, timestamps, reference codes, weathered paper texture, black borders, redacted text, ID photo corner, military-industrial paranormal documentation, X-Files Area 51 mood
```

## Review: RESEARCH_CANVAS_AESTHETIC.md

### Keep

* Excellent direction for research workspace screens.
* Strong analog/digital blend.
* Good font list.
* Good physical token list.
* Good AI HUD layer guidance.

### Improve

* Keep neon accents low-opacity in production UI.
* Define where AI HUD overlays are allowed.
* Avoid hot magenta and acid green on primary document-reading surfaces.
* Use modern overlays as “digital ghosts,” not primary UI decoration.

### Recommended Rule

```markdown
AI HUD overlays should sit at 10–20% opacity and must never reduce text contrast or obscure primary evidence.
```

## Consolidated Color Review

The attached docs mostly agree on the core palette. Normalize around:

```css
:root {
    --bg-paper: #f4f1e8;
    --bg-paper-aged: #e8e2d5;
    --ink-black: #1a1a1a;
    --ink-faded: #4a4a4a;
    --fire-orange: #ff6b35;
    --fire-yellow: #ffd23f;
    --smoke-gray: #7d8491;
    --sky-dusk: #8b95a7;
    --grid-lines: rgba(0, 0, 0, 0.15);
    --noise-overlay: rgba(139, 129, 114, 0.3);
    --classification-unclassified: #16a34a;
    --classification-confidential: #eab308;
    --classification-secret: #ea580c;
    --classification-top-secret: #dc2626;
}
```

## Font Review

Recommended layered font system:

### Official / Archival

* Courier New.
* Special Elite.
* OCR-A-style fonts.
* JetBrains Mono.
* Martian Mono.

### Stamped / Classification

* Anton.
* Impact-like condensed sans.
* Bank Gothic / DIN / Eurostile-inspired technical sans.
* PP Neue Montreal.

### Handwritten / Field Notes

* Caveat.
* Just Another Hand.
* Kalam.

### Modern UI / AI War Room

* PP Neue Montreal.
* Monument Grotesk.
* Neue Haas Grotesk.
* Noto Sans.
* Lukas Sans.

## Production Recommendation

Prefer self-hosting licensed fonts where possible instead of loading from third-party CDNs.

## Summary Recommendation

The additions are strong and should be incorporated, but the system must separate:

* Reusable UI components.
* Cinematic collage visuals.
* Prompt-generation aesthetics.
* AI HUD overlays.
* Historical document simulation.

Controlling principle:

> Make the archive feel real first. Add the supernatural and AI layers only where they support investigation.
