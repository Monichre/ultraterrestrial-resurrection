# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & commands
- Build: `npm run build`
- Run dev: `npm run dev`
- Lint: `npm run lint`
- Test: `npm run test`
- Run CLI: `ts-node bin/cli.ts <command>` or `npm start -- <command>`

## Code style
- TypeScript strict mode with all strict options enabled
- Use explicit type annotations for function params and returns
- Use camelCase for variables/functions, PascalCase for classes/interfaces
- Organize imports alphabetically with types separated
- Use async/await with try/catch for error handling
- Create custom error classes extending Error for specific errors
- Document functions with JSDoc comments
- 2-space indentation, single quotes for strings
- Use meaningful variable names and descriptive error messages