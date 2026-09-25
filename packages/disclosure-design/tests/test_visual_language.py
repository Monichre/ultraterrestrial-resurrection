from __future__ import annotations

import copy
import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "visual_language",
    ROOT / "scripts" / "visual_language.py",
)
assert SPEC and SPEC.loader
visual_language = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(visual_language)


class VisualLanguageTests(unittest.TestCase):
    def setUp(self) -> None:
        self.registry = visual_language.load_registry()

    def test_registry_is_valid(self) -> None:
        self.assertEqual(visual_language.validate_registry(self.registry), [])

    def test_required_agent_bindings_are_present(self) -> None:
        self.assertEqual(visual_language.audit_bindings(self.registry), [])

    def test_generated_guide_is_current(self) -> None:
        expected = visual_language.render_guide(self.registry)
        actual = (ROOT / "VISUAL_LANGUAGE.md").read_text(encoding="utf-8")
        self.assertEqual(actual, expected)

    def test_exactly_three_visual_lanes_compile_complete_context(self) -> None:
        lanes = self.registry["visual_lanes"]["lanes"]
        self.assertEqual(len(lanes), 3)
        for lane in lanes:
            context = visual_language.render_context(self.registry, lane["id"])
            self.assertIn("## Non-Negotiable Laws", context)
            self.assertIn("## Three-Lane Map", context)
            self.assertIn("## Required Visual DNA Checksum", context)
            self.assertIn(f"`surface_family`: `{lane['id']}`", context)
            self.assertIn("`source_citations`:", context)
            self.assertIn("`gold_visual_references`:", context)
            self.assertIn(lane["name"], context)

    def test_three_or_four_priority_surfaces_compile_with_defaults(self) -> None:
        surfaces = self.registry["focus_surfaces"]["surfaces"]
        self.assertIn(len(surfaces), (3, 4))
        for surface in surfaces:
            context = visual_language.render_context(
                self.registry,
                focus_surface_id=surface["id"],
            )
            self.assertIn("## Priority Application Surface", context)
            self.assertIn(f"`focus_surface`: `{surface['id']}`", context)
            self.assertIn(f"`surface_family`: `{surface['owning_lane']}`", context)
            for reference in surface["default_reference_families"]:
                self.assertIn(f"`{reference}`", context)

    def test_mapped_reference_family_compiles(self) -> None:
        context = visual_language.render_context(self.registry, "tactical-spatial", "ai-war-room")
        self.assertIn("## Retrieved Reference Family", context)
        self.assertIn("AI War Room Overlay", context)

    def test_unmapped_reference_family_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "not mapped"):
            visual_language.render_context(self.registry, "core-interface", "archive-document")

    def test_more_than_two_reference_families_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "no more than two"):
            visual_language.render_context(
                self.registry,
                "tactical-spatial",
                ["technical-blueprint", "blacksite", "myth-tech"],
            )

    def test_duplicate_palette_id_fails(self) -> None:
        changed = copy.deepcopy(self.registry)
        changed["palette"].append(copy.deepcopy(changed["palette"][0]))
        errors = visual_language.validate_registry(changed)
        self.assertTrue(any("palette id is duplicated" in error for error in errors))

    def test_unindexed_mode_source_fails(self) -> None:
        changed = copy.deepcopy(self.registry)
        source = changed["modes"][0]["source_refs"][0]
        changed["source_files"].remove(source)
        errors = visual_language.validate_registry(changed)
        self.assertTrue(any("missing from source_files index" in error for error in errors))

    def test_unindexed_lane_source_fails(self) -> None:
        changed = copy.deepcopy(self.registry)
        source = changed["visual_lanes"]["lanes"][0]["source_refs"][0]
        changed["source_files"].remove(source)
        errors = visual_language.validate_registry(changed)
        self.assertTrue(any("missing from source_files index" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
