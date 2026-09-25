// Type definitions for @knowledge-base
//
// Describes the shape of metadata/index.json — the document index for the
// UFO/UAP research archive under sources/. There is no JS/TS runtime code
// in this package; consumers read metadata/index.json directly.

export interface KnowledgeBaseFileRef {
	name: string;
	path: string;
	size: number;
	type: string;
}

export interface KnowledgeBaseDocument {
	title: string;
	doc_type: "transcript" | "article" | "case_file" | string;
	/** Repo-relative path (from packages/knowledge-base/) to the directory containing this document, e.g. "sources/files". */
	path: string;
	date_folder?: string;
	created_at: string;
	updated_at: string;
	tags: string[];
	source?: string;
	youtube_id?: string;
	uses_original_structure?: boolean;
	/** Present on multi-file (e.g. YouTube transcript) documents. */
	files?: KnowledgeBaseFileRef[];
	metadata: {
		/** Repo-relative path (from packages/knowledge-base/) to the primary source file. */
		original_path?: string;
		file_size?: number;
		file_type?: string;
		[key: string]: unknown;
	};
}

export interface KnowledgeBaseIndex {
	documents: Record<string, KnowledgeBaseDocument>;
	/** Tag name -> document IDs carrying that tag. */
	tags: Record<string, string[]>;
	last_updated: string;
}
