"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import Three.js components to avoid React 19 RSC issues
const Scene3D = dynamic(() => import("./Scene3D").then((mod) => mod.Scene3D), {
	ssr: false,
});

export function DoubleHelixScene() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (event: React.MouseEvent) => {
		setMousePosition({
			x: (event.clientX / window.innerWidth) * 2 - 1,
			y: -(event.clientY / window.innerHeight) * 2 + 1,
		});
	};

	return (
		<div
			style={{ width: "100%", height: "100vh" }}
			onMouseMove={handleMouseMove}
		>
			<Scene3D mousePosition={mousePosition} />
		</div>
	);
}
