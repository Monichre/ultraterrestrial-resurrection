'use client'

import React, {useEffect, useRef} from 'react'

// Shader code as strings
const vertexShaderText = `
  precision highp float;
  
  attribute vec3 position;
  uniform float time;
  
  uniform mat4 u_matrix;
  
  void main() {
    float x = position[0]+sin(time)*0.2;
    float y = position[1]+cos(time)*0.2;
    float z = position[2]+sin(time)*0.3;
    gl_Position = u_matrix * vec4(position, 1.0);
    gl_PointSize = 1.0;
  }
`

const fragmentShaderText = `
  precision highp float;
  
  void main() {
    gl_FragColor = vec4(0.6, 0.7, 1.0, 0.4);
  }
`

// Matrix utility functions
const m4 = {
  perspective: (fieldOfViewInRadians: number, aspect: number, near: number, far: number) => {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians)
    const rangeInv = 1.0 / (near - far)

    return [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ]
  },

  projection: (width: number, height: number, depth: number) => [
    2 / width,
    0,
    0,
    0,
    0,
    -2 / height,
    0,
    0,
    0,
    0,
    2 / depth,
    0,
    -1,
    1,
    0,
    1,
  ],

  multiply: (a: number[], b: number[]) => {
    const a00 = a[0 * 4 + 0]
    const a01 = a[0 * 4 + 1]
    const a02 = a[0 * 4 + 2]
    const a03 = a[0 * 4 + 3]
    const a10 = a[1 * 4 + 0]
    const a11 = a[1 * 4 + 1]
    const a12 = a[1 * 4 + 2]
    const a13 = a[1 * 4 + 3]
    const a20 = a[2 * 4 + 0]
    const a21 = a[2 * 4 + 1]
    const a22 = a[2 * 4 + 2]
    const a23 = a[2 * 4 + 3]
    const a30 = a[3 * 4 + 0]
    const a31 = a[3 * 4 + 1]
    const a32 = a[3 * 4 + 2]
    const a33 = a[3 * 4 + 3]
    const b00 = b[0 * 4 + 0]
    const b01 = b[0 * 4 + 1]
    const b02 = b[0 * 4 + 2]
    const b03 = b[0 * 4 + 3]
    const b10 = b[1 * 4 + 0]
    const b11 = b[1 * 4 + 1]
    const b12 = b[1 * 4 + 2]
    const b13 = b[1 * 4 + 3]
    const b20 = b[2 * 4 + 0]
    const b21 = b[2 * 4 + 1]
    const b22 = b[2 * 4 + 2]
    const b23 = b[2 * 4 + 3]
    const b30 = b[3 * 4 + 0]
    const b31 = b[3 * 4 + 1]
    const b32 = b[3 * 4 + 2]
    const b33 = b[3 * 4 + 3]
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ]
  },

  translation: (tx: number, ty: number, tz: number) => [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    tx,
    ty,
    tz,
    1,
  ],

  xRotation: (angleInRadians: number) => {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]
  },

  yRotation: (angleInRadians: number) => {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]
  },

  zRotation: (angleInRadians: number) => {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  },

  scaling: (sx: number, sy: number, sz: number) => [
    sx,
    0,
    0,
    0,
    0,
    sy,
    0,
    0,
    0,
    0,
    sz,
    0,
    0,
    0,
    0,
    1,
  ],

  translate: (m: number[], tx: number, ty: number, tz: number) =>
    m4.multiply(m, m4.translation(tx, ty, tz)),

  xRotate: (m: number[], angleInRadians: number) => m4.multiply(m, m4.xRotation(angleInRadians)),

  yRotate: (m: number[], angleInRadians: number) => m4.multiply(m, m4.yRotation(angleInRadians)),

  zRotate: (m: number[], angleInRadians: number) => m4.multiply(m, m4.zRotation(angleInRadians)),

  scale: (m: number[], sx: number, sy: number, sz: number) =>
    m4.multiply(m, m4.scaling(sx, sy, sz)),
}

// Helper function for normal distribution
function randn_bm() {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  num = num / 10.0 + 0.5
  if (num > 1 || num < 0) return randn_bm()
  return num
}

interface DnaVisualizationProps {
  className?: string
}

