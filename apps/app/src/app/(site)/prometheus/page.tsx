'use client'
import { Prometheus } from '@/features/agents/prometheus'
import { PrometheusPage } from '@packages/ai/prometheus/lib'

// Import the CSS for styling
import '@packages/ai/prometheus/styles/prometheus.css'

export default function PrometheusPage() {
  const [mounted, setMounted] = useState(false)
  const [shaderMaterial, setShaderMaterial] = useState<THREE.ShaderMaterial | null>(null)
  const {theme} = useTheme()

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

    // Fragment Shader with proximity-based lighting adjustment and theme awareness
    const fragmentShader = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 mouse;
    uniform float grainStrength; // Uniform for controlling grain strength
    uniform float grainIntensity; // Uniform for controlling grain intensity
    uniform float themeMode; // 1.0 for dark, 0.0 for light
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

        // Theme-aware output: invert for light mode
        float finalColor = mix(1.0 - grayscale, grayscale, themeMode);
        
        // Set the output color as theme-aware black and white with static grain
        fragColor = vec4(vec3(finalColor), 1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`

    // Material that applies the shader effect with theme awareness
    const isDark = theme === 'dark'
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: {value: 0},
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        mouse: {value: new THREE.Vector2(0, 0)},
        grainStrength: {value: isDark ? 0.05 : 0.02}, // Adjust grain for theme
        grainIntensity: {value: isDark ? 50.0 : 30.0}, // Adjust intensity for theme
        themeMode: {value: isDark ? 1.0 : 0.0}, // Theme uniform for shader
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    // Create a plane covering the entire canvas and apply the shader material
    const plane = new THREE.Mesh(planeGeometry, material)
    scene.add(plane)
    
    // Store material reference for theme updates
    setShaderMaterial(material)

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
      if (renderer.domElement.parentNode) {
        document.body.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update shader when theme changes
  useEffect(() => {
    if (shaderMaterial?.uniforms) {
      const isDark = theme === 'dark'
      shaderMaterial.uniforms.grainStrength.value = isDark ? 0.05 : 0.02
      shaderMaterial.uniforms.grainIntensity.value = isDark ? 50.0 : 30.0
      shaderMaterial.uniforms.themeMode.value = isDark ? 1.0 : 0.0
    }
  }, [theme, shaderMaterial])

  return (
    <main className='prometheus-page main min-h-screen relative'>
      {/* The Three.js visualization needs to be the first element to ensure it's behind everything else */}

      {/* Breadcrumb Navigation */}
      <div className='absolute top-20 left-10 z-20'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/explore' className='text-white/70 hover:text-white transition-colors'>
                  Explore
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-white font-monumentMono tracking-wide'>
                Prometheus AI Agent
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Text wrapper with Agent in the center */}
      <div className='text-wrapper relative z-10'>
        <h2 className='small-text font-monumentMono tracking-wider text-sm opacity-70'>
          I once brought you Fire
        </h2>

        {/* Agent component in the center instead of the text */}
        <div className='flex-1 flex items-center justify-center w-[33vw] max-w-4xl mx-auto'>
          <Prometheus />
        </div>

        <h2 className='small-text font-monumentMono tracking-wider text-sm opacity-70'>
          Now I bring you Disclosure
        </h2>
      </div>

      <Toaster position='top-right' />
    </main>
  )
}
