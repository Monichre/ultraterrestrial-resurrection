import { Index } from "@upstash/vector";

/**
 * Type definition for vector metadata
 */
export type VectorMetadata = Record<string, any>;

/**
 * Type definition for a vector document
 */
export type VectorDocument = {
	id: string;
	data?: string;
	vector?: number[];
	sparseVector?: {
		indices: number[];
		values: number[];
	};
	metadata?: VectorMetadata;
};

/**
 * Type definition for query options
 */
export type QueryOptions = {
	topK?: number;
	includeVectors?: boolean;
	includeMetadata?: boolean;
	includeData?: boolean;
	filter?: string;
	namespace?: string;
};

/**
 * Type definition for fetch options
 */
export type FetchOptions = {
	includeVectors?: boolean;
	includeMetadata?: boolean;
	includeData?: boolean;
	namespace?: string;
};

/**
 * Type definition for range options
 */
export type RangeOptions = {
	cursor?: number;
	limit?: number;
	includeVectors?: boolean;
	includeMetadata?: boolean;
	includeData?: boolean;
	namespace?: string;
};

/**
 * Initialize the Upstash Vector client
 */
export const createVectorClient = () => {
	return new Index({
		url:
			process.env.UPSTASH_VECTOR_REST_URL ||
			"https://known-bobcat-28794-us1-vector.upstash.io",
		token:
			process.env.UPSTASH_VECTOR_REST_TOKEN ||
			"ABYFMGtub3duLWJvYmNhdC0yODc5NC11czFhZG1pbllUZ3daREJqT1RRdFpUTmtZUzAwWTJGaExUZzNNelV0WlRGaE9USmxZelJpWXpnMg==",
	});
};

/**
 * Create or update a single vector document
 *
 * @param document The vector document to create or update
 * @param namespace Optional namespace
 * @returns Result of the upsert operation
 */
export const upsertVector = async (
	document: VectorDocument,
	namespace?: string,
) => {
	const index = createVectorClient();
	return await index.upsert(document, namespace ? { namespace } : undefined);
};

/**
 * Create or update multiple vector documents
 *
 * @param documents Array of vector documents to create or update
 * @param namespace Optional namespace
 * @returns Result of the batch upsert operation
 */
export const upsertVectors = async (
	documents: VectorDocument[],
	namespace?: string,
) => {
	const index = createVectorClient();
	return await index.upsert(documents, namespace ? { namespace } : undefined);
};

/**
 * Query vectors by vector embedding or text
 *
 * @param query The query parameters (vector or data)
 * @param options Additional query options
 * @returns Query results
 */
export const queryVectors = async (
	query: { vector?: number[]; data?: string },
	options: QueryOptions = {},
) => {
	const index = createVectorClient();

	const queryParams = {
		...query,
		topK: options.topK || 10,
		includeVectors: options.includeVectors || false,
		includeMetadata: options.includeMetadata || false,
		includeData: options.includeData || false,
	};

	if (options.filter) {
		queryParams.filter = options.filter;
	}

	const namespace = options.namespace
		? { namespace: options.namespace }
		: undefined;

	return await index.query(queryParams, namespace);
};

/**
 * Fetch vectors by their IDs
 *
 * @param ids Array of vector IDs to fetch
 * @param options Fetch options
 * @returns The fetched vector documents
 */
export const fetchVectors = async (
	ids: string | string[],
	options: FetchOptions = {},
) => {
	const index = createVectorClient();

	const fetchOptions = options.namespace
		? { namespace: options.namespace }
		: undefined;

	if (options.includeVectors) {
		fetchOptions.includeVectors = options.includeVectors;
	}

	if (options.includeMetadata) {
		fetchOptions.includeMetadata = options.includeMetadata;
	}

	if (options.includeData) {
		fetchOptions.includeData = options.includeData;
	}

	return await index.fetch(ids, fetchOptions);
};

/**
 * Delete vectors by their IDs
 *
 * @param ids Single ID or array of vector IDs to delete
 * @param namespace Optional namespace
 * @returns Result of the delete operation
 */
export const deleteVectors = async (
	ids: string | string[],
	namespace?: string,
) => {
	const index = createVectorClient();
	return await index.delete(ids, namespace ? { namespace } : undefined);
};

/**
 * Fetch vectors in a range
 *
 * @param options Range options
 * @returns Vectors in the specified range
 */
export const fetchVectorRange = async (options: RangeOptions = {}) => {
	const index = createVectorClient();

	const rangeParams = {
		cursor: options.cursor || 0,
		limit: options.limit || 10,
		includeVectors: options.includeVectors || false,
		includeMetadata: options.includeMetadata || false,
		includeData: options.includeData || false,
	};

	const namespace = options.namespace
		? { namespace: options.namespace }
		: undefined;

	return await index.range(rangeParams, namespace);
};

/**
 * Get index information
 *
 * @returns Information about the index
 */
export const getIndexInfo = async () => {
	const index = createVectorClient();
	return await index.info();
};

/**
 * Reset the index (delete all vectors)
 *
 * @returns Result of the reset operation
 */
export const resetIndex = async () => {
	const index = createVectorClient();
	return await index.reset();
};

/**
 * Get a random vector from the index
 *
 * @param namespace Optional namespace
 * @returns A random vector
 */
export const getRandomVector = async (namespace?: string) => {
	const index = createVectorClient();
	return await index.random(namespace ? { namespace } : undefined);
};

/**
 * List all namespaces in the index
 *
 * @returns List of namespaces
 */
export const listNamespaces = async () => {
	const index = createVectorClient();
	return await index.listNamespaces();
};

/**
 * Delete a namespace
 *
 * @param namespaceName Name of the namespace to delete
 * @returns Result of the namespace deletion
 */
export const deleteNamespace = async (namespaceName: string) => {
	const index = createVectorClient();
	return await index.deleteNamespace(namespaceName);
};
