---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
alwaysApply: false
---

---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
alwaysApply: false
---
## PROJECT DOCUMENTATION & CONTEXT SYSTEM

All project documentation, including coding standards, workflow guidelines, and API specifications, will be stored in Markdown (.md) files. These files should be concise and easily understandable. File naming should follow the convention `XX-title.md` where `XX` is the sequence order (e.g., `01-UFO-Visualization.md`).

### .md Files

`.md` files (Markdown Context Documents) will be used to store API specifications, data schemas, and other crucial context information. These files will be referenced in other documentation and code comments. Examples include `sightings-data.md`, `timeline-visualization.md`, and `knowledge-base-integration.md`.

### Ticket Tracking

Tickets will be managed using Markdown files in the `tickets` directory. Each ticket will follow a consistent template outlining its goal, acceptance criteria, implementation notes, out-of-scope items, and test strategy. The status of each ticket will be indicated using the following keys: ✅ done, ⏳ pending, 🛑 blocked. The `tickets/README.md` file will contain an overview of the ticket system and naming conventions. The AI assistant should review `README.md` before starting work on a ticket. New utility functions should have accompanying test files created in a `__tests__` subdirectory within the relevant module directory.  A new `DisclosureRagRecovered_Migration.md` file will document the migration of code from `disclosure-rag-recovered` to `disclosure-rag`.  This will include a detailed specification of each ticket, including title, description, acceptance criteria, implementation notes, references, effort estimation, and testing guidelines.  All tickets related to the migration of the `disclosure-rag-recovered` package should be created in the `tickets` directory, following the guidelines specified in `ticket-workflow.md`.  The following files were identified for migration from `disclosure-rag-recovered` to `disclosure-rag`: `disclosure_chat.py`, `agno_disclosure_chat.py`, `agno_disclosure_chat_with_files.py`, `main.sh`, `README_AGNO_CHAT.md`, `README_DISCLOSURE_CHAT.md`, and `research/ner_summary_to_xata_table_prompt.py.bak`.  These migration tasks should be documented as separate tickets within the `tickets` directory, following the template specified in `ticket-workflow.md`.  All migration planning, specifications, and pseudocode should be tracked in the `tickets/` directory.  All migration tickets should be created in the `tickets/` directory and follow the `ticket-workflow.md` guidelines.


## TECH STACK

This project utilizes Next.js, React, and TypeScript for frontend development. The backend utilizes a combination of serverless functions and AI services. Specific libraries include Three.js, react-three-fiber, GSAP for animations, Tailwind CSS for styling, shadcn UI components, and various AI integration libraries (OpenAI, Anthropic, Mem0). The project also utilizes knowledge base tools for data retrieval and processing, as well as 3D visualization libraries for UFO and space-related visualizations.  Python libraries used in the `disclosure-rag` package include: `zstandard`, `zipp`, `yt_dlp`, `youtube_transcript_api`, `yarl`, `yaml`, `wrapt`, `websockets`, `websocket_client`, `wcwidth`, `wcmatch`, `watchfiles`, `uvloop`, `uvicorn`, `uv`, `urllib3`, `uncertainties`, `tzdata`, `typing_inspect`, `typing_extensions`, `types_requests`, `typer`, `traitlets`, `tqdm`, `tornado`, `tomli_w`, `tomli`, `toml`, `tokenizers`, `tiktoken_ext`, `tiktoken`, `tenacity`, `tabulate`, `sympy`, `streamlit_react_flow`, `streamlit_molstar`, `streamlit_file_browser`, `streamlit_embeded`, `streamlit_antd`, `streamlit_ace`, `streamlit`, `starlette`, `stack_data`, `sqlalchemy`, `spglib`, `soupsieve`, `sniffio`, `smmap`, `six`, `shellingham`, `sentry_sdk`.


## CODING STANDARDS

* Code should be well-documented and follow consistent formatting.
* All code must adhere to TypeScript type safety.
* Use named exports for functions, avoiding default exports.
* Error handling should be robust and informative. Custom error types should be used where appropriate.
* Unit tests should aim for high coverage.
* All callback functions should utilize `useCallback` to prevent unnecessary re-renders.
* When using Next.js App Router, ensure that components using React hooks are marked with the `"use client"` directive to prevent errors in server components.
* Split pages into server and client components as needed to accommodate hook usage.
* Follow functional programming patterns rather than class-based implementations.
* Use PascalCase for component files and lowercase with dashes for directories.


