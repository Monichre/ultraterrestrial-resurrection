"use server";

import { getEntityNetworkGraphData as _getEntityNetworkGraphData } from "@db/src/xata-typescript-sdk/api";

export async function getEntityNetworkGraphData(...args: Parameters<typeof _getEntityNetworkGraphData>) {
  const data = await _getEntityNetworkGraphData(...args);
  console.log('🚀 ~ getEntityNetworkGraphData ~ data:', data)
  return data;
} 