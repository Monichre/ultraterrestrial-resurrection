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

		let searchResults;

		if (table && id) {
			// Search within a specific table and record
			searchResults = await xata.db[table].search(query, {
				fuzziness: 1,
				prefix: "phrase",
			});
		} else if (table) {
			// Search within a specific table
			searchResults = await xata.search.all(query, {
				tables: [{ table }],
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
