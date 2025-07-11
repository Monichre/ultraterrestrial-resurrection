#!/usr/bin/env python3
"""
Create PostgreSQL tables for Xata data import
Uses schema.json to create appropriate table structure
"""

import asyncio
import asyncpg
import json
import os
from pathlib import Path
from datetime import datetime

class PostgreSQLTableCreator:
    def __init__(self, postgres_url: str, schema_path: str):
        self.postgres_url = postgres_url
        self.schema_path = Path(schema_path)
        
        print(f"🗄️  PostgreSQL Table Creator")
        print(f"📅 {datetime.now().isoformat()}")
        print(f"Database: {postgres_url.split('@')[-1].split('?')[0]}")
        print(f"Schema: {schema_path}")
        print()

    async def connect(self):
        """Connect to PostgreSQL database"""
        import ssl
        # Configure SSL context for Xata connection
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        self.conn = await asyncpg.connect(self.postgres_url, ssl=ssl_context)
        print("✅ Connected to PostgreSQL database")

    async def close(self):
        """Close database connection"""
        if hasattr(self, 'conn'):
            await self.conn.close()

    def get_postgres_type(self, col_def: dict) -> str:
        """Convert Xata column type to PostgreSQL type"""
        col_type = col_def['type']
        
        type_mapping = {
            'string': 'TEXT',
            'text': 'TEXT',
            'int': 'INTEGER',
            'float': 'DOUBLE PRECISION',
            'bool': 'BOOLEAN',
            'datetime': 'TIMESTAMPTZ',
            'email': 'TEXT',
            'json': 'JSONB',
            'file': 'JSONB',
            'file[]': 'JSONB',
            'multiple': 'TEXT[]',
            'link': 'TEXT',  # Store as xata_id reference
        }
        
        # Handle vector types
        if col_type == 'vector':
            dimension = col_def.get('vector', {}).get('dimension', 1536)
            return f'vector({dimension})'
            
        return type_mapping.get(col_type, 'TEXT')

    async def create_vector_extension(self):
        """Create pgvector extension if needed"""
        try:
            await self.conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            print("✅ pgvector extension ready")
        except Exception as e:
            print(f"⚠️  Could not create vector extension: {e}")
            print("   This is OK if vectors aren't needed or extension already exists")

    async def create_tables(self):
        """Create all tables from schema"""
        print("📋 Creating PostgreSQL tables from Xata schema...")
        
        # Load schema
        with open(self.schema_path, 'r') as f:
            schema = json.load(f)
        
        # Create vector extension first
        await self.create_vector_extension()
        
        # Track created tables
        created_tables = []
        
        for table_def in schema['tables']:
            table_name = table_def['name'].replace('-', '_')  # PostgreSQL friendly names
            
            # Skip empty tables
            if not table_def.get('columns'):
                print(f"⏭️  Skipping empty table: {table_name}")
                continue
                
            await self.create_table_from_schema(table_name, table_def)
            created_tables.append(table_name)
        
        print(f"\n🎉 Created {len(created_tables)} tables successfully!")
        return created_tables

    async def create_table_from_schema(self, table_name: str, table_def: dict):
        """Create individual table from Xata schema definition"""
        
        columns = []
        
        # Add xata system columns
        columns.append("xata_id TEXT PRIMARY KEY")
        columns.append("xata_createdat TIMESTAMPTZ DEFAULT NOW()")
        columns.append("xata_updatedat TIMESTAMPTZ DEFAULT NOW()")
        columns.append("xata_version INTEGER DEFAULT 0")
        
        # Add user-defined columns
        for col in table_def['columns']:
            col_name = col['name'].replace('-', '_')  # PostgreSQL friendly
            
            # Handle PostgreSQL reserved keywords
            if col_name.lower() in ['user', 'order', 'group', 'table', 'column', 'index', 'primary', 'foreign', 'key', 'constraint']:
                col_name = f'"{col_name}"'  # Quote reserved keywords
            
            col_type = self.get_postgres_type(col)
            
            # Handle unique constraints
            unique_clause = " UNIQUE" if col.get('unique') else ""
            
            # Handle default values
            default_clause = ""
            if 'defaultValue' in col:
                default_value = col['defaultValue']
                if col['type'] == 'json':
                    default_clause = f" DEFAULT '{default_value}'"
                elif col['type'] == 'bool':
                    default_clause = f" DEFAULT {default_value.lower()}"
                else:
                    default_clause = f" DEFAULT '{default_value}'"
            
            columns.append(f"{col_name} {col_type}{unique_clause}{default_clause}")
        
        # Create table SQL
        columns_sql = ",\n    ".join(columns)
        create_sql = f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            {columns_sql}
        );
        """
        
        try:
            await self.conn.execute(create_sql)
            print(f"✅ Created table: {table_name} ({len(table_def['columns'])} columns)")
        except Exception as e:
            print(f"❌ Failed to create table {table_name}: {e}")

    async def run(self):
        """Run the table creation process"""
        try:
            await self.connect()
            created_tables = await self.create_tables()
            
            print("\n📊 Table creation summary:")
            for table in created_tables:
                count_query = f"SELECT COUNT(*) FROM {table};"
                result = await self.conn.fetchrow(count_query)
                count = result[0] if result else 0
                print(f"  - {table}: {count} records")
                
        except Exception as e:
            print(f"❌ Table creation failed: {e}")
            raise
        finally:
            await self.close()

async def main():
    """Main function"""
    
    # Configuration
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    schema_path = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/schema.json"
    
    creator = PostgreSQLTableCreator(postgres_url, schema_path)
    await creator.run()

if __name__ == "__main__":
    asyncio.run(main())