#!/usr/bin/env python3
"""Validate and render the visual lab's supporting operational vocabulary."""

from __future__ import annotations

import argparse
import glob
import json
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "language" / "registry.json"
CONTEXT_PATH = ROOT / "CONTEXT.md"
AUTHORITY_ORDER = ("project", "adapted", "external")
AUTHORITY_LABELS = {
    "project": "Project",
    "adapted": "Adapted",
    "external": "External",
}


def load_registry() -> dict[str, Any]:
    with REGISTRY_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def validate_registry(registry: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    required_top = {
        "schema_version",
        "name",
        "steward",
        "purpose",
        "scope_note",
        "authority_types",
        "audit",
        "terms",
    }
    missing_top = sorted(required_top - registry.keys())
    if missing_top:
        errors.append(f"registry missing top-level fields: {', '.join(missing_top)}")

    terms = registry.get("terms", [])
    if not isinstance(terms, list) or not terms:
        return errors + ["registry terms must be a non-empty array"]

    seen_ids: set[str] = set()
    seen_forms: dict[str, str] = {}
    allowed_authorities = set(registry.get("authority_types", {}))
    required_term = {"id", "term", "authority", "definition", "use_when", "aliases", "do_not_use", "evidence"}

    for index, term in enumerate(terms):
        label = term.get("id", f"terms[{index}]")
        missing = sorted(required_term - term.keys())
        if missing:
            errors.append(f"{label}: missing fields: {', '.join(missing)}")
            continue
        if label in seen_ids:
            errors.append(f"duplicate term id: {label}")
        seen_ids.add(label)
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", label):
            errors.append(f"{label}: id must be kebab-case")
        authority = term["authority"]
        if authority not in allowed_authorities:
            errors.append(f"{label}: unknown authority {authority!r}")
        if authority in {"adapted", "external"}:
            attribution = term.get("attribution")
            if not isinstance(attribution, dict):
                errors.append(f"{label}: {authority} terms require attribution")
            else:
                for field in ("name", "creator", "local_source"):
                    if not attribution.get(field):
                        errors.append(f"{label}: attribution.{field} is required")
        if not term["evidence"]:
            errors.append(f"{label}: at least one evidence path is required")
        for evidence in term["evidence"]:
            if not (ROOT / evidence).exists():
                errors.append(f"{label}: evidence path does not exist: {evidence}")

        forms = [term["term"], *term["aliases"], *term["do_not_use"]]
        for form in forms:
            folded = form.casefold()
            owner = seen_forms.get(folded)
            if owner and owner != label:
                errors.append(f"{label}: form {form!r} already belongs to {owner}")
            seen_forms[folded] = label

    return errors


def render_context(registry: dict[str, Any]) -> str:
    lines = [
        "---",
        "title: Visual Lab Vocabulary",
        "description: Generated supporting glossary for operational terms, provenance labels, and source attribution.",
        "type: glossary",
        "created: 2026-08-16",
        "author: agent",
        "steward: Liam Ellis",
        "tags: [language, glossary, provenance, generated]",
        "generated_from: language/registry.json",
        "---",
        "",
        "# Visual Lab Vocabulary",
        "",
        "This supporting glossary stabilizes operational vocabulary. Visual decisions live in",
        "[`VISUAL_LANGUAGE.md`](./VISUAL_LANGUAGE.md). This file is generated from",
        "[`language/registry.json`](./language/registry.json); edit the registry, not this file.",
        "",
    ]
    for authority in AUTHORITY_ORDER:
        authority_terms = [term for term in registry["terms"] if term["authority"] == authority]
        if not authority_terms:
            continue
        lines.extend([f"## {AUTHORITY_LABELS[authority]} Language", ""])
        for term in authority_terms:
            lines.extend([f"**{term['term']}**:", term["definition"]])
            lines.append(f"_Use_: {term['use_when']}")
            if term["aliases"]:
                lines.append(f"_Accepted aliases_: {', '.join(term['aliases'])}")
            if term["do_not_use"]:
                lines.append(f"_Avoid_: {', '.join(term['do_not_use'])}")
            if term.get("machine_values"):
                encoded = json.dumps(term["machine_values"], ensure_ascii=False, sort_keys=True)
                lines.append(f"_Serialized as_: `{encoded}`")
            if authority in {"adapted", "external"}:
                attribution = term["attribution"]
                source = attribution.get("url") or attribution["local_source"]
                lines.append(f"_Source_: {attribution['name']} by {attribution['creator']} ({source})")
            lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def audit_governed_files(registry: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    paths: set[Path] = set()
    for pattern in registry["audit"]["paths"]:
        paths.update(Path(item) for item in glob.glob(str(ROOT / pattern)))

    forbidden = [
        (term["id"], phrase)
        for term in registry["terms"]
        for phrase in term["do_not_use"]
    ]
    for path in sorted(paths):
        text = path.read_text(encoding="utf-8")
        relative = path.relative_to(ROOT)
        for term_id, phrase in forbidden:
            for match in re.finditer(re.escape(phrase), text, flags=re.IGNORECASE):
                line = text.count("\n", 0, match.start()) + 1
                errors.append(f"{relative}:{line}: forbidden language {phrase!r} ({term_id})")

    for binding in registry["audit"]["required_bindings"]:
        path = ROOT / binding["path"]
        if not path.exists():
            errors.append(f"required binding file missing: {binding['path']}")
            continue
        text = path.read_text(encoding="utf-8")
        for required in binding["includes"]:
            if required not in text:
                errors.append(f"{binding['path']}: missing required binding {required!r}")

    analysis_path = ROOT / "prompts" / "analysis-framework.md"
    if analysis_path.exists():
        analysis = analysis_path.read_text(encoding="utf-8")
        layers = re.findall(r"^## Layer (\d+)\b", analysis, flags=re.MULTILINE)
        title_match = re.search(r"^# .*?— The (\d+) analysis layers\s*$", analysis, flags=re.MULTILINE)
        if not title_match:
            errors.append("prompts/analysis-framework.md: title must declare its analysis-layer count")
        elif int(title_match.group(1)) != len(layers):
            errors.append(
                "prompts/analysis-framework.md: title declares "
                f"{title_match.group(1)} layers but {len(layers)} Layer headings exist"
            )
        expected = [str(number) for number in range(1, len(layers) + 1)]
        if layers != expected:
            errors.append(f"prompts/analysis-framework.md: layer sequence is {layers}, expected {expected}")

    manifest_path = ROOT / "notes" / "folderize-manifest.json"
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        allowed_tiers: set[str] = set()
        allowed_vision: set[str] = set()
        for term in registry["terms"]:
            machine = term.get("machine_values", {})
            tier = machine.get("tier")
            vision = machine.get("vision")
            if isinstance(tier, str):
                allowed_tiers.add(tier)
            if isinstance(vision, str):
                allowed_vision.add(vision)
        entries = manifest.get("entries", {})
        if isinstance(entries, dict):
            manifest_entries = entries.values()
        elif isinstance(entries, list):
            manifest_entries = entries
        else:
            errors.append("notes/folderize-manifest.json: entries must be an object or array")
            manifest_entries = []
        unknown_tiers: Counter[str] = Counter()
        unknown_vision: Counter[str] = Counter()
        for entry in manifest_entries:
            tier = entry.get("tier")
            vision = entry.get("vision")
            if tier not in allowed_tiers:
                unknown_tiers[str(tier)] += 1
            if vision not in allowed_vision:
                unknown_vision[str(vision)] += 1
        for value, count in sorted(unknown_tiers.items()):
            errors.append(f"manifest: unknown tier {value!r} on {count} entries")
        for value, count in sorted(unknown_vision.items()):
            errors.append(f"manifest: unknown vision {value!r} on {count} entries")

    return errors


def check_context(registry: dict[str, Any], write: bool) -> list[str]:
    rendered = render_context(registry)
    if write:
        CONTEXT_PATH.write_text(rendered, encoding="utf-8")
        return []
    if not CONTEXT_PATH.exists():
        return ["CONTEXT.md is missing; run: python3 scripts/language_registry.py render"]
    if CONTEXT_PATH.read_text(encoding="utf-8") != rendered:
        return ["CONTEXT.md is stale; run: python3 scripts/language_registry.py render"]
    return []


def report(errors: list[str]) -> int:
    if errors:
        print("Vocabulary audit failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Vocabulary audit passed.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("validate", "audit", "render", "all"), nargs="?", default="all")
    parser.add_argument("--check", action="store_true", help="With render, compare without writing")
    args = parser.parse_args()

    registry = load_registry()
    errors = validate_registry(registry)
    if args.command in {"audit", "all"}:
        errors.extend(audit_governed_files(registry))
    if args.command == "render":
        errors.extend(check_context(registry, write=not args.check))
    elif args.command == "all":
        errors.extend(check_context(registry, write=False))
    return report(errors)


if __name__ == "__main__":
    sys.exit(main())
