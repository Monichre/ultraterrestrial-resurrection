# DesignLabUiBrief — Pseudocode

Timestamp: 2026-07-24 ~04:20 CDT  
Workspace: `/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection`  
Subject: `packages/design-lab` UI design brief (idea-to-ui-design-brief stage)

## Goal

Turn the existing design-lab asset pile (4 HTML surface prototypes + reference imagery) into a practical UI design brief that:

1. Describes what those surfaces are *for* inside Ultraterrestrial (not a disconnected SaaS product)
2. Aligns visual direction to Microfilm Dark / archival dossier + clinical HUD
3. Gives implementers screen notes, component inventory, flows, states, and handoff
4. Stores three image-concept prompts without generating images
5. Surfaces open taste questions for the product owner

## Inputs (read / infer)

```
READ DESIGN.md                          → tokens, typography, signature elements, bans
READ PRODUCT.md                         → purpose, users, voice, anti-references
READ docs/vision/DESIGN_REGISTERS.md    → techno-analytical + archival-material coexistence
READ docs/vision/UX_LANGUAGE_GUIDE.md   → reserved words, badges, copy rules
READ docs/vision/RESEARCH_NARRATIVE_RUBRIC.md → evidentiary gates
SKIM docs/vision/UI_INSPIRATION.md      → mood only, not clone targets

EXPLORE packages/design-lab/
  - prototypes/01-living-research-canvas.html
  - prototypes/02-evidence-ledger.html
  - prototypes/03-temporal-geospatial-observatory.html
  - prototypes/04-hypothesis-lab.html
  - prototypes/interface-gallery-overview.png + dossier-art/ / textures / ui-mockups/
  - NOTE: no package.json, no README, no document-system/ (HTML links to missing CSS)

CROSS-REF apps/app/src/app/design-lab/  → guided-tour variants (related lab, not this package)
CROSS-REF apps/app research-canvas shell → live product surface the lab prototypes toward
```

## Infer product frame

```
IF packages/design-lab is prototype/reference store:
  purpose = "design sandbox for Ultraterrestrial research surfaces"
  users   = designers + coding agents porting lab HTML → apps/app
  NOT     = standalone SaaS dashboard product

primary_product_feel =
  Microfilm Dark night desk
  + paper evidence objects on void canvas
  + low-opacity clinical HUD chrome
  + rigor/reverence epistemology (no premature closure)

platform = desktop web (1440×960 lab artboards; large-monitor researcher sessions)
```

## Derive surfaces from HTML

```
surfaces = [
  Living Research Canvas,        // investigation board: pins, threads, paper cards, inspector
  Evidence Ledger,               // claim workspace: support/challenge lanes + provenance
  Temporal–Geospatial Observatory, // map + chronology brush
  Hypothesis Lab                 // competing readings + ranking + bounded synthesis
]

shared_chrome = icon rail + brand topbar + search + sync chip
  // FLAG: prototypes use Inter/Georgia/rounded SaaS chrome —
  // brief must correct toward DESIGN.md (Martian Mono, Special Elite, clipped corners)
```

## Brief assembly algorithm

```
WRITE DesignLabUiBrief_PSUEDOCODE.md   // this file
WRITE packages/design-lab/UiDesignBrief.md
  WITH sections:
    Purpose, Product Feel, Design Principles,
    Primary Surfaces, Screen-by-Screen Notes,
    Layout/IA, Component Inventory, Key Flows, States,
    Visual Direction, A11y/Responsiveness, Content/Copy,
    Optional Image-Generation Concepts (Conservative/Strong-fit/Divergent),
    Selected Direction, Open Questions, Handoff Notes

WRITE packages/design-lab/DesignLabUiBrief.md
  WITH:
    architecture of the brief itself
    key modules (surfaces, shared chrome, epistemic overlays)
    data flow between lab surfaces ↔ research-canvas product
    pointer to UiDesignBrief.md as skill artifact
    selected direction summary

FOR image_prompts:
  WRITE three prompts in brief
  SKIP GenerateImage (prompts only)

WRITE canvas design-lab-ui-brief.canvas.tsx
  AT ~/.cursor/projects/.../canvases/
  IMPORT ONLY from cursor/canvas
  EMBED brief summary inline (surfaces, principles, inventory, direction, questions, prompts)
  USE useHostTheme() tokens; no gradients/emojis/box-shadows/rainbow/empty states
```

## Selected-direction decision rule

```
score_directions:
  Conservative = tame dark admin + soft paper cards (easy port, weak brand)
  Strong-fit   = Microfilm Dark + paper materiality + epistemic HUD (matches PRODUCT/DESIGN)
  Divergent    = full archival desk / film-light / minimal chrome (taste boundary)

SELECT Strong-fit
REASON:
  - prototypes already stage paper-on-void investigation
  - DESIGN.md + DESIGN_REGISTERS already lock the registers
  - Conservative under-delivers brand; Divergent risks losing clinical instrumentality
```

## Gap flags to surface in Open Questions

```
- Rail/topbar permanence vs FullScreenMenu / CommandK in live app
- Numeric "credibility" scores vs Evidentiary Weight language
- Side-stripe source cards (banned in DESIGN.md) → replace with badge grammar
- Missing document-system CSS — revive or drop reference
- How much of Evidence Ledger / Observatory / Hypothesis Lab ships as views vs overlays
- Paper-card rotation / corkboard metaphor vs flatter dossier panels in production
```

## Outputs checklist

```
[ ] DesignLabUiBrief_PSUEDOCODE.md
[ ] UiDesignBrief.md               (skill structure)
[ ] DesignLabUiBrief.md            (PascalCase architecture + brief spine)
[ ] design-lab-ui-brief.canvas.tsx (interactive review)
[ ] NO git commit
[ ] NO GenerateImage
```

## Done when

Parent agent can return absolute paths, selected-direction paragraph, canvas link, open questions, and "images skipped / prompts only".
