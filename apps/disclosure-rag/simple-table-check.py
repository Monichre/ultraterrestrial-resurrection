#!/usr/bin/env python3
"""
Simple table count verification - minimal queries
"""

import asyncio
import asyncpg
import ssl

async def simple_check():
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        conn = await asyncpg.connect(postgres_url, ssl=ssl_context, command_timeout=10)
        
        # Quick table count
        result = await conn.fetchrow("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
        table_count = result[0] if result else 0
        
        print(f"✅ Database connected")
        print(f"📊 Total tables: {table_count}")
        
        await conn.close()
        return table_count
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 0

if __name__ == "__main__":
    asyncio.run(simple_check())