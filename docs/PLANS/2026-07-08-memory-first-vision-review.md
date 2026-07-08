# Review — "Memory-First Vision Capture" (Ultra Terrestrial)

**Date:** 2026-07-08
**Status:** REVIEW + ROADMAP — guides next work efforts
**Source:** Vision document authored via GPT dialogue, supplied by Liam 2026-07-08. Full text to be archived alongside this review (see §5).
**Companions:** `2026-07-08-hollow-moon-tour-spec.md` (voice contract), memory `ultraterrestrial-identity`, T-037 in `TODO.md`

---

## 1. Verdict

The document is right about the soul and deliberately silent about the code. Its own framing — "vision, not code-verified spec" — is the correct posture, and this review supplies the code-verification half. The core finding: **most of the vision is reachable as prompt + output-schema work on systems that already shipped**, not as a platform rewrite. The dangerous reading of this document is as a data-model mandate; the productive reading is as a voice contract plus three structural ideas to adopt incrementally.

## 2. The three ideas worth building first (highest leverage)

1. **Claim temperature / evidentiary states** (§14 of vision). `Observed / Corroborated / Contested / Inferred / Speculative / Mythic-Resonant / Unverified / Disconfirmed`. This is the single most differentiating idea — "epistemic texture" instead of uniform text. Cheap first step: it's an enum on edges and suggestions, not a new database. Edges already carry `reasoning`; suggestion cards already carry signal types (documented link / semantic affinity / temporal). Those ARE evidentiary states, unlabeled.
2. **The liturgy** (§8): *know → think → echoes → breaks → remains open.* This is an output schema for surfaces that already exist. The hypothesis dock currently emits one thesis; upgrading it to `{reading, counterReading, whatRemainsWeird, nextTrace}` is a server-action schema change on shipped code.
3. **The five-layer narrative + A–I output format** (§7, §15) as the spec for a "Synthesize investigation" action over the canvas — the integrated-narrative MVP. Input: the nodes/edges the researcher assembled. Output: structured synthesis with per-section provenance. The canvas is already the "field"; this gives it a voice.

## 3. Where to push back

1. **Ontology gravity.** §13 names ~15 first-class objects. The live database has a different, simpler ontology (events, key_figures, topics, organizations, testimonies, documents, artifacts — 29 tables, 230k records, 1,405 embedded entities). Do NOT big-bang migrate. This project's own history is the cautionary tale: the 6-agent tour orchestrator was fully specced in July 2025, zero code shipped, scrapped (per root CLAUDE.md). New objects (Claim, Motif, Contradiction) should arrive as **overlay tables referencing existing records**, one at a time, each pulled in by a feature that needs it — Claims first, extracted by the mindmap agent when it writes edges.
2. **The doc itself flirts with fog-machine risk.** 27 sections; the discipline it preaches ("beautiful fog machines are bad for research") applies to roadmaps too. The roadmap below deliberately picks three things per phase.
3. **Fable as the narrative layer is an architectural decision, not a default.** Both live agent paths currently run OpenAI (Assistants API + AI SDK). The vision's Fable-specific guidance (refusal handling as mature UX, summarized-thinking-as-transparency) is accurate to Anthropic's docs, but adopting Fable/Opus for narrative synthesis belongs inside T-037's fallback-chain work — the new `lib/ai/model-fallback.ts` already puts Anthropic at tiers 2–3.
4. **Vocabulary: adopt ~6 terms, not 18.** The doc knows this ("tarot deck"). Recommended keepers: **Investigation, Dossier, Trace, Constellation, Reading / Counter-reading, Evidentiary Weight, Field Note.** Leave the rest generic.

## 4. Roadmap

### Phase 0 — Voice becomes enforceable (days; mostly unblocked)
- **P0.1** Archive vision doc + this review as canonical (this file + appendix doc). Add the distilled voice contract (liturgy, evidentiary-state language rules, "never proves / was claimed / is consistent with") to `AGENT.md` and `features/mindmap/CLAUDE.md`. Add the §25.11 evaluation rubric as a checklist: *does it respect strangeness, protect evidence, map relationships, refuse premature closure?*
- **P0.2** T-037 executes with §20's system-prompt skeleton as the base for both live routes' prompts, and the §11 operating principles ("provenance before prose", "ambiguity is data", "the user is the investigator") folded into `enrich-hypothesis.ts`.
- **P0.3** Dock upgrade: enrichment output becomes `{reading, counterReading, whatRemainsWeird, nextTrace}` — deterministic floor unchanged. (Blocked on provider billing for live verification only.)

### Phase 1 — Epistemic texture becomes data (1–2 weeks)
- **P1.1** `evidentiary_state` enum on edge data + suggestion cards; UI badges (the three dock signal types map directly: documented link → Observed/Corroborated, semantic affinity → Inferred/Resonant, temporal → Contested-tier context).
- **P1.2** First overlay object: `claims` table (`claim_text, source_record_id, evidentiary_state, extracted_by, created_at`). The mindmap agent writes a claim row whenever it creates a reasoned edge. Narrative ↔ structure bidirectionality starts here.
- **P1.3** "Synthesize investigation" action: canvas → §15 A–I structured narrative with provenance per section, rendered as a dossier panel/export.

### Phase 2 — The field deepens (backlog; sequence after Phase 1 proves out)
- Contradiction objects (requires claims), motif tracking across investigations, terminology pass in UI, refusal-UX polish ("this crossed a safety boundary — reframing the research task") when Anthropic routes go primary.

### Explicit non-goals (for now)
Full §13 ontology migration; renaming all UI vocabulary; a new "narrative engine" service separate from the two live AI paths; treating the Python RAG system as part of this (still disconnected).

## 5. Archival note

The full vision text is preserved verbatim at `docs/plans/2026-07-08-memory-first-vision-capture.md`. This review is the implementation-facing half; that document is the soul-facing half. Read together.
