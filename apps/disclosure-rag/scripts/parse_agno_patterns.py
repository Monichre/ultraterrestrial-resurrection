#!/usr/bin/env python3
"""
Parse the scraped AGNO markdown section into a normalized YAML summary without external deps.
- Reads: resources/scrape/agno_section.md
- Writes: resources/scrape/agno_patterns.yaml

Parsing is heuristic: we scan lines for signals like Flow, Agent, Team, Workflow, Generator, Integration, etc.
"""
from __future__ import annotations
import re
from pathlib import Path

IN_PATH = Path(__file__).resolve().parents[1] / "resources" / "scrape" / "agno_section.md"
OUT_PATH = Path(__file__).resolve().parents[1] / "resources" / "scrape" / "agno_patterns.yaml"

KEYWORDS = {
    "flows": [r"flow\b"],
    "agents": [r"\bagent\b", r"\bagents\b"],
    "teams": [r"\bteam\b", r"\bteams\b"],
    "workflows": [r"\bworkflow\b", r"\bworkflows\b", r"\bpipeline\b"],
    "generators": [r"generator\b"],
    "integrations": [r"integration\b", r"integrate\b"],
}


def match_any(s: str, patterns: list[str]) -> bool:
    return any(re.search(p, s, re.IGNORECASE) for p in patterns)


def main() -> int:
    text = IN_PATH.read_text(encoding="utf-8") if IN_PATH.exists() else ""
    lines = [ln.strip("\n") for ln in text.splitlines()]

    buckets: dict[str, list[str]] = {k: [] for k in KEYWORDS}

    for ln in lines:
        if not ln.strip():
            continue
        s = ln.strip()
        for bucket, pats in KEYWORDS.items():
            if match_any(s, pats):
                # Keep succinct lines (trim bullets/emojis)
                cleaned = re.sub(r"^[\-\*\d\.)\s]+", "", s)
                buckets[bucket].append(cleaned)

    # De-duplicate & sort for determinism
    for k in buckets:
        buckets[k] = sorted(set(buckets[k]))

    # Minimal YAML emitter (manual) to avoid PyYAML dependency
    out = ["framework: AGNO"]
    for key in ["flows", "agents", "teams", "workflows", "generators", "integrations"]:
        out.append(f"{key}:")
        for item in buckets.get(key, []):
            # escape basic YAML hazards
            safe = item.replace("\t", " ")
            out.append(f"  - {safe}")

    OUT_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Wrote: {OUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
