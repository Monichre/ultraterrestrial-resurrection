"use client";

import {
	OrbitControls,
	PerspectiveCamera,
	useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Constants for the helix
const PARTICLES_PER_CURVE = 1200;
const CURVES = 2;
const RADIUS = 4;
const HELIX_RADIUS = 2;
const ROTATION_SPEED = 0.2;
const PARTICLE_SIZE = 0.06;
const COLOR_SHIFT_SPEED = 0.5;
const TWO_PI = Math.PI * 2;
const EIGHT_PI = Math.PI * 8;

// Helix component
function Helix({ mousePosition }: { mousePosition: { x: number; y: number } }) {
	const points = useRef<THREE.Vector3[][]>([]);
	const particles = useRef<THREE.Points>(null);
	const { camera } = useThree();

	// Use SharedArrayBuffer for better performance with Bun
	const positions = useRef(new Float32Array(PARTICLES_PER_CURVE * CURVES * 3));
	const colors = useRef(new Float32Array(PARTICLES_PER_CURVE * CURVES * 3));
	const sizes = useRef(new Float32Array(PARTICLES_PER_CURVE * CURVES));

	// Load texture with suspense
	const particleTexture = useTexture("/particle.png");

	// Initialize particles
	useEffect(() => {
		// Use Web Workers for initialization if complex calculations are needed
		const initializeParticles = () => {
			for (let curve = 0; curve < CURVES; curve++) {
				if (points.current) {
					points.current[curve] = [];
				}

				for (let i = 0; i < PARTICLES_PER_CURVE; i++) {
					const t = i / PARTICLES_PER_CURVE;
					const angle = t * EIGHT_PI + curve * Math.PI;

					const index = (curve * PARTICLES_PER_CURVE + i) * 3;

					// Position
					positions.current[index] = Math.cos(angle) * HELIX_RADIUS;
					positions.current[index + 1] = t * RADIUS * 4 - RADIUS * 2;
					positions.current[index + 2] = Math.sin(angle) * HELIX_RADIUS;

					// Size with variation
					sizes.current[curve * PARTICLES_PER_CURVE + i] =
						PARTICLE_SIZE * (0.8 + Math.random() * 0.4);

					// Color with gradient
					const tempColor = new THREE.Color();
					tempColor.setHSL(t + curve * 0.5, 0.8, 0.5);
					colors.current[index] = tempColor.r;
					colors.current[index + 1] = tempColor.g;
					colors.current[index + 2] = tempColor.b;
				}
			}
		};

		initializeParticles();
	}, []);

	// Optimized animation frame
	useFrame((state) => {
		const time = state.clock.getElapsedTime();

		if (particles.current) {
			// Smooth mouse-based rotation
			const targetRotationY = mousePosition.x * 0.5;
			const targetRotationX = mousePosition.y * 0.3;

			particles.current.rotation.y +=
				(targetRotationY - particles.current.rotation.y) * 0.05;
			particles.current.rotation.x +=
				(targetRotationX - particles.current.rotation.x) * 0.05;
			particles.current.rotation.y += ROTATION_SPEED * 0.01;

			const positions = particles.current.geometry.attributes.position.array;
			const colors = particles.current.geometry.attributes.color.array;
			const sizes = particles.current.geometry.attributes.size.array;

			// Batch process particles for better performance
			for (let i = 0; i < PARTICLES_PER_CURVE * CURVES; i++) {
				const index = i * 3;
				const t = (i / PARTICLES_PER_CURVE + time * 0.1) % 1;
				const angle =
					t * EIGHT_PI + Math.floor(i / PARTICLES_PER_CURVE) * Math.PI;

				// Wave effect
				const wave = Math.sin(time * 2 + t * TWO_PI) * 0.2;

				// Update position
				positions[index] = Math.cos(angle) * HELIX_RADIUS + wave;
				positions[index + 1] = t * RADIUS * 4 - RADIUS * 2;
				positions[index + 2] = Math.sin(angle) * HELIX_RADIUS + wave;

				// Update color
				const tempColor = new THREE.Color();
				tempColor.setHSL((t + time * COLOR_SHIFT_SPEED) % 1, 0.8, 0.5);
				colors[index] = tempColor.r;
				colors[index + 1] = tempColor.g;
				colors[index + 2] = tempColor.b;

				// Update size
				sizes[i] = PARTICLE_SIZE * (1 + Math.sin(time * 3 + t * TWO_PI) * 0.3);
			}

			particles.current.geometry.attributes.position.needsUpdate = true;
			particles.current.geometry.attributes.color.needsUpdate = true;
			particles.current.geometry.attributes.size.needsUpdate = true;
		}
	});

	const particleGeometry = useMemo(() => {
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions.current, 3),
		);
		geometry.setAttribute(
			"color",
			new THREE.BufferAttribute(colors.current, 3),
		);
		geometry.setAttribute("size", new THREE.BufferAttribute(sizes.current, 1));
		return geometry;
	}, []);

	// Shader material
	const shaderMaterial = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				pointTexture: { value: particleTexture },
			},
			vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
			fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			transparent: true,
			vertexColors: true,
		});
	}, [particleTexture]);

	return (
		<points
			ref={particles}
			geometry={particleGeometry}
			material={shaderMaterial}
		/>
	);
}

// Create a component that contains the R3F Canvas
interface SceneRendererProps {
	mousePosition: { x: number; y: number };
}

export function SceneRenderer({ mousePosition }: SceneRendererProps) {
	return (
		<Canvas>
			<ambientLight intensity={0.2} />
			<pointLight position={[10, 10, 10]} intensity={0.5} />
			<pointLight position={[-10, -10, -10]} intensity={0.5} />
			<PerspectiveCamera makeDefault position={[0, 0, 10]} />
			<OrbitControls
				enablePan={false}
				enableZoom={true}
				maxDistance={20}
				minDistance={5}
				autoRotate
				autoRotateSpeed={0.5}
			/>
			<fog attach="fog" args={["#000000", 5, 30]} />
			<color attach="background" args={["#000000"]} />
			<Helix mousePosition={mousePosition} />
		</Canvas>
	);
}
