import { getXataClient } from "./xata";
import type { XataClient } from "./xata";


let xataClient: XataClient;

try {
	xataClient = getXataClient();

	
} catch (error) {
	console.log("🚀 ~ error:", error);
}

export const xata = getXataClient();
