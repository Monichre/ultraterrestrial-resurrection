import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { getBucketPath, DataTypeConfig, BucketConfig } from '../config';

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
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'FileOperationError';
  }
}

/**
 * List files in a specific bucket for a data type
 * @param dataType The type of data (testimonies, events, etc.)
 * @param bucketStage The stage/bucket (processing, review, insertion)
 * @param pattern Optional glob pattern to filter files
 * @returns Array of FileInfo objects
 */
export async function listFiles(
  dataType: keyof DataTypeConfig,
  bucketStage: keyof BucketConfig,
  pattern = '*'
): Promise<FileInfo[]> {
  try {
    const bucketPath = getBucketPath(dataType, bucketStage);
    
    // Ensure the directory exists
    if (!fs.existsSync(bucketPath)) {
      fs.mkdirSync(bucketPath, { recursive: true });
      return [];
    }
    
    // Use glob to find all files matching the pattern
    const files = glob.sync(path.join(bucketPath, pattern));
    
    // Map file paths to FileInfo objects
    return files.map((filePath) => {
      const stats = fs.statSync(filePath);
      const parsed = path.parse(filePath);
      
      return {
        name: parsed.base,
        path: path.relative(bucketPath, parsed.dir),
        fullPath: filePath,
        extension: parsed.ext,
        size: stats.size,
        createdAt: new Date(stats.birthtime),
        modifiedAt: new Date(stats.mtime),
        isDirectory: stats.isDirectory(),
      };
    });
  } catch (error) {
    throw new FileOperationError(
      `Failed to list files in ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Read a file from a specific bucket
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file to read
 * @returns The file content as a string
 */
export async function readFile(
  dataType: keyof DataTypeConfig,
  bucketStage: keyof BucketConfig,
  fileName: string
): Promise<string> {
  try {
    const bucketPath = getBucketPath(dataType, bucketStage);
    const filePath = path.join(bucketPath, fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new FileOperationError(`File not found: ${filePath}`);
    }
    
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new FileOperationError(
      `Failed to read file ${fileName} from ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Write a file to a specific bucket
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file to write
 * @param content The content to write to the file
 */
export async function writeFile(
  dataType: keyof DataTypeConfig,
  bucketStage: keyof BucketConfig,
  fileName: string,
  content: string
): Promise<void> {
  try {
    const bucketPath = getBucketPath(dataType, bucketStage);
    
    // Ensure the directory exists
    if (!fs.existsSync(bucketPath)) {
      fs.mkdirSync(bucketPath, { recursive: true });
    }
    
    const filePath = path.join(bucketPath, fileName);
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    throw new FileOperationError(
      `Failed to write file ${fileName} to ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Read a JSON file and parse its content
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the JSON file to read
 * @returns The parsed JSON content
 */
export async function readJsonFile<T>(
  dataType: keyof DataTypeConfig,
  bucketStage: keyof BucketConfig,
  fileName: string
): Promise<T> {
  try {
    const content = await readFile(dataType, bucketStage, fileName);
    return JSON.parse(content) as T;
  } catch (error) {
    throw new FileOperationError(
      `Failed to read or parse JSON file ${fileName} from ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Write an object as JSON to a file
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the JSON file to write
 * @param data The data to serialize as JSON
 */
export async function writeJsonFile<T>(
  dataType: keyof DataTypeConfig,
  bucketStage: keyof BucketConfig,
  fileName: string,
  data: T
): Promise<void> {
  try {
    const content = JSON.stringify(data, null, 2);
    await writeFile(dataType, bucketStage, fileName, content);
  } catch (error) {
    throw new FileOperationError(
      `Failed to write JSON file ${fileName} to ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Move a file from one bucket to another
 * @param dataType The type of data
 * @param sourceStage The source bucket
 * @param targetStage The target bucket
 * @param fileName The name of the file to move
 */
export async function moveFile(
  dataType: keyof DataTypeConfig,
  sourceStage: keyof BucketConfig,
  targetStage: keyof BucketConfig,
  fileName: string
): Promise<void> {
  try {
    const sourcePath = path.join(getBucketPath(dataType, sourceStage), fileName);
    const targetPath = path.join(getBucketPath(dataType, targetStage), fileName);
    
    // Ensure source file exists
    if (!fs.existsSync(sourcePath)) {
      throw new FileOperationError(`Source file not found: ${sourcePath}`);
    }
    
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Move the file
    fs.renameSync(sourcePath, targetPath);
  } catch (error) {
    throw new FileOperationError(
      `Failed to move file ${fileName} from ${sourceStage} to ${targetStage} for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Copy a file from one bucket to another
 * @param dataType The type of data
 * @param sourceStage The source bucket
 * @param targetStage The target bucket
 * @param fileName The name of the file to copy
 */
export async function copyFile(
  dataType: keyof DataTypeConfig,
  sourceStage: keyof BucketConfig,
  targetStage: keyof BucketConfig,
  fileName: string
): Promise<void> {
  try {
    const sourcePath = path.join(getBucketPath(dataType, sourceStage), fileName);
    const targetPath = path.join(getBucketPath(dataType, targetStage), fileName);
    
    // Ensure source file exists
    if (!fs.existsSync(sourcePath)) {
      throw new FileOperationError(`Source file not found: ${sourcePath}`);
    }
    
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(sourcePath, targetPath);
  } catch (error) {
    throw new FileOperationError(
      `Failed to copy file ${fileName} from ${sourceStage} to ${targetStage} for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Delete a file from a bucket
 * @param dataType The type of data
 * @param bucketStage The stage/bucket
 * @param fileName The name of the file to delete
 */
export async function deleteFile(
  dataType: keyof DataTypeConfig,
  bucketStage: keyof BucketConfig,
  fileName: string
): Promise<void> {
  try {
    const filePath = path.join(getBucketPath(dataType, bucketStage), fileName);
    
    // Ensure file exists
    if (!fs.existsSync(filePath)) {
      throw new FileOperationError(`File not found: ${filePath}`);
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
  } catch (error) {
    throw new FileOperationError(
      `Failed to delete file ${fileName} from ${bucketStage} bucket for ${dataType}: ${(error as Error).message}`,
      error as Error
    );
  }
}

