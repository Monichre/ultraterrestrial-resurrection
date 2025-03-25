"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";

interface SightingsLoaderProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

const SightingsLoader = ({ className, size = "md" }: SightingsLoaderProps) => {
	const sizeClass = {
		sm: "w-16 h-16",
		md: "w-24 h-24",
		lg: "w-32 h-32",
	};

	return (
		<div className={cn("flex items-center justify-center", className)}>
			<div className={cn("relative", sizeClass[size])}>
				{/* UFO */}
				<motion.div
					className="absolute inset-0 flex items-center justify-center"
					animate={{
						y: [0, -8, 0],
					}}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				>
					<div className="w-full h-2/5 relative">
						{/* UFO Dome */}
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/2 bg-blue-400 rounded-full opacity-80" />

						{/* UFO Body */}
						<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-300 rounded-full opacity-90" />

						{/* UFO Lights */}
						<motion.div
							className="absolute bottom-0 left-1/4 w-1 h-1 bg-yellow-400 rounded-full"
							animate={{ opacity: [0.4, 1, 0.4] }}
							transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
						/>
						<motion.div
							className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
							animate={{ opacity: [0.4, 1, 0.4] }}
							transition={{
								duration: 0.8,
								repeat: Number.POSITIVE_INFINITY,
								delay: 0.2,
							}}
						/>
						<motion.div
							className="absolute bottom-0 right-1/4 w-1 h-1 bg-yellow-400 rounded-full"
							animate={{ opacity: [0.4, 1, 0.4] }}
							transition={{
								duration: 0.8,
								repeat: Number.POSITIVE_INFINITY,
								delay: 0.4,
							}}
						/>
					</div>
				</motion.div>

				{/* Scan beam */}
				<motion.div
					className="absolute left-1/2 top-1/2 -translate-x-1/2 w-0.5 bg-green-400 origin-top"
					initial={{ height: 0, opacity: 0 }}
					animate={{
						height: ["0%", "50%", "0%"],
						opacity: [0, 0.8, 0],
					}}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>

				{/* Loading text */}
				<div className="absolute bottom-0 left-0 right-0 text-center text-xs text-white">
					<motion.div
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
					>
						Analyzing sightings...
					</motion.div>
				</div>

				{/* Particles */}
				<div className="absolute inset-0">
					{[...Array(12)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-1 h-1 bg-blue-300 rounded-full"
							initial={{
								x: `${Math.random() * 100}%`,
								y: `${Math.random() * 100}%`,
								opacity: 0,
							}}
							animate={{
								opacity: [0, 0.8, 0],
								scale: [0, 1, 0],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: i * 0.15,
								repeatDelay: Math.random() * 0.5,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default SightingsLoader;
