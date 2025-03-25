"use client";

import type { NetworkGraphPayload } from "@/features/mindmap/queries/get-entity-network-graph-data";
import { DOMAIN_MODEL_COLORS } from "@/utils";
import type { JSONData } from "@xata.io/client";
import { type FC, useCallback, useRef } from "react";
import { ForceGraph3D } from "react-force-graph";

// https://github.com/vasturiano/react-force-graph/blob/master/example/custom-node-shape/index-three.html

export const EntityNetworkGraph3D: FC<any> = ({
	graphData,
}: JSONData<NetworkGraphPayload>) => {
	console.log("graphData: ", graphData);
	// https://github.com/vasturiano/d3-force-3d
	const graphRef: any = useRef();
	// https://github.com/vasturiano/react-force-graph/blob/master/example/dynamic/index.html
	const handleNodeClick = useCallback((node: any) => {
		console.log("node: ", node);
		// Aim at node from outside it
		const distance = 40;
		const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
		if (graphRef?.current) {
			graphRef.current.cameraPosition(
				{ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
				node, // lookAt ({ x, y, z })
				3000, // ms transition duration
			);
		}
	}, []);

	return (
		<ForceGraph3D
			ref={graphRef}
			graphData={graphData}
			nodeLabel={(node) => `${node.label}`}
			nodeColor={(n) => DOMAIN_MODEL_COLORS[n.data.type]}
			nodeRelSize={20}
			linkColor={(link) => link?.color}
			onNodeClick={handleNodeClick}
		/>
	);
};
//  import { CSS2DRenderer, CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';

//     const Graph = ForceGraph3D({
//       extraRenderers: [new CSS2DRenderer()]
//     })
//     (document.getElementById('3d-graph'))
//       .jsonUrl('../datasets/miserables.json')
//       .nodeAutoColorBy('group')
//       .nodeThreeObject(node => {
//         const nodeEl = document.createElement('div');
//         nodeEl.textContent = node.id;
//         nodeEl.style.color = node.color;
//         nodeEl.className = 'node-label';
//         return new CSS2DObject(nodeEl);
//       })
//       .nodeThreeObjectExtend(true)
