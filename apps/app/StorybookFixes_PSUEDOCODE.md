Goal: Fix Storybook font fallbacks and runtime errors (component annotation, useAssistant, setOpen).

Pseudocode plan

1) Fonts
   - Open src/app/globals.css
   - Replace heading font-family 'Grotesk Mono' (not installed) with
     'Monument Grotesk' + CSS variable fallbacks and system sans.
   - Keep @font-face declarations untouched. Verify preview.tsx imports globals.css.

2) DistressedPhoto story
   - Open DistressedPhoto.stories.tsx
   - Change named import to default import to match component's default export.

3) AI SDK hook in Storybook
   - Create .storybook/stubs/ai-sdk-react.ts exporting a minimal useAssistant hook.
   - Alias '@ai-sdk/react' to the stub in .storybook/main.ts to avoid 'useAssistant is not a function' in stories.

4) setOpen undefined
   - Open src/components/ui/command/command-search-menu.tsx
   - Add useState for open and loading, wire into <Command.Dialog> and Loading.

5) Lint/build sanity
   - Run lints on edited files; fix any type import issues.
   - Keep Next app unaffected; Storybook uses alias; app still uses real '@ai-sdk/react'.
