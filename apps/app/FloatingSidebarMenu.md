# FloatingToolbar with Hover Panels Documentation

This document provides a comprehensive overview of the complete FloatingToolbar system with all integrated hover panels.

## Key Modules

### Core Components
- **`FloatingToolbar.tsx`**: Main toolbar component with integrated hover functionality
- **`ToolbarButton.tsx`**: Reusable button component with tooltip support

### Hover Panels
- **`TemplatesPanel.tsx`**: Template browser with categories, search, and grid/list views
- **`LayersPanel.tsx`**: Layer management with hierarchy, visibility controls, and drag-and-drop
- **`HistoryPanel.tsx`**: Version history with undo/redo and timeline visualization
- **`SettingsPanel.tsx`**: Application settings with tabbed interface and various controls
- **`CollaborationPanel.tsx`**: Team collaboration with member management and activity feed
- **`AssetPanel.tsx`**: Asset browser with search and categorization

## Component Architecture

### Data-Driven Design
The toolbar is built with a completely data-driven approach:

1. **`TOOLBAR_ITEMS` Array**: Defines primary tools with optional hover panels
2. **`SECONDARY_ITEMS` Array**: Defines secondary tools (comments, help, etc.)
3. **Dynamic Rendering**: Each item can optionally include a `submenu` component

### Hover Integration
- Uses `shadcn/ui`'s `HoverCard` component for smooth hover interactions
- Consistent positioning with `side="right"` and `sideOffset={16}`
- 100ms open/close delays for optimal UX

### Panel Features

#### TemplatesPanel
- **Categories**: Web, Mobile, Print templates
- **Search**: Real-time filtering
- **View Modes**: Grid and list layouts
- **Popularity**: Badges for popular templates
- **Actions**: Download/use template functionality

#### LayersPanel
- **Hierarchy**: Nested layer structure with indentation
- **Controls**: Visibility toggles, lock/unlock, more actions
- **Selection**: Visual feedback for selected layers
- **Type Indicators**: Color-coded dots for different layer types

#### HistoryPanel
- **Timeline**: Chronological list of actions
- **Undo/Redo**: Functional buttons with state management
- **Action Types**: Color-coded badges for different action types
- **Navigation**: Click to jump to any point in history

#### SettingsPanel
- **Tabbed Interface**: General, Theme, and Shortcuts tabs
- **Interactive Controls**: Switches, sliders, selects, and buttons
- **Theme Selection**: Visual theme picker with icons
- **Keyboard Shortcuts**: Reference table with customization option

#### CollaborationPanel
- **Team Management**: Member list with roles and status
- **Invitations**: Email invite system with role selection
- **Activity Feed**: Real-time collaboration activity
- **Sharing**: Link sharing with permissions

## Data Flow

### State Management
- **Active Tool**: Managed in `FloatingToolbar` component
- **Panel State**: Each panel manages its own internal state
- **Hover State**: Handled automatically by `HoverCard` component

### Event Handling
- **Tool Selection**: Updates active tool state
- **Panel Interactions**: Each panel handles its own user interactions
- **Hover Events**: Managed by `HoverCard` with configurable delays

## Styling & Theming

### Consistent Design Language
- **Glass Morphism**: `backdrop-blur-md` with semi-transparent backgrounds
- **Color Palette**: Neutral grays with accent colors for states
- **Typography**: Consistent text sizes and weights
- **Spacing**: Uniform padding and margins throughout

### Responsive Design
- **Fixed Widths**: Each panel has optimized width for its content
- **Scrollable Content**: Overflow handling for long lists
- **Hover States**: Smooth transitions and visual feedback

### Animation & Interactions
- **Hover Delays**: 100ms open, 100ms close for optimal feel
- **Transitions**: Smooth color and opacity changes
- **Focus States**: Keyboard navigation support
- **Loading States**: Skeleton loaders where appropriate

## Integration Points

### Toolbar Integration
Each panel integrates seamlessly with the toolbar through:
1. **Icon Assignment**: Appropriate Lucide icons for each tool
2. **Tooltip Labels**: Descriptive hover text
3. **Active States**: Visual feedback for selected tools
4. **Panel Positioning**: Consistent right-side placement

### Cross-Panel Communication
While panels are currently independent, they're designed for future integration:
- **Shared State**: Ready for global state management
- **Event System**: Prepared for cross-panel communication
- **Data Synchronization**: Architecture supports real-time updates

## Performance Considerations

### Lazy Loading
- **Panel Mounting**: Panels only render when hovered
- **Data Loading**: Mock data can be replaced with API calls
- **Image Optimization**: Placeholder images with proper sizing

### Memory Management
- **Component Cleanup**: Proper unmounting of hover panels
- **Event Listeners**: Automatic cleanup on component destruction
- **State Optimization**: Minimal re-renders through proper state structure

## Future Enhancements

### Planned Features
1. **Drag & Drop**: Between panels and to canvas
2. **Keyboard Shortcuts**: Quick panel access
3. **Panel Customization**: User-configurable panel layouts
4. **Real-time Collaboration**: Live cursor tracking and updates
5. **Plugin System**: Third-party panel extensions

### API Integration
- **Template Library**: Connect to design template APIs
- **Asset Management**: Cloud storage integration
- **User Management**: Authentication and permissions
- **Version Control**: Git-like versioning system

This comprehensive system provides a professional-grade design tool interface with rich hover interactions and extensive functionality across all panels.
