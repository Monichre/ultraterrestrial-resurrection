export const collide = () => {
	let simulationNodes: any[];

	const force = () => {
		const padding = 10;
		if (!simulationNodes) return;
		for (let i = 0; i < simulationNodes.length; i++) {
			const node = simulationNodes[i];
			// Use node.width/node.height if available; default to 0 otherwise
			const halfWidth = node.width ? node.width / 2 : 0;
			const halfHeight = node.height ? node.height / 2 : 0;
			const nx1 = node.x - halfWidth - padding;
			const nx2 = node.x + halfWidth + padding;
			const ny1 = node.y - halfHeight - padding;
			const ny2 = node.y + halfHeight + padding;

			for (let j = i + 1; j < simulationNodes.length; j++) {
				const other = simulationNodes[j];
				const otherHalfWidth = other.width ? other.width / 2 : 0;
				const otherHalfHeight = other.height ? other.height / 2 : 0;
				const ox1 = other.x - otherHalfWidth;
				const ox2 = other.x + otherHalfWidth;
				const oy1 = other.y - otherHalfHeight;
				const oy2 = other.y + otherHalfHeight;

				if (nx1 < ox2 && nx2 > ox1 && ny1 < oy2 && ny2 > oy1) {
					const dx = other.x - node.x;
					const dy = other.y - node.y;
					const distance = Math.hypot(dx, dy);
					const minDist =
						((node.width || 0) + (other.width || 0)) / 2 + padding;
					if (distance < minDist && distance > 0) {
						const adjust = (minDist - distance) / distance;
						node.x -= dx * adjust * 0.5;
						node.y -= dy * adjust * 0.5;
						other.x += dx * adjust * 0.5;
						other.y += dy * adjust * 0.5;
					}
				}
			}
		}
	};

	// Called once to capture the simulation nodes
	force.initialize = (nodes: any[]) => {
		simulationNodes = nodes;
	};

	return force;
};
