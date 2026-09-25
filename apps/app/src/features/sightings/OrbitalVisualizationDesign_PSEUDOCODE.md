# Orbital Visualization System Design - Pseudocode

## Overview

Multi-layered orbital visualization system that places UAP sightings on globe surface and creates floating orbital data layers with connecting tethers.

## Architecture

```
🌍 EARTH SURFACE LAYER (radius: 2.0)
    ↕️ TETHER BEAMS (connecting lines)
🌌 ORBITAL LAYERS:
    - LOW ORBIT (2.8): Recent/high-priority sightings
    - MID ORBIT (3.4): Cluster aggregations
    - HIGH ORBIT (4.2): Historical patterns
```

## Core Components

### 1. OrbitalVisualizationSystem.tsx

**Purpose**: Main orchestrator for orbital elements

```pseudocode
FUNCTION OrbitalVisualizationSystem(sightings, config)
    FOR each sighting WITH valid coordinates:
        dataRichness = calculateDataRichness(sighting)
        
        // Place on surface
        surfacePosition = latLonToSurface(lat, lon, EARTH_RADIUS + SURFACE_OFFSET)
        
        // Calculate orbital altitude based on data importance
        orbitRadius = LOW_ORBIT + (dataRichness * (HIGH_ORBIT - LOW_ORBIT))
        orbitalPosition = surfaceToOrbital(surfacePosition, orbitRadius, phaseOffset)
        
        RENDER SurfaceMarker AT surfacePosition
        IF showTethers THEN RENDER TetherBeam FROM surfacePosition TO orbitalPosition
        IF showOrbitalCards THEN RENDER OrbitalDataCard AT orbitalPosition
    END FOR
END FUNCTION

FUNCTION calculateDataRichness(sighting) -> score[0-1]
    score = 0
    
    // Recency factor (newer = higher orbit)
    ageInDays = (now - sighting.timestamp) / (1 day)
    score += max(0, (365 - ageInDays) / 365) * 0.4
    
    // Data completeness
    IF sighting.description EXISTS THEN score += 0.2
    IF sighting.confidence != "unknown" THEN score += 0.2  
    IF sighting.witnesses > 1 THEN score += 0.1
    IF sighting.media.length > 0 THEN score += 0.1
    
    RETURN min(1, score)
END FUNCTION
```

### 2. Surface Markers

**Purpose**: Anchor points on globe surface showing exact sighting locations

```pseudocode
FUNCTION SurfaceMarker(position, sighting, isSelected)
    RENDER sphere AT position WITH:
        radius = 0.03
        color = isSelected ? "#ff6b6b" : "#00ff88"
        opacity = 0.8
        
    IF isSelected THEN:
        ANIMATE gentle pulsing effect
    END IF
    
    ON click:
        SELECT this sighting
        TRIGGER onSightingSelect callback
END FUNCTION
```

### 3. Orbital Data Cards

**Purpose**: Floating information panels that orbit around Earth

```pseudocode
FUNCTION OrbitalDataCard(position, sighting, orbitRadius, phase)
    CONTINUOUSLY:
        // Gentle orbital motion
        newPhase = phase + (time * ORBITAL_SPEED)
        newPosition = surfaceToOrbital(sighting.surface, orbitRadius, newPhase)
        UPDATE position TO newPosition
        
        // Billboard effect - always face camera
        ROTATE to face camera
    
    RENDER HTML overlay WITH:
        sighting type, title, location, date
        confidence and witness data
        data richness indicator (5-dot scale)
        
    STYLE:
        background = "black/80"
        border = "cyan-500/30"
        width = 200-250px
        opacity = 0.9
END FUNCTION
```

### 4. Tether Beams

**Purpose**: Visual connections between surface and orbital elements

```pseudocode
FUNCTION TetherBeam(startPos, endPos, color, opacity)
    CREATE line geometry FROM startPos TO endPos
    
    RENDER line WITH:
        color = color (default: "#00ff88") 
        opacity = opacity (default: 0.3)
        material = LineBasicMaterial
        
    IF sighting is selected THEN:
        opacity = 0.8  // More visible
    END IF
END FUNCTION
```

## Integration Points

### 1. HudUapInterface Integration

```pseudocode
FUNCTION renderGlobe()
    SWITCH globeType:
        CASE "orbital":
            RETURN EnhancedOrbitalGlobe WITH:
                sightings = currentSightings
                config = orbitalViewConfig
                callbacks = {onSightingSelect}
        
        CASE "default", "alternative", "codepen":
            RETURN respective globe components
END FUNCTION

// Configuration state
orbitalViewConfig = {
    showTethers: boolean,
    showOrbitalCards: boolean, 
    showAtmosphere: boolean,
    animationSpeed: number
}
```

