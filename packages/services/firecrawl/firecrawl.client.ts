import FirecrawlApp from "@mendable/firecrawl-js";

/**
 * FireCrawl client instance
 * Uses API key from environment variables
 */
export const fireCrawl = new FirecrawlApp({
	apiKey:
		process.env.FIRECRAWL_API_KEY ||
		process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY ||
		"",
});

// Export application for direct usage if needed
export { FirecrawlApp };
