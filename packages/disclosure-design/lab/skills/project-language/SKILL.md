---
name: project-language
description: Maintain supporting operational vocabulary, provenance labels, aliases, machine values, and external attribution for the visual lab.
type: skill
created: 2026-08-16
author: agent
steward: Liam Ellis
tags: [language, vocabulary, provenance, prompts, validation]
---

# Project Language

Use this skill when changing extraction terminology, a prompt contract, tier or provenance labels,
serialized values, or the attribution of an external framework. Use `skills/visual-language/` for
visual themes, modes, token roles, composition, or interface design.

## Required inputs

Read these completely, in order:

1. `language/registry.json` — canonical terms, authority, aliases, machine values, evidence.
2. `prompts/language-policy.md` — runtime precedence and writing rules.
3. `CONTEXT.md` — human glossary; generated, never edited by hand.
4. The prompt, skill, rule, or artifact family affected by the requested change.

## Workflow

1. Search the registry and all usages before proposing a term.
2. Decide whether the term is Project, Adapted, or External.
3. Stress-test the boundary with one concrete misuse scenario. If the definition cannot reject the
   misuse, it is too vague.
4. Add or update exactly one registry entry. Include evidence paths. Adapted and External entries
   require a named source and local source note.
5. Preserve serialized compatibility. Human language may become clearer while `machine_values`
   remain stable.
6. Update consuming prompts and skills to reference the canonical term without restating its full
   definition.
7. Run `python3 scripts/language_registry.py all`.
8. Add one dated entry to `log.md` describing the semantic change and validation result.

## Hard rules

- `language/registry.json` is the only hand-edited term source.
- `CONTEXT.md` is generated from the registry. Never hand-edit it.
- Repetition creates a candidate, not canon.
- Visual themes and design rules belong in `language/visual-language.json`, not here.
- Project vocabulary defines local use without implying exclusive ownership.
- An Adapted or External entry without attribution fails validation.
- A renamed human term must not silently rewrite manifest values or historical extraction metadata.
- Historical logs are evidence, not current contracts; do not rewrite them to fake consistency.

## Done condition

The registry validates, the glossary matches the registry, forbidden drift is absent from governed
files, required bindings exist, manifest machine values are recognized, and the session is logged.
