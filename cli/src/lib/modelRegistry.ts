import { tables } from "../../../src/db/xata/xata";
import * as path from "path";

// Define model validation rule types
export interface ValidationRule {
	field: string;
	type: string;
	required: boolean;
	isLink?: boolean;
	linkTable?: string;
}

// Define model schema structure
export interface ModelSchema {
	name: string;
	rules: ValidationRule[];
}

/**
 * Get a list of all available models from the Xata schema
 * Filters out relationship/junction tables that have names with hyphens
 */
export function getAvailableModels() {
	// Filter out relationship tables to get primary entity tables
	return tables
		.filter((table) => !table.name.includes("-"))
		.map((table) => ({
			name: table.name,
			columns: table.columns,
			required: table.columns.filter((col) => !col.name.includes("?")),
		}));
}

/**
 * Get validation schema for a specific model
 * @param modelName The name of the model
 * @returns Schema with validation rules
 */
export function getValidationSchema(modelName: string): ModelSchema {
	const model = tables.find((t) => t.name === modelName);
	if (!model) throw new Error(`Model ${modelName} not found in schema`);

	return {
		name: model.name,
		rules: model.columns.map((col) => {
			// Check if this is a link field to another table
			const isLink = col.type === "link";

			return {
				field: col.name,
				type: col.type,
				required: !col.name.includes("?"),
				isLink: isLink,
				linkTable: isLink && col.link ? col.link.table : undefined,
			};
		}),
	};
}

/**
 * Get a list of all primary entity model names
 * @returns Array of model names
 */
export function getModelNames(): string[] {
	return getAvailableModels().map((model) => model.name);
}

/**
 * Check if a given model exists in the schema
 * @param modelName The name of the model to check
 * @returns Boolean indicating if the model exists
 */
export function modelExists(modelName: string): boolean {
	return tables.some((table) => table.name === modelName);
}

/**
 * Get details about model relationships
 * @param modelName The name of the model
 * @returns Object with relationship information
 */
export function getModelRelationships(modelName: string) {
	const model = tables.find((t) => t.name === modelName);
	if (!model) throw new Error(`Model ${modelName} not found in schema`);

	const relationships = {
		links: [] as { field: string; targetModel: string }[],
		linkedBy: [] as { table: string; column: string }[],
	};

	// Find link columns in this model
	model.columns.forEach((col) => {
		if (col.type === "link" && col.link) {
			relationships.links.push({
				field: col.name,
				targetModel: col.link.table,
			});
		}
	});

	// Find revLinks that reference this model
	if (model.revLinks) {
		model.revLinks.forEach((revLink) => {
			relationships.linkedBy.push({
				table: revLink.table,
				column: revLink.column,
			});
		});
	}

	return relationships;
}

/**
 * Get file extension to model type mapping
 * Helps with automatically determining model type from file extension
 */
export function getFileExtensionModelMappings(): Record<string, string[]> {
	return {
		".json": [
			"events",
			"topics",
			"personnel",
			"artifacts",
			"organizations",
			"sightings",
		],
		".csv": ["sightings", "events", "personnel"],
		".md": ["testimonies", "documents"],
		".txt": ["testimonies", "documents"],
	};
}

/**
 * Try to determine model type from file extension and content
 * @param fileName The name of the file
 * @param sampleContent Optional sample content to analyze
 * @returns Best guess at model type or null if unknown
 */
export function guessModelFromFile(
	fileName: string,
	sampleContent?: string,
): string | null {
	const extension = path.extname(fileName).toLowerCase();
	const mappings = getFileExtensionModelMappings();

	// If we have a direct mapping for this extension
	if (mappings[extension]) {
		// If we have sample content, we could do more sophisticated analysis
		if (sampleContent) {
			// This could be expanded with more sophisticated content analysis
			// For now, just use some simple heuristics
			const content = sampleContent.toLowerCase();

			// Check for model-specific keyword patterns
			if (
				content.includes("sighting") ||
				content.includes("ufo") ||
				content.includes("shape")
			) {
				return "sightings";
			}

			if (content.includes("testimony") || content.includes("witness")) {
				return "testimonies";
			}

			if (content.includes("event") || content.includes("incident")) {
				return "events";
			}

			if (
				content.includes("person") ||
				content.includes("rank") ||
				content.includes("authority")
			) {
				return "personnel";
			}

			if (content.includes("organization") || content.includes("agency")) {
				return "organizations";
			}

			if (content.includes("artifact") || content.includes("relic")) {
				return "artifacts";
			}
		}

		// Default to first matching model type for this extension
		return mappings[extension][0];
	}

	// Unknown file type
	return null;
}
