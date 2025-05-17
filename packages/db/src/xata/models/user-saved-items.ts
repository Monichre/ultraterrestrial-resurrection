import {
	getXataClient,
	type UserSavedEventsRecord,
	type UserSavedTopicsRecord,
	type UserSavedKeyFigureRecord,
	type UserSavedTestimoniesRecord,
	type UserSavedDocumentsRecord,
	type UserSavedOrganizationsRecord,
	type UserSavedSightingsRecord,
} from "../xata";

// User Saved Events
export type UserSavedEventInput = {
	user: { id: string };
	event: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedEventUpdateInput = Partial<UserSavedEventInput> & {
	id: string;
};

export async function getUserSavedEventById(
	id: string,
): Promise<UserSavedEventsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_events.read(id);
}

export async function getUserSavedEvents(
	userId: string,
): Promise<UserSavedEventsRecord[]> {
	const xata = getXataClient();
	return await xata.db.user_saved_events.filter({ "user.id": userId }).getAll();
}

export async function createUserSavedEvent(
	data: UserSavedEventInput,
): Promise<UserSavedEventsRecord> {
	const xata = getXataClient();
	return await xata.db.user_saved_events.create(data);
}

export async function updateUserSavedEvent({
	id,
	...data
}: UserSavedEventUpdateInput): Promise<UserSavedEventsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_events.update(id, data);
}

export async function deleteUserSavedEvent(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.user_saved_events.delete(id);
}

// User Saved Topics
export type UserSavedTopicInput = {
	user: { id: string };
	topic: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedTopicUpdateInput = Partial<UserSavedTopicInput> & {
	id: string;
};

export async function getUserSavedTopicById(
	id: string,
): Promise<UserSavedTopicsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_topics.read(id);
}

export async function getUserSavedTopics(
	userId: string,
): Promise<UserSavedTopicsRecord[]> {
	const xata = getXataClient();
	return await xata.db.user_saved_topics.filter({ "user.id": userId }).getAll();
}

export async function createUserSavedTopic(
	data: UserSavedTopicInput,
): Promise<UserSavedTopicsRecord> {
	const xata = getXataClient();
	return await xata.db.user_saved_topics.create(data);
}

export async function updateUserSavedTopic({
	id,
	...data
}: UserSavedTopicUpdateInput): Promise<UserSavedTopicsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_topics.update(id, data);
}

export async function deleteUserSavedTopic(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.user_saved_topics.delete(id);
}

