# Runbook

**Generated:** 2026-03-29
**Source of truth:** `package.json`, `apps/app/next.config.js`, deployment config, codebase audit

---

## Deployment

### Platform

- **Hosting:** Vercel (Next.js auto-detected)
- **Database:** Xata (PostgreSQL + vector search)
- **Auth:** Clerk
- **AI:** OpenAI Assistants API (disclosure agent), Vercel AI SDK (Prometheus chat)
- **Python RAG:** Separate deployment (not connected to Next.js app)

### Pre-deployment checklist

1. Ensure `bun run build:app` succeeds locally
   - Note: `typescript.ignoreBuildErrors` is **not** set in next.config — type errors will fail the build
2. Verify environment variables are set in Vercel dashboard (212 total, see CONTRIB.md for critical subset)
3. Check that `XATA_BRANCH` matches the target branch
4. Verify `OPENAI_ASSISTANT_ID` and `DISCLOSURE_ENGINEER_ASSISTANT_ID` point to valid assistants

### Deploy process

```bash
# Preview deploy (automatic on PR to main)
git push origin dev

# Production deploy
git checkout main
git merge dev
git push origin main                    # Triggers Vercel production build
```

### Build configuration

From `next.config.js`:
- `reactStrictMode: true`
- `transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'gsap', '@db']`
- `crossOrigin: 'anonymous'`
- `experimental.taint: true`
- `experimental.optimizePackageImports: ['three', '@react-three/drei', '@react-three/fiber']`
- Image domains: `us-east-1.storage.xata.sh`, `us-east-1.xata.sh`, `xata.sh`

### Post-deployment verification

1. Load `/research-canvas` — graph should render
2. Submit an AI query — disclosure mindmap agent should return results
3. Check Clerk auth is working (sign-in/sign-up flows)
4. Verify Storybook builds if applicable: `bun run build-storybook`

---

## Monitoring & Alerts

### Current state (2026-03-29)

**No monitoring is currently configured.** The following are recommended:

| Area | Recommended tool | Priority |
|------|-----------------|----------|
| Runtime errors | Vercel Analytics + Sentry | High |
| AI API costs | OpenAI usage dashboard | High |
| Database health | Xata dashboard | Medium |
| Performance | Vercel Speed Insights | Medium |
| Auth events | Clerk dashboard | Medium |
| Scraping costs | FireCrawl dashboard | Low |

### Key metrics to watch

- **OpenAI API spend:** The disclosure mindmap route creates threads, uses file_search, and polls assistants in loops. Uncapped without auth middleware.
- **Xata query volume:** Initial graph load fetches all 230,998 records (known issue, pagination planned).
- **FireCrawl usage:** `/api/processing/scrape/batch` triggers web scraping — publicly accessible (no auth middleware).

---

## Common Issues & Fixes

### Build failures

| Issue | Cause | Fix |
|-------|-------|-----|
| `Module not found: @db` | Workspace link broken | Run `bun install` from monorepo root |
| Three.js SSR errors | Client-side 3D lib in server context | Ensure `'use client'` on Three.js components |
| Type errors on build | Strict TypeScript compilation | Fix types; `ignoreBuildErrors` is NOT enabled |
| Storybook build fails | Missing peer deps | Check `@storybook/*` versions in apps/app/package.json |

### Runtime errors

| Issue | Cause | Fix |
|-------|-------|-----|
| AI agent returns nothing | OpenAI assistant ID misconfigured | Verify `DISCLOSURE_ENGINEER_ASSISTANT_ID` env var |
| Graph shows empty | Xata connection fails silently | Check `XATA_API_KEY`, `XATA_BRANCH` in env |
| Auth redirect loop | Clerk env vars missing | Set `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` |
| Slow initial load | Fetches 230,998 records | Known issue — pagination is Phase 2.1 of hardening plan |
| SSE stream drops | Edge runtime timeout | Fixed 2026-03-29 — removed Edge runtime from prometheus/chat route |
| `/api/processing/file` 404 | Route deleted (was broken stub) | Intentional removal — route wrote to nonexistent table |

### Database issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `xata codegen` fails | Schema mismatch | Update schema in Xata dashboard first, then run codegen |
| Seed script errors | Missing tables | Run `db:fix-and-seed` instead of `db:seed` |
| Vector search returns nothing | Embeddings not populated | Check OpenAI file_search vector store, not Xata vectors |

### Development environment

| Issue | Cause | Fix |
|-------|-------|-----|
| `bun install` fails | Lockfile conflict | Delete `bun.lockb`, re-run `bun install` |
| Python RAG won't start | Missing venv | `cd apps/disclosure-rag && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| Hot reload broken | Three.js transpile issue | Restart dev server; check `transpilePackages` in next.config |

---

## Rollback Procedures

### Vercel deployment rollback

```bash
# Via Vercel dashboard:
# 1. Go to project > Deployments
# 2. Find last known good deployment
# 3. Click "..." > "Promote to Production"

# Via CLI:
vercel ls                               # List deployments
vercel rollback <deployment-url>        # Rollback to specific deployment
```

### Database rollback

**Xata does not support point-in-time recovery on free tier.** Mitigations:

1. **Before migrations:** Export affected tables via `bun run db:analyze`
2. **Schema changes:** Always make in Xata dashboard first, then codegen
3. **Data issues:** Use `bun run db:interactive` to inspect and fix records
4. **Seed recovery:** `bun run db:fix-and-seed` recreates base data

### Git rollback

```bash
# Revert last commit (safe — creates new commit)
git revert HEAD

# Revert to specific commit (safe)
git revert <commit-sha>

# Reset branch to remote state (destructive — loses local changes)
git reset --hard origin/dev
```

---

## Security Notes (2026-03-29)

**Critical gap:** No authentication middleware exists. Every API route is publicly accessible.

| Route | Risk | Exposure |
|-------|------|----------|
| `/api/processing/scrape/batch` | High | Triggers expensive FireCrawl operations |
| `/api/prometheus/chat` | High | Unlimited OpenAI API calls |
| `/api/disclosure/mindmap` | High | OpenAI thread creation + file_search |
| `/api/disclosure/chat` | High | OpenAI assistant polling |
| `/api/processing/testimony` | Medium | Data injection into DB |
| `/api/admin/*` | Critical | Admin operations without auth |

**Planned fix:** Phase 0.3 of hardening plan — Clerk middleware in `apps/app/src/middleware.ts`.

---

## Architecture Quick Reference

```
Request flow (disclosure mindmap — the only working e2e AI path):

User query (Graph.tsx)
  -> useMindMapAgent hook (SSE client)
    -> POST /api/disclosure/mindmap
      -> OpenAI Assistants API (thread creation)
        -> file_search tool (vector store)
        -> searchDatabase tool (Xata full-text)
        -> searchExternalResources tool (Exa)
      -> SSE bridge (custom streaming)
    -> transformStreamResponse (client-side)
  -> Graph nodes + edges added to React Flow
```

See `docs/plans/2026-03-29-roundtable-unified-action-plan.md` for the full hardening plan.
