"""Offline regression: entity statistics belong to the selected archive."""

import json
import sys
from pathlib import Path
from types import ModuleType, SimpleNamespace
from unittest.mock import Mock

APP = Path(__file__).resolve().parents[1]


def _load(name, path):
    module = ModuleType(name)
    module.__file__ = str(path)
    exec(compile(path.read_text(), str(path), "exec"), module.__dict__)
    return module


def test_entity_index_follows_kb_root(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(APP))
    root_module = _load("isolated_kb_root", APP / "lib/kb/kb_root.py")
    # Bypass lib.kb.__init__, which constructs the CRUD/service singleton.
    monkeypatch.setitem(sys.modules, "lib.kb.kb_root", root_module)
    monkeypatch.setitem(sys.modules, "agents.entity_extraction_agent", None)
    processor_module = _load(
        "isolated_processor",
        APP / "lib/entity_extraction/processors/interactive_entity_processor.py",
    )
    monkeypatch.setattr(processor_module, "console", Mock())
    monkeypatch.setitem(
        sys.modules, "lib.state_manager",
        SimpleNamespace(get_state_manager=Mock(side_effect=AssertionError)),
    )
    monkeypatch.setitem(
        sys.modules,
        "lib.entity_extraction.processors.interactive_entity_processor",
        processor_module,
    )
    reader = _load("isolated_reader", APP / "process_entities.py")

    # The unpatched implementation can only damage this disposable legacy file.
    app = tmp_path / "legacy-app"
    legacy = app / "lib/entity_extraction/entity_index.json"
    legacy.parent.mkdir(parents=True)
    original = json.dumps({
        "version": "1.0", "total_processed_files": 237,
        "total_extracted_entities": 0, "total_matched_entities": 0,
        "total_created_entities": 0, "processed_files": [],
        "entity_summary": {}, "recent_entities": {},
    }).encode()
    legacy.write_bytes(original)
    processor_module.__file__ = str(legacy.parent / "processors/processor.py")
    reader.__file__ = str(app / "process_entities.py")
    processor = object.__new__(processor_module.InteractiveEntityProcessor)

    result = {
        "video_id": "offline-test", "summary_file": "summary.txt",
        "status": "completed", "entities": {"personnel": ["Test Person"]},
        "entity_search_results": {}, "entity_creation_results": {},
        "total_entities": 1, "total_matches": 0, "total_created": 0,
    }
    # Change roots in the same process: no cached/default-root fallback.
    for name, repeats in (("kb-a", 2), ("kb-b", 1)):
        root = tmp_path / name
        monkeypatch.setenv("DISCLOSURE_RAG_KB_PATH", str(root))
        for _ in range(repeats):
            processor._update_entity_index(result)
        assert legacy.read_bytes() == original
        index = root / "metadata/entity_index.json"
        assert index.exists(), "selected KB index was not written"
        data = json.loads(index.read_text())
        assert reader.load_entity_index() == data
        assert data["total_processed_files"] == repeats
        assert data["total_extracted_entities"] == repeats
        assert len(data["processed_files"]) == repeats
        assert index.with_suffix(".json.lock").exists()
        assert not legacy.with_suffix(".json.lock").exists()
    assert json.loads((tmp_path / "kb-a/metadata/entity_index.json").read_text())[
        "total_processed_files"
    ] == 2
    monkeypatch.setenv("DISCLOSURE_RAG_KB_PATH", str(tmp_path / "empty-kb"))
    assert reader.load_entity_index() is None
