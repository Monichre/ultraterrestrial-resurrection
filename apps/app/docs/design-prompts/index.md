## Overview

- Goal: Recreate two poster-like compositions (“HUE” series) as pixel-perfect HTML/CSS using TailwindCSS utility classes plus a small layer of custom CSS.
- Deliverables:
  - Design tokens (colors, typography, spacing, effects).
  - Precise layout specs with pixel measurements (approx. where necessary).
  - Tailwind config snippet (extend theme).
  - Component-oriented HTML structure with Tailwind utilities.
  - Custom CSS for effects not covered by utilities (radial vignette, grain, smoke/nebula blends, fine hairlines).
  - Motion specs (Framer Motion or GSAP) for soft reveals, parallax, and hover micro-interactions.
- Canvas baseline: 1440px × 1440px artboard (square posters). Scale responsively down to 375px width.

---

## Design tokens

- Colors
  - --bg: #E9E9E6
  - --ink: #0E1418
  - --ink-80: rgba(14, 20, 24, 0.80)
  - --ink-60: rgba(14, 20, 24, 0.60)
  - --ink-30: rgba(14, 20, 24, 0.30)
  - --ice: #CFE3ED
  - --cyan-glow: #8BD1E8
  - --grid: rgba(14, 20, 24, 0.10)
  - --white: #FFFFFF

- Typography
  - Display: “Inter Tight”, 700
  - Sans: “Inter”, 300/400/600
  - Tracking
    - Display-wide: 0.16em
    - Small-mono-like captions: 0.22em
  - Baseline grid: 4px

- Shadows/Glows
  - Soft vignette: 0 0 120px 40px rgba(0, 0, 0, 0.45)
  - Cyan nebula inner-glow: 0 0 60px 0 rgba(139, 209, 232, 0.35)

- Borders
  - Hairline: 1px
  - Grid hairline: 1px rgba(14, 20, 24, 0.10)

- Radii
  - none; compositions are rectilinear with semicircle masks

- Motion
  - enterFade: 360ms, ease-out
  - floatSlow: 8,000ms, ease-in-out, y: -8px to 8px
  - parallax: 900ms, ease-out on scroll
  - line-draw: 700ms, ease-in

---

## Global canvas and spacing

- Poster-1 container: 1440px × 1440px
  - Safe margin: 120px on all sides
- Poster-2 container: 1440px × 1440px
  - Safe margin: 120px on all sides

If the viewport is narrower than 1440px, scale down proportionally with max-w: 100% and aspect-square.

---

## Composition A (left image) — “HUE Vertical + Half-Circle Vignette”

- Overall alignment
  - Main vertical stack centered horizontally around x ≈ 780px
  - “H U E” vertical word flush-left at x ≈ 220px
- Key elements (top-to-bottom, left-to-right)
    1) Background
        - Solid bg: --bg
        - Subtle noise layer: multiply, opacity 0.15
    2) Vertical “H U E”
        - Letters stacked, each line height ≈ 168px
        - Font: Inter Tight 900
        - Size: 144px
        - Color: --ink
        - Tracking: 0.12em
        - “E” has a 1px offset underline and corner ticks
    3) Central column (mask)
        - Column width: 356px
        - Height: 880px
        - Left edge is a perfect semicircle (radius: 440px) clipped out of a dark disk behind
        - Right side straight
    4) Nebula panel (left half of column)
        - Width: 176px
        - Blend: screen
        - Cyan particles concentrated mid-top; glow: cyan-glow
    5) Lunar/rock panel (right half)
        - Grayscale image; overlay gradient bottom-to-right to black
    6) Dark circular vignette
        - Circle diameter: 960px
        - Center ≈ (980px, 640px)
        - Outer to inner gradient: rgba(0,0,0,0.00) → rgba(0,0,0,0.55)
        - Clipped so left half is overlapped by the vertical column
    7) Tech-lines and ticks
        - 1px lines in --ink-30
        - Sparse micro text blocks (2–3 chars wide), 9px/11px leading, opacity 0.6
    8) “PRUDICENCE ARBPICTIIAL” block
        - Upper-right, x ≈ 980px, y ≈ 260px
        - Font: Inter 600 20px; tracking 0.22em
        - Secondary cap labels 11px, 0.28em
    9) Grid chip
        - 120px × 140px, 1px grid (grid hairline), opacity 0.45, masked by circle falloff

