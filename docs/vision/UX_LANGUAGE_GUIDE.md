# UX Language Guide — Naming, Tone, Labels, Interaction Vocabulary

register: language

Canonicalized 2026-07-09 from `DESIGN.md` (Microfilm Dark), `PRODUCT.md:30` ("Claim" reservation), the vision doc §12-§14 (`docs/plans/2026-07-08-memory-first-vision-capture.md`), the vision review §3.4 (adopt ~6 terms, not 18), the terminology ruling in `apps/app/src/features/mindmap/CLAUDE.md:50`, and the Brand Bible editorial voice. For UI copywriters, component authors, and prompt authors.

---

## 1. Reserved words (violations are bugs, not style issues)

| Word | Rule |
|---|---|
| **Claim** | ONLY a discrete assertion extracted from SOURCE material (testimony, documents). Never name a table, type, prop, or UI surface "claim(s)" unless its content is source-extracted. AI output is never a claim. |
| **Inference** | What the agent produces — the analytical layer. Persisted in `agent_inferences`; visually delineated (dashed borders); never presented as evidence. |
| **Evidence** | Source-derived material only. An AI synthesis is never "evidence". |
| **Proves / confirmed** | Banned attached to anomalous conclusions, in UI copy as in prose. Use "consistent with", "was claimed", "remains unexplained". |

## 2. Adopted domain vocabulary (the keeper set)

Per the vision review ruling: **adopt ~6-8 native terms; leave the rest generic.** Deliberately NOT adopted: Signal-for-result, Sequence-for-timeline, Field Map-for-map, Research Dialogue-for-chat, Motif/Marker-for-tag (Phase 2 candidates at most). If every button reads "open aperture of liminal resonance," we have failed.

| Adopted term | Replaces | Where it appears |
|---|---|---|
| **Investigation** | Project / session | Canvas-level container; "Synthesize Investigation" action (live in FloatingToolbar) |
| **Dossier** | Detail panel / card | Major panels with the clipped corner treatment |
| **Trace** (verb+noun) | Search / follow-up action | "Next trace" = the recommended next research action (live in dock + synthesis) |
| **Constellation** | Graph | The assembled node-network, narrative/marketing register |
| **Reading / Counter-reading** | Hypothesis / alternative | The paired interpretation unit (live: `enrich-hypothesis.ts` schema) |
| **Evidentiary Weight** | Confidence score | How strongly the material supports a reading (live: synthesis §G) |
| **Field Note** | Note | Researcher-authored annotations |
| **Open Questions** | Unknowns | What remains unresolved (live: synthesis §H) |

## 3. The evidentiary badge grammar

The eight states, exactly as in `apps/app/src/features/mindmap/utils/evidentiary-state.ts`:

`Observed · Corroborated · Contested · Inferred · Speculative · Resonant · Unverified · Disconfirmed`

- **Wire format:** reasoning strings are prefixed `[State] rest of text` (`withEvidentiaryState`); renderers parse and strip (`parseEvidentiaryState`). No prefix → NO badge; never default-fill a state.
- **UI format:** bracketed mono badge, uppercase, mirroring the wire: `[ CORROBORATED ]`. The brackets are the identity — provenance made visible.
- **Colors (locked, see `EVIDENTIARY_STATE_COLORS`):** emerald = Observed/Corroborated · amber = Contested · sky = Inferred · orange = Speculative · violet = Resonant · zinc = Unverified · red = Disconfirmed (red is the stamp hue, `--ut-stamp`).
- Casing: TitleCase in code/wire (`'Corroborated'`), UPPERCASE in rendered badges.

## 4. Register & casing rules (Microfilm Dark)

- **The OCR/teletype voice** — Martian Mono, uppercase, 9-10px, tracking 0.12-0.16em — is for labels, meta, stamps, badges ONLY. Never body copy in all-caps mono.
- **Body/prose** — sans stack, sentence case, 11-12.5px. UI copy in sentence case ("Synthesize investigation" in prose contexts; the button label may render uppercase via the mono treatment).
- **Special Elite (typewriter)** — ONE wordmark moment per surface (the dossier panel title). Never buttons, data, repeated labels.
- **File-reference micro-headers** — the `UT·RC // N:07 · E:05` idiom: system-truthful metadata (real node/edge counts), never decorative. Banned: cheap meta-labels ("SECTION 01") that fake bureaucracy without carrying data.
- **Classification stamps** — red (`--ut-stamp`), uppercase, used only where the archival fiction is intentional (document components), never on functional chrome.

## 5. Interaction vocabulary

| Moment | Approved language | Banned |
|---|---|---|
| Loading | Redaction-bar skeletons that "declassify" into text; optional mono status like `RETRIEVING…` | Spinners inside content; "Loading…"; playful copy |
| AI failure | Mature translation: the fallback chain retries silently; terminal failure surfaces in-fiction (`NO CARRIER`) or plain: "This crossed a model safety boundary — the research task can be reframed." | "Oops!", "Something went wrong 😅", blaming the user |
| AI output arrives | Delineated as the analytical layer: dashed border, `[ INFERRED ]`-family badge, provider attribution ("Served by Claude Opus 4.8") | Presenting inference inline with sourced content, undelineated |
| Empty canvas | An invitation to investigate ("Assemble records to begin an investigation") | "No data", "Nothing here yet!" |
| Suggestions | "Next trace", signal-honest reasons (documented link / semantic affinity / temporal cluster) | "Recommended for you", "You might like" |
| Destructive confirm | Plain, factual: "Remove 4 records from this investigation?" | Jokey confirm copy |

## 6. Tone rules for UI copy

1. **Clinical, slightly ominous, never campy.** Institutional authority masking extraordinary discovery — bureaucratic gravity, not X-Files camp (`PRODUCT.md:16, 23`).
2. **The UI copy follows the voice contract** (`PRODUCT.md:17`): even microcopy never overclaims; a tooltip on an AI edge says "inferred connection", not "discovered link".
3. **Legibility beats fiction.** The app must be legible; the *world* is mysterious (Brand Bible principle 5). Never let in-fiction copy obscure what a control does.
4. **No enterprise filler:** "leverage", "insights", "supercharge", "unlock" are banned. No emoji in product copy.
5. **Sentence formula for explanatory copy:** *[Evidence] suggests [possibility], but [limitation] remains unresolved.*
6. **Plumbing stays hidden:** record ids, scores, embeddings, tool names never appear in user-facing text; records are referred to by title.

## 7. Naming conventions for new surfaces

- Components: PascalCase; files kebab-case (repo standard). Domain components take domain names (`SynthesisPanel`, `EvidentiaryStateBadge`) — not generic (`ResultCard`, `InfoBadge`).
- Actions/buttons: imperative verb + adopted noun — "Synthesize Investigation", "Draw connection", "Add to investigation".
- New tables/types: follow the reservation rules in §1 (`agent_inferences` precedent; future source-extracted table gets the `claims` name).
- Visual-mode metadata (Brand Bible): a component declares one primary mode (`archive-document | field-evidence | blacksite | myth-tech | noir-research-canvas | ai-war-room`) + at most one accent mode. Never all modes at once.
