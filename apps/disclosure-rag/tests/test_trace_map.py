"""Guards for the Trace Map artefact (docs/TRACE_MAP_OUTPUT_SPEC.md).

The spec's own validation gates are the test plan. Three things it declares
invalid are easy to reintroduce by accident and each has a test here:

1. **A Claim with no segment anchor.** Anchoring is text alignment against a
   transcript the model lightly rewrote, so it is inherently lossy. The
   builder's answer is that an unanchorable assertion is not a Claim at all —
   it is agent-produced and becomes an `inference` carrying `[Inferred]`. If
   that ever regresses into "anchor it loosely and move on", the graph starts
   claiming source support it does not have.

2. **A Markdown projection carrying semantics absent from the JSON.** Enforced
   by signature: `render_trace_map_markdown` takes the graph and nothing else.

3. **A diagram node that cannot be resolved to a canonical node ID.** Mermaid
   IDs are positional, so the trace index is what makes them reversible. The
   test walks every rendered Mermaid ID and resolves it.

The fourth theme is honesty about absence: `validate_trace_map` must report
gaps rather than let a thin map look complete, and must never be satisfiable
by fabricating the missing nodes.
"""
from __future__ import annotations

import json
import re
import tempfile
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.trace_map import (CANONICAL_STATES, SCHEMA_VERSION, SegmentIndex,
                           build_trace_map, render_trace_map_markdown,
                           validate_trace_map, write_trace_map)


def _segments():
    """Three timed segments whose text the fixtures below quote from."""
    return [
        {"ordinal": 0, "text": "the president issued a directive to start "
                               "releasing information", "start": 10.0,
         "duration": 5.0},
        {"ordinal": 1, "text": "i was in the oval office with the president "
                               "on february the sixth", "start": 15.0,
         "duration": 5.0},
        {"ordinal": 2, "text": "there was a staff secretary by the name of "
                               "william scharf", "start": 20.0,
         "duration": 5.0},
    ]


def _pipeline_result(**overrides):
    result = {
        "status": "ok",
        "classification": {"content_type": "interview_transcript",
                           "ingestion_recommendation": "proceed"},
        "analysis": {
            "content_assessment": {
                "follow_up_needed": ["Verify the date of the Oval Office "
                                     "meeting described."],
            },
            "extracted_data": {
                "primary_claims": [],
                "supporting_evidence": [],
                "contradictory_evidence": [],
                "key_findings": [],
            },
        },
        "ingestion": {"document": {"title_guess": "Test source",
                                   "integrity_flags": []}},
        "chunks": [{
            "chunk_id": "c01",
            "heading_path": "Opening",
            "text": "the president issued a directive to start releasing "
                    "information i was in the oval office with the president "
                    "on february the sixth",
            "claims_hint": ["The president issued a disclosure directive"],
            "evidentiary_density": "high",
        }],
        "ner_results": [],
        "metadata": {"prompts_used": ["rag_ingestion"], "tiers_used": ["t1"]},
    }
    result.update(overrides)
    return result


def _build(**kwargs):
    params = {
        "pipeline_result": _pipeline_result(),
        "segments": _segments(),
        "source_url": "https://example.test/v",
        "source_title": "Test source",
        "source_id": "testvid",
        "transcript_text": "unused for these assertions",
    }
    params.update(kwargs)
    return build_trace_map(**params)


# --------------------------------------------------------------------------
# alignment
# --------------------------------------------------------------------------

def test_segment_index_anchors_a_verbatim_quote_to_real_time():
    index = SegmentIndex(_segments())
    anchor = index.locate("i was in the oval office with the president")

    assert anchor is not None
    assert anchor["method"] == "exact"
    assert anchor["segmentStart"] == 1
    assert anchor["startSeconds"] == 15.0


def test_segment_index_recovers_a_lightly_rewritten_span():
    """The chunker rewrites whitespace and filler, so only a minority of
    chunks match verbatim. Head-and-tail matching is what recovers the rest —
    and the anchor must say it was recovered, not claim to be exact."""
    index = SegmentIndex(_segments())
    rewritten = ("the president issued a directive to start releasing "
                 "INFORMATION, and then, i was in the oval office with the "
                 "president on february the sixth")

    anchor = index.locate(rewritten)

    assert anchor is not None
    assert anchor["method"] == "prefix_suffix"
    assert anchor["segmentStart"] == 0
    assert anchor["segmentEnd"] == 1


