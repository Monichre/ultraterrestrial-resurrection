import type { RecordFilterExpression } from "@xata.io/client";
import { xata } from "../../client";
import type { TestimoniesRecord, Testimonies } from "../schema/testimonies";

// Define error interface for consistent error handling
interface TestimoniesOperationError extends Error {
	code: string;
	operation: string;
	details?: unknown;
}

// Error creation helper function
function createTestimonyError(
	message: string,
	code: string,
	operation: string,
	details?: unknown,
): TestimoniesOperationError {
	const error = new Error(message) as TestimoniesOperationError;
	error.code = code;
	error.operation = operation;
	error.details = details;
	return error;
}

// Types for pagination response
interface PaginatedTestimoniesResponse {
	records: TestimoniesRecord[];
	pagination: {
		page: number;
		size: number;
		total?: number;
		hasNextPage: boolean;
	};
}

// #region CREATE OPERATIONS

/**
 * Creates a new testimony record in the database
 * @param data The testimony data without id and xata fields
 * @returns The created testimony record
 */
export async function createTestimony(
	data: Omit<Testimonies, "id" | "xata">,
): Promise<TestimoniesRecord> {
	try {
		// Validate required fields
		if (!data.claim) {
			throw createTestimonyError(
				"Testimony claim is required",
				"MISSING_REQUIRED_FIELD",
				"createTestimony",
			);
		}

		return await xata.db.testimonies.create(data);
	} catch (error) {
		console.error("Error creating testimony:", error);

		// Re-throw typed errors
		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		// Create and throw standardized error
		throw createTestimonyError(
			`Failed to create testimony: ${(error as Error).message}`,
			"CREATE_FAILED",
			"createTestimony",
			error,
		);
	}
}

/**
 * Creates multiple testimony records in the database
 * @param data Array of testimony data without id and xata fields
 * @returns Array of created testimony records
 */
export async function createManyTestimonies(
	data: Omit<Testimonies, "id" | "xata">[],
): Promise<TestimoniesRecord[]> {
	try {
		// Validate input
		if (!Array.isArray(data) || data.length === 0) {
			throw createTestimonyError(
				"Data must be a non-empty array",
				"INVALID_INPUT",
				"createManyTestimonies",
			);
		}

		// Validate each record
		for (const [index, item] of data.entries()) {
			if (!item.claim) {
				throw createTestimonyError(
					`Testimony at index ${index} is missing required claim field`,
					"MISSING_REQUIRED_FIELD",
					"createManyTestimonies",
				);
			}
		}

		return await xata.db.testimonies.create(data);
	} catch (error) {
		console.error("Error creating bulk testimonies:", error);

		// Create and throw standardized error
		throw createTestimonyError(
			`Failed to create multiple testimonies: ${(error as Error).message}`,
			"BULK_CREATE_FAILED",
			"createManyTestimonies",
			error,
		);
	}
}

// #endregion

// #region READ OPERATIONS

/**
 * Gets a testimony by its ID
 * @param id The testimony ID
 * @param columns Optional columns to select
 * @returns The testimony record or null if not found
 */
export async function getTestimonyById(
	id: string,
	columns?: string[],
): Promise<TestimoniesRecord | null> {
	try {
		if (!id) {
			throw createTestimonyError(
				"Testimony ID is required",
				"MISSING_ID",
				"getTestimonyById",
			);
		}

		const options: { columns?: string[] } = {};
		if (columns && columns.length > 0) {
			options.columns = columns;
		}

		return await xata.db.testimonies.read(id, options);
	} catch (error) {
		console.error(`Error getting testimony with ID ${id}:`, error);

		throw createTestimonyError(
			`Failed to get testimony with ID ${id}: ${(error as Error).message}`,
			"GET_FAILED",
			"getTestimonyById",
			error,
		);
	}
}

/**
 * Gets all testimonies with optional filtering, sorting, and pagination
 * @param options Optional configuration for filtering, sorting, and pagination
 * @returns Array of testimony records
 */
