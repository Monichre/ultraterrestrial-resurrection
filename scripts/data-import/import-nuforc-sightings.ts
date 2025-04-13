#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import { getXataClient } from "../../src/db/xata/client";

// Initialize the Xata client
const xata = getXataClient();

// Interface to match the NUFORC JSON report structure
interface NUFORCReport {
	link: {
		text: string;
		url: string;
	};
	occurred: string;
	city: string;
	state: string;
	country: string;
	shape: string;
	summary: string;
	reported: string;
	media: string;
	explanation: string;
}

interface NUFORCFile {
	url: string;
	reportId: string;
	title: string;
	headers: string[];
	reports: NUFORCReport[];
	total_reports: number;
	scraped_at: string;
}

// Interface for the Xata sightings table schema
interface XataSighting {
	date?: Date;
	description?: string;
	media_link?: string;
	city?: string;
	state?: string;
	country?: string;
	shape?: string;
	duration_seconds?: string;
	duration_hours_min?: string;
	comments?: string;
	date_posted?: Date;
	latitude?: number | null;
	longitude?: number | null;
	// media field is omitted as it's a file[] type that would require file uploads
}

/**
 * Parse a date string in MM/DD/YYYY HH:MM format to a Date object
 */
function parseDate(dateStr: string): Date | undefined {
	try {
		const [datePart, timePart] = dateStr.split(" ");
		if (!datePart) return undefined;

		const [month, day, year] = datePart.split("/").map(Number);

		// Validate date parts
		if (isNaN(month) || isNaN(day) || isNaN(year)) {
			return undefined;
		}

		if (timePart) {
			const [hours, minutes] = timePart.split(":").map(Number);

			// Validate time parts
			if (isNaN(hours) || isNaN(minutes)) {
				return new Date(year, month - 1, day);
			}

			return new Date(year, month - 1, day, hours, minutes);
		} else {
			return new Date(year, month - 1, day);
		}
	} catch (error) {
		console.error(`Error parsing date: ${dateStr}`, error);
		return undefined;
	}
}

/**
 * Parse a date string in MM/DD/YYYY format to a Date object
 */
function parseReportedDate(dateStr: string): Date | undefined {
	try {
		const [month, day, year] = dateStr.split("/").map(Number);

		// Validate parts
		if (isNaN(month) || isNaN(day) || isNaN(year)) {
			return undefined;
		}

		return new Date(year, month - 1, day);
	} catch (error) {
		console.error(`Error parsing reported date: ${dateStr}`, error);
		return undefined;
	}
}

/**
 * Convert a NUFORC report to Xata sighting format
 */
function convertReportToSighting(
	report: NUFORCReport,
	reportId: string,
): XataSighting {
	// Extract potential duration information from summary
	const durationMatch = report.summary.match(
		/(\d+)\s*(?:minute|min|second|sec)/i,
	);
	const durationSeconds = durationMatch ? durationMatch[1] : "";

	// Create a unique identifier based on the report URL and occurred date
	const reportIdentifier = report.link.url.split("=")[1] || "";

	return {
		date: parseDate(report.occurred),
		description: report.summary,
		media_link:
			report.media === "Y" ? `https://nuforc.org${report.link.url}` : "",
		city: report.city,
		state: report.state,
		country: report.country,
		shape: report.shape,
		duration_seconds: durationSeconds,
		duration_hours_min: "", // This would need more sophisticated parsing
		comments: report.explanation ? `Explanation: ${report.explanation}` : "",
		date_posted: parseReportedDate(report.reported),
		// We don't have lat/long data in the basic NUFORC data
		latitude: null,
		longitude: null,
	};
}

/**
 * Process a NUFORC JSON file and convert it to Xata sightings
 */
async function processNUFORCFile(filePath: string): Promise<XataSighting[]> {
	try {
		const fileContent = await fs.promises.readFile(filePath, "utf8");
		const nuforData: NUFORCFile = JSON.parse(fileContent);

		console.log(
			`Processing ${nuforData.reports.length} reports from ${nuforData.reportId}`,
		);

		return nuforData.reports.map((report) =>
			convertReportToSighting(report, nuforData.reportId),
		);
	} catch (error) {
		console.error(`Error processing file ${filePath}:`, error);
		return [];
	}
}

/**
 * Import sightings to Xata database
 */
async function importSightingsToXata(sightings: XataSighting[]): Promise<void> {
	try {
		console.log(`Importing ${sightings.length} sightings to Xata...`);

		// Process in batches to avoid overwhelming the database
		const batchSize = 50;
		for (let i = 0; i < sightings.length; i += batchSize) {
			const batch = sightings.slice(i, i + batchSize);

			// Create records in Xata
			const results = await xata.db.sightings.create(batch);

			console.log(
				`Imported batch ${Math.floor(i / batchSize) + 1} (${batch.length} records)`,
			);
		}

		console.log("Import completed successfully");
	} catch (error) {
		console.error("Error importing to Xata:", error);
	}
}

/**
 * Main function to process all NUFORC files and import to Xata
 */
async function main() {
	try {
		// Get all JSON files in the NUFORC data directory
		const nuforcDir = path.join(process.cwd(), "data", "nuforc");
		const files = await fs.promises.readdir(nuforcDir);
		const jsonFiles = files.filter((file) => file.endsWith(".json"));

		console.log(`Found ${jsonFiles.length} NUFORC data files to process`);

		// Process each file and collect all sightings
		let allSightings: XataSighting[] = [];

		for (const file of jsonFiles) {
			const filePath = path.join(nuforcDir, file);
			const sightings = await processNUFORCFile(filePath);
			allSightings = [...allSightings, ...sightings];

			console.log(`Processed ${sightings.length} sightings from ${file}`);
		}

		console.log(`Total sightings collected: ${allSightings.length}`);

		// Deduplicate by creating a unique key for each sighting
		const uniqueSightings = new Map<string, XataSighting>();

		allSightings.forEach((sighting) => {
			// Create a unique key based on date, city, and description
			const key = `${sighting.date?.toISOString() || ""}_${sighting.city || ""}_${(sighting.description || "").substring(0, 50)}`;
			if (!uniqueSightings.has(key)) {
				uniqueSightings.set(key, sighting);
			}
		});

		const finalSightings = Array.from(uniqueSightings.values());
		console.log(
			`After deduplication: ${finalSightings.length} unique sightings`,
		);

		// Import to Xata
		if (finalSightings.length > 0) {
			// First save the data to file as a backup
			const outputDir = path.join(process.cwd(), "output");
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}

			const outputPath = path.join(outputDir, "sightings-to-import.json");
			await fs.promises.writeFile(
				outputPath,
				JSON.stringify(finalSightings, null, 2),
			);
			console.log(`Saved data to: ${outputPath}`);

			// Prompt for confirmation before importing
			console.log(
				`\nReady to import ${finalSightings.length} sightings to Xata database.`,
			);
			console.log("To proceed with the import, run:");
			console.log("  bun import-nuforc-sightings.ts --import");

			// Check if --import flag is provided
			if (process.argv.includes("--import")) {
				await importSightingsToXata(finalSightings);
			}
		} else {
			console.log("No sightings to import");
		}
	} catch (error) {
		console.error("Error in main process:", error);
	}
}

// Execute the main function
main().catch((error) => {
	console.error("Unhandled error in script:", error);
	process.exit(1);
});
