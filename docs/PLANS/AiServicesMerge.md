# AiServicesMerge — Plan

**Date:** 2026-08-06 17:25 CT · **Revised:** 2026-08-06 17:48 CT  
**Scope:** absorb `packages/services` into `packages/ai`; resolve duplicate AI/Prompts CONTEXT  
**Hard constraint:** **`packages/` only — do not touch `apps/`** (no route rewires, no app client deletes, no app import changes)  
**Pseudocode:** [`AiServicesMerge_PSEUDOCODE.md`](./AiServicesMerge_PSEUDOCODE.md)  
**Status:** CONTEXT merge done · **C′ packages-only merge executed 2026-08-06**

---

## 1. Current state (grounded)

| Surface | What it actually is | In scope? |
|---|---|---|
| `packages/ai/` | Agent-suite markdown + nested `@repo/prompts` | Yes |
| `packages/ai/prompts/` | Live workspace `@repo/prompts` | Yes |
| `packages/services/` | Orphaned `@ultraterrestrial/services` (Exa / Firecrawl / deep-research / document-library) | Yes — merge target |
| `packages/prompts/` | Redirect stub CONTEXT only | Yes — cleanup |
| Anything under `apps/` | Parallel live Exa/Firecrawl clients, routes, tool schemas | **Out of scope — leave alone** |

Key architectural facts (packages only):

1. **`packages/ai` is not a TypeScript package today** — no root `package.json`. Only `packages/ai/prompts` is a Bun workspace member.
2. **`@ultraterrestrial/services` has zero in-repo package consumers.** It is safe to relocate within `packages/` without breaking another package.
3. **Internal duplication inside services:** `deep-research/src/{exa,firecrawl}` re-implements the top-level `exa/` and `firecrawl/` modules.
4. **Security:** `document-library/client.ts` token redacted to env; human still must rotate Upstash credential.
5. **Logical tool names** live in `packages/ai/shared/01-tool-registry.md`. Vendor clients belong as adapters under AI, not as a sibling workspace.

---

## 2. Target shape

```text
packages/ai/                         # @repo/ai  (new root package)
├── package.json                     # exports: ./services, optional ./agents metadata
├── README.md / MANIFEST.md / registry.json
├── agents/ | adversaries/ | shared/ # unchanged persona grammar
├── prompts/                         # keep @repo/prompts sub-workspace
│   └── CONTEXT.md                   # ← SINGLE AI/Prompts domain context
└── services/                        # moved from packages/services
    ├── index.ts                     # barrel
    ├── exa/
    ├── firecrawl/
    └── deep-research/               # collapse nested package.json into subpath
```

**Package names**

| Today | After |
|---|---|
| `@repo/prompts` | unchanged path + name |
| `@ultraterrestrial/services` | `@repo/ai/services` (subpath export) |
| `@ultraterrestrial/deep-research` | drop nested package; export `@repo/ai/services/deep-research` or fold into barrel |
| *(none)* | `@repo/ai` root |

Optional one-release shim: leave `packages/services/package.json` as `"main"` re-export of `@repo/ai/services` so historical docs don't break — then delete.

---

## 3. Decision fork (packages-only — A/B superseded)

Earlier A/B/C assumed rewiring or pruning against `apps/app`. **That fork is closed.** Binding constraint from owner:

> Do not touch anything in `apps/`. Job is solely `packages/`.

| Option | Status | Meaning under constraint |
|---|---|---|
| **A. Package becomes product SoT** | Deferred / out of scope | Would require migrating `apps/` routes onto the package |
| **B. Leave app clients; prune services** | Deferred / out of scope for *this* job if it means deciding app ownership | Would be a delete-without-merge story, still packages-only if we only delete `packages/services` — but owner asked to **merge into AI**, not prune |
| **C′. Packages-only merge (active)** | **Selected** | Physically move `packages/services` → `packages/ai/services`, promote `@repo/ai`, dedupe *inside* the moved tree, retire `packages/services`. Do not import from or edit `apps/`. Future app adoption is a separate ticket owned elsewhere. |

**Done condition for this job:** one AI workspace under `packages/ai` that owns personas + prompts + vendor service clients; `packages/services` gone (or thin re-export shim deleted after); no files under `apps/` modified.

---

## 4. Phased execution (packages only)

### Phase 0 — Mitigate (before any `git mv`)

- [x] CONTEXT duplicate resolved (see §5)
- [x] Redact Upstash token in `document-library/client.ts` (env-only) — then deleted with module
- [ ] **Human:** rotate that Upstash Search credential in the console (history still has the old value)
- [x] Delete `document-library/` (movies-index demo)
- [x] Inventory + drop nested `deep-research/src/{exa,firecrawl}` dupes

