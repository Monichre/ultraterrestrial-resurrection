"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type React from "react";
import { Suspense, memo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

/* ------------------------------------------------------------------ */
/*  Atmosphere — additive fresnel rim shader                          */
/* ------------------------------------------------------------------ */

const ATMOSPHERE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ATMOSPHERE_FRAGMENT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uPower);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

const Atmosphere: React.FC<{ intensityRef: React.MutableRefObject<number> }> = ({
	intensityRef,
}) => {
	const matRef = useRef<THREE.ShaderMaterial>(null!);
	useFrame(() => {
		if (matRef.current) {
			matRef.current.uniforms.uIntensity.value = intensityRef.current;
		}
	});
	return (
		<mesh scale={2.75}>
			<sphereGeometry args={[1, 64, 64]} />
			<shaderMaterial
				ref={matRef}
				vertexShader={ATMOSPHERE_VERTEX}
				fragmentShader={ATMOSPHERE_FRAGMENT}
				transparent
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
				depthWrite={false}
				uniforms={{
					uColor: { value: new THREE.Color("#4aa8ff") },
					uIntensity: { value: 0 },
					uPower: { value: 2.6 },
				}}
			/>
		</mesh>
	);
};

/* ------------------------------------------------------------------ */
/*  Camera rig — GSAP dolly-in + mouse parallax                       */
/* ------------------------------------------------------------------ */

const CameraRig: React.FC = () => {
	const { camera, size } = useThree();
	const targetX = useRef(0);
	const targetY = useRef(0);

	useGSAP(() => {
		camera.position.set(0, 0, 12);
		gsap.to(camera.position, {
			z: 5,
			duration: 2.4,
			ease: "expo.out",
			delay: 0.15,
		});
	}, []);

	useFrame(() => {
		camera.position.x += (targetX.current - camera.position.x) * 0.05;
		camera.position.y += (targetY.current - camera.position.y) * 0.05;
		camera.lookAt(0, 0, 0);
	});

	useGSAP(() => {
		const onMove = (e: MouseEvent) => {
			const nx = (e.clientX / size.width) * 2 - 1;
			const ny = -((e.clientY / size.height) * 2 - 1);
			targetX.current = nx * 0.4;
			targetY.current = ny * 0.25;
		};
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, [size.width, size.height]);

	return null;
};

/* ------------------------------------------------------------------ */
/*  Earth mesh                                                        */
/* ------------------------------------------------------------------ */

type RotatingComponentProps = {
	atmosphereIntensity: React.MutableRefObject<number>;
};

const RotatingComponent: React.FC<RotatingComponentProps> = memo(
	({ atmosphereIntensity }) => {
		const earthRef = useRef<THREE.Mesh>(null!);
		const groupRef = useRef<THREE.Group>(null!);

		const [color, normal, aoMap] = useLoader(TextureLoader, [
			"/assets/earth2/color.jpg",
			"/assets/earth2/normal.png",
			"/assets/earth2/occlusion.jpg",
		]) as THREE.Texture[];

		useFrame((_, delta) => {
			if (earthRef.current) earthRef.current.rotation.y += delta / 10;
		});

		// GSAP entrance + idle breathing on the wrapper group
		useGSAP(
			() => {
				if (!groupRef.current) return;
				const g = groupRef.current;
				g.scale.setScalar(0.001);
				g.rotation.z = 0;

				const tl = gsap.timeline({ delay: 0.2 });

				// scale punch-in
				tl.to(g.scale, {
					x: 1,
					y: 1,
					z: 1,
					duration: 1.8,
					ease: "back.out(1.4)",
				}, 0);

				// axial tilt swing into place
				tl.to(
					g.rotation,
					{ z: 23.5 * (Math.PI / 180), duration: 2.0, ease: "power3.out" },
					0,
				);

				// atmosphere fade-in via shared ref
				tl.to(
					atmosphereIntensity,
					{ current: 1.15, duration: 2.2, ease: "power2.out" },
					0.3,
				);

				// idle breathing loop
				tl.to(g.scale, {
					x: 1.015,
					y: 1.015,
					z: 1.015,
					duration: 4,
					ease: "sine.inOut",
					repeat: -1,
					yoyo: true,
				});
			},
			{ scope: groupRef },
		);

		return (
			<group ref={groupRef}>
				<motion.mesh scale={2.5} ref={earthRef} rotation-y={0.5}>
					<sphereGeometry args={[1, 64, 64]} />
					<meshStandardMaterial
						map={color}
						normalMap={normal}
						aoMap={aoMap}
						metalness={0.05}
						roughness={0.95}
					/>
				</motion.mesh>
				<Atmosphere intensityRef={atmosphereIntensity} />
			</group>
		);
	},
);
RotatingComponent.displayName = "RotatingComponent";

interface EarthProps {
	activeLocation?: any;
}

export const Earth: React.FC<EarthProps> = memo(() => {
	const atmosphereIntensity = useRef(0);

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
				<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 12], fov: 45 }}>
					<CameraRig />
					<ambientLight intensity={0.12} />
					<directionalLight intensity={1.6} position={[1, 0.2, -0.25]} />
					<RotatingComponent atmosphereIntensity={atmosphereIntensity} />
				</Canvas>
			</Suspense>
		</div>
	);
});

export const EN: React.FC<{ ref?: React.Ref<THREE.Mesh> }> = memo(() => {
	const [color, normal, aoMap] = useLoader(TextureLoader, [
		"/8k_earth_nightmap.jpeg",
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
