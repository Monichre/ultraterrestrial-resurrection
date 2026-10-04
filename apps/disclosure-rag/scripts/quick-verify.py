#!/usr/bin/env python3
"""
Quick verification of PostgreSQL database tables
"""

import asyncio
import asyncpg
import os
import ssl

async def quick_verify():
    postgres_url = os.getenv('DATABASE_URL')
    if not postgres_url:
        raise RuntimeError("DATABASE_URL environment variable must be set")
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    conn = await asyncpg.connect(postgres_url, ssl=ssl_context)
    
    # Get table count
    tables_query = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
    result = await conn.fetchrow(tables_query)
    table_count = result[0] if result else 0
    
    print(f"✅ Database connected successfully")
    print(f"📊 Total tables created: {table_count}")
    print(f"🎉 PostgreSQL wire-enabled database is ready!")
    
    await conn.close()

if __name__ == "__main__":
    asyncio.run(quick_verify())