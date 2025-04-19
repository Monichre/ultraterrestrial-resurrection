import { xata } from "../../xata/client";
import type { Personnel, PersonnelRecord } from "../../xata/xata";

/**
 * Create a new personnel record
 * @param data Personnel data to create
 * @returns The created personnel record
 */
export async function createPersonnel(
	data: Omit<Personnel, "id" | "xata">,
): Promise<PersonnelRecord> {
	try {
		return await xata.db.personnel.create(data);
	} catch (error) {
		console.error("Error creating personnel:", error);
		throw error;
	}
}

/**
 * Create multiple personnel records in bulk
 * @param data Array of personnel data to create
 * @returns Array of created personnel records
 */
export async function createManyPersonnel(
	data: Omit<Personnel, "id" | "xata">[],
): Promise<PersonnelRecord[]> {
	try {
		return await xata.db.personnel.create(data);
	} catch (error) {
		console.error("Error creating bulk personnel:", error);
		throw error;
	}
}

/**
 * Get a personnel record by ID
 * @param id The personnel record ID
 * @param columns Optional columns to select
 * @returns The personnel record or null if not found
 */
export async function getPersonnelById(
	id: string,
	columns?: string[],
): Promise<PersonnelRecord | null> {
	try {
		return await xata.db.personnel.read(id, columns);
	} catch (error) {
		console.error(`Error getting personnel with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Get all personnel records with optional filtering, sorting, and pagination
 * @param options Optional query options
 * @returns Array of personnel records
 */
export async function getAllPersonnel(options?: {
	filter?: Record<string, any>;
	sort?: Record<string, "asc" | "desc">;
	pagination?: { size?: number; offset?: number };
	columns?: string[];
}): Promise<PersonnelRecord[]> {
	try {
		let query = xata.db.personnel;

		// Apply filter if provided
		if (options?.filter) {
			query = query.filter(options.filter);
		}

		// Apply sort if provided
		if (options?.sort) {
			for (const [column, direction] of Object.entries(options.sort)) {
				query = query.sort(column, direction);
			}
		}

		// Apply column selection if provided
		if (options?.columns) {
			query = query.select(options.columns);
		}

		// Apply pagination or return all
		if (options?.pagination) {
			return await query
				.getPaginated({
					pagination: {
						size: options.pagination.size || 50,
						offset: options.pagination.offset || 0,
					},
				})
				.then((result) => result.records);
		} else {
			return await query.getMany();
		}
	} catch (error) {
		console.error("Error getting all personnel:", error);
		throw error;
	}
}

/**
 * Get personnel records with pagination
 * @param page Page number (1-based)
 * @param size Number of records per page
 * @param filter Optional filter criteria
 * @returns Paginated personnel records
 */
export async function getPersonnelWithPagination(
	page = 1,
	size = 20,
	filter?: Record<string, any>,
	columns?: string[],
) {
	try {
		let query = xata.db.personnel;

		if (filter) {
			query = query.filter(filter);
		}

		if (columns) {
			query = query.select(columns);
		}

		const result = await query.getPaginated({
			pagination: {
				size,
				offset: (page - 1) * size,
			},
		});

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
		console.error("Error getting paginated personnel:", error);
		throw error;
	}
}

/**
 * Search personnel records
 * @param query Search query
 * @param options Search options
 * @returns Matching personnel records
 */
export async function searchPersonnel(
	query: string,
	options?: {
		fuzziness?: number;
		prefix?: "phrase" | "disabled";
		pagination?: { size?: number; offset?: number };
	},
): Promise<PersonnelRecord[]> {
	try {
		const searchOptions: any = {
			fuzziness: options?.fuzziness || 1,
			prefix: options?.prefix || "phrase",
		};

		if (options?.pagination) {
			searchOptions.pagination = {
				size: options.pagination.size || 20,
				offset: options.pagination.offset || 0,
			};
		}

		const results = await xata.db.personnel.search(query, searchOptions);
		return results.records;
	} catch (error) {
		console.error(`Error searching personnel with query "${query}":`, error);
		throw error;
	}
}

/**
 * Update a personnel record
 * @param id The personnel record ID
 * @param data The data to update
 * @returns The updated personnel record
 */
export async function updatePersonnel(
	id: string,
	data: Partial<Omit<Personnel, "id" | "xata">>,
): Promise<PersonnelRecord | null> {
	try {
		return await xata.db.personnel.update(id, data);
	} catch (error) {
		console.error(`Error updating personnel with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Update multiple personnel records that match a filter
 * @param filter Filter to select records to update
 * @param data Data to update on matching records
 * @returns Number of records updated
 */
export async function updateManyPersonnel(
	filter: Record<string, any>,
	data: Partial<Omit<Personnel, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
	try {
		return await xata.db.personnel.filter(filter).update(data);
	} catch (error) {
		console.error("Error updating multiple personnel records:", error);
		throw error;
	}
}

/**
 * Delete a personnel record
 * @param id The ID of the personnel record to delete
 * @returns True if the record was deleted, false if it didn't exist
 */
export async function deletePersonnel(id: string): Promise<boolean> {
	try {
		const result = await xata.db.personnel.delete(id);
		return result;
	} catch (error) {
		console.error(`Error deleting personnel with ID ${id}:`, error);
		throw error;
	}
}

/**
 * Delete multiple personnel records that match a filter
 * @param filter Filter to select records to delete
 * @returns Number of records deleted
 */
export async function deleteManyPersonnel(
	filter: Record<string, any>,
): Promise<{ numberOfRecordsDeleted: number }> {
	try {
		return await xata.db.personnel.filter(filter).delete();
	} catch (error) {
		console.error("Error deleting multiple personnel records:", error);
		throw error;
	}
}
