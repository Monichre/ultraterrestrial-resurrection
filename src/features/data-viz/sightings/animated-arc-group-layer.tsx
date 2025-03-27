'use client'

import { CompositeLayer } from '@deck.gl/core'
import { ArcLayer } from '@deck.gl/layers'
import { useCallback, useEffect, useState } from 'react'

// Create a custom composite layer to manage a group of animated arcs
class AnimatedArcGroupLayer extends CompositeLayer {
  initializeState() {
    this.state = {
      animationProgress: 0,
      fadeOpacity: this.props.fadeIn ? 0 : 1
    }
    
    // Start animation
    this._startAnimation()
    
    // Start fade in if needed
    if (this.props.fadeIn) {
      this._startFadeIn()
    }
  }
  
  _startAnimation() {
    const animate = () => {
      if (!this.state.animationHandle) return
      
      // Update animation progress with a smoother animation
      // Using a variable speed based on time for a more natural effect
      const now = Date.now() / 1000
      const speed = 0.003 + Math.sin(now * 0.5) * 0.002 // Slightly variable speed
      
      this.setState({
        animationProgress: (this.state.animationProgress + speed) % 1
      })
      
      this.state.animationHandle = window.requestAnimationFrame(animate)
    }
    
    // Store animation handle for cleanup
    this.state.animationHandle = window.requestAnimationFrame(animate)
  }
  
  _startFadeIn() {
    const fadeIn = () => {
      if (!this.state.fadeHandle) return
      
      const { fadeOpacity } = this.state
      const { fadeSpeed = 0.05 } = this.props
      
      // Increase opacity
      const newOpacity = Math.min(fadeOpacity + fadeSpeed, 1)
      this.setState({ fadeOpacity: newOpacity })
      
      // Stop when fully faded in
      if (newOpacity >= 1) {
        window.cancelAnimationFrame(this.state.fadeHandle)
        this.state.fadeHandle = null
        return
      }
      
      this.state.fadeHandle = window.setTimeout(fadeIn, 50)
    }
    
    this.state.fadeHandle = window.setTimeout(fadeIn, 50)
  }
  
  finalizeState() {
    // Clean up animation frame
    if (this.state.animationHandle) {
      window.cancelAnimationFrame(this.state.animationHandle)
      this.state.animationHandle = null
    }
    
    // Clean up fade timer
    if (this.state.fadeHandle) {
      window.clearTimeout(this.state.fadeHandle)
      this.state.fadeHandle = null
    }
  }
  
  // Generate the sublayers (arcs) for the composite layer
  renderLayers() {
    const { id, data, getSourceColor, getTargetColor, getWidth, getHeight, getTilt, visible, onClickArc } = this.props
    const { animationProgress, fadeOpacity } = this.state
    
    return new ArcLayer({
      id: `${id}-arcs`,
      data,
      getSourcePosition: d => d.source || [d.sourceLng, d.sourceLat, 0],
      getTargetPosition: d => d.target || [d.targetLng, d.targetLat, 0],
      getSourceColor: getSourceColor || [0, 128, 255],
      getTargetColor: getTargetColor || [255, 0, 128],
      getWidth: getWidth || 2,
      getHeight: getHeight || 1,
      getTilt: getTilt || 0,
      visible,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 128],
      parameters: {
        depthTest: false,
        blend: true,
        blendFunc: [770, 771], // Standard blending for glow effects
        blendEquation: 32774 // Standard blend equation
      },
      // Use animation progress to create a dash pattern
      getDashArray: [0, animationProgress, 1 - animationProgress],
      dashJustified: true,
      opacity: fadeOpacity,
      widthUnits: 'pixels',
      widthScale: 1,
      widthMinPixels: 1,
      widthMaxPixels: 10,
      onClick: onClickArc
    })
  }
}

// Define the layer's default props and additional props
AnimatedArcGroupLayer.layerName = 'AnimatedArcGroupLayer'
AnimatedArcGroupLayer.defaultProps = {
  ...CompositeLayer.defaultProps,
  fadeIn: false,
  fadeSpeed: 0.05,
  getSourceColor: [0, 128, 255],
  getTargetColor: [255, 0, 128],
  getWidth: 2,
  getHeight: 1,
  getTilt: 0
}

// React wrapper for the composite layer
export function useAnimatedArcGroupLayer(props) {
  const {
    id,
    data,
    getSourceColor,
    getTargetColor,
    getWidth,
    getHeight,
    getTilt,
    visible = true,
    fadeIn = false,
    fadeSpeed = 0.05,
    onClickArc
  } = props
  
  // Memoize the layer creation
  const layer = new AnimatedArcGroupLayer({
    id,
    data,
    getSourceColor,
    getTargetColor,
    getWidth,
    getHeight,
    getTilt,
    visible,
    fadeIn,
    fadeSpeed,
    onClickArc
  })
  
  return layer
}

export default AnimatedArcGroupLayer