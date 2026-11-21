---
name: worklog
description: Generate a structured work log entry for the current session in this repo. Use when the user types /worklog or asks for a work log, session log, or session summary to be written to docs/work_logs/.
---

# Work Log

Produce a comprehensive work log for the current session.

## 1. ANALYZE recent work to determine

- **Primary focus area** — one of: `frontend-ui`, `backend-api`, `database`, `testing`, `docs`, `deployment`, `research`, `bugfix`, `feature`, `refactor`, `integration`, `security`
- **Files** modified / created / deleted
- **Time spent** (estimate if needed)
- **Key accomplishments**

## 2. GENERATE a session ID

Format: `[focus-area]-[YYYYMMDD]-[HHMMSS]`

## 3. AUTO-POPULATE the header with

- Current date and time (exact)
- Generated session ID
- Detected focus area
- Your agent identifier
- Current branch and context

## 4. WRITE the log

Follow the established work-log template structure used in `docs/work_logs/`. Read a recent entry first to match its shape.

## 5. ENSURE every section is filled

Specific and actionable — no placeholder text, no "N/A" where real content belongs.

## Related conventions

- Documentation standards (timestamping, files-touched reporting) live in the root `AGENTS.md`.
- Which planning tier to update alongside the log is defined in `AGENTS.md`.
