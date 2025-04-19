import { getXataClient, DatabaseSchema } from '../../../src/db/xata/xata';
import { xataConfig } from '../config';
import chalk from 'chalk';

// Maximum retry count for operations that fail due to temporary issues
const MAX_RETRIES = 3;
// Base delay for exponential backoff (in milliseconds)
const BASE_RETRY_DELAY = 1000;

/**
 * Error class for Xata operations
 */
export class XataOperationError extends Error {
  constructor(message: string, public cause?: Error, public operation?: string) {
    super(message);
    this.name = 'XataOperationError';
  }
}

/**
 * Retry options interface
 */
interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryStatusCodes?: number[];
}

/**
 * Insertion options interface
 */
export interface InsertionOptions extends RetryOptions {
  batchSize?: number;
  onProgress?: (inserted: number, total: number) => void;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
}

/**
 * Query options interface
 */
export interface QueryOptions extends RetryOptions {
  page?: number;
  size?: number;
  filter?: Record<string, any>;
  sort?: Record<string, 'asc' | 'desc'>;
}

/**
 * Xata client wrapper class
 * Provides enhanced functionality on top of the Xata client
 */
class XataClientWrapper {
  private client;
  private clientPromise: Promise<any> | null = null;

  constructor() {
    // Lazily initialize client when first used
    this.client = null;
  }

  /**
   * Get the Xata client instance
   * @returns The Xata client
   */
  private async getClient() {
    if (this.client) {
      return this.client;
    }

    if (!this.clientPromise) {
      this.clientPromise = new Promise((resolve, reject) => {
        try {
          if (!xataConfig.apiKey) {
            throw new XataOperationError('Xata API key is not set. Please set the XATA_API_KEY environment variable.');
          }
          
          const client = getXataClient();
          this.client = client;
          resolve(client);
        } catch (error) {
          reject(new XataOperationError(
            `Failed to initialize Xata client: ${(error as Error).message}`,
            error as Error,
            'initialization'
          ));
        }
      });
    }

    return this.clientPromise;
  }

  /**
   * Execute a function with retry logic
   * @param operation The operation name
   * @param fn The function to execute
   * @param options Retry options
   * @returns The result of the function
   */
  private async withRetry<T>(
    operation: string,
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries || MAX_RETRIES;
    const retryDelay = options.retryDelay || BASE_RETRY_DELAY;
    const retryStatusCodes = options.retryStatusCodes || [408, 429, 500, 502, 503, 504];

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Execute the function
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Check if we should retry
        const isRetryable = this.isRetryableError(error, retryStatusCodes);
        
        if (!isRetryable || attempt === maxRetries) {
          // Either not retryable or max retries reached
          break;
        }
        
        // Calculate exponential backoff delay
        const delay = retryDelay * Math.pow(2, attempt);
        console.log(chalk.yellow(`Retrying ${operation} after ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`));
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we get here, all retries failed
    throw new XataOperationError(
      `${operation} failed after ${maxRetries} retries: ${lastError?.message}`,
      lastError || undefined,
      operation
    );
  }

  /**
   * Check if an error is retryable
   * @param error The error to check
   * @param retryStatusCodes Status codes that should be retried
   * @returns True if the error is retryable
   */
  private isRetryableError(error: any, retryStatusCodes: number[]): boolean {
    // Check for network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true;
    }
    
    // Check for retryable HTTP status codes
    if (error.status && retryStatusCodes.includes(error.status)) {
      return true;
    }
    
    // Check for rate limiting
    if (error.message && error.message.includes('rate limit')) {
      return true;
    }
    
