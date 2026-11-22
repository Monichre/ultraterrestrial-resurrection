# Ingestion commit packaging

Updated November 21st, 2026, 19:35 CST.

| Field | Value |
| --- | --- |
| Session ID | integration-20261121-193435 |
| Focus area | integration (release packaging of finished ingestion fixes) |
| Agent | Claude Code (Opus 5.5), Concord `claude-code:4750b851`, background job `f232cf82` |
| Branch | `dev`, main checkout, shared working tree |
| Concord task | `ingestion-commit-packaging-november-20th-2026` (finish_work handoff recorded) |
| Plannotator Inbox thread | "Ingestion commit packaging" (`msg_01M7ZR1343V2YX2JR3G2HK3M47`) |
| Time spent | About 6 h across November 20th and 21st, 2026 |

## Goal

Land the ingestion fixes agents finished on November 7th, 2026 but never committed. Commit each ticket as a self-contained slice proven in a scratch copy, stage nothing that belongs to someone else, never stash, and commit or push only with the user's approval. Source of the packaging blocker: [docs/work_logs/november-6th-2026-dev-lead.md](docs/work_logs/november-6th-2026-dev-lead.md).

## Resume

1. Run `git log --oneline -4 origin/dev` and check that the top commit is `3a27924f`.
2. Read the hunk map below before you touch [apps/disclosure-rag/main.py](apps/disclosure-rag/main.py). It still holds about 59 uncommitted hunks that belong to six other concerns.
3. Validate any new slice the same way as before:
   - `git archive HEAD | tar -x -C <scratch>`.
   - Copy the slice files over the scratch tree.
   - From `apps/disclosure-rag`, run `pytest --continue-on-collection-errors -q`.
   - Compare the failure set with the baseline below.

## Done, with evidence

### Commits on `origin/dev`

`origin/dev` moved from `60d36bd7` to `3a27924f`. Ahead/behind is 0/0, and the index was empty afterwards.

| Commit | Ticket | Contents |
| --- | --- | --- |
| `580d3274` | t069 | The entity index is written to `kb_root()/metadata/entity_index.json` under an fcntl lock. Adds a regression test, [apps/disclosure-rag/tests/test_entity_index_root.py](apps/disclosure-rag/tests/test_entity_index_root.py). |
| `5682b527` | T-077 | Prompt plumbing: removes the duplicate `_find_registry_entry`, fixes the TypeScript loader path, adds `promptctl --dir` and clean missing-template errors, deletes the dead `content_analysis`/`enhanced_ner` templates and fixes methodology docs. The 6 JSON files in [packages/ai/prompts/schemas/](packages/ai/prompts/schemas/) were force-added. |
| `3a27924f` | T-068 + T-075 | The RAG gate advises, and the vector-store upload is skipped unless `rag_status == 'ok'`. Prompt contract 4.0 (details below). |

What `3a27924f` contains:
- Prompt versions: `rag_ingestion` 2.0.0, `validation` 2.0.0, `document_classification` 1.2.0 and `disclosure.ner` 4.0.0.
- Entity-resolution consumers: [mentions.py](apps/disclosure-rag/lib/entity_resolution/mentions.py) and [store.py](apps/disclosure-rag/lib/entity_resolution/store.py).
- 4 test files, including the new [apps/disclosure-rag/tests/test_t075_prompt_contract.py](apps/disclosure-rag/tests/test_t075_prompt_contract.py).
- Partial staging with `git apply --cached`:
  - [main.py](apps/disclosure-rag/main.py): only the 2 upload-gate hunks.
  - [registry.yaml](packages/ai/prompts/registry.yaml): only the 4 matching version bumps.

The first push carried 32 commits, including T-049 `e19bd80e`, `f0e55371` and `4fb88de1`. A secret scan of the added lines found nothing.

### Checks run

- **Before committing `3a27924f`:** all 13 staged paths were byte-identical to the validated scratch copy (`git diff --cached` compared against scratch).
- **On a fresh `git archive` export of `3a27924f`:**
  - `promptctl validate` reported "All prompts valid".
  - pytest gave 8 failed, 163 passed, 9 errors, the same failure set as the baseline.
  - `rag_ingestion` loads as 2.0.0 with its schema.
  - `cut_chunks` is present.
