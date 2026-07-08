# DESIGN.md — Ultraterrestrial Research Canvas (Microfilm Dark)

Codified 2026-07-08 from `apps/app/src/components/design-system/{ARCHIVAL_DYSTOPIAN_AESTHETIC,RESEARCH_CANVAS_AESTHETIC,DESIGN_SYSTEM}.md` plus the live canvas chrome. Register: **product**.

## Scene

A researcher at 23:00 in a dim room, arranging declassified records on a large monitor. The canvas is the reading table; panels are documents pulled into the lamplight. Dark is forced by the scene: the luminous graph is the subject, chrome recedes into the desk.

## Concept

**Microfilm Dark**: the archival dossier aesthetic (manila, typewriter, stamps, redaction) photographed at night. Not neon cyberpunk; HUD elements are digital ghosts at low opacity. Institutional, clinical, slightly ominous.

## Color (OKLCH, warm-tinted toward manila hue ≈85)

Strategy: Restrained neutrals + a semantic evidentiary palette (data-viz exception).

| Token | Value | Role |
|---|---|---|
| `--ut-void` | `oklch(0.16 0.006 85)` | canvas base |
| `--ut-surface` | `oklch(0.21 0.008 85 / 0.88)` | panel base (dark manila glass) |
| `--ut-surface-2` | `oklch(0.25 0.01 85 / 0.9)` | raised layer (tooltips, chips) |
| `--ut-line` | `oklch(0.87 0.02 85 / 0.14)` | hairlines |
| `--ut-paper` | `oklch(0.93 0.015 90)` | primary text (never #fff) |
| `--ut-ink-dim` | `oklch(0.93 0.015 90 / 0.62)` | secondary text |
| `--ut-ink-faint` | `oklch(0.93 0.015 90 / 0.4)` | tertiary/meta text |
| `--ut-stamp` | `oklch(0.58 0.19 27)` | stamped red — classification, Disconfirmed |

Semantic evidentiary hues (existing, kept): emerald = documented/observed, violet = AI/resonant, amber = temporal/contested, zinc = unverified, red = disconfirmed.

**Provenance delineation rule**: solid borders = sourced/deterministic content; **dashed borders = AI inference** (the analytical layer, per the terminology ruling). Never mix.

## Typography

- UI labels, meta, stamps, badges: **Martian Mono** (`--font-martian-mono`), uppercase, 9–10px, tracking 0.12–0.16em. This is the OCR/teletype voice.
- Body/prose in panels: existing sans stack, 11–12.5px.
- **Special Elite** (`--font-special-elite`): ONE wordmark moment per surface (the dossier panel title). Never in buttons, data, or repeated labels.

## Signature elements (the hallmark set)

1. **Clipped dossier corner** — `clip-path` 12px diagonal cut on the top-right of major panels ("secret-file cuts").
2. **Bracketed evidentiary badges** — `[ CORROBORATED ]` in mono; the UI mirrors the wire format (`[State]` prefixes in edge reasoning). Provenance made visible.
3. **Redaction-bar skeletons** — loading states are redacted lines that "declassify" into text. Never spinners inside content.
4. **File-reference micro-header** — `UT·RC // N:07 · E:05` mono metadata line on dossier panels.

## Texture

Film grain (inline SVG feTurbulence, ~5% opacity) + warm dot grid on the canvas + soft vignette. No scanlines, no glassmorphism-as-default, no glow bloom.

## Motion

State only: 150–250ms ease-out transitions; existing spring panel entries kept; redaction shimmer only while loading. No decorative loops.

## Bans (inherited + local)

Side-stripe borders (`border-l-2` accents), gradient text, hero-metric blocks, identical card grids, cheap meta-labels ("SECTION 01"), display fonts in controls, neon above 15% surface share.
