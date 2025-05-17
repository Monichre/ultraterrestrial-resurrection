import type { Command } from "commander";
import chalk from "chalk";
import * as inquirer from "inquirer";
import * as fileManager from "../lib/fileManager";
import { readMetadata } from "../lib/metadata";
import type { DataTypeConfig } from "../config";
import ora from "ora";
import { Table } from "table";
import { xataClient, insertRecords } from "../lib/xataClient";
import * as fs from "fs";
import * as path from "path";
import * as bucketManager from "../lib/bucketManager";
import { getXataClient } from "../lib/xata-client";

/**
 * Register insertion commands with Commander
 * @param program The Commander program instance
 */
export default function registerInsertionCommands(program: Command): void {
	// Insert:list command - List files in the insertion bucket
	program
		.command("insert:list")
		.description("List files in the insertion bucket")
		.option(
			"-t, --type <type>",
			"Type of data (testimonies, events, personnel, etc.)",
		)
		.option(
			"-p, --pattern <pattern>",
			'File pattern to match (e.g., "*.md", "*.json")',
		)
		.action(async (options) => {
			try {
				// If no type is provided, prompt the user
				const dataType = options.type || (await promptForDataType());
				if (!dataType) return;

				// Default pattern is all files
				const pattern = options.pattern || "*";

				// Show spinner
				const spinner = ora(
					`Listing files in insertion bucket for ${dataType}...`,
				).start();

				// Get files
				const files = await fileManager.listFiles(
					dataType,
					"insertion",
					pattern,
				);
				spinner.succeed(
					`Found ${files.length} files in insertion bucket for ${dataType}`,
				);

				if (files.length === 0) {
					console.log(
						chalk.yellow(
							`No files found in insertion bucket for ${dataType} matching pattern "${pattern}"`,
						),
					);
					return;
				}

				// Display files in a table with metadata
				const tableData = [
					["Name", "Size", "Records", "Target Table", "Status", "Ready"],
				];

				// Add file data with metadata
				for (const file of files) {
					try {
						const metadata = await readMetadata(
							dataType,
							"insertion",
							file.name,
						);
						tableData.push([
							chalk.cyan(file.name),
							formatFileSize(file.size),
							metadata.recordCount.toString(),
							metadata.targetTable,
							metadata.status,
							metadata.status === "approved"
								? chalk.green("✓")
								: chalk.red("✗"),
						]);
					} catch (error) {
						// If metadata can't be read, just show basic file info
						tableData.push([
							chalk.cyan(file.name),
							formatFileSize(file.size),
							"N/A",
							dataType.toString(),
							"unknown",
							chalk.red("✗"),
						]);
					}
				}

				console.log(
					Table(tableData, {
						border: {
							topBody: "─",
							topJoin: "┬",
							topLeft: "┌",
							topRight: "┐",
							bottomBody: "─",
							bottomJoin: "┴",
							bottomLeft: "└",
							bottomRight: "┘",
							bodyLeft: "│",
							bodyRight: "│",
							bodyJoin: "│",
							joinBody: "─",
							joinLeft: "├",
							joinRight: "┤",
							joinJoin: "┼",
						},
					}),
				);
			} catch (error) {
				console.error(chalk.red("Error listing files:"), error);
			}
		});

	// Insert:batch command - Batch insert approved files into Xata
	program
		.command("insert:batch")
		.description("Batch insert approved files into Xata")
		.option(
			"-t, --type <type>",
			"Type of data (testimonies, events, personnel, etc.)",
		)
		.option("-f, --file <file>", "Specific file to insert")
		.option("-i, --interactive", "Run in interactive mode with file selection")
		.option(
			"-b, --batch-size <size>",
			"Batch size for insertion (default: 10)",
			"10",
		)
		.option("--force", "Force insert even if duplicates are detected")
		.option("--update", "Update existing records if duplicates are found")
		.action(async (options) => {
			try {
				// If no type is provided, prompt the user
				const dataType = options.type || (await promptForDataType());
				if (!dataType) return;

				// Get files to insert
				let filesToInsert: string[] = [];

				if (options.file) {
					// Insert specific file
					filesToInsert = [options.file];
				} else if (options.interactive) {
					// Interactive mode - let user select files
					filesToInsert = await promptForFiles(dataType, "insertion");
					if (filesToInsert.length === 0) {
						console.log(chalk.yellow("No files selected for insertion"));
						return;
					}
				} else {
					// Get all approved files
					const files = await fileManager.listFiles(dataType, "insertion");

					for (const file of files) {
						try {
							const metadata = await readMetadata(
								dataType,
								"insertion",
								file.name,
							);
							if (metadata.status === "approved") {
								filesToInsert.push(file.name);
							}
						} catch (error) {
							// Skip files with missing or invalid metadata
							console.warn(
								chalk.yellow(
									`Skipping ${file.name} due to missing or invalid metadata`,
								),
							);
						}
					}
				}

				if (filesToInsert.length === 0) {
					console.log(chalk.yellow("No approved files found for insertion"));
					return;
				}

				// Batch size
				const batchSize = Number.parseInt(options.batchSize, 10) || 10;

				console.log(
					chalk.blue(
						`Batch inserting ${filesToInsert.length} file(s) for ${dataType} with batch size ${batchSize}...`,
					),
				);

				// Confirm insertion
				const { confirm } = await inquirer.prompt([
					{
						type: "confirm",
						name: "confirm",
						message: `Are you sure you want to insert ${filesToInsert.length} file(s) into Xata?`,
						default: false,
					},
				]);

				if (!confirm) {
					console.log(chalk.yellow("Insertion cancelled"));
					return;
				}

				// Process each file
				for (const fileName of filesToInsert) {
					await batchInsertFile(dataType, fileName, {
						batchSize,
						force: options.force,
						update: options.update,
					});
				}
			} catch (error) {
				console.error(chalk.red("Error batch inserting files:"), error);
			}
		});

	// Insert:bulk command - Bulk insert approved files into Xata
	program
		.command("insert:bulk")
		.description("Bulk insert approved files into Xata")
		.option(
			"-t, --type <type>",
			"Type of data (testimonies, events, personnel, etc.)",
		)
		.option("-f, --file <file>", "Specific file to insert")
		.option("-i, --interactive", "Run in interactive mode with file selection")
		.option("--force", "Force insert even if duplicates are detected")
		.option("--update", "Update existing records if duplicates are found")
		.action(async (options) => {
			try {
				// If no type is provided, prompt the user
				const dataType = options.type || (await promptForDataType());
				if (!dataType) return;

				// Get files to insert
				let filesToInsert: string[] = [];

				if (options.file) {
					// Insert specific file
					filesToInsert = [options.file];
				} else if (options.interactive) {
					// Interactive mode - let user select files
					filesToInsert = await promptForFiles(dataType, "insertion");
					if (filesToInsert.length === 0) {
						console.log(chalk.yellow("No files selected for insertion"));
						return;
					}
				} else {
					// Get all approved files
					const files = await fileManager.listFiles(dataType, "insertion");

					for (const file of files) {
						try {
							const metadata = await readMetadata(
								dataType,
								"insertion",
								file.name,
							);
							if (metadata.status === "approved") {
								filesToInsert.push(file.name);
							}
						} catch (error) {
							// Skip files with missing or invalid metadata
							console.warn(
								chalk.yellow(
									`Skipping ${file.name} due to missing or invalid metadata`,
								),
							);
						}
					}
				}

				if (filesToInsert.length === 0) {
					console.log(chalk.yellow("No approved files found for insertion"));
					return;
				}

				console.log(
					chalk.blue(
						`Bulk inserting ${filesToInsert.length} file(s) for ${dataType}...`,
					),
				);

				// Confirm insertion
				const { confirm } = await inquirer.prompt([
					{
						type: "confirm",
						name: "confirm",
						message: `Are you sure you want to insert ${filesToInsert.length} file(s) into Xata?`,
						default: false,
					},
				]);

				if (!confirm) {
					console.log(chalk.yellow("Insertion cancelled"));
					return;
				}

				// Process each file
				for (const fileName of filesToInsert) {
					await bulkInsertFile(dataType, fileName, {
						force: options.force,
						update: options.update,
					});
				}
			} catch (error) {
				console.error(chalk.red("Error bulk inserting files:"), error);
			}
		});

	// Insert:one command - Insert a single record into any Xata table
	program
		.command("insert:one <table>")
		.description("Insert a single record into any Xata table")
		.option("-d, --data <json>", "JSON string containing the record data")
		.option("-f, --file <path>", "Path to JSON file containing a single record")
		.option("--dry-run", "Validate data without performing the actual insert")
		.option("--force", "Force insert even if duplicates are detected")
		.option("--update", "Update existing record if a duplicate is found")
		.action(async (table, options) => {
			try {
				let recordData: any;

				// Get record data from either JSON string or file
				if (options.data) {
					try {
						recordData = JSON.parse(options.data);
					} catch (error) {
						console.error(chalk.red("Error parsing JSON data:"), error.message);
						return;
					}
				} else if (options.file) {
					try {
						const fileData = await fileManager.readFile(options.file);
						recordData = JSON.parse(fileData);
					} catch (error) {
						console.error(
							chalk.red(`Error reading file ${options.file}:`),
							error.message,
						);
						return;
					}
				} else {
					console.error(
						chalk.red("Error: Either --data or --file option is required"),
					);
					return;
				}

				// Validate that we have a record object
				if (
					!recordData ||
					typeof recordData !== "object" ||
					Array.isArray(recordData)
				) {
					console.error(chalk.red("Error: Data must be a single JSON object"));
					return;
				}

				// Show the record that will be inserted
				console.log(chalk.blue("Record to insert:"));
				console.log(JSON.stringify(recordData, null, 2));

				// Confirm insertion
				if (!options.dryRun) {
					const { confirm } = await inquirer.prompt([
						{
							type: "confirm",
							name: "confirm",
							message: `Are you sure you want to insert this record into the '${table}' table?`,
							default: false,
						},
					]);

					if (!confirm) {
						console.log(chalk.yellow("Insertion cancelled"));
						return;
					}
				}

				// Insert the record
				const result = await insertRecords(table, [recordData], {
					dryRun: options.dryRun,
					skipDuplicates: !options.force && !options.update,
					updateExisting: options.update,
				});

				if (result.success) {
					if (options.dryRun) {
						console.log(
							chalk.green(
								"Dry run completed successfully. Record is valid for insertion.",
							),
						);
					} else if (result.count > 0) {
						console.log(chalk.green("Record inserted successfully"));
					} else if (result.updatedCount > 0) {
						console.log(chalk.green("Record updated successfully"));
					} else if (result.skippedCount > 0) {
						console.log(chalk.yellow("Record skipped (duplicate found)"));
					}
				} else {
					console.error(chalk.red("Insertion failed:"));
					if (result.errors.length > 0) {
						result.errors.forEach((err) => {
							console.error(chalk.red(`- ${err.error}`));
						});
					}
				}
			} catch (error) {
				console.error(chalk.red("Error inserting record:"), error.message);
			}
		});

	// Insert command - Insert approved files into the database
	program
		.command("insert")
		.description("Insert approved files into the database")
		.option(
			"-t, --type <type>",
			`Type of data to insert (${Object.keys(supportedDataTypes).join(", ")})`,
			"testimonies",
		)
		.option("-f, --file <file>", "Specific file to insert")
		.option("-a, --all", "Insert all approved files in the insertion bucket")
		.option(
			"-d, --dry-run",
			"Preview insertion without making database changes",
		)
		.option("-v, --verbose", "Show detailed insertion information")
		.action(async (options: InsertionOptions) => {
			try {
				await insertFiles(options);
			} catch (error) {
				console.error(chalk.red("Insertion failed:"), error);
				process.exit(1);
			}
		});

	program
		.command("insert:stats")
		.description("Show statistics about the insertion bucket")
		.option(
			"-t, --type <type>",
			`Type of data to show stats for (${Object.keys(supportedDataTypes).join(", ")})`,
			"testimonies",
		)
		.action(async (options) => {
			try {
				const dataType = options.type as keyof DataTypeConfig;

				// Show spinner
				const spinner = ora(
					`Gathering statistics for ${dataType} insertion bucket...`,
				).start();

				// Get stats
				const stats = await bucketManager.getBucketStats(dataType, "insertion");

				spinner.succeed(`Statistics for ${dataType} insertion bucket:`);

				// Display stats
				console.log(chalk.blue("\nInsertion Bucket Statistics:"));
				console.log(`Total files: ${stats.totalFiles}`);
				console.log(
					`Total size: ${fileManager.formatFileSize(stats.totalSize)}`,
				);

				console.log("\nFile types:");
				Object.entries(stats.fileTypes).forEach(([ext, count]) => {
					console.log(`- ${ext}: ${count} files`);
				});

				if (stats.newestFile) {
					console.log(`\nNewest file: ${stats.newestFile}`);
				}

				if (stats.oldestFile) {
					console.log(`Oldest file: ${stats.oldestFile}`);
				}
			} catch (error) {
				console.error(chalk.red("Error getting insertion stats:"), error);
			}
		});
}

