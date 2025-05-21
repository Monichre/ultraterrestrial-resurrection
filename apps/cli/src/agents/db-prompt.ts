import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { DataTypeConfig } from "../config";
import { aiAssistant, AIResponse } from "./ai-assistant";

/**
 * Interface for schema analysis result
 */
export interface SchemaAnalysisResult {
	tables: SchemaTable[];
	relationships: SchemaRelationship[];
	recommendations: string[];
	warnings: string[];
}

/**
 * Interface for a table schema
 */
export interface SchemaTable {
	name: string;
	description: string;
	columns: SchemaColumn[];
}

/**
 * Interface for a schema column
 */
export interface SchemaColumn {
	name: string;
	type: string;
	description: string;
	required: boolean;
	unique: boolean;
	defaultValue?: any;
	references?: string; // Format: table.column
}

/**
 * Interface for a schema relationship
 */
export interface SchemaRelationship {
	fromTable: string;
	fromColumn: string;
	toTable: string;
	toColumn: string;
	type: "one-to-one" | "one-to-many" | "many-to-many";
	description: string;
}

/**
 * Class for database schema analysis and generation
 */
class DBPromptAgent {
	/**
	 * Analyze text content to suggest a database schema
	 * @param content The text content to analyze
	 * @param dataType The type of data being analyzed
	 * @returns Schema analysis result
	 */
	async analyzeContent(
		content: string,
		dataType: keyof DataTypeConfig,
	): Promise<SchemaAnalysisResult> {
		try {
			console.log(
				chalk.blue(
					`Analyzing content to suggest database schema for ${dataType}...`,
				),
			);

			// Create system prompt
			const systemPrompt = this.createSystemPrompt(dataType);

			// Make AI request
			const response = await aiAssistant.enhanceContent(content, {
				systemPrompt,
				outputFormat: "json",
				model: "claude-3-opus-20240229", // Use most capable model for schema analysis
			});

			// Parse response
			let analysisResult: SchemaAnalysisResult;

			try {
				if (typeof response.enhanced === "string") {
					analysisResult = JSON.parse(response.enhanced);
				} else {
					analysisResult = response.enhanced as unknown as SchemaAnalysisResult;
				}

				// Validate schema result
				this.validateSchemaResult(analysisResult);

				return analysisResult;
			} catch (parseError) {
				console.error(
					chalk.red("Failed to parse AI response as schema:"),
					parseError,
				);
				throw new Error(
					`Failed to parse AI schema response: ${(parseError as Error).message}`,
				);
			}
		} catch (error) {
			console.error(chalk.red("Error analyzing content for schema:"), error);
			throw new Error(`Schema analysis failed: ${(error as Error).message}`);
		}
	}

	/**
	 * Generate Xata schema definition based on the analysis
	 * @param analysis Schema analysis result
	 * @returns Xata schema definition as JSON string
	 */
	generateXataSchema(analysis: SchemaAnalysisResult): string {
		try {
			console.log(chalk.blue("Generating Xata schema definition..."));

			// Create Xata schema object
			const xataSchema = {
				tables: analysis.tables.map((table) => ({
					name: table.name,
					columns: table.columns.map((column) => {
						const xataColumn: any = {
							name: column.name,
							type: this.mapToXataType(column.type),
							description: column.description,
							unique: column.unique,
						};

						// Handle references
						if (column.references) {
							const [refTable, refColumn] = column.references.split(".");
							xataSchema.links = xataSchema.links || [];
							xataSchema.links.push({
								name: `${table.name}_${column.name}_to_${refTable}`,
								from: {
									table: table.name,
									column: column.name,
								},
								to: {
									table: refTable,
									column: refColumn || "id",
								},
							});
						}

						return xataColumn;
					}),
				})),
			};

			return JSON.stringify(xataSchema, null, 2);
		} catch (error) {
			console.error(chalk.red("Error generating Xata schema:"), error);
			throw new Error(`Schema generation failed: ${(error as Error).message}`);
		}
	}

