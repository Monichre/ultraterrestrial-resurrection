import { cn } from "@/lib/utils";
import type React from "react";

export interface CanvasAnnotationsProps
	extends React.HTMLAttributes<HTMLDivElement> {
	annotations?: Array<{
		id: string;
		x: number;
		y: number;
		content: React.ReactNode;
	}>;
	onAnnotationClick?: (id: string) => void;
}

export function CanvasAnnotations({
	annotations = [],
	onAnnotationClick,
	className,
	...props
}: CanvasAnnotationsProps) {
	return (
		<div className={cn("relative h-full w-full", className)} {...props}>
			{annotations.map(({ id, x, y, content }) => (
				<div
					key={id}
					className="absolute inline-flex cursor-pointer items-center justify-center"
					style={{
						left: `${x}%`,
						top: `${y}%`,
						transform: "translate(-50%, -50%)",
					}}
					onClick={() => onAnnotationClick?.(id)}
				>
					<div className="relative">
						<div className="absolute -inset-1 animate-ping rounded-full bg-primary/50 opacity-75" />
						<div className="relative rounded-full bg-primary p-1" />
					</div>
					<div className="ml-2 rounded-md bg-background/95 px-2 py-1 text-sm shadow-md">
						{content}
					</div>
				</div>
			))}
		</div>
	);
}
