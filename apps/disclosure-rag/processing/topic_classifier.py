
from typing import List, Dict, Any
from transformers import pipeline
from src.storage.models import Topic, TopicAssignment
import numpy as np

class TopicClassifier:
    def __init__(self):
        self.classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )
        self.base_topics = [
            "UFO Sightings",
            "Government Reports",
            "Scientific Analysis",
            "Witness Accounts",
            "Historical Cases",
            "Technology",
            "Research Methodology",
            "Media Coverage",
            "International Incidents",
            "Military Encounters"
        ]
    
    async def process_content(self, text: str, session) -> List[Dict[str, float]]:
        """
        Classify text content into relevant topics
        """
        # Perform zero-shot classification
        result = self.classifier(
            text,
            self.base_topics,
            multi_label=True
        )
        
        # Process and store classifications
        classifications = []
        for label, score in zip(result['labels'], result['scores']):
            if score > 0.3:  # Confidence threshold
                topic = await self._get_or_create_topic(label, session)
                classifications.append({
                    'topic': topic,
                    'confidence': float(score)
                })
        
        return classifications
    
    async def _get_or_create_topic(self, topic_name: str, session) -> Topic:
        """
        Get existing topic or create new one
        """
        topic = await session.query(Topic).filter(
            Topic.name == topic_name
        ).first()
        
        if not topic:
            topic = Topic(
                name=topic_name,
                description=f"Auto-generated topic: {topic_name}"
            )
            session.add(topic)
            await session.commit()
        
        return topic
