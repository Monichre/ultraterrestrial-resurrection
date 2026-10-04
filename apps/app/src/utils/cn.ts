import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This utility function is used for merging Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Simple utility for merging style strings
export const mergeStyles = (styleArray: string[]) =>
	styleArray.map((style: string) => `${style}`).join(" ");
