# Honcho Memory Integration for Disclosure RAG

This document explains how Honcho memory and personalization is integrated into the Disclosure RAG system.

## Overview

Honcho provides persistent memory and personalization capabilities that enable the Disclosure Bot to:

- **Remember conversations** across sessions
- **Learn research preferences** automatically from interactions  
- **Personalize responses** based on researcher's established patterns
- **Track investigation patterns** (topics, sources, cases of interest)
- **Search past research** across all historical conversations
- **Build researcher profiles** using theory of mind

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Disclosure Chat Bot                     │
│                   (disclosure_chat_with_memory.py)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ├─────────► OpenAI (LLM responses)
                     │
                     └─────────► Honcho Memory System
                                 (lib/honcho_client.py)
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              Workspaces           Peers            Sessions
            (Research Projects) (Researchers)   (Conversations)
                    │                  │                  │
                    └──────────────────┴──────────────────┘
                                       ▼
                            Automatic Learning
                         (Topics, Preferences, 
                          Patterns, Psychology)
```

## Key Components

### 1. HonchoMemoryClient (`lib/honcho_client.py`)

The core wrapper around Honcho's SDK, providing:

- **Peer management**: Track individual researchers
- **Session management**: Organize research conversations
- **Message tracking**: Store all interactions
- **Context retrieval**: Smart context window management
- **Insights API**: Query learned preferences and patterns
- **Search**: Find relevant past research

### 2. Enhanced Chat Interface (`disclosure_chat_with_memory.py`)

The main chat interface enhanced with memory:

- Persistent researcher profiles
- Automatic session management
- Personalized system prompts
- Memory-augmented responses
- Research insights display
- Historical search

## Quick Start

### 1. Prerequisites

```bash
# Install dependencies
cd apps/disclosure-rag
pip install honcho-ai

# Ensure HONCHO_API_KEY is set in .env
# Already configured: hch-v2-pl9qe8szkbtht0e0tsr80hter2j4logyar050vtgw40bsceatz8capiclp33jbas
```

### 2. Basic Usage

```python
from lib.honcho_client import HonchoMemoryClient

# Initialize memory
memory = HonchoMemoryClient(workspace_id="my-research")

# Create researcher peer
peer = memory.get_or_create_peer("researcher_001")

# Start research session
session_id = "roswell_investigation_001"
session = memory.create_session(
    session_id,
    ["researcher_001"],
    metadata={"topic": "Roswell Incident"}
)

# Add messages
memory.add_message(session_id, "researcher_001", "Tell me about Roswell")

# Query learned insights
insights = memory.query_peer_insights(
    "researcher_001",
    "What UFO cases is this researcher investigating?"
)
print(insights)
```

### 3. Run Chat with Memory

```bash
# Interactive mode
python disclosure_chat_with_memory.py

# With specific researcher ID
python disclosure_chat_with_memory.py --researcher-id="john_doe"

# Quick test
python disclosure_chat_with_memory.py --test
```

## Features

### Automatic Personalization

Honcho learns from every interaction:

```python
# After several conversations about Roswell...
bot.show_research_insights()

# Returns learned insights like:
# {
#   "topics": "Focused on 1947 crash retrievals and military cover-ups",
#   "sources": "Prefers witness testimony over speculation",
#   "style": "Wants detailed, evidence-based analysis",
#   "credibility": "Values official documents and first-hand accounts",
#   "focus_areas": "Roswell incident, Jesse Marcel testimony"
# }
```

### Smart Context Management

Honcho automatically handles token limits:

```python
# Retrieves most relevant context within budget
context = memory.get_session_context(
    session_id,
    max_tokens=2000  # Fits within your LLM's context window
)

# Returns a mix of:
# - Recent messages
# - Relevant older messages
# - Intelligent summaries
```

### Historical Search

Search across all past research:

```python
# Find all discussions about a specific case
results = memory.search_memories(
    "researcher_001",
    "Jesse Marcel testimony"
)

# Returns matching messages with context
```

### Research Activity Tracking

Track what researchers investigate:

```python
# Track when researcher views a document
memory.track_research_activity(
    "researcher_001",
    activity_type="document_view",
    details={
        "document": "Project Blue Book Case 47",
        "topic": "Roswell",
        "duration_seconds": 180
    }
)

# Later query patterns
insights = memory.query_peer_insights(
    "researcher_001",
    "What documents has this researcher spent most time on?"
)
```

## Integration with Agents

### Example: YouTube Agent with Memory

```python
from agents.ufo_youtube_agent import UFOYouTubeAgent
from lib.honcho_client import HonchoMemoryClient

class MemoryEnhancedYouTubeAgent(UFOYouTubeAgent):
    def __init__(self, researcher_id: str):
        super().__init__()
        self.memory = HonchoMemoryClient()
        self.researcher_id = researcher_id
    
    def analyze_video(self, url: str, session_id: str):
        # Standard analysis
        analysis = super().analyze_video(url)
        
        # Store in memory
        self.memory.add_message(
            session_id,
            self.researcher_id,
            f"Analyzed video: {url}\n\nKey findings: {analysis['summary']}"
        )
        
        # Track activity
        self.memory.track_research_activity(
            self.researcher_id,
            "youtube_analysis",
            {
                "url": url,
                "topics": analysis.get("topics", []),
                "witnesses": analysis.get("witnesses", [])
            },
            session_id
        )
        
        return analysis
```

### Example: Deep Research Agent with Memory

```python
from agents.uap_deep_research_agent import UAPDeepResearchAgent
from lib.honcho_client import HonchoMemoryClient

