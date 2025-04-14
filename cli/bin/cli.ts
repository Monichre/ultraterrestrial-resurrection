#!/usr/bin/env node

import { Command } from "commander";
import * as figlet from "figlet";
import chalk from "chalk";
import * as dotenv from "dotenv";
import * as path from "path";
import * as inquirer from "inquirer";
import boxen from "boxen";

// Initialize environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Create program instance
const program = new Command();

// Display welcome banner
console.log(
	chalk.blue(
		figlet.textSync("Ultraterrestrial CLI", {
			font: "Standard",
			horizontalLayout: "default",
			verticalLayout: "default",
		}),
	),
);
console.log(chalk.yellow("Data Processing & Xata Import Tool\n"));

// Setup program metadata
program
	.name("ut-cli")
	.description("CLI tool for processing and importing data into Xata database")
	.version("1.0.0")
	.helpOption("-h, --help", "Display help information");

// Import command modules
try {
	const registerProcessingCommands =
		require("../src/commands/processing").default;
	const registerReviewCommands = require("../src/commands/review").default;
	const registerInsertionCommands =
		require("../src/commands/insertion").default;
	const registerOnboardingCommands = require("../src/commands/onboard").default;

	// Register commands with the program
	registerOnboardingCommands(program);
	registerProcessingCommands(program);
	registerReviewCommands(program);
	registerInsertionCommands(program);

	// If no arguments provided, show interactive menu
	if (process.argv.length === 2) {
		showInteractiveMenu();
	} else {
		// Parse command line arguments
		program.parse(process.argv);
	}
} catch (error) {
	console.error(chalk.red("Error initializing CLI commands:"), error);
	process.exit(1);
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
	console.error(
		chalk.red("Unhandled Rejection at:"),
		promise,
		chalk.red("reason:"),
		reason,
	);
	process.exit(1);
});

/**
 * Display an interactive menu for the CLI
 */
async function showInteractiveMenu() {
	// Clear the console
	console.clear();

	// Display welcome banner
	console.log(
		chalk.blue(
			figlet.textSync("Ultraterrestrial CLI", {
				font: "Standard",
				horizontalLayout: "default",
				verticalLayout: "default",
			}),
		),
	);

	// Display app description in a box
	console.log(
		boxen(chalk.yellow("Data Processing & Xata Import Tool"), {
			padding: 1,
			margin: { top: 1, bottom: 1 },
			borderStyle: "round",
			borderColor: "blue",
		}),
	);

	// Display workflow diagram
	console.log(chalk.cyan("\n🔄 Data Processing Workflow:"));
	console.log(
		chalk.white(
			"  📁 Discover → 📋 Backlog → 🔍 Process → ✅ Review → 💾 Insert → 🗃️ Database",
		),
	);

	// Display command categories
	console.log(
		boxen(
			`${chalk.magentaBright("Command Categories")}\n\n` +
				`${chalk.green("1.")} ${chalk.whiteBright(
					"Onboarding",
				)}: Discover and import new files into the system\n` +
				`${chalk.green("2.")} ${chalk.whiteBright(
					"Processing",
				)}: Transform and prepare files for database import\n` +
				`${chalk.green("3.")} ${chalk.whiteBright(
					"Review",
				)}: Validate and approve processed files\n` +
				`${chalk.green("4.")} ${chalk.whiteBright(
					"Database Operations",
				)}: Insert approved data into the Xata database`,
			{
				padding: 1,
				margin: { top: 1, bottom: 1 },
				borderStyle: "round",
				borderColor: "green",
			},
		),
	);

	// Ask user what they want to do
	const { action } = await inquirer.prompt([
		{
			type: "list",
			name: "action",
			message: "What would you like to do?",
			choices: [
				{ name: "🔎 Discover Files", value: "discover" },
				{ name: "📦 Process Files", value: "process" },
				{ name: "🔍 Review Data", value: "review" },
				{ name: "💾 Insert to Database", value: "insert" },
				{ name: "📊 System Status", value: "status" },
				{ name: "❓ Show Help", value: "help" },
				{ name: "👋 Exit", value: "exit" },
			],
		},
	]);

	// Handle user selection
	switch (action) {
		case "discover":
			await showOnboardingMenu();
			break;
		case "process":
			await showProcessingMenu();
			break;
		case "review":
			await showReviewMenu();
			break;
		case "insert":
			await showInsertionMenu();
			break;
		case "status":
			await showSystemStatus();
			break;
		case "help":
			program.help();
			break;
		case "exit":
			console.log(chalk.green("Goodbye! 👋"));
			process.exit(0);
	}
}

