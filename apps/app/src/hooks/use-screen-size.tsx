"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to detect and track screen size
 * @param {number} debounceTime - Debounce time in milliseconds
 * @returns {Object} Screen dimensions and device type
 */
export const useScreenSize = (debounceTime = 250) => {
	const [screenSize, setScreenSize] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
		isDesktop: false,
		isTablet: false,
		isMobile: false,
	});

	useEffect(() => {
		// Function to determine device type
		const getDeviceType = (width) => {
			const isDesktop = width >= 1024;
			const isTablet = width >= 768 && width < 1024;
			const isMobile = width < 768;
			return { isDesktop, isTablet, isMobile };
		};

		// Function to handle resize with debounce
		let debounceTimer;
		const handleResize = () => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				const width = window.innerWidth;
				const height = window.innerHeight;
				const deviceTypes = getDeviceType(width);

				setScreenSize({
					width,
					height,
					...deviceTypes,
				});
			}, debounceTime);
		};

		// Set initial values
		const initialWidth = window.innerWidth;
		const initialHeight = window.innerHeight;
		const initialDeviceTypes = getDeviceType(initialWidth);

		setScreenSize({
			width: initialWidth,
			height: initialHeight,
			...initialDeviceTypes,
		});

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Clean up
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(debounceTimer);
		};
	}, [debounceTime]);

	return screenSize;
};
