"use server";

import { xata } from "@db/xata/client";

console.log("🚀 ~ xata:", xata);

import { convertDatabaseRecordToMindMapNode } from "@/features/mindmap/utils/conversions";
import type { XataRecord } from "@xata.io/client";
import { q } from "framer-motion/dist/types.d-B50aGbjN";

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

	const xataTable = xata.db[table];

	console.log("🚀 ~ xataTable:", xataTable);

	try {
		// Get the dynamic table from xata client

		if (!xataTable) {
			throw new Error(`Table ${table} not found in Xata database`);
		}

		// Offset-based pagination (for initial load or specific positions)
		// Define the response type
		type XataResponse = {
			records: Array<{
				id: string;
				[key: string]: any;
				xata: {
					version: number;
					createdAt: string;
					updatedAt: string;
				};
			}>;
			meta: {
				page?: {
					cursor: string;
					more: boolean;
				};
			};
		};

		const {
			records,
			meta: {
				page: { more },
			},
		}: XataResponse = await xataTable.getPaginated({
			pagination: { size: size },
		});

		console.log("🚀 ~ response:", records);

		// Extract records and convert to serializable format
		const serializableRecords = records.map((record) =>
			record.toSerializable(),
		);

		// Convert to mind map nodes
		const nodes = serializableRecords.map(
			(record: Record<string, unknown>) => ({
				...convertDatabaseRecordToMindMapNode(record),
				type: "entityNode",
				data: {
					...convertDatabaseRecordToMindMapNode(record).data,
					type: table,
				},
			}),
		);

		console.log("🚀 ~ nodes ~ nodes:", nodes);

		return {
			nodes,
			meta: {
				more,
			},
		};
	} catch (error) {
		console.error(`Error fetching records from ${table}:`, error);
		throw error;
	}
}
