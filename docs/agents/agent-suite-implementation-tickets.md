# Ultraterrestrial Agent Suite — Implementation Ticket Plan

**Source spec:** [`docs/agents/ultraterrestrial-agent-definitions-v2/`](../agents/ultraterrestrial-agent-definitions-v2/) (suite v2.0.0 — 18 canonical agents, 1 restricted adversarial profile, shared operating contract, logical tool registry, 19 output schemas).

**Target:** the `dev`-branch monorepo (Bun workspaces + Turborepo): `apps/app` (Next.js 15 product), `packages/db` (`@db/postgres` — Neon Postgres 17 + pgvector, the ONLY live data layer), `packages/services` (Exa/Firecrawl/deep-research clients), `packages/prompts` (prompt library), `packages/knowledge-base` (sources). `apps/disclosure-rag` (Python) is disconnected; `apps/ufo-ui` is being cannibalized into `apps/app` and will be deleted — never target it.

**Grounding rules from CLAUDE.md that shape every ticket:**
- "Orchestration over Replacement" — the two live AI paths (Disclosure Mindmap Agent at `apps/app/src/app/api/disclosure/mindmap/route.ts`, Prometheus Chat at `apps/app/src/app/api/prometheus/chat/route.ts`) stay intact; the agent suite is built alongside and eventually feeds them.
- ALL database access via `@db/postgres` (`packages/db/src/postgres/`). `@db/xata` is retired — never extend it.
- UI state via Zustand `mindmap-ui-store.ts`; never add to `mindmap-context.tsx`; canvas navigation via `setActiveView()`.

---

## How this plan is organized

- **7 epics, 30 tickets**, phased so each phase ships something runnable.
- Sizes: **S** (≤1 day), **M** (2–3 days), **L** (~1 week).
- Every ticket lists repo-relative files and acceptance criteria.
- The spec's non-negotiables recur across tickets — keep them in view:
  1. Tool allowlists enforced **at runtime**, not via prompt text.
  2. Agents never touch Postgres directly — only through logical tool adapters over `@db/postgres`.
  3. Every write carries `task_id`, `agent_id`, provenance; staging never becomes canonical without its review path.
  4. No agent may migrate schema or delete canonical data; VALLEE proposals route MAJESTIC → human review.
  5. DOTY_PATTERN output is sandboxed, labeled, and stripped from all retrieval indexes.

### Phasing

| Phase | Epics/Tickets | Outcome |
|---|---|---|
| **0 — Foundations** | E0 (all), E1.1 | Spec reconciled, vitest in place, typed registry loads |
| **1 — Core pipeline** | E1.2–1.3, E2.1–2.4, E3.1 | One agent runs end-to-end: envelope in → validated output out |
| **2 — Orchestration + review** | E3.2–3.5, E4.1 | MAJESTIC delegates FORT→RUPPELT→SCULLY; staged writes reviewed in admin UI |
| **3 — Full roster** | E4.2–4.5, E2.5 | All 18 agents live incl. LONE_GUNMEN monitoring |
| **4 — Governance + surfaces** | E5 (all), E6 (all) | Privacy tiers, DOTY sandbox, Pin→Quilt UI, alert surfaces |

---

## Epic 0 — Foundations & Spec Reconciliation

### UT-0.1 — Vendor the canonical spec and wire it into docs *(S)* ✅ done in this branch
Spec committed at `docs/agents/ultraterrestrial-agent-definitions-v2/`. Follow-up: link it from `CLAUDE.md` / `AGENT.md`, and register this plan in the three-tier system (`docs/plans/FEATURES.md` strategic entry → `docs/plans/TODO.md` tickets).

