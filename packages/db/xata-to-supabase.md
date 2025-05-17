### A. General Migration Strategy

* **Primary Keys:** Xata uses string/char-based unique IDs like `rec_abc123...`. Maintain these as `id` (type: `text` or `varchar`) in Supabase to preserve all foreign key integrity and relationships.
* **Foreign Keys:** Ensure that any `link` or relation columns point to the Xata-format char IDs, not integer autoincrements.
* **Data Types:** Closest Postgres types are suggested below. Pay particular attention to:
  * `vector`: Use `vector` extension or `float[]`.
  * `file`, `file[]`: Use `text[]` or a Supabase Storage integration pattern.
  * `text`, `string`: Use `text` or `varchar`.
  * `multiple`: Use `text[]` or a dedicated join table if needed.
  * `json`: Use `jsonb`.
* **Empty Tables:** Some tables have no columns; just duplicate structure for now.
* **Uniqueness:** Check/port all unique constraints, especially on `title`, `email`, etc.

---

### B. Tables to Create (Xata parity in Supabase)

#### 1. topics

* id (`text` primary key)
* name (`text`)
* summary (`text`)
* photo (`text`) or (`text[]` if you want to future-proof)
* photos (`text[]`)
* title (`text`, unique)
* embedding (`vector(1536)` or `float[]`)
* ⮩ links: [topic-subject-matter-experts], [topics-testimonies], [event-topic-subject-matter-experts], [user-saved-topics]

#### 2. personnel

* id (`text` primary key)
* bio (`text`)
* role (`text`)
* photo (`text[]`)
* rank, credibility, popularity, authority (`integer`)
* name (`text`, unique)
* embedding (`vector(1536)` or `float[]`)
* ⮩ links: [organization-members], [event-subject-matter-experts], etc.

#### 3. events

* id, name, description, location, latitude, longitude, date, photos, metadata, title (unique), summary, category (`text[]`), embedding (`vector`)
* ⮩ links: [event-subject-matter-experts], etc.

#### 4. organizations

* id, name, specialization, description, photo, image, title(unique), embedding (vector 500)
* ⮩ links: [organization-members], etc.

#### 5. sightings

* Comprehensive geo fields, date fields, description, media links/files

#### 6. event-subject-matter-experts

* id, event (FK), subject-matter-expert (FK)

#### 7. topic-subject-matter-experts

* id, topic (FK), subject-matter-expert (FK)

#### 8. organization-members

* id, member (FK personnel), organization (FK organizations)

#### 9. testimonies

* id, claim, event (FK), summary, witness (FK), documentation, date, organization (FK), source, media, context, embedding

#### 10. topics-testimonies

* id, topic (FK), testimony (FK)

#### 11. documents

* id, file[], summary, embedding, title, date, author (FK), organization (FK), url, metadata, images

#### 12. locations

* id, name, coordinates, google-maps-location-id, city, state, latitude, longitude

#### 13. event-topic-subject-matter-experts

* id, event (FK), topic (FK), subject-matter-expert (FK)

#### 14. users

* id, email (unique), name, photo, profile_image_url, external_id

#### 15. user-saved-events / user-saved-topics / user-saved-key-figure / user-saved-testimonies / user-saved-documents / user-notes / user-saved-organizations / user-saved-sightings

* All linking tables: id, user (FK), *target FK*, theory (FK user-notes), note, note-title

#### 16. user-notes

* id, user (FK), name, content, synopsis, diagrams

#### 17. tags, theories, case-files, mindmaps

* tags, theories, case-files: just id for now (no columns)
* mindmaps: id, json, embedding, user (FK), file

#### 18. artifacts

* id, name (unique), description, photos, date, source, origin, images, embedding

#### 19. key-figures

* id, name, bio, photo, role, rank, credibility, popularity, authority, embedding, xataversion

---

### C. Steps

1. **Create Table DDL**: For each table, define:
   * id: `text PRIMARY KEY` (store original Xata ID)
   * all other columns (see above, map to Postgres types)
   * foreign key constraints (Enforce all links using original Xata char IDs)
   * unique and index constraints per schema
2. **Relations:** Ensure any join/linking tables reference the correct IDs.
3. **Migrate Data**: Import CSVs, preserving all original IDs (never auto-generate!).
4. **Test Foreign Key Integrity:** After import, check every foreign key constraint resolves.
5. **Validate Uniqueness Constraints:** Use SQL to find duplicates on fields that should be unique (esp. emails, titles, etc).
6. **Handle Files/Media:** If mapping to Supabase Storage, create URLs or bucket pointers.
7. **Vectors:** If using pgvector, enable extension; if not, store as float[].

---

### D. Notes

* **DO NOT use Postgres serial/integer PKs** unless you're 100% sure you can remap all FKs in all joined/linking tables. To avoid breakage, just mirror Xata's `id` as text/varchar.
* **Custom types**: For any `multiple` or enum types, consider mapping to a suitable text[] or dedicated join table.
* **Tables with no columns** can be created as just a PK stub. Add columns as needed if schema evolves.
