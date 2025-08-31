# Repository Guidelines

## Project Structure & Module Organization
- Monorepo using Bun workspaces: code in `apps/` and `packages/`.
- `apps/app/`: Next.js 15 + React 19 web app. UI components colocated with features; public assets in `apps/app/public/`.
- `apps/disclosure-rag/`: Python FastAPI + Streamlit RAG system. Tests in `apps/disclosure-rag/tests/`.
- `packages/db/`: Xata database client, seeds, and helpers.
- `packages/knowledge-base/`: Knowledge graph and file sources.

## Build, Test, and Development Commands
- App dev: `cd apps/app && bun run dev` (port 3000)
- App build: `cd apps/app && bun run build`
- App lint: `cd apps/app && bun run lint`
- App test (Vitest): `cd apps/app && bun run test`
- Storybook: `cd apps/app && bun run storybook` (port 6006)
- RAG tests (pytest): `cd apps/disclosure-rag && python -m pytest tests/`
- Single RAG test: `cd apps/disclosure-rag && python -m pytest tests/test_entity_extraction.py`
- RAG dashboard: `cd apps/disclosure-rag && python streamlit_app.py`
- DB utilities: `cd packages/db && bun run seed` | `bun run query`

## Coding Style & Naming Conventions
- TypeScript: strict mode, ESNext. Prettier: no semicolons, single quotes, 100‑char width.
- Imports: use `@/` (app), `@db/` (database), `workspace:*` (packages).
- Components: PascalCase components, kebab-case files, feature‑first folders.
- Do not suppress compiler errors; fix root causes.

## Testing Guidelines
- Frontend: Vitest. Prefer colocated `*.test.ts(x)` near source.
- Python: pytest with tests under `apps/disclosure-rag/tests/`.
- Write focused tests for new/changed code; include edge cases and error handling.

## Commit & Pull Request Guidelines
- Use Conventional Commits where possible: `feat:`, `fix:`, `docs:`, `chore:`; add scope when helpful (e.g., `feat(rag): ...`). Avoid vague messages.
- PRs: include clear description, linked issues, reproduction steps, and screenshots for UI changes. Note any schema or environment changes.

## Security & Configuration
- Never commit secrets. Use env vars (e.g., `.env.local`) and rotate leaked keys. Xata/OpenAI/Anthropic/Groq keys are sensitive.
- Follow least‑privilege access; avoid exporting large datasets. Review diff for accidental secrets before pushing.
