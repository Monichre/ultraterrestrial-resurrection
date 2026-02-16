# Futuristic Space Logistics Landing Page — Design Specification

## Source
- **URL**: https://futuristic-space-22.aura.build/
- **Template**: VELOS — Interstellar Logistics (Aura Build)

---

## 1. Global Design Tokens

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#0A0A0A` | Page background, ultra-dark |
| `--color-bg-secondary` | `#111111` | Card backgrounds, sections |
| `--color-bg-card` | `#141414` | Elevated card surfaces |
| `--color-bg-card-hover` | `#1A1A1A` | Card hover state |
| `--color-text-primary` | `#FFFFFF` | Headings, primary text |
| `--color-text-secondary` | `#9CA3AF` | Body copy, muted labels (~gray-400) |
| `--color-text-tertiary` | `#6B7280` | Timestamps, metadata (~gray-500) |
| `--color-accent-green` | `#22C55E` | Active status indicators, badges |
| `--color-accent-blue` | `#3B82F6` | Links, interactive elements |
| `--color-accent-amber` | `#F59E0B` | Warning states, highlights |
| `--color-border` | `#1F1F1F` | Subtle card borders |
| `--color-border-hover` | `#2A2A2A` | Border on hover |
| `--color-overlay` | `rgba(0,0,0,0.6)` | Image overlays |

### Typography
| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Nav brand | Monospace / `font-mono` | 700 | 14px | 1.2 | 2px (tracking-widest) |
| Section label | Monospace / `font-mono` | 500 | 12px | 1.4 | 3px (uppercase) |
| H1 hero | Sans-serif (Inter/Geist) | 800 | 72–96px | 0.9 | -2px |
| H2 section | Sans-serif | 700 | 48–56px | 1.0 | -1.5px |
| H3 card | Sans-serif | 600 | 24–28px | 1.2 | -0.5px |
| H4 sub-card | Sans-serif | 600 | 18px | 1.3 | 0 |
| Body | Sans-serif | 400 | 16px | 1.6 | 0 |
| Caption/Meta | Monospace | 400 | 12–13px | 1.4 | 1px |
| Stat number | Sans-serif | 800 | 48–64px | 1.0 | -1px |

### Spacing Scale
- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 16px
- `--space-lg`: 24px
- `--space-xl`: 32px
- `--space-2xl`: 48px
- `--space-3xl`: 64px
- `--space-4xl`: 96px
- `--space-5xl`: 128px

### Border Radius
- Cards: `12px` (`rounded-xl`)
- Buttons: `9999px` (`rounded-full`) for pill buttons, `8px` for rectangular
- Badges: `9999px` (`rounded-full`)
- Images: `12px` (`rounded-xl`)

### Shadows
- Card shadow: `0 0 0 1px rgba(255,255,255,0.05)`
- Elevated: `0 4px 24px rgba(0,0,0,0.4)`
- Glow (accent): `0 0 20px rgba(34,197,94,0.15)` (green glow)

---

## 2. Layout Architecture

### Container
- Max-width: `1280px`
- Padding: `0 24px` (mobile), `0 48px` (tablet), `0 64px` (desktop)
- Centered with `margin: 0 auto`

### Grid System
- Primary layout: CSS Grid `grid-cols-12` with `24px` gap
- Card grids: `grid-cols-1` → `grid-cols-2` → `grid-cols-3` (responsive)
- Section spacing: `128px` vertical (`py-32`)

---

## 3. Component Specifications

### 3.1 Navigation Bar
```
Position: fixed, top: 0, z-index: 50
Height: 64px
Background: rgba(10,10,10,0.8) + backdrop-blur(12px)
Border-bottom: 1px solid var(--color-border)
```
- **Left**: Brand mark "VELOS" — monospace, uppercase, tracking `3px`, `14px`, weight 700
- **Center**: Nav links — `font-mono`, `12px`, uppercase, tracking `2px`, color `--color-text-secondary`, hover → `--color-text-primary`, transition `color 200ms ease`
- **Right**: CTA button "View Manifest" — pill shape, border `1px solid var(--color-border)`, `12px` font, hover → `background: #1A1A1A`

