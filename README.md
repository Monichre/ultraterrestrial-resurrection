# UltraTerrestrial

**Tracking the State of Disclosure**
_Striving to document, explore and disseminate the past, present and future of the UFO topic and its bearing on humanity, the universe and our place within it._

![Example Image](./preview.jpeg){: height="400px" width="100%"}

# Initial Idea

How it started ...

![Charlie Day](./charlie-day.gif)

Essentially I was thinking it might be cool to build a "state of disclosure" application that provided engaging visual displays and interactions across the following general areas:

1. Major Historical UFO Event Chronology
    - Interactive 3D visualization of global UFO sightings
    - Timeline navigation and filtering capabilities
    - Detailed event documentation and analysis

2. Disclosure Status Dashboard
    - Real-time tracking of claims, hearings and news
    - Progress indicators and milestone tracking
    - Historical context and developments

3. Topic Analysis & Correlation Engine
    - Network visualization of connected topics
    - Pattern recognition and trend analysis
    - Machine learning-powered insight generation

4. Key Figures Database
    - Comprehensive profiles of notable individuals
    - Timeline of involvement and contributions
    - Network analysis of relationships and connections

5. Investigation Hub
    - Interactive evidence mapping and visualization
    - Collaborative research and analysis tools
    - Pattern recognition across disparate data points

6. Digital Archive
    - Searchable repository of documents and artifacts
    - Metadata tagging and cross-referencing
    - Chain of custody tracking

7. Open Questions Framework
    - Structured database of unresolved questions
    - Impact analysis and implications tracking
    - Progress monitoring and updates

8. Classified Locations Registry
    - Mapping of suspected facilities
    - Historical activity analysis
    - Geospatial correlation with events

9. Contractor Intelligence Database
    - Profiles of relevant organizations
    - Project and program tracking
    - Network analysis of relationships

## Formal Pitch

At its core, Ultraterrestrial is designed to chronicle major historical UFO events with stunning 3D visuals that map sightings across the globe. Picture an interactive world map where you can zoom in and out, explore sightings by location, and navigate through time using a dynamic slider that showcases how these phenomena have evolved over the decades. Heatmaps will highlight regions with high densities of sightings, and for those who love immersive experiences, augmented reality features will let you visualize historical sightings in your current surroundings.

Each event isn’t just a pinpoint on a map; it comes alive with detailed descriptions, eyewitness accounts, official reports, and multimedia elements like photos, videos, and audio recordings. Users can dive deep into geospatial data, view satellite imagery, and even add their own annotations, making the exploration both informative and interactive.

Keeping up with the latest developments is crucial, and Ultraterrestrial excels in status reporting on claims, hearings, news items, and events. A real-time dashboard offers an overview of recent developments, ongoing investigations, and upcoming events. Imagine visual timelines tracking the progression of key claims and hearings, complemented by a notification system that keeps you updated on specific topics or events you care about most.

One of the standout features is the Topic Tracker. This dynamic tool maps out interconnected topics using network graphs, highlighting trending subjects and organizing them into subtopics for easy navigation. Users can engage in discussions, participate in polls, and contribute their own insights, fostering a vibrant community of like-minded individuals.

No comprehensive platform would be complete without a Who’s Who roster, and Ultraterrestrial delivers with detailed profiles of key figures in the UFO disclosure space. From Bob Lazar to Jeremy Corbell, each profile includes biographies, contributions, claims, and multimedia content like interviews and documentaries. An interactive network map shows how these figures connect with each other, organizations, and major events, providing a clear picture of the landscape.

For those who crave deeper investigation, Ultraterrestrial offers an Investigative Hub. Think of it as a central place where you can follow complex threads weaving through various events, people, and evidence. Interactive diagrams and mind maps make it easy to visualize these connections, while in-depth case studies allow for thorough exploration of specific phenomena or incidents. Users can collaborate on investigations, contribute findings, and even participate in verifying information to ensure credibility.

The Library is another cornerstone of Ultraterrestrial, housing major documents, letters, artifacts, and evidence in a meticulously organized digital repository. With features like document scanning, OCR, and detailed metadata, users can easily search and access a wealth of information. Interactive exhibits and guided tours provide curated experiences, making the library both a resource and an educational tool.

