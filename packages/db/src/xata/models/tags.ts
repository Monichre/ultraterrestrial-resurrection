import { xata } from "../client";
import type { TagsRecord } from "../xata";

export type TagInput = Record<string, any>;

export type TagUpdateInput = Partial<TagInput> & {
	id: string;
};

export async function getTagById(id: string): Promise<TagsRecord | null> {
	return await xata.db.tags.read(id);
}

export async function getAllTags(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: TagsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.tags.filter(filter || {});

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

export async function createTag(data: TagInput): Promise<TagsRecord> {
	return await xata.db.tags.create(data);
}

export async function updateTag({
	id,
	...data
}: TagUpdateInput): Promise<TagsRecord | null> {
	return await xata.db.tags.update(id, data);
}

export async function deleteTag(id: string): Promise<void> {
	await xata.db.tags.delete(id);
}

export async function searchTags(
	query: string,
	limit = 10,
): Promise<TagsRecord[]> {
	const results = await xata.search.all(query, {
		tables: [{ table: "tags" }],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as TagsRecord[];
}
