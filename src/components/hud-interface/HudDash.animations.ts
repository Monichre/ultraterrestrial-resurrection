interface CanvasRefs {
  torusCanvas: HTMLCanvasElement | null
  frequencyCanvas: HTMLCanvasElement | null
  amplitudeCurveCanvas: HTMLCanvasElement | null
  dynamicsCanvas: HTMLCanvasElement | null
  meshCanvas: HTMLCanvasElement | null
  trackingCanvas: HTMLCanvasElement | null
}

interface ShapeRefs {
  shape1: SVGSVGElement | null
  shape2: SVGSVGElement | null
  shape3: SVGSVGElement | null
  shape4: SVGSVGElement | null
}

interface CleanupHandles {
  intervals: number[]
  animationFrames: number[]
}

export function initAnimations(
  canvasRefs: CanvasRefs,
  shapeRefs: ShapeRefs,
  progressBlocks: HTMLDivElement | null,
  dotMatrix: HTMLDivElement | null
): CleanupHandles {
  const intervals: number[] = []
  const animationFrames: number[] = []

  // Initialize all animations
  initShapeAnimations(shapeRefs, intervals)
  initTorusAnimation(canvasRefs.torusCanvas, animationFrames)
  initFrequencyAnimation(canvasRefs.frequencyCanvas, animationFrames)
  initAmplitudeCurveAnimation(canvasRefs.amplitudeCurveCanvas, animationFrames)
  initDynamicsAnimation(canvasRefs.dynamicsCanvas, animationFrames)
  initMeshAnimation(canvasRefs.meshCanvas, animationFrames)
  initTrackingAnimation(canvasRefs.trackingCanvas, animationFrames)
  startProgressAnimation(progressBlocks, intervals)
  startAmplitudeBarAnimations(intervals)
  startDotMatrixAnimation(dotMatrix, intervals)

  return { intervals, animationFrames }
}

// Shape Animations
function initShapeAnimations(shapeRefs: ShapeRefs, intervals: number[]) {
  const { shape1, shape2, shape3, shape4 } = shapeRefs

  if (shape1) {
    const path1 = shape1.querySelector('path')
    if (path1) {
      path1.setAttribute('stroke-dasharray', '2,2')
      let dashOffset1 = 0
      
      const interval = setInterval(() => {
        dashOffset1 = (dashOffset1 + 1) % 20
        path1.setAttribute('stroke-dashoffset', dashOffset1.toString())
      }, 100)
      intervals.push(interval)
    }
  }

  if (shape2) {
    const path2 = shape2.querySelector('path')
    if (path2) {
      let wave2Time = 0
      
      const interval = setInterval(() => {
        wave2Time += 0.1
        const y1 = 20 + Math.sin(wave2Time) * 3
        const y2 = 10 + Math.sin(wave2Time + 1) * 2
        const y3 = 15 + Math.sin(wave2Time + 2) * 2
        const y4 = 5 + Math.sin(wave2Time + 3) * 3
        const y5 = 20 + Math.sin(wave2Time + 4) * 2
        
        path2.setAttribute('d', `M10 ${y1} L15 ${y2} L20 ${y3} L25 ${y4} L30 ${y5}`)
      }, 50)
      intervals.push(interval)
    }
  }

  if (shape3) {
    const circle = shape3.querySelector('circle')
    if (circle) {
      let pulse3Time = 0
      
      const interval = setInterval(() => {
        pulse3Time += 0.1
        const radius = 7 + Math.sin(pulse3Time) * 2
        circle.setAttribute('r', radius.toString())
        
        // Also animate stroke-dasharray
        const circumference = 2 * Math.PI * radius
        circle.setAttribute('stroke-dasharray', `${circumference / 4},${circumference / 4}`)
        circle.setAttribute('stroke-dashoffset', (pulse3Time * 5).toString())
      }, 50)
      intervals.push(interval)
    }
  }

  if (shape4) {
    const path4 = shape4.querySelector('path')
    if (path4) {
      let angle4Time = 0
      
      const interval = setInterval(() => {
        angle4Time += 0.1
        const y1 = 15 + Math.sin(angle4Time) * 2
        const y2 = 25 + Math.cos(angle4Time) * 2
        const y3 = 10 + Math.sin(angle4Time + 1) * 3
        
        path4.setAttribute('d', `M10 ${y1} L20 ${y2} L30 ${y3}`)
      }, 50)
      intervals.push(interval)
    }
  }
}

