# Plan: Deep Review — Methodology Prompt Templates

**Date:** 2026-08-05  
**Branch:** `dev`  
**Scope:** Review-only (no product code changes, no commits unless human requests)  
**Inputs (canonical working copies):**
- `packages/ai/prompts/templates/unified-disclosure-research-and-intelligence-methodology.md`
- `packages/ai/prompts/templates/ufo_analysis_framework.md`
- `packages/ai/prompts/templates/topic_analysis_tracking_knowledge_graph_research.md`

**Also note:** Duplicate copies exist under `docs/archive/research/agentic-research-methodology/` for the latter two; root `packages/ai/prompts/*.md` copies appear deleted in working tree — templates/ is SoT for this review.

## Goal

Produce an evidence-backed keep/cut/rewrite ruling for each template: what is salvageable methodology vs hallucinated stack fiction vs generic boilerplate, scored against live Ultraterrestrial architecture (`AGENTS.md`, `docs/vision/AGENT_ARCHITECTURE_BRIEF.md`, `@db/postgres`, two live AI paths).

## Global Constraints

1. **Honesty over aspiration.** Flag every claim that contradicts corrected myths (Triple RAG, Neo4j KG, multi-agent orchestrator, FAISS-in-Next, 85% connectivity).
2. **Orchestration over replacement.** Recommendations must deepen disclosure/mindmap + Prometheus paths or `packages/ai/prompts` / `packages/ai/agents` persona packs — not propose a new Python orchestration platform.
3. **No web substitution for parallel-cli.** External claim grounding (NUFORC stats, etc.) is OUT OF SCOPE until `parallel-cli` is installed via `/parallel-setup`. Mark those claims `UNVERIFIED-EXTERNAL`.
4. **Reports only.** Write artifacts under the SDD workspace. Do not edit the three source templates. Do not `git commit` / `git stash`.
5. **Evidence required.** Every Critical/Important finding cites file path + line range (or section heading) and the contradicting canon source.
6. **Deliverable shape for Task 4:** one synthesis markdown with per-doc verdict, overlap matrix, and ordered rewrite plan.

## Tasks

### Task 1: Audit unified-disclosure-research-and-intelligence-methodology.md

Review the 1319-line "Complete UFO Research System" template end-to-end.

**Done when** workspace report `task-1-report.md` includes:
- Architecture claims inventory (persistence layer, agent list, Triple RAG, Neo4j, k8s, etc.) with Live / Myth / Speculative labels
- Mapping of named agent types → `packages/ai/agents/*.md` personas (match / partial / absent)
- Code quality of embedded Python (runnable? stubs? undefined imports?)
- Fit vs `AGENT_ARCHITECTURE_BRIEF.md` "conceptual grammar not processes"
- Verdict: KEEP fragments / ARCHIVE / REWRITE into X (specific target paths)

### Task 2: Audit ufo_analysis_framework.md

Review the 135-line temporal/geographic framework.

**Done when** `task-2-report.md` includes:
- Inventory of quantitative claims (each marked UNVERIFIED-EXTERNAL pending parallel-cli)
- Methodology sections that are reusable (KDE, LISA, SaTScan, space-time cube) vs narrative filler
- Fit with Spacetime Canvas / Temporal Observatory (`docs/vision/TEMPORAL_OBSERVATORY.md`, `apps/app/src/features/spacetime/`) — conceptual only
- Verdict + suggested prompt/tooling home if kept

### Task 3: Audit topic_analysis_tracking_knowledge_graph_research.md

Review the 358-line topic/KG survey.

**Done when** `task-3-report.md` includes:
- What is generic industry survey vs UAP-specific
- Stack recommendations vs live stack (Neo4j/FAISS/Kafka vs Neon+pgvector+FTS+graph junctions)
- Overlap with mindmap graph / `loadEntityGraph` / junction tables
- Verdict + cannibalization targets into `packages/ai/prompts`

### Task 4: Cross-doc synthesis

Depends on Tasks 1–3 reports.

**Done when** `task-4-synthesis.md` includes:
- Overlap / contradiction matrix across the three docs
- Single ordered recommendation list (max 8 actions)
- What to wire into geopolitical-analysis / investigative-research-intelligence set if anything
- Explicit "do not build" list

### Task 5: Final review of synthesis

Task-scoped quality pass on `task-4-synthesis.md` against Global Constraints. Produce `task-5-final-review.md` with Spec ✅/❌ and quality Approved/Rejected.

## Out of scope

- Installing parallel-cli / external fact-checking of NUFORC percentages
- Implementing any agent orchestrator
- Editing production prompts beyond recommendations

---

## Findings (extracted 2026-08-06 from the review workspace)

The review ran to completion on 2026-08-05 (Tasks 1–5). This section is the durable record of its
verdicts. Everything below is distilled from the SDD workspace reports; see the provenance note at
the end.