def test_segment_index_refuses_to_anchor_a_short_fragment():
    """A four-word fragment matches in a dozen places. Anchoring it would
    produce a confident-looking citation pointing at the wrong moment."""
    assert SegmentIndex(_segments()).locate("the president") is None


def test_build_without_segments_reports_untimed_rather_than_failing():
    graph = _build(segments=[])

    assert graph["coverage"]["timed"] is False
    assert any("no timed segment sidecar" in gap
               for gap in graph["validation"]["gaps"])


# --------------------------------------------------------------------------
# the claim / inference boundary — the spec's central gate
# --------------------------------------------------------------------------

def test_unanchorable_analysis_claim_becomes_an_inference_not_a_claim():
    """A paraphrase the source never says is agent-produced. The spec makes
    that a typing rule, not a quality score: a Claim needs an exact segment
    anchor, and an Inference may never be stored as a Claim."""
    result = _pipeline_result()
    result["analysis"]["extracted_data"]["primary_claims"] = [
        "A non-human intelligence has been present on Earth for millennia, "
        "which the interviewee never states in these words.",
    ]

    graph = _build(pipeline_result=result)
    labels = {n["type"]: [x["label"] for x in graph["nodes"]
                          if x["type"] == n["type"]]
              for n in graph["nodes"]}

    assert not any("non-human intelligence" in c.lower()
                   for c in labels.get("claim", []))
    inferred = [n for n in graph["nodes"]
                if n["type"] == "inference"
                and "non-human intelligence" in n["label"].lower()]
    assert len(inferred) == 1
    assert inferred[0]["state"] == "Inferred"


def test_anchorable_analysis_claim_becomes_a_claim_with_a_timestamp():
    result = _pipeline_result()
    result["analysis"]["extracted_data"]["primary_claims"] = [
        "the president issued a directive to start releasing information",
    ]

    graph = _build(pipeline_result=result)
    claims = [n for n in graph["nodes"]
              if n["type"] == "claim" and "directive" in n["label"]]

    assert claims, "a verbatim claim must be typed as a Claim"
    assert claims[0]["anchor"]["startSeconds"] == 10.0


def test_every_claim_node_carries_an_anchor():
    graph = _build()
    for node in graph["nodes"]:
        if node["type"] == "claim":
            assert (node.get("anchor") or {}).get("charStart") is not None, \
                f"{node['id']} is a Claim with no source anchor"
    assert graph["validation"]["valid"] is True


def test_evidence_keeps_only_the_quoted_span_not_the_analyst_wrapper():
    """`supporting_evidence` is written as prose wrapped around a quotation.
    The wrapper is the analyst's characterisation and can never be Evidence;
    only the quotation inside it is source material."""
    result = _pipeline_result()
    result["analysis"]["extracted_data"]["supporting_evidence"] = [
        "Bigelow describes the meeting: 'i was in the oval office with the "
        "president on february the sixth'",
    ]

    graph = _build(pipeline_result=result)
    evidence = [n for n in graph["nodes"] if n["type"] == "evidence"]

    assert len(evidence) == 1
    assert evidence[0]["label"].startswith("i was in the oval office")
    assert "Bigelow describes" not in evidence[0]["label"]
    assert evidence[0]["stance"] == "supporting"
    assert evidence[0]["anchor"]["startSeconds"] == 15.0


def test_unquotable_evidence_degrades_to_inference():
    result = _pipeline_result()
    result["analysis"]["extracted_data"]["contradictory_evidence"] = [
        "The interviewee's account of the meeting cannot be reconciled with "
        "the published record of that week.",
    ]

    graph = _build(pipeline_result=result)

    assert not [n for n in graph["nodes"] if n["type"] == "evidence"]
    degraded = [n for n in graph["nodes"]
                if n["type"] == "inference" and n.get("stance") == "contradictory"]
    assert len(degraded) == 1
    assert degraded[0]["state"] == "Inferred"


# --------------------------------------------------------------------------
# validation: errors vs gaps
# --------------------------------------------------------------------------

def test_validator_rejects_a_claim_without_an_anchor():
    """The auditor has to actually fail something, or every map passes and the
    tests above prove nothing."""
    graph = _build()
    for node in graph["nodes"]:
        if node["type"] == "claim":
            node["anchor"] = {}
            break

    report = validate_trace_map(graph)

    assert report["valid"] is False
    assert any("no source segment anchor" in e for e in report["errors"])


