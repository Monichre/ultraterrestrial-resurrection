import * as fs from "fs";
import * as path from "path";
import { getAvailableModels, getModelNames } from "./modelRegistry";
import * as glob from "glob";

// Define bucket types
export enum BucketType {
	BACKLOG = "backlog",
	PROCESSING = "processing",
	REVIEW = "review",
	INSERTION = "insertion",
}

// File metadata interface
export interface FileMetadata {
	model: string;
	fileName: string;
	originalFileName?: string;
	recordCount?: number;
	createdAt: string;
	updatedAt: string;
	status: "new" | "processing" | "validated" | "rejected" | "approved";
	validation?: {
		valid: boolean;
		errors: string[];
		warnings: string[];
	};
	targetTable?: string;
	transformations?: Array<{
		type: string;
		field: string;
		applied: boolean;
	}>;
	processingHistory: Array<{
		stage: string;
		timestamp: string;
	}>;
}

// File info interface
export interface FileInfo {
	name: string;
	path: string;
	size: number;
	extension: string;
	modifiedAt: Date;
	isDirectory: boolean;
	metadata?: FileMetadata;
}

/**
 * Get the base path for all data buckets
 */
export function getBaseBucketPath(): string {
	// This could be made configurable via env vars or config file
	return path.resolve(process.cwd(), "data");
}

/**
 * Get the path for a specific model and bucket
 */
export function getModelBucketPath(model: string, bucket: BucketType): string {
	return path.join(getBaseBucketPath(), bucket, model);
}

/**
 * Create all necessary bucket directories for each model
 */
export async function ensureBucketStructure(): Promise<void> {
	const models = getModelNames();

	// Create bucket directories for each model
	for (const model of models) {
		for (const bucket of Object.values(BucketType)) {
			const dir = path.join(getBaseBucketPath(), bucket, model);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
		}
	}
}

/**
 * Create initial metadata for a file
 */
export function createMetadata(
	model: string,
	fileName: string,
	originalFileName?: string,
): FileMetadata {
	const now = new Date().toISOString();

	return {
		model,
		fileName,
		originalFileName,
		createdAt: now,
		updatedAt: now,
		status: "new",
		processingHistory: [
			{
				stage: "onboarded",
				timestamp: now,
			},
		],
	};
}

/**
 * Read metadata for a file if it exists
 */
export function readMetadata(filePath: string): FileMetadata | null {
	const metadataPath = `${filePath}.meta.json`;

	if (fs.existsSync(metadataPath)) {
		try {
			const content = fs.readFileSync(metadataPath, "utf8");
			return JSON.parse(content) as FileMetadata;
		} catch (error) {
			console.error(`Error reading metadata for ${filePath}:`, error);
		}
	}

	return null;
}

/**
 * Write metadata for a file
 */
