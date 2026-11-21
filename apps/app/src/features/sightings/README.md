# Sightings Globe Component Structure

This directory contains the Sightings Globe visualization component, which displays UFO sightings data on an interactive map. The component has been organized into smaller, reusable pieces to improve maintainability and clarity.

## Component Structure

### Main Components

- `sightings-globe.tsx` - The original monolithic component (kept for reference)
- `sightings-globe-refactored.tsx` - The refactored main component that uses the extracted components

### Extracted Components

- `components/deck-gl-overlay.tsx` - Helper component for attaching deck.gl overlays to a Mapbox map

### Custom Hooks

- `hooks/use-map-initialization.tsx` - Hook for handling map initialization and loading
- `hooks/use-visualization-layers.tsx` - Hook for building deck.gl visualization layers
- `useTimeSeriesAnimation.tsx` - Hook for managing animation of time series data (existing)
- `use-batched-processing.ts` - Hook for efficient batch processing of large datasets (existing)

### Utilities

- `utils/sighting-filters.ts` - Filtering functions for sightings data
- `utils/map-utils.ts` - Utility functions for map operations
- `utils/date-utils.ts` - Date formatting and handling utilities

### Types

- `types.ts` - Shared TypeScript types and interfaces

## Custom Layers

- `animated-arc-layer.tsx` - Custom layer for animated arcs (existing)
- `animated-arc-group-layer.tsx` - Layer for grouping animated arcs (existing)

## How to Use

To use the refactored Sightings Globe component:

```jsx
import { SightingsGlobe } from './sightings-globe-refactored'

// Sample data
const geoJSONSightings = {
  sightings: { /* GeoJSON FeatureCollection */ },
  militaryBases: { /* GeoJSON FeatureCollection */ },
  ufoPosts: { /* GeoJSON FeatureCollection */ }
}

function App() {
  return <SightingsGlobe geoJSONSightings={geoJSONSightings} />
}
```

## Features

- Multiple visualization modes (heatmap, hexagon clusters, scatter plot, arcs, etc.)
- Time-based filtering with animation
- Detailed popups for sighting information
- Filtering by shape, duration, country, and more
- Special highlighting for significant events
- Shows related data layers (military bases, UFO posts)
