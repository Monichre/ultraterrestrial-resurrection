import { xata } from "../client";
import type {
	UserSavedEventsRecord,
	UserSavedTopicsRecord,
	UserSavedKeyFigureRecord,
	UserSavedTestimoniesRecord,
	UserSavedDocumentsRecord,
	UserSavedOrganizationsRecord,
	UserSavedSightingsRecord,
} from "../xata";

// User Saved Events
export type UserSavedEventInput = {
	user: { id: string };
	event: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedEventUpdateInput = Partial<UserSavedEventInput> & {
	id: string;
};

export async function getUserSavedEventById(
	id: string,
): Promise<UserSavedEventsRecord | null> {
	return await xata.db["user-saved-events"].read(id);
}

export async function getUserSavedEvents(
	userId: string,
): Promise<UserSavedEventsRecord[]> {
	return await xata.db["user-saved-events"]
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedEvent(
	data: UserSavedEventInput,
): Promise<UserSavedEventsRecord> {
	return await xata.db["user-saved-events"].create(data);
}

export async function updateUserSavedEvent({
	id,
	...data
}: UserSavedEventUpdateInput): Promise<UserSavedEventsRecord | null> {
	return await xata.db["user-saved-events"].update(id, data);
}

export async function deleteUserSavedEvent(id: string): Promise<void> {
	await xata.db["user-saved-events"].delete(id);
}

/**
 * Search for user saved events
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching user saved events
 */
export async function searchUserSavedEvents(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
	},
): Promise<UserSavedEventsRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		// Prepare filter if userId is provided
		let filter: Record<string, any> | undefined;
		if (options?.userId) {
			filter = { "user.id": options.userId };
		}

		// Table-specific search
		if (filter) {
			const results = await xata.db["user-saved-events"].search(query, {
				fuzziness: options?.fuzziness ?? 1,
				prefix: options?.prefix ?? "phrase",
				filter,
				limit: options?.limit ?? 20,
			});
			return results.records;
		}

		// Cross-table search with table targeting
		const results = await xata.search.all(query, {
			tables: [
				{
					table: "user-saved-events",
					target: ["note", "note-title"],
					filter,
				},
			],
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 20,
		});

		return results.records as UserSavedEventsRecord[];
	} catch (error) {
		console.error(
			`Error searching user saved events with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search user saved events: ${(error as Error).message}`,
		);
	}
}

// User Saved Topics
export type UserSavedTopicInput = {
	user: { id: string };
	topic: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedTopicUpdateInput = Partial<UserSavedTopicInput> & {
	id: string;
};

export async function getUserSavedTopicById(
	id: string,
): Promise<UserSavedTopicsRecord | null> {
	return await xata.db["user-saved-topics"].read(id);
}

export async function getUserSavedTopics(
	userId: string,
): Promise<UserSavedTopicsRecord[]> {
	return await xata.db["user-saved-topics"]
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedTopic(
	data: UserSavedTopicInput,
): Promise<UserSavedTopicsRecord> {
	return await xata.db["user-saved-topics"].create(data);
}

export async function updateUserSavedTopic({
	id,
	...data
}: UserSavedTopicUpdateInput): Promise<UserSavedTopicsRecord | null> {
	return await xata.db["user-saved-topics"].update(id, data);
}

export async function deleteUserSavedTopic(id: string): Promise<void> {
	await xata.db["user-saved-topics"].delete(id);
}

/**
 * Search for user saved topics
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching user saved topics
 */
export async function searchUserSavedTopics(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
	},
): Promise<UserSavedTopicsRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		// Prepare filter if userId is provided
		let filter: Record<string, any> | undefined;
		if (options?.userId) {
			filter = { "user.id": options.userId };
		}

		// Table-specific search
		if (filter) {
			const results = await xata.db["user-saved-topics"].search(query, {
				fuzziness: options?.fuzziness ?? 1,
				prefix: options?.prefix ?? "phrase",
				filter,
				limit: options?.limit ?? 20,
			});
			return results.records;
		}

		// Cross-table search with table targeting
		const results = await xata.search.all(query, {
			tables: [
				{
					table: "user-saved-topics",
					target: ["note", "note-title"],
					filter,
				},
			],
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 20,
		});

		return results.records as UserSavedTopicsRecord[];
	} catch (error) {
		console.error(
			`Error searching user saved topics with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search user saved topics: ${(error as Error).message}`,
		);
	}
}

