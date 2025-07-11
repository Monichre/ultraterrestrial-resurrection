-- Triple RAG Database Enhancement Migration
-- Date: July 9, 2025 at 07:48 PST
-- Purpose: Add Triple RAG tracking fields to existing schema

BEGIN;

-- Add Triple RAG tracking fields to document_processing_tasks
ALTER TABLE document_processing_tasks 
ADD COLUMN IF NOT EXISTS backend_results JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS embedding_model VARCHAR(100) DEFAULT 'all-MiniLM-L6-v2',
ADD COLUMN IF NOT EXISTS processing_version VARCHAR(50) DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS error_details JSONB DEFAULT NULL;

-- Update existing records with default values
UPDATE document_processing_tasks 
SET 
    backend_results = '{}'::jsonb,
    embedding_model = 'all-MiniLM-L6-v2',
    processing_version = '1.0'
WHERE 
    backend_results IS NULL 
    OR embedding_model IS NULL 
    OR processing_version IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_processing_tasks_backend_results 
ON document_processing_tasks USING GIN (backend_results);

CREATE INDEX IF NOT EXISTS idx_processing_tasks_embedding_model 
ON document_processing_tasks (embedding_model);

CREATE INDEX IF NOT EXISTS idx_processing_tasks_version 
ON document_processing_tasks (processing_version);

-- Add constraint to ensure valid embedding models
ALTER TABLE document_processing_tasks 
ADD CONSTRAINT chk_embedding_model 
CHECK (embedding_model IN (
    'all-MiniLM-L6-v2', 
    'text-embedding-3-small', 
    'text-embedding-3-large',
    'sentence-transformers/all-MiniLM-L6-v2'
));

-- Add constraint for valid processing versions
ALTER TABLE document_processing_tasks 
ADD CONSTRAINT chk_processing_version 
CHECK (processing_version ~ '^[0-9]+\.[0-9]+(\.[0-9]+)?$');

-- Add comments for new fields
COMMENT ON COLUMN document_processing_tasks.backend_results IS 
'JSON object tracking results from Triple RAG backends (upstash, local_rag, cocoindex)';

COMMENT ON COLUMN document_processing_tasks.embedding_model IS 
'Name of the embedding model used for processing (e.g., all-MiniLM-L6-v2)';

COMMENT ON COLUMN document_processing_tasks.processing_version IS 
'Version of the processing pipeline used (semantic versioning)';

COMMENT ON COLUMN document_processing_tasks.error_details IS 
'JSON object containing detailed error information if processing failed';

-- Create view for Triple RAG monitoring
CREATE OR REPLACE VIEW triple_rag_processing_status AS
SELECT 
    t.id,
    t.document_id,
    t.task_type,
    t.status,
    t.embedding_model,
    t.processing_version,
    t.backend_results,
    t.backend_results->>'upstash' as upstash_status,
    t.backend_results->>'local_rag' as local_rag_status,
    t.backend_results->>'cocoindex' as cocoindex_status,
    t.started_at,
    t.completed_at,
    t.created_at,
    CASE 
        WHEN t.status = 'completed' THEN 'success'
        WHEN t.status = 'failed' THEN 'error'
        WHEN t.status = 'running' THEN 'processing'
        ELSE 'unknown'
    END as processing_status,
    EXTRACT(EPOCH FROM (t.completed_at - t.started_at)) as processing_duration_seconds
FROM document_processing_tasks t
WHERE t.processing_version IS NOT NULL;

COMMENT ON VIEW triple_rag_processing_status IS 
'Monitoring view for Triple RAG processing tasks with backend status breakdown';

-- Add optional embedding dimension tracking to documents table
-- (Only if not already present)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documents' 
        AND column_name = 'embedding_dimension'
    ) THEN
        ALTER TABLE documents ADD COLUMN embedding_dimension INTEGER DEFAULT 384;
        
        COMMENT ON COLUMN documents.embedding_dimension IS 
        'Dimension of the embedding vector (e.g., 384 for sentence-transformers)';
        
        -- Add constraint for valid embedding dimensions
        ALTER TABLE documents 
        ADD CONSTRAINT chk_embedding_dimension 
        CHECK (embedding_dimension IN (384, 512, 768, 1024, 1536, 3072));
    END IF;
END $$;

