"use client"

import { TextInputNode } from "@/features/mindmap/workflows/text-input-node"
import { useWorkflow } from "@/hooks/flow/use-workflow"
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine"
import type { NodeProps } from "@xyflow/react"
import { useCallback } from "react"

export type TextInputNodeController = Omit<TextInputNode, "data"> & {
	type: "text-gray-200 dark:text-gray-800"
	data: Omit<TextInputNode["data"], "status"> & {
		executionState?: NodeExecutionState
	}
}

export function TextInputNodeController( {
	id,
	data,
	...props
}: NodeProps<TextInputNodeController> ) {
	const updateNode = useWorkflow( ( state ) => state.updateNode )
	const deleteNode = useWorkflow( ( state ) => state.deleteNode )

	const handleTextChange = useCallback(
		( value: string ) => {
			updateNode( id, "text-gray-200 dark:text-gray-800", { config: { value } } )
		},
		[id, updateNode],
	)

	const handleDeleteNode = useCallback( () => {
		deleteNode( id )
	}, [id, deleteNode] )

	return (
		<TextInputNode
			id={id}
			data={{
				status: data.executionState?.status,
				config: data.config,
			}}
			{...props}
			onTextChange={handleTextChange}
			onDeleteNode={handleDeleteNode}
		/>
	)
}
