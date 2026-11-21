# SolidDesignPrinciples Rule – Pseudocode

## Goal
Create a Cursor rule that codifies SOLID design principles for the Prometheus-AI codebase so that the assistant can reference and enforce these guidelines during future code generation.

## Steps
1. Determine metadata for rule file
   - description: short one-liner
   - globs: apply to all TypeScript/JavaScript source files in `src/`
   - alwaysApply: true so that the rule is always considered.
2. Transform the existing **SOLID-Rules** content from custom instructions into the required Cursor rule format:
   - Use Markdown list with **bold** section headers as required.
   - Embed sub-points under each principle.
   - Include example code blocks that demonstrate good vs bad patterns where useful.
3. Save rule file to `.cursor/rules/solid-design-principles.mdc`.
4. Verify formatting: metadata block at top separated by `---` lines; content follows after a blank line.
5. Commit file to repository.
