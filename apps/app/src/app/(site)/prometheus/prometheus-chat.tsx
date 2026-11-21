'use client'
import {Inter, IBM_Plex_Mono} from 'next/font/google'
import {Agent} from './agent'

import {Toaster} from 'sonner'

import {useState, useEffect} from 'react'
import * as THREE from 'three'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-secondary',
})

export default function PrometheusChat() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    document.body.classList.add('prometheus-page')

    return () => {
      document.body.classList.remove('prometheus-page')
    }
  }, [])

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // Make the renderer transparent
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    document.body.appendChild(renderer.domElement)

    // Geometry (fullscreen plane)
    const planeGeometry = new THREE.PlaneGeometry(2, 2)

    // Vertex Shader
    const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`

    // Fragment Shader with proximity-based lighting adjustment on the objects
    const fragmentShader = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 mouse;
    uniform float grainStrength; // Uniform for controlling grain strength
    uniform float grainIntensity; // Uniform for controlling grain intensity
    varying vec2 vUv;

    // 2D Random
    float random(in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    float noise(in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
               (c - a) * u.y * (1.0 - u.x) +
               (d - b) * u.x * u.y;
    }

    // Function to add static grain/noise effect
    float grain(vec2 uv) {
        return random(uv * grainIntensity) * grainStrength; // Static grain based on UV coordinates
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        // Get the normalized coordinates (0 to 1)
        vec2 uv = fragCoord.xy / iResolution.xy;
        
        // Correct the aspect ratio
        uv = uv * 2.0 - 1.0;
        uv.x *= iResolution.x / iResolution.y;

        vec2 mousePos = mouse / iResolution.xy * 2.0 - 1.0; // Normalize mouse to -1 to 1
        vec3 color = vec3(0.0);

        float count = 36.0;

        for (float i = 0.0; i < count; i++) {
            // Calculate the distance and angle from the center of the circle
            float dist = length(uv);
            float angle = atan(uv.y, uv.x);

            // Introduce some variation in the radius based on the mouse position and noise
            float radius = 0.2 + (count - i) * 0.012 + noise(uv + iTime - i * 0.04) * 0.1;
            radius += length(uv - mousePos) * 0.1; // React to the cursor's proximity

            // Adjust the thickness dynamically
            float thickness = 0.008 + sin(iTime + dist * 10.0) * 0.005;

            float sep = 0.03;
            float noisyRadius = radius + noise(uv + iTime - i * sep) * 0.05;

            // Calculate the edge using smoothstep
            float edge = smoothstep(noisyRadius - thickness, noisyRadius, dist) - smoothstep(noisyRadius, noisyRadius + thickness, dist);

            // Proximity-based light adjustment (only affects circles)
            float proximity = 1.0 - length(uv - mousePos); // Closer = more light, further = less light
            float brightness = mix(0.3, 1.5, proximity);  // Mix between dim (0.3) and bright (1.5) based on proximity

            color += vec3(edge * brightness) * pow((count - i) / count, 2.0) * 0.5;
        }

        // Convert color to grayscale for black and white effect
        float grayscale = dot(color, vec3(0.299, 0.587, 0.114));

        // Apply static grain effect
        grayscale += grain(vUv);

        // Set the output color as black and white with static grain
        fragColor = vec4(vec3(grayscale), 1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`

    // Material that applies the shader effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: {value: 0},
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        mouse: {value: new THREE.Vector2(0, 0)},
        grainStrength: {value: 0.05}, // Initial grain strength
        grainIntensity: {value: 50.0}, // Initial grain intensity
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    // Create a plane covering the entire canvas and apply the shader material
    const plane = new THREE.Mesh(planeGeometry, material)
    scene.add(plane)

    // Camera position
    camera.position.z = 1

    // Mouse movement interaction
    window.addEventListener('mousemove', (event) => {
      const mouse = new THREE.Vector2()
      mouse.x = event.clientX
      mouse.y = window.innerHeight - event.clientY // Flip Y for Three.js coordinate system
      material.uniforms.mouse.value = mouse
    })

    // Animation loop
    function animate(time) {
      time *= 0.001 // Convert time to seconds
      material.uniforms.iTime.value = time
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    // Handle resize events
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight)
    })

    // Start animation
    animate(0)

    // Set mounted state to true
    setMounted(true)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', () => {})
      window.removeEventListener('mousemove', () => {})
      document.body.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <main className={`${inter.variable} ${ibmPlexMono.variable}`}>
      {/* The Three.js visualization needs to be the first element to ensure it's behind everything else */}

      {/* Noise overlay <CirclesShader /> */}

      {/* Text wrapper with Agent in the center */}
      <div className='text-wrapper'>
        <h2 className='small-text'>I once brought you Fire</h2>

        {/* Agent component in the center instead of the text */}
        <div className='flex-1 flex items-center justify-center w-[33vw]'>
          <Agent />
        </div>

        <h2 className='small-text'>Now I bring you Disclosure</h2>
      </div>
    </main>
  )
}