def test_validator_rejects_an_agent_node_missing_inferred():
    graph = _build()
    graph["nodes"].append({"id": "inf:x", "type": "inference",
                           "label": "an unlabelled interpretation"})

    report = validate_trace_map(graph)

    assert report["valid"] is False
    assert any("[Inferred]" in e for e in report["errors"])


def test_validator_rejects_a_non_canonical_evidentiary_state():
    graph = _build()
    graph["nodes"].append({"id": "ent:x", "type": "entity", "label": "X",
                           "state": "Probably True"})

    report = validate_trace_map(graph)

    assert report["valid"] is False
    assert any("non-canonical evidentiary state" in e for e in report["errors"])
    assert "Probably True" not in CANONICAL_STATES


def test_validator_rejects_an_unreconstructable_source_order():
    graph = _build()
    graph["views"]["sourceSpine"] = graph["views"]["sourceSpine"] + ["seg:ghost"]

    report = validate_trace_map(graph)

    assert report["valid"] is False
    assert any("unknown nodes" in e or "unreconstructable" in e
               for e in report["errors"])


def test_validator_rejects_a_reading_without_a_counter_reading():
    graph = _build()
    graph["nodes"].append({"id": "rdg:x", "type": "reading",
                           "label": "one interpretation", "state": "Inferred"})

    report = validate_trace_map(graph)

    assert report["valid"] is False
    assert any("no counter-reading" in e for e in report["errors"])


def test_missing_next_traces_is_a_gap_not_an_error():
    """The spec says the graph must end with Next Traces. Nothing in this
    pipeline proposes them. Reporting that as an error would make every map
    invalid and invite someone to fabricate next traces to turn the gate
    green — which is the failure mode the artefact exists to prevent."""
    graph = _build()
    report = graph["validation"]

    assert report["valid"] is True
    assert not [n for n in graph["nodes"] if n["type"] == "next_trace"]
    assert any("no next_trace nodes" in g for g in report["gaps"])
    assert any("no reading nodes" in g for g in report["gaps"])


def test_absent_evidence_to_claim_linkage_is_reported_as_a_gap():
    """Evidence carries a stance but names no claim, because no pipeline stage
    emits that linkage. Guessing the target by lexical overlap would invent an
    epistemic relationship, so the map states the gap instead."""
    result = _pipeline_result()
    result["analysis"]["extracted_data"]["supporting_evidence"] = [
        "He said 'i was in the oval office with the president on february "
        "the sixth'",
    ]

    graph = _build(pipeline_result=result)

    assert [n for n in graph["nodes"] if n["type"] == "evidence"]
    assert not [e for e in graph["edges"]
                if e["type"] in ("supports", "contradicts", "corroborates")]
    assert any("no evidence→claim edges" in g
               for g in graph["validation"]["gaps"])


def test_partial_coverage_is_surfaced_not_hidden():
    """A map built from a truncated chunk set describes a fraction of the
    source. Silence about that reads as full coverage."""
    graph = _build()

    coverage = graph["coverage"]
    assert 0 < coverage["fraction"] < 1
    assert coverage["segmentsTotal"] == 3
    assert any("chunk coverage is" in g for g in graph["validation"]["gaps"])


# --------------------------------------------------------------------------
# rendering contract
# --------------------------------------------------------------------------

def test_renderer_takes_the_graph_and_nothing_else():
    """'The Markdown projection contains semantic information absent from the
    JSON graph' is an invalidating condition. Denying the renderer any other
    argument is the cheapest way to guarantee it structurally."""
    import inspect

    params = list(inspect.signature(render_trace_map_markdown).parameters)
    assert params == ["graph"]


def test_every_mermaid_id_resolves_to_a_canonical_node_id():
    """The spec invalidates a map whose diagram node cannot be resolved to a
    JSON node ID. Positional Mermaid IDs are only legitimate because the trace
    index makes them reversible — so walk the rendered diagrams and resolve."""
    result = _pipeline_result()
    result["analysis"]["extracted_data"]["supporting_evidence"] = [
        "He said 'i was in the oval office with the president on february "
        "the sixth'",
    ]
    graph = _build(pipeline_result=result)
    markdown = render_trace_map_markdown(graph)

    index = dict(re.findall(r"\|\s*`(n\d+)`\s*\|\s*`([^`]+)`\s*\|", markdown))
    assert index, "the trace index table is missing"

    node_ids = {n["id"] for n in graph["nodes"]}
    diagram_ids = set()
    for block in re.findall(r"```mermaid\n(.*?)```", markdown, re.DOTALL):
        diagram_ids.update(re.findall(r"\b(n\d+)\b", block))

    assert diagram_ids, "no mermaid diagrams were rendered"
    for diagram_id in sorted(diagram_ids):
        assert diagram_id in index, f"{diagram_id} is absent from the trace index"
        assert index[diagram_id] in node_ids, \
            f"{diagram_id} resolves to {index[diagram_id]}, which is not a node"


