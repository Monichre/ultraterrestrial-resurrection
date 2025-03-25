"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import type React from "react";
import { Suspense, memo, useRef } from "react";
import type * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

// Define prop types (replace 'any' with actual types)
type RotatingComponentProps = {};

const RotatingComponent: React.FC<RotatingComponentProps> = memo(() => {
	const earthRef = useRef<THREE.Mesh>(null!);

	useFrame((state, delta) => {
		earthRef.current.rotation.y += delta / 10;
	});

	const [color, normal, aoMap] = useLoader(TextureLoader, [
		"/assets/earth2/color.jpg",
		"/assets/earth2/normal.png",
		"/assets/earth2/occlusion.jpg",
	]) as THREE.Texture[];

	return (
		<motion.mesh scale={2.5} ref={earthRef} rotation-y={0.5}>
			<sphereGeometry args={[1, 32, 32]} />{" "}
			{/* Reduced segments for performance */}
			<meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap} />
		</motion.mesh>
	);
});
RotatingComponent.displayName = "RotatingComponent";

interface EarthProps {
	activeLocation: any;
}

export const Earth: React.FC<EarthProps> = memo(() => {
	return (
		<div className="h-[80vh] w-[80vw] m-auto" id="earth-canvas">
			<Suspense
				fallback={
					<img
						alt="Earth placeholder"
						src="/assets/earth2/placeholder.png"
						width={1000}
						height={1000}
						loading="lazy"
					/>
				}
			>
				<Canvas>
					<ambientLight intensity={0.1} />
					<directionalLight intensity={1.5} position={[1, 0, -0.25]} />{" "}
					{/* Adjusted intensity */}
					<RotatingComponent />
				</Canvas>
			</Suspense>
		</div>
	);
});

export const EN: React.FC<{ ref?: React.Ref<THREE.Mesh> }> = memo(() => {
	const [color, normal, aoMap] = useLoader(TextureLoader, [
		"/8k_earth_nightmap.jpeg",
		// Add additional textures as needed
	]) as THREE.Texture[];

	return (
		<Suspense
			fallback={
				<img
					alt="Earth at night placeholder"
					src="/assets/earth2/placeholder.png"
					width={1000}
					height={1000}
					loading="lazy"
				/>
			}
		>
			<Canvas style={{ width: "100%", height: "100%" }}>
				<ambientLight intensity={0.1} />
				<directionalLight intensity={1.5} position={[1, 0, -0.25]} />
				<motion.mesh scale={2.5}>
					<sphereGeometry args={[1, 32, 32]} />

					<meshStandardMaterial map={color} normalMap={normal} aoMap={aoMap} />
				</motion.mesh>
			</Canvas>
		</Suspense>
	);
});