---

## Composition B (right image) — “HUE Big H + Smoke Crosshair”

- Overall alignment
  - Giant “H” formed by two black rectangles with a lighter column overlaid
- Key elements
    1) Background
        - Same as A
    2) Giant “H”
        - Left bar: 300px × 940px, fill --ink
        - Right bar: 300px × 940px, fill --ink, x-offset ≈ 700px
        - Crossbar: 420px × 300px, fill --ink, connecting middle
    3) Vertical data strip (center overlay)
        - 140px × 880px, gradient: rgba(255,255,255,0.10) → rgba(255,255,255,0.00)
        - Noise + white ticks (1px) every 14px
        - Small white microtype lines 9px
    4) Smoke/nebula plume
        - Origin around the right half; width ≈ 760px
        - Blend: screen; color bias to cyan-gray
        - Softness: 32px blur, opacity 0.6
    5) Crosshair frame
        - 1px lines, 860px tall, 620px wide; top tick extends above content 80px
    6) “HUE MEDIICAL” word mark
        - “HUE”: Inter 300, 92px, tracking 0.18em, color --ink-80
        - “MEDIICAL” caption: Inter 400, 20px, 0.28em, x-offset 8px below baseline
    7) Small square module
        - 56px × 56px, stroke 1px, fill transparent, placed near bottom-right of crosshair

---

## Tailwind setup (extend theme)

```js
// tailwind.config.js
export default {
    theme: {
        extend: {
            colors: {
                bg: '#E9E9E6',
                ink: '#0E1418',
                ice: '#CFE3ED',
                cyan: '#8BD1E8'
            },
            fontFamily: {
                display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'system-ui', 'sans-serif']
            },
            letterSpacing: {
                wide2: '0.16em',
                wide3: '0.22em',
                wide4: '0.28em'
            },
            boxShadow: {
                vignette: '0 0 120px 40px rgba(0,0,0,0.45)',
                glowCyan: '0 0 60px 0 rgba(139,209,232,0.35)'
            },
            spacing: {
                112: '28rem' // helper
            }
        }
    },
    plugins: []
}
```

---

## HTML structure

