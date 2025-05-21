import { getXataClient, type ArtifactsRecord } from "../xata";

export type ArtifactInput = {
	name: string;
	description?: string;
	photos?: string[];
	date?: string;
	source?: string;
	origin?: string;
	images?: string[];
	embedding?: number[];
};

export type ArtifactUpdateInput = Partial<ArtifactInput> & {
	id: string;
};

export async function getArtifactById(
	id: string,
): Promise<ArtifactsRecord | null> {
	const xata = getXataClient();
	return await xata.db.artifacts.read(id);
}

export async function getArtifactByName(
	name: string,
): Promise<ArtifactsRecord | null> {
	const xata = getXataClient();
	const artifacts = await xata.db.artifacts.filter({ name }).getAll();
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
	const xata = getXataClient();
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
	const xata = getXataClient();
	return await xata.db.artifacts.create(data);
}

export async function updateArtifact({
	id,
	...data
}: ArtifactUpdateInput): Promise<ArtifactsRecord | null> {
	const xata = getXataClient();
	return await xata.db.artifacts.update(id, data);
}

export async function deleteArtifact(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.artifacts.delete(id);
}

export async function searchArtifacts(
	query: string,
	limit = 10,
): Promise<ArtifactsRecord[]> {
	const xata = getXataClient();
	const results = await xata.search.all(query, {
		tables: [
			{
				table: "artifacts",
				target: ["name", "description", "origin", "source"],
			},
		],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as ArtifactsRecord[];
}

export async function findOrCreateArtifact(
	data: ArtifactInput,
): Promise<ArtifactsRecord> {
	const existing = await getArtifactByName(data.name);

	if (existing) {
		const updated = await updateArtifact({
			id: existing.id,
			...data,
		});
		return updated!;
	}

	return await createArtifact(data);
}
