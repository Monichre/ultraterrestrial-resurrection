import type { Command } from "commander";
import chalk from "chalk";
import * as inquirer from "inquirer";
import ora from "ora";
import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { getBucketPath, DataTypeConfig, supportedDataTypes } from "../config";
import * as fileManager from "../lib/file-manager";
import * as bucketManager from "../lib/bucketManager";
import * as metadata from "../lib/metadata";
import * as validators from "../lib/validators";
import { aiAssistant } from "../agents/ai-assistant";
import { getXataClient } from "../lib/xata-client";

const execAsync = promisify(exec);

/**
 * Register import commands with Commander
 * @param program The Commander program instance
 */
export default function registerImportCommands(program: Command): void {
	// Main import command with interactive workflow
	program
		.command("import")
		.description("Interactive data import workflow")
		.action(async () => {
			const choices = [
				{
					name: "Prepare events data (merge and validate)",
					value: "prepare-events",
				},
				{
					name: "Test events import (validate against database schema)",
					value: "test-events",
				},
				{ name: "Import events data to Xata", value: "import-events" },
				{
					name: "Full workflow (prepare -> test -> import)",
					value: "full-workflow",
				},
				{ name: "Import UFO Sightings data", value: "import-sightings" },
				{ name: "Back", value: "back" },
			];

			const { action } = await inquirer.prompt([
				{
					type: "list",
					name: "action",
					message: "Select an import operation:",
					choices,
				},
			]);

			switch (action) {
				case "prepare-events":
					await prepareEventsData();
					break;
				case "test-events":
					await testEventsImport();
					break;
				case "import-events":
					await importEventsData();
					break;
				case "full-workflow":
					await runFullWorkflow();
					break;
				case "import-sightings":
					await importSightingsData();
					break;
				case "back":
					console.log(chalk.blue("Returning to main menu"));
					break;
			}
		});

	// Direct command for preparing events data
	program
		.command("import:prepare-events")
		.description("Prepare events data by merging and validating")
		.action(async () => {
			await prepareEventsData();
		});

	// Direct command for testing events import
	program
		.command("import:test-events")
		.description("Test events import by validating against database schema")
		.action(async () => {
			await testEventsImport();
		});

	// Direct command for importing events data
	program
		.command("import:events")
		.description("Import events data to Xata")
		.option("-f, --force", "Force import even if duplicates are detected")
		.option("-u, --update", "Update existing records if duplicates are found")
		.action(async (options) => {
			await importEventsData(options.force, options.update);
		});

	// Direct command for importing sightings data
	program
		.command("import:sightings")
		.description("Import UFO Sightings data")
		.action(async () => {
			await importSightingsData();
		});

	// Direct command for custom table import
	program
		.command("import:table <table>")
		.description("Import data to any Xata table")
		.option("-f, --file <path>", "Path to JSON file with data to import")
		.option("-s, --stdin", "Read JSON data from stdin instead of a file")
		.option(
			"-d, --dry-run",
			"Validate data without performing the actual import",
		)
		.option("--force", "Force import even if duplicates are detected")
		.option("--update", "Update existing records if duplicates are found")
		.option(
			"--batch-size <size>",
			"Number of records to insert in each batch",
			"50",
		)
		.option(
			"--id-field <field>",
			"Field to use as primary ID (default: 'id')",
			"id",
		)
		.option("--quiet", "Suppress verbose output", false)
		.action(async (table, options) => {
			await importToTable(table, options);
		});
}

/**
 * Prepare events data
 */
async function prepareEventsData(): Promise<boolean> {
	console.log(chalk.blue("=== Preparing Events Data ==="));

	const spinner = ora("Processing JSON event files...").start();

	try {
		const projectDir = path.resolve(__dirname, "../../..");
		const dataImportDir = path.join(
			projectDir,
			"application/scripts/data-import",
		);

		// Execute the preparation script
		await execAsync(
			`cd ${projectDir} && bun run ${path.join(dataImportDir, "events/prepare-events.ts")}`,
		);

		spinner.succeed("Events preparation complete");
		console.log(
			chalk.green(
				`Combined events file saved to: ${path.join(dataImportDir, "output/events.json")}`,
			),
		);

		return true;
	} catch (error) {
		spinner.fail(
			`Error: Failed to prepare events data: ${(error as Error).message}`,
		);
		return false;
	}
}

