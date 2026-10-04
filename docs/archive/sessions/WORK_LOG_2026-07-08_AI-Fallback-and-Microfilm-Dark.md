# Work Log — AI Fallback Hardening + Microfilm Dark Canvas UI

- **Date/Time:** 2026-07-08, ~13:00–18:00 local (commits landed 15:20 and 15:41 CDT)
- **Session ID:** ai-integration-20260708-152052
- **Focus Area:** ai-integration + frontend-ui
- **Agent:** Claude Code (Fable 5)
- **Branch:** dev
- **Commits:** `37d9a6c`, `0ce78d6`

## Summary

Two commits landed on `dev`. The first hardened the frontier model fallback chain so it survives real-world provider failures, verified against a new permanent live smoke script — the chain now degrades correctly through OpenAI, Anthropic, Groq, and z.ai (all failing billing-side) and lands on Gemini 3 Flash, which served the first live end-to-end "Synthesize Investigation" dossier in the UI. The second commit introduced "Microfilm Dark," an archival dystopian dark design language for the research canvas, codified in new repo-root `PRODUCT.md` and `DESIGN.md` documents and applied across the synthesis panel, suggestions dock, toolbar, and graph.

Typecheck held at the established baseline of 1901 pre-existing errors (zero new). All three synthesis panel states were verified live in Chrome.

## Work Completed

### Commit `37d9a6c` — fix(ai): fallback chain survives real-world provider failures

Hardened `apps/app/src/lib/ai/model-fallback.ts` after a live smoke run surfaced four independent failures. Also added a permanent smoke script.

Files (2 changed, +131 / −11):
- `apps/app/src/lib/ai/model-fallback.ts` (+64 / −11)
- `apps/app/scripts/smoke-model-fallback.ts` (new, +78)

Fixes:
- **Env-key alias gating (any-of matching):** a tier is now considered configured if any of its aliased keys is present — `GOOGLE_GENERATIVE_AI_API_KEY | GOOGLE_API_KEY | GEMINI_API_KEY` for Google, and `ZHIPU_API_KEY | GLM_API_KEY` for z.ai. GOOGLE is preferred over GEMINI because Google revoked the `GEMINI_API_KEY` as publicly leaked (see Security Flags).
- **z.ai OpenAI-compat fix:** must use `createOpenAI(...).chat('glm-5.2')`, because z.ai only serves `chat/completions`, not the OpenAI Responses API.
- **Gemini thinking fix:** set `providerOptions.google.thinkingConfig.thinkingBudget = 0` on both Google tiers. Without it, Gemini 3's reasoning silently consumed the entire `maxOutputTokens` budget and returned empty text.
- **Per-tier retries + backup tier:** `maxRetries = 1` on the Google tiers to absorb transient 503 load-shedding, and a new backup tier `gemini-3-flash-preview` (behind `gemini-3.5-flash`).

New smoke script `scripts/smoke-model-fallback.ts`: per-tier probe, full chain walk, and a structured-object "liturgy" test.

Smoke result: OpenAI quota exhausted, Anthropic out of credits, Groq key invalid, z.ai zero balance — all billing-side. The chain degraded correctly and landed on Gemini 3 Flash, which served the first live end-to-end "Synthesize Investigation" dossier in the UI (verified in-browser; voice contract held: "is supported by", "remains unstable", falsifiable open questions).

### Commit `0ce78d6` — feat(canvas): Microfilm Dark — archival dystopian dark UI for the research canvas

Introduced the "Microfilm Dark" design language and applied it across the research canvas as a slight extension of the existing chrome, not a rebuild.

Files (11 changed, +475 / −157):
- `PRODUCT.md` (new, +31) — product-register codification of Microfilm Dark
- `DESIGN.md` (new, +55) — design-language spec, distilled from `design-system/{ARCHIVAL_DYSTOPIAN,RESEARCH_CANVAS}_AESTHETIC.md`
- `apps/app/src/features/mindmap/research-canvas/canvas-animations.css` (+139) — token layer + effects
- `apps/app/src/features/mindmap/components/synthesis-panel.tsx` (+129 / heavy) — Case Synthesis dossier
- `apps/app/src/features/mindmap/components/research-suggestions-dock.tsx` (+130 / heavy) — dock retint + provenance
- `apps/app/src/features/mindmap/graph.tsx` (+108 / heavy) — canvas floor via CSS classes + guided-tour wiring
- `apps/app/src/features/mindmap/actions/synthesize-investigation.ts` (+15) — prompt fix
- `apps/app/src/features/mindmap/components/evidentiary-state-badge.tsx` (+6) — bracketed mono `[ State ]`
- `apps/app/src/features/mindmap/research-canvas/FloatingToolbar.tsx` (+6)
- `apps/app/src/features/mindmap/research-canvas/ToolbarButton.tsx` (+11)
- `apps/app/src/features/mindmap/research-canvas/ActionChip.tsx` (+2)

