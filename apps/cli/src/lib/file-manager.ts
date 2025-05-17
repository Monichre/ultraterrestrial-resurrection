import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { getBucketPath, DataTypeConfig, BucketConfig } from "../config";

/**
 * File type interface
 */
export interface FileInfo {
	name: string;
	path: string;
	fullPath: string;
	extension: string;
	size: number;
	createdAt: Date;
	modifiedAt: Date;
	isDirectory: boolean;
}

/**
 * Error class for file operations
 */
export class FileOperationError extends Error {
	constructor(
		message: string,
		public cause?: Error,
	) {
		super(message);
		this.name = "FileOperationError";
	}
}

/**
 * Get the bucket path for a specific data type and stage
 * @param dataType The type of data
 * @param stage The stage/bucket
 * @returns The path to the bucket
 */
export function getBucketPath(
	dataType: keyof DataTypeConfig,
	stage: keyof BucketConfig,
): string {
	return getBucketPath(dataType, stage);
}

/**
 * List files in a bucket
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param pattern Optional file pattern to match
 * @returns Array of file info objects
 */
export async function listFiles(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	pattern = "*",
): Promise<FileInfo[]> {
	try {
		const bucketPath = getBucketPath(dataType, bucketStage);

		// Make sure the bucket exists
		if (!fs.existsSync(bucketPath)) {
			fs.mkdirSync(bucketPath, { recursive: true });
			return [];
		}

		// Find files matching the pattern
		const files = glob.sync(path.join(bucketPath, pattern));

		// Filter out .meta.json files
		const nonMetaFiles = files.filter((file) => !file.endsWith(".meta.json"));

		// Map to FileInfo objects
		return nonMetaFiles.map((filePath) => {
			const stats = fs.statSync(filePath);
			const parsed = path.parse(filePath);

			return {
				name: parsed.base,
				path: path.relative(bucketPath, filePath),
				fullPath: filePath,
				extension: parsed.ext,
				size: stats.size,
				createdAt: stats.birthtime,
				modifiedAt: stats.mtime,
				isDirectory: stats.isDirectory(),
			};
		});
	} catch (error) {
		throw new FileOperationError(
			`Failed to list files in ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}

/**
 * Read a file from a bucket
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file
 * @returns The file content as a string
 */
export async function readFile(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	fileName: string,
): Promise<string> {
	try {
		const filePath = path.join(getBucketPath(dataType, bucketStage), fileName);

		if (!fs.existsSync(filePath)) {
			throw new FileOperationError(`File not found: ${fileName}`);
		}

		return fs.readFileSync(filePath, "utf8");
	} catch (error) {
		throw new FileOperationError(
			`Failed to read file ${fileName} from ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}

/**
 * Write a file to a bucket
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file
 * @param content The content to write
 * @returns Promise that resolves when the file is written
 */
export async function writeFile(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	fileName: string,
	content: string,
): Promise<void> {
	try {
		const bucketPath = getBucketPath(dataType, bucketStage);

		// Make sure the bucket exists
		if (!fs.existsSync(bucketPath)) {
			fs.mkdirSync(bucketPath, { recursive: true });
		}

		const filePath = path.join(bucketPath, fileName);
		fs.writeFileSync(filePath, content, "utf8");
	} catch (error) {
		throw new FileOperationError(
			`Failed to write file ${fileName} to ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}

/**
 * Move a file from one bucket to another
 * @param dataType The type of data
 * @param sourceBucket The source bucket
 * @param targetBucket The target bucket
 * @param fileName The name of the file
 * @returns Promise that resolves when the file is moved
 */
export async function moveFile(
	dataType: keyof DataTypeConfig,
	sourceBucket: keyof BucketConfig,
	targetBucket: keyof BucketConfig,
	fileName: string,
): Promise<void> {
	try {
		const sourcePath = path.join(
			getBucketPath(dataType, sourceBucket),
			fileName,
		);
		const targetPath = path.join(
			getBucketPath(dataType, targetBucket),
			fileName,
		);

		// Make sure the source file exists
		if (!fs.existsSync(sourcePath)) {
			throw new FileOperationError(`Source file not found: ${fileName}`);
		}

		// Make sure the target directory exists
		const targetDir = path.dirname(targetPath);
		if (!fs.existsSync(targetDir)) {
			fs.mkdirSync(targetDir, { recursive: true });
		}

		// Copy the file to the target
		fs.copyFileSync(sourcePath, targetPath);

		// Delete the source file
		fs.unlinkSync(sourcePath);
	} catch (error) {
		throw new FileOperationError(
			`Failed to move file ${fileName} from ${sourceBucket} to ${targetBucket} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}

/**
 * Delete a file from a bucket
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file
 * @returns Promise that resolves when the file is deleted
 */
export async function deleteFile(
	dataType: keyof DataTypeConfig,
	bucketStage: keyof BucketConfig,
	fileName: string,
): Promise<void> {
	try {
		const filePath = path.join(getBucketPath(dataType, bucketStage), fileName);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		} else {
			throw new FileOperationError(`File not found: ${fileName}`);
		}
	} catch (error) {
		throw new FileOperationError(
			`Failed to delete file ${fileName} from ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}

/**
 * Copy a file from one bucket to another
 * @param dataType The type of data
 * @param sourceBucket The source bucket
 * @param targetBucket The target bucket
 * @param fileName The name of the file
 * @returns Promise that resolves when the file is copied
 */
export async function copyFile(
	dataType: keyof DataTypeConfig,
	sourceBucket: keyof BucketConfig,
	targetBucket: keyof BucketConfig,
	fileName: string,
): Promise<void> {
	try {
		const sourcePath = path.join(
			getBucketPath(dataType, sourceBucket),
			fileName,
		);
		const targetPath = path.join(
			getBucketPath(dataType, targetBucket),
			fileName,
		);

		// Make sure the source file exists
		if (!fs.existsSync(sourcePath)) {
			throw new FileOperationError(`Source file not found: ${fileName}`);
		}

		// Make sure the target directory exists
		const targetDir = path.dirname(targetPath);
		if (!fs.existsSync(targetDir)) {
			fs.mkdirSync(targetDir, { recursive: true });
		}

		// Copy the file to the target
		fs.copyFileSync(sourcePath, targetPath);
	} catch (error) {
		throw new FileOperationError(
			`Failed to copy file ${fileName} from ${sourceBucket} to ${targetBucket} bucket for ${dataType}: ${(error as Error).message}`,
			error as Error,
		);
	}
}
