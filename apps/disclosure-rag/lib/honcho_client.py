"""
Honcho Memory Client for Disclosure RAG
Provides persistent memory and personalization for UAP research
"""

import os
import json
import time
from typing import Optional, List, Dict, Any
from honcho import Honcho
from dotenv import load_dotenv

load_dotenv()


class HonchoMemoryClient:
    """Wrapper for Honcho memory management in UAP research context"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        environment: str = "production",
        workspace_id: str = "ultraterrestrial-disclosure"
    ):
        """
        Initialize Honcho client for disclosure research
        
        Args:
            api_key: Honcho API key (defaults to HONCHO_API_KEY env var)
            environment: "production" or "demo" 
            workspace_id: Workspace identifier for organizing memory
        """
        self.api_key = api_key or os.getenv("HONCHO_API_KEY")
        
        if not self.api_key:
            raise ValueError(
                "Honcho API key not found. Set HONCHO_API_KEY environment variable "
                "or pass api_key parameter"
            )
        
        # Initialize Honcho client
        self.client = Honcho(
            api_key=self.api_key,
            environment=environment,
            workspace_id=workspace_id
        )
        
        self.workspace_id = workspace_id
        self._peer_cache = {}
    
    def get_or_create_peer(self, peer_id: str, metadata: Optional[Dict] = None) -> Any:
        """
        Get or create a peer (user/researcher)
        
        Args:
            peer_id: Unique identifier for the peer
            metadata: Additional metadata about the peer
            
        Returns:
            Peer object
        """
        if peer_id not in self._peer_cache:
            peer = self.client.peer(peer_id)
            if metadata:
                # Store metadata with peer
                peer.metadata = metadata
            self._peer_cache[peer_id] = peer
        
        return self._peer_cache[peer_id]
    
    def create_session(
        self,
        session_id: str,
        peer_ids: List[str],
        metadata: Optional[Dict] = None
    ) -> Any:
        """
        Create a research session with one or more peers
        
        Args:
            session_id: Unique session identifier
            peer_ids: List of peer IDs participating in session
            metadata: Session metadata (e.g., research topic, case focus)
            
        Returns:
            Session object
        """
        session = self.client.session(session_id)
        
        # Add peers to session
        peers = [self.get_or_create_peer(pid) for pid in peer_ids]
        session.add_peers(peers)
        
        # Note: Metadata is stored internally by Honcho, not as a direct attribute
        # Store metadata as a system message if needed
        if metadata:
            metadata_msg = f"[SESSION_METADATA] {json.dumps(metadata)}"
            # Store in first peer's message for context
            if peers:
                msg = peers[0].message(metadata_msg)
                session.add_messages([msg])
        
        return session
    
    def add_message(
        self,
        session_id: str,
        peer_id: str,
        content: str,
        is_user: bool = True
    ):
        """
        Add a message to a session
        
        Args:
            session_id: Session identifier
            peer_id: ID of peer sending message
            content: Message content
            is_user: Whether this is a user message (vs assistant)
        """
        session = self.client.session(session_id)
        peer = self.get_or_create_peer(peer_id)
        
        message = peer.message(content)
        session.add_messages([message])
    
    def get_session_context(
        self,
        session_id: str,
        max_tokens: int = 4000
    ) -> str:
        """
        Get formatted context for a session (handles token limits automatically)
        
        Args:
            session_id: Session identifier
            max_tokens: Maximum tokens to return
            
        Returns:
            Formatted context string
        """
        session = self.client.session(session_id)
        
        try:
            # Try the v2 API with token budget parameter
            context = session.get_context(token_budget=max_tokens)
        except Exception as e:
            # Fallback: get recent messages manually
            try:
                # Get messages from session
                messages = session.get_messages()
                if not messages:
                    return ""
                
                # Format messages as context
                context_parts = []
                for msg in messages[-10:]:  # Last 10 messages
                    role = getattr(msg, 'role', 'unknown')
                    content = getattr(msg, 'content', '')
                    context_parts.append(f"{role}: {content}")
                
                context = "\n\n".join(context_parts)
            except Exception as fallback_error:
                return f"Unable to retrieve context: {str(fallback_error)}"
        
        return context
    
    def query_peer_insights(
        self,
        peer_id: str,
        query: str,
        session_context: Optional[str] = None
    ) -> str:
        """
        Query Honcho's understanding of a peer using natural language
        Uses Dialectic API to get psychological insights
        
        Args:
            peer_id: Peer to query about
            query: Natural language question
            session_context: Optional session context
            
        Returns:
            AI-generated insight about the peer
            
        Examples:
            - "What research topics is this user most interested in?"
            - "How does this researcher prefer information presented?"
            - "What UFO cases has this user investigated most?"
        """
        peer = self.get_or_create_peer(peer_id)
        response = peer.chat(query)
        
        return response
    
    def search_memories(
        self,
        peer_id: str,
        query: str,
        session_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Search across peer's conversation history
        
        Args:
            peer_id: Peer to search
            query: Search query
            session_id: Optional session to limit search
            
        Returns:
            List of matching messages with metadata
        """
        peer = self.get_or_create_peer(peer_id)
        
        if session_id:
            session = self.client.session(session_id)
            results = session.search(query)
        else:
            results = peer.search(query)
        
        return results
    
    def get_research_preferences(self, peer_id: str) -> Dict[str, Any]:
        """
        Get learned research preferences for a user
        
        Returns:
            Dictionary of research preferences and patterns
        """
        insights = {}
        
        # Query various aspects of research behavior
        queries = {
            "topics": "What UFO/UAP topics is this researcher most interested in?",
            "sources": "What types of sources does this researcher prefer (testimony, documents, technical)?",
            "style": "How does this researcher prefer information presented?",
            "credibility": "What makes information credible to this researcher?",
            "focus_areas": "What specific cases or events has this researcher investigated most?"
        }
        
        for key, query in queries.items():
            try:
                insights[key] = self.query_peer_insights(peer_id, query)
            except Exception as e:
                insights[key] = f"Unable to determine: {str(e)}"
        
        return insights
    
    def track_research_activity(
        self,
        peer_id: str,
        activity_type: str,
        details: Dict[str, Any],
        session_id: Optional[str] = None
    ):
        """
        Track research activities for learning patterns
        
        Args:
            peer_id: Researcher ID
            activity_type: Type of activity (query, document_view, entity_search, etc.)
            details: Activity details
            session_id: Optional session context
        """
        # Format as a message that Honcho can learn from
        activity_msg = f"[ACTIVITY: {activity_type}] {json.dumps(details)}"
        
        if session_id:
            self.add_message(session_id, peer_id, activity_msg, is_user=True)
        else:
            # Create activity session if none provided
            activity_session_id = f"{peer_id}_activity_log"
            session = self.client.session(activity_session_id)
            peer = self.get_or_create_peer(peer_id)
            session.add_peers([peer])
            message = peer.message(activity_msg)
            session.add_messages([message])


