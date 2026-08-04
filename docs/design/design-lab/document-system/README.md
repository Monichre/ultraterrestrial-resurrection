---
status: unfinished
role: design
spine: want
updated: 2026-08-01
---

# Document System — UNFINISHED / NEEDS WORK

> **Status: unfinished.** Do not treat this folder as shipping canon.
> Specimen + CSS exist; wiring, inventory, and product handoff do not.

## What this is

Paper-material design system specimen for Ultraterrestrial research surfaces:

| File | Role |
|---|---|
| [`index.html`](./index.html) | Specimen page (“Paper is the interface”) |
| [`ut-document-system.css`](./ut-document-system.css) | Shared paper / register stylesheet |
| [`assets/`](./assets/) | Paper textures (tooth, fibers, weave, diagonal, registry noise) |

Intended consumers: lab HTML prototypes + eventual React document/dossier primitives.

## Why it is unfinished

1. **Not inventoried as living work** until this flag — absent from `DesignLab.md` module map for a long stretch.
2. **Broken consumer links** — vision/lab prototypes still reference `./document-system/ut-document-system.css` from paths that do not resolve here (or resolve to a sibling that was never wired).
3. **Specimen nav is stale** — `index.html` links to `../01-living-research-canvas.html` etc.; those files live under [`../../vision/prototypes/`](../../vision/prototypes/) (and may also exist under archive), not as design-lab siblings.
4. **No React / token handoff** — not yet mapped into `apps/app` document-panel / research-ui primitives or Microfilm Dark tokens (`DESIGN.md`).
5. **Open product question** — see `UiDesignBrief.md` § Open Questions #5: restore shared paper CSS for lab HTML, or treat HTML as throwaway once React ports exist?

## Needed work (checklist)

- [ ] Decide: keep as living shared stylesheet vs. archive after React port
- [ ] Fix relative CSS links from [`docs/vision/prototypes/`](../../vision/prototypes/) (and any remaining lab HTML)
- [ ] Fix specimen nav targets to real prototype locations
- [ ] Align tokens / type with `DESIGN.md` (Martian Mono, Special Elite moment, OKLCH paper register)
- [ ] Document which React components own the production equivalent
- [ ] Promote status to `live` only when the above are done

## Related

- Parent inventory: [`../DesignLab.md`](../DesignLab.md)
- UI brief gap: [`../UiDesignBrief.md`](../UiDesignBrief.md) (Lab vs production gap · Open Q #5)
- Vision prototypes: [`../../vision/prototypes/`](../../vision/prototypes/)
- Live document UI work: `apps/app/src/components/document-panel/`
