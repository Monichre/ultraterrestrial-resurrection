# 47-Add-Disclosure-Chat-Modules

**Status:** ⏳ pending

## Title
Add Disclosure Chat Modules (`disclosure_chat.py`, `agno_disclosure_chat.py`, `agno_disclosure_chat_with_files.py`)

## Description
Migrate the three chat/assistant modules from `disclosure-rag-recovered` to `disclosure-rag`. These modules provide chat and assistant functionality not present in the current codebase.

## Acceptance Criteria
- All three files are present in the appropriate directory (root or `agents/`)
- Imports and dependencies are updated for the current project structure
- Modules are discoverable and importable
- Integration points with existing agents or chat orchestration are documented
- Basic tests or usage examples are provided

## Implementation Notes
- For each chat module file:
  - Copy file to `apps/disclosure-rag/` (or appropriate subdir, e.g., `agents/` if more logical)
  - Review imports and dependencies; update paths if needed
  - Integrate with existing agent or chat orchestration if present
  - Add to `__init__.py` if required for module discovery
  - Write/adjust tests for new chat modules
- Review for any hardcoded paths or legacy dependencies
- Reference: [disclosure_chat.py], [agno_disclosure_chat.py], [agno_disclosure_chat_with_files.py] in recovered

## Effort Estimate
2-3 points (moderate complexity)

## Testing Guidelines
- Unit test chat module initialization and basic chat flow
- Manual test integration with any agent orchestration
- Run tests after migration to verify integration
- Update requirements.txt if new dependencies are introduced
- Document all changes in the migration epic and overview

## References
- [apps/disclosure-rag/DisclosureRagRecovered_Migration.md]
- [tickets/DisclosureRagRecovered_Migration_PSEUDOCODE.md] 