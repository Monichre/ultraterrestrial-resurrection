"use client";

import type { NetworkGraphPayload } from "@/features/mindmap/queries/get-entity-network-graph-data";
import { createContext, useContext } from "react";

export type StateOfDisclosureSchema = {
	records: NetworkGraphPayload["records"];
	connections: NetworkGraphPayload["connections"];
	searchRelatedDataPoints: any;
};

export const StateOfDisclosureContext: any = createContext({
	records: {
		topics: [],
		events: [],
		personnel: [],
		testimonies: [],
		organizations: [],
		documents: [],
		artifacts: [],
	},
	connections: {
		topicsExpertsConnections: [],
		eventsExpertsConnections: [],
		eventsTopicsExpertsConnections: [],
		topicsTestimoniesConnections: [],
		organizationsPersonnelConnections: [],
	},
	mindMapIntialGraphState: {
		nodes: [],
		links: [],
	},
	// searchRelatedDataPoints?: ({ id, type }: any) => {},
});

export interface StateOfDisclosureProviderProps {
	children: any;
	stateOfDisclosure: any;
}

export const StateOfDisclosureProvider: React.FC<
	StateOfDisclosureProviderProps
> = ({ stateOfDisclosure, children }) => {
	const {
		records,
		connections,
		graphData: mindMapIntialGraphState,
	} = stateOfDisclosure;

	return (
		<StateOfDisclosureContext.Provider
			value={{ records, connections, mindMapIntialGraphState }}
		>
			{children}
		</StateOfDisclosureContext.Provider>
	);
};

export const useStateOfDisclosure: any = () => {
	const context = useContext(StateOfDisclosureContext);

	if (!context) {
		throw new Error("useGraph must be used within a UfologyProvider");
	}
	return context;
};
