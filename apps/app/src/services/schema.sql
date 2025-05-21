-- REFACTOR FOR XATA


-- Enable necessary extensions
create extension if not exists "vector";
create extension if not exists "pg_net";  -- For async HTTP requests if needed
create extension if not exists "pgcrypto"; -- For generating UUIDs

-- Create storage bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true);

-- Allow public access to documents bucket (read)
create policy "Public Read Access"
on storage.objects for select
to public
using ( bucket_id = 'documents' );

-- Allow public uploads to documents bucket
create policy "Public Upload Access"
on storage.objects for insert
to public
with check ( bucket_id = 'documents' );

-- Allow public updates to documents
create policy "Public Update Access"
on storage.objects for update
to public
using ( bucket_id = 'documents' );

-- Allow public deletions
create policy "Public Delete Access"
on storage.objects for delete
to public
using ( bucket_id = 'documents' );

-- Document status enum
create type document_status as enum (
  'pending',
  'processing',
  'processed',
  'failed'
);

-- Document type enum
create type document_type as enum (
  'pdf',
  'docx',
  'txt',
  'webpage',
  'other'
);

-- Documents table - stores metadata about uploaded documents
create table if not exists doc_processor_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_path text not null,
  file_type document_type not null,
  file_size bigint not null,
  mime_type text not null,
  status document_status not null default 'pending',
  error_message text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  processed_at timestamp with time zone,
  user_id uuid references auth.users(id) on delete cascade null,
  
  -- Metadata from AI processing
  page_count integer,
  word_count integer,
  language text,
  summary text,
  keywords text[],
  analysis jsonb,  -- Stores AI analysis results
  
  -- Original file hash for deduplication
  file_hash text unique,
  
  -- Extracted content
  extracted_text text,
  metadata jsonb
);

-- Enable RLS on documents table
alter table doc_processor_documents enable row level security;

-- Allow public access to documents table
create policy "Public Access"
on doc_processor_documents for all
to public
using (true)
with check (true);

-- Document chunks table - stores processed text chunks with embeddings
create table if not exists doc_processor_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references doc_processor_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  token_count integer not null,
  embedding vector(1536), -- OpenAI embedding dimension
  created_at timestamp with time zone default now(),
  
  -- Metadata for chunk
  page_number integer,
  heading text,
  
  -- Composite key for unique chunks per document
  unique(document_id, chunk_index)
);

-- Document entities table - stores named entities extracted from documents
create table if not exists doc_processor_document_entities (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references doc_processor_documents(id) on delete cascade,
  entity_type text not null,
  entity_text text not null,
  metadata jsonb,
  created_at timestamp with time zone default now(),
  
  -- Index for faster lookups
  unique(document_id, entity_type, entity_text)
);

-- Enable RLS on entities table
alter table doc_processor_document_entities enable row level security;

-- Allow public access to entities table
create policy "Public Access"
on doc_processor_document_entities for all
to public
using (true)
with check (true);

-- Document processing tasks table - tracks processing pipeline status
create table if not exists doc_processor_processing_tasks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references doc_processor_documents(id) on delete cascade,
  task_type text not null, -- extraction, analysis, vectorization, etc.
  status document_status not null default 'pending',
  error_message text,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Task-specific metadata as JSONB
  metadata jsonb
);

-- Create indexes for better query performance
create index if not exists doc_processor_documents_user_id_idx on doc_processor_documents(user_id);
create index if not exists doc_processor_documents_status_idx on doc_processor_documents(status);
create index if not exists doc_processor_documents_created_at_idx on doc_processor_documents(created_at);
create index if not exists doc_processor_document_chunks_document_id_idx on doc_processor_document_chunks(document_id);

-- Create vector index for similarity search
create index if not exists doc_processor_document_chunks_embedding_idx on doc_processor_document_chunks 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_doc_processor_documents_updated_at
  before update on doc_processor_documents
  for each row
  execute function update_updated_at_column();

create trigger update_doc_processor_processing_tasks_updated_at
  before update on doc_processor_processing_tasks
  for each row
  execute function update_updated_at_column();

