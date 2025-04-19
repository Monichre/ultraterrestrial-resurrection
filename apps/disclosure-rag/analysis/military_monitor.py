
from typing import List, Dict, Any
from datetime import datetime, timedelta
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from src.storage.db import DatabaseHandler
from sqlalchemy import text

class MilitaryBaseMonitor:
    def __init__(self):
        self.db = DatabaseHandler()
        self.search_terms = {
            'locations': [
                'military base', 'Air Force base', 'naval base', 'New Jersey',
                'RAF', 'US military', 'UK military', 'Pentagon'
            ],
            'events': [
                'UFO', 'UAP', 'sighting', 'aerial phenomenon', 'unidentified craft',
                'strange lights', 'mysterious object'
            ],
            'specific_bases': [
                'Wright-Patterson', 'Nellis', 'Edwards AFB', 'RAF Lakenheath',
                'RAF Woodbridge', 'Joint Base MDL', 'McGuire AFB', 'Fort Dix'
            ]
        }
    
    async def get_recent_sightings(self) -> List[Dict[str, Any]]:
        """
        Get recent sightings related to military bases and New Jersey
        """
        search_terms = (
            self.search_terms['locations'] +
            self.search_terms['events'] +
            self.search_terms['specific_bases']
        )
        
        query = """
        SELECT 
            rc.id,
            rc.title,
            rc.content,
            rc.content_type,
            rc.source_url,
            rc.created_at,
            rc.metadata,
            array_agg(DISTINCT e.name) as entities,
            array_agg(DISTINCT t.name) as topics
        FROM raw_content rc
        LEFT JOIN entity_mentions em ON rc.id = em.raw_content_id
        LEFT JOIN entities e ON em.entity_id = e.id
        LEFT JOIN topic_assignments ta ON rc.id = ta.raw_content_id
        LEFT JOIN topics t ON ta.topic_id = t.id
        WHERE rc.created_at >= NOW() - INTERVAL '7 days'
        AND (
            {search_conditions}
        )
        GROUP BY rc.id, rc.title, rc.content, rc.content_type, 
                 rc.source_url, rc.created_at, rc.metadata
        ORDER BY rc.created_at DESC
        """
        
        search_conditions = ' OR '.join([
            f"rc.content ILIKE '%{term}%'" for term in search_terms
        ])
        
        query = query.format(search_conditions=search_conditions)
        
        async with self.db.get_session() as session:
            result = await session.execute(text(query))
            return result.mappings().all()
    
    def create_timeline_visualization(self, sightings: List[Dict]) -> go.Figure:
        """
        Create an interactive timeline of sightings
        """
        df = pd.DataFrame(sightings)
        
        # Create timeline
        fig = px.timeline(
            df,
            x_start='created_at',
            y='content_type',
            color='content_type',
            hover_data=['title', 'entities', 'topics'],
            title='Recent UFO/UAP Sightings Timeline'
        )
        
        # Customize layout
        fig.update_layout(
            height=600,
            showlegend=True,
            hovermode='closest',
            xaxis_title='Date',
            yaxis_title='Source Type'
        )
        
        return fig
    
    def create_location_heatmap(self, sightings: List[Dict]) -> go.Figure:
        """
        Create a heatmap of sighting locations
        """
        locations = []
        for sighting in sightings:
            for entity in sighting['entities']:
                if any(base in entity for base in self.search_terms['specific_bases']):
                    locations.append({
                        'location': entity,
                        'count': 1,
                        'date': sighting['created_at']
                    })
        
        if locations:
            df = pd.DataFrame(locations)
            fig = px.density_heatmap(
                df,
                x='date',
                y='location',
                title='Sighting Density by Location'
            )
            return fig
        return None

    def generate_summary_report(self, sightings: List[Dict]) -> str:
        """
        Generate a markdown summary report of recent sightings
        """
        report_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        summary = [
            "# Recent UFO/UAP Sighting Report",
            f"Report generated on {report_date}\n"
        ]
        
        # Group by location
        location_sightings = {}
        for sighting in sightings:
            for entity in sighting['entities']:
                if any(loc in entity for loc in self.search_terms['locations']):
                    if entity not in location_sightings:
                        location_sightings[entity] = []
                    location_sightings[entity].append(sighting)
        
        # Generate location-based summaries
        for location, loc_sightings in location_sightings.items():
            summary.append(f"## {location}\n")
            for sighting in loc_sightings:
                summary.append(f"### {sighting['title']}")
                summary.append(f"- Date: {sighting['created_at'].strftime('%Y-%m-%d %H:%M:%S')}")
                summary.append(f"- Source: {sighting['content_type']}")
                summary.append(f"- Topics: {', '.join(sighting['topics'])}")
                summary.append(f"- [Source Link]({sighting['source_url']})\n")
                
                # Add excerpt
                excerpt = sighting['content'][:200] + "..."
                summary.append(f"{excerpt}\n")
        
        return "\n".join(summary)
