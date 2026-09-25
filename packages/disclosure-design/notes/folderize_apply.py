#!/usr/bin/env python3
"""Apply gold-pass batch content files.

Usage: python3 notes/folderize_apply.py notes/gold-batch-01.py

A batch file defines CONTENT = { slug: { "source.md": ..., "design.md": ...,
"image-to-prompt.md": ..., "component.tsx": ... (optional) } }. Each key is
written into extractions/<slug>/. Existing stubs are overwritten. A JSON
receipt is printed so the gold pass can prove what landed.
"""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path("/Users/liamellis/Desktop/disclosure-design-references")
ALLOWED = {"source.md", "design.md", "design-tokens.md", "image-to-prompt.md", "component.tsx"}


def main() -> int:
    spec = importlib.util.spec_from_file_location("gold_batch", sys.argv[1])
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    content = mod.CONTENT
    receipt: dict[str, list[str]] = {}
    errors: list[str] = []
    for slug, files in content.items():
        folder = ROOT / "extractions" / slug
        if not folder.is_dir():
            errors.append(f"missing folder: {slug}")
            continue
        for name, body in files.items():
            if name not in ALLOWED:
                errors.append(f"disallowed file {name} in {slug}")
                continue
            (folder / name).write_text(body.rstrip() + "\n", encoding="utf-8")
            receipt.setdefault(slug, []).append(name)
    print(json.dumps({"applied": receipt, "errors": errors}, indent=1))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
