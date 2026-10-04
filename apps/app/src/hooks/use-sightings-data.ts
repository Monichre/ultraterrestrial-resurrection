"use client";

import { useState, useEffect, useCallback } from "react";
import { getSightingsBatched } from "@/services/sightings/actions/sightings-time-chunk";
import { getEventsBatched } from "@/services/sightings/actions/events-time-chunk";
import type { ValidatedUAPSighting } from "@/services/sightings/uap-sighting";

export interface TimeRange {
	startYear: number;
	endYear: number;
}

export interface FilterOptions {
	shape?: string;
	duration?: number; // in seconds
	location?: string;
	isSignificantEvent?: boolean;
}

interface UseSightingsDataParams {
	initialTimeRange?: TimeRange;
	chunkSize?: number; // years per chunk
	initialFilters?: FilterOptions;
}

/**
 * React hook for fetching and managing sightings data with time-chunked pagination
 */
export function useSightingsData({
	initialTimeRange,
	chunkSize = 5,
	initialFilters = {},
}: UseSightingsDataParams = {}) {
	// Current year as default
	const currentYear = new Date().getFullYear();

	// Defaults to last 20 years if not provided
	const defaultTimeRange = {
		startYear: currentYear - 10,
		endYear: currentYear,
	};

	// State
	const [timeRange, setTimeRange] = useState<TimeRange>(
		initialTimeRange || defaultTimeRange,
	);
	const [filters, setFilters] = useState<FilterOptions>(initialFilters);
	const [sightings, setSightings] = useState<ValidatedUAPSighting[]>([]);
	const [events, setEvents] = useState<any[]>([]);
	const [stats, setStats] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// Calculate time chunks based on timeRange
	const getTimeChunks = useCallback(
		(range: TimeRange): TimeRange[] => {
			const chunks: TimeRange[] = [];
			for (
				let year = range.startYear;
				year <= range.endYear;
				year += chunkSize
			) {
				const endYear = Math.min(year + chunkSize - 1, range.endYear);
				chunks.push({ startYear: year, endYear });
			}
			return chunks;
		},
		[chunkSize],
	);

	// Function to fetch data with current time range and filters
	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const timeChunks = getTimeChunks(timeRange);

			// Fetch sightings and events in parallel
			const [sightingsData, eventsData] = await Promise.all([
				getSightingsBatched(timeChunks, 100),
				getEventsBatched(timeChunks, 100),
			]);

			// Apply client-side filters to sightings
			const filteredSightings = sightingsData.sightings.filter((sighting) => {
				// Shape filter
				if (
					filters.shape &&
					sighting.category &&
					!sighting.category.includes(filters.shape.toLowerCase())
				) {
					return false;
				}

				// Location filter (basic implementation)
				if (
					filters.location &&
					sighting.location.city &&
					!sighting.location.city
						.toLowerCase()
						.includes(filters.location.toLowerCase())
				) {
					return false;
				}

				return true;
			});

			// Update state with fetched data
			setSightings(filteredSightings);
			setEvents(eventsData.events);

			// Combine stats
			setStats({
				sightings: sightingsData.stats,
				events: eventsData.stats,
			});
		} catch (err) {
			console.error("Error fetching data:", err);
			setError("Failed to fetch data. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, [timeRange, filters, getTimeChunks]);

	// Fetch data on initial render and when dependencies change
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Function to update time range
	const updateTimeRange = useCallback((newRange: TimeRange) => {
		setTimeRange(newRange);
	}, []);

	// Function to update filters
	const updateFilters = useCallback((newFilters: FilterOptions) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		sightings,
		events,
		stats,
		isLoading,
		error,
		timeRange,
		filters,
		updateTimeRange,
		updateFilters,
		refreshData: fetchData,
	};
}
