# Work Log — Design & Identity Canonicalization
**Session ID:** design-identity-20260709-140000 (approx.)
**Date:** 2026-07-09
**Focus area:** docs / design-system / process
**Agent:** Claude Code (Sonnet 5), with a delegated Fable-model sub-agent (`fable-design-canon`)

## Summary

Started from a request to structure and ingest an official Ultraterrestrial design
language (a Brand Bible package + a Figma-Make Next.js prototype, both previously
sitting on the user's Desktop, plus 4 Figma links). Ended up covering: source
ingestion, a delegated canonicalization pass, a correction to an over-formalized
"two aesthetics" framing, and a process change for how this kind of work gets
captured going forward.

## What happened, in order

1. **Initial plan** (`/plan`) proposed a `docs/design/brand/` + `references/`
   structure for ingesting the Brand Bible package
   (`~/Desktop/Ultraterrestrial_Research_UI_Package`) and the Next.js prototype
   (`~/Desktop/ultraterrestrial-document-library-design-system`), modeled on the
   existing `docs/plans/2026-06-20-ufo-ui-cannibalization-audit.md` precedent.
2. User reframed the ask mid-plan: wanted 6 candidate artifacts (Product Manifesto,
   Fable System Prompt, Research Narrative Rubric, UX Language Guide, Agent
   Architecture Brief, Implementation Spec), later narrowed to drafting only the
   last four now, with an audit-first approach on the first two.
3. **Delegated to a Fable-model agent** (`fable-design-canon`, backgrounded) to own
   planning and supervision of the actual canonicalization, per explicit user
   instruction to hand this off.
4. Fable corrected two things in the original brief: the source folders were
   already moved into `docs/brainstorms/` (not still on Desktop), and only
   `RESEARCH_CANVAS_AESTHETIC.md` is byte-identical to the repo's copy — the other
   three Design Canon files are *newer* and carry unapplied corrections. Fable
   produced `docs/vision/{2026-07-09-canonicalization-audit.md, RESEARCH_NARRATIVE_RUBRIC.md,
   UX_LANGUAGE_GUIDE.md, AGENT_ARCHITECTURE_BRIEF.md, IMPLEMENTATION_SPEC.md}` and
   added ticket **T-038** to `docs/plans/TODO.md`.
5. User then explicitly descoped the `PRODUCT.md` decision ("wasn't meant to be
   as substantial as it came off... I don't want to fuck around with the product
   MD file right now") and raised the real question underneath the original
   design-language ask: reconciling what felt like two different aesthetics —
   a minimal/dark/futuristic 3D "app" register (timeline, personnel, sightings,
   OSINT/HUD) vs. an archival/paper "research desk" register (the shipped
   Microfilm Dark canvas).
6. A quick grounding check (not a full audit) found this tension was already
   anticipated in the Brand Bible's own "Visual Modes" section — one of 7 named
   modes is literally "Noir Research Canvas + AI War Room" — and that real 3D
   substrate already exists (`apps/app/src/features/3d/scroll-through-3d/`,
   `spatial-gallery`, `3d-graph`, `spherical-connection-graph`), largely unwired
   into the Timeline/Personnel/Sightings surfaces. Also surfaced likely duplicate
   surfaces (`(site)/timeline` at 37 lines vs. `research-canvas/views/timeline/page.tsx`
   at 482 lines) as separate cleanup, not a design-identity question.
7. User corrected the framing further: not two product lines, but two **content
   registers** that coexist per-surface because the subject matter itself is both
   technical and archival; the connective tissue they actually want is a shared
   **paper/texture materiality primitive** usable anywhere data renders as a
   document/file, not a mode-picker system. Captured as `docs/vision/DESIGN_REGISTERS.md`.
8. User then asked for a standing process change: auto-reflect-and-persist these
   conversations without being asked, standing authorization to delegate
   reflection/brainstorm/analysis work to Sonnet subagents, and a guarantee that
   any agent from any platform waking into the repo can find this material.
   Handled by: two new feedback memories (see below), an `AGENTS.md` addition
   pointing at `docs/vision/`, four new TODO tickets (T-039–T-042), and this log.
9. User also opened a live discussion thread (not yet actioned) about
   app-specific custom agents with memory/specialization/shared context, local
   vs. cloud (Claude Managed Agents) persistence — tracked as T-042, addressed
   as a brainstorm in the same conversation turn.

## Files touched/created this session

- `docs/vision/2026-07-09-canonicalization-audit.md` (Fable)
- `docs/vision/RESEARCH_NARRATIVE_RUBRIC.md` (Fable)
- `docs/vision/UX_LANGUAGE_GUIDE.md` (Fable)
- `docs/vision/AGENT_ARCHITECTURE_BRIEF.md` (Fable)
- `docs/vision/IMPLEMENTATION_SPEC.md` (Fable)
- `docs/vision/DESIGN_REGISTERS.md` (main thread)
- `docs/plans/TODO.md` — T-038 (Fable), T-039–T-042 (main thread)
- `AGENTS.md` — new "Identity & Design Canon" section pointing to `docs/vision/`
- `~/.claude/.../memory/auto-reflect-persist-design-conversations.md` (new)
- `~/.claude/.../memory/sonnet-subteam-delegation-standing-authorization.md` (new)
- This file

## Open decisions (not made by the assistant — genuinely the user's call)

- Product Manifesto: extend `PRODUCT.md` in place (~5 lines) vs. new file —
  **parked at user's request**, not decided.
- Fable System Prompt: extract the duplicated voice-core prompt
  (`enrich-hypothesis.ts:49-61`, `synthesize-investigation.ts:98-112`) into a
  shared module vs. new prose doc — **parked**, not decided.
- Whether/how to extract the Microfilm Dark texture primitives (grain,
  redaction-bar skeleton, dossier-corner clip) into a shared component so
  Timeline/Personnel/Sightings can use them — raised, not yet actioned.
- Custom agent architecture (T-042) — open brainstorm, no direction chosen.

## Next up (per user's stated sequence)

1. Finish/resolve the texture-primitive extraction thread (parked above).
2. `docs/plans/TODO.md` T-039 — documentation cleanup & simplification.
3. T-040 — Linear integration for task tracking.
4. T-041 — roundtable UX/UI review (app + concept + brainstorm docs).
