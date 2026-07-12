# Refactored Document Components

## Overview
All document components have been separated into individual files with comprehensive prop interfaces for maximum reusability and maintainability.

## Structure
- `types/document.ts` - TypeScript interfaces for all component props
- `components/DocumentFrame.tsx` - Shared wrapper with paper texture and aging effects
- `components/DocumentOne.tsx` - Original document with configurable text content
- `components/DocumentA.tsx` - UN:DEFECTAL document with image and sidebar props
- `components/DocumentB.tsx` - Minio Clusso document with multi-image layout
- `app/page.tsx` - Main page importing and using all components

## Key Features
- **Type Safety**: Full TypeScript interfaces with optional properties
- **Default Values**: Comprehensive defaults maintain original appearance
- **Prop Merging**: Deep merging of user props with defaults
- **Reusability**: All text, images, and layout content configurable via props
- **Maintainability**: Clear separation of concerns and modular architecture

## Usage Examples
\`\`\`tsx
// Use with defaults
<DocumentOne />

// Customize specific sections
<DocumentA 
  header={{ title: "Custom Title" }}
  sidebar={{ notes: "Custom field notes" }}
/>

// Override multiple properties
<DocumentB 
  header={{ title: "New Survey", subtitle: "Updated subtitle" }}
  footer={{ caseReference: "CASE-001" }}
/>
