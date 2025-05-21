# DisclosureRagRecovered Migration – Pseudocode

> **Note:** This file is now for historical reference only. All actionable migration pseudocode has been integrated into the individual migration tickets (47-51) and 00-Overview.md.

## 1. Introduce Disclosure Chat Modules

### Files:
- `disclosure_chat.py`
- `agno_disclosure_chat.py`
- `agno_disclosure_chat_with_files.py`

#### Pseudocode:
- For each chat module file:
  - Copy file to `apps/disclosure-rag/` (or appropriate subdir, e.g., `agents/` if more logical)
  - Review imports and dependencies; update paths if needed
  - Integrate with existing agent or chat orchestration if present
  - Add to `__init__.py` if required for module discovery
  - Write/adjust tests for new chat modules

## 2. Add Shell Script for Automation

### File:
- `main.sh`

#### Pseudocode:
- Copy `main.sh` to `apps/disclosure-rag/`
- Review script for hardcoded paths or environment assumptions
- Update script to match current directory structure and Python environment
- Add usage instructions to main project README if relevant

## 3. Migrate Documentation

### Files:
- `README_AGNO_CHAT.md`
- `README_DISCLOSURE_CHAT.md`

#### Pseudocode:
- Copy both markdown files to `apps/disclosure-rag/docs/` (create if missing) or root
- Update internal links or references to match new file locations
- Add references to these docs in main `README.md` if relevant

## 4. Migrate NER-to-Xata Prompt Script

### File:
- `research/ner_summary_to_xata_table_prompt.py.bak`

#### Pseudocode:
- Copy `.bak` file to `apps/disclosure-rag/research/`
- Review for relevance (is it a backup or the only copy?)
- If only copy, consider renaming to `.py` and integrating into research workflow
- Add/adjust tests or usage documentation as needed

## 5. (Optional) .venv and Log Files
- Do NOT migrate `.venv/`, `.DS_Store`, or log files like `xata_operations.log` (environment and system-specific)

---

# General Migration Steps
- For each file, ensure no name collisions or overwrites of newer code
- Run tests after migration to verify integration
- Update requirements.txt if new dependencies are introduced
- Document all changes in `DisclosureRagRecovered_Migration.md` 