// Torus Animation
function initTorusAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[]) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  let time = 0
  
  function drawTorus() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 10
    
    // Draw concentric circles with individual animations
    for (let i = 0; i < 8; i++) {
      const baseRadius = maxRadius - (i * maxRadius / 8)
      // Each circle has its own animation pattern
      const radiusOffset = Math.sin(time * (0.05 + i * 0.01) + i * 0.5) * (maxRadius / 20)
      const radius = baseRadius + radiusOffset
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1
      
      // Different dash patterns for different circles
      if (i % 3 === 0) {
        // Solid line
        ctx.setLineDash([])
      } else if (i % 3 === 1) {
        // Dashed line
        const dashLength = radius * Math.PI / (8 + i)
        ctx.setLineDash([dashLength, dashLength])
        ctx.lineDashOffset = time * (i % 2 === 0 ? 1 : -1) * 2
      } else {
        // Dotted line
        ctx.setLineDash([2, 6])
        ctx.lineDashOffset = time * (i % 2 === 0 ? -1 : 1) * 3
      }
      
      ctx.stroke()
    }
    
    // Update torus info with animated values
    const torusSize = document.getElementById('torus-size')
    const torusX = document.getElementById('torus-x')
    const torusY = document.getElementById('torus-y')
    const torusZ = document.getElementById('torus-z')
    
    if (torusSize) torusSize.textContent = `Size: ${9405 + Math.floor(Math.sin(time * 0.1) * 50)}`
    if (torusX) torusX.textContent = `X: ${1042 + Math.floor(Math.sin(time * 0.2) * 10)}`
    if (torusY) torusY.textContent = `Y: ${5673 + Math.floor(Math.cos(time * 0.15) * 20)}`
    if (torusZ) torusZ.textContent = `Z: ${9473 + Math.floor(Math.sin(time * 0.12) * 15)}`
    
    time += 0.05
    const animationId = requestAnimationFrame(drawTorus)
    animationFrames.push(animationId)
  }
  
  const animationId = requestAnimationFrame(drawTorus)
  animationFrames.push(animationId)
}

// Frequency Animation
function initFrequencyAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[]) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  let time = 0
  
  function drawFrequency() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw grid
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    
    // Vertical grid lines
    const gridSizeX = Math.floor(canvas.width / 20)
    for (let i = 0; i <= gridSizeX; i++) {
      const x = i * 20
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    // Horizontal grid lines
    const gridSizeY = Math.floor(canvas.height / 20)
    for (let i = 0; i <= gridSizeY; i++) {
      const y = i * 20
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    
    // Draw frequency curve with unique animation
    ctx.beginPath()
    
    // Start at bottom left
    ctx.moveTo(0, canvas.height)
    
    // Create a unique curve that changes over time
    // This uses a combination of sine waves with different frequencies
    const controlX = canvas.width * (0.5 + Math.sin(time * 0.03) * 0.1)
    const controlY = canvas.height * (0.1 + Math.cos(time * 0.02) * 0.05)
    const endX = canvas.width
    const endY = canvas.height * (0.8 + Math.sin(time * 0.04) * 0.1)
    
    // Create a bezier curve with animated control points
    ctx.quadraticCurveTo(controlX, controlY, endX, endY)
    
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Draw center point with pulsing effect
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const centerRadius = 4 + Math.sin(time * 0.1) * 2
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    
    // Draw control point (square) that moves with the curve
    const squareSize = 10
    ctx.fillStyle = 'white'
    ctx.fillRect(endX - squareSize, endY - squareSize / 2, squareSize, squareSize)
    
    time += 0.05
    const animationId = requestAnimationFrame(drawFrequency)
    animationFrames.push(animationId)
  }
  
  const animationId = requestAnimationFrame(drawFrequency)
  animationFrames.push(animationId)
}

