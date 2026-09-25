# disclosure-design

Workspace package `@repo/disclosure-design`. Visual laboratory and design-reference research base: ~450 Midjourney / design-lab stills organized to harden visual themes into repeatable prompts, tokens, components, and interfaces. Ultraterrestrial is the originating context and primary proving ground; the lab exists to make its discoveries retrievable instead of accidental.

Git-tracked brand bible / design-lab / paper live under [`packages/disclosure-design/canon/`](packages/disclosure-design/canon/). The visual lab vault (stills, mock-ups, `Archive.zip`) stays in [`packages/disclosure-design/design/`](packages/disclosure-design/design/) and is not merged with canon. Runtime kit remains [`packages/disclosure-ui`](packages/disclosure-ui). This package is **not** a product UI dependency.

- **Start here**: [AGENTS.md](./AGENTS.md) — Visual Lab + Folderize contracts (binding).
- **Visual language**: [`VISUAL_LANGUAGE.md`](./VISUAL_LANGUAGE.md) — generated guide to the Three Visual Lanes and the four priority app surfaces: Home / Entry, Research Canvas, Archive / Record, and Spacetime Observatory. The eight deeper modes remain retrieval families. [`language/visual-language.json`](./language/visual-language.json) is canonical; [`skills/visual-language/`](./skills/visual-language/) + `scripts/visual_language.py context --focus-surface …` load the focused agent context.
- **Extraction folders**: [`extractions/<slug>/`](./extractions/) — image + `source.md` + `design-tokens.md` (+ `design.md`, `image-to-prompt.md`, sometimes `component.tsx`).
- **The Prompt Operating System**: [`prompts/`](./prompts/) — read [`language-policy.md`](./prompts/language-policy.md) before ANY extraction. **The Reference Toolset**: [`references/`](./references/) + [`skills/image-to-code/`](./skills/image-to-code/).
- **Supporting vocabulary**: [`language/registry.json`](./language/registry.json) — operational terms, machine values, and source attribution. [`CONTEXT.md`](./CONTEXT.md) is the generated glossary.
- **State of truth**: [`notes/folderize-manifest.json`](./notes/folderize-manifest.json) · query catalogs in [`notes/`](./notes/) (intermediate, regenerated).
- Vault rules: [welcome.md](./welcome.md) · [index.md](./index.md) · [log.md](./log.md)
