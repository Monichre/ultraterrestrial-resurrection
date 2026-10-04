# 001 — Rewrite ANIMATION_SEQUENCE as canonical HomeAnimated contract

- **Status**: DONE
- **Commit**: 8db933b
- **Severity**: HIGH
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file

## Problem

`apps/app/src/layouts/home/ANIMATION_SEQUENCE.md` documents phases (flashes, fluid orbs, Prometheus, quote at 11.5s, `useUltraterrestrialAnimation`) that `HomeAnimated` does not run. Agents following the doc will wire the wrong hook and timings.

## Target

Single source of truth matching `useHomeHeroSequence` + `HomeAnimated` + Earth idle. Exact timings from hardened pseudocode. Explicit deprecation note for `HomeGSAP` / `useHomeAnimations` as Storybook-only.

## Steps

1. Replace `ANIMATION_SEQUENCE.md` contents with the hardened timeline, z-index map, a11y, and file map.
2. Cross-link `HomeHeroSequence.md` and `animation-plans/README.md`.

## Boundaries

- Do NOT revive Prometheus / FluidShaderOrbs in this plan.
- Do NOT change `HomeGSAPAnimation.md` beyond a one-line “superseded for `/`” note if needed.

## Verification

- Doc timings match `HERO_TIMING` constants in `useHomeHeroSequence.ts`.
- No mention of `useUltraterrestrialAnimation` as the live path.