-- RLS Policies
alter table doc_processor_documents enable row level security;
alter table doc_processor_document_chunks enable row level security;
alter table doc_processor_document_entities enable row level security;
alter table doc_processor_processing_tasks enable row level security;

-- Policy for documents
create policy "Users can view their own documents"
  on doc_processor_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on doc_processor_documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own documents"
  on doc_processor_documents for update
  using (auth.uid() = user_id);

-- Policy for document chunks
create policy "Users can view their own document chunks"
  on doc_processor_document_chunks for select
  using (
    exists (
      select 1 from doc_processor_documents
      where doc_processor_documents.id = doc_processor_document_chunks.document_id
      and doc_processor_documents.user_id = auth.uid()
    )
  );

-- Policy for document entities
create policy "Users can view their own document entities"
  on doc_processor_document_entities for select
  using (
    exists (
      select 1 from doc_processor_documents
      where doc_processor_documents.id = doc_processor_document_entities.document_id
      and doc_processor_documents.user_id = auth.uid()
    )
  );

-- Policy for processing tasks
create policy "Users can view their own processing tasks"
  on doc_processor_processing_tasks for select
  using (
    exists (
      select 1 from doc_processor_documents
      where doc_processor_documents.id = doc_processor_processing_tasks.document_id
      and doc_processor_documents.user_id = auth.uid()
    )
  );

-- Helper function to search documents by similarity
create or replace function search_doc_processor_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  document_id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    doc_processor_document_chunks.document_id,
    doc_processor_document_chunks.content,
    1 - (doc_processor_document_chunks.embedding <=> query_embedding) as similarity
  from doc_processor_document_chunks
  where 1 - (doc_processor_document_chunks.embedding <=> query_embedding) > match_threshold
  order by doc_processor_document_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Helper function for hybrid document search
create or replace function hybrid_search_documents(
  query_text text,
  query_embedding vector(1536),
  match_count int DEFAULT 10,
  full_text_weight float DEFAULT 1.0,
  semantic_weight float DEFAULT 1.0,
  rrf_k int DEFAULT 50
)
returns table (
  id uuid,
  title text,
  content text,
  page_number integer,
  heading text,
  combined_score float
)
language sql
as $$
with full_text as (
  select
    dc.id,
    dc.document_id,
    dc.content,
    dc.page_number,
    dc.heading,
    row_number() over(
      order by ts_rank_cd(to_tsvector('english', dc.content), websearch_to_tsquery(query_text)) desc
    ) as rank_ix
  from
    doc_processor_document_chunks dc
  where
    to_tsvector('english', dc.content) @@ websearch_to_tsquery(query_text)
  limit least(match_count * 2, 100)
),
semantic as (
  select
    dc.id,
    dc.document_id,
    dc.content,
    dc.page_number,
    dc.heading,
    1 - (dc.embedding <=> query_embedding) as similarity,
    row_number() over (order by dc.embedding <=> query_embedding) as rank_ix
  from
    doc_processor_document_chunks dc
  limit least(match_count * 2, 100)
)
select
  d.id,
  d.title,
  coalesce(ft.content, s.content) as content,
  coalesce(ft.page_number, s.page_number) as page_number,
  coalesce(ft.heading, s.heading) as heading,
  (
    coalesce(1.0 / (rrf_k + ft.rank_ix::float), 0.0) * full_text_weight +
    coalesce(1.0 / (rrf_k + s.rank_ix::float), 0.0) * semantic_weight
  ) as combined_score
from
  full_text ft
  full outer join semantic s on ft.id = s.id
  join doc_processor_documents d on 
    coalesce(ft.document_id, s.document_id) = d.id
order by
  combined_score desc
limit match_count;
$$;

-- Example usage:
-- select * from hybrid_search_documents(
--   'project management software',
--   '<embedding vector>'::vector(1536),
--   10,
--   1.0,  -- full text weight
--   1.0,  -- semantic weight
--   50    -- RRF k constant
-- ); 