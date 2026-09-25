---
status: live
role: eng
spine: do
updated: 2026-08-16
---

# T-061 Phase 2 — Date-path call-site remediation

**Created:** 2026-08-16
**Ticket:** T-061 ([`docs/plans/TODO.md`](docs/plans/TODO.md))
**Lane:** A — Corpus & Ingestion
**Parent plan:** [`docs/plans/2026-08-16-source-canonical-reorg.md`](docs/plans/2026-08-16-source-canonical-reorg.md) §5
**Status:** ready to delegate — not started
**Layer map (read first):** [`apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md`](apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md)

---

## 0. What this ticket is and is not

**Is:** stop the ingest pipeline from writing `sources/<tree>/<YYYY-MM-DD>/…`
and make it write `sources/<tree>/<source-slug>/…` instead, via one shared
helper.

**Is not:** moving any existing file. Phase 3 of the parent plan does that.
If you find yourself running `git mv` on anything under
`packages/knowledge-base/sources/`, you are in the wrong ticket.

Scope is code, and it does include a few **behavior** changes to the functions
you are already editing (D1–D3 below). Those are called out individually and
each is bounded — none of them may change what is on disk today.

**Why it must land before Phase 3:** move 887 files while these writers still
compose a date folder and new ingests keep re-creating date dirs. The
migration would never converge.

### Prerequisite

`resolve_entry_dir()` needs a source key, which comes from
`metadata/source-registry.json` — a **Phase 0/1 artifact that does not exist
yet**. Build against the interface in §2 and use the `unresolved` fallback
until the registry lands. This ticket is implementable now; it is only
*fully exercisable* once the registry exists.

---

## 1. The distinction that decides this ticket

Six sites match `datetime.now().strftime("%Y-%m-%d")`. **They are not the same
kind of site.**

| Class | Meaning | Action | Sites |
| --- | --- | --- | --- |
| **P — path composer** | the value becomes a **directory** on disk | **replace** with `resolve_entry_dir()` | 4 |
| **M — index metadata** | the value becomes a **field** in `index.json` | **keep**, rename to `ingested_at` | 2 |

**Do not delete the Class M sites.** They are the only record of when an entry
was ingested. The parent plan (§6.1) depends on that value surviving — once
date directories are gone, this field is the sole remaining provenance for
ingest time. Deleting it destroys data that cannot be recovered.

Line numbers below were read on 2026-08-16. **Match on the quoted code, not on
the line number** — they will drift as you edit.

---

## 2. The shared helper (build this first)

Add to the existing [`apps/disclosure-rag/lib/kb/kb_root.py`](apps/disclosure-rag/lib/kb/kb_root.py).
That module is already the single source of truth for the archive root and
already honours `DISCLOSURE_RAG_KB_PATH`; this helper belongs beside it, not
in a new module.

```python
def resolve_entry_dir(tree: str, source_key: str | None, entry_id: str) -> Path:
    """Absolute directory for one archive entry, keyed by canonical source.

    Replaces the date-folder layout: `sources/<tree>/<YYYY-MM-DD>/<entry_id>/`
    becomes `sources/<tree>/<source_slug>/<entry_id>/`.

    tree:       "transcripts" | "web" | "files"
    source_key: registry key from metadata/source-registry.json; None or
                unknown -> "unresolved" (never guess a source)
    entry_id:   videoId, <slug>-<hash8>, or filename stem
    """
```

Rules the implementation must honour:

1. **Unknown source is not an error and not a guess.** `None`, empty, or a key
   absent from the registry all resolve to `unresolved/`. Filing an entry under
   the wrong canonical source is worse than leaving it unfiled.
2. **Slug from the registry, never from a display title.** Channel titles get
   renamed; the registry maps a stable `channel_id` to a stable slug.
3. **No `mkdir` inside the helper.** It computes a path. Callers create dirs.
   Keeps it testable and side-effect free.
4. **Reject `tree` values outside the three known trees** with a clear
   `ValueError`. See defect D3 for what silent fallbacks have already cost.
5. **Route everything through `kb_root()`** so `DISCLOSURE_RAG_KB_PATH` keeps
   redirecting the whole process.

Registry loading should be cached per process — do not re-read the JSON per
entry during a bulk ingest.

---

## 3. Class P — the four path composers