// User Saved Key Figure
export type UserSavedKeyFigureInput = {
	user: { id: string };
	"key-figure": { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedKeyFigureUpdateInput = Partial<UserSavedKeyFigureInput> & {
	id: string;
};

export async function getUserSavedKeyFigureById(
	id: string,
): Promise<UserSavedKeyFigureRecord | null> {
	return await xata.db["user-saved-key-figure"].read(id);
}

export async function getUserSavedKeyFigures(
	userId: string,
): Promise<UserSavedKeyFigureRecord[]> {
	return await xata.db["user-saved-key-figure"]
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedKeyFigure(
	data: UserSavedKeyFigureInput,
): Promise<UserSavedKeyFigureRecord> {
	return await xata.db["user-saved-key-figure"].create(data);
}

export async function updateUserSavedKeyFigure({
	id,
	...data
}: UserSavedKeyFigureUpdateInput): Promise<UserSavedKeyFigureRecord | null> {
	return await xata.db["user-saved-key-figure"].update(id, data);
}

export async function deleteUserSavedKeyFigure(id: string): Promise<void> {
	await xata.db["user-saved-key-figure"].delete(id);
}

/**
 * Search for user saved key figures
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching user saved key figures
 */
export async function searchUserSavedKeyFigures(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
	},
): Promise<UserSavedKeyFigureRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		// Prepare filter if userId is provided
		let filter: Record<string, any> | undefined;
		if (options?.userId) {
			filter = { "user.id": options.userId };
		}

		// Table-specific search
		if (filter) {
			const results = await xata.db["user-saved-key-figure"].search(query, {
				fuzziness: options?.fuzziness ?? 1,
				prefix: options?.prefix ?? "phrase",
				filter,
				limit: options?.limit ?? 20,
			});
			return results.records;
		}

		// Cross-table search with table targeting
		const results = await xata.search.all(query, {
			tables: [
				{
					table: "user-saved-key-figure",
					target: ["note", "note-title"],
					filter,
				},
			],
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 20,
		});

		return results.records as UserSavedKeyFigureRecord[];
	} catch (error) {
		console.error(
			`Error searching user saved key figures with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search user saved key figures: ${(error as Error).message}`,
		);
	}
}

// User Saved Testimonies
export type UserSavedTestimonyInput = {
	user: { id: string };
	testimony: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedTestimonyUpdateInput = Partial<UserSavedTestimonyInput> & {
	id: string;
};

export async function getUserSavedTestimonyById(
	id: string,
): Promise<UserSavedTestimoniesRecord | null> {
	return await xata.db["user-saved-testimonies"].read(id);
}

export async function getUserSavedTestimonies(
	userId: string,
): Promise<UserSavedTestimoniesRecord[]> {
	return await xata.db["user-saved-testimonies"]
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedTestimony(
	data: UserSavedTestimonyInput,
): Promise<UserSavedTestimoniesRecord> {
	return await xata.db["user-saved-testimonies"].create(data);
}

export async function updateUserSavedTestimony({
	id,
	...data
}: UserSavedTestimonyUpdateInput): Promise<UserSavedTestimoniesRecord | null> {
	return await xata.db["user-saved-testimonies"].update(id, data);
}

export async function deleteUserSavedTestimony(id: string): Promise<void> {
	await xata.db["user-saved-testimonies"].delete(id);
}

/**
 * Search for user saved testimonies
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching user saved testimonies
 */
export async function searchUserSavedTestimonies(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
	},
): Promise<UserSavedTestimoniesRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		// Prepare filter if userId is provided
		let filter: Record<string, any> | undefined;
		if (options?.userId) {
			filter = { "user.id": options.userId };
		}

		// Table-specific search
		if (filter) {
			const results = await xata.db["user-saved-testimonies"].search(query, {
				fuzziness: options?.fuzziness ?? 1,
				prefix: options?.prefix ?? "phrase",
				filter,
				limit: options?.limit ?? 20,
			});
			return results.records;
		}

		// Cross-table search with table targeting
		const results = await xata.search.all(query, {
			tables: [
				{
					table: "user-saved-testimonies",
					target: ["note", "note-title"],
					filter,
				},
			],
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 20,
		});

		return results.records as UserSavedTestimoniesRecord[];
	} catch (error) {
		console.error(
			`Error searching user saved testimonies with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search user saved testimonies: ${(error as Error).message}`,
		);
	}
}

