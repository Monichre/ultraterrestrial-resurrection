## AUDIT PHASE PROGRESS (Apr 27, 2025)

### Pipelines Inventory

- agent-execution-pipeline
- document-processing-pipeline
- web-processing-pipeline

### Patterns Observed

- **UI:** `.tsx` components manage views, input, output, state.
- **Business Logic:**
  - In `helpers/` for document pipeline (analyze, vectorize, extract).
  - In some cases, async calls/side effects/state in UI components.
  - Agent & web pipelines: as actions, less extracted logic.
- **Coupling:**
  - Direct use of business logic in UI (async, state, calls).
  - Document pipeline better decoupled, but not universal.
  - No single shared hook/service pattern/approach.
  - No use of context providers for cross-component shared state.

### Immediate Follow-Ups

- [ ] List files per pattern for more granular checklist
- [ ] Identify candidate business logic to extract into services/hooks
- [ ] Map all direct API/store/service invocations in UI

---

### Content to be placed in INTELLIGENT_UI_BUSINESS_LOGIC_STATUS.md

# INTELLIGENT UI & BUSINESS LOGIC SYNC STATUS

## Path: /Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/src/features/ai/pipelines

### Last Updated: April 27, 2025

---

## Implementation Plan: Intelligent Combination of UI & Business Logic in Pipelines

### 1. Audit and Analyze Current Patterns

- Inventory all current pipelines/components
- Identify UI-business logic connection points
- Document coupling (tight/loose, direct/indirect)
- Categorize repeated or reusable patterns

### 2. Define Separation of Concerns

- Move all pure business logic to pipeline/service modules
- Ensure business logic is testable and UI-agnostic
- UI components should only consume state/data via hooks, context, or props

### 3. Create a Shared Interface/Contract

- Use context/store/hooks for stateful/shared pipeline logic
- Define TS types/interfaces for communication between UI and logic

### 4. Refactor: Decouple & Recompose

- Refactor core logic into pure service modules or hooks
- UI becomes a consumer of these hooks/services only
- Remove direct store/API manipulations in UI

### 5. Higher-level Orchestration

- Compose with controller patterns or nested context/hooks as needed

### 6. Consistency and Documentation

- Document refactor/architecture with diagrams and usage examples
- Write clear guide for new features to follow the same pattern

### 7. Testing & Verification

- Unit test all business logic separate from UI
- Integration test pipelines end-to-end (mock UI I/O only)
- Create Storybook/component tests for UI

---

## Example Architecture

/pipelines/
  aiPipelineService.ts   <-- business logic
  useAIPipeline.ts       <-- business logic hook (calls service)
  AIPipelineView.tsx     <-- UI component
  PipelineContext.tsx    <-- Context provider for pipeline state

---

## Status Tracker

- [ ] AUDIT & ANALYSIS START
- [ ] SEPARATION OF CONCERNS IMPLEMENTED
- [ ] SHARED INTERFACE DEFINED (HOOKS/CONTEXT/TYPES)
- [ ] REFACTOR COMPLETE
- [ ] HL ORCHESTRATION/CONTROLLER LOGIC
- [ ] DOCS/INSTRUCTIONS UPDATED
- [ ] NEW UNIT/INTEGRATION TESTS PASS

---

## AUDIT PHASE PROGRESS (Apr 27, 2025)

### Pipelines Inventory

- agent-execution-pipeline
- document-processing-pipeline
- web-processing-pipeline

### Patterns Observed

- **UI:** `.tsx` components manage views, input, output, state.
- **Business Logic:**
  - In `helpers/` for document pipeline (analyze, vectorize, extract).
  - In some cases, async calls/side effects/state in UI components.
  - Agent & web pipelines: as actions, less extracted logic.
- **Coupling:**
  - Direct use of business logic in UI (async, state, calls).
  - Document pipeline better decoupled, but not universal.
  - No single shared hook/service pattern/approach.
  - No use of context providers for cross-component shared state.

### Immediate Follow-Ups

- [ ] List files per pattern for more granular checklist
- [ ] Identify candidate business logic to extract into services/hooks
- [ ] Map all direct API/store/service invocations in UI

---

## AUDIT DETAIL: web-processing-pipeline & document-processing-pipeline

### web-processing-pipeline

