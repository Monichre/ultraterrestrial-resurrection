# EmptyCanvas Documentation

This document provides an overview of the `EmptyCanvas` component, its architecture, and data flow.

## Key Modules

-   **`EmptyCanvas.tsx`**: The main component that renders the welcome message and suggested actions.
-   **`ActionChip.tsx`**: A reusable, styled button component used for the suggested actions.

## Component Architecture

The `EmptyCanvas` component is designed to be a clear and helpful starting point for users.

1.  **`SUGGESTED_ACTIONS` Array**: Similar to the toolbar, the action chips are generated from a data array. Each object contains an `id`, `icon`, and `label`, making it easy to modify the suggestions.
2.  **`ActionChip`**: This is a versatile button component that can render with just an icon or with an icon and a label. It handles its own styling and is composed within the `EmptyCanvas`.
3.  **Instructional Text**: The main message includes a visually distinct `<span>` to draw attention to the "Double-click" action, improving user guidance.

## Data Flow

1.  **Static Content**: The `EmptyCanvas` is primarily a presentational component. It receives no props and manages no internal state.
2.  **Data Mapping**: The component maps over the `SUGGESTED_ACTIONS` array to render the list of `ActionChip` components, passing the `icon` and `label` as props to each chip.
3.  **User Interaction**: While the buttons are rendered, their `onClick` functionality is not yet implemented. This would be the next step in connecting the UI to application logic.
