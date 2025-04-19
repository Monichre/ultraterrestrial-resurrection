import type { Command } from "commander";
import chalk from "chalk";
import * as path from "path";
import * as inquirer from "inquirer";
import ora from "ora";
import * as fs from "fs";
import * as glob from "glob";
import type { DataTypeConfig } from "../config";
import {
	BucketType,
	createMetadata,
	writeMetadata,
	moveFile,
	getModelBucketPath,
} from "../lib/bucketManager";
import { getModelNames } from "../lib/modelRegistry";

/**
 * Register onboarding commands with Commander
 * @param program The Commander program instance
 */
export default function registerOnboardingCommands(program: Command): void {
	// Onboard:discover command - Discover new files in source directories and add to backlog
	program
		.command("onboard:discover")
		.description("Discover new files in source directories and add to backlog")
		.option(
			"-t, --type <type>",
			"Type of data (testimonies, events, personnel, etc.)",
		)
		.option("-s, --source <source>", "Source directory path to scan")
		.option(
			"-p, --pattern <pattern>",
			'File pattern to match (e.g., "*.md", "*.json")',
		)
		.option("-i, --interactive", "Run in interactive mode for file selection")
		.action(async (options) => {
			try {
				// If no type is provided, prompt the user
				const dataType = options.type || (await promptForDataType());
				if (!dataType) return;

				// Get source directory
				const sourceDir = options.source || (await promptForSourceDirectory());
				if (!sourceDir) {
					console.log(chalk.yellow("No source directory provided"));
					return;
				}

				// Default pattern is all files
				const pattern = options.pattern || "*";

				// Show spinner
				const spinner = ora(
					`Discovering ${pattern} files in ${sourceDir} for ${dataType}...`,
				).start();

				// Find files
				const files = await findSourceFiles(sourceDir, pattern);
				spinner.succeed(
					`Found ${files.length} files in ${sourceDir} matching "${pattern}"`,
				);

				if (files.length === 0) {
					console.log(
						chalk.yellow(
							`No files found in ${sourceDir} matching pattern "${pattern}"`,
						),
					);
					return;
				}

				let filesToProcess = files;

				// If interactive mode is enabled, let user select files
				if (options.interactive) {
					const { selectedFiles } = await inquirer.prompt([
						{
							type: "checkbox",
							name: "selectedFiles",
							message: "Select files to onboard:",
							choices: files.map((file) => ({
								name: `${file.name} (${formatFileSize(file.size)})`,
								value: file.path,
								checked: true,
							})),
						},
					]);

					filesToProcess = files.filter((file) =>
						selectedFiles.includes(file.path),
					);
					console.log(
						chalk.blue(
							`Selected ${filesToProcess.length} files for onboarding`,
						),
					);
				}

				// Process selected files
				for (const file of filesToProcess) {
					const spinnerFile = ora(`Onboarding ${file.name}...`).start();

					try {
						// Read file content
						const content = fs.readFileSync(file.path, "utf8");

						// Create target path
						const targetPath = path.join(
							getModelBucketPath(dataType.toString(), BucketType.BACKLOG),
							file.name,
						);

						// Write file to backlog
						fs.mkdirSync(path.dirname(targetPath), { recursive: true });
						fs.writeFileSync(targetPath, content);

						// Create metadata
						const metadata = createMetadata(
							dataType.toString(),
							file.name,
							file.path,
						);

						// Add additional metadata
						metadata.status = "new";
						metadata.targetTable = dataType.toString();

						// Write metadata file
						writeMetadata(targetPath, metadata);

						spinnerFile.succeed(`Onboarded ${file.name} to backlog`);
					} catch (error) {
						spinnerFile.fail(
							`Failed to onboard ${file.name}: ${(error as Error).message}`,
						);
					}
				}

				console.log(
					chalk.green(
						`Onboarding complete. ${filesToProcess.length} files added to backlog.`,
					),
				);
				console.log(
					chalk.blue(
						`Use 'process:list --type ${dataType}' to see the files in the backlog.`,
					),
				);
			} catch (error) {
				console.error(chalk.red("Error discovering files:"), error);
			}
		});

	// Onboard:process command - Move files from backlog to processing
	program
		.command("onboard:process")
		.description("Move files from backlog to processing stage")
		.option(
			"-t, --type <type>",
			"Type of data (testimonies, events, personnel, etc.)",
		)
		.option("-f, --file <file>", "Specific file to process")
		.option("-i, --interactive", "Run in interactive mode with file selection")
		.action(async (options) => {
			try {
				// If no type is provided, prompt the user
				const dataType = options.type || (await promptForDataType());
				if (!dataType) return;

				// Get files to process
				let filesToProcess: string[] = [];

				if (options.file) {
					// Process specific file
					const backlogPath = getModelBucketPath(
						dataType.toString(),
						BucketType.BACKLOG,
					);
					filesToProcess = [path.join(backlogPath, options.file)];
				} else if (options.interactive) {
					// Interactive mode - let user select files
					filesToProcess = await promptForBucketFiles(
						dataType.toString(),
						BucketType.BACKLOG,
					);
					if (filesToProcess.length === 0) {
						console.log(chalk.yellow("No files selected for processing"));
						return;
					}
				} else {
					// Get all files in backlog
					const backlogPath = getModelBucketPath(
						dataType.toString(),
						BucketType.BACKLOG,
					);
					const files = fs
						.readdirSync(backlogPath)
						.filter((file) => !file.endsWith(".meta.json"))
						.map((file) => path.join(backlogPath, file));

					filesToProcess = files;
				}

				console.log(
					chalk.blue(
						`Moving ${filesToProcess.length} files from backlog to processing...`,
					),
				);

				// Process each file
				for (const filePath of filesToProcess) {
					const fileName = path.basename(filePath);
					const spinner = ora(`Processing ${fileName}...`).start();

					try {
						// Move file from backlog to processing
						await moveFile(
							filePath,
							dataType.toString(),
							BucketType.BACKLOG,
							BucketType.PROCESSING,
							{
								status: "processing",
								processingHistory: [
									{
										stage: "moved_to_processing",
										timestamp: new Date().toISOString(),
									},
								],
							},
						);

						spinner.succeed(`Moved ${fileName} to processing bucket`);
					} catch (error) {
						spinner.fail(
							`Failed to process ${fileName}: ${(error as Error).message}`,
						);
					}
				}

				console.log(
					chalk.green(
						`Processing complete. ${filesToProcess.length} files moved to processing.`,
					),
				);
				console.log(
					chalk.blue(
						`Use 'process:transform --type ${dataType}' to transform the files.`,
					),
				);
			} catch (error) {
				console.error(chalk.red("Error processing files:"), error);
			}
		});
}

