import { xata } from "@/db/xata/client";
import type { UserNotes, UserNotesRecord } from "@/db/xata/xata";
import type {
  Filter,
  SelectableColumn,
  TargetColumn,
  PrefixExpression,
  GetRecordOptions,
  RecordFilterExpression,
} from "@xata.io/client";

/**
 * Error interface for standardized error responses
 */
interface UserNotesOperationError extends Error {
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
function createUserNoteError(
  message: string,
  code: string,
  operation: string,
  details?: unknown,
): UserNotesOperationError {
  const error = new Error(message) as UserNotesOperationError;
  error.code = code;
  error.operation = operation;
  error.details = details;
  return error;
}

/**
 * Create a new user note record
 * @param data User note data to create
 * @returns The created user note record
 * @throws {UserNotesOperationError} If creation fails
 */
export async function createUserNote(
  data: Omit<UserNotes, "id" | "xata">,
): Promise<UserNotesRecord> {
  try {
    // Validate required fields
    if (!data.user) {
      throw createUserNoteError(
        "User reference is required",
        "MISSING_REQUIRED_FIELD",
        "createUserNote",
      );
    }

    if (!data.name) {
      throw createUserNoteError(
        "Note name is required",
        "MISSING_REQUIRED_FIELD",
        "createUserNote",
      );
    }

    return await xata.db["user-notes"].create(data);
  } catch (error) {
    console.error("Error creating user note:", error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to create user note: ${(error as Error).message}`,
      "CREATE_FAILED",
      "createUserNote",
      error,
    );
  }
}

/**
 * Create multiple user note records in bulk
 * @param data Array of user note data to create
 * @returns Array of created user note records
 * @throws {UserNotesOperationError} If bulk creation fails
 */
export async function createManyUserNotes(
  data: Omit<UserNotes, "id" | "xata">[],
): Promise<UserNotesRecord[]> {
  try {
    // Validate input
    if (!Array.isArray(data) || data.length === 0) {
      throw createUserNoteError(
        "Data must be a non-empty array",
        "INVALID_INPUT",
        "createManyUserNotes",
      );
    }

    // Validate required fields for each item
    for (const [index, item] of data.entries()) {
      if (!item.user) {
        throw createUserNoteError(
          `User note at index ${index} is missing a user reference`,
          "MISSING_REQUIRED_FIELD",
          "createManyUserNotes",
        );
      }

      if (!item.name) {
        throw createUserNoteError(
          `User note at index ${index} is missing a name`,
          "MISSING_REQUIRED_FIELD",
          "createManyUserNotes",
        );
      }
    }

    return await xata.db["user-notes"].create(data);
  } catch (error) {
    console.error("Error creating bulk user notes:", error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to create multiple user notes: ${(error as Error).message}`,
      "BULK_CREATE_FAILED",
      "createManyUserNotes",
      error,
    );
  }
}

/**
 * Get a user note record by ID
 * @param id The user note record ID
 * @param columns Optional columns to select
 * @returns The user note record or null if not found
 * @throws {UserNotesOperationError} If retrieval fails
 */
export async function getUserNoteById(
  id: string,
  columns?: string[],
): Promise<UserNotesRecord | null> {
  try {
    if (!id) {
      throw createUserNoteError(
        "User note ID is required",
        "MISSING_ID",
        "getUserNoteById",
      );
    }

    const options: GetRecordOptions = {};
    if (columns && columns.length > 0) {
      options.columns = columns;
    }

    return await xata.db["user-notes"].read(id, options);
  } catch (error) {
    console.error(`Error getting user note with ID ${id}:`, error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to get user note with ID ${id}: ${(error as Error).message}`,
      "GET_FAILED",
      "getUserNoteById",
      error,
    );
  }
}

/**
 * Get all user note records with optional filtering, sorting, and pagination
 * @param options Optional query options
 * @returns Array of user note records
 * @throws {UserNotesOperationError} If query fails
 */
export async function getAllUserNotes(options?: {
  filter?: RecordFilterExpression<UserNotesRecord>;
  sort?: Record<string, "asc" | "desc">;
  pagination?: { size?: number; offset?: number };
  columns?: string[];
  consistency?: "strong" | "eventual";
}): Promise<UserNotesRecord[]> {
  try {
    // Build the query using builder pattern
    const queryOptions: {
      filter?: RecordFilterExpression<UserNotesRecord>;
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
    const result = await xata.db["user-notes"].query(queryOptions);
    return result.records;
  } catch (error) {
    console.error("Error getting all user notes:", error);
    throw createUserNoteError(
      `Failed to get user notes: ${(error as Error).message}`,
      "QUERY_FAILED",
      "getAllUserNotes",
      error,
    );
  }
}

/**
 * Get user note records with pagination
 * @param page Page number (1-based)
 * @param size Number of records per page
 * @param filter Optional filter criteria
 * @param columns Optional columns to select
 * @returns Paginated user note records
 * @throws {UserNotesOperationError} If pagination query fails
 */
export async function getUserNotesWithPagination(
  page = 1,
  size = 20,
  filter?: RecordFilterExpression<UserNotesRecord>,
  columns?: string[],
): Promise<PaginatedResponse<UserNotesRecord>> {
  try {
    // Validate input
    if (page < 1) {
      throw createUserNoteError(
        "Page number must be greater than 0",
        "INVALID_PAGE",
        "getUserNotesWithPagination",
      );
    }

    if (size < 1 || size > 100) {
      throw createUserNoteError(
        "Page size must be between 1 and 100",
        "INVALID_SIZE",
        "getUserNotesWithPagination",
      );
    }

    const queryOptions: {
      filter?: RecordFilterExpression<UserNotesRecord>;
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

    const result = await xata.db["user-notes"].query(queryOptions);

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
    console.error("Error getting paginated user notes:", error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to get paginated user notes: ${(error as Error).message}`,
      "PAGINATION_FAILED",
      "getUserNotesWithPagination",
      error,
    );
  }
}

/**
 * Search user note records
 * @param query Search query
 * @param options Search options
 * @returns Matching user note records
 * @throws {UserNotesOperationError} If search fails
 */
export async function searchUserNotes(
  query: string,
  options?: {
    fuzziness?: number;
    prefix?: "phrase" | "disabled";
    pagination?: { size?: number; offset?: number };
    filter?: RecordFilterExpression<UserNotesRecord>;
  },
): Promise<UserNotesRecord[]> {
  try {
    // Validate input
    if (!query || query.trim() === "") {
      throw createUserNoteError(
        "Search query is required",
        "MISSING_QUERY",
        "searchUserNotes",
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

    const results = await xata.db["user-notes"].search(query, searchOptions);
    return results.records;
  } catch (error) {
    console.error(`Error searching user notes with query "${query}":`, error);
    throw createUserNoteError(
      `Failed to search user notes: ${(error as Error).message}`,
      "SEARCH_FAILED",
      "searchUserNotes",
      error,
    );
  }
}

/**
 * Update a user note record
 * @param id The user note record ID
 * @param data The data to update
 * @returns The updated user note record
 * @throws {UserNotesOperationError} If update fails
 */
export async function updateUserNote(
  id: string,
  data: Partial<Omit<UserNotes, "id" | "xata">>,
): Promise<UserNotesRecord | null> {
  try {
    // Validate input
    if (!id) {
      throw createUserNoteError(
        "User note ID is required",
        "MISSING_ID",
        "updateUserNote",
      );
    }

    if (!data || Object.keys(data).length === 0) {
      throw createUserNoteError(
        "Update data is required",
        "MISSING_DATA",
        "updateUserNote",
      );
    }

    // Verify the record exists before updating
    const exists = await xata.db["user-notes"].read(id);
    if (!exists) {
      return null;
    }

    return await xata.db["user-notes"].update(id, data);
  } catch (error) {
    console.error(`Error updating user note with ID ${id}:`, error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to update user note with ID ${id}: ${(error as Error).message}`,
      "UPDATE_FAILED",
      "updateUserNote",
      error,
    );
  }
}

/**
 * Update multiple user note records that match a filter
 * @param filter Filter to select records to update
 * @param data Data to update on matching records
 * @returns Number of records updated
 * @throws {UserNotesOperationError} If bulk update fails
 */
export async function updateManyUserNotes(
  filter: RecordFilterExpression<UserNotesRecord>,
  data: Partial<Omit<UserNotes, "id" | "xata">>,
): Promise<{ numberOfRecordsUpdated: number }> {
  try {
    // Validate inputs
    if (!filter || Object.keys(filter).length === 0) {
      throw createUserNoteError(
        "Filter criteria is required",
        "MISSING_FILTER",
        "updateManyUserNotes",
      );
    }

    if (!data || Object.keys(data).length === 0) {
      throw createUserNoteError(
        "Update data is required",
        "MISSING_DATA",
        "updateManyUserNotes",
      );
    }

    // First get the IDs of records matching the filter
    const records = await xata.db["user-notes"].query({ filter });

    if (records.records.length === 0) {
      return { numberOfRecordsUpdated: 0 };
    }

    const updatePromises = records.records.map((record) =>
      xata.db["user-notes"].update(record.id, data),
    );

    const updatedRecords = await Promise.all(updatePromises);
    return { numberOfRecordsUpdated: updatedRecords.filter(Boolean).length };
  } catch (error) {
    console.error("Error updating multiple user note records:", error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to update multiple user notes: ${(error as Error).message}`,
      "BULK_UPDATE_FAILED",
      "updateManyUserNotes",
      error,
    );
  }
}

/**
 * Delete a user note record
 * @param id The ID of the user note record to delete
 * @returns True if the record was deleted, false if it didn't exist
 * @throws {UserNotesOperationError} If deletion fails
 */
export async function deleteUserNote(id: string): Promise<boolean> {
  try {
    // Validate input
    if (!id) {
      throw createUserNoteError(
        "User note ID is required",
        "MISSING_ID",
        "deleteUserNote",
      );
    }

    const deletedRecord = await xata.db["user-notes"].delete(id);
    return deletedRecord !== null;
  } catch (error) {
    console.error(`Error deleting user note with ID ${id}:`, error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to delete user note with ID ${id}: ${(error as Error).message}`,
      "DELETE_FAILED",
      "deleteUserNote",
      error,
    );
  }
}

/**
 * Delete multiple user note records that match a filter
 * @param filter Filter to select records to delete
 * @returns Number of records deleted
 * @throws {UserNotesOperationError} If bulk deletion fails
 */
export async function deleteManyUserNotes(
  filter: RecordFilterExpression<UserNotesRecord>,
): Promise<{ numberOfRecordsDeleted: number }> {
  try {
    // Validate input
    if (!filter || Object.keys(filter).length === 0) {
      throw createUserNoteError(
        "Filter criteria is required",
        "MISSING_FILTER",
        "deleteManyUserNotes",
      );
    }

    // First get the IDs of records matching the filter
    const records = await xata.db["user-notes"].query({ filter });

    if (records.records.length === 0) {
      return { numberOfRecordsDeleted: 0 };
    }

    const deletePromises = records.records.map((record) =>
      xata.db["user-notes"].delete(record.id),
    );

    const deletedRecords = await Promise.all(deletePromises);
    return { numberOfRecordsDeleted: deletedRecords.filter(Boolean).length };
  } catch (error) {
    console.error("Error deleting multiple user note records:", error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to delete multiple user notes: ${(error as Error).message}`,
      "BULK_DELETE_FAILED",
      "deleteManyUserNotes",
      error,
    );
  }
}

/**
 * Get user notes by user ID
 * @param userId The user ID to get notes for
 * @returns User notes for the specified user
 * @throws {UserNotesOperationError} If query fails
 */
export async function getUserNotesByUserId(
  userId: string,
): Promise<UserNotesRecord[]> {
  try {
    // Validate input
    if (!userId) {
      throw createUserNoteError(
        "User ID is required",
        "MISSING_USER_ID",
        "getUserNotesByUserId",
      );
    }

    const result = await xata.db["user-notes"].query({
      filter: {
        "user.id": userId,
      },
      sort: [["xata.createdAt", "desc"]],
    });

    return result.records;
  } catch (error) {
    console.error(`Error getting user notes for user ID ${userId}:`, error);

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to get user notes for user ID ${userId}: ${(error as Error).message}`,
      "USER_NOTES_QUERY_FAILED",
      "getUserNotesByUserId",
      error,
    );
  }
}

/**
 * Get user notes with full text search
 * @param userId The user ID to get notes for
 * @param searchTerm The term to search for in notes
 * @returns User notes matching the search
 * @throws {UserNotesOperationError} If search fails
 */
export async function searchUserNotesByUserId(
  userId: string,
  searchTerm: string,
): Promise<UserNotesRecord[]> {
  try {
    // Validate inputs
    if (!userId) {
      throw createUserNoteError(
        "User ID is required",
        "MISSING_USER_ID",
        "searchUserNotesByUserId",
      );
    }

    if (!searchTerm || searchTerm.trim() === "") {
      throw createUserNoteError(
        "Search term is required",
        "MISSING_SEARCH_TERM",
        "searchUserNotesByUserId",
      );
    }

    const searchResults = await xata.db["user-notes"].search(searchTerm, {
      filter: {
        "user.id": userId,
      },
      fuzziness: 1,
    });

    return searchResults.records;
  } catch (error) {
    console.error(
      `Error searching user notes for user ID ${userId} with term "${searchTerm}":`,
      error,
    );

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to search user notes: ${(error as Error).message}`,
      "USER_NOTES_SEARCH_FAILED",
      "searchUserNotesByUserId",
      error,
    );
  }
}

/**
 * Get recent user notes
 * @param userId The user ID to get notes for
 * @param limit Number of recent notes to return
 * @returns Recent user notes
 * @throws {UserNotesOperationError} If query fails
 */
export async function getRecentUserNotes(
  userId: string,
  limit = 5,
): Promise<UserNotesRecord[]> {
  try {
    // Validate inputs
    if (!userId) {
      throw createUserNoteError(
        "User ID is required",
        "MISSING_USER_ID",
        "getRecentUserNotes",
      );
    }

    if (limit < 1) {
      throw createUserNoteError(
        "Limit must be greater than 0",
        "INVALID_LIMIT",
        "getRecentUserNotes",
      );
    }

    const result = await xata.db["user-notes"].query({
      filter: {
        "user.id": userId,
      },
      sort: [["xata.updatedAt", "desc"]],
      pagination: {
        size: limit,
      },
    });

    return result.records;
  } catch (error) {
    console.error(
      `Error getting recent user notes for user ID ${userId}:`,
      error,
    );

    if ((error as UserNotesOperationError).code) {
      throw error;
    }

    throw createUserNoteError(
      `Failed to get recent user notes: ${(error as Error).message}`,
      "RECENT_NOTES_QUERY_FAILED",
      "getRecentUserNotes",
      error,
    );
  }
}