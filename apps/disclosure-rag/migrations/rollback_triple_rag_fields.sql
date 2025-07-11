-- Triple RAG Database Enhancement Rollback Migration
-- Date: July 9, 2025 at 07:49 PST
-- Purpose: Remove Triple RAG tracking fields from existing schema

BEGIN;

-- Remove triggers
DROP TRIGGER IF EXISTS trigger_processing_tasks_updated_at ON document_processing_tasks;

-- Remove functions
DROP FUNCTION IF EXISTS update_processing_task_timestamp();
DROP FUNCTION IF EXISTS get_triple_rag_stats(INTEGER);
DROP FUNCTION IF EXISTS update_backend_results(UUID, VARCHAR(50), JSONB);

-- Remove view
DROP VIEW IF EXISTS triple_rag_processing_status;

-- Remove constraints
ALTER TABLE document_processing_tasks 
DROP CONSTRAINT IF EXISTS chk_embedding_model,
DROP CONSTRAINT IF EXISTS chk_processing_version;

ALTER TABLE documents 
DROP CONSTRAINT IF EXISTS chk_embedding_dimension;

ALTER TABLE document_chunks 
DROP CONSTRAINT IF EXISTS chk_chunk_embedding_dimension;

-- Remove indexes
DROP INDEX IF EXISTS idx_processing_tasks_backend_results;
DROP INDEX IF EXISTS idx_processing_tasks_embedding_model;
DROP INDEX IF EXISTS idx_processing_tasks_version;

-- Remove columns from document_processing_tasks
ALTER TABLE document_processing_tasks 
DROP COLUMN IF EXISTS backend_results,
DROP COLUMN IF EXISTS embedding_model,
DROP COLUMN IF EXISTS processing_version,
DROP COLUMN IF EXISTS error_details,
DROP COLUMN IF EXISTS updated_at;

-- Remove columns from documents (if added)
ALTER TABLE documents 
DROP COLUMN IF EXISTS embedding_dimension;

-- Remove columns from document_chunks (if added)
ALTER TABLE document_chunks 
DROP COLUMN IF EXISTS embedding_dimension;

COMMIT;

-- Verification query
SELECT 
    'document_processing_tasks' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'document_processing_tasks' 
ORDER BY ordinal_position;