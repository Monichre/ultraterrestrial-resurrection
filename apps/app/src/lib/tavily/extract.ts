import { tavilyClient } from "@/lib/tavily/client";

export const extract = async (urls: string) => {
	const results = await tavilyClient.extract(urls);
	return results;
};

export const extractFromUrl = async (url: string) => {
	const results = await tavilyClient.extract(url);
	return results;
};
