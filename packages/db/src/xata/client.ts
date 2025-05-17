import { XataClient } from "./xata";

// Initialize the Xata client
export const xata = new XataClient({
	// Default configuration options can be added here
	// apiKey: process.env.XATA_API_KEY,
	// branch: process.env.XATA_BRANCH || "main",
});

// Alternative export for cases where a function-based approach is preferred
export function getXataClient(): XataClient {
	return xata;
}

export default xata;
