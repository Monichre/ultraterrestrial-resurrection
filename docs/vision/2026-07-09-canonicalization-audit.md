# Canonicalization Audit — Design Language & Domain Vocabulary

**Date:** 2026-07-09 · **Author:** Fable (delegated supervisor) · **Register:** audit
**Scope:** the six candidate identity artifacts; overlap analysis for Product Manifesto + Fable System Prompt; file placement ruling; Brand Bible ingestion status.

---

## 1. Where everything lives (corrected source map)

The task brief located the source packages at `~/Desktop/desk/…`. They have since been moved **into the repo**:

- `docs/design/brand-bible/` — the full Brand Bible package (00–09 + Design Canon).
- `docs/design/reference-prototype/` — the Figma-Make Next.js prototype (own package.json/pnpm-lock; reference code only, never a workspace member).

**Ingestion-status correction** (verified by `cmp` against `apps/app/src/components/design-system/`):

| Design Canon file | Status vs repo copy |
|---|---|
| `RESEARCH_CANVAS_AESTHETIC.md` | byte-identical — ingested |
| `ARCHIVAL_DYSTOPIAN_AESTHETIC.md` | **Canon is NEWER** — adds scope header ("prompt language, not UI rules") |
| `DESIGN_SYSTEM.md` | **Canon is NEWER** — adds "Scope & Motion Guardrails" (reduced-motion, opt-in effects) |
| `RESEARCH_UI_DESIGN_GUIDE.md` | **Canon is NEWER** — fixes invalid CSS (`rotate(-1deg to -3deg)` → CSS custom property), SCSS→CSS notes |
| `README.md` | **Canon is NEWER** — adds Related Docs cross-links |

The Design Canon copies incorporate the corrections from `04_DESIGN_REVIEW_NOTES.md`; the repo's `design-system/` copies are the stale ones. **Recommended follow-up (not executed here):** sync the four corrected Canon files over the repo copies.

Genuinely un-ingested Brand Bible material: `00_MASTER_BRAND_BIBLE.md`, `01_RESEARCH_UI_AGENT.md`, `02_IMPLEMENTATION_ROADMAP.md`, `03_POLAROIDS_COMPONENT_SPEC.md`, `04_DESIGN_REVIEW_NOTES.md`, `05_PROMPT_TOKENS.md`, `06_DESIGN_TOKENS.ts`, `08_PROMPT_LIBRARY/`, `09_CANVAS_STUDIES/EVIDENTIARY_SUBLIME.md`, `UFO files.md`.

Figma links (no code access; pending whoever has Figma MCP): Document Library Design, Visual Archaeology Timeline, UN-DEFECTTAL Poster (all Figma Make), Ultraterrestrial Design Lab (design file). Recorded in T-038.

## 2. Product Manifesto — audit verdict: EXTEND IN PLACE, do not draft new

Coverage is already high:

- `PRODUCT.md:5-7` — purpose statement ("integrated research narrative engine…", "rigor and reverence", never flatten mystery) IS the manifesto's thesis.
- `PRODUCT.md:9-11` — users (Vallée-grade methodology, "distrust hype, notice sloppy epistemology").
- `PRODUCT.md:19-24` — anti-references; `PRODUCT.md:26-31` — strategic principles (deterministic floor, evidentiary states first-class, "Claim" reserved, reference execution).
- `docs/plans/2026-07-08-memory-first-vision-capture.md` §1-§8, §26-§27 — the long-form soul (what it is / is not, emotional center, "What remains weird?", cleanest + poetic articulations).

**Gap:** PRODUCT.md doesn't carry the Brand Bible's Core Rule ("Does this make the impossible feel investigable?") or the Final Direction line ("the paperwork left behind after reality got breached"). Both belong in PRODUCT.md's Brand & Tone section — a 3–5 line extension, not a new document. A second manifesto file would fork the register and violate PRODUCT.md's own role as the root `register: product` doc. **Recommendation: extend PRODUCT.md in place (~5 lines). Awaiting user blessing; not executed.**

## 3. Fable System Prompt — audit verdict: mostly EXISTS AS CODE; canonicalize by extraction, not authorship

- Vision doc §11 (role definition + 7 operating principles) and §20 (system-prompt skeleton) are the drafts.
- Those drafts are already **shipped, adapted, in two places**: `actions/enrich-hypothesis.ts:49-61` and `actions/synthesize-investigation.ts:98-112` — both open "You are the research intelligence layer inside Ultraterrestrial…", carry the operating principles, the liturgy, the "never proves" rule, and the tone line ("field anthropology meets intelligence analysis — controlled, a little uncanny, no cheap certainty").
- The voice contract governing all prompts: `apps/app/src/features/mindmap/CLAUDE.md:37-52`.
- Both live route prompts were rewritten with UT identity in Vision Phase 0 (T-037 log, `docs/plans/TODO.md` T-037 "Vision Phase 0 done").

**Gap:** there is no single canonical prompt file — the shared preamble is duplicated across two actions and two routes, and will drift. **Recommendation:** when blessed, extract the shared system-prompt core to one module (e.g. `apps/app/src/lib/ai/ut-voice.ts`) that actions/routes compose, and let `docs/vision/AGENT_ARCHITECTURE_BRIEF.md` §"Shared voice core" be its doc-side mirror. Do NOT write a standalone prose "Fable System Prompt.md" — it would be a third divergent copy. **Not executed in this pass, per instruction.**

## 4. File placement ruling (executed)

**Home: `docs/vision/`.** Reasoning:

- Root level is reserved for the two `register: product` canon docs (PRODUCT.md:3, DESIGN.md:3); four more root files would dilute that register.
- `docs/plans/` is the three-tier project-management lineage plus dated working plans — identity content explicitly doesn't belong there (and the 2026-07-08 vision pair already strains that rule; they stay put as dated historical records, cross-referenced from here).
- `docs/design/canvas/STYLE.md` shows the repo pattern for narrow *contracts*; these four artifacts are broader than contracts but narrower than product canon → a peer directory named for the lineage they extend ("vision") is the honest middle.
- Each artifact carries a `register:` header per root-doc convention: `register: rubric`, `register: language`, `register: agents`, `register: implementation`.

Files created in this pass:

1. `docs/vision/2026-07-09-canonicalization-audit.md` (this file)
2. `docs/vision/RESEARCH_NARRATIVE_RUBRIC.md`
3. `docs/vision/UX_LANGUAGE_GUIDE.md`
4. `docs/vision/AGENT_ARCHITECTURE_BRIEF.md`
5. `docs/vision/IMPLEMENTATION_SPEC.md`

Ticket: T-038 in `docs/plans/TODO.md`.

## 5. What remains open

- Product Manifesto extension of PRODUCT.md (§2 above) — user decision.
- Fable System Prompt extraction to a shared module (§3 above) — user decision.
- Sync the four corrected Design Canon files over `apps/app/src/components/design-system/` (§1).
- Brand Bible visual ingestion (tokens 06 → design system; Polaroid spec 03; roadmap 02 harvest) — see T-038.
- Prototype mining audit in the mold of `docs/plans/2026-06-20-ufo-ui-cannibalization-audit.md` — deferred, secondary per the delegation brief.
- Four Figma files — blocked on Figma access.
