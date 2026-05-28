"use client";

import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, TiltShift2 } from "@react-three/postprocessing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Suspense, useRef } from "react";
import type * as THREE from "three";

useGLTF.preload("/assets/moon/moon.glb");

/* ------------------------------------------------------------------ */
/*  Camera rig — soft mouse parallax for the moon canvas               */
/* ------------------------------------------------------------------ */

const MoonCameraRig: React.FC = () => {
	const { camera, size } = useThree();
	const tx = useRef(0);
	const ty = useRef(0);

	useFrame(() => {
		camera.position.x += (tx.current - camera.position.x) * 0.04;
		camera.position.y += (ty.current - -0.5 - camera.position.y) * 0.04;
	});

	useGSAP(() => {
		const onMove = (e: MouseEvent) => {
			const nx = (e.clientX / size.width) * 2 - 1;
			const ny = -((e.clientY / size.height) * 2 - 1);
			tx.current = nx * 0.6;
			ty.current = ny * 0.4;
		};
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, [size.width, size.height]);

	return null;
};

/* ------------------------------------------------------------------ */
/*  Moon scene — GLB on a pivot group so we can swing it on an arc     */
/* ------------------------------------------------------------------ */

export const MoonScene = () => {
	const { nodes, materials }: any = useGLTF("/assets/moon/moon.glb");

	const meshRef = useRef<THREE.Mesh>(null!);
	const pivotRef = useRef<THREE.Group>(null!);
	const innerRef = useRef<THREE.Group>(null!);

	useFrame((_, delta) => {
		if (meshRef.current) meshRef.current.rotation.y += delta / 10;
	});

	useGSAP(
		() => {
			if (!pivotRef.current || !innerRef.current) return;
			const pivot = pivotRef.current;
			const inner = innerRef.current;

			// start: off-frame and tiny
			pivot.rotation.z = -1.05;
			inner.scale.setScalar(0.001);

			const tl = gsap.timeline({ delay: 0.4 });

			tl.to(pivot.rotation, {
				z: 0,
				duration: 2.6,
				ease: "expo.out",
			}, 0);

			tl.to(inner.scale, {
				x: 1,
				y: 1,
				z: 1,
				duration: 2.0,
				ease: "back.out(1.6)",
			}, 0);

			// idle drift on the pivot
			tl.to(pivot.rotation, {
				z: 0.06,
				duration: 6,
				ease: "sine.inOut",
				repeat: -1,
				yoyo: true,
			});
		},
		{ scope: pivotRef },
	);

	return (
		<group ref={pivotRef}>
			<group ref={innerRef}>
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
		</group>
	);
};

export const Moon = () => {
	return (
		<div
			className="h-[60vh] w-[60vw] absolute top-1/4 left-1/4 -translate-x-1/4 -translate-y-1/4"
			id="moon-canvas"
		>
			<Canvas gl={{ antialias: false }} dpr={[1, 2]}>
				<PerspectiveCamera makeDefault position={[0, -0.5, 5]} fov={50} />
				<MoonCameraRig />
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
