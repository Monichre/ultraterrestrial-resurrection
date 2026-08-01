// Source of truth is docs/plans/TODO.md. This file is a regenerated VIEW of
// it, not a second store — update TODO.md first, then mirror the change here.
// Regenerate by re-reading TODO.md's Status lines whenever tickets move.

export const LAST_SYNCED = '2026-08-01'

export type Status = 'done' | 'in_progress' | 'blocked' | 'decision_ready' | 'open'

export interface Ticket {
  id: string
  title: string
  lane: 'A' | 'B' | null
  status: Status
  note?: string
}

export const TICKETS: Ticket[] = [
  // ---- Lane A — Corpus & Ingestion ----
  { id: 'T-048', title: 'Ingestion hardening — corpus integrity, identity, provenance', lane: 'A', status: 'in_progress', note: 'H0 fixes landing across 6 parallel agents' },
  { id: 'T-045', title: 'Remaining HIGH/MEDIUM findings, disclosure-rag/main.py review', lane: 'A', status: 'open', note: 'H4/H6/M1 folded into T-048 H0 pass' },
  { id: 'T-044', title: 'Fix CRITICAL findings, disclosure-rag/main.py contract review', lane: 'A', status: 'done' },

  // ---- Lane B — Platform & Experience ----
  { id: 'T-047', title: 'Temporal Observatory — Foundation milestone (Spacetime Canvas M0)', lane: 'B', status: 'in_progress', note: 'M0.1–M0.8 scaffolded on /spacetime' },
  { id: 'T-041', title: 'Roundtable UX/UI review', lane: 'B', status: 'blocked', note: 'no browser backend for screenshot evidence' },
  { id: 'T-036', title: 'LLM Wiki — compounding knowledge layer (Karpathy-style)', lane: 'B', status: 'decision_ready' },
  { id: 'T-042', title: 'Custom agent architecture brainstorm', lane: 'B', status: 'decision_ready' },
  { id: 'T-037', title: 'AI prompt & model audit — frontier-models-only policy', lane: 'B', status: 'blocked', note: 'implementation done; external verification blocked' },
  { id: 'T-038', title: 'Design language & domain vocabulary canonicalization', lane: 'B', status: 'blocked', note: 'implementation done; external Figma review blocked' },
  { id: 'T-043', title: 'Write per-context CONTEXT.md files', lane: 'B', status: 'open' },
  { id: 'T-046', title: 'Docs maintenance automation (future)', lane: 'B', status: 'open', note: 'backlog' },

  // ---- unlaned / pre-officiation, kept for the record ----
  { id: 'T-028', title: 'Mindmap Agent Consolidation (ai-sdk-tools)', lane: null, status: 'done', note: 'in review' },
  { id: 'T-039', title: 'Documentation cleanup & simplification', lane: null, status: 'done', note: 'in review' },
  { id: 'T-040', title: 'Linear integration for task tracking', lane: null, status: 'done', note: 'in review' },
  { id: 'T-030', title: 'Migrate /api/disclosure/chat consumers to /api/disclosure/mindmap', lane: null, status: 'done' },
  { id: 'T-031', title: 'Delete broken historical-query chain', lane: null, status: 'done' },
  { id: 'T-001', title: 'Remove Edge runtime from Prometheus chat route', lane: null, status: 'done' },
  { id: 'T-002', title: 'Fix 3 broken API routes', lane: null, status: 'done' },
  { id: 'T-003', title: 'Add Clerk authentication middleware', lane: null, status: 'done' },
  { id: 'T-004', title: 'Delete 4 ghost route wrappers', lane: null, status: 'done' },
  { id: 'T-005', title: 'Delete 4 dead shell variants', lane: null, status: 'done' },
  { id: 'T-006', title: 'Prune index.tsx', lane: null, status: 'done' },
  { id: 'T-007', title: 'Consolidate xata-to-xyflow files', lane: null, status: 'done' },
  { id: 'T-008', title: 'Paginate initial graph data load', lane: null, status: 'done' },
  { id: 'T-009', title: 'Fix EmptyCanvas', lane: null, status: 'done' },
  { id: 'T-010', title: 'Wire suggestion chips to agent', lane: null, status: 'done' },
  { id: 'T-011', title: 'Replace local sightings dataset with Xata query', lane: null, status: 'done' },
  { id: 'T-012', title: 'Add Zod validation to remaining API routes', lane: null, status: 'done' },
  { id: 'T-013', title: 'Add graph-write tools to disclosure mindmap route', lane: null, status: 'done' },
  { id: 'T-014', title: 'Split processDocument into granular tools', lane: null, status: 'done' },
  { id: 'T-015', title: 'Standardize context injection', lane: null, status: 'done' },
  { id: 'T-016', title: 'Unify or clearly separate chat routes', lane: null, status: 'done', note: 'phase 1; phase 2 → T-030' },
  { id: 'T-017', title: 'Wire testimony queue worker as cron', lane: null, status: 'done' },
  { id: 'T-018', title: 'Extract pure factories from mindmap-context', lane: null, status: 'done' },
  { id: 'T-019', title: 'Move graph init effect out of context', lane: null, status: 'done' },
  { id: 'T-020', title: 'Move UI-local state to Zustand', lane: null, status: 'done' },
  { id: 'T-021', title: 'Create .env.example', lane: null, status: 'done' },
  { id: 'T-022', title: 'Create docs/archive/ and move obsolete files', lane: null, status: 'done' },
  { id: 'T-023', title: 'Refresh FEATURES.md for Q1 2026', lane: null, status: 'done' },
  { id: 'T-024', title: 'Create API_ROUTES.md', lane: null, status: 'done' },
  { id: 'T-025', title: 'Implement rate limiting', lane: null, status: 'done' },
  { id: 'T-027', title: 'Create ResearchSession unified state slice', lane: null, status: 'done' },
  { id: 'T-029', title: 'UFO Research Methodology Framework', lane: null, status: 'done' },
]

