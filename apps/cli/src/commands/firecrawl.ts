import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import inquirer from "inquirer";
import { execSync, spawn } from "child_process";
import { getBucketPath, DataTypeConfig, supportedDataTypes } from "../config";
import * as fileManager from "../lib/file-manager";

/**
 * Options for the firecrawl command
 */
interface FirecrawlOptions {
	type?: keyof DataTypeConfig;
	url?: string;
	search?: string;
	mode?: "scrape" | "search" | "crawl" | "map";
	output?: string;
	limit?: number;
}

/**
 * Register the firecrawl commands
 * @param program The commander program
 */
export function registerFirecrawlCommand(program: Command): void {
	program
		.command("firecrawl")
		.description("Web scraping functionality using Firecrawl")
		.option("-u, --url <url>", "URL to scrape/crawl")
		.option("-s, --search <terms>", "Search terms for web search")
		.option(
			"-m, --mode <mode>",
			"Mode of operation: scrape, search, crawl, map",
			"scrape",
		)
		.option(
			"-t, --type <type>",
			`Type of data to store results as (${Object.keys(supportedDataTypes).join(", ")})`,
			"testimonies",
		)
		.option("-o, --output <path>", "Output file or directory")
		.option("-l, --limit <number>", "Limit number of results", parseFloat)
		.action(async (options: FirecrawlOptions) => {
			try {
				// Check if firecrawl is installed
				const isInstalled = checkFirecrawlInstallation();

				if (!isInstalled) {
					const { installNow } = await inquirer.prompt([
						{
							type: "confirm",
							name: "installNow",
							message:
								"Firecrawl is not installed. Would you like to install it now?",
							default: true,
						},
					]);

					if (installNow) {
						await installFirecrawl();
					} else {
						console.log(
							chalk.yellow("Firecrawl is required for this command. Exiting."),
						);
						return;
					}
				}

				// Dispatch to appropriate function based on mode
				switch (options.mode) {
					case "scrape":
						await scrapePage(options);
						break;
					case "search":
						await searchWeb(options);
						break;
					case "crawl":
						await crawlWebsite(options);
						break;
					case "map":
						await mapWebsite(options);
						break;
					default:
						console.log(chalk.red(`Invalid mode: ${options.mode}`));
						break;
				}
			} catch (error) {
				console.error(chalk.red("Firecrawl error:"), error);
			}
		});

	program
		.command("firecrawl:setup")
		.description("Setup the Firecrawl tool")
		.action(async () => {
			try {
				await installFirecrawl();
			} catch (error) {
				console.error(chalk.red("Firecrawl setup error:"), error);
			}
		});

	program
		.command("firecrawl:list")
		.description("List scraped files")
		.option(
			"-t, --type <type>",
			`Type of data to list (${Object.keys(supportedDataTypes).join(", ")})`,
			"testimonies",
		)
		.action(async (options) => {
			try {
				const dataType = options.type as keyof DataTypeConfig;
				const bucketPath = path.join(
					getBucketPath(dataType, "processing"),
					"firecrawl",
				);

				// Check if directory exists
				if (!fs.existsSync(bucketPath)) {
					fs.mkdirSync(bucketPath, { recursive: true });
					console.log(chalk.yellow(`No firecrawl data found for ${dataType}.`));
					return;
				}

				// List files
				const files = await fileManager.listFiles(bucketPath);

				if (files.length === 0) {
					console.log(chalk.yellow(`No firecrawl data found for ${dataType}.`));
					return;
				}

				// Display files
				console.log(chalk.blue(`\nFirecrawl data for ${dataType}:`));

				files.forEach((file, index) => {
					console.log(
						`${index + 1}. ${chalk.cyan(file.name)} (${fileManager.formatFileSize(file.size)}) - Modified: ${file.modifiedAt.toLocaleString()}`,
					);
				});

				console.log(
					chalk.blue("\nUse `processing -t <type>` to process these files."),
				);
			} catch (error) {
				console.error(chalk.red("Error listing firecrawl files:"), error);
			}
		});
}

/**
 * Check if Firecrawl is installed
 * @returns True if installed, false otherwise
 */
