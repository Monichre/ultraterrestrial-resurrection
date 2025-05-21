import { getXataClient } from "../xata";

const xata = getXataClient();

export const searchXata = async ({
	query,
	id = null,
	table = null,
}: SearchParams) => {
	try {
		const response = await xata.search.all(query, {
			tables: table ? [{ table }] : tables,
			fuzziness: 0,
			prefix: "phrase",
		});

		console.log("🚀 ~ searchXataConnections ~ response:", response);

		return {
			success: true,
			searchResults: response.records,
		};
	} catch (error) {
		console.error("Error in searchXataConnections:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