Design language (codified in `PRODUCT.md` / `DESIGN.md`):
- Warm manila-charcoal OKLCH tokens: `--ut-void`, `--ut-surface`, `--ut-line`, `--ut-paper`, `--ut-stamp`.
- Martian Mono for the meta voice; Special Elite typewriter wordmark.
- Clipped dossier corners, bracketed `[ STATE ]` badges, redaction-bar skeletons, film grain.
- Provenance rule: **dashed borders = AI inference, solid = sourced/deterministic.**

Implementation details:
- `canvas-animations.css`: a `:root` token block (root-scoped so Radix portals inherit it), `.ut-canvas-floor` (dot-grid with vignette), `.ut-grain` (feTurbulence data URI overlay), `.ut-panel` (clip-path corner recipe), `.ut-mono`, `.ut-typewriter`, and `.ut-redaction` + shimmer.
- `synthesis-panel.tsx`: Case Synthesis dossier with A–I section letters (from the vision Sec. 15 schema), redaction-skeleton loading, a rotated red NO CARRIER stamp on provider failure, and a dashed AI-reading chip.
- `research-suggestions-dock.tsx`: removed a banned colored side-stripe border, added provenance overlines (Field hypothesis vs AI reading), a dashed AI-enrichment container, and a redaction-bar scanning state.
- `graph.tsx`, `FloatingToolbar`, `ToolbarButton`, `ActionChip`: retinted to `var(--ut-*)` tokens; edge stroke changed to a paper-tinted oklch. Commit also includes previously uncommitted guided-tour wiring (`ut-tour-active`) that this pass depends on.
- `synthesize-investigation.ts`: prompt now describes edges by record title, never `rec_` ids — caught live when Gemini echoed the ids into prose.

## Verification

- **Typecheck:** held at the established baseline of 1901 pre-existing errors; zero new errors introduced.
- **Live (Chrome):** all three synthesis panel states verified — loading (redaction skeleton), NO CARRIER failure stamp, and the full dossier. Tour populates the canvas and the dock renders in-voice. Case Synthesis served end-to-end by Gemini 3 Flash — the first live run of the full path.
- **Smoke script:** `apps/app/scripts/smoke-model-fallback.ts` exercises per-tier probes, the chain walk, and a structured-object test; the object walk was served by `gemini-3-flash-preview`.

## Key Decisions & Gotchas

- **GOOGLE preferred over GEMINI key** because the `GEMINI_API_KEY` was revoked as publicly leaked (rotation required — see Security Flags).
- **z.ai has no Responses API** — the OpenAI-compat provider must use `.chat('glm-5.2')`.
- **Gemini 3 thinking budget must be 0** for these calls, or reasoning silently eats the entire output budget and returns empty text.
- **Tailwind 4 does not compile `bg-[--var]` shorthand** — must write `bg-[var(--var)]`.
- **Radix portals need CSS custom properties on `:root`**, not on a scoped container, or portaled content loses the tokens.
- **bun env loading is last-duplicate-wins** — order matters when the same key appears more than once.
- **Provenance encoded in the border style** — dashed = AI inference, solid = sourced/deterministic — is now a load-bearing UI convention, not decoration.
- **Never let record ids leak into LLM prose** — describe edges by title; Gemini will echo `rec_` ids otherwise.

## Security Flags

- **`GEMINI_API_KEY` was revoked by Google as a publicly leaked key.** The fallback chain now prefers `GOOGLE_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY`, but the leaked key must be **rotated** by the user. Flagged for user action.
- All other provider failures observed in the smoke run (OpenAI quota, Anthropic credits, Groq invalid key, z.ai zero balance) are billing-side and require user-side top-ups.

## Open Items / Next Steps

- **T-037 remainder:** apply `streamText` + tool-call fallback to `/api/disclosure/mindmap` and `/api/prometheus/chat`; UT-voice review of the Prometheus tool prompts.
- **Phase 2 design:** theories model + a canonical claims table.
- **User-side:** billing top-ups across providers; rotate the leaked `GEMINI_API_KEY`.
