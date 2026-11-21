// ./src/components/ui/card/pill-card.tsx

import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

interface PillItem {
	name: string;
	description: string;
	color: string;
	bg: string;
	text: string;
}

interface PillCardProps {
	items: PillItem[];
	className?: string;
}

const PillCard = ({ items, className }: PillCardProps) => {
	const [active, setActive] = useState(0);
	const [isClicked, setIsClicked] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const [hoverState, setHoverState] = useState({ width: 0, x: 0 });
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

	const handleMouseEnter = (index: number) => {
		setIsHovering(true);
		const element = itemRefs.current[index];
		if (element) {
			setHoverState({
				width: element.offsetWidth,
				x: element.offsetLeft,
			});
		}
	};

	const handleMouseLeave = () => {
		setIsHovering(false);
	};

	const activeState = {
		width: itemRefs.current[active]?.offsetWidth || 0,
		x: itemRefs.current[active]?.offsetLeft || 0,
	};

	return (
		<div className={cn("w-full max-w-xl mx-auto p-4", className)}>
			<div className="flex flex-col gap-4">
				<motion.div
					className="flex items-center justify-between rounded-2xl bg-card p-4"
					layout
				>
					<div className="flex flex-col gap-1">
						<div className="flex items-center">
							<motion.span className="w-auto select-none font-medium">
								{items[active].name}
							</motion.span>
						</div>
						{isClicked && (
							<AnimatePresence>
								<motion.div
									className="flex w-auto items-center justify-center gap-x-2 overflow-hidden"
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
								>
									<span className="select-none font-medium text-muted-foreground">
										·
									</span>
									<span className="select-none text-nowrap text-sm font-medium text-muted-foreground">
										{items[active].description}
									</span>
								</motion.div>
							</AnimatePresence>
						)}
					</div>
					<motion.button
						className="rounded-full py-1 px-3 text-sm tracking-tighter"
						style={{
							color: items[active].color,
							backgroundColor: items[active].bg,
						}}
						onClick={() => setIsClicked(!isClicked)}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2 }}
					>
						{items[active].text}
					</motion.button>
				</motion.div>
				<div className="relative flex h-8 items-center justify-center gap-2">
					{items.map((item, index) => (
						<motion.li
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							onMouseEnter={() => handleMouseEnter(index)}
							onMouseLeave={handleMouseLeave}
							onClick={() => {
								setIsClicked(false);
								setActive(index);
							}}
							key={index}
							className={cn(
								"h-full flex relative items-center justify-center px-3 z-10 cursor-pointer list-none",
								active === index ? "text-foreground" : "text-muted-foreground",
							)}
							whileTap={{ scale: 0.95 }}
							transition={{ duration: 0.2 }}
						>
							{item.name}
						</motion.li>
					))}
					<motion.div
						animate={isHovering ? hoverState : activeState}
						className="absolute h-full rounded-full bg-muted z-0"
						transition={{
							duration: 0.3,
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export { PillCard };