### 3.2 Hero Section
```
Padding-top: 160px
Padding-bottom: 96px
Text-align: center
```
- **Overline**: Monospace, `12px`, uppercase, tracking `3px`, color `--color-text-tertiary`
  - Text: "Mission Log 2024"
- **Headline**: "DARK & MATTER" — `font-size: clamp(48px, 8vw, 96px)`, weight 800, line-height 0.9, letter-spacing `-3px`
  - Gradient text possible: `background: linear-gradient(180deg, #FFF 0%, #666 100%); -webkit-background-clip: text`
- **Subhead**: `18px`, weight 400, color `--color-text-secondary`, max-width `560px`, margin `0 auto`, margin-top `24px`

### 3.3 Fleet/Mission Tabs
```
Display: flex, gap: 8px
Justify-content: center
Margin-top: 48px
```
- Each tab: pill button, `padding: 8px 20px`, `border-radius: 9999px`, `font-size: 13px`, monospace
- **Inactive**: `background: transparent`, `border: 1px solid var(--color-border)`, color `--color-text-secondary`
- **Active**: `background: #FFFFFF`, `color: #000000`, `font-weight: 600`
- Transition: `all 200ms ease`

### 3.4 Featured Mission Card (Ares Heavy — Large Card)
```
Position: relative
Border-radius: 12px
Overflow: hidden
Aspect-ratio: 16/10 (approx.)
Border: 1px solid var(--color-border)
```
- **Background**: Full-bleed image with `object-fit: cover`
- **Overlay**: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)`
- **Badge top-left**: "MK-IV Config" + "Active" — flex row, gap `8px`
  - Config badge: `background: rgba(255,255,255,0.1)`, `backdrop-filter: blur(8px)`, `border-radius: 6px`, `padding: 4px 12px`, `font-size: 12px`, monospace
  - Active badge: green dot (`width: 6px`, `height: 6px`, `border-radius: 50%`, `background: #22C55E`) + text "Active", `font-size: 12px`, color `#22C55E`
- **Coordinates**: Bottom-left area, `font-size: 11px`, monospace, color `--color-text-tertiary`
  - `LAT: 28.5721° N  LNG: 80.6480° W`
- **Content overlay** (bottom):
  - Number: "01" — `font-size: 64px`, weight 800, color `rgba(255,255,255,0.1)` (watermark style)
  - Title: "Ares Heavy" — `24px`, weight 700
  - Description: `14px`, color `--color-text-secondary`, max-width `400px`
- **Stats row**: Payload `45,000 KG` / Thrust `7.2 MN`
  - Label: `11px`, monospace, uppercase, color `--color-text-tertiary`
  - Value: `16px`, weight 700, color `--color-text-primary`

### 3.5 Secondary Mission Cards (Gateway Station, Titan Rover)
```
Border-radius: 12px
Background: var(--color-bg-card)
Border: 1px solid var(--color-border)
Padding: 0 (image top) + 24px (content)
```
- **Image**: `aspect-ratio: 16/9`, `border-radius: 12px 12px 0 0`, `object-fit: cover`
- **Number**: "02" / "03" — `font-size: 48px`, weight 800, color `rgba(255,255,255,0.08)`
- **Tag**: "Orbital Habitat" / "Surface Ops" — `12px`, monospace, uppercase, color `--color-accent-blue`
- **Title**: `20px`, weight 600
- **Description**: `14px`, color `--color-text-secondary`
- **Hover**: `border-color: var(--color-border-hover)`, `transform: translateY(-2px)`, transition `all 300ms ease`

