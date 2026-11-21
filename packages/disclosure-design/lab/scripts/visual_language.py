#!/usr/bin/env python3
"""Validate, render, and compile surface-specific agent context for the visual lab."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "language" / "visual-language.json"
GUIDE_PATH = ROOT / "VISUAL_LANGUAGE.md"


def load_registry() -> dict[str, Any]:
    with REGISTRY_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def by_id(items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {item["id"]: item for item in items}


def checked_by_id(items: Any, label: str, errors: list[str]) -> dict[str, dict[str, Any]]:
    if not isinstance(items, list):
        errors.append(f"{label} must be an array")
        return {}
    result: dict[str, dict[str, Any]] = {}
    for index, item in enumerate(items):
        if not isinstance(item, dict):
            errors.append(f"{label}[{index}] must be an object")
            continue
        item_id = item.get("id")
        if not isinstance(item_id, str) or not item_id:
            errors.append(f"{label}[{index}] requires a non-empty id")
            continue
        if item_id in result:
            errors.append(f"{label} id is duplicated: {item_id}")
        result[item_id] = item
    return result


def validate_registry(registry: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    required = {
        "schema_version", "revision", "name", "purpose", "origin_context", "lab_position", "lab_test", "originating_creative_test",
        "source_files", "required_bindings", "core_laws", "visual_lanes", "focus_surfaces", "narrative_theater", "palette", "typography_roles",
        "interface_tokens", "texture_budget", "disciplines", "modes", "overlays", "global_anti_patterns",
        "selection_rules", "agent_contract",
    }
    missing = sorted(required - registry.keys())
    if missing:
        errors.append(f"visual language missing top-level fields: {', '.join(missing)}")
        return errors

    source_files = registry["source_files"]
    source_set = set(source_files)
    if len(source_set) != len(source_files):
        errors.append("source_files contains duplicates")
    for source in source_files:
        if not (ROOT / source).exists():
            errors.append(f"source file does not exist: {source}")

    palette = checked_by_id(registry["palette"], "palette", errors)
    type_roles = checked_by_id(registry["typography_roles"], "typography_roles", errors)

    all_modes = registry["modes"] + registry["overlays"]
    references = checked_by_id(all_modes, "modes and overlays", errors)
    if not any(mode.get("primary_allowed") for mode in registry["modes"]):
        errors.append("at least one reusable reference family is required")

    visual_lanes = registry["visual_lanes"]
    if not isinstance(visual_lanes, dict):
        errors.append("visual_lanes must be an object")
        visual_lanes = {}
    lanes = checked_by_id(visual_lanes.get("lanes"), "visual_lanes.lanes", errors)
    if len(lanes) != 3:
        errors.append(f"visual_lanes must define exactly three lanes, found {len(lanes)}")
    for lane_id, lane in lanes.items():
        for key in (
            "name", "plain_name", "maturity", "job", "signature", "owns", "visual_character",
            "palette_refs", "typography_refs", "texture_refs", "motion_character",
            "default_narrative_level", "reference_family_refs", "source_refs", "gold_refs", "avoid",
        ):
            if key not in lane:
                errors.append(f"{lane_id}: missing {key}")
        for token in lane.get("palette_refs", []):
            if token not in palette:
                errors.append(f"{lane_id}: unknown palette token {token}")
        for role in lane.get("typography_refs", []):
            if role not in type_roles:
                errors.append(f"{lane_id}: unknown typography role {role}")
        level = lane.get("default_narrative_level")
        if not isinstance(level, int) or level not in range(4):
            errors.append(f"{lane_id}: default_narrative_level must be 0-3")
        for reference in lane.get("reference_family_refs", []):
            if reference not in references:
                errors.append(f"{lane_id}: unknown reference family {reference}")
        for source in lane.get("source_refs", []):
            if not (ROOT / source).exists():
                errors.append(f"{lane_id}: source does not exist: {source}")
            if source not in source_set:
                errors.append(f"{lane_id}: source is missing from source_files index: {source}")
        for slug in lane.get("gold_refs", []):
            if not (ROOT / "extractions" / slug).is_dir():
                errors.append(f"{lane_id}: Gold Extraction does not exist: {slug}")

    coexistence_rules = visual_lanes.get("coexistence_rules")
    if not isinstance(coexistence_rules, list) or not coexistence_rules:
        errors.append("visual_lanes.coexistence_rules must be a non-empty array")
    for handoff in visual_lanes.get("handoff_examples", []):
        owner = handoff.get("owner")
        if owner not in lanes:
            errors.append(f"handoff {handoff.get('surface', '<unnamed>')}: unknown owner {owner}")
        for embedded in handoff.get("embedded", []):
            if embedded not in lanes:
                errors.append(f"handoff {handoff.get('surface', '<unnamed>')}: unknown embedded lane {embedded}")

    focus_surfaces = registry["focus_surfaces"]
    if not isinstance(focus_surfaces, dict):
        errors.append("focus_surfaces must be an object")
        focus_surfaces = {}
    app_surfaces = checked_by_id(focus_surfaces.get("surfaces"), "focus_surfaces.surfaces", errors)
    if len(app_surfaces) not in (3, 4):
        errors.append(f"focus_surfaces must define three or four surfaces, found {len(app_surfaces)}")
    for focus_id, focus in app_surfaces.items():
        for key in (
            "name", "kind", "job", "route", "owning_lane", "embedded_lanes", "current_state",
            "app_evidence", "visual_question", "default_narrative_level", "default_reference_families",
        ):
            if key not in focus:
                errors.append(f"{focus_id}: missing {key}")
        owning_lane = focus.get("owning_lane")
        if owning_lane not in lanes:
            errors.append(f"{focus_id}: unknown owning lane {owning_lane}")
        embedded_lanes = focus.get("embedded_lanes", [])
        for embedded in embedded_lanes:
            if embedded not in lanes:
                errors.append(f"{focus_id}: unknown embedded lane {embedded}")
            if embedded == owning_lane:
                errors.append(f"{focus_id}: owning lane must not repeat as an embedded lane")
        available_references = set()
        for lane_id in [owning_lane] + embedded_lanes:
            if lane_id in lanes:
                available_references.update(lanes[lane_id].get("reference_family_refs", []))
        for reference in focus.get("default_reference_families", []):
            if reference not in references:
                errors.append(f"{focus_id}: unknown default reference family {reference}")
            elif reference not in available_references:
                errors.append(f"{focus_id}: default reference family is not mapped to its lane set: {reference}")
        level = focus.get("default_narrative_level")
        if not isinstance(level, int) or level not in range(4):
            errors.append(f"{focus_id}: default_narrative_level must be 0-3")

    for mode in all_modes:
        mode_id = mode.get("id", "<missing-id>")
        for key in ("name", "use_for", "signature", "palette_refs", "typography_refs", "narrative_level", "avoid", "source_refs", "gold_refs"):
            if key not in mode:
                errors.append(f"{mode_id}: missing {key}")
        for token in mode.get("palette_refs", []):
            if token not in palette:
                errors.append(f"{mode_id}: unknown palette token {token}")
        for role in mode.get("typography_refs", []):
            if role not in type_roles:
                errors.append(f"{mode_id}: unknown typography role {role}")
        level = mode.get("narrative_level")
        if not isinstance(level, int) or level not in range(4):
            errors.append(f"{mode_id}: narrative_level must be 0-3")
        for source in mode.get("source_refs", []):
            if not (ROOT / source).exists():
                errors.append(f"{mode_id}: source does not exist: {source}")
            if source not in source_set:
                errors.append(f"{mode_id}: source is missing from source_files index: {source}")
        for slug in mode.get("gold_refs", []):
            if not (ROOT / "extractions" / slug).is_dir():
                errors.append(f"{mode_id}: Gold Extraction does not exist: {slug}")

    for discipline in registry["disciplines"]:
        if not (ROOT / discipline["source"]).exists():
            errors.append(f"discipline {discipline['id']}: source does not exist: {discipline['source']}")
        if discipline["source"] not in source_set:
            errors.append(f"discipline {discipline['id']}: source is missing from source_files index")

    required_output = registry["agent_contract"].get("required_output", [])
    if len(required_output) != len(set(required_output)):
        errors.append("agent_contract.required_output contains duplicates")
    return errors


def audit_bindings(registry: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for binding in registry["required_bindings"]:
        path = ROOT / binding["path"]
        if not path.exists():
            errors.append(f"required binding file does not exist: {binding['path']}")
            continue
        text = path.read_text(encoding="utf-8")
        for required in binding["includes"]:
            if required not in text:
                errors.append(f"{binding['path']}: missing visual-language binding {required!r}")
    return errors


def token_line(token: dict[str, Any]) -> str:
    return f"`{token['id']}` {token['value']} — {token['role']}"


def render_lane(lane: dict[str, Any], palette: dict[str, dict[str, Any]], type_roles: dict[str, dict[str, Any]]) -> list[str]:
    lines = [
        f"### {lane['name']} — {lane['plain_name']} (`{lane['id']}`)",
        "",
        lane["signature"],
        "",
        f"- **Job:** {lane['job']}",
        f"- **Maturity:** {lane['maturity']}",
        f"- **Owns:** {', '.join(lane['owns'])}",
        f"- **Visual character:** {', '.join(lane['visual_character'])}",
        f"- **Motion:** {lane['motion_character']}",
        f"- **Default narrative theater:** {lane['default_narrative_level']}/3",
        f"- **Reference families:** {', '.join(lane['reference_family_refs'])}",
        f"- **Palette:** {', '.join(lane['palette_refs'])}",
        f"- **Type roles:** {', '.join(lane['typography_refs'])}",
        f"- **Textures:** {', '.join(lane['texture_refs']) if lane['texture_refs'] else 'none by default'}",
        f"- **Avoid:** {', '.join(lane['avoid'])}",
        f"- **Gold references:** {', '.join(lane['gold_refs'])}",
        f"- **Rule sources:** {', '.join(lane['source_refs'])}",
        "",
        "**Resolved palette**",
        "",
    ]
    lines.extend(f"- {token_line(palette[token])}" for token in lane["palette_refs"])
    lines.extend(["", "**Resolved typography**", ""])
    for role in lane["typography_refs"]:
        item = type_roles[role]
        lines.append(f"- `{role}` — {item['use']}; {', '.join(item['families'])}")
    lines.append("")
    return lines


def render_mode(mode: dict[str, Any], palette: dict[str, dict[str, Any]], type_roles: dict[str, dict[str, Any]]) -> list[str]:
    lines = [
        f"### {mode['name']} (`{mode['id']}`)",
        "",
        mode["signature"],
        "",
        f"- **Use for:** {', '.join(mode['use_for'])}",
        f"- **Narrative theater:** {mode['narrative_level']}/3",
    ]
    if mode.get("material"):
        lines.append(f"- **Material:** {', '.join(mode['material'])}")
    if mode.get("composition"):
        lines.append(f"- **Composition:** {', '.join(mode['composition'])}")
    lines.extend([
        f"- **Palette:** {', '.join(mode['palette_refs'])}",
        f"- **Type roles:** {', '.join(mode['typography_refs'])}",
    ])
    if mode.get("texture_refs"):
        lines.append(f"- **Textures:** {', '.join(mode['texture_refs'])}")
    lines.extend([
        f"- **Avoid:** {', '.join(mode['avoid'])}",
        f"- **Gold references:** {', '.join(mode['gold_refs'])}",
        f"- **Rule sources:** {', '.join(mode['source_refs'])}",
        "",
        "**Resolved palette**",
        "",
    ])
    lines.extend(f"- {token_line(palette[token])}" for token in mode["palette_refs"])
    lines.extend(["", "**Resolved typography**", ""])
    for role in mode["typography_refs"]:
        item = type_roles[role]
        lines.append(f"- `{role}` — {item['use']}; {', '.join(item['families'])}")
    lines.append("")
    return lines


def render_guide(registry: dict[str, Any]) -> str:
    palette = by_id(registry["palette"])
    type_roles = by_id(registry["typography_roles"])
    lines = [
        "---",
        "title: Disclosure Visual Language",
        "description: Generated visual grammar and agent-ingestion guide for the design-reference laboratory.",
        "type: guide",
        "created: 2026-08-16",
        "author: agent",
        "steward: Liam Ellis",
        "tags: [visual-language, design-lab, prompts, tokens, interfaces, generated]",
        "generated_from: language/visual-language.json",
        "---",
        "",
        f"# {registry['name']}",
        "",
        registry["purpose"],
        "",
        f"**Position:** {registry['lab_position']}",
        "",
        f"**Origin:** {registry['origin_context']}",
        "",
        f"> **Lab test:** {registry['lab_test']}",
        "",
        f"**Originating creative test:** {registry['originating_creative_test']}",
        "",
        f"**Revision:** `{registry['revision']}`",
        "",
        "This file is generated. Edit `language/visual-language.json`, then run",
        "`python3 scripts/visual_language.py render`.",
        "",
        "## Core Laws",
        "",
    ]
    for law in registry["core_laws"]:
        lines.append(f"- **{law['rule']}** {law['why']}")
    visual_lanes = registry["visual_lanes"]
    lines.extend([
        "",
        "## The Three Visual Lanes",
        "",
        visual_lanes["definition"],
        "",
        visual_lanes["relationship_to_reference_families"],
        "",
        "| Lane | Plain name | Job | Maturity |",
        "|---|---|---|---|",
    ])
    for lane in visual_lanes["lanes"]:
        lines.append(f"| **{lane['name']}** | {lane['plain_name']} | {lane['job']} | {lane['maturity']} |")
    lines.append("")
    for lane in visual_lanes["lanes"]:
        lines.extend(render_lane(lane, palette, type_roles))
    lines.extend(["### Coexistence Rules", ""])
    lines.extend(f"- {rule}" for rule in visual_lanes["coexistence_rules"])
    lines.extend(["", "### Common Handoffs", "", "| Surface | Owning lane | Embedded lanes | Rule |", "|---|---|---|---|"])
    for handoff in visual_lanes["handoff_examples"]:
        lines.append(f"| {handoff['surface']} | `{handoff['owner']}` | {', '.join(f'`{lane}`' for lane in handoff['embedded'])} | {handoff['rule']} |")
    focus_surfaces = registry["focus_surfaces"]
    lines.extend([
        "",
        "## Four Priority Application Surfaces",
        "",
        focus_surfaces["scope_rule"],
        "",
        f"**Working hierarchy:** {focus_surfaces['workflow_hierarchy']}",
        "",
    ])
    for focus in focus_surfaces["surfaces"]:
        lines.extend([
            f"### {focus['name']} (`{focus['id']}`)",
            "",
            f"- **Kind:** {focus['kind']}",
            f"- **Job:** {focus['job']}",
            f"- **Route:** `{focus['route']}`",
            f"- **Owning lane:** `{focus['owning_lane']}`",
            f"- **Embedded lanes:** {', '.join(f'`{lane}`' for lane in focus['embedded_lanes']) if focus['embedded_lanes'] else '`none`'}",
            f"- **Current state:** {focus['current_state']}",
            f"- **Default narrative theater:** {focus['default_narrative_level']}/3",
            f"- **Visual question:** {focus['visual_question']}",
            f"- **Default references:** {', '.join(f'`{reference}`' for reference in focus['default_reference_families'])}",
            f"- **App evidence:** {', '.join(f'`{path}`' for path in focus['app_evidence'])}",
            "",
        ])
    lines.extend(["", "## Selection Protocol", ""])
    lines.extend(f"{index}. {rule}" for index, rule in enumerate(registry["selection_rules"], 1))
    lines.extend(["", "## Narrative Theater", "", registry["narrative_theater"]["rule"], ""])
    for level, description in registry["narrative_theater"]["levels"].items():
        lines.append(f"- **{level}/3:** {description}")
    lines.extend(["", "## Canonical Palette", "", "| Token | Value | Role |", "|---|---:|---|"])
    for token in registry["palette"]:
        lines.append(f"| `{token['id']}` | `{token['value']}` | {token['role']} |")
    lines.extend(["", "## Typography Roles", "", "| Role | Use | Families |", "|---|---|---|"])
    for role in registry["typography_roles"]:
        lines.append(f"| `{role['id']}` | {role['use']} | {', '.join(role['families'])} |")
    interface = registry["interface_tokens"]
    lines.extend([
        "",
        "## Interface Tokens",
        "",
        f"- **Spacing base:** `{interface['spacing']['base']}`",
        f"- **Spacing scale:** {', '.join(f'`{value}`' for value in interface['spacing']['scale'])}",
        f"- **Radii:** {', '.join(f'`{name}={value}`' for name, value in interface['radii'].items())}",
        f"- **Motion:** {', '.join(f'`{name}={value}`' for name, value in interface['motion'].items())}",
        f"- **Classification:** {', '.join(f'`{name}={value}`' for name, value in interface['classification'].items())}",
        "",
        "### Motion Rules",
        "",
    ])
    lines.extend(f"- {rule}" for rule in interface["motion_rules"])
    lines.extend(["", "## Texture Budget", ""])
    for name, value in registry["texture_budget"].items():
        lines.append(f"- **{name}:** {value}")
    lines.extend(["", "## Composition Disciplines", ""])
    for discipline in registry["disciplines"]:
        lines.extend([f"### {discipline['name']}", "", discipline["purpose"], ""])
        lines.extend(f"- {law}" for law in discipline["laws"])
        lines.extend([f"- **Source:** `{discipline['source']}`", ""])
    lines.extend([
        "## Source Reference Families",
        "",
        "These are deeper retrieval labels, not eight competing app styles. Choose a Visual Lane first, then retrieve no more than two relevant families.",
        "",
    ])
    for mode in registry["modes"]:
        lines.extend(render_mode(mode, palette, type_roles))
    lines.extend(["## Secondary Reference Overlays", ""])
    for overlay in registry["overlays"]:
        lines.extend(render_mode(overlay, palette, type_roles))
    lines.extend(["## Global Anti-Patterns", ""])
    lines.extend(f"- {item}" for item in registry["global_anti_patterns"])
    lines.extend(["", "## Agent Context Contract", "", "Before design work, compile a surface-specific context pack:", "", "```bash", registry["agent_contract"]["context_command"], "```", "", "Every direction must return a **Visual DNA Checksum** containing:", ""])
    lines.extend(f"- `{field}`" for field in registry["agent_contract"]["required_output"])
    lines.extend(["", "### Mark Test", ""])
    lines.extend(f"- {question}" for question in registry["agent_contract"]["mark_test"])
    lines.extend(["", "## Source Index", ""])
    lines.extend(f"- `{source}`" for source in registry["source_files"])
    return "\n".join(lines).rstrip() + "\n"


def find_mode(registry: dict[str, Any], mode_id: str) -> dict[str, Any]:
    modes = by_id(registry["modes"] + registry["overlays"])
    if mode_id not in modes:
        choices = ", ".join(sorted(modes))
        raise ValueError(f"unknown mode {mode_id!r}; choose one of: {choices}")
    return modes[mode_id]


def find_lane(registry: dict[str, Any], lane_id: str) -> dict[str, Any]:
    lanes = by_id(registry["visual_lanes"]["lanes"])
    if lane_id not in lanes:
        choices = ", ".join(sorted(lanes))
        raise ValueError(f"unknown surface {lane_id!r}; choose one of: {choices}")
    return lanes[lane_id]


def find_focus_surface(registry: dict[str, Any], focus_id: str) -> dict[str, Any]:
    surfaces = by_id(registry["focus_surfaces"]["surfaces"])
    if focus_id not in surfaces:
        choices = ", ".join(sorted(surfaces))
        raise ValueError(f"unknown focus surface {focus_id!r}; choose one of: {choices}")
    return surfaces[focus_id]


def render_context(
    registry: dict[str, Any],
    surface_id: str | None = None,
    reference_ids: str | list[str] | None = None,
    focus_surface_id: str | None = None,
) -> str:
    focus_surface = find_focus_surface(registry, focus_surface_id) if focus_surface_id else None
    if focus_surface:
        if surface_id and surface_id != focus_surface["owning_lane"]:
            raise ValueError("--surface conflicts with the focus surface's owning lane")
        surface_id = focus_surface["owning_lane"]
        if not reference_ids:
            reference_ids = focus_surface["default_reference_families"]
    if not surface_id:
        raise ValueError("context requires a focus surface or Visual Lane")
    surface = find_lane(registry, surface_id)
    if isinstance(reference_ids, str):
        reference_ids = [reference_ids]
    reference_ids = reference_ids or []
    if len(reference_ids) != len(set(reference_ids)):
        raise ValueError("reference families must not repeat")
    if len(reference_ids) > 2:
        raise ValueError("choose no more than two reference families")
    references = [find_mode(registry, reference_id) for reference_id in reference_ids]
    permitted_lane_ids = [surface["id"]] + (focus_surface["embedded_lanes"] if focus_surface else [])
    permitted_reference_ids = {
        reference_id
        for lane_id in permitted_lane_ids
        for reference_id in find_lane(registry, lane_id)["reference_family_refs"]
    }
    disallowed = [reference["id"] for reference in references if reference["id"] not in permitted_reference_ids]
    if disallowed:
        raise ValueError(f"reference families not mapped to {surface_id!r}: {', '.join(disallowed)}")
    palette = by_id(registry["palette"])
    type_roles = by_id(registry["typography_roles"])
    lines = [
        f"# Agent Visual Context — {surface['name']}",
        "",
        f"> **Lab test:** {registry['lab_test']}",
        "",
        f"Originating creative test: {registry['originating_creative_test']}",
        "",
        f"Visual language revision: `{registry['revision']}`",
        "",
        registry["lab_position"],
        "",
        "## Non-Negotiable Laws",
        "",
    ]
    lines.extend(f"- {law['rule']}" for law in registry["core_laws"])
    if focus_surface:
        lines.extend([
            "",
            "## Priority Application Surface",
            "",
            f"- **Surface:** {focus_surface['name']} (`{focus_surface['id']}`)",
            f"- **Kind:** {focus_surface['kind']}",
            f"- **Job:** {focus_surface['job']}",
            f"- **Route:** `{focus_surface['route']}`",
            f"- **Owning lane:** `{focus_surface['owning_lane']}`",
            f"- **Embedded lanes:** {', '.join(f'`{lane}`' for lane in focus_surface['embedded_lanes']) if focus_surface['embedded_lanes'] else '`none`'}",
            f"- **Current state:** {focus_surface['current_state']}",
            f"- **Visual question:** {focus_surface['visual_question']}",
            f"- **App evidence:** {', '.join(f'`{path}`' for path in focus_surface['app_evidence'])}",
        ])
    lines.extend(["", "## Three-Lane Map", ""])
    embedded_lane_ids = focus_surface["embedded_lanes"] if focus_surface else []
    for lane in registry["visual_lanes"]["lanes"]:
        marker = " **[SELECTED]**" if lane["id"] == surface["id"] else " **[EMBEDDED]**" if lane["id"] in embedded_lane_ids else ""
        lines.append(f"- **{lane['name']} / {lane['plain_name']}** (`{lane['id']}`){marker}: {lane['job']}")
    lines.extend(["", "## Selected Visual Lane", ""])
    lines.extend(render_lane(surface, palette, type_roles))
    if embedded_lane_ids:
        lines.extend(["## Embedded Lane Boundaries", ""])
        for lane_id in embedded_lane_ids:
            embedded_lane = find_lane(registry, lane_id)
            lines.extend([
                f"### {embedded_lane['name']} (`{lane_id}`)",
                "",
                embedded_lane["signature"],
                "",
                f"- **May enter as:** {', '.join(embedded_lane['owns'])}",
                f"- **Must avoid:** {', '.join(embedded_lane['avoid'])}",
                "- **Boundary:** keep this lane visually intact inside the owning surface; do not average its material or signals into the surrounding chrome.",
                "",
            ])
    lines.extend(["## Coexistence Rules", ""])
    lines.extend(f"- {rule}" for rule in registry["visual_lanes"]["coexistence_rules"])
    for reference in references:
        lines.extend(["", "## Retrieved Reference Family", ""])
        lines.extend(render_mode(reference, palette, type_roles))
    interface = registry["interface_tokens"]
    lines.extend([
        "## Interface Tokens",
        "",
        f"- **Spacing:** base `{interface['spacing']['base']}`; scale {', '.join(interface['spacing']['scale'])}",
        f"- **Radii:** {', '.join(f'{name}={value}' for name, value in interface['radii'].items())}",
        f"- **Motion:** {', '.join(f'{name}={value}' for name, value in interface['motion'].items())}",
        f"- **Classification:** {', '.join(f'{name}={value}' for name, value in interface['classification'].items())}",
        "",
        "**Motion rules**",
        "",
    ])
    lines.extend(f"- {rule}" for rule in interface["motion_rules"])
    lines.extend(["## Texture Budget", ""])
    lines.extend(f"- **{name}:** {value}" for name, value in registry["texture_budget"].items())
    lines.extend(["", "## Global Prohibitions", ""])
    lines.extend(f"- {item}" for item in registry["global_anti_patterns"])
    selected = [surface] + references
    palette_tokens = list(dict.fromkeys(token for item in selected for token in item["palette_refs"]))
    typography_roles = list(dict.fromkeys(role for item in selected for role in item["typography_refs"]))
    texture_refs = list(dict.fromkeys(texture for item in selected for texture in item.get("texture_refs", [])))
    source_refs = list(dict.fromkeys(source for item in selected for source in item["source_refs"]))
    gold_refs = list(dict.fromkeys(slug for item in selected for slug in item["gold_refs"]))
    prohibited = list(dict.fromkeys(item for selected_item in selected for item in selected_item["avoid"]))
    narrative_level = focus_surface["default_narrative_level"] if focus_surface else surface["default_narrative_level"]
    composition_law = references[0].get("composition", [surface["visual_character"][0]])[0] if references else surface["visual_character"][0]
    lines.extend([
        "",
        "## Required Visual DNA Checksum",
        "",
        f"- `focus_surface`: `{focus_surface['id'] if focus_surface else 'custom-or-non-app'}`",
        f"- `surface_family`: `{surface['id']}`",
        f"- `embedded_surface_family`: {', '.join(f'`{lane}`' for lane in focus_surface['embedded_lanes']) if focus_surface and focus_surface['embedded_lanes'] else '[name any intact embedded lane, or `none`]'}",
        f"- `reference_families`: {', '.join(f'`{reference}`' for reference in reference_ids) if reference_ids else '`none`'}",
        "- `interface_job`: [state the job in one sentence without aesthetic language]",
        f"- `narrative_level`: `{narrative_level}/3`",
        f"- `source_citations`: {', '.join(f'`{source}`' for source in source_refs)}",
        f"- `gold_visual_references`: {', '.join(f'`extractions/{slug}/`' for slug in gold_refs)}",
        f"- `palette_tokens`: {', '.join(f'`{token}`' for token in palette_tokens)}",
        f"- `typography_roles`: {', '.join(f'`{role}`' for role in typography_roles)}",
        f"- `texture_budget`: {', '.join(f'`{texture}`' for texture in texture_refs) if texture_refs else '`none`'}",
        f"- `composition_law`: {composition_law}",
        f"- `signature_move`: {surface['signature']}",
        f"- `prohibited_moves`: {', '.join(prohibited)}",
    ])
    lines.extend(["", "## Mark Test", ""])
    lines.extend(f"- {question}" for question in registry["agent_contract"]["mark_test"])
    return "\n".join(lines).rstrip() + "\n"


def check_guide(registry: dict[str, Any], write: bool) -> list[str]:
    rendered = render_guide(registry)
    if write:
        GUIDE_PATH.write_text(rendered, encoding="utf-8")
        return []
    if not GUIDE_PATH.exists():
        return ["VISUAL_LANGUAGE.md is missing; run: python3 scripts/visual_language.py render"]
    if GUIDE_PATH.read_text(encoding="utf-8") != rendered:
        return ["VISUAL_LANGUAGE.md is stale; run: python3 scripts/visual_language.py render"]
    return []


def report(errors: list[str]) -> int:
    if errors:
        print("Visual language audit failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Visual language audit passed.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("list")
    subparsers.add_parser("validate")
    render_parser = subparsers.add_parser("render")
    render_parser.add_argument("--check", action="store_true")
    subparsers.add_parser("all")
    context_parser = subparsers.add_parser("context")
    context_parser.add_argument("--focus-surface")
    context_parser.add_argument("--surface")
    context_parser.add_argument("--reference", action="append")
    context_parser.add_argument("--mode", help=argparse.SUPPRESS)
    context_parser.add_argument("--secondary", help=argparse.SUPPRESS)
    args = parser.parse_args()

    registry = load_registry()
    errors = validate_registry(registry)
    if errors:
        return report(errors)
    if args.command == "list":
        print("VISUAL LANES")
        for lane in registry["visual_lanes"]["lanes"]:
            print(f"{lane['id']}: {lane['name']} / {lane['plain_name']} — {lane['job']}")
        print("\nSOURCE REFERENCE FAMILIES")
        for mode in registry["modes"]:
            print(f"{mode['id']}: {mode['name']} — {', '.join(mode['use_for'])}")
        for overlay in registry["overlays"]:
            print(f"{overlay['id']} (secondary only): {overlay['name']}")
        print("\nPRIORITY APPLICATION SURFACES")
        for focus in registry["focus_surfaces"]["surfaces"]:
            print(f"{focus['id']}: {focus['name']} — {focus['job']}")
        return 0
    if args.command == "validate":
        return report([])
    if args.command == "render":
        return report(check_guide(registry, write=not args.check))
    if args.command == "all":
        return report(check_guide(registry, write=False) + audit_bindings(registry))
    if args.command == "context":
        try:
            surface_id = args.surface
            references = list(args.reference or [])
            if args.mode:
                references.insert(0, args.mode)
            if args.secondary:
                references.append(args.secondary)
            if not surface_id and not args.focus_surface:
                if not references:
                    raise ValueError("context requires --surface <core-interface|evidence-archive|tactical-spatial>")
                candidates = [
                    lane["id"]
                    for lane in registry["visual_lanes"]["lanes"]
                    if all(reference in lane["reference_family_refs"] for reference in references)
                ]
                if len(candidates) != 1:
                    raise ValueError("legacy --mode context is ambiguous; add an explicit --surface")
                surface_id = candidates[0]
            print(render_context(registry, surface_id, references, args.focus_surface), end="")
        except ValueError as error:
            print(error, file=sys.stderr)
            return 2
        return 0
    return 2


if __name__ == "__main__":
    sys.exit(main())
