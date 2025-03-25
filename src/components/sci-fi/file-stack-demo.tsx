"use client";

import { HolographicFileStack } from "./holographic-file-stack";

export function FileStackDemo() {
	// Example files with custom properties
	const demoFiles = [
		{ title: "Project Alpha", color: "#4f46e5", id: "alpha" },
		{ title: "Classified Data", color: "#8b5cf6", id: "data" },
		{ title: "Research Notes", color: "#ec4899", id: "notes" },
		{ title: "Mission Brief", color: "#f43f5e", id: "brief" },
	];

	return (
		<div className="w-full max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-4 text-white">
				Holographic File Stack
			</h2>
			<p className="mb-6 text-gray-300">
				Hover over a file to see details. Click to expand the stack.
			</p>
			<div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-white/10">
				<HolographicFileStack
					files={demoFiles}
					spacing={0.08}
					className="h-[400px] shadow-lg shadow-indigo-500/20"
				/>
			</div>
		</div>
	);
}