-- Add optional embedding dimension tracking to document_chunks table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_chunks' 
        AND column_name = 'embedding_dimension'
    ) THEN
        ALTER TABLE document_chunks ADD COLUMN embedding_dimension INTEGER DEFAULT 384;
        
        COMMENT ON COLUMN document_chunks.embedding_dimension IS 
        'Dimension of the chunk embedding vector (e.g., 384 for sentence-transformers)';
        
        -- Add constraint for valid embedding dimensions
        ALTER TABLE document_chunks 
        ADD CONSTRAINT chk_chunk_embedding_dimension 
        CHECK (embedding_dimension IN (384, 512, 768, 1024, 1536, 3072));
    END IF;
END $$;

-- Create function to update backend results
CREATE OR REPLACE FUNCTION update_backend_results(
    task_id UUID,
    backend_name VARCHAR(50),
    backend_result JSONB
) RETURNS VOID AS $$
BEGIN
    UPDATE document_processing_tasks 
    SET 
        backend_results = backend_results || jsonb_build_object(backend_name, backend_result),
        updated_at = NOW()
    WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_backend_results IS 
'Helper function to update individual backend results in processing tasks';

-- Create function to get processing statistics
CREATE OR REPLACE FUNCTION get_triple_rag_stats(
    days_back INTEGER DEFAULT 7
) RETURNS TABLE (
    total_tasks BIGINT,
    completed_tasks BIGINT,
    failed_tasks BIGINT,
    avg_processing_time INTERVAL,
    upstash_success_rate DECIMAL,
    local_rag_success_rate DECIMAL,
    cocoindex_success_rate DECIMAL,
    most_common_embedding_model VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    WITH task_stats AS (
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
            AVG(completed_at - started_at) as avg_time,
            COUNT(CASE WHEN backend_results->>'upstash' = 'success' THEN 1 END) as upstash_success,
            COUNT(CASE WHEN backend_results->>'local_rag' = 'success' THEN 1 END) as local_rag_success,
            COUNT(CASE WHEN backend_results->>'cocoindex' = 'success' THEN 1 END) as cocoindex_success,
            COUNT(*) as total_backend_ops
        FROM document_processing_tasks
        WHERE created_at >= NOW() - INTERVAL '%d days' FORMAT(days_back)
    ),
    model_stats AS (
        SELECT embedding_model
        FROM document_processing_tasks
        WHERE created_at >= NOW() - INTERVAL '%d days' FORMAT(days_back)
        GROUP BY embedding_model
        ORDER BY COUNT(*) DESC
        LIMIT 1
    )
    SELECT 
        ts.total,
        ts.completed,
        ts.failed,
        ts.avg_time,
        ROUND(ts.upstash_success::decimal / ts.total_backend_ops * 100, 2),
        ROUND(ts.local_rag_success::decimal / ts.total_backend_ops * 100, 2),
        ROUND(ts.cocoindex_success::decimal / ts.total_backend_ops * 100, 2),
        ms.embedding_model
    FROM task_stats ts
    CROSS JOIN model_stats ms;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_triple_rag_stats IS 
'Generate processing statistics for Triple RAG system monitoring';

-- Create trigger to automatically update timestamps
CREATE OR REPLACE FUNCTION update_processing_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_processing_tasks' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE document_processing_tasks 
        ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
        
        -- Update existing records
        UPDATE document_processing_tasks 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
    END IF;
END $$;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS trigger_processing_tasks_updated_at ON document_processing_tasks;
CREATE TRIGGER trigger_processing_tasks_updated_at
    BEFORE UPDATE ON document_processing_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_processing_task_timestamp();

-- Grant permissions (adjust role names as needed)
-- GRANT SELECT, INSERT, UPDATE ON document_processing_tasks TO app_user;
-- GRANT SELECT ON triple_rag_processing_status TO app_user;
-- GRANT EXECUTE ON FUNCTION update_backend_results TO app_user;
-- GRANT EXECUTE ON FUNCTION get_triple_rag_stats TO app_user;

COMMIT;

-- Verification queries
SELECT 
    'document_processing_tasks' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'document_processing_tasks' 
AND column_name IN ('backend_results', 'embedding_model', 'processing_version', 'error_details')
ORDER BY ordinal_position;

-- Test the new functionality
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN backend_results IS NOT NULL THEN 1 END) as tasks_with_backend_results,
    COUNT(CASE WHEN embedding_model IS NOT NULL THEN 1 END) as tasks_with_embedding_model,
    COUNT(CASE WHEN processing_version IS NOT NULL THEN 1 END) as tasks_with_version
FROM document_processing_tasks;

-- Display the monitoring view
SELECT * FROM triple_rag_processing_status LIMIT 5;