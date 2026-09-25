// Shared knowledge base for UFO/UAP research materials.
//
// This package has no runtime data exports: metadata/index.json is a
// 400KB+ document index, not something to import into a JS bundle at
// module load time. Consumers should read it directly (fs, a build-time
// script, or a future typed loader) when they need the document index —
// see types.d.ts for its shape.

export const KNOWLEDGE_BASE_PATHS = {
	sources: "./sources",
	files: "./sources/files",
	transcripts: "./sources/transcripts",
	web: "./sources/web",
	derived: "./derived",
	metadataIndex: "./metadata/index.json",
} as const;

export default KNOWLEDGE_BASE_PATHS;
