"use client";

import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";

interface FileStackProps {
	files?: {
		title: string;
		color: string;
		id: string;
	}[];
	spacing?: number;
	rotationFactor?: number;
	className?: string;
}

function HolographicFileStack({
	files = [
		{ title: "Document 1", color: "#4f46e5", id: "doc1" },
		{ title: "Document 2", color: "#8b5cf6", id: "doc2" },
		{ title: "Document 3", color: "#ec4899", id: "doc3" },
		{ title: "Document 4", color: "#f43f5e", id: "doc4" },
	],
	spacing = 0.05,
	rotationFactor = 0.2,
	className = "",
}: FileStackProps) {
	return (
		<div className={`h-80 w-full rounded-xl ${className}`}>
			<Canvas shadows dpr={[1, 2]}>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[-10, -10, -10]} />
				<Scene
					files={files}
					spacing={spacing}
					rotationFactor={rotationFactor}
				/>
				<OrbitControls enableZoom={false} enablePan={false} />
			</Canvas>
		</div>
	);
}

function Scene({
	files,
	spacing,
	rotationFactor,
}: Omit<FileStackProps, "className">) {
	const { camera } = useThree();

	React.useEffect(() => {
		camera.position.set(0, 0, 4);
	}, [camera]);

	return (
		<group>
			{files?.map((file) => (
				<File
					key={file.id}
					position={[0, 0, -files.indexOf(file) * (spacing || 0.05)]}
					color={file.color}
					title={file.title}
					index={files.indexOf(file)}
					rotationFactor={rotationFactor || 0.2}
					totalFiles={files.length}
				/>
			))}
		</group>
	);
}

interface FileProps {
	position: [number, number, number];
	color: string;
	title: string;
	index: number;
	rotationFactor: number;
	totalFiles: number;
}

function File({
	position,
	color,
	title,
	index,
	rotationFactor,
	totalFiles,
}: FileProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const [hovered, setHovered] = useState(false);
	const [expanded, setExpanded] = useState(false);

	useFrame((state) => {
		if (!meshRef.current) return;

		const mesh = meshRef.current;

		if (expanded) {
			// When expanded, move the file outward based on its index
			const targetZ = -index * 0.3;
			mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, 0.1);

			// Rotate slightly for 3D effect
			mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, 0.1, 0.1);
			mesh.rotation.y = THREE.MathUtils.lerp(
				mesh.rotation.y,
				index * 0.05,
				0.1,
			);
		} else {
			// Return to original position
			mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, position[2], 0.1);
			mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, 0, 0.1);
			mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, 0, 0.1);
		}

		// Add subtle floating animation
		if (!expanded) {
			mesh.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.02;
			mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.01;
		}

		// Scale effect on hover
		mesh.scale.x = THREE.MathUtils.lerp(mesh.scale.x, hovered ? 1.1 : 1, 0.1);
		mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, hovered ? 1.1 : 1, 0.1);
	});

	const handleClick = () => {
		setExpanded(!expanded);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			setExpanded(!expanded);
		}
	};

	return (
		<group>
			<mesh
				ref={meshRef}
				position={position}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				castShadow
				receiveShadow
			>
				<planeGeometry args={[1.5, 1]} />
				<meshStandardMaterial
					color={color}
					transparent
					opacity={0.8}
					metalness={0.5}
					roughness={0.2}
					emissive={color}
					emissiveIntensity={hovered ? 0.5 : 0.2}
				/>
				<Text
					position={[0, 0, 0.01]}
					color="white"
					fontSize={0.07}
					anchorX="center"
					anchorY="middle"
				>
					{title}
				</Text>
			</mesh>
		</group>
	);
}

export { HolographicFileStack };