export async function getAllTestimonies(options?: {
	filter?: RecordFilterExpression<TestimoniesRecord>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: string[];
	consistency?: "strong" | "eventual";
}): Promise<TestimoniesRecord[]> {
	try {
		// Build query options
		const queryOptions: {
			filter?: RecordFilterExpression<TestimoniesRecord>;
			sort?: [string, "asc" | "desc"][];
			columns?: string[];
			pagination?: { size: number; offset: number };
			consistency?: "strong" | "eventual";
		} = {
			consistency: options?.consistency || "strong",
		};

		// Add filter if provided
		if (options?.filter) {
			queryOptions.filter = options.filter;
		}

		// Add sort if provided
		if (options?.sort) {
			queryOptions.sort = Object.entries(options.sort).map(
				([column, direction]) => [column, direction],
			);
		}

		// Add columns if provided
		if (options?.columns) {
			queryOptions.columns = options.columns;
		}

		// Add pagination if provided
		if (options?.pagination) {
			queryOptions.pagination = {
				size: options.pagination.size || 50,
				offset: options.pagination.offset || 0,
			};
		}

		// Execute query with options
		const result = await xata.db.testimonies.query(queryOptions);
		return result.records;
	} catch (error) {
		console.error("Error getting all testimonies:", error);

		throw createTestimonyError(
			`Failed to get testimonies: ${(error as Error).message}`,
			"QUERY_FAILED",
			"getAllTestimonies",
			error,
		);
	}
}

/**
 * Gets testimonies with pagination
 * @param page The page number (starting from 1)
 * @param size The page size
 * @param filter Optional filter expression
 * @param columns Optional columns to select
 * @returns Paginated response with testimony records
 */
export async function getTestimoniesWithPagination(
	page = 1,
	size = 20,
	filter?: RecordFilterExpression<TestimoniesRecord>,
	columns?: string[],
): Promise<PaginatedTestimoniesResponse> {
	try {
		// Validate input
		if (page < 1) {
			throw createTestimonyError(
				"Page number must be greater than 0",
				"INVALID_PAGE",
				"getTestimoniesWithPagination",
			);
		}

		if (size < 1 || size > 100) {
			throw createTestimonyError(
				"Page size must be between 1 and 100",
				"INVALID_SIZE",
				"getTestimoniesWithPagination",
			);
		}

		const queryOptions: {
			filter?: RecordFilterExpression<TestimoniesRecord>;
			columns?: string[];
			pagination: { size: number; offset: number };
		} = {
			pagination: {
				size,
				offset: (page - 1) * size,
			},
		};

		if (filter) {
			queryOptions.filter = filter;
		}

		if (columns) {
			queryOptions.columns = columns;
		}

		const result = await xata.db.testimonies.query(queryOptions);

		return {
			records: result.records,
			pagination: {
				page,
				size,
				total: result.meta?.page?.more
					? undefined // Can't determine exact total when there are more records
					: (page - 1) * size + result.records.length,
				hasNextPage: result.meta?.page?.more || false,
			},
		};
	} catch (error) {
		console.error("Error getting paginated testimonies:", error);

		throw createTestimonyError(
			`Failed to get paginated testimonies: ${(error as Error).message}`,
			"PAGINATION_FAILED",
			"getTestimoniesWithPagination",
			error,
		);
	}
}

/**
 * Searches testimonies using text search
 * @param query The search query
 * @param options Optional search configuration
 * @returns Array of matching testimony records
 */
export async function searchTestimonies(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		pagination?: { size?: number; offset?: number };
		filter?: RecordFilterExpression<TestimoniesRecord>;
	},
): Promise<TestimoniesRecord[]> {
	try {
		// Validate input
		if (!query || query.trim() === "") {
			throw createTestimonyError(
				"Search query is required",
				"MISSING_QUERY",
				"searchTestimonies",
			);
		}

		const searchOptions = {
			fuzziness: options?.fuzziness || 1,
			prefix: options?.prefix || "phrase",
			page: options?.pagination
				? {
						size: options.pagination.size || 20,
						offset: options.pagination.offset || 0,
					}
				: undefined,
			filter: options?.filter,
		};

		const results = await xata.db.testimonies.search(query, searchOptions);
		return results.records;
	} catch (error) {
		console.error(`Error searching testimonies with query "${query}":`, error);

		throw createTestimonyError(
			`Failed to search testimonies: ${(error as Error).message}`,
			"SEARCH_FAILED",
			"searchTestimonies",
			error,
		);
	}
}

