// ChatGPT 01-mini
export const DATABASE_SCHEMA_PROMPT_V3 = `
System Prompt: Web Research Agent Data Model

This system utilizes a structured relational database comprising multiple interconnected tables. Each table is defined with specific columns, data types, constraints, and relationships to other tables. Below is a detailed overview of each table, its fields, and its associations within the database schema.

1. Topics

Purpose: Stores information about various topics.

Columns:
	•	name (string): The name of the topic.
	•	summary (text): A detailed summary of the topic.
	•	photo (file): A single photo representing the topic.
	•	photos (file[]): Multiple photos associated with the topic.
	•	title (string, unique): A unique title for the topic.

Relationships:
	•	topic-subject-matter-experts: Linked via the topic column.
	•	topics-testimonies: Linked via the topic column.
	•	event-topic-subject-matter-experts: Linked via the topic column.
	•	user-saved-topics: Linked via the topic column.

2. Personnel

Purpose: Contains information about personnel involved in various capacities.

Columns:
	•	bio (text): Biography of the personnel.
	•	role (string): Role or position held.
	•	facebook (string): Facebook profile link.
	•	twitter (string): Twitter handle.
	•	website (string): Personal or professional website.
	•	instagram (string): Instagram profile link.
	•	photo (file[]): Multiple photos of the personnel.
	•	rank (int): Rank or level.
	•	credibility (int): Credibility score.
	•	popularity (int): Popularity score.
	•	name (string, unique): Full name of the personnel.
	•	authority (int): Authority score.

Relationships:
	•	organization-members: Linked via the member column.
	•	event-subject-matter-experts: Linked via the subject-matter-expert column.
	•	topic-subject-matter-experts: Linked via the subject-matter-expert column.
	•	testimonies: Linked via the witness column.
	•	event-topic-subject-matter-experts: Linked via the subject-matter-expert column.
	•	user-saved-key-figure: Linked via the key-figure column.
	•	documents: Linked via the author column.

3. Events

Purpose: Records details about various events.

Columns:
	•	name (text): Name of the event.
	•	description (text): Detailed description of the event.
	•	location (string): Location of the event.
	•	latitude (float): Latitude coordinate of the event location.
	•	longitude (float): Longitude coordinate of the event location.
	•	date (datetime): Date and time of the event.
	•	photos (file[]): Photos from the event.
	•	metadata (json, default: “{}”): Additional metadata in JSON format.
	•	title (string, unique): A unique title for the event.
	•	summary (text): Summary of the event.

Relationships:
	•	event-subject-matter-experts: Linked via the event column.
	•	testimonies: Linked via the event column.
	•	event-topic-subject-matter-experts: Linked via the event column.
	•	user-saved-events: Linked via the event column.

4. Organizations

Purpose: Maintains data about various organizations.

Columns:
	•	name (string): Name of the organization.
	•	specialization (string): Area of specialization.
	•	description (text): Description of the organization.
	•	photo (text): Photo URL or identifier.
	•	image (file, defaultPublicAccess: true): Image file with public access.
	•	title (string, unique): A unique title for the organization.

Relationships:
	•	organization-members: Linked via the organization column.
	•	testimonies: Linked via the organization column.
	•	user-saved-organizations: Linked via the organization column.
	•	documents: Linked via the organization column.

5. Sightings

Purpose: Logs sightings with detailed information.

Columns:
	•	date (datetime): Date of the sighting.
	•	description (string): Description of the sighting.
	•	media_link (string): Link to media related to the sighting.
	•	city (string): City where the sighting occurred.
	•	state (string): State where the sighting occurred.
	•	country (string): Country where the sighting occurred.
	•	shape (string): Shape observed during the sighting.
	•	duration_seconds (string): Duration in seconds.
	•	duration_hours_min (string): Duration in hours and minutes.
	•	comments (string): Additional comments.
	•	date_posted (datetime): Date the sighting was posted.
	•	latitude (float): Latitude coordinate.
	•	longitude (float): Longitude coordinate.

Relationships:
	•	user-saved-sightings: Linked via the sighting column.

6. Event-Subject-Matter-Experts

Purpose: Associates events with subject matter experts.

Columns:
	•	event (link to Events): Reference to the related event.
	•	subject-matter-expert (link to Personnel): Reference to the subject matter expert.

7. Topic-Subject-Matter-Experts

Purpose: Links topics with subject matter experts.

Columns:
	•	topic (link to Topics): Reference to the related topic.
	•	subject-matter-expert (link to Personnel): Reference to the subject matter expert.

8. Organization-Members

Purpose: Connects personnel members to organizations.

Columns:
	•	member (link to Personnel): Reference to the personnel member.
	•	organization (link to Organizations): Reference to the organization.

9. Testimonies

Purpose: Captures testimonies related to events and organizations.

Columns:
	•	claim (text): The claim made in the testimony.
	•	event (link to Events): Reference to the related event.
	•	summary (text): Summary of the testimony.
	•	witness (link to Personnel): Reference to the witness.
	•	documentation (file[]): Supporting documentation files.
	•	date (datetime): Date of the testimony.
	•	organization (link to Organizations): Reference to the related organization.

Relationships:
	•	topics-testimonies: Linked via the testimony column.
	•	user-saved-testimonies: Linked via the testimony column.

10. Topics-Testimonies

Purpose: Associates topics with testimonies.

Columns:
	•	topic (link to Topics): Reference to the related topic.
	•	testimony (link to Testimonies): Reference to the testimony.

11. Documents

Purpose: Stores documents with associated metadata.

Columns:
	•	file (file[]): Document files.
	•	content (text): Content of the document.
	•	embedding (vector, dimension: 1536): Vector embedding for the document.
	•	title (string): Title of the document.
	•	date (datetime): Date of the document.
	•	author (link to Personnel): Reference to the author.
	•	organization (link to Organizations): Reference to the organization.
	•	url (text): URL link to the document.

Relationships:
	•	user-saved-documents: Linked via the document column.

12. Locations

Purpose: Defines various geographical locations.

Columns:
	•	name (string): Name of the location.
	•	coordinates (string): Coordinate representation.
	•	google-maps-location-id (text): Google Maps Location ID.
	•	city (string): City of the location.
	•	state (string): State of the location.
	•	latitude (float): Latitude coordinate.
	•	longitude (float): Longitude coordinate.

13. Event-Topic-Subject-Matter-Experts

Purpose: Links events, topics, and subject matter experts together.

Columns:
	•	event (link to Events): Reference to the related event.
	•	topic (link to Topics): Reference to the related topic.
	•	subject-matter-expert (link to Personnel): Reference to the subject matter expert.

14. Artifacts

Purpose: Manages artifacts with detailed descriptions and media.

Columns:
	•	name (string, unique): Name of the artifact.
	•	description (text): Description of the artifact.
	•	photos (multiple): Multiple photos of the artifact.
	•	date (string): Date associated with the artifact.
	•	source (text): Source of the artifact information.
	•	origin (text): Origin details of the artifact.
	•	images (file[], defaultPublicAccess: true): Image files with public access.

Notes:
	•	Data Types:
	•	string: A short text field.
	•	text: A longer text field.
	•	file: A single file upload.
	•	file[]: Multiple file uploads.
	•	int: Integer number.
	•	float: Floating-point number.
	•	datetime: Date and time.
	•	json: JSON-formatted data.
	•	vector: Numerical vector for embeddings.
	•	link: Reference to another table.
	•	multiple: Indicates multiple entries or files.
	•	Constraints:
	•	Fields marked as unique must have distinct values across all records in the table.
	•	defaultValue specifies the default value if none is provided.
	•	defaultPublicAccess indicates that the file is publicly accessible by default.
	•	Relationships:
	•	Defined to establish connections between tables, enabling relational data queries.
	•	Each relationship specifies the linking column and the target table.

This structured data model ensures organized storage and efficient retrieval of information, facilitating comprehensive web research operations.
`