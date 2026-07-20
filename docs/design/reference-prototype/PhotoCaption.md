# Photo Caption Component

## Overview
Added a reusable PhotoCaption component for adding labels and handwritten-style notes to images in UFO documents.

## Key Features
- **Strong Label**: Bold uppercase label for identification
- **Handwritten Notes**: Cursive scribble-style text using Caveat font
- **High Z-Index**: Positioned above other elements with z-40
- **Styled Background**: Semi-transparent white background with backdrop blur
- **Responsive Design**: Adapts to different screen sizes

## Props Interface
- `labelTop`: Strong identification label text
- `captionNote`: Handwritten-style note content
- `className`: Optional additional CSS classes

## CSS Classes
- `.caption`: Main container with background and positioning
- `.label`: Bold uppercase label styling
- `.note`: Base note text styling
- `.scribble`: Handwritten cursive styling using Caveat font

## Usage Examples
\`\`\`tsx
import { PhotoCaption } from "@/components/ui/PhotoCaption"

// Basic usage
<PhotoCaption 
  labelTop="Fig. 1A"
  captionNote="Unidentified aerial phenomenon observed at 23:47 UTC"
/>

// With custom positioning
<PhotoCaption 
  labelTop="Evidence Photo"
  captionNote="Witness sketch matches radar signature"
  className="top-4 right-4"
/>
\`\`\`

## Styling Features
- Semi-transparent white background with backdrop blur
- Border and shadow for depth
- Special Elite font for labels
- Caveat font for handwritten notes
- High z-index for overlay positioning

The component integrates seamlessly with existing UFO document styling while providing authentic archival photo caption aesthetics.
