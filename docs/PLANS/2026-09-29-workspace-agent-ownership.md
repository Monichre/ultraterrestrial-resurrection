---
title: Workspace Agent Ownership and Cross-Harness Definitions
description: Agreed operating model and proposed workspace-owner contracts for Claude Code, Devin, Codex, and Cursor.
status: draft
created: '2026-09-29T18:39:01-05:00'
updated: '2026-10-04T13:41:00-05:00'
---

# Workspace agent ownership and cross-harness definitions

**Status:** Discussion captured as a plan. The operating model below is agreed; the detailed owner map and packaging are proposals.

**Update (October 4th, 2026, 13:41 CDT):** Claude Code workspace teams now exist under [.claude/agents/](.claude/agents/): a `<workspace>-lead` plus specialists for each of 10 workspaces (29 agents; [apps/gods-eye-view-main](apps/gods-eye-view-main) and [apps/temporal-observatory](apps/temporal-observatory) are excluded because they are being folded into [apps/app](apps/app)). The five single-file agents in the table below were deleted. Devin, Codex and Cursor adapters were not built. The ecc plugin was disabled for this repo in [.claude/settings.json](.claude/settings.json) to keep agent descriptions under the 15k-token budget.

**Updated:** 2026-09-29 23:29 CDT (UTC−05:00): added the shared task record, the four-owner starting set, lanes, the pipeline/archive boundary, the `.agents/` location, the reconciliation table, and the three-mode Claude test (Claude + Codex review).

## 1. Agreed decisions

- **The orchestrator is Liam's primary point of contact.** It handles delegation, synthesis, coordination, and progress reporting. A separate user-facing technical-partner agent is not needed.
- **Direct specialist access remains available.** Liam must be able to communicate with individual workspace agents without routing every message through the orchestrator.
- **Workspace owners do the lion's share of development.** They are reusable specialists with defined ownership, not generic disposable helpers.
- **Start local.** Remote/cloud delegation is a later concern, not something to build into this first pass.
- **Claude Code is the initial coordination environment.** Liam intends to keep a `claude agents` terminal open for visibility while primarily communicating through the orchestrator.
- **Definitions must also be usable by Devin, Codex, and Cursor.** Role instructions should have one maintained source rather than independent persona packs for each harness.
- **Keep the work focused.** Define ownership and contracts before choosing models, enabling teams, or adding orchestration infrastructure.

## 2. Proposed operating contract

### Orchestrator

The orchestrator receives requests, clarifies the intended outcome, assigns work to workspace owners, coordinates dependencies, reviews evidence, and presents a coherent result.

It should:

1. Delegate implementation to the relevant workspace owners instead of becoming the default developer for every package.
2. Give each assignment an outcome, scope, exclusions, acceptance conditions, and named owner.
3. Resolve overlapping file ownership and establish shared-interface agreements before parallel implementation.
4. Keep direct instructions given to specialists reflected in shared task state.
5. Surface decisions needed, blockers, and evidence-backed progress rather than internal agent chatter.
6. Assign an explicit owner for root-level configuration, lockfiles, and other shared changes on each task.

### Shared task record (required before launch)

Direct access to specialists is only safe if both paths write to one record. Each assignment gets an entry with:

| Field | Content |
|---|---|
| Task ID | T-0xx from [`docs/plans/TODO.md`](docs/plans/TODO.md), or a session-local ID that is promoted to a T number before any commit |
| Owner | One named owner |
| Assigned paths | The write scope for this task |
| Scope revisions | Every change, with who asked for it (Liam direct, or the orchestrator) and when |
| Blockers | Open blockers and who can clear them |
| Acceptance evidence | Commands run, their output, and whether a visual audit was done or is UNVERIFIED |

Reconciliation rule: a specialist that takes an instruction directly from Liam adds a scope revision before acting on it. The orchestrator reads the record before it reassigns or merges work. The storage mechanism (the Agent Teams task list, a file under `.agents/`, or Linear) is still open.

Liam retains authority over scope, product direction, consequential actions, and final acceptance.

### Workspace owners

An owner's role persists as a definition; its running session is activated only when needed. Defining every workspace owner does not mean launching all of them simultaneously.