- UI Components: WebProcessingPipeline.tsx, ContentAnalysis.tsx, WebResourceUrlInput.tsx, LoadingSkeleton.tsx
- Business logic embedded in: WebProcessingPipeline.tsx (e.g. scrapeAndSummarizeWithFirecrawl)
- Documentation: WebExtractionRefactor.md, WebExtractionRefactor_PSEUDOCODE.md
- **Candidates for Extraction:**
  - Move scrapeAndSummarizeWithFirecrawl and related data logic to a hook/service.
  - Extract state+side effect logic into useWebProcessingPipeline hook.

### document-processing-pipeline

- UI Components: DocumentProcessingPipeline.tsx, Document.tsx, DocumentCard.tsx, DocumentsList.tsx, DocumentSearch.tsx, DocumentStatus.tsx, UploadZone.tsx, AiInsights.tsx
- Business logic helpers: helpers/analyze.ts, helpers/vectorize.ts, helpers/extract.ts (already decoupled)
- State/side effects in UI: UploadZone.tsx, DocumentsList.tsx
- **Candidates for Extraction:**
  - Move async workflow logic from UploadZone, DocumentsList etc. to useDocumentProcessingPipeline hook.
  - Standardize fetch/call patterns in hooks or a service layer.

#### Next Steps

- [ ] Begin extraction of business logic to hooks/services (starting with web pipeline)
- [ ] Propose interface for new unified state/logic hooks
- [ ] Continue pattern audit for business logic in component tree

---

# 🚦 Wiring Guide: Storage, RAG, Vector, and Knowledge Integration

---

## 1. Data Abstraction for Supabase and Xata

### File: /lib/data/data-storage.ts

#### a. Setup SDKs

- **Supabase:**
  - Add the JS client in your project if not already.

      ```
      import { createClient } from '@supabase/supabase-js';
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      ```

  - Replace `getSupabaseClient()`'s stub with your actual instance.
- **Xata:**
  - Install Xata SDK & initialize with `.env` or config.

      ```
      import { getXataClient } from '@xata.io/client';
      const xata = getXataClient();
      ```

  - Wire into all Xata stubs (see comments in `data-storage.ts` for placement).

#### b. Implement CRUD Functions

- Complete the `saveKnowledgeDoc`, `getKnowledgeDoc`, `listKnowledgeDocs`, `deleteKnowledgeDoc` functions for both backends.
- Return results in a normalized `KnowledgeDoc` shape for consistency.

#### c. Switching Logic

- Use `process.env.NEXT_PUBLIC_DATA_STORAGE` to toggle between Xata/Supabase (or enhance logic for hybrid/migration).

---

## 2. R2R (RAG) Integration

### File: /lib/r2r/r2r-client.ts

#### a. Set ENV

- Add your API keys:

  ```
  R2R_API_URL=https://api.r2r.sciphi.ai/v1
  R2R_API_KEY=sk-...
  ```

- Optionally expose via `process.env` or secrets manager.

#### b. Use Helper

- All "RAG" document ingest & search goes through:
  - `r2rIngestDocument(...)`
  - `r2rSearch(...)`
  - `r2rGetDocument(...)`
- Plug into relevant pipeline UI for advanced search/context.

---

## 3. OpenAI Vector Storage Integration

### File: /lib/knowledge/index-knowledge.ts

#### a. Add OpenAI API Helper

- Create a function (or use an SDK) to list documents/vectors, for example:

  ```
  async function getVectorDocs() {
    // Call OpenAI vector storage listing with credentials
  }
  ```

- In `listAllKnowledgeFiles()`, un-comment and plug in this helper to add vector docs to results.

#### b. File Content Loading

- For vector docs, provide snippet/metadata preview.
- For local PDFs/transcripts, `fs`-read is already scaffolded (update as needed for production, serverless, or remote files).

---

## 4. Unified Knowledge Picker/Viewer

### File: /FileKnowledgePicker.tsx

- This is already ready to use. Pass `onSelect` to get the selected file and its content.
- To extend: add upload, drag/drop, metadata preview, or file versioning as desired.

---

## 5. Combined Dashboard UI

### File: /CombinedPipelinesUI.tsx

- Import and use in your top-level dashboard/app shell:

  ```
  import { CombinedPipelinesUI } from "./features/ai/pipelines/CombinedPipelinesUI";
  // ...
  <CombinedPipelinesUI />
  ```

- Tabs let you access each pipeline/component independently, while the new API/knowledge layers power all relevant actions.

---

## 6. (Optional) Further Integration

