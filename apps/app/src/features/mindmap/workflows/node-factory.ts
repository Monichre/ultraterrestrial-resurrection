import type { GenerateTextNodeController } from "@/features/mindmap/workflows/generate-text-node-controller"
import type { PromptCrafterNodeController } from "@/features/mindmap/workflows/prompt-crafter-node-controller"
import type { TextInputNodeController } from "@/features/mindmap/workflows/text-input-node-controller"
import type { VisualizeTextNodeController } from "@/features/mindmap/workflows/visualize-text-node-controller"
import type { FlowNode } from "@/lib/flow/workflow"
import { nanoid } from "nanoid"

export type NodePosition = {
	x: number
	y: number
}

export const nodeFactory = {
	"generate-text": ( position: NodePosition ): GenerateTextNodeController => ( {
		id: nanoid(),
		type: "generate-text",
		position,
		data: {
			config: {
				model: "llama-3.1-8b-instant",
			},
			dynamicHandles: {
				tools: [],
			},
		},
	} ),

	"prompt-crafter": ( position: NodePosition ): PromptCrafterNodeController => ( {
		id: nanoid(),
		type: "prompt-crafter",
		position,
		data: {
			config: {
				template: "",
			},
			dynamicHandles: {
				"template-tags": [],
			},
		},
	} ),

	"visualize-text": ( position: NodePosition ): VisualizeTextNodeController => ( {
		id: nanoid(),
		type: "visualize-text",
		position,
		data: {},
		width: 350,
		height: 300,
	} ),

	"text-gray-200 dark:text-gray-800": ( position: NodePosition ): TextInputNodeController => ( {
		id: nanoid(),
		type: "text-gray-200 dark:text-gray-800",
		position,
		data: {
			config: {
				value: "",
			},
		},
		width: 350,
		height: 300,
	} ),
}

export function createNode(
	nodeType: FlowNode["type"],
	position: NodePosition,
): FlowNode {
	if ( !nodeType ) {
		throw new Error( "Node type is required" )
	}
	const factory = nodeFactory[nodeType]
	if ( !factory ) {
		throw new Error( `Unknown node type: ${nodeType}` )
	}
	return factory( position )
}
