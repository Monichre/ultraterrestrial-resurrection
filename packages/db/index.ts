/**
 * Database module entry point
 *
 * This file exports all database functionality from the package.
 */

// Export registry
export * from "./registry";

// Export Xata functionality
export * from "./src/xata/xata";

// Export src/index.ts
export * from "./src";

// Re-export the provider registry
export { PROVIDERS } from "./registry";