def test_markdown_states_coverage_and_gaps_up_front():
    markdown = render_trace_map_markdown(_build())

    assert "## Coverage" in markdown
    assert "## Limitations" in markdown
    assert "[Inferred]" in markdown
    assert markdown.index("## Coverage") < markdown.index("## Source spine")


def test_write_trace_map_emits_both_files_and_a_gradeable_summary():
    graph = _build()

    with tempfile.TemporaryDirectory() as tmp:
        summary = write_trace_map(tmp, "fixture", graph)

        assert Path(summary["json_path"]).exists()
        assert Path(summary["md_path"]).exists()
        assert summary["valid"] is True
        assert summary["error_count"] == 0
        assert summary["gap_count"] > 0
        written = json.loads(Path(summary["json_path"]).read_text())
        assert written["schemaVersion"] == SCHEMA_VERSION
        # The projection must be rendered from what was written, so the file
        # on disk has to be sufficient to reproduce it.
        assert render_trace_map_markdown(written)


# --------------------------------------------------------------------------
# identity
# --------------------------------------------------------------------------

def test_node_ids_are_stable_across_reruns():
    """Two runs over the same source must be diffable, which means no
    timestamp or ordering accident may leak into an ID."""
    first = _build()
    second = _build()

    assert [n["id"] for n in first["nodes"]] == [n["id"] for n in second["nodes"]]
    assert first["sourceId"] == second["sourceId"]
    assert first["sourceHash"] == second["sourceHash"]


def test_reordering_the_source_changes_nothing_but_position():
    """The same claim in the same source keeps its ID even when the analysis
    stage returns it in a different order — otherwise no two runs can be
    compared, which is the whole reason IDs are content hashes."""
    result = _pipeline_result()
    result["chunks"][0]["claims_hint"] = ["Claim A stated here", "Claim B too"]
    forward = _build(pipeline_result=result)

    result["chunks"][0]["claims_hint"] = ["Claim B too", "Claim A stated here"]
    reversed_run = _build(pipeline_result=result)

    assert ({n["id"] for n in forward["nodes"] if n["type"] == "claim"}
            == {n["id"] for n in reversed_run["nodes"] if n["type"] == "claim"})


# --------------------------------------------------------------------------
# run-summary integration
# --------------------------------------------------------------------------

def test_trace_map_stage_grades_a_real_map_as_success():
    import main

    stage = main._trace_map_stage({
        "json_path": "/tmp/x_trace_map.json", "md_path": "/tmp/x_trace_map.md",
        "node_count": 134, "edge_count": 200, "coverage_fraction": 0.2266,
        "valid": True, "error_count": 0, "gap_count": 6,
    })

    assert stage["status"] == "success"
    assert "134 nodes" in stage["detail"]
    assert "23% coverage" in stage["detail"]
    assert "6 gaps" in stage["detail"]


def test_trace_map_stage_fails_on_validation_errors_not_gaps():
    """Gaps are honest; errors mean the artefact is unsound. Only the second
    may fail the run — otherwise every map fails and the signal is worthless."""
    import main

    gappy = main._trace_map_stage({
        "json_path": "/tmp/x.json", "node_count": 10, "edge_count": 9,
        "coverage_fraction": 0.2, "error_count": 0, "gap_count": 6})
    broken = main._trace_map_stage({
        "json_path": "/tmp/x.json", "node_count": 10, "edge_count": 9,
        "coverage_fraction": 0.2, "error_count": 2, "gap_count": 6})

    assert gappy["status"] == "success"
    assert broken["status"] == "failed"
    assert "2 validation errors" in broken["detail"]


def test_trace_map_stage_never_reads_absence_as_success():
    """A best-effort writer that reports nothing is how an empty artefact ends
    up under a green tick — the exact defect the enrichment gate fixed one
    layer up."""
    import main

    assert main._trace_map_stage(None)["status"] == "skipped"
    assert main._trace_map_stage({"error": "boom"})["status"] == "failed"
    assert main._trace_map_stage({"node_count": 3})["status"] == "unknown"


