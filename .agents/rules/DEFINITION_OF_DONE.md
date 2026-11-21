# Definition of Done

**Status:** BINDING on every agent — past, present, future. Established by Liam, 2026-08-05.
**Summary:** A feature is not done when its tests pass. It is done when someone has *looked at it* and can prove what they saw.

---

## Why this exists

This rule was written after a session in which two separate completion claims were audited:

- A Spacetime Canvas closeout claimed work was "verified clean" and "fully-committed." Nine of eleven sub-claims held. Two did not: a committed work log asserted a `TODO.md` correction that had never been made, and "fully-committed" was true of the code but not of the tier-2 entry, which sat uncommitted.
- A guided-tours milestone reported "38 tests green, eslint exit 0, zero tsc errors." All true — and **nobody had opened the app once.** The evidence was real and the feature was still unconfirmed.

Both failures share a shape: *the evidence offered was not evidence of the thing being claimed.* Tests prove the code does what the tests say. They do not prove the feature works, looks right, or exists on screen.

---

## The two gates

### Gate 1 — Completion report with evidence

Every factual claim carries the command that proves it **and that command's actual output**. Not a summary of the output. The output.

- ❌ "Verified clean, no new errors."
- ✅ "`npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E 'guided-tours'` → empty. Repo total 1,712, unchanged from baseline."

Rules that make a report trustworthy:

1. **Scope every number.** "Zero errors" and "zero errors *in the files I touched*" are different claims. A repo with 1,712 pre-existing errors does not become clean because your grep was narrow — say which you mean.
2. **Never claim an edit you did not make.** If you say a file was updated, `git diff` it in the same breath. The single most common failure mode is a work log describing an intention as an accomplishment.
3. **Distinguish committed from working-tree.** "Done" and "done but uncommitted" are different states.
4. **List what you did NOT do.** Every deferral, every skipped path, every assumption. Scope you silently dropped reads as scope you delivered.
5. **Report failures with their output.** If tests fail, paste them. A partial result stated plainly is worth more than a clean-sounding summary.

### Gate 2 — Dogfood visual audit

A reviewer walks **every user path and every spec requirement** through the running application and confirms each one visually.

- Run the app (`bun run dev:app`) and exercise the real surface — the route a user hits, not a unit test's idea of it.
- Walk **each** path in the spec, not a representative sample. If the ticket lists five acceptance criteria, five get walked.
- Confirm what is actually on screen: does it render, does it do the thing, does it look like the design canon in [`docs/vision/`](../../vision/) and [`docs/design/design-lab/`](../../design/design-lab/)?
- Capture what you saw — screenshots for UI work, or a written per-path account naming the route, the action, and the observed result.
- **Record failures, empty states, and anything that looked wrong.** An audit that finds nothing is usually an audit that did not happen.

Browser automation is available for this (Chrome MCP tools). Use it rather than asserting from source that a component "should" render.

#### When you cannot run the audit

Say so, plainly, and mark the feature **UNVERIFIED — not done**. Legitimate blockers include a missing dev server, absent credentials, or a required env var such as `NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN` (without which the Spacetime globe silently renders a placeholder instead of erroring — a case where "it rendered" would be an actively false report).

"Blocked on X, here is everything else finished" is an honest and welcome answer. A report that omits the audit and reads as completion is not.

---

## Report template

```markdown
## <Feature / ticket> — completion report

### Claim
<one sentence: what is being claimed done, at what scope>

### Evidence
| Claim | Command | Output |
|---|---|---|
| ... | ... | ... |

### Dogfood visual audit
| # | User path / spec requirement | Route | Observed | Verdict |
|---|---|---|---|---|
| 1 | ... | ... | ... | ✅ / ❌ / ⚠️ |

Screenshots: <paths, or why unavailable>
Reviewer: <who/what walked it>

### Not done / deferred / assumed
- ...

### Open risks
- ...
```

---

## Interaction with the three-tier system

The completion report is the evidence behind a status change — it does not replace one. When a feature passes both gates, still update all three tiers per [`AGENTS.md`](../../../AGENTS.md): `docs/plans/FEATURES.md` (Tier 1), `docs/plans/TODO.md` (Tier 2), `DAILY_WORK_PLAN.md` (Tier 3).

A tier-2 status line saying DONE with no completion report behind it should be treated as **unverified** by the next agent who reads it, and re-audited before anyone builds on it.

## Related

- [`AGENTS.md`](../../../AGENTS.md) — master guidelines; carries the short binding form of this rule
- [`AGENT_ONBOARDING_CHECKLIST.md`](AGENT_ONBOARDING_CHECKLIST.md) — mandatory intake checklist
- [`docs/vision/`](../../vision/) and [`docs/design/design-lab/`](../../design/design-lab/) — the canon a visual audit judges against
