"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { onIntroPhase } from "@/components/intro/IntroScene";
import { LovecraftQuote } from "@/layouts/home/LovecraftQuote";

/**
 * Holds the Lovecraft quote hidden until the intro timeline enters the
 * `static` phase, then fades it in over the glitch/blackout end-state.
 */
export function LovecraftQuoteOverlay() {
	const root = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		const off = onIntroPhase((p) => {
			if (p === "static") setRevealed(true);
		});
		return () => {
			off();
		};
	}, []);

	useGSAP(
		() => {
			if (!root.current) return;
			gsap.set(root.current, { autoAlpha: 0 });
			if (revealed) {
				gsap.fromTo(
					root.current,
					{ autoAlpha: 0, y: 24, filter: "blur(14px)" },
					{
						autoAlpha: 1,
						y: 0,
						filter: "blur(0px)",
						duration: 1.6,
						ease: "expo.out",
					},
				);
			}
		},
		{ dependencies: [revealed], scope: root },
	);

	return (
		<div
			ref={root}
			className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
			style={{ mixBlendMode: "screen" }}
		>
			<LovecraftQuote />
		</div>
	);
}
