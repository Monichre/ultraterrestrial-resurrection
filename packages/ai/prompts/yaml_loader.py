"""
Cross-language YAML prompt loader (Python)
- Requires: pip install pyyaml
- Respects PROMPTS_DIR or defaults to repo_root/prompts
"""
from __future__ import annotations
import os
import json
import re
from pathlib import Path
from typing import Any, Dict, Optional

try:
    import yaml  # type: ignore
except Exception as e:  # pragma: no cover
    raise RuntimeError("pyyaml is required: pip install pyyaml") from e


def _interpolate(template: str, params: Optional[Dict[str, Any]] = None) -> str:
    params = params or {}
    pattern = re.compile(r"\{\{\s*([a-zA-Z0-9_]+)\s*\}\}")

    def _repl(match: re.Match[str]) -> str:
        key = match.group(1)
        val = params.get(key)
        return "" if val is None else str(val)

    return pattern.sub(_repl, template)


def _resolve_prompts_dir(custom: Optional[str] = None) -> Path:
    if custom:
        return Path(custom)
    env = os.getenv("PROMPTS_DIR")
    if env:
        return Path(env)

    # This file lives in packages/ai/prompts — prefer that first
    here = Path(__file__).resolve().parent
    if (here / "registry.yaml").exists():
        return here

    cwd = Path.cwd()
    candidates = [
        cwd / "packages" / "ai" / "prompts",
        cwd / "packages" / "prompts",  # legacy
        cwd / "prompts",
    ]
    for cand in candidates:
        if cand.exists() and (cand / "registry.yaml").exists():
            return cand

    # Ascend to locate packages/ai/prompts (or legacy packages/prompts)
    for base in list(Path(__file__).resolve().parents):
        for rel in ("packages/ai/prompts", "packages/prompts", "prompts"):
            pkg = base / rel
            if pkg.exists() and (pkg / "registry.yaml").exists():
                return pkg

    # Last resort: packages/ai/prompts under CWD (may not exist)
    return cwd / "packages" / "ai" / "prompts"


def _find_registry_entry(index: list, prompt_id: str) -> Optional[Dict[str, Any]]:
    for entry in index:
        if entry.get("id") == prompt_id:
            return entry
        aliases = entry.get("aliases") or []
        if prompt_id in aliases:
            return entry
    return None


def list_prompts(prompts_dir: Optional[str] = None) -> Any:
    base = _resolve_prompts_dir(prompts_dir)
    index_path = base / "registry.yaml"
    if not index_path.exists():
        raise FileNotFoundError(f"Prompt registry not found: {index_path}")
    data = yaml.safe_load(index_path.read_text())
    return data.get("prompts", [])


def load_prompt(id: str, params: Optional[Dict[str, Any]] = None, prompts_dir: Optional[str] = None) -> Dict[str, Any]:
    base = _resolve_prompts_dir(prompts_dir)
    index = list_prompts(str(base))
    entry = _find_registry_entry(index, id)
    if not entry:
        raise FileNotFoundError(f"Prompt not found in registry: {id}")

    tpl_path = base / entry.get("file")
    tpl = yaml.safe_load(tpl_path.read_text())

    rendered = _interpolate(str(tpl.get("prompt", "")), params)

    schema = None
    schema_ref = tpl.get("schema_ref") or entry.get("schema")
    if schema_ref:
        schema_path = base / schema_ref
        if schema_path.exists():
            try:
                schema = json.loads(schema_path.read_text())
            except Exception:
                schema = None

    try:
        source = str(tpl_path.relative_to(Path.cwd()))
    except ValueError:
        source = str(tpl_path)

    meta = {
        "id": tpl.get("id", id),
        "version": tpl.get("version", entry.get("version")),
        "description": tpl.get("description"),
        "owner": tpl.get("owner"),
        "tags": tpl.get("tags"),
        "runtime": tpl.get("runtime"),
        "variables": tpl.get("variables"),
        "schema_ref": schema_ref,
        "source": source,
    }

    return {"id": id, "version": meta.get("version"), "prompt": rendered, "schema": schema, "meta": meta}
