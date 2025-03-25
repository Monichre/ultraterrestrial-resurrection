"use client";
import { useEffect, useState } from "react";

export const useDetectBrowser = () => {
	const [browserInfo, setBrowserInfo] = useState({
		name: "unknown",
		version: "unknown",
		os: "unknown",
		isMobile: false,
	});

	useEffect(() => {
		const detectBrowser = () => {
			const userAgent = navigator.userAgent;
			let name = "unknown";
			let version = "unknown";
			let os = "unknown";
			let isMobile = false;

			// Detect operating system
			if (/Windows/i.test(userAgent)) {
				os = "Windows";
			} else if (/Macintosh|Mac OS X/i.test(userAgent)) {
				os = "macOS";
			} else if (/Linux/i.test(userAgent)) {
				os = "Linux";
			} else if (/Android/i.test(userAgent)) {
				os = "Android";
				isMobile = true;
			} else if (/iPhone|iPad|iPod/i.test(userAgent)) {
				os = "iOS";
				isMobile = true;
			}

			// Detect browser
			if (/Edge|Edg/i.test(userAgent)) {
				name = "Edge";
				version = userAgent.match(/(Edge|Edg)\/(\d+)/i)?.[2] || "unknown";
			} else if (/Firefox/i.test(userAgent)) {
				name = "Firefox";
				version = userAgent.match(/Firefox\/(\d+)/i)?.[1] || "unknown";
			} else if (/Chrome/i.test(userAgent)) {
				name = "Chrome";
				version = userAgent.match(/Chrome\/(\d+)/i)?.[1] || "unknown";
			} else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
				name = "Safari";
				version = userAgent.match(/Version\/(\d+)/i)?.[1] || "unknown";
			} else if (/MSIE|Trident/i.test(userAgent)) {
				name = "Internet Explorer";
				version = userAgent.match(/(MSIE |rv:)(\d+)/i)?.[2] || "unknown";
			} else if (/Opera|OPR/i.test(userAgent)) {
				name = "Opera";
				version = userAgent.match(/(Opera|OPR)\/(\d+)/i)?.[2] || "unknown";
			}

			// Check if user agent indicates a mobile device
			if (
				!isMobile &&
				/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					userAgent,
				)
			) {
				isMobile = true;
			}

			return { name, version, os, isMobile };
		};

		setBrowserInfo(detectBrowser());
	}, []);

	return browserInfo;
};
