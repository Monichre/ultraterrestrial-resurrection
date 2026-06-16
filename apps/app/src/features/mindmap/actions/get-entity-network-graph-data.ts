"use server";

import { loadEntityGraph } from "@db/postgres";

export async function getEntityNetworkGraphData({ maxNodesPerType }: { maxNodesPerType?: number } = {}) {
  const data = await loadEntityGraph(maxNodesPerType);
  console.log('~ getEntityNetworkGraphData ~ data:', data)
  return data;
}

export async function getBoundedInitialGraphData({ maxNodesPerType = 30 }: { maxNodesPerType?: number } = {}) {
  return getEntityNetworkGraphData({ maxNodesPerType });
}