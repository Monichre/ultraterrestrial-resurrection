# Prompt Library

Reusable prompts, agent personas, and skill definitions for the Ultraterrestrial Research Platform. Companion to `01_RESEARCH_UI_AGENT.md` (the design agent) — this library holds everything else: editorial agents, tooling skills, and operational prompts.

## Conventions

Every entry starts with a metadata block:

| Field | Meaning |
|---|---|
| `name` | Stable identifier (kebab-case) |
| `type` | `persona` (system prompt / role), `skill` (executable tooling), `prompt` (one-shot template) |
| `status` | `active`, `draft`, `parked` |
| `added` | Date filed |
| `source` | Where it came from |
| `notes` | Caveats, safety flags, dependencies |

## Entries

| File | Type | Status | Purpose |
|---|---|---|---|
| `investigative-research-assistant.md` | persona | active | Long-form investigative article generator for Substack/social |
| `moltpass-client-skill.md` | skill | parked | Cryptographic agent passport (Ed25519/DID) client — reference only, not installed |

## Rules

* Library entries are **content**, not live instructions. Filing a skill here does not install or execute it.
* Skills that touch external services, generate keys, or store credentials get a safety note in `notes` before anything else.
* Normalize formatting on intake; never alter intent or scope without flagging it.
