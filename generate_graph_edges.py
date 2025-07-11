#!/usr/bin/env python3
import csv

# Read all CSV files
def read_csv(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

# Read data
event_sme = read_csv('eventsubjectmatterexperts.csv')
event_topic_sme = read_csv('eventtopicsubjectmatterexperts.csv')
org_members = read_csv('organizationmembers.csv')
topic_sme = read_csv('topicsubjectmatterexperts.csv')
topic_testimonies = read_csv('topicstestimonies.csv')

# Create edges
edges = []

# Event -> Expert (Red)
for row in event_sme:
    edges.append({
        'source': row['event'],
        'target': row['subject-matter-expert'],
        'edge_type': 'event_to_expert',
        'color': '#FF6B6B'
    })

# Organization -> Member (Teal)
for row in org_members:
    edges.append({
        'source': row['organization'],
        'target': row['member'],
        'edge_type': 'organization_to_member',
        'color': '#4ECDC4'
    })

# Expert -> Topic (Blue)
for row in topic_sme:
    edges.append({
        'source': row['subject-matter-expert'],
        'target': row['topic'],
        'edge_type': 'expert_to_topic',
        'color': '#45B7D1'
    })

# Testimony -> Topic (Green)
for row in topic_testimonies:
    edges.append({
        'source': row['testimony'],
        'target': row['topic'],
        'edge_type': 'testimony_to_topic',
        'color': '#96CEB4'
    })

# Event -> Topic (Yellow)
for row in event_topic_sme:
    edges.append({
        'source': row['event'],
        'target': row['topic'],
        'edge_type': 'event_to_topic',
        'color': '#FECA57'
    })

# Write to CSV
with open('graph_edges.csv', 'w', newline='', encoding='utf-8') as f:
    fieldnames = ['source', 'target', 'edge_type', 'color']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(edges)

print(f"Created graph_edges.csv with {len(edges)} edges")
