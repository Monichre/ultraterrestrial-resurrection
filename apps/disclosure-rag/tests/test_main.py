"""Regression tests for main.py (T-045 M2).

Isolated: no live OpenAI, Upstash, QStash, Mem0, Postgres, or the canonical
knowledge base is touched. Heavy dependencies (FAISS, CocoIndex, OpenAI
clients, etc.) are never imported - tests either exercise pure functions
directly, or set `main._deps_loaded = True` and monkeypatch the specific
module-level globals a given code path reads, so `_import_heavy_dependencies()`
never actually runs.
"""
import sys
from pathlib import Path
from unittest.mock import MagicMock

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

import main  # noqa: E402


# ---------------------------------------------------------------------------
# H6: hostname-based YouTube detection (not substring matching)
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("url,expected", [
    ("https://youtube.com/watch?v=abc", True),
    ("https://www.youtube.com/watch?v=abc", True),
    ("https://youtu.be/abc", True),
    ("https://m.youtube.com/watch?v=abc", True),
    ("https://music.youtube.com/watch?v=abc", True),
    # Adversarial cases the review's substring check accepted incorrectly:
    ("https://example.com/?next=youtube.com/watch?v=abc", False),
    ("https://notyoutube.com/watch?v=abc", False),
    ("https://evil.com/?x=youtube.com/watch", False),
    ("https://example.com/article", False),
    ("not a url", False),
    ("", False),
])
def test_is_youtube_url(url, expected):
    assert main.is_youtube_url(url) is expected


# ---------------------------------------------------------------------------
# Stage-report helpers (H7)
# ---------------------------------------------------------------------------

def test_stage_helpers_status_values():
    assert main._stage("x", True)["status"] == "success"
    assert main._stage("x", False)["status"] == "failed"
    assert main._skipped("x")["status"] == "skipped"
    assert main._unknown("x")["status"] == "unknown"


def test_detail_truncates_long_values():
    long_value = "a" * 500
    detail = main._detail(long_value, limit=200)
    assert len(detail) == 200
    assert detail.endswith("…")


def test_detail_coerces_non_string():
    assert main._detail({"a": 1}) == "{'a': 1}"
    assert main._detail(None) == ""


@pytest.mark.parametrize("queue_result,expected_status", [
    (None, "unknown"),
    ({"success": False, "skipped": True}, "skipped"),
    ({"success": False, "error": "boom"}, "failed"),
    ({"qstash_response": {"id": "1"}, "vector_upload": {"success": False}}, "failed"),
    ({"qstash_response": {"id": "1"}}, "success"),
    ({"success": True}, "success"),
    ({"unexpected": "shape"}, "unknown"),
])
def test_summarize_queue_result(queue_result, expected_status):
    assert main._summarize_queue_result(queue_result)["status"] == expected_status


# ---------------------------------------------------------------------------
# H5: --status reports operational CocoIndex readiness, not import success
# ---------------------------------------------------------------------------

def test_status_reports_cocoindex_not_operational_when_package_missing(
        monkeypatch, capsys):
    monkeypatch.setattr(main, "kb_service", MagicMock(
        get_integration_status=MagicMock(return_value={
            "local_kb": True, "search_sync": False,
            "search_url": False, "search_token": False,
        })))
    monkeypatch.setattr(main, "COCOINDEX_KG_AVAILABLE", True)
    monkeypatch.setattr(main, "cocoindex_processor",
                         MagicMock(cocoindex_available=False))
    monkeypatch.setattr(main, "display", MagicMock())
    monkeypatch.setattr(main, "_import_heavy_dependencies", lambda: None)
    monkeypatch.setattr(sys, "argv", ["main.py", "--status"])

    main.main()

    out = capsys.readouterr().out
    assert "CocoIndex KG: ❌" in out
    assert "package is not installed" in out


def test_status_reports_cocoindex_operational_when_package_present(
        monkeypatch, capsys):
    monkeypatch.setattr(main, "kb_service", MagicMock(
        get_integration_status=MagicMock(return_value={
            "local_kb": True, "search_sync": False,
            "search_url": False, "search_token": False,
        })))
    monkeypatch.setattr(main, "COCOINDEX_KG_AVAILABLE", True)
    monkeypatch.setattr(main, "cocoindex_processor", MagicMock(
        cocoindex_available=True,
        get_processing_status=MagicMock(return_value={"status": "success", "statistics": {}}),
    ))
    monkeypatch.setattr(main, "display", MagicMock())
    monkeypatch.setattr(main, "_import_heavy_dependencies", lambda: None)
    monkeypatch.setattr(sys, "argv", ["main.py", "--status"])

    main.main()

    out = capsys.readouterr().out
    assert "CocoIndex KG: ✅" in out
    assert "package is not installed" not in out


