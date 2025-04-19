
"""
Reasoning Process and Implementation for Website Knowledge Graph Builder

This script builds a CLI application using CrewAI, e2b_code_interpreter, and Firecrawl 
to ingest website URLs and create a network/knowledge graph.

Components:
- CrewAI: Coordinates AI agents
- e2b_code_interpreter: Runs Python code in sandbox
- Firecrawl: Scrapes websites

Main steps:
1. Scrape websites
2. Extract information 
3. Build knowledge graph
4. Visualize results

Implementation details and considerations are provided in the code below.
"""

import argparse
import json
import os
from typing import List

import requests
from crewai import Agent, Crew, Task
from e2b import CodeInterpreter
from pyvis.network import Network

# Configure API keys


class LocalKnowledgeGraph:
    def __init__(self):
        self.code_interpreter = CodeInterpreter()
        self.setup_agents()

    def setup_agents(self):
        # Content Extraction Agent
        self.extractor_agent = Agent(
            role="Content Extractor",
            goal="Extract main topics and entities from website content",
            backstory="Expert at analyzing web content and identifying key information",
            allow_delegation=False
        )

        # Relationship Analysis Agent
        self.relationship_agent = Agent(
            role="Relationship Analyzer",
            goal="Identify relationships between extracted entities",
            backstory="Specialist in understanding connections between concepts",
            allow_delegation=False
        )

        # Graph Building Agent
        self.graph_builder_agent = Agent(
            role="Graph Builder",
            goal="Create network graph structure from entities and relationships",
            backstory="Expert at organizing information into network graphs",
            allow_delegation=False
        )

    def process_content(self, content: str):
        """Process website content using AI agents"""
        # Extract entities
        extraction_task = Task(
            description="Extract key entities and topics from the content",
            agent=self.extractor_agent
        )
        entities = extraction_task.execute(content)

        # Analyze relationships
        relationship_task = Task(
            description="Identify relationships between extracted entities",
            agent=self.relationship_agent
        )
        relationships = relationship_task.execute(entities)

        # Build graph structure
        graph_task = Task(
            description="Create graph structure from entities and relationships",
            agent=self.graph_builder_agent
        )
        graph_data = graph_task.execute(
            f"Entities: {entities}\nRelationships: {relationships}")

        return json.loads(graph_data)

    def visualize_graph(self, graph_data: dict, output_file: str):
        """Generate visualization using e2b code interpreter"""
        visualization_code = f"""
import networkx as nx
from pyvis.network import Network
import json

# Create network
net = Network(notebook=True, width="100%", height="600px")

# Add nodes and edges from graph data
graph_data = {graph_data}
for node in graph_data['nodes']:
    net.add_node(node['id'], label=node['label'])
for edge in graph_data['edges']:
    net.add_edge(edge['source'], edge['target'], title=edge['relationship'])

# Save visualization
net.show('{output_file}')
"""
        self.code_interpreter.run(visualization_code)

#  parser = argparse.ArgumentParser(
#         description="Create knowledge graph from websites")
#     parser.add_argument("urls", nargs="+", help="List of URLs to process")
#     parser.add_argument(
#         "--output", default="knowledge_graph.html", help="Output file name")
#     args = parser.parse_args()

#     graph_builder = WebsiteKnowledgeGraph()

#     all_graph_data = {"nodes": [], "edges": []}

#     for url in args.urls:
#         try:
#             print(f"Processing {url}...")
#             content = graph_builder.scrape_website(url)
#             graph_data = graph_builder.process_content(content)

#             # Merge graph data
#             all_graph_data["nodes"].extend(graph_data["nodes"])
#             all_graph_data["edges"].extend(graph_data["edges"])

#         except Exception as e:
#             print(f"Error processing {url}: {str(e)}")

#     print("Generating visualization...")
#     graph_builder.visualize_graph(all_graph_data, args.output)
#     print(f"Knowledge graph saved to {args.output}")