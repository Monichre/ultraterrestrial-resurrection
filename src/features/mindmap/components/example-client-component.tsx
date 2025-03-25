"use client";

import { useCallback, useEffect, useState } from "react";
import {
	type MindMapNode,
	fetchNextMindmapRecords,
} from "../queries/fetch-next-mindmap-records";

// Define constants outside component to avoid dependency issues
const PAGE_SIZE = 3;

export function MindmapExplorer({
	initialTable = "topics",
}: { initialTable?: string }) {
	const [nodes, setNodes] = useState<MindMapNode[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [table, setTable] = useState(initialTable);
	const [page, setPage] = useState(0);
	const [cursor, setCursor] = useState<string | undefined>(undefined);

	const loadMoreNodes = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			// Call the server action directly from the client component
			const result = await fetchNextMindmapRecords({
				table,
				size: PAGE_SIZE,
				offset: page * PAGE_SIZE,
				cursor,
			});

			// Update the nodes state with the returned nodes
			setNodes((prev) => [...prev, ...result.nodes]);

			// Save the cursor for the next request
			setCursor(result.meta.cursor);

			// Increment page counter
			setPage((prev) => prev + 1);
		} catch (err) {
			console.error("Failed to fetch mindmap nodes:", err);
			setError("Failed to load more nodes. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [table, cursor, page]);

	// Initial load
	useEffect(() => {
		if (nodes.length === 0) {
			loadMoreNodes();
		}
	}, [nodes.length, loadMoreNodes]);

	// Change table handler
	const handleTableChange = (newTable: string) => {
		setNodes([]);
		setPage(0);
		setCursor(undefined);
		setTable(newTable);
	};

	return (
		<div className="p-4">
			<div className="flex items-center gap-4 mb-6">
				<h2 className="text-2xl font-bold">Mindmap Explorer</h2>

				<select
					value={table}
					onChange={(e) => handleTableChange(e.target.value)}
					className="border rounded px-3 py-1"
				>
					<option value="topics">Topics</option>
					<option value="events">Events</option>
					<option value="personnel">Personnel</option>
					<option value="organizations">Organizations</option>
				</select>
			</div>

			{/* Display nodes */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{nodes.map((node) => (
					<div key={node.id} className="border rounded-lg p-4 shadow-sm">
						<h3 className="font-medium text-lg">{node.data.label}</h3>
						<p className="text-sm text-gray-500">Type: {node.type}</p>
					</div>
				))}
			</div>

			{/* Error message */}
			{error && (
				<div className="my-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
			)}

			{/* Load more button */}
			<div className="mt-6 flex justify-center">
				<button
					onClick={loadMoreNodes}
					disabled={loading}
					type="button"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Loading..." : "Load More"}
				</button>
			</div>
		</div>
	);
}