```html
<!-- Global canvas -->
<div class="min-h-screen w-full bg-bg text-ink flex flex-col items-center gap-24 py-16">
    <!-- Poster A -->
    <section class="relative w-[1440px] max-w-full aspect-square overflow-hidden">
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(200%_200%_at_50%_50%,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0)_60%)]"></div>

        <!-- Vertical H U E -->
        <div class="absolute left-[220px] top-[260px] flex flex-col items-start gap-[68px] font-display font-black tracking-[0.12em]">
            <span class="text-[144px] leading-[168px]">H</span>
            <span class="text-[144px] leading-[168px]">U</span>
            <div class="relative">
                <span class="text-[144px] leading-[168px]">E</span>
                <!-- ticks -->
                <span class="absolute left-[-22px] top-[152px] h-[1px] w-[64px] bg-ink/30"></span>
                <span class="absolute left-[116px] top-[-24px] h-[32px] w-[1px] bg-ink/30"></span>
            </div>
        </div>

        <!-- Dark circle vignette -->
        <div class="absolute left-[640px] top-[160px] w-[960px] h-[960px] rounded-full shadow-vignette"></div>

        <!-- Central column with semicircle left mask -->
        <div class="absolute left-[560px] top-[280px] w-[356px] h-[880px] overflow-hidden">
            <div class="absolute inset-0 bg-ink"></div>

            <!-- left semi-circle mask via pseudo handled in CSS -->
            <div class="absolute inset-0 hueA--leftMask pointer-events-none"></div>

            <!-- nebula left -->
            <img src="{nebulaImgUrl}" alt="" class="absolute left-0 top-0 w-[176px] h-full object-cover mix-blend-screen shadow-glowCyan opacity-90" />
            <!-- lunar right -->
            <img src="{lunarImgUrl}" alt="" class="absolute left-[176px] top-0 w-[180px] h-full object-cover" />

            <!-- micro white ticks -->
            <div class="absolute left-[176px] top-[40px] w-[1px] h-[800px] bg-ink/60"></div>
        </div>

        <!-- Upper-right label -->
        <div class="absolute left-[980px] top-[260px] text-right">
            <div class="font-sans font-semibold text-[20px] tracking-wide3">PRUDICENCE<br/> ARBPICTIIAL</div>
            <div class="mt-[12px] text-[11px] tracking-wide4 text-ink/70">{smallMeta}</div>
            <!-- grid chip -->
            <div class="mt-[16px] hueA--gridChip w-[120px] h-[140px]"></div>
        </div>

        <!-- Tech lines -->
        <div class="hueA--hairlines pointer-events-none absolute inset-0"></div>
    </section>

    <!-- Poster B -->
    <section class="relative w-[1440px] max-w-full aspect-square overflow-hidden">
        <!-- background texture -->
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(200%_200%_at_50%_50%,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0)_60%)]"></div>

        <!-- Giant H -->
        <div class="absolute left-[260px] top-[250px] w-[300px] h-[940px] bg-ink"></div>
        <div class="absolute left-[960px] top-[250px] w-[300px] h-[940px] bg-ink"></div>
        <div class="absolute left-[520px] top-[520px] w-[420px] h-[300px] bg-ink"></div>

        <!-- Vertical data strip -->
        <div class="absolute left-[650px] top-[280px] w-[140px] h-[880px] hueB--dataStrip"></div>

        <!-- Smoke -->
        <img src="{smokeImgUrl}" alt="" class="absolute left-[820px] top-[360px] w-[760px] h-[620px] object-cover mix-blend-screen opacity-60 blur-[32px] pointer-events-none" />

        <!-- Crosshair frame -->
        <div class="absolute left-[820px] top-[200px] w-[620px] h-[860px] hueB--frame"></div>

        <!-- Word mark -->
        <div class="absolute left-[300px] top-[760px]">
            <div class="font-sans font-light text-[92px] tracking-wide2 text-ink/80 leading-none">H U E</div>
            <div class="mt-[12px] text-[20px] tracking-wide4 text-ink/70">MEDIICAL</div>
        </div>

        <!-- Small square -->
        <div class="absolute left-[1360px] top-[900px] w-[56px] h-[56px] hueB--square"></div>
    </section>
</div>
```

---

## Custom CSS (vanilla + utilities)

