# Data Architecture for the Ultraterrestrial App — THOUGHT EXPERIMENT

> **Provenance:** pasted by owner 2026-06-21 as a thought experiment for assessment.
> NOT a committed plan. Status: **under assessment** — value/relevance vs the existing
> codebase being evaluated by background agents. See session task "ASSESS-DATA-ARCH".
> Cross-check against: `packages/db/src/postgres/` (the live `@db/postgres` layer),
> the hybrid-search fix (`a5b789d`), and `apps/disclosure-rag/` (the disconnected Python RAG).

## Overview

The Ultraterrestrial app needs to combine three things: bulk document ingestion (PDFs, web pages, transcripts), semantic retrieval over those documents, and graph‑style traversal over entities, events, and claims (GraphRAG / knowledge graph). A practical, evolvable way to do this is to center everything on PostgreSQL + pgvector and layer a graph engine on top (either via schema + recursive CTEs or a dedicated graph DB like Memgraph), rather than splitting into many specialized datastores up front.[^1][^2]

## Core Architectural Principles

- Co‑locate raw content, metadata, and embeddings as much as possible to avoid cross‑store synchronization hell.[^1]
- Treat graph relationships as a first‑class citizen in the schema, not an afterthought attached to documents.[^2]
- Use Hybrid RAG: combine vector similarity, full‑text, and graph traversal into a single retrieval pipeline.[^3][^4]
- Keep ingestion and representation decoupled: document ingestion pipeline writes to the warehouse; retrieval and reasoning layers are read‑optimized on top.[^5]

## High‑Level Component Diagram

Conceptual components:

- Ingestion & ETL layer: crawlers, file watchers, and importers for PDFs, sites (e.g., Archives.gov UAP pages), YouTube transcripts, FOIA dumps.
- Processing workers: chunking, cleaning, NER, relation extraction, entity resolution, embeddings.
- Storage: Postgres (documents, embeddings, graph tables) plus optional Memgraph for high‑performance graph/GraphRAG.[^6][^7]
- Retrieval API: hybrid search (vector + full‑text + graph), exposed to your Next.js app and to agents via MCP.
- Reasoning & agents: LLM layer that performs GraphRAG over the knowledge graph, builds explanations, timelines, and hypothesis graphs.[^8]

## Storage Layer: Postgres as the Hub

PostgreSQL with pgvector can store embeddings, full‑text indices, and graph edges in a single data model. For Ultraterrestrial this becomes the operational warehouse:[^1]

- Document table: one row per source object (PDF, web page, transcript) with file metadata, source URL, dates, provenance, and trust scores.
- Chunk table: pre‑chunked spans of text (e.g., 512–1,024 tokens), each with an embedding (pgvector), chunk‑level metadata, and a foreign key to the parent document.[^9]
- Entity table: canonical entities (people, locations, organizations, craft types, cases, projects, hypotheses).
- Claim/evidence table: discrete claims extracted from text with links back to specific chunks and documents.
- Graph tables: `edges(entity_id_from, entity_id_to, relation_type, weight, provenance_claim_id, …)` to represent the knowledge graph inside Postgres.[^2]

This schema supports both semantic search (via pgvector) and graph traversal (via recursive CTEs or AGE/Apache AGE if you later want Cypher) without a separate DB at first.[^3][^2]

## Optional Graph Engine: Memgraph as Context Engine

If you want deeper GraphRAG and real‑time traversal at scale, mirror a subset of the Postgres graph into Memgraph 3.0, which now supports both graph and vector search.[^7]

- Memgraph becomes the "context engine" that selects the most relevant subgraph and supporting evidence for an LLM query.[^7]
- Vector search in Memgraph can score nodes or claims by semantic similarity, while graph algorithms (community detection, PageRank, shortest path) surface non‑obvious structures in UFO witness networks, organizational ties, or project evolution.[^6][^7]
- Memgraph's AI ecosystem (LangChain, LlamaIndex, MCP, etc.) plus GraphChat gives you a built‑in GraphRAG playground and NL‑to‑Cypher for debugging and exploration.[^10][^6]

