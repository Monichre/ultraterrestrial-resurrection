---
version: "alpha"
name: "AeroNet Visualization"
description: "Aeronet Visualization Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#9CA3AF"
  secondary: "#6B7280"
  tertiary: "#A69DB9"
  neutral: "#FFFFFF"
  background: "#FFFFFF"
  surface: "#000000"
  text-primary: "#E5E7EB"
  text-secondary: "#9CA3AF"
  border: "#FFFFFF"
  accent: "#9CA3AF"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "60px"
    fontWeight: 400
    lineHeight: "60px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 300
    lineHeight: "16px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "6px"
  sm: "2px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  gap: "6px"
  card-padding: "8px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "8px"
  button-link:
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Flex
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Minimal

## Colors

The color system uses dark mode with #9CA3AF as the main accent and #FFFFFF as the neutral foundation.

- **Primary (#9CA3AF):** Main accent and emphasis color.
- **Secondary (#6B7280):** Supporting accent for secondary emphasis.
- **Tertiary (#A69DB9):** Reserved accent for supporting contrast moments.
- **Neutral (#FFFFFF):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FFFFFF; Surface: #000000; Text Primary: #E5E7EB; Text Secondary: #9CA3AF; Border: #FFFFFF; Accent: #9CA3AF

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 60px, weight 400, line-height 60px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 12px, weight 300, line-height 16px.
- **Labels (`label-md`):** Inter, 14px, weight 400, line-height 20px.

## Layout

Layout follows a flex composition with reusable spacing tokens. Preserve the flex, full bleed structural frame before changing ornament or component styling. Use 6px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a flex / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Flex
- **Content width:** Full Bleed
- **Base unit:** 6px
- **Scale:** 2px, 6px, 8px, 12px, 16px, 24px, 32px
- **Section padding:** 24px
- **Card padding:** 8px, 12px, 14px
- **Gaps:** 6px, 8px, 12px, 20px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #FFFFFF; 1px #3F3F46; 1px #52525B
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px inset; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.2) 0px 0px 15px 0px
- **Blur:** 12px

## Shapes

Shapes rely on a tight radius system anchored by 16px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 16px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Primary:** background #FFFFFF, text #000000, radius 9999px, padding 8px, border 0px solid rgb(229, 231, 235).
- **Links:** text #9CA3AF, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 6px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 16px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 2000ms and 150ms. Easing favors ease and 0. Hover behavior focuses on text and color changes.

**Motion Level:** moderate

**Durations:** 2000ms, 150ms

**Easings:** ease, 0, 0.2, 1), cubic-bezier(0, cubic-bezier(0.4

**Hover Patterns:** text, color
