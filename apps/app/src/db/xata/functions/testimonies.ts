import { xata } from "@/db/xata/client";
import type { Testimonies, TestimoniesRecord } from "@/db/xata/xata";

/**
 * Error interface for standardized error responses
 */
interface TestimoniesOperationError extends Error {
	code: string;
	operation: string;
	details?: unknown;
}

/**
 * Standard response interface for paginated data
 */
interface PaginatedResponse<T> {
	records: T[];
	pagination: {
		page: number;
		size: number;
		total?: number;
		hasNextPage: boolean;
	};
}

/**
 * Creates an error with standardized format for consistent error handling
 * @param message Error message
 * @param code Error code
 * @param operation Operation that caused the error
 * @param details Additional error details
 * @returns Standardized error object
 */
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

/**
 * Create a new testimony record
 * @param data Testimony data to create
 * @returns The created testimony record
 * @throws {TestimoniesOperationError} If creation fails
 */
export async function createTestimony(
	data: Omit<Testimonies, "id" | "xata">,
): Promise<TestimoniesRecord> {
	try {
		// Validate required fields
		if (!data.title) {
			throw createTestimonyError(
				"Testimony title is required",
				"MISSING_REQUIRED_FIELD",
				"createTestimony",
			);
		}

		return await xata.db.testimonies.create(data);
	} catch (error) {
		console.error("Error creating testimony:", error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to create testimony: ${(error as Error).message}`,
			"CREATE_FAILED",
			"createTestimony",
			error,
		);
	}
}

/**
 * Create multiple testimony records in bulk
 * @param data Array of testimony data to create
 * @returns Array of created testimony records
 * @throws {TestimoniesOperationError} If bulk creation fails
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

		// Validate required fields for each item
		for (const [index, item] of data.entries()) {
			if (!item.title) {
				throw createTestimonyError(
					`Testimony at index ${index} is missing a title`,
					"MISSING_REQUIRED_FIELD",
					"createManyTestimonies",
				);
			}
		}

		return await xata.db.testimonies.create(data);
	} catch (error) {
		console.error("Error creating bulk testimonies:", error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to create multiple testimonies: ${(error as Error).message}`,
			"BULK_CREATE_FAILED",
			"createManyTestimonies",
			error,
		);
	}
}

/**
 * Get a testimony record by ID
 * @param id The testimony record ID
 * @param columns Optional columns to select
 * @returns The testimony record or null if not found
 * @throws {TestimoniesOperationError} If retrieval fails
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

		const options: GetRecordOptions = {};
		if (columns && columns.length > 0) {
			options.columns = columns;
		}

		return await xata.db.testimonies.read(id, options);
	} catch (error) {
		console.error(`Error getting testimony with ID ${id}:`, error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to get testimony with ID ${id}: ${(error as Error).message}`,
			"GET_FAILED",
			"getTestimonyById",
			error,
		);
	}
}

/**
 * Get all testimony records with optional filtering, sorting, and pagination
 * @param options Optional query options
 * @returns Array of testimony records
 * @throws {TestimoniesOperationError} If query fails
 */
export async function getAllTestimonies(options?: {
	filter?: Record<string, any>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: string[];
	consistency?: "strong" | "eventual";
}): Promise<TestimoniesRecord[]> {
	try {
		// Build the query using builder pattern
		const queryOptions: {
			filter?: Record<string, any>;
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

		// Execute query with all options
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
 * Get testimony records with pagination
 * @param page Page number (1-based)
 * @param size Number of records per page
 * @param filter Optional filter criteria
 * @param columns Optional columns to select
 * @returns Paginated testimony records
 * @throws {TestimoniesOperationError} If pagination query fails
 */
export async function getTestimoniesWithPagination(
	page = 1,
	size = 20,
	filter?: Record<string, any>,
	columns?: string[],
): Promise<PaginatedResponse<TestimoniesRecord>> {
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
			filter?: Record<string, any>;
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
					? undefined // We can't determine the exact total when there are more records
					: (page - 1) * size + result.records.length,
				hasNextPage: result.meta?.page?.more || false,
			},
		};
	} catch (error) {
		console.error("Error getting paginated testimonies:", error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to get paginated testimonies: ${(error as Error).message}`,
			"PAGINATION_FAILED",
			"getTestimoniesWithPagination",
			error,
		);
	}
}

/**
 * Search testimony records
 * @param query Search query
 * @param options Search options
 * @returns Matching testimony records
 * @throws {TestimoniesOperationError} If search fails
 */
export async function searchTestimonies(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		pagination?: { size?: number; offset?: number };
		filter?: Record<string, any>;
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
 * Update a testimony record
 * @param id The testimony record ID
 * @param data The data to update
 * @returns The updated testimony record
 * @throws {TestimoniesOperationError} If update fails
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

		// Verify the record exists before updating
		const exists = await xata.db.testimonies.read(id);
		if (!exists) {
			return null;
		}

		return await xata.db.testimonies.update(id, data);
	} catch (error) {
		console.error(`Error updating testimony with ID ${id}:`, error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to update testimony with ID ${id}: ${(error as Error).message}`,
			"UPDATE_FAILED",
			"updateTestimony",
			error,
		);
	}
}

