import { getXataClient } from "../../../src/db/xata/xata";
import type { ValidationResult } from "./validators";
import chalk from "chalk";
import ora from "ora";

/**
 * Options for insertion operations
 */
export interface InsertionOptions {
	batchSize?: number;
	skipDuplicates?: boolean;
	updateExisting?: boolean;
	dryRun?: boolean;
}

/**
 * Result of an insertion operation
 */
export interface InsertionResult {
	success: boolean;
	count: number;
	failedCount: number;
	skippedCount: number;
	updatedCount: number;
	errors: Array<{
		record: any;
		error: string;
		index: number;
	}>;
}

/**
 * Insert records into a Xata table
 * @param tableName The name of the table to insert into
 * @param records The records to insert
 * @param options Options for the insertion operation
 */
export async function insertRecords(
	tableName: string,
	records: any[],
	options: InsertionOptions = {},
): Promise<InsertionResult> {
	const xata = getXataClient();

	// Default options
	const batchSize = options.batchSize || 100;
	const skipDuplicates = options.skipDuplicates || false;
	const updateExisting = options.updateExisting || false;
	const dryRun = options.dryRun || false;

	// Initialize result
	const result: InsertionResult = {
		success: true,
		count: 0,
		failedCount: 0,
		skippedCount: 0,
		updatedCount: 0,
		errors: [],
	};

	// Create batches
	const batches = [];
	for (let i = 0; i < records.length; i += batchSize) {
		batches.push(records.slice(i, i + batchSize));
	}

	// Process in batches
	const spinner = ora(
		`Processing ${records.length} records in ${batches.length} batches...`,
	).start();

	try {
		// If dry run, just return success
		if (dryRun) {
			spinner.succeed(
				`Dry run complete. Would have processed ${records.length} records.`,
			);
			result.success = true;
			return result;
		}

		// Process each batch
		for (let i = 0; i < batches.length; i++) {
			const batch = batches[i];
			spinner.text = `Processing batch ${i + 1}/${batches.length} (${batch.length} records)...`;

			try {
				// Process each record in the batch
				for (let j = 0; j < batch.length; j++) {
					const record = batch[j];
					const recordIndex = i * batchSize + j;

					try {
						// Check for duplicates if needed
						if (skipDuplicates || updateExisting) {
							// Create a filter based on unique fields
							// This assumes there's at least one field we can use to check uniqueness
							// In a real application, we'd need to know the primary key or unique fields
							const filter: Record<string, any> = {};

							// If the record has a 'title' field marked as unique, use that
							if (record.title !== undefined) {
								filter.title = record.title;
							}
							// If the record has a 'name' field that might be unique, use that
							else if (record.name !== undefined) {
								filter.name = record.name;
							}
							// Otherwise, just try with the first field
							else {
								const firstField = Object.keys(record)[0];
								if (firstField) {
									filter[firstField] = record[firstField];
								}
							}

							// Check if record exists
							const existingRecord = await xata.db[tableName]
								.filter(filter)
								.getFirst();

							if (existingRecord) {
								if (updateExisting) {
									// Update existing record
									await xata.db[tableName].update(existingRecord.id, record);
									result.updatedCount++;
								} else {
									// Skip duplicate
									result.skippedCount++;
									continue;
								}
							} else {
								// Create new record
								await xata.db[tableName].create(record);
								result.count++;
							}
						} else {
							// Just create new records without checking
							await xata.db[tableName].create(record);
							result.count++;
						}
					} catch (error) {
						// Track failed record
						result.failedCount++;
						result.errors.push({
							record,
							error: error.message,
							index: recordIndex,
						});
					}
				}
			} catch (error) {
				spinner.fail(`Batch ${i + 1} failed: ${error.message}`);
				result.success = false;
				throw error;
			}
		}

		spinner.succeed(
			`Inserted ${result.count} records, updated ${result.updatedCount}, skipped ${result.skippedCount}, failed ${result.failedCount}`,
		);
		return result;
	} catch (error) {
		spinner.fail(`Insertion failed: ${error.message}`);
		result.success = false;
		return result;
	}
}

/**
 * Check if records would cause duplicate entries
 * @param tableName The table to check against
 * @param records The records to check
 */
export async function checkDuplicates(
	tableName: string,
	records: any[],
): Promise<{
	duplicates: number;
	duplicateRecords: any[];
}> {
	const xata = getXataClient();

	const duplicateRecords: any[] = [];

	// Check each record
	for (const record of records) {
		// Create a filter based on unique fields
		const filter: Record<string, any> = {};

		// If the record has a 'title' field marked as unique, use that
		if (record.title !== undefined) {
			filter.title = record.title;
		}
		// If the record has a 'name' field that might be unique, use that
		else if (record.name !== undefined) {
			filter.name = record.name;
		}
		// Otherwise, just try with the first field
		else {
			const firstField = Object.keys(record)[0];
			if (firstField) {
				filter[firstField] = record[firstField];
			}
		}

		// Check if record exists
		const existingRecord = await xata.db[tableName].filter(filter).getFirst();

		if (existingRecord) {
			duplicateRecords.push(record);
		}
	}

	return {
		duplicates: duplicateRecords.length,
		duplicateRecords,
	};
}

/**
 * Get total record count for a table
 * @param tableName The table to count
 */
export async function getTableCount(tableName: string): Promise<number> {
	const xata = getXataClient();

	const { meta } = await xata.db[tableName].getPaginated({
		pagination: { size: 1 },
	});

	return meta.totalCount;
}

/**
 * Get a sample of records from a table
 * @param tableName The table to sample
 * @param count The number of records to retrieve
 */
export async function getSampleRecords(
	tableName: string,
	count = 5,
): Promise<any[]> {
	const xata = getXataClient();

	const { records } = await xata.db[tableName].getPaginated({
		pagination: { size: count },
	});

	return records;
}

/**
 * Insert data from a validation result
 * @param tableName The table to insert into
 * @param validationResult The validation result containing the data
 * @param options Options for the insertion
 */
export async function insertFromValidationResult(
	tableName: string,
	validationResult: ValidationResult,
	options: InsertionOptions = {},
): Promise<InsertionResult> {
	if (!validationResult.valid && !options.dryRun) {
		return {
			success: false,
			count: 0,
			failedCount: 0,
			skippedCount: 0,
			updatedCount: 0,
			errors: [
				{
					record: null,
					error: "Validation failed, cannot insert invalid data",
					index: -1,
				},
			],
		};
	}

	if (!validationResult.data) {
		return {
			success: false,
			count: 0,
			failedCount: 0,
			skippedCount: 0,
			updatedCount: 0,
			errors: [
				{
					record: null,
					error: "No data available in validation result",
					index: -1,
				},
			],
		};
	}

	// Prepare records for insertion
	const records = Array.isArray(validationResult.data)
		? validationResult.data
		: [validationResult.data];

	return await insertRecords(tableName, records, options);
}

/**
 * Check database connection status
 * @returns True if connection is successful, false otherwise
 */
export async function checkConnection(): Promise<boolean> {
	try {
		// Attempt to get client
		const xata = getXataClient();

		// Try a simple query to verify connection
		const testRecord = await xata.db.testimonies.filter({}).getFirst();

		// If we got here, connection is working
		return true;
	} catch (error) {
		console.error("Error connecting to Xata database:", error);
		return false;
	}
}
