"use client"

import { cn } from "@/utils"
import type { HandleProps } from "@xyflow/react"
import React from "react"

import { BaseHandle } from "@/features/mindmap/workflows/base-handle"

const flexDirections = {
	top: "flex-col",
	right: "flex-row-reverse justify-end",
	bottom: "flex-col-reverse justify-end",
	left: "flex-row",
}

const LabeledHandle = React.forwardRef<
	HTMLDivElement,
	HandleProps &
	React.HTMLAttributes<HTMLDivElement> & {
		title: string
		handleClassName?: string
		labelClassName?: string
	}
>(
	(
		{ className, labelClassName, handleClassName, title, position, ...props },
		ref,
	) => (
		<div
			ref={ref}
			title={title}
			className={cn(
				"relative flex items-center",
				flexDirections[position],
				className,
			)}
		>
			<BaseHandle position={position} className={handleClassName} {...props} />
			{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
			<label className={cn( "px-3 text-gray-950 dark:text-gray-50", labelClassName )}>
				{title}
			</label>
		</div>
	),
)

LabeledHandle.displayName = "LabeledHandle"

export { LabeledHandle }