/**
 * Display the onboarding submenu
 */
async function showOnboardingMenu() {
	console.clear();
	console.log(
		chalk.blueBright(figlet.textSync("Onboarding", { font: "Standard" })),
	);

	const { command } = await inquirer.prompt([
		{
			type: "list",
			name: "command",
			message: "Select an onboarding operation:",
			choices: [
				{
					name: "🔎 Discover Files - Find and import new files",
					value: "discover",
				},
				{
					name: "📦 Process Backlog - Move files to processing stage",
					value: "process",
				},
				{ name: "⬅️ Back to Main Menu", value: "back" },
			],
		},
	]);

	if (command === "back") {
		return showInteractiveMenu();
	}

	// Get common options
	const { dataType, interactive } = await inquirer.prompt([
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
		{
			type: "confirm",
			name: "interactive",
			message: "Run in interactive mode?",
			default: true,
		},
	]);

	const cmdArgs = ["onboard:" + command, "--type", dataType];
	if (interactive) {
		cmdArgs.push("--interactive");
	}

	if (command === "discover") {
		const { source, pattern } = await inquirer.prompt([
			{
				type: "input",
				name: "source",
				message: "Enter source directory path:",
				validate: (input) =>
					input ? true : "Source directory cannot be empty",
			},
			{
				type: "input",
				name: "pattern",
				message: "Enter file pattern (leave empty for all files):",
				default: "*",
			},
		]);

		cmdArgs.push("--source", source);
		if (pattern !== "*") {
			cmdArgs.push("--pattern", pattern);
		}
	} else if (command === "process" && !interactive) {
		const { file } = await inquirer.prompt([
			{
				type: "input",
				name: "file",
				message: "Enter specific file to process (leave empty for all files):",
			},
		]);

		if (file) {
			cmdArgs.push("--file", file);
		}
	}

	// Execute the command
	process.argv = [process.argv[0], process.argv[1], ...cmdArgs];
	program.parse(process.argv);

	// Return to menu after command completes
	const { returnToMenu } = await inquirer.prompt([
		{
			type: "confirm",
			name: "returnToMenu",
			message: "Return to main menu?",
			default: true,
		},
	]);

	if (returnToMenu) {
		return showInteractiveMenu();
	}
}

/**
 * Display the processing submenu
 */
async function showProcessingMenu() {
	console.clear();
	console.log(
		chalk.greenBright(figlet.textSync("Processing", { font: "Standard" })),
	);

	const { command } = await inquirer.prompt([
		{
			type: "list",
			name: "command",
			message: "Select a processing operation:",
			choices: [
				{
					name: "📋 List Files - Show files in the processing bucket",
					value: "list",
				},
				{
					name: "🔄 Transform - Convert files to structured format",
					value: "transform",
				},
				{
					name: "🧠 Enhance - Use AI to enhance file content",
					value: "enhance",
				},
				{ name: "⬅️ Back to Main Menu", value: "back" },
			],
		},
	]);

	if (command === "back") {
		return showInteractiveMenu();
	}

	// Get common options
	const { dataType, interactive } = await inquirer.prompt([
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
		{
			type: "confirm",
			name: "interactive",
			message: "Run in interactive mode?",
			default: true,
		},
	]);

	const cmdArgs = ["process:" + command, "--type", dataType];
	if (interactive && command !== "list") {
		cmdArgs.push("--interactive");
	}

	if (!interactive && (command === "transform" || command === "enhance")) {
		const { file } = await inquirer.prompt([
			{
				type: "input",
				name: "file",
				message: "Enter specific file to process (leave empty for all files):",
			},
		]);

		if (file) {
			cmdArgs.push("--file", file);
		}
	}

	if (command === "list") {
		const { pattern } = await inquirer.prompt([
			{
				type: "input",
				name: "pattern",
				message: "Enter file pattern (leave empty for all files):",
				default: "*",
			},
		]);

		if (pattern !== "*") {
			cmdArgs.push("--pattern", pattern);
		}
	}

	// Execute the command
	process.argv = [process.argv[0], process.argv[1], ...cmdArgs];
	program.parse(process.argv);

	// Return to menu after command completes
	const { returnToMenu } = await inquirer.prompt([
		{
			type: "confirm",
			name: "returnToMenu",
			message: "Return to main menu?",
			default: true,
		},
	]);

	if (returnToMenu) {
		return showInteractiveMenu();
	}
}