/**
 * Prompt user to select a data type
 * @returns Selected data type
 */
async function promptForDataType(): Promise<keyof DataTypeConfig | null> {
	const { dataType } = await inquirer.prompt([
		{
			type: "list",
			name: "dataType",
			message: "Select data type:",
			choices: [
				{ name: "Testimonies", value: "testimonies" },
				{ name: "Events", value: "events" },
				{ name: "Personnel", value: "personnel" },
				{ name: "Organizations", value: "organizations" },
				{ name: "Artifacts", value: "artifacts" },
			],
		},
	]);

	return dataType;
}

/**
 * Prompt user to select files from a bucket
 * @param dataType Data type
 * @param bucketStage Bucket stage
 * @returns Selected file names
 */
async function promptForFiles(
	dataType: keyof DataTypeConfig,
	bucketStage: "processing" | "review" | "insertion",
): Promise<string[]> {
	// Get files in the bucket
	const files = await fileManager.listFiles(dataType, bucketStage);

	if (files.length === 0) {
		console.log(
			chalk.yellow(`No files found in ${bucketStage} bucket for ${dataType}`),
		);
		return [];
	}

	// Create choices for inquirer
	const choices = files.map((file) => ({
		name: `${file.name} (${formatFileSize(file.size)}, ${new Date(file.modifiedAt).toLocaleString()})`,
		value: file.name,
	}));

	// Add Select All option
	choices.unshift({
		name: "Select All",
		value: "ALL",
	});

	// Prompt user to select files
	const { selectedFiles } = await inquirer.prompt([
		{
			type: "checkbox",
			name: "selectedFiles",
			message: `Select files from ${bucketStage} bucket for ${dataType}:`,
			choices,
		},
	]);

	// Handle Select All option
	if (selectedFiles.includes("ALL")) {
		return files.map((file) => file.name);
	}

	return selectedFiles;
}

