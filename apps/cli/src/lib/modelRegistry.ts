import { tables } from "../../../src/db/xata/xata";
import * as path from "node:path";
import * as fs from "node:fs";
import chalk from "chalk";

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
 * Interface for model configuration
 */
export interface ModelConfig {
	id: string;
	provider: "anthropic" | "openai" | "llama" | "local" | string;
	name: string;
	version: string;
	description: string;
	capabilities: string[];
	maxTokens: number;
	contextWindow: number;
	costPer1KTokens: number;
	apiConfig?: Record<string, any>;
	defaultRequestParams?: Record<string, any>;
}

/**
 * Interface for model registry state
 */
interface ModelRegistryState {
	models: ModelConfig[];
	defaultModel: string | null;
}

/**
 * Class for managing AI model configurations
 */
class ModelRegistry {
	private registryFilePath: string;
	private models: Map<string, ModelConfig>;
	private defaultModelId: string | null;

	constructor() {
		this.registryFilePath = path.join(
			__dirname,
			"../../../config/model-registry.json",
		);
		this.models = new Map();
		this.defaultModelId = null;

		// Load models from registry file if it exists
		this.loadModels();
	}

	/**
	 * Load models from the registry file
	 */
	private loadModels(): void {
		try {
			if (fs.existsSync(this.registryFilePath)) {
				const data = fs.readFileSync(this.registryFilePath, "utf-8");
				const registry = JSON.parse(data) as ModelRegistryState;

				// Populate models map
				registry.models.forEach((model) => {
					this.models.set(model.id, model);
				});

				// Set default model
				this.defaultModelId = registry.defaultModel;

				console.log(
					chalk.green(`Loaded ${this.models.size} models from registry`),
				);
			} else {
				// Initialize with default models
				this.initializeDefaultModels();
				console.log(
					chalk.yellow(
						"Model registry file not found, initialized with default models",
					),
				);
			}
		} catch (error) {
			console.error(chalk.red("Failed to load model registry:"), error);
			// Initialize with default models in case of error
			this.initializeDefaultModels();
		}
	}

	/**
	 * Initialize with default model configurations
	 */
	private initializeDefaultModels(): void {
		// Anthropic models
		this.registerModel({
			id: "claude-3-opus-20240229",
			provider: "anthropic",
			name: "Claude 3 Opus",
			version: "20240229",
			description: "Most powerful Claude model for highly complex tasks",
			capabilities: ["text", "reasoning", "code", "analysis"],
			maxTokens: 200000,
			contextWindow: 200000,
			costPer1KTokens: 0.015,
			defaultRequestParams: {
				temperature: 0.7,
				topP: 0.9,
			},
		});

		this.registerModel({
			id: "claude-3-sonnet-20240229",
			provider: "anthropic",
			name: "Claude 3 Sonnet",
			version: "20240229",
			description: "Balanced Claude model for most use cases",
			capabilities: ["text", "reasoning", "code"],
			maxTokens: 180000,
			contextWindow: 180000,
			costPer1KTokens: 0.003,
			defaultRequestParams: {
				temperature: 0.7,
				topP: 0.9,
			},
		});

		this.registerModel({
			id: "claude-3-haiku-20240229",
			provider: "anthropic",
			name: "Claude 3 Haiku",
			version: "20240229",
			description: "Fastest Claude model for simpler tasks",
			capabilities: ["text", "basic-reasoning"],
			maxTokens: 180000,
			contextWindow: 180000,
			costPer1KTokens: 0.00025,
			defaultRequestParams: {
				temperature: 0.7,
				topP: 0.9,
			},
		});

		// OpenAI models
		this.registerModel({
			id: "gpt-4o",
			provider: "openai",
			name: "GPT-4o",
			version: "2024",
			description: "Latest GPT-4 model with enhanced capabilities",
			capabilities: ["text", "reasoning", "code", "analysis"],
			maxTokens: 128000,
			contextWindow: 128000,
			costPer1KTokens: 0.005,
			defaultRequestParams: {
				temperature: 0.7,
				topP: 1,
			},
		});

		this.registerModel({
			id: "gpt-3.5-turbo",
			provider: "openai",
			name: "GPT-3.5 Turbo",
			version: "2024",
			description: "Fast and cost-effective general purpose model",
			capabilities: ["text", "basic-reasoning", "basic-code"],
			maxTokens: 16000,
			contextWindow: 16000,
			costPer1KTokens: 0.0005,
			defaultRequestParams: {
				temperature: 0.7,
				topP: 1,
			},
		});

		// Set default model
		this.setDefaultModel("claude-3-sonnet-20240229");

		// Save initialized models
		this.saveModels();
	}

