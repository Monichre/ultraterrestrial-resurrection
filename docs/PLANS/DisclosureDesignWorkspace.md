# DisclosureDesignWorkspace

Timestamp: 2026-09-13 17:10 CDT (UTC−05:00)

## What this is

[`docs/design`](docs/design) contents moved to [`packages/disclosure-design/canon/`](packages/disclosure-design/canon/) — a sibling of the vault, not a merge into it. `@repo/disclosure-design` is a private workspace package. [`docs/design/README.md`](docs/design/README.md) is a pointer.

## Modules

| Piece | Role |
| --- | --- |
| [`packages/disclosure-design`](packages/disclosure-design) | Lab root: language, extractions, prompts, scripts. Stays. |
| [`packages/disclosure-design/canon/`](packages/disclosure-design/canon/) | Git-tracked design canon (former `docs/design`). |
| [`packages/disclosure-design/design/`](packages/disclosure-design/design/) | Visual lab vault (mock-ups, Archive.zip, vision). Not overwritten. |
| [`packages/disclosure-design/package.json`](packages/disclosure-design/package.json) | Workspace interface. Exports `./canon/*` only. |
| [`packages/disclosure-ui`](packages/disclosure-ui) | Runtime kit. Untouched. |
| [`docs/vision/`](docs/vision/) | Identity canon. Untouched. |

## Rule

Do not merge canon into vault `design/`. Do not treat canon as `@repo/disclosure-ui`. Nested empty `.git` deleted.

## Data flow

Agents read canon + lab from the package. Product UI still imports `@repo/disclosure-ui`. `apps/app` does not depend on `@repo/disclosure-design`.