Addressing the big questions is essential, and Ultraterrestrial presents an official list of “unanswered questions” along with their implications. These questions are categorized by themes such as technology, origin, and intent, and each one links to relevant people, places, and events. Users can track the progress of these questions, submit new ones, and vote on which should be prioritized, ensuring that the platform remains dynamic and responsive to community interests.

When it comes to the more mysterious aspects, Ultraterrestrial includes lists of suspected “black” bases and contractors involved in retrieving materials. Interactive maps provide detailed location data, while base profiles offer background information, theories, sightings, and photographic evidence. Contractor profiles document affiliations and evidence linking them to retrieved materials, complete with network mapping to show connections to various bases and events.

[ERD](packages/docs/erd-diagram.svg)
[Feature Roadmap](./roadmap.md)
[Pitch](./pitch.md)

## Project Structure

For a comprehensive overview of the codebase architecture, file organization, and navigation guide, see **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**.

## Tech Stack

OpenAI
AI.SDK
NextJS
Xata
OpenAI
Anthropic
Tailwind
ThreeJS
React Three Fiber
Framer Motion

### Prompt Storage

<https://us.cloud.langfuse.com/project/cm383h71b00ko9czugbg17ss6>

# Application Development Resources

## Research & Learning

1. [AsyncFuncAI Rabbitholes](https://deepwiki.com/AsyncFuncAI/rabbitholes) - Deep dives into asynchronous function AI concepts
2. [XYflow React Implementation](https://deepwiki.com/xyflow/xyflow/5-react-implementation) - Guide for implementing React with XYflow
3. [Reactflow Auto Layout](https://deepwiki.com/idootop/reactflow-auto-layout) - Automatic layout solutions for Reactflow
4. [AsyncFuncAI Rabbitholes](https://deepwiki.com/AsyncFuncAI/rabbitholes) - Deep dives into asynchronous function AI concepts
5. [AFFiNE](https://deepwiki.com/toeverything/AFFiNE) - Knowledge base and collaboration platform
6. [Deep Research Documentation](https://aie-feb-25.vercel.app/docs/deep-research) - Comprehensive research documentation and methodologies
7. MyLensAI
8. <https://www.heuristi.ca/>
<!-- 

{
  "permissions": {
    "allow": [
      "Bash(bun run:*)",
      "Bash(chmod:*)",
      "Bash(grep:*)",
      "Bash(bun build:*)",
      "Bash(psql:*)",
      "Bash(rm:*)",
      "Bash(bun install:*)",
      "Bash(find:*)",
      "Bash(./launch_dashboard.sh:*)",
      "Bash(XATA_DATABASE_URL=\"https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial\" XATA_API_KEY=\"xau_LKJxzxjzXasEUXxjmhCBACdTCvi5Ed2v1\" XATA_BRANCH=\"main\" GROQ_API_KEY=\"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\" python3 -c \"\nimport sys\nsys.path.append('.')\nfrom lib.interactive_entity_processor import process_summary_file_interactive\nimport os\n\n# Test with the existing summary file in non-interactive mode\ntest_summary = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/transcripts/2025-01-31/WGUb1JKxBDo/exPentagonOfficialConfirmsAlienLanguageExistsLueElizondoDebriefedEp24Summary.txt'\n\nif os.path.exists(test_summary):\n    print('Testing entity processor in non-interactive mode...')\n    results = process_summary_file_interactive(test_summary, 'WGUb1JKxBDo', interactive=False)\n    print(f'Processing complete: {results.get(\\\"status\\\", \\\"unknown\\\")}')\n    if results.get('entities'):\n        for entity_type, entities in results['entities'].items():\n            if entities:\n                print(f'{entity_type}: {len(entities)} entities')\n    if results.get('xata_search_results'):\n        print(f'Xata search: {results.get(\\\"total_matches\\\", 0)} total matches found')\nelse:\n    print(f'Test file not found: {test_summary}')\n\")",
      "Bash(./venv/bin/pip install asyncpg)",
      "Bash(python3:*)",
      "Bash(source:*)",
      "mcp__search1api__crawl",
      "mcp__mcp-server-aidd__list_directory",
      "mcp__mcp-server-aidd__read_file"
    ]
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": [
    "mcp-installer",
    "memory-graph",
    "notion",
    "byterover-mcp"
  ]
} -->