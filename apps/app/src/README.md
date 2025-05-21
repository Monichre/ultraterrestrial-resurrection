# Source Directory Guidelines

This document outlines the standardized organization, naming conventions, and best practices for the codebase.

## 1. Directory Structure Overview

```
src/
├── app/                 # Next.js App Router directory
│   ├── api/             # API routes
│   └── (routes)/        # Page routes
├── components/          # Reusable UI components
│   ├── ui/              # Basic UI elements
│   ├── forms/           # Form-related components
│   ├── layout/          # Layout components
│   └── feature-specific/ # Components specific to certain features
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and shared libraries
├── styles/              # Global styles and theming
└── types/               # TypeScript type definitions
```

## 2. Naming Conventions

### Directories

- Use **kebab-case** for all directory names
  - Example: `user-profile/`, `auth-forms/`, `data-visualization/`
- Group related components in descriptive directories
  - Example: `form-elements/`, `navigation/`, `modal-dialogs/`
- Feature-specific directories should clearly indicate their purpose
  - Example: `user-authentication/`, `product-catalog/`

### Files

- Use **PascalCase** for component files
  - Example: `Button.tsx`, `UserProfile.tsx`, `AuthForm.tsx`
- Use **camelCase** for utility files, hooks, and non-component files
  - Example: `useAuth.ts`, `formatDate.ts`, `apiClient.ts`
- Add suffixes to indicate file purpose
  - Example: `Button.test.tsx`, `UserProfile.stories.tsx`, `types.d.ts`

### Components

- Use **PascalCase** for component names
  - Example: `ProductCard`, `NavigationBar`, `UserProfileForm`
- Prefix specialized components when appropriate:
  - UI components with usage context: `Form`, `Table`, `Modal`, etc.
  - HOCs with `with`: `withAuth`, `withTheme`
  - Hooks with `use`: `useWindowSize`, `useFormValidation`

## 3. Component Organization

### File Structure

Each component should follow a consistent structure:

```tsx
// 1. Imports
import { useState } from 'react';
import { SomeComponent } from '@/components/ui';

// 2. Type definitions
type ButtonProps = {
  variant: 'primary' | 'secondary';
  label: string;
  onClick: () => void;
};

// 3. Component definition
export const Button = ({ variant, label, onClick }: ButtonProps) => {
  // Component logic here
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};

// 4. Subcomponents (if any)
Button.Icon = ({ icon }: { icon: React.ReactNode }) => {
  return <span className="btn-icon">{icon}</span>;
};

// 5. Default exports
export default Button;
```

### Component Folder Structure

For complex components, use a folder-based approach:

```
ButtonGroup/
├── ButtonGroup.tsx        # Main component
├── ButtonGroupItem.tsx    # Child component
├── ButtonGroupContext.tsx # Component-specific context
├── useButtonGroup.ts      # Component-specific hook
├── index.ts               # Export file
└── styles.module.css      # Component-specific styles (if not using Tailwind)
```

## 4. Best Practices

### General Guidelines

- Prefer React Server Components when possible
- Use Client Components only when needed for interactivity
- Minimize use of `'use client'` directive
- Avoid unnecessary state management and re-renders
- Implement proper TypeScript types for all components and functions

### Component Design

- Keep components focused on a single responsibility
- Extract complex logic into custom hooks
- Use composition over inheritance
- Make components reusable and configurable via props
- Consider accessibility from the start (semantic HTML, ARIA attributes)

### Performance Optimization

- Implement code splitting with dynamic imports
- Use `React.memo()` for components that render often but rarely change
- Optimize images using Next.js Image component
- Lazy load components and resources when appropriate

### State Management

- Use React Context for state that needs to be shared across components
- Keep context providers focused and organized by domain
- Consider using libraries like Zustand or Jotai for complex state 
- Implement proper error handling and loading states

### Code Quality

- Write comprehensive tests for components and utility functions
- Document complex logic with clear comments
- Use JSDoc for function and component documentation
- Follow consistent formatting using ESLint and Prettier

By following these conventions and practices, we maintain a clean, consistent, and maintainable codebase that is easy to understand and collaborate on.

