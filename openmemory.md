# OpenMemory Guide — Ultraterrestrial Resurrection

**Last Updated:** 2026-07-19T06:05:00-05:00

## Overview

Monorepo UAP research platform: Next.js app (`apps/app`), disconnected Python RAG (`apps/disclosure-rag`), Neon Postgres + pgvector (`@db/postgres`), shared AI prompts (`packages/ai/prompts`).

## Architecture

- Live AI paths: disclosure mindmap agent (`/api/disclosure/mindmap`), Prometheus chat (`/api/prometheus/chat`).
- Prompt registry: `packages/ai/prompts/registry.yaml` → `sets/disclosure/*` + `templates/*`.
- Epistemics: Claim (source) ≠ Inference (agent) ≠ Evidence (source-derived). ADR-0001: never retrieve `agent_inferences` as Evidence.

## User Defined Namespaces

- [Leave blank - user populates]

## Components

- **Prompt corpus** — `packages/ai/prompts/`: YAML registry, disclosure NER/content analysis v2, RAG templates (`document_classification`, `rag_ingestion`, `rag_grounded_answer`, `validation`).
- **Methodology** — `packages/ai/prompts/methodology/`: research frameworks + `RAG_DOCUMENT_PROCESSING.md`, `NER_EXTRACTION_PROTOCOL.md`.
- **disclosure-rag pipeline** — `apps/disclosure-rag/processing/rag_prompt_pipeline.py` wired into `ContentAnalysisEngine`, `web_content_processor`, `knowledge_base_service`, `youtube.py`, `main.py`. Prompt loader resolves `packages/ai/prompts` (not legacy `packages/prompts`).
- **Writers Desk notes** — `apps/app/src/components/writers-desk/`: `NoteApp` (cream filing tabs), `NoteLetter` / `NoteWidget` (dark stacked sheets), `PaperSurface` + tiled stocks in `public/textures/paper/`. Routes: `/note`, `/research`. Theme tokens in `globals.css` `@theme` (`note-*`, `canvas*`, `ink*`, `shadow-sheet*`).
- **Vintage dossier docs** — `apps/app/src/components/design-system/research-ui/documents/`: `VintageDocumentCard`, `PersonnelFileCard`, `IncidentReportCard` refined with manila paper textures, clipped corner, bracketed stamps (`vintage-document.css`).
- **Home hero sequence** — Production `/` mounts `HomeAnimated` + `useUltraterrestrialAnimation` per `ANIMATION_SEQUENCE.md` (flashes→orbs→Prometheus/Earth/Moon→title/quote/nav). Do **not** replace with a shortened stars→Earth-only timeline. `CINEMATIC_TIMING` is the timing source of truth.

## Patterns

- Span-grounded NER with optional `span_quote` / `evidentiary_state`; KeyFigure maps to wire `PERSONNEL`.
- RAG chunk bodies are Evidence-only; grounded answers require passage citations and labeled Counter-readings.
- Ingestion writes `*_rag_pipeline.json` and exposes `embeddable_texts` for vector backends.
- Embeddings locked: `text-embedding-3-small` @ 1536 dims.
