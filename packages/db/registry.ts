/**
 * Database Provider Registry
 *
 * This file creates a centralized registry for database connections in the application.
 * Currently, it only includes Xata, but is designed to be extendable with additional
 * providers like Supabase or Convex in the future.
 */

import { xata } from "./xata/client";

/**
 * The provider registry containing all available database connections
 */
export const PROVIDERS = {
	xata: {
		client: xata,
	},
	// Future additions:
	// supabase: supabaseClient,
	// convex: convexClient,
} as const;

/**
 * Type representing the shape of the PROVIDERS object
 */
export type ProviderRegistry = typeof PROVIDERS;

/**
 * Valid keys that can be used to access providers
 */
export type ProviderKey = keyof ProviderRegistry;

/**
 * Re-export the xata client for direct access
 */
