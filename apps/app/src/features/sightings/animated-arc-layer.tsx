'use client'

import { ArcLayer } from '@deck.gl/layers'

// Create a custom arc layer with animation support
export function AnimatedArcLayer({
  id = 'animated-arc-layer',
  data,
  getSourceColor = [0, 128, 255],
  getTargetColor = [255, 0, 128],
  getWidth = 2,
  getHeight = 1,
  getTilt = 0,
  visible = true,
  fadeIn = false,
  fadeSpeed = 0.05,
  onClickArc,
}) {
  // Get current animation progress
  const now = Date.now() / 1000
  const animationProgress = (now % 1)
  
  // Create the arc layer with animation settings
  return new ArcLayer({
    id,
    data,
    getSourcePosition: d => d.source || [d.sourceLng, d.sourceLat, 0],
    getTargetPosition: d => d.target || [d.targetLng, d.targetLat, 0],
    getSourceColor: getSourceColor,
    getTargetColor: getTargetColor,
    getWidth: getWidth,
    getHeight: getHeight || 1,
    getTilt: getTilt || 0,
    visible,
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 128],
    parameters: {
      depthTest: false,
      blend: true,
      blendFunc: [770, 771], // Standard blending for glow effects (SRC_ALPHA, ONE_MINUS_SRC_ALPHA)
      blendEquation: 32774 // Standard blend equation (FUNC_ADD)
    },
    // Use animation progress to create a dash pattern
    getDashArray: [0, animationProgress, 1 - animationProgress],
    dashJustified: true,
    // Apply fade effect if requested
    opacity: fadeIn ? Math.min(1, Date.now() % 10000 / 1000 * fadeSpeed) : 1,
    widthUnits: 'pixels',
    widthScale: 1,
    widthMinPixels: 1,
    widthMaxPixels: 10,
    updateTriggers: {
      getDashArray: Date.now(), // Force update on each frame
      opacity: Date.now()
    },
    onClick: onClickArc
  })
}

export default AnimatedArcLayer