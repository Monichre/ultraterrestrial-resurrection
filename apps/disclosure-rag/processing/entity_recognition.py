from typing import Any, Dict, List, Optional, Tuple

import spacy
from sqlalchemy.ext.asyncio import AsyncSession
# Example: Your specialized schema models
# (Adjust imports to match your actual project structure and naming.)
from src.storage.models import (Artifact, EntityMention, Event,  # etc...
                                Location, Organization, Personnel, Topic)
from transformers import pipeline


class EntityRecognizer:
    def __init__(self):
        """
        Initialize NER pipelines:
          1) SpaCy for standard entity recognition
          2) Transformers pipeline for specialized domain-specific entities
        """
        self.nlp = spacy.load("en_core_web_trf")
        self.ner_pipeline = pipeline("ner", model="jean-baptiste/roberta-large-ner-english")

    async def process_content(self, text: str, session: AsyncSession) -> List[Dict[str, Any]]:
        """
        Extract entities from text using multiple NER approaches,
        then store them in the database under the appropriate schema tables.
        Returns a list of the unique recognized entities (and their mention info).
        """
        # Collect raw recognized entities
        raw_entities = []

        # 1) Use SpaCy for basic NER
        doc = self.nlp(text)
        for ent in doc.ents:
            raw_entities.append({
                "text": ent.text,
                "label": ent.label_,
                "start": ent.start_char,
                "end": ent.end_char,
                "score": 1.0,  # SpaCy doesn't provide confidence out of the box
                "context": text[max(0, ent.start_char - 50): ent.end_char + 50]
            })

        # 2) Use specialized Transformers pipeline for domain-specific NER
        specialized_entities = self.ner_pipeline(text)
        for ent in specialized_entities:
            raw_entities.append({
                "text": ent["word"],
                "label": ent["entity"],
                "start": ent["start"],
                "end": ent["end"],
                "score": ent["score"],
                "context": text[max(0, ent["start"] - 50): ent["end"] + 50]
            })

        # Store them in DB with deduplication
        unique_entities = await self._store_entities(raw_entities, session)
        return unique_entities

    def _map_label_to_model(
        self, label: str
    ) -> Tuple[Optional[type], Optional[str]]:
        """
        Maps a recognized label to the appropriate model class and the
        unique identifier field. Adjust or expand as necessary.

        Returns:
            (model_class, unique_field_name) or (None, None)
        """
        # A simple mapping from raw NER labels to your domain’s entity tables
        # Expand based on your standard label sets or rules
        label_lower = label.lower()

        # Examples only:
        if label_lower in ["person", "personnel"]:
            return (Personnel, "name")
        elif label_lower in ["org", "organization"]:
            return (Organization, "title")
        elif label_lower in ["event", "misc"]: 
            # Adjust "misc" or other label to your logic
            return (Event, "title")
        elif label_lower in ["gpe", "loc", "location"]:
            return (Location, "name")
        elif label_lower in ["topic"]:
            return (Topic, "title")
        elif label_lower in ["artifact", "product"]:
            return (Artifact, "name")
        # Add more logic here, e.g. for SIGHTING, TESTIMONY, DOCUMENT, etc.
        return (None, None)

    async def _store_entities(self, entities: List[Dict[str, Any]], session: AsyncSession) -> List[Dict[str, Any]]:
        """
        Deduplicate and store recognized entities in the correct domain-specific tables.
        Also create or update mention entries.

        Returns a list of unique entity records with mention details.
        """
        # We'll track unique (model_class, entity_text) combos
        # to avoid creating duplicates for the same text within the same model.
        unique_cache = {}

        stored_entities = []

        for ent in entities:
            text_val = ent["text"].strip()
            label = ent["label"]

            model_class, unique_field = self._map_label_to_model(label)
            if not model_class:
                # If the label doesn’t map to a known model, skip or handle differently
                continue

            # Compose a key to deduplicate (model, text)
            unique_key = (model_class.__name__, text_val.lower())
            if unique_key not in unique_cache:
                # Fetch or create the domain entity
                db_obj = await session.execute(
                    # e.g., SELECT * FROM model_class WHERE unique_field == text_val
                    # For async, you'll want to use your correct async pattern
                    # This example uses standard 'execute(...)' just to illustrate
                    model_class.__table__.select().where(
                        getattr(model_class, unique_field) == text_val
                    )
                )
                result = db_obj.fetchone()

                if result:
                    entity_record = result[0]  # The returned row
                else:
                    # Create new
                    entity_record = model_class()
                    setattr(entity_record, unique_field, text_val)

                    # Optional: add any default or derived metadata
                    # For example, if we store confidence or label
                    # in the “metadata” or any relevant field.
                    # e.g. entity_record.metadata = {"type_confidence": ent["score"]}

                    session.add(entity_record)
                    await session.flush()  # get primary key

                # Store in the cache
                unique_cache[unique_key] = entity_record

            # Retrieve the domain object from the cache
            entity_record = unique_cache[unique_key]

            # Create a mention record referencing this entity
            mention = EntityMention(
                mention_text=text_val,
                start_offset=ent["start"],
                end_offset=ent["end"],
                context=ent["context"],
                confidence=ent["score"],
                entity_label=label,
                # Suppose each mention has an FK like `entity_id` or
                # `personnel_id`, etc. In a more dynamic approach you’d store a
                # polymorphic relationship or store everything in one mention
                # table with e.g. “linked_personnel_id” or “linked_event_id”.
                # For the example, let's store in a single table referencing
                # the domain entity by ID.
                domain_entity_id=entity_record.id,  # or whichever field
                domain_entity_type=model_class.__name__  # e.g. "Personnel"
            )
            session.add(mention)
            await session.flush()

            # Collect output for the final list
            stored_entities.append({
                "model": model_class.__name__,
                "entity": {
                    unique_field: text_val,
                    "id": entity_record.id
                },
                "mention": {
                    "mention_text": text_val,
                    "start": ent["start"],
                    "end": ent["end"],
                    "confidence": ent["score"],
                    "context": ent["context"],
                    "label": label
                }
            })

        # Commit once at the end
        await session.commit()
        return stored_entities