```css
:root{
    --bg:#E9E9E6;
    --ink:#0E1418;
    --grid:rgba(14,20,24,0.10);
    --ink30:rgba(14,20,24,0.30);
    --ink60:rgba(14,20,24,0.60);
    --ink80:rgba(14,20,24,0.80);
    --cyan:#8BD1E8;
}

/* Grain */
body::after{
    content:"";
    position:fixed;
    inset:0;
    pointer-events:none;
    background-image:url("{noisePngUrl}");
    opacity:0.15;
    mix-blend-mode:multiply;
}

/* Poster A specifics */
.hueA--leftMask{
    -webkit-mask:
        radial-gradient(440px 440px at -84px 50%, transparent 440px, #000 441px) left/100% 100% no-repeat;
    mask:
        radial-gradient(440px 440px at -84px 50%, transparent 440px, #000 441px) left/100% 100% no-repeat;
}
.hueA--gridChip{
    position:relative;
    background-image:
        linear-gradient(to right, var(--grid) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid) 1px, transparent 1px);
    background-size:12px 12px, 12px 12px;
    background-position:0 0, 0 0;
}
.hueA--hairlines{
    background:
        linear-gradient(var(--ink30), var(--ink30)) 220px 880px/64px 1px no-repeat,
        linear-gradient(var(--ink30), var(--ink30)) 520px 640px/1px 340px no-repeat,
        linear-gradient(var(--ink30), var(--ink30)) 980px 280px/1px 220px no-repeat;
}

/* Poster B specifics */
.hueB--dataStrip{
    position:relative;
    background:
        linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.00));
    overflow:hidden;
}
.hueB--dataStrip::before{
    content:"";
    position:absolute;
    inset:0;
    background:
        repeating-linear-gradient(to bottom, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 1px, transparent 1px, transparent 14px);
    opacity:0.35;
    mix-blend-mode:screen;
}
.hueB--dataStrip::after{
    content:"";
    position:absolute;
    inset:0;
    background-image:url("{starsNoisePngUrl}");
    opacity:0.25;
    mix-blend-mode:screen;
}
.hueB--frame{
    box-shadow:inset 0 0 0 1px var(--ink30);
}
.hueB--frame::before,
.hueB--frame::after{
    content:"";
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    width:1px;
    background:var(--ink30);
}
.hueB--frame::before{ top:-80px; height:80px; }
.hueB--frame::after{ bottom:-80px; height:80px; }
.hueB--square{
    box-shadow:inset 0 0 0 1px var(--ink60);
    background:transparent;
}

/* Microtype utility */
.micro{
    font-family: 'Inter', system-ui, sans-serif;
    font-size:9px;
    line-height:11px;
    letter-spacing:0.22em;
    color:rgba(255,255,255,0.8);
}

/* Radial vignette helper (reusable) */
.vignette{
    position:absolute;
    border-radius:9999px;
    box-shadow:0 0 120px 40px rgba(0,0,0,0.45);
}

/* Responsive scaling */
@media (max-width: 1024px){
    section{ transform: scale(0.8); transform-origin: top center; height: calc(100vw); }
}
@media (max-width: 768px){
    section{ transform: scale(0.6); }
}
@media (max-width: 480px){
    section{ transform: scale(0.42); }
}
```

---

## Variable placeholders and content mapping

- {nebulaImgUrl}: cyan starfield/nebula texture (approx. 600px × 1200px).
- {lunarImgUrl}: grayscale lunar/rock texture (approx. 800px × 1200px).
- {smokeImgUrl}: gray-cyan smoke PNG with transparency (approx. 1600px × 1200px).
- {noisePngUrl}: seamless film-grain tile (256px × 256px).
- {starsNoisePngUrl}: faint star speckle tile.
- {smallMeta}: short uppercase codes like “W09 HEX NET CLASS”.

All image textures should be high-contrast monochrome to preserve the screen/multiply blends.

---

## Interaction and animation specs

- Page load
  - Fade-in all sections: opacity 0 → 1 over 360ms (ease-out).
- Parallax on scroll (GSAP suggestion)
  - Circle vignette (A): translateY from 24px to -24px within viewport.
  - Smoke (B): translateX 0px → -30px and translateY 0px → -30px.
- Hover micro-interactions
  - On hovering Poster A central column:
    - Increase cyan-glow intensity to 0 0 90px 10px rgba(139,209,232,0.55) over 180ms.
  - On hovering Poster B data strip:
    - Ticks brightness increase (opacity 0.35 → 0.7), subtle y drift using CSS animation floatSlow.

Example GSAP snippet (pseudo):

```js
gsap.to('.vignette', { y: -24, scrollTrigger: { trigger: '.vignette', scrub: true }});
gsap.to('.hueB--dataStrip', { y: 8, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
```

---

## Measurement notes

- Some distances measured are approx. due to image softness:
  - Poster A: circle center and grid chip offsets (approx. ±6px).
  - Poster B: smoke plume spread and right bar x-offset (approx.).
- All explicit pixel values include units; use Tailwind’s arbitrary values to match.

---

## Developer checklist

- Load Inter and Inter Tight via your font pipeline.
- Provide high-res textures for nebula, lunar, smoke, and noise.
- Ensure color management with sRGB.
- Verify blend modes supported across browsers; provide fallbacks (no-blend backgrounds) if needed.
- Keep containers aspect-square to maintain poster proportions.

---

## Quick content variables

|:---|:---|
|{pageTitle}|HUE Series Posters|
|{seriesTag}|PRUDICENCE / MEDIICAL|
|{author}|{userName}|
|{year}|2025|

This spec + code will let a front-end engineer reproduce the two provided compositions with high fidelity and responsive behavior.
