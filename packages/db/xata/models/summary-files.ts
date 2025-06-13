import { xata } from "../client";
import type { SummaryFilesRecord } from "../xata";

export type SummaryFileInput = {
	title?: string;
	content?: string;
	"file-path"?: string;
	"file-type"?: string;
	"file-size"?: number;
	"created-at"?: string;
	"updated-at"?: string;
	summary?: string;
	keywords?: string[];
	metadata?: Record<string, any>;
	processed?: boolean;
	embedding?: number[];
};

export type SummaryFileUpdateInput = Partial<SummaryFileInput> & {
	id: string;
};

export async function getSummaryFileById(
	id: string,
): Promise<SummaryFilesRecord | null> {
	return await xata.db["summary-files"].read(id);
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

export async function getSummaryFilesByType(
	fileType: string,
): Promise<SummaryFilesRecord[]> {
	return await xata.db["summary-files"]
		.filter({ "file-type": fileType })
		.getAll();
}

export async function getUnprocessedSummaryFiles(): Promise<
	SummaryFilesRecord[]
> {
	return await xata.db["summary-files"]
		.filter({ processed: false })
		.getAll();
}

export async function createSummaryFile(
	data: SummaryFileInput,
): Promise<SummaryFilesRecord> {
	return await xata.db["summary-files"].create(data);
}

export async function updateSummaryFile({
	id,
	...data
}: SummaryFileUpdateInput): Promise<SummaryFilesRecord | null> {
	return await xata.db["summary-files"].update(id, data);
}

export async function deleteSummaryFile(id: string): Promise<void> {
	await xata.db["summary-files"].delete(id);
}

export async function searchSummaryFiles(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
		filter?: Record<string, any>;
	},
): Promise<SummaryFilesRecord[]> {
	const searchOptions = {
		fuzziness: options?.fuzziness ?? 1,
		prefix: options?.prefix ?? "phrase",
		limit: options?.limit ?? 20,
		filter: options?.filter,
	};

	const results = await xata.db["summary-files"].search(query, searchOptions);
	return results.records;
}

export async function markSummaryFileAsProcessed(
	id: string,
): Promise<SummaryFilesRecord | null> {
	return await xata.db["summary-files"].update(id, { processed: true });
}
