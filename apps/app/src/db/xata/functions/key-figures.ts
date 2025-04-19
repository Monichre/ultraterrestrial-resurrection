import { xata } from "../../xata/client";
import type { Personnel, PersonnelRecord } from "../../xata/xata";
import type {
	TargetColumn,
	PrefixExpression,
	Filter,
	SelectableColumn,
} from "@xata.io/client";

/**
 * Create a new key figure record
 * @param data Key figure data to create
 * @returns The created key figure record
 */
export async function createKeyFigure(
	data: Omit<Personnel, "id" | "xata">,
): Promise<PersonnelRecord> {
	try {
		return await xata.db.personnel.create(data);
	} catch (error) {
		console.error("Error creating key figure:", error);
		throw error;
	}
}

/**
 * Create multiple key figure records in bulk
 * @param data Array of key figure data to create
 * @returns Array of created key figure records
 */
export async function createManyKeyFigures(
	data: Omit<Personnel, "id" | "xata">[],
): Promise<PersonnelRecord[]> {
	try {
		return await xata.db.personnel.create(data);
	} catch (error) {
		console.error("Error creating bulk key figures:", error);
		throw error;
	}
}

/**
 * Get a key figure record by ID
 * @param id The key figure record ID
 * @param columns Optional columns to select
 * @returns The key figure record or null if not found
 */
