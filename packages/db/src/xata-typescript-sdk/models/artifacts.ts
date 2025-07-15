import { xata } from "../client";
import type { ArtifactsRecord } from "../xata";

export type ArtifactInput = {
	title: string;
	description?: string;
	location?: string;
	"date-discovered"?: string;
	"discovered-by"?: string;
	significance?: string;
	"material-composition"?: string;
	dimensions?: string;
	weight?: string;
	condition?: string;
	embedding?: number[];
	photo?: any;
};

export type ArtifactUpdateInput = Partial<ArtifactInput> & {
	id: string;
};

export async function getArtifactById(
	id: string,
): Promise<ArtifactsRecord | null> {
	return await xata.db.artifacts.read(id);
}

export async function getArtifactByTitle(
	title: string,
): Promise<ArtifactsRecord | null> {
	const artifacts = await xata.db.artifacts.filter({ title }).getAll();
	return artifacts.length > 0 ? artifacts[0] : null;
}

export async function getAllArtifacts(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: ArtifactsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.artifacts.filter(filter || {});

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

export async function createArtifact(
	data: ArtifactInput,
): Promise<ArtifactsRecord> {
	return await xata.db.artifacts.create(data);
}

export async function updateArtifact({
	id,
	...data
}: ArtifactUpdateInput): Promise<ArtifactsRecord | null> {
	return await xata.db.artifacts.update(id, data);
}

export async function deleteArtifact(id: string): Promise<void> {
	await xata.db.artifacts.delete(id);
}

export async function searchArtifacts(
	query: string,
	limit = 10,
): Promise<ArtifactsRecord[]> {
	const results = await xata.search.all(query, {
		tables: [{ table: "artifacts" }],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as ArtifactsRecord[];
}

export async function findOrCreateArtifact(
	data: ArtifactInput,
): Promise<ArtifactsRecord> {
	const existing = await getArtifactByTitle(data.title);

	if (existing) {
		const updated = await updateArtifact({
			id: existing.id,
			...data,
		});
		return updated!;
	}

	return await createArtifact(data);
}
