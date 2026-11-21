#!/usr/bin/env python3
"""
Examine the local PostgreSQL ultraterrestrial database RAG tables
Date: January 9, 2025
"""

import psycopg2
import sys
import os

def examine_database():
    """Examine the ultraterrestrial database RAG tables"""
    
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://liamellis@localhost:5432/ultraterrestrial")
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("=" * 80)
        print("ULTRATERRESTRIAL DATABASE EXAMINATION")
        print("=" * 80)
        
        # List all tables
        print("\n1. ALL TABLES:")
        cur.execute("""
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        
        tables = cur.fetchall()
        for table_name, table_type in tables:
            print(f"   {table_name} ({table_type})")
        
        # Check for vector extension
        print("\n2. VECTOR EXTENSION:")
        cur.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
        vector_ext = cur.fetchone()
        if vector_ext:
            print(f"   ✅ Vector extension installed: {vector_ext}")
        else:
            print("   ❌ Vector extension NOT installed")
        
        # Examine document_embeddings table if it exists
        print("\n3. DOCUMENT_EMBEDDINGS TABLE:")
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'document_embeddings';
        """)
        
        if cur.fetchone():
            print("   ✅ document_embeddings table exists")
            
            # Get table structure
            cur.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'document_embeddings'
                ORDER BY ordinal_position;
            """)
            
            columns = cur.fetchall()
            print("   \nTable Structure:")
            for col_name, data_type, nullable, default in columns:
                print(f"     {col_name}: {data_type} {'NULL' if nullable == 'YES' else 'NOT NULL'} {f'DEFAULT {default}' if default else ''}")
            
            # Get row count
            cur.execute("SELECT COUNT(*) FROM document_embeddings;")
            count = cur.fetchone()[0]
            print(f"   \nRecord Count: {count}")
            
            # Get sample records
            if count > 0:
                cur.execute("SELECT doc_id, LEFT(content, 100) as content_preview, metadata FROM document_embeddings LIMIT 5;")
                samples = cur.fetchall()
                print("   \nSample Records:")
                for i, (doc_id, content, metadata) in enumerate(samples, 1):
                    print(f"     {i}. ID: {doc_id}")
                    print(f"        Content: {content}...")
                    print(f"        Metadata: {metadata}")
                    print()
        else:
            print("   ❌ document_embeddings table does NOT exist")
        
        # Check for other RAG-related tables
        print("\n4. OTHER RAG-RELATED TABLES:")
        rag_tables = ['vectors', 'embeddings', 'documents', 'chunks', 'knowledge_base']
        for table in rag_tables:
            cur.execute(f"""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = '{table}';
            """)
            if cur.fetchone():
                cur.execute(f"SELECT COUNT(*) FROM {table};")
                count = cur.fetchone()[0]
                print(f"   ✅ {table}: {count} records")
            else:
                print(f"   ❌ {table}: does not exist")
        
        # Check for indexes
        print("\n5. VECTOR INDEXES:")
        cur.execute("""
            SELECT indexname, tablename, indexdef
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND indexdef LIKE '%vector%'
            ORDER BY tablename, indexname;
        """)
        
        indexes = cur.fetchall()
        if indexes:
            for idx_name, table_name, idx_def in indexes:
                print(f"   ✅ {idx_name} on {table_name}")
                print(f"      {idx_def}")
        else:
            print("   ❌ No vector indexes found")
        
        # Check for CocoIndex-specific tables
        print("\n6. COCOINDEX-SPECIFIC TABLES:")
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%coco%'
            ORDER BY table_name;
        """)
        
        coco_tables = cur.fetchall()
        if coco_tables:
            for (table_name,) in coco_tables:
                cur.execute(f"SELECT COUNT(*) FROM {table_name};")
                count = cur.fetchone()[0]
                print(f"   ✅ {table_name}: {count} records")
        else:
            print("   ❌ No CocoIndex-specific tables found")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    examine_database()