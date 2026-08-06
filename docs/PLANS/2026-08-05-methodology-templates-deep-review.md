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