## Ingestion and Processing Pipeline

An event‑driven ingestion pipeline keeps the warehouse up to date as new UFO/UAP materials land in your file system, S3 bucket, or bookmarks.[^11]

- Source connectors: watchers for local folders, RSS feeds, web crawlers, YouTube/Vimeo transcript fetchers.
- Normalization: convert to canonical text format (HTML → Markdown, PDF → text, transcript JSON → text with timestamps) and attach source metadata (who/when/where/publisher; classification level if applicable).[^12]
- Chunking & embeddings: chunk text into overlapping windows and embed using your chosen model; write to Postgres `chunks` with pgvector columns.[^9]
- IE/graph construction: run NER and relation extraction to find entities (astronauts, bases, sightings, craft types), claims ("X saw Y at time T"), and relationships; upsert into `entities`, `claims`, and `edges`.[^8]
- Sync to graph engine: periodically publish graph deltas to Memgraph (or keep only Postgres if staying single‑store).[^6]

## Hybrid Retrieval Pipeline (Graph + Vector + Full‑Text)

Inspired by hybrid RAG examples and RRF‑based pipelines, retrieval should fuse multiple signals before ranking results.[^4][^13][^3]

- Semantic signal: vector search over `chunks.embedding` via pgvector or Memgraph's vector search.
- Full‑text signal: Postgres `tsvector` with GIN + `ts_rank` to capture exact terms (flight numbers, document IDs, case codes).[^4][^3]
- Graph signal: overlap and shortest‑path scores between query‑relevant entities (e.g., specific astronauts, bases) and candidate claims/nodes.[^13]
- Temporal/heat signal: recency or "heat" based on how often a case/claim has been referenced or updated.[^3]

Use a fusion strategy such as Reciprocal Rank Fusion (RRF) or simple weighted sums to combine these signals into a unified ranking for the LLM context window.[^4][^3]

## GraphRAG for Ultraterrestrial

GraphRAG improves on naive chunk‑RAG by letting the LLM navigate the knowledge graph around selected seeds instead of reading arbitrary neighboring chunks.[^14][^8][^7]

- Seed selection: use semantic search to find seed nodes (claims/entities) strongly matching the query.
- Subgraph expansion: use BFS/DFS with constraints (hop limit, relation types, time windows) to construct a focused subgraph.
- Evidence assembly: collect the minimal set of chunks and documents covering the subgraph nodes/edges and feed them as context, preserving graph structure in serialized form (e.g., adjacency lists, typed edge labels).[^8][^7]
- Reasoning: prompt the LLM to reason "over the graph" (who connects to whom, what patterns repeat, where contradictions lie) instead of over disconnected paragraphs.

Memgraph 3.0 explicitly positions itself as a context engine for this kind of GraphRAG, already used by NASA for policy and knowledge retrieval.[^7]

## Deployment: Local‑First with Docker

For a local‑first, privacy‑preserving Ultraterrestrial stack, Docker Compose is a good baseline.[^15][^7]

- Services:
  - Postgres + pgvector + extensions (pgcrypto, etc.).
  - Optional Memgraph + Memgraph Lab for visual graph work.[^15][^6]
  - Embedding/LLM workers (Ollama, vLLM, or remote APIs).
  - Ingestion workers (FastAPI or Node/TS services for ETL & IE).
  - Ultraterrestrial API (FastAPI/Node) + Next.js frontend.
- Memgraph's GenAI stack demo already shows a Docker Compose setup with FastAPI, Memgraph, and LLMs, which you can adapt for Ultraterrestrial.[^10][^15]

## Why This Fits the UFO / Ultraterrestrial Domain

