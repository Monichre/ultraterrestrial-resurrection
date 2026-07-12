# Font Implementation

## Added Fonts
- **Special Elite**: Typewriter-style font perfect for classified documents
- **Anton**: Bold condensed font for headers and emphasis
- **Caveat**: Handwritten-style font for annotations and notes
- **PP Neue Montreal**: Modern sans-serif (local font) for clean typography

## Implementation Details
- All fonts configured with proper Next.js font optimization
- CSS variables created for each font family
- Utility classes added to globals.css for easy application
- Fonts loaded in layout.tsx with proper variable assignment

## Usage Examples
\`\`\`tsx
// Apply via Tailwind classes
<div className="font-special-elite">Classified Document</div>
<h1 className="font-anton">UN:DEFECTAL</h1>
<span className="font-caveat">Handwritten note</span>
<p className="font-pp-neue-montreal">Modern text</p>

// Apply via CSS variables
<div style={{ fontFamily: 'var(--font-special-elite)' }}>
  Typewriter text
</div>
\`\`\`

## Notes
- PP Neue Montreal requires font files in public/fonts/ directory
- All fonts use 'swap' display for better performance
- Font variables are available globally after layout setup
