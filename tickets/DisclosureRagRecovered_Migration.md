# DisclosureRagRecovered Migration – Specification & Ticket Breakdown

> **Note:** This file is now for historical reference only. All actionable migration details and pseudocode have been integrated into the individual migration tickets (47-51) and 00-Overview.md.

## Overview
This document scopes and specifies the work required to migrate all unique files and functionality from `packages/docs/disclosure-rag-recovered` into `apps/disclosure-rag`. The goal is to ensure feature parity and preserve all relevant research, chat, and automation capabilities.

---

## Ticket 1: Introduce Disclosure Chat Modules

**Title:** Add Disclosure Chat Modules (`disclosure_chat.py`, `agno_disclosure_chat.py`, `agno_disclosure_chat_with_files.py`)

**Description:**
Migrate the three chat/assistant modules from `disclosure-rag-recovered` to `disclosure-rag`. These modules provide chat and assistant functionality not present in the current codebase.

**Acceptance Criteria:**
- All three files are present in the appropriate directory (root or `agents/`)
- Imports and dependencies are updated for the current project structure
- Modules are discoverable and importable
- Integration points with existing agents or chat orchestration are documented
- Basic tests or usage examples are provided

**Implementation Notes:**
- Review for any hardcoded paths or legacy dependencies
- Add to `__init__.py` if needed
- Reference: [disclosure_chat.py], [agno_disclosure_chat.py], [agno_disclosure_chat_with_files.py] in recovered

**Effort Estimate:** 2-3 points (moderate complexity)

**Testing Guidelines:**
- Unit test chat module initialization and basic chat flow
- Manual test integration with any agent orchestration

---

## Ticket 2: Add Shell Script for Automation

**Title:** Add and Integrate `main.sh` Automation Script

**Description:**
Migrate the `main.sh` shell script to the root of `disclosure-rag`. This script may automate setup, orchestration, or batch processing.

**Acceptance Criteria:**
- `main.sh` is present and executable in the project root
- Script is updated for current directory structure and Python environment
- Usage instructions are added to the main README if relevant

**Implementation Notes:**
- Review for hardcoded paths, Python version, or environment assumptions
- Reference: [main.sh] in recovered

**Effort Estimate:** 1 point (low complexity)

**Testing Guidelines:**
- Manual run of script in a clean environment
- Confirm expected outputs and side effects

---

## Ticket 3: Migrate Documentation

**Title:** Add Chat Module Documentation (`README_AGNO_CHAT.md`, `README_DISCLOSURE_CHAT.md`)

**Description:**
Migrate the two markdown documentation files to `docs/` or the project root. These provide usage and integration details for the chat modules.

**Acceptance Criteria:**
- Both markdown files are present in `docs/` or root
- Internal links and references are updated
- Main `README.md` references these docs if relevant

**Implementation Notes:**
- Create `docs/` if missing
- Reference: [README_AGNO_CHAT.md], [README_DISCLOSURE_CHAT.md] in recovered

**Effort Estimate:** 0.5 points (very low complexity)

**Testing Guidelines:**
- Manual review for clarity and accuracy

---

## Ticket 4: Migrate NER-to-Xata Prompt Script

**Title:** Add NER-to-Xata Prompt Script (`ner_summary_to_xata_table_prompt.py.bak`)

**Description:**
Migrate the NER-to-Xata prompt script to `research/`. This script may be a backup or the only copy of a research utility.

**Acceptance Criteria:**
- `.bak` file is present in `research/`
- If it is the only copy, rename to `.py` and integrate into research workflow
- Usage is documented or referenced in research docs

**Implementation Notes:**
- Review for duplication or obsolescence
- Reference: [ner_summary_to_xata_table_prompt.py.bak] in recovered

**Effort Estimate:** 1 point (low complexity)

**Testing Guidelines:**
- Manual run or dry-run of script
- Confirm output matches expectations

---

## Ticket 5: Exclude Environment and Log Files

**Title:** Exclude `.venv/`, `.DS_Store`, and Log Files

**Description:**
Do not migrate environment, system, or log files as they are not relevant to source control or reproducibility.

**Acceptance Criteria:**
- `.venv/`, `.DS_Store`, and `xata_operations.log` are NOT present in the migrated codebase

**Implementation Notes:**
- Add to `.gitignore` if not already present

**Effort Estimate:** 0.5 points (very low complexity)

**Testing Guidelines:**
- Confirm files are not present after migration

---

# References
- [disclosure-rag-recovered directory listing]
- [disclosure-rag directory listing]
- [DisclosureRagRecovered_Migration_PSEUDOCODE.md]

# General Notes
- After migration, run all tests and validate integration
- Update `requirements.txt` if new dependencies are introduced
- Document all changes in this file 