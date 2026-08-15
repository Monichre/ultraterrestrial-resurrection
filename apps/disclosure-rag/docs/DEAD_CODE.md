# Dead Code Ledger — `apps/disclosure-rag/`

**Created:** 2026-08-09 · **Lane:** A — Corpus & Ingestion

Files confirmed unreachable from the live `dy` entry point, marked with a
`DEAD CODE — MARKED FOR DELETION` header but **not yet deleted**. Each row states
the evidence for deadness and any blocker that must clear before `git rm`.

## How deadness was established

`dy` is a zsh alias to `apps/disclosure-rag/main.sh` (`~/.zshrc:135`). Every
Python invocation in that script is enumerable:

```
$ grep -n 'VENV_PYTHON"' main.sh
```

Every content-processing branch runs `"$SCRIPT_DIR/main.py"` — lines 147, 167,
195, 365, 368, 371. No branch reaches any other `main_*.py`.

Import search (excluding `.venv/`, `venv/`, `__pycache__`, `.specstory/`):

```
$ grep -rn -E "main_enhanced|main_fixed|main_unified" --include="*.py" --include="*.sh" --include="*.toml" --include="*.json" --include="*.cfg" .
```

Result: every hit is a file's own usage docstring, **except one** — see the
`main_unified.py` blocker below.

## Marked for deletion

| File | Lines | Last commit | Blocker |
|---|---|---|---|
| `main_enhanced.py` | 954 | `a303da4b` 2025-09-19 | none — safe to `git rm` |
| `main_fixed.py` | 661 | `a303da4b` 2025-09-19 | none — safe to `git rm` |
| `main_unified.py` | 487 | `d74feaea` 2026-07-12 | **YES** — see below |

### `main_unified.py` blocker

```
tests/test_dimension_consistency.py:140
    from main_unified import UnifiedVectorStorage
```

`test_unified_storage()` asserts a 384-dimension embedding. That contradicts the
platform lock of `text-embedding-3-small` @ **1536** dims (`CLAUDE.md`), so the
test is exercising a storage path the product does not use.

Resolve by one of:

1. Retire `test_unified_storage()` along with the module (likely correct — the
   384-dim path is not the shipped embedding contract), or
2. Relocate `UnifiedVectorStorage` into `lib/` if anything still needs it.

Until then `main_unified.py` deletion breaks the test file.

Note: the `main_unified.py` docstring claims it "implements the dy command
functionality". It does not, and never did on this branch — `dy` has only ever
routed to `main.py`. Treat that docstring as the reason this file survived.

### Pre-existing type errors

All three files carry unresolved Pyright errors (missing attributes on
`InteractiveEntityProcessor` / `KnowledgeBaseCRUD`, `None` passed where a
concrete type is required). They reference APIs that have since changed shape —
independent corroboration that these files have not been run in a long time.

## Not yet swept

This ledger covers only the `main_*.py` family. `apps/disclosure-rag/` has other
deletion candidates not yet verified (`fix_disclosure_rag.py`, `fix_youtube.sh`,
`venv/` alongside `.venv/`, several `*_PSUEDOCODE.md` and dated status docs).
Do not treat their absence here as evidence they are live.
