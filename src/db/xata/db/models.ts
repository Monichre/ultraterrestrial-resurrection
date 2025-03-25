import { xata } from "@/db/xata/client";
import type { XataRecord } from "@xata.io/client";

type XataResponse = XataRecord[] | any[];

export const getAllEvents = async () => {
	if (xata) {
		console.log("🚀 ~ getAllEvents ~ xata:", xata);

		try {
			const events = await xata.db.events
				.getAll()
				.then((res) => res.toSerializable());
			console.log("🚀 ~ getAllEvents ~ events:", events);
			return events;
		} catch (error) {
			console.error("Error fetching events:", error);
			return [];
		}
	}
};

export const getAllTopics = async (): Promise<XataResponse> => {
	try {
		const topics = await xata.db.topics
			.getAll()
			.then((res) => res.toSerializable());
		return topics;
	} catch (error) {
		console.error("Error fetching topics:", error);
		return [];
	}
};

export const getAllPersonnel = async (): Promise<XataResponse> => {
	try {
		const personnel = await xata.db.personnel
			.sort("rank", "desc")
			.getAll()
			.then((res) => res.toSerializable());
		return personnel;
	} catch (error) {
		console.error("Error fetching personnel:", error);
		return [];
	}
};

export const getAllTestimonies = async (): Promise<XataResponse> => {
	try {
		const testimonies = await xata.db.testimonies
			.select([
				"*",
				"witness.id",
				"witness.name",
				"witness.role",
				"witness.photo",
				"witness.photo.signedUrl",
				"event.id",
				"event.name",
				"event.date",
			])
			.getAll()
			.then((res) => res.toSerializable());
		return testimonies;
	} catch (error) {
		console.error("Error fetching testimonies:", error);
		return [];
	}
};

export const getAllOrganizations = async () => {
	const records = await xata.db.organizations
		.select(["name", "specialization", "description", "title"])
		.getAll()
		.then((res) => res.toSerializable());
	return records;
};

export const getAllArtifacts = async () => {
	return await xata.db.artifacts
		.getAll()
		.then((res: { toSerializable: () => any }) => res.toSerializable());
};

export const getAllDocuments = async () => {
	return await xata.db.documents
		.getAll()
		.then((res: { toSerializable: () => any }) => res.toSerializable());
};

export const getAllTopicsExpertsConnections = async () => {
	return await xata.db["topic-subject-matter-experts"]
		.getAll()
		.then((res: { toSerializable: () => any }) => res.toSerializable());
};

export const getAllEventsExpertsConnections = async () => {
	return await xata.db["event-subject-matter-experts"]
		.getAll()
		.then((res: { toSerializable: () => any }) => res.toSerializable());
};

// This is a 3 way link. How to handle?
export const getAllEventsTopicsExpertsConnections = async () => {
	return await xata.db["event-topic-subject-matter-experts"]
		.getAll()
		.then((res: { toSerializable: () => any }) => res.toSerializable());
};

export const getAllTopicsTestimoniesConnections = async () => {
	return await xata.db["topics-testimonies"]
		.getAll()
		.then((res: { toSerializable: () => any }) => res.toSerializable());
};

export const getAllOrganizationsMembers = async () => {
	return await xata.db["organization-members"]
		.getAll()
		.then((res: { toSerializable: () => any }) => res.toSerializable());
};

export const getAllConnectionsById = async (id: string) => {};
