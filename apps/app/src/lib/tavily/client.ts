// To install: npm i @tavily/core
import { tavily, type TavilyClient } from "@tavily/core";
export const tavilyClient: TavilyClient = tavily({
	apiKey: process.env.TAVILY_API_KEY,
});
