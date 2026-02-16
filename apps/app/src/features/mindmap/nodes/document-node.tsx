"use client";

import { BlurAppear } from "@/components/animated";
import { useMindMap } from "@/contexts";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const DocumentNode = (node: any) => {
	const { useUpdateNodeInternals, useNodesData } = useMindMap();
	const updateNodeInternals = useUpdateNodeInternals();
	const [handles, setHandles]: any = useState([]);
	const nodeData = useNodesData(node.id);

	useEffect(() => {
		if (node?.data?.handles && node.data?.handles.length) {
			const { data } = node;

			setHandles(data.handles);
			updateNodeInternals(node.id);
		}

		// if (node?.data?.concise) {
		//   updateNodeInternals(node.id)
		// }
	}, [node, updateNodeInternals, nodeData]);
	return (
		<BlurAppear>
			<div
				className="animate-running speed-normal nodrag overflow-hidden rounded-2xl bg-neutral-900/80 backdrop-blur-sm"
				style={{ opacity: 1, willChange: "auto" }}
			>
				<main
					id="920040ff-0893-4f70-9648-da435c47f0e4"
					className="space-y-3.5 w-96 border p-1.5 rounded-2xl duration-200 border-neutral-800 bg-neutral-900/80 group hover:border-neutral-700 hover:bg-white/5"
				>
					<section className="overflow-visible relative rounded-2xl duration-200 border bg-neutral-950 px-4 py-5 shadow-lg shadow-neutral-800/50 border-neutral-800">
						<div className="nodrag peer/wrap relative flex w-full flex-col items-stretch gap-2 font-medium text-white duration-500">
							<div className="flex flex-col gap-3 font-inter">
								<div className="mark-scroll-bar overflow-y-auto">
									<h2 className="text-lg font-bold">{node?.data?.title}</h2>
									<p className="w-full cursor-text select-text whitespace-pre-wrap pr-2 align-middle text-sm leading-6 selection:bg-white/50">
										{node?.data?.content}
									</p>
								</div>
							</div>
						</div>
					</section>
					<div className="flex w-full items-center justify-between px-1 font-mono text-[0.65rem]">
						<div className="flex items-center gap-1 rounded-full bg-neutral-800 py-1 pl-2 pr-2.5 text-neutral-400">
							<div className="size-5">
								<span
									className="relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none"
									data-state="closed"
									style={{
										borderColor: "rgba(255, 255, 255, 0.5)",
										transform: "translateX(0px)",
									}}
								>
									<FileIcon
										className="aspect-square size-full object-cover"
										size={16}
									/>
								</span>
							</div>
							<span className="text-neutral-400">Me</span>
						</div>
						{/* <span>{}</span> */}
					</div>
				</main>
				<button
					className="invisible ring-neutral-50/10 absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-neutral-800 p-1 outline-none ring-2 duration-200 md:hover:block md:peer-hover/wrap:block"
					data-state="closed"
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="rotate-180 h-4 w-4 duration-200"
					>
						<path
							d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>
				</button>
				{/* <div
          data-handleid='in'
          data-nodeid='920040ff-0893-4f70-9648-da435c47f0e4'
          data-handlepos='top'
          data-id='1-920040ff-0893-4f70-9648-da435c47f0e4-in-target'
          className='react-flow__handle react-flow__handle-top nodrag nopan pointer-events-none invisible target connectable connectablestart connectableend connectionindicator'
        ></div>
        <div
          data-handleid='out'
          data-nodeid='920040ff-0893-4f70-9648-da435c47f0e4'
          data-handlepos='bottom'
          data-id='1-920040ff-0893-4f70-9648-da435c47f0e4-out-source'
          className='react-flow__handle react-flow__handle-bottom nodrag nopan pointer-events-none invisible source connectable connectablestart connectableend connectionindicator'
        ></div> */}
			</div>
		</BlurAppear>
	);
};
