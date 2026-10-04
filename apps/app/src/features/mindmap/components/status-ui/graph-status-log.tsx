"use client";

import { EllipsesScramble } from "@/components/animated/text-effect/text-scramble/ellipses-scramble";
import { TextScramble } from "@/components/animated/text-effect/text-scramble/text-scramble";
import { TerminalIcon } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { ICON_GREEN } from "@/utils";
import { AnimatePresence } from "framer-motion";

export const GraphStatusLog = () => {
	return (
		<AnimatePresence>
			{/* <LocationVisualization /> */}
			<div className="absolute top-[1vh] right-0 w-[25vw] h-[33vh] animate-[slide-in_0.3s_ease-out]">
				<div className="p-4 animate-[fade-in-up_0.4s_ease-out] flex flex-col gap-4 justify-start items-center align-middle">
					<Card className="bg-black/30 border-[#adf0dd]/30 backdrop-blur-sm p-4 w-full font-mono text-sm pointer-events-auto">
						<div className="text-[#adf0dd] space-y-1 motion-translate-y-in-100 motion-delay-0">
							<div className="opacity-90 motion-opacity-in-0 motion-preset-fade motion-delay-0 flex align-middle items-center mb-4">
								<TerminalIcon stroke={ICON_GREEN} className="h-5 w-5" />
								<span className="block ml-2">[System Log]</span>
							</div>

							<EllipsesScramble
								key={1}
								className="opacity-70 motion-preset-fade motion-preset-fade motion-delay-[100ms]"
							>
								{">"} Initializing Disclosure knowledge base
							</EllipsesScramble>
							<EllipsesScramble
								key={2}
								className="opacity-70 motion-preset-fade motion-delay-[200ms]"
							>
								{">"} Initializing global knowledge base scan...
							</EllipsesScramble>

							<TextScramble
								key={3}
								className="pl-4 opacity-60 motion-preset-fade motion-delay-[250ms]"
								as="div"
							>
								{" "}
								- Indexing core domain models...
							</TextScramble>

							<TextScramble key={4} className="pl-4 opacity-60" as="div">
								{" "}
								Sequencing records...
							</TextScramble>
							<TextScramble key={5} className="pl-4 opacity-60" as="div">
								{" "}
								- Syncronizing application state with knowledge base...
							</TextScramble>
							<TextScramble key={6} className="pl-4 opacity-60" as="div">
								{" "}
								- Syncronizing application state with knowledge base...
							</TextScramble>
						</div>

						<div className="text-[#adf0dd] space-y-1 motion-translate-y-in-100 motion-preset-fade motion-delay-[500ms]">
							<div className="opacity-80">
								{">"} [System Status]: Knowledge Base Sequenced
							</div>

							<EllipsesScramble className="opacity-75 motion-preset-fade motion-delay-[600ms]">
								{">"} Satellites: Online
							</EllipsesScramble>
							<EllipsesScramble className="opacity-75 motion-preset-fade motion-delay-[700ms]">
								{">"} Data streams active:
							</EllipsesScramble>
							<TextScramble
								className="pl-4 opacity-60 motion-preset-fade motion-delay-[800ms]"
								as="div"
							>
								- Sequenced data stream pipeline...
							</TextScramble>
						</div>

						{/* <div className="opacity-80 motion-translate-y-in-100 motion-preset-fade motion-delay-[1000ms]">
							{">"} Analysis: In progress...
						</div> */}
					</Card>
				</div>
			</div>
		</AnimatePresence>
	);
};
