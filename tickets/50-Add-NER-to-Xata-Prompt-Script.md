# 50-Add-NER-to-Xata-Prompt-Script

**Status:** ⏳ pending

## Title
Add NER-to-Xata Prompt Script (`ner_summary_to_xata_table_prompt.py.bak`)

## Description
Migrate the NER-to-Xata prompt script to `research/`. This script may be a backup or the only copy of a research utility.

## Acceptance Criteria
- `.bak` file is present in `research/`
- If it is the only copy, rename to `.py` and integrate into research workflow
- Usage is documented or referenced in research docs

## Implementation Notes
- Copy `.bak` file to `apps/disclosure-rag/research/`
- Review for relevance (is it a backup or the only copy?)
- If only copy, consider renaming to `.py` and integrating into research workflow
- Add/adjust tests or usage documentation as needed
- Review for duplication or obsolescence
- Reference: [ner_summary_to_xata_table_prompt.py.bak] in recovered

## Effort Estimate
1 point (low complexity)

## Testing Guidelines
- Manual run or dry-run of script
- Confirm output matches expectations
- Document all changes in the migration epic and overview

## References
- [apps/disclosure-rag/DisclosureRagRecovered_Migration.md]
- [tickets/DisclosureRagRecovered_Migration_PSEUDOCODE.md] 