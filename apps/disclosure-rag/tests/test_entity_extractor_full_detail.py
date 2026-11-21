"""Offline tests for the summary entity extractor. The model call is faked."""

import json
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from agents import entity_extraction_agent as mod

NINE = ("topics", "personnel", "events", "organizations", "locations",
        "testimonies", "documents", "artifacts", "sightings")


def _agent(response=None, error=None):
    agent = mod.EntityExtractionAgent.__new__(mod.EntityExtractionAgent)
    extractor = mod.AIEntityExtractor.__new__(mod.AIEntityExtractor)
    extractor._llm = Mock()
    if error is not None:
        extractor._llm.complete.side_effect = error
    else:
        extractor._llm.complete.return_value = SimpleNamespace(text=json.dumps(response))
    agent.ai_extractor = extractor
    agent.ai_available = True
    agent.search_tool = None
    return agent, extractor


def _empty():
    return {**{t: [] for t in NINE}, "relationships": [], "extraction_metadata": {}}


def test_schema_has_all_nine_types_and_named_items():
    schema = mod.AIEntityExtractor.__new__(mod.AIEntityExtractor)._create_entity_schema()
    for t in NINE:
        assert t in schema["properties"], t
        assert t in schema["required"], t
        assert "name" in schema["properties"][t]["items"]["required"], t


def test_full_detail_for_all_nine_types():
    response = _empty()
    response["testimonies"] = [{"name": "Grusch hearing", "claim": "Non-human biologics recovered",
                                "confidence": 0.9, "context": "testified under oath",
                                "metadata": {"witness": "David Grusch"}}]
    response["documents"] = [{"name": "Condon Report", "title": "Scientific Study of UFOs",
                              "confidence": 0.8, "context": "cited the Condon Report"}]
    response["sightings"] = [{"name": "Nimitz encounter", "description": "Tic Tac off San Diego",
                              "shape": "tic tac", "confidence": 0.9, "context": "2004 encounter"}]
    response["personnel"] = [{"name": "David Fravor", "confidence": 0.95, "context": "pilot",
                              "metadata": {"rank": "Commander"}}]
    response["relationships"] = [{"from_entity": "David Fravor", "from_type": "personnel",
                                  "to_entity": "Nimitz encounter", "to_type": "sightings",
                                  "relationship_type": "witnessed", "confidence": 0.9,
                                  "context": "Fravor saw it"}]
    agent, extractor = _agent(response)

    out = agent.extract_entities("summary text", detailed=True)

    assert set(out) == set(NINE) | {"relationships"}
    assert out["testimonies"][0]["metadata"]["claim"] == "Non-human biologics recovered"
    assert out["testimonies"][0]["metadata"]["witness"] == "David Grusch"
    assert out["documents"][0]["metadata"]["title"] == "Scientific Study of UFOs"
    assert out["sightings"][0]["name"] == "Nimitz encounter"
    assert out["sightings"][0]["metadata"]["shape"] == "tic tac"
    assert out["personnel"][0]["confidence"] == 0.95
    assert out["relationships"][0]["relationship_type"] == "witnessed"
    assert extractor._llm.complete.call_args.kwargs["task_id"] == "entity_extraction"

    names = agent.extract_entities("summary text")
    assert set(names) == set(NINE)
    assert names["sightings"] == ["Nimitz encounter"]
    assert names["testimonies"] == ["Grusch hearing"]


def test_sighting_without_name_falls_back_to_description():
    response = _empty()
    response["sightings"] = [{"description": "Orange orbs over Phoenix", "confidence": 0.7,
                              "context": "1997"}]
    agent, _ = _agent(response)
    assert agent.extract_entities("s")["sightings"] == ["Orange orbs over Phoenix"]


def test_failed_model_call_raises():
    agent, _ = _agent(error=RuntimeError("every tier failed"))
    with pytest.raises(RuntimeError, match="every tier failed"):
        agent.extract_entities("summary text")


def test_successful_empty_extraction_is_empty_not_error():
    agent, _ = _agent(_empty())
    assert agent.extract_entities("summary text") == {t: [] for t in NINE}
