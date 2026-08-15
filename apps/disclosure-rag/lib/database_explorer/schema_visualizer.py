#!/usr/bin/env python3
"""
Database Schema Visualizer
Creates visual representations of database schemas, table relationships, and data structures
Date: July 13, 2025
"""

import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import json

# Visualization libraries
try:
    import plotly.graph_objects as go
    import plotly.express as px
    from plotly.subplots import make_subplots
    import networkx as nx
    PLOTLY_AVAILABLE = True
    NETWORKX_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False
    NETWORKX_AVAILABLE = False
    go = None
    px = None
    make_subplots = None
    nx = None

# Streamlit for UI components
try:
    import streamlit as st
    STREAMLIT_AVAILABLE = True
except ImportError:
    STREAMLIT_AVAILABLE = False
    st = None

from .schema_analyzer import DatabaseMetadata, SchemaInfo, TableInfo, ColumnInfo

logger = logging.getLogger(__name__)

@dataclass
class SchemaVisualizationConfig:
    """Configuration for schema visualization"""
    show_column_types: bool = True
    show_relationships: bool = True
    show_indexes: bool = False
    show_constraints: bool = False
    color_by_type: bool = True
    layout_algorithm: str = "spring"  # spring, circular, hierarchical
    node_size_by: str = "table_size"  # table_size, column_count, static
    max_tables_in_view: int = 50
    theme: str = "plotly_dark"