/**
 * Batch insert a file into Xata
 * @param dataType Data type
 * @param fileName File name
 * @param options Insertion options
 * @returns Promise that resolves when insertion is complete
 */
async function batchInsertFile(
	dataType: keyof DataTypeConfig,
	fileName: string,
	options: {
		batchSize: number;
		force?: boolean;
		update?: boolean;
	},
): Promise<void> {
	const spinner = ora(`Batch inserting ${fileName}...`).start();

	try {
		// Read file content
		const content = await fileManager.readFile(dataType, "insertion", fileName);

		// Read metadata
		const metadata = await readMetadata(dataType, "insertion", fileName);

		// Parse content based on file type
		let records: any[] = [];

		if (fileName.endsWith(".json")) {
			// Parse JSON file
			records = JSON.parse(content);
			if (!Array.isArray(records)) {
				// If the JSON is an object, not an array, convert it to an array
				records = [records];
			}
		} else if (fileName.endsWith(".md") || fileName.endsWith(".txt")) {
			// For markdown or text files, we might need more complex parsing
			// For now, just create a single record with the content
			records = [
				{
					title: fileName.replace(/\.[^/.]+$/, ""),
					content: content,
					summary: metadata.summary || content.substring(0, 200),
				},
			];
		} else {
			// Unsupported file type
			spinner.fail(`Unsupported file type for ${fileName}`);
			return;
		}

		// Update status
		spinner.text = `Batch inserting ${fileName} (${records.length} records)...`;

		// Target table from metadata
		const targetTable = metadata.targetTable || dataType;

		// Insert records in batches
		const batchSize = options.batchSize || 10;
		let inserted = 0;
		let failed = 0;

		// Process in batches
		for (let i = 0; i < records.length; i += batchSize) {
			const batch = records.slice(i, i + batchSize);
			spinner.text = `Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${i} of ${records.length})...`;

			try {
				// Insert batch
				const result = await xataClient.insertRecords(targetTable, batch, {
					skipDuplicates: !options.force,
					updateExisting: options.update,
					onProgress: (inserted, total) => {
						spinner.text = `Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${i + inserted} of ${records.length})...`;
					},
				});

				// Update counters
				inserted += result.inserted;
				failed += result.failed;

				// Log errors
				if (result.errors.length > 0) {
					console.warn(
						chalk.yellow(
							`Batch ${Math.floor(i / batchSize) + 1} had ${result.errors.length} errors`,
						),
					);
				}
			} catch (error) {
				console.error(
					chalk.red(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`),
					error,
				);
				failed += batch.length;
			}
		}

		// Done
		if (failed === 0) {
			spinner.succeed(
				`Successfully inserted ${inserted} records from ${fileName}`,
			);
		} else {
			spinner.warn(
				`Inserted ${inserted} records from ${fileName}, with ${failed} failures`,
			);
		}

		// If all records were successfully inserted, update metadata
		if (inserted === records.length) {
			try {
				// Move file to a completed/archived directory if necessary
				// For now, just updating metadata status
				const updatedMetadata = { ...metadata, status: "inserted" };
				await fileManager.writeJsonFile(
					dataType,
					"insertion",
					`${fileName}.meta.json`,
					updatedMetadata,
				);
			} catch (error) {
				console.warn(
					chalk.yellow(`Failed to update metadata for ${fileName}`),
					error,
				);
			}
		}
	} catch (error) {
		spinner.fail(
			`Failed to batch insert ${fileName}: ${(error as Error).message}`,
		);
		throw error;
	}
}

/**
 * Bulk insert a file into Xata
 * @param dataType Data type
 * @param fileName File name
 * @param options Insertion options
 * @returns Promise that resolves when insertion is complete
 */
async function bulkInsertFile(
	dataType: keyof DataTypeConfig,
	fileName: string,
	options: {
		force?: boolean;
		update?: boolean;
	},
): Promise<void> {
	const spinner = ora(`Bulk inserting ${fileName}...`).start();

	try {
		// Read file content
		const content = await fileManager.readFile(dataType, "insertion", fileName);

		// Read metadata
		const metadata = await readMetadata(dataType, "insertion", fileName);

		// Parse content based on file type
		let records: any[] = [];

		if (fileName.endsWith(".json")) {
			// Parse JSON file
			records = JSON.parse(content);
			if (!Array.isArray(records)) {
				// If the JSON is an object, not an array, convert it to an array
				records = [records];
			}
		} else if (fileName.endsWith(".md") || fileName.endsWith(".txt")) {
			// For markdown or text files, we might need more complex parsing
			// For now, just create a single record with the content
			records = [
				{
					title: fileName.replace(/\.[^/.]+$/, ""),
					content: content,
					summary: metadata.summary || content.substring(0, 200),
				},
			];
		} else {
			// Unsupported file type
			spinner.fail(`Unsupported file type for ${fileName}`);
			return;
		}

		// Update status
		spinner.text = `Bulk inserting ${fileName} (${records.length} records)...`;

		// Target table from metadata
		const targetTable = metadata.targetTable || dataType;

		// Insert all records at once
		try {
			const result = await xataClient.insertRecords(targetTable, records, {
				skipDuplicates: !options.force,
				updateExisting: options.update,
				onProgress: (inserted, total) => {
					spinner.text = `Inserting records (${inserted} of ${total})...`;
				},
			});

			// Done
			if (result.failed === 0) {
				spinner.succeed(
					`Successfully inserted ${result.inserted} records from ${fileName}`,
				);
			} else {
				spinner.warn(
					`Inserted ${result.inserted} records from ${fileName}, with ${result.failed} failures`,
				);
			}

			// If all records were successfully inserted, update metadata
			if (result.inserted === records.length) {
				try {
					// Move file to a completed/archived directory if necessary
					// For now, just updating metadata status
					const updatedMetadata = { ...metadata, status: "inserted" };
					await fileManager.writeJsonFile(
						dataType,
						"insertion",
						`${fileName}.meta.json`,
						updatedMetadata,
					);
				} catch (error) {
					console.warn(
						chalk.yellow(`Failed to update metadata for ${fileName}`),
						error,
					);
				}
			}
		} catch (error) {
			spinner.fail(`Error bulk inserting records: ${(error as Error).message}`);
			throw error;
		}
	} catch (error) {
		spinner.fail(
			`Failed to bulk insert ${fileName}: ${(error as Error).message}`,
		);
		throw error;
	}
}

/**
 * Format file size for display
 * @param bytes Size in bytes
 * @returns Formatted size string
 */
function formatFileSize(bytes: number): string {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Insert files from the insertion bucket into the database
 * @param options Insertion options
 */
async function insertFiles(options: InsertionOptions): Promise<void> {
	// Get data type
	const dataType = options.type;

	console.log(chalk.blue("===== Database Insertion ====="));

	// Show spinner
	const spinner = ora(`Finding files to insert for ${dataType}...`).start();

	// Determine files to insert
	let filesToInsert: string[] = [];

	if (options.file) {
		// Single file
		const filePath = path.join(
			fileManager.getBucketPath(dataType, "insertion"),
			options.file,
		);

		if (!fs.existsSync(filePath)) {
			spinner.fail(`File not found: ${options.file}`);
			return;
		}

		filesToInsert = [options.file];
	} else if (options.all) {
		// All files in insertion bucket
		const files = await fileManager.listFiles(
			fileManager.getBucketPath(dataType, "insertion"),
		);
		filesToInsert = files.filter((f) => !f.isDirectory).map((f) => f.name);
	} else {
		// Prompt for files to insert
		const files = await fileManager.listFiles(
			fileManager.getBucketPath(dataType, "insertion"),
		);
		const fileNames = files.filter((f) => !f.isDirectory).map((f) => f.name);

		if (fileNames.length === 0) {
			spinner.fail(`No files found in insertion bucket for ${dataType}`);
			return;
		}

		// Prompt for file selection
		spinner.stop();

		const { selectedFiles } = await inquirer.prompt([
			{
				type: "checkbox",
				name: "selectedFiles",
				message: `Select files from insertion bucket to insert into the database:`,
				choices: [
					{ name: "Select All", value: "ALL" },
					...fileNames.map((name) => ({ name, value: name })),
				],
			},
		]);

		if (selectedFiles.includes("ALL")) {
			filesToInsert = fileNames;
		} else {
			filesToInsert = selectedFiles;
		}

		if (filesToInsert.length === 0) {
			console.log(chalk.yellow("No files selected for insertion"));
			return;
		}

		spinner.start(`Preparing to insert ${filesToInsert.length} files...`);
	}

	spinner.succeed(
		`Found ${filesToInsert.length} files to insert for ${dataType}`,
	);

	if (filesToInsert.length === 0) {
		console.log(
			chalk.yellow(`No files found in insertion bucket for ${dataType}`),
		);
		return;
	}

	// Check if Xata is configured
	try {
		const xataClient = getXataClient();
	} catch (error) {
		console.error(chalk.red("Xata client not configured:"), error);
		console.log(
			chalk.yellow(
				"Please configure the XATA_API_KEY environment variable and try again",
			),
		);
		return;
	}

	// Confirm insertion
	if (!options.dryRun) {
		const { confirm } = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirm",
				message: `Are you sure you want to insert ${filesToInsert.length} files into the ${dataType} database table?`,
				default: false,
			},
		]);

		if (!confirm) {
			console.log(chalk.yellow("Insertion cancelled"));
			return;
		}
	}

	// Process each file
	let inserted = 0;
	let skipped = 0;
	let failed = 0;

	console.log(chalk.blue("\nInserting files:"));

	for (const fileName of filesToInsert) {
		const insertSpinner = ora(`Inserting ${fileName}...`).start();

		try {
			const filePath = path.join(
				fileManager.getBucketPath(dataType, "insertion"),
				fileName,
			);

			// Read file content
			const content = fs.readFileSync(filePath, "utf-8");

			// Read metadata
			const metadataPath = readMetadata.getMetadataFilePath(filePath);
			let fileMetadata: readMetadata.FileMetadata | null = null;

			if (fs.existsSync(metadataPath)) {
				fileMetadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
			}

			if (options.dryRun) {
				// In dry-run mode, just show what would be inserted
				insertSpinner.info(
					`[DRY RUN] Would insert ${fileName} (${fileManager.formatFileSize(fs.statSync(filePath).size)})`,
				);

				if (options.verbose) {
					console.log("\nFile metadata:");
					console.log(JSON.stringify(fileMetadata, null, 2));
					console.log("\nContent preview:");
					console.log(
						content.slice(0, 200) + (content.length > 200 ? "..." : ""),
					);
				}

				skipped++;
				continue;
			}

			// Actually insert the file
			const result = await insertFileToDatabase(
				dataType,
				fileName,
				content,
				fileMetadata,
			);

			if (result.success) {
				insertSpinner.succeed(
					`Inserted ${fileName} (${result.recordsInserted} records)`,
				);
				inserted++;

				// Update metadata with insertion info
				if (fileMetadata) {
					fileMetadata.insertedAt = new Date().toISOString();
					fileMetadata.insertedRecords = result.recordsInserted;
					fileMetadata.insertedIds = result.recordIds;
					fileMetadata.status = "inserted";

					fs.writeFileSync(metadataPath, JSON.stringify(fileMetadata, null, 2));
				}

				// Move file to a completed folder or archive
				const archivePath = path.join(
					fileManager.getBucketPath(dataType, "logs"),
					"inserted",
				);
				fs.mkdirSync(archivePath, { recursive: true });

				const archiveFileName = `${path.parse(fileName).name}-${Date.now()}${path.parse(fileName).ext}`;
				const archiveFilePath = path.join(archivePath, archiveFileName);

				fs.copyFileSync(filePath, archiveFilePath);

				// Copy metadata file to archive
				if (fs.existsSync(metadataPath)) {
					fs.copyFileSync(
						metadataPath,
						path.join(archivePath, `${archiveFileName}.metadata.json`),
					);
				}

				// Optionally remove the original after successful insertion
				if (options.verbose) {
					console.log(`Archived ${fileName} to ${archiveFilePath}`);
				}
			} else {
				insertSpinner.fail(`Failed to insert ${fileName}: ${result.error}`);
				failed++;
			}
		} catch (error) {
			insertSpinner.fail(
				`Error processing ${fileName}: ${(error as Error).message}`,
			);
			failed++;
		}
	}

	// Print summary
	console.log(chalk.blue("\n===== Insertion Summary ====="));
	console.log(chalk.green(`Inserted: ${inserted}`));
	console.log(chalk.yellow(`Skipped: ${skipped}`));
	console.log(chalk.red(`Failed: ${failed}`));
}

/**
 * Insert a file into the database
 * @param dataType The type of data
 * @param fileName The file name
 * @param content The file content
 * @param fileMetadata Optional metadata
 * @returns Result of the insertion
 */
async function insertFileToDatabase(
	dataType: keyof DataTypeConfig,
	fileName: string,
	content: string,
	fileMetadata: readMetadata.FileMetadata | null,
): Promise<{
	success: boolean;
	recordsInserted?: number;
	recordIds?: string[];
	error?: string;
}> {
	try {
		const xata = getXataClient();

		// Map dataType to Xata table
		const table = mapDataTypeToTable(dataType);

		// Parse content based on file type
		const extension = path.extname(fileName).toLowerCase();
		let records: Record<string, any>[] = [];

		if (extension === ".json") {
			records = parseJSONContent(content, dataType);
		} else if (extension === ".csv") {
			records = parseCSVContent(content, dataType);
		} else if (extension === ".md" || extension === ".txt") {
			records = parseTextContent(content, dataType, fileMetadata);
		} else {
			return {
				success: false,
				error: `Unsupported file type: ${extension}`,
			};
		}

		if (records.length === 0) {
			return {
				success: false,
				error: "No valid records found in file",
			};
		}

		// Prepare records for insertion
		const preparedRecords = records.map((record) => {
			// Add metadata if needed
			return {
				...record,
				source_file: fileName,
				imported_at: new Date().toISOString(),
				// Add any additional fields needed
			};
		});

		// Insert records in batches
		const batchSize = 50;
		const recordIds: string[] = [];

		for (let i = 0; i < preparedRecords.length; i += batchSize) {
			const batch = preparedRecords.slice(i, i + batchSize);

			// Insert batch into Xata
			const result = await xata.db[table].createMany(batch);

			// Collect record IDs
			if (result.length > 0) {
				recordIds.push(...result.map((r) => r.id));
			}
		}

		return {
			success: true,
			recordsInserted: preparedRecords.length,
			recordIds,
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message,
		};
	}
}

/**
 * Parse JSON content into records
 * @param content The JSON content
 * @param dataType The data type
 * @returns Array of records
 */
function parseJSONContent(
	content: string,
	dataType: keyof DataTypeConfig,
): Record<string, any>[] {
	try {
		const data = JSON.parse(content);

		// If it's an array, return it
		if (Array.isArray(data)) {
			return data;
		}

		// If it's a single record, wrap it in an array
		return [data];
	} catch (error) {
		throw new Error(`Failed to parse JSON: ${(error as Error).message}`);
	}
}

/**
 * Parse CSV content into records
 * @param content The CSV content
 * @param dataType The data type
 * @returns Array of records
 */
function parseCSVContent(
	content: string,
	dataType: keyof DataTypeConfig,
): Record<string, any>[] {
	try {
		// Simple CSV parsing (for a production app, use a CSV library)
		const lines = content.split("\n").filter((line) => line.trim().length > 0);

		if (lines.length < 2) {
			throw new Error(
				"CSV file must have a header row and at least one data row",
			);
		}

		// Parse header
		const headers = lines[0].split(",").map((h) => h.trim());

		// Parse data rows
		const records: Record<string, any>[] = [];

		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(",").map((v) => v.trim());

			// Skip if row doesn't match header length
			if (values.length !== headers.length) {
				continue;
			}

			const record: Record<string, any> = {};

			// Map values to headers
			headers.forEach((header, index) => {
				record[header] = values[index];
			});

			records.push(record);
		}

		return records;
	} catch (error) {
		throw new Error(`Failed to parse CSV: ${(error as Error).message}`);
	}
}

/**
 * Parse text content into records
 * @param content The text content
 * @param dataType The data type
 * @param fileMetadata Optional metadata
 * @returns Array of records
 */
function parseTextContent(
	content: string,
	dataType: keyof DataTypeConfig,
	fileMetadata: readMetadata.FileMetadata | null,
): Record<string, any>[] {
	// Very simple text parsing - for testimonies, create one record
	// In a real app, this would be more sophisticated
	const record: Record<string, any> = {
		content,
		title: fileMetadata?.fileName || "Unknown",
	};

	// Add metadata if available
	if (fileMetadata) {
		// Extract YAML/Markdown frontmatter if present
		if (content.startsWith("---")) {
			const frontmatterEnd = content.indexOf("---", 3);

			if (frontmatterEnd > 0) {
				const frontmatter = content.substring(3, frontmatterEnd).trim();
				const lines = frontmatter.split("\n");

				for (const line of lines) {
					const [key, value] = line.split(":").map((part) => part.trim());

					if (key && value) {
						record[key] = value;
					}
				}

				// Remove frontmatter from content
				record.content = content.substring(frontmatterEnd + 3).trim();
			}
		}

		// Add additional metadata
		if (fileMetadata.contentSummary) {
			record.summary = fileMetadata.contentSummary;
		}

		if (fileMetadata.tags) {
			record.tags = fileMetadata.tags;
		}

		if (fileMetadata.location) {
			record.location = fileMetadata.location;
		}

		if (fileMetadata.date) {
			record.date = fileMetadata.date;
		}
	}

	return [record];
}

/**
 * Map data type to Xata table name
 * @param dataType The data type
 * @returns The table name
 */
function mapDataTypeToTable(dataType: keyof DataTypeConfig): string {
	// Simple mapping from data type to table name
	const mapping: Record<string, string> = {
		testimonies: "testimonies",
		events: "events",
		personnel: "personnel",
		organizations: "organizations",
		artifacts: "artifacts",
	};

	return mapping[dataType] || dataType.toString();
}
