---
title: MotionWiki-Playbook
description: adi0900/MotionWiki-Playbook — MotionViz identity and web-experience instruction layers, not a CSS motion cookbook.
type: reference
created: 2026-08-13
author: agent
tags: [reference, motionwiki-playbook, motionviz, assembling-components]
source_repo: motionwiki-playbook
source_url: https://github.com/adi0900/MotionWiki-Playbook
source_path: README.md
captured_at: 2026-08-13
skill_chain_stage: layouts
framework: any
motion: composition-rhythm
---

# MotionWiki-Playbook

## Summary

Repo: [adi0900/MotionWiki-Playbook](https://github.com/adi0900/MotionWiki-Playbook). README title is **MotionViz**. Scope is deliberately small: visual identity + product-site composition. `npx skills add` docs still point at `https://github.com/adi0900/MV---Design.git`. Design-MV states it does **not** generate frontend code.

## Key points

Core files:

| Path | Role |
| --- | --- |
| `visual-identity/skills/BRANDING/Brand-MV.skill` | Identity boards, logo systems, palette, type, applications |
| `website-design/skills/Design-MV.md` | Landing / product-site composition |
| `instructions.md` | GPT API / FLORA / ChatGPT usage |
| `roadmap.md` | Quality-before-volume; expand only for real workflow gaps |
| `cro-website\skill` | CRO-MV conversion audits (Friction Map, Impact Stack) — adjacent, not motion |

Design-MV operating ideas to keep: Signal Spine, Pressure Gradient, chroma control (one accent), engineered not theatrical, default page sequence (nav, hero, 4–6 modules, flow, metrics, terminal CTA, footer), failure modes (no generic SaaS, no cluttered dashboards, no loud cyberpunk).

Brand-MV: strategy-first identity; color as a system; anti-generic rules. Useful when assembling needs a `--color-primary` scarcity story, not when generating `tokens.css` from a board image (that is AnyDesign's job).

Honest gap: **no reduced-motion CSS, no duration scale, no interaction state machine.** Those come from assembling-components + [reduced motion](../concepts/reduced-motion.md).

## Citations

- URL: [https://github.com/adi0900/MotionWiki-Playbook](https://github.com/adi0900/MotionWiki-Playbook)
- Path: `README.md`
- Path: `instructions.md`
- Path: `roadmap.md`
- Path: `website-design/skills/Design-MV.md`
- Path: `visual-identity/skills/BRANDING/Brand-MV.skill`
- Path: `cro-website\skill` (literal backslash in filename)

Ingested 2026-08-13 via shallow clone. Clones were not vendored into this vault.

## Mapping to assembling-components

See [MotionViz assembly bridge](../concepts/motionviz-assembly-bridge.md). Page sequence → `layout/` + dashboard sections. Chroma → `--color-primary`. "Motion" in the Design-MV outcome sentence → tokenized `--duration-*` / `--transition-*` only.

## Where this is used

- [MotionViz assembly bridge](../concepts/motionviz-assembly-bridge.md)
- [Reduced motion](../concepts/reduced-motion.md)
- [Production checklist](./assembling-production-checklist.md)