class DatabaseSchemaVisualizer:
    """Creates interactive visualizations of database schemas"""
    
    def __init__(self):
        self.color_scheme = {
            "table": "#3498db",
            "view": "#e74c3c", 
            "materialized_view": "#f39c12",
            "foreign_key": "#95a5a6",
            "primary_key": "#f1c40f",
            "index": "#9b59b6",
            "constraint": "#e67e22"
        }
        
        self.ufo_theme_colors = [
            "#60a5fa", "#34d399", "#fbbf24", "#f87171", 
            "#a78bfa", "#fb7185", "#22d3ee", "#4ade80"
        ]
    
    def create_schema_overview_visualization(self, metadata: DatabaseMetadata, 
                                          config: SchemaVisualizationConfig) -> Optional[Dict[str, Any]]:
        """Create comprehensive schema overview visualization"""
        if not PLOTLY_AVAILABLE or not metadata.schemas:
            return None
        
        try:
            # Create subplot layout
            fig = make_subplots(
                rows=2, cols=2,
                subplot_titles=[
                    "Tables by Schema", 
                    "Column Distribution",
                    "Table Sizes", 
                    "Data Types Distribution"
                ],
                specs=[
                    [{"type": "bar"}, {"type": "pie"}],
                    [{"type": "treemap"}, {"type": "bar"}]
                ]
            )
            
            # 1. Tables by Schema (Bar Chart)
            schema_names = []
            table_counts = []
            view_counts = []
            
            for schema in metadata.schemas:
                schema_names.append(schema.name)
                table_counts.append(len(schema.tables))
                view_counts.append(len(schema.views))
            
            fig.add_trace(
                go.Bar(name="Tables", x=schema_names, y=table_counts, 
                      marker_color=self.ufo_theme_colors[0]),
                row=1, col=1
            )
            fig.add_trace(
                go.Bar(name="Views", x=schema_names, y=view_counts,
                      marker_color=self.ufo_theme_colors[1]),
                row=1, col=1
            )
            
            # 2. Column Distribution (Pie Chart)
            total_columns = sum(
                len(table.columns) for schema in metadata.schemas 
                for table in schema.tables
            )
            total_views_columns = sum(
                len(view.columns) for schema in metadata.schemas 
                for view in schema.views
            )
            
            fig.add_trace(
                go.Pie(
                    labels=["Table Columns", "View Columns"],
                    values=[total_columns, total_views_columns],
                    marker_colors=self.ufo_theme_colors[:2]
                ),
                row=1, col=2
            )
            
            # 3. Table Sizes (Treemap)
            treemap_data = self._prepare_size_treemap_data(metadata)
            if treemap_data:
                fig.add_trace(
                    go.Treemap(
                        labels=treemap_data["labels"],
                        parents=treemap_data["parents"],
                        values=treemap_data["values"],
                        textinfo="label+value+percent root",
                        marker_colorscale="Viridis"
                    ),
                    row=2, col=1
                )
            
            # 4. Data Types Distribution (Bar Chart)
            type_distribution = self._analyze_data_types(metadata)
            if type_distribution:
                types = list(type_distribution.keys())
                counts = list(type_distribution.values())
                
                fig.add_trace(
                    go.Bar(
                        x=types, y=counts,
                        marker_color=self.ufo_theme_colors[2],
                        name="Data Types"
                    ),
                    row=2, col=2
                )
            
            # Update layout
            fig.update_layout(
                title=f"Database Schema Overview: {metadata.database_name}",
                template=config.theme,
                height=800,
                showlegend=True
            )
            
            return {
                "fig": fig,
                "type": "schema_overview",
                "title": f"Schema Overview: {metadata.database_name}",
                "tables_count": metadata.total_tables,
                "views_count": metadata.total_views
            }
            
        except Exception as e:
            logger.error(f"Schema overview visualization failed: {e}")
            return None
    
    def create_relationship_diagram(self, metadata: DatabaseMetadata, 
                                  relationships: Dict[str, List[Dict[str, Any]]],
                                  config: SchemaVisualizationConfig) -> Optional[Dict[str, Any]]:
        """Create interactive relationship diagram using network graph"""
        if not PLOTLY_AVAILABLE or not NETWORKX_AVAILABLE:
            return None
        
        try:
            # Create network graph
            G = nx.DiGraph()
            
            # Add nodes (tables)
            for schema in metadata.schemas:
                for table in schema.tables:
                    node_id = f"{schema.name}.{table.name}"
                    G.add_node(
                        node_id,
                        schema=schema.name,
                        table_name=table.name,
                        table_type=table.table_type,
                        column_count=len(table.columns),
                        size=table.size_bytes or 100
                    )
            
            # Add edges (relationships)
            for table_key, relations in relationships.items():
                for relation in relations:
                    target = relation['references_table']
                    if G.has_node(table_key) and G.has_node(target):
                        G.add_edge(
                            table_key, target,
                            constraint=relation['constraint_name'],
                            column=relation['column']
                        )
            
            # Calculate layout
            if config.layout_algorithm == "spring":
                pos = nx.spring_layout(G, k=3, iterations=50)
            elif config.layout_algorithm == "circular":
                pos = nx.circular_layout(G)
            else:  # hierarchical
                pos = nx.spring_layout(G, k=2)
            
            # Create traces for plotly
            # Edges
            edge_x = []
            edge_y = []
            edge_info = []
            
            for edge in G.edges():
                x0, y0 = pos[edge[0]]
                x1, y1 = pos[edge[1]]
                edge_x.extend([x0, x1, None])
                edge_y.extend([y0, y1, None])
                edge_info.append(f"{edge[0]} → {edge[1]}")
            
            edge_trace = go.Scatter(
                x=edge_x, y=edge_y,
                line=dict(width=2, color=self.color_scheme["foreign_key"]),
                hoverinfo='none',
                mode='lines',
                name='Relationships'
            )
            
            # Nodes
            node_x = []
            node_y = []
            node_text = []
            node_colors = []
            node_sizes = []
            node_hover = []
            
            for node in G.nodes():
                x, y = pos[node]
                node_x.append(x)
                node_y.append(y)
                
                node_data = G.nodes[node]
                node_text.append(node_data['table_name'])
                
                # Color by table type
                if config.color_by_type:
                    if node_data['table_type'] == 'VIEW':
                        node_colors.append(self.color_scheme["view"])
                    else:
                        node_colors.append(self.color_scheme["table"])
                else:
                    node_colors.append(self.color_scheme["table"])
                
                # Size by configuration
                if config.node_size_by == "column_count":
                    size = max(10, min(50, node_data['column_count'] * 2))
                elif config.node_size_by == "table_size":
                    size = max(10, min(50, (node_data['size'] or 100) / 1000))
                else:
                    size = 20
                
                node_sizes.append(size)
                
                # Hover text
                hover_text = f"""
                <b>{node}</b><br>
                Type: {node_data['table_type']}<br>
                Columns: {node_data['column_count']}<br>
                Size: {node_data['size'] or 'Unknown'} bytes
                """
                node_hover.append(hover_text)
            
            node_trace = go.Scatter(
                x=node_x, y=node_y,
                mode='markers+text',
                hovertemplate='%{text}<extra></extra>',
                text=node_hover,
                textposition="middle center",
                marker=dict(
                    size=node_sizes,
                    color=node_colors,
                    line=dict(width=2, color="white")
                ),
                name='Tables'
            )
            
            # Create figure
            fig = go.Figure(
                data=[edge_trace, node_trace],
                layout=go.Layout(
                    title=f"Database Relationship Diagram: {metadata.database_name}",
                    titlefont_size=16,
                    showlegend=True,
                    hovermode='closest',
                    margin=dict(b=20,l=5,r=5,t=40),
                    annotations=[ dict(
                        text=f"Relationships: {len(G.edges())} | Tables: {len(G.nodes())}",
                        showarrow=False,
                        xref="paper", yref="paper",
                        x=0.005, y=-0.002,
                        xanchor='left', yanchor='bottom',
                        font=dict(color=self.color_scheme["foreign_key"], size=12)
                    )],
                    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                    template=config.theme,
                    height=600
                )
            )
            
            return {
                "fig": fig,
                "type": "relationship_diagram",
                "title": f"Relationships: {metadata.database_name}",
                "nodes_count": len(G.nodes()),
                "edges_count": len(G.edges())
            }
            
        except Exception as e:
            logger.error(f"Relationship diagram creation failed: {e}")
            return None
    
    def create_table_detail_view(self, table_info: TableInfo, 
                               config: SchemaVisualizationConfig) -> Optional[Dict[str, Any]]:
        """Create detailed view of a single table structure"""
        if not PLOTLY_AVAILABLE:
            return None
        
        try:
            # Create table structure visualization
            fig = make_subplots(
                rows=2, cols=2,
                subplot_titles=[
                    "Column Types", 
                    "Key Information",
                    "Nullable vs Non-Nullable", 
                    "Data Type Sizes"
                ],
                specs=[
                    [{"type": "bar"}, {"type": "pie"}],
                    [{"type": "pie"}, {"type": "bar"}]
                ]
            )
            
            # Analyze column data
            column_types = {}
            key_info = {"Primary Keys": 0, "Foreign Keys": 0, "Regular Columns": 0}
            nullable_info = {"Nullable": 0, "Not Nullable": 0}
            type_sizes = {}
            
            for col in table_info.columns:
                # Column types
                data_type = col.data_type
                column_types[data_type] = column_types.get(data_type, 0) + 1
                
                # Key information
                if col.is_primary_key:
                    key_info["Primary Keys"] += 1
                elif col.is_foreign_key:
                    key_info["Foreign Keys"] += 1
                else:
                    key_info["Regular Columns"] += 1
                
                # Nullable information
                if col.is_nullable:
                    nullable_info["Nullable"] += 1
                else:
                    nullable_info["Not Nullable"] += 1
                
                # Type sizes (if available)
                if col.max_length:
                    type_sizes[f"{data_type}({col.max_length})"] = type_sizes.get(f"{data_type}({col.max_length})", 0) + 1
            
            # 1. Column Types (Bar Chart)
            types = list(column_types.keys())
            counts = list(column_types.values())
            
            fig.add_trace(
                go.Bar(x=types, y=counts, marker_color=self.ufo_theme_colors[0]),
                row=1, col=1
            )
            
            # 2. Key Information (Pie Chart)
            key_labels = [k for k, v in key_info.items() if v > 0]
            key_values = [v for v in key_info.values() if v > 0]
            
            if key_values:
                fig.add_trace(
                    go.Pie(labels=key_labels, values=key_values, 
                          marker_colors=self.ufo_theme_colors[1:4]),
                    row=1, col=2
                )
            
            # 3. Nullable Information (Pie Chart)
            nullable_labels = list(nullable_info.keys())
            nullable_values = list(nullable_info.values())
            
            fig.add_trace(
                go.Pie(labels=nullable_labels, values=nullable_values,
                      marker_colors=[self.ufo_theme_colors[4], self.ufo_theme_colors[5]]),
                row=2, col=1
            )
            
            # 4. Type Sizes (Bar Chart if available)
            if type_sizes:
                size_types = list(type_sizes.keys())
                size_counts = list(type_sizes.values())
                
                fig.add_trace(
                    go.Bar(x=size_types, y=size_counts, 
                          marker_color=self.ufo_theme_colors[6]),
                    row=2, col=2
                )
            
            # Update layout
            fig.update_layout(
                title=f"Table Structure Analysis: {table_info.schema}.{table_info.name}",
                template=config.theme,
                height=600,
                showlegend=False
            )
            
            return {
                "fig": fig,
                "type": "table_detail",
                "title": f"Table: {table_info.schema}.{table_info.name}",
                "columns_count": len(table_info.columns),
                "table_type": table_info.table_type
            }
            
        except Exception as e:
            logger.error(f"Table detail view creation failed: {e}")
            return None
    
    def _prepare_size_treemap_data(self, metadata: DatabaseMetadata) -> Optional[Dict[str, List]]:
        """Prepare data for treemap visualization of table sizes"""
        labels = []
        parents = []
        values = []
        
        # Add database root
        labels.append(metadata.database_name)
        parents.append("")
        values.append(0)  # Will be calculated
        
        for schema in metadata.schemas:
            # Add schema level
            schema_label = f"{schema.name}"
            labels.append(schema_label)
            parents.append(metadata.database_name)
            schema_size = 0
            
            # Add tables
            for table in schema.tables:
                if table.size_bytes and table.size_bytes > 0:
                    table_label = f"{schema.name}.{table.name}"
                    labels.append(table_label)
                    parents.append(schema_label)
                    values.append(table.size_bytes)
                    schema_size += table.size_bytes
            
            values.append(schema_size)
        
        # Update root value
        values[0] = sum(values[1:])
        
        if len(labels) > 1:
            return {"labels": labels, "parents": parents, "values": values}
        
        return None
    
    def _analyze_data_types(self, metadata: DatabaseMetadata) -> Dict[str, int]:
        """Analyze distribution of data types across all tables"""
        type_counts = {}
        
        for schema in metadata.schemas:
            for table in schema.tables:
                for column in table.columns:
                    data_type = column.data_type.upper()
                    type_counts[data_type] = type_counts.get(data_type, 0) + 1
        
        # Sort by count and return top 15
        sorted_types = sorted(type_counts.items(), key=lambda x: x[1], reverse=True)
        return dict(sorted_types[:15])

    def create_column_browser_table(self, table_info: TableInfo) -> List[Dict[str, Any]]:
        """Create structured data for column browser table"""
        columns_data = []
        
        for i, col in enumerate(table_info.columns):
            # Key indicators
            key_indicators = []
            if col.is_primary_key:
                key_indicators.append("🔑 PK")
            if col.is_foreign_key:
                key_indicators.append("🔗 FK")
            if col.is_unique:
                key_indicators.append("🎯 UNIQUE")
            if col.is_indexed:
                key_indicators.append("📊 INDEX")
            
            # Build type info
            type_info = col.data_type
            if col.max_length:
                type_info += f"({col.max_length})"
            if col.precision and col.scale is not None:
                type_info += f"({col.precision},{col.scale})"
            
            columns_data.append({
                "position": i + 1,
                "name": col.name,
                "type": type_info,
                "nullable": "✅ Yes" if col.is_nullable else "❌ No",
                "default": col.default_value or "—",
                "keys": " ".join(key_indicators) or "—",
                "foreign_reference": f"{col.foreign_key_table}.{col.foreign_key_column}" if col.is_foreign_key else "—",
                "comment": col.comment or "—"
            })
        
        return columns_data

    def get_table_statistics(self, table_info: TableInfo) -> Dict[str, Any]:
        """Generate comprehensive table statistics"""
        stats = {
            "basic_info": {
                "schema": table_info.schema,
                "name": table_info.name,
                "type": table_info.table_type,
                "total_columns": len(table_info.columns),
                "comment": table_info.comment or "No description"
            },
            "size_info": {
                "estimated_rows": table_info.row_count or "Unknown",
                "size_bytes": table_info.size_bytes or "Unknown",
                "size_formatted": self._format_bytes(table_info.size_bytes) if table_info.size_bytes else "Unknown"
            },
            "column_analysis": {
                "primary_keys": len([c for c in table_info.columns if c.is_primary_key]),
                "foreign_keys": len([c for c in table_info.columns if c.is_foreign_key]),
                "nullable_columns": len([c for c in table_info.columns if c.is_nullable]),
                "indexed_columns": len([c for c in table_info.columns if c.is_indexed]),
                "unique_columns": len([c for c in table_info.columns if c.is_unique])
            },
            "data_types": self._analyze_table_data_types(table_info),
            "timestamps": {
                "created_at": table_info.created_at or "Unknown",
                "last_modified": table_info.last_modified or "Unknown"
            }
        }
        
        return stats
    
    def _analyze_table_data_types(self, table_info: TableInfo) -> Dict[str, int]:
        """Analyze data types within a single table"""
        type_counts = {}
        for column in table_info.columns:
            data_type = column.data_type.upper()
            type_counts[data_type] = type_counts.get(data_type, 0) + 1
        return type_counts
    
    def _format_bytes(self, bytes_value: int) -> str:
        """Format bytes into human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if bytes_value < 1024.0:
                return f"{bytes_value:.1f} {unit}"
            bytes_value /= 1024.0
        return f"{bytes_value:.1f} PB"

    def create_schema_documentation(self, metadata: DatabaseMetadata) -> str:
        """Generate comprehensive schema documentation in markdown"""
        doc = f"# Database Schema Documentation\n\n"
        doc += f"**Database:** {metadata.database_name}\n"
        doc += f"**Type:** {metadata.database_type}\n"
        doc += f"**Version:** {metadata.version or 'Unknown'}\n"
        doc += f"**Analyzed:** {metadata.analyzed_at}\n\n"
        
        doc += f"## Summary\n\n"
        doc += f"- **Total Tables:** {metadata.total_tables}\n"
        doc += f"- **Total Views:** {metadata.total_views}\n"
        doc += f"- **Total Schemas:** {len(metadata.schemas)}\n\n"
        
        for schema in metadata.schemas:
            doc += f"## Schema: {schema.name}\n\n"
            
            if schema.tables:
                doc += f"### Tables ({len(schema.tables)})\n\n"
                for table in schema.tables:
                    doc += f"#### {table.name}\n"
                    if table.comment:
                        doc += f"{table.comment}\n\n"
                    
                    doc += "| Column | Type | Nullable | Default | Keys | Comment |\n"
                    doc += "|--------|------|----------|---------|------|----------|\n"
                    
                    for col in table.columns:
                        keys = []
                        if col.is_primary_key:
                            keys.append("PK")
                        if col.is_foreign_key:
                            keys.append("FK")
                        if col.is_unique:
                            keys.append("UQ")
                        
                        type_info = col.data_type
                        if col.max_length:
                            type_info += f"({col.max_length})"
                        
                        doc += f"| {col.name} | {type_info} | {'Yes' if col.is_nullable else 'No'} | {col.default_value or '—'} | {' '.join(keys) or '—'} | {col.comment or '—'} |\n"
                    
                    doc += "\n"
            
            if schema.views:
                doc += f"### Views ({len(schema.views)})\n\n"
                for view in schema.views:
                    doc += f"#### {view.name}\n"
                    if view.comment:
                        doc += f"{view.comment}\n\n"
                    doc += f"**Columns:** {len(view.columns)}\n\n"
        
        return doc


if __name__ == "__main__":
    # Test the schema visualizer
    def test_schema_visualizer():
        visualizer = DatabaseSchemaVisualizer()
        print("Database schema visualizer initialized")
        
        # Test would require actual database metadata
        print("Schema visualizer ready for use")
    
    test_schema_visualizer()