/**
 * Test events import
 */
async function testEventsImport(): Promise<boolean> {
	console.log(chalk.blue("=== Testing Events Import ==="));

	const spinner = ora("Running validation and test import...").start();

	try {
		const projectDir = path.resolve(__dirname, "../../..");
		const dataImportDir = path.join(
			projectDir,
			"application/scripts/data-import",
		);

		// Run the test import script
		await execAsync(
			`cd ${projectDir} && bun run ${path.join(dataImportDir, "events/test-events-import.ts")}`,
		);

		// Check if validation report exists
		const validationReportPath = path.join(
			dataImportDir,
			"output/validation-report.json",
		);
		if (fs.existsSync(validationReportPath)) {
			spinner.succeed("Test import validation complete");
			console.log(
				chalk.green(
					`Please review the validation report at: ${validationReportPath}`,
				),
			);
		} else {
			spinner.warn("Validation completed, but validation report not found");
		}

		return true;
	} catch (error) {
		spinner.fail(`Error: Test import failed: ${(error as Error).message}`);
		return false;
	}
}

/**
 * Import events data to Xata
 */
async function importEventsData(
	force = false,
	update = false,
): Promise<boolean> {
	console.log(chalk.blue("=== UFO Intelligence Data Import ==="));

	// Check if events.json exists
	const projectDir = path.resolve(__dirname, "../../..");
	const dataImportDir = path.join(
		projectDir,
		"application/scripts/data-import",
	);
	const eventsJsonPath = path.join(dataImportDir, "output/events.json");

	if (!fs.existsSync(eventsJsonPath)) {
		console.log(
			chalk.red("Error: events.json not found. Please prepare the data first."),
		);
		return false;
	}

	console.log(chalk.blue("Step 1: Validating events data..."));

	// Run validation/test first
	const validationResult = await testEventsImport();

	if (!validationResult) {
		console.log(chalk.red("Validation failed. Fix issues before proceeding."));
		return false;
	}

	// If force and update are not set via flags, prompt for them
	if (!force || !update) {
		const answers = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirmImport",
				message: "Would you like to proceed with the import?",
				default: true,
			},
		]);

		if (!answers.confirmImport) {
			console.log(chalk.yellow("Import cancelled."));
			return false;
		}

		if (!force) {
			const { forceOption } = await inquirer.prompt([
				{
					type: "confirm",
					name: "forceOption",
					message: "Force import even if duplicates are detected?",
					default: false,
				},
			]);
			force = forceOption;
		}

		if (!update) {
			const { updateOption } = await inquirer.prompt([
				{
					type: "confirm",
					name: "updateOption",
					message: "Update existing records if duplicates are found?",
					default: false,
				},
			]);
			update = updateOption;
		}
	}

	// Build command arguments
	const args = [];
	if (force) args.push("--force");
	if (update) args.push("--update");

	console.log(chalk.blue("Step 3: Importing events data to Xata database..."));

	const spinner = ora("Running TypeScript import script...").start();

	try {
		// Run TypeScript import script with Bun
		await execAsync(
			`cd ${projectDir} && bun run ${path.join(dataImportDir, "events/import-events-to-xata.ts")} ${args.join(" ")}`,
		);

		spinner.succeed("Events import process complete");

		// Check if skipped events report exists
		const skippedEventsReportPath = path.join(
			dataImportDir,
			"events/skipped-events-report.json",
		);
		if (fs.existsSync(skippedEventsReportPath)) {
			console.log(
				chalk.yellow(
					`Skipped events report available at: ${skippedEventsReportPath}`,
				),
			);
		}

		return true;
	} catch (error) {
		spinner.fail(
			`Error: Failed to import events data to Xata: ${(error as Error).message}`,
		);
		return false;
	}
}

/**
 * Import sightings data
 */
