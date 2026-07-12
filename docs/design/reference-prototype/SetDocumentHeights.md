Change Summary
- All documents now size based on content:
  - DocumentFrame uses h-auto (was min-h-screen).
  - The page wrapper no longer enforces min-h-screen.
  - DocumentOne bottom section is no longer absolutely positioned; it’s in normal flow with pt-8 and a subtle top border to preserve visual separation.
Impact
- Layout remains visually consistent while allowing documents to stack naturally.
- No fixed heights; better for multi-document pages and printing.