### 3.6 Infrastructure Section
```
Background: var(--color-bg-secondary)
Padding: 96px 0
Border-radius: 16px (if contained)
```
- **Label**: "Global Network" — monospace, `12px`, uppercase, tracking `3px`, color accent
- **Headline**: "Interplanetary Infrastructure" — `48px`, weight 700
- **Body**: `16px`, max-width `640px`, color `--color-text-secondary`
- **Sub-cards** (Zero-G Manufactory, He-3 Energy Grid):
  - `background: var(--color-bg-card)`, `border: 1px solid var(--color-border)`, `border-radius: 12px`, `padding: 24px`
  - Title: `18px`, weight 600
  - Description: `14px`, color `--color-text-secondary`

### 3.7 Orbital Station Image Card
```
Position: relative
Border-radius: 16px
Overflow: hidden
```
- **Image**: Full bleed, `object-fit: cover`
- **Overlaid info panels**: Glass-morphism cards
  - `background: rgba(255,255,255,0.05)`
  - `backdrop-filter: blur(16px)`
  - `border: 1px solid rgba(255,255,255,0.08)`
  - `border-radius: 12px`
  - `padding: 16px 20px`
- **Docking Bay A**: label + "Capacity: 4 Heavy Cruisers" + "Status: Operational"
- **Command Spire**: label + "Personnel: 420 active" + "Security: Level 5"

### 3.8 Timeline / Chronology Section
```
Layout: Alternating left-right with vertical line
Vertical line: width 1px, background var(--color-border), centered
```
- **Year marker**: Large number `font-size: 96px`, weight 800, color `rgba(255,255,255,0.05)` (ghost text)
- **Year badge**: `font-size: 14px`, monospace, `background: var(--color-bg-card)`, `border: 1px solid var(--color-border)`, `border-radius: 9999px`, `padding: 4px 16px`
- **Event title**: `20px`, weight 600
- **Event description**: `14px`, color `--color-text-secondary`
- **Milestone markers**: Foundation (2030), First Light (2042), Mars Colony (2055)

### 3.9 Hull Integrity / Materials Section
```
Section label: "Log" + "VOL. III"
Layout: Horizontal scroll or 3-column grid
```
- **Material cards** (Ceramic Shield, Solar Array, Graphene Weave):
  - `width: ~380px`, `border-radius: 12px`, `overflow: hidden`
  - `border: 1px solid var(--color-border)`
  - **Image top**: `aspect-ratio: 4/3`, `object-fit: cover`
  - **Content**: `padding: 24px`
  - **Title**: `18px`, weight 600
  - **Tag**: e.g., "Thermal Class A" — `12px`, monospace, color accent
  - **Spec grid**: 2-column key-value pairs
    - Key: `11px`, monospace, uppercase, color `--color-text-tertiary`
    - Value: `14px`, weight 600, color `--color-text-primary`
  - **Tier badge**: "Tier S" / "Tier A" / "Tier X"
    - `background: var(--color-bg-card)`, `border: 1px solid var(--color-border)`, `border-radius: 6px`, `padding: 4px 12px`, `font-size: 12px`
  - **Progress bar**: Full-width bar at bottom
    - Container: `height: 4px`, `background: rgba(255,255,255,0.05)`, `border-radius: 2px`
    - Fill: `background: linear-gradient(90deg, #22C55E, #3B82F6)`, width varies

### 3.10 Core Systems Section
```
Background: var(--color-bg-primary)
Layout: Left text + Right interactive panel
```
- **Label**: "System Architecture" — monospace, `12px`, uppercase
- **Headline**: "Core Systems" — `48px`, weight 700
- **Body**: `16px`, color `--color-text-secondary`
- **CTA**: "View Schematics" — pill button, same style as nav CTA

**System cards** (Nav-AI Core, Aegis Hull, Fusion Drive):
- `background: var(--color-bg-card)`, `border: 1px solid var(--color-border)`, `border-radius: 12px`, `padding: 20px 24px`
- Icon/status indicator left
- Title: `16px`, weight 600
- Description: `13px`, color `--color-text-secondary`
- Status badge right: "Integrity 100%", "Stable", etc.
  - `font-size: 12px`, monospace
  - Color coded: green for healthy, amber for caution