    return false;
  }

  /**
   * Query records from a table
   * @param tableName The name of the table
   * @param options Query options
   * @returns The query results
   */
  async query<T extends keyof DatabaseSchema>(
    tableName: T,
    options: QueryOptions = {}
  ): Promise<DatabaseSchema[T][]> {
    return this.withRetry(`query ${tableName}`, async () => {
      const client = await this.getClient();
      
      let query = client.db[tableName as string];
      
      // Apply filter if provided
      if (options.filter) {
        query = query.filter(options.filter);
      }
      
      // Apply sort if provided
      if (options.sort) {
        for (const [column, direction] of Object.entries(options.sort)) {
          query = query.sort(column, direction);
        }
      }
      
      // Apply pagination
      const page = options.page || 1;
      const size = options.size || 50;
      
      const results = await query.getPaginated({
        pagination: {
          size,
          offset: (page - 1) * size,
        },
      });
      
      return results.records;
    }, options);
  }

  /**
   * Get a record by ID
   * @param tableName The name of the table
   * @param id The record ID
   * @param options Retry options
   * @returns The record or null if not found
   */
  async getRecord<T extends keyof DatabaseSchema>(
    tableName: T,
    id: string,
    options: RetryOptions = {}
  ): Promise<DatabaseSchema[T] | null> {
    return this.withRetry(`get ${tableName} record`, async () => {
      const client = await this.getClient();
      return client.db[tableName as string].read(id);
    }, options);
  }

  /**
   * Check if a record exists
   * @param tableName The name of the table
   * @param filter The filter to use for checking existence
   * @param options Retry options
   * @returns True if the record exists
   */
  async recordExists<T extends keyof DatabaseSchema>(
    tableName: T,
    filter: Record<string, any>,
    options: RetryOptions = {}
  ): Promise<boolean> {
    return this.withRetry(`check ${tableName} exists`, async () => {
      const client = await this.getClient();
      const record = await client.db[tableName as string].filter(filter).getFirst();
      return !!record;
    }, options);
  }

  /**
   * Create a record
   * @param tableName The name of the table
   * @param data The record data
   * @param options Retry options
   * @returns The created record
   */
  async createRecord<T extends keyof DatabaseSchema>(
    tableName: T,
    data: Omit<DatabaseSchema[T], 'id' | 'xata'>,
    options: RetryOptions = {}
  ): Promise<DatabaseSchema[T]> {
    return this.withRetry(`create ${tableName} record`, async () => {
      const client = await this.getClient();
      return client.db[tableName as string].create(data);
    }, options);
  }

  /**
   * Update a record
   * @param tableName The name of the table
   * @param id The record ID
   * @param data The record data
   * @param options Retry options
   * @returns The updated record
   */
  async updateRecord<T extends keyof DatabaseSchema>(
    tableName: T,
    id: string,
    data: Partial<DatabaseSchema[T]>,
    options: RetryOptions = {}
  ): Promise<DatabaseSchema[T]> {
    return this.withRetry(`update ${tableName} record`, async () => {
      const client = await this.getClient();
      return client.db[tableName as string].update(id, data);
    }, options);
  }

  /**
   * Delete a record
   * @param tableName The name of the table
   * @param id The record ID
   * @param options Retry options
   * @returns True if the record was deleted
   */
  async deleteRecord<T extends keyof DatabaseSchema>(
    tableName: T,
    id: string,
    options: RetryOptions = {}
  ): Promise<boolean> {
    return this.withRetry(`delete ${tableName} record`, async () => {
      const client = await this.getClient();
      await client.db[tableName as string].delete(id);
      return true;
    }, options);
  }

  /**
   * Insert multiple records
   * @param tableName The name of the table
   * @param records The records to insert
   * @param options Insertion options
   * @returns Result of the batch insertion
   */
  async insertRecords<T extends keyof DatabaseSchema>(
    tableName: T,
    records: Omit<DatabaseSchema[T], 'id' | 'xata'>[],
    options: InsertionOptions = {}
  ): Promise<{
    inserted: number;
    failed: number;
    errors: Error[];
    records: DatabaseSchema[T][];
  }> {
    // Default options
    const batchSize = options.batchSize || 100;
    const onProgress = options.onProgress || (() => {});
    
    const result = {
      inserted: 0,
      failed: 0,
      errors: [] as Error[],
      records: [] as DatabaseSchema[T][],
    };
    
    // Process in batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      try {
        // Process batch
        const batchResult = await this.withRetry(`batch insert ${tableName}`, async () => {
          const client = await this.getClient();
          
          // Use transaction for batch processing if available
          const createdRecords = await Promise.all(
            batch.map(async (record, index) => {
              try {
                // Check for duplicates if needed
                if (options.skipDuplicates || options.updateExisting) {
                  // Find potential duplicate based on unique fields
                  // This is a simple implementation - in a real system you'd need
                  // to determine unique fields or use a more sophisticated approach
                  const uniqueFilter: Record<string, any> = {};
                  
                  // Use any field that has 'unique' in its name as a potential key
                  // This is just an example - real logic would depend on schema
                  for (const [key, value] of Object.entries(record)) {
                    if (
                      key.toLowerCase().includes('name') || 
                      key.toLowerCase().includes('title') ||
                      key.toLowerCase().includes('id')
                    ) {
                      uniqueFilter[key] = value;
                    }
                  }
                  
                  if (Object.keys(uniqueFilter).length > 0) {
                    const existingRecord = await client.db[tableName as string]
                      .filter(uniqueFilter)
                      .getFirst();
                    
                    if (existingRecord) {
                      // Handle existing record
                      if (options.updateExisting) {
                        // Update existing record
                        return client.db[tableName as string].update(existingRecord.id, record);
                      } else if (options.skipDuplicates) {
                        // Skip duplicate
                        return existingRecord;
                      }
                    }
                  }
                }
                
                // Create new record
                return client.db[tableName as string].create(record);
              } catch (error) {
                // Track error but continue with batch
                result.errors.push(new XataOperationError(
                  `Failed to insert/update record ${i + index}: ${(error as Error).message}`,
                  error as Error,
                  `insert ${tableName} record`
                ));
                result.failed++;
                return null;
              }
            })
          );
          
          return createdRecords.filter(Boolean) as DatabaseSchema[T][];
        }, options);
        
        // Update results
        result.records.push(...batchResult);
        result.inserted += batchResult.length;
        
        // Report progress
        onProgress(result.inserted, records.length);
      } catch (error) {
        // Track batch error
        result.errors.push(error as Error);
        result.failed += batch.length;
      }
    }
    
    return result;
  }

  /**
   * Search records
   * @param tableName The name of the table
   * @param query The search query
   * @param options Query options
   * @returns The search results
   */
  async searchRecords<T extends keyof DatabaseSchema>(
    tableName: T,
    query: string,
    options: QueryOptions & {
      fuzziness?: number;
      prefix?: 'phrase' | 'disabled';
    } = {}
  ): Promise<DatabaseSchema[T][]> {
    return this.withRetry(`search ${tableName}`, async () => {
      const client = await this.getClient();
      
      const searchOptions: any = {
        fuzziness: options.fuzziness || 0,
        prefix: options.prefix || 'phrase',
      };
      
      if (options.page && options.size) {
        searchOptions.pagination = {
          size: options.size,
          offset: (options.page - 1) * options.size,
        };
      }
      
      const results = await client.db[tableName as string].search(query, searchOptions);
      return results.records;
    }, options);
  }
}

// Export singleton instance
export const xataClient = new XataClientWrapper();

// Export types
export type { RetryOptions, InsertionOptions, QueryOptions };