/**
 * Update multiple testimony records that match a filter
 * @param filter Filter to select records to update
 * @param data Data to update on matching records
 * @returns Number of records updated
 * @throws {TestimoniesOperationError} If bulk update fails
 */
export async function updateManyTestimonies(
	filter: Record<string, any>,
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

		// First get the IDs of records matching the filter
		const records = await xata.db.testimonies.query({ filter });

		if (records.records.length === 0) {
			return { numberOfRecordsUpdated: 0 };
		}

		const updatePromises = records.records.map((record) =>
			xata.db.testimonies.update(record.id, data),
		);

		const updatedRecords = await Promise.all(updatePromises);
		return { numberOfRecordsUpdated: updatedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error updating multiple testimony records:", error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to update multiple testimonies: ${(error as Error).message}`,
			"BULK_UPDATE_FAILED",
			"updateManyTestimonies",
			error,
		);
	}
}

/**
 * Delete a testimony record
 * @param id The ID of the testimony record to delete
 * @returns True if the record was deleted, false if it didn't exist
 * @throws {TestimoniesOperationError} If deletion fails
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

		const deletedRecord = await xata.db.testimonies.delete(id);
		return deletedRecord !== null;
	} catch (error) {
		console.error(`Error deleting testimony with ID ${id}:`, error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to delete testimony with ID ${id}: ${(error as Error).message}`,
			"DELETE_FAILED",
			"deleteTestimony",
			error,
		);
	}
}

/**
 * Delete multiple testimony records that match a filter
 * @param filter Filter to select records to delete
 * @returns Number of records deleted
 * @throws {TestimoniesOperationError} If bulk deletion fails
 */
export async function deleteManyTestimonies(
	filter: Record<string, any>,
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

		// First get the IDs of records matching the filter
		const records = await xata.db.testimonies.query({ filter });

		if (records.records.length === 0) {
			return { numberOfRecordsDeleted: 0 };
		}

		const deletePromises = records.records.map((record) =>
			xata.db.testimonies.delete(record.id),
		);

		const deletedRecords = await Promise.all(deletePromises);
		return { numberOfRecordsDeleted: deletedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error deleting multiple testimony records:", error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to delete multiple testimonies: ${(error as Error).message}`,
			"BULK_DELETE_FAILED",
			"deleteManyTestimonies",
			error,
		);
	}
}

/**
 * Ask questions about testimonies using natural language
 * @param question The natural language question to ask
 * @param options Optional parameters for processing the question
 * @returns The processed testimony data answering the question
 * @throws {TestimoniesOperationError} If question processing fails
 */