// User Saved Documents
export type UserSavedDocumentInput = {
	user: { id: string };
	document: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedDocumentUpdateInput = Partial<UserSavedDocumentInput> & {
	id: string;
};

export async function getUserSavedDocumentById(
	id: string,
): Promise<UserSavedDocumentsRecord | null> {
	return await xata.db["user-saved-documents"].read(id);
}

export async function getUserSavedDocuments(
	userId: string,
): Promise<UserSavedDocumentsRecord[]> {
	return await xata.db["user-saved-documents"]
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedDocument(
	data: UserSavedDocumentInput,
): Promise<UserSavedDocumentsRecord> {
	return await xata.db["user-saved-documents"].create(data);
}

export async function updateUserSavedDocument({
	id,
	...data
}: UserSavedDocumentUpdateInput): Promise<UserSavedDocumentsRecord | null> {
	return await xata.db["user-saved-documents"].update(id, data);
}

export async function deleteUserSavedDocument(id: string): Promise<void> {
	await xata.db["user-saved-documents"].delete(id);
}

/**
 * Search for user saved documents
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching user saved documents
 */
export async function searchUserSavedDocuments(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
	},
): Promise<UserSavedDocumentsRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		// Prepare filter if userId is provided
		let filter: Record<string, any> | undefined;
		if (options?.userId) {
			filter = { "user.id": options.userId };
		}

		// Table-specific search
		if (filter) {
			const results = await xata.db["user-saved-documents"].search(query, {
				fuzziness: options?.fuzziness ?? 1,
				prefix: options?.prefix ?? "phrase",
				filter,
				limit: options?.limit ?? 20,
			});
			return results.records;
		}

		// Cross-table search with table targeting
		const results = await xata.search.all(query, {
			tables: [
				{
					table: "user-saved-documents",
					target: ["note", "note-title"],
					filter,
				},
			],
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 20,
		});

		return results.records as UserSavedDocumentsRecord[];
	} catch (error) {
		console.error(
			`Error searching user saved documents with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search user saved documents: ${(error as Error).message}`,
		);
	}
}

