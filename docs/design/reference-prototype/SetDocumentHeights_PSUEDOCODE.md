- Goal: Set all document heights to auto/content.
- Steps:
  1. DocumentFrame: remove min-h-screen -> use h-auto.
  2. Page wrapper: remove min-h-screen so page height is natural.
  3. DocumentOne bottom section: change from absolute bottom-anchored to static flow with top padding and top border.
- Result: Each document expands with its content; no fixed/min screen height constraints.
