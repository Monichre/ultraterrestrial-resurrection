import {
	getXataClient,
	type DocumentsRecord,
	type PersonnelRecord,
	type OrganizationsRecord,
} from "../xata";

export type DocumentInput = {
	file?: string[];
	summary?: string;
	embedding?: number[];
	title?: string;
	date?: Date;
	author?: { id: string };
	organization?: { id: string };
	url?: string;
	metadata?: Record<string, any>;
	images?: string[];
	processed?: boolean;
};

export type DocumentUpdateInput = Partial<DocumentInput> & {
	id: string;
};

export async function getDocumentById(
	id: string,
): Promise<DocumentsRecord | null> {
	const xata = getXataClient();
	return await xata.db.documents.read(id);
}

export async function getAllDocuments(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: DocumentsRecord[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const xata = getXataClient();
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.documents.filter(filter || {});

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

export async function getDocumentsWithRelations(options?: {
	filter?: Record<string, any>;
	sort?: { column: string; direction: "asc" | "desc" }[];
	page?: number;
	size?: number;
}): Promise<{
	records: (DocumentsRecord & {
		author?: PersonnelRecord;
		organization?: OrganizationsRecord;
	})[];
	pagination: { hasNextPage: boolean; total?: number };
}> {
	const xata = getXataClient();
	const { filter, sort, page = 1, size = 50 } = options || {};

	let query = xata.db.documents
		.filter(filter || {})
		.select(["*", "author.*", "organization.*"]);

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

export async function createDocument(
	data: DocumentInput,
): Promise<DocumentsRecord> {
	const xata = getXataClient();
	return await xata.db.documents.create(data);
}

export async function updateDocument({
	id,
	...data
}: DocumentUpdateInput): Promise<DocumentsRecord | null> {
	const xata = getXataClient();
	return await xata.db.documents.update(id, data);
}

export async function deleteDocument(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.documents.delete(id);
}

export async function searchDocuments(
	query: string,
	limit = 10,
): Promise<DocumentsRecord[]> {
	const xata = getXataClient();
	const results = await xata.search.all(query, {
		tables: [{ table: "documents", target: ["title", "summary"] }],
		fuzziness: 1,
		prefix: "phrase",
		limit,
	});

	return results.records as DocumentsRecord[];
}

export async function getUnprocessedDocuments(): Promise<DocumentsRecord[]> {
	const xata = getXataClient();
	return await xata.db.documents.filter({ processed: false }).getAll();
}

export async function markDocumentAsProcessed(
	id: string,
): Promise<DocumentsRecord | null> {
	const xata = getXataClient();
	return await xata.db.documents.update(id, { processed: true });
}
