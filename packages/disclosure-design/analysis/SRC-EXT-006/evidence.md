# Evidence Analysis: SRC-EXT-006 (HyperDesign)

## Source
- **Identifier**: SRC-EXT-006
- **Path**: `/Users/liamellis/Desktop/disclosure-design-references/workers/acquisition/clones/SRC-EXT-006_hyperdesign`

## Visual Evidence
### 1. Color Palette
- **Background**: `#ffffff` (Pure White) - Observed in `:root`.
- **Foreground**: `#000000` (Pure Black) - Observed in `:root`.
- **Neutrals**: `gray-100` (bg for labels), `gray-300` (border), `gray-500` (text).
- **Accents**: Pure Black is used for all heavy borders and shadows.

### 2. Typography
- **Primary Font**: Manrope - Observed in `:root` and `body`.
- **Labels/Tokens**: Mono font, bold, uppercase, `10px`.

### 3. Layout & Components
- **Brutalist Shadow**: Custom utility `shadow-brutal` (`box-shadow: 4px 4px 0px 0px #000000`).
- **Border System**: Heavy `border-2 border-black` or `border-4 border-black`.
- **Component Style**:
  - **Tokens**: Grid of cards with `border-2 border-black bg-white shadow-brutal-sm`.
  - **Typography Samples**: Left-border accent `border-l-4 border-black pl-4`.
  - **Toasts**: `bg-black text-white font-mono text-xs font-bold uppercase px-4 py-2.5 border-2 border-black shadow-brutal-sm`.

### 4. Interaction & Effects
- **Transitions**: Hover effects like `hover:-translate-y-0.5 hover:shadow-brutal`.
- **Animations**: `animate-fade-in-up` using a cubic-bezier (`0.16, 1, 0.3, 1`) for a snappy, mechanical feel.

## Analysis & Interpretation
- **Stance**: Neo-Brutalist / Swiss Modernism. It rejects gradients, soft shadows, and blur in favor of high-contrast edges and hard offsets.
- **Intent**: "The Blueprint". The design feels like a technical specification or a drafting board. It communicates precision, authority, and lack of ornament.
- **Confidence**: High (direct CSS and TSX evidence).
