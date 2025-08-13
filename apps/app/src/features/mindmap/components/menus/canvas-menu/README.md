# Canvas Menu Component

A beautiful, modern floating command palette for the Ultraterrestrial mindmap interface, inspired by CommandK design patterns.

## Features

- 🎨 **Glassmorphic Design** - Beautiful backdrop blur effects with subtle animations
- ⌨️ **Keyboard First** - Full keyboard navigation with Cmd/Ctrl+K shortcut
- 🔍 **Smart Search** - Real-time filtering of commands with highlighting
- 💬 **AI Integration** - Built-in chat interface with AI assistant
- 🎯 **Entity Management** - Quick access to add entities to the mindmap
- 🗺️ **Tour Controls** - Guided and free exploration modes
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 📱 **Responsive** - Works on all screen sizes

## Usage

### Basic Usage

```tsx
import { CanvasMenu } from '@/features/mindmap/components/menus/canvas-menu'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleAction = (action: MenuAction) => {
    console.log('Action triggered:', action)
    // Handle the action based on type
    switch (action.type) {
      case 'chat':
        // Handle chat action
        break
      case 'add-entity':
        // Handle entity addition
        break
      // ... other cases
    }
  }

  return (
    <CanvasMenu
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onAction={handleAction}
    />
  )
}
```

### Custom Positioning

```tsx
<CanvasMenu
  position={{ x: 400, y: 300 }}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onAction={handleAction}
/>
```

### With Custom Trigger

```tsx
<CanvasMenu
  className="bottom-8 right-8" // Position the trigger button
  onAction={handleAction}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `{ x: number, y: number }` | Center of screen | Position of the menu when open |
| `isOpen` | `boolean` | `false` | Controlled open state |
| `onClose` | `() => void` | - | Callback when menu is closed |
| `onAction` | `(action: MenuAction) => void` | - | Callback when action is triggered |
| `className` | `string` | - | Additional classes for trigger button |

## Menu Actions

The `onAction` callback receives a `MenuAction` object with the following structure:

```typescript
interface MenuAction {
  type: 'search' | 'chat' | 'add-entity' | 'tour' | 'command' | 'model-select'
  data: any // Action-specific data
}
```

### Action Types

- **`chat`** - AI chat interaction
- **`search`** - Database search
- **`add-entity`** - Add entity to mindmap (topics, events, personnel, etc.)
- **`tour`** - Start guided or free exploration
- **`command`** - Execute specific commands (grid layout, etc.)
- **`model-select`** - Select AI model

## Keyboard Shortcuts

- **`Cmd/Ctrl + K`** - Open/close the menu
- **`Escape`** - Close the menu
- **`Enter`** - Select highlighted command or send chat message
- **`↑/↓`** - Navigate through commands
- **`Type`** - Filter commands in real-time

## Styling

The component uses Tailwind CSS and can be customized through:

1. **CSS Variables** - Override color schemes
2. **className prop** - Position and style the trigger button
3. **Tailwind config** - Extend theme for consistent styling

## Integration with Mindmap

While this component is designed to replace the current `MindMapBottomMenu`, it's built as a standalone component for easy testing and gradual integration.

### Future Integration Steps

1. Replace the bottom menu in `Graph.tsx`
2. Connect to existing mindmap context
3. Wire up entity addition and search functions
4. Integrate with tour system
5. Connect AI chat to existing assistant

## Development

### Running Storybook

```bash
npm run storybook
```

Navigate to **Mindmap > Menus > CanvasMenu** to see all stories.

### Testing

The component includes comprehensive Storybook stories for:

- Default state
- Open with search
- Custom positioning
- Interactive playground
- Mobile responsive view

## Architecture

```text
canvas-menu/
├── CanvasMenu.tsx          # Main component
├── CanvasMenu.stories.tsx  # Storybook stories
├── index.ts               # Exports
└── README.md             # Documentation
```

## Dependencies

- `framer-motion` - Animations
- `@ai-sdk/react` - AI assistant integration
- `lucide-react` - Icons
- `tailwindcss` - Styling

## Future Enhancements

- [ ] Add more keyboard navigation (Tab, arrow keys)
- [ ] Implement command history
- [ ] Add command shortcuts/aliases
- [ ] Support for nested commands
- [ ] Theme customization
- [ ] Accessibility improvements (ARIA labels, screen reader support)
- [ ] Command palette plugins/extensions
- [ ] Voice command support