// User Saved Key Figure
export type UserSavedKeyFigureInput = {
	user: { id: string };
	"key-figure": { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedKeyFigureUpdateInput = Partial<UserSavedKeyFigureInput> & {
	id: string;
};

export async function getUserSavedKeyFigureById(
	id: string,
): Promise<UserSavedKeyFigureRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_key_figure.read(id);
}

export async function getUserSavedKeyFigures(
	userId: string,
): Promise<UserSavedKeyFigureRecord[]> {
	const xata = getXataClient();
	return await xata.db.user_saved_key_figure
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedKeyFigure(
	data: UserSavedKeyFigureInput,
): Promise<UserSavedKeyFigureRecord> {
	const xata = getXataClient();
	return await xata.db.user_saved_key_figure.create(data);
}

export async function updateUserSavedKeyFigure({
	id,
	...data
}: UserSavedKeyFigureUpdateInput): Promise<UserSavedKeyFigureRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_key_figure.update(id, data);
}

export async function deleteUserSavedKeyFigure(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.user_saved_key_figure.delete(id);
}

// User Saved Testimonies
export type UserSavedTestimonyInput = {
	user: { id: string };
	testimony: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedTestimonyUpdateInput = Partial<UserSavedTestimonyInput> & {
	id: string;
};

export async function getUserSavedTestimonyById(
	id: string,
): Promise<UserSavedTestimoniesRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_testimonies.read(id);
}

export async function getUserSavedTestimonies(
	userId: string,
): Promise<UserSavedTestimoniesRecord[]> {
	const xata = getXataClient();
	return await xata.db.user_saved_testimonies
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedTestimony(
	data: UserSavedTestimonyInput,
): Promise<UserSavedTestimoniesRecord> {
	const xata = getXataClient();
	return await xata.db.user_saved_testimonies.create(data);
}

export async function updateUserSavedTestimony({
	id,
	...data
}: UserSavedTestimonyUpdateInput): Promise<UserSavedTestimoniesRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_testimonies.update(id, data);
}

export async function deleteUserSavedTestimony(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.user_saved_testimonies.delete(id);
}

// User Saved Documents
export type UserSavedDocumentInput = {
	user: { id: string };
	document: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedDocumentUpdateInput = Partial<UserSavedDocumentInput> & {
	id: string;
};

export async function getUserSavedDocumentById(
	id: string,
): Promise<UserSavedDocumentsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_documents.read(id);
}

export async function getUserSavedDocuments(
	userId: string,
): Promise<UserSavedDocumentsRecord[]> {
	const xata = getXataClient();
	return await xata.db.user_saved_documents
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedDocument(
	data: UserSavedDocumentInput,
): Promise<UserSavedDocumentsRecord> {
	const xata = getXataClient();
	return await xata.db.user_saved_documents.create(data);
}

export async function updateUserSavedDocument({
	id,
	...data
}: UserSavedDocumentUpdateInput): Promise<UserSavedDocumentsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_documents.update(id, data);
}

export async function deleteUserSavedDocument(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.user_saved_documents.delete(id);
}

// User Saved Organizations
export type UserSavedOrganizationInput = {
	user: { id: string };
	organization: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedOrganizationUpdateInput =
	Partial<UserSavedOrganizationInput> & {
		id: string;
	};

export async function getUserSavedOrganizationById(
	id: string,
): Promise<UserSavedOrganizationsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_organizations.read(id);
}

export async function getUserSavedOrganizations(
	userId: string,
): Promise<UserSavedOrganizationsRecord[]> {
	const xata = getXataClient();
	return await xata.db.user_saved_organizations
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedOrganization(
	data: UserSavedOrganizationInput,
): Promise<UserSavedOrganizationsRecord> {
	const xata = getXataClient();
	return await xata.db.user_saved_organizations.create(data);
}

export async function updateUserSavedOrganization({
	id,
	...data
}: UserSavedOrganizationUpdateInput): Promise<UserSavedOrganizationsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_organizations.update(id, data);
}

export async function deleteUserSavedOrganization(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.user_saved_organizations.delete(id);
}

// User Saved Sightings
export type UserSavedSightingInput = {
	user: { id: string };
	sighting: { id: string };
	theory?: { id: string };
	note?: string;
	"note-title"?: string;
};

export type UserSavedSightingUpdateInput = Partial<UserSavedSightingInput> & {
	id: string;
};

export async function getUserSavedSightingById(
	id: string,
): Promise<UserSavedSightingsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_sightings.read(id);
}

export async function getUserSavedSightings(
	userId: string,
): Promise<UserSavedSightingsRecord[]> {
	const xata = getXataClient();
	return await xata.db.user_saved_sightings
		.filter({ "user.id": userId })
		.getAll();
}

export async function createUserSavedSighting(
	data: UserSavedSightingInput,
): Promise<UserSavedSightingsRecord> {
	const xata = getXataClient();
	return await xata.db.user_saved_sightings.create(data);
}

export async function updateUserSavedSighting({
	id,
	...data
}: UserSavedSightingUpdateInput): Promise<UserSavedSightingsRecord | null> {
	const xata = getXataClient();
	return await xata.db.user_saved_sightings.update(id, data);
}

export async function deleteUserSavedSighting(id: string): Promise<void> {
	const xata = getXataClient();
	await xata.db.user_saved_sightings.delete(id);
}
