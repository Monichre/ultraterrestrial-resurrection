import { useCallback, useEffect, useRef } from "react";

export const useCustomCursor = () => {
	const cursorBigRef = useRef<HTMLElement | null>(null);
	const cursorSmallRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		// Store references to cursor elements
		cursorBigRef.current = document.querySelector(".big");
		cursorSmallRef.current = document.querySelector(".small");

		// Check if device is mobile
		const isTouchDevice =
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			// msMaxTouchPoints is a legacy IE property
			("msMaxTouchPoints" in navigator
				? (navigator as unknown as { msMaxTouchPoints: number })
						.msMaxTouchPoints > 0
				: false);

		// Don't show custom cursor on mobile
		if (isTouchDevice) {
			if (cursorBigRef.current) cursorBigRef.current.style.display = "none";
			if (cursorSmallRef.current) cursorSmallRef.current.style.display = "none";
			return; // Exit early if mobile
		}

		// Mouse movement handler
		const onMouseMove = (e: MouseEvent) => {
			if (cursorBigRef.current) {
				cursorBigRef.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
			}
			if (cursorSmallRef.current) {
				cursorSmallRef.current.style.left = `${e.clientX}px`;
				cursorSmallRef.current.style.top = `${e.clientY}px`;
			}
		};

		// Mouse click handlers
		const onMouseDown = () => {
			cursorBigRef.current?.classList.add("click");
			cursorSmallRef.current?.classList.add("hover__small");
		};

		const onMouseUp = () => {
			cursorBigRef.current?.classList.remove("click");
			cursorSmallRef.current?.classList.remove("hover__small");
		};

		// Interactive element hover handlers
		const onLinkHover = () => {
			cursorBigRef.current?.classList.add("hover__big");
			cursorSmallRef.current?.classList.add("hover__small");
		};

		const onLinkLeave = () => {
			cursorBigRef.current?.classList.remove("hover__big");
			cursorSmallRef.current?.classList.remove("hover__small");
		};

		// Set up event listeners
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mousedown", onMouseDown);
		document.addEventListener("mouseup", onMouseUp);

		// Find all interactive elements
		const interactiveElements = document.querySelectorAll(
			'a, button, input[type="button"], input[type="submit"], input[type="reset"], [data-cursor="interactive"]',
		);

		// Add hover listeners to interactive elements
		for (const element of interactiveElements) {
			element.addEventListener("mouseover", onLinkHover);
			element.addEventListener("mouseleave", onLinkLeave);
		}

		// Set up mutation observer to detect new elements
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					const newInteractiveElements = document.querySelectorAll(
						'a, button, input[type="button"], input[type="submit"], input[type="reset"], [data-cursor="interactive"]',
					);

					for (const element of newInteractiveElements) {
						if (!element.hasAttribute("data-cursor-listener")) {
							element.setAttribute("data-cursor-listener", "true");
							element.addEventListener("mouseover", onLinkHover);
							element.addEventListener("mouseleave", onLinkLeave);
						}
					}
				}
			}
		});

		// Start observing
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		// Clean up event listeners
		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("mouseup", onMouseUp);

			for (const element of interactiveElements) {
				element.removeEventListener("mouseover", onLinkHover);
				element.removeEventListener("mouseleave", onLinkLeave);
			}

			observer.disconnect();
		};
	}, []);
};
