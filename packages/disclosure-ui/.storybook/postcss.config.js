/**
 * PostCSS config for the isolated disclosure-ui Storybook.
 *
 * Tailwind 4 CSS-first config — no tailwind.config.js needed. The
 * `@import "tailwindcss"` and `@source` directives live in .storybook/preview.css
 * and styles/tokens.css.
 *
 * This file is wired into Vite explicitly via `viteFinal` in main.ts because
 * Vite resolves PostCSS config from the project root, not from .storybook/.
 *
 * Note: the plugin is imported directly (not as a string) because Vite's
 * PostCSS loader does not resolve string-form plugin names the way Next.js does.
 */
import tailwindcss from '@tailwindcss/postcss'

const config = {
  plugins: [tailwindcss],
}

export default config
