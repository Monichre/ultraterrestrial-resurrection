import { z } from "zod";

// Base search types
const searchTypes = z.enum(["keyword", "neural"]);

// Content categories
const contentCategories = z.enum([
  "company",
  "research paper",
  "news",
  "pdf",
  "github",
  "tweet",
  "personal site",
  "linkedin profile",
  "financial report"
]);

// Base search options schema
export const baseSearchOptionsSchema = z.object({
  type: searchTypes
    .optional()
    .describe("The type of search to perform. 'keyword' for exact matches, 'neural' for semantic search."),
  numResults: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .describe("Number of results to return. Defaults to 10."),
  includeDomains: z
    .array(z.string())
    .optional()
    .describe("Only include results from these domains."),
  excludeDomains: z
    .array(z.string())
    .optional()
    .describe("Exclude results from these domains."),
  includeText: z
    .array(z.string())
    .optional()
    .describe("Only include results containing these text snippets."),
  excludeText: z
    .array(z.string())
    .optional()
    .describe("Exclude results containing these text snippets."),
  startPublishedDate: z
    .string()
    .optional()
    .describe("Start date for published content (ISO 8601 format)."),
  endPublishedDate: z
    .string()
    .optional()
    .describe("End date for published content (ISO 8601 format)."),
  category: contentCategories
    .optional()
    .describe("Filter results by content category."),
  useAutoprompt: z
    .boolean()
    .optional()
    .describe("Whether to use Exa's autoprompt feature for better results."),
});

// Content options schema
export const contentOptionsSchema = z.object({
  text: z
    .boolean()
    .optional()
    .describe("Whether to include the text content of the page."),
  highlights: z
    .object({
      query: z.string().describe("Query to highlight in the content."),
      numSentences: z.number().optional().describe("Number of sentences to include in highlights."),
      highlightsPerUrl: z.number().optional().describe("Number of highlights per URL."),
    })
    .optional()
    .describe("Options for highlighting specific content."),
  summary: z
    .object({
      query: z.string().describe("Query to generate a summary based on."),
    })
    .optional()
    .describe("Options for generating summaries of content."),
  livecrawl: z
    .enum(["always", "never", "fallback"])
    .optional()
    .describe("When to use live crawling. 'always' forces fresh content, 'never' uses cache only."),
  subpages: z
    .number()
    .min(0)
    .max(10)
    .optional()
    .describe("Number of subpages to crawl from each result."),
  subpageTarget: z
    .array(z.string())
    .optional()
    .describe("Specific subpage paths to target (e.g., 'about', 'team', 'products')."),
});

// Schema for search action
export const searchOptionsSchema = z.object({
  query: z
    .string()
    .describe("The search query to execute."),
  searchOptions: baseSearchOptionsSchema
    .optional()
    .describe("Options for configuring the search behavior."),
});

// Schema for search and contents action
export const searchAndContentsOptionsSchema = z.object({
  query: z
    .string()
    .describe("The search query to execute."),
  searchOptions: baseSearchOptionsSchema
    .optional()
    .describe("Options for configuring the search behavior."),
  contentOptions: contentOptionsSchema
    .optional()
    .describe("Options for configuring content extraction."),
});

// Schema for get contents action
export const getContentsOptionsSchema = z.object({
  urls: z
    .array(z.string().url())
    .min(1)
    .describe("Array of URLs to fetch content from."),
  contentOptions: contentOptionsSchema
    .optional()
    .describe("Options for configuring content extraction."),
});

// Schema for find similar action
export const findSimilarOptionsSchema = z.object({
  url: z
    .string()
    .url()
    .describe("The URL to find similar pages to."),
  searchOptions: baseSearchOptionsSchema
    .optional()
    .describe("Options for configuring the search behavior."),
});

// Schema for find similar and contents action
export const findSimilarAndContentsOptionsSchema = z.object({
  url: z
    .string()
    .url()
    .describe("The URL to find similar pages to."),
  searchOptions: baseSearchOptionsSchema
    .optional()
    .describe("Options for configuring the search behavior."),
  contentOptions: contentOptionsSchema
    .optional()
    .describe("Options for configuring content extraction."),
});

// Schema for answer action
export const answerOptionsSchema = z.object({
  query: z
    .string()
    .describe("The question to answer."),
  searchOptions: baseSearchOptionsSchema
    .optional()
    .describe("Options for configuring the search behavior."),
});

// Unified schema for Exa tool input
export const exaInputSchema = z
  .object({
    action: z
      .enum(["search", "searchAndContents", "getContents", "findSimilar", "findSimilarAndContents", "answer"])
      .describe(
        "The type of operation to perform. Choose one from the available actions."
      ),
    searchOptions: searchOptionsSchema
      .optional()
      .describe("Options for the search action. Required when action is 'search'."),
    searchAndContentsOptions: searchAndContentsOptionsSchema
      .optional()
      .describe("Options for the searchAndContents action. Required when action is 'searchAndContents'."),
    getContentsOptions: getContentsOptionsSchema
      .optional()
      .describe("Options for the getContents action. Required when action is 'getContents'."),
    findSimilarOptions: findSimilarOptionsSchema
      .optional()
      .describe("Options for the findSimilar action. Required when action is 'findSimilar'."),
    findSimilarAndContentsOptions: findSimilarAndContentsOptionsSchema
      .optional()
      .describe("Options for the findSimilarAndContents action. Required when action is 'findSimilarAndContents'."),
    answerOptions: answerOptionsSchema
      .optional()
      .describe("Options for the answer action. Required when action is 'answer'."),
  })
  .refine(
    (data) =>
      (data.action === "search" && data.searchOptions) ||
      (data.action === "searchAndContents" && data.searchAndContentsOptions) ||
      (data.action === "getContents" && data.getContentsOptions) ||
      (data.action === "findSimilar" && data.findSimilarOptions) ||
      (data.action === "findSimilarAndContents" && data.findSimilarAndContentsOptions) ||
      (data.action === "answer" && data.answerOptions),
    {
      message:
        "The corresponding options object must be provided based on the chosen action.",
      path: ["action"],
    }
  );