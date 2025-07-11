#!/usr/bin/env python3
"""
Graph Edges CSV Generator
This script reads your uploaded CSV files and creates a graph edges file
suitable for network visualization tools.
"""

import csv
import os

def read_csv(filename):
    """Read a CSV file and return list of dictionaries"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            return list(reader)
    except FileNotFoundError:
        print(f"Warning: {filename} not found")
        return []

def main():
    print("Graph Edges CSV Generator")
    print("=" * 50)
    
    # Initialize edges list
    edges = []
    
    # Process Event -> Subject Matter Expert relationships (Red)
    print("\nProcessing event->expert relationships...")
    event_sme = read_csv('eventsubjectmatterexperts.csv')
    for row in event_sme:
        edges.append({
            'source': row.get('event', ''),
            'target': row.get('subject-matter-expert', ''),
            'edge_type': 'event_to_expert',
            'color': '#FF6B6B'
        })
    print(f"  Added {len(event_sme)} event->expert edges")
    
    # Process Organization -> Member relationships (Teal)
    print("\nProcessing organization->member relationships...")
    org_members = read_csv('organizationmembers.csv')
    for row in org_members:
        edges.append({
            'source': row.get('organization', ''),
            'target': row.get('member', ''),
            'edge_type': 'organization_to_member',
            'color': '#4ECDC4'
        })
    print(f"  Added {len(org_members)} organization->member edges")
    
    # Process Expert -> Topic relationships (Blue)
    print("\nProcessing expert->topic relationships...")
    topic_sme = read_csv('topicsubjectmatterexperts.csv')
    for row in topic_sme:
        edges.append({
            'source': row.get('subject-matter-expert', ''),
            'target': row.get('topic', ''),
            'edge_type': 'expert_to_topic',
            'color': '#45B7D1'
        })
    print(f"  Added {len(topic_sme)} expert->topic edges")
    
    # Process Testimony -> Topic relationships (Green)
    print("\nProcessing testimony->topic relationships...")
    topic_testimonies = read_csv('topicstestimonies.csv')
    for row in topic_testimonies:
        edges.append({
            'source': row.get('testimony', ''),
            'target': row.get('topic', ''),
            'edge_type': 'testimony_to_topic',
            'color': '#96CEB4'
        })
    print(f"  Added {len(topic_testimonies)} testimony->topic edges")
    
    # Process Event -> Topic relationships (Yellow)
    print("\nProcessing event->topic relationships...")
    event_topic_sme = read_csv('eventtopicsubjectmatterexperts.csv')
    for row in event_topic_sme:
        edges.append({
            'source': row.get('event', ''),
            'target': row.get('topic', ''),
            'edge_type': 'event_to_topic',
            'color': '#FECA57'
        })
    print(f"  Added {len(event_topic_sme)} event->topic edges")
    
    # Write to CSV file
    print(f"\nWriting {len(edges)} total edges to graph_edges.csv...")
    with open('graph_edges.csv', 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['source', 'target', 'edge_type', 'color']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(edges)
    
    # Calculate statistics
    print("\n" + "=" * 50)
    print("SUCCESS! Created graph_edges.csv")
    print("=" * 50)
    
    # Count unique nodes
    unique_nodes = set()
    edge_type_counts = {}
    for edge in edges:
        unique_nodes.add(edge['source'])
        unique_nodes.add(edge['target'])
        edge_type = edge['edge_type']
        edge_type_counts[edge_type] = edge_type_counts.get(edge_type, 0) + 1
    
    print(f"\nFile Statistics:")
    print(f"  Total edges: {len(edges):,}")
    print(f"  Unique nodes: {len(unique_nodes):,}")
    print(f"  File location: {os.path.abspath('graph_edges.csv')}")
    
    file_size = os.path.getsize('graph_edges.csv')
    print(f"  File size: {file_size / 1024:.2f} KB ({file_size / 1024 / 1024:.2f} MB)")
    
    print(f"\nEdge Type Distribution:")
    for edge_type, count in sorted(edge_type_counts.items()):
        print(f"  {edge_type}: {count:,}")

if __name__ == "__main__":
    main()