# ---------------------------------------------------------------------------
# M1: heavy dependencies stay lazy until after argument parsing
# ---------------------------------------------------------------------------

def test_help_does_not_trigger_heavy_imports(monkeypatch):
    monkeypatch.setattr(main, "_deps_loaded", False)
    monkeypatch.setattr(sys, "argv", ["main.py", "--help"])

    with pytest.raises(SystemExit) as exc_info:
        main.main()

    assert exc_info.value.code == 0
    assert main._deps_loaded is False


# ---------------------------------------------------------------------------
# M3: exceptions preserve partial progress instead of collapsing to None
# ---------------------------------------------------------------------------

def test_process_file_kb_write_failure_preserves_partial_stages(
        monkeypatch, tmp_path):
    monkeypatch.setattr(main, "_deps_loaded", True)
    monkeypatch.setattr(main, "display", MagicMock())
    monkeypatch.setattr(main, "ContentAnalysisEngine", MagicMock(
        return_value=MagicMock(process_for_rag=MagicMock(return_value={
            "status": "ok",
            "embeddable_texts": ["chunk one"],
            "metadata": {"chunk_count": 1, "embeddable_count": 1,
                         "ingestion_recommendation": "index"},
        }))))
    monkeypatch.setattr(main, "add_to_knowledge_base",
                         MagicMock(side_effect=RuntimeError("db unreachable")))

    src = tmp_path / "note.txt"
    src.write_text("some research content", encoding="utf-8")

    result = main.process_file(str(src), upload=False, add_to_kb=True)

    assert result is not None, (
        "a KB write failure must not discard already-collected stage_report data")
    assert result.get("doc_id") is None

    stages_by_name = {s["name"]: s for s in result["stage_report"]}
    assert stages_by_name["File content extraction"]["status"] == "success"
    assert stages_by_name["RAG prompt pipeline"]["status"] == "success"
    assert stages_by_name["Knowledge base storage"]["status"] == "failed"
    assert "db unreachable" in stages_by_name["Knowledge base storage"]["detail"]


def test_process_file_unexpected_crash_before_data_returns_none(
        monkeypatch, tmp_path):
    """A failure before `data` exists (e.g. content extraction itself) has
    nothing to salvage - it still returns None, not a half-built dict."""
    monkeypatch.setattr(main, "_deps_loaded", True)
    monkeypatch.setattr(main, "display", MagicMock())

    src = tmp_path / "note.txt"
    src.write_text("content", encoding="utf-8")

    # Force the failure to happen while building `title`, before `data` is
    # assigned, by making Path.stem explode via a patched title step is
    # awkward - instead simulate it directly by pointing at a file that
    # exists() but errors on open() with something other than
    # UnicodeDecodeError (PermissionError), which isn't special-cased and
    # falls through to the outer except with `data` still None.
    import builtins
    real_open = builtins.open

    def failing_open(path, *args, **kwargs):
        if str(path) == str(src) and "r" in (args[0] if args else kwargs.get("mode", "r")):
            raise PermissionError("no access")
        return real_open(path, *args, **kwargs)

    monkeypatch.setattr(builtins, "open", failing_open)

    result = main.process_file(str(src), upload=False, add_to_kb=True)
    assert result is None


def test_process_url_extraction_failure_preserves_stage_report(monkeypatch):
    monkeypatch.setattr(main, "_deps_loaded", True)
    monkeypatch.setattr(main, "process_web_url_enhanced",
                         MagicMock(side_effect=RuntimeError("network down")))
    monkeypatch.setattr(main, "process_youtube_url_enhanced", MagicMock())

    result = main.process_url("https://example.com/article", upload=False, add_to_kb=True)

    assert result is not None, (
        "an extraction exception must be reported as a failed stage, not raised")
    stage = result["stage_report"][0]
    assert stage["name"] == "Web content extraction"
    assert stage["status"] == "failed"
    assert "network down" in stage["detail"]


