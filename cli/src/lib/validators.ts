import * as fs from "fs";
import * as path from "path";
import {
	getValidationSchema,
	ModelSchema,
	type ValidationRule,
} from "./modelRegistry";
import { readMetadata, writeMetadata } from "./bucketManager";

/**
 * Validation result interface
 */
export interface ValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
	data?: any;
}

/**
 * Validate data against a model schema
 * @param modelName The model to validate against
 * @param data The data to validate
 * @returns Validation result with errors and warnings
 */
export function validateAgainstSchema(
	modelName: string,
	data: any,
): ValidationResult {
	const schema = getValidationSchema(modelName);
	const errors: string[] = [];
	const warnings: string[] = [];

	// Check for required fields
	for (const rule of schema.rules.filter((r) => r.required)) {
		if (
			data[rule.field] === undefined ||
			data[rule.field] === null ||
			data[rule.field] === ""
		) {
			errors.push(`Missing required field: ${rule.field}`);
		}
	}

	// Validate field types
	for (const rule of schema.rules) {
		const value = data[rule.field];
		if (value !== undefined && value !== null) {
			validateFieldType(rule, value, errors, warnings);
		}
	}

	// Check for fields that don't exist in schema (extra fields)
	for (const field in data) {
		if (!schema.rules.some((rule) => rule.field === field)) {
			warnings.push(`Field "${field}" is not defined in the schema`);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		data,
	};
}

/**
 * Validate a specific field against its type rule
 */
function validateFieldType(
	rule: ValidationRule,
	value: any,
	errors: string[],
	warnings: string[],
) {
	switch (rule.type) {
		case "string":
		case "text":
			if (typeof value !== "string") {
				errors.push(
					`Field "${rule.field}" must be a string. Got: ${typeof value}`,
				);
			}
			break;

		case "int":
			if (!Number.isInteger(Number(value))) {
				errors.push(`Field "${rule.field}" must be an integer. Got: ${value}`);
			}
			break;

		case "float":
			if (isNaN(Number(value))) {
				errors.push(`Field "${rule.field}" must be a number. Got: ${value}`);
			}
			break;

		case "datetime":
			if (!(value instanceof Date) && isNaN(Date.parse(String(value)))) {
				errors.push(
					`Field "${rule.field}" must be a valid date. Got: ${value}`,
				);
			}
			break;

		case "boolean":
			if (typeof value !== "boolean" && value !== "true" && value !== "false") {
				errors.push(`Field "${rule.field}" must be a boolean. Got: ${value}`);
			}
			break;

		case "link":
			// Link fields should be objects with id property or just id strings
			if (typeof value !== "object" && typeof value !== "string") {
				errors.push(
					`Field "${rule.field}" must be a link reference. Got: ${typeof value}`,
				);
			}

			// If we had access to the database, we could verify the link target exists
			if (rule.linkTable) {
				warnings.push(
					`Link field "${rule.field}" references table "${rule.linkTable}" - validation not implemented`,
				);
			}
			break;

		case "multiple":
			if (!Array.isArray(value)) {
				errors.push(
					`Field "${rule.field}" must be an array. Got: ${typeof value}`,
				);
			}
			break;

		case "file":
			// For file fields, just check if it's a string (file path) or object with URL
			if (typeof value !== "string" && typeof value !== "object") {
				errors.push(
					`Field "${rule.field}" must be a file reference. Got: ${typeof value}`,
				);
			}
			break;

		case "file[]":
			if (!Array.isArray(value)) {
				errors.push(
					`Field "${rule.field}" must be an array of file references. Got: ${typeof value}`,
				);
			}
			break;

		case "json":
			// Ensure it can be serialized to JSON without error
			try {
				if (typeof value === "string") {
					JSON.parse(value);
				} else {
					JSON.stringify(value);
				}
			} catch (e) {
				errors.push(
					`Field "${rule.field}" must be valid JSON. Error: ${e.message}`,
				);
			}
			break;

		case "email":
			// Simple email regex validation
			if (typeof value === "string") {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) {
					errors.push(
						`Field "${rule.field}" must be a valid email address. Got: ${value}`,
					);
				}
			} else {
				errors.push(
					`Field "${rule.field}" must be a string email. Got: ${typeof value}`,
				);
			}
			break;

		case "vector":
			// Vector fields should be arrays of numbers
			if (!Array.isArray(value)) {
				errors.push(
					`Field "${rule.field}" must be a vector array. Got: ${typeof value}`,
				);
			} else {
				// Check if all elements are numbers
				if (!value.every((item) => typeof item === "number")) {
					errors.push(`Field "${rule.field}" must contain only numbers.`);
				}
			}
			break;

		default:
			warnings.push(
				`No validation implemented for field type "${rule.type}" for field "${rule.field}"`,
			);
	}
}