/**
 * Display the review submenu
 */
async function showReviewMenu() {
	console.clear();
	console.log(
		chalk.yellowBright(figlet.textSync("Review", { font: "Standard" })),
	);

	const { command } = await inquirer.prompt([
		{
			type: "list",
			name: "command",
			message: "Select a review operation:",
			choices: [
				{ name: "📋 List - Show files in review stage", value: "list" },
				{ name: "✅ Validate - Check and validate files", value: "validate" },
				{
					name: "📤 Approve - Move files to insertion stage",
					value: "approve",
				},
				{ name: "⬅️ Back to Main Menu", value: "back" },
			],
		},
	]);

	if (command === "back") {
		return showInteractiveMenu();
	}

	// Get common options
	const { dataType, interactive } = await inquirer.prompt([
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
		{
			type: "confirm",
			name: "interactive",
			message: "Run in interactive mode?",
			default: true,
		},
	]);

	const cmdArgs = ["review:" + command, "--type", dataType];
	if (interactive && command !== "list") {
		cmdArgs.push("--interactive");
	}

	if (!interactive && (command === "validate" || command === "approve")) {
		const { file } = await inquirer.prompt([
			{
				type: "input",
				name: "file",
				message: "Enter specific file to process (leave empty for all files):",
			},
		]);

		if (file) {
			cmdArgs.push("--file", file);
		}
	}

	// Execute the command
	process.argv = [process.argv[0], process.argv[1], ...cmdArgs];
	program.parse(process.argv);

	// Return to menu after command completes
	const { returnToMenu } = await inquirer.prompt([
		{
			type: "confirm",
			name: "returnToMenu",
			message: "Return to main menu?",
			default: true,
		},
	]);

	if (returnToMenu) {
		return showInteractiveMenu();
	}
}

/**
 * Display the insertion submenu
 */
async function showInsertionMenu() {
	console.clear();
	console.log(
		chalk.cyanBright(figlet.textSync("Database", { font: "Standard" })),
	);

	const { command } = await inquirer.prompt([
		{
			type: "list",
			name: "command",
			message: "Select a database operation:",
			choices: [
				{
					name: "📋 List - Show files ready for insertion",
					value: "list",
				},
				{
					name: "💾 Insert - Insert data into Xata database",
					value: "insert",
				},
				{
					name: "🔍 Verify - Check if records exist in database",
					value: "verify",
				},
				{ name: "⬅️ Back to Main Menu", value: "back" },
			],
		},
	]);

	if (command === "back") {
		return showInteractiveMenu();
	}

	// Get common options
	const { dataType, interactive } = await inquirer.prompt([
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
		{
			type: "confirm",
			name: "interactive",
			message: "Run in interactive mode?",
			default: true,
		},
	]);

	const cmdArgs = ["insert:" + command, "--type", dataType];
	if (interactive && command !== "list") {
		cmdArgs.push("--interactive");
	}

	if (!interactive && (command === "insert" || command === "verify")) {
		const { file } = await inquirer.prompt([
			{
				type: "input",
				name: "file",
				message: "Enter specific file to process (leave empty for all files):",
			},
		]);

		if (file) {
			cmdArgs.push("--file", file);
		}
	}

	// Execute the command
	process.argv = [process.argv[0], process.argv[1], ...cmdArgs];
	program.parse(process.argv);

	// Return to menu after command completes
	const { returnToMenu } = await inquirer.prompt([
		{
			type: "confirm",
			name: "returnToMenu",
			message: "Return to main menu?",
			default: true,
		},
	]);

	if (returnToMenu) {
		return showInteractiveMenu();
	}
}

