"use client";

import { ICON_GREEN } from "@/utils";
import { motion, useAnimation } from "motion/react";

const DURATION = 0.25;

const calculateDelay = (i: number) => {
	return i === 0 ? 0.1 : i * DURATION + 0.1;
};

interface NetworkProps extends React.SVGAttributes<SVGSVGElement> {
	width?: number;
	height?: number;
	strokeWidth?: number;
	stroke?: string;
}

const Network = ({
	width = 28,
	height = 28,
	strokeWidth = 2,
	stroke = ICON_GREEN,
	...props
}: NetworkProps) => {
	const controls = useAnimation();

	return (
		<div
			style={{
				cursor: "pointer",
				userSelect: "none",
				padding: "8px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			onMouseEnter={() => controls.start("animate")}
			onMouseLeave={() => controls.start("normal")}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={width}
				height={height}
				viewBox="0 0 24 24"
				fill="none"
				stroke={stroke}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
				{...props}
			>
				<rect x="16" y="16" width="6" height="6" rx="1" />
				<rect x="2" y="16" width="6" height="6" rx="1" />
				<rect x="9" y="2" width="6" height="6" rx="1" />
				<motion.path
					d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"
					animate={controls}
					transition={{
						duration: DURATION,
						delay: calculateDelay(0),
						opacity: { delay: calculateDelay(0) },
					}}
					variants={{
						normal: {
							pathLength: 1,
							pathOffset: 0,
							opacity: 1,
						},
						animate: {
							pathOffset: [1, 0],
							pathLength: [0, 1],
							opacity: [0, 1],
						},
					}}
				/>
				<motion.path
					d="M12 12V8"
					animate={controls}
					transition={{
						duration: DURATION,
						delay: calculateDelay(1),
						opacity: { delay: calculateDelay(1) },
					}}
					variants={{
						normal: {
							pathLength: 1,
							pathOffset: 0,
							opacity: 1,
						},
						animate: {
							pathOffset: [1, 0],
							pathLength: [0, 1],
							opacity: [0, 1],
						},
					}}
				/>
			</svg>
		</div>
	);
};

export { Network };
