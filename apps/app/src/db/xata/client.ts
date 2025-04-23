import { getXataClient } from "./xata";
import type { XataClient } from "./xata";

// Only instantiate the Xata client on the server side
let xataClient: XataClient | undefined;

// Check if we're on the server (not in browser)
const isServer = typeof window === "undefined";

if (isServer) {
	try {
		xataClient = getXataClient();
	} catch (error) {
		console.log("🚀 ~ Error initializing Xata client:", error);
	}
} else {
	console.warn(
		"Attempted to initialize Xata client in browser environment. Xata operations are only available server-side.",
	);
}

// Export the client, but only if we're on the server
export const xata = isServer
	? xataClient || getXataClient()
	: new Proxy({} as XataClient, {
			get(_, prop) {
				throw new Error(
					`You are trying to use Xata from the browser. Xata operations should only be performed in server components or server actions. Property attempted: ${String(prop)}`,
				);
			},
		});
