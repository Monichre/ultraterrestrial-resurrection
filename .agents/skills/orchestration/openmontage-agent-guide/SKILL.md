---
name: openmontage-agent-guide
description: Operating guide and agent contract for OpenMontage video production.
trigger: Use when working with OpenMontage video production pipelines or onboarding new users.
---

# OpenMontage - Agent Guide

This is the complete operating guide and agent contract for OpenMontage.

## First Interaction — Onboarding
When the user's first message is vague, exploratory, or asks what you can do, read the onboarding skill **before** doing anything else:
**Read:** `skills/meta/onboarding.md`

Skip onboarding when the user arrives with a specific, actionable request. Go directly to Rule Zero.

## Reference Video Entry Point
When the user provides a **video URL or local video file as inspiration**, do **not** treat this as a generic web-search or prompt-writing request.

### Required behavior
1. **Read:** `skills/meta/video-reference-analyst.md`
2. **Run the reference analysis workflow** using the local analysis tools (`video_analyzer`, transcript extraction, scene detection, frame sampling)
3. **Produce a grounded summary** of what the reference is doing:
 - content
 - pacing
 - structure
 - style
 - what makes it work
4. **Then** run normal capability audit and pipeline selection
5. Present **2-3 differentiated concepts** for the user's version — not a carbon copy

### Important distinction
- **Reference-driven request:** "make me something like this" -> use `video-reference-analyst.md`
- **Source-footage request:** "edit this footage" / "cut this into clips" -> use `source_media_review` and the appropriate footage-led pipeline

## Rule Zero — All Production Goes Through a Pipeline
**Every video production request MUST go through the pipeline system. No exceptions.**

When the user asks to make, create, produce, or generate any video content:
1. **Identify the pipeline.** Match the request to one of the pipelines in `pipeline_defs/`.
2. **Read the pipeline manifest.** `pipeline_defs/.yaml` — know the stages, tools, and quality gates.
3. **Run preflight.** Discover available tools via the registry. Present the capability menu.
4. **Execute stage by stage.** For EACH stage, read the stage director skill (`skills/pipelines//-director.md`) BEFORE doing any work in that stage.
5. **Read Layer 3 skills before calling tools.** Before using any tool with an `agent_skills` field, read the referenced skill in `.agents/skills/`.

**Do NOT:**
- Write ad-hoc Python scripts to call tools directly
- Skip the pipeline and go straight to API calls
- Generate assets without reading the stage director skill first
- Use a tool without checking its Layer 3 skill for prompting guidance
- Bypass preflight, checkpoints, or review

## Decision Communication Contract
For any meaningful production decision, communicate the decision before acting.

### Announce Before Execution
Before any paid or consequential generation call, state:
- the exact tool name,
- the provider,
- the model or provider variant,
- the reason it was chosen,
- whether it is a sample or a batch run.

### Ask Before Major Changes
Ask before changing any major production choice (provider, model family, treatment, composition engine, etc).

### Re-log Changed Decisions (Binding)
The `decision_log` is append-only. If a choice changes mid-run, append a new `decision_log` entry reusing the same `category` AND `subject`.

### Present Both Composition Runtimes (HARD RULE)
When both Remotion and HyperFrames are available, you **MUST present both options** to the user before locking `render_runtime`. Provide a description, a tradeoff, and a recommendation for each.

### Composition Authoring Mode — Templated vs Atelier
- **Templated:** Assemble stock scene-types. Fast, cheap, reliable.
- **Atelier:** Hand-author from scratch. Bespoke scenes, one-off theme. Default for hero work.
Route through `skills/meta/taste-direction.md` and `skills/meta/bespoke-composition.md`.

## Escalate Blockers Explicitly
Surface blockers immediately:
1. What was attempted
2. What failed

## Quick Lookup
| Question | Where to look |
|----------|--------------|
| What tools exist? | `tools/tool_registry.py` and `registry.support_envelope()` |
| What providers are available for a capability? | `registry.capability_log()` |
| What tools exist for a vendor? | `registry.provider_catalog()` |
| How does a tool actually work? | the tool's `usage_location` from the registry |
| How should this pipeline stage behave? | `skills/pipelines/<pipeline>/...` |
| What is the checkpoint/review policy? | `skills/meta/` |