function checkFirecrawlInstallation(): boolean {
	try {
		// Try to run the firecrawl command
		execSync("firecrawl --version", { stdio: "ignore" });
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Install Firecrawl
 */
async function installFirecrawl(): Promise<void> {
	const spinner = ora("Installing Firecrawl...").start();

	try {
		// Check for installation script
		const setupScript = path.join(
			__dirname,
			"../../scripts/setup_firecrawl.sh",
		);

		if (fs.existsSync(setupScript)) {
			// Make it executable
			fs.chmodSync(setupScript, "755");

			// Run the script
			execSync(setupScript, { stdio: "inherit" });

			spinner.succeed("Firecrawl installed successfully!");
		} else {
			// Fall back to npm install
			execSync("npm install -g firecrawl", { stdio: "inherit" });
			spinner.succeed("Firecrawl installed successfully via npm!");
		}
	} catch (error) {
		spinner.fail("Failed to install Firecrawl");
		console.error(error);
		throw new Error("Firecrawl installation failed");
	}
}

/**
 * Scrape a web page
 * @param options Options for scraping
 */
async function scrapePage(options: FirecrawlOptions): Promise<void> {
	if (!options.url) {
		const { url } = await inquirer.prompt([
			{
				type: "input",
				name: "url",
				message: "Enter the URL to scrape:",
				validate: (input) => (input.trim() !== "" ? true : "URL is required"),
			},
		]);

		options.url = url;
	}

	const spinner = ora(`Scraping ${options.url}...`).start();

	try {
		// Set up output path
		const dataType = options.type || "testimonies";
		const outputDir = path.join(
			getBucketPath(dataType as keyof DataTypeConfig, "processing"),
			"firecrawl",
		);
		fs.mkdirSync(outputDir, { recursive: true });

		// Generate filename from URL
		const urlObj = new URL(options.url);
		const hostname = urlObj.hostname.replace(/\./g, "_");
		const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
		const outputFile =
			options.output || path.join(outputDir, `${hostname}-${timestamp}.md`);

		// Call firecrawl
		const result = execSync(
			`firecrawl scrape --url="${options.url}" --formats=markdown`,
			{ encoding: "utf-8" },
		);

		// Write the result to a file
		fs.writeFileSync(outputFile, result);

		spinner.succeed(`Page scraped successfully and saved to ${outputFile}`);

		// Generate metadata
		try {
			const metadataFile = `${outputFile}.metadata.json`;

			const metadata = {
				source: options.url,
				scraped_at: new Date().toISOString(),
				content_type: "markdown",
				file_size: fs.statSync(outputFile).size,
				status: "needs_processing",
			};

			fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
		} catch (metaError) {
			console.error(
				chalk.yellow("Warning: Failed to write metadata file"),
				metaError,
			);
		}
	} catch (error) {
		spinner.fail("Scraping failed");
		console.error(error);
		throw new Error("Failed to scrape page");
	}
}

/**
 * Search the web using Firecrawl
 * @param options Search options
 */
async function searchWeb(options: FirecrawlOptions): Promise<void> {
	if (!options.search) {
		const { search } = await inquirer.prompt([
			{
				type: "input",
				name: "search",
				message: "Enter search terms:",
				validate: (input) =>
					input.trim() !== "" ? true : "Search terms are required",
			},
		]);

		options.search = search;
	}

	const spinner = ora(`Searching for "${options.search}"...`).start();

	try {
		// Set up output path
		const dataType = options.type || "testimonies";
		const outputDir = path.join(
			getBucketPath(dataType as keyof DataTypeConfig, "processing"),
			"firecrawl",
		);
		fs.mkdirSync(outputDir, { recursive: true });

		// Generate filename
		const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
		const searchTerm = options.search.replace(/\s+/g, "_").slice(0, 30);
		const outputFile =
			options.output ||
			path.join(outputDir, `search-${searchTerm}-${timestamp}.md`);

		// Call firecrawl
		let command = `firecrawl search --query="${options.search}"`;

		if (options.limit) {
			command += ` --limit=${options.limit}`;
		}

		const result = execSync(command, { encoding: "utf-8" });

		// Write the result to a file
		fs.writeFileSync(
			outputFile,
			`# Search Results: ${options.search}\n\n${result}`,
		);

		spinner.succeed(`Search completed and saved to ${outputFile}`);

		// Generate metadata
		try {
			const metadataFile = `${outputFile}.metadata.json`;

			const metadata = {
				search_terms: options.search,
				search_at: new Date().toISOString(),
				content_type: "markdown",
				file_size: fs.statSync(outputFile).size,
				status: "needs_processing",
			};

			fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
		} catch (metaError) {
			console.error(
				chalk.yellow("Warning: Failed to write metadata file"),
				metaError,
			);
		}
	} catch (error) {
		spinner.fail("Search failed");
		console.error(error);
		throw new Error("Failed to search web");
	}
}

/**
 * Crawl a website with Firecrawl
 * @param options Crawl options
 */
async function crawlWebsite(options: FirecrawlOptions): Promise<void> {
	if (!options.url) {
		const { url } = await inquirer.prompt([
			{
				type: "input",
				name: "url",
				message: "Enter the URL to crawl:",
				validate: (input) => (input.trim() !== "" ? true : "URL is required"),
			},
		]);

		options.url = url;
	}

	const { maxDepth } = await inquirer.prompt([
		{
			type: "number",
			name: "maxDepth",
			message: "Maximum crawl depth:",
			default: 2,
		},
	]);

	const { maxPages } = await inquirer.prompt([
		{
			type: "number",
			name: "maxPages",
			message: "Maximum number of pages to crawl:",
			default: 10,
		},
	]);

	const spinner = ora(`Crawling ${options.url}...`).start();

	try {
		// Set up output path
		const dataType = options.type || "testimonies";
		const outputDir = path.join(
			getBucketPath(dataType as keyof DataTypeConfig, "processing"),
			"firecrawl",
		);
		fs.mkdirSync(outputDir, { recursive: true });

		// Generate filename
		const urlObj = new URL(options.url);
		const hostname = urlObj.hostname.replace(/\./g, "_");
		const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
		const outputFile =
			options.output ||
			path.join(outputDir, `crawl-${hostname}-${timestamp}.md`);

		// Call firecrawl (this may take a while)
		const command = `firecrawl crawl --url="${options.url}" --maxDepth=${maxDepth} --limit=${maxPages}`;

		// Run in the background and show progress
		spinner.text = `Crawling ${options.url} (0/${maxPages})...`;

		const crawlProcess = spawn("firecrawl", [
			"crawl",
			`--url=${options.url}`,
			`--maxDepth=${maxDepth}`,
			`--limit=${maxPages}`,
		]);

		let stdoutData = "";
		let crawlCount = 0;

		crawlProcess.stdout.on("data", (data) => {
			stdoutData += data.toString();

			// Try to parse progress
			const match = data.toString().match(/Crawled (\d+) pages/);
			if (match && match[1]) {
				crawlCount = parseInt(match[1], 10);
				spinner.text = `Crawling ${options.url} (${crawlCount}/${maxPages})...`;
			}
		});

		// Wait for process to complete
		await new Promise<void>((resolve, reject) => {
			crawlProcess.on("close", (code) => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error(`Crawl process exited with code ${code}`));
				}
			});

			crawlProcess.on("error", (error) => {
				reject(error);
			});
		});

		// Write the result to a file
		fs.writeFileSync(
			outputFile,
			`# Crawl Results: ${options.url}\n\n${stdoutData}`,
		);

		spinner.succeed(`Crawl completed and saved to ${outputFile}`);

		// Generate metadata
		const metadataFile = `${outputFile}.metadata.json`;

		const metadata = {
			source: options.url,
			crawled_at: new Date().toISOString(),
			max_depth: maxDepth,
			max_pages: maxPages,
			pages_crawled: crawlCount,
			content_type: "markdown",
			file_size: fs.statSync(outputFile).size,
			status: "needs_processing",
		};

		fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
	} catch (error) {
		spinner.fail("Crawl failed");
		console.error(error);
		throw new Error("Failed to crawl website");
	}
}

