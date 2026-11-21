import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values, then merges Tailwind classes
 * to prevent conflicts. Example: cn('p-4', 'p-5') -> 'p-5'
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
