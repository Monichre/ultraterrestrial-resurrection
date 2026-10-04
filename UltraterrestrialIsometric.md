# UltraterrestrialIsometric

Self-contained isometric map of the Ultraterrestrial Resurrection monorepo. Open `UltraterrestrialIsometric.html`.

Headline from `scc` (ts/tsx/js/jsx/py/sql/css/scss, excluding node_modules/.next/.venv/corpus): **356,401** source LOC. Vercel deploys **one** service (`apps/app`).

## Lenses

1. **Workspaces** — apps/app, packages, Python RAG, lab, storage slabs.
2. **Mindmap path** — Research Canvas → `/api/disclosure/mindmap` → Neon + OpenAI + Exa.
3. **Shipped · disconnected** — red: Python RAG (no shared DB) and Clerk (does not lock canvas AI). Dashed orphan edge is the missing bridge.
4. **Call chain** — eight junctures from `Index()` (`research-canvas/page.tsx:14`) through `searchDatabase` (`search.ts:348`) back to `splitSseLines`.

## Height

`h = min(7, max(1, 1 + round(6 * (log10(max(loc,50)) - 1.70) / 3.37)))` because the in-app UI library (116,474 LOC) would flatten everyone else on a linear scale.

**The artifact stays private until you share it from the page menu.**
