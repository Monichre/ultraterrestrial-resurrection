import {
	getXataClient,
	type SummaryFilesRecord,
	type DocumentsRecord,
} from "../xata";

export type SummaryFileInput = {
	name?: string;
	file?: string;
	source?: string;
	metadata?: Record<string, any>;
	images?: string;
	content?: string;
	embedding?: any[];
	document?: { id: string };
};

export type SummaryFileUpdateInput = Partial<SummaryFileInput> & {
	id: string;
};

export async function getSummaryFileById(
	id: string,
): Promise<SummaryFilesRecord | null> {
	const xata = getXataClient();
	return await xata.db["summary-files"].read(id);
}

export async function getSummaryFileByDocumentId(
	documentId: string,
): Promise<SummaryFilesRecord | null> {
	const xata = getXataClient();
	const files = await xata.db["summary-files"]
		.filter({
			"document.id": documentId,
		})
		.getAll();

	return files.length > 0 ? files[0] : null;
}

export async function getAllSummaryFiles(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: SummaryFilesRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const xata = getXataClient();
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db["summary-files"].filter(filter || {});

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

export async function getSummaryFilesWithDocuments(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: (SummaryFilesRecord & { document: DocumentsRecord })[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const xata = getXataClient();
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db["summary-files"]
		.filter(filter || {})
		.select(["*", "document.*"]);

	if (sort?.length) {
		for (const { column, direction } of sort) {
			query = query.sort(column, direction);
		}
	}

	const result = await query.getPaginated({
		pagination: { size, offset: (page - 1) * size },
	});

	return {
		records: result.records as any[],
		pagination: {
			hasNextPage: result.hasNextPage,
			total: result.pagination?.total,
		},
	};
}

export async function createSummaryFile(
	data: SummaryFileInput,
): Promise<SummaryFilesRecord> {
	const xata = getXataClient();
	return await xata.db["summary-files"].create(data);
}

export async function updateSummaryFile({
	id,
	...data
}: SummaryFileUpdateInput): Promise<SummaryFilesRecord | null> {
	const xata = getXataClient();
	return await xata.db.summary_files.update(id, data);
}

export async function deleteSummaryFile(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.summary_files.delete(id);
}

export async function searchSummaryFiles(
	query: string,
	limit = 10,
): Promise<SummaryFilesRecord[]> {
	const xata = getXataClient();
	const results = await xata.search.all(query, {
		tables: [{ table: "summary_files", target: ["name", "content", "source"] }],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as SummaryFilesRecord[];
}

export async function findOrCreateSummaryFile(
	data: SummaryFileInput,
): Promise<SummaryFilesRecord> {
	// We can only have one summary file per document due to the unique constraint
	if (data.document?.id) {
		const existing = await getSummaryFileByDocumentId(data.document.id);

		if (existing) {
			const updated = await updateSummaryFile({
				id: existing.id,
				...data,
			});
			return updated!;
		}
	}

	return await createSummaryFile(data);
}
