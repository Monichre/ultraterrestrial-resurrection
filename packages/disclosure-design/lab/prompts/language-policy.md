---
title: Vocabulary and provenance policy
description: Supporting runtime rules for stable terms, machine values, and source attribution.
type: prompt
created: 2026-08-16
author: agent
steward: Liam Ellis
tags: [language, prompts, vocabulary, attribution]
---

# Vocabulary and Provenance Policy

Read [`../language/registry.json`](../language/registry.json) when a task changes extraction terms,
provenance, machine values, or imported framework language. For visual decisions, the primary
authority is [`../language/visual-language.json`](../language/visual-language.json).

## Order of authority

1. The Visual Language System governs Visual Lanes, priority surfaces, deeper reference families, composition, tokens, and design context.
2. The vocabulary registry governs operational names, provenance labels, and serialized values.
3. The Folderize Contract governs where artifacts live and which artifacts are required.
4. Task prompts govern how a specific artifact is produced.
5. References and external skills supply sourced methods.

If a lower layer conflicts with a higher one, stop the drift at the lower layer. Do not silently
invent a compromise term.

## Writing rules

- Use a registry term's canonical form in headings and first mention.
- Use aliases only when natural prose needs them and they are listed as accepted aliases.
- Use `machine_values` exactly in manifests, frontmatter, tags, and validation code.
- Never use a `do_not_use` phrase except while explaining or repairing the drift itself.
- Keep Project vocabulary consistent with its local definitions.
- Keep Adapted and External language attached to its registry attribution when explaining origin.
- Do not convert a source's branded concept into a Liam-authored term by paraphrasing it without attribution.
- Do not promote a one-off agent phrase into project vocabulary. Register it first.

## New-term test

A phrase belongs in the registry only when at least one is true:

- it changes how two or more artifacts are produced;
- it names a provenance, tier, state, or boundary that validators must recognize;
- it expresses a durable operational boundary;
- it adapts an external method that could otherwise be mistaken for Liam's own language.

Visual themes, aesthetic rules, surface families, deeper reference families, and interface composition belong in
`language/visual-language.json`, not this registry.

## Output disclosure

When an extraction uses a canonical project term, no attribution footnote is required on every
file. When a document teaches or explains an Adapted or External term, name its source. Provenance
is infrastructure: visible when it matters, never smeared over every sentence like legal confetti.
