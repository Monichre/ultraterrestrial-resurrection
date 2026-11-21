# Index

The navigation hub for this knowledge base. It is purpose-built for an agent running **assembling-components**.

Start with [welcome](./welcome.md) or jump to the [assembling-components hub](./concepts/assembling-components-hub.md). Visual SoT: [image catalog](./notes/midjourney-image-catalog.md).

## Visual language

- [Visual language guide](./VISUAL_LANGUAGE.md) — Three Visual Lanes, four priority app surfaces, deeper reference families, tokens, source evidence, and agent contract
- [Visual language grammar](./language/visual-language.json) — canonical machine-readable visual system
- [Visual-language skill](./skills/visual-language/SKILL.md) — mandatory preflight for new prompts, components, pages, and interfaces
- [Vocabulary registry](./language/registry.json) — supporting operational terms, machine values, aliases, and attribution
- [Project glossary](./CONTEXT.md) — generated human view of the supporting registry

## Visual source of truth

- [AGENTS.md](./AGENTS.md) — **the folderize contract; `prompts/` is mandatory before any extraction**
- [extractions/](./extractions/) — one folder per still: image + `source.md` + `design-tokens.md` (+ full set for gold reps)
- [Folderize manifest](./notes/folderize-manifest.json) — paths, tiers, dupes, missing
- [Midjourney / design-lab image catalog](./notes/midjourney-image-catalog.md) — hub, cluster takes, embeds
- [All stills — pixel catalog](./notes/stills-full-catalog.md) — every still + Pillow hex
- [FolderizeStills PSUEDOCODE](./FolderizeStills_PSUEDOCODE.md) — the pipeline plan
- [AssemblingComponentsAllStills](./3d-space-canvas-references/AssemblingComponentsAllStills.md) — architecture of the 471 pass (lives inside `3d-space-canvas-references/`)

## Assembling-components

- [Assembling Components Hub](./concepts/assembling-components-hub.md) — how AnyDesign + MotionViz + the skill fit together
- [Agent runbook](./notes/assembling-agent-runbook.md) — ordered steps
- [Production checklist](./references/assembling-production-checklist.md) — delivery gates
- [Research PSUEDOCODE](./AssemblingComponentsResearch_PSUEDOCODE.md)
- [Research architecture](./AssemblingComponentsResearch.md)
- Apply phase (app repo): `ultraterrestrial-resurrection/docs/plans/AssemblingComponentsApply.md`

## Concepts

Durable ideas (`type: concept`):

- [Token-first assembly](./concepts/token-first-assembly.md)
- [Skill chain](./concepts/skill-chain.md)
- [Barrel exports](./concepts/barrel-exports.md)
- [Root providers](./concepts/root-providers.md)
- [Framework selection](./concepts/framework-selection.md)
- [Reduced motion](./concepts/reduced-motion.md)
- [Validation gates](./concepts/validation-gates.md)
- [AnyDesign assembly bridge](./concepts/anydesign-assembly-bridge.md)
- [MotionViz assembly bridge](./concepts/motionviz-assembly-bridge.md)

## References

Sourced notes (`type: reference`):

- [assembling-components skill](./references/assembling-components-skill.md)
- [Token validation rules](./references/token-validation-rules.md)
- [AnyDesign repo](./references/anydesign-repo.md)
- [AnyDesign uploaded artifact](./references/anydesign-artifact.md)
- [AnyDesign token rename map](./references/anydesign-token-rename-map.md)
- [MotionWiki-Playbook](./references/motionwiki-playbook.md)

## Sections

- [concepts](./concepts/assembling-components-hub.md) — durable ideas
- [references](./references/assembling-components-skill.md) — citations
- [notes](./notes/assembling-agent-runbook.md) — runbooks

Every document outside this file and `log.md` carries a non-empty `type` in its frontmatter — that is all OKF requires.