class MemoryEnhancedResearchAgent(UAPDeepResearchAgent):
    def __init__(self, researcher_id: str):
        super().__init__()
        self.memory = HonchoMemoryClient()
        self.researcher_id = researcher_id
    
    def research_topic(self, topic: str, session_id: str):
        # Get personalized research parameters
        preferences = self.memory.query_peer_insights(
            self.researcher_id,
            f"""For researching '{topic}', what approach would this researcher prefer?
            Consider their past research patterns and source preferences."""
        )
        
        # Conduct research
        findings = super().research_topic(topic)
        
        # Store findings in memory
        self.memory.add_message(
            session_id,
            self.researcher_id,
            f"Research on {topic}:\n{findings['summary']}"
        )
        
        return findings
```

## Chat Commands

When running `disclosure_chat_with_memory.py`:

- `/insights` - Show your learned research profile
- `/search <query>` - Search past conversations
- `/new` - Start a new research session
- `/quit` - Exit

## Advanced Patterns

### Multi-Agent Collaboration

Track multiple agents collaborating on research:

```python
# Create session with researcher + agents
session = memory.create_session(
    "multi_agent_roswell",
    peer_ids=["researcher_001", "youtube_agent", "document_agent"],
    metadata={"collaboration": True}
)

# YouTube agent shares findings
memory.add_message(
    "multi_agent_roswell",
    "youtube_agent",
    "Found 3 witness testimonies about debris..."
)

# Document agent builds on it
memory.add_message(
    "multi_agent_roswell", 
    "document_agent",
    "Cross-referenced with Project Blue Book files..."
)

# Query what's been learned
synthesis = memory.query_peer_insights(
    "researcher_001",
    "Synthesize what our agents have discovered about Roswell debris"
)
```

### Theory of Mind for Witnesses

Build profiles of UFO witnesses/researchers:

```python
# Create peer for famous researcher
jesse_marcel = memory.get_or_create_peer(
    "jesse_marcel",
    metadata={"role": "witness", "case": "roswell"}
)

# Add known information
session = memory.create_session("marcel_profile", ["jesse_marcel"])
memory.add_message(
    "marcel_profile",
    "jesse_marcel",
    "I was the intelligence officer who first examined the debris..."
)

# Query psychological profile
profile = memory.query_peer_insights(
    "jesse_marcel",
    "What can you tell me about Jesse Marcel's credibility and testimony style?"
)
```

## Environment Configuration

Required environment variables in `.env`:

```bash
# Honcho API Key (already configured)
HONCHO_API_KEY=hch-v2-pl9qe8szkbtht0e0tsr80hter2j4logyar050vtgw40bsceatz8capiclp33jbas

# OpenAI for LLM responses
OPENAI_API_KEY=sk-...

# Optional: Honcho environment (default: production)
HONCHO_ENVIRONMENT=production
```

## Best Practices

### 1. Consistent Researcher IDs

Use stable identifiers for researchers:

```python
# Good: Stable identifier
researcher_id = "john_doe" 

# Bad: Random each time
researcher_id = f"user_{random.randint(1000, 9999)}"
```

### 2. Meaningful Session Metadata

Add rich metadata to sessions:

```python
session = memory.create_session(
    "roswell_2024_01_15",
    ["researcher_001"],
    metadata={
        "topic": "Roswell Incident",
        "case_focus": "debris_analysis",
        "primary_sources": ["Jesse Marcel", "Project Blue Book"],
        "investigation_phase": "initial_review"
    }
)
```

### 3. Track Activities Separately from Chat

Use `track_research_activity()` for non-conversational actions:

```python
# Track document views
memory.track_research_activity(
    researcher_id,
    "document_view",
    {"doc_id": "blue_book_47", "time_spent": 300}
)

# Track entity searches
memory.track_research_activity(
    researcher_id,
    "entity_search",
    {"entity": "Jesse Marcel", "relationship": "witness"}
)
```

### 4. Use Dialectic API for Insights

Query natural language for rich insights:

```python
# Instead of retrieving raw messages
results = memory.search_memories(peer_id, "Roswell")

# Use Dialectic for synthesis
insights = memory.query_peer_insights(
    peer_id,
    "Based on my Roswell research, what are the key unresolved questions?"
)
```

## Troubleshooting

### Memory Not Initializing

If you see "Memory system not available":

```bash
# Check API key is set
echo $HONCHO_API_KEY

# Verify it's in .env
grep HONCHO_API_KEY apps/disclosure-rag/.env

# Test connection
python -c "from honcho import Honcho; c = Honcho(api_key='hch-v2-...'); print('✅ Connected')"
```

### Empty Insights

If `query_peer_insights()` returns empty results:

- Need at least a few messages before insights are meaningful
- Try asking more specific questions
- Wait for background deriver to process (can take a few seconds)

### Context Token Limits

If context is too large:

```python
# Reduce token budget
context = memory.get_session_context(session_id, max_tokens=1000)

# Or only get recent messages
# Honcho automatically handles this
```

## Next Steps

1. **Test the integration**: Run `python disclosure_chat_with_memory.py --test`
2. **Try interactive mode**: Chat with the memory-enabled bot
3. **Integrate with agents**: Add memory to YouTube agent, research agents
4. **Build witness profiles**: Create theory-of-mind models for key figures
5. **Multi-agent workflows**: Enable agent collaboration with shared memory

## Resources

- [Honcho Documentation](https://docs.honcho.dev)
- [Honcho Python SDK](https://github.com/plastic-labs/honcho-python)
- [Dialectic API Guide](https://docs.honcho.dev/v2/guides/dialectic-endpoint)
- [Architecture Reference](https://docs.honcho.dev/v2/documentation/core-concepts/architecture)

## Support

For issues with Honcho integration:
1. Check this documentation
2. Review Honcho docs at https://docs.honcho.dev
3. Join Honcho Discord: http://discord.gg/plasticlabs
4. Check GitHub issues: https://github.com/plastic-labs/honcho