// User Saved Organizations
export type UserSavedOrganizationInput = {
	user: { id: string };
	organization: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedOrganizationUpdateInput =
	Partial<UserSavedOrganizationInput> & {
		id: string;
	};

export async function getUserSavedOrganizationById(
	id: string,
): Promise<UserSavedOrganizationsRecord | null> {
	return await xata.db["user-saved-organizations"].read(id);
}

export async function getUserSavedOrganizations(
	userId: string,
): Promise<UserSavedOrganizationsRecord[]> {
	return await xata.db["user-saved-organizations"]
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedOrganization(
	data: UserSavedOrganizationInput,
): Promise<UserSavedOrganizationsRecord> {
	return await xata.db["user-saved-organizations"].create(data);
}

export async function updateUserSavedOrganization({
	id,
	...data
}: UserSavedOrganizationUpdateInput): Promise<UserSavedOrganizationsRecord | null> {
	return await xata.db["user-saved-organizations"].update(id, data);
}

export async function deleteUserSavedOrganization(id: string): Promise<void> {
	await xata.db["user-saved-organizations"].delete(id);
}

/**
 * Search for user saved organizations
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching user saved organizations
 */
export async function searchUserSavedOrganizations(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
	},
): Promise<UserSavedOrganizationsRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		// Prepare filter if userId is provided
		let filter: Record<string, any> | undefined;
		if (options?.userId) {
			filter = { "user.id": options.userId };
		}

		// Table-specific search
		if (filter) {
			const results = await xata.db["user-saved-organizations"].search(query, {
				fuzziness: options?.fuzziness ?? 1,
				prefix: options?.prefix ?? "phrase",
				filter,
				limit: options?.limit ?? 20,
			});
			return results.records;
		}

		// Cross-table search with table targeting
		const results = await xata.search.all(query, {
			tables: [
				{
					table: "user-saved-organizations",
					target: ["note", "note-title"],
					filter,
				},
			],
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 20,
		});

		return results.records as UserSavedOrganizationsRecord[];
	} catch (error) {
		console.error(
			`Error searching user saved organizations with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search user saved organizations: ${(error as Error).message}`,
		);
	}
}

// User Saved Sightings
export type UserSavedSightingInput = {
	user: { id: string };
	sighting: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedSightingUpdateInput = Partial<UserSavedSightingInput> & {
	id: string;
};

export async function getUserSavedSightingById(
	id: string,
): Promise<UserSavedSightingsRecord | null> {
	return await xata.db["user-saved-sightings"].read(id);
}

export async function getUserSavedSightings(
	userId: string,
): Promise<UserSavedSightingsRecord[]> {
	return await xata.db["user-saved-sightings"]
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedSighting(
	data: UserSavedSightingInput,
): Promise<UserSavedSightingsRecord> {
	return await xata.db["user-saved-sightings"].create(data);
}

export async function updateUserSavedSighting({
	id,
	...data
}: UserSavedSightingUpdateInput): Promise<UserSavedSightingsRecord | null> {
	return await xata.db["user-saved-sightings"].update(id, data);
}

export async function deleteUserSavedSighting(id: string): Promise<void> {
	await xata.db["user-saved-sightings"].delete(id);
}

/**
 * Search for user saved sightings
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching user saved sightings
 */
export async function searchUserSavedSightings(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
	},
): Promise<UserSavedSightingsRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		// Prepare filter if userId is provided
		let filter: Record<string, any> | undefined;
		if (options?.userId) {
			filter = { "user.id": options.userId };
		}

		// Table-specific search
		if (filter) {
			const results = await xata.db["user-saved-sightings"].search(query, {
				fuzziness: options?.fuzziness ?? 1,
				prefix: options?.prefix ?? "phrase",
				filter,
				limit: options?.limit ?? 20,
			});
			return results.records;
		}

		// Cross-table search with table targeting
		const results = await xata.search.all(query, {
			tables: [
				{
					table: "user-saved-sightings",
					target: ["note", "note-title"],
					filter,
				},
			],
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 20,
		});

		return results.records as UserSavedSightingsRecord[];
	} catch (error) {
		console.error(
			`Error searching user saved sightings with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search user saved sightings: ${(error as Error).message}`,
		);
	}
}

/**
 * Search across all user saved items
 * @param query The search query string
 * @param options Optional search configuration
 * @returns Combined results from all user saved item tables
 */
