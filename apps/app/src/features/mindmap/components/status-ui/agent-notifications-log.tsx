"use client";

import { EllipsesScramble } from "@/components/animated/text-effect/text-scramble/ellipses-scramble";
import { TerminalIcon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { ICON_GREEN } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Terminal } from "lucide-react";

interface Notification {
	id: number;
	message: string;
	isScrambled?: boolean;
	timestamp: Date;
}

export const AgentNotificationsLog = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: 1,
			message: "Initializing Agents",
			isScrambled: true,
			timestamp: new Date(),
		},
		{ id: 2, message: "Sync: In progress...", timestamp: new Date() },
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

	// Card animation (with staggered children)
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

	// Text item animation
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

	return (
		<motion.div
			// Positioned at top-[40%] to create overlapping effect with other tabs
			className="fixed right-0 top-[40%] -translate-y-1/2 z-30"
			variants={containerVariants}
			initial="collapsed"
			animate={isExpanded ? "expanded" : "collapsed"}
		>
			{/* Tab (visible when collapsed) */}
			{!isExpanded && (
				<motion.div
					className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-24 bg-black/40 backdrop-blur-sm border-l border-y border-[#adf0dd]/30 rounded-l-md flex items-center justify-center cursor-pointer rotate-[-4deg] shadow-lg"
					variants={tabVariants}
					animate={isHovered ? "hover" : "initial"}
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					onClick={() => setIsExpanded(true)}
					whileTap={{ scale: 0.95 }}
				>
					<Terminal className="text-[#adf0dd] w-5 h-5" />
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
									AGENT NOTIFICATIONS
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

							{/* Content */}
							<Card className="bg-black/30 border-[#adf0dd]/30 backdrop-blur-sm p-4 w-full font-mono text-sm pointer-events-auto">
								<motion.div
									className="text-[#adf0dd] space-y-1"
									variants={contentVariants}
									initial="collapsed"
									animate="expanded"
								>
									<motion.div
										variants={itemVariants}
										className="opacity-90 flex items-center mb-2"
									>
										<TerminalIcon stroke={ICON_GREEN} className="mr-2" />
										<span>[AI Interface]</span>
									</motion.div>

									<AnimatePresence mode="wait">
										{notifications.map((notification) => (
											<motion.div
												key={notification.id}
												variants={itemVariants}
												className="opacity-80"
											>
												{notification.isScrambled ? (
													<EllipsesScramble className="opacity-70">
														<span>{notification.message}</span>
													</EllipsesScramble>
												) : (
													<div className="flex">
														<span className="mr-1">{"> "}</span>
														<span>{notification.message}</span>
													</div>
												)}
											</motion.div>
										))}
									</AnimatePresence>
								</motion.div>
							</Card>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};