/**
 * Display system status
 */
async function showSystemStatus() {
	console.clear();
	console.log(
		chalk.magentaBright(figlet.textSync("Status", { font: "Standard" })),
	);

	console.log(chalk.yellow("Scanning system status..."));

	try {
		// Import the bucket manager for status information
		const bucketManager = require("../src/lib/bucketManager");

		// Get status of all buckets
		const spinner = require("ora")("Getting bucket statistics...").start();
		const bucketStatus = await bucketManager.getBucketStatus();
		spinner.succeed("System information retrieved");

		// Calculate total files in each bucket
		const totals = {
			backlog: 0,
			processing: 0,
			review: 0,
			insertion: 0,
		};

		// Status box content
		let statusContent = `${chalk.whiteBright("Files by Data Type and Stage")}\n\n`;

		// Add info for each model
		for (const model of Object.keys(bucketStatus)) {
			const stats = bucketStatus[model];

			statusContent += `${chalk.cyan(model.charAt(0).toUpperCase() + model.slice(1))}:\n`;
			statusContent += ` ├─ Backlog: ${stats.backlog} files\n`;
			statusContent += ` ├─ Processing: ${stats.processing} files\n`;
			statusContent += ` ├─ Review: ${stats.review} files\n`;
			statusContent += ` └─ Insertion: ${stats.insertion} files\n\n`;

			// Update totals
			totals.backlog += stats.backlog;
			totals.processing += stats.processing;
			totals.review += stats.review;
			totals.insertion += stats.insertion;
		}

		// Add summary
		statusContent += `${chalk.whiteBright("Summary")}\n\n`;
		statusContent += `${chalk.cyan("Total Backlog")}: ${totals.backlog} files\n`;
		statusContent += `${chalk.cyan("Total Processing")}: ${totals.processing} files\n`;
		statusContent += `${chalk.cyan("Total Review")}: ${totals.review} files\n`;
		statusContent += `${chalk.cyan("Total Insertion")}: ${totals.insertion} files\n`;
		statusContent += `${chalk.cyan("Total Files")}: ${
			totals.backlog + totals.processing + totals.review + totals.insertion
		} files\n\n`;

		// Try to get DB connection status if Xata client is available
		try {
			const xataClient = require("../src/lib/xataClient");
			const dbStatus = await xataClient.checkConnection();
			statusContent += `${chalk.whiteBright("Database Status")}\n\n`;
			statusContent += `${chalk.cyan("Connection")}: ${
				dbStatus ? chalk.green("Active") : chalk.red("Inactive")
			}\n`;
		} catch (error) {
			// No Xata client available, skip DB status
		}

		// Display system statistics
		console.log(chalk.green("\nSystem Status: Ready"));
		console.log(
			boxen(statusContent, {
				padding: 1,
				margin: { top: 1, bottom: 1 },
				borderStyle: "round",
				borderColor: "magenta",
			}),
		);
	} catch (error) {
		console.error(chalk.red("Error retrieving system status:"), error);
		console.log(
			boxen(
				`${chalk.whiteBright("System Status")}\n\n` +
					`${chalk.red("Error retrieving system information.")}`,
				{
					padding: 1,
					margin: { top: 1, bottom: 1 },
					borderStyle: "round",
					borderColor: "red",
				},
			),
		);
	}

	console.log(chalk.yellow("\nPress Enter to continue..."));
	await new Promise((resolve) => {
		process.stdin.once("data", () => {
			resolve(null);
		});
	});

	return showInteractiveMenu();
}