/**
 * Performs vector search on testimonies using embedding
 * @param embedding The vector embedding to search with
 * @param options Optional search configuration
 * @returns Array of matching testimony records
 */
export async function semanticSearchTestimonies(
	embedding: number[],
	options?: {
		maxResults?: number;
		filter?: RecordFilterExpression<TestimoniesRecord>;
	},
): Promise<TestimoniesRecord[]> {
	try {
		// Validate input
		if (!embedding || !Array.isArray(embedding) || embedding.length !== 1536) {
			throw createTestimonyError(
				"Valid embedding vector with 1536 dimensions is required",
				"INVALID_EMBEDDING",
				"semanticSearchTestimonies",
			);
		}

		const searchOptions = {
			maxResults: options?.maxResults || 10,
			filter: options?.filter,
		};

		const results = await xata.db.testimonies.vectorSearch(
			"embedding",
			embedding,
			searchOptions,
		);

		return results.records;
	} catch (error) {
		console.error("Error in semantic search of testimonies:", error);

		throw createTestimonyError(
			`Failed in semantic search: ${(error as Error).message}`,
			"VECTOR_SEARCH_FAILED",
			"semanticSearchTestimonies",
			error,
		);
	}
}

/**
 * Get testimonies related to a specific event
 * @param eventId The ID of the event to filter by
 * @returns Array of testimony records related to the event
 */
export async function getTestimoniesByEvent(
	eventId: string,
): Promise<TestimoniesRecord[]> {
	try {
		if (!eventId) {
			throw createTestimonyError(
				"Event ID is required",
				"MISSING_EVENT_ID",
				"getTestimoniesByEvent",
			);
		}

		return await getAllTestimonies({
			filter: {
				"event.id": eventId,
			},
		});
	} catch (error) {
		console.error(`Error getting testimonies for event ${eventId}:`, error);

		throw createTestimonyError(
			`Failed to get testimonies for event: ${(error as Error).message}`,
			"QUERY_FAILED",
			"getTestimoniesByEvent",
			error,
		);
	}
}

/**
 * Get testimonies by a specific witness
 * @param witnessId The ID of the witness (personnel) to filter by
 * @returns Array of testimony records by the witness
 */
export async function getTestimoniesByWitness(
	witnessId: string,
): Promise<TestimoniesRecord[]> {
	try {
		if (!witnessId) {
			throw createTestimonyError(
				"Witness ID is required",
				"MISSING_WITNESS_ID",
				"getTestimoniesByWitness",
			);
		}

		return await getAllTestimonies({
			filter: {
				"witness.id": witnessId,
			},
		});
	} catch (error) {
		console.error(`Error getting testimonies for witness ${witnessId}:`, error);

		throw createTestimonyError(
			`Failed to get testimonies for witness: ${(error as Error).message}`,
			"QUERY_FAILED",
			"getTestimoniesByWitness",
			error,
		);
	}
}

/**
 * Get testimonies by a specific organization
 * @param organizationId The ID of the organization to filter by
 * @returns Array of testimony records related to the organization
 */
export async function getTestimoniesByOrganization(
	organizationId: string,
): Promise<TestimoniesRecord[]> {
	try {
		if (!organizationId) {
			throw createTestimonyError(
				"Organization ID is required",
				"MISSING_ORGANIZATION_ID",
				"getTestimoniesByOrganization",
			);
		}

		return await getAllTestimonies({
			filter: {
				"organization.id": organizationId,
			},
		});
	} catch (error) {
		console.error(
			`Error getting testimonies for organization ${organizationId}:`,
			error,
		);

		throw createTestimonyError(
			`Failed to get testimonies for organization: ${(error as Error).message}`,
			"QUERY_FAILED",
			"getTestimoniesByOrganization",
			error,
		);
	}
}

// #endregion

// #region UPDATE OPERATIONS

/**
 * Updates a testimony by ID
 * @param id The testimony ID
 * @param data The testimony data to update
 * @returns The updated testimony record or null if not found
 */