### P1. `knowledge_base_crud.py` — `_get_doc_path()` (~line 213)

**Highest-value site.** It is the single choke point for all CRUD writes:
content file *and* metadata sidecar both route through it, so one change
covers both.

```python
# current
date_folder = datetime.now().strftime("%Y-%m-%d")
...
return base_path / date_folder / dir_name / filename
```

Replace the `base_path / date_folder / dir_name` composition with
`resolve_entry_dir(tree, source_key, dir_name)`.

Two things to fix while you are in this function:

- `base_paths` maps `file|transcript|web|research`. The lookup is
  `base_paths.get(doc_type, self.kb_path)` — **an unknown `doc_type` silently
  falls back to the archive root** and writes outside `sources/`. This is the
  confirmed cause of defect D3.

  **Do not make this raise.** The silent fallback is load-bearing: `case_file`
  is a real `doc_type` in use (it is tagged as such in `index.json`), and it is
  exactly one of the values that misses `base_paths`. Raising would convert a
  misfiled write into a crash in the case-file ingest path, and the callers
  passing non-canonical `doc_type` values have not been enumerated.

  Instead: route known types through `resolve_entry_dir`, and for an unknown
  type **log a warning and write to `unresolved/` under the closest tree**.
  Same defect closed, no new crash surface, and it matches helper rule #1.
  Widening `base_paths` to cover `case_file` properly is a follow-up, not this
  ticket.
- `doc_type` here is the CRUD vocabulary (`transcript`), which is *not* the
  same as `data_formatter`'s (`youtube_transcript`). Map explicitly; do not
  assume the strings match.

### P2. `knowledge_base_service.py` — web ingest dir (~line 618)

```python
date_folder = datetime.now().strftime("%Y-%m-%d")
url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
...
web_dir = sources_root() / "web" / date_folder / f"{safe_title}_{url_hash}"
```

Already routed through `sources_root()` — the cleanest site. Becomes:

```python
web_dir = resolve_entry_dir("web", source_key, f"{safe_title}_{url_hash}")
```

`source_key` for web is the registrable domain of `url` (Tier B in the parent
plan) — derivable right here, no registry lookup strictly required, but go
through the registry so aliases resolve consistently.

### P3. `youtube.py` — `get_folder_path_from_metadata()` (~line 71)

Three callers: lines ~170, ~232, ~252. Fix the function; the callers need no
change.

```python
current_date = datetime.datetime.now().astimezone().strftime("%Y-%m-%d")
base_folder = os.path.join(directory, current_date) if directory else os.path.join(
    os.getcwd(), current_date)
```

**This function has three defects, not one:**

1. Composes a date folder (the thing this ticket removes).
2. **Falls back to `os.getcwd()`** when `directory` is unset — writes the
   archive into whatever directory the process happened to start in. See D2.
3. **Ignores `DISCLOSURE_RAG_KB_PATH` entirely.** It reads its own
   `TRANSCRIPT_DIRECTORY_PATH` global (line 20), so it is the one writer that
   escaped the `kb_root` consolidation. The benchmark harness's sandbox
   override does **not** redirect it — meaning benchmark runs can write into
   the production archive.

Rewrite to `resolve_entry_dir("transcripts", source_key, metadata['id'])`,
routed through `kb_root`. Retire the module-global `directory` and the
`TRANSCRIPT_DIRECTORY_PATH` env var, or keep the var as a deprecated alias
that logs a warning — your call, but it must no longer be the only root.

Preserve the existing identifier precedence: `metadata['id']` → cleaned
`metadata['title']` → `'unknown'`.

### P4. `data_formatter.py` — `create_working_directory()` (~line 50)

**Verified 2026-08-16: this is dead code. Do not port it.**