Owners may inspect relevant code across workspace boundaries. Their default write scope is their owned workspace. Changes outside that scope require an explicit coordinated assignment; ownership alone does not authorize production data mutations or external actions.

Each owner investigates, implements, verifies, and reports its assigned work. Durable decisions and handoffs must survive outside transient chat history. Historical documentation is context, not proof of current runtime behavior or an instruction to expand the task.

### Shared handoff shape

Every handoff reports:

- Result and changed paths.
- Verification commands and their actual outcomes.
- Unverified behavior and blockers.
- Interface changes affecting other owners.
- The next decision or action required, if any.

## 3. Portable definition shape

Each definition should contain only information needed to route and perform its work:

| Field | Purpose |
|---|---|
| Role and trigger | Stable identity and when to delegate to it. |
| Owns | Exact workspace paths and responsibilities. |
| Boundaries | Excluded paths and changes requiring coordination. |
| Read first | Short pointers to authoritative workspace guidance. |
| Skills and capabilities | Required capabilities and narrowly triggered optional procedures. |
| Workflow | Investigate, implement, verify, report. |
| Verification | How to find and run the relevant checks; live UI evidence where applicable. |
| Handoff and escalation | What to return and when to involve another owner or Liam. |

Keep common policies in one shared contract. Workspace definitions supply the differences rather than duplicating global safety rules, entire architecture documents, dependency lists, or claims of comprehensive expertise.

Model IDs, native tool names, permission enforcement, MCP wiring, and harness-specific memory settings belong in adapters, not in the portable role body. A skill teaches a procedure; it does not grant authority to expand an assignment.

## 4. Proposed workspace ownership

This map is a proposal for approval, not a claim that these agents already exist or that every directory is a verified runnable application.

**Start with four active owners:** `app-owner`, `disclosure-rag-owner`, `db-owner`, and `ai-owner`. For the first pass, `ai-owner` also covers the prompts workspace. The other owners stay defined but parked, and none is activated until a task needs it. This follows the standing preference for a small, cohesive suite over a large persona pack.

**Lanes:** Lane A (Corpus & Ingestion) covers `disclosure-rag-owner`, `knowledge-base-owner`, and `db-owner` (data writes). Lane B (Platform & Experience) covers `app-owner`, `ui-owner`, `design-owner`, `disclosure-lab-owner`, and the reference apps. `ai-owner`, `prompts-owner`, and `vector-store-mcp-owner` serve both lanes; the task's lane decides priority.

**Pipeline vs. archive boundary:** code that writes into [packages/knowledge-base/](packages/knowledge-base/) from the ingestion pipeline belongs to `disclosure-rag-owner`. Examples are ING-02, ING-05, and ING-07 in [`apps/disclosure-rag/docs/INGESTION_GAP_TICKET_HANDOFF.md`](apps/disclosure-rag/docs/INGESTION_GAP_TICKET_HANDOFF.md). `knowledge-base-owner` reviews any change to the archive layout, identity policy, or provenance fields.

### Applications

| Owner | Scope and boundary |
|---|---|
| `app-owner` | [apps/app/](apps/app/): main application, Research Canvas, live Spacetime, app routes, and consumer integration. Shared-package changes go to their owners. |
| `disclosure-lab-owner` | [apps/disclosure-lab/](apps/disclosure-lab/): administrative console. Preserve human-confirmed writes and the existing separation between operator actions and read-only agent assistance. |
| `disclosure-rag-owner` | [apps/disclosure-rag/](apps/disclosure-rag/): Python ingestion and processing. Do not assume its services or integration with the main app are live because an old document says so. |
| `temporal-observatory-owner` | [apps/temporal-observatory/](apps/temporal-observatory/): standalone application tree. Do not equate it with the main app's live Spacetime feature or similarly named prototypes. |
| `gods-eye-view-owner` | [apps/gods-eye-view-main/](apps/gods-eye-view-main/): standalone donor/reference application. Product integration is a separate assignment coordinated with `app-owner`. |

### Shared packages

