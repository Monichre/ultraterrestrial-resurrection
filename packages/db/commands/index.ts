/**
 * Xata CLI Commands Suite
 * Comprehensive CLI interface for Xata database operations
 */

import { xata } from '../src/xata-typescript-sdk/client';

// Command types
export interface CommandRequest {
  operation: 'create' | 'read' | 'update' | 'delete' | 'search' | 'bulk';
  table: string;
  data?: Record<string, any>;
  filter?: Record<string, any>;
  id?: string;
  options?: {
    limit?: number;
    offset?: number;
    columns?: string[];
    searchQuery?: string;
    vectorSearch?: {
      embedding: number[];
      maxResults?: number;
    };
  };
}

export interface CommandResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    operation: string;
    table: string;
    recordsAffected?: number;
    executionTime?: number;
  };
}

// Error handling
export class CLIError extends Error {
  constructor(
    message: string,
    public code: string,
    public operation: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

// Validation helpers
function validateCommandRequest(req: CommandRequest): void {
  if (!req.operation || !['create', 'read', 'update', 'delete', 'search', 'bulk'].includes(req.operation)) {
    throw new CLIError('Invalid operation', 'INVALID_OPERATION', req.operation || 'unknown');
  }

  if (!req.table) {
    throw new CLIError('Table name is required', 'MISSING_TABLE', req.operation);
  }

  if (req.operation === 'create' && !req.data) {
    throw new CLIError('Data is required for create operation', 'MISSING_DATA', 'create');
  }

  if ((req.operation === 'update' || req.operation === 'delete') && !req.id && !req.filter) {
    throw new CLIError('ID or filter is required for update/delete operations', 'MISSING_IDENTIFIER', req.operation);
  }
}

// Table mapping for type safety
const TABLE_MAP = {
  topics: 'topics',
  events: 'events',
  personnel: 'personnel',
  organizations: 'organizations',
  testimonies: 'testimonies',
  documents: 'documents',
  locations: 'locations',
  sightings: 'sightings',
  users: 'users',
  'user-notes': 'user-notes',
  mindmaps: 'mindmaps',
  tags: 'tags',
  theories: 'theories',
  artifacts: 'artifacts'
} as const;

type TableName = keyof typeof TABLE_MAP;

// Main command executor
export async function executeXataCommand(request: CommandRequest): Promise<CommandResponse> {
  const startTime = Date.now();

  try {
    validateCommandRequest(request);

    const tableName = TABLE_MAP[request.table as TableName];
    if (!tableName) {
      throw new CLIError(`Unknown table: ${request.table}`, 'UNKNOWN_TABLE', request.operation);
    }

    let result: any;

    switch (request.operation) {
      case 'create':
        result = await handleCreate(tableName, request.data!);
        break;
      case 'read':
        result = await handleRead(tableName, request);
        break;
      case 'update':
        result = await handleUpdate(tableName, request);
        break;
      case 'delete':
        result = await handleDelete(tableName, request);
        break;
      case 'search':
        result = await handleSearch(tableName, request);
        break;
      case 'bulk':
        result = await handleBulk(tableName, request);
        break;
      default:
        throw new CLIError(`Unsupported operation: ${request.operation}`, 'UNSUPPORTED_OPERATION', request.operation);
    }

    const executionTime = Date.now() - startTime;

    return {
      success: true,
      data: result,
      metadata: {
        operation: request.operation,
        table: tableName,
        recordsAffected: Array.isArray(result) ? result.length : 1,
        executionTime
      }
    };

  } catch (error) {
    const executionTime = Date.now() - startTime;

    if (error instanceof CLIError) {
      return {
        success: false,
        error: error.message,
        metadata: {
          operation: request.operation,
          table: request.table,
          executionTime
        }
      };
    }

    return {
      success: false,
      error: `Unexpected error: ${(error as Error).message}`,
      metadata: {
        operation: request.operation,
        table: request.table,
        executionTime
      }
    };
  }
}

// Individual operation handlers
async function handleCreate(tableName: string, data: Record<string, any>) {
  const table = (xata.db as any)[tableName];
  if (!table) {
    throw new CLIError(`Table not found: ${tableName}`, 'TABLE_NOT_FOUND', 'create');
  }

  return await table.create(data);
}

async function handleRead(tableName: string, request: CommandRequest) {
  const table = (xata.db as any)[tableName];
  if (!table) {
    throw new CLIError(`Table not found: ${tableName}`, 'TABLE_NOT_FOUND', 'read');
  }

  if (request.id) {
    // Get single record by ID
    const record = await table.read(request.id, request.options?.columns);
    if (!record) {
      throw new CLIError(`Record not found: ${request.id}`, 'RECORD_NOT_FOUND', 'read');
    }
    return record;
  }

  // Get multiple records with filters
  let query = table.filter(request.filter || {});

  if (request.options?.columns) {
    query = query.select(request.options.columns);
  }

  if (request.options?.limit) {
    return await query.getMany({ limit: request.options.limit });
  }

  return await query.getMany();
}

async function handleUpdate(tableName: string, request: CommandRequest) {
  const table = (xata.db as any)[tableName];
  if (!table) {
    throw new CLIError(`Table not found: ${tableName}`, 'TABLE_NOT_FOUND', 'update');
  }

  if (!request.data) {
    throw new CLIError('Update data is required', 'MISSING_DATA', 'update');
  }

  if (request.id) {
    return await table.update(request.id, request.data);
  }

  if (request.filter) {
    // Bulk update with filter
    const records = await table.filter(request.filter).getMany();
    const updatePromises = records.map((record: any) =>
      table.update(record.id, request.data)
    );
    return await Promise.all(updatePromises);
  }

  throw new CLIError('ID or filter is required for update', 'MISSING_IDENTIFIER', 'update');
}

async function handleDelete(tableName: string, request: CommandRequest) {
  const table = (xata.db as any)[tableName];
  if (!table) {
    throw new CLIError(`Table not found: ${tableName}`, 'TABLE_NOT_FOUND', 'delete');
  }

  if (request.id) {
    return await table.delete(request.id);
  }

  if (request.filter) {
    // Bulk delete with filter
    const records = await table.filter(request.filter).getMany();
    const deletePromises = records.map((record: any) =>
      table.delete(record.id)
    );
    return await Promise.all(deletePromises);
  }

  throw new CLIError('ID or filter is required for delete', 'MISSING_IDENTIFIER', 'delete');
}

async function handleSearch(tableName: string, request: CommandRequest) {
  const table = (xata.db as any)[tableName];
  if (!table) {
    throw new CLIError(`Table not found: ${tableName}`, 'TABLE_NOT_FOUND', 'search');
  }

  if (request.options?.vectorSearch) {
    // Vector search
    return await table.vectorSearch(
      'embedding',
      request.options.vectorSearch.embedding,
      {
        size: request.options.vectorSearch.maxResults || 10,
        filter: request.filter
      }
    );
  }

  if (request.options?.searchQuery) {
    // Text search
    return await table.search(request.options.searchQuery, {
      filter: request.filter,
      limit: request.options?.limit || 20
    });
  }

  throw new CLIError('Search query or vector search parameters required', 'MISSING_SEARCH_PARAMS', 'search');
}

async function handleBulk(tableName: string, request: CommandRequest) {
  const table = (xata.db as any)[tableName];
  if (!table) {
    throw new CLIError(`Table not found: ${tableName}`, 'TABLE_NOT_FOUND', 'bulk');
  }

  if (!request.data || !Array.isArray(request.data)) {
    throw new CLIError('Bulk data array is required', 'MISSING_BULK_DATA', 'bulk');
  }

  if (request.operation === 'bulk' && request.data.length === 0) {
    throw new CLIError('Bulk data array cannot be empty', 'EMPTY_BULK_DATA', 'bulk');
  }

  return await table.create(request.data);
}

// Utility functions
export function getAvailableTables(): string[] {
  return Object.keys(TABLE_MAP);
}

export function getTableSchema(tableName: string): any {
  // This would return schema information for the table
  // For now, return basic info
  return {
    name: tableName,
    operations: ['create', 'read', 'update', 'delete', 'search', 'bulk']
  };
}