/**
 * Map website structure with Firecrawl
 * @param options Map options
 */
async function mapWebsite(options: FirecrawlOptions): Promise<void> {
	if (!options.url) {
		const { url } = await inquirer.prompt([
			{
				type: "input",
				name: "url",
				message: "Enter the URL to map:",
				validate: (input) => (input.trim() !== "" ? true : "URL is required"),
			},
		]);

		options.url = url;
	}

	const spinner = ora(`Mapping ${options.url}...`).start();

	try {
		// Set up output path
		const dataType = options.type || "testimonies";
		const outputDir = path.join(
			getBucketPath(dataType as keyof DataTypeConfig, "processing"),
			"firecrawl",
		);
		fs.mkdirSync(outputDir, { recursive: true });

		// Generate filename
		const urlObj = new URL(options.url);
		const hostname = urlObj.hostname.replace(/\./g, "_");
		const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
		const outputFile =
			options.output ||
			path.join(outputDir, `sitemap-${hostname}-${timestamp}.md`);

		// Call firecrawl
		let command = `firecrawl map --url="${options.url}"`;

		if (options.limit) {
			command += ` --limit=${options.limit}`;
		}

		const result = execSync(command, { encoding: "utf-8" });

		// Write the result to a file
		fs.writeFileSync(outputFile, `# Site Map: ${options.url}\n\n${result}`);

		spinner.succeed(`Site mapping completed and saved to ${outputFile}`);

		// Generate metadata
		try {
			const metadataFile = `${outputFile}.metadata.json`;

			const metadata = {
				source: options.url,
				mapped_at: new Date().toISOString(),
				content_type: "markdown",
				file_size: fs.statSync(outputFile).size,
				status: "needs_processing",
			};

			fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
		} catch (metaError) {
			console.error(
				chalk.yellow("Warning: Failed to write metadata file"),
				metaError,
			);
		}
	} catch (error) {
		spinner.fail("Site mapping failed");
		console.error(error);
		throw new Error("Failed to map website");
	}
}