| Owner | Scope and boundary |
|---|---|
| `db-owner` | [packages/db/](packages/db/): database-layer code, schemas, queries, and retrieval contracts. Code ownership does not grant blanket authority to mutate live data. |
| `ai-owner` | [packages/ai/](packages/ai/): service adapters and research-agent suite. Excludes [packages/ai/prompts/](packages/ai/prompts/), assigned below. |
| `prompts-owner` | [packages/ai/prompts/](packages/ai/prompts/): nested prompt-registry workspace, loaders, schemas, rendering, and validation. Coordinate consumer contracts with AI, app, and ingestion owners. |
| `design-owner` | [packages/disclosure-design/](packages/disclosure-design/): visual research, design canon, and extraction workflows. This is not the shipped UI dependency. |
| `ui-owner` | [packages/disclosure-ui/](packages/disclosure-ui/): shared runtime components, tokens, assets, and Storybook. App-specific composition remains with app owners. |
| `knowledge-base-owner` | [packages/knowledge-base/](packages/knowledge-base/): source archive, provenance, metadata, and derived-content organization. Ingestion implementation remains with the pipeline owner. |
| `vector-store-mcp-owner` | [packages/openai-vector-store-mcp/](packages/openai-vector-store-mcp/): MCP implementation and search/fetch contracts. Consumers retain ownership of their own integration code. |
| `research-base-owner` | [packages/research-base/](packages/research-base/): scaffold-only ownership until explicitly assigned development. [packages/research-base/src/index.ts](packages/research-base/src/index.ts) currently exports nothing. Do not invent an existing architecture. |

The AI/prompt split is deliberate: [packages/ai/prompts/package.json](packages/ai/prompts/package.json) identifies a nested workspace. Whether it warrants a separate owner remains a user decision.

## 5. Cross-harness packaging proposal

Keep one canonical set of role instructions and derive native adapters from it. **Recommended location: `.agents/agents/`.** [.agents/](.agents/) is already the repo's harness-neutral home for rules and skills (see [`AGENTS.md`](AGENTS.md)). [.devin/](.devin/) holds only Devin config and skills today, so putting the canonical source there would make one harness the owner of it. The adapter-generation mechanism has not been chosen.

| Harness | Native representation | Portability boundary |
|---|---|---|
| Claude Code | Markdown agent definition with YAML frontmatter; reusable as an Agent Teams teammate. | Translate tool, model, and permission settings for Claude. Teammates do not apply a definition's `skills` field the same way subagents do. |
| Devin | Markdown custom agent profile. | Use Devin's native tool names and model semantics; defaults are not assumed equivalent to Claude's. |
| Cursor | Markdown custom agent; Claude-compatible definitions are also discoverable. | Reuse the Claude-compatible definition where sufficient; add a Cursor-specific adapter only when necessary. |
| Codex | TOML custom agent with `name`, `description`, and `developer_instructions`. | Embed the same role instructions and configure native sandbox, model, MCP, and skill settings separately. |

Portable instructions do not imply identical enforcement or communication interfaces. Workspace ownership written in Markdown is not a filesystem sandbox. Each harness's actual behavior must be checked before claiming compatibility.

Existing definitions under [.claude/agents/](.claude/agents/) must be reconciled rather than silently duplicated. No removal or migration of existing files is authorized by this plan alone.

| Former definition (deleted October 4th, 2026) | Proposed owner | Known conflict | Replaced by |
|---|---|---|---|
| `.claude/agents/apps/app-agent.md` | `app-owner` | Repeats the retired Xata layer and the rejected "85% AI connectivity" claim | `app-lead` |
| `.claude/agents/apps/disclosure-rag-agent.md` | `disclosure-rag-owner` | Not audited; check for Upstash / multi-backend claims | `disclosure-rag-lead` |
| `.claude/agents/apps/research-ui-agent.md` | `ui-owner` or `design-owner` | Straddles the design-research / shipped-UI split; needs a decision | split: `disclosure-ui-lead` (shipped kit), `disclosure-design-lead` (lab and canon) |
| `.claude/agents/packages/db-agent.md` | `db-owner` | Harness description still names Xata integration | `db-lead` |
| `.claude/agents/packages/knowledge-base-agent.md` | `knowledge-base-owner` | Harness description mentions vector storage and sync; check for Upstash claims | `knowledge-base-lead` |

