# AI / Prompts — Context

The vocabulary governing what the research intelligence layer says and how it is structured: the voice contract, the five investigative roles, and the liturgy schema.

**`packages/prompts/` is not yet a package.** This context exists as a domain boundary before it exists as code. Prompt material lives today in:

- `apps/app/src/features/mindmap/actions/enrich-hypothesis.ts` — the liturgy schema
- `apps/app/src/features/mindmap/actions/synthesize-investigation.ts` — the synthesis + readings schemas
- `apps/app/src/app/api/disclosure/mindmap/route.ts` and `apps/app/src/app/api/prometheus/chat/route.ts` — the two live route prompts
- `apps/app/src/services/ai/prompts/*.prompt.ts` — task prompts (prometheus, knowledge-graph, summarize, NER, disclosure-assistant)

Reserved words (`Claim`, `Inference`, `Evidence`, `Proves`) and the eight evidentiary states are defined in the root [`CONTEXT.md`](../../CONTEXT.md) and may not be redefined here.

---

## The voice contract

The governing text is [`apps/app/src/features/mindmap/CLAUDE.md`](../../apps/app/src/features/mindmap/CLAUDE.md); the register rules are [`docs/vision/UX_LANGUAGE_GUIDE.md`](../../docs/vision/UX_LANGUAGE_GUIDE.md).

**Shared voice core**:
One identity — "the research intelligence layer inside Ultraterrestrial" — with obligations in fixed order: **epistemic integrity, narrative coherence, atmosphere**. The canonical text is currently duplicated in `enrich-hypothesis.ts` and `synthesize-investigation.ts`; extraction to a single module is the reason this context exists.
_Avoid_: reordering the three obligations; writing a second, divergent identity paragraph

**Epistemic tier labelling**:
Every output labels what it is — sourced evidence / claim / inference / speculation / mythic resonance — via the `[State]` prefix.
_Avoid_: unlabelled assertion; emitting a reasoning string with no prefix and expecting a badge

**Anti-echo-chamber rule**:
Every Reading is paired with a Counter-reading. Structural, not tonal — enforced by required schema fields, never by asking the model to "be balanced."
_Avoid_: making `counterReading` optional; satisfying it with a restatement

**Closure discipline**:
Output ends on falsifiability or a **next trace**, never on closure the evidence doesn't warrant. "Proves" and "confirms" are banned against anomalous conclusions; use "is consistent with", "was claimed", "remains unexplained".

**Review rubric** ([`docs/vision/RESEARCH_NARRATIVE_RUBRIC.md`](../../docs/vision/RESEARCH_NARRATIVE_RUBRIC.md)):
Does the output respect the strangeness / protect the evidence / map the relationships / refuse premature closure? All four or it isn't Ultraterrestrial.

**Model selection**: routed through `lib/ai/model-fallback.ts` (frontier-only policy).
_Avoid_: hardcoding a model id in a prompt module

---

## The five investigative roles

Documented in [`docs/vision/AGENT_ARCHITECTURE_BRIEF.md`](../../docs/vision/AGENT_ARCHITECTURE_BRIEF.md). They are **stances a single model moves through inside one synthesis** — a review vocabulary and a prompt-engineering checklist, not five agents, services, or calls. A role becomes a separate call only when a surface needs it independently.
_Avoid_: "the Skeptic agent"; spawning parallel agents per role; describing them as an orchestration layer

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

The four-part reading, `LITURGY_SCHEMA` in `enrich-hypothesis.ts`. These are the canonical field names:

**`reading`** — the interpretive frame applied to the evidence field. 40–700 characters, enforced; shorter or longer returns null rather than degrading.
**`counterReading`** — the strongest rival interpretation of the same evidence. Required.
**`whatRemainsWeird`** — the named residue after prosaic explanations are applied. May legitimately be "nothing genuinely remains weird here."
**`nextTrace`** — the recommended next research action, imperative mood.

_Avoid_: "hypothesis" for the enriched output (the input `deterministicHypothesis` is the pre-LLM floor; the output is a Reading); omitting `whatRemainsWeird` or papering over an empty residue

**Narrative liturgy** (the prose order the voice contract mandates):
what we know → what we think → what echoes → what breaks → what remains open → next trace.

**Synthesis liturgy** (`SYNTHESIS_SCHEMA`, the longer form over an assembled canvas):
`signal` · `evidentiaryGround` · `sequence` · `fieldMap` · `contradictions` · `readings` · `evidentiaryWeight` · `openQuestions` · `nextTraces`, where `readings` carries all five competing frames (`prosaic`, `institutional`, `psychologicalSocial`, `anomalous`, `mythopoetic`).
_Avoid_: shipping a synthesis missing any of the three non-anomalous readings — they are the Skeptic

---

## Persistence rules for prompt output

1. Anything the agent produces that persists is an **Inference**, written through `insertAgentInference` — never a Claim, never into an entity table.
2. `agent_inferences` never feeds retrieval, search, or suggestions (root ADR 0001).
3. Plumbing stays hidden: record ids, scores, embeddings, and tool names never appear in generated user-facing text; records are referred to by title.
4. **The user is the investigator.** Roles propose, structure, challenge, and synthesize — they do not decree. No role gets closure authority.