export async function askTestimonies(
	question: string,
	options?: {
		maxResults?: number;
		includeDetails?: boolean;
	},
): Promise<{
	answer: string;
	relatedRecords: TestimoniesRecord[];
}> {
	try {
		// Validate input
		if (!question || question.trim() === "") {
			throw createTestimonyError(
				"Question text is required",
				"MISSING_QUESTION",
				"askTestimonies",
			);
		}

		// Use Xata's search capabilities to find relevant testimonies
		const searchResults = await xata.db.testimonies.search(question, {
			fuzziness: 2,
			page: {
				size: options?.maxResults || 5,
			},
		});

		return {
			answer: `Results for: ${question}`,
			relatedRecords: searchResults.records,
		};
	} catch (error) {
		console.error(`Error asking about testimonies: "${question}"`, error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to process question: ${(error as Error).message}`,
			"QUESTION_PROCESSING_FAILED",
			"askTestimonies",
			error,
		);
	}
}

/**
 * Get testimonies by witness (personnel) ID
 * @param witnessId The ID of the witness/personnel
 * @returns Testimonies given by the specified witness
 * @throws {TestimoniesOperationError} If retrieval fails
 */
export async function getTestimoniesByWitness(
	witnessId: string,
): Promise<TestimoniesRecord[]> {
	try {
		// Validate input
		if (!witnessId) {
			throw createTestimonyError(
				"Witness ID is required",
				"MISSING_WITNESS_ID",
				"getTestimoniesByWitness",
			);
		}

		const result = await xata.db.testimonies.query({
			filter: {
				"witness.id": witnessId,
			},
		});

		return result.records;
	} catch (error) {
		console.error(
			`Error getting testimonies by witness ID ${witnessId}:`,
			error,
		);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to get testimonies by witness: ${(error as Error).message}`,
			"WITNESS_QUERY_FAILED",
			"getTestimoniesByWitness",
			error,
		);
	}
}

/**
 * Get testimonies by event ID
 * @param eventId The ID of the event
 * @returns Testimonies related to the specified event
 * @throws {TestimoniesOperationError} If retrieval fails
 */
export async function getTestimoniesByEvent(
	eventId: string,
): Promise<TestimoniesRecord[]> {
	try {
		// Validate input
		if (!eventId) {
			throw createTestimonyError(
				"Event ID is required",
				"MISSING_EVENT_ID",
				"getTestimoniesByEvent",
			);
		}

		const result = await xata.db.testimonies.query({
			filter: {
				"event.id": eventId,
			},
		});

		return result.records;
	} catch (error) {
		console.error(`Error getting testimonies by event ID ${eventId}:`, error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to get testimonies by event: ${(error as Error).message}`,
			"EVENT_QUERY_FAILED",
			"getTestimoniesByEvent",
			error,
		);
	}
}

/**
 * Get testimonies by organization ID
 * @param organizationId The ID of the organization
 * @returns Testimonies related to the specified organization
 * @throws {TestimoniesOperationError} If retrieval fails
 */
export async function getTestimoniesByOrganization(
	organizationId: string,
): Promise<TestimoniesRecord[]> {
	try {
		// Validate input
		if (!organizationId) {
			throw createTestimonyError(
				"Organization ID is required",
				"MISSING_ORGANIZATION_ID",
				"getTestimoniesByOrganization",
			);
		}

		const result = await xata.db.testimonies.query({
			filter: {
				"organization.id": organizationId,
			},
		});

		return result.records;
	} catch (error) {
		console.error(
			`Error getting testimonies by organization ID ${organizationId}:`,
			error,
		);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to get testimonies by organization: ${(error as Error).message}`,
			"ORGANIZATION_QUERY_FAILED",
			"getTestimoniesByOrganization",
			error,
		);
	}
}

/**
 * Get testimonies by date range
 * @param startDate Start date of the range
 * @param endDate End date of the range
 * @returns Testimonies within the date range
 * @throws {TestimoniesOperationError} If date range search fails
 */
export async function getTestimoniesByDateRange(
	startDate: Date,
	endDate: Date,
): Promise<TestimoniesRecord[]> {
	try {
		// Validate inputs
		if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
			throw createTestimonyError(
				"Invalid start date",
				"INVALID_START_DATE",
				"getTestimoniesByDateRange",
			);
		}

		if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
			throw createTestimonyError(
				"Invalid end date",
				"INVALID_END_DATE",
				"getTestimoniesByDateRange",
			);
		}

		if (startDate > endDate) {
			throw createTestimonyError(
				"Start date must be before end date",
				"INVALID_DATE_RANGE",
				"getTestimoniesByDateRange",
			);
		}

		const result = await xata.db.testimonies.query({
			filter: {
				date: {
					$ge: startDate,
					$le: endDate,
				},
			},
			sort: [["date", "asc"]],
		});

		return result.records;
	} catch (error) {
		console.error("Error getting testimonies by date range:", error);

		if ((error as TestimoniesOperationError).code) {
			throw error;
		}

		throw createTestimonyError(
			`Failed to get testimonies by date range: ${(error as Error).message}`,
			"DATE_RANGE_SEARCH_FAILED",
			"getTestimoniesByDateRange",
			error,
		);
	}
}
