---
name: visual-language
description: Load one of the visual lab's three product surface families, then retrieve only the deeper reference material needed for the interface being designed.
type: skill
created: 2026-08-16
author: agent
steward: Liam Ellis
tags: [visual-language, design-lab, prompts, tokens, interfaces, context]
---

# Visual Language

Use this skill for every new interface, page, component family, design prompt, visual identity
surface, or substantial redesign grounded in this vault.

This is a visual-lab skill. It exists to make the next design unmistakably informed by accumulated
research. It is not a lore generator and it is not permission to paste dossier props onto generic UI.

## Required reading

Read these completely before designing:

1. `language/visual-language.json` — canonical Visual Lanes and deeper reference grammar.
2. `VISUAL_LANGUAGE.md` — generated human guide.
3. `prompts/language-policy.md` — vocabulary and provenance discipline.
4. The source documents and Gold Extractions named by the selected Visual Lane and reference family.

## Preflight

1. State the interface's actual job in one sentence without aesthetic language.
2. Run `python3 scripts/visual_language.py list`.
3. For app-facing work, choose one priority application surface: `home-entry`, `research-canvas`, `archive-record`, or `spacetime-observatory`.
4. Use its owning Visual Lane and named embedded lanes. For non-app work, choose exactly one lane directly: `core-interface`, `evidence-archive`, or `tactical-spatial`.
5. Retrieve zero to two deeper reference families only after the priority surface and lane are fixed.
6. Run:

```bash
python3 scripts/visual_language.py context \
  --focus-surface <home-entry|research-canvas|archive-record|spacetime-observatory> \
  [--reference <reference-family>]
```

For a component, prompt, or artifact outside those four app surfaces, use `--surface <core-interface|evidence-archive|tactical-spatial>` instead.

7. Keep the complete output in working context. Do not summarize it down to three adjectives.
8. Open at least two named Gold Extractions and one named rule source before proposing a direction.

## Design workflow

1. Produce the Visual DNA Checksum from the context pack before implementation.
2. Keep the working hierarchy explicit: priority surface → Visual Lane → reference family → Gold Extraction and tokens.
3. Resolve palette and typography from canonical token and role names.
4. Name one composition law and one signature move. If neither can be named, the direction is still generic.
5. Set narrative theater explicitly from 0-3. Use the selected lane's default unless the task supplies a reason to change it.
6. Design the functional hierarchy first. Apply material and theater only after the screen works without them.
7. For implementation, use semantic tokens and preserve the selected lane's texture budget.
8. For image generation, compose prompts from the selected lane, retrieved reference family, and `design/brand-bible/05_PROMPT_TOKENS.md`; do not paste the whole master token into every prompt.
9. Review against the Mark Test before calling the work complete.

## Visual DNA Checksum

Every design direction must state:

- priority application surface, or custom/non-app;
- owning surface family;
- embedded surface family, if any;
- retrieved reference families, if any;
- interface job;
- narrative level;
- at least three source citations, including Gold Extractions;
- palette tokens;
- typography roles;
- texture budget;
- composition law;
- signature move;
- prohibited moves.

This checksum is a design constraint, not final-page copy.

## Hard rules

- Visual system first; narrative and mythological theater second.
- One owning Visual Lane. Other lanes may appear only as intact embedded components or fields.
- App-facing visual work defaults to Home / Entry, Research Canvas, Archive / Record, or Spacetime Observatory until those four are coherent.
- Existing routes and experiments do not automatically earn a separate visual doctrine.
- The eight deeper reference families are retrieval labels, not competing app styles.
- Retrieve no more than two reference families for one direction.
- No invented palette values when canonical tokens cover the need.
- No generic SaaS composition with archival decoration pasted on afterward.
- No typewriter monoculture.
- No texture without a named material role.
- No red strings, stamps, redactions, HUD rings, or glyphs without semantic purpose.
- No claims of visual alignment without cited source evidence.
- If no lane fits, the product architecture is changing; return to the lab instead of quietly inventing a fourth.
- If no reference family fits, research a candidate beneath an existing lane before expanding the deeper catalog.

## Done condition

The context pack was loaded, the source visuals were inspected, the Visual DNA Checksum is complete,
the design passes the Mark Test, canonical token names are used, and the owning Visual Lane remains
legible through the finished interface while any embedded lane keeps a clean boundary.
