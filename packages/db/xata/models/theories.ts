import { xata } from "../client";
import type { TheoriesRecord } from "../xata";

export type TheoryInput = Record<string, any>;

export type TheoryUpdateInput = Partial<TheoryInput> & {
	id: string;
};

export async function getTheoryById(
	id: string,
): Promise<TheoriesRecord | null> {
	return await xata.db.theories.read(id);
}

export async function getAllTheories(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: TheoriesRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.theories.filter(filter || {});

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

export async function createTheory(data: TheoryInput): Promise<TheoriesRecord> {
	return await xata.db.theories.create(data);
}

export async function updateTheory({
	id,
	...data
}: TheoryUpdateInput): Promise<TheoriesRecord | null> {
	return await xata.db.theories.update(id, data);
}

export async function deleteTheory(id: string): Promise<void> {
	await xata.db.theories.delete(id);
}

export async function searchTheories(
	query: string,
	limit = 10,
): Promise<TheoriesRecord[]> {
	const results = await xata.search.all(query, {
		tables: [{ table: "theories" }],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as TheoriesRecord[];
}