### 1. Per-template verdicts

| Template (`packages/ai/prompts/templates/`) | Ruling | One-line reasoning |
|---|---|---|
| `unified-disclosure-research-and-intelligence-methodology.md` | **ARCHIVE** the blueprint; **KEEP/REWRITE** thin fragments (evidence tiers, RAPID/DEEP/EXHAUSTIVE depth vocabulary, breaking-event plan rubric, witness-workflow step language) | Stack fiction dressed as a "Complete UFO Research System": Master Orchestrator + AgentPool + Triple RAG + Neo4j + FastAPI + Docker/K8s, with non-runnable Python stubs falsely labeled "Production-Ready Code" (task-1 §3.2, §6) |
| `ufo_analysis_framework.md` | **KEEP methodology fragments / REWRITE; QUARANTINE findings** — not an archive; its spatial-statistics menu is the review's primary salvage | Invents no persistence myths, but presents ~30 unverified quantitative claims as established research; the KDE / Moran / LISA / Gi\* / SaTScan / space-time DBSCAN / bias-normalization menu is genuinely reusable once every rate table is stripped (task-2 §3.1, §6) |
| `topic_analysis_tracking_knowledge_graph_research.md` | **ARCHIVE; do not implement; thin cannibalization only** | 100% generic NLP/KG industry survey with **zero** UFO/UAP/Disclosure content (keyword scan empty), yet filed under product prompt templates; §9 prescribes exactly the myth stack agents are warned against (task-3 §1, §6) |

Cross-cutting ruling (task-4 §1.3): none of the three files is a safe operational source of truth for
agents or product architecture. Prefer `docs/vision/AGENT_ARCHITECTURE_BRIEF.md`, `packages/ai/agents/*`,
the NER/evidence methodology docs, and the live mindmap/Prometheus paths.

### 2. Explicit "do not build" list

The full 12-item list from task-4 §5, with the live counterpart each myth displaces (counterparts
drawn from the task-4 §1.1 canon-ruling column):