## WORKFLOW & RELEASE RULES

The development workflow follows a feature-based system. Features are organized in the `features` directory with clear separation of concerns. Pull requests are required for all code changes, and code reviews are mandatory before merging. All changes must be documented. New features should be documented with clear acceptance criteria and implementation details. The AI assistant should review relevant README files before starting work on a feature. 

### Server Actions and Functions Preference

* **Always prioritize Next.js Server Actions over API routes** for data mutations, form handling, and server-side operations.
* Server Components should be used whenever possible to reduce client-side JavaScript.
* Use Server Functions (defined in server components) for data fetching operations that don't require client-side interactivity.
* Only create API routes when external services need webhook endpoints or when third-party integrations require REST API access.
* Internal application logic should leverage Server Actions for better performance, reduced bundle size, and improved security.


## DEBUGGING

When debugging, utilize the browser's developer tools extensively. Leverage logging statements and breakpoints effectively. For complex issues, consider using a debugger. Address type mismatches between data passed to components and component expectations. Carefully review API responses and component data structures to ensure compatibility. When encountering issues with 3D visualizations, check both the component logic and the asset loading. Pay close attention to Next.js App Router component contexts ("use client" directive) to avoid errors related to React hook usage in server components.


## API INTEGRATION RULES

The application integrates with various AI and data services including OpenAI, Anthropic, Mem0, and others. All interactions with these APIs should be carefully documented and tested. Error handling must be implemented to gracefully manage API failures. The `.md` files will serve as the central repository for API specifications and schemas.

### Server Actions vs API Routes

* **Server Actions are the preferred method** for all AI interactions, data processing, and external API integrations.
* Server Actions provide better type safety, reduced client-server boundary complexity, and improved performance over traditional API routes.
* When implementing new features that require server communication:
  * ✅ DO: Create a Server Action in the relevant feature directory with the `.server.ts` suffix
  * ❌ DON'T: Create a new API route unless absolutely required for external access
* Only use API routes (`apps/app/src/app/api` directory) when:
  * External services need webhook endpoints
  * Public API access is required
  * Third-party integrations specifically require REST endpoints
* For streaming operations (like AI completions), use Server Actions with streaming responses.
* All Server Actions should implement proper error handling and validation.

The knowledge base should be properly indexed and referenced in AI features.


## UI DEVELOPMENT GUIDELINES

UI development should adhere to the established component patterns in the `components` directory. The project uses a combination of Tailwind CSS and custom components for styling. All UI elements must be accessible and follow consistent design patterns. The application features various animated and interactive components, particularly for timelines, 3D visualizations, and data exploration. New components should follow the established directory structure and naming conventions. Use the appropriate component categories (animated, backgrounds, ui, etc.) when adding new components.

## PYTHON PACKAGE INTEGRATION

The project includes a Python package (`disclosure-rag`).  A separate, recovered version (`disclosure-rag-recovered`) exists.  All files and functionality present in `disclosure-rag-recovered` but missing from `disclosure-rag` must be integrated into the main project.  This includes files within the `research`, `processing`, `lib`, and `agents` directories, as well as any additional Python libraries or modules identified during the comparison.  This integration should be tracked as a new feature with appropriate documentation and testing.  The following files and functionalities from `disclosure-rag-recovered` need to be integrated into `disclosure-rag`: `disclosure_chat.py`, `agno_disclosure_chat.py`, `agno_disclosure_chat_with_files.py`, `main.sh`, `README_AGNO_CHAT.md`, `README_DISCLOSURE_CHAT.md`, and `research/ner_summary_to_xata_table_prompt.py.bak`.  A new feature will track this migration, documented in `DisclosureRagRecovered_Migration.md`. All tickets for this migration will be created and managed within the `tickets` directory, following the guidelines in `ticket-workflow.md`.  All tickets related to the migration should be created in the `tickets` directory.  The `.md` files detailing the pseudocode and migration specification should also be added to the tickets directory. All migration tickets should be created in the `tickets/` directory and follow the `ticket-workflow.md` guidelines.