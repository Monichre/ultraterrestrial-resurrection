import { xata } from "../client";

export const searchXata = async ({
	query,
	id,
	table,
}: {
	query: string;
	id?: string | null;
	table?: string | null;
}) => {
	try {
		if (!query) {
			return { success: false, error: "Query is required" };
		}

		// Ensure table name is lowercase for Xata compatibility
		const normalizedTable = table?.toLowerCase();

		let searchResults;

		if (normalizedTable && id) {
			// Search within a specific table and record
			searchResults = await xata.db[normalizedTable].search(query, {
				fuzziness: 1,
				prefix: "phrase",
			});
		} else if (normalizedTable) {
			// Search within a specific table
			searchResults = await xata.search.all(query, {
				tables: [{ table: normalizedTable }],
				fuzziness: 1,
				prefix: "phrase",
			});
		} else {
			// Global search across all tables
			searchResults = await xata.search.all(query, {
				fuzziness: 1,
				prefix: "phrase",
			});
		}

		return {
			success: true,
			searchResults: searchResults.records || searchResults,
		};
	} catch (error) {
		console.error("Search error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};
