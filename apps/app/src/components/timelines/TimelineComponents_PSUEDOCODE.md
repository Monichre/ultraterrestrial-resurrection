# Timeline Components Repair — Pseudocode

**Created:** 2026-07-23 13:08:35 CDT
**Scope:** `apps/app/src/components/timelines/**`

## Baseline

- Run the app TypeScript checker and filter diagnostics to the timeline subtree.
- Run ESLint directly against the timeline subtree.
- Treat zero timeline TypeScript diagnostics and zero timeline ESLint diagnostics
  (errors or warnings) as the completion gate.
- Preserve unrelated working-tree changes and the existing public timeline exports.

## Repair sequence

1. Define explicit timeline data contracts.
   - Create a shared draggable-timeline item type with `id`, `year`, `title`, and `image`.
   - Export component prop types where stories and consumers need them.
   - Replace every `any` item collection with the shared contract.

2. Repair React 19 callback refs.
   - For each indexed callback ref, assign the element inside a block-bodied callback.
   - Return `void` so the callback satisfies React's `Ref<T>` contract.

3. remove the retired Xata dependency from the scroll-through timeline.
   - Import `EventsRecord` as a type from `@db/postgres`.
   - Treat `photos` as `string[]`, matching the live Postgres record contract.
   - Render the supplied event records instead of static placeholder slides.
   - Derive the visible list from the optional active year.
   - Render an honest empty state when no event matches.

4. Make image rendering lint-clean and accessible.
   - Use `next/image` for timeline imagery.
   - Preserve dynamic remote-image behavior with explicit dimensions or `fill`,
     responsive `sizes`, and `unoptimized`.
   - Supply meaningful alternative text.
   - Skip optional event images when no source URL exists.

5. Align stories with the configured Storybook framework.
   - Import story types from `@storybook/nextjs`.
   - Give exported fixture constants PascalCase-compatible, all-caps names.
   - Type fixtures using the component's exported item contracts.

6. Verify the repair.
   - Re-run targeted ESLint and require zero diagnostics.
   - Re-run the full app TypeScript checker, filter to the timeline subtree, and
     require zero matches while acknowledging unrelated project-wide baseline debt.
   - Run the app build to catch integration or bundling regressions.
   - Inspect IDE diagnostics for every edited source file.

## Data flow

```text
Story or consumer fixture
  -> typed timeline props
  -> optional active-year filter
  -> declarative item mapping
  -> accessible Next.js image
  -> GSAP or Framer Motion presentation layer
```
