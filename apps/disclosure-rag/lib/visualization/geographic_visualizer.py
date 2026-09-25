#!/usr/bin/env python3
"""
Geographic UFO Analysis Visualizer
Integrates with existing NER pipeline and Streamlit dashboard
"""

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
import asyncio
import asyncpg
from typing import Dict, List, Any, Optional, Tuple
import json
from datetime import datetime

class GeographicUFOVisualizer:
    """
    Geographic analysis and visualization for UFO data
    Integrates seamlessly with existing RAG pipeline
    """
    
    def __init__(self, db_connection_string: str = None):
        self.db_connection = db_connection_string or 'postgresql://liamellis@localhost:5432/ultraterrestrial'
        
    async def get_ufo_hotspots_data(self) -> pd.DataFrame:
        """Get UFO geographic hotspots data"""
        conn = await asyncpg.connect(self.db_connection)
        
        try:
            query = """
            SELECT 
                state, country, total_sightings, cities_affected,
                center_lat, center_lon, first_sighting, latest_sighting,
                most_common_shape, sightings_per_year
            FROM uap_geographic_hotspots
            ORDER BY total_sightings DESC
            LIMIT 50
            """
            
            results = await conn.fetch(query)
            df = pd.DataFrame([dict(r) for r in results])
            return df
            
        finally:
            await conn.close()
    
    async def get_military_proximity_data(self) -> pd.DataFrame:
        """Get UFO-military proximity analysis data"""
        conn = await asyncpg.connect(self.db_connection)
        
        try:
            query = """
            SELECT 
                site_name, component, state_terr,
                base_lat, base_lon, nearby_sightings,
                avg_distance_km, closest_sighting_km,
                first_sighting, latest_sighting
            FROM ufo_military_proximity
            ORDER BY nearby_sightings DESC
            LIMIT 100
            """
            
            results = await conn.fetch(query)
            df = pd.DataFrame([dict(r) for r in results])
            return df
            
        finally:
            await conn.close()
    
    async def get_temporal_patterns_data(self) -> pd.DataFrame:
        """Get temporal patterns data"""
        conn = await asyncpg.connect(self.db_connection)
        
        try:
            query = """
            SELECT year, month, hour, state, sightings, avg_lat, avg_lon
            FROM uap_temporal_patterns
            WHERE year >= 2000
            ORDER BY year DESC, sightings DESC
            LIMIT 1000
            """
            
            results = await conn.fetch(query)
            df = pd.DataFrame([dict(r) for r in results])
            return df
            
        finally:
            await conn.close()
    
    def create_ufo_hotspots_map(self, df: pd.DataFrame) -> go.Figure:
        """Create interactive UFO hotspots map"""
        
        # Create map with UFO hotspots
        fig = go.Figure()
        
        # Add UFO hotspots as scatter points
        fig.add_trace(go.Scattermapbox(
            lat=df['center_lat'],
            lon=df['center_lon'],
            mode='markers',
            marker=dict(
                size=np.sqrt(df['total_sightings']) / 3,  # Scale marker size
                color=df['sightings_per_year'],
                colorscale='plasma',
                colorbar=dict(title="Sightings/Year"),
                sizemin=8,
                sizemax=50,
                opacity=0.8
            ),
            text=df.apply(lambda row: 
                f"<b>{row['state']}</b><br>"
                f"Total Sightings: {row['total_sightings']:,}<br>"
                f"Cities Affected: {row['cities_affected']}<br>"
                f"Most Common Shape: {row['most_common_shape']}<br>"
                f"Rate: {row['sightings_per_year']:.1f}/year<br>"
                f"Period: {row['first_sighting'][:4]} - {row['latest_sighting'][:4]}", 
                axis=1
            ),
            hovertemplate='%{text}<extra></extra>',
            name='UFO Hotspots'
        ))
        
        fig.update_layout(
            mapbox=dict(
                style="dark",
                center=dict(lat=39.5, lon=-98.35),  # Center on USA
                zoom=3.5
            ),
            title=dict(
                text="🛸 UFO Sightings Geographic Hotspots",
                x=0.5,
                font=dict(size=20, color='white')
            ),
            paper_bgcolor='rgba(0,0,0,0.9)',
            plot_bgcolor='rgba(0,0,0,0.9)',
            font=dict(color='white'),
            height=600
        )
        
        return fig
    
    def create_military_proximity_map(self, hotspots_df: pd.DataFrame, military_df: pd.DataFrame) -> go.Figure:
        """Create map showing UFO hotspots + military installations"""
        
        fig = go.Figure()
        
        # Add UFO hotspots
        fig.add_trace(go.Scattermapbox(
            lat=hotspots_df['center_lat'],
            lon=hotspots_df['center_lon'],
            mode='markers',
            marker=dict(
                size=np.sqrt(hotspots_df['total_sightings']) / 4,
                color='cyan',
                opacity=0.6,
                symbol='circle'
            ),
            text=hotspots_df.apply(lambda row: 
                f"<b>UFO Hotspot: {row['state']}</b><br>"
                f"Sightings: {row['total_sightings']:,}", 
                axis=1
            ),
            hovertemplate='%{text}<extra></extra>',
            name='UFO Hotspots'
        ))
        
        # Add military installations
        fig.add_trace(go.Scattermapbox(
            lat=military_df['base_lat'],
            lon=military_df['base_lon'],
            mode='markers',
            marker=dict(
                size=np.sqrt(military_df['nearby_sightings']) / 5,
                color='red',
                opacity=0.8,
                symbol='star',
                sizemin=8,
                sizemax=30
            ),
            text=military_df.apply(lambda row: 
                f"<b>{row['site_name']}</b><br>"
                f"Branch: {row['component']}<br>"
                f"Nearby UFO Sightings: {row['nearby_sightings']:,}<br>"
                f"Closest Encounter: {row['closest_sighting_km']:.1f}km<br>"
                f"Period: {str(row['first_sighting'])[:10]} to {str(row['latest_sighting'])[:10]}", 
                axis=1
            ),
            hovertemplate='%{text}<extra></extra>',
            name='Military Installations'
        ))
        
        fig.update_layout(
            mapbox=dict(
                style="dark",
                center=dict(lat=39.5, lon=-98.35),
                zoom=3.5
            ),
            title=dict(
                text="🛸 UFO Hotspots vs 🏛️ Military Installations",
                x=0.5,
                font=dict(size=20, color='white')
            ),
            paper_bgcolor='rgba(0,0,0,0.9)',
            plot_bgcolor='rgba(0,0,0,0.9)',
            font=dict(color='white'),
            height=600,
            legend=dict(
                bgcolor='rgba(0,0,0,0.5)',
                bordercolor='white',
                borderwidth=1
            )
        )
        
        return fig
    
    def create_temporal_heatmap(self, df: pd.DataFrame) -> go.Figure:
        """Create temporal patterns heatmap"""
        
        # Aggregate by hour and month
        hourly_monthly = df.groupby(['month', 'hour'])['sightings'].sum().reset_index()
        
        # Create pivot table for heatmap
        heatmap_data = hourly_monthly.pivot(index='month', columns='hour', values='sightings').fillna(0)
        
        # Month names
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        fig = go.Figure(data=go.Heatmap(
            z=heatmap_data.values,
            x=[f"{h}:00" for h in range(24)],
            y=month_names,
            colorscale='plasma',
            colorbar=dict(title="Total Sightings"),
            hoverongaps=False,
            hovertemplate='Month: %{y}<br>Hour: %{x}<br>Sightings: %{z}<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text="🕐 UFO Sightings: Temporal Activity Patterns",
                x=0.5,
                font=dict(size=18, color='white')
            ),
            xaxis_title="Hour of Day",
            yaxis_title="Month",
            paper_bgcolor='rgba(0,0,0,0.9)',
            plot_bgcolor='rgba(0,0,0,0.9)',
            font=dict(color='white'),
            height=400
        )
        
        return fig
    
    def create_proximity_analysis_chart(self, military_df: pd.DataFrame) -> go.Figure:
        """Create military branch proximity analysis"""
        
        # Aggregate by military branch
        branch_analysis = []
        for _, row in military_df.iterrows():
            component = row['component']
            if 'Navy' in component or 'navy' in component.lower():
                branch = 'Navy'
            elif 'AF' in component or 'Air Force' in component:
                branch = 'Air Force'  
            elif 'Army' in component or 'army' in component.lower():
                branch = 'Army'
            elif 'MC' in component or 'Marine' in component:
                branch = 'Marines'
            else:
                branch = 'Other'
            
            branch_analysis.append({
                'branch': branch,
                'sightings': row['nearby_sightings'],
                'closest_km': row['closest_sighting_km']
            })
        
        branch_df = pd.DataFrame(branch_analysis)
        summary = branch_df.groupby('branch').agg({
            'sightings': ['sum', 'mean', 'count'],
            'closest_km': 'min'
        }).round(1)
        
        summary.columns = ['total_sightings', 'avg_sightings', 'bases', 'closest_encounter']
        summary = summary.reset_index()
        
        # Create subplot
        fig = make_subplots(
            rows=1, cols=2,
            subplot_titles=['Total UFO Activity by Branch', 'Closest Encounters by Branch'],
            specs=[[{"type": "bar"}, {"type": "bar"}]]
        )
        
        # Total sightings bar chart
        fig.add_trace(
            go.Bar(
                x=summary['branch'],
                y=summary['total_sightings'],
                name='Total Sightings',
                marker_color='cyan',
                text=summary['total_sightings'],
                textposition='outside'
            ),
            row=1, col=1
        )
        
        # Closest encounters bar chart
        fig.add_trace(
            go.Bar(
                x=summary['branch'],
                y=summary['closest_encounter'],
                name='Closest Encounter (km)',
                marker_color='red',
                text=summary['closest_encounter'],
                textposition='outside'
            ),
            row=1, col=2
        )
        
        fig.update_layout(
            title=dict(
                text="🏛️ Military Branch UFO Activity Analysis",
                x=0.5,
                font=dict(size=18, color='white')
            ),
            paper_bgcolor='rgba(0,0,0,0.9)',
            plot_bgcolor='rgba(0,0,0,0.9)',
            font=dict(color='white'),
            height=500,
            showlegend=False
        )
        
        fig.update_xaxes(title_text="Military Branch", row=1, col=1)
        fig.update_yaxes(title_text="Total Sightings", row=1, col=1)
        fig.update_xaxes(title_text="Military Branch", row=1, col=2)
        fig.update_yaxes(title_text="Distance (km)", row=1, col=2)
        
        return fig

# Async wrapper functions for Streamlit
def get_ufo_hotspots_sync():
    """Synchronous wrapper for Streamlit"""
    visualizer = GeographicUFOVisualizer()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(visualizer.get_ufo_hotspots_data())
    finally:
        loop.close()

def get_military_proximity_sync():
    """Synchronous wrapper for Streamlit"""
    visualizer = GeographicUFOVisualizer()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(visualizer.get_military_proximity_data())
    finally:
        loop.close()

def get_temporal_patterns_sync():
    """Synchronous wrapper for Streamlit"""
    visualizer = GeographicUFOVisualizer()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(visualizer.get_temporal_patterns_data())
    finally:
        loop.close()