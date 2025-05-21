"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import {
	TerminalLine,
	UseEntrancePreloaderOptions,
	UseEntrancePreloaderReturn,
} from "./types";

gsap.registerPlugin(ScrambleTextPlugin);

export const useEntrancePreloader = (
	containerRef: React.RefObject<HTMLDivElement>,
	options: UseEntrancePreloaderOptions = {},
): UseEntrancePreloaderReturn => {
	const { duration = 6, onComplete, specialChars = "▪" } = options;

	const [isAnimating, setIsAnimating] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	// Function to update progress bar
	const updateProgress = useCallback(
		(percent: number) => {
			if (!containerRef.current) return;

			const progressBar = containerRef.current.querySelector("#progress-bar");
			if (progressBar instanceof HTMLElement) {
				progressBar.style.transition = "none";
				progressBar.style.width = `${percent}%`;
			}
		},
		[containerRef],
	);

	const { contextSafe } = useGSAP({ scope: containerRef });

	// Store original text content for spans that will be scrambled
	const storeOriginalText = useCallback(() => {
		if (!containerRef.current) return {};

		const originalTexts: Record<string, string> = {};
		const scrambleSpans = containerRef.current.querySelectorAll(
			'.terminal-line span[data-scramble="true"]',
		);

		scrambleSpans.forEach((span, index) => {
			const originalText = span.textContent || "";
			originalTexts[index] = originalText;
			span.setAttribute("data-original-text", originalText);
			// Set initial text to empty to prevent flash of content
			span.textContent = "";
		});

		return originalTexts;
	}, [containerRef]);

	// Create main animation timeline
	const createTimeline = useCallback(() => {
		if (!containerRef.current) return null;

		// Store original texts first
		const originalTexts = storeOriginalText();

		// Reset progress to 0%
		updateProgress(0);

		// Create main timeline for text animation
		const tl = gsap.timeline({
			onComplete: () => {
				setIsAnimating(false);
				setIsComplete(true);
				onComplete?.();
			},
		});

		// Get all terminal lines and sort them by top position
		const allLines = Array.from(
			containerRef.current.querySelectorAll(".terminal-line"),
		);
		allLines.sort((a, b) => {
			const aTop = parseInt((a as HTMLElement).style.top);
			const bTop = parseInt((b as HTMLElement).style.top);
			return aTop - bTop;
		});

		// Create a timeline for text reveal that's synced with progress
		const textRevealTl = gsap.timeline();

		// Process each line for text reveal
		allLines.forEach((line, lineIndex) => {
			// Set base opacity - alternating between full and reduced opacity
			const baseOpacity = lineIndex % 2 === 0 ? 1 : 0.7;

			// Calculate when this line should appear based on total duration
			// Distribute evenly across the first 80% of the animation
			const timePoint = (lineIndex / allLines.length) * (duration * 0.8);

			// Reveal the line
			textRevealTl.to(
				line,
				{
					opacity: baseOpacity,
					duration: 0.3,
				},
				timePoint,
			);

			// Get all spans in this line that should be scrambled
			const scrambleSpans = line.querySelectorAll('span[data-scramble="true"]');

			// Apply scramble effect to each span
			scrambleSpans.forEach((span) => {
				const originalText =
					span.getAttribute("data-original-text") || span.textContent || "";

				// Add scramble effect slightly after the line appears
				textRevealTl.to(
					span,
					{
						duration: 0.8,
						scrambleText: {
							text: originalText,
							chars: specialChars,
							revealDelay: 0,
							speed: 0.3,
						},
						ease: "none",
					},
					timePoint + 0.1,
				);
			});
		});

		// Add the text reveal timeline to the main timeline
		tl.add(textRevealTl, 0);

		// Add periodic scramble effects throughout the animation
		for (let i = 0; i < 3; i++) {
			const randomTime = 1 + i * 1.5; // Spread out the glitch effects
			tl.add(() => {
				const glitchTl = gsap.timeline();

				// Select random elements to glitch
				const allScrambleSpans = containerRef.current?.querySelectorAll(
					'span[data-scramble="true"]',
				);
				if (!allScrambleSpans || allScrambleSpans.length === 0) return glitchTl;

				const randomSpans = [];

				// Select 3-5 random spans to glitch
				const numToGlitch = 3 + Math.floor(Math.random() * 3);
				for (let j = 0; j < numToGlitch; j++) {
					const randomIndex = Math.floor(
						Math.random() * allScrambleSpans.length,
					);
					randomSpans.push(allScrambleSpans[randomIndex]);
				}

				// Apply glitch effect to selected spans
				randomSpans.forEach((span) => {
					const text =
						span.textContent || span.getAttribute("data-original-text") || "";

					// Quick scramble for glitch effect
					glitchTl.to(
						span,
						{
							duration: 0.2,
							scrambleText: {
								text: text,
								chars: specialChars,
								revealDelay: 0,
								speed: 0.1,
							},
							ease: "none",
							repeat: 1,
						},
						Math.random() * 0.5,
					);
				});

				return glitchTl;
			}, randomTime);
		}

		// Add staggered disappearing effect at the end
		const disappearTl = gsap.timeline();

		// Add staggered disappear effect for each line
		disappearTl.to(allLines, {
			opacity: 0,
			duration: 0.2,
			stagger: 0.1, // 0.1 second between each line disappearing
			ease: "power1.in",
		});

		// Add the disappear timeline near the end of the main timeline
		tl.add(disappearTl, duration - 1);

		// Set up progress bar animation that's synced with the main timeline
		tl.eventCallback("onUpdate", () => {
			const progress = Math.min(99, tl.progress() * 100);
			updateProgress(progress);
		});

		// Force final update to 100% at the end
		tl.call(
			() => {
				updateProgress(100);
			},
			[],
			duration - 0.5,
		);

		return tl;
	}, [
		containerRef,
		duration,
		onComplete,
		specialChars,
		storeOriginalText,
		updateProgress,
	]);

	// Reveal content by transitioning the preloader out
	const revealContent = useCallback(() => {
		if (!containerRef.current) return;

		const preloaderEl = containerRef.current.querySelector(".preloader");
		const contentEl = containerRef.current.querySelector(".content-container");

		if (!preloaderEl || !contentEl) return;

		// Create timeline for content reveal
		const revealTl = gsap.timeline();

		// Clip the preloader from bottom to top
		revealTl.to(preloaderEl, {
			clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
			duration: 0.64,
			ease: "cubic-bezier(0.65,0.05,0.36,1)",
			onComplete: () => {
				// Hide preloader after animation
				gsap.set(preloaderEl, { display: "none" });
			},
		});

		// Show the content
		revealTl.to(
			contentEl,
			{
				opacity: 1,
				visibility: "visible",
				duration: 0.3,
			},
			"-=0.3",
		);

		return revealTl;
	}, [containerRef]);

	// Start the animation sequence
	const start = contextSafe(() => {
		if (isAnimating || isComplete) return;

		setIsAnimating(true);
		setIsComplete(false);

		// Set initial state
		if (containerRef.current) {
			const preloaderEl = containerRef.current.querySelector(".preloader");
			const contentEl =
				containerRef.current.querySelector(".content-container");

			if (preloaderEl) {
				gsap.set(preloaderEl, {
					clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					display: "block",
				});
			}

			if (contentEl) {
				gsap.set(contentEl, {
					opacity: 0,
					visibility: "hidden",
				});
			}
		}

		// Create and play the animation timeline
		const tl = createTimeline();
		if (tl) {
			timelineRef.current = tl;
			tl.play(0).then(() => {
				// After terminal animation completes, transition to content
				revealContent();
			});
		}
	});

	// Skip animation and show content immediately
	const skip = contextSafe(() => {
		if (isComplete) return;

		// Kill any running animations
		if (timelineRef.current) {
			timelineRef.current.kill();
			timelineRef.current = null;
		}

		setIsAnimating(false);
		setIsComplete(true);

		// Force progress to 100%
		updateProgress(100);

		// Immediately reveal content
		revealContent();

		// Call completion callback
		onComplete?.();
	});

	// Reset the animation to initial state
	const reset = contextSafe(() => {
		// Kill any running animations
		if (timelineRef.current) {
			timelineRef.current.kill();
			timelineRef.current = null;
		}

		setIsAnimating(false);
		setIsComplete(false);

		// Reset progress
		updateProgress(0);

		// Reset DOM state
		if (containerRef.current) {
			const preloaderEl = containerRef.current.querySelector(".preloader");
			const contentEl =
				containerRef.current.querySelector(".content-container");

			if (preloaderEl) {
				gsap.set(preloaderEl, {
					clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					display: "block",
				});
			}

			if (contentEl) {
				gsap.set(contentEl, {
					opacity: 0,
					visibility: "hidden",
				});
			}

			// Reset all terminal lines to initial state
			const lines = containerRef.current.querySelectorAll(".terminal-line");
			gsap.set(lines, { opacity: 0 });

			// Reset all scramble spans
			const scrambleSpans = containerRef.current.querySelectorAll(
				'span[data-scramble="true"]',
			);
			scrambleSpans.forEach((span) => {
				const originalText = span.getAttribute("data-original-text") || "";
				span.textContent = "";
			});
		}
	});

	// Clean up when component unmounts
	useGSAP(
		() => {
			return () => {
				if (timelineRef.current) {
					timelineRef.current.kill();
					timelineRef.current = null;
				}
			};
		},
		{ scope: containerRef },
	);

	return {
		start,
		skip,
		reset,
		isAnimating,
		isComplete,
	};
};