- **Pass knowledge IDs/content between pipelines** (e.g., pass a doc from knowledge picker to the web or document processing workflows)
- **Combine context:**
  - Use the R2R client for pre- or post-processing pipeline context (e.g. before query to LLM).

---

# 🚀 Final Checklist

- [ ] Replace backend stub logic with real Supabase/Xata client calls and credential management.
- [ ] Plug OpenAI vector store into the list/load helpers.
- [ ] Ensure your `.env` is correct and set for every endpoint.
- [ ] Use the CombinedPipelinesUI as your orchestration dashboard; original pipelines remain decoupled.

---

1. **Wrap all document/web/data logic with BOTH Xata and Supabase support**
2. **Integrate R2R ("Read, Retrieve, Route") functionality for your upcoming RAG**
3. **Unify files & UI for OpenAI Vector Storage and local PDFs/transcripts** from `/packages/knowledge-base`.

---

## 1. Dual Storage Layer: Xata + Supabase

Goal: All reads/writes for docs/web/data should be routed through an abstraction that supports both Xata (<https://xata.io/>) and Supabase (toggle or fallback, or both if needed).

Implementation:

- Build a storage abstraction in `lib/data/` (e.g., `dataStorage.ts`)
  - Exports CRUD and query methods.
  - Internally delegates to Xata or Supabase (configurable via env, request, or feature flag)
- Inject this into all helpers, actions, and hooks for document/web processing.

---

## 2. R2R Functionality (for RAG)

- Study/implement [SciPhi R2R docs](https://r2r-docs.sciphi.ai/documentation/documents).
- Integrate R2R "document" and "search" API features behind a helper/client, e.g., `/lib/r2r/r2rClient.ts`
- For any document/Web/knowledge lookup, optionally call out to R2R for advanced search, ingestion, or context enrichment (composable with your current storage).

---

## 3. Unified File & Vector UI/Backend Layer

- Build a file ingestion layer which:
  - Can index/retrieve from: OpenAI Vector Storage, PDFs/transcripts in `/packages/knowledge-base`, and Xata/Supabase.
  - Normalizes metadata and document content access for UI.
- Expose file selection/upload/search via a new or enhanced React UI component.
- Plug it into pipelines for RAG, search, and processing flows.

---

## File/Folder references

- **Knowledge base PDFs/transcripts:** `/packages/knowledge-base`
- **OpenAI vector store API**: wrap with a local helper, have it serialize/normalize metadata for use everywhere
- **UI files:** update or create shared files browser/uploader, possibly in `/components` or `/features/ai/components`.

---

## Next Steps

- [ ]  Set up initial dual storage abstraction + interface
- [ ]  Scaffold R2R API integration helpers + config
- [ ]  Design new or extended `FilePicker`/knowledge selector UI for both local and OpenAI vector sources

---

## Questions for Clarification

- Should dual storage always use both Xata and Supabase (double-write), or should this be config-driven (use one as primary, other as backup or toggle for migration)?
- Is file indexing from `/packages/knowledge-base` a one-time migration, or will it watch this folder for new data over time?
- Should R2R results and local knowledge be merged/blended in the UI, or only one source at a time?

---

# 🚦 Wiring Guide: Storage, RAG, Vector, and Knowledge Integration

---

## 1. Data Abstraction for Supabase and Xata

### File: /lib/data/data-storage.ts

#### a. Setup SDKs

- **Supabase:**
  - Add the JS client in your project if not already.

    ```
    import { createClient } from '@supabase/supabase-js';
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    ```

  - Replace `getSupabaseClient()`'s stub with your actual instance.
- **Xata:**
  - Install Xata SDK & initialize with `.env` or config.

    ```
    import { getXataClient } from '@xata.io/client';
    const xata = getXataClient();
    ```

  - Wire into all Xata stubs (see comments in `data-storage.ts` for placement).

#### b. Implement CRUD Functions

- Complete the `saveKnowledgeDoc`, `getKnowledgeDoc`, `listKnowledgeDocs`, `deleteKnowledgeDoc` functions for both backends.
- Return results in a normalized `KnowledgeDoc` shape for consistency.

#### c. Switching Logic

- Use `process.env.NEXT_PUBLIC_DATA_STORAGE` to toggle between Xata/Supabase (or enhance logic for hybrid/migration).

---

## 2. R2R (RAG) Integration

### File: /lib/r2r/r2r-client.ts

#### a. Set ENV

- Add your API keys:
