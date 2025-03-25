"use client";

import { cn } from "@/utils";
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface TerminalIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface TerminalIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
	stroke?: string;
}

const lineVariants: Variants = {
	normal: { opacity: 1 },
	animate: {
		opacity: [1, 0, 1],
		transition: {
			duration: 0.8,
			repeat: Number.POSITIVE_INFINITY,
			ease: "linear",
		},
	},
};

const TerminalIcon = forwardRef<TerminalIconHandle, TerminalIconProps>(
	(
		{ onMouseEnter, stroke, onMouseLeave, className, size = 28, ...props },
		ref,
	) => {
		const controls = useAnimation();
		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					controls.start("animate");
				} else {
					onMouseEnter?.(e);
				}
			},
			[controls, onMouseEnter],
		);

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlledRef.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[controls, onMouseLeave],
		);

		return (
			<span
				className={cn("inline-block")}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<svg
					className={className}
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke={stroke}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="4 17 10 11 4 5" />
					<motion.line
						x1="12"
						x2="20"
						y1="19"
						y2="19"
						variants={lineVariants}
						animate={controls}
						initial="normal"
					/>
				</svg>
			</span>
		);
	},
);

TerminalIcon.displayName = "TerminalIcon";

export { TerminalIcon };
