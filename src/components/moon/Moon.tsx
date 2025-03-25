"use client";

import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, TiltShift2 } from "@react-three/postprocessing";
import { Suspense, useRef } from "react";

// @ts-ignore
// eslint-disable-next-line

import type * as THREE from "three";

useGLTF.preload("/assets/moon/moon.glb");

export const MoonScene = () => {
	const { nodes, materials }: any = useGLTF("/assets/moon/moon.glb");

	const meshRef = useRef<THREE.Mesh>(null);
	useFrame((state, delta) => {
		return (meshRef.current.rotation.y += delta / 10);
	});
	return (
		<group>
			<mesh
				ref={meshRef}
				geometry={nodes["Sphere001_Material_#39_0"].geometry}
				material={materials.Material_39}
				material-normalScale={1.5}
				scale={0.04}
			/>
			<group>
				<spotLight
					position={[10, 0, -10]}
					intensity={1.75}
					angle={0.15}
					penumbra={1}
				/>
			</group>
		</group>
	);
};

// Start of Selection
export const Moon = () => {
	return (
		<div
			className="h-[60vh] w-[60vw] absolute top-1/4 left-1/4 -translate-x-1/4 -translate-y-1/4"
			id="moon-canvas"
		>
			<Canvas gl={{ antialias: false }}>
				{/* <color attach='background' args={['#101015']} /> */}
				<PerspectiveCamera makeDefault position={[0, -0.5, 5]} fov={50} />
				<ambientLight intensity={0.01} />
				<directionalLight intensity={5} position={[1, 5, -2]} />
				<Suspense fallback={null}>
					<MoonScene />
				</Suspense>
				<EffectComposer enableNormalPass={false}>
					<Bloom mipmapBlur luminanceThreshold={0.5} />
					<TiltShift2 blur={0.35} />
				</EffectComposer>
			</Canvas>
		</div>
	);
};