async function importSightingsData(): Promise<boolean> {
	console.log(chalk.blue("=== UFO Sightings Data Import ==="));

	// Check if sightings data exists
	const projectDir = path.resolve(__dirname, "../../..");
	const sightingsFile = path.join(
		projectDir,
		"application/scripts/data-import/output/transformed-sightings.json",
	);

	if (!fs.existsSync(sightingsFile)) {
		console.log(
			chalk.red(`Error: Sightings data file not found at ${sightingsFile}`),
		);
		return false;
	}

	console.log(chalk.blue("Step 1: Sightings data found."));
	console.log(chalk.blue(`  - JSON data: ${sightingsFile}`));

	const { reviewData } = await inquirer.prompt([
		{
			type: "confirm",
			name: "reviewData",
			message:
				"Would you like to review the sightings data before importing to Xata?",
			default: false,
		},
	]);

	if (reviewData) {
		// Show a sample of the data
		const spinner = ora("Loading data sample...").start();
		try {
			const { stdout } = await execAsync(`head -n 30 "${sightingsFile}"`);
			spinner.stop();

			console.log(
				chalk.blue("\nSample of sightings data (first 3 sightings):"),
			);
			console.log(stdout);

			await inquirer.prompt([
				{
					type: "input",
					name: "continue",
					message: "Press Enter to continue with import or Ctrl+C to abort...",
				},
			]);
		} catch (error) {
			spinner.fail(`Error reading data sample: ${(error as Error).message}`);
		}
	}

	console.log(
		chalk.blue("\nStep 2: Importing sightings data to Xata database..."),
	);

	const spinner = ora("Running import script...").start();

	try {
		// Use npm script to run TypeScript import script
		await execAsync(`cd ${projectDir} && npm run import:sightings`);

		spinner.succeed("Sightings import process complete");
		console.log(
			chalk.green(
				"Check the logs above for details on imported, skipped, and failed entries.",
			),
		);

		return true;
	} catch (error) {
		spinner.fail(
			`Error: Failed to import sightings data to Xata: ${(error as Error).message}`,
		);
		return false;
	}
}

/**
 * Run full workflow: prepare -> test -> import
 */
async function runFullWorkflow(): Promise<boolean> {
	console.log(chalk.blue("=== Running Full Events Import Workflow ==="));

	// Step 1: Prepare events data
	const prepareResult = await prepareEventsData();
	if (!prepareResult) {
		console.log(chalk.red("Preparation step failed. Workflow aborted."));
		return false;
	}

	// Step 2: Test events import
	const testResult = await testEventsImport();
	if (!testResult) {
		console.log(chalk.red("Testing step failed. Workflow aborted."));
		return false;
	}

	// Step 3: Import events data
	return await importEventsData();
}

/**
 * Import data to a specific Xata table
 */