export async function searchAllUserSavedItems(
	query: string,
	options?: {
		userId?: string;
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		limit?: number;
		includeTables?: Array<
			| "events"
			| "topics"
			| "key-figures"
			| "testimonies"
			| "documents"
			| "organizations"
			| "sightings"
		>;
	},
): Promise<{
	events: UserSavedEventsRecord[];
	topics: UserSavedTopicsRecord[];
	keyFigures: UserSavedKeyFigureRecord[];
	testimonies: UserSavedTestimoniesRecord[];
	documents: UserSavedDocumentsRecord[];
	organizations: UserSavedOrganizationsRecord[];
	sightings: UserSavedSightingsRecord[];
}> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		const includeAll =
			!options?.includeTables || options.includeTables.length === 0;
		const tables = [];

		// Prepare filter if userId is provided
		const userFilter = options?.userId
			? { "user.id": options.userId }
			: undefined;

		// Configure tables to search based on includeTables option
		if (includeAll || options?.includeTables?.includes("events")) {
			tables.push({
				table: "user-saved-events",
				target: ["note", "note-title"],
				filter: userFilter,
			});
		}

		if (includeAll || options?.includeTables?.includes("topics")) {
			tables.push({
				table: "user-saved-topics",
				target: ["note", "note-title"],
				filter: userFilter,
			});
		}

		if (includeAll || options?.includeTables?.includes("key-figures")) {
			tables.push({
				table: "user-saved-key-figure",
				target: ["note", "note-title"],
				filter: userFilter,
			});
		}

		if (includeAll || options?.includeTables?.includes("testimonies")) {
			tables.push({
				table: "user-saved-testimonies",
				target: ["note", "note-title"],
				filter: userFilter,
			});
		}

		if (includeAll || options?.includeTables?.includes("documents")) {
			tables.push({
				table: "user-saved-documents",
				target: ["note", "note-title"],
				filter: userFilter,
			});
		}

		if (includeAll || options?.includeTables?.includes("organizations")) {
			tables.push({
				table: "user-saved-organizations",
				target: ["note", "note-title"],
				filter: userFilter,
			});
		}

		if (includeAll || options?.includeTables?.includes("sightings")) {
			tables.push({
				table: "user-saved-sightings",
				target: ["note", "note-title"],
				filter: userFilter,
			});
		}

		// Cross-table search
		const results = await xata.search.all(query, {
			tables,
			fuzziness: options?.fuzziness ?? 1,
			prefix: options?.prefix ?? "phrase",
			limit: options?.limit ?? 100,
		});

		// Organize results by table
		const events: UserSavedEventsRecord[] = [];
		const topics: UserSavedTopicsRecord[] = [];
		const keyFigures: UserSavedKeyFigureRecord[] = [];
		const testimonies: UserSavedTestimoniesRecord[] = [];
		const documents: UserSavedDocumentsRecord[] = [];
		const organizations: UserSavedOrganizationsRecord[] = [];
		const sightings: UserSavedSightingsRecord[] = [];

		results.records.forEach((record) => {
			const tableName = record.xata?.table;
			if (tableName === "user-saved-events") {
				events.push(record as UserSavedEventsRecord);
			} else if (tableName === "user-saved-topics") {
				topics.push(record as UserSavedTopicsRecord);
			} else if (tableName === "user-saved-key-figure") {
				keyFigures.push(record as UserSavedKeyFigureRecord);
			} else if (tableName === "user-saved-testimonies") {
				testimonies.push(record as UserSavedTestimoniesRecord);
			} else if (tableName === "user-saved-documents") {
				documents.push(record as UserSavedDocumentsRecord);
			} else if (tableName === "user-saved-organizations") {
				organizations.push(record as UserSavedOrganizationsRecord);
			} else if (tableName === "user-saved-sightings") {
				sightings.push(record as UserSavedSightingsRecord);
			}
		});

		return {
			events,
			topics,
			keyFigures,
			testimonies,
			documents,
			organizations,
			sightings,
		};
	} catch (error) {
		console.error(
			`Error searching all user saved items with query "${query}":`,
			error,
		);
		throw new Error(
			`Failed to search all user saved items: ${(error as Error).message}`,
		);
	}
}
