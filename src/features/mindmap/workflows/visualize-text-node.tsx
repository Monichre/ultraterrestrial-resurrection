import { type Node, type NodeProps, Position } from "@xyflow/react"

import { MarkdownContent } from "@/components/ui/markdown-content"
import { Separator } from "@/components/ui/separator"
import { LabeledHandle } from "@/features/mindmap/workflows/labeled-handle"
import {
	NodeHeader,
	NodeHeaderAction,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/features/mindmap/workflows/node-header"
import { ResizableNode } from "@/features/mindmap/workflows/resizable-node"
import { cn } from "@/utils"
import { Eye, Trash } from "lucide-react"

export type VisualizeTextNode = Node<
	{
		status: "processing" | "error" | "success" | "idle" | undefined
		input: string | undefined
	},
	"visualize-text"
>

interface VisualizeTextProps extends NodeProps<VisualizeTextNode> {
	onDeleteNode?: () => void
}

export function VisualizeTextNode( {
	id,
	selected,
	data,
	onDeleteNode,
}: VisualizeTextProps ) {
	return (
		<ResizableNode
			selected={selected}
			className={cn( "flex flex-col", {
				"border-orange-500": data.status === "processing",
				"border-red-500": data.status === "error",
			} )}
		>
			<NodeHeader className="m-0">
				<NodeHeaderIcon>
					<Eye />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Visualize Text</NodeHeaderTitle>
				<NodeHeaderActions>
					<NodeHeaderAction
						onClick={onDeleteNode}
						variant="ghost"
						label="Delete node"
					>
						<Trash />
					</NodeHeaderAction>
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-2 flex-1 overflow-auto flex flex-col">
				<div className="flex-1 overflow-auto nodrag nopan nowheel border border-gray-200 rounded-md p-2 select-text cursor-auto dark:border-gray-800">
					<MarkdownContent
						id={id}
						content={data.input ? data.input : "No text to display"}
					/>
				</div>
			</div>
			<div className="flex justify-start pt-2 pb-4 text-sm">
				<LabeledHandle
					id="input"
					title="Input"
					type="target"
					position={Position.Left}
				/>
			</div>
		</ResizableNode>
	)
}
