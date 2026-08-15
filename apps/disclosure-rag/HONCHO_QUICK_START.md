# 🛸 Honcho Memory Integration - Quick Start

## What We Built

You now have a fully integrated Honcho memory system for your Disclosure RAG project that provides:

✅ **Persistent conversation memory** across sessions  
✅ **Automatic personalization** based on researcher patterns  
✅ **Theory of mind** understanding of users and witnesses  
✅ **Smart context management** for long conversations  
✅ **Research activity tracking** to learn investigation patterns  

## Files Created

### 1. Core Library: `lib/honcho_client.py`
The main Honcho wrapper providing:
- `HonchoMemoryClient` - Main client class
- Peer management (researchers, agents, witnesses)
- Session management (research conversations)
- Message tracking and storage
- Dialectic API for insights
- Context retrieval with token management
- Search across historical conversations

### 2. Enhanced Chat: `disclosure_chat_with_memory.py`
Memory-enabled chat interface with:
- Automatic session management
- Personalized system prompts
- Research insights display
- Historical conversation search
- Interactive commands

### 3. Documentation
- `HONCHO_INTEGRATION.md` - Complete integration guide
- `HONCHO_QUICK_START.md` - This file
- `test_honcho_integration.py` - Integration test suite

## Quick Test

Run this to verify everything works:

```bash
cd apps/disclosure-rag
.venv/bin/python test_honcho_integration.py
```

Expected output:
```
✅ API key found
✅ Honcho SDK imported successfully  
✅ Honcho client initialized
✅ HonchoMemoryClient initialized
✅ Test peer created
✅ Session created
✅ Message added
✅ All core tests passed!
```

## Try It Out - 3 Simple Examples

### Example 1: Basic Memory (30 seconds)

```python
from lib.honcho_client import HonchoMemoryClient

# Initialize
memory = HonchoMemoryClient()

# Create researcher
peer = memory.get_or_create_peer("john_researcher")

# Start session
session = memory.create_session("roswell_001", ["john_researcher"])

# Add messages
memory.add_message("roswell_001", "john_researcher", 
    "I want to investigate the Roswell crash of 1947")
memory.add_message("roswell_001", "john_researcher",
    "Tell me about Jesse Marcel's testimony")

# Query what Honcho learned
insights = memory.query_peer_insights(
    "john_researcher",
    "What case is this researcher investigating?"
)
print(insights)
# Output: "This researcher is investigating the Roswell crash 
#          of 1947, with particular interest in Jesse Marcel's 
#          testimony..."
```

### Example 2: Chat with Memory

```bash
# Run interactive chat
.venv/bin/python disclosure_chat_with_memory.py

# In chat:
You: Tell me about the Phoenix Lights incident
Bot: [Gives detailed response]

You: What makes this case significant?  
Bot: [Answers with context from previous message]

# Later (new session, same researcher_id):
You: Continue our discussion about Phoenix Lights
Bot: [Remembers context from previous session!]

# Commands:
/insights  # See your learned research profile
/search phoenix  # Find past discussions
/new  # Start fresh session
/quit  # Exit
```

### Example 3: Agent with Memory

```python
from lib.honcho_client import HonchoMemoryClient

class MemoryEnabledAgent:
    def __init__(self, researcher_id):
        self.memory = HonchoMemoryClient()
        self.researcher_id = researcher_id
    
    def process_document(self, doc_id, session_id):
        # Track activity
        self.memory.track_research_activity(
            self.researcher_id,
            "document_processed",
            {"document_id": doc_id, "timestamp": time.time()},
            session_id
        )
        
        # Get personalized approach
        approach = self.memory.query_peer_insights(
            self.researcher_id,
            "How should I present findings to this researcher?"
        )
        
        # Process based on learned preferences
        # ...

# Use it
agent = MemoryEnabledAgent("researcher_001")
agent.process_document("blue_book_47", "session_123")
```

## Architecture

```
Your Disclosure RAG
       ↓
HonchoMemoryClient (lib/honcho_client.py)
       ↓
Honcho SDK (honcho-ai)
       ↓
Honcho Production Server
       ↓
Persistent Storage (PostgreSQL + Vector DB)
```

## Key Features Explained

### 1. Automatic Personalization
Honcho learns from every interaction:
```python
# After several conversations...
prefs = memory.get_research_preferences("researcher_001")
# Returns:
# {
#   "topics": "Focused on crash retrieval cases from 1940s-1960s",
#   "sources": "Prefers first-hand testimony over speculation",
#   "style": "Wants technical details and evidence citations"
# }
```

### 2. Theory of Mind
Build psychological models:
```python
# Create profile of a witness
witness = memory.get_or_create_peer("jesse_marcel")
session = memory.create_session("marcel_profile", ["jesse_marcel"])

# Add known information
memory.add_message("marcel_profile", "jesse_marcel",
    "I was the intelligence officer who examined the debris...")

# Query personality
profile = memory.query_peer_insights("jesse_marcel",
    "What can you tell me about Jesse Marcel's credibility?")
```

### 3. Smart Context
No more token limit headaches:
```python
# Automatically manages context window
context = memory.get_session_context(
    session_id="long_conversation",
    max_tokens=4000  # Fits in your LLM
)
# Returns: Mix of recent messages + intelligent summaries
```

