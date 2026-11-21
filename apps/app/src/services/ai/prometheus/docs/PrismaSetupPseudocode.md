# Prisma Setup Pseudocode

## Environment Setup Process

```pseudocode
FUNCTION setupPrismaEnvironment():
    // 1. Prerequisites Check
    VERIFY node.js >= 18.0.0
    VERIFY bun package manager installed
    VERIFY git access to repository
    VERIFY Supabase account and project
    
    // 2. Repository Setup
    CLONE repository
    NAVIGATE to project root
    INSTALL dependencies using bun
    
    // 3. Environment Configuration
    CREATE .env file in project root
    SET DATABASE_URL = "postgresql://[user]:[password]@[host]:[port]/[database]?pgbouncer=true&connection_limit=1"
    SET DIRECT_URL = "postgresql://[user]:[password]@[host]:[port]/[database]"
    SET additional environment variables as needed
    
    // 4. Database Initialization
    EXECUTE setupDatabase()
    EXECUTE setupPrismaClient()
    
    RETURN success_status
END FUNCTION

FUNCTION setupDatabase():
    // 1. Supabase Configuration
    CREATE new Supabase project OR use existing
    ENABLE required extensions:
        - vector (for embeddings)
        - pg_net (for HTTP requests)
        - pgcrypto (for UUID generation)
    
    // 2. Storage Setup
    CREATE storage bucket for document uploads
    CONFIGURE bucket policies for file access
    
    // 3. Database Schema Setup
    NAVIGATE to packages/db directory
    EXECUTE prisma migrate dev --name init
    
    // 4. Manual SQL Execution
    EXECUTE schema-extension.sql file:
        - Vector indexes for similarity search
        - Custom functions for search
        - Triggers for updated_at timestamps
        - Row-Level Security policies
    
    RETURN database_ready_status
END FUNCTION

FUNCTION setupPrismaClient():
    // 1. Client Generation
    NAVIGATE to packages/db
    EXECUTE prisma generate
    
    // 2. Verify Generated Client
    CHECK ../generated/prisma directory exists
    VERIFY client types are generated
    
    // 3. Test Database Connection
    CREATE test connection script
    EXECUTE basic query to verify connectivity
    
    RETURN client_ready_status
END FUNCTION
```

## Development Workflow Pseudocode

```pseudocode
FUNCTION developmentWorkflow():
    // 1. Schema Changes
    WHEN modifying schema:
        EDIT packages/db/src/prisma/schema.prisma
        EXECUTE prisma migrate dev --name [descriptive_name]
        IF custom SQL needed:
            UPDATE schema-extension.sql
            EXECUTE manual SQL against database
        EXECUTE prisma generate
        UPDATE application code as needed
    
    // 2. Testing Changes
    RUN database tests
    VERIFY migrations work in clean environment
    CHECK type safety in application code
    
    // 3. Deployment
    EXECUTE prisma migrate deploy (production)
    APPLY schema-extension.sql changes (production)
    VERIFY production functionality
    
    RETURN workflow_complete
END FUNCTION

FUNCTION queryPatterns():
    // 1. Basic CRUD Operations
    CREATE operations:
        USE prisma.model.create({ data: {...} })
        HANDLE errors and validation
    
    READ operations:
        USE prisma.model.findMany({ where: {...}, include: {...} })
        IMPLEMENT pagination for large datasets
    
    UPDATE operations:
        USE prisma.model.update({ where: {...}, data: {...} })
        HANDLE optimistic concurrency
    
    DELETE operations:
        USE prisma.model.delete({ where: {...} })
        CONSIDER cascade implications
    
    // 2. Advanced Patterns
    VECTOR similarity search:
        USE raw SQL with vector operations
        IMPLEMENT hybrid search (text + semantic)
    
    BATCH operations:
        USE transactions for consistency
        IMPLEMENT proper error handling
    
    RETURN query_patterns_documented
END FUNCTION
```

## MCP Integration Pseudocode

```pseudocode
FUNCTION mcpIntegration():
    // 1. MCP Tool Setup
    CONFIGURE MCP tools for database operations
    ESTABLISH connection patterns
    
    // 2. Context7 MCP Usage
    WHEN using MCP tools:
        PASS database context through MCP
        MAINTAIN type safety across tool boundaries
        HANDLE async operations properly
    
    // 3. Tool Coordination
    COORDINATE between Prisma and MCP tools:
        USE Prisma for complex queries
        USE MCP tools for external integrations
        MAINTAIN data consistency
    
    RETURN mcp_integration_complete
END FUNCTION

FUNCTION errorHandlingPatterns():
    // 1. Database Errors
    CATCH PrismaClientKnownRequestError:
        HANDLE unique constraint violations
        HANDLE foreign key constraint violations
        PROVIDE meaningful error messages
    
    CATCH PrismaClientUnknownRequestError:
        LOG error details for debugging
        PROVIDE generic user-friendly message
    
    // 2. Connection Errors
    IMPLEMENT retry logic for transient failures
    HANDLE connection pool exhaustion
    PROVIDE fallback mechanisms
    
    // 3. Validation Errors
    USE Zod schemas for input validation
    VALIDATE before database operations
    PROVIDE detailed validation feedback
    
    RETURN error_handling_complete
END FUNCTION
```

## Performance Optimization Pseudocode

```pseudocode
FUNCTION performanceOptimization():
    // 1. Query Optimization
    USE appropriate indexes:
        SINGLE column indexes for frequent filters
        COMPOSITE indexes for multi-column queries
        VECTOR indexes for similarity search
    
    IMPLEMENT query batching:
        BATCH related queries together
        USE dataloader pattern for N+1 prevention
    
    // 2. Connection Management
    CONFIGURE connection pooling:
        SET appropriate pool size
        HANDLE connection lifecycle
        MONITOR connection usage
    
    // 3. Caching Strategy
    IMPLEMENT query result caching
    USE Redis for session data
    CACHE expensive computations
    
    RETURN performance_optimized
END FUNCTION
```

## Testing Strategy Pseudocode

```pseudocode
FUNCTION testingStrategy():
    // 1. Unit Tests
    TEST individual model operations
    MOCK Prisma client for isolated testing
    VERIFY business logic correctness
    
    // 2. Integration Tests
    TEST database operations end-to-end
    USE test database for isolation
    VERIFY schema constraints
    
    // 3. Migration Tests
    TEST migrations on clean database
    VERIFY rollback functionality
    TEST data preservation during migrations
    
    RETURN testing_complete
END FUNCTION
```