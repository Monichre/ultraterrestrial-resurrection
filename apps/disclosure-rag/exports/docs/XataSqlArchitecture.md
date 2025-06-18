# Xata SQL Architecture Documentation

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Adapter Pattern Implementation](#adapter-pattern-implementation)
3. [Connection Management](#connection-management)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Integration Points](#integration-points)
6. [Performance Architecture](#performance-architecture)
7. [Security Architecture](#security-architecture)
8. [Monitoring & Observability](#monitoring--observability)

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Web UI  │  API Routes  │  MCP Servers  │  Background Jobs     │
├─────────────────────────────────────────────────────────────────┤
│                     Service Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  User Service  │  Content Service  │  Analytics Service         │
├─────────────────────────────────────────────────────────────────┤
│                   Repository Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  User Repository  │  Document Repository  │  Search Repository │
├─────────────────────────────────────────────────────────────────┤
│                   Database Adapter Layer                       │
├─────────────────────────────────────────────────────────────────┤
│     Xata Lite Adapter     │     Xata Postgres Adapter          │
├─────────────────────────────────────────────────────────────────┤
│                   Connection Layer                             │
├─────────────────────────────────────────────────────────────────┤
│      HTTP Client          │        PostgreSQL Client           │
├─────────────────────────────────────────────────────────────────┤
│                    Xata Infrastructure                         │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction
```typescript
// Architecture interfaces
interface SystemArchitecture {
  applicationLayer: ApplicationComponents;
  serviceLayer: BusinessServices;
  repositoryLayer: DataAccessObjects;
  adapterLayer: DatabaseAdapters;
  connectionLayer: ConnectionManagers;
}

interface ApplicationComponents {
  webUI: WebInterface;
  apiRoutes: RESTEndpoints;
  mcpServers: MCPServerInstances;
  backgroundJobs: ScheduledTasks;
}

interface BusinessServices {
  userService: UserManagementService;
  contentService: ContentManagementService;
  analyticsService: AnalyticsService;
  searchService: SearchService;
}
```

## Adapter Pattern Implementation

### Base Adapter Architecture
```typescript
// From: apps/dbagent/src/lib/adapters/base.ts
abstract class BaseDatabaseAdapter {
  protected config: ConnectionConfig;
  
  constructor(config: ConnectionConfig) {
    this.config = config;
  }
  
  // Core methods all adapters must implement
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract testConnection(): Promise<boolean>;
  abstract executeQuery(query: string, params?: any[]): Promise<QueryResult>;
  
  // Optional methods with default implementations
  async getTableInfo(tableName: string): Promise<TableInfo> {
    // Default implementation
  }
  
  async getDatabaseStats(): Promise<DatabaseStats> {
    // Default implementation
  }
}
```

### Xata-Specific Implementations
```typescript
// HTTP API Adapter
class XataLiteAdapter extends BaseDatabaseAdapter {
  private baseUrl: string;
  private apiKey: string;
  private branch: string;
  
  constructor(config: ConnectionConfig) {
    super(config);
    this.parseXataConfig(config);
  }
  
  async executeQuery(query: string, params: any[] = []): Promise<QueryResult> {
    // Xata Lite doesn't support arbitrary SQL
    throw new Error('Raw SQL queries not supported in Xata Lite');
  }
  
  // Xata-specific methods
  async getRecords(tableName: string, options: XataQueryOptions): Promise<XataRecordsResult> {
    const response = await this.makeRequest('POST', `/tables/${tableName}/query`, options);
    return await response.json();
  }
  
  async searchRecords(tableName: string, query: string, options: XataSearchOptions): Promise<XataSearchResult> {
    const response = await this.makeRequest('POST', `/tables/${tableName}/search`, {
      query,
      ...options
    });
    return await response.json();
  }
}

// Postgres Wire Adapter
class XataPostgresAdapter extends PostgreSQLAdapter {
  constructor(config: ConnectionConfig) {
    super(config);
  }
  
  async executeQuery(query: string, params: any[] = []): Promise<QueryResult> {
    // Full PostgreSQL compatibility
    return await super.executeQuery(query, params);
  }
  
  // Xata-enhanced methods
  async getXataMetadata(): Promise<XataMetadata> {
    const result = await this.executeQuery(`
      SELECT 
        table_name,
        column_name,
        data_type
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    
    return this.parseXataMetadata(result.rows);
  }
}
```

### Adapter Factory Pattern
```typescript
// From: apps/dbagent/src/lib/adapters/base.ts
export class DatabaseAdapterFactory {
  private static adapters = new Map<string, BaseDatabaseAdapter>();
  
  static create(config: ConnectionConfig): BaseDatabaseAdapter {
    const key = this.generateAdapterKey(config);
    
    if (this.adapters.has(key)) {
      return this.adapters.get(key)!;
    }
    
    const adapter = this.createAdapter(config);
    this.adapters.set(key, adapter);
    return adapter;
  }
  
  private static createAdapter(config: ConnectionConfig): BaseDatabaseAdapter {
    switch (config.type) {
      case 'xata_lite_http':
        return new XataLiteAdapter(config);
      case 'xata_postgres_wire':
        return new XataPostgresAdapter(config);
      default:
        throw new Error(`Unsupported adapter type: ${config.type}`);
    }
  }
  
  static async cleanup(): Promise<void> {
    const disconnectPromises = Array.from(this.adapters.values())
      .map(adapter => adapter.disconnect().catch(console.error));
    
    await Promise.all(disconnectPromises);
    this.adapters.clear();
  }
}
```

## Connection Management

### Connection Detection & Auto-Configuration
```typescript
// From: apps/dbagent/src/lib/adapters/connection-detector.ts
export class ConnectionDetector {
  detect(connectionString: string, apiKey?: string): DetectedConnection {
    // Detect Xata connections
    if (connectionString.includes('.xata.sh')) {
      return this.detectXata(connectionString, apiKey);
    }
    
    // Detect other database types
    return this.detectOtherDatabases(connectionString);
  }
  
  private detectXata(connectionString: string, apiKey?: string): DetectedConnection {
    if (connectionString.startsWith('https://')) {
      return {
        type: 'xata_lite_http',
        confidence: 0.95,
        reasons: ['HTTPS URL with .xata.sh domain'],
        suggestedMetadata: {
          branch: 'main',
          requiresApiKey: true
        }
      };
    }
    
    if (connectionString.startsWith('postgresql://')) {
      return {
        type: 'xata_postgres_wire',
        confidence: 0.95,
        reasons: ['PostgreSQL connection string with .xata.sh domain'],
        suggestedMetadata: {
          branch: 'main',
          supportsSql: true
        }
      };
    }
    
    return { type: 'postgres', confidence: 0, reasons: [] };
  }
}
```

### Connection Pool Management
```typescript
// Connection pool for Postgres Wire
class XataConnectionPool {
  private pool: Pool;
  private config: PoolConfig;
  
  constructor(config: XataPostgresConfig) {
    this.config = {
      connectionString: config.connectionString,
      max: config.maxConnections || 20,
      idleTimeoutMillis: config.idleTimeout || 30000,
      connectionTimeoutMillis: config.connectionTimeout || 2000,
      ssl: { rejectUnauthorized: false } // Xata handles SSL
    };
    
    this.pool = new Pool(this.config);
    this.setupEventHandlers();
  }
  
  private setupEventHandlers(): void {
    this.pool.on('connect', (client) => {
      console.log('New client connected to Xata Postgres');
    });
    
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
    
    this.pool.on('remove', () => {
      console.log('Client removed from pool');
    });
  }
  
  async query(text: string, params?: any[]): Promise<QueryResult> {
    const start = Date.now();
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query (${duration}ms):`, text);
      }
      
      return result;
    } finally {
      client.release();
    }
  }
  
  async end(): Promise<void> {
    await this.pool.end();
  }
}
```

## Data Flow Architecture

### Request Processing Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│  API Route  │───▶│   Service   │───▶│ Repository  │
│  Request    │    │  Handler    │    │   Layer     │    │   Layer     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Response   │◀───│   Format    │◀───│   Adapter   │◀───│ Connection  │
│   to Client │    │  Response   │    │   Layer     │    │    Pool     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                      ┌─────────────┐    ┌─────────────┐
                                      │    Xata     │◀───│  Database   │
                                      │ Infrastructure │  │   Query     │
                                      └─────────────┘    └─────────────┘
```

### Data Transformation Pipeline
```typescript
interface DataTransformationPipeline {
  input: ClientRequest;
  validation: RequestValidation;
  businessLogic: ServiceOperation;
  dataAccess: RepositoryQuery;
  adapterTranslation: AdapterConversion;
  databaseExecution: DatabaseQuery;
  resultTransformation: ResponseMapping;
  output: ClientResponse;
}

// Example implementation
class DocumentService {
  constructor(
    private documentRepository: DocumentRepository,
    private adapter: BaseDatabaseAdapter
  ) {}
  
  async getDocument(id: string): Promise<DocumentResponse> {
    // 1. Input validation
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Invalid document ID');
    }
    
    // 2. Business logic
    const hasPermission = await this.checkPermission(id);
    if (!hasPermission) {
      throw new AuthorizationError('Access denied');
    }
    
    // 3. Data access through repository
    const document = await this.documentRepository.findById(id);
    
    // 4. Transform for client response
    return this.transformDocumentForResponse(document);
  }
}
```

## Integration Points

### MCP Server Integration
```typescript
// MCP server tools integration with Xata SQL
class XataMCPTools {
  constructor(private adapter: BaseDatabaseAdapter) {}
  
  @mcpTool('xata-query')
  async executeQuery(params: {
    query: string;
    parameters?: any[];
    consistency?: 'strong' | 'eventual';
  }) {
    if (this.adapter instanceof XataLiteAdapter) {
      // HTTP API approach
      return await this.adapter.sql({
        statement: params.query,
        params: params.parameters,
        consistency: params.consistency
      });
    } else if (this.adapter instanceof XataPostgresAdapter) {
      // Postgres wire approach
      return await this.adapter.executeQuery(params.query, params.parameters);
    }
    
    throw new Error('Unsupported adapter for SQL queries');
  }
  
  @mcpTool('xata-search')
  async searchContent(params: {
    table: string;
    query: string;
    options?: SearchOptions;
  }) {
    if (this.adapter instanceof XataLiteAdapter) {
      return await this.adapter.searchRecords(params.table, params.query, params.options);
    }
    
    // Fallback to text search for Postgres
    return await this.adapter.executeQuery(`
      SELECT * FROM ${params.table}
      WHERE to_tsvector('english', content) @@ to_tsquery('english', $1)
    `, [params.query]);
  }
}
```

### Web UI Integration
```typescript
// Frontend integration with Xata adapters
class DatabaseConnectionUI {
  async testConnection(config: ConnectionConfig): Promise<TestResult> {
    try {
      const adapter = DatabaseAdapterFactory.create(config);
      const isConnected = await adapter.testConnection();
      
      if (isConnected) {
        const stats = await adapter.getDatabaseStats();
        return {
          success: true,
          message: `Connected successfully to ${config.type}`,
          details: {
            tableCount: stats.tableCount,
            recordCount: stats.totalRecords,
            databaseSize: stats.databaseSize
          }
        };
      } else {
        return {
          success: false,
          message: 'Connection test failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error
      };
    }
  }
}
```

## Performance Architecture

### Query Performance Monitoring
```typescript
class QueryPerformanceMonitor {
  private metrics = new Map<string, QueryMetrics>();
  
  async monitorQuery<T>(
    queryId: string,
    query: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    
    try {
      const result = await operation();
      this.recordSuccess(queryId, query, startTime, startMemory);
      return result;
    } catch (error) {
      this.recordError(queryId, query, startTime, error);
      throw error;
    }
  }
  
  private recordSuccess(
    queryId: string,
    query: string,
    startTime: number,
    startMemory: NodeJS.MemoryUsage
  ): void {
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage();
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
    
    const existing = this.metrics.get(queryId) || {
      query,
      totalExecutions: 0,
      totalDuration: 0,
      totalMemory: 0,
      errors: 0,
      lastExecuted: new Date()
    };
    
    this.metrics.set(queryId, {
      ...existing,
      totalExecutions: existing.totalExecutions + 1,
      totalDuration: existing.totalDuration + duration,
      totalMemory: existing.totalMemory + memoryDelta,
      lastExecuted: new Date(),
      avgDuration: (existing.totalDuration + duration) / (existing.totalExecutions + 1)
    });
  }
  
  getPerformanceReport(): PerformanceReport {
    const queries = Array.from(this.metrics.entries()).map(([id, metrics]) => ({
      queryId: id,
      ...metrics
    }));
    
    return {
      totalQueries: queries.length,
      slowestQueries: queries
        .sort((a, b) => b.avgDuration - a.avgDuration)
        .slice(0, 10),
      mostFrequentQueries: queries
        .sort((a, b) => b.totalExecutions - a.totalExecutions)
        .slice(0, 10),
      errorRate: queries.reduce((sum, q) => sum + q.errors, 0) / 
                 queries.reduce((sum, q) => sum + q.totalExecutions, 0)
    };
  }
}
```

### Caching Architecture
```typescript
interface CacheLayer {
  queryCache: Map<string, CachedResult>;
  connectionCache: Map<string, BaseDatabaseAdapter>;
  metadataCache: Map<string, TableMetadata>;
}

class XataCacheManager {
  private queryCache = new Map<string, CachedResult>();
  private cacheConfig: CacheConfig;
  
  constructor(config: CacheConfig) {
    this.cacheConfig = config;
    this.setupCacheExpiration();
  }
  
  async getCachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl = this.cacheConfig.defaultTTL
  ): Promise<T> {
    const cached = this.queryCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.result as T;
    }
    
    const result = await queryFn();
    this.queryCache.set(key, {
      result,
      timestamp: Date.now(),
      ttl
    });
    
    return result;
  }
  
  private setupCacheExpiration(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.queryCache.entries()) {
        if (now - cached.timestamp > cached.ttl) {
          this.queryCache.delete(key);
        }
      }
    }, this.cacheConfig.cleanupInterval);
  }
}
```

## Security Architecture

### SQL Injection Prevention
```typescript
class SecurityValidator {
  private static dangerousPatterns = [
    /;\s*(drop|delete|truncate|alter)\s+/i,
    /union\s+select/i,
    /\/\*.*\*\//,
    /--.*$/,
    /xp_cmdshell/i,
    /sp_executesql/i
  ];
  
