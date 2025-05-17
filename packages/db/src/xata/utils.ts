export const convert3dNodeToMindMapNode = (threeDNode: any) => {
	const { id, label, name, fill, data } = node;
	const title = label || name;

	return {
		id,
		data: {
			...data,
			label: title,
			fill,
		},
		type: "entityNode",
	};
};

export const convertDatabaseRecordToMindMapNode = (record: any) => {
	const { id, xata, name, ...rest } = record;
	const title = name;

	return {
		id,
		data: {
			...rest,
			label: title,
		},
		type: "entityNode",
	};
};

export const convertDatabaseRecordToGraphNode = ({ record, type }: any) => {
	const { id, name, label, ...rest } = record;
	const title = name || label;

	const node: any = {
		id,
		label: title,
		data: {
			...rest,
			name: title,
			label: title,
			// color,
			type,
		},
	};
	return node;
};
export const formatGraphEdge = ({ targetNode, sourceNode }: any) => {
	const edge = {
		source: sourceNode?.id,
		target: targetNode?.id,
		id: `${sourceNode.id}->${targetNode.id}`,
	};
	return edge;
};
