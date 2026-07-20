# LLM Wiki — Pattern Reference (Karpathy-style)

> Reference doc (immutable idea source). Captured 2026-06-20.
> Analysis of fit for this project: `docs/plans/2026-06-20-llm-wiki-approach-analysis.md`

A pattern for building personal/research knowledge bases using LLMs.

## The core idea

Most LLM+document workflows are RAG: upload files, retrieve relevant chunks at
query time, generate an answer. The LLM rediscovers knowledge from scratch on every
question — nothing accumulates.

The LLM Wiki is different: the LLM **incrementally builds and maintains a persistent
wiki** — a structured, interlinked collection of markdown files sitting between you
and the raw sources. Adding a source isn't just indexing it; the LLM reads it,
extracts key info, and integrates it into the existing wiki — updating entity pages,
revising topic summaries, flagging contradictions, strengthening/challenging the
evolving synthesis. Knowledge is compiled once and **kept current**, not re-derived
per query. The wiki is a **persistent, compounding artifact**.

The human curates sources, explores, and asks questions. The LLM does the grunt work
— summarizing, cross-referencing, filing, bookkeeping. (Obsidian as IDE, LLM as
programmer, wiki as codebase.)

## Architecture — three layers

1. **Raw sources** — curated source documents. Immutable; the LLM reads, never
   modifies. Source of truth.
2. **The wiki** — LLM-generated markdown: summaries, entity pages, concept pages,
   comparisons, overview, synthesis. LLM owns this entirely.
3. **The schema** — a config doc (CLAUDE.md / AGENTS.md) telling the LLM how the wiki
   is structured, conventions, and workflows for ingest/query/maintain. Co-evolved.

## Operations

- **Ingest.** Drop a source; LLM reads it, discusses takeaways, writes a summary
  page, updates the index, updates relevant entity/concept pages (10–15 pages per
  source), appends to the log.
- **Query.** Ask against the wiki; LLM reads the index, drills into pages,
  synthesizes a cited answer. **Good answers get filed back as new pages** so
  explorations compound.
- **Lint.** Periodic health-check: contradictions, stale claims, orphan pages,
  missing concept pages, missing cross-refs, data gaps to fill via web search.

## Index + log

- **index.md** — content catalog: every page with link + one-line summary +
  metadata, organized by category. Read first on query. Works well to ~100 sources /
  hundreds of pages without embedding RAG.
- **log.md** — append-only chronological record (`## [2026-04-02] ingest | Title`),
  grep-parseable.

## Optional CLI tooling

A search engine over wiki pages as it grows. `qmd` (local markdown search, hybrid
BM25/vector + LLM rerank, CLI + MCP). Or a simpler home-grown script.

## Why it works

The tedious part of a knowledge base is the bookkeeping, not the reading/thinking.
Humans abandon wikis because maintenance grows faster than value. LLMs don't get
bored, touch 15 files in one pass, never forget a cross-reference. Maintenance cost
→ near zero. Spiritually: Vannevar Bush's Memex (1945) — curated, private, with
associative trails — but with the LLM solving the maintenance problem Bush couldn't.

## Tooling notes

Obsidian Web Clipper (web→markdown), local image download, graph view, Marp slides,
Dataview (frontmatter queries). The wiki is just a git repo of markdown → free
version history/branching/collaboration.
