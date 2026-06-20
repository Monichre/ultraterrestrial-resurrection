"use server";

import { loadEntityGraph } from "@db/postgres";
import type { NetworkGraphPayload as _NetworkGraphPayload } from "@db/postgres";

// Re-export the canonical NetworkGraphPayload type so callers can import it
// from this action file (backward-compat path used by page.tsx, 3d components, etc.)
export type NetworkGraphPayload = _NetworkGraphPayload;

// MindMapNode: the shape consumed by mindmap-context.tsx for retrieved entities
export interface MindMapNode {
  id: string;
  data: {
    label: string;
    type: string;
    [key: string]: unknown;
  };
  type: string;
}

export async function getEntityNetworkGraphData({ maxNodesPerType }: { maxNodesPerType?: number } = {}) {
  const data = await loadEntityGraph(maxNodesPerType);
  console.log('~ getEntityNetworkGraphData ~ data:', data)
  return data;
}

export async function getBoundedInitialGraphData({ maxNodesPerType = 30 }: { maxNodesPerType?: number } = {}) {
  return getEntityNetworkGraphData({ maxNodesPerType });
}