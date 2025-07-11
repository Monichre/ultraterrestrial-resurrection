#!/usr/bin/env python3
"""
Quick check of database tables and structure
"""

import asyncio
import asyncpg
import ssl

async def check_tables():
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        conn = await asyncpg.connect(postgres_url, ssl=ssl_context, command_timeout=15)
        print("✅ Connected")
        
        # Simple table count
        result = await conn.fetchval("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
        print(f"📊 Tables: {result}")
        
        await conn.close()
        
    except asyncio.TimeoutError:
        print("❌ Connection timeout")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_tables())