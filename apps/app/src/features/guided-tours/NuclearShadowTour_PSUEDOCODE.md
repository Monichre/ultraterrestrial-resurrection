# NuclearShadowTour — Pseudocode

## Goal

Mount Act I (*Architecture of Secrecy*) as a traversable evidence graph inside the Next.js app — not a decorative timeline.

## Port

1. Copy archive prototype `docs/archive/prototypes/nuclear-shadow-xyflow/src/features/guided-tours` → `apps/app/src/features/guided-tours`
2. Scope CSS under `.ut-tour-shell`; map tokens to Microfilm Dark (`--ut-*`)
3. On load: validate definition → hydrate progress from localStorage → compile XYFlow graph
4. Runtime loop: arrive → investigate (claim / evidence / challenge / residue gates) → depart along typed edge

## Route

- Page: `(site)/tours/nuclear-shadow` → full-viewport `NuclearShadowTour`
- Launch: research-canvas ActionChip, typer "Nuclear Shadow" card (`href`), submit regex

## Epistemic unit per waypoint

```
CLAIM → PRIMARY BASIS → LIMITATION → UNRESOLVED → NEXT MARKER
```

## Edge kinds (route language)

chronological | evidentiary | hypothesis | institutional-inheritance | contradiction
