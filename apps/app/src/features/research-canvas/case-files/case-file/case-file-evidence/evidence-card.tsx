"use client";

import { motion, useAnimation } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { useEffect } from "react";

// Add this new component
function ProcessingIndicator({ label }: { label: string }) {
	const controls = useAnimation();

	useEffect(() => {
		controls.start({
			opacity: [0.3, 1, 0.3],
			transition: {
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			},
		});
	}, [controls]);

	return (
		<motion.div animate={controls} className="flex items-center gap-2">
			<div className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
			<span className="font-mono text-xs text-neutral-500">{label}</span>
		</motion.div>
	);
}

// Add this new component
function VerificationProgress() {
	return (
		<div className="relative h-0.5 w-24 overflow-hidden rounded bg-neutral-800">
			<motion.div
				className="absolute h-full w-full bg-neutral-500"
				animate={{
					x: ["-100%", "100%"],
				}}
				transition={{
					duration: 1.5,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
			/>
		</div>
	);
}

interface EvidenceCardProps {
	caseNumber: string;
	classification: "top-secret" | "classified" | "confidential";
	timestamp: string;
	title: string;
	description: string;
	credibilityScore?: number;
	sourceVerified?: boolean;
}

export function EvidenceCard({
	caseNumber = "X-37B",
	classification = "top-secret",
	timestamp = "2077-03-15T21:27:18",
	title = "Quantum Encryption Breach",
	description = "Unauthorized access detected in quantum mainframe sector 7. Temporal anomalies reported.",
	credibilityScore,
	sourceVerified,
}: EvidenceCardProps) {
	const classificationColors = {
		"top-secret": "bg-neutral-800/30 text-neutral-200",
		classified: "bg-neutral-800/30 text-neutral-300",
		confidential: "bg-neutral-800/30 text-neutral-400",
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative"
		>
			<Card className="relative overflow-hidden border border-gray-200 border-neutral-800/50 bg-black/20 backdrop-blur-sm dark:border-gray-800">
				<div className="relative space-y-4 p-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{credibilityScore ? (
								<div className="flex items-center gap-2">
									<span className="font-mono text-xs text-neutral-500">
										σ = {credibilityScore.toFixed(2)}
									</span>
								</div>
							) : (
								<ProcessingIndicator label="Credibility Analysis" />
							)}
						</div>
						<Badge
							variant="outline"
							className={classificationColors[classification]}
						>
							{classification}
						</Badge>
					</div>

					{/* Content */}
					<div className="space-y-2">
						<h3 className="font-mono text-lg font-bold tracking-tight text-neutral-200">
							{title}
						</h3>
						<p className="text-sm text-neutral-400">{description}</p>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between border-t border-neutral-800 pt-4">
						<div className="flex items-center gap-2">
							{sourceVerified ? (
								<div className="flex items-center gap-2">
									<Folder className="h-4 w-4 text-neutral-500" />
									<span className="font-mono text-xs text-neutral-500">
										Source Verified
									</span>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<VerificationProgress />
									<span className="font-mono text-xs text-neutral-500">
										Verifying
									</span>
								</div>
							)}
						</div>
						<time className="font-mono text-xs text-neutral-500">
							{timestamp}
						</time>
					</div>
				</div>

				{/* Border Effects */}
				<div className="absolute inset-px rounded-lg border border-gray-200 border-neutral-800 dark:border-gray-800" />
				<div className="absolute inset-0 rounded-lg border border-gray-200 border-neutral-700/5 dark:border-gray-800" />

				{/* Grid Pattern */}
				<div
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, neutral-500 1px, transparent 0)`,
						backgroundSize: "16px",
					}}
				/>
			</Card>
		</motion.div>
	);
}