export async function updateTestimony(
	id: string,
	data: Partial<Omit<Testimonies, "id" | "xata">>,
): Promise<TestimoniesRecord | null> {
	try {
		// Validate input
		if (!id) {
			throw createTestimonyError(
				"Testimony ID is required",
				"MISSING_ID",
				"updateTestimony",
			);
		}

		if (!data || Object.keys(data).length === 0) {
			throw createTestimonyError(
				"Update data is required",
				"MISSING_DATA",
				"updateTestimony",
			);
		}

		// Verify the testimony exists before updating
		const exists = await xata.db.testimonies.read(id);
		if (!exists) {
			return null;
		}

		return await xata.db.testimonies.update(id, data);
	} catch (error) {
		console.error(`Error updating testimony with ID ${id}:`, error);

		throw createTestimonyError(
			`Failed to update testimony with ID ${id}: ${(error as Error).message}`,
			"UPDATE_FAILED",
			"updateTestimony",
			error,
		);
	}
}

/**
 * Updates multiple testimonies matching a filter
 * @param filter The filter to select testimonies to update
 * @param data The data to update
 * @returns The number of testimonies updated
 */
export async function updateManyTestimonies(
	filter: RecordFilterExpression<TestimoniesRecord>,
	data: Partial<Omit<Testimonies, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		// Validate inputs
		if (!filter || Object.keys(filter).length === 0) {
			throw createTestimonyError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"updateManyTestimonies",
			);
		}

		if (!data || Object.keys(data).length === 0) {
			throw createTestimonyError(
				"Update data is required",
				"MISSING_DATA",
				"updateManyTestimonies",
			);
		}

		// Get testimonies matching the filter
		const testimonies = await xata.db.testimonies.query({ filter });

		if (testimonies.records.length === 0) {
			return { numberOfRecordsUpdated: 0 };
		}

		const updatePromises = testimonies.records.map(
			(testimony: TestimoniesRecord) =>
				xata.db.testimonies.update(testimony.id, data),
		);

		const updatedTestimonies = await Promise.all(updatePromises);
		return {
			numberOfRecordsUpdated: updatedTestimonies.filter(Boolean).length,
		};
	} catch (error) {
		console.error("Error updating multiple testimonies:", error);

		throw createTestimonyError(
			`Failed to update multiple testimonies: ${(error as Error).message}`,
			"BULK_UPDATE_FAILED",
			"updateManyTestimonies",
			error,
		);
	}
}

// #endregion

// #region DELETE OPERATIONS

/**
 * Deletes a testimony by ID
 * @param id The testimony ID
 * @returns True if deleted, false if not found
 */
export async function deleteTestimony(id: string): Promise<boolean> {
	try {
		// Validate input
		if (!id) {
			throw createTestimonyError(
				"Testimony ID is required",
				"MISSING_ID",
				"deleteTestimony",
			);
		}

		const deletedTestimony = await xata.db.testimonies.delete(id);
		return deletedTestimony !== null;
	} catch (error) {
		console.error(`Error deleting testimony with ID ${id}:`, error);

		throw createTestimonyError(
			`Failed to delete testimony with ID ${id}: ${(error as Error).message}`,
			"DELETE_FAILED",
			"deleteTestimony",
			error,
		);
	}
}

/**
 * Deletes multiple testimonies matching a filter
 * @param filter The filter to select testimonies to delete
 * @returns The number of testimonies deleted
 */
export async function deleteManyTestimonies(
	filter: RecordFilterExpression<TestimoniesRecord>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		// Validate input
		if (!filter || Object.keys(filter).length === 0) {
			throw createTestimonyError(
				"Filter criteria is required",
				"MISSING_FILTER",
				"deleteManyTestimonies",
			);
		}

		// Get testimonies matching the filter
		const testimonies = await xata.db.testimonies.query({ filter });

		if (testimonies.records.length === 0) {
			return { numberOfRecordsDeleted: 0 };
		}

		const deletePromises = testimonies.records.map(
			(testimony: TestimoniesRecord) =>
				xata.db.testimonies.delete(testimony.id),
		);

		const deletedTestimonies = await Promise.all(deletePromises);
		return {
			numberOfRecordsDeleted: deletedTestimonies.filter(Boolean).length,
		};
	} catch (error) {
		console.error("Error deleting multiple testimonies:", error);

		throw createTestimonyError(
			`Failed to delete multiple testimonies: ${(error as Error).message}`,
			"BULK_DELETE_FAILED",
			"deleteManyTestimonies",
			error,
		);
	}
}

// #endregion
