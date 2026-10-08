# Research Commission CLI

**Status:** Proposal for review  
**Date:** 2026-09-28  
**Primary operator:** Founder/researcher  
**Canonical entry point:** `dy research "<person>"`

## Problem statement

How might Ultraterrestrial let a researcher ask for a full report on a key figure and receive something that is fast, deep, auditable, reviewable, and legitimately publishable rather than merely authoritative-sounding AI prose?

The system needs one clean launch point that any AI assistant working in the repository can invoke. The result must preserve provenance, contradictions, uncertainty, and revision history while supporting both an immediate answer and a longer investigation.

## Recommended direction

Use **`dy research "Jacques Vallée"`** as the canonical launch command.

One invocation creates a **Research Commission**: a bounded, durable investigation that produces an immediate brief, a living workspace, updates the subject's dossier, and can eventually produce a frozen official report edition.

The four product concepts are complementary layers:

1. **Research Commission** — the bounded effort with a charter and lifecycle.
2. **Research Workspace** — the sources, claims, contradictions, logs, and open questions collected during that effort.
3. **Person Dossier** — the accumulated knowledge about the key figure across commissions.
4. **Official Report** — a frozen, reviewed, citable edition produced from one commission.

The key figure is not the report. Multiple commissions may investigate the same person from different scopes without overwriting one another.

```text
dy research "Jacques Vallée"
        │
        ├── Creates commission UT-RC-2026-0042
        ├── Resolves the canonical person
        ├── Produces a preliminary brief
        ├── Runs the evidence protocol
        ├── Updates the living dossier
        └── Produces a reviewable report edition
```

## CLI contract

```bash
# Start or resume the standard investigation
dy research "Jacques Vallée"

# Return a fast preliminary answer
dy research "Jacques Vallée" --depth brief

# Run a broad, resumable investigation
dy research "Jacques Vallée" --depth deep

# Machine-readable invocation for AI assistants
dy research "Jacques Vallée" --depth deep --json

# Inspect active work
dy research status

# Inspect a specific commission
dy research show UT-RC-2026-0042

# Freeze an approved edition
dy research publish UT-RC-2026-0042
```

Default behavior should be layered:

- Return the preliminary brief first.
- Continue into standard analysis.
- Preserve enough state to resume at deep depth.
- Never present a preliminary answer as an approved report.

### Agent contract

Every AI assistant should follow the same rule:

> For formal person research, run `dy research "<canonical name>" --json`. Do not independently generate or describe an output as an official report. Cite the resulting commission ID.

The interface must guarantee:

- Non-interactive execution by default
- Stable JSON output with `--json`
- Meaningful exit codes
- Idempotent resume behavior
- A commission ID returned immediately
- Checkpointed stages
- Explicit `draft`, `reviewed`, and `published` states
- No publication without human approval

## Commission lifecycle

```text
COMMISSIONED
    ↓
COLLECTING
    ↓
ANALYZING
    ↓
ADVERSARIAL_REVIEW
    ↓
READY_FOR_REVIEW
    ↓
PUBLISHED
    ↓
REOPENED, when new evidence warrants a new edition
```

A failed or interrupted stage must remain resumable. Search failures, unavailable sources, and incomplete checks must be recorded rather than silently omitted.

## Research protocol

### 1. Resolve identity

- Match the canonical person record.
- Capture aliases, titles, transliterations, and name variants.
- Detect possible identity collisions.
- Require clarification rather than silently combining two people.

### 2. Establish the charter

The default person-research charter covers:

- Verified biography and institutional history
- Public claims and testimony
- Relevant events, organizations, programs, and documents
- Corroboration and contradiction
- Influence, criticism, and reception
- Evidentiary gaps and unresolved questions

The commission records its scope, date range, source policy, research questions, and completion criteria before synthesis begins.

### 3. Collect evidence

Search in this order:

1. Existing local corpus
2. Primary public records
3. Independent reputable secondary sources
4. Interpretive or cultural sources, clearly labeled as such

Every source record should retain its URL or archive reference, title, author or issuing body, publication date, retrieval date, source type, and content hash where feasible.

### 4. Build the claim ledger

Store one factual assertion per claim. Each claim should record:

- Exact normalized claim
- Who made it
- Earliest located source
- Direct supporting sources
- Contradicting sources
- Whether apparently independent sources share an upstream origin
- Evidentiary status
- Research notes and open verification actions

Initial statuses:

- `supported`
- `contested`
- `unverified`
- `disputed`
- `retracted`
- `insufficient_evidence`

The system must not collapse a person's credibility into one score. Credibility is contextual to claims, evidence, source conditions, and time.

### 5. Run adversarial review

Before a report can be ready for review, the commission must produce:

