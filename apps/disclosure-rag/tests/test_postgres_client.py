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


def test_dotenv_export_prefix_and_inline_comment(tmp_path):
    """`export VAR=` lines and inline comments parse the way a shell would."""
    env_file = tmp_path / ".env"
    env_file.write_text(
        "# canonical connection\n"
        "export DATABASE_URL=\"postgresql://exported-host/db\"  # neon\n"
    )
    with mock.patch.dict(os.environ, {}, clear=False), \
         mock.patch.object(postgres_client, "_PACKAGES_DB_ENV", env_file):
        os.environ.pop("DATABASE_URL", None)
        assert postgres_client.get_database_url() == "postgresql://exported-host/db"


def test_dotenv_unquoted_value(tmp_path):
    """Unquoted values come through intact."""
    env_file = tmp_path / ".env"
    env_file.write_text("DATABASE_URL=postgresql://plain-host/db\n")
    with mock.patch.dict(os.environ, {}, clear=False), \
         mock.patch.object(postgres_client, "_PACKAGES_DB_ENV", env_file):
        os.environ.pop("DATABASE_URL", None)
        assert postgres_client.get_database_url() == "postgresql://plain-host/db"


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
    args, kwargs = fake_psycopg.connect.call_args
    assert args[0] == "postgresql://target/db"
    assert kwargs.get("autocommit") is True
    assert conn is fake_psycopg.connect.return_value


def test_connect_read_only_sets_session_guard():
    """read_only=True marks the psycopg session read-only."""
    fake_psycopg = mock.MagicMock()
    with mock.patch.dict(os.environ, {"DATABASE_URL": "postgresql://target/db"}), \
         mock.patch.dict(sys.modules, {"psycopg": fake_psycopg}):
        conn = postgres_client.connect(read_only=True)
    assert conn.read_only is True


def test_packages_db_env_path_points_at_monorepo():
    """The fallback path resolves to the real packages/db/.env location."""
    p = postgres_client._PACKAGES_DB_ENV
    assert p.name == ".env"
    assert p.parent.name == "db"
    assert p.parent.parent.name == "packages"
