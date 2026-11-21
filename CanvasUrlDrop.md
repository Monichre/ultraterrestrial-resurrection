# CanvasUrlDrop

Date: October 6th, 2026

## What this is

The research canvas already placed a dropped file as an artifact node and
fanned it out against the corpus (`POST /api/processing/drop`). A YouTube
link or page URL never reached that route because `graph.tsx` returned unless
the drag carried `Files`.

This adds URL and YouTube drops on the same path. It is unfurl, not ingest.

## Modules

| File | Role |
| --- | --- |
| [`apps/app/src/services/processing/drop/parse-url.ts`](apps/app/src/services/processing/drop/parse-url.ts) | Public http(s) check, YouTube video id, hostname label |
| [`apps/app/src/features/mindmap/drop/parse-dropped-url.ts`](apps/app/src/features/mindmap/drop/parse-dropped-url.ts) | Read `text/uri-list` / `text/plain` / `text/html` from a drop |
| [`apps/app/src/services/processing/drop/extract-url.ts`](apps/app/src/services/processing/drop/extract-url.ts) | oEmbed + existing Firecrawl scrape + HTML title fallback |
| [`apps/app/src/app/api/processing/drop/route.ts`](apps/app/src/app/api/processing/drop/route.ts) | Accepts `file` or `url`, then the same embed + `searchDatabase` fan-out |
| [`apps/app/src/features/mindmap/drop/use-canvas-drop.ts`](apps/app/src/features/mindmap/drop/use-canvas-drop.ts) | `handleFile` and `handleUrl` share node placement |
| [`apps/app/src/features/mindmap/graph.tsx`](apps/app/src/features/mindmap/graph.tsx) | Drag events accept URL types; console submit of one URL uses `handleUrl` |

## Process

```
drop / paste
  → parse public URL
  → POST /api/processing/drop  (url=…)
  → extract text (oEmbed / scrape / HTML)
  → embedQuery (first 8,000 chars)
  → searchDatabase fan-out
  → dropped-artifact node + dashed inferred edges
```

Nothing is written to `documents`, `document_chunks`, or entity tables.
`processResource` is not called. Lane A `youtube.py` is not called.

## Disclosure

- YouTube: stamp says matched via video page, not a transcript
- Page URL: stamp says matched via page text
- Image caption path is unchanged
