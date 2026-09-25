import { palette } from "@/utils/constants/colors";
import { useState } from "react";
import { create } from "zustand";
import chroma from "chroma-js";

export const useEventsStore = ({ events, years, activeYear }: any) =>
	create((set) => ({
		events,
		years: Object.keys(events),
		activeYear: activeYear,
		setActiveYear: (nextActiveYear: any) => set({ activeYear: nextActiveYear }),
		// increasePopulation: () => set((state: { bears: number }) => ({ bears: state.bears + 1 })),
		// removeAllBears: () => set({ bears: 0 }),
	}));

const getRandomValueFromArray = (array: any[]) => {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};

export const useTimelineConfig = ({ events, personnel }: any) => {
	const yearsArray = Object.keys(events);
	const [years, setYears] = useState(yearsArray);
	const colors = Object.keys(palette).map(
		(key: keyof typeof palette) => palette[key] as string,
	);
	const eventsWithExperts: any = {};
	for (const year in events) {
		const eventsThatYear = events[year];
		const eventsThatYearWithExperts = eventsThatYear.map(
			(event: { experts: any[] }) => {
				if (event?.experts) {
					const experts = event?.experts.map(
						(expertData: { [x: string]: any }) => {
							console.log("expertData: ", expertData);
							if (expertData) {
								const expertId = expertData["subject-matter-expert"];
								const expert = personnel.find(
									(person: { id: any }) => expertId === person?.id,
								);
								console.log("expert: ", expert);
								return expert;
							}
						},
					);
					event.experts = experts;
				}
				return event;
			},
		);
		eventsWithExperts[year] = eventsThatYearWithExperts;
	}

	const config = yearsArray.map((year) => {
		const background = getRandomValueFromArray(colors);
		const lightness = chroma(background).luminance();
		const color =
			lightness < 5
				? chroma(background).brighten()
				: chroma(background).darken();
		return {
			year: year,
			events: eventsWithExperts[year],
			background,
			color,
		};
	});
	console.log("config: ", config);

	return { years, ...config };
};
