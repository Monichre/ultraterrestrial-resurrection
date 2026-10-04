"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";
import type React from "react";

interface CanvasGridItem {
	id: string;
	content: React.ReactNode;
	width?: number;
	height?: number;
}

interface CanvasGridProps {
	items: CanvasGridItem[];
	className?: string;
	columns?: number;
	gap?: number;
}

export function CanvasGrid({
	items,
	className,
	columns = 3,
	gap = 20,
}: CanvasGridProps) {
	return (
		<div
			className={cn("grid auto-rows-[minmax(180px,auto)] gap-4", className)}
			style={{
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
				gap: `${gap}px`,
			}}
		>
			{items.map((item) => (
				<motion.div
					key={item.id}
					className="group relative overflow-hidden rounded-lg bg-white p-2 shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-900"
					style={{
						gridColumn: `span ${Math.min(item.width || 1, columns)}`,
						gridRow: `span ${item.height || 1}`,
					}}
					whileHover={{
						scale: 1.02,
						rotate: [-1, 1, 0],
						transition: { duration: 0.3 },
					}}
				>
					<div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-white/5" />
					<div className="relative h-full">{item.content}</div>
					<div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-white/10" />
				</motion.div>
			))}
		</div>
	);
}