	/**
	 * Create a system prompt for the AI based on the data type
	 * @param dataType The type of data
	 * @returns System prompt
	 */
	private createSystemPrompt(dataType: keyof DataTypeConfig): string {
		return `You are an expert database architect specializing in designing schemas for ${dataType} data.
Your task is to analyze the provided content and suggest an optimal database schema for storing and querying this information.

Follow these guidelines:
1. Create a normalized schema with appropriate tables and relationships
2. Use clear, descriptive names for tables and columns
3. Choose appropriate data types for each column
4. Indicate required fields, unique constraints, and default values
5. Define relationships between tables (one-to-one, one-to-many, many-to-many)
6. Include recommendations for indexes or optimizations
7. Note any potential issues or warnings

Respond with a JSON object containing the following structure:
{
  "tables": [
    {
      "name": "string",
      "description": "string",
      "columns": [
        {
          "name": "string",
          "type": "string",
          "description": "string",
          "required": boolean,
          "unique": boolean,
          "defaultValue": any,
          "references": "table.column"
        }
      ]
    }
  ],
  "relationships": [
    {
      "fromTable": "string",
      "fromColumn": "string",
      "toTable": "string",
      "toColumn": "string",
      "type": "one-to-one|one-to-many|many-to-many",
      "description": "string"
    }
  ],
  "recommendations": ["string"],
  "warnings": ["string"]
}

For column types, use standard SQL types (INTEGER, TEXT, BOOLEAN, TIMESTAMP, etc.) that can be mapped to Xata types.`;
	}

	/**
	 * Map SQL type to Xata type
	 * @param sqlType SQL type
	 * @returns Xata type
	 */
	private mapToXataType(sqlType: string): string {
		const typeMap: Record<string, string> = {
			INTEGER: "int",
			INT: "int",
			BIGINT: "int",
			FLOAT: "float",
			DOUBLE: "float",
			DECIMAL: "float",
			TEXT: "text",
			VARCHAR: "string",
			CHAR: "string",
			STRING: "string",
			BOOLEAN: "bool",
			BOOL: "bool",
			TIMESTAMP: "datetime",
			DATETIME: "datetime",
			DATE: "datetime",
			TIME: "datetime",
			JSON: "json",
			OBJECT: "json",
			ARRAY: "multiple",
			EMAIL: "email",
			URL: "string",
			FILE: "file",
			BINARY: "file",
			BLOB: "file",
		};

		const normalizedType = sqlType.toUpperCase().trim();
		return typeMap[normalizedType] || "string"; // Default to string for unknown types
	}

	/**
	 * Validate schema analysis result
	 * @param schema Schema analysis result
	 * @throws Error if validation fails
	 */
	private validateSchemaResult(schema: SchemaAnalysisResult): void {
		if (
			!schema.tables ||
			!Array.isArray(schema.tables) ||
			schema.tables.length === 0
		) {
			throw new Error("Schema must contain at least one table");
		}

		// Check that each table has a name and columns
		for (const table of schema.tables) {
			if (!table.name) {
				throw new Error("Each table must have a name");
			}

			if (
				!table.columns ||
				!Array.isArray(table.columns) ||
				table.columns.length === 0
			) {
				throw new Error(`Table '${table.name}' must have at least one column`);
			}

			// Check that each column has a name and type
			for (const column of table.columns) {
				if (!column.name) {
					throw new Error(`Column in table '${table.name}' is missing a name`);
				}

				if (!column.type) {
					throw new Error(
						`Column '${column.name}' in table '${table.name}' is missing a type`,
					);
				}
			}
		}
	}
}

// Export singleton instance
export const dbPromptAgent = new DBPromptAgent();

// Export types
export type {
	SchemaAnalysisResult,
	SchemaTable,
	SchemaColumn,
	SchemaRelationship,
};
