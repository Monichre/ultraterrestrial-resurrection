# Weathered Classified Document Component

## Overview
Added an enhanced weathered version of the Socorro Incident dispatch document with advanced aging effects and navigation capabilities.

## Key Features
- **Enhanced Weathering**: Multi-layered CSS effects for realistic document aging
- **Navigation System**: Toggle between clean and weathered versions
- **Advanced Paper Effects**: Multiple radial gradients for authentic staining
- **Photo Deterioration**: Specialized weathering for attached photographs
- **Configurable Content**: All text and visual elements customizable via props

## CSS Enhancements
- `.weathered-document`: Main document aging with contrast/brightness filters
- `.weathered-photo`: Specialized photo aging effects
- Multiple radial gradients for realistic staining patterns
- Layered background effects for depth and authenticity

## Props Interface
- `showNavigation`: Toggle navigation display
- `incident`: Title and subtitle configuration
- `dispatch`: Reference and call array
- `photo`: Source and alt text for photograph
- `handwrittenNotes`: Array of notes with positioning

## Usage Examples
\`\`\`tsx
// Default weathered Socorro incident
<WeatheredClassifiedDocument />

// Custom incident without navigation
<WeatheredClassifiedDocument 
  showNavigation={false}
  incident={{
    title: "ROSWELL INCIDENT",
    subtitle: "— JULY 1947"
  }}
/>
\`\`\`

## Visual Enhancements
- **Realistic Aging**: Multiple stain patterns and paper deterioration
- **Photo Effects**: Sepia toning and corner damage simulation
- **Layered Textures**: Complex background patterns for authenticity
- **Interactive Navigation**: Clean comparison functionality

The component provides the most realistic document aging effects in the system while maintaining full configurability and integration with existing UFO documentation components.
