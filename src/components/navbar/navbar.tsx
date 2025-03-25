"use client";
import React, { useState } from "react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";
import {
	Sparkles,
	LibraryBig,
	Crosshair,
	Home as HomeIcon,
} from "lucide-react";

const navItems = [
	{
		name: "Home",
		link: "/",
		icon: <HomeIcon strokeWidth={1} />,
	},
	{
		name: "Explore",
		link: "/explore",
		icon: <Sparkles strokeWidth={1} />,
	},
	{
		name: "History",
		link: "/history",
		icon: <LibraryBig strokeWidth={1} />,
	},
	{
		name: "Sightings",
		link: "/sightings",
		icon: <Crosshair strokeWidth={1} />,
	},
];

export const InAppNavbar = ({ color = "black", links = navItems }: any) => {
	return (
		<div
			className={cn(
				"fixed flex w-full justify-center top-10 inset-x-0 mx-auto z-20 p-1",
			)}
		>
			<div className="flex max-w-fit items-center space-between space-x-16 px-4 py-2 m-auto">
				{links.map((navItem: any, idx: number) => (
					<Link
						key={`link=${idx}`}
						href={navItem.link}
						className={cn(
							{ "text-black": color === "black" },
							{ "text-white": color === "white" },
							{ "text-gray-500": color === "gray" },
							{ "text-blue-500": color === "blue" },
							{ "text-green-500": color === "green" },
							{ "text-red-500": color === "red" },
							{ "text-yellow-500": color === "yellow" },
							{ "text-purple-500": color === "purple" },
							{ "text-pink-500": color === "pink" },
							{ "text-indigo-500": color === "indigo" },
							"relative items-center flex space-x-1 dark:hover:text-neutral-300 hover:text-neutral-500 uppercase text-sm !font-source tracking-wide",
						)}
					>
						<span className="block sm:hidden">{navItem.icon}</span>
						<span className="hidden sm:block text-sm !font-source tracking-wide">
							{navItem.name}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
};

export const NavBar = ({
	links = navItems,
	className,
}: {
	links: {
		name: string;
		link: string;
		icon?: JSX.Element;
	}[];
	className?: string;
}) => {
	const { scrollYProgress } = useScroll();

	const [visible, setVisible] = useState(true);

	// useMotionValueEvent(scrollYProgress, "change", (current) => {
	//   // Check if current is not undefined and is a number
	//   if (typeof current === "number") {
	//     let direction = current! - scrollYProgress.getPrevious()!;

	//     if (scrollYProgress.get() < 0.05) {
	//       setVisible(false);
	//     } else {
	//       if (direction < 0) {
	//         setVisible(true);
	//       } else {
	//         setVisible(false);
	//       }
	//     }
	//   }
	// });

	return (
		<div
			className={cn(
				"fixed flex max-w-fit top-10 inset-x-0 mx-auto rounded-full border border-white/80 dark:border-border/80 z-20 p-1",
			)}
		>
			<div className="flex rounded-full border dark:border-neutral-900 border-neutral-950/20 items-center justify-center space-x-4 px-4 py-2 bg-gradient-to-b from-card/70 to-secondary/50">
				{links.map((navItem: any, idx: number) => (
					<Link
						key={`link=${idx}`}
						href={navItem.link}
						className={cn(
							"relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500",
						)}
					>
						<span className="block sm:hidden">{navItem.icon}</span>
						<span className="hidden sm:block text-sm !font-source tracking-wide">
							{navItem.name}
						</span>
					</Link>
				))}
				{/* <button className='border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full'>
          <span>Login</span>
          <span className='absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px' />
        </button> */}
			</div>
		</div>
	);
};
