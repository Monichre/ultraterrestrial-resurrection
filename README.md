# Ultraterrestrial Resurrection

An investigative UFO/UAP research platform built around an interactive evidence
canvas, grounded database search, guided historical tours, and AI-assisted synthesis.

## Current architecture

This is a Bun monorepo with two separate application systems:

- `apps/app/` — the Next.js 15 / React 19 product.
- `apps/disclosure-rag/` — a Python RAG research system. It is not connected to the
  Next.js application's database or vector stores.

Shared packages:

- `packages/db/` — Neon Postgres data layer. Live application code imports
  `@db/postgres`; the Xata SDK is retired migration-era code.
- `packages/services/` — external research and ingestion services.
- `packages/knowledge-base/` — source documents and research material.
- `packages/prompts/` — prompt assets and validation tooling.

The Next.js app has two live AI paths:

1. `/api/disclosure/mindmap` — OpenAI Assistants API, file search, Postgres search,
   external search, and graph mutations.
2. `/api/prometheus/chat` — standalone Vercel AI SDK chat with research tools.

Do not infer a connected “triple RAG” or multi-agent orchestrator from old design
documents. Those systems are not live in the Next.js product.

## Get started

Requirements: Bun, Node.js 18+, and the environment variables needed by the feature
you are running.

```bash
bun install
bun run dev:app
```

The app is available at `http://localhost:3000`. The primary experience is
`/research-canvas`.

Common commands:

```bash
bun run build:app       # Next.js production build
bun run test:app        # Vitest suite
bun run db:test:db      # database package test
bun run prompts:validate
```

The repository has substantial pre-existing TypeScript debt and the app build bypasses
type errors. A passing build is therefore necessary but not sufficient verification;
run a clean typecheck and confirm touched files introduce no new failures.

## Configuration

Never commit secrets. The live database connection is `DATABASE_URL`, commonly loaded
from `packages/db/.env`. AI, auth, search, and ingestion features require their own
provider keys; see `.env.example` and [docs/ops/CONTRIB.md](./docs/ops/CONTRIB.md).

Xata credentials are not required by the live Next.js data path. Old scripts and the
disconnected Python system may still contain Xata-specific migration code.

## Working in the repository

Read these in order before changing code:

1. [AGENTS.md](./AGENTS.md) — current architecture, safety rules, and workflows.
2. [docs/README.md](./docs/README.md) — documentation spine (what exists / where / how / want / do / start).
3. [docs/ops/AGENT_ONBOARDING_CHECKLIST.md](./docs/ops/AGENT_ONBOARDING_CHECKLIST.md)
   — app-specific orientation.
4. Task-specific code and documentation.

For design, UX, product language, or identity work, also read `docs/vision/`,
[DESIGN.md](./DESIGN.md), and [PRODUCT.md](./PRODUCT.md).

Operational references:

- [Documentation spine](./docs/README.md)
- [API routes](./docs/architecture/API_ROUTES.md)
- [Runbook](./docs/architecture/RUNBOOK.md)
- [Database imports](./packages/db/IMPORT_GUIDE.md)
- [Database quick reference](./packages/db/QUICK_REFERENCE.md)

Planning currently uses `docs/plans/FEATURES.md`, `docs/plans/TODO.md`, and
`DAILY_WORK_PLAN.md`. Treat those as transitional task-tracking sources while Linear
integration is being prepared; do not create additional shadow backlogs.

Historical audits, migration plans, and work logs are evidence, not current operating
instructions. Check their dates and verify claims against code before acting on them.
