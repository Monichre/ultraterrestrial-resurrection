"""Tests for lib.db.postgres_client - the shared Neon Postgres client.

Mocks the psycopg boundary; no live database required.
"""
import os
import sys
from pathlib import Path
from unittest import mock

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from lib.db import postgres_client  # noqa: E402


def test_env_var_wins():
    """DATABASE_URL from the process environment is used verbatim."""
    with mock.patch.dict(os.environ, {"DATABASE_URL": "postgresql://env-host/db"}):
        assert postgres_client.get_database_url() == "postgresql://env-host/db"


def test_falls_back_to_packages_db_env(tmp_path):
    """Without an env var, the URL comes from packages/db/.env."""
    env_file = tmp_path / ".env"
    env_file.write_text(
        "OTHER=x\nDATABASE_URL=\"postgresql://neon-fallback/db\"\n"
    )
    with mock.patch.dict(os.environ, {}, clear=False), \
         mock.patch.object(postgres_client, "_PACKAGES_DB_ENV", env_file):
        os.environ.pop("DATABASE_URL", None)
        assert postgres_client.get_database_url() == "postgresql://neon-fallback/db"


def test_missing_everywhere_raises(tmp_path):
    """No env var and no dotenv file -> RuntimeError, not sys.exit."""
    with mock.patch.dict(os.environ, {}, clear=False), \
         mock.patch.object(postgres_client, "_PACKAGES_DB_ENV", tmp_path / "absent.env"):
        os.environ.pop("DATABASE_URL", None)
        with pytest.raises(RuntimeError, match="DATABASE_URL not set"):
            postgres_client.get_database_url()


def test_connect_passes_resolved_url_to_psycopg():
    """connect() hands the resolved URL and autocommit flag to psycopg.connect."""
    fake_psycopg = mock.MagicMock()
    with mock.patch.dict(os.environ, {"DATABASE_URL": "postgresql://target/db"}), \
         mock.patch.dict(sys.modules, {"psycopg": fake_psycopg}):
        conn = postgres_client.connect(autocommit=True)
    fake_psycopg.connect.assert_called_once_with(
        "postgresql://target/db", autocommit=True
    )
    assert conn is fake_psycopg.connect.return_value


def test_packages_db_env_path_points_at_monorepo():
    """The fallback path resolves to <repo>/packages/db/.env, not somewhere odd."""
    p = postgres_client._PACKAGES_DB_ENV
    assert p.parts[-3:] == ("packages", "db", ".env")
    # parents[3] of lib/db/postgres_client.py is apps/; .parent is the repo root
    assert (p.parent.parent.parent / "apps" / "disclosure-rag").is_dir()
