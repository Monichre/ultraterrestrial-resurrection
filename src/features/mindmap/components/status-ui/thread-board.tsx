"use client";

import { EvidenceCard } from "@/components/case-file/case-file-evidence/evidence-card";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GitBranch, PlusCircle, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Thread {
	id: string;
	caseNumber: string;
	classification: "top-secret" | "classified" | "confidential";
	timestamp: string;
	title: string;
	description: string;
	credibilityScore?: number;
	sourceVerified?: boolean;
	isActive?: boolean;
}

export const ThreadBoard = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [threads, setThreads] = useState<Thread[]>([
		{
			id: "thread-001",
			caseNumber: "X-37B",
			classification: "top-secret",
			timestamp: "2077-03-15T21:27:18",
			title: "Quantum Entanglement Analysis",
			description:
				"Exploring non-local connections between anomalous events. Temporal coherence detected.",
			credibilityScore: 0.91,
			sourceVerified: true,
			isActive: true,
		},
		{
			id: "thread-002",
			caseNumber: "X-37B",
			classification: "classified",
			timestamp: "2077-03-14T18:42:03",
			title: "Consciousness Transfer Protocol",
			description:
				"Research on neural interfaces and synthetic consciousness architecture. Early stage findings.",
		},
	]);

	// Tab animation (collapsed state)
	const tabVariants = {
		initial: {
			x: 0,
		},
		hover: {
			x: -5,
			transition: {
				duration: 0.2,
				ease: "easeOut",
			},
		},
	};

	// Container animation (expanded state)
	const containerVariants = {
		collapsed: {
			width: "48px",
			height: "120px",
			right: 0,
			opacity: 1,
		},
		expanded: {
			width: "32rem",
			height: "auto",
			right: 0,
			opacity: 1,
			transition: {
				width: { duration: 0.4, ease: "easeOut" },
				height: { duration: 0.5, ease: "easeOut", delay: 0.1 },
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	// Card animation
	const cardVariants = {
		collapsed: {
			opacity: 0,
			y: 20,
		},
		expanded: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: "easeOut",
			},
		},
	};

	// Inner content animation (staggered)
	const contentVariants = {
		collapsed: {
			opacity: 0,
		},
		expanded: {
			opacity: 1,
			transition: {
				duration: 0.3,
				ease: "easeOut",
				staggerChildren: 0.08,
			},
		},
	};

	// Text and border animations
	const itemVariants = {
		collapsed: {
			opacity: 0,
			y: 10,
		},
		expanded: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
			},
		},
	};

	// Set a thread as active
	const setActiveThread = (id: string) => {
		setThreads(
			threads.map((thread) => ({
				...thread,
				isActive: thread.id === id,
			})),
		);
	};

	// Create a new thread
	const createNewThread = () => {
		const newThread: Thread = {
			id: `thread-${(threads.length + 1).toString().padStart(3, "0")}`,
			caseNumber: "X-37B",
			classification: "confidential",
			timestamp: new Date().toISOString(),
			title: "New Investigation Thread",
			description:
				"Initialized thread. Awaiting data connections and analysis framework.",
		};

		setThreads([newThread, ...threads]);
	};

	// Handle file drop
	const handleFileDrop = (threadId: string) => {
		// In a real implementation, this would handle the file upload
		// For now, we'll just mark it as verified
		setThreads(
			threads.map((thread) =>
				thread.id === threadId ? { ...thread, sourceVerified: true } : thread,
			),
		);
	};

	return (
		<motion.div
			// Positioned at top-[60%] to create overlapping effect with other tabs
			className="fixed right-0 top-[60%] -translate-y-1/2 z-40"
			variants={containerVariants}
			initial="collapsed"
			animate={isExpanded ? "expanded" : "collapsed"}
		>
			{/* Tab (visible when collapsed) */}
			{!isExpanded && (
				<motion.div
					className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-black/40 backdrop-blur-sm border-l border-y border-[#adf0dd]/30 rounded-l-md flex items-center justify-center cursor-pointer rotate-[-2deg] shadow-lg"
					variants={tabVariants}
					animate={isHovered ? "hover" : "initial"}
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					onClick={() => setIsExpanded(true)}
					whileTap={{ scale: 0.95 }}
				>
					<GitBranch className="text-[#adf0dd] w-5 h-5" />
				</motion.div>
			)}

			{/* Expanded panel content */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						className="w-full h-full bg-black/30 backdrop-blur-sm border border-[#adf0dd]/30 rounded-l-md overflow-hidden shadow-[0_0_15px_rgba(173,240,221,0.15)]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.2 } }}
					>
						<div className="p-4 h-full">
							{/* Header */}
							<motion.div
								className="flex justify-between items-center mb-4"
								variants={contentVariants}
								initial="collapsed"
								animate="expanded"
							>
								<motion.h2
									className="text-[#adf0dd] font-mono text-lg"
									variants={itemVariants}
								>
									INVESTIGATION THREADS
								</motion.h2>
								<motion.button
									className="text-[#adf0dd]/80 hover:text-[#adf0dd] font-mono p-2"
									onClick={() => setIsExpanded(false)}
									variants={itemVariants}
									whileTap={{ scale: 0.95 }}
								>
									[ CLOSE ]
								</motion.button>
							</motion.div>

							{/* Create New Thread Button */}
							<motion.div
								className="mb-4"
								variants={contentVariants}
								initial="collapsed"
								animate="expanded"
							>
								<Button
									className="w-full bg-black/50 border border-[#adf0dd]/30 text-[#adf0dd] hover:bg-[#adf0dd]/10 font-mono"
									onClick={createNewThread}
								>
									<PlusCircle className="w-4 h-4 mr-2" />
									Create New Thread
								</Button>
							</motion.div>

							{/* Content */}
							<motion.div
								className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
								variants={contentVariants}
								initial="collapsed"
								animate="expanded"
							>
								{threads.map((thread, index) => (
									<motion.div
										key={thread.id}
										variants={cardVariants}
										custom={index}
										className="mb-4 relative"
									>
										{/* Enhanced EvidenceCard */}
										<div className="relative group">
											<EvidenceCard {...thread} />

											{/* Pin Icon for Active Thread */}
											<motion.div
												className={
													thread.isActive
														? "absolute top-3 right-3 cursor-pointer z-10 text-[#adf0dd]"
														: "absolute top-3 right-3 cursor-pointer z-10 text-neutral-500 opacity-50 hover:opacity-100"
												}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => setActiveThread(thread.id)}
											>
												<Pin className="w-4 h-4" />
											</motion.div>

											{/* Drag and Drop Zone */}
											<motion.div
												className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#adf0dd]/10 to-transparent rounded-b-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
												initial={false}
												animate={isDragging ? { opacity: 1 } : {}}
												onDragOver={(e) => {
													e.preventDefault();
													setIsDragging(true);
												}}
												onDragLeave={() => setIsDragging(false)}
												onDrop={(e) => {
													e.preventDefault();
													setIsDragging(false);
													handleFileDrop(thread.id);
												}}
											>
												<span className="text-xs font-mono text-[#adf0dd]/70">
													Drop files to attach
												</span>
											</motion.div>
										</div>
									</motion.div>
								))}
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};
