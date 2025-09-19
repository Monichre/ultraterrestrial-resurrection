import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility: merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export any utilities in this folder that should be available via '@/lib/utils'
export * from "./card-transforms"