async function importToTable(table: string, options: any): Promise<boolean> {
	console.log(chalk.blue(`=== Importing Data to Xata Table: ${table} ===`));

	// Read data from file or stdin
	let data;
	const spinner = ora(`Reading data...`).start();

	try {
		// Check if we're reading from stdin
		if (options.stdin) {
			// Read from stdin
			const stdinData = await readFromStdin();
			data = JSON.parse(stdinData);
			spinner.succeed(`Successfully read data from stdin`);
		} else if (options.file) {
			// Read from file
			const filePath = path.resolve(options.file);
			if (!fs.existsSync(filePath)) {
				spinner.fail(`Error: File not found at ${filePath}`);
				return false;
			}

			const fileContent = fs.readFileSync(filePath, "utf8");
			data = JSON.parse(fileContent);
			spinner.succeed(`Successfully read data from ${path.basename(filePath)}`);
		} else {
			spinner.fail("Error: Either --file or --stdin option is required");
			return false;
		}

		if (!Array.isArray(data)) {
			// Check if it's a single object and convert to array
			if (typeof data === "object" && data !== null) {
				data = [data];
				console.log(
					chalk.yellow("Input was a single object. Converting to array."),
				);
			} else {
				spinner.fail(
					"Error: Input must contain a JSON array of objects or a single object",
				);
				return false;
			}
		}

		if (!options.quiet) {
			console.log(chalk.blue(`\nFound ${data.length} records to import`));
		}
	} catch (error) {
		spinner.fail(`Error reading or parsing data: ${(error as Error).message}`);
		return false;
	}

	// Display sample data and confirmation (unless quiet mode)
	if (!options.quiet) {
		console.log(chalk.blue("\nData Sample (first 2 records):"));
		console.log(JSON.stringify(data.slice(0, 2), null, 2));
	}

	// If it's a dry run, exit here
	if (options.dryRun) {
		console.log(chalk.yellow("\nDry run completed. No data was imported."));
		return true;
	}

	// Confirm import (unless quiet mode)
	if (!options.quiet) {
		const { confirmImport } = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirmImport",
				message: `Import ${data.length} records to the "${table}" table?`,
				default: false,
			},
		]);

		if (!confirmImport) {
			console.log(chalk.yellow("Import cancelled."));
			return false;
		}
	}

	// Import data
	const importSpinner = ora(`Importing data to ${table}...`).start();
	const projectDir = path.resolve(__dirname, "../../..");

	try {
		// Create temporary script to handle the import
		const tempScriptDir = path.join(projectDir, "temp");
		if (!fs.existsSync(tempScriptDir)) {
			fs.mkdirSync(tempScriptDir, { recursive: true });
		}

		const tempScriptPath = path.join(tempScriptDir, "temp-import.ts");
		const batchSize = Number.parseInt(options.batchSize, 10) || 50;

		// Generate a temporary script for this import
		const scriptContent = `
import { getXataClient } from "@/xata";

// Get Xata client
const xata = getXataClient();

// Read data from file
const data = ${JSON.stringify(data)};

async function importData() {
	console.log(\`Starting import of \${data.length} records to table: ${table}\`);
	
	// Track progress
	let imported = 0;
	let failed = 0;
	let skipped = 0;
	const errors = [];
	
	// Process in batches
	const batchSize = ${batchSize};
	const batches = Math.ceil(data.length / batchSize);
	
	for (let i = 0; i < batches; i++) {
		const start = i * batchSize;
		const end = Math.min(start + batchSize, data.length);
		const batch = data.slice(start, end);
		
		console.log(\`Processing batch \${i + 1}/\${batches} (\${batch.length} records)\`);
		
		try {
			// Use bulk insert or transaction based on options
			const options = {
				${options.force ? 'ifExists: "create",' : ""}
				${options.update ? 'ifExists: "update",' : ""}
				${options.idField !== "id" ? `primaryKey: "${options.idField}",` : ""}
			};
			
			const result = await xata.db.${table}.bulkCreate(batch, options);
			
			// Process results
			imported += result.filter(r => r.operation === "insert" || r.operation === "update").length;
			skipped += result.filter(r => r.operation === "skip").length;
			
			// Log errors
			const batchErrors = result.filter(r => r.error);
			if (batchErrors.length > 0) {
				failed += batchErrors.length;
				for (const item of batchErrors) {
					errors.push({
						record: item.record,
						error: item.error
					});
				}
			}
		} catch (error) {
			console.error(\`Error processing batch \${i + 1}: \${error.message}\`);
			failed += batch.length;
		}
	}
	
	// Print final results
	console.log("\\n=== Import Results ===");
	console.log(\`Total Records: \${data.length}\`);
	console.log(\`Imported: \${imported}\`);
	console.log(\`Skipped: \${skipped}\`);
	console.log(\`Failed: \${failed}\`);
	
	// Save errors to file if any
	if (errors.length > 0) {
		const fs = require('fs');
		const errorFile = 'import-errors.json';
		fs.writeFileSync(errorFile, JSON.stringify(errors, null, 2));
		console.log(\`\\nErrors saved to: \${errorFile}\`);
	}
	
	return {
		total: data.length,
		imported,
		skipped,
		failed
	};
}

// Run the import
importData()
	.then(results => {
		console.log("\\nImport completed successfully");
		process.exit(0);
	})
	.catch(error => {
		console.error(\`Import failed: \${error.message}\`);
		process.exit(1);
	});
`;

		fs.writeFileSync(tempScriptPath, scriptContent);

		// Execute the script
		await execAsync(`cd ${projectDir} && bun run ${tempScriptPath}`);

		importSpinner.succeed("Import process completed");
		return true;
	} catch (error) {
		importSpinner.fail(`Error importing data: ${(error as Error).message}`);
		return false;
	}
}

/**
 * Read data from stdin
 */
function readFromStdin(): Promise<string> {
	return new Promise((resolve) => {
		let data = "";
		process.stdin.on("readable", () => {
			let chunk;
			while ((chunk = process.stdin.read()) !== null) {
				data += chunk;
			}
		});

		process.stdin.on("end", () => {
			resolve(data);
		});
	});
}