- Heterogeneous data: government PDFs, contactee books, podcasts, TV interviews, leaked docs, Twitter threads — all become normalized chunks plus entities/claims, handled uniformly.[^9][^8]
- Dense relationship structure: sightings connect to places, bases, contractors, projects, mythologies, religions; a graph database captures this better than flat tables alone.[^16][^8]
- Need for explainability: graph‑anchored answers allow the app to show "why" it believes a statement by walking the user through nodes, edges, and original documents.[^8][^7]
- Scalability: you can start with Postgres‑only (documents + vectors + graph tables) and only introduce Memgraph when graph workloads justify it.[^2][^1][^7]

## Next Steps and Enhancements

- Start with Postgres + pgvector + an ingestion worker, and define `documents`, `chunks`, `entities`, `claims`, and `edges` schemas following personal‑knowledge‑graph patterns.[^1][^2]
- Add full‑text (`tsvector`) and hybrid ranking (RRF) queries to fuse semantic, keyword, and graph signals.[^3][^4]
- Prototype GraphRAG using Postgres recursive CTEs; once patterns settle, optionally mirror to Memgraph 3.0 for performance and better graph tooling.[^13][^7]
- Integrate with MCP so agents can traverse the graph and retrieval stack as tools (e.g., `get_related_entities`, `get_evidence_for_claim`).[^6]
- Layer on visualization (graph views of cases, timelines, ego‑nets) once the schema and pipelines stabilize.

---

## References

1. [Postgres is all you need, even for vectors](https://www.reddit.com/r/SaaS/comments/1do5kg2/postgres_is_all_you_need_even_for_vectors/)
2. [Building a personal knowledge graph with just PostgreSQL](https://dev.to/micelclaw/4o-building-a-personal-knowledge-graph-with-just-postgresql-no-neo4j-needed-22b2)
3. [Hybrid search with RRF: combining pgvector, tsvector, and a knowledge graph in one query](https://dev.to/micelclaw/hybrid-search-with-rrf-combining-pgvector-tsvector-and-a-knowledge-graph-in-one-query-1d80)
4. [combining pgvector, tsvector, and a knowledge graph in one query](https://micelclaw.com/blog/hybrid-search-rrf/)
5. [Beyond Simple Retrieval: A Hybrid Graph-Vector RAG System](https://medium.com/thedeephub/beyond-simple-retrieval-a-hybrid-graph-vector-rag-system-for-enhanced-language-model-understanding-714e84191ad7)
6. [Memgraph's AI ecosystem](https://memgraph.com/docs/ai-ecosystem)
7. [Memgraph 3.0 Is Out: Solve the LLM Context Problem](https://memgraph.com/blog/memgraph-3-graph-database-llm-context-problem)
8. [How to Implement Graph RAG Using Knowledge Graphs and Vector Databases](https://medium.com/data-science/how-to-implement-graph-rag-using-knowledge-graphs-and-vector-databases-60bb69a22759)
9. [Integrating Vector and Graph Databases](https://memgraph.com/blog/integrating-vector-and-graph-databases-gen-ai-llms)
10. [Building GenAI Applications with Memgraph](https://memgraph.com/blog/building-gen-ai-applications-with-memgraph-gpt-llama)
11. [Continuously ingest documents into a vector store](https://quix.io/blog/continuously-ingest-documents-into-a-vector-store-using-quix-qdrant-and-apache-kafka)
12. [Data Vectorization and Ingestion](https://securiti.ai/gencore/sync-unstructured-data-to-vector-dbs/)
13. [Hybrid Graph RAG: Harnessing Graph and Vector Databases](https://pub.towardsai.net/hybrid-graph-rag-harnessing-graph-and-vector-for-financial-analysis-72c3a9f1a09d)
14. [HybridRAG and Why Combine Vector Embeddings with Graphs](https://memgraph.com/blog/why-hybridrag)
15. [genai-stack/README.md · memgraph/genai-stack](https://github.com/memgraph/genai-stack/blob/main/README.md)
16. [Graph Database in AI and RAG implementations](https://www.altexsoft.com/blog/graph-database/)