`StandardizedDataFormatter` has no production caller. Its only reference
outside its own module is [`apps/disclosure-rag/scripts/benchmark_pipeline.py:549`](apps/disclosure-rag/scripts/benchmark_pipeline.py#L549),
which instantiates the class solely to print `base_storage_dir` and never
calls `create_working_directory` or any `format_*` method. Its three internal
callers (~73, ~123, ~175) are only reachable from each other.

That is also why `sources/articles/` and `sources/other/` — which this
function would create — do not exist on disk.

**Preferred action:** propose deleting the module, and confirm the benchmark
probe at line 549 still works (it only touches `base_storage_dir`, so it
should). **Do not wire `resolve_entry_dir` into it.** Adding the helper to
dead code spreads the new interface into a surface nobody executes.

If you would rather not delete in this ticket, leave the module untouched and
say so in your report — porting it is the one option that is actively wrong.

The rest of this section is retained only as the record of what the function
does, should someone revive it.

Three callers: lines ~73, ~123, ~175.

```python
date_folder = datetime.now().strftime("%Y-%m-%d")
...
working_dir = self.base_storage_dir / subdir / date_folder / doc_id
working_dir.mkdir(parents=True, exist_ok=True)
```

`base_storage_dir` already defaults to `sources_root()`. Replace the
composition with `resolve_entry_dir(tree, source_key, doc_id)`, keeping the
`mkdir` at the call site.

**Fix the tree names while here.** The current map is:

| `doc_type` | current `subdir` | correct tree |
| --- | --- | --- |
| `youtube_transcript` | `transcripts` | `transcripts` ✅ |
| `web_article` | **`articles`** | **`web`** ❌ |
| `local_file` | `files` | `files` ✅ |
| anything else | **`other`** | must raise ❌ |

`sources/articles/` and `sources/other/` are not real trees — `sources/`
contains exactly `files`, `transcripts`, `web`. The question of whether this
path was dead or merely never exercised for web articles is **settled above:
it is dead.** The table stands as a record of the divergence, not as a work
item.

---

## 4. Class M — the two index-metadata sites (preserve, do not delete)

### M1. `knowledge_base_service.py` (~line 127, consumed ~line 154)

```python
date_folder = datetime.now().strftime("%Y-%m-%d")   # line 127
...
"date_folder": date_folder,                          # line 154
```

Composes no path. It only labels the index entry.

**Keep the value. Rename the field to `ingested_at` and store a full ISO-8601
timestamp** rather than a bare date. Write both keys during the transition so
existing readers do not break.

### M2. `knowledge_base_crud.py` (~line 351)

```python
date_folder = datetime.now().strftime("%Y-%m-%d")
meaningful_dir_name = self._generate_dir_name(title, doc_id)
self.index["documents"][doc_id] = {
    ...
    "date_folder": date_folder,
```

Same treatment as M1.

**Note for the Phase 3 migrator:** 449 indexed transcript docs already carry
`metadata.date_folder`, so their ingest date is safe. The 114 bare videoId
dirs have no index entry and no metadata file — their ingest date exists
*only* as the directory name and is destroyed at move time unless written out
first. That is Phase 3's problem, but it is why M1/M2 must not be gutted here.

---

## 5. Do not change

- `metadata/index.json` **document IDs**. They are `md5(content)[:12]`
  ([`apps/disclosure-rag/lib/kb/knowledge_base_crud.py:183`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py#L183))
  — content-derived, not path-derived. Nothing about a path change should
  touch an ID.
- Any file under `packages/knowledge-base/sources/`.
- The glob-based consumers — [`packages/knowledge-base/check-delta.py`](packages/knowledge-base/check-delta.py),
  [`packages/knowledge-base/delta-comparison.py`](packages/knowledge-base/delta-comparison.py),
  [`packages/knowledge-base/index.ts`](packages/knowledge-base/index.ts),
  [`packages/knowledge-base/package.json`](packages/knowledge-base/package.json).
  They match `**/*.txt` or export tree roots, so they are depth-agnostic and
  survive the layout change untouched. Verify, don't edit.

---

## 6. Verification

Run from repo root. Use the disclosure-rag `.venv`.

```bash
# 1. No path composer left. Expect ONLY the two Class M sites (renamed).
grep -rn --include='*.py' 'strftime("%Y-%m-%d")' apps/disclosure-rag/lib

# 2. No writer bypasses kb_root.
grep -rn --include='*.py' 'os.getcwd()' apps/disclosure-rag/lib

# 3. Sandbox override redirects EVERY writer, youtube.py included.
#    TRANSCRIPT_DIRECTORY_PATH must be UNSET — it is set in the live .env and
#    points into the real archive, so leaving it set masks the P3 regression.
#    The run must actually perform a transcript write; a suite that never
#    calls get_folder_path_from_metadata proves nothing here.
env -u TRANSCRIPT_DIRECTORY_PATH DISCLOSURE_RAG_KB_PATH=/tmp/kb-probe \
  python -m pytest apps/disclosure-rag/tests/ -q
#    then: nothing new may appear under packages/knowledge-base/
git status --porcelain packages/knowledge-base/
#    and the probe root must actually contain the written entry
find /tmp/kb-probe -type f | head

# 4. Positive CWD check — absence of os.getcwd() in source is weaker than
#    absence of a file after a real run. Ingest from an unrelated cwd:
cd /tmp/cwd-probe && env -u TRANSCRIPT_DIRECTORY_PATH \
  DISCLOSURE_RAG_KB_PATH=/tmp/kb-probe python -m <one transcript ingest>
#    /tmp/cwd-probe must be empty afterwards
ls -A /tmp/cwd-probe

# 5. Existing suite still green.
cd apps/disclosure-rag && python -m pytest tests/ -q
```

### Acceptance criteria

1. Grep #1 returns only Class M sites; every Class P site is gone.
2. A dry-run ingest with a known source key writes to
   `sources/<tree>/<source-slug>/<entry_id>/` — verified by looking at the
   actual path on disk, not by reading the code.
3. An ingest with an unknown/absent source key writes to
   `sources/<tree>/unresolved/<entry_id>/` and does not raise.
4. `DISCLOSURE_RAG_KB_PATH` redirects every live writer, youtube.py included —
   demonstrated with `TRANSCRIPT_DIRECTORY_PATH` unset **and** a transcript
   write actually performed. This is the check that catches the P3 regression,
   and it is inert if either precondition is skipped.
5. An ingest run from an unrelated cwd leaves that cwd empty (D2).
6. `date_folder`/`ingested_at` still present on every newly indexed doc.
7. Zero files added or modified under `packages/knowledge-base/sources/`.

Per [`.agents/rules/DEFINITION_OF_DONE.md`](.agents/rules/DEFINITION_OF_DONE.md):
report the command **and its actual output** for each. Green tests alone do not
close this ticket — criterion 2 requires looking at a real written path.

---

## 7. Defects confirmed while specifying this ticket

Root causes established by reading the code, not inferred from symptoms.
Fix D1–D3 as part of this ticket (they are in the functions you are already
editing). D4–D5 are adjacent; flag, do not fix.

| ID | Defect | Root cause | Evidence |
| --- | --- | --- | --- |
| **D1** | `youtube.py` ignores `DISCLOSURE_RAG_KB_PATH` | reads its own `TRANSCRIPT_DIRECTORY_PATH` global (line 20) | benchmark sandbox cannot redirect transcript writes |
| **D2** | transcripts can be written to the process CWD | `os.getcwd()` fallback in `get_folder_path_from_metadata` when the env var is unset | stray `apps/disclosure-rag/zjpvfDFc4fg_summary.txt` |
| **D3** | entries written outside `sources/` | `base_paths.get(doc_type, self.kb_path)` silently falls back to the archive root for unknown `doc_type` | stray `packages/knowledge-base/2026-08-15/zjpvfdfc4fg-1ad65595` — doc_type `case_file` is not in `base_paths`; its id `1ad6559564d2` is tagged `case_file` in `index.json` |
| **D4** | 54 index docs store `/Users/...` absolute paths | writers persisted absolute instead of using `kb_root.relativize()` | contradicts ingestion-hardening §3.4 "paths stored relative, always" |
| **D5** | `youtube.py` captures no channel metadata | yt-dlp path removed (line 136); `youtube-transcript-api` returns transcript text only | `categories`/`tags`/`description`/`chapters` empty on all 83 metadata files — the reason T-061 needs an external lookup at all |

D2 and D3 produced the two entries that escaped `sources/` noted in the parent
plan §9. Both are latent, not historical: the same inputs today still take the
same branch.

---

## 8. Constraints

- Branch off `dev`; stage only the paths you touched.
- **Never `git stash`** — concurrent agent sessions share this working tree.
- Code only. No file moves under `packages/knowledge-base/sources/`.
- If Phase 0's registry does not exist yet, build against the §2 interface and
  exercise the `unresolved` path. Do not invent a registry format — the schema
  is fixed by the parent plan §3.1.