export function DnaVisualization({className}: DnaVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gl = canvas.getContext('webgl')
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    // WebGL setup
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1.0)
    gl.clearDepth(1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    if (!vertexShader || !fragmentShader) {
      console.error('Error creating shaders')
      return
    }

    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    // Create and link program
    const program = gl.createProgram()
    if (!program) {
      console.error('Error creating program')
      return
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    // Constants
    const VERTICECOUNT = window.innerHeight * 50

    // Initialize arrays
    const verticesArr: number[] = []
    const velocitiesArr: number[] = []
    const vertexMass: number[] = []

    // Fill arrays with initial values
    for (let j = 0; j < VERTICECOUNT; j++) {
      verticesArr.push(Math.random() * 10 - 5)
      verticesArr.push(Math.random() * 10 - 5)
      verticesArr.push(Math.random() * 10 - 5)
      velocitiesArr.push(0.0)
      velocitiesArr.push(0.0)
      velocitiesArr.push(0.0)
      vertexMass.push(Math.random() ** 2 * 0.05 + 0.05)
    }

    const vertices = new Float32Array(verticesArr)
    const velocities = new Float32Array(velocitiesArr)
    const targetPositions = new Float32Array(VERTICECOUNT * 3)
    const rotatedLocations = new Float32Array(targetPositions.length)

    // Buffer setup
    const vertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)

    const positionAttribLocation = gl.getAttribLocation(program, 'position')
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(positionAttribLocation)

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'time')
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

    // Function to compute target positions based on model
    const computeTargetPositions = (model = 'none') => {
      if (model === 'dna') {
        for (let j = 0; j < VERTICECOUNT; j++) {
          const a = j % 2 // split into left and right dna string
          let f = j / VERTICECOUNT
          if (j % 3 === 0) {
            f = Math.round(f * 30) / 30
          }

          const errorScale = 0.2
          const errorx = errorScale * (Math.random() - 0.5) ** 3
          const errory = errorScale * (Math.random() - 0.5) ** 3
          const errorz = errorScale * (Math.random() - 0.5) ** 3

          let x = Math.sin(f * 4 * Math.PI + Math.PI * a) * 0.3
          let z = Math.cos(f * 4 * Math.PI + Math.PI * a) * 0.3
          const y = (f - 0.5) * 4 + errory

          if (j % 3 === 0) {
            const r = (j % 100) / 100
            x = x * r
            z = z * r
          }

          targetPositions[j * 3 + 0] = x + errorx
          targetPositions[j * 3 + 1] = y + errory
          targetPositions[j * 3 + 2] = z + errorz
        }
      } else if (model === 'torus') {
        for (let i = 0; i < targetPositions.length; i += 3) {
          const alpha = Math.random() * Math.PI * 2
          const torusRadius = 1
          const torusStrengthRadius = 0.25
          const b = Math.random() * 2 * Math.PI
          const pointR = torusRadius + Math.cos(b) * torusStrengthRadius
          const pointY = Math.sin(b) * torusStrengthRadius
          const pointX = Math.sin(alpha) * pointR
          const pointZ = Math.cos(alpha) * pointR

          const errorScale = 0.2
          const errorx = errorScale * (Math.random() - 0.5) ** 3
          const errory = errorScale * (Math.random() - 0.5) ** 3
          const errorz = errorScale * (Math.random() - 0.5) ** 3

          targetPositions[i + 0] = pointX + errorx
          targetPositions[i + 1] = pointZ + errorz
          targetPositions[i + 2] = pointY + errory
        }
      } else {
        for (let i = 0; i < targetPositions.length; i += 3) {
          targetPositions[i + 0] = 5 * (randn_bm() - 0.5)
          targetPositions[i + 1] = 5 * (randn_bm() - 0.5)
          targetPositions[i + 2] = 5 * (randn_bm() - 0.5)
        }
      }
    }

    computeTargetPositions('dna') // Initial computation

    // Animation setup
    let t = 0
    const mediumDensity = 0.1 // 0 = vacuum, 1 = maximum drag
    const gravitationalForce = 1e-4

    // Compute matrix for the view
    const computeMatrix = () => {
      const aspect = canvas.width / canvas.height
      const zNear = 1
      const zFar = 200
      let matrix = m4.perspective(Math.PI / 3, aspect, zNear, zFar)
      matrix = m4.translate(matrix, -1, 0, -5)
      matrix = m4.zRotate(matrix, -Math.PI / 8)
      matrix = m4.xRotate(matrix, window.scrollY / window.innerHeight / 8 - 0.5)
      return matrix
    }

    let matrix = computeMatrix()
    gl.useProgram(program)
    gl.uniformMatrix4fv(matrixLocation, false, matrix)

    // Animation loop
    const render = () => {
      t += 1
      const theta = t / 200

      // Resize canvas if window size changed
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        gl.viewport(0, 0, canvas.width, canvas.height)
      }

      // Rotate the vertices around the y axis
      for (let ii = 0; ii < VERTICECOUNT * 3; ii += 3) {
        rotatedLocations[ii + 0] =
          Math.cos(theta) * targetPositions[ii + 0] - Math.sin(theta) * targetPositions[ii + 2]
        rotatedLocations[ii + 1] = targetPositions[ii + 1]
        rotatedLocations[ii + 2] =
          Math.sin(theta) * targetPositions[ii + 0] + Math.cos(theta) * targetPositions[ii + 2]
      }

      // Update vertex positions based on physics
      for (let i = 0; i < VERTICECOUNT * 3; i++) {
        const vertexIndex = Math.floor(i / 3)
        vertices[i] += velocities[i]
        const momentum = velocities[i] * (1 - mediumDensity)
        const force =
          (rotatedLocations[i] - vertices[i]) * gravitationalForce + Math.random() * 1e-5
        const mass = vertexMass[vertexIndex]
        velocities[i] = momentum + force / mass
      }

      // Update matrix and send to shader
      matrix = computeMatrix()
      gl.uniformMatrix4fv(matrixLocation, false, matrix)

      // Update buffer data
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)

      // Render
      gl.clearColor(0, 0, 0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.uniform1f(timeLocation, t)
      gl.drawArrays(gl.POINTS, 0, VERTICECOUNT)
      gl.flush()

      // Request next frame
      animationFrameId = requestAnimationFrame(render)
    }

    // Setup intersection observer for scroll sections
    const observerOptions = {
      rootMargin: '0px',
      threshold: [0.8],
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.intersectionRatio >= 0.8) {
          const model = entry.target.getAttribute('data-model')
          if (model) {
            computeTargetPositions(model)
          }
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const sections = document.querySelectorAll('.dna-section')

    for (const section of sections) {
      observer.observe(section)
    }

    // Start animation loop
    let animationFrameId = requestAnimationFrame(render)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()

      // Cleanup WebGL resources
      if (program) {
        gl.deleteProgram(program)
      }
      if (vertexShader) {
        gl.deleteShader(vertexShader)
      }
      if (fragmentShader) {
        gl.deleteShader(fragmentShader)
      }
      if (vertexBufferObject) {
        gl.deleteBuffer(vertexBufferObject)
      }
    }
  }, [])

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <canvas ref={canvasRef} className='fixed top-0 left-0 w-full h-screen bg-black -z-10' />
      <div className='snap-y snap-mandatory'>
        <section
          data-model='dna'
          className='dna-section h-screen text-white snap-start pt-[60vh] md:pt-[60vh] md:pr-10 md:pl-[60vw]'>
          <div className='bg-black/60 p-5'>
            <h2 className='text-2xl font-bold mb-3'>DNA</h2>
            <p className='text-sm md:text-base'>
              Desoxyribonukleinsäure, meist kurz als DNA bezeichnet, ist eine aus unterschiedlichen
              Desoxyribonukleotiden aufgebaute Nukleinsäure. Sie trägt die Erbinformation bei allen
              Lebewesen und vielen Viren (nicht RNA-Viren). Das langkettige Polynukleotid enthält in
              Abschnitten von Genen besondere Abfolgen seiner Nukleotide. Diese DNA-Abschnitte
              dienen als Matrizen für den Aufbau entsprechender Ribonukleinsäuren, wenn die
              genetische Information in RNA-Stränge umgeschrieben wird (siehe Transkription). Im
              Falle einer Boten-RNA (englisch messenger RNA, mRNA) stellt die Abfolge von
              Nukleinbasen darüber hinaus die Bauanleitung für ein Protein dar.
            </p>
          </div>
        </section>
        <section
          data-model='none'
          className='dna-section h-screen text-white snap-start pt-[60vh] md:pt-[60vh] md:pr-10 md:pl-[60vw]'>
          <div className='bg-black/60 p-5'>
            <h2 className='text-2xl font-bold mb-3'>Random Distribution</h2>
            <p className='text-sm md:text-base'>
              This visualization shows particles in a random distribution pattern.
            </p>
          </div>
        </section>
        <section
          data-model='torus'
          className='dna-section h-screen text-white snap-start pt-[60vh] md:pt-[60vh] md:pr-10 md:pl-[60vw]'>
          <div className='bg-black/60 p-5'>
            <h2 className='text-2xl font-bold mb-3'>Torus</h2>
            <p className='text-sm md:text-base'>
              This visualization demonstrates particles arranged in a torus (donut) shape.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
