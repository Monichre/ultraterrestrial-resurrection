import { tavilyClient } from "@/lib/tavily/client";

export const search = async (query: string) => {
	const results = await tavilyClient.search(query, {});
	return results;
};
