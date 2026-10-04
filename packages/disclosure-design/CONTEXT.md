---
title: Visual Lab Vocabulary
description: Generated supporting glossary for operational terms, provenance labels, and source attribution.
type: glossary
created: 2026-08-16
author: agent
steward: Liam Ellis
tags: [language, glossary, provenance, generated]
generated_from: language/registry.json
---

# Visual Lab Vocabulary

This supporting glossary stabilizes operational vocabulary. Visual decisions live in
[`VISUAL_LANGUAGE.md`](./VISUAL_LANGUAGE.md). This file is generated from
[`language/registry.json`](./language/registry.json); edit the registry, not this file.

## Project Language

**Visual Lane**:
One of three tangible product surface families in Ultraterrestrial: Core Interface, Evidence Archive, or Tactical Spatial. A lane owns a kind of app surface and may contain intact components from another lane without becoming a new hybrid style.
_Use_: Selecting or describing the product surface family before retrieving narrower visual reference material.
_Accepted aliases_: visual surface, surface family, three visual lanes
_Avoid_: eight equal app-wide styles, picker-controlled visual lanes, epistemic lane

**Visual Language System**:
The canonical visual grammar, generated guide, surface-aware context compiler, and skill that carry research findings into prompts, tokens, components, and interfaces.
_Use_: Referring to the system that makes visual research repeatable and agent-loadable.
_Accepted aliases_: visual grammar
_Avoid_: Language Authority Layer

**Folderize Contract**:
The binding vault doctrine that gives every canonical still one extraction folder and makes that folder, not a flat catalog, the durable product.
_Use_: Referring to the complete image-placement and extraction-file contract.
_Accepted aliases_: folderize contract
_Avoid_: folder organization convention

**Extraction Folder**:
The single canonical home for one still and its observed, inferred, inherited, and optionally reconstructed artifacts under extractions/<slug>/.
_Use_: Referring to the per-still product unit.
_Accepted aliases_: folderized still
_Avoid_: image folder, asset folder

**Prompt Operating System**:
The prompt layer that governs how captured evidence becomes source descriptions, design analysis, tokens, generative prompts, and reconstruction decisions.
_Use_: Referring to prompts/ as the transformation logic of the vault.
_Accepted aliases_: prompts are the operating system
_Avoid_: prompt collection

**Reference Toolset**:
The sourced methods, validation rules, rename maps, and implementation skills used to operate on vault content but never cataloged as visual source material.
_Use_: Referring to references/ and implementation skills as instruments rather than content.
_Accepted aliases_: references are the toolset
_Avoid_: reference content library

**State of Truth**:
The machine-readable records that describe the vault's current file placement, tiers, duplicates, and missing-source state.
_Use_: Referring specifically to the folderize manifest and rebase report together.
_Accepted aliases_: state of truth
_Avoid_: single source of truth

**Gold Extraction**:
A cluster-representative extraction whose still was individually vision-read and whose full analysis is canonical for that cluster.
_Use_: Referring to the high-depth tier, not merely to something good or valuable.
_Accepted aliases_: gold, gold cluster rep
_Avoid_: gold file
_Serialized as_: `{"tier": "gold", "vision": "self"}`

**Batch Extraction**:
A non-representative extraction that retains its own pixel facts while explicitly inheriting cluster-level analysis from a Gold Extraction.
_Use_: Referring to the lower-depth tier with honest inheritance.
_Accepted aliases_: batch
_Avoid_: silver, non-gold
_Serialized as_: `{"tier": "batch", "vision": "cluster-inherited"}`

**Direct Vision**:
A provenance state meaning the still itself was inspected visually for the claims made in its extraction.
_Use_: Writing human-facing provenance language for individually inspected stills.
_Accepted aliases_: self
_Avoid_: vision-self, self vision, self-vision
_Serialized as_: `{"vision": "self"}`

**Cluster-Inherited Analysis**:
A provenance state meaning a still keeps its own observed pixel facts but borrows interpretive analysis from a named homogeneous-cluster representative.
_Use_: Writing human-facing provenance language for unread or non-representative stills.
_Accepted aliases_: cluster-inherited
_Avoid_: borrowed cluster analysis
_Serialized as_: `{"document_marker": "cluster-inherited", "vision": "cluster-inherited"}`

**Honesty Fields**:
The mandatory provenance, confidence, limitation, and abstention signals that separate observation from inference and inheritance in every extraction.
_Use_: Referring to the disclosure layer shared by all extraction artifacts.
_Accepted aliases_: honesty fields
_Avoid_: quality metadata

**Extraction Kind**:
The reconstruction classification that identifies a visual element as code, asset, or hybrid according to what must be rebuilt versus generated.
_Use_: Classifying whether an observed element implies component code, an image asset, or both.
_Accepted aliases_: kind decision
_Avoid_: code/asset category
_Serialized as_: `{"kind": ["code", "asset", "hybrid"]}`

## Adapted Language

**Six Analysis Layers**:
The ordered analysis path from visual identity through system, components, layout, reconstruction, and evidence-grounded brand rules.
_Use_: Referring to the complete analysis sequence before the Art Direction QA pass.
_Accepted aliases_: analysis layers
_Avoid_: five analysis layers, 5 analysis layers
_Source_: AnyDesign by uxKero (https://github.com/uxKero/anydesign)

**Token-First Assembly**:
The assembly rule that themeable values enter implementation through validated semantic tokens before components consume them.
_Use_: Connecting extracted design decisions to implementation.
_Accepted aliases_: token-first assembly
_Avoid_: tokenized build
_Source_: assembling-components by AI Design Components (references/assembling-components-skill.md)

**Motion as Composition**:
The judgment that motion should organize page rhythm and attention before it becomes interaction timing or decorative animation.
_Use_: Applying MotionViz to design analysis while keeping CSS motion rules in the assembly toolchain.
_Accepted aliases_: motion-as-composition
_Avoid_: motion cookbook
_Source_: MotionViz / MotionWiki-Playbook by adi0900 (https://github.com/adi0900/MotionWiki-Playbook)
