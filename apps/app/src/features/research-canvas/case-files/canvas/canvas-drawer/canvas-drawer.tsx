"use client";

import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";

export interface CanvasDrawerProps {
	children?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	side?: "left" | "right";
	className?: string;
	showHandle?: boolean;
}

export function CanvasDrawer({
	children,
	open = false,
	onOpenChange,
	side = "right",
	className,
	showHandle = true,
}: CanvasDrawerProps) {
	const [isOpen, setIsOpen] = React.useState(open);

	React.useEffect(() => {
		setIsOpen(open);
	}, [open]);

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		onOpenChange?.(newState);
	};

	React.useEffect(() => {
		if (!isOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleToggle();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	return (
		<>
			{showHandle && (
				<motion.button
					onClick={handleToggle}
					aria-expanded={isOpen}
					aria-label={isOpen ? "Collapse drawer" : "Open drawer"}
					className={cn(
						"group fixed top-1/2 z-50 -translate-y-1/2",
						side === "left" ? "left-0" : "right-0",
					)}
					whileTap={{ scale: 0.95 }}
				>
					<div
						className={cn(
							"relative flex h-24 w-4 items-center justify-center",
							"border-y border-neutral-700 bg-neutral-900/90",
							side === "left"
								? "rounded-r-md border-r border-l-0"
								: "rounded-l-md border-l border-r-0",
							"transition-colors duration-150 group-hover:bg-neutral-800",
						)}
					>
						<div className="h-8 w-px bg-neutral-500 transition-colors group-hover:bg-neutral-300" />
					</div>
				</motion.button>
			)}

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							className="fixed inset-0 z-40 bg-black/40"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={handleToggle}
						/>
						<motion.div
							role="dialog"
							aria-modal="true"
							aria-label="Evidence detail"
							className={cn(
								"fixed inset-y-0 z-50 w-80",
								"bg-neutral-950/95",
								"border-neutral-700",
								side === "left" ? "left-0 border-r" : "right-0 border-l",
								"overflow-y-auto",
								className,
							)}
							initial={{
								x: side === "left" ? "-100%" : "100%",
								opacity: 0,
							}}
							animate={{
								x: 0,
								opacity: 1,
							}}
							exit={{
								x: side === "left" ? "-100%" : "100%",
								opacity: 0,
							}}
							transition={{
								type: "spring",
								damping: 25,
								stiffness: 200,
							}}
						>
							<motion.button
								onClick={handleToggle}
								aria-label="Close drawer"
								className={cn(
									"group absolute right-4 top-4 z-20",
									"rounded p-1.5",
									"text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200",
									"transition-colors duration-150",
								)}
								whileTap={{ scale: 0.95 }}
							>
								<X className="h-4 w-4" />
							</motion.button>
							<div
								className="absolute inset-0 pointer-events-none opacity-30"
								style={{ backgroundImage: "url('/canvas-texture.png')" }}
							/>
							<div className="relative h-full p-6">{children}</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