// Amplitude Curve Animation
function initAmplitudeCurveAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[]) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  let time = 0
  
  function drawAmplitudeCurve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw a bezier curve that changes shape over time
    ctx.beginPath()
    
    // Start point
    const startX = 10
    const startY = canvas.height / 2
    
    // End point
    const endX = canvas.width - 10
    const endY = canvas.height / 2
    
    // Control points that move in a circular pattern
    const cp1x = canvas.width * (0.3 + Math.cos(time * 0.1) * 0.1)
    const cp1y = canvas.height * (0.2 + Math.sin(time * 0.15) * 0.2)
    const cp2x = canvas.width * (0.7 + Math.cos(time * 0.12) * 0.1)
    const cp2y = canvas.height * (0.8 + Math.sin(time * 0.08) * 0.2)
    
    ctx.moveTo(startX, startY)
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
    
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // Update amplitude value
    const amplitudeValue = document.getElementById('amplitude-value')
    if (amplitudeValue) amplitudeValue.textContent = (2578 + Math.floor(Math.sin(time) * 50)).toString()
    
    time += 0.05
    const animationId = requestAnimationFrame(drawAmplitudeCurve)
    animationFrames.push(animationId)
  }
  
  const animationId = requestAnimationFrame(drawAmplitudeCurve)
  animationFrames.push(animationId)
}

// Dynamics Animation (3D Sphere)
function initDynamicsAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[]) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  let time = 0
  
  function drawDynamics() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.6
    
    // Save the current transformation matrix
    ctx.save()
    
    // Translate to center and apply a slow rotation
    ctx.translate(centerX, centerY)
    ctx.rotate(time * 0.05)
    
    // Draw horizontal ellipses
    for (let i = 0; i < 12; i++) {
      const angle = (i / 11) * Math.PI
      const scaleY = Math.cos(angle)
      const translateY = Math.sin(angle) * radius
      
      // Each ellipse has its own unique animation
      const scaleX = 1 + Math.sin(time * 0.03 + i * 0.2) * 0.1
      
      ctx.beginPath()
      ctx.ellipse(
        0, 
        translateY, 
        radius * Math.abs(scaleX), 
        radius * Math.abs(scaleY) * 0.2, 
        time * 0.02 + i * 0.1, 
        0, 
        Math.PI * 2
      )
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
    
    // Draw vertical ellipses
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI
      const rotateY = angle
      
      // Each ellipse has its own unique animation
      const scaleX = 1 + Math.sin(time * 0.04 + i * 0.3) * 0.1
      
      ctx.save()
      ctx.rotate(rotateY)
      ctx.beginPath()
      ctx.ellipse(
        0, 
        0, 
        radius * Math.abs(scaleX), 
        radius, 
        0, 
        0, 
        Math.PI * 2
      )
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.restore()
    }
    
    // Add some random connecting lines for mesh effect
    for (let i = 0; i < 30; i++) {
      const angle1 = Math.random() * Math.PI * 2
      const angle2 = Math.random() * Math.PI * 2
      
      const x1 = Math.cos(angle1 + time * 0.01) * radius * (0.7 + Math.sin(time * 0.05 + i) * 0.3)
      const y1 = Math.sin(angle1 + time * 0.01) * radius * (0.7 + Math.sin(time * 0.05 + i) * 0.3)
      
      const x2 = Math.cos(angle2 + time * 0.01) * radius * (0.7 + Math.sin(time * 0.05 + i + 1) * 0.3)
      const y2 = Math.sin(angle2 + time * 0.01) * radius * (0.7 + Math.sin(time * 0.05 + i + 1) * 0.3)
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
    
    // Restore the transformation matrix
    ctx.restore()
    
    // Draw corner squares
    ctx.fillStyle = 'white'
    ctx.fillRect(10, 10, 5, 5)
    ctx.fillRect(canvas.width - 15, 10, 5, 5)
    ctx.fillRect(10, canvas.height - 15, 5, 5)
    ctx.fillRect(canvas.width - 15, canvas.height - 15, 5, 5)
    
    // Update dynamics values
    const dynamicsTl = document.getElementById('dynamics-tl')
    const dynamicsTr = document.getElementById('dynamics-tr')
    const dynamicsBl = document.getElementById('dynamics-bl')
    const dynamicsBr = document.getElementById('dynamics-br')
    
    if (dynamicsTl) dynamicsTl.textContent = ((146642 + Math.floor(time * 2)) % 1000000).toString()
    if (dynamicsTr) dynamicsTr.textContent = ((389751 - Math.floor(time)) % 1000000).toString()
    if (dynamicsBl) dynamicsBl.textContent = ((748271 + Math.floor(Math.sin(time * 0.1) * 50)) % 1000000).toString()
    if (dynamicsBr) dynamicsBr.textContent = ((898525 - Math.floor(Math.cos(time * 0.1) * 75)) % 1000000).toString()
    
    time += 0.05
    const animationId = requestAnimationFrame(drawDynamics)
    animationFrames.push(animationId)
  }
  
  const animationId = requestAnimationFrame(drawDynamics)
  animationFrames.push(animationId)
}

