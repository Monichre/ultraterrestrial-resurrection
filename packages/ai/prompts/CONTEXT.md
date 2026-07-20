# AI / Prompts — Domain Vocabulary

The language layer for how Ultraterrestrial speaks through its models: the voice contract, the liturgy schemas, the investigative-role grammar, and the versioned prompt corpus. Inherits all reserved-word rulings from [system CONTEXT](../../CONTEXT.md) — `Claim`, `Inference`, `Evidence`, and the eight evidentiary states are not redefined here.

---

## The voice layer

**Voice Contract**:
The shared epistemic obligations every live agent prompt must honour: provenance before prose, ambiguity as data, paired readings, no closure without warrant, and the banned overclaim vocabulary (`proves`, `confirmed`). The canonical text lives in the Research Canvas server actions; all new prompts must align with it.
_Avoid_: "system instructions" as a synonym when you mean the epistemic rules specifically; "persona" when you mean epistemic discipline

**Liturgy**:
The ordered narrative structure for synthesis output — what we know → what we think → what echoes → what breaks → what remains open → next trace. A schema contract, not decorative copy.
_Avoid_: "template", "outline", "report structure" when referring to this specific sequence

**Liturgy Surface**:
The Research Suggestions Dock — where the short liturgy schema (`reading`, `counterReading`, `whatRemainsWeird`, `nextTrace`) renders after deterministic seeding.
_Avoid_: "hypothesis panel", "suggestions card"

**Investigation Synthesis**:
The full liturgy produced by "Synthesize Investigation" — signal, evidentiary ground, sequence, field map, contradictions, five readings, evidentiary weight, open questions, next traces. Narrates what is already on the canvas; does not propose new records.
_Avoid_: "summary", "report", "analysis output" as generic substitutes

**Investigative Role**:
One of five conceptual stances — Archivist, Analyst, Skeptic, Mythographer, Cartographer — used to review whether a prompt or output covers the full investigative grammar. A prompt-engineering checklist, not a runtime agent or separate route.
_Avoid_: "agent persona", "subagent", "specialist model", "orchestrator role"

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
A general-purpose or RAG-pipeline prompt under `templates/`. Operational templates include `document_classification`, `rag_ingestion`, `rag_grounded_answer`, `validation`, `synthesis`, `deep_research`. Disclosure production paths prefer `sets/disclosure/` (aliases may resolve template names like `enhanced_ner` → `disclosure.ner`).
_Avoid_: assuming every template is wired to a live Next.js route; assuming stubs are still empty after 2026-07-19

**RAG Ingestion Prompt**:
Template `rag_ingestion` — plans Evidence-only chunks + provenance metadata for embedding. Chunk bodies must not contain agent Inference.
_Avoid_: using synthesis/liturgy output as chunk text

**Grounded Answer Prompt**:
Template `rag_grounded_answer` — answers using retrieved passages only, with citations, labeled Readings/Counter-readings, and a Next Trace.
_Avoid_: backfilling case facts from parametric memory when passages are thin

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