export interface GlossaryEntry {
  term: string
  meaning: string
  detail: string
}

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Lane A', meaning: 'Corpus & Ingestion', detail: 'disclosure-rag, knowledge-base, db/rebuild. Is the evidence correct, complete, traceable, durable?' },
  { term: 'Lane B', meaning: 'Platform & Experience', detail: 'apps/app, packages/ai, canvases. Can a researcher see and reason about the evidence?' },
  { term: 'H0–H5', meaning: 'Lane A roadmap (T-048)', detail: 'H0 stop-the-bleeding → H0.5 make chunks reachable → H1 identity (content hash) → H2 the bridge (Neon wiring) → H3 runs → H4 provenance → H5 remote mirror.' },
  { term: 'H1', meaning: 'Identity — the keystone fix', detail: 'Persist a sha256 content hash on every archive record + a matching Postgres column/constraint. Re-key ingestion to dedup on hash instead of path. Closes the 54-duplicate-document problem and the archive↔DB join-key gap. Nothing after H1 works safely without it.' },
  { term: 'H2', meaning: 'The bridge', detail: 'Wire the already-built-but-uncalled Postgres client into the live write path; write chunks + embeddings to Neon; deprecate Upstash.' },
  { term: 'M0–M4', meaning: 'Lane B roadmap (T-047, Spacetime Canvas)', detail: 'M0 Foundation → M1 Evidence instrument → M2 Reconstruction → M3 Comparative analysis → M4 Narrative.' },
  { term: 'D1–D6', meaning: 'Decisions landed in the ingestion plan', detail: 'D1 Neon pgvector canonical / D2 filesystem is truth / D3 hash dedup + resumable runs / D4 sources/ immutable / D5 pre-intake liminal zone / D6 dedup key differs by source class.' },
  { term: 'T-XXX', meaning: 'Ticket ID, docs/plans/TODO.md', detail: 'The only ticket numbering in this repo. No Jira, no GitHub Issues for this — markdown headings in one file, synced to a handful of Linear issues (DMGD-###) where noted.' },
]

export const TICKETING_SYSTEM = {
  where: 'docs/plans/TODO.md',
  what:
    'Plain markdown. Each ticket is a "### T-NNN" heading with a Status line. ' +
    'Three-tier system: FEATURES.md (strategic) → TODO.md (actionable, this file) → DAILY_WORK_PLAN.md (daily execution).',
  who:
    'Whoever claims a ticket edits its Status line directly in the file — no separate app, no login. ' +
    'When an agent (like this session) lands work, it updates the Status line and commits.',
  rule:
    'CLAUDE.md is explicit: "No other project management files should be created or used." ' +
    'This board is a rendered VIEW of TODO.md, not a second source of truth — if this page and ' +
    'TODO.md ever disagree, TODO.md is right.',
}
