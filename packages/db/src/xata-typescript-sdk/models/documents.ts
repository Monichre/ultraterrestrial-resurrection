import { xata } from "../client";
import type { DocumentsRecord } from "../xata";

export type DocumentInput = {
	title: string;
	description?: string;
	content?: string;
	author?: string;
	"date-published"?: string;
	source?: string;
	"document-type"?: string;
	"classification-level"?: string;
	"release-date"?: string;
	"page-count"?: number;
	tags?: string[];
	verified?: boolean;
	"verification-notes"?: string;
	"government-acknowledgment"?: boolean;
	embedding?: number[];
	files?: any[];
	images?: any[];
};

export type DocumentUpdateInput = Partial<DocumentInput> & {
	id: string;
};

export async function getDocumentById(
	id: string,
): Promise<DocumentsRecord | null> {
	return await xata.db.documents.read(id);
}

export async function getDocumentByTitle(
	title: string,
): Promise<DocumentsRecord | null> {
	return await xata.db.documents
		.filter({ title })
		.getFirst();
}

export async function getAllDocuments(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
	columns?: string[];
}): Promise<{
	records: DocumentsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const { filter, sort, page = 1, size = 50, columns } = options || {};

	let query = xata.db.documents.filter(filter || {});

	if (columns && columns.length > 0) {
		query = query.select(columns as any);
	}

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

export async function createDocument(
	data: DocumentInput,
): Promise<DocumentsRecord> {
	return await xata.db.documents.create(data);
}

export async function updateDocument({
	id,
	...data
}: DocumentUpdateInput): Promise<DocumentsRecord | null> {
	return await xata.db.documents.update(id, data);
}

export async function deleteDocument(id: string): Promise<void> {
	await xata.db.documents.delete(id);
}

export async function searchDocuments(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
		filter?: Record<string, any>;
	},
): Promise<DocumentsRecord[]> {
	const searchOptions = {
		fuzziness: options?.fuzziness ?? 1,
		prefix: options?.prefix ?? "phrase",
		limit: options?.limit ?? 20,
		filter: options?.filter,
	};

	const results = await xata.db.documents.search(query, searchOptions);
	return results.records;
}

export async function getDocumentsByType(
	documentType: string,
): Promise<DocumentsRecord[]> {
	return await xata.db.documents
		.filter({ "document-type": documentType })
		.getAll();
}
