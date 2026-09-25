"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";

// Dynamically import everything with a Next.js dynamic wrapper
const DynamicScene = dynamic(
	() => import("./SceneRenderer").then((mod) => mod.SceneRenderer),
	{ ssr: false },
);

// Wrapper component that uses dynamic import
export const Scene3D = forwardRef<
	HTMLDivElement,
	{ mousePosition: { x: number; y: number } }
>(function Scene3D({ mousePosition }, ref) {
	return <DynamicScene mousePosition={mousePosition} />;
});
