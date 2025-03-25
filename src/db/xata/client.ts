import { getXataClient } from "./xata";
import type { XataClient } from "./xata";

// Create a minimal empty query response function
const emptyQueryResponse = () => ({
	getAll: async () => [],
	sort: () => emptyQueryResponse(),
	select: () => emptyQueryResponse(),
});

let xataClient: XataClient;

try {
	xataClient = getXataClient();

	console.log("🚀 ~ xataClient:", xataClient);
} catch (error) {
	console.log("🚀 ~ error:", error);
}

export const xata = getXataClient();
