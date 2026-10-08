# Attached interface journey and Storybook handoff

**Updated:** October 7th, 2026, 22:03:00 CDT.

## Goal and confirmed scope

A user journey and Storybook stories for all three images the user explicitly selected: Visual Foundation, Trinity waypoint 02, and Controlled Revelation waypoint 03. Source attachments are copied intact into [apps/app/public/interface-studies/nuclear-shadow/](apps/app/public/interface-studies/nuclear-shadow/).

## Resume command

Run `bun run storybook --ci` from [apps/app/](apps/app/) if execution session `4861` is terminal. Otherwise poll that exact handle. Open <http://localhost:6006/?path=/story/guided-tours-nuclear-shadow-user-journey--full-journey>.

## Current implementation

- [Interface component](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveInterfaceStudy.tsx): original reference plates, eleven selectable foundation sections, Trinity inspection hotspots, claim/basis/counterpoint/unresolved readings, document-layer tabs, illustrative disclosure mask, and local next-trace notes.
- [Connected journey](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveJourney.tsx): foundation → Trinity → controlled disclosure → return. All three scenes remain mounted so local selections and notes survive navigation.
- [Interface stories](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveInterfaceStudy.stories.tsx): foundation, Trinity, public release, controlled disclosure, restricted context.
- [Journey stories](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveJourney.stories.tsx): full journey, starts at either waypoint, interaction regression.
- Narrative reads the existing [Nuclear Shadow definition](apps/app/src/features/guided-tours/nuclear-shadow/nuclear-shadow.definition.ts). The artwork's fictional report and extraordinary technical prose are explicitly reference copy, not historical evidence.

## Evidence so far

- `git status --short -- apps/app/src/features/research-platform` → empty. All nine previously clean tracked files from the provisional gallery implementation were restored; only session-owned provisional fixtures/journey were removed.
- `wc -c apps/app/public/interface-studies/nuclear-shadow/*.jpg` → `348187`, `361183`, `434803`, `1144173 total`.
- Formatter exit 0 for all six new source files. Repository formatter emits existing deprecated/unknown option warnings.
- Storybook server session `4861` reached webpack `100%` before rebuilding on new files. Existing catalog warnings include missing `CardAction` export and Storybook 8/9 package mismatch. Runtime rendering still being audited.
- Earlier broad typecheck output has `1772` error lines; it predates the final attachment implementation and is not proof for these files.

## Final-scope checks and resolved findings

- Initial typecheck found three unsupported Testing Library `exact` options in the interaction story. Removed them. Rerun `bunx tsc --noEmit --pretty false` captured in `/tmp/attached-interface-typecheck-final.log` → `{"exitCode": 2, "repoErrorLines": 1773, "interfaceStudyErrors": []}`. The app-wide typecheck fails; the new study files have no reported errors.
- `bunx prettier --check` against the six source/style files → `All matched files use Prettier code style!`, exit 0. Existing formatter-option warnings remain.
- `git diff --check -- DAILY_WORK_PLAN.md docs/plans/FEATURES.md docs/plans/TODO.md` → empty, exit 0.
- Python SHA-256 comparison of each original attachment and its public copy → all three `byteIdentical: true`.
- Both independent source reviewers approved corrected scope. Caption-relative overlays now use a separate artwork wrapper; Trinity basis and unresolved hit targets are disjoint. Excessive paper texture found in the browser was softened for legibility.
- Initial Storybook interaction play failed with `Error: Not implemented. The result of this interaction is unreliable.` from user-event range keyboard selection. Switched the range state assertion to `fireEvent.change`; real browser Home/End/ArrowLeft were separately walked.
- Corrected interaction story reached its last navigation and assertion: foundation selected `color`, Trinity note retained `Compare the test record with the released account.`, hidden disclosure range value `100`, terminal current interface `Trinity`, captured error log `[]`.

## In flight

Storybook execution session `4861`; runtime browser audit. Independent standards/spec source review active. All changes remain uncommitted. Extensive foreign changes elsewhere in the worktree are preserved.

## Not done

Runtime interaction regression, visual desktop/mobile audit of all stories, final typecheck at correct scope, reviewer resolutions, completion report, user acceptance. No production tour integration, corpus writes, source-link revalidation, commit, or PR.

## Single next action

Inspect the Full Journey iframe in the running Storybook, then exercise all eleven foundation sections and the two waypoint interaction paths.
