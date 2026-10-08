---
status: live
role: eng
spine: do
updated: 2026-10-07
lane: B
relates: T-060
---

# T-060 URL / YouTube canvas drop: handoff

**Written:** October 7th, 2026, 14:40 CDT. **Ticket:** T-060 in [`docs/plans/TODO.md`](docs/plans/TODO.md). **Session:** `6120d5d5-c831-485c-bbf0-e8c2a84cbbcb` (October 6th, 2026, 19:21–21:47 CDT).

## Goal

A YouTube link or page URL released on `/research-canvas` becomes a dropped-artifact node and fans out against the corpus, same as a file. Nothing is written to Postgres.

## Resume command

```
cd apps/app && bun test src/services/processing/drop/parse-url.test.ts
```

Then open `/research-canvas` and drop a public YouTube watch URL. Clerk gates `/api/processing/*`.

## Done (with evidence)

- Parser tests: `cd apps/app && bun test src/services/processing/drop/parse-url.test.ts` → `7 pass`, `0 fail`, `19 expect() calls`, exit 0. Ran October 7th, 2026, 14:40 CDT.
- Code on disk (uncommitted): URL parse, extract-url (oEmbed + existing Firecrawl scrape + HTML fallback), `POST /api/processing/drop` accepts `url`, canvas drag accepts `text/uri-list` / `text/plain` / `text/html`, node kinds `url` / `youtube` with disclosure stamps.
- File drop path was already live before this session. This session did not re-prove it.

## In flight

- Uncommitted edits in `apps/app/src/features/mindmap/drop/`, `apps/app/src/services/processing/drop/`, `apps/app/src/app/api/processing/drop/route.ts`, `apps/app/src/features/mindmap/graph.tsx`, `apps/app/src/features/mindmap/nodes/dropped-artifact-node.tsx`.
- Untracked: [`apps/app/src/services/processing/drop/parse-url.ts`](apps/app/src/services/processing/drop/parse-url.ts), [`apps/app/src/services/processing/drop/parse-url.test.ts`](apps/app/src/services/processing/drop/parse-url.test.ts), [`apps/app/src/services/processing/drop/extract-url.ts`](apps/app/src/services/processing/drop/extract-url.ts), [`apps/app/src/features/mindmap/drop/parse-dropped-url.ts`](apps/app/src/features/mindmap/drop/parse-dropped-url.ts), [`CanvasUrlDrop.md`](CanvasUrlDrop.md), [`CanvasUrlDrop_PSUEDOCODE.md`](CanvasUrlDrop_PSUEDOCODE.md).
- Contract on disk at [`docs/plans/2026-08-13-canvas-drop-ingest-contract.md`](docs/plans/2026-08-13-canvas-drop-ingest-contract.md) (section 7a rewritten to “landed”; that claim is code-only, not dogfood).

## Blocked

Nothing process-blocked. Dogfood needs a running Next app, a signed-in Clerk session for `/api/processing/drop`, and a public URL. Firecrawl may return empty; the HTML title fallback still needs 20+ characters.

## Not done

- Live YouTube drop, live page-URL drop, live file-drop regression.
- Console paste of a single URL (`handleEmptyCanvasSubmit`).
- T-060 status update, DoD report, commit, PR.
- Transcript fetch / Lane A ingest / corpus INSERT (still forbidden).

## Foreign dirty files (do not stage with this work)

- [`apps/app/src/features/mindmap/research-canvas/MessageInput.tsx`](apps/app/src/features/mindmap/research-canvas/MessageInput.tsx) — 47 insertions / 59 deletions. This session only changed the placeholder.
- [`apps/app/src/features/mindmap/drop/dropped-match-inspector.tsx`](apps/app/src/features/mindmap/drop/dropped-match-inspector.tsx) — copy change not in the session transcript.

## Single next action

Open `/research-canvas` and drop `https://www.youtube.com/watch?v=` plus a real public video id. Expect a pending youtube node, then fan-out edges or an honest empty-match state. Stamp must read “Matched via video page, not a transcript”.
