"use client";

import { Html, TrackballControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Suspense, useRef, useState, memo } from "react";
import * as THREE from "three";

import { Loading } from "@/components/loaders/loading";
import { Card, CardHeader } from "@/components/ui/card";

import { ModelAvatar } from "@/features/mindmap/components/connection-list";
import { cn } from "@/utils";
import { DOMAIN_MODEL_COLORS } from "@/utils/constants/colors";
import { motion } from "framer-motion";

// import {
//   StarsCard,
//   StarsCardDescription,
//   StarsCardTitle,
// } from '@/components/ui/card/stars-card'

{
	/* <a
  className="text-neutral-500 border-b-neutral-800 border-b-2 border-r-neutral-800 border-r-2 border-t-neutral-800 border-t-2 flex-col text-[0.63rem] uppercase flex w-2/4 h-[calc(-16px_+_50vw)] overflow-hidden p-2 bg-neutral-950 min-[600px]:w-1/4  min-[600px]:h-[calc(-16px_+_25vw)] min-[1440px]:w-56 min-[1440px]:h-56"
  href="https://pancakeswap.finance/"
  style={{
    borderBottomStyle: "solid",
    borderRightStyle: "solid",
    borderTopStyle: "solid",
  }}>
  <div className="cursor-pointer flex-grow justify-between flex">DeFi</div>
  <div className="items-center self-center cursor-pointer flex-grow flex">
    
  </div>
  <div className="items-end self-end cursor-pointer flex-grow flex">PancakeSwap</div>
</a> */
}

const Star = ({ isGlowing, delay }: { isGlowing: boolean; delay: number }) => {
	return (
		<motion.div
			key={delay}
			initial={{
				scale: 1,
			}}
			animate={{
				scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
				background: isGlowing ? "#fff" : "#666",
			}}
			transition={{
				duration: 2,
				ease: "easeInOut",
				delay: delay,
			}}
			className={cn("bg-[#666] h-[1px] w-[1px] rounded-full relative z-20")}
		></motion.div>
	);
};

const Glow = ({ delay }: { delay: number }) => {
	return (
		<motion.div
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			transition={{
				duration: 2,
				ease: "easeInOut",
				delay: delay,
			}}
			exit={{
				opacity: 0,
			}}
			className="absolute  left-1/2 -translate-x-1/2 z-10 h-[4px] w-[4px] rounded-full bg-blue-500 blur-[1px] shadow-2xl shadow-blue-400"
		/>
	);
};

// generate random words
const Word = memo(({ children, item, ...props }: any): any => {
	// updateWithRef
	console.log("props: ", props);
	console.log("children: ", children);
	console.log("item: ", item);
	const ref = useRef();
	const { type, id }: any = item;
	const hex = DOMAIN_MODEL_COLORS[type];
	console.log("hex: ", hex);
	const router = useRouter();
	const color = new THREE.Color();

	const [hovered, setHovered] = useState(false);

	return (
		// <Billboard >{/* </Billboard> */}
		// <Billboard>
		<Html {...props} occlude="blending" transform sprite ref={ref}>
			<Card
				className="shadow relative rounded-lg rounded-[calc(var(--radius))] bg-dot-white/[0.2] p-1 z-50 bg-black"
				style={{
					borderColor: hex,
					borderWidth: "1px",
					borderStyle: "solid",
				}}
			>
				<div
					className="w-full h-full"
					style={{ backgroundColor: `${hex}99` }} // 99 is equivalent to 60% opacity in hex
				>
					<CardHeader className="flex flex-row items-center align-center justify-start p-1">
						<ModelAvatar model={item} />

						<h3 className="!mt-0 ml-[12px] text-white tracking-wide font-light text-sm">
							{item?.name || item?.title}
						</h3>
					</CardHeader>
				</div>
			</Card>
		</Html>
		// </Billboard>
	);
});

// const ConnectionLines = ({ connections }: any) => {
//   const group: any = useRef()

//   useFrame((_, delta) =>
//     group.current.children.forEach(
//       (group: {
//         children: {
//           material: { uniforms: { dashOffset: { value: number } } }
//         }[]
//       }) => (group.children[0].material.uniforms.dashOffset.value -= delta * 10)
//     )
//   )
//   return (
//     <group ref={group}>
//       {connections.map((connection: any) => {
//         return (
//           <group key={connection.id}>
//             <QuadraticBezierLine
//               start={connection.start}
//               end={connection.end}
//               color='#27F1FF'
//               dashed
//               dashScale={50}
//               gapSize={20}
//             />
//             <QuadraticBezierLine
//               start={connection.start}
//               end={connection.end}
//               color='#27F1FF'
//               lineWidth={0.5}
//               transparent
//               opacity={0.1}
//             />
//           </group>
//         )
//       })}
//     </group>
//   )
// }

const Cloud = memo(({ words }: any) => {
	return words.map(([position, item]: any, index: any) => (
		<Word key={index} position={position} children={item.name} item={item} />
	));
});
export type WordCloudProps = {
	events: any[];
};
export const WordCloud = ({ records, connections }: any) => {
	return (
		<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
			<fog attach="fog" args={["#202025", 0, 80]} />
			<Suspense fallback={<Loading />}>
				<group rotation={[10, 10.5, 10]}>
					<Cloud words={records} />
				</group>

				{/* <ConnectionLines connections={connections} /> */}
			</Suspense>

			<TrackballControls />
		</Canvas>
	);
};
