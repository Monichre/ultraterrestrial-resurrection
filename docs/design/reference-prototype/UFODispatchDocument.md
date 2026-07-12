# UFO Dispatch Document Component

## Overview
Added a new Socorro Incident dispatch document component that recreates authentic 1960s police dispatch records with extensive weathering effects and vintage styling.

## Key Features
- **Police Dispatch Format**: Authentic radio call timestamps and messages
- **Weathered Paper Effects**: Coffee stains, fold lines, torn edges, and aging gradients
- **Typography**: Uses Anton for headers, Special Elite for body text, Caveat for handwritten notes
- **Rotated Classification Stamp**: Configurable angle and text
- **Weathered Polaroid Photo**: Includes aging effects and corner damage
- **Configurable Content**: All text, notes, and photo can be customized via props

## Props Interface
- `incident`: Title, subtitle, and date information
- `dispatch`: Reference number and radio call array
- `photo`: Source and alt text for the attached photograph
- `handwrittenNotes`: Array of notes with position, rotation, and color
- `classification`: Stamp text and rotation angle

## Usage Examples
\`\`\`tsx
// Default Socorro incident
<UFODispatchDocument />

// Custom incident
<UFODispatchDocument 
  incident={{
    title: "ROSWELL INCIDENT",
    subtitle: "— JULY 1947"
  }}
  dispatch={{
    calls: [
      { time: "23:30", message: "→ Debris field reported" },
      { time: "23:45", message: "→ Military en route" }
    ]
  }}
/>
\`\`\`

## Styling Features
- Full-screen dark background with centered document
- Multiple layered textures for authentic aging
- Responsive design for mobile and desktop
- Shimmer animation for scanning effect
- Sepia photo filters and damage effects

The component integrates seamlessly with the existing UFO document system while providing a unique dispatch document format perfect for incident reports and police communications.