### UT-0.2 — Install vitest; standardize zod *(S)*
`zod` is already a direct dependency (`apps/app` ^4.x, `packages/services` ^3.x) — no add needed, but pick one major (recommend v4 in `apps/app` where the schemas will live) and note the split. Vitest is documented in AGENTS/CLAUDE guidance but **not installed anywhere** and no `vitest.config.*` exists.
- Add `vitest` to `apps/app` with `vitest.config.ts` honoring the `@/*` alias; wire `bun run test` in `apps/app/package.json` (script exists but points at nothing).
- Smoke test: one passing spec under `apps/app/src/services/agents/__tests__/`.
- **AC:** `bun run test:app` from root runs green; build unaffected.

### UT-0.3 — Spec reconciliation ADR: tool names, anchors, scales *(M)* — **blocks E1/E2**
The per-agent `allowed`/`denied` lists reference ~20 tool names absent from `shared/01-tool-registry.md` (`monitor_feeds`, `assessment_write`, `review_gate_write`, `extraction_queue_write`, `protected_note_write`, etc.), and `denied` entries (`schema_migrate`, `source_contact`, `identity_deanonymize`, …) name capabilities the registry says are "intentionally absent."
Author `docs/agent-notes/adr/001-tool-registry-reconciliation.md` deciding:
1. **Expand the registry** with every per-agent write tool (recommended — the names are consistent and self-describing), each with an access class.
2. Treat `denied` names as **symbolic guard capabilities**: a static list the runtime refuses to ever bind, verified by test, not matched against live tools.
3. Define the canonical **`anchored_source_reference`** type (document id + page/passage/timestamp/frame/object anchor + transformation history) — referenced everywhere in the schemas, defined nowhere.
4. Normalize scales: credibility 0–10 (SCULLY-owned) vs meta-envelope confidence 0.0–1.0 vs `review_status` (`draft|reviewed|contested`) — write the mapping rules once.
5. Versioning: suite 2.0.0 vs per-file 1.0.0 — adopt suite-version-wins.
- **AC:** ADR merged; updated `registry.json`/tool registry checked in; every name in every agent's `allowed` list resolves; every `denied` name appears in the guard list.

### UT-0.4 — Postgres staging & governance tables (human-run migration) *(M)*
The spec forbids agents from migrating schema, so this is a human/dev ticket. Add a migration under `packages/db/migrations/` (Neon Postgres — the live DB; do NOT touch the retired Xata SDK at `packages/db/src/xata-typescript-sdk/`):
- `agent_tasks` (task envelope + status + DAG edges), `agent_runs` (execution log), `agent_outputs` (schema-validated payloads + meta envelope + review_status)
- `staging_records` (candidate entities/relationships), `evidence_ledger` (append-only), `audit_log` (append-only)
- `hypothesis_registry`, `prediction_matrix`, `ontology_proposals`, `alerts`, `publication_drafts`, `review_gates` (who must review what, blocking state)
- `adversarial_outputs` (DOTY quarantine — **no embedding column**, excluded from `search_vector`/pgvector indexing; see UT-5.3)
- Evaluate/absorb the existing `packages/db/src/postgres/agent-inferences.ts` table — likely the seed of `agent_outputs`.
- Typed accessors added to `packages/db/src/postgres/` and exported from `@db/postgres`; append-only enforced at service layer for ledger/audit.
- **AC:** migration applies to a Neon branch DB; `@db/postgres` exports typed CRUD for the new tables; ERD/docs (`docs/db.md` or equivalent) updated.

---

## Epic 1 — Agent Registry, Contracts & Schemas

New home: `apps/app/src/services/agents/` (registry, schemas, runtime, tools) — greenfield; nothing exists there today. The 13 legacy prompt constants in `apps/app/src/services/ai/prompts/researchers.prompt.ts` and the `packages/prompts` library (incl. its `registry.yaml`) are prior art, superseded for agent definitions by the vendored spec.

