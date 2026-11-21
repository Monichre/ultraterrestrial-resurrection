#!/usr/bin/env python3
"""
NER Visualization Pipeline for Disclosure RAG
Provides comprehensive visualization of the entity extraction process
"""

import json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import pandas as pd
from typing import Dict, List, Any, Optional
from datetime import datetime
import numpy as np
from pathlib import Path

# Optional imports with fallbacks
try:
    import seaborn as sns
    HAS_SEABORN = True
except ImportError:
    HAS_SEABORN = False

try:
    import networkx as nx
    HAS_NETWORKX = True
except ImportError:
    HAS_NETWORKX = False

try:
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    import plotly.express as px
    HAS_PLOTLY = True
except ImportError:
    HAS_PLOTLY = False


class NERVisualizationPipeline:
    """Comprehensive visualization for NER methodology and results"""
    
    def __init__(self, output_dir: str = "./visualizations"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Set up consistent styling
        plt.style.use('dark_background')
        self.colors = {
            'personnel': '#a78bfa',      # Purple
            'events': '#60a5fa',         # Blue  
            'organizations': '#f87171',   # Red
            'topics': '#34d399',         # Green
            'locations': '#fbbf24',      # Yellow
            'documents': '#fb7185',      # Pink
            'sightings': '#38bdf8',      # Light Blue
            'artifacts': '#f59e0b'       # Orange
        }
    
    def visualize_ner_pipeline(self, document_text: str, extracted_entities: Dict[str, Any]) -> str:
        """
        Create comprehensive visualization of the NER pipeline process
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 1. Entity Distribution Chart
        self._create_entity_distribution(extracted_entities, f"entity_dist_{timestamp}")
        
        # 2. Text Highlighting Visualization  
        self._create_text_highlighting(document_text, extracted_entities, f"text_highlight_{timestamp}")
        
        # 3. Entity Relationship Network
        self._create_entity_network(extracted_entities, f"entity_network_{timestamp}")
        
        # 4. Confidence Score Analysis
        self._create_confidence_analysis(extracted_entities, f"confidence_{timestamp}")
        
        # 5. Interactive Dashboard
        dashboard_path = self._create_interactive_dashboard(
            document_text, extracted_entities, f"dashboard_{timestamp}"
        )
        
        return dashboard_path
    
    def _create_entity_distribution(self, entities: Dict[str, Any], filename: str):
        """Create entity type distribution visualization"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        fig.patch.set_facecolor('black')
        
        # Count entities by type
        entity_counts = {}
        total_confidence = {}
        
        for category, entity_list in entities.items():
            if isinstance(entity_list, list):
                entity_counts[category] = len(entity_list)
                # Calculate average confidence if available
                confidences = []
                for entity in entity_list:
                    if isinstance(entity, dict) and 'confidence' in entity:
                        confidences.append(entity['confidence'])
                total_confidence[category] = np.mean(confidences) if confidences else 0.8
        
        # Bar chart
        categories = list(entity_counts.keys())
        counts = list(entity_counts.values())
        colors = [self.colors.get(cat, '#ffffff') for cat in categories]
        
        bars = ax1.bar(categories, counts, color=colors, alpha=0.8)
        ax1.set_title('Entity Distribution', fontsize=16, color='white')
        ax1.set_ylabel('Count', color='white')
        ax1.tick_params(colors='white')
        
        # Add count labels on bars
        for bar, count in zip(bars, counts):
            ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, 
                    str(count), ha='center', va='bottom', color='white')
        
        # Confidence pie chart
        if total_confidence:
            wedges, texts, autotexts = ax2.pie(
                list(total_confidence.values()), 
                labels=list(total_confidence.keys()),
                colors=[self.colors.get(cat, '#ffffff') for cat in total_confidence.keys()],
                autopct='%1.1f%%',
                startangle=90
            )
            ax2.set_title('Average Confidence by Entity Type', fontsize=16, color='white')
            
            for text in texts:
                text.set_color('white')
            for autotext in autotexts:
                autotext.set_color('black')
        
        plt.tight_layout()
        plt.savefig(self.output_dir / f"{filename}.png", 
                   facecolor='black', edgecolor='none', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_text_highlighting(self, text: str, entities: Dict[str, Any], filename: str):
        """Create text visualization with entity highlighting"""
        fig, ax = plt.subplots(figsize=(16, 10))
        fig.patch.set_facecolor('black')
        
        # Prepare text for highlighting
        highlighted_spans = []
        
        for category, entity_list in entities.items():
            color = self.colors.get(category, '#ffffff')
            if isinstance(entity_list, list):
                for entity in entity_list:
                    if isinstance(entity, dict):
                        entity_text = entity.get('name', entity.get('title', entity.get('text', '')))
                        if entity_text and entity_text in text:
                            # Find all occurrences
                            start = 0
                            while True:
                                pos = text.find(entity_text, start)
                                if pos == -1:
                                    break
                                highlighted_spans.append({
                                    'start': pos,
                                    'end': pos + len(entity_text),
                                    'text': entity_text,
                                    'category': category,
                                    'color': color
                                })
                                start = pos + 1
        
        # Sort spans by start position
        highlighted_spans.sort(key=lambda x: x['start'])
        
        # Create visualization
        ax.text(0.05, 0.95, "Entity Extraction Visualization", 
                transform=ax.transAxes, fontsize=20, color='white', weight='bold')
        
        # Display text with highlighting (simplified for demonstration)
        y_pos = 0.85
        line_height = 0.03
        words_per_line = 12
        
        words = text.split()
        current_line = []
        
        for i, word in enumerate(words):
            current_line.append(word)
            
            if len(current_line) >= words_per_line or i == len(words) - 1:
                line_text = ' '.join(current_line)
                
                # Check if any entities are in this line
                entity_in_line = None
                for span in highlighted_spans:
                    if span['text'] in line_text:
                        entity_in_line = span
                        break
                
                color = entity_in_line['color'] if entity_in_line else 'white'
                ax.text(0.05, y_pos, line_text, transform=ax.transAxes, 
                       fontsize=10, color=color, alpha=0.9)
                
                y_pos -= line_height
                current_line = []
                
                if y_pos < 0.1:  # Stop if we run out of space
                    break
        
        # Legend
        legend_elements = []
        for category, color in self.colors.items():
            if category in entities and entities[category]:
                legend_elements.append(patches.Patch(color=color, label=category.title()))
        
        if legend_elements:
            ax.legend(handles=legend_elements, loc='lower right', 
                     facecolor='black', edgecolor='white', labelcolor='white')
        
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')
        
        plt.savefig(self.output_dir / f"{filename}.png", 
                   facecolor='black', edgecolor='none', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_entity_network(self, entities: Dict[str, Any], filename: str):
        """Create network graph of entity relationships"""
        if not HAS_NETWORKX:
            print("NetworkX not available, skipping network visualization")
            return
            
        G = nx.Graph()
        
        # Add nodes for each entity
        node_colors = []
        node_sizes = []
        
        for category, entity_list in entities.items():
            if isinstance(entity_list, list):
                for entity in entity_list:
                    if isinstance(entity, dict):
                        entity_name = entity.get('name', entity.get('title', entity.get('text', '')))
                        if entity_name:
                            G.add_node(entity_name, category=category)
                            node_colors.append(self.colors.get(category, '#ffffff'))
                            # Size based on confidence or default
                            confidence = entity.get('confidence', 0.8)
                            node_sizes.append(300 + confidence * 500)
        
        # Add edges based on co-occurrence or relationships
        nodes = list(G.nodes())
        for i, node1 in enumerate(nodes):
            for node2 in nodes[i+1:]:
                # Simple heuristic: connect if they appear in same category or similar contexts
                cat1 = G.nodes[node1]['category']
                cat2 = G.nodes[node2]['category']
                
                # Connect personnel to organizations, events, etc.
                if (cat1 == 'personnel' and cat2 in ['organizations', 'events']) or \
                   (cat2 == 'personnel' and cat1 in ['organizations', 'events']) or \
                   (cat1 == 'events' and cat2 == 'locations') or \
                   (cat2 == 'events' and cat1 == 'locations'):
                    G.add_edge(node1, node2)
        
        # Create visualization
        plt.figure(figsize=(14, 10))
        plt.gca().set_facecolor('black')
        
        if G.nodes():
            pos = nx.spring_layout(G, k=2, iterations=50)
            
            nx.draw_networkx_nodes(G, pos, node_color=node_colors, 
                                 node_size=node_sizes, alpha=0.8)
            nx.draw_networkx_edges(G, pos, edge_color='gray', alpha=0.6, width=1)
            nx.draw_networkx_labels(G, pos, font_size=8, font_color='white')
        
        plt.title("Entity Relationship Network", fontsize=16, color='white', pad=20)
        plt.axis('off')
        
        plt.savefig(self.output_dir / f"{filename}.png", 
                   facecolor='black', edgecolor='none', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_confidence_analysis(self, entities: Dict[str, Any], filename: str):
        """Analyze and visualize confidence scores"""
        confidence_data = []
        
        for category, entity_list in entities.items():
            if isinstance(entity_list, list):
                for entity in entity_list:
                    if isinstance(entity, dict):
                        confidence = entity.get('confidence', 0.8)
                        entity_name = entity.get('name', entity.get('title', entity.get('text', 'Unknown')))
                        confidence_data.append({
                            'category': category,
                            'entity': entity_name,
                            'confidence': confidence
                        })
        
        if not confidence_data:
            return
        
        df = pd.DataFrame(confidence_data)
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
        fig.patch.set_facecolor('black')
        
        # Box plot by category
        if HAS_SEABORN:
            sns.boxplot(data=df, x='category', y='confidence', ax=ax1)
        else:
            # Fallback to matplotlib boxplot
            categories = df['category'].unique()
            data_by_cat = [df[df['category'] == cat]['confidence'].values for cat in categories]
            ax1.boxplot(data_by_cat, labels=categories)
        
        ax1.set_title('Confidence Distribution by Entity Type', color='white')
        ax1.set_facecolor('black')
        ax1.tick_params(colors='white')
        ax1.set_xlabel('Entity Category', color='white')
        ax1.set_ylabel('Confidence Score', color='white')
        
        # Histogram of all confidence scores
        ax2.hist(df['confidence'], bins=20, color='#60a5fa', alpha=0.8, edgecolor='white')
        ax2.set_title('Overall Confidence Distribution', color='white')
        ax2.set_facecolor('black')
        ax2.tick_params(colors='white')
        ax2.set_xlabel('Confidence Score', color='white')
        ax2.set_ylabel('Frequency', color='white')
        
        # Average confidence by category
        avg_confidence = df.groupby('category')['confidence'].mean().sort_values(ascending=True)
        colors = [self.colors.get(cat, '#ffffff') for cat in avg_confidence.index]
        
        ax3.barh(avg_confidence.index, avg_confidence.values, color=colors, alpha=0.8)
        ax3.set_title('Average Confidence by Category', color='white')
        ax3.set_facecolor('black')
        ax3.tick_params(colors='white')
        ax3.set_xlabel('Average Confidence', color='white')
        
        # Top entities by confidence
        top_entities = df.nlargest(10, 'confidence')
        ax4.scatter(top_entities['confidence'], range(len(top_entities)), 
                   c=[self.colors.get(cat, '#ffffff') for cat in top_entities['category']], 
                   s=100, alpha=0.8)
        ax4.set_yticks(range(len(top_entities)))
        ax4.set_yticklabels([f"{row['entity'][:20]}..." if len(row['entity']) > 20 
                            else row['entity'] for _, row in top_entities.iterrows()])
        ax4.set_title('Top 10 Entities by Confidence', color='white')
        ax4.set_facecolor('black')
        ax4.tick_params(colors='white')
        ax4.set_xlabel('Confidence Score', color='white')
        
        plt.tight_layout()
        plt.savefig(self.output_dir / f"{filename}.png", 
                   facecolor='black', edgecolor='none', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_interactive_dashboard(self, text: str, entities: Dict[str, Any], filename: str) -> str:
        """Create interactive Plotly dashboard"""
        if not HAS_PLOTLY:
            print("Plotly not available, skipping interactive dashboard")
            return ""
            
        # Prepare data
        entity_data = []
        for category, entity_list in entities.items():
            if isinstance(entity_list, list):
                for entity in entity_list:
                    if isinstance(entity, dict):
                        entity_data.append({
                            'category': category,
                            'name': entity.get('name', entity.get('title', entity.get('text', 'Unknown'))),
                            'confidence': entity.get('confidence', 0.8),
                            'description': entity.get('description', ''),
                            'color': self.colors.get(category, '#ffffff')
                        })
        
        if not entity_data:
            return ""
        
        df = pd.DataFrame(entity_data)
        
        # Create subplots
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Entity Distribution', 'Confidence Scatter', 
                          'Category Breakdown', 'Text Statistics'),
            specs=[[{"type": "bar"}, {"type": "scatter"}],
                   [{"type": "pie"}, {"type": "indicator"}]]
        )
        
        # 1. Entity count by category
        entity_counts = df['category'].value_counts()
        fig.add_trace(
            go.Bar(x=entity_counts.index, y=entity_counts.values,
                   marker_color=[self.colors.get(cat, '#ffffff') for cat in entity_counts.index],
                   name="Entity Counts"),
            row=1, col=1
        )
        
        # 2. Confidence scatter plot
        fig.add_trace(
            go.Scatter(x=df['confidence'], y=df['name'],
                      mode='markers',
                      marker=dict(color=[self.colors.get(cat, '#ffffff') for cat in df['category']],
                                size=10),
                      text=df['category'],
                      name="Entities"),
            row=1, col=2
        )
        
        # 3. Category pie chart
        fig.add_trace(
            go.Pie(labels=entity_counts.index, values=entity_counts.values,
                   marker=dict(colors=[self.colors.get(cat, '#ffffff') for cat in entity_counts.index]),
                   name="Categories"),
            row=2, col=1
        )
        
        # 4. Statistics
        total_entities = len(df)
        avg_confidence = df['confidence'].mean()
        
        fig.add_trace(
            go.Indicator(
                mode="gauge+number+delta",
                value=avg_confidence,
                domain={'x': [0, 1], 'y': [0, 1]},
                title={'text': f"Avg Confidence<br>({total_entities} entities)"},
                gauge={'axis': {'range': [None, 1]},
                       'bar': {'color': "#60a5fa"},
                       'steps': [{'range': [0, 0.5], 'color': "lightgray"},
                                {'range': [0.5, 1], 'color': "gray"}],
                       'threshold': {'line': {'color': "red", 'width': 4},
                                   'thickness': 0.75, 'value': 0.9}}),
            row=2, col=2
        )
        
        # Update layout
        fig.update_layout(
            title="NER Analysis Dashboard",
            template="plotly_dark",
            height=800,
            showlegend=False
        )
        
        # Save as HTML
        dashboard_path = self.output_dir / f"{filename}.html"
        fig.write_html(str(dashboard_path))
        
        return str(dashboard_path)
    
    def create_processing_flow_diagram(self) -> str:
        """Create a visual diagram of the NER processing flow"""
        fig, ax = plt.subplots(figsize=(16, 10))
        fig.patch.set_facecolor('black')
        ax.set_facecolor('black')
        
        # Define process steps
        steps = [
            {"name": "Document Input", "pos": (1, 8), "color": "#60a5fa"},
            {"name": "Content Analysis\n(Anthropic Claude)", "pos": (3, 8), "color": "#34d399"},
            {"name": "NER Prompt\nApplication", "pos": (5, 8), "color": "#a78bfa"},
            {"name": "Structured Entity\nExtraction", "pos": (7, 8), "color": "#f59e0b"},
            {"name": "Xata Database\nStorage", "pos": (9, 8), "color": "#f87171"},
            {"name": "Vector Store\nIndexing", "pos": (11, 8), "color": "#fb7185"},
            {"name": "Visualization\nGeneration", "pos": (9, 6), "color": "#38bdf8"},
            {"name": "Interactive\nDashboard", "pos": (7, 6), "color": "#fbbf24"},
            {"name": "Network Graph\nAnalysis", "pos": (5, 6), "color": "#34d399"},
            {"name": "Confidence\nScoring", "pos": (3, 6), "color": "#a78bfa"}
        ]
        
        # Draw boxes and text
        for step in steps:
            rect = patches.FancyBboxPatch(
                (step["pos"][0]-0.4, step["pos"][1]-0.3),
                0.8, 0.6,
                boxstyle="round,pad=0.1",
                facecolor=step["color"],
                alpha=0.8,
                edgecolor='white'
            )
            ax.add_patch(rect)
            ax.text(step["pos"][0], step["pos"][1], step["name"], 
                   ha='center', va='center', fontsize=10, weight='bold', color='black')
        
        # Draw arrows
        arrows = [
            ((1.4, 8), (2.6, 8)),    # Input -> Analysis
            ((3.4, 8), (4.6, 8)),    # Analysis -> NER
            ((5.4, 8), (6.6, 8)),    # NER -> Extraction
            ((7.4, 8), (8.6, 8)),    # Extraction -> Database
            ((9.4, 8), (10.6, 8)),   # Database -> Vector Store
            ((9, 7.7), (9, 6.3)),    # Database -> Visualization
            ((8.6, 6), (7.4, 6)),    # Visualization -> Dashboard
            ((6.6, 6), (5.4, 6)),    # Dashboard -> Network
            ((4.6, 6), (3.4, 6)),    # Network -> Confidence
        ]
        
        for start, end in arrows:
            ax.annotate('', xy=end, xytext=start,
                       arrowprops=dict(arrowstyle='->', color='white', lw=2))
        
        ax.set_xlim(0, 12)
        ax.set_ylim(5, 9)
        ax.set_title('Disclosure RAG NER Processing Pipeline', 
                    fontsize=20, color='white', pad=20, weight='bold')
        ax.axis('off')
        
        flow_path = self.output_dir / "ner_processing_flow.png"
        plt.savefig(flow_path, facecolor='black', edgecolor='none', 
                   dpi=300, bbox_inches='tight')
        plt.close()
        
        return str(flow_path)


def create_sample_visualization():
    """Create a sample visualization with mock data"""
    visualizer = NERVisualizationPipeline()
    
    # Mock extracted entities
    sample_entities = {
        "personnel": [
            {"name": "Luis Elizondo", "confidence": 0.95, "description": "Former AATIP Director"},
            {"name": "David Spergel", "confidence": 0.92, "description": "NASA UAP Chief"}
        ],
        "organizations": [
            {"name": "Department of Defense", "confidence": 0.88},
            {"name": "NASA", "confidence": 0.90}
        ],
        "events": [
            {"name": "Navy Helicopter Incident", "confidence": 0.85, "location": "Caribbean"}
        ],
        "topics": [
            {"name": "Underwater UAP Activity", "confidence": 0.93},
            {"name": "UAP Technology Capabilities", "confidence": 0.87}
        ]
    }
    
    sample_text = """
    Pentagon Official Confirms Alien Language Exists - Lue Elizondo discusses 
    underwater UAP activity with large black disc-shaped craft observed moving 
    450-550 knots underwater. David Spergel from NASA provides insights on the 
    Department of Defense investigation. The Navy Helicopter Incident in the 
    Caribbean demonstrates UAP Technology Capabilities.
    """
    
    dashboard_path = visualizer.visualize_ner_pipeline(sample_text, sample_entities)
    flow_path = visualizer.create_processing_flow_diagram()
    
    print(f"Visualizations created:")
    print(f"- Dashboard: {dashboard_path}")
    print(f"- Flow diagram: {flow_path}")
    print(f"- Additional charts in: {visualizer.output_dir}")


if __name__ == "__main__":
    create_sample_visualization()