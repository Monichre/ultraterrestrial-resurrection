/**
 * Prometheus AI Tools
 *
 * NOTE: This file previously contained commented-out tool implementations.
 * The canonical tool implementations now live in the two primary API routes:
 *
 * - apps/app/src/app/api/disclosure/mindmap/route.ts  ← PRIMARY graph canvas agent
 *   Tools: file_search, searchDatabase, searchExternalResources, addGraphNodes, addGraphEdges
 *
 * - apps/app/src/app/api/prometheus/chat/route.ts  ← PRIMARY standalone chat (Vercel AI SDK)
 *   Tools: searchUAP, searchExternalResources, researchExternalTopic, processDocument
 *
 * The legacy route apps/app/src/app/api/disclosure/chat/route.ts still exists
 * for active mindmap chat-panel consumers (see TODO T-016 for migration plan).
 *
 * @deprecated Use API route implementations directly
 * @see apps/app/src/app/api/disclosure/mindmap/route.ts
 * @see apps/app/src/app/api/prometheus/chat/route.ts
 */

// This file is intentionally minimal to reduce maintenance burden.
// All tool logic is implemented in the API routes where it's used.

export {};
