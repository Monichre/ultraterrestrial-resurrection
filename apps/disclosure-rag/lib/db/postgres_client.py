"""Single Postgres connection point for disclosure-rag.

Modeled on packages/db/scripts/rebuild/db_ops.py: plain psycopg (v3), one
DATABASE_URL, no ORM. The URL must point at the shared Neon endpoint that
packages/db owns (the same database apps/app reads) so ingested data lands
in the knowledge graph the rest of the platform actually uses.

Usage:
    from lib.db import connect

    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT count(*) FROM documents")
        print(cur.fetchone()[0])

Environment resolution order:
    1. DATABASE_URL already in the process environment (set by main.sh /
       run.sh sourcing apps/disclosure-rag/.env)
    2. packages/db/.env at the monorepo root, as a fallback so scripts run
       from this workspace agree with the canonical connection string
"""
from __future__ import annotations

import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

_PACKAGES_DB_ENV = (
    Path(__file__).resolve().parents[3].parent / "packages" / "db" / ".env"
)


def _read_url_from_env_file(env_path: Path) -> str | None:
    """Pull DATABASE_URL out of a dotenv file without mutating os.environ."""
    if not env_path.is_file():
        return None
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line.startswith("DATABASE_URL="):
            value = line.split("=", 1)[1].strip().strip("'\"")
            return value or None
    return None


def get_database_url() -> str:
    """Resolve the shared Postgres connection string.

    Raises RuntimeError (not sys.exit - this is a library, callers decide
    how to die) when no URL can be found anywhere.
    """
    url = os.getenv("DATABASE_URL")
    if url:
        return url

    url = _read_url_from_env_file(_PACKAGES_DB_ENV)
    if url:
        logger.info("DATABASE_URL not in environment; using packages/db/.env")
        return url

    raise RuntimeError(
        "DATABASE_URL not set. Source apps/disclosure-rag/.env or ensure "
        f"{_PACKAGES_DB_ENV} exists - both must point at the shared Neon "
        "endpoint used by packages/db."
    )


def connect(autocommit: bool = False):
    """Open a psycopg (v3) connection to the shared database.

    Returned connection is a context manager; use `with connect() as conn:`
    so transactions commit/rollback deterministically.
    """
    try:
        import psycopg
    except ImportError as e:
        raise RuntimeError(
            'psycopg not installed. Run: pip install "psycopg[binary]"'
        ) from e
    return psycopg.connect(get_database_url(), autocommit=autocommit)
