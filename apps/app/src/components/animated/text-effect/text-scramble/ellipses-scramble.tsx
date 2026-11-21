import { TextScramble } from "./text-scramble";

export function EllipsesScramble({
	children,
	className,
}: { children: any; className?: string }) {
	return (
		<TextScramble className={className} duration={2} characterSet=". ">
			{children}
		</TextScramble>
	);
}
