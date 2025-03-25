"use client";
import * as React from "react";

import {
	AnimatePresence,
	type MotionValue,
	motion,
	useMotionValue,
	useSpring,
} from "framer-motion";

import {
	EventsIcon,
	KeyFiguresIcon,
	OrganizationsIcon,
	TestimoniesIcon,
	TopicsIcon,
} from "@/components/icons";
import { AddNote } from "@/components/note/AddNote";
import { useMindMap } from "@/contexts";

const mapRange = (
	inputLower: number,
	inputUpper: number,
	outputLower: number,
	outputUpper: number,
) => {
	const INPUT_RANGE = inputUpper - inputLower;
	const OUTPUT_RANGE = outputUpper - outputLower;

	return (value: number) =>
		outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0);
};

export function ExplodingMenuItem({
	item,
	index,
}: {
	item: any;
	index: number;
}) {
	const DISTANCE_INCREMENT = 14;
	const x = useSpring(useMotionValue(0), { mass: 0.005, stiffness: 100 });
	const y = useSpring(useMotionValue(0), { mass: 0.005, stiffness: 100 });
	const distance = `${index * DISTANCE_INCREMENT}%`;

	const setTransform = (
		item: HTMLElement & EventTarget,
		event: React.PointerEvent,
		x: MotionValue,
		y: MotionValue,
	) => {
		const bounds = item.getBoundingClientRect();
		const relativeX = event.clientX - bounds.left;
		const relativeY = event.clientY - bounds.top;
		const xRange = mapRange(0, bounds.width, -1, 1)(relativeX);
		const yRange = mapRange(0, bounds.height, -1, 1)(relativeY);

		x.set(xRange * 3);
		y.set(yRange * 3);
	};

	return (
		<motion.li
			key={item.label}
			className="bg-black rounded-full"
			style={{
				// border: '1px solid rgba(255, 255, 255, 0.5)',
				offsetDistance: distance,
				position: "absolute",
				offsetRotate: "0deg",
				left: 0,
				top: 0,
				x,
				y,
			}}
			whileHover={{ scale: 1.15 }}
			initial={{
				opacity: 0,
				scale: 0.5,
				offsetPath: `path("M 0 0 m 0 0 a 9.6 9.6 90 1 0 0 0 a 9.6 9.6 90 1 0 0 0")`,
			}}
			animate={{
				opacity: 1,
				scale: 1,
				offsetPath: `path("M 0 0 m -0 -48 a 48 48 180 1 0 0 96 a 48 48 180 1 0 -0 -96")`,
			}}
			exit={{
				opacity: 0,
				scale: 0.5,
				offsetPath: `path("M 0 0 m 0 0 a 9.6 9.6 90 1 0 0 0 a 9.6 9.6 90 1 0 0 0")`,
			}}
			onPointerLeave={() => {
				x.set(0);
				y.set(0);
			}}
			transition={{ duration: 0.2, delay: index * 0.02, type: "easeInOut" }}
		>
			{item.render()}
		</motion.li>
	);
}

export function MindMapAnimatedClickMenu({
	isOpen,
	closeMenu,
	clickPosition,
}: any) {
	const { addNextEntitiesToMindMap } = useMindMap();
	const handleLoadingRecords = React.useCallback(
		async (rootNodeSim: any) => {
			// Wait for the entities to be added to the mindmap
			await addNextEntitiesToMindMap(rootNodeSim);
		},
		[addNextEntitiesToMindMap],
	);

	const actions = [
		{
			render: () => (
				<motion.button
					onClick={() => handleLoadingRecords({ data: { type: "events" } })}
					className="flex h-8 w-8 cursor-move items-center justify-center rounded-full bg-mauve-light-3"
				>
					<EventsIcon className="w-4 h-4" />
				</motion.button>
			),
		},
		{
			render: () => (
				<motion.button
					onClick={() => handleLoadingRecords({ data: { type: "topics" } })}
					className="flex h-8 w-8 cursor-move items-center justify-center rounded-full bg-mauve-light-3"
				>
					<TopicsIcon className="w-4 h-4" />
				</motion.button>
			),
		},
		{
			render: () => (
				<motion.button
					onClick={() => handleLoadingRecords({ data: { type: "personnel" } })}
					className="flex h-8 w-8 cursor-move items-center justify-center rounded-full bg-mauve-light-3"
				>
					<KeyFiguresIcon className="w-4 h-4" />
				</motion.button>
			),
		},
		{
			render: () => (
				<motion.button
					onClick={() =>
						handleLoadingRecords({ data: { type: "testimonies" } })
					}
					className="flex h-8 w-8 cursor-move items-center justify-center rounded-full bg-mauve-light-3"
				>
					<TestimoniesIcon className="w-4 h-4" />
				</motion.button>
			),
		},
		{
			render: () => (
				<motion.button
					onClick={() =>
						handleLoadingRecords({ data: { type: "organizations" } })
					}
					className="flex h-8 w-8 cursor-move items-center justify-center rounded-full bg-mauve-light-3"
				>
					<OrganizationsIcon className="w-4 h-4" />
				</motion.button>
			),
		},
		{
			render: () => (
				<AddNote saveNote={() => {}} userNote={{ title: "", content: "" }} />
			),
		},
	];

	return (
		<motion.div
			className="relative h-0 w-0 select-none"
			animate={{
				height: isOpen ? "60px" : "0px",
				width: isOpen ? "60px" : "0px",
				backgroundColor: "transparent",
				visibility: isOpen ? "visible" : "hidden",
				zIndex: isOpen ? 100 : 0,
			}}
			exit={{
				height: "0px",
				width: "0px",
				backgroundColor: "transparent",
				visibility: "hidden",
				zIndex: 0,
			}}
			transition={{ duration: 0.2, staggerChildren: 0.2 }}
			initial={{
				height: "0px",
				width: "0px",
				backgroundColor: "transparent",
				visibility: "hidden",
				zIndex: 0,
			}}
		>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="absolute left-0 top-0"
						style={{
							x: clickPosition.x,
							y: clickPosition.y,
						}}
					>
						<ul className="relative ">
							<li
								className="absolute h-6 w-6 "
								style={{
									transformOrigin: "center center",
									left: 0,
									top: 0,
								}}
							>
								<svg
									className="w-10 h-10"
									viewBox="0 0 75 75"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
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
								</svg>
							</li>
							{actions.map((item, index) => {
								return (
									<ExplodingMenuItem item={item} index={index} key={index} />
								);
							})}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