### Phase 1 — Promote `@repo/ai`

- [x] Add `packages/ai/package.json` with exports for `./services`
- [x] Add `"packages/ai"` to root `workspaces` (keep `"packages/ai/prompts"`)
- [x] Update `packages/ai/README.md` to describe: personas + prompts + services adapters

### Phase 2 — Move services

- [x] `git mv` `exa`, `firecrawl`, `deep-research` → `packages/ai/services/`
- [x] Single barrel; remove nested `@ultraterrestrial/deep-research` package identity
- [x] Deduplicate deep-research's private exa/firecrawl copies against siblings
- [x] Keep existing zod dependency as-is for now

### Phase 3 — Package self-check (not app wiring)

- [ ] `bun` resolve `@repo/ai/services` from a packages-local smoke import
- [x] No `packages/services` shim — deleted outright (zero package consumers)
- [x] Explicitly **did not** change any `apps/` import

### Phase 4 — Retire shells

- [x] Remove `packages/services/`
- [ ] Keep `packages/prompts/` redirect stub for now (CONTEXT-MAP points at canonical)
- [x] Sweep packages + docs paths (`CONTEXT-MAP`, `domain.md`, root README, AI README)

---

## 5. CONTEXT merge (executed 2026-08-06)

### Problem

Two files both claimed "AI / Prompts" context:

| File | Role | Flaw |
|---|---|---|
| `packages/prompts/CONTEXT.md` | Product voice: roles, liturgy, persistence | Stale: claims `packages/prompts/` is not a package; CONTEXT-MAP pointed here |
| `packages/ai/prompts/CONTEXT.md` | Corpus glossary: registry IDs, templates, legacy shims | Missing operational voice / role definitions |

### Mitigation / merge

1. **Canonical home:** `packages/ai/prompts/CONTEXT.md` (sits with `@repo/prompts`).
2. **Merged content:** voice contract + five roles + liturgy + persistence (from stub) **plus** corpus terms + register distinctions + legacy vocab (from ai/prompts).
3. **Truth fix:** document that code lives at `packages/ai/prompts` (`@repo/prompts`), while Canvas liturgy schemas still live in `apps/app` server actions until extracted.
4. **`packages/prompts/CONTEXT.md` → redirect stub** so old links don't 404.
5. **`CONTEXT-MAP.md` + `docs/agents/ops/domain.md`** updated to the canonical path.

No second AI context under `packages/services` — services become a **module inside AI**, not a domain context of their own. Vendor client vocabulary stays under AI/Prompts (tool adapters) or system CONTEXT reserved words.

---

## 6. Risks

| Risk | Mitigation |
|---|---|
| Moving unused code looks like progress | Phase 3 requires one live consumer or explicit prune (Option B) |
| Zod 3 vs 4 split | Don't drag zod schemas into package until majors align |
| Secret in git history | Redact file; rotate token; history still dirty — rotate is mandatory |
| Agents treat 18 persona `.md` files as runtime | CONTEXT already forbids this; keep forbidding after merge |
| `packages/ai` grows into a god-package | Hard boundary: `prompts/` = language, `services/` = vendor adapters, `agents/` = persona grammar only |

---

## 7. Out of scope

- **Everything under `apps/`** — no edits, no import migrations, no dogfood of product routes as part of this job
- Extracting Canvas voice contract into `@repo/prompts` (lives in app today; separate ticket, different owner)
- Wiring the 18 researcher personas as production agents
- Touching `packages/db` beyond incidental docs

---

## 8. Suggested ticket slice (Linear)

1. **UT-ai-ctx** — CONTEXT merge + map updates *(done)*  
2. **UT-ai-sec** — scrub document-library secret + rotate Upstash *(scrub done; rotate = human)*  
3. **UT-ai-pkg** — create `@repo/ai`, move services, barrel exports *(packages only)*  
4. **UT-ai-retire** — delete `packages/services` + `packages/prompts` stub  
5. ~~UT-ai-wire~~ — **deferred** (would touch `apps/`)

---

## 9. Files touched this session

| File | Action |
|---|---|
| `packages/ai/prompts/CONTEXT.md` | Merged canonical CONTEXT |
| `packages/prompts/CONTEXT.md` | Redirect stub |
| `CONTEXT-MAP.md` | Point to canonical path |
| `docs/agents/ops/domain.md` | Tree + path fix |
| `docs/plans/AiServicesMerge.md` | This plan |
| `docs/plans/AiServicesMerge_PSEUDOCODE.md` | Pseudocode |
| `packages/services/document-library/client.ts` | Secret redacted (rotate still required) |