/**
 * Find files in a source directory matching a pattern
 * @param sourceDir Source directory
 * @param pattern File pattern to match
 * @returns Array of file info objects
 */
async function findSourceFiles(
	sourceDir: string,
	pattern: string,
): Promise<Array<{ name: string; path: string; size: number }>> {
	return new Promise((resolve, reject) => {
		const globPattern = path.join(sourceDir, pattern);

		glob(globPattern, (err, matches) => {
			if (err) {
				reject(err);
				return;
			}

			const files = matches
				.filter((filePath) => fs.statSync(filePath).isFile())
				.map((filePath) => ({
					name: path.basename(filePath),
					path: filePath,
					size: fs.statSync(filePath).size,
				}));

			resolve(files);
		});
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
			choices: getModelNames().map((model) => ({
				name: model.charAt(0).toUpperCase() + model.slice(1),
				value: model,
			})),
		},
	]);

	return dataType;
}

/**
 * Prompt user to select a source directory
 * @returns Selected directory path
 */
async function promptForSourceDirectory(): Promise<string | null> {
	const { sourceDir } = await inquirer.prompt([
		{
			type: "input",
			name: "sourceDir",
			message: "Enter source directory path:",
			validate: (input: string) => {
				if (!input) return "Directory path cannot be empty";
				if (!fs.existsSync(input)) return "Directory does not exist";
				if (!fs.statSync(input).isDirectory()) return "Path is not a directory";
				return true;
			},
		},
	]);

	return sourceDir;
}

/**
 * Format file size for display
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024)
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Prompt user to select files from a bucket
 * @param model Data model name
 * @param bucketStage Bucket stage
 * @returns Selected file paths
 */
async function promptForBucketFiles(
	model: string,
	bucketStage: BucketType,
): Promise<string[]> {
	const bucketPath = getModelBucketPath(model, bucketStage);

	if (!fs.existsSync(bucketPath)) {
		console.log(chalk.yellow(`No ${bucketStage} bucket found for ${model}`));
		return [];
	}

	const files = fs
		.readdirSync(bucketPath)
		.filter((file) => !file.endsWith(".meta.json"))
		.map((file) => {
			const filePath = path.join(bucketPath, file);
			const stats = fs.statSync(filePath);
			return {
				name: file,
				path: filePath,
				size: stats.size,
			};
		});

	if (files.length === 0) {
		console.log(
			chalk.yellow(`No files found in ${bucketStage} bucket for ${model}`),
		);
		return [];
	}

	const { selectedFiles } = await inquirer.prompt([
		{
			type: "checkbox",
			name: "selectedFiles",
			message: `Select files from ${bucketStage}:`,
			choices: files.map((file) => ({
				name: `${file.name} (${formatFileSize(file.size)})`,
				value: file.path,
				checked: true,
			})),
		},
	]);

	return selectedFiles;
}
