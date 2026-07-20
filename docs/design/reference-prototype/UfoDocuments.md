Overview
- We added two new full-height UFO-themed documents beneath the original page to create a continuous archive stack.
- Each document is built with a shared DocumentFrame to ensure consistent paper texture, crease, and noise overlays.
- All screenshots are copied into public/images and referenced with their root-relative paths, which is the recommended way to use static assets under public in Next.js [^3].

Key Modules
- DocumentFrame: Shared container providing document-texture, noise overlay, and center crease.
- DocumentOne: The original page (header and anchored bottom section).
- DocumentA: Collage page composed from the "UN:DEFECTAL" scene (main) with a side ledger.
- DocumentB: Crosshair abstract page with two inset panels and marginalia.

Layout and Data Flow
- app/page.tsx exports Page() which renders DocumentOne -> DocumentA -> DocumentB.
- Images are static local files served from /public (e.g., /images/doc-a-main.png) [^3].
- Overlays (crease, tints, vignettes) are presentational only and marked aria-hidden.

Styling Notes
- The paper background uses .document-texture (diagonal repeating-linear-gradient) and .noise-pattern from globals.css.
- Borders, subtle gradients, and mix-blend multiply replicate the scanned/aged look.
- Typography uses system mono for ledger feel with tracking adjustments.

Accessibility
- Each img has descriptive alt text.
- Decorative layers use aria-hidden to avoid noise for screen readers.