export async function getKeyFigureById(
	id: string,
	columns?: SelectableColumn<PersonnelRecord>[],
): Promise<PersonnelRecord | null> {
	try {
		return await xata.db.personnel.read(id, columns ? columns : undefined);
	} catch (error) {
		console.error(`Error getting key figure with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Get all key figure records with optional filtering, sorting, and pagination
 * @param options Optional query options
 * @returns Array of key figure records
 */
export async function getAllKeyFigures(options?: {
	filter?: Filter<PersonnelRecord>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: SelectableColumn<PersonnelRecord>[];
}): Promise<PersonnelRecord[]> {
	try {
		const query = xata.db.personnel;

		// Build the query using builder pattern
		const queryOptions: {
			filter?: Filter<PersonnelRecord>;
			sort?: [string, "asc" | "desc"][];
			columns?: SelectableColumn<PersonnelRecord>[];
			pagination?: { size: number; offset: number };
		} = {};

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
		const result = await xata.db.personnel.query(queryOptions);
		return result.records;
	} catch (error) {
		console.error("Error getting all key figures:", error);
		throw error;
	}
}

/**
 * Get key figure records with pagination
 * @param page Page number (1-based)
 * @param size Number of records per page
 * @param filter Optional filter criteria
 * @returns Paginated key figure records
 */
export async function getKeyFiguresWithPagination(
	page = 1,
	size = 20,
	filter?: Filter<PersonnelRecord>,
	columns?: SelectableColumn<PersonnelRecord>[],
) {
	try {
		const queryOptions: {
			filter?: Filter<PersonnelRecord>;
			columns?: SelectableColumn<PersonnelRecord>[];
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

		const result = await xata.db.personnel.query(queryOptions);

		return {
			records: result.records,
			pagination: {
				page,
				size,
				total: result.meta?.page?.more
					? page * size + 1 // There are more records than we can determine exactly
					: (page - 1) * size + result.records.length,
				hasNextPage: result.meta?.page?.more || false,
			},
		};
	} catch (error) {
		console.error("Error getting paginated key figures:", error);
		throw error;
	}
}

/**
 * Search key figure records
 * @param query Search query
 * @param options Search options
 * @returns Matching key figure records
 */
export async function searchKeyFigures(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: PrefixExpression;
		pagination?: { size?: number; offset?: number };
	},
): Promise<PersonnelRecord[]> {
	try {
		const searchOptions = {
			fuzziness: options?.fuzziness || 1,
			prefix: options?.prefix || ("phrase" as PrefixExpression),
			page: options?.pagination
				? {
						size: options.pagination.size || 20,
						offset: options.pagination.offset || 0,
					}
				: undefined,
		};

		const results = await xata.db.personnel.search(query, searchOptions);
		return results.records;
	} catch (error) {
		console.error(`Error searching key figures with query "${query}":`, error);
		throw error;
	}
}

/**
 * Update a key figure record
 * @param id The key figure record ID
 * @param data The data to update
 * @returns The updated key figure record
 */
export async function updateKeyFigure(
	id: string,
	data: Partial<Omit<Personnel, "id" | "xata">>,
): Promise<PersonnelRecord | null> {
	try {
		return await xata.db.personnel.update(id, data);
	} catch (error) {
		console.error(`Error updating key figure with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Update multiple key figure records that match a filter
 * @param filter Filter to select records to update
 * @param data Data to update on matching records
 * @returns Number of records updated
 */
export async function updateManyKeyFigures(
	filter: Filter<PersonnelRecord>,
	data: Partial<Omit<Personnel, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		// First get the IDs of records matching the filter
		const records = await xata.db.personnel.query({ filter });
		const updatePromises = records.records.map((record) =>
			xata.db.personnel.update(record.id, data),
		);

		const updatedRecords = await Promise.all(updatePromises);
		return { numberOfRecordsUpdated: updatedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error updating multiple key figure records:", error);
		throw error;
	}
}

/**
 * Delete a key figure record
 * @param id The ID of the key figure record to delete
 * @returns True if the record was deleted, false if it didn't exist
 */
export async function deleteKeyFigure(id: string): Promise<boolean> {
	try {
		const deletedRecord = await xata.db.personnel.delete(id);
		return deletedRecord !== null;
	} catch (error) {
		console.error(`Error deleting key figure with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Delete multiple key figure records that match a filter
 * @param filter Filter to select records to delete
 * @returns Number of records deleted
 */
export async function deleteManyKeyFigures(
	filter: Filter<PersonnelRecord>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		// First get the IDs of records matching the filter
		const records = await xata.db.personnel.query({ filter });

		const deletePromises = records.records.map((record) =>
			xata.db.personnel.delete(record.id),
		);

		const deletedRecords = await Promise.all(deletePromises);
		return { numberOfRecordsDeleted: deletedRecords.filter(Boolean).length };
	} catch (error) {
		console.error("Error deleting multiple key figure records:", error);
		throw error;
	}
}

/**
 * Ask questions about key figures using natural language
 * @param question The natural language question to ask
 * @param options Optional parameters for processing the question
 * @returns The processed key figure data answering the question
 */
export async function askKeyFigures(
	question: string,
	options?: {
		maxResults?: number;
		includeDetails?: boolean;
	},
): Promise<{
	answer: string;
	relatedRecords: PersonnelRecord[];
}> {
	try {
		// Note: This is a placeholder implementation
		// In a real application, this might use AI or NLP to process the question
		const searchResults = await xata.db.personnel.search(question, {
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
		console.error(`Error asking about key figures: "${question}"`, error);
		throw error;
	}
}

/**
 * Generate a summary of key figures
 * @param filter Optional filter to apply before summarizing
 * @returns Summary statistics and information about key figures
 */
export async function summarizeKeyFigures(
	filter?: Filter<PersonnelRecord>,
): Promise<{
	totalCount: number;
	categories?: Record<string, number>;
	recentUpdates?: PersonnelRecord[];
	summaryText?: string;
}> {
	try {
		const queryOptions: {
			filter?: Filter<PersonnelRecord>;
			consistency?: "eventual" | "strong";
		} = {
			consistency: "eventual", // Use Replica Store for better performance
		};

		if (filter) {
			queryOptions.filter = filter;
		}

		const records = await xata.db.personnel.query(queryOptions);

		// Count categories
		const categories: Record<string, number> = {};
		for (const record of records.records) {
			// This assumes a 'category' field exists, adjust as needed
			const category = record.category as string | undefined;
			if (category) {
				categories[category] = (categories[category] || 0) + 1;
			}
		}

		// Get recent updates
		const recentUpdates = await xata.db.personnel.query({
			sort: [["xata.updatedAt", "desc"]],
			pagination: { size: 5 },
			consistency: "eventual",
		});

		return {
			totalCount: records.records.length,
			categories,
			recentUpdates: recentUpdates.records,
			summaryText: `Found ${records.records.length} key figures across ${Object.keys(categories).length} categories.`,
		};
	} catch (error) {
		console.error("Error summarizing key figures:", error);
		throw error;
	}
}

/**
 * Aggregate key figures by specified fields
 * @param aggregateBy Field to aggregate by
 * @param measure Field to measure
 * @param operation Aggregation operation to perform
 * @param filter Optional filter to apply before aggregation
 * @returns Aggregated data grouped by the specified field
 */
export async function aggregateKeyFigures(
	aggregateBy: string,
	measure: string,
	operation: "sum" | "average" | "count" | "min" | "max",
	filter?: Filter<PersonnelRecord>,
): Promise<Record<string, number>> {
	try {
		const queryOptions: {
			filter?: Filter<PersonnelRecord>;
			consistency?: "eventual" | "strong";
		} = {
			consistency: "eventual", // Use Replica Store for better performance
		};

		if (filter) {
			queryOptions.filter = filter;
		}

		const records = await xata.db.personnel.query(queryOptions);

		// Calculate aggregations
		const result: Record<string, number> = {};
		const groups: Record<string, number[]> = {};

		// Group values by aggregateBy field
		for (const record of records.records) {
			const groupKey = String(
				record[aggregateBy as keyof typeof record] || "undefined",
			);
			const value = Number(record[measure as keyof typeof record] || 0);

			if (!groups[groupKey]) {
				groups[groupKey] = [];
			}

			groups[groupKey].push(value);
		}

		// Apply the requested operation to each group
		for (const [key, values] of Object.entries(groups)) {
			switch (operation) {
				case "sum":
					result[key] = values.reduce((sum, value) => sum + value, 0);
					break;
				case "average":
					result[key] =
						values.reduce((sum, value) => sum + value, 0) / values.length;
					break;
				case "count":
					result[key] = values.length;
					break;
				case "min":
					result[key] = Math.min(...values);
					break;
				case "max":
					result[key] = Math.max(...values);
					break;
			}
		}

		return result;
	} catch (error) {
		console.error(`Error aggregating key figures by ${aggregateBy}:`, error);
		throw error;
	}
}

/**
 * Filter key figures based on complex criteria
 * @param criteria Object containing filter criteria
 * @param options Additional options for filtering
 * @returns Filtered key figure records
 */
export async function filterKeyFigures(
	criteria: {
		[key: string]: unknown;
		dateRange?: { field: string; start: Date; end: Date };
		textSearch?: { fields: string[]; query: string };
		numericRange?: { field: string; min?: number; max?: number };
	},
	options?: {
		sortBy?: { field: string; direction: "asc" | "desc" };
		limit?: number;
		offset?: number;
		includeFields?: SelectableColumn<PersonnelRecord>[];
	},
): Promise<PersonnelRecord[]> {
	try {
		// Prepare the query options
		const queryOptions: {
			filter?: Filter<PersonnelRecord>;
			sort?: [string, "asc" | "desc"][];
			columns?: SelectableColumn<PersonnelRecord>[];
			pagination?: { size: number; offset: number };
		} = {};

		// Build a combined filter from all criteria
		const filters: Filter<PersonnelRecord>[] = [];

		// Apply basic filter criteria (extract exact matches)
		const basicCriteria = { ...criteria };
		// Extract special filter objects without using delete
		const dateRange = basicCriteria.dateRange;
		const textSearch = basicCriteria.textSearch;
		const numericRange = basicCriteria.numericRange;
		// Remove special properties from basicCriteria
		const basicFilterKeys = Object.keys(basicCriteria).filter(
			(key) => !["dateRange", "textSearch", "numericRange"].includes(key),
		);

		if (basicFilterKeys.length > 0) {
			const basicFilter: Record<string, unknown> = {};
			for (const key of basicFilterKeys) {
				basicFilter[key] = basicCriteria[key];
			}
			filters.push(basicFilter as Filter<PersonnelRecord>);
		}

		// Apply date range filter if specified
		if (dateRange) {
			const { field, start, end } = dateRange;
			filters.push({
				[field]: {
					$ge: start,
					$le: end,
				},
			} as Filter<PersonnelRecord>);
		}

		// Apply numeric range filter if specified
		if (numericRange) {
			const { field, min, max } = numericRange;
			const rangeFilter: Record<string, unknown> = {};

			if (min !== undefined) {
				rangeFilter.$ge = min;
			}

			if (max !== undefined) {
				rangeFilter.$le = max;
			}

			if (Object.keys(rangeFilter).length > 0) {
				filters.push({
					[field]: rangeFilter,
				} as Filter<PersonnelRecord>);
			}
		}

		// Apply text search if specified
		let matchingIds: string[] = [];
		if (textSearch) {
			const { fields, query: searchQuery } = textSearch;

			// Convert string[] to proper TargetColumn[] format
			const targetColumns: TargetColumn<PersonnelRecord>[] = fields.map(
				(field) => ({ column: field as any }),
			);

			const textResults = await xata.db.personnel.search(searchQuery, {
				fuzziness: 1,
				target: targetColumns,
			});

			// Extract IDs from search results for filtering
			matchingIds = textResults.records.map((record) => record.id);
			if (matchingIds.length > 0) {
				filters.push({
					id: { $any: matchingIds },
				} as Filter<PersonnelRecord>);
			} else {
				// No text matches found, return empty array
				return [];
			}
		}

		// Combine all filters if there are any
		if (filters.length > 0) {
			if (filters.length === 1) {
				queryOptions.filter = filters[0];
			} else {
				queryOptions.filter = { $all: filters };
			}
		}

		// Apply sorting if specified
		if (options?.sortBy) {
			queryOptions.sort = [[options.sortBy.field, options.sortBy.direction]];
		}

		// Apply field selection if specified
		if (options?.includeFields) {
			queryOptions.columns = options.includeFields;
		}

		// Apply pagination if specified
		if (options?.limit !== undefined) {
			queryOptions.pagination = {
				size: options.limit,
				offset: options.offset || 0,
			};
		}

		// Execute query with all options
		const result = await xata.db.personnel.query(queryOptions);
		return result.records;
	} catch (error) {
		console.error("Error filtering key figures:", error);
		throw error;
	}
}
