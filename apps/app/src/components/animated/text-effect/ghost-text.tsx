import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GhostTextProps {
	text: string;
	className?: string;
	duration?: number;
	wordDelay?: number;
	textColor?: string;
	blurColor?: string;
	blurRadius?: number;
	fontSize?: number;
	fontWeight?: number | string;
	timings?: number[];
	sequential?: boolean;
}

export function GhostText({
	text,
	className,
	duration = 10,
	wordDelay = 0.1,
	textColor,
	blurColor,
	blurRadius = 100,
	fontSize = 400,
	fontWeight = 700,
	timings = [0, 0.05, 0.15, 0.2, 0.8, 0.95, 1],
	sequential = true,
}: GhostTextProps) {
	const words = text.split(" ");

	return (
		<p
			className={cn("text-center", className)}
			style={{
				fontSize: `${fontSize}%`,
				fontWeight,
				color: textColor,
			}}
		>
			{words.map((word, index) => (
				<motion.span
					key={index}
					style={{
						["--blur-color" as string]: "rgb(var(--text-color))",
					}}
					className="mx-1 inline-block text-transparent [--text-color:15_23_42] dark:[--text-color:255_255_255]"
					animate={{
						opacity: [0, 0, 1, 1, 1, 1, 0],
						textShadow: [
							`0 0 ${blurRadius}px ${blurColor || "var(--blur-color)"}`,
							`0 0 ${blurRadius * 0.9}px ${blurColor || "var(--blur-color)"}`,
							`0 0 0px ${blurColor || "var(--blur-color)"}`,
							`0 0 0px ${blurColor || "var(--blur-color)"}`,
							`0 0 0px ${blurColor || "var(--blur-color)"}`,
							`0 0 ${blurRadius * 0.9}px ${blurColor || "var(--blur-color)"}`,
							`0 0 ${blurRadius}px ${blurColor || "var(--blur-color)"}`,
						],
					}}
					transition={{
						duration,
						times: timings,
						ease: "easeOut",
						repeat: Number.POSITIVE_INFINITY,
						delay: sequential ? index * wordDelay : 0,
					}}
				>
					{word}
				</motion.span>
			))}
		</p>
	);
}