// Mesh Animation
function initMeshAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[]) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  let time = 0
  
  function drawMesh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw border
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
    
    // Draw grid mesh with unique wave deformation
    const gridSizeX = 20
    const gridSizeY = 4
    const cellWidth = (canvas.width - 40) / gridSizeX
    const cellHeight = (canvas.height - 40) / gridSizeY
    
    // Draw horizontal lines with wave deformation
    for (let y = 0; y <= gridSizeY; y++) {
      ctx.beginPath()
      
      for (let x = 0; x <= gridSizeX; x++) {
        const xPos = 20 + x * cellWidth
        
        // Create a unique wave pattern for each line
        // This combines multiple sine waves with different frequencies
        const waveX = (x / gridSizeX) * Math.PI
        const waveY = (y / gridSizeY) * Math.PI
        const waveTime = time * 0.05
        
        const deformY = Math.sin(waveX + waveTime) * 
                       Math.sin(waveY + waveTime * 0.7) * 
                       cellHeight * 1.5
        
        const yPos = 20 + y * cellHeight - deformY
        
        if (x === 0) {
          ctx.moveTo(xPos, yPos)
        } else {
          ctx.lineTo(xPos, yPos)
        }
      }
      
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    
    // Draw vertical lines with the same wave deformation
    for (let x = 0; x <= gridSizeX; x++) {
      ctx.beginPath()
      
      for (let y = 0; y <= gridSizeY; y++) {
        const xPos = 20 + x * cellWidth
        
        // Use the same wave pattern for consistency
        const waveX = (x / gridSizeX) * Math.PI
        const waveY = (y / gridSizeY) * Math.PI
        const waveTime = time * 0.05
        
        const deformY = Math.sin(waveX + waveTime) * 
                       Math.sin(waveY + waveTime * 0.7) * 
                       cellHeight * 1.5
        
        const yPos = 20 + y * cellHeight - deformY
        
        if (y === 0) {
          ctx.moveTo(xPos, yPos)
        } else {
          ctx.lineTo(xPos, yPos)
        }
      }
      
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    
    // Draw small squares at the bottom
    ctx.fillStyle = 'white'
    const squareSize = 5
    const squareY = canvas.height - 10
    const squareSpacing = 20
    const startX = canvas.width / 2 - (squareSpacing * 2)
    
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(startX + (i * squareSpacing), squareY, squareSize, squareSize)
    }
    
    // Update mesh values
    const meshLeft = document.getElementById('mesh-left')
    const meshCenter = document.getElementById('mesh-center')
    const meshRight = document.getElementById('mesh-right')
    const meshFarRight = document.getElementById('mesh-far-right')
    
    if (meshLeft) meshLeft.textContent = ((533254 + Math.floor(Math.sin(time * 0.1) * 100)) % 1000000).toString()
    if (meshCenter) meshCenter.textContent = (301 + Math.floor(time * 0.1) % 10).toString()
    if (meshRight) meshRight.textContent = ((957452 - Math.floor(Math.cos(time * 0.1) * 50)) % 1000000).toString()
    if (meshFarRight) meshFarRight.textContent = (5263 - Math.floor(time * 0.2) % 20).toString()
    
    time += 0.05
    const animationId = requestAnimationFrame(drawMesh)
    animationFrames.push(animationId)
  }
  
  const animationId = requestAnimationFrame(drawMesh)
  animationFrames.push(animationId)
}

