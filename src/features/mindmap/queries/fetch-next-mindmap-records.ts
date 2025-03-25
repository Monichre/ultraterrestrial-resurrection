"use server";

import { xata } from "@/db/xata/client";
import { convertDatabaseRecordToMindMapNode } from "@/features/mindmap/utils/conversions";
import type { XataRecord } from "@xata.io/client";

// Type for the input parameters
type FetchNextMindmapRecordsParams = {
	table: string;
	size: number;
	offset: number;
	cursor?: string;
};

// Type for the return data structure
export type MindMapNode = {
	id: string;
	data: {
		label: string;
		[key: string]: unknown;
	};
	type: string;
};

export type FetchNextMindmapRecordsResult = {
	nodes: MindMapNode[];
	meta: {
		cursor?: string;
	};
};

/**
 * Server action to fetch paginated records from specified table and convert them to mindmap nodes
 */
export async function fetchNextMindmapRecords(
	params: FetchNextMindmapRecordsParams,
): Promise<FetchNextMindmapRecordsResult> {
	const { table, size, offset, cursor } = params;

	console.log("🚀 ~ offset:", offset);
	console.log("🚀 ~ size:", size);
	console.log("🚀 ~ table:", table);
	console.log("🚀 ~ cursor:", cursor);

	try {
		// Get the dynamic table from xata client
		const xataTable = xata.db[table as keyof typeof xata.db];

		if (!xataTable) {
			throw new Error(`Table ${table} not found in Xata database`);
		}

		// Fetch records with pagination - choose one approach
		let response;

		if (cursor) {
			// Cursor-based pagination (preferred for large datasets)
			response = await xataTable.getPaginated({
				pagination: { size, cursor },
			});
		} else {
			// Offset-based pagination (for initial load or specific positions)
			response = await xataTable.getPaginated({
				pagination: { size, offset },
			});
		}

		// Extract records and convert to serializable format
		const records = response.records.map((record: XataRecord) =>
			record.toSerializable(),
		);

		// Convert to mind map nodes
		const nodes = records.map((record: Record<string, unknown>) => ({
			...convertDatabaseRecordToMindMapNode(record),
			type: "entityNode",
			data: {
				...convertDatabaseRecordToMindMapNode(record).data,
				type: table,
			},
		}));

		return {
			nodes,
			meta: {
				cursor: response.meta?.page?.cursor,
			},
		};
	} catch (error) {
		console.error(`Error fetching records from ${table}:`, error);
		throw error;
	}
}