# Convenience functions for common patterns

def init_disclosure_memory(
    researcher_id: str = "default_researcher",
    workspace: str = "ultraterrestrial-disclosure"
) -> HonchoMemoryClient:
    """
    Initialize Honcho memory client for disclosure research
    
    Args:
        researcher_id: ID of the researcher
        workspace: Workspace name
        
    Returns:
        Configured HonchoMemoryClient
    """
    return HonchoMemoryClient(workspace_id=workspace)


def create_research_session(
    client: HonchoMemoryClient,
    researcher_id: str,
    topic: str,
    case_focus: Optional[str] = None
) -> str:
    """
    Create a new research session with context
    
    Args:
        client: HonchoMemoryClient instance
        researcher_id: Researcher ID
        topic: Research topic
        case_focus: Optional specific case being investigated
        
    Returns:
        Session ID
    """
    import uuid
    
    session_id = f"research_{uuid.uuid4().hex[:8]}"
    metadata = {
        "topic": topic,
        "case_focus": case_focus,
        "created_at": time.time()
    }
    
    client.create_session(session_id, [researcher_id], metadata)
    
    return session_id


if __name__ == "__main__":
    # Example usage
    import json
    import time
    
    print("🛸 Honcho Memory Client for Disclosure Research\n")
    
    # Initialize
    client = init_disclosure_memory("researcher_001")
    print("✅ Initialized Honcho client")
    
    # Create research session
    session_id = create_research_session(
        client,
        "researcher_001",
        topic="Roswell Incident Investigation",
        case_focus="1947 crash retrieval"
    )
    print(f"✅ Created research session: {session_id}")
    
    # Simulate research conversation
    messages = [
        "I want to investigate the Roswell incident from 1947",
        "I'm particularly interested in witness testimonies",
        "Show me information about Major Jesse Marcel",
        "What documents exist about debris recovery?",
    ]
    
    print("\n📝 Adding research messages...")
    for msg in messages:
        client.add_message(session_id, "researcher_001", msg, is_user=True)
        print(f"   - {msg[:50]}...")
        time.sleep(0.5)
    
    # Query learned preferences
    print("\n🧠 Querying learned research preferences...")
    insights = client.query_peer_insights(
        "researcher_001",
        "What UFO case is this researcher currently investigating?"
    )
    print(f"   Insight: {insights}")
    
    # Get research preferences
    print("\n📊 Research preference analysis:")
    prefs = client.get_research_preferences("researcher_001")
    print(json.dumps(prefs, indent=2))
    
    print("\n✅ Honcho integration demo complete!")
