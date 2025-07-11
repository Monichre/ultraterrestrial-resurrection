import psycopg2
import json
from datetime import datetime

# Database connection parameters
conn_string = "postgresql://liamellis@localhost:5432/ultraterrestrial"

try:
    # Connect to the database
    conn = psycopg2.connect(conn_string)
    cur = conn.cursor()
    
    print(f"Connected to database successfully at {datetime.now()}")
    print("=" * 80)
    
    # 1. List all tables in the database
    print("\n1. ALL TABLES IN DATABASE:")
    print("-" * 40)
    cur.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name;
    """)
    tables = cur.fetchall()
    for schema, table in tables:
        print(f"  {schema}.{table}")
    
    # 2. Check if vector extension is installed
    print("\n2. VECTOR EXTENSION STATUS:")
    print("-" * 40)
    cur.execute("""
        SELECT extname, extversion 
        FROM pg_extension 
        WHERE extname = 'vector';
    """)
    vector_ext = cur.fetchone()
    if vector_ext:
        print(f"  pgvector extension installed: version {vector_ext[1]}")
    else:
        print("  pgvector extension NOT installed")
    
    # 3. Look for document_embeddings table
    print("\n3. DOCUMENT_EMBEDDINGS TABLE:")
    print("-" * 40)
    cur.execute("""
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'document_embeddings'
        ORDER BY ordinal_position;
    """)
    doc_emb_columns = cur.fetchall()
    if doc_emb_columns:
        print("  Table structure:")
        for col_name, data_type, max_len, nullable in doc_emb_columns:
            print(f"    - {col_name}: {data_type}" + 
                  (f"({max_len})" if max_len else "") + 
                  (" NOT NULL" if nullable == 'NO' else ""))
        
        # Get row count
        cur.execute("SELECT COUNT(*) FROM document_embeddings;")
        count = cur.fetchone()[0]
        print(f"\n  Row count: {count}")
        
        # Sample a few rows
        if count > 0:
            cur.execute("""
                SELECT id, document_id, chunk_text, 
                       CASE WHEN embedding IS NOT NULL THEN 'Present' ELSE 'NULL' END as embedding_status,
                       created_at
                FROM document_embeddings 
                LIMIT 3;
            """)
            print("\n  Sample rows:")
            for row in cur.fetchall():
                print(f"    ID: {row[0]}, Doc: {row[1]}, Text: {row[2][:50]}..., Embedding: {row[3]}")
    else:
        print("  Table does not exist")
    
    # 4. Look for other RAG-related tables
    print("\n4. OTHER RAG-RELATED TABLES:")
    print("-" * 40)
    rag_keywords = ['vector', 'embedding', 'document', 'chunk', 'knowledge', 'rag', 'coco']
    
    cur.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        AND (
            LOWER(table_name) LIKE ANY(ARRAY[%s])
        )
        ORDER BY table_schema, table_name;
    """, ([f'%{kw}%' for kw in rag_keywords],))
    
    rag_tables = cur.fetchall()
    for schema, table in rag_tables:
        print(f"\n  {schema}.{table}:")
        
        # Get table structure
        cur.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_schema = %s AND table_name = %s
            ORDER BY ordinal_position;
        """, (schema, table))
        
        columns = cur.fetchall()
        for col_name, data_type, max_len in columns:
            print(f"    - {col_name}: {data_type}" + (f"({max_len})" if max_len else ""))
        
        # Get row count
        cur.execute(f"SELECT COUNT(*) FROM {schema}.{table};")
        count = cur.fetchone()[0]
        print(f"    Row count: {count}")
    
    # 5. Check for vector indexes
    print("\n5. VECTOR INDEXES:")
    print("-" * 40)
    cur.execute("""
        SELECT 
            i.relname as index_name,
            t.relname as table_name,
            a.attname as column_name,
            am.amname as access_method
        FROM pg_index idx
        JOIN pg_class i ON i.oid = idx.indexrelid
        JOIN pg_class t ON t.oid = idx.indrelid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(idx.indkey)
        JOIN pg_am am ON am.oid = i.relam
        WHERE am.amname IN ('ivfflat', 'hnsw')
        ORDER BY t.relname, i.relname;
    """)
    
    vector_indexes = cur.fetchall()
    if vector_indexes:
        for idx_name, table_name, col_name, method in vector_indexes:
            print(f"  {idx_name} on {table_name}.{col_name} using {method}")
    else:
        print("  No vector indexes found (ivfflat or hnsw)")
    
    # 6. Check for CocoIndex specific tables
    print("\n6. COCOINDEX-SPECIFIC TABLES:")
    print("-" * 40)
    cur.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        AND LOWER(table_name) LIKE '%coco%'
        ORDER BY table_schema, table_name;
    """)
    
    coco_tables = cur.fetchall()
    if coco_tables:
        for schema, table in coco_tables:
            print(f"  Found: {schema}.{table}")
    else:
        print("  No CocoIndex-specific tables found")
    
    # 7. Check for any custom schemas
    print("\n7. CUSTOM SCHEMAS:")
    print("-" * 40)
    cur.execute("""
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'public')
        ORDER BY schema_name;
    """)
    
    schemas = cur.fetchall()
    if schemas:
        for schema in schemas:
            print(f"  {schema[0]}")
    else:
        print("  No custom schemas found")
    
    # 8. Look for functions that might be RAG-related
    print("\n8. RAG-RELATED FUNCTIONS:")
    print("-" * 40)
    cur.execute("""
        SELECT routine_name, routine_schema
        FROM information_schema.routines
        WHERE routine_schema NOT IN ('pg_catalog', 'information_schema')
        AND (
            LOWER(routine_name) LIKE '%embed%' OR
            LOWER(routine_name) LIKE '%vector%' OR
            LOWER(routine_name) LIKE '%similarity%' OR
            LOWER(routine_name) LIKE '%search%'
        )
        ORDER BY routine_schema, routine_name;
    """)
    
    functions = cur.fetchall()
    if functions:
        for func_name, schema in functions:
            print(f"  {schema}.{func_name}")
    else:
        print("  No RAG-related functions found")
    
    conn.close()
    print("\n" + "=" * 80)
    print("Database examination completed successfully")
    
except psycopg2.Error as e:
    print(f"Database error: {e}")
except Exception as e:
    print(f"Error: {e}")