import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the paths
const PROCESSING_DIR = path.join(__dirname, "../processing/events");
const OUTPUT_DIR = path.join(__dirname, "../output");

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define interfaces for event structure
interface EventMetadata {
	source: string;
	dateText: string;
	originalFormat: string;
	keywords: string[];
	fingerprint: string;
}

interface EventData {
	title?: string;
	name?: string;
	date?: string;
	description: string;
	location?: string | null;
	summary?: string;
	category?: string[] | string;
	latitude?: number | null;
	longitude?: number | null;
	metadata?: EventMetadata;
}

console.log("Starting events preparation process...");

// Process existing JSON files directly
async function prepareEvents() {
	try {
		// Check if the processing directory exists
		if (!fs.existsSync(PROCESSING_DIR)) {
			throw new Error(`Processing directory doesn't exist: ${PROCESSING_DIR}`);
		}

		// Get all JSON files from the processing directory
		const files = fs
			.readdirSync(PROCESSING_DIR)
			.filter((file) => file.endsWith(".json"));

		if (files.length === 0) {
			throw new Error(`No JSON files found in ${PROCESSING_DIR}`);
		}

		console.log(`Found ${files.length} JSON files to process`);

		// Combine all event data from the JSON files
		let allEvents: EventData[] = [];

		for (const file of files) {
			const filePath = path.join(PROCESSING_DIR, file);
			console.log(`Processing ${filePath}...`);

			const fileContent = fs.readFileSync(filePath, "utf8");
			const events = JSON.parse(fileContent) as EventData[];

			if (Array.isArray(events)) {
				console.log(`Found ${events.length} events in ${file}`);
				allEvents = [...allEvents, ...events];
			} else {
				console.warn(
					`Warning: ${file} does not contain an array of events. Skipping.`,
				);
			}
		}

		console.log(`Total combined events: ${allEvents.length}`);

		// Process events to ensure all required fields exist
		const processedEvents = allEvents.map((event: EventData) => {
			// Ensure there's a title field (use name as fallback)
			if (!event.title && event.name) {
				event.title = event.name;
			}

			// If neither title nor name exists, generate a simple identifier
			if (!event.title) {
				const dateStr = event.date
					? new Date(event.date).getFullYear()
					: "unknown-date";
				event.title = `UFO Event (${dateStr})`;
			}

			// Ensure categories are in an array format
			if (!event.category) {
				event.category = ["unknown"];
			} else if (!Array.isArray(event.category)) {
				event.category = [event.category];
			}

			// Ensure metadata exists
			if (!event.metadata) {
				event.metadata = {
					source: "Data Import",
					dateText: event.date
						? new Date(event.date).toLocaleDateString()
						: "Unknown",
					originalFormat: "json",
					keywords: [],
					fingerprint: `event_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
				};
			}

			return event;
		});

		// Write the combined events to the output file
		const outputPath = path.join(OUTPUT_DIR, "events.json");
		fs.writeFileSync(outputPath, JSON.stringify(processedEvents, null, 2));

		console.log(
			`Successfully wrote ${processedEvents.length} events to ${outputPath}`,
		);
	} catch (error) {
		console.error("Error preparing events:", error);
		process.exit(1);
	}
}

prepareEvents()
	.then(() => console.log("Events preparation complete"))
	.catch((err) => {
		console.error("Failed to prepare events:", err);
		process.exit(1);
	});
