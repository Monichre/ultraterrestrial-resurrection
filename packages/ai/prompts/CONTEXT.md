# AI / Prompts — Context

The language layer for how Ultraterrestrial speaks through its models: the voice contract, the liturgy schemas, the investigative-role grammar, and the versioned prompt corpus.

**Home of this context:** `packages/ai/prompts/` — the live workspace package `@repo/prompts` (YAML registry, loaders, CLI). The old path `packages/prompts/` is a redirect stub only.

Reserved words (`Claim`, `Inference`, `Evidence`, `Proves`) and the eight evidentiary states are defined in the root [`CONTEXT.md`](../../../CONTEXT.md) and may not be redefined here.

### Where prompt material lives today

| Layer | Location |
|---|---|
| Versioned registry corpus | `packages/ai/prompts/` (`registry.yaml`, `sets/`, `templates/`) |
| Canvas liturgy + synthesis schemas | `apps/app/src/features/mindmap/actions/enrich-hypothesis.ts`, `synthesize-investigation.ts` |
| Live route system prompts | `apps/app/src/app/api/disclosure/mindmap/route.ts`, `apps/app/src/app/api/prometheus/chat/route.ts` |
| App task prompts | `apps/app/src/services/ai/prompts/*.prompt.ts` |
| Vendor research adapters | `packages/ai/services/` → `@repo/ai/services` (Exa / Firecrawl / deep-research) — see [`docs/plans/AiServicesMerge.md`](../../../docs/plans/AiServicesMerge.md) |

---

## The voice contract

The governing text is [`apps/app/src/features/mindmap/CLAUDE.md`](../../../apps/app/src/features/mindmap/CLAUDE.md); the register rules are [`docs/vision/UX_LANGUAGE_GUIDE.md`](../../../docs/vision/UX_LANGUAGE_GUIDE.md).

**Voice Contract** / **Shared voice core**:
One identity — "the research intelligence layer inside Ultraterrestrial" — with obligations in fixed order: **epistemic integrity, narrative coherence, atmosphere**. Provenance before prose, ambiguity as data, paired readings, no closure without warrant, banned overclaim vocabulary (`proves`, `confirmed`). The canonical text is currently duplicated in `enrich-hypothesis.ts` and `synthesize-investigation.ts`; extraction to a single module under this package is the long-term home.
_Avoid_: reordering the three obligations; "system instructions" as a synonym for the epistemic rules; "persona" when you mean epistemic discipline

**Epistemic tier labelling**:
Every output labels what it is — sourced evidence / claim / inference / speculation / mythic resonance — via the `[State]` prefix.
_Avoid_: unlabelled assertion; emitting a reasoning string with no prefix and expecting a badge

**Anti-echo-chamber rule**:
Every Reading is paired with a Counter-reading. Structural, not tonal — enforced by required schema fields, never by asking the model to "be balanced."
_Avoid_: making `counterReading` optional; satisfying it with a restatement

**Closure discipline**:
Output ends on falsifiability or a **next trace**, never on closure the evidence doesn't warrant. "Proves" and "confirms" are banned against anomalous conclusions; use "is consistent with", "was claimed", "remains unexplained".

**Review rubric** ([`docs/vision/RESEARCH_NARRATIVE_RUBRIC.md`](../../../docs/vision/RESEARCH_NARRATIVE_RUBRIC.md)):
Does the output respect the strangeness / protect the evidence / map the relationships / refuse premature closure? All four or it isn't Ultraterrestrial.

**Model selection**: routed through `lib/ai/model-fallback.ts` (frontier-only policy).
_Avoid_: hardcoding a model id in a prompt module

---

## The five investigative roles

Documented in [`docs/vision/AGENT_ARCHITECTURE_BRIEF.md`](../../../docs/vision/AGENT_ARCHITECTURE_BRIEF.md). They are **stances a single model moves through inside one synthesis** — a review vocabulary and a prompt-engineering checklist, not five agents, services, or calls. A role becomes a separate call only when a surface needs it independently.
_Avoid_: "the Skeptic agent"; spawning parallel agents per role; describing them as an orchestration layer; "agent persona", "subagent", "specialist model", "orchestrator role"

**The Archivist** — evidentiary layer:
Custodian of provenance. What are the sources, what is directly stated, what is missing. Tone: precise, unemotional, sourced. Never lets synthesis outrun the record.
_Owns states_: `[Observed] [Corroborated] [Unverified]`

**The Analyst** — analytical layer:
Comparer and interpreter. Which claims reinforce, which conflict, which timelines are unstable. Tone: investigative, skeptical, curious. Everything it produces is an Inference.
_Owns states_: `[Inferred] [Contested]`