- Strongest evidence-supported reading
- Strongest counter-reading
- Contradictions and unresolved identity issues
- Circular citation and source-independence checks
- Missing-primary-source checks
- Claims whose prose outruns their evidence
- Falsifiable next traces that could change the assessment

### 6. Produce the report edition

The report should include:

1. Executive assessment
2. Scope and methodology
3. Verified biography
4. Chronology
5. Major claims and associated evidence
6. Corroborations and contradictions
7. Institutional and interpersonal connections
8. Evidentiary gaps
9. Open questions and next research actions
10. Complete source manifest

## Durable workspace

The nimble first version should be file-backed and CLI-native:

```text
research/commissions/UT-RC-2026-0042/
├── commission.json       # Charter, identity, scope, state, versions
├── sources.jsonl         # Provenance and retrieval records
├── claims.jsonl          # Atomic claims and evidentiary status
├── contradictions.jsonl  # Conflicts and counter-readings
├── activity.jsonl        # Append-only research log
├── brief.md              # Preliminary result
└── report.md             # Current reviewable edition
```

The permanent person dossier should reference commissions and published editions. It must not absorb conclusions without preserving their originating scope and evidence.

## What makes an edition official

An edition becomes official through a state transition, not through visual styling.

Required publication properties:

- Stable commission ID
- Declared methodology and scope
- Frozen source and claim manifests
- Version number and publication timestamp
- Explicit human approval
- Visible amendment history
- Reopening path when new evidence appears

Dossier styling, classified stamps, and archival presentation may reinforce the experience, but they do not confer authority.

## Existing-system fit

The `dy` shell dispatcher already provides a narrow extension point for a new `research` command in [`apps/disclosure-rag/main.sh:318`](apps/disclosure-rag/main.sh#L318).

The existing research queue provides prior art for identifiers and statuses, but it tracks administrative tasks rather than source-level investigations. See [`apps/disclosure-rag/lib/research_queue_manager.py:36`](apps/disclosure-rag/lib/research_queue_manager.py#L36).

The existing `ResearchManager` should not become the evidence engine. It is an administrative coordinator using a legacy model call rather than a reproducible research protocol. See [`apps/disclosure-rag/lib/research_manager.py:39`](apps/disclosure-rag/lib/research_manager.py#L39) and [`apps/disclosure-rag/lib/research_manager.py:326`](apps/disclosure-rag/lib/research_manager.py#L326).

Prometheus already defines useful epistemic obligations—provenance before prose, claim labeling, counter-readings, contradictions, and reopenable conclusions—in [`apps/app/src/app/api/prometheus/chat/route.ts:80`](apps/app/src/app/api/prometheus/chat/route.ts#L80). These principles should become shared research policy rather than a second implementation.

### Current architectural boundary

The Python Disclosure RAG app is disconnected from the Next.js app: it does not share the app's database, vectors, or routes. The initial CLI should therefore write durable local commission artifacts. Application and Postgres synchronization should be a later integration, not a prerequisite for validating the workflow.

## MVP scope

The first implementation should prove one complete path:

```bash
dy research "Jacques Vallée" --depth brief --json
```

It should:

1. Create a stable commission ID and manifest.
2. Resolve or explicitly flag the subject identity.
3. Search the existing local knowledge base.
4. Produce source and claim ledgers.
5. Generate a clearly labeled preliminary brief.
6. Return machine-readable status and artifact paths.
7. Resume safely when invoked again.

## Not doing in the MVP

- **Automatic publication** — human approval is part of official status.
- **A new multi-agent framework** — distinct research stages matter more than agent personas.
- **Next.js integration** — the CLI protocol must work independently first.
- **Postgres synchronization** — local durable artifacts are enough to validate the workflow.
- **A universal person credibility score** — it would erase claim-level context.
- **Silent report mutation** — published editions remain frozen.
- **Perfect visual presentation** — epistemic and operational integrity come first.

## Assumptions to validate

- [ ] A file-backed commission can remain understandable and useful across different AI assistants.
- [ ] The local corpus contains enough person-linked evidence to produce a valuable preliminary brief.
- [ ] Claim-level provenance produces meaningfully better reports than prompt-only synthesis.
- [ ] A default charter works for most key figures without requiring an intake interview.
- [ ] `dy research` is clearer and more discoverable than `dy commission`.

## Open questions

1. Should `dy research "Name"` default to `brief` or `standard` depth?
2. Should a standard run continue in the foreground or return after the brief and continue asynchronously?
3. What minimum checks must pass before a commission reaches `READY_FOR_REVIEW`?
4. Should commissions and generated reports be committed to git, stored outside git, or split by artifact type?
5. When should a commission update the permanent key-figure dossier?
6. Should `dy commission` exist as an alias for ceremonial or editorial use?