### UT-1.1 — Typed agent registry + loader *(M)*
- `apps/app/src/services/agents/registry/types.ts`: `UltraterrestrialAgentDefinition` per the spec README's TypeScript shape (+ `namesake`, `portrayal_policy`, `mission`, `authority`, `runtime`).
- `apps/app/src/services/agents/registry/load.ts`: load `docs/agents/.../registry.json` (build-time import), validate with zod: unique ids/codenames, `inherits` paths exist, every `output.primary_schema` resolves, every allowed tool resolves against the reconciled tool registry (UT-0.3).
- Expose `getAgent(codename)`, `listAgents(class?)`, `getAdversarialProfile()`.
- **AC:** vitest suite proves all 18 + DOTY load and validate; an intentionally broken fixture fails loudly.

### UT-1.2 — Zod output schemas + meta/task envelopes *(L)*
- `apps/app/src/services/agents/schemas/`: one zod schema per spec output schema (19 incl. DOTY's scenario contract), plus `metaEnvelopeSchema` (agent_id, task_id, generated_at, sources[], assumptions[], limitations[], confidence 0–1, review_status) and `taskEnvelopeSchema` (task_id, request_id, objective, questions[], source_scope[], case_ids[], constraints[], required_output_schema, deadline_or_freshness?, privacy_level).
- The spec's field types are all null placeholders — this ticket **defines** the concrete types; `anchored_source_reference` from UT-0.3 is the shared anchor type.
- `validateAgentOutput(codename, payload)` → typed result or structured error list.
- **AC:** every schema has fixtures (valid + ≥2 invalid) under test; meta envelope required on all; `sources` non-empty when `citations_required`.

### UT-1.3 — Prompt assembly with contract layering *(S)*
- `apps/app/src/services/agents/runtime/prompt.ts`: system prompt = shared operating contract (`shared/00-operating-contract.md`) → tool-contract summary → role-specific system prompt from the agent's md body, in that order (spec README requirement).
- Markdown bodies parsed once at build time (front matter via `gray-matter` or equivalent); sections extracted by heading.
- **AC:** snapshot test per agent showing contract text precedes role prompt; portrayal-policy language present.

---

## Epic 2 — Logical Tool Adapter Layer

### UT-2.1 — Tool runtime: adapter interface + allowlist enforcement *(L)* — **cornerstone**
- `apps/app/src/services/agents/tools/types.ts`: `LogicalTool<In, Out>` with `name`, `accessClass` (`read | write_raw | write_job | write_staging | write_proposal | write_reviewed | write_draft | append | analysis`), zod input/output, `execute(ctx, input)`.
- `apps/app/src/services/agents/tools/runtime.ts`: `buildToolset(agent, taskEnvelope)` returns **only** the agent's allowed tools (registry-driven — this is the runtime enforcement the spec demands; prompt text is not the control).
- Write-class middleware: inject/require `task_id`, `agent_id`, provenance on every non-read call; reject otherwise; mirror every write to `audit_log`.
- Guard list (UT-0.3): a test asserts no tool named in any `denied` list can ever be constructed or bound.
- **AC:** unit tests — agent calling an unallowed tool gets a policy error (and it's audited); write without provenance rejected; DOTY toolset contains exactly its 5 allowed tools.

### UT-2.2 — Postgres-backed read tools *(L)*
Bind read tools onto the live `@db/postgres` layer (`packages/db/src/postgres/{client,queries,search,types}.ts` — `getSql()`, typed queries, `searchDatabase` with parallel FTS + pgvector via `embedQuery`):
- `case_search`, `document_search`, `testimony_search` → `searchDatabase`/`searchTable` over `events`, `documents` + chunks, `testimonies`, `sightings`
- `graph_query`, `institution_graph_query`, `entity_resolver` → junction tables (`event-subject-matter-experts`, `topic-subject-matter-experts`, `organization-members`, `topics-testimonies`) via `getSql()`/`loadEntityGraph` + fuzzy match on `personnel`/`organizations` (trgm)
- `timeline_query` → date-indexed events/sightings; `vector_search` → pgvector cosine path in `search.ts`
- `evidence_ledger_read`, `credibility_score_read`, `hypothesis_registry_read`, `agent_result_read`, `ontology_read` → UT-0.4 tables
- **AC:** each tool has an integration test against a seeded Neon branch; results carry stable record ids usable as anchors.

### UT-2.3 — Staging & append write tools *(M)*
- `candidate_record_write`, `graph_candidate_write`, `hypothesis_registry_write`, `prediction_matrix_write`, `alert_draft_write`, `ontology_proposal_write`, `publication_draft_write`, `quilt_draft_write`, `canvas_write`, `research_backlog_write`, plus the per-agent note/assessment writes from UT-0.3 → route into `staging_records` / dedicated tables with `review_status: draft`.
- `evidence_ledger_write`, `audit_log_write` → append-only (no update path exposed).
- `hypothesis_registry_write` structurally cannot set finding status (spec: "cannot mark findings").
- **AC:** staged rows never visible to canonical read tools until promoted (UT-3.5); append-only verified by test.

### UT-2.4 — Acquisition & retrieval adapters *(M)*
- `source_search` / `source_fetch` → existing clients: `apps/app/src/services/ai/tools/{tavily,exa}/` and workspace `packages/services/{exa,firecrawl,deep-research}` (`@ultraterrestrial/services`); `searchExternalResources` pattern already proven in the mindmap/Prometheus routes.
- `vector_search` → pgvector (primary, via `@db/postgres` `search.ts`); Upstash Vector (`apps/app/src/lib/upstash/upstash.vector.ts`) only if already populated.
- `document_store_write`, `web_archive_capture`, `document_fingerprint` (content hash), `document_parse`; `ocr_request`/`ocr_read` as `write_job` stubs queued for later binding.
- **Injection isolation hook:** all fetched content is wrapped as untrusted data (see UT-5.1) before reaching model context.
- **AC:** FORT can produce a complete `source_intake_record` (hash, provenance, transformations) for a live URL in an integration test.

### UT-2.5 — Analysis tool pack (phased stubs allowed) *(M)*
`calculator`, `unit_convert`, `date_normalize`, `geocode`, `timeline_cluster`, `map_cluster`, `contradiction_check`, `statement_diff`, `narrative_diff`, `claim_chain_trace`, `credibility_score_compute` (see UT-3.4), plus deferred stubs that return `not_yet_bound` errors: `astronomy_ephemeris`, `weather_history`, `trajectory_model`, `population_baseline`, `infrastructure_proximity`, `media_provenance`, `records_response_parse`.
- **AC:** every registry tool name resolves to either a real adapter or an explicit `not_yet_bound` stub — never a silent absence; stub calls are audited.

---

## Epic 3 — Execution Runtime & Orchestration

### UT-3.1 — Single-agent execution runtime + API route *(L)*
- `apps/app/src/services/agents/runtime/execute.ts`: `executeAgent(codename, taskEnvelope)` — Vercel AI SDK `generateText`/`streamText` with the UT-2.1 toolset, temperature low, structured-output pass validated by UT-1.2; retry-with-errors loop (≤2) on schema failure; persist to `agent_runs`/`agent_outputs`.
  - *Substrate:* Vercel AI SDK — already the backbone of Prometheus chat. Mastra and Inngest are **not** installed on dev; do not introduce them in this ticket (see D2).
- New route `apps/app/src/app/api/agents/execute/route.ts` (Clerk-gated once middleware lands — note auth middleware is NOT yet implemented repo-wide), streaming progress using the SSE bridge conventions from `apps/app/src/app/api/disclosure/mindmap/route.ts` and `api/sse/xata/ask/route.ts` (URL keeps its legacy name).
- Task rejection: agent may return a structured `rejected` result when the envelope exceeds authority/scope (spec requirement).
- The two live AI paths are untouched; this is an additive route.
- **AC:** e2e test — SCULLY receives an evidence question and returns a valid `evidence_assessment`; malformed output is retried then surfaced as a failed run, never silently accepted.

### UT-3.2 — MAJESTIC orchestrator *(L)*
- `apps/app/src/services/agents/orchestration/majestic.ts`: classify complexity (SIMPLE/MODERATE/COMPLEX/CRITICAL) → emit `investigation_plan` → build task DAG in `agent_tasks` → dispatch via `task_delegate` → collect via `agent_result_read` → adjudicate dissent (recording override reasons) → produce publication draft.
- Singleton execution (`parallel_safe: false`): lock per `request_id` (Postgres advisory lock or Upstash Redis). Same for KEEL.
- Routing honors the manifest flow (LONE_GUNMEN → FORT/KNAPP → RUPPELT → institutions → evidence → pattern → KEEL → MAJESTIC).
- **AC:** MODERATE request fans out to ≥2 specialists and merges results; the plan itself validates against `investigation_plan`.

### UT-3.3 — Durable multi-step execution *(M)*
- Build on what's installed: Upstash QStash (`apps/app/src/lib/upstash/queue.ts`) for queued/retryable DAG steps + Vercel Cron for schedules (`vercel.json` — currently only `process-testimonies` every 6h). Each DAG node = one QStash-delivered step hitting an internal handler; step state in `agent_runs`.
- If QStash proves too thin for fan-in/fan-out, escalate D2 (install Inngest) — but that's a decision, not a default.
- **AC:** a COMPLEX 3-step chain survives a simulated mid-run failure and resumes; `agent_runs` reflects true step states.

### UT-3.4 — Review-gate engine + SCULLY credibility service *(L)*
- `apps/app/src/services/agents/review/gates.ts`: enforce per-agent `mandatory_review` handoffs and complexity publication gates — SIMPLE: self-review; MODERATE: +SCULLY when evidence-material; COMPLEX: MAJESTIC plan + SCULLY + KEEL; CRITICAL: + adversarial review + explicit dissent + privacy/legal check + **human authorization** (blocking `review_gates` row until a human approves in UT-6.2).
- SCULLY's `review_gate_write` can set a blocking state only MAJESTIC (or a human, for CRITICAL) clears.
- `credibility_score_compute`: transparent 6-dimension aggregation (Source Authority, Evidence Quality, Witness Reliability, Technical Feasibility, Corroboration, Temporal Consistency) + documented adjustments (+20% military, +30% gov acknowledgment, +15% multi-sensor, +10% physical effects, −30% commercial incentive, −40% anonymous-only, −50% per hoax pattern, −25% story change), capped 0–10, component breakdown always returned. SCULLY-only via allowlist.
- Dissent objects persist on outputs until resolved or explicitly preserved.
- **AC:** unit-tested gate matrix per complexity; a contested output cannot reach `publication_drafts` promoted state; score fixtures reproduce documented adjustments exactly.

### UT-3.5 — Staging → canonical promotion workflow *(M)*
- Net-new promotion service (no existing staged-write precedent on dev — build from scratch): verify the record's required review path is satisfied (UT-3.4) → write to the canonical table via `@db/postgres` → mark staging row promoted → audit-log. **No agent has a canonical-write tool** — promotion is service+human only.
- Ranking coupling: promotions touching junction tables (`event-subject-matter-experts`, `topic-subject-matter-experts`, `organization-members`, testimony/document links) flag `personnel` for re-ranking — call `apps/app/src/services/ranking/personnel-ranking.service.ts` or hit `api/admin/trigger-ranking-update` semantics (note: `api/cron/update-rankings/route.ts` exists but is NOT scheduled in `vercel.json`). Agents must not write `personnel.rank/authority` directly; SCULLY's credibility score is a separate field-space from the connectivity-based ranking — document the ownership split.
- **AC:** unreviewed staging row cannot be promoted; promotion of an SME link triggers a ranking-refresh flag; deletes remain impossible through this path.

---

## Epic 4 — Specialist Agent Rollout

Each wave = prompts wired (UT-1.3), toolsets bound, golden-fixture eval per agent (input envelope → output validates + passes the agent's spec Evaluation Criteria), and handoff routing registered with MAJESTIC.

### UT-4.1 — Wave 1: core evidence pipeline — FORT, RUPPELT, SCULLY, VALLEE *(L)*
The minimum loop that turns a URL into reviewed evidence: FORT ingests (`source_intake_record`) → RUPPELT extracts (`extraction_batch`, every field anchored or explicitly null, no silent merges) → VALLEE resolves entities (`ontology_decision`; proposals non-executing → MAJESTIC → human) → SCULLY assesses (`evidence_assessment`).
- Seed corpus: `packages/knowledge-base/sources/files/` gives FORT real local material before web acquisition.
- **AC:** e2e: real document in → staged candidate records with anchors → SCULLY assessment with credibility breakdown → visible in review queue.

### UT-4.2 — Wave 2: institutions — KNAPP, GRUSCH, MELLON, POPE, PILKINGTON *(L)*
- KNAPP: dossiers + interview/records **plans only** (no `source_contact` capability exists anywhere — verify by guard test).
- GRUSCH/MACK-style restricted outputs: `protected_note_write` lands in restricted storage (privacy tiering, UT-5.2).
- POPE: `statement_diff`/`records_response_parse`; preserve exact operative wording.
- PILKINGTON: only agent with `adversarial_test_request` — routes through MAJESTIC (DOTY invocation stays disabled until UT-5.3).
- **AC:** per-agent golden fixtures; restricted outputs invisible to public-tier reads.

### UT-4.3 — Wave 3: evidence + pattern — HYNEK, MACK, MICHEL, MULDER, MASTERS, PASULKA *(L)*
- HYNEK: calculations show assumptions + uncertainty. MACK: restricted by default, no-diagnosis enforced in prompt + output schema. MICHEL: clustering vs `population_baseline` (stub-aware). MULDER: hunches only — `finding_publish` guard-tested; SCULLY mandatory before promotion past Hunch. MASTERS: falsifiable predictions required. PASULKA: motif candidates via staging.
- **AC:** fixtures per agent; MULDER hypothesis cannot reach reviewed status without a SCULLY assessment linked.

### UT-4.4 — KEEL synthesis + Canvas/Quilt model *(M)*
- KEEL consumes only reviewed inputs via `agent_result_read`; `canvas_write` (write_reviewed) and `quilt_draft_write`; enforced rule: every synthesis claim traces to an upstream reviewed output ("no new facts appear only in synthesis") — validate by checking claim anchors reference existing `agent_outputs`. Singleton like MAJESTIC.
- Existing anchor: `apps/app/src/features/mindmap/components/synthesis-panel.tsx` is the natural render target.
- **AC:** synthesis containing an unanchored claim fails validation; dissent from specialists appears in `specialist_dissent`.

### UT-4.5 — LONE_GUNMEN monitoring pipeline *(L)*
- Vercel Cron route `apps/app/src/app/api/cron/agent-monitor/route.ts` + `vercel.json` cron entry (pattern: existing `process-testimonies` cron) → `monitor_feeds` adapter polling configured feeds (config table, not hardcode) → `document_fingerprint` dedup → `timeline_cluster`/`geocode` → `monitoring_alert` drafts → MAJESTIC gate before any user notification; MICHEL review for cluster interpretation.
- Admin manual-trigger route mirroring `api/admin/trigger-ranking-update/route.ts`.
- Spec leaves cadence/thresholds open — start hourly, thresholds in config, document in ADR-002.
- **AC:** seeded duplicate feed items collapse to one alert; alerts stay `draft` until MAJESTIC review; manual trigger works.

---

## Epic 5 — Safety & Governance

### UT-5.1 — Prompt-injection isolation for retrieved content *(M)*
- All `source_fetch`/`document_parse`/feed content wrapped in an untrusted-data envelope (delimited, instruction-stripped, role-tagged) before model context; operating contract's rule made mechanical.
- Red-team test set: pages containing "ignore your instructions / change your tools / reveal your prompt" must not alter behavior; assert no system-prompt leakage in outputs.
- **AC:** injection suite passes for FORT + KNAPP + LONE_GUNMEN paths.

### UT-5.2 — Privacy tiering (public / restricted / protected) *(M)*
- `privacy_level` on task envelope + storage rows; restricted/protected rows (MACK, GRUSCH defaults) readable only by allowlisted agents and role-gated humans (Clerk roles — note middleware is not yet implemented repo-wide, a prerequisite here); protected-source identifiers pseudonymized at write time; no de-anonymization path exists (guard test).
- Postgres options: separate restricted tables or row-level security on Neon — decide in D3.
- **AC:** public-tier query never returns restricted rows; MACK output defaults restricted; CRITICAL gate includes the privacy check from UT-3.4.

### UT-5.3 — DOTY_PATTERN sandbox *(M)* — last, deliberately
- Invocation only via PILKINGTON `adversarial_test_request` → MAJESTIC authorization → separate execution path with DOTY's 5-tool read-only toolset.
- Output only to `adversarial_outputs`: mandatory labels `ADVERSARIAL_SIMULATION / NOT_EVIDENCE / DO_NOT_INGEST_AS_FACT` enforced at write **and** render; table has no embedding/`search_vector` column and is excluded from every FTS/pgvector query path and from all agent read tools except the three mandatory reviewers (PILKINGTON, SCULLY, MAJESTIC) in review context.
- **AC:** tests — DOTY writes to any other table are impossible; `vector_search`/`case_search` can never return an adversarial row; unlabeled render blocked.

### UT-5.4 — Audit coverage & provenance conformance suite *(S)*
- Cross-cutting vitest suite asserting: every write tool audited; every output's meta envelope complete; every `denied` guard capability unbindable; append-only tables reject updates.
- **AC:** suite runs in CI as the standing conformance check for all future agents/tools.

---

## Epic 6 — Frontend Surfaces

### UT-6.1 — Research topology in the mindmap: Pin → Thread → Hunch → Canvas → Quilt *(L)*
- Map the spec topology onto `apps/app/src/features/mindmap/`: **Pins** = entity/evidence cards (`components/cards/`); **Threads** = `components/status-ui/thread-board.tsx` groupings; **Hunches** = new card type fed by `hypothesis_registry`; **Canvas** = `apps/app/src/features/research-canvas/case-files/canvas/` (annotations/grid/drawer); **Quilt** = rendered `strategic_synthesis` via `components/synthesis-panel.tsx`. Agent outputs enter through the existing `transformStreamResponse`/`transform-for-reactflow` path (`apps/app/src/services/ai/workflows/transform-for-reactflow.ts`).
- Review state surfaced with the existing `components/evidentiary-state-badge.tsx`.
- State via Zustand `mindmap-ui-store.ts` slices (never `mindmap-context.tsx`); promotion affordances call UT-3.5 (never write canonical from the client).
- **AC:** a Wave-1 pipeline run renders as Pins grouped into a Thread; a MULDER hunch shows its `review_status` badge.

### UT-6.2 — Review & promotion admin dashboard *(L)*
- Extend `apps/app/src/features/admin/` (`AdminDashboard.tsx`): queues for staging records, review gates awaiting human authorization (CRITICAL), ontology proposals (VALLEE → human), publication drafts; approve/reject with reason → UT-3.5 promotion service; auth-gated like `api/admin/trigger-ranking-update` (Clerk-role check inside the route until middleware lands).
- **AC:** a human can take a staged extraction batch from Wave 1 to canonical entirely through this UI; rejections audit-logged with reason.

### UT-6.3 — Agent run console: launch + live progress *(M)*
- Wire the oracle entry points (`apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/oracle-command-menu/OracleCommandMenu.tsx`, `oracle-input.tsx`, `menus/oracle-sphere.tsx`) to `POST /api/agents/execute`; stream DAG/step progress over SSE (reuse the mindmap SSE-bridge pattern, including its NO CARRIER failure surfacing from commit `3c719a0`); render outputs with schema-aware cards (assessment, hypothesis, alert).
- **AC:** user launches a MODERATE investigation from the oracle menu and watches MAJESTIC's plan + specialist steps stream in; a failed run shows a failure state, not a spinner.

### UT-6.4 — Alerts & monitoring surface *(S)*
- LONE_GUNMEN alert feed (post-MAJESTIC review only) — badge/inbox in the mindmap dynamic-island/status UI; link each alert to its cluster cases; optional Liveblocks presence hook for shared canvases later.
- **AC:** reviewed alert appears with time window, geographic scope, and source count; drafts never render.

---

## Decisions needed from the team (blocking markers)

| # | Decision | Blocks | Recommendation |
|---|---|---|---|
| D1 | Tool-name reconciliation strategy (expand registry vs rename agents' lists) | E1, E2 | Expand registry; denied = symbolic guards (UT-0.3) |
| D2 | Durable-execution substrate: build on installed QStash + Vercel Cron vs installing Inngest/Mastra (neither is on dev) | UT-3.3 | QStash + Cron first — already wired (`lib/upstash/queue.ts`, `vercel.json`); revisit Inngest only if fan-in/fan-out outgrows it |
| D3 | Restricted/protected storage: separate Postgres tables vs Neon row-level security | UT-5.2 | Separate restricted tables to start (simpler to audit); RLS later if needed |
| D4 | LONE_GUNMEN feed list + cadence + thresholds | UT-4.5 | Config table + hourly cron to start; ADR-002 |
| D5 | Concrete providers for deferred analysis tools (ephemeris, weather, media provenance) | UT-2.5 full binding | Ship as `not_yet_bound` stubs; bind per-need |
| D6 | Human review roles/permissions (who may approve CRITICAL) — Clerk middleware not yet implemented | UT-3.4, UT-6.2 | Clerk role `agent-reviewer` checked in-route now; middleware ticket separately |
| D7 | zod major-version standard (app v4 vs services v3) | UT-1.2 | v4 in `apps/app` where schemas live; leave `packages/services` alone |

## Dependency graph (ticket level)

```text
UT-0.2 ─┐
UT-0.3 ─┼→ UT-1.1 → UT-1.2 → UT-1.3 ─┐
UT-0.4 ─┘        └→ UT-2.1 → UT-2.2/2.3/2.4 → UT-3.1 → UT-3.2 → UT-3.3
                                     │                    │
                                     └→ UT-2.5 (phased)   ├→ UT-3.4 → UT-3.5 → UT-6.2
                                                          └→ UT-4.1 → UT-4.2/4.3 → UT-4.4
                                                                       UT-4.5 (needs 3.3)
UT-5.1 (with 2.4) · UT-5.2 (before 4.2) · UT-5.3 (after 4.2) · UT-5.4 (continuous)
UT-6.1/6.3 (after 4.1) · UT-6.4 (after 4.5)
```

---

## Appendix — corrections from the first draft (2026-07-19)

The initial version of this plan was written against a stale non-monorepo branch. Corrections baked into this revision, so nobody chases dead paths:

- Every `src/…` path is `apps/app/src/…`; DB work targets `packages/db`.
- **Xata is retired.** Live layer = `@db/postgres` (`packages/db/src/postgres/`); the old SDK still exists at `packages/db/src/xata-typescript-sdk/` — do not extend. Staging/governance tables are Postgres migrations, not Xata.
- **Mastra and Inngest are not installed** on dev; `src/services/mastra/` and `src/lib/inngest/` do not exist. Async infra = Upstash QStash + Vercel Cron.
- The `api/workflow/execute` stub and the CLI review→insertion flow referenced in the first draft **do not exist on dev** — UT-3.1 and UT-3.5 are build-from-scratch.
- `zod` is already a direct dependency; only vitest is genuinely missing (UT-0.2).
- Oracle UI lives under `features/mindmap/components/menus/…` (no `features/ai/ai-inputs/`); case-files canvas under `features/research-canvas/case-files/canvas/`.
