## DynamicSettingsVariant1 – Pseudocode

Goal: Animated settings panel with three tabs (Dimensions, Aspect Ratio, Prompt) and adaptive container size.

State

- isOpen: boolean
- subMenuSelected: 'dimensions' | 'aspect-ratio' | 'prompt'

Derived

- menuCategories: config drives animated width/height per tab

Handlers

- handleOpenSettings: toggle isOpen
- setSubMenuSelected(slug)

Render

- motion.div container animates width/height based on isOpen and selected menu
- Header row: NavigationMenu when open; otherwise “Add Style” button; plus toggle button (PlusIcon rotates)
- Content area switches by subMenuSelected:
  - AspectRatioSection: set of selectable aspect ratio buttons
  - Prompt: textarea with apply button
  - Dimensions: placeholder with apply button
- Apply buttons: close settings and show toast

Animation

- Fade/blur in for content; spring transitions

Exports

- Default export: DynamicSettingsVariant1
