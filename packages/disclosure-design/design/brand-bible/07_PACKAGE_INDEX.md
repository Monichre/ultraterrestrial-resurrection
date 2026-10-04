# Package Index

## Location

```text
~/Desktop/Ultraterrestrial_Research_UI_Package
```

## Files

| File | Purpose |
|---|---|
| `README.md` | Package overview and guiding principle |
| `00_MASTER_BRAND_BIBLE.md` | Consolidated brand, visual, product, and editorial system |
| `01_RESEARCH_UI_AGENT.md` | Finalized research UI archival design specialist agent spec |
| `02_IMPLEMENTATION_ROADMAP.md` | Phased build plan and acceptance criteria |
| `03_POLAROIDS_COMPONENT_SPEC.md` | Polaroid and field-evidence component specification |
| `04_DESIGN_REVIEW_NOTES.md` | Review findings, corrections, and recommendations |
| `05_PROMPT_TOKENS.md` | Reusable image-generation and style prompt tokens |
| `06_DESIGN_TOKENS.ts` | TypeScript token starter and shared types |
| `07_PACKAGE_INDEX.md` | This index |
| `08_PROMPT_LIBRARY/` | Reusable prompts, agent personas, and skill definitions (see its README) |
| `Design Canon/` | Maintained source specs: implementation guide, design system, aesthetic references (corrections from `04` applied 2026-06-09) |
| `09_CANVAS_STUDIES/` | Design-philosophy art studies: Evidentiary Sublime manifesto + Plate 047 (PNG/PDF) |

## Fast Start

1. Read `00_MASTER_BRAND_BIBLE.md` for the full design direction.
2. Use `01_RESEARCH_UI_AGENT.md` as the agent spec.
3. Start implementation from `02_IMPLEMENTATION_ROADMAP.md`.
4. Build the Polaroid system from `03_POLAROIDS_COMPONENT_SPEC.md`.
5. Apply review corrections from `04_DESIGN_REVIEW_NOTES.md`.
6. Use `05_PROMPT_TOKENS.md` for visual generation and style consistency.
7. Import or adapt `06_DESIGN_TOKENS.ts` into the app design system.
8. Pull editorial personas and tooling skills from `08_PROMPT_LIBRARY/`.

## Key Principle

> Make the archive feel real first. Add the supernatural and AI layers only where they support investigation.

## Recommended First Development Task

Create the shared tokens and Polaroid system:

```text
apps/app/src/components/design-system/research-ui/tokens/research-ui.tokens.ts
apps/app/src/components/design-system/research-ui/types/visual-modes.ts
apps/app/src/components/design-system/research-ui/photography/polaroids/PolaroidFrame.tsx
apps/app/src/components/design-system/research-ui/photography/polaroids/polaroid.types.ts
apps/app/src/components/design-system/research-ui/photography/polaroids/polaroid-textures.css
apps/app/src/components/design-system/research-ui/photography/polaroids/index.ts
```

## Do Not Forget

* Every component must declare its primary visual mode.
* Use at most one secondary visual mode.
* Respect reduced motion.
* Use ARIA in JSX/HTML, not CSS.
* Do not use invalid CSS such as `rotate(-1deg to -3deg)`.
* Keep AI HUD overlays at 10–20% opacity.
* Never let texture compete with body text.