/**
 * Validate file content against its expected model
 * @param filePath Path to the file to validate
 * @param modelName The model to validate against
 */
export async function validateFile(
	filePath: string,
	modelName: string,
): Promise<ValidationResult> {
	try {
		// Read file content
		const content = fs.readFileSync(filePath, "utf8");
		let data: any;

		// Parse file based on extension
		const extension = path.extname(filePath).toLowerCase();

		if (extension === ".json") {
			data = JSON.parse(content);
		} else if (extension === ".csv") {
			// Simple CSV parsing - this could be improved
			const lines = content.split("\n");
			const headers = lines[0].split(",").map((h) => h.trim());

			if (lines.length > 1) {
				const values = lines[1].split(",").map((v) => v.trim());
				data = {};
				headers.forEach((header, i) => {
					data[header] = values[i];
				});
			} else {
				return {
					valid: false,
					errors: ["Empty or invalid CSV file"],
					warnings: [],
				};
			}
		} else {
			// For text files like Markdown, we'd need more sophisticated parsing
			// For now, just return a warning
			return {
				valid: false,
				errors: [
					`File type ${extension} not supported for automatic validation`,
				],
				warnings: ["Manual validation required for this file type"],
			};
		}

		// Handle arrays (collections of records)
		if (Array.isArray(data)) {
			if (data.length === 0) {
				return {
					valid: false,
					errors: ["File contains an empty array"],
					warnings: [],
				};
			}

			// Validate first item to check structure
			const sampleResult = validateAgainstSchema(modelName, data[0]);

			// If first item has errors, return those
			if (!sampleResult.valid) {
				return sampleResult;
			}

			// Validate all items
			const errors: string[] = [];
			const warnings: string[] = [];

			data.forEach((item, index) => {
				const result = validateAgainstSchema(modelName, item);
				if (!result.valid) {
					result.errors.forEach((error) => {
						errors.push(`Record #${index + 1}: ${error}`);
					});
				}

				result.warnings.forEach((warning) => {
					warnings.push(`Record #${index + 1}: ${warning}`);
				});
			});

			return {
				valid: errors.length === 0,
				errors,
				warnings,
				data,
			};
		} else {
			// Single record validation
			return validateAgainstSchema(modelName, data);
		}
	} catch (error) {
		return {
			valid: false,
			errors: [`File validation error: ${error.message}`],
			warnings: [],
		};
	}
}

/**
 * Update file metadata with validation results
 * @param filePath Path to the file
 * @param validationResult The validation result to store
 */
export function updateValidationMetadata(
	filePath: string,
	validationResult: ValidationResult,
): void {
	// Read existing metadata
	const metadata = readMetadata(filePath);

	if (metadata) {
		// Update with validation results
		metadata.validation = {
			valid: validationResult.valid,
			errors: validationResult.errors,
			warnings: validationResult.warnings,
		};

		// Update status based on validation
		metadata.status = validationResult.valid ? "validated" : "processing";

		// Add to processing history
		metadata.processingHistory.push({
			stage: "validation",
			timestamp: new Date().toISOString(),
		});

		// Write updated metadata
		writeMetadata(filePath, metadata);
	}
}

/**
 * Validate and transform a file for a specific model
 * @param filePath Path to the file
 * @param modelName The model to validate against
 * @param transformFn Optional transformation function to apply
 */
export async function validateAndTransform(
	filePath: string,
	modelName: string,
	transformFn?: (data: any) => any,
): Promise<ValidationResult> {
	// First validate the file
	let result = await validateFile(filePath, modelName);

	// If transform function provided and we have data
	if (transformFn && result.data) {
		try {
			// Apply transformation
			const transformedData = Array.isArray(result.data)
				? result.data.map(transformFn)
				: transformFn(result.data);

			// Validate the transformed data
			result = Array.isArray(transformedData)
				? validateAgainstSchema(modelName, transformedData[0]) // Just check first item for structure
				: validateAgainstSchema(modelName, transformedData);

			result.data = transformedData;

			// If valid, write transformed data back to file
			if (result.valid) {
				fs.writeFileSync(filePath, JSON.stringify(transformedData, null, 2));
			}
		} catch (error) {
			result.valid = false;
			result.errors.push(`Transformation error: ${error.message}`);
		}
	}

	// Update metadata with validation results
	updateValidationMetadata(filePath, result);

	return result;
}