// Tracking Animation
function initTrackingAnimation(canvas: HTMLCanvasElement | null, animationFrames: number[]) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  let time = 0
  
  // Base points for tracking
  const basePoints = [
    [50, 50],
    [70, 40],
    [90, 60],
    [60, 80],
    [40, 70]
  ]
  
  function drawTracking() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw grid
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    
    // Vertical grid lines
    const gridSizeX = Math.floor(canvas.width / 20)
    for (let i = 0; i <= gridSizeX; i++) {
      const x = i * 20
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    
    // Horizontal grid lines
    const gridSizeY = Math.floor(canvas.height / 20)
    for (let i = 0; i <= gridSizeY; i++) {
      const y = i * 20
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    
    // Generate animated tracking points
    // Each point moves in a unique pattern
    const points = basePoints.map(([x, y], i) => {
      // Create unique movement patterns for each point
      const newX = x + Math.sin(time * 0.1 + i * 0.5) * 5
      const newY = y + Math.cos(time * 0.15 + i * 0.3) * 5
      return [newX, newY]
    })
    
    // Draw lines between points
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1])
    }
    
    // Close the shape
    ctx.lineTo(points[0][0], points[0][1])
    
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Draw points
    points.forEach(([x, y], i) => {
      ctx.beginPath()
      // Each point has a slightly different size
      const radius = 3 + Math.sin(time * 0.2 + i) * 1
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
    })
    
    // Draw center crosshair with rotation
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(time * 0.1)
    
    // Circle
    ctx.beginPath()
    ctx.arc(0, 0, 10, 0, Math.PI * 2)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Cross
    ctx.beginPath()
    ctx.moveTo(-15, 0)
    ctx.lineTo(15, 0)
    ctx.moveTo(0, -15)
    ctx.lineTo(0, 15)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.stroke()
    
    ctx.restore()
    
    // Draw bottom crosshair with opposite rotation
    const bottomX = centerX
    const bottomY = centerY + 60
    
    ctx.save()
    ctx.translate(bottomX, bottomY)
    ctx.rotate(-time * 0.15)
    
    // Circle
    ctx.beginPath()
    ctx.arc(0, 0, 10, 0, Math.PI * 2)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Cross
    ctx.beginPath()
    ctx.moveTo(-15, 0)
    ctx.lineTo(15, 0)
    ctx.moveTo(0, -15)
    ctx.lineTo(0, 15)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.stroke()
    
    ctx.restore()
    
    // Update loss value
    const trackingLoss = document.getElementById('tracking-loss')
    if (trackingLoss) trackingLoss.textContent = `Loss: ${6190 - Math.floor(Math.sin(time * 0.05) * 100)}`
    
    time += 0.05
    const animationId = requestAnimationFrame(drawTracking)
    animationFrames.push(animationId)
  }
  
  const animationId = requestAnimationFrame(drawTracking)
  animationFrames.push(animationId)
}

// Progress bar animation
function startProgressAnimation(progressBlocks: HTMLDivElement | null, intervals: number[]) {
  if (!progressBlocks) return
  
  const blocks = progressBlocks.querySelectorAll('.progress-block')
  if (!blocks.length) return
  
  let currentBlock = 0
  
  const interval = setInterval(() => {
    // Reset all blocks
    blocks.forEach(block => block.classList.remove('active'))
    
    // Activate blocks up to current
    for (let i = 0; i <= currentBlock; i++) {
      blocks[i].classList.add('active')
    }
    
    // Increment and loop
    currentBlock = (currentBlock + 1) % blocks.length
  }, 300)
  
  intervals.push(interval)
}

// Amplitude bar animations
function startAmplitudeBarAnimations(intervals: number[]) {
  const bars = [
    document.getElementById('amp-bar-1'),
    document.getElementById('amp-bar-2'),
    document.getElementById('amp-bar-3'),
    document.getElementById('amp-bar-4'),
    document.getElementById('amp-bar-5')
  ]
  
  if (!bars.every(bar => bar)) return
  
  let time = 0
  
  const interval = setInterval(() => {
    time += 0.1
    
    bars.forEach((bar, i) => {
      if (!bar) return
      // Each bar has a unique animation pattern
      const width = 90 + Math.sin(time + i * 0.5) * 10
      bar.style.width = `${width}%`
    })
  }, 50)
  
  intervals.push(interval)
}

// Dot matrix animation
function startDotMatrixAnimation(dotMatrix: HTMLDivElement | null, intervals: number[]) {
  if (!dotMatrix) return
  
  const dots = dotMatrix.querySelectorAll('.dot')
  if (!dots.length) return
  
  let time = 0
  
  const interval = setInterval(() => {
    time += 0.1
    
    dots.forEach((dot, i) => {
      // Each dot has a unique pulsing pattern
      const opacity = 0.3 + Math.sin(time + i * 0.2) * 0.7
      (dot as HTMLElement).style.opacity = Math.abs(opacity).toString()
    })
  }, 50)
  
  intervals.push(interval)
} 