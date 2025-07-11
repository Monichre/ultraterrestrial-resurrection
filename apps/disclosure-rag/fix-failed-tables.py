#!/usr/bin/env python3
"""
Fix the failed tables with reserved keyword issues
"""

import asyncio
import asyncpg
import ssl
from datetime import datetime

async def fix_failed_tables():
    """Fix tables that failed due to reserved keywords"""
    
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    
    print(f"🔧 Fixing Failed Tables")
    print(f"📅 {datetime.now().isoformat()}")
    print()
    
    # Configure SSL context for Xata connection
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    conn = await asyncpg.connect(postgres_url, ssl=ssl_context)
    print("✅ Connected to PostgreSQL database")
    
    # Tables that failed with user column
    failed_tables = [
        ("user_saved_events", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "event TEXT",
            "theory TEXT",
            "note TEXT",
            "note_title TEXT"
        ]),
        ("user_saved_topics", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "topic TEXT",
            "theory TEXT",
            "note TEXT",
            "note_title TEXT"
        ]),
        ("user_saved_key_figure", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "key_figure TEXT",
            "theory TEXT",
            "note TEXT",
            "note_title TEXT"
        ]),
        ("user_saved_testimonies", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "testimony TEXT",
            "theory TEXT",
            "note TEXT",
            "note_title TEXT"
        ]),
        ("user_saved_documents", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "document TEXT",
            "theory TEXT",
            "note TEXT",
            "note_title TEXT"
        ]),
        ("user_notes", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "name TEXT",
            "content TEXT",
            "synopsis TEXT",
            "diagrams JSONB"
        ]),
        ("user_saved_organizations", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "organization TEXT",
            "theory TEXT",
            "note TEXT",
            "note_title TEXT"
        ]),
        ("user_saved_sightings", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            '"user" TEXT',
            "sighting TEXT",
            "theory TEXT",
            "note TEXT",
            "note_title TEXT"
        ]),
        ("mindmaps", [
            "xata_id TEXT PRIMARY KEY",
            "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
            "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
            "xata_version INTEGER DEFAULT 0",
            "json JSONB DEFAULT '{}'",
            "embedding vector(1536)",
            '"user" TEXT',
            "file JSONB"
        ])
    ]
    
    fixed_count = 0
    
    for table_name, columns in failed_tables:
        columns_sql = ",\n    ".join(columns)
        create_sql = f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            {columns_sql}
        );
        """
        
        try:
            await conn.execute(create_sql)
            print(f"✅ Fixed table: {table_name}")
            fixed_count += 1
        except Exception as e:
            print(f"❌ Failed to fix table {table_name}: {e}")
    
    await conn.close()
    print(f"\n🎉 Fixed {fixed_count} tables successfully!")

if __name__ == "__main__":
    asyncio.run(fix_failed_tables())