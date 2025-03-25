# CLAUDE.md - Ultraterrestrial App Guidelines

## Build/Lint/Test Commands

- Dev server: `npm run dev` (Next.js development server)
- Build: `npm run build`
- Start: `npm run start` (production server)
- Lint: `npm run lint`
- Storybook: `npm run storybook` and `npm run build-storybook`
- Create new component: `npm run new` (uses plop templates)
- Tests: `npx vitest run` (all tests) or `npx vitest run [file-name]` (specific test)
- Watch tests: `npx vitest watch`
- UI component tests: `npx vitest run storybook` (Storybook integration)

## Code Style Guidelines

- **Formatting**: Prettier with semicolons disabled, single quotes, 100 char line length
- **Imports**: Group by external/internal/types, absolute paths with `@/` prefix
- **TypeScript**: Strict typing, interfaces over types, avoid enums, use const maps, `satisfies` operator
- **Components**: Favor React Server Components, minimize 'use client' directives, use Suspense
- **Naming**: PascalCase for components/types, camelCase for variables/functions, prefix handlers with "handle"
- **State**: Use React context for global state, `useActionState` for forms, URL state with nuqs
- **Error Handling**: Implement error boundaries, provide meaningful error messages
- **CSS**: Tailwind 4.0 for styling, custom components for reusable UI elements
- **File Structure**: Feature-based with domain-driven design, lowercase with dashes for directories
- **Performance**: Optimize for Web Vitals, favor RSC, minimize client-side state
- **ESLint**: Next.js core-web-vitals rules, with some React display rules disabled

## Tech Stack

- NextJS 15 (App Router), TypeScript, React 19
- Tailwind CSS with Animation, Shadcn UI, Radix UI
- Framer Motion, GSAP for animations
- 3D: Three.js / R3F (React Three Fiber)
- Data Visualization: D3, deck.gl, react-globe.gl
- AI: OpenAI, Anthropic, LangChain, Inngest for workflows
- Testing: Vitest with Storybook test integration and Playwright