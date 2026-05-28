"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { onIntroPhase } from "@/components/intro/IntroScene";

const LETTERS = "ULTRATERRESTRIAL".split("");

/**
 * Symmetric wave amplitude — center letters travel further than edges.
 */
function getYOffset(index: number, total: number, amplitude = 1.2) {
	const mid = (total - 1) / 2;
	const dist = Math.abs(index - mid);
	return (mid - dist) * amplitude;
}

export function TitleAlt() {
	const containerRef = useRef<HTMLDivElement>(null);
	const upRef = useRef<HTMLDivElement>(null);
	const downRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!containerRef.current) return;

			const upChars = upRef.current?.querySelectorAll<HTMLSpanElement>(
				"[data-char]",
			);
			const downChars = downRef.current?.querySelectorAll<HTMLSpanElement>(
				"[data-char]",
			);
			if (!upChars || !downChars) return;

			// Initial state: hidden, blurred, scaled-up, dropped
			gsap.set([upChars, downChars], {
				yPercent: 120,
				opacity: 0,
				scale: 1.4,
				filter: "blur(14px)",
			});
			gsap.set([upRef.current, downRef.current], { opacity: 1 });

			const master = gsap.timeline({ delay: 0.6 });

			// Reveal — staggered char-by-char wave
			master
				.to(upChars, {
					yPercent: 0,
					opacity: 1,
					scale: 1,
					filter: "blur(0px)",
					duration: 1.4,
					ease: "expo.out",
					stagger: { each: 0.045, from: "center" },
				})
				.to(
					downChars,
					{
						yPercent: 0,
						opacity: 1,
						scale: 1,
						filter: "blur(0px)",
						duration: 1.4,
						ease: "expo.out",
						stagger: { each: 0.045, from: "center" },
					},
					"<0.05",
				);

			// Persistent symmetric wave on Y once reveal completes
			master.add(() => {
				upChars.forEach((el, i) => {
					const offset = -getYOffset(i, upChars.length, 2.4);
					gsap.to(el, {
						y: offset,
						duration: 2.6,
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
						delay: i * 0.04,
					});
				});
				downChars.forEach((el, i) => {
					const offset = getYOffset(i, downChars.length, 2.4);
					gsap.to(el, {
						y: offset,
						duration: 2.6,
						ease: "sine.inOut",
						repeat: -1,
						yoyo: true,
						delay: i * 0.04,
					});
				});
			});

			// Subtle group-level pulse (replaces basePulse)
			gsap.fromTo(
				[upRef.current, downRef.current],
				{ scale: 0.96 },
				{
					scale: 1.02,
					duration: 6,
					ease: "sine.inOut",
					repeat: -1,
					yoyo: true,
					transformOrigin: "50% 50%",
				},
			);
		},
		{ scope: containerRef },
	);

	// Phase-driven exit: when intro hits blackout, fade the title group out.
	useEffect(() => {
		const off = onIntroPhase((phase) => {
			if (!containerRef.current) return;
			if (phase === "blackout") {
				gsap.to(containerRef.current, {
					autoAlpha: 0,
					filter: "blur(18px)",
					y: -20,
					duration: 0.55,
					ease: "power3.in",
				});
			}
		});
		return () => {
			off();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="flex items-center justify-center"
		>
			<div className="relative flex items-center justify-center w-[90vmin]">
				<div
					ref={upRef}
					className="absolute flex mix-blend-plus-lighter opacity-0"
				>
					{LETTERS.map((letter, i) => (
						<span
							key={`up-${i}`}
							data-char
							className="inline-block w-[4vmin] text-center text-white/90 will-change-transform"
							style={{ textShadow: "0 0 2px #fff, 0 0 18px rgba(120,180,255,0.35)" }}
						>
							{letter}
						</span>
					))}
				</div>

				<div
					ref={downRef}
					className="absolute flex mix-blend-plus-lighter opacity-0"
				>
					{LETTERS.map((letter, i) => (
						<span
							key={`down-${i}`}
							data-char
							className="inline-block w-[4vmin] text-center text-white/90 will-change-transform"
							style={{ textShadow: "0 0 2px #fff, 0 0 18px rgba(120,180,255,0.35)" }}
						>
							{letter}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