export function writeMetadata(filePath: string, metadata: FileMetadata): void {
	const metadataPath = `${filePath}.meta.json`;

	// Update timestamp
	metadata.updatedAt = new Date().toISOString();

	fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Move a file between buckets
 */
export async function moveFile(
	filePath: string,
	model: string,
	sourceBucket: BucketType,
	targetBucket: BucketType,
	updateMetadata?: Partial<FileMetadata>,
): Promise<string> {
	const fileName = path.basename(filePath);
	const sourcePath = filePath;
	const targetPath = path.join(
		getModelBucketPath(model, targetBucket),
		fileName,
	);

	// Ensure target directory exists
	fs.mkdirSync(path.dirname(targetPath), { recursive: true });

	// Read existing metadata if available
	let metadata = readMetadata(sourcePath);

	if (!metadata) {
		// Create new metadata if none exists
		metadata = createMetadata(model, fileName);
	}

	// Update metadata with provided updates
	if (updateMetadata) {
		metadata = { ...metadata, ...updateMetadata };
	}

	// Add processing history entry
	metadata.processingHistory.push({
		stage: `moved_to_${targetBucket}`,
		timestamp: new Date().toISOString(),
	});

	// Copy file to new location
	fs.copyFileSync(sourcePath, targetPath);

	// Write updated metadata
	writeMetadata(targetPath, metadata);

	// Copy any associated files (like images)
	const sourceDir = path.dirname(sourcePath);
	const baseName = path.basename(fileName, path.extname(fileName));
	const relatedFiles = glob.sync(`${baseName}_*.*`, { cwd: sourceDir });

	for (const relatedFile of relatedFiles) {
		const relatedSourcePath = path.join(sourceDir, relatedFile);
		const relatedTargetPath = path.join(path.dirname(targetPath), relatedFile);
		fs.copyFileSync(relatedSourcePath, relatedTargetPath);
	}

	// Remove source file after successful copy
	if (fs.existsSync(sourcePath)) {
		fs.unlinkSync(sourcePath);

		// Remove source metadata file if it exists
		const sourceMetaPath = `${sourcePath}.meta.json`;
		if (fs.existsSync(sourceMetaPath)) {
			fs.unlinkSync(sourceMetaPath);
		}

		// Remove related source files
		for (const relatedFile of relatedFiles) {
			const relatedSourcePath = path.join(sourceDir, relatedFile);
			if (fs.existsSync(relatedSourcePath)) {
				fs.unlinkSync(relatedSourcePath);
			}
		}
	}

	return targetPath;
}

/**
 * List files in a specific bucket and model
 */
export async function listFiles(
	model: string,
	bucket: BucketType,
	pattern = "*",
): Promise<FileInfo[]> {
	const bucketPath = getModelBucketPath(model, bucket);

	if (!fs.existsSync(bucketPath)) {
		return [];
	}

	const filePattern = path.join(bucketPath, pattern);
	const files = glob.sync(filePattern);

	return Promise.all(
		files.map(async (filePath) => {
			const stats = fs.statSync(filePath);
			const info: FileInfo = {
				name: path.basename(filePath),
				path: filePath,
				size: stats.size,
				extension: path.extname(filePath),
				modifiedAt: stats.mtime,
				isDirectory: stats.isDirectory(),
			};

			// Get metadata if exists
			const metadata = readMetadata(filePath);
			if (metadata) {
				info.metadata = metadata;
			}

			return info;
		}),
	);
}

/**
 * Read file content
 */
export function readFile(
	model: string,
	bucket: BucketType,
	fileName: string,
): Promise<string> {
	const filePath = path.join(getModelBucketPath(model, bucket), fileName);

	return new Promise((resolve, reject) => {
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

/**
 * Write file content
 */
export function writeFile(
	model: string,
	bucket: BucketType,
	fileName: string,
	content: string,
): Promise<string> {
	const bucketPath = getModelBucketPath(model, bucket);
	const filePath = path.join(bucketPath, fileName);

	// Ensure directory exists
	fs.mkdirSync(path.dirname(filePath), { recursive: true });

	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, content, "utf8", (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(filePath);
			}
		});
	});
}

/**
 * Scan the backlog directory for files
 */
export async function scanBacklogDirectory(): Promise<FileInfo[]> {
	const results: FileInfo[] = [];
	const models = getModelNames();

	for (const model of models) {
		const files = await listFiles(model, BucketType.BACKLOG);
		results.push(...files);
	}

	return results;
}

/**
 * Get status summary of all buckets across all models
 */
export async function getBucketStatus(): Promise<
	Record<string, Record<BucketType, number>>
> {
	const models = getModelNames();
	const result: Record<string, Record<BucketType, number>> = {};

	for (const model of models) {
		result[model] = {
			[BucketType.BACKLOG]: 0,
			[BucketType.PROCESSING]: 0,
			[BucketType.REVIEW]: 0,
			[BucketType.INSERTION]: 0,
		};

		for (const bucket of Object.values(BucketType)) {
			const files = await listFiles(model, bucket);
			result[model][bucket] = files.length;
		}
	}

	return result;
}