## 6. Runtime choices and constraints

- **Agent Teams** is the proposed initial mechanism for coordinated workspace development: the orchestrator is the native team lead, and owners are teammates.
- **Agent view** is a monitoring/dispatch surface, not a substitute for the orchestrator. Verify how the installed version exposes team members versus independently dispatched sessions; do not promise identical visibility in `claude agents` without checking.
- **Subagents** remain useful for bounded assistance, and are the native delegation mechanism in other harnesses. Direct teammate interaction is a Claude operating requirement, not a capability automatically guaranteed across all four harnesses.
- **Dynamic workflows** are optional for large scripted jobs, not part of the initial setup.
- **Projects and remote delegation** are deferred. Cloud threads do not automatically inherit locally installed tools, skills, or MCP configuration.
- Claude Agent Teams is experimental, has one fixed lead, and does not support nested teams or automatic per-teammate worktree isolation. Partition writes explicitly; use separately isolated sessions when appropriate.
- In-process teammates are not restored by session resume. Persist important decisions and handoffs independently of those sessions.

## 7. Findings that affect the definitions

The inspection found conflicting instructions, not a proven explanation for any particular model failure:

- [AGENTS.md](AGENTS.md) retires Xata and rejects the old “85% AI connectivity” claim; the former `app-agent` definition repeated both (deleted October 4th, 2026).
- [apps/disclosure-rag/README.md](apps/disclosure-rag/README.md) begins with a current warning disavowing its older Upstash availability claims. Do not copy those old claims into a new owner definition.
- Design research and shipped UI have distinct responsibilities, documented in [packages/disclosure-design/README.md](packages/disclosure-design/README.md) and [packages/disclosure-ui/README.md](packages/disclosure-ui/README.md).
- The OpenKnowledge skill's broad routing requirement added overhead to agent-configuration discussion. Scope its applicability deliberately; this plan does not change that skill or its configuration.

## 8. Next bounded steps

1. Approve or amend the owner map, particularly the nested prompt workspace and the treatment of reference/scaffold workspaces.
2. Author the shared contract and concise workspace-specific definitions, with authoritative context pointers and explicit exclusions.
3. Select per-owner skill/tool requirements and native model/permission settings without inheriting every available capability by default.
4. Produce the native adapters and reconcile conflicting existing definitions without unapproved deletions or global configuration changes.
5. Verify parsing, discovery, loaded instructions, scope behavior, and a read-only delegation/handoff in each target harness. Verify direct specialist communication and progress visibility in Claude Code.
   - **Claude Code has three modes to test separately:** subagent, in-process teammate, and split-pane teammate. Per the [Agent Teams docs](https://code.claude.com/docs/en/agent-teams#use-subagent-definitions-for-teammates), an in-process teammate appends the role body to the default system prompt, while a split-pane teammate replaces it, and MCP loading also differs by mode. One discovery check does not prove the modes behave the same.

No team launch, dependency installation, credential change, production data operation, or remote orchestration setup is included in this documentation step.

## 9. Evidence and verification status

**Inspected:** workspace listings, selected manifests and workspace guidance, existing Claude agent definitions, installed Devin CLI documentation, and current public Claude Code, Cursor, and Codex documentation.

**Not verified:** live agent discovery, installed CLI compatibility, permission enforcement, teammate visibility in agent view, cross-harness delegation, or model availability. No application tests or runtime audits were performed for this plan.

### Harness references

- [Claude Code parallel-work comparison](https://code.claude.com/docs/en/agents.md)
- [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)
- [Claude Code custom subagents](https://code.claude.com/docs/en/sub-agents.md)
- [Claude Code Projects](https://code.claude.com/docs/en/claude-projects.md)
- [Cursor subagents](https://cursor.com/docs/context/subagents)
- [Codex subagents and custom agents](https://developers.openai.com/codex/multi-agent)
- Devin CLI: installed `devin-cli` documentation, version `3000.11.3`, custom-subagent and configuration sections.
