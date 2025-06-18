---
description: 
globs: 
alwaysApply: true
---
# Code Conventions

This project follows specific coding conventions and best practices.

## Naming Conventions

- **Directories**: Lowercase with dashes (e.g., `animated-beam`)
- **React Components**: PascalCase (e.g., `Button.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utility Functions**: dashes (e.g., `format-date.ts`)
- **Constants**: UPPERCASE with underscores (e.g., `API_URL`)

## File Structure

- React components should export a default component
- Utility functions should use named exports
- Each feature should be self-contained with its own components, hooks, and utils

## React Patterns

- Prefer functional components over class components
- Use React Server Components where possible
- Minimize client-side components with `'use client'` directive
- Use hooks for state management and side effects
- Implement composition over inheritance

## Styling

- Uses Tailwind CSS for styling
- Component-specific styles should be in the component file
- Global styles should be in global CSS files

## Data Fetching

- Prefer server-side data fetching in Server Components
- Use SWR or React Query for client-side data fetching
- Implement proper error handling and loading states