### 4. Historical Search
Find anything from past research:
```python
results = memory.search_memories(
    "researcher_001",
    "military witnesses in Roswell case"
)
# Returns: All relevant past discussions
```

## Integration with Your Agents

Add to any of your existing agents:

```python
# agents/ufo_youtube_agent.py
from lib.honcho_client import HonchoMemoryClient

class UFOYouTubeAgent:
    def __init__(self, researcher_id):
        self.memory = HonchoMemoryClient()
        self.researcher_id = researcher_id
    
    def analyze_video(self, url, session_id):
        # Your existing analysis...
        analysis = self._analyze(url)
        
        # Store in memory
        self.memory.add_message(
            session_id, self.researcher_id,
            f"Analyzed {url}: {analysis['summary']}"
        )
        
        # Track activity
        self.memory.track_research_activity(
            self.researcher_id,
            "youtube_analysis",
            {"url": url, "topics": analysis["topics"]},
            session_id
        )
        
        return analysis
```

## Environment Setup

Already configured in your `.env` files:
```bash
HONCHO_API_KEY=hch-v2-pl9qe8szkbtht0e0tsr80hter2j4logyar050vtgw40bsceatz8capiclp33jbas
```

Updated in:
- ✅ `apps/disclosure-rag/.env`
- ✅ `apps/app/.env`
- ✅ `packages/db/.env`
- ✅ Root `.env`

## Next Steps

### Immediate (5 minutes)
1. ✅ Run test: `.venv/bin/python test_honcho_integration.py`
2. Try interactive chat: `.venv/bin/python disclosure_chat_with_memory.py`
3. Ask it a few questions about UFO cases
4. Type `/insights` to see what it learned about you

### Short-term (1 hour)
5. Add memory to your YouTube agent (`agents/ufo_youtube_agent.py`)
6. Create a test session analyzing a few videos
7. Query Honcho: "What patterns has this researcher found in YouTube testimonies?"

### Medium-term (1 day)
8. Integrate with deep research agent (`agents/uap_deep_research_agent.py`)
9. Build witness profiles (Jesse Marcel, Bob Lazar, David Fravor, etc.)
10. Create multi-agent collaboration sessions

### Long-term (1 week)
11. Build research preference dashboard
12. Create automatic case file generation from memory
13. Implement agent-to-agent knowledge sharing
14. Build theory-of-mind models for key UAP figures

## Common Use Cases

### Use Case 1: Personalized Research Assistant
```python
# Chat adapts to your style
chat = DisclosureBotWithMemory("researcher_001")
chat.chat("Explain the Nimitz encounter")  
# Remembers you prefer technical details

chat.chat("Compare with Phoenix Lights")
# Remembers previous context about Nimitz
```

### Use Case 2: Witness Profile Building
```python
# Build psychological profiles
memory.create_session("fravor_profile", ["david_fravor"])
memory.add_message("fravor_profile", "david_fravor",
    "I'm a trained fighter pilot with 18 years experience...")

# Later query
credibility = memory.query_peer_insights("david_fravor",
    "Assess this witness's credibility based on background")
```

### Use Case 3: Cross-Case Pattern Detection
```python
# Track research across cases
memory.track_research_activity("researcher_001", 
    "case_analysis", {"case": "roswell", "focus": "debris"})
memory.track_research_activity("researcher_001",
    "case_analysis", {"case": "rendlesham", "focus": "debris"})

# Query patterns
patterns = memory.query_peer_insights("researcher_001",
    "What common elements is this researcher finding across cases?")
```

## Troubleshooting

**Q: "Memory system not available"**
```bash
# Check API key
echo $HONCHO_API_KEY  
grep HONCHO_API_KEY apps/disclosure-rag/.env

# Test connection
.venv/bin/python -c "from honcho import Honcho; Honcho(api_key='hch-v2-...'); print('OK')"
```

**Q: "Empty insights returned"**
- Need at least 2-3 messages before meaningful insights
- Try more specific queries
- Wait a few seconds for background processing

**Q: "Context retrieval fails"**
- Normal for brand new sessions
- Add a few messages first
- Use fallback to get_messages()

## Resources

- **Integration Guide**: `HONCHO_INTEGRATION.md` (comprehensive)
- **Honcho Docs**: https://docs.honcho.dev
- **Python SDK**: https://github.com/plastic-labs/honcho-python
- **Dialectic API**: https://docs.honcho.dev/v2/guides/dialectic-endpoint
- **Discord**: http://discord.gg/plasticlabs

## Success Indicators

You'll know it's working when:

✅ Chat remembers context from previous messages  
✅ `/insights` shows learned preferences  
✅ Bot adapts responses to your research style  
✅ Search finds relevant past conversations  
✅ Agents track and learn from your activities

## Support

Having issues? Check:
1. This guide's troubleshooting section
2. `HONCHO_INTEGRATION.md` for detailed examples
3. Test script output: `test_honcho_integration.py`
4. Honcho docs: https://docs.honcho.dev
5. Honcho Discord: http://discord.gg/plasticlabs

## What Makes This Powerful

Unlike simple chat history:
- **Learns patterns** automatically (no explicit training)
- **Builds psychology** (theory of mind, not just facts)
- **Adapts dynamically** (changes based on what it learns)
- **Works across sessions** (persistent, not ephemeral)
- **Scales to multiple agents** (collaborative memory)

You now have the foundation for truly intelligent, personalized UAP research assistance.

**Go build something amazing!** 🛸
