// scripts/data-import/events/test-events-import.ts
import { getXataClient } from "../../../src/db/xata";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const rootDir = path.resolve(__dirname, "../../..");
const envPath = path.join(rootDir, ".env");
dotenv.config({ path: envPath });

// Validate that XATA_API_KEY is set
if (!process.env.XATA_API_KEY) {
	console.log("XATA_API_KEY is not set in the environment");
	console.log("Loading from root .env file...");

	// Try loading from the project root
	dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

	if (!process.env.XATA_API_KEY) {
		console.error(
			"XATA_API_KEY is still not set. Please check your .env file.",
		);
		process.exit(1);
	}
}

// TypeScript interface for the event data structure
interface EventData {
	title: string;
	name?: string;
	date: string | null;
	description: string;
	location: string | null;
	latitude: number | null;
	longitude: number | null;
	summary?: string;
	category: string[];
	metadata: {
		source: string;
		dateText: string;
		originalFormat: string;
		keywords: string[];
		fingerprint: string;
	};
}

// Look for the events file in multiple possible locations
const possiblePaths = [
	path.join(__dirname, "../insertion/events/events.json"), // First check in the insertion directory
	path.join(__dirname, "../output/events.json"), // Then check in the output directory
	path.join(rootDir, "scripts/data-import/output/events.json"), // Finally check in the project output dir
];

let eventsFilePath = "";
let events: EventData[] = [];

// Try each path until we find a valid file
for (const filePath of possiblePaths) {
	console.log(`Checking for events file at: ${filePath}`);
	try {
		if (fs.existsSync(filePath)) {
			eventsFilePath = filePath;
			events = JSON.parse(fs.readFileSync(filePath, "utf8"));
			console.log(`Found events file at: ${eventsFilePath}`);
			console.log(`Loaded ${events.length} events from file`);
			break;
		}
	} catch (error) {
		console.error(`Error reading events file at ${filePath}:`, error);
	}
}

if (!eventsFilePath) {
	console.error("No valid events file found in any of the expected locations.");
	process.exit(1);
}

// Initialize validation results
type ValidationResults = {
	total: number;
	valid: number;
	invalid: number;
	duplicates: number;
	issues: Array<{ title: string; issue: string }>;
};

async function testEventsImport() {
	const xata = getXataClient();
	const validationResults: ValidationResults = {
		total: events.length,
		valid: 0,
		invalid: 0,
		duplicates: 0,
		issues: [],
	};

	console.log(`Testing import of ${events.length} events to Xata`);

	// Process each event
	for (let i = 0; i < events.length; i++) {
		const event = events[i];
		let shouldSkip = false;

		// Check for required fields
		if (!event.title) {
			validationResults.invalid++;
			validationResults.issues.push({
				title: event.title || "Untitled event",
				issue: "Missing required title field",
			});
			continue; // This continue is inside a loop, which is valid
		}

		if (!event.date) {
			validationResults.invalid++;
			validationResults.issues.push({
				title: event.title,
				issue: "Missing required date field",
			});
			continue; // This continue is inside a loop, which is valid
		}

		// Check for existing records in the database
		try {
			const exists = await xata.db.events
				.filter({ title: event.title })
				.getFirst();

			if (exists) {
				validationResults.duplicates++;
				validationResults.issues.push({
					title: event.title,
					issue: "Already exists in database",
				});
				shouldSkip = true;
			}
		} catch (error) {
			console.error(`Error checking for duplicate: ${event.title}`, error);
			validationResults.issues.push({
				title: event.title,
				issue: `Database error: ${error.message}`,
			});
			shouldSkip = true;
		}

		// Skip to next iteration if we've marked this event to skip
		if (shouldSkip) {
			continue;
		}

		// Check description length
		if (
			event.description &&
			Buffer.byteLength(event.description, "utf8") > 204800
		) {
			validationResults.issues.push({
				title: event.title,
				issue: "Description exceeds maximum size of 200KB",
			});
			// Don't increment invalid since we can truncate this
		}

		// Event passed all checks
		validationResults.valid++;
	}

	// Print validation summary
	console.log(`
Validation complete:
Total events:     ${validationResults.total}
Valid events:     ${validationResults.valid}
Invalid events:   ${validationResults.invalid}
Duplicates:       ${validationResults.duplicates}
Issues found:     ${validationResults.issues.length}
`);

	// Write validation report to file
	fs.writeFileSync(
		path.join(__dirname, "../output/validation-report.json"),
		JSON.stringify(validationResults, null, 2),
	);

	console.log("Validation report written to: ../output/validation-report.json");
}

// Run the test import
testEventsImport()
	.then(() => console.log("Test import complete"))
	.catch((err) => console.error("Test import failed:", err));
