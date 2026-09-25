# FloatingToolbar Documentation

This document provides an overview of the `FloatingToolbar` component, its architecture, and data flow.

## Key Modules

-   **`FloatingToolbar.tsx`**: The main component that renders the toolbar and manages its state.
-   **`ToolbarButton.tsx`**: A reusable button component with integrated tooltip functionality, used for each item in the toolbar.
-   **`AssetPanel.tsx`**: A submenu component that appears on hover, displaying assets and search functionality. It is part of the `components/asset-panel` directory.

## Component Architecture

The `FloatingToolbar` is designed with a data-driven approach.

1.  **`TOOLBAR_ITEMS` Array**: The structure and content of the toolbar are defined in a constant array named `TOOLBAR_ITEMS`. Each object in this array represents a button and can optionally include a `submenu` component to be displayed on hover. This makes the toolbar highly configurable.
2.  **`ToolbarButton`**: This is a presentational component that receives props like `isActive`, `tooltip`, and an `icon`. It uses `shadcn/ui`'s `Tooltip` for accessibility and user experience.
3.  **`HoverCard` Integration**: For items with a submenu, `shadcn/ui`'s `HoverCard` is used to wrap the `ToolbarButton`. The `HoverCardContent` then renders specified submenu component (`AssetPanel`)..

## Data Flow

1.  **State Management**: The `activeTool` state is managed within the `FloatingToolbar` component using the `useState` hook.
2.  **Event Handling**: The `onClick` handler on each `ToolbarButton` updates the `activeTool` state.
3.  **Props Drilling**: The `isActive` prop is passed down to each `ToolbarButton` to conditionally apply active styles. The `tooltip` and `icon` are also passed down from the `TOOLBAR_ITEMS` array.
4.  **Hover Interaction**: The `HoverCard` component handles the hover state internally, triggering the display of the `AssetPanel` without needing explicit state management in the `FloatingToolbar`.
