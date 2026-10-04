from __future__ import annotations

import copy
import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "language_registry",
    ROOT / "scripts" / "language_registry.py",
)
assert SPEC and SPEC.loader
language_registry = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(language_registry)


class LanguageRegistryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = language_registry.load_registry()

    def test_current_registry_and_governed_files_pass(self) -> None:
        self.assertEqual(language_registry.validate_registry(self.registry), [])
        self.assertEqual(language_registry.audit_governed_files(self.registry), [])

    def test_generated_context_is_current(self) -> None:
        expected = language_registry.render_context(self.registry)
        actual = (ROOT / "CONTEXT.md").read_text(encoding="utf-8")
        self.assertEqual(actual, expected)

    def test_adapted_term_without_attribution_fails(self) -> None:
        changed = copy.deepcopy(self.registry)
        adapted = next(term for term in changed["terms"] if term["authority"] == "adapted")
        adapted.pop("attribution")
        errors = language_registry.validate_registry(changed)
        self.assertTrue(any("require attribution" in error for error in errors))

    def test_unknown_authority_fails(self) -> None:
        changed = copy.deepcopy(self.registry)
        term = changed["terms"][0]
        term["authority"] = "made-up-authority"
        errors = language_registry.validate_registry(changed)
        self.assertTrue(any("unknown authority" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