| # | Do not build | Source | Live counterpart |
|---|---|---|---|
| 1 | FastAPI `UFOResearchSystem` / Master Orchestrator / AgentPool / multi-agent registry | U | Two Next.js AI routes (`/api/disclosure/mindmap`, `/api/prometheus/chat`); no orchestrator exists |
| 2 | Triple RAG vector store / separate `VECTOR_STORE_URL` product layer | U | FTS + pgvector fused by Reciprocal Rank Fusion, plus OpenAI `file_search` — two paths, not three |
| 3 | Neo4j (or Amazon Neptune) knowledge graph as product persistence | U + T | Postgres entity tables + five junction tables → `loadEntityGraph` |
| 4 | FAISS-in-Next / FAISS as the app vector layer | T | Neon pgvector (`text-embedding-3-small` @ 1536 dims) |
| 5 | Kafka / Flink / Spark streaming topic-tracking platform | T (soft rhyme with U's social monitors) | No streaming runtime on either live AI path; Lone Gunmen is conceptual persona grammar only |
| 6 | Docker Compose + Kubernetes "ufo-research-system" / Grafana research sidecar as a product AI path | U | Next.js app on the existing deploy model; no research sidecar |
| 7 | Wiring any of this fiction into `apps/disclosure-rag/` as the Next.js AI path | U | `apps/disclosure-rag/` is disconnected by design; deepen the live Next paths instead |
| 8 | Treating `packages/ai/agents/*.md` as deployable microservices | U | Personas are markdown conceptual grammar, not routes or processes |
| 9 | Standalone Python/GIS orchestration platform implementing KDE/LISA/SaTScan as a third AI runtime | F (misuse) | Methods belong in Michel's persona + a thin prompt that programs existing tools |
| 10 | VR/AR UFO globe walkthrough, or an auto "unreported sighting probability" heatmap, as MVP | F | Temporal Observatory MVP: temporal cursor, evidence layers, flap playback |
| 11 | BERTopic / Apache Jena SPARQL / OWL schema management as the mindmap backend | T | `topics` table + join edges + pgvector affinity; Zod/TS types + `getSql()` |
| 12 | Promoting F's NUFORC/percentage tables or T's "85% / $50M+" ROI into prompts, UI captions, or agent facts before parallel-cli grounding | F + T | Nothing — these remain `UNVERIFIED-EXTERNAL` |

### 3. Salvage / wiring table

What survives, and where it goes. All of it is a **rewrite**, never a paste (task-4 §3–§4, task-1 §6,
task-2 §4.5).

| Salvaged technique / rubric | From | Live home |
|---|---|---|
| Evidence tier checklist (physical / sensor / visual / witness / document) | U | `packages/ai/agents/06-scully-evidence-evaluator.md` — prompt-side evidentiary budget, not DB config; optionally also the investigative-research-assistant prompt |
| RAPID / DEEP / EXHAUSTIVE investigation-depth vocabulary | U | `packages/ai/prompts/sets/disclosure/investigative-research-intelligence/investigative-research-assistant.prompt.md` — map to adaptive planning already in the set; **not** orchestrator knobs |
| Breaking-event plan rubric (entity, geo, media, evidence, official response) | U | `packages/ai/agents/01-majestic-master-controller.md` — plan proportionate to stakes |
| Witness workflow steps (psych indicators, consistency, corroboration, feasibility, pattern match) | U | Mack `08` + Hynek `07` (+ Scully `06`) — gap-diff first; do not duplicate |
| Realtime alert posture, conceptual wording only | U | `packages/ai/agents/02-lone-gunmen-realtime-monitor.md` — prompt wording, never a monitor service |
| Spatial-statistics method menu (reporting-bias/population/language normalization, KDE + time-slicing, Monte Carlo nulls, Moran's I, LISA, Getis-Ord Gi\*, SaTScan, space-time DBSCAN, infrastructure proximity, hex/H3 aggregation, flap-as-playback) | F | `packages/ai/agents/13-michel-spatiotemporal-correlation.md` + a new thin `spatiotemporal-cluster-methods.prompt.md` in the investigative-research-intelligence set, which must **forbid invented rates** |
| Visualization aspirations | F | Bound to Temporal Observatory vocabulary (temporal cursor, evidence layers, flap playback, Investigation waypoints); **do not** paste SaTScan into `features/spacetime/` UI components |
| Live-stack clarifying paragraph: canvas "topics" = Postgres `topics` + join edges + pgvector affinity, **not** BERTopic/Neo4j/FAISS services | Written fresh from canon (explicitly **not** from T) | investigative-research-assistant prompt; optionally `geopolitical-analysis.prompt.md` when it touches topic clusters / entity graphs |
| Topic-relation vocabulary (`supports` / `contradicts` / `mentionedIn`) — optional, lowest value | T | `methodology/NER_EXTRACTION_PROTOCOL.md` or an addendum to `EVIDENCE_EVALUATION_FRAMEWORK.md`, relabeled to platform evidentiary states (`Contested` / `Corroborated`) rather than OWL predicates |

Geopolitical-analysis specifically: wire at most the live-stack topic paragraph and the shared
evidence-tier/depth vocabulary. Do **not** import Michel's full spatial-statistics menu there.

### 4. The UNVERIFIED-EXTERNAL claims register

Task 2 produced a claim-by-claim register of the quantitative assertions in
`packages/ai/prompts/templates/ufo_analysis_framework.md` — roughly 30 rows inventoried across its
§2.1–2.5, covering corpus sizes (NUFORC 170,000+ reports, MUFON 200,000+ cases), temporal trends (a
claimed 700% increase after the 2017 NYT/Pentagon coverage, Saturdays at a 2.1x reporting rate, 68%
higher during clear low-humidity weather), geographic rates (North America 67% of global reports,
US Southwest 8.3/100k, Nordic +60% during aurora seasons, rural 3.4x), and case-study numbers
(Phoenix Lights across a 400 km radius peaking in an 11-minute window, the 2014–2016 Nordic Wave 80%
during geomagnetic storms, pandemic rural +340% vs urban +120%). Every corpus, temporal, geographic,
and case-study row is labeled `UNVERIFIED-EXTERNAL`; the three method-parameter rows in §2.5 (KDE over
0.5°x0.5° cells, hexagonal binning, >2σ/>3σ anomaly thresholds) are flagged separately as unverified
*design choices* rather than external factual claims, and are acceptable as defaults if labeled as
such. None of it was checked against a real source — Global Constraint 3 put external grounding out
of scope until `parallel-cli` is installed via `/parallel-setup`. The source template now carries a
banner at the top pointing back to this section. Note that the workspace report cited each claim by
line number against the original 135-line file; that banner shifts every one of those citations down
by 9 lines.
The register itself must be re-derived from the file (or from the workspace report, while it lasts)
before any grounding pass — do not soft-merge "maybe true" figures into prompts, UI captions, or
agent facts in the meantime.

### 5. Provenance

This section was distilled from `.superpowers/sdd/2026-08-05-methodology-templates-deep-review/`
(`task-1-report.md`, `task-2-report.md`, `task-3-report.md`, `task-4-synthesis.md`,
`task-5-final-review.md`) — a gitignored, ephemeral, tool-owned scratch workspace whose findings
exist nowhere else in tracked files. A separate 4-agent audit on 2026-08-06 reported that 25 of 29
spot-checked claims from those reports verified true against the repo before this extraction was
made.
