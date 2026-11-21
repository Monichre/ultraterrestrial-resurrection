"""Guards for structured-output schemas and the tier-capability fallback.

Two separate things are checked here, both of which failed silently before:

1. **A schema sent under `strict: true` must satisfy strict's dialect.** Strict
   is a *narrower* JSON Schema than the one these files are written in: every
   object needs `additionalProperties: false` and every declared property must
   appear in `required`. A provider that validates the dialect answers a
   violation with a 400, which would take down every call routed through that
   tier — not just the one document.

   Only schemas listed in STRICT_SCHEMAS are held to this. The others are sent
   unconstrained today; adding one here is the gate for turning strict on for
   it, not a description of what already happens.

2. **`_is_schema_rejection` must stay narrow.** It decides whether a 400 means
   "this tier does not implement structured output" (retry it unconstrained) or
   "your request was bad" (a real failure). If it matches too eagerly, a
   genuinely malformed request gets silently retried as though the schema were
   at fault and the true error never surfaces.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

SCHEMA_DIR = ROOT.parents[1] / "packages" / "ai" / "prompts" / "schemas" / "output"

#: Schemas actually sent with strict=True. Keep in sync with the call sites.
STRICT_SCHEMAS = ["ingestion.schema.json"]


def _strict_violations(node, path="$"):
    """Every place `node` breaks OpenAI strict structured-output rules.

    Walks objects and array items recursively. Returns human-readable paths so
    a failure names the exact property to fix rather than just the file.
    """
    violations = []
    if not isinstance(node, dict):
        return violations

    if node.get("type") == "object" or "properties" in node:
        props = node.get("properties") or {}
        if node.get("additionalProperties") is not False:
            violations.append(f"{path}: missing additionalProperties: false")
        required = set(node.get("required") or [])
        missing = sorted(set(props) - required)
        if missing:
            violations.append(f"{path}: properties absent from required: {missing}")
        for name, sub in props.items():
            violations.extend(_strict_violations(sub, f"{path}.{name}"))

    items = node.get("items")
    if isinstance(items, dict):
        violations.extend(_strict_violations(items, f"{path}[]"))

    return violations


@pytest.mark.parametrize("filename", STRICT_SCHEMAS)
def test_strict_schema_satisfies_strict_dialect(filename):
    schema = json.loads((SCHEMA_DIR / filename).read_text())
    violations = _strict_violations(schema)
    assert not violations, f"{filename} is sent with strict=True but violates it:\n" + "\n".join(
        f"  - {v}" for v in violations
    )


def test_auditor_catches_a_known_violation():
    """The auditor must fail a schema that breaks the rules.

    Without this, a walker that silently returns [] for everything would make
    the test above pass for every file and prove nothing.
    """
    bad = {
        "type": "object",
        "properties": {"a": {"type": "string"}, "b": {"type": "string"}},
        "required": ["a"],
    }
    violations = _strict_violations(bad)
    assert any("additionalProperties" in v for v in violations)
    assert any("'b'" in v or "b" in v for v in violations)


def test_ingestion_schema_is_registered_for_rag_ingestion():
    """The schema is only load-bearing if load_prompt actually returns it."""
    from lib.prompt_loader import get_prompt_with_schema

    payload = get_prompt_with_schema(
        "rag_ingestion",
        {"source_text": "x", "provenance": "p", "content_type": "t",
         "target_chunk_tokens": "512"},
    )
    schema = payload.get("schema")
    assert schema is not None, "rag_ingestion resolved no schema — schema_ref not wired"
    assert set(schema["required"]) == {"document", "chunks", "index_recommendations"}


def test_content_analysis_is_not_schema_constrained():
    """disclosure.content_analysis must stay unconstrained.

    This is a decision lock, not a proven-regression lock. The plan for this
    work specified leaving `document_classification` and
    `disclosure.content_analysis` schema-less, because both were succeeding
    unconstrained and neither schema has been checked against what its prompt
    can actually emit.

    An earlier version of this test claimed attaching analysis.schema.json
    measurably cost four fields. That claim did not survive: removing the
    schema failed to restore three of them, and the per-run variance on this
    prompt is large enough that n=1 comparisons prove nothing. See the note on
    SCHEMA_ENABLED_PROMPTS.
    """
    from processing.rag_prompt_pipeline import (SCHEMA_ENABLED_PROMPTS,
                                                STRICT_SCHEMA_PROMPTS)

    assert "disclosure.content_analysis" not in SCHEMA_ENABLED_PROMPTS
    assert "document_classification" not in SCHEMA_ENABLED_PROMPTS
    # Strict is a narrowing of schema-enabled, never a superset.
    assert STRICT_SCHEMA_PROMPTS <= SCHEMA_ENABLED_PROMPTS
    # And every strict-enabled prompt must be audited by STRICT_SCHEMAS above.
    audited = {f.replace(".schema.json", "") for f in STRICT_SCHEMAS}
    assert {"ingestion"} <= audited


def test_only_enabled_prompts_send_a_schema():
    """The allowlist must actually gate what reaches the provider."""
    from unittest.mock import MagicMock, patch

    from processing.rag_prompt_pipeline import RagPromptPipeline

    seen = {}

    def fake_complete(system_prompt, user_content, **kwargs):
        seen[kwargs.get("schema_name")] = kwargs.get("schema") is not None
        return MagicMock(text='{"ok": true}', tier_id="t", provider="p",
                         attempts=1, degraded=False, schema_enforced=True)

    with patch("processing.rag_prompt_pipeline.get_fallback") as get_fb:
        get_fb.return_value = MagicMock(
            complete=fake_complete, describe=lambda: "t")
        pipeline = RagPromptPipeline()
        pipeline._run_registry_prompt("rag_ingestion", {
            "source_text": "x", "provenance": "p", "content_type": "c",
            "target_chunk_tokens": "512"})
        pipeline._run_registry_prompt("disclosure.content_analysis", {
            "source_text": "x", "content_type": "c", "context_hint": ""})

    assert seen["rag_ingestion"] is True, "rag_ingestion must send its schema"
    assert seen["disclosure_content_analysis"] is False, \
        "content_analysis must NOT send a schema — it costs whole fields"


def test_schema_rejection_detector_is_narrow():
    from lib.llm_fallback import _is_schema_rejection

    class Err(Exception):
        def __init__(self, message, status_code):
            super().__init__(message)
            self.status_code = status_code

    # Real shape of an OpenRouter refusal when the upstream provider has no
    # structured-output support.
    assert _is_schema_rejection(Err(
        "Error code: 400 - {'error': {'message': 'Provider does not support "
        "response_format of type json_schema', 'code': 400}}", 400))
    # Anthropic-shaped equivalent: the forced tool call is what got refused.
    assert _is_schema_rejection(Err(
        "Error code: 400 - tool_choice is not supported for this model", 400))

    # A genuinely malformed request must NOT be mistaken for a capability gap,
    # or the real error gets swallowed by an unconstrained retry.
    assert not _is_schema_rejection(Err(
        "Error code: 400 - {'error': {'message': 'messages: at least one "
        "message is required'}}", 400))
    # Neither may a server error or an auth failure.
    assert not _is_schema_rejection(Err("Error code: 500 - internal error", 500))
    assert not _is_schema_rejection(Err("Error code: 401 - invalid api key", 401))
