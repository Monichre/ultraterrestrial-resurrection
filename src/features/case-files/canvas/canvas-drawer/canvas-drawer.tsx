"use client";

import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";

export interface CanvasDrawerProps {
	children: React.ReactNode;
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

	return (
		<>
			{showHandle && (
				<motion.button
					onClick={handleToggle}
					className={cn(
						"group fixed top-1/2 z-50 -translate-y-1/2",
						side === "left" ? "left-0" : "right-0",
					)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<div
						className={cn(
							"relative flex h-24 w-8 items-center justify-center",
							"rounded-full bg-gradient-to-b from-primary/20 to-primary/10",
							"border border-primary/20 backdrop-blur-sm",
							"dark:from-primary/30 dark:to-primary/20",
							"transition-colors duration-200",
							"group-hover:from-primary/30 group-hover:to-primary/20",
							"dark:group-hover:from-primary/40 dark:group-hover:to-primary/30",
						)}
					>
						<motion.div
							className="absolute inset-0 rounded-full bg-primary/5"
							initial={false}
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.2, 0.3],
							}}
							transition={{
								duration: 3,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
						/>
						<div
							className={cn(
								"h-1 w-4 rounded-full bg-primary/50",
								"transition-transform duration-200",
								isOpen ? "rotate-180" : "rotate-0",
								side === "left" ? "-rotate-90" : "rotate-90",
							)}
						/>
					</div>
				</motion.button>
			)}

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={handleToggle}
						/>
						<motion.div
							className={cn(
								"fixed inset-y-0 z-50 w-80",
								"bg-gradient-to-b from-background/95 to-background/80",
								"border-primary/10 backdrop-blur-md",
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
								className={cn(
									"group absolute right-4 top-4 z-20",
									"rounded-full p-2",
									"bg-primary/5 hover:bg-primary/10",
									"transition-colors duration-200",
								)}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<motion.div
									className="absolute inset-0 rounded-full bg-primary/5"
									initial={false}
									animate={{
										scale: [1, 1.2, 1],
										opacity: [0.3, 0.2, 0.3],
									}}
									transition={{
										duration: 3,
										repeat: Number.POSITIVE_INFINITY,
										repeatType: "reverse",
									}}
								/>
								<X className="h-4 w-4 text-primary/70" />
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
