import { getXataClient, type MindmapsRecord, type UsersRecord } from "../xata";

export type MindmapInput = {
	json: Record<string, any>;
	embedding?: number[];
	user: { id: string };
	file?: string;
};

export type MindmapUpdateInput = Partial<MindmapInput> & {
	id: string;
};

export async function getMindmapById(
	id: string,
): Promise<MindmapsRecord | null> {
	const xata = getXataClient();
	return await xata.db.mindmaps.read(id);
}

export async function getMindmapWithUser(
	id: string,
): Promise<(MindmapsRecord & { user: UsersRecord }) | null> {
	const xata = getXataClient();
	return (await xata.db.mindmaps
		.select(["*", "user.*"])
		.filter({ id })
		.getFirst()) as any;
}

export async function getAllMindmaps(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: MindmapsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const xata = getXataClient();
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.mindmaps.filter(filter || {});

	if (sort?.length) {
		for (const { column, direction } of sort) {
			query = query.sort(column, direction);
		}
	}

	const result = await query.getPaginated({
		pagination: { size, offset: (page - 1) * size },
	});

	return {
		records: result.records,
		pagination: {
			hasNextPage: result.hasNextPage,
			total: result.pagination?.total,
		},
	};
}

export async function getMindmapsByUserId(
	userId: string,
): Promise<MindmapsRecord[]> {
	const xata = getXataClient();
	return await xata.db.mindmaps
		.filter({
			"user.id": userId,
		})
		.getAll();
}

export async function createMindmap(
	data: MindmapInput,
): Promise<MindmapsRecord> {
	const xata = getXataClient();
	return await xata.db.mindmaps.create(data);
}

export async function updateMindmap({
	id,
	...data
}: MindmapUpdateInput): Promise<MindmapsRecord | null> {
	const xata = getXataClient();
	return await xata.db.mindmaps.update(id, data);
}

export async function deleteMindmap(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.mindmaps.delete(id);
}

export async function searchMindmapsByContent(
	query: string,
	limit = 10,
): Promise<MindmapsRecord[]> {
	const xata = getXataClient();

	// This is a simplified approach - in a real implementation you might parse
	// the JSON content and perform a more targeted search on specific fields
	// For now, we'll rely on Xata's vector search if embeddings are available

	// Try vector search first if the query can be embedded
	try {
		const results = await xata.db.mindmaps
			.vectorSearch("embedding", query, { size: limit })
			.getAll();

		if (results.length > 0) {
			return results;
		}
	} catch (e) {
		// Fall back to regular search if vector search fails
		console.error("Vector search failed:", e);
	}

	// Fall back to a basic text search on the JSON field
	// Note: This might not be very effective depending on how Xata indexes JSON fields
	const textResults = await xata.search.all(query, {
		tables: [{ table: "mindmaps" }],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return textResults.records as MindmapsRecord[];
}