  static validateQuery(query: string): ValidationResult {
    // Check for dangerous patterns
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(query)) {
        return {
          isValid: false,
          reason: 'Query contains potentially dangerous patterns',
          pattern: pattern.source
        };
      }
    }
    
    // Validate parameter placeholders
    const parameterCount = (query.match(/\$\d+/g) || []).length;
    const maxParameters = 100; // Reasonable limit
    
    if (parameterCount > maxParameters) {
      return {
        isValid: false,
        reason: `Too many parameters (${parameterCount} > ${maxParameters})`
      };
    }
    
    return { isValid: true };
  }
  
  static sanitizeParameters(params: any[]): any[] {
    return params.map(param => {
      if (typeof param === 'string') {
        // Remove potential SQL injection characters
        return param.replace(/['"\\;]/g, '');
      }
      return param;
    });
  }
}
```

### Authentication & Authorization
```typescript
class XataAuthManager {
  async validateApiKey(apiKey: string, workspace: string): Promise<boolean> {
    try {
      const response = await fetch(`https://${workspace}.xata.sh/user`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
  
  async checkTablePermissions(
    apiKey: string,
    workspace: string,
    tableName: string,
    operation: 'read' | 'write' | 'delete'
  ): Promise<boolean> {
    // Implementation would check Xata permissions
    // This is a placeholder for the actual permission check
    return true;
  }
}
```

## Monitoring & Observability

### Logging Architecture
```typescript
interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context: {
    adapterId: string;
    operation: string;
    duration?: number;
    error?: Error;
    metadata?: Record<string, any>;
  };
}

class XataLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 10000;
  
  log(level: LogEntry['level'], message: string, context: LogEntry['context']): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context
    };
    
    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Output to console based on level
    const logFn = console[level] || console.log;
    logFn(`[${level.toUpperCase()}] ${message}`, context);
  }
  
  getLogsByAdapter(adapterId: string): LogEntry[] {
    return this.logs.filter(log => log.context.adapterId === adapterId);
  }
  
  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.level === 'error');
  }
  
  getPerformanceLogs(): LogEntry[] {
    return this.logs.filter(log => 
      log.context.duration !== undefined && log.context.duration > 1000
    );
  }
}
```

### Health Checks
```typescript
class XataHealthChecker {
  constructor(private adapters: Map<string, BaseDatabaseAdapter>) {}
  
  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks = await Promise.allSettled(
      Array.from(this.adapters.entries()).map(async ([id, adapter]) => {
        const start = Date.now();
        try {
          const isHealthy = await adapter.testConnection();
          const duration = Date.now() - start;
          
          return {
            adapterId: id,
            status: isHealthy ? 'healthy' : 'unhealthy',
            responseTime: duration,
            error: null
          };
        } catch (error) {
          return {
            adapterId: id,
            status: 'error',
            responseTime: Date.now() - start,
            error: error.message
          };
        }
      })
    );
    
    const results = checks.map(check => 
      check.status === 'fulfilled' ? check.value : {
        adapterId: 'unknown',
        status: 'error',
        responseTime: 0,
        error: 'Health check failed'
      }
    );
    
    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const totalCount = results.length;
    
    return {
      overall: healthyCount === totalCount ? 'healthy' : 'degraded',
      adapters: results,
      summary: {
        healthy: healthyCount,
        total: totalCount,
        percentage: Math.round((healthyCount / totalCount) * 100)
      }
    };
  }
}
```

---

This architecture documentation provides a comprehensive view of how Xata SQL methods integrate with the existing system, focusing on maintainability, performance, and scalability while following SOLID principles and best practices. 