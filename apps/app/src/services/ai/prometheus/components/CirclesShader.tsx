"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import * as THREE from "three"
import { shaderMaterial, useControls } from "@react-three/drei";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float iTime;
  uniform vec2  iResolution;
  uniform vec2  mouse;
  uniform float grainStrength;
  uniform float grainIntensity;
  varying vec2  vUv;

  // 2D Random
  float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 2D Noise based on Morgan McGuire @morgan3d
  float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float grain(vec2 uv) {
    return random(uv * grainIntensity) * grainStrength;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    vec2 mousePos = mouse / iResolution.xy * 2.0 - 1.0;
    vec3 color = vec3(0.0);

    float count = 36.0;

    for (float i = 0.0; i < count; i++) {
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);
      float radius = 0.2 + (count - i) * 0.012 + noise(uv + iTime - i * 0.04) * 0.1;
      radius += length(uv - mousePos) * 0.1;
      float thickness = 0.008 + sin(iTime + dist * 10.0) * 0.005;
      float sep = 0.03;
      float noisyRadius = radius + noise(uv + iTime - i * sep) * 0.05;
      float edge = smoothstep(noisyRadius - thickness, noisyRadius, dist) - smoothstep(noisyRadius, noisyRadius + thickness, dist);
      float proximity = 1.0 - length(uv - mousePos);
      float brightness = mix(0.3, 1.5, proximity);
      color += vec3(edge * brightness) * pow((count - i) / count, 2.0) * 0.5;
    }
    float grayscale = dot(color, vec3(0.299, 0.587, 0.114));
    grayscale += grain(vUv);
    fragColor = vec4(vec3(grayscale), 1.0);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

/*****************************************
 * SHADER MATERIAL
 *****************************************/

// Create a typed R3F-compatible shader material using drei's helper
const GrainShaderMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new THREE.Vector2(1, 1),
    mouse: new THREE.Vector2(0, 0),
    grainStrength: 0.05,
    grainIntensity: 50.0,
  },
  vertexShader,
  fragmentShader,
);

extend({ GrainShaderMaterial });

type GrainShaderMaterialImpl = THREE.ShaderMaterial & {
  uniforms: {
    iTime: { value: number };
    iResolution: { value: THREE.Vector2 };
    mouse: { value: THREE.Vector2 };
    grainStrength: { value: number };
    grainIntensity: { value: number };
  };
};

// Shader component that uses the custom shader
function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { viewport, size } = useThree()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Use state for grain settings
  const [grainSettings] = useState({
    grainStrength: 0.05,
    grainIntensity: 50,
  })

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Update shader uniforms on each frame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.iTime.value = clock.getElapsedTime()
      material.uniforms.mouse.value = new THREE.Vector2(mousePosition.x, mousePosition.y)
      material.uniforms.iResolution.value = new THREE.Vector2(size.width, size.height)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={{
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(size.width, size.height) },
          mouse: { value: new THREE.Vector2(0, 0) },
          grainStrength: { value: grainSettings.grainStrength },
          grainIntensity: { value: grainSettings.grainIntensity },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  )
}

export default function CirclesShader() {
  return (
    <div className="canvas-container">
      <Canvas      gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 1], fov: 75 }}>
        <ShaderPlane />
      </Canvas>
    </div>
  )
}
