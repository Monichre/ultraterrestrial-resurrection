"use server"

import { getPaginatedRecords } from "@db/postgres"

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
    more?: boolean
  }
}

export type FetchNextMindmapRecordsParams = {
  table: string
  size: number
  offset: number
}

/**
 * Server action wrapper for fetchNextMindmapRecords
 * This function can be safely called from client components
 */
export async function fetchNextMindmapRecords(
  params: FetchNextMindmapRecordsParams
): Promise<FetchNextMindmapRecordsResult> {
  const { records, hasMore } = await getPaginatedRecords( params.table, params.size, params.offset )
  const nodes: MindMapNode[] = records.map( ( record ) => ( {
    id: String( record.id ?? '' ),
    data: {
      label: String( (record as any).name ?? (record as any).title ?? record.id ?? '' ),
      ...record,
    },
    type: params.table,
  } ) )
  return { nodes, meta: { more: hasMore } }
}