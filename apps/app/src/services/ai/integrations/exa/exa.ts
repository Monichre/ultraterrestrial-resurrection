/* ------------------------------------------------------------------
 * Functional Exa client – no classes, no hidden state.
 * ------------------------------------------------------------------ */
import Exa from 'exa-js';
import type { z } from 'zod';
import type {
  baseSearchOptionsSchema,
  contentOptionsSchema,
  searchOptionsSchema,
  searchAndContentsOptionsSchema,
  getContentsOptionsSchema,
  findSimilarOptionsSchema,
  findSimilarAndContentsOptionsSchema,
  answerOptionsSchema,
} from '../../agents/tools/schema/exa';

// Initialize Exa instance
const exaInstance = new Exa(process.env.EXA_API_KEY);

// Type inference from schemas
type BaseSearchOptions = z.infer<typeof baseSearchOptionsSchema>;
type ContentOptions = z.infer<typeof contentOptionsSchema>;
type SearchOptions = z.infer<typeof searchOptionsSchema>;
type SearchAndContentsOptions = z.infer<typeof searchAndContentsOptionsSchema>;
type GetContentsOptions = z.infer<typeof getContentsOptionsSchema>;
type FindSimilarOptions = z.infer<typeof findSimilarOptionsSchema>;
type FindSimilarAndContentsOptions = z.infer<typeof findSimilarAndContentsOptionsSchema>;
type AnswerOptions = z.infer<typeof answerOptionsSchema>;

// Result types
export interface ExaResult {
  url: string;
  id: string;
  title?: string | null;
  score?: number;
  publishedDate?: string;
  author?: string;
  text?: string;
  highlights?: string[];
  highlightScores?: number[];
  summary?: string;
}

export interface ExaResponse {
  results: ExaResult[];
  autopromptString?: string;
}

// Pure functions for each Exa operation
export const search = async (options: SearchOptions): Promise<ExaResponse> => {
  const { query, searchOptions } = options;
  const response = await exaInstance.search(query, searchOptions as any);
  return {
    results: response.results,
    autopromptString: response.autopromptString,
  };
};

export const searchAndContents = async (options: SearchAndContentsOptions): Promise<ExaResponse> => {
  const { query, searchOptions, contentOptions } = options;
  
  try {
    const response = await exaInstance.searchAndContents(query, {
      ...searchOptions,
      ...contentOptions,
    } as any);
    return {
      results: response.results,
      autopromptString: response.autopromptString,
    };
  } catch (error) {
    console.error('🚨 Exa API searchAndContents error:', {
      query,
      searchOptions,
      contentOptions,
      error: error instanceof Error ? error.message : error
    });
    
    // Return empty results instead of crashing
    return {
      results: [],
      autopromptString: undefined,
    };
  }
};

export const getContents = async (options: GetContentsOptions): Promise<ExaResponse> => {
  const { urls, contentOptions } = options;
  const response = await exaInstance.getContents(urls, contentOptions as any);
  return {
    results: response.results,
  };
};

export const findSimilar = async (options: FindSimilarOptions): Promise<ExaResponse> => {
  const { url, searchOptions } = options;
  const response = await exaInstance.findSimilar(url, searchOptions as any);
  return {
    results: response.results,
    autopromptString: response.autopromptString,
  };
};

export const findSimilarAndContents = async (options: FindSimilarAndContentsOptions): Promise<ExaResponse> => {
  const { url, searchOptions, contentOptions } = options;
  const response = await exaInstance.findSimilarAndContents(url, {
    ...searchOptions,
    ...contentOptions,
  } as any);
  return {
    results: response.results,
    autopromptString: response.autopromptString,
  };
};

export const answer = async (options: AnswerOptions): Promise<string> => {
  const { query, searchOptions } = options;
  const response = await exaInstance.answer(query, searchOptions as any);
  // Handle both string and object responses from Exa
  return typeof response.answer === 'string' ? response.answer : JSON.stringify(response.answer);
};

// Export all functions as a service object
export const exaService = {
  search,
  searchAndContents,
  getContents,
  findSimilar,
  findSimilarAndContents,
  answer,
};

// Export types
export type ExaService = typeof exaService;

// Export a factory function that returns the service (for cases where API key needs to be passed)
export const createExaService = (apiKey?: string) => {
  // If a different API key is needed in the future, we can create a new instance here
  // For now, just return the singleton service
  return exaService;
};