# ---------------------------------------------------------------------------
# H7 (remaining half): main()'s banner/exit code reflect real stage outcomes
# ---------------------------------------------------------------------------

def test_main_exits_nonzero_when_a_stage_failed(monkeypatch, capsys):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-" + "x" * 20)
    monkeypatch.setattr(main, "_import_heavy_dependencies", lambda: None)
    monkeypatch.setattr(main, "display", MagicMock())
    monkeypatch.setattr(main, "process_file", MagicMock(return_value={
        "title": "Some Doc",
        "source": "some/local/file.txt",
        "stage_report": [
            {"name": "File content extraction", "status": "success", "detail": ""},
            {"name": "Knowledge base storage", "status": "failed", "detail": "db unreachable"},
        ],
    }))
    monkeypatch.setattr(sys, "argv", ["main.py", "some/local/file.txt"])

    with pytest.raises(SystemExit) as exc_info:
        main.main()

    assert exc_info.value.code == 1
    out = capsys.readouterr().out
    assert "completed with failures" in out
    assert "Processing complete!" not in out


def test_main_reports_clean_success_without_exit(monkeypatch, capsys):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-" + "x" * 20)
    monkeypatch.setattr(main, "_import_heavy_dependencies", lambda: None)
    monkeypatch.setattr(main, "display", MagicMock())
    monkeypatch.setattr(main, "process_file", MagicMock(return_value={
        "title": "Some Doc",
        "source": "some/local/file.txt",
        "doc_id": "doc-123",
        "stage_report": [
            {"name": "File content extraction", "status": "success", "detail": ""},
            {"name": "Knowledge base storage", "status": "success", "detail": ""},
        ],
    }))
    monkeypatch.setattr(sys, "argv", ["main.py", "some/local/file.txt"])

    main.main()  # must not raise SystemExit on a clean run

    out = capsys.readouterr().out
    assert "Processing complete!" in out
    assert "completed with failures" not in out


# ---------------------------------------------------------------------------
# Credential validation
# ---------------------------------------------------------------------------

def test_validate_credentials_missing_openai_key_is_hard_error(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    issues = main._validate_credentials(require_upload=False)
    assert any(i["level"] == "error" for i in issues)


def test_validate_credentials_well_formed_key_no_errors(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-" + "x" * 20)
    monkeypatch.delenv("QSTASH_TOKEN", raising=False)
    monkeypatch.delenv("MEM0_API_KEY", raising=False)
    issues = main._validate_credentials(require_upload=False)
    assert not any(i["level"] == "error" for i in issues)
    # MEM0 missing is a warning, not an error
    assert any("MEM0_API_KEY" in i["message"] for i in issues)


def test_validate_credentials_upload_without_qstash_warns(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-" + "x" * 20)
    monkeypatch.delenv("QSTASH_TOKEN", raising=False)
    issues = main._validate_credentials(require_upload=True)
    assert any("QSTASH_TOKEN" in i["message"] for i in issues)


# ---------------------------------------------------------------------------
# Dry-run plan derivation (no side effects)
# ---------------------------------------------------------------------------

def test_dry_run_plan_for_youtube_url_no_side_effects():
    lines = main._build_dry_run_plan(
        "https://youtu.be/abc123", upload=False, add_to_kb=True)
    assert any("YouTube" in line for line in lines)


def test_dry_run_plan_for_web_url():
    lines = main._build_dry_run_plan(
        "https://example.com/article", upload=False, add_to_kb=True)
    assert any("web" in line for line in lines)


def test_dry_run_plan_no_kb_skips_writes():
    lines = main._build_dry_run_plan(
        "https://example.com/article", upload=False, add_to_kb=False)
    assert any("SKIPPED" in line for line in lines)


def test_dry_run_plan_missing_file_reports_it_would_fail(tmp_path):
    missing = tmp_path / "does_not_exist.txt"
    lines = main._build_dry_run_plan(str(missing), upload=False, add_to_kb=True)
    assert any("does not exist" in line for line in lines)


def test_dry_run_plan_writes_no_files(tmp_path):
    src = tmp_path / "doc.txt"
    src.write_text("content", encoding="utf-8")
    before = set(tmp_path.iterdir())

    main._build_dry_run_plan(str(src), upload=True, add_to_kb=True)

    after = set(tmp_path.iterdir())
    assert before == after
