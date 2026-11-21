# Autoresearch Changelog — disclosure-rag-processor

## Experiment 0 — baseline

**Score:** 25/25 (100%)
**Change:** None — original skill measured as-is (plan-only mode: 5 cold agents, restricted to SKILL.md copy + references, produced execution plans for 5 test tasks).
**Reasoning:** Establish starting point before any mutation.
**Result:** All 25 checks passed. Per-run highlights: playlist run chose dry-run preview then full ingest with correct resume semantics; article run picked `main.py <url> --upload`; bulk run picked Option C `BulkFolderIngestion` and correctly noted the script has no CLI flags; quarantine run correctly stated the single-URL path bypasses the gate (no `--force` needed); search run used `main.sh search` + `stats` with real return-field names.
**Failing outputs:** None. Ceiling hit at baseline — the eval suite as configured cannot detect improvement. Options: harden evals with adversarial inputs (e.g. .docx single-file trap, missing env vars, YouTube Shorts URL, re-ingest semantics), or conclude the skill is already strong on these axes.

## Experiment 1 — baseline (hardened evals)

**Score:** 25/25 (100%)
**Change:** No skill mutation. Replaced the 5 mainstream test inputs with 5 adversarial trap inputs, each targeting a documented gotcha: (1) .docx file that main.py cannot process, (2) YouTube Shorts URL + vector-store requirement, (3) retry only failed playlist episodes without redoing the rest, (4) missing OPENAI_API_KEY but caption preview wanted, (5) mixed article/video URL file. Pass conditions were fixed before launch.
**Reasoning:** Experiment 0 saturated at 100%; a finer instrument was needed before concluding the skill is genuinely robust.
**Result:** All 25 checks passed again. Every trap was dodged with the skill's own documented reasoning: docx routed via bulk ingestion (limitation cited verbatim); Shorts recognized as the YouTube path with `--upload`; retry done by re-running WITHOUT `--force`, correctly distinguishing quarantined from failed; missing-key run chose heuristic-only `--dry-run` and explicitly omitted `--llm-review`/`--upload`; mixed file routed to `./main.sh process-urls`, with the agent even catching that `process-urls` lacks an `--upload` flag and offering the correct per-URL loop.
**Failing outputs:** None. Conclusion: the skill document reliably guides cold agents on both mainstream and adversarial tasks. Mutation loop not started — there is no measurable failure to optimize against. Recommended future use of this harness: re-run both eval sets as a regression check whenever SKILL.md changes materially. A speculative next experiment (not run): simplification — trim the skill and verify the score holds.
