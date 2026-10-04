# LittleBook

**Created:** 2026-07-18  
**Source:** [codepen.io/jh3y/pen/ExPVzBY](https://codepen.io/jh3y/pen/ExPVzBY) — *Little book of Jhey w/ ScrollTrigger*  
**Location:** `apps/app/src/components/little-book/`

## Purpose

Scroll-scrubbed 3D book: fixed volume in the viewport, tall scroll track flips covers + 10 interior leaves. Page faces link out to jhey CodePens; back-cover logo fades in near the end.

## Architecture

```
LittleBook (scroll track + GSAP ScrollTrigger)
└── .little-book__book (fixed, perspective)
    ├── spine
    ├── front cover (code snippet + bear sticker)
    ├── leaves[10] × (front/back sketch links)
    └── back cover (code + logo insert)
```

## Storybook

**Components/LittleBook** → scroll the preview to turn pages.
