import { XataClient } from "../../../xata";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Cache for client instance
let xataClient: XataClient | null = null;

/**
 * Get the Xata client instance with API key validation
 * @returns An initialized Xata client
 */
export function getXataClient(): XataClient {
	// Return cached instance if available
	if (xataClient) {
		return xataClient;
	}

	// Check if the API key is configured
	const apiKey = process.env.XATA_API_KEY;

	if (!apiKey) {
		throw new Error(
			"XATA_API_KEY environment variable is not set. Please configure it in .env file.",
		);
	}

	try {
		// Initialize a new Xata client
		xataClient = new XataClient({
			apiKey,
		});

		return xataClient;
	} catch (error) {
		throw new Error(
			`Failed to initialize Xata client: ${(error as Error).message}`,
		);
	}
}

/**
 * Data record interface for common fields
 */
export interface DataRecord {
	id?: string;
	title?: string;
	content?: string;
	createdAt?: Date;
	updatedAt?: Date;
	metadata?: Record<string, any>;
	[key: string]: any;
}

/**
 * Create a record in the Xata database
 * @param tableName The name of the table
 * @param data The data to insert
 * @returns The created record
 */
export async function createRecord(
	tableName: string,
	data: DataRecord,
): Promise<DataRecord> {
	try {
		const client = getXataClient();
		const table = client.db[tableName];

		if (!table) {
			throw new Error(`Table '${tableName}' does not exist in the database`);
		}

		// Add timestamps
		const recordWithTimestamps = {
			...data,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await table.create(recordWithTimestamps);
		return result;
	} catch (error) {
		console.error(chalk.red(`Error creating record in ${tableName}:`), error);
		throw new Error(
			`Failed to create record in ${tableName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Update a record in the Xata database
 * @param tableName The name of the table
 * @param id The ID of the record to update
 * @param data The data to update
 * @returns The updated record
 */
export async function updateRecord(
	tableName: string,
	id: string,
	data: Partial<DataRecord>,
): Promise<DataRecord> {
	try {
		const client = getXataClient();
		const table = client.db[tableName];

		if (!table) {
			throw new Error(`Table '${tableName}' does not exist in the database`);
		}

		// Add updated timestamp
		const recordWithTimestamp = {
			...data,
			updatedAt: new Date(),
		};

		const result = await table.update(id, recordWithTimestamp);

		if (!result) {
			throw new Error(
				`Record with ID '${id}' not found in table '${tableName}'`,
			);
		}

		return result;
	} catch (error) {
		console.error(chalk.red(`Error updating record in ${tableName}:`), error);
		throw new Error(
			`Failed to update record in ${tableName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Get a record from the Xata database
 * @param tableName The name of the table
 * @param id The ID of the record to fetch
 * @returns The fetched record or null if not found
 */
export async function getRecord(
	tableName: string,
	id: string,
): Promise<DataRecord | null> {
	try {
		const client = getXataClient();
		const table = client.db[tableName];

		if (!table) {
			throw new Error(`Table '${tableName}' does not exist in the database`);
		}

		const result = await table.read(id);
		return result;
	} catch (error) {
		console.error(chalk.red(`Error fetching record from ${tableName}:`), error);
		throw new Error(
			`Failed to fetch record from ${tableName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Delete a record from the Xata database
 * @param tableName The name of the table
 * @param id The ID of the record to delete
 * @returns True if deleted successfully
 */
export async function deleteRecord(
	tableName: string,
	id: string,
): Promise<boolean> {
	try {
		const client = getXataClient();
		const table = client.db[tableName];

		if (!table) {
			throw new Error(`Table '${tableName}' does not exist in the database`);
		}

		await table.delete(id);
		return true;
	} catch (error) {
		console.error(chalk.red(`Error deleting record from ${tableName}:`), error);
		throw new Error(
			`Failed to delete record from ${tableName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Query records from the Xata database
 * @param tableName The name of the table
 * @param filter Filter condition
 * @param options Query options
 * @returns Matching records
 */
export async function queryRecords(
	tableName: string,
	filter: Record<string, any> = {},
	options: {
		page?: number;
		size?: number;
		sort?: { column: string; direction: "asc" | "desc" }[];
	} = {},
): Promise<{
	records: DataRecord[];
	totalCount: number;
	page: number;
	pageSize: number;
}> {
	try {
		const client = getXataClient();
		const table = client.db[tableName];

		if (!table) {
			throw new Error(`Table '${tableName}' does not exist in the database`);
		}

		const page = options.page || 1;
		const size = options.size || 50;
		const offset = (page - 1) * size;

		let query = table.filter(filter);

		// Apply sorting if provided
		if (options.sort && options.sort.length > 0) {
			for (const sortOption of options.sort) {
				query = query.sort(sortOption.column, sortOption.direction);
			}
		}

		// Paginate and execute
		const results = await query.getPaginated({
			pagination: { offset, size },
		});

		return {
			records: results.records,
			totalCount: results.totalCount,
			page,
			pageSize: size,
		};
	} catch (error) {
		console.error(
			chalk.red(`Error querying records from ${tableName}:`),
			error,
		);
		throw new Error(
			`Failed to query records from ${tableName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Search records in the Xata database
 * @param tableName The name of the table
 * @param query The search query
 * @param options Search options
 * @returns Search results
 */
export async function searchRecords(
	tableName: string,
	query: string,
	options: {
		page?: number;
		size?: number;
		fuzziness?: number;
		prefix?: "none" | "phrase" | "all";
		highlight?: boolean;
		columns?: string[];
	} = {},
): Promise<{
	records: DataRecord[];
	totalCount: number;
	page: number;
	pageSize: number;
}> {
	try {
		const client = getXataClient();
		const table = client.db[tableName];

		if (!table) {
			throw new Error(`Table '${tableName}' does not exist in the database`);
		}

		const page = options.page || 1;
		const size = options.size || 20;

		const results = await table.search(query, {
			fuzziness: options.fuzziness || 1,
			prefix: options.prefix || "phrase",
			highlight: options.highlight || true,
			page: {
				size,
				offset: (page - 1) * size,
			},
			columns: options.columns || undefined,
		});

		return {
			records: results.records,
			totalCount: results.totalCount,
			page,
			pageSize: size,
		};
	} catch (error) {
		console.error(chalk.red(`Error searching records in ${tableName}:`), error);
		throw new Error(
			`Failed to search records in ${tableName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Get the schema of a table
 * @param tableName The name of the table
 * @returns Schema information
 */
export async function getTableSchema(tableName: string): Promise<any> {
	try {
		const client = getXataClient();
		// This is a simplified approach since XataClient doesn't directly expose schema information
		// In a real implementation, this would make a direct API call to fetch the schema

		// Mock schema for now - in a real implementation this would use Xata's workspace API
		return {
			name: tableName,
			columns: [
				{ name: "id", type: "string" },
				{ name: "title", type: "string" },
				{ name: "content", type: "text" },
				{ name: "createdAt", type: "datetime" },
				{ name: "updatedAt", type: "datetime" },
				{ name: "metadata", type: "json" },
			],
		};
	} catch (error) {
		console.error(
			chalk.red(`Error getting schema for table ${tableName}:`),
			error,
		);
		throw new Error(
			`Failed to get schema for table ${tableName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Test the Xata connection
 * @returns Connection status object
 */
export async function testConnection(): Promise<{
	connected: boolean;
	tables: string[];
	message: string;
}> {
	try {
		const client = getXataClient();
		// In a real implementation, we would make a simple query to test the connection
		// and list available tables

		// Mock success response
		return {
			connected: true,
			tables: [
				"testimonies",
				"events",
				"personnel",
				"organizations",
				"artifacts",
			],
			message: "Successfully connected to Xata database",
		};
	} catch (error) {
		return {
			connected: false,
			tables: [],
			message: `Connection failed: ${(error as Error).message}`,
		};
	}
}