**HUD-style decorative elements**:
- "Processing..." — blinking text, `animation: blink 1.5s step-end infinite`
- "Target Lock" — status label with dot indicator
- "Online" — green pulse animation
- Scan line animation: horizontal sweep

### 3.11 Partners / Trusted By Section
```
Display: flex
Justify-content: space-between
Align-items: center
Padding: 48px 0
Border-top: 1px solid var(--color-border)
Border-bottom: 1px solid var(--color-border)
```
- Partner logos: "NASA", "SpaceX", "BLUE", "ESA", "AXIOM", "JAXA"
  - `font-size: 16px`, monospace, uppercase, weight 700, color `rgba(255,255,255,0.3)`
  - Hover: color `rgba(255,255,255,0.6)`, transition `opacity 300ms ease`
- Could use infinite scroll marquee: `animation: marquee 30s linear infinite`

### 3.12 Stats Row
```
Display: grid
Grid-template-columns: repeat(4, 1fr)
Gap: 24px
Padding: 64px 0
Text-align: center
```
| Stat | Value | Label |
|---|---|---|
| Market Growth | 4.2% | `font-size: 48px`, weight 800 |
| Active Missions | 128 | Number, suffix via pseudo |
| Failure Rate | 2.0 | Percentage |
| Command Support | 24/7 | Always on |

- Value: `font-size: 48px`, weight 800, color `--color-text-primary`
- Label: `font-size: 13px`, monospace, uppercase, color `--color-text-tertiary`

### 3.13 Careers / Join the Vanguard Section
```
Text-align: center (heading area)
Padding: 128px 0
```
- **Label**: "Open Positions" — monospace, uppercase, `12px`
- **Headline**: "Join the Vanguard." — `48–56px`, weight 700
  - Possible gradient or italic on "Vanguard"
- **Job listing cards**:
  - `display: flex`, `justify-content: space-between`, `align-items: center`
  - `padding: 24px`, `border: 1px solid var(--color-border)`, `border-radius: 12px`
  - `background: var(--color-bg-card)`
  - **Left**: Job title (bold, `16px`), Location, Department
  - **Right**: Arrow icon `→`
  - **Hover**: `border-color: var(--color-border-hover)`, `background: var(--color-bg-card-hover)`, transition `all 200ms ease`

### 3.14 Footer
```
Padding: 48px 0
Border-top: 1px solid var(--color-border)
```
- Nav links: Same monospace style as header
- Copyright / legal text: `12px`, color `--color-text-tertiary`

---

## 4. Animations & Transitions

### Scroll-triggered Entrances (Framer Motion / GSAP)
```js
// Fade-up on scroll
{
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
}
```

### Card Hover
```css
.card {
  transition: transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
```

### Status Pulse (Green dot)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
}
.status-dot { animation: pulse 2s ease-in-out infinite; }
```

### Blink Animation
```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.blink { animation: blink 1.5s step-end infinite; }
```

### Marquee (Partner logos)
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track { animation: marquee 30s linear infinite; }
```

### Number Count-up (Stats)
- Use GSAP `ScrollTrigger` + `CountUp.js` or Framer Motion `useMotionValue`
- Duration: `2000ms`, ease: `power2.out`

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | `< 640px` | Single column, `font-size` hero: `48px`, nav collapses to hamburger |
| Tablet | `640px – 1024px` | 2-column card grid, hero `64px` |
| Desktop | `1024px – 1280px` | Full layout |
| Large | `> 1280px` | Max-width container, centered |

---

## 6. Accessibility Notes
- All images require descriptive `alt` text (e.g., "Ares Heavy rocket launching from Cape Canaveral")
- Minimum contrast ratio 4.5:1 for body text (gray-400 on dark bg meets this)
- Focus states: `outline: 2px solid #3B82F6`, `outline-offset: 2px`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` — disable all animations