- **Baseline:** HEAD with the schemas present gives 8 failed, 136 passed, 9 errors. Every one of those comes from files missing from the export or from the absent async pytest plugin.

### Regression introduced and fixed

`5682b527` caused a regression on fresh clones only. It started tracking the strict `ingestion.schema.json`, whose chunk items set `additionalProperties: false` and have no `text`. Meanwhile `rag_ingestion` 1.0.0 still made the pipeline read `chunk["text"]`, so a fresh clone could produce empty chunks. `3a27924f` fixes it: the `rag_ingestion` 2.0.0 chunk text is cut in code. This machine was never affected, because it always had the schema on disk.

## Not committed, still in the working tree

`main.py` hunk map: 61 hunks in 8 concerns. Two are committed; the other six concerns are listed below with what each depends on.

| Concern | What it depends on (uncommitted) |
| --- | --- |
| T-069 / ING-02 sidecars in the archive folder | `KnowledgeBaseCRUD.get_document_dir` in `knowledge_base_crud.py` |
| Upstash/QStash queue removal | Nothing, since `lib/upstash/queue.py` is already absent at HEAD. The `--status` search-sync prints must go out with the `search_sync` removal in `knowledge_base_service.py`. |
| `--from-archive` episode replay | `lib/youtube.py` (`archive_is_current`, `load_archived_episode`) and `process_youtube_archive_enhanced` |
| T-070 `_web_summary_stage` | the `summary_generated` flags in `knowledge_base_service.py` |
| `_entity_stage` grading | the `entity_processing` outcome in `knowledge_base_service.py` |
| dy run log `_write_run_result` | `DY_RESULT_FILE` in `main.sh` |

Other files that are still uncommitted:
- `registry.yaml`: the `content_analysis` 3.0.0 and `research` 1.2.0 bumps. They ship with their set files.
- [packages/ai/prompts/methodology/NER_EXTRACTION_PROTOCOL.md](packages/ai/prompts/methodology/NER_EXTRACTION_PROTOCOL.md): its T-077 line is mixed into T-079's rewrite, so it ships with T-079.
- [apps/disclosure-rag/docs/CALL_CHAIN.md](apps/disclosure-rag/docs/CALL_CHAIN.md) and `disclosure-rag-processor/references/pipeline-architecture.md`: their t069 lines are buried in an October 6th, 2026 rewrite.
- [apps/app/src/utils.ts](apps/app/src/utils.ts): the Record/Timeline crash fix. It is uncommitted and hasn't been checked in the browser.

## Blocked or UNVERIFIED

- **UNVERIFIED: prompt quality.** No live model call has run against the 4.0 contract (T-082).
- **UNVERIFIED: Neon SQL.** The `resolve_pending` SQL in `store.py` has not been run against Neon.
- **UNVERIFIED: t069 end to end.** No end-to-end `dy` run has proven the entity-index fix.
- **Blocked: schema ignore exception.** The `.gitignore` exception `!packages/ai/prompts/schemas/**/*.json` is not written yet: the session's worktree guard rejected edits in the shared checkout. It was tested in a scratch repo: it picks up exactly the 6 schemas and leaves `.DS_Store` ignored. Until it is written, any new schema file needs `git add -f`.
- **Concord:** T-075 still holds `entity.schema.json`. The 5 claims left over from November 7th, 2026 are still active, and one of them locks [DAILY_WORK_PLAN.md](DAILY_WORK_PLAN.md).
- **No live ingestion run is safe yet.** T-070's smoke run escaped its temp folder: it wrote 4 PDFs and 1 Mem0 memory outside it.

## Next action

The user picks the next item in the Inbox thread:
- T-084: replay a saved episode with its output kept in a temp folder. This is the check before any live ingestion run. Contract: [docs/plans/october-7th-2026-transcript-pilot.md](docs/plans/october-7th-2026-transcript-pilot.md).
- Package the next `main.py` concern from the table above.
