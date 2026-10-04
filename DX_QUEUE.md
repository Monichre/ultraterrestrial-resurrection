# 🛠 DX Queue — Developer Experience Ideas

DX-specific ideas and to-dos for this repo, captured so they can be picked up later without re-spending the research effort. Sibling to [`RESEARCH_QUEUE.md`](RESEARCH_QUEUE.md); same item format.

**How to use:** add ideas as `- [ ]` items under the right priority. Keep the research dump inside the item so whoever picks it up (human or agent) doesn't start from zero. Promote into [`docs/plans/TODO.md`](docs/plans/TODO.md) when it becomes actionable.

---

## 🛠 Active DX Queue

### 🚨 High Priority

- [ ] **Agent-Comm-Wire** — nimble messaging layer between concurrent agent sessions (Claude, Codex, Devin, Cursor) working this repo
  - **Priority:** High
  - **Category:** Tooling / multi-agent coordination
  - **Added:** 2026-09-12
  - **Status:** Researched, not started
  - **Problem:** Multiple agent sessions run concurrently in this repo (see shared-working-tree collision note in [`AGENTS.md`](AGENTS.md)). They can't talk to each other — no way to ask, warn, hand off, or claim files.
  - **Shape:** One local agent mailbox exposed via MCP + small per-agent adapters that get the recipient's attention. Mailbox alone isn't enough — an agent doesn't notice incoming messages without a delivery/wakeup path.
    ```
    Codex ──┐
    Claude ─┼── Local mailbox ── message history + file claims
    Devin ──┘
    ```
  - **Candidates (researched 2026-09-12):**
    | Tool | Notes |
    |---|---|
    | **hcom** — `brew install aannoo/hcom/hcom`, then `hcom claude` / `hcom codex` / `hcom` dashboard | Simplest. One binary, local SQLite, automatic wakeups between tool calls, same-file-edit notifications, terminal dashboard. **Try this first.** No native Devin adapter (generic `hcom start`/`hcom send` only); Cursor CLI support ≠ Cursor IDE chat support. |
    | **MCP Agent Mail** (`Dicklesworthstone/mcp_agent_mail`) | Most full-featured: agent identities, inboxes, threaded messages, acks, **advisory file reservations** (fits our shared-tree collision problem). More infrastructure; primarily async — still needs a notification path. |
    | **Agent Relay** (`AgentWorkforce/relay`) | Realtime messaging, channels, DMs, agent-runtime integrations. Broader setup than hcom. |
  - **Per-agent delivery routes (verified partially):**
    - Codex CLI: `codex queue --thread <ID> --message <TEXT>` — first adapter to test
    - Claude Code: Channels feature (research preview, needs explicit enablement)
    - Devin CLI: has MCP + `devin acp`; start with inbox polling, investigate ACP for auto-delivery — injection into a running Devin terminal unverified
    - Cursor agent: same mailbox via Cursor MCP; attention needs separate handling
  - **Protocol constraints (keep tiny):** one thread per ticket using Linear IDs; explicit recipients + acks; file claims before editing, with expirations; only useful events (questions, blockers, handoffs, review requests) — no auto reply-all loops.
  - **Next step:** install hcom, run `hcom claude` + `hcom codex` in two terminals against this repo, test whether one can ask the other to review a change. Decide buy-vs-build from that result.
  - **Open questions:** Devin automatic receipt; Cursor IDE chat (vs CLI) participation; whether file claims should integrate with the no-`git stash` rule.

### ⚡ Medium Priority

### 📋 Low Priority

---

## ✅ Completed / Adopted

---

**Queue Statistics:**

- Active Items: 1
- Completed Items: 0
- High Priority: 1
- Medium Priority: 0
- Low Priority: 0
