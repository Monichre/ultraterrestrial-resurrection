"""Offline regression coverage for summary-based entity extraction."""

import importlib.util
import sys
from pathlib import Path
from unittest.mock import MagicMock, Mock

import pytest


@pytest.mark.parametrize(
    'case, expected_status',
    [
        ('summary', 'completed'),
        ('exception', 'error'),
        ('empty', 'no_entities'),
        ('unavailable', 'error'),
        ('non_dict', 'error'),
    ],
)
def test_entity_source_is_summary(monkeypatch, tmp_path, case, expected_status):
    # Load only the processor: block the real agent import, and let relative
    # database imports take their existing fallbacks outside a package.
    monkeypatch.setitem(sys.modules, 'agents.entity_extraction_agent', None)
    path = (Path(__file__).resolve().parents[1]
            / 'lib/entity_extraction/processors/interactive_entity_processor.py')
    spec = importlib.util.spec_from_file_location('summary_processor_test', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    monkeypatch.setattr(module, 'console', Mock())
    monkeypatch.setattr(module, 'Progress', MagicMock())
    monkeypatch.setattr(module.Confirm, 'ask', Mock(side_effect=AssertionError('Unexpected prompt')))
    monkeypatch.setattr(module.Prompt, 'ask', Mock(side_effect=AssertionError('Unexpected prompt')))

    processor = module.InteractiveEntityProcessor()
    entities = {key: [] for key in processor.entity_types}
    if case == 'summary':
        entities['personnel'] = ['Jacques Vallée']
    # The extractor returns full detail; the processor derives the name lists.
    details = {key: [{'name': n, 'type': key, 'confidence': 0.9, 'context': n, 'metadata': {}}
                     for n in names] for key, names in entities.items()}
    details['relationships'] = []
    extractor = Mock()
    extractor.extract_entities.return_value = [] if case == 'non_dict' else details
    if case == 'exception':
        extractor.extract_entities.side_effect = RuntimeError('Extraction failed')
    processor.entity_extractor = None if case == 'unavailable' else extractor

    summary = 'The whole-source summary resolves the earlier reference to Jacques Vallée.'
    summary_path = tmp_path / 'episode_Summary.txt'
    summary_path.write_text(summary, encoding='utf-8')
    extracted = processor._extract_entities_with_feedback(summary)
    assert extracted == (None if expected_status == 'error' else entities)
    if case != 'unavailable':
        extractor.extract_entities.assert_called_once_with(summary, detailed=True)
        extractor.reset_mock()

    # Keep the entry path offline and prevent result/index persistence.
    processor._display_extracted_entities = Mock()
    processor._batch_xata_search = Mock(return_value={})
    processor._save_entity_results = Mock()
    processor._update_entity_index = Mock()
    result = processor.process_summary_file(str(summary_path), 'test-video', interactive=False)

    assert result['status'] == expected_status
    if case != 'unavailable':
        extractor.extract_entities.assert_called_once_with(summary, detailed=True)
    if expected_status == 'completed':
        assert result['entity_source'] == 'summary'
        assert result['entities'] == entities
        assert result['entity_details'] == details
    else:
        assert result['total_entities'] == 0
        processor._batch_xata_search.assert_not_called()
        processor._save_entity_results.assert_not_called()
        processor._update_entity_index.assert_not_called()
    if expected_status == 'no_entities':
        assert result['entities'] == entities
