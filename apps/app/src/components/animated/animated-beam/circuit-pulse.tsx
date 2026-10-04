// https://artifactui.in/docs/components/circuit-pulse
"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";
import {
	Blocks,
	Code2,
	Container,
	Database,
	FileCode2,
	Github,
	Globe2,
	type LucideIcon,
	PackageOpen,
	Terminal,
} from "lucide-react";
import * as React from "react";

interface CircuitPulseProps {
	className?: string;
	color?: string;
}

const pulseVariants = {
	dot1: {
		initial: { y: "-50%", x: "-50%" },
		animate: {
			y: ["-50%", "30%", "30%"],
			transition: {
				duration: 5,
				times: [0, 0.3, 1],
				repeat: Number.POSITIVE_INFINITY,
				repeatDelay: 2,
				ease: "easeInOut",
			},
		},
	},
	dot2: {
		initial: { y: "-50%", x: "-50%" },
		animate: {
			y: ["-50%", "9.5%", "9.5%"],
			x: ["-50%", "-50%", "9.5%"],
			transition: {
				duration: 4,
				times: [0, 0.5, 1],
				repeat: Number.POSITIVE_INFINITY,
				repeatDelay: 1.5,
				ease: "easeInOut",
			},
		},
	},
	dot3: {
		initial: { y: "-50%", x: "-50%" },
		animate: {
			y: ["-50%", "30%", "30%"],
			transition: {
				duration: 3.5,
				times: [0, 0.4, 1],
				repeat: Number.POSITIVE_INFINITY,
				repeatDelay: 2.5,
				ease: "easeInOut",
			},
		},
	},
	dot4: {
		initial: { y: "-50%", x: "-50%" },
		animate: {
			y: ["-50%", "9.5%", "9.5%"],
			x: ["-50%", "-50%", "9.5%"],
			transition: {
				duration: 4.5,
				times: [0, 0.6, 1],
				repeat: Number.POSITIVE_INFINITY,
				repeatDelay: 1.8,
				ease: "easeInOut",
			},
		},
	},
	glow: {
		initial: { opacity: 0.3 },
		animate: {
			opacity: [0.3, 0.6, 0.3],
			transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
		},
	},
};

interface IconConfig {
	Icon: LucideIcon;
	position: string;
}

const icons: IconConfig[] = [
	{ Icon: Github, position: "rotate-0" },
	{ Icon: Code2, position: "rotate-45" },
	{ Icon: Terminal, position: "rotate-90" },
	{ Icon: Database, position: "rotate-135" },
	{ Icon: Blocks, position: "rotate-180" },
	{ Icon: Container, position: "rotate-[225deg]" },
	{ Icon: FileCode2, position: "rotate-[270deg]" },
	{ Icon: PackageOpen, position: "rotate-[315deg]" },
];

export function CircuitPulse({
	className,
	color = "#ff4545",
}: CircuitPulseProps) {
	return (
		<div className={cn("relative h-[80vmin] w-[80vmin]", className)}>
			<div className="absolute inset-0 overflow-hidden rounded-3xl"></div>
			{[...Array(8)].map((_, i) => (
				<div
					key={i}
					className={cn(
						"pointer-events-none absolute h-1/2 w-1/2",
						i < 4
							? "left-1/2 top-0 origin-bottom -translate-x-1/2"
							: "left-0 top-0 origin-bottom-right",
						i === 1 && "rotate-90",
						i === 2 && "rotate-180",
						i === 3 && "rotate-[270deg]",
						i === 5 && "-scale-x-100",
						i === 6 && "-scale-100",
						i === 7 && "-scale-y-100",
					)}
				>
					<motion.div
						className={cn(
							"opacity-50",
							i < 4
								? "h-full w-[calc(50%+1px)] border-r"
								: "absolute left-[calc(30%-1px)] top-[30%] h-[60%] w-[70%] rounded-br-xl border-b border-l",
						)}
						style={{ borderColor: color }}
						variants={pulseVariants.glow}
						initial="initial"
						animate="animate"
					/>
					<motion.div
						className={cn(
							"absolute h-full w-full",
							i < 2
								? "left-1/2 top-[10%]"
								: i < 4
									? "left-1/2 top-[10%]"
									: i < 6
										? "left-[30%] top-[30%]"
										: "left-[30%] top-[30%]",
						)}
						variants={
							i < 2
								? pulseVariants.dot1
								: i < 4
									? pulseVariants.dot3
									: i < 6
										? pulseVariants.dot2
										: pulseVariants.dot4
						}
						initial="initial"
						animate="animate"
					>
						<motion.div
							className="absolute left-1/2 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full"
							style={{
								backgroundColor: color,
								boxShadow: `0 0 10px ${color}`,
							}}
							variants={pulseVariants.glow}
						/>
					</motion.div>
					<div
						className={cn(
							"absolute flex h-[40px] w-[40px] items-center justify-center rounded-full",
							i < 4
								? "left-1/2 top-0 -translate-x-1/2"
								: "left-[30%] top-[30%] -translate-x-1/2 -translate-y-1/2",
						)}
						style={{
							backgroundColor: color,
							boxShadow: `0 0 15px ${color}`,
						}}
					>
						<div className={icons[i].position}>
							{React.createElement(icons[i].Icon, {
								className: "h-5 w-5 text-white",
							})}
						</div>
					</div>
				</div>
			))}
			<div className="absolute left-1/2 top-1/2 h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2">
				<motion.div
					className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/90 shadow-lg"
					variants={pulseVariants.glow}
					initial="initial"
					animate="animate"
				/>
				<motion.div
					className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
					style={{
						backgroundColor: color,
						boxShadow: `0 0 20px ${color}`,
					}}
				>
					<Globe2 className="size-16 text-white" />
				</motion.div>
			</div>
		</div>
	);
}
