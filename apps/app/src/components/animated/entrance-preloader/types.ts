export interface TerminalLine {
	text: string;
	type: "highlight" | "faded";
	position: number; // Top position in pixels
	scramble?: boolean;
}

export interface EntrancePreloaderProps {
	/**
	 * Called when the preloader animation completes
	 */
	onComplete?: () => void;

	/**
	 * Total duration of the preloader animation in seconds
	 * @default 6
	 */
	duration?: number;

	/**
	 * Title shown in the top border
	 * @default "Dimensional Gateway"
	 */
	title?: string;

	/**
	 * Subtitle shown in the top border
	 * @default "Traversal Initiated"
	 */
	subtitle?: string;

	/**
	 * Footer text shown in the bottom border (left)
	 * @default "Traversal Sequence Complete"
	 */
	footerLeft?: string;

	/**
	 * Footer text shown in the bottom border (right)
	 * @default "Dimensional Gateway Open"
	 */
	footerRight?: string;

	/**
	 * Progress label text
	 * @default "Traversing"
	 */
	progressLabel?: string;

	/**
	 * Progress action text that appears next to the progress bar
	 * @default "Dimensional Shift"
	 */
	progressAction?: string;

	/**
	 * Custom terminal lines to replace the defaults
	 */
	lines?: TerminalLine[];

	/**
	 * Special characters used for scrambling effect
	 * @default "▪"
	 */
	specialChars?: string;

	/**
	 * Custom CSS class to apply to the preloader
	 */
	className?: string;

	/**
	 * Children to reveal after the animation completes
	 */
	children?: React.ReactNode;
}

export interface UseEntrancePreloaderOptions {
	/**
	 * Total duration of the animation in seconds
	 * @default 6
	 */
	duration?: number;

	/**
	 * Called when the preloader animation completes
	 */
	onComplete?: () => void;

	/**
	 * Special characters used for scrambling effect
	 * @default "▪"
	 */
	specialChars?: string;
}

export interface UseEntrancePreloaderReturn {
	/**
	 * Start the animation
	 */
	start: () => void;

	/**
	 * Skip the animation and immediately show content
	 */
	skip: () => void;

	/**
	 * Reset the animation back to its initial state
	 */
	reset: () => void;

	/**
	 * Whether the animation is currently in progress
	 */
	isAnimating: boolean;

	/**
	 * Whether the animation has completed
	 */
	isComplete: boolean;
}
