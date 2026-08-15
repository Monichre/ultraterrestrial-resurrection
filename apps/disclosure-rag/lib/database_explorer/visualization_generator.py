#!/usr/bin/env python3
"""
Database Visualization Generator
Creates charts, graphs, and visualizations from database query results
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
    import pandas as pd
    PLOTLY_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False
    go = None
    px = None
    make_subplots = None
    pd = None

logger = logging.getLogger(__name__)

@dataclass
class VisualizationConfig:
    """Configuration for visualization generation"""
    chart_type: str
    title: str
    x_column: Optional[str] = None
    y_column: Optional[str] = None
    color_column: Optional[str] = None
    size_column: Optional[str] = None
    group_column: Optional[str] = None
    aggregation: Optional[str] = None  # sum, count, avg, max, min
    theme: str = "plotly_dark"
    width: int = 800
    height: int = 600
    show_labels: bool = True
    show_legend: bool = True

class DatabaseVisualizationGenerator:
    """Generates visualizations from database query results"""
    
    def __init__(self):
        self.theme_templates = {
            "plotly_dark": "plotly_dark",
            "plotly_white": "plotly_white",
            "seaborn": "seaborn",
            "ggplot2": "ggplot2"
        }
        
        self.color_palettes = {
            "default": px.colors.qualitative.Set2 if PLOTLY_AVAILABLE else [],
            "viridis": px.colors.sequential.Viridis if PLOTLY_AVAILABLE else [],
            "plasma": px.colors.sequential.Plasma if PLOTLY_AVAILABLE else [],
            "ufo_theme": ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb7185"]
        }
    
    def auto_visualize(self, data: List[Dict[str, Any]], title: str = "Database Query Results") -> Optional[Dict[str, Any]]:
        """Automatically create appropriate visualization based on data"""
        if not PLOTLY_AVAILABLE or not data:
            return None
        
        try:
            df = pd.DataFrame(data)
            
            # Analyze data structure
            numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
            categorical_columns = df.select_dtypes(include=['object', 'category']).columns.tolist()
            datetime_columns = df.select_dtypes(include=['datetime64']).columns.tolist()
            
            # Determine best visualization
            if len(df) == 0:
                return None
            elif len(numeric_columns) == 0 and len(categorical_columns) == 1:
                # Single categorical column - value counts
                return self._create_category_count_chart(df, categorical_columns[0], title)
            elif len(numeric_columns) == 1 and len(categorical_columns) == 1:
                # One numeric, one categorical - bar chart
                return self._create_bar_chart(df, categorical_columns[0], numeric_columns[0], title)
            elif len(numeric_columns) >= 2:
                # Multiple numeric columns - scatter plot
                return self._create_scatter_plot(df, numeric_columns[0], numeric_columns[1], title, 
                                               color_column=categorical_columns[0] if categorical_columns else None)
            elif len(datetime_columns) >= 1 and len(numeric_columns) >= 1:
                # Time series data
                return self._create_time_series(df, datetime_columns[0], numeric_columns[0], title)
            else:
                # Default to table view
                return self._create_data_table(df, title)
                
        except Exception as e:
            logger.error(f"Auto visualization failed: {e}")
            return None
    
    def create_visualization(self, data: List[Dict[str, Any]], config: VisualizationConfig) -> Optional[Dict[str, Any]]:
        """Create specific visualization based on configuration"""
        if not PLOTLY_AVAILABLE or not data:
            return None
        
        try:
            df = pd.DataFrame(data)
            
            # Apply aggregation if specified
            if config.aggregation and config.group_column:
                df = self._apply_aggregation(df, config.group_column, config.y_column, config.aggregation)
            
            chart_type = config.chart_type.lower()
            
            if chart_type == "bar":
                return self._create_bar_chart(df, config.x_column, config.y_column, config.title, config)
            elif chart_type == "line":
                return self._create_line_chart(df, config.x_column, config.y_column, config.title, config)
            elif chart_type == "scatter":
                return self._create_scatter_plot(df, config.x_column, config.y_column, config.title, 
                                               config.color_column, config.size_column, config)
            elif chart_type == "pie":
                return self._create_pie_chart(df, config.x_column, config.y_column, config.title, config)
            elif chart_type == "histogram":
                return self._create_histogram(df, config.x_column, config.title, config)
            elif chart_type == "box":
                return self._create_box_plot(df, config.x_column, config.y_column, config.title, config)
            elif chart_type == "heatmap":
                return self._create_heatmap(df, config.x_column, config.y_column, config.color_column, config.title, config)
            elif chart_type == "table":
                return self._create_data_table(df, config.title)
            else:
                logger.warning(f"Unsupported chart type: {chart_type}")
                return None
                
        except Exception as e:
            logger.error(f"Visualization creation failed: {e}")
            return None
    
    def create_dashboard(self, queries_results: List[Tuple[str, List[Dict[str, Any]], VisualizationConfig]]) -> Optional[Dict[str, Any]]:
        """Create dashboard with multiple visualizations"""
        if not PLOTLY_AVAILABLE:
            return None
        
        try:
            # Create subplots
            num_charts = len(queries_results)
            cols = 2 if num_charts > 1 else 1
            rows = (num_charts + 1) // 2
            
            subplot_titles = [config.title for _, _, config in queries_results]
            
            fig = make_subplots(
                rows=rows,
                cols=cols,
                subplot_titles=subplot_titles,
                specs=[[{"secondary_y": False}] * cols] * rows
            )
            
            # Add each chart to subplot
            for i, (query_name, data, config) in enumerate(queries_results):
                row = (i // cols) + 1
                col = (i % cols) + 1
                
                # Create individual chart
                chart_data = self.create_visualization(data, config)
                if chart_data and 'fig' in chart_data:
                    chart_fig = chart_data['fig']
                    
                    # Add traces to subplot
                    for trace in chart_fig.data:
                        fig.add_trace(trace, row=row, col=col)
            
            # Update layout
            fig.update_layout(
                title="Database Dashboard",
                template="plotly_dark",
                height=400 * rows,
                showlegend=True
            )
            
            return {
                'fig': fig,
                'type': 'dashboard',
                'charts_count': num_charts
            }
            
        except Exception as e:
            logger.error(f"Dashboard creation failed: {e}")
            return None
    
    def create_database_overview_charts(self, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create overview charts for database metadata"""
        if not PLOTLY_AVAILABLE:
            return []
        
        charts = []
        
        try:
            # Table count by schema
            if 'schemas' in metadata:
                schema_data = []
                for schema in metadata['schemas']:
                    schema_data.append({
                        'schema': schema['name'],
                        'tables': len(schema.get('tables', [])),
                        'views': len(schema.get('views', []))
                    })
                
                if schema_data:
                    charts.append(self._create_schema_overview_chart(schema_data))
            
            # Database size distribution
            if 'table_sizes' in metadata:
                charts.append(self._create_size_distribution_chart(metadata['table_sizes']))
            
            # Entity relationship overview
            if 'relationships' in metadata:
                charts.append(self._create_relationships_chart(metadata['relationships']))
                
        except Exception as e:
            logger.error(f"Database overview charts creation failed: {e}")
        
        return charts
    
    def _create_bar_chart(self, df: pd.DataFrame, x_col: str, y_col: str, title: str, 
                         config: Optional[VisualizationConfig] = None) -> Dict[str, Any]:
        """Create bar chart"""
        fig = px.bar(
            df, 
            x=x_col, 
            y=y_col,
            color=config.color_column if config and config.color_column else None,
            title=title,
            template=config.theme if config else "plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=config.width if config else 800,
            height=config.height if config else 600,
            showlegend=config.show_legend if config else True
        )
        
        return {
            'fig': fig,
            'type': 'bar',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_line_chart(self, df: pd.DataFrame, x_col: str, y_col: str, title: str,
                          config: Optional[VisualizationConfig] = None) -> Dict[str, Any]:
        """Create line chart"""
        fig = px.line(
            df,
            x=x_col,
            y=y_col,
            color=config.color_column if config and config.color_column else None,
            title=title,
            template=config.theme if config else "plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=config.width if config else 800,
            height=config.height if config else 600
        )
        
        return {
            'fig': fig,
            'type': 'line',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_scatter_plot(self, df: pd.DataFrame, x_col: str, y_col: str, title: str,
                           color_col: Optional[str] = None, size_col: Optional[str] = None,
                           config: Optional[VisualizationConfig] = None) -> Dict[str, Any]:
        """Create scatter plot"""
        fig = px.scatter(
            df,
            x=x_col,
            y=y_col,
            color=color_col,
            size=size_col,
            title=title,
            template=config.theme if config else "plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=config.width if config else 800,
            height=config.height if config else 600
        )
        
        return {
            'fig': fig,
            'type': 'scatter',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_pie_chart(self, df: pd.DataFrame, labels_col: str, values_col: str, title: str,
                         config: Optional[VisualizationConfig] = None) -> Dict[str, Any]:
        """Create pie chart"""
        # If values_col is None, count occurrences of labels_col
        if values_col is None:
            value_counts = df[labels_col].value_counts()
            fig = px.pie(
                values=value_counts.values,
                names=value_counts.index,
                title=title,
                template=config.theme if config else "plotly_dark",
                color_discrete_sequence=self.color_palettes["ufo_theme"]
            )
        else:
            fig = px.pie(
                df,
                values=values_col,
                names=labels_col,
                title=title,
                template=config.theme if config else "plotly_dark",
                color_discrete_sequence=self.color_palettes["ufo_theme"]
            )
        
        fig.update_layout(
            width=config.width if config else 800,
            height=config.height if config else 600
        )
        
        return {
            'fig': fig,
            'type': 'pie',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_histogram(self, df: pd.DataFrame, x_col: str, title: str,
                         config: Optional[VisualizationConfig] = None) -> Dict[str, Any]:
        """Create histogram"""
        fig = px.histogram(
            df,
            x=x_col,
            title=title,
            template=config.theme if config else "plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=config.width if config else 800,
            height=config.height if config else 600
        )
        
        return {
            'fig': fig,
            'type': 'histogram',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_box_plot(self, df: pd.DataFrame, x_col: str, y_col: str, title: str,
                        config: Optional[VisualizationConfig] = None) -> Dict[str, Any]:
        """Create box plot"""
        fig = px.box(
            df,
            x=x_col,
            y=y_col,
            title=title,
            template=config.theme if config else "plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=config.width if config else 800,
            height=config.height if config else 600
        )
        
        return {
            'fig': fig,
            'type': 'box',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_heatmap(self, df: pd.DataFrame, x_col: str, y_col: str, z_col: str, title: str,
                       config: Optional[VisualizationConfig] = None) -> Dict[str, Any]:
        """Create heatmap"""
        # Pivot data for heatmap
        heatmap_data = df.pivot_table(values=z_col, index=y_col, columns=x_col, aggfunc='mean')
        
        fig = px.imshow(
            heatmap_data,
            title=title,
            template=config.theme if config else "plotly_dark",
            color_continuous_scale="Viridis"
        )
        
        fig.update_layout(
            width=config.width if config else 800,
            height=config.height if config else 600
        )
        
        return {
            'fig': fig,
            'type': 'heatmap',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_time_series(self, df: pd.DataFrame, time_col: str, value_col: str, title: str) -> Dict[str, Any]:
        """Create time series chart"""
        df[time_col] = pd.to_datetime(df[time_col])
        df = df.sort_values(time_col)
        
        fig = px.line(
            df,
            x=time_col,
            y=value_col,
            title=title,
            template="plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=800,
            height=600,
            xaxis_title="Time",
            yaxis_title=value_col
        )
        
        return {
            'fig': fig,
            'type': 'time_series',
            'title': title,
            'data_points': len(df)
        }
    
    def _create_category_count_chart(self, df: pd.DataFrame, category_col: str, title: str) -> Dict[str, Any]:
        """Create category count chart"""
        value_counts = df[category_col].value_counts().head(20)  # Limit to top 20
        
        fig = px.bar(
            x=value_counts.index,
            y=value_counts.values,
            title=title,
            template="plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=800,
            height=600,
            xaxis_title=category_col,
            yaxis_title="Count"
        )
        
        return {
            'fig': fig,
            'type': 'category_count',
            'title': title,
            'categories': len(value_counts)
        }
    
    def _create_data_table(self, df: pd.DataFrame, title: str) -> Dict[str, Any]:
        """Create data table visualization"""
        fig = go.Figure(data=[go.Table(
            header=dict(
                values=list(df.columns),
                fill_color='darkslategray',
                font=dict(color='white', size=12),
                align='left'
            ),
            cells=dict(
                values=[df[col] for col in df.columns],
                fill_color='rgba(50, 50, 50, 0.8)',
                font=dict(color='white', size=11),
                align='left'
            )
        )])
        
        fig.update_layout(
            title=title,
            template="plotly_dark",
            width=800,
            height=600
        )
        
        return {
            'fig': fig,
            'type': 'table',
            'title': title,
            'rows': len(df),
            'columns': len(df.columns)
        }
    
    def _create_schema_overview_chart(self, schema_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create schema overview chart"""
        df = pd.DataFrame(schema_data)
        
        fig = px.bar(
            df,
            x='schema',
            y=['tables', 'views'],
            title="Database Schema Overview",
            template="plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=800,
            height=400,
            xaxis_title="Schema",
            yaxis_title="Count"
        )
        
        return {
            'fig': fig,
            'type': 'schema_overview',
            'title': "Database Schema Overview"
        }
    
    def _create_size_distribution_chart(self, size_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create size distribution chart"""
        df = pd.DataFrame(size_data)
        
        fig = px.treemap(
            df,
            path=['schema', 'table'],
            values='size_bytes',
            title="Database Size Distribution",
            template="plotly_dark",
            color_discrete_sequence=self.color_palettes["ufo_theme"]
        )
        
        fig.update_layout(
            width=800,
            height=600
        )
        
        return {
            'fig': fig,
            'type': 'size_distribution',
            'title': "Database Size Distribution"
        }
    
    def _create_relationships_chart(self, relationships_data: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """Create entity relationships chart"""
        # Create network graph of table relationships
        nodes = set()
        edges = []
        
        for table, relations in relationships_data.items():
            nodes.add(table)
            for relation in relations:
                target_table = relation['references_table']
                nodes.add(target_table)
                edges.append((table, target_table))
        
        # Create a simple network visualization
        fig = go.Figure()
        
        # Add nodes
        node_list = list(nodes)
        fig.add_trace(go.Scatter(
            x=list(range(len(node_list))),
            y=[0] * len(node_list),
            mode='markers+text',
            text=node_list,
            textposition="middle center",
            marker=dict(size=20, color=self.color_palettes["ufo_theme"][0]),
            name="Tables"
        ))
        
        fig.update_layout(
            title="Database Relationships",
            template="plotly_dark",
            width=800,
            height=400,
            showlegend=False
        )
        
        return {
            'fig': fig,
            'type': 'relationships',
            'title': "Database Relationships",
            'tables': len(nodes),
            'relationships': len(edges)
        }
    
    def _apply_aggregation(self, df: pd.DataFrame, group_col: str, value_col: str, aggregation: str) -> pd.DataFrame:
        """Apply aggregation to dataframe"""
        if aggregation == "count":
            return df.groupby(group_col).size().reset_index(name='count')
        elif aggregation == "sum":
            return df.groupby(group_col)[value_col].sum().reset_index()
        elif aggregation == "avg":
            return df.groupby(group_col)[value_col].mean().reset_index()
        elif aggregation == "max":
            return df.groupby(group_col)[value_col].max().reset_index()
        elif aggregation == "min":
            return df.groupby(group_col)[value_col].min().reset_index()
        else:
            return df
    
    def get_supported_chart_types(self) -> List[str]:
        """Get list of supported chart types"""
        return [
            "bar", "line", "scatter", "pie", "histogram", 
            "box", "heatmap", "table", "time_series"
        ]
    
    def get_chart_recommendations(self, data: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """Get chart type recommendations based on data"""
        if not data:
            return []
        
        df = pd.DataFrame(data)
        recommendations = []
        
        numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
        categorical_columns = df.select_dtypes(include=['object', 'category']).columns.tolist()
        datetime_columns = df.select_dtypes(include=['datetime64']).columns.tolist()
        
        if len(categorical_columns) >= 1 and len(numeric_columns) >= 1:
            recommendations.append({
                "type": "bar",
                "reason": "Categorical and numeric data perfect for bar charts",
                "x_column": categorical_columns[0],
                "y_column": numeric_columns[0]
            })
        
        if len(numeric_columns) >= 2:
            recommendations.append({
                "type": "scatter",
                "reason": "Multiple numeric columns suitable for scatter plot",
                "x_column": numeric_columns[0],
                "y_column": numeric_columns[1]
            })
        
        if len(datetime_columns) >= 1 and len(numeric_columns) >= 1:
            recommendations.append({
                "type": "line",
                "reason": "Time series data detected",
                "x_column": datetime_columns[0],
                "y_column": numeric_columns[0]
            })
        
        if len(categorical_columns) >= 1:
            recommendations.append({
                "type": "pie",
                "reason": "Categorical data suitable for distribution chart",
                "x_column": categorical_columns[0],
                "y_column": None
            })
        
        return recommendations


if __name__ == "__main__":
    # Test the visualization generator
    def test_visualization_generator():
        generator = DatabaseVisualizationGenerator()
        
        # Test with sample data
        sample_data = [
            {"category": "personnel", "count": 465},
            {"category": "organizations", "count": 200},
            {"category": "events", "count": 2521},
            {"category": "topics", "count": 455}
        ]
        
        # Test auto visualization
        auto_viz = generator.auto_visualize(sample_data, "Entity Distribution")
        print(f"Auto visualization: {auto_viz['type'] if auto_viz else 'None'}")
        
        # Test chart recommendations
        recommendations = generator.get_chart_recommendations(sample_data)
        print(f"Chart recommendations: {len(recommendations)} available")
        
        # Test supported types
        supported_types = generator.get_supported_chart_types()
        print(f"Supported chart types: {supported_types}")
        
        print("Visualization generator ready for use")
    
    test_visualization_generator()