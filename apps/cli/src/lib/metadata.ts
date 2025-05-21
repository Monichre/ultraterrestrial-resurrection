import * as path from "path";
import * as fs from "fs";
import { DataTypeConfig, BucketConfig, getBucketPath } from "../config";
import * as fileManager from "./file-manager";

/**
 * Interface for validation result
 */
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

/**
 * Interface for file metadata
 */
export interface FileMetadata {
	// File identification
	fileName: string;
	dataType: keyof DataTypeConfig;
	originalFileName?: string;

	// Processing information
	processingTimestamp: string;
	processingDuration?: number; // in milliseconds

	// Quality metrics
	qualityScore: number; // 0-100
	qualityIssues: string[];
	validationResults?: ValidationResult;

	// Content information
	recordCount: number;
	contentSummary?: string;
	schemaDescription?: any;

	// Target database information
	targetTable: string;
	targetFields?: string[];

	// Status tracking
	status:
		| "processing"
		| "review"
		| "approved"
		| "rejected"
		| "inserted"
		| "failed";
	statusMessage?: string;

	// Workflow tracking
	workflowSteps: WorkflowStep[];

	// Custom metadata for specific data types
	custom?: Record<string, any>;
}

/**
 * Interface for workflow step
 */
export interface WorkflowStep {
	stage: string;
	timestamp: string;
	duration?: number;
	user?: string;
	notes?: string;
}

/**
 * Error class for metadata operations
 */
export class MetadataError extends Error {
	constructor(
		message: string,
		public cause?: Error,
	) {
		super(message);
		this.name = "MetadataError";
	}
}

/**
 * Get metadata file path for a file
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file
 * @returns Path to the metadata file
 */
function getMetadataFilePath(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	fileName: string,
): string {
	// Construct metadata filename by adding .meta.json suffix
	const metadataFileName = `${fileName}.meta.json`;
	return path.join(
		fileManager.getBucketPath(dataType, bucketStage),
		metadataFileName,
	);
}

/**
 * Check if metadata exists for a file
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file
 * @returns True if metadata exists
 */
export async function metadataExists(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	fileName: string,
): Promise<boolean> {
	const metadataPath = getMetadataFilePath(dataType, bucketStage, fileName);
	return fs.existsSync(metadataPath);
}

/**
 * Read metadata for a file
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file
 * @returns The file metadata
 */
export async function readMetadata(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	fileName: string,
): Promise<FileMetadata> {
	try {
		const metadataPath = getMetadataFilePath(dataType, bucketStage, fileName);

		if (!fs.existsSync(metadataPath)) {
			throw new MetadataError(`Metadata not found for file: ${fileName}`);
		}

		const metadataContent = fs.readFileSync(metadataPath, "utf8");
		return JSON.parse(metadataContent) as FileMetadata;
	} catch (error) {
		throw new MetadataError(
			`Failed to read metadata for file ${fileName} in ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}

/**
 * Write metadata for a file
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file
 * @param metadata The metadata to write
 */
export async function writeMetadata(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	fileName: string,
	metadata: FileMetadata,
): Promise<void> {
	try {
		const metadataPath = getMetadataFilePath(dataType, bucketStage, fileName);
		const metadataContent = JSON.stringify(metadata, null, 2);
		fs.writeFileSync(metadataPath, metadataContent, "utf8");
	} catch (error) {
		throw new MetadataError(
			`Failed to write metadata for file ${fileName} in ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}

/**
 * Create metadata for a file
 * @param dataType The type of data
 * @param fileName The name of the file
 * @param options Options for metadata creation
 * @returns The created file metadata
 */
export function createMetadata(
	dataType: keyof DataTypeConfig,
	fileName: string,
	options: {
		originalFileName?: string;
		recordCount?: number;
		targetTable?: string;
		qualityScore?: number;
		qualityIssues?: string[];
		contentSummary?: string;
		schemaDescription?: any;
		custom?: Record<string, any>;
	} = {},
): FileMetadata {
	// Set default target table based on data type
	const defaultTargetTable = dataType.toString();

	const metadata: FileMetadata = {
		fileName,
		dataType,
		originalFileName: options.originalFileName || fileName,
		processingTimestamp: new Date().toISOString(),
		qualityScore: options.qualityScore || 0,
		qualityIssues: options.qualityIssues || [],
		recordCount: options.recordCount || 0,
		contentSummary: options.contentSummary,
		schemaDescription: options.schemaDescription,
		targetTable: options.targetTable || defaultTargetTable,
		status: "processing",
		workflowSteps: [
			{
				stage: "created",
				timestamp: new Date().toISOString(),
			},
		],
		custom: options.custom,
	};

	return metadata;
}

/**
 * Update metadata for a file
 * @param metadata The original metadata
 * @param updates Partial metadata to update
 * @returns Updated file metadata
 */
export function updateMetadata(
	metadata: FileMetadata,
	updates: Partial<FileMetadata> & { message?: string; notes?: string },
): FileMetadata {
	const updatedMetadata = { ...metadata, ...updates };

	// If status changed, add a workflow step
	if (updates.status && updates.status !== metadata.status) {
		updatedMetadata.workflowSteps = [
			...metadata.workflowSteps,
			{
				stage: updates.status,
				timestamp: new Date().toISOString(),
				notes: updates.notes || updates.message || updates.statusMessage,
			},
		];
	}

	return updatedMetadata;
}

/**
 * Move metadata from one bucket stage to another
 * @param dataType The type of data
 * @param sourceBucket The source bucket
 * @param targetBucket The target bucket
 * @param fileName The name of the file
 * @param updates Optional metadata updates
 */
export async function moveMetadata(
	dataType: keyof DataTypeConfig,
	sourceBucket: keyof BucketConfig,
	targetBucket: keyof BucketConfig,
	fileName: string,
	updates?: {
		status?: FileMetadata["status"];
		message?: string;
		notes?: string;
	},
): Promise<void> {
	// Read metadata from source
	const metadata = await readMetadata(dataType, sourceBucket, fileName);

	// Update metadata
	const updatedMetadata = updates
		? updateMetadata(metadata, {
				status: updates.status,
				statusMessage: updates.message,
				notes: updates.notes,
			})
		: metadata;

	// Add workflow step for the move if not already added by updateMetadata
	if (!updates || !updates.status) {
		updatedMetadata.workflowSteps.push({
			stage: `moved_to_${targetBucket}`,
			timestamp: new Date().toISOString(),
			notes: updates?.notes || updates?.message,
		});
	}

	// Write metadata to target
	await writeMetadata(dataType, targetBucket, fileName, updatedMetadata);

	// Delete source metadata if different from target
	if (sourceBucket !== targetBucket) {
		try {
			const sourceMetadataPath = getMetadataFilePath(
				dataType,
				sourceBucket,
				fileName,
			);
			if (fs.existsSync(sourceMetadataPath)) {
				fs.unlinkSync(sourceMetadataPath);
			}
		} catch (error) {
			console.error(
				`Failed to delete source metadata for ${fileName}: ${(error as Error).message}`,
			);
			// Non-fatal error, don't throw
		}
	}
}

/**
 * Validate metadata for completeness and consistency
 * @param metadata The metadata to validate
 * @returns Validation result
 */
export function validateMetadata(metadata: FileMetadata): ValidationResult {
	const issues: string[] = [];
	const warnings: string[] = [];

	// Check required fields
	if (!metadata.fileName) {
		issues.push("Missing fileName");
	}

	if (!metadata.dataType) {
		issues.push("Missing dataType");
	}

	if (!metadata.targetTable) {
		issues.push("Missing targetTable");
	}

	// Check quality score range
	if (metadata.qualityScore < 0 || metadata.qualityScore > 100) {
		issues.push("qualityScore must be between 0 and 100");
	}

	// Check workflow steps
	if (!metadata.workflowSteps || metadata.workflowSteps.length === 0) {
		warnings.push("No workflow steps found");
	}

	// Calculate validation score
	const maxIssues = 5; // Maximum number of issues to consider for scoring
	const issueCount = Math.min(issues.length, maxIssues);
	const score = Math.max(0, 100 - issueCount * 20); // Each issue reduces score by 20 (up to 100)

	return {
		isValid: issues.length === 0,
		errors: issues,
		warnings,
	};
}
