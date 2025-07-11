"use server"

import { fetchNextMindmapRecords as _fetchNextMindmapRecords } from "@db/xata/api/xyflow-integration"

export type MindMapNode = {
  id: string
  data: {
    label: string;
    [key: string]: unknown
  }
  type: string
}

export type FetchNextMindmapRecordsResult = {
  nodes: MindMapNode[]
  meta: {
    cursor?: string
    more?: boolean
  }
}

export type FetchNextMindmapRecordsParams = {
  table: string
  size: number
  offset: number
  cursor?: string
}

/**
 * Server action wrapper for fetchNextMindmapRecords
 * This function can be safely called from client components
 */
export async function fetchNextMindmapRecords(
  params: FetchNextMindmapRecordsParams
): Promise<FetchNextMindmapRecordsResult> {
  return await _fetchNextMindmapRecords( params )
} 