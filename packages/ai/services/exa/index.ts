/**
 * Exa AI Service Integration
 *
 * A comprehensive wrapper around the Exa API for semantic search,
 * finding similar content, content retrieval, and answering questions.
 */

// Re-export client
export {
	exa,
	isExaConfigured,
	validateExaAPIKey,
} from "./client";

// Re-export search functions
export {
	search,
	searchAndContents,
	neuralSearch,
	keywordSearch,
	recentSearch,
} from "./search";

// Re-export similar content functions
export {
	findSimilar,
	findSimilarAndContents,
	findSimilarExcludingSource,
	findSimilarInDomains,
} from "./similar";

// Re-export contents retrieval functions
export {
	getContents,
	getTextContent,
	getHighlights,
	getSummary,
	getFullContent,
} from "./contents";

// Re-export answer functions
export {
	answer,
	answerWithExaPro,
	answerWithFullText,
	streamAnswer,
} from "./answer";

// Re-export types
export type {
	ExaSearchParams,
	ExaSimilarParams,
	ExaContentsParams,
	ExaAnswerParams,
	SearchResult,
	Citation,
	AnswerResponse,
} from "../firecrawl/types";
