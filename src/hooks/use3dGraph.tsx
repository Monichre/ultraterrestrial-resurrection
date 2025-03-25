import type { NetworkGraphPayload } from "@/features/mindmap/queries/get-entity-network-graph-data";
import { useEffect, useState } from "react";

type EntityGraphSchema = {
	nodes: Node;
};

export type GraphState = {
	root: {
		nodes: [];
		links: {};
	};
	events: {
		nodes: [];
		links: {};
	};
	testimonies: {
		nodes: [];
		links: {};
	};
	personnel: {
		nodes: [];
		links: {};
	};
	topics: {
		nodes: [];
		links: {};
	};
	organizations: {
		nodes: [];
		links: [];
	};
	documents: {
		nodes: [];
		links: [];
	};
	artifacts: {
		nodes: [];
		links: [];
	};
};

export type UseGraphProps = {
	mindMapIntialGraphState: NetworkGraphPayload["graphData"];
};

export const use3DGraph = ({ mindMapIntialGraphState }: UseGraphProps) => {
	console.log({ mindMapIntialGraphState });
	const [graph, setGraph] = useState({
		root: {
			nodes: [],
			links: {},
		},
		events: {
			nodes: [],
			links: {},
		},
		testimonies: {
			nodes: [],
			links: {},
		},
		personnel: {
			nodes: [],
			links: {},
		},
		topics: {
			nodes: [],
			links: {},
		},
		organizations: {
			nodes: [],
			links: [],
		},
		documents: {
			nodes: [],
			links: [],
		},
		artifacts: {
			nodes: [],
			links: [],
		},
	});

	useEffect(() => {
		const data: any = {
			root: {
				nodes: [],
				links: {},
			},
			events: {
				nodes: [],
				links: {},
			},
			testimonies: {
				nodes: [],
				links: {},
			},
			personnel: {
				nodes: [],
				links: {},
			},
			topics: {
				nodes: [],
				links: {},
			},
			organizations: {
				nodes: [],
				links: [],
			},
			documents: {
				nodes: [],
				links: [],
			},
			artifacts: {
				nodes: [],
				links: [],
			},
		};
		if (mindMapIntialGraphState.nodes?.length) {
			const rootNodes = mindMapIntialGraphState.nodes.filter(
				(node: { id: string | string[] }) => node?.id.includes("root"),
			);
			const restOfNodes = mindMapIntialGraphState.nodes.filter(
				(node: any) => !rootNodes.includes(node),
			);

			rootNodes.forEach((rootNode: any) => {
				const childNodes = restOfNodes.filter(
					(node) => node.data.type === rootNode.data.type,
				);

				const rootNodeWithLinks = {
					...rootNode,
					childNodes,
					connectedTo: [],
				};
				data.root.nodes.push(rootNodeWithLinks);
				data.root.links[rootNode.id] = {
					connectedTo: childNodes,
				};
			});

			restOfNodes.forEach((node: any) => {
				const childNodes = mindMapIntialGraphState.links.filter(
					(link: { source: any }) => link.source === node.id,
				);
				const nodeWithLinks = {
					...node,
					childNodes,
				};
				data[node.data.type].nodes.push(nodeWithLinks);

				data[node.data.type].links[node.id] = {
					connectedTo: childNodes,
				};
			});

			setGraph(data);
		}
	}, [mindMapIntialGraphState.links, mindMapIntialGraphState.nodes]);

	return { graph3d: graph };
};
