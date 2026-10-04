# HomeRenderingFix

**Timestamp:** 2025-11-25 15:05 UTC  
**Author:** GPT-5.1 Codex

## Summary

- Hardened the hero animation pipeline so the scene now renders the cosmic backdrop, fluid shader, Earth, and Moon even when GSAP timelines fail to initialize.
- Refreshed the landing typography to align with the Monument Grotesk stack and removed the bright blue glow that clashed with the art direction.
- Ensured decorative background layers are always visible by adding a static gradient base layer and fixing pointer-event flags on the SVG star fields.
- Prevented the GSAP timeline from zeroing out the star layers, so the cosmic background stays visible even while the flash overlay plays.

## Modules Affected

- `apps/app/src/hooks/useUltraterrestrialAnimation.tsx` – Added reduced-motion detection, fallback reveal logic, container refs, and kept star layers visible throughout the sequence.
- `apps/app/src/layouts/home/home.tsx` – Attached the new container ref, introduced a radial-gradient safety background, and re-layered the decorative components with pointer-events guards.
- `apps/app/src/layouts/home/TitleAlt.tsx` – Updated typography to use the design fonts, softened glow effects, and removed the blue gradient fill.
- `apps/app/src/components/backgrounds/shooting-stars/stars-background.tsx` – Corrected pointer-event classes so the SVG never blocks input.

## Animation/Data Flow Notes

- The `useUltraterrestrialAnimation` hook now waits for the Earth, Moon, and Prometheus canvases but also starts a 4s fallback timer. If assets lag or the user prefers reduced motion, the hook calls `revealSceneImmediately`, which restores opacity/visibility on all layers without the cinematic sequence.
- GSAP only executes when the timeline is safe to run; otherwise, the state machine flips `forcedReveal`, ensuring downstream components (navigation, title, fluid orbs) still receive consistent visibility flags.

## Research Methodology Reminder

- Follow-up task: design a data-ingestion framework modeled after Jacques Vallée, Diana Pasulka Walsh, and other seminal UFO researchers so future visualization work can reference rigorously classified evidence streams.

## Update — 2025-11-25 16:20 UTC

- Removed the `gsap.set(... opacity: 0)` calls for `stars` and `shootingStars`, along with the delayed fade-in steps, eliminating the lingering white overlay during the flash phase without altering the rest of the cinematic timeline.