**The Skeptic** — the counter-reading engine:
Generates the strongest rival explanation; flags "narratively compelling but evidentially weak"; welcomes the prosaic reading when it fits. Structurally guaranteed by required fields, not by personality.
_Owns states_: `[Speculative] [Disconfirmed]` — and the honest sentence "nothing genuinely remains weird here"

**The Mythographer** — mythopoetic layer:
Tracks symbolic recurrence, folklore structure, encounter-tradition grammar — always labelled as resonance, never as evidence. "Myth is context, not confirmation." The dangerous layer, so the most disciplined.
_Owns state_: `[Resonant]`

**The Cartographer** — relational + operational layers:
Maps the field and plots the next move. Which entities recur, where the shape is emerging, what single action would most change the evidentiary weight. Tone: cartographic, then practical.
_Owns_: `Open Questions` and `Next Traces`

**Not the five roles**:
`packages/ai/agents/*.md` (18 researcher-named profiles — Vallée, Hynek, Pasulka, Keel and others) and `packages/ai/adversaries/doty-pattern.md` are development-time research personas and adjacent tooling. `docs/design/brand-bible/01_RESEARCH_UI_AGENT.md` is a design agent (mirrored as the repo's `research-ui-agent` subagent); `packages/ai/prompts/…/investigative-research-assistant.prompt.md` is an editorial persona for long-form articles. None are runtime product agents.
_Avoid_: mapping a researcher persona onto an investigative role; citing the 18 files as evidence of a multi-agent runtime

---

## The liturgy schema

**Liturgy**:
The ordered narrative structure for synthesis output — what we know → what we think → what echoes → what breaks → what remains open → next trace. A schema contract, not decorative copy.
_Avoid_: "template", "outline", "report structure" when referring to this specific sequence

**Liturgy Surface**:
The Research Suggestions Dock — where the short liturgy schema (`reading`, `counterReading`, `whatRemainsWeird`, `nextTrace`) renders after deterministic seeding.
_Avoid_: "hypothesis panel", "suggestions card"

**Investigation Synthesis**:
The full liturgy produced by "Synthesize Investigation" — signal, evidentiary ground, sequence, field map, contradictions, five readings, evidentiary weight, open questions, next traces. Narrates what is already on the canvas; does not propose new records.
_Avoid_: "summary", "report", "analysis output" as generic substitutes

The four-part reading, `LITURGY_SCHEMA` in `enrich-hypothesis.ts`. These are the canonical field names:

**`reading`** — the interpretive frame applied to the evidence field. 40–700 characters, enforced; shorter or longer returns null rather than degrading.
**`counterReading`** — the strongest rival interpretation of the same evidence. Required.
**`whatRemainsWeird`** — the named residue after prosaic explanations are applied. May legitimately be "nothing genuinely remains weird here."
**`nextTrace`** — the recommended next research action, imperative mood.

_Avoid_: "hypothesis" for the enriched output (the input `deterministicHypothesis` is the pre-LLM floor; the output is a Reading); omitting `whatRemainsWeird` or papering over an empty residue

**Synthesis liturgy** (`SYNTHESIS_SCHEMA`, the longer form over an assembled canvas):
`signal` · `evidentiaryGround` · `sequence` · `fieldMap` · `contradictions` · `readings` · `evidentiaryWeight` · `openQuestions` · `nextTraces`, where `readings` carries all five competing frames (`prosaic`, `institutional`, `psychologicalSocial`, `anomalous`, `mythopoetic`).
_Avoid_: shipping a synthesis missing any of the three non-anomalous readings — they are the Skeptic

---

## Epistemic output terms (prompt author's view)

**Reading** (in prompts):
An interpretive frame the model produces — prosaic, institutional, psychological-social, anomalous, or mythopoetic. Always Inference-layer output; never Evidence. Must be paired with a Counter-reading or rival frame.
_Avoid_: "hypothesis" in synthesis prompts (reserved for the deterministic pre-enrichment floor); "finding", "conclusion"

**Counter-reading**:
The structural rival to a Reading — the strongest alternative interpretation of the same signals. Required in liturgy surfaces; prevents echo-chamber synthesis.
_Avoid_: "alternative", "counterpoint", "rebuttal", "devil's advocate take"

**What Remains Weird**:
The named residue after prosaic readings are applied — what genuinely resists explanation. A valid output may state that nothing remains weird.
_Avoid_: "anomaly score", "unexplained factor", "mystery rating"

**Next Trace**:
The single most decisive next research action — imperative, specific, grounded in surfaced records. The operational close of the liturgy.
_Avoid_: "follow-up", "recommendation", "suggestion", "action item" in synthesis prose

**Mythopoetic Reading**:
The folkloric/symbolic interpretive frame. Always labeled as resonance, never as evidence. Owned by the Mythographer stance.
_Avoid_: treating symbolic pattern as corroboration; "archetypal proof"

---

## Persistence rules for prompt output

1. Anything the agent produces that persists is an **Inference**, written through `insertAgentInference` — never a Claim, never into an entity table.
2. `agent_inferences` never feeds retrieval, search, or suggestions (root ADR 0001).
3. Plumbing stays hidden: record ids, scores, embeddings, and tool names never appear in generated user-facing text; records are referred to by title.
4. **The user is the investigator.** Roles propose, structure, challenge, and synthesize — they do not decree. No role gets closure authority.

---

## Prompt corpus terms

**Prompt Registry**:
The canonical catalog (`registry.yaml`) of versioned prompts — the source of truth for `@repo/prompts`. All consumers resolve prompts through registry IDs or declared aliases.
_Avoid_: treating loose `.md` or `.py` files as canonical when a registry entry exists

**Registry ID**:
A stable dotted identifier for a registered prompt (e.g. `disclosure.ner`, `disclosure.research`). The name used in code and CLI.
_Avoid_: filename stems, legacy Python module names, informal nicknames

**Prompt Set**:
A versioned, domain-specific bundle under `sets/` (currently `disclosure/`). Preferred home for UFO/UAP prompts that ship to production paths.
_Avoid_: "prompt pack", "prompt folder" in planning docs

**Prompt Template**:
A general-purpose skeleton under `templates/` — not yet bound to a live production surface. May be incomplete (`synthesis` is a stub).
_Avoid_: assuming every template is wired to a route

**Extraction Prompt**:
A prompt whose job is to pull structured record fields from unstructured source text (NER, entity extraction). Output targets database entity shapes, not narrative synthesis.
_Avoid_: "analysis prompt" when the task is field extraction only

**Research Prompt**:
A prompt that guides open-ended investigation, content analysis, or methodology application over source material. May produce narrative or structured assessment, but is not the liturgy schema.
_Avoid_: conflating with Investigation Synthesis or the Voice Contract

**Schema Contract**:
A JSON Schema attached to a registry entry (`schema_ref`) defining the shape of structured model output. Field names in legacy schemas may predate current domain vocabulary — treat them as wire format, not glossary authority.
_Avoid_: letting schema field names like `key_findings` or `primary_claims` override reserved-word rulings in new work

**Methodology Framework**:
A research-methodology document under `methodology/` (Hynek taxonomy, evidence evaluation, phase-aware protocols) that informs prompt content. Reference material for authors, not a runtime prompt by itself.
_Avoid_: "methodology prompt" when you mean the framework doc vs the assembled system prompt

**Legacy Shim**:
A `.py` or `.ts` file that re-exports a YAML registry entry for backward compatibility. Not the source of truth.
_Avoid_: editing shims instead of the registry YAML

**Multi-agent Spec**:
Legacy planning documents (`01_LEAD_RESEARCH_AGENT_*`, `02_SUB_RESEARCH_*`, `conductor.yaml`) describing an unbuilt orchestrator. Speculative grammar only — zero production consumers.
_Avoid_: treating these as live architecture; building routes per "subagent"

---

## Register distinctions (do not merge)

**Promethean Register**:
The metaphorical persona layer in the Prometheus chat identity — Torchbearers, Clay Tablets, Divine Visitations. Decorative framing for the standalone chat path; does not override the Voice Contract where both apply.
_Avoid_: importing Promethean metaphors into Research Canvas liturgy or evidentiary badges

**Archival Register**:
The Microfilm Dark UI voice — OCR/teletype labels, dossier fiction, classification stamps. Governs how prompts describe atmosphere, not what they assert epistemically.
_Avoid_: letting archival fiction weaken epistemic labeling ("declassified finding")

---

## Legacy vocabulary (migrate away)

**Personnel** (in prompt text):
Legacy name for **Key Figure** — still appears in older YAML and `.ts` prompts because the pre-migration table was `personnel`. New prompt authoring uses Key Figure; wire/table context may still say `key_figures` or `personnel` in code.
_Avoid_: introducing "personnel" in new user-facing prompt prose

**Finding / Insight / Key Finding** (in prompt output):
Pre-canonicalization vocabulary in older prompts and schemas. Agent-produced content should be framed as Inference, Reading, or Evidentiary Weight — not "findings" or "insights".
_Avoid_: "KEY FINDINGS" headers in new prompts; `strategic insights` as output section titles

**SME** (Subject Matter Expert):
Informal role label in extraction prompts — maps to a Key Figure with domain expertise. Acceptable inside structured extraction instructions; prefer Key Figure in narrative synthesis prompts.
_Avoid_: "SME" in liturgy or Investigation Synthesis prose

**Disclosure Topic**:
Informal umbrella for the UFO/UAP research domain in legacy chat prompts. Not a domain object — use Topic, Event, Investigation as appropriate.
_Avoid_: "Disclosure topic" as a record type name
