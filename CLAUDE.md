# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Dev**: `bun dev` or `npm run dev` - Start development server
- **Build**: `bun build` or `npm run build` - Build for production
- **Lint**: `bun lint` or `npm run lint` - Run ESLint
- **Test**: `bun vitest` - Run all tests
- **Test Single File**: `bun vitest path/to/test.ts` - Run specific test
- **Storybook**: `bun storybook` - Run Storybook
- **Component Generation**: `bun new` - Generate new component with plop

## Code Style Guidelines
- Use TypeScript with strict mode and explicit type annotations
- React: Use functional components and Server Components when possible
- Naming: camelCase (variables/functions), PascalCase (components/interfaces)
- Formatting: 2-space indentation, single quotes, no semicolons
- Imports: Organize alphabetically with types separated
- Error Handling: Use try/catch with async/await, create custom error classes
- Components: Use named exports, document with JSDoc, optimize with Suspense
- Styling: Follow Shadcn UI, Radix, and Tailwind conventions
- Use early returns for better readability

IMPORTANT: Always run lint before committing code