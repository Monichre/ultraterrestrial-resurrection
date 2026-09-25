"use client"

import { Graph } from "@/features/mindmap/graph"
import { MindMapProvider } from "@/contexts/mindmap"
import { ReactFlowProvider } from "@xyflow/react"
import { ViewSwitcher } from "@/features/mindmap/research-canvas/ViewSwitcher"

export const MindMap: React.FC = () => {
	return (
		<ReactFlowProvider>
			<MindMapProvider>
				<ViewSwitcher canvasContent={<Graph />} />
			</MindMapProvider>
		</ReactFlowProvider>
	)
}