def test_process_url_emits_a_trace_map_stage():
    """The map is written inside generate_transcript, several layers below
    process_url. If the summary does not survive that trip the stage silently
    reports 'skipped' on runs that produced a real graph."""
    from unittest.mock import patch

    import main

    result = {
        "rag_pipeline": {"status": "ok", "embeddable_count": 8},
        "trace_map": {"json_path": "/tmp/x_trace_map.json", "node_count": 134,
                      "edge_count": 200, "coverage_fraction": 0.23,
                      "error_count": 0, "gap_count": 6},
    }

    with patch.object(main, "_import_heavy_dependencies", lambda: None), \
            patch.object(main, "process_youtube_url_enhanced",
                         lambda *a, **k: result):
        stages = main.process_url(
            "https://youtu.be/test", add_to_kb=False)["stage_report"]

    trace_stages = [s for s in stages if s["name"] == "Trace map"]
    assert len(trace_stages) == 1
    assert trace_stages[0]["status"] == "success"
    assert "134 nodes" in trace_stages[0]["detail"]


def test_an_empty_map_is_valid_but_never_looks_complete():
    """A pipeline that produced no chunks yields a map that asserts nothing
    false — structurally valid and completely useless.

    This is the shape of the 2026-08-09 q0N33jb7Bhk run and of all 59 hollow
    `_rag_pipeline.json` files in the transcript corpus: rich document-level
    analysis, zero chunks, zero NER, nothing anchored. Every one of those
    produces inference nodes and no source material. Without an explicit gap
    the map passes with a clean bill of health, which is how the original
    silent-success defect looked one layer up.
    """
    hollow = _pipeline_result(chunks=[], ner_results=[])
    hollow["status"] = "error"
    hollow["analysis"]["extracted_data"]["primary_claims"] = [
        "A claim the analysis stage produced with no chunk to anchor it in.",
    ]

    graph = _build(pipeline_result=hollow, segments=[])
    report = graph["validation"]

    assert not [n for n in graph["nodes"] if n["type"] == "segment"]
    assert not [n for n in graph["nodes"] if n["type"] == "claim"]
    assert [n for n in graph["nodes"] if n["type"] == "inference"], \
        "document-level analysis must survive as [Inferred], not vanish"
    assert report["errors"] == []
    assert any("no source spine" in g for g in report["gaps"])
    assert any("no claims anchored" in g for g in report["gaps"])


def test_a_document_without_timing_still_anchors_by_character_range():
    """Local files and web articles have no timed sidecar. The spec allows a
    character range as a segment anchor, and without one the anchor test that
    decides Claim-vs-Inference has nothing to test against — every claim comes
    out anchorless and the map fails validation on every file ingest."""
    document = ("the president issued a directive to start releasing "
                "information i was in the oval office with the president "
                "on february the sixth")

    graph = _build(segments=[], transcript_text=document)
    claims = [n for n in graph["nodes"] if n["type"] == "claim"]

    assert graph["validation"]["valid"] is True, graph["validation"]["errors"]
    assert claims, "a document must still produce anchored claims"
    assert claims[0]["anchor"]["charStart"] is not None
    assert claims[0]["anchor"]["startSeconds"] is None
    # Anchored, but not on the clock — and the artefact must say which.
    assert graph["coverage"]["timed"] is False
    assert any("no timed segment sidecar" in g
               for g in graph["validation"]["gaps"])


def test_a_chunk_the_aligner_missed_never_emits_anchorless_claims():
    """The claim/inference rule applies uniformly, whatever the source of the
    assertion. A chunk whose text cannot be located has no passage behind it,
    so its claims_hint entries are agent-produced. Without this they became
    Claims with a null anchor, which fails validation and takes the run's exit
    code down with it."""
    result = _pipeline_result()
    result["chunks"][0]["text"] = "text that appears nowhere in the source"

    graph = _build(pipeline_result=result)

    assert graph["validation"]["valid"] is True, graph["validation"]["errors"]
    assert not [n for n in graph["nodes"] if n["type"] == "claim"]
    orphaned = [n for n in graph["nodes"]
                if n["type"] == "inference"
                and "disclosure directive" in n["label"]]
    assert len(orphaned) == 1
    assert orphaned[0]["state"] == "Inferred"
    assert "could not be located" in orphaned[0]["note"]