	/**
	 * Save models to the registry file
	 */
	private saveModels(): void {
		try {
			// Ensure directory exists
			const dir = path.dirname(this.registryFilePath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			// Create registry state
			const registryState: ModelRegistryState = {
				models: Array.from(this.models.values()),
				defaultModel: this.defaultModelId,
			};

			// Write to file
			fs.writeFileSync(
				this.registryFilePath,
				JSON.stringify(registryState, null, 2),
				"utf-8",
			);
		} catch (error) {
			console.error(chalk.red("Failed to save model registry:"), error);
		}
	}

	/**
	 * Register a new model or update existing one
	 * @param modelConfig The model configuration
	 * @returns The registered model
	 */
	registerModel(modelConfig: ModelConfig): ModelConfig {
		this.models.set(modelConfig.id, modelConfig);
		this.saveModels();
		return modelConfig;
	}

	/**
	 * Get a model by ID
	 * @param id The model ID
	 * @returns The model configuration or null if not found
	 */
	getModel(id: string): ModelConfig | null {
		return this.models.get(id) || null;
	}

	/**
	 * Get the default model
	 * @returns The default model configuration or null if not set
	 */
	getDefaultModel(): ModelConfig | null {
		return this.defaultModelId
			? this.models.get(this.defaultModelId) || null
			: null;
	}

	/**
	 * Set the default model
	 * @param id The model ID to set as default
	 * @returns True if successful, false if model not found
	 */
	setDefaultModel(id: string): boolean {
		if (this.models.has(id)) {
			this.defaultModelId = id;
			this.saveModels();
			return true;
		}
		return false;
	}

	/**
	 * Get all available models
	 * @returns Array of model configurations
	 */
	getAllModels(): ModelConfig[] {
		return Array.from(this.models.values());
	}

	/**
	 * Get models filtered by provider
	 * @param provider The provider to filter by
	 * @returns Array of matching model configurations
	 */
	getModelsByProvider(provider: string): ModelConfig[] {
		return Array.from(this.models.values()).filter(
			(model) => model.provider === provider,
		);
	}

	/**
	 * Get models filtered by capability
	 * @param capability The capability to filter by
	 * @returns Array of matching model configurations
	 */
	getModelsByCapability(capability: string): ModelConfig[] {
		return Array.from(this.models.values()).filter((model) =>
			model.capabilities.includes(capability),
		);
	}

	/**
	 * Calculate expected token cost for a model
	 * @param modelId The model ID
	 * @param tokenCount The number of tokens
	 * @returns The estimated cost or -1 if model not found
	 */
	calculateCost(modelId: string, tokenCount: number): number {
		const model = this.getModel(modelId);
		if (!model) {
			return -1;
		}
		return (tokenCount / 1000) * model.costPer1KTokens;
	}

	/**
	 * Recommend the most suitable model for a task
	 * @param requiredCapabilities The capabilities required
	 * @param preferredProvider Optional preferred provider
	 * @param maxCostPer1KTokens Optional maximum cost per 1K tokens
	 * @returns The recommended model or the default model if no match
	 */
	recommendModel(
		requiredCapabilities: string[],
		preferredProvider?: string,
		maxCostPer1KTokens?: number,
	): ModelConfig {
		// Filter models by capabilities
		let candidates = Array.from(this.models.values()).filter((model) =>
			requiredCapabilities.every((cap) => model.capabilities.includes(cap)),
		);

		// Filter by provider if specified
		if (preferredProvider) {
			const providerCandidates = candidates.filter(
				(model) => model.provider === preferredProvider,
			);
			if (providerCandidates.length > 0) {
				candidates = providerCandidates;
			}
		}

		// Filter by cost if specified
		if (maxCostPer1KTokens !== undefined) {
			const costCandidates = candidates.filter(
				(model) => model.costPer1KTokens <= maxCostPer1KTokens,
			);
			if (costCandidates.length > 0) {
				candidates = costCandidates;
			}
		}

		// If no candidates match, return default model
		if (candidates.length === 0) {
			const defaultModel = this.getDefaultModel();
			if (defaultModel) {
				return defaultModel;
			}
			// If no default model, return first available model
			return Array.from(this.models.values())[0];
		}

		// Sort by cost (ascending)
		candidates.sort((a, b) => a.costPer1KTokens - b.costPer1KTokens);

		// Return the cheapest suitable model
		return candidates[0];
	}
}

// Export singleton instance
export const modelRegistry = new ModelRegistry();

// Export types
export type { ModelConfig };

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
