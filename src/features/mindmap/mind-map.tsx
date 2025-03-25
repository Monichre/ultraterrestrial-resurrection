"use client";

import { Graph } from "@/features/mindmap/graph";

import { MindMapProvider } from "@/contexts/mindmap";
import { ReactFlowProvider } from "@xyflow/react";

export const MindMap: React.FC = () => {
	return (
		<ReactFlowProvider>
			<MindMapProvider>
				<Graph />
			</MindMapProvider>
		</ReactFlowProvider>
	);
};
