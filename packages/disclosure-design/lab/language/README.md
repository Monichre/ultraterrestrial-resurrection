---
title: Vocabulary discipline
description: Supporting rules for stable operational terms and source attribution inside the visual lab.
type: guide
created: 2026-08-16
author: agent
steward: Liam Ellis
tags: [language, vocabulary, provenance, prompts, skills]
---

# Vocabulary Discipline

This is supporting infrastructure for the visual lab. It keeps operational names, provenance
labels, serialized values, and borrowed framework terms stable. It does not decide what an
interface should look like. [`visual-language.json`](./visual-language.json) does that.

[`registry.json`](./registry.json) is canonical. [`../CONTEXT.md`](../CONTEXT.md) is its generated
human view. Prompts, skills, rules, and generated extraction prose consume the registry without
quietly inventing synonyms.

## Scope

The registry records:

- canonical project vocabulary;
- accepted aliases and forbidden drift;
- manifest and frontmatter machine values;
- attribution for adapted or external frameworks.

It does not own the repository's creative center. That belongs to the Visual Language System,
the Gold Extractions, the design-lab experiments, and the source documents that support them.

## Origin classes

- **Project**: canonical local vocabulary; no claim of exclusive coinage.
- **Adapted**: the vault has reformulated an external idea; the source remains attached.
- **External**: the source's language is retained and never presented as Liam's coinage.

## Repeatable lifecycle

1. Find a phrase that affects more than one prompt, skill, artifact, or agent decision.
2. Search the vault before naming it. If a canonical term already exists, use it.
3. Classify its origin as Project, Adapted, or External.
4. Add a tight definition, use condition, aliases, forbidden drift, evidence paths, and attribution.
5. Run `python3 scripts/language_registry.py all`.
6. Update the prompt or skill that consumes the term; do not duplicate its definition there.
7. Record the change once in `log.md`.

Verification commands:

```bash
python3 scripts/language_registry.py all
python3 -m unittest tests.test_language_registry
```

## Change rule

A recurring term does not become canonical merely because an agent used it three times. Repetition
creates a **candidate**. Canonical status requires an explicit registry entry and evidence. This
prevents temporary agent phrasing from becoming permanent vocabulary through repetition alone.
