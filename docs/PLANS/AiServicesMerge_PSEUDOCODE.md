# AiServicesMerge — Pseudocode

**Date:** 2026-08-06 · **Revised:** 2026-08-06 17:48 CT  
**Constraint:** `packages/` only — NEVER edit `apps/`  
**Status:** CONTEXT merge done · services move plan-only

```
HARD_CONSTRAINT
  FORBIDDEN: any path under apps/
  ALLOWED: packages/**, docs that describe packages, root CONTEXT-MAP

REVIEW packages/ai AND packages/services
  ASSERT packages/ai has NO root package.json
  ASSERT packages/ai/prompts IS workspace "@repo/prompts" (live)
  ASSERT packages/services IS workspace "@ultraterrestrial/services"
  ASSERT ZERO package-to-package imports of "@ultraterrestrial/services"
  NOTE (do not act on): apps/app has parallel clients — out of scope
  FLAG document-library secret → scrubbed; human rotates Upstash

MERGE_CONTEXT (done)
  CANONICAL := packages/ai/prompts/CONTEXT.md
  STALE     := packages/prompts/CONTEXT.md → redirect

MERGE_SERVICES_INTO_AI (C′ packages-only — execute when approved)
  PHASE 0 — security / prune demo
    document-library env-only or DELETE
    inventory dupes INSIDE packages/services only

  PHASE 1 — promote packages/ai
    CREATE packages/ai/package.json name "@repo/ai"
    exports "./services" → packages/ai/services barrel
    ADD "packages/ai" to root workspaces (keep "packages/ai/prompts")

  PHASE 2 — physical move (packages only)
    git mv packages/services/{exa,firecrawl,deep-research} packages/ai/services/
    DROP nested deep-research package identity
    DEDUPE deep-research private exa/firecrawl vs siblings
    EXPORT @repo/ai/services
    OPTIONAL: thin packages/services re-export shim, then DELETE

  PHASE 3 — package self-check
    resolve @repo/ai/services without touching apps/
    DO NOT migrate any apps/ import

  PHASE 4 — retire shells
    DELETE packages/services/
    DELETE packages/prompts/ stub when safe
    UPDATE packages + docs paths only

  DONE WHEN
    - single CONTEXT for AI/Prompts
    - packages/ai owns personas + prompts + vendor clients
    - packages/services gone
    - zero files under apps/ modified by this job
```
