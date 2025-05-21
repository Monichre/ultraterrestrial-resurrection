import { DOMAIN_MODEL_COLORS, cn } from "@/utils";
import chroma from "chroma-js";
import { motion } from "framer-motion";
import { forwardRef } from "react";

export const Anchor = forwardRef<
	HTMLDivElement,
	{ className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
	const color = DOMAIN_MODEL_COLORS.root;
	const hiddenColor = chroma(color).alpha(0).css();
	const visibleColor = chroma(color).alpha(1).css();

	// const canSee = useInView( ref )
	const draw = {
		hidden: {
			pathLength: 0,
			fill: hiddenColor,
			opacity: 0,
		},

		visible: (i: number) => {
			const delay = 1 + i * 0.5;
			return {
				pathLength: 1,
				opacity: 1,
				fill: visibleColor,
				transition: {
					pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
					opacity: { delay, duration: 0.01 },
				},
			};
		},
	};

	return (
		<motion.div
			ref={ref}
			key="anchor-wrapper"
			className={cn(
				"z-10 flex size-16 items-center justify-center rounded-full p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] anchor-node-icon",
				className,
			)}
		>
			<motion.div className="hint">
				<span className="hint-radius" />
				{/* <span className='hint-dot'></span> */}
				<motion.svg
					variants={draw}
					custom={2}
					initial="hidden"
					animate="visible"
					className="w-12 h-12"
					viewBox="0 0 75 75"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Anchor Icon"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M37.7725 38.1035C57.9016 38.0973 74.1008 37.833 74.1008 37.5079C74.1008 37.1878 58.3991 36.9267 38.7043 36.9128C48.417 27.1776 55.9586 19.3752 55.7994 19.2161C55.6377 19.0544 47.5927 26.8355 37.6459 36.7671C37.6396 16.6467 37.3754 0.45752 37.0504 0.45752C36.7253 0.45752 36.461 16.657 36.4548 36.7863C26.4992 26.8456 18.4439 19.0543 18.2822 19.2161C18.123 19.3753 25.6646 27.1777 35.3773 36.9128C15.6914 36.9269 0 37.188 0 37.5079C0 37.8329 16.1889 38.0971 36.309 38.1035C26.1513 48.2685 18.118 56.569 18.2822 56.7333C18.444 56.895 26.4995 49.1036 36.4553 39.1627C36.4692 58.8571 36.7303 74.5583 37.0504 74.5583C37.3703 74.5583 37.6314 58.8673 37.6455 39.1819C47.5924 49.1136 55.6377 56.895 55.7994 56.7333C55.9636 56.5691 47.9302 48.2685 37.7725 38.1035Z"
						fill="currentColor"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M37.7725 38.1035C57.9016 38.0973 74.1008 37.833 74.1008 37.5079C74.1008 37.1878 58.3991 36.9267 38.7043 36.9128C48.417 27.1776 55.9586 19.3752 55.7994 19.2161C55.6377 19.0544 47.5927 26.8355 37.6459 36.7671C37.6396 16.6467 37.3754 0.45752 37.0504 0.45752C36.7253 0.45752 36.461 16.657 36.4548 36.7863C26.4992 26.8456 18.4439 19.0543 18.2822 19.2161C18.123 19.3753 25.6646 27.1777 35.3773 36.9128C15.6914 36.9269 0 37.188 0 37.5079C0 37.8329 16.1889 38.0971 36.309 38.1035C26.1513 48.2685 18.118 56.569 18.2822 56.7333C18.444 56.895 26.4995 49.1036 36.4553 39.1627C36.4692 58.8571 36.7303 74.5583 37.0504 74.5583C37.3703 74.5583 37.6314 58.8673 37.6455 39.1819C47.5924 49.1136 55.6377 56.895 55.7994 56.7333C55.9636 56.5691 47.9302 48.2685 37.7725 38.1035Z"
						fill="currentColor"
						fill-opacity="0.2"
					/>
				</motion.svg>
			</motion.div>
		</motion.div>
	);
});

Anchor.displayName = "Anchor";
