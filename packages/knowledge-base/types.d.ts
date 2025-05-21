// Type definitions for knowledge-base package

// External resources
export interface ExternalResources {
	urls: string[];
}

// Vector storage types
export interface VectorStoreFile {
	file_id: string;
	filename: string;
	bytes: number;
	created_at: string;
	status: string;
	[key: string]: string | number; // For any additional fields
}

// Module declaration
declare module "@ultraterrestrial/knowledge-base" {
	export const externalResources: ExternalResources;

	// Default export
	const knowledge: {
		externalResources: ExternalResources;
	};

	export default knowledge;
}
