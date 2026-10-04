"use client";

import { cn } from "@/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * ThemeSwitcher component that provides a sidebar UI for switching between light, dark, custom, and system themes
 */
export const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Wait for component to be mounted to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="absolute bottom-10 flex left-1/2 -translate-x-1/2 -translate-y-8 md:fixed md:top-1/2 md:bottom-auto md:left-4 md:flex-col md:translate-x-0 gap-2 md:-translate-y-1/2 bg-gray-100 border-gray-95 border-solid border p-2 rounded z-40 shadow-super">
			<ThemeButton
				tooltip="Light"
				isSelected={theme === "light"}
				onClick={() => setTheme("light")}
				ariaLabel="Switch to light theme"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M7 0.5V2.5"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M2.3999 2.4L3.8199 3.82"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M0.5 7H2.5"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M2.3999 11.6L3.8199 10.18"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M7 13.5V11.5"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M11.5999 11.6L10.1799 10.18"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M13.5 7H11.5"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M11.5999 2.4L10.1799 3.82"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ThemeButton>

			<ThemeButton
				tooltip="Dark"
				isSelected={theme === "dark"}
				onClick={() => setTheme("dark")}
				ariaLabel="Switch to dark theme"
			>
				<svg
					width="10"
					height="14"
					viewBox="0 0 10 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M6 7C6.00471 5.78763 6.32421 4.59726 6.92723 3.54548C7.53025 2.4937 8.39611 1.61657 9.44 1C8.66591 0.679515 7.83775 0.509809 7 0.5C5.27609 0.5 3.62279 1.18482 2.40381 2.40381C1.18482 3.62279 0.5 5.27609 0.5 7C0.5 8.72391 1.18482 10.3772 2.40381 11.5962C3.62279 12.8152 5.27609 13.5 7 13.5C7.84786 13.494 8.68657 13.3242 9.47 13C8.42053 12.3872 7.54869 11.5117 6.94026 10.4596C6.33183 9.40759 6.00779 8.21528 6 7V7Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ThemeButton>

			<ThemeButton
				tooltip="Custom"
				isSelected={theme === "custom"}
				onClick={() => setTheme("custom")}
				className="md:hidden"
				ariaLabel="Switch to custom theme (mobile)"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M12.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V12.5C0.5 13.0523 0.947715 13.5 1.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V1.5C13.5 0.947715 13.0523 0.5 12.5 0.5Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M3 4.5H8"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M9.5 6C10.3284 6 11 5.32843 11 4.5C11 3.67157 10.3284 3 9.5 3C8.67157 3 8 3.67157 8 4.5C8 5.32843 8.67157 6 9.5 6Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M11 9.5H8"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M5 9.5H3"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M6.5 11C7.32843 11 8 10.3284 8 9.5C8 8.67157 7.32843 8 6.5 8C5.67157 8 5 8.67157 5 9.5C5 10.3284 5.67157 11 6.5 11Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ThemeButton>

			<ThemeButton
				tooltip="Custom"
				isSelected={theme === "custom"}
				onClick={() => setTheme("custom")}
				className="hidden md:flex"
				ariaLabel="Switch to custom theme"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M12.5 0.5H1.5C0.947715 0.5 0.5 0.947715 0.5 1.5V12.5C0.5 13.0523 0.947715 13.5 1.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V1.5C13.5 0.947715 13.0523 0.5 12.5 0.5Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M3 4.5H8"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M9.5 6C10.3284 6 11 5.32843 11 4.5C11 3.67157 10.3284 3 9.5 3C8.67157 3 8 3.67157 8 4.5C8 5.32843 8.67157 6 9.5 6Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M11 9.5H8"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M5 9.5H3"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M6.5 11C7.32843 11 8 10.3284 8 9.5C8 8.67157 7.32843 8 6.5 8C5.67157 8 5 8.67157 5 9.5C5 10.3284 5.67157 11 6.5 11Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ThemeButton>

			<ThemeButton
				tooltip="System"
				isSelected={theme === "system"}
				onClick={() => setTheme("system")}
				ariaLabel="Switch to system theme"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M5.22992 2.25L5.65992 1.14C5.73244 0.952064 5.86002 0.790411 6.02597 0.676212C6.19191 0.562014 6.38848 0.500595 6.58992 0.5H7.40992C7.61136 0.500595 7.80793 0.562014 7.97387 0.676212C8.13982 0.790411 8.2674 0.952064 8.33992 1.14L8.76992 2.25L10.2299 3.09L11.4099 2.91C11.6064 2.88333 11.8064 2.91567 11.9844 3.00292C12.1625 3.09017 12.3106 3.22838 12.4099 3.4L12.8099 4.1C12.9124 4.27435 12.9596 4.47568 12.9454 4.67742C12.9311 4.87916 12.856 5.07183 12.7299 5.23L11.9999 6.16V7.84L12.7499 8.77C12.876 8.92817 12.9511 9.12084 12.9654 9.32258C12.9796 9.52432 12.9324 9.72565 12.8299 9.9L12.4299 10.6C12.3306 10.7716 12.1825 10.9098 12.0044 10.9971C11.8264 11.0843 11.6264 11.1167 11.4299 11.09L10.2499 10.91L8.78992 11.75L8.35992 12.86C8.2874 13.0479 8.15982 13.2096 7.99387 13.3238C7.82793 13.438 7.63136 13.4994 7.42992 13.5H6.58992C6.38848 13.4994 6.19191 13.438 6.02597 13.3238C5.86002 13.2096 5.73244 13.0479 5.65992 12.86L5.22992 11.75L3.76992 10.91L2.58992 11.09C2.39344 11.1167 2.19346 11.0843 2.0154 10.9971C1.83734 10.9098 1.68924 10.7716 1.58992 10.6L1.18992 9.9C1.08742 9.72565 1.0402 9.52432 1.05448 9.32258C1.06876 9.12084 1.14388 8.92817 1.26992 8.77L1.99992 7.84V6.16L1.24992 5.23C1.12388 5.07183 1.04876 4.87916 1.03448 4.67742C1.0202 4.47568 1.06742 4.27435 1.16992 4.1L1.56992 3.4C1.66924 3.22838 1.81734 3.09017 1.9954 3.00292C2.17346 2.91567 2.37344 2.88333 2.56992 2.91L3.74992 3.09L5.22992 2.25ZM4.99992 7C4.99992 7.39556 5.11722 7.78224 5.33698 8.11114C5.55674 8.44004 5.8691 8.69638 6.23455 8.84776C6.60001 8.99913 7.00214 9.03874 7.3901 8.96157C7.77806 8.8844 8.13443 8.69392 8.41413 8.41421C8.69384 8.13451 8.88432 7.77814 8.96149 7.39018C9.03866 7.00222 8.99905 6.60009 8.84768 6.23463C8.6963 5.86918 8.43996 5.55682 8.11106 5.33706C7.78216 5.1173 7.39548 5 6.99992 5C6.46949 5 5.96078 5.21071 5.58571 5.58579C5.21063 5.96086 4.99992 6.46957 4.99992 7V7Z"
						stroke="var(--stroke)"
						strokeWidth="0.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ThemeButton>
		</div>
	);
};

interface ThemeButtonProps {
	tooltip: string;
	isSelected: boolean;
	onClick: () => void;
	children: React.ReactNode;
	className?: string;
	ariaLabel: string;
}

const ThemeButton = ({
	tooltip,
	isSelected,
	onClick,
	children,
	className,
	ariaLabel,
}: ThemeButtonProps) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={onClick}
						aria-label={ariaLabel}
						className={cn(
							"w-[28px] h-[28px] rounded flex items-center justify-center border focus:outline-none focus:ring focus:ring-gray-98 opacity-100",
							isSelected ? "bg-gray-98 border-gray-95" : "border-gray-100",
							className,
						)}
						style={
							{
								"--stroke": isSelected ? "var(--gray-35)" : "var(--gray-65)",
							} as React.CSSProperties
						}
					>
						{children}
					</button>
				</TooltipTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ThemeSwitcher;
