# Entity Resolution — Status for Review

**Written:** 2026-09-27 05:10:01 CDT (UTC−05:00)
**Lane / ticket:** Lane A — Corpus & Ingestion, T-048 (H1 remainder)
**Branch:** `dev` (all four commits below are ancestors of `dev`; also present on `feat/canvas-ux-sweep`)
**Status:** shipped and exercised against live Neon · **the human-decision loop and the new auto-write gate are UNVERIFIED** (see [What is NOT done](#what-is-not-done))
**Audience:** any agent picking up disclosure-rag ingestion, entity extraction, or the Neon bridge

---

## Why this exists

NER was extracting entities that never matched anything in Neon. The Vallée episode was the
proof: **74 entities extracted, 0 matched** existing rows. The pipeline produced names; the
database held differently-spelled names; nothing joined them.

The fix is an **alias table plus a staged, operator-driven resolution CLI**. Each resolution
decision is stored, so the next occurrence of that spelling is an exact lookup instead of a
guess.

---

## What shipped

### Schema — [`packages/db/migrations/003_entity_resolution.sql`](packages/db/migrations/003_entity_resolution.sql) (**applied to Neon**)

- `entity_aliases` — `(entity_table, entity_id, alias, source, mention_id)`, unique on
  `uq_entity_alias`, with a generated `alias_normalized`.
- `entity_normalize()` — the **single** normalization authority. Never write a Python copy of
  it; all matching goes through the SQL function (the migration header says why).
- `document_entities` gains the mention-queue columns: `status`, `resolved_table`,
  `resolved_entity_id`, `match_score`, `decided_by`, `decided_at`, `decision_note`,
  `applied_at`, `run_id`, `chunk_index`, generated `entity_name_normalized`.
- Trigram + normalized indexes for candidate search.

### Code

| File | Role |
|---|---|
| [`apps/disclosure-rag/lib/entity_resolution/mentions.py`](apps/disclosure-rag/lib/entity_resolution/mentions.py) | Pure extraction from `*_rag_pipeline.json`; `TYPE_TO_TABLE`; stable `mention_key` |
| [`apps/disclosure-rag/lib/entity_resolution/store.py`](apps/disclosure-rag/lib/entity_resolution/store.py) | All DB work: `load_mentions`, `resolve_pending`, `find_candidates`, `decide_*`, `apply_decisions` |
| [`apps/disclosure-rag/lib/entity_resolution/review_cli.py`](apps/disclosure-rag/lib/entity_resolution/review_cli.py) | The terminal review screen |
| [`apps/disclosure-rag/scripts/entity_resolution.py`](apps/disclosure-rag/scripts/entity_resolution.py) | CLI entry, dry-run-by-default |
| [`apps/disclosure-rag/tests/test_entity_resolution.py`](apps/disclosure-rag/tests/test_entity_resolution.py) | 8 tests; DB tests run the real migration on a throwaway **local** Postgres |
| [`apps/disclosure-rag/main.sh`](apps/disclosure-rag/main.sh) | Routes the four `dy` subcommands |

### The four stages

Deliberately **four resumable stages**, not one transaction. The operator runs them from their
own CLI so questionable data can be inspected between stages.

```
dy load-mentions [--commit]   # queue NER mentions as `pending`
dy resolve       [--commit]   # auto-decide what code can; queue the rest
dy review        [--table T]  # human decides, one mention per screen (commits each decision)
dy apply         [--commit]   # the ONLY stage that creates entity rows
```

**Ingest writes no entity rows at all.** Creation happens only in `apply`, only for mentions a
human marked `new`.

---

## Live Neon state (verified 2026-09-27 05:10 CDT)

Read-only probe via `lib.db.postgres_client.connect(read_only=True)`:

| Metric | Value |
|---|---|
| Mentions queued | **113** (from 68 pipeline files) |
| `matched` (auto, exact alias) | **13** |
| `needs_review` | **84** |
| `skipped` (EVIDENCE — no entity table) | **16** |
| `applied_at IS NOT NULL` | **0** — nothing has been written to entity tables |
| `decided_by = 'human'` | **0** — no human decision has ever been recorded |
| Mentions linked to a `documents` row | **29 of 113** |
| `entity_aliases` rows | **774**, all `source = 'seed_name'` |
| `key_figures` / `organizations` / `events` | **465 / 40 / 142** — unchanged by this work |

Per-table review queue: `key_figures` 12 matched / 26 review · `organizations` 1 matched /
20 review · `events` 19 review · `topics` 11 review · `locations` 8 review · 16 skipped.

---

## Evidence

| Claim | Command | Result |
|---|---|---|
| Tests pass | `pytest tests/test_entity_resolution.py tests/test_main.py tests/test_postgres_client.py` | **52 passed in 1.36s** (8 new) |
| Lint clean | `ruff check` | `All checks passed!` |
| CLI wired | `dy help` | lists `load-mentions`, `resolve`, `review`, `apply` |
| Migration applied | `003_entity_resolution.sql` on Neon | `entity_aliases` + new `document_entities` columns exist |
| Load is idempotent | `dy load-mentions --commit` | 113 inserted; re-run reports `already_loaded` |
| Resolve ran live | `dy resolve --commit` | 13 matched, 84 needs_review, 16 skipped |
| Entity tables untouched | post-run `count(*)` | 465 / 40 / 142, same as before |
| Review renders | `dy review --table key_figures` | one screen ("Dr. Behrenholz", no candidates), quit with **0 decisions** |

A `BEGIN … ROLLBACK` rehearsal on Neon preceded each `--commit` run.

---

## Design decisions worth knowing before you change this

1. **Exactly one exact alias hit → auto-match.** Two or more hits always go to review:
   two rows legitimately carry that alias and choosing between them is a human's call.
2. **Deciding one spelling cascades.** A match records the alias, then re-resolves every
   other open mention whose normalized name matches. One decision can clear several rows.
3. **`locations` is matched against its own rows**, not seeded into `entity_aliases` — the
   13,933 gazetteer names were deliberately left out.
4. **Normalization lives in SQL only.** `entity_normalize()` is the one authority; never add a
   Python copy.

(There is no `canonical_key` column and there should not be one — the two-line rationale is in
the [`003`](packages/db/migrations/003_entity_resolution.sql) header. It is settled; it does not
need re-arguing here.)

---

## Auto-write gate (added 2026-09-27)

`resolve` can now decide `matched` and `new` without a human. What it must **not** gate on is the
NER stage's own `confidence` field — the three episodes ingested 2026-09-27 produced 148
validation issues, 24 critical, including `FABRICATED_SOURCE_QUOTE` and entities that occur zero
times in the transcript (`Ziusudra`, `Younger Dryas`, verified by grep). A fabricator's
self-assessment cannot authorize a database write.

The gate is a conjunction of three signals the extracting model does not author:

| Signal | Where it comes from | Deterministic? |
|---|---|---|
| validation verdict ≠ `fail` | a separate validation pass | no — LLM |
| `quote_grounded` | `span_quote` is literally in its chunk | **yes** |
| trigram / alias score | `pg_trgm` against existing rows | **yes** |

Outcomes, all overridable by env var:

- `matched` — top score ≥ `ENTITY_AUTO_MATCH_SCORE` (0.92) **and** ≥ 0.15 clear of the runner-up.
  Records the alias with `source='auto_match'`, then cascades.
- `new` — **nothing** cleared `TRIGRAM_FLOOR` (0.30), i.e. the candidate list came back empty.
- everything else — `needs_review`, with the reason in `decision_note`.

`ENTITY_WRITE_MODE` (`off` | `staging` | `auto`) is the master switch; anything but `auto` keeps
every non-exact decision human. It reuses the name the retired
[`EntityCreator`](apps/disclosure-rag/lib/entity_extraction/core/entity_creator.py) used for the
same purpose against Xata.

**Why auto-`new` fires only on an empty candidate list.** Measured on live data:

| Pair | Similarity |
|---|---|
| `Jacques Vallee` / `Jacques Vallée` | 1.000 (exact after normalize) |
| `Bob Bigelow` / `Bigelow` | 0.727 |
| `Lue Elizondo` / `Luis Elizondo` | 0.688 |
| `Harry Reid` / `Senator Harry Reid` | 0.579 |
| **`Bob Bigelow` / `Robert Bigelow`** | **0.444 — same person** |
| `Ziusudra` / `Robert Bigelow` | 0.000 |

A nickname for someone already in the table scores *below* any plausible "nothing matches"
cutoff. A first draft used 0.45 and would have auto-created a duplicate `Bob Bigelow` beside the
existing `Robert Bigelow` — the exact defect the database already carries 5 of. Everything
between the floor and 0.92 is where real variants live, so that band stays human.

`apply` is still the only stage that inserts an entity row, so an auto-`new` is reversible until
it runs.

---

## Locations: vector column (added 2026-09-27)

`locations` was the only entity table with no `embedding` column, so semantic/agentic search
reached every entity type except places. [`004_locations_embedding.sql`](packages/db/migrations/004_locations_embedding.sql)
adds it, plus the trigram index the resolver's own location lookup had been running without
(13,933 rows, primary key only — every candidate search was a sequential scan).

Backfill is separate because it costs API calls:
[`scripts/backfill_location_embeddings.py`](apps/disclosure-rag/scripts/backfill_location_embeddings.py) —
resumable (only ever selects `WHERE embedding IS NULL`), dry-run by default, commits per batch.
Embeds `"name, city, state, country"`; `locations` has no description column.

**Status: migration NOT APPLIED, backfill NOT RUN.** The script refuses to run until the column
exists, which is the current state.

One caution for whoever wires agentic search: vectors are right for *discovery* and wrong for
*resolution*. Cosine similarity cannot separate `Robert Bigelow` from `Bob Bigelow` better than
trigram already does, and it ranks a different researcher's near-identical bio as a close
neighbour. Keep alias-exact + trigram for deciding **who this is**; use vectors for **find me
records about X**.

---

## Reversibility

- Every stage is **dry-run by default**; `--commit` is explicit.
- `apply` leaves the transaction to the caller, so a dry run is a real `BEGIN … ROLLBACK`.
- The 113 queued rows are deletable; nothing else in Neon depends on them yet.
- No deletes anywhere in this code path.

---

## What is NOT done

| Gap | Detail |
|---|---|
| **Human loop never exercised** | 0 rows have `decided_by = 'human'`. `review` has only been rendered and quit. |
| **Auto gate never run on live data** | The gate is covered by 15 tests incl. a real-migration DB test, but `resolve` has not been re-run against the 84 queued mentions with `ENTITY_WRITE_MODE=auto`. |
| **Locations vectors** | 004 not applied, backfill not run. |
| **No dogfood audit** | No real `dy <url>` ingest has been run end-to-end into the queue. |
| **No app surface** | Nothing in [`apps/app`](apps/app) or [`apps/disclosure-lab`](apps/disclosure-lab) reads `entity_aliases` or the mention queue. |
| **Document links** | 84 of 113 mentions have no `documents` row; they carry only `metadata.kb_path`. Closes with T-048 **H2**. |
| **Duplicate entities** | 5 duplicate rows surfaced by the alias seed (Däniken, Chop, O'Leary, D'Antonio, New Paradigm Institute). **No merge tool exists.** |
| **NER noise** | The queue contains non-entities: "The President", "Media", "Unnamed staffer". Prompt-side fix, not a resolver fix. |
| **No LLM tiebreak tier** | Blocked: OpenRouter exhausted, Anthropic 401. `AI_GATEWAY_API_KEY` / `VERCEL_AI_GATEWAY_API_KEY` sit unused in `.env`. |
| **Ingest not wired** | `dy <url>` does not queue mentions; `load-mentions` is a separate step. |

Per [`.agents/rules/DEFINITION_OF_DONE.md`](.agents/rules/DEFINITION_OF_DONE.md) this feature is
**UNVERIFIED**, not done: green tests plus a render-and-quit are not a visual audit of the user
path.

---

## Owners

**Operator (human, at the CLI):**
1. `./main.sh review` over the 84 queued mentions.
2. `./main.sh apply` (dry run) → `./main.sh apply --commit`.
3. Decide how the 5 duplicate entity rows should merge.

**Agent-doable without the human:**
- T-048 **H2**, the Neon bridge: disclosure-rag still writes no chunks or vectors to Neon, and
  [`packages/db/migrations/002_documents_content_hash.sql`](packages/db/migrations/002_documents_content_hash.sql)'s
  `documents.content_hash` has no writer. Narrowest useful slice: link the 84 unlinked mentions
  to `documents` rows.
- Wire `dy <url>` to queue mentions automatically.
- Fix the NER prompt's noise names.

**Blocked on money or credentials:** the 49 `enrichment_failed` records (model gateway), the 51
`deferred_blocked` playlist episodes (likely `YT_WEBSHARE_PROXY_*`), the PDF pilot.

---

## Hazards for the next agent

1. **Never `git stash` in this working tree.** Concurrent agent sessions keep uncommitted work
   here. Stage by path instead. (Binding rule in [`AGENTS.md`](AGENTS.md).)
   During this work a plain `git commit` swept **214 foreign staged files** from another session
   into a commit. Repaired with `git reset --soft HEAD~1` plus a private index
   (`GIT_INDEX_FILE=… git read-tree HEAD && git apply --cached … && git commit`); their staged
   set was confirmed intact afterwards. The index is clean as of this writing.
2. **A local scratch DB created with ctype `C` silently strips Cyrillic** — `[^[:alnum:]]+` drops
   non-ASCII letters there. Neon is `C.UTF-8` and preserves them. The divergence and a recovery
   recipe are documented in the 003 migration header. Do not "fix" the regex.
3. **Pyright complaints about `psycopg.types.json` and the relative imports are false positives** —
   it is not using the app's `.venv`. `pytest` imports every module fine.
4. **`get_database_url()` falls back to [`packages/db/.env`](packages/db/.env), the LIVE shared Neon
   database**, and warns loudly when it does. Source `apps/disclosure-rag/.env` if you meant
   something else.

---

## Commits

| Hash | Contents |
|---|---|
| `bf34ce1c` | `003_entity_resolution.sql` (applied to Neon) |
| `0ffcec6b` | 4 resolver modules, CLI script, tests, `main.sh` routing |
| `bb9b5431` | TODO.md note |
| `5dcdea1d` | TODO.md note moved under **H1 remainder** |

Verify by artifact, not by hash — a past history rewrite in this repo invalidated many recorded
hashes (see the banner in [`docs/PLANS/TODO.md`](docs/PLANS/TODO.md)).

---

## Next action

`cd apps/disclosure-rag && ./main.sh review --table key_figures` — decide the first 10 names.
Each screen shows the name, its source quote and the nearest existing records; number = match,
`n` = new, `s` = skip, `q` = quit. Every decision commits immediately.
