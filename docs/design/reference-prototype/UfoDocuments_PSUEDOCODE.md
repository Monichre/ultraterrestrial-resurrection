Goal:
- Add two new full-height UFO-themed documents directly under the existing document.
- Maintain texture, crease, stains, typography, and archival aesthetic.
- Use the provided screenshots as primary visual content.

Plan:
1) Create a reusable DocumentFrame that encapsulates:
   - document-texture background
   - yellowish tint overlay, noise overlay
   - center crease line
   - min-h-screen and max-w-4xl sizing
2) Keep DocumentOne (existing) intact and wrapped in DocumentFrame.
3) Build DocumentA:
   - Header row with bold archival title + small ledger text
   - Main large scan area using image "/images/doc-a-main.png"
   - Vertical fold overlay, subtle scratches/tint
   - Right sidebar with boxed annotations and indices
   - Footer paragraph grid and big code mark (ISTO: 95)
4) Build DocumentB:
   - Minimal header (title, index)
   - Main abstract background ("/images/doc-b-abstract.png") with crosshair lines
   - Two lower collage panels using "/images/doc-b-textstorm.png" and "/images/doc-b-stamp.png"
   - Footer marginalia and vignette
5) Wire up in Page():
   - Render DocumentOne, then DocumentA, then DocumentB.
6) Accessibility:
   - Provide alt text for all images
   - Mark decorative overlays as aria-hidden
7) Styling:
   - Tailwind for layout/typography
   - Reuse global .document-texture and .noise-pattern from globals.css
8) Assets:
   - Add four images under public/images via Next.js asset syntax and reference using /images path.
