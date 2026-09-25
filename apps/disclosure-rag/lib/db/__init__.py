"""Shared Postgres access for disclosure-rag (issue #154).

All new database code goes through this package instead of ad hoc
psycopg2/os.getenv("DATABASE_URL") connections scattered across modules.
"""

from .postgres_client import connect, get_database_url

__all__ = ["connect", "get_database_url"]
