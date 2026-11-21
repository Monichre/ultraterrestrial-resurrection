#!/usr/bin/env python3
"""
Scrape the AGNO section from the 500 AI Agents Projects README and persist it locally.
- Uses only stdlib (urllib) to avoid extra dependencies
- Writes:
  - resources/scrape/agno_raw_readme.md (full README)
  - resources/scrape/agno_section.md (best-effort AGNO section)
"""
import re
import sys
from pathlib import Path
from urllib.request import urlopen, Request

RAW_URL = (
    "https://raw.githubusercontent.com/ashishpatel26/500-AI-Agents-Projects/"
    "refs/heads/main/README.md"
)
OUT_DIR = Path(__file__).resolve().parents[1] / "resources" / "scrape"
OUT_DIR.mkdir(parents=True, exist_ok=True)
RAW_PATH = OUT_DIR / "agno_raw_readme.md"
SECTION_PATH = OUT_DIR / "agno_section.md"


def fetch_text(url: str) -> str:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extract_agno_section(md: str) -> str:
    # Heuristics to find the AGNO section. We try multiple patterns.
    candidates = [
        r"(?ims)^#+\s*Agno\s*UseCase.*?(?=^#[^#]|\Z)",
        r"(?ims)^#+\s*AGNO\s*UseCase.*?(?=^#[^#]|\Z)",
        r"(?ims)^#+\s*Agno\b.*?(?=^#[^#]|\Z)",
    ]
    for pat in candidates:
        m = re.search(pat, md)
        if m:
            return m.group(0).strip()
    # Fallback: try to capture the broader "Framework Wise UseCase" block that mentions Agno
    m = re.search(r"(?ims)^#+\s*Framework\s*Wise\s*UseCase.*?(?=^#[^#]|\Z)", md)
    if m:
        block = m.group(0)
        # Keep lines that mention Agno or are nearby
        lines = block.splitlines()
        kept = []
        for ln in lines:
            if re.search(r"agno", ln, re.IGNORECASE) or len(kept) < 40:
                kept.append(ln)
        return "\n".join(kept).strip()
    return ""  # If not found


def main() -> int:
    try:
        md = fetch_text(RAW_URL)
        RAW_PATH.write_text(md, encoding="utf-8")
        section = extract_agno_section(md)
        if not section:
            section = "# AGNO (section not found)\nNo explicit AGNO section detected. See agno_raw_readme.md for full content."
        SECTION_PATH.write_text(section, encoding="utf-8")
        print(f"Wrote: {SECTION_PATH}")
        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