### 2. Enhanced Globe Wrapper

```pseudocode
FUNCTION EnhancedOrbitalGlobe(props)
    SETUP Three.js scene WITH:
        Earth mesh with textures
        Atmosphere shader effects
        Orbital controls for interaction
        Lighting (ambient + directional + point)
        Star field background
        
    RENDER components:
        EarthMesh(showAtmosphere)
        OrbitalVisualizationSystem(sightings, config)
        OrbitalControls(layerToggles)
        OrbitalDataSummary(stats, selectedSighting)
        
    HANDLE user interactions:
        Camera movement
        Sighting selection  
        Layer visibility toggles
END FUNCTION
```

## Data Flow

```
1. Page.tsx → fetch UAP sightings data
2. SightingsClient → process and serialize data  
3. HudUapInterface → filter by time/location
4. EnhancedOrbitalGlobe → setup 3D scene
5. OrbitalVisualizationSystem → create orbital elements
6. Individual components → render surface/orbital/tether elements
```

## Visual Hierarchy

### Altitude-Based Importance

- **Surface (2.0)**: Exact sighting locations
- **Low Orbit (2.8)**: Recent sightings (< 30 days) with high data completeness  
- **Mid Orbit (3.4)**: Moderate importance sightings
- **High Orbit (4.2)**: Historical or low-data sightings

### Color Coding

- **Surface Markers**: Green (#00ff88) normal, Red (#ff6b6b) selected
- **Tether Beams**: Green (#00ff88), more opaque when selected
- **Orbital Cards**: Black background with cyan borders
- **UI Controls**: Cyan theme for orbital-specific elements

### Animation

- **Orbital Motion**: Gentle rotation around Earth axis
- **Selection Effects**: Pulsing animation for selected markers
- **Tether Opacity**: Dynamic based on selection state
- **Billboard Effect**: Cards always face camera

## Performance Considerations

### Rendering Optimization

- Limit displayed points to 200 max
- Use efficient Three.js geometries
- Implement frustum culling for orbital cards
- Batch similar rendering operations

### Memory Management  

- Filter invalid coordinates before processing
- Reuse geometries where possible
- Clean up Three.js objects on unmount
- Optimize texture loading

## User Controls

### Globe Selection Panel

```pseudocode
INTERFACE GlobeSelection:
    🛸 ORBITAL VIEW    (new primary mode)
    🌍 GLOBE 1         (existing default)
    🌎 GLOBE 2         (existing alternative) 
    🌏 GLOBE 3         (existing codepen)
```

### Orbital Configuration Panel (orbital mode only)

```pseudocode
INTERFACE OrbitalConfig:
    ☑ Tether Beams      (toggle connecting lines)
    ☑ Orbital Data Cards (toggle floating panels)  
    ☑ Atmosphere         (toggle atmospheric effects)
```

### Real-time Controls

```pseudocode
INTERFACE OrbitalDataSummary:
    DISPLAY total sightings count
    DISPLAY geo-located count  
    DISPLAY recent (30d) count
    SHOW selected sighting details
```

## Future Enhancements

### Clustering System (pending)

- Orbital rings around hotspot regions
- Aggregated statistics for clusters
- Cluster-level interaction

### Advanced Orbital Mechanics (pending)  

- True orbital physics simulation
- Satellite-style orbital paths
- Gravitational effects visualization

### Interactive Features

- Click-to-focus camera movement
- Orbital path tracing
- Temporal animation controls
- Data filtering by orbital layer

## Error Handling

### Data Validation

```pseudocode
FUNCTION validateSightingCoordinates(sighting):
    IF NOT sighting.location?.coordinates THEN RETURN false
    IF lat NOT IN [-90, 90] THEN RETURN false  
    IF lng NOT IN [-180, 180] THEN RETURN false
    IF isNaN(lat) OR isNaN(lng) THEN RETURN false
    RETURN true
```

### Rendering Fallbacks

- Show loading state while initializing
- Display message when no valid coordinates
- Graceful degradation for WebGL issues
- Error boundaries for component failures

---

**Implementation Status**: ✅ Core system complete, pending orbital rings and advanced features
**Performance**: Optimized for 100-200 simultaneous orbital elements  
**Compatibility**: Requires WebGL 2.0, Three.js r150+
