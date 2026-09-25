#!/usr/bin/env python3
"""
Disclosure Bot Chat Interface with Honcho Memory
Enhanced chat with persistent memory and personalization
"""

import os
import json
import time
import uuid
from typing import Optional, Dict, Any, List
from openai import OpenAI
from dotenv import load_dotenv
import argparse

# Import Honcho memory client
from lib.honcho_client import HonchoMemoryClient, init_disclosure_memory

# Rich terminal UI imports
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.text import Text
    from rich.prompt import Prompt
    from rich.markdown import Markdown
    RICH_AVAILABLE = True
except ImportError:
    RICH_AVAILABLE = False

load_dotenv()


class DisclosureBotWithMemory:
    """Modern chat interface with persistent memory and personalization"""
    
    def __init__(self, researcher_id: str = None, workspace: str = "disclosure-research"):
        """
        Initialize disclosure bot with memory
        
        Args:
            researcher_id: Unique ID for researcher (default: generates one)
            workspace: Honcho workspace name
        """
        # OpenAI client
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.model = os.environ.get("OPENAI_MODEL", "gpt-4o")
        
        # Researcher identity
        self.researcher_id = researcher_id or f"researcher_{uuid.uuid4().hex[:8]}"
        
        # Initialize Honcho memory
        try:
            self.memory = HonchoMemoryClient(workspace_id=workspace)
            self.memory_enabled = True
            print(f"✅ Memory system initialized for {self.researcher_id}")
        except Exception as e:
            print(f"⚠️  Memory system not available: {e}")
            print("   Continuing without persistent memory...")
            self.memory_enabled = False
            self.memory = None
        
        # Current session
        self.current_session_id = None
        
        # Base system prompt
        self.base_system_prompt = """You are the Disclosure Bot, an expert AI assistant with deep knowledge of UFO/UAP research material.

You have comprehensive knowledge of:
- Government disclosure documents and testimonies
- Historical UFO events and cases  
- Key personnel in UFO research
- Organizations involved in UAP research
- Technical analysis of UAP capabilities
- Recent UAP congressional hearings and reports

Provide detailed, evidence-based responses citing specific cases, documents, or testimonies when relevant.
Maintain a serious, analytical tone while being accessible to researchers at all levels."""
        
        # Rich console
        if RICH_AVAILABLE:
            self.console = Console()
        else:
            self.console = None
    
    def start_research_session(self, topic: Optional[str] = None) -> str:
        """
        Start a new research session
        
        Args:
            topic: Research topic (optional, can be detected from conversation)
            
        Returns:
            Session ID
        """
        session_id = f"session_{uuid.uuid4().hex[:8]}"
        
        if self.memory_enabled:
            metadata = {
                "topic": topic or "general_uap_research",
                "started_at": time.time()
            }
            self.memory.create_session(session_id, [self.researcher_id], metadata)
            print(f"📝 Research session started: {session_id}")
        
        self.current_session_id = session_id
        return session_id
    
    def get_personalized_system_prompt(self) -> str:
        """
        Get system prompt enhanced with learned user preferences
        
        Returns:
            Personalized system prompt
        """
        if not self.memory_enabled:
            return self.base_system_prompt
        
        try:
            # Query what Honcho has learned about this researcher
            preferences_query = """Based on our conversations, provide a brief summary of:
1. What research topics I'm most interested in
2. How I prefer information presented
3. My current investigation focus
Keep it concise (2-3 sentences)."""
            
            learned_context = self.memory.query_peer_insights(
                self.researcher_id,
                preferences_query
            )
            
            enhanced_prompt = f"""{self.base_system_prompt}

## Researcher Context
{learned_context}

Adapt your responses based on this researcher's established preferences and current investigation focus."""
            
            return enhanced_prompt
            
        except Exception as e:
            # Fallback to base prompt if query fails
            return self.base_system_prompt
    
    def chat(self, user_message: str, include_memory_context: bool = True) -> str:
        """
        Send message and get response with memory integration
        
        Args:
            user_message: User's message
            include_memory_context: Whether to include memory context
            
        Returns:
            Assistant response
        """
        # Start session if needed
        if not self.current_session_id:
            self.start_research_session()
        
        # Store message in Honcho
        if self.memory_enabled:
            self.memory.add_message(
                self.current_session_id,
                self.researcher_id,
                user_message,
                is_user=True
            )
        
        # Build messages for OpenAI
        messages = []
        
        # System prompt with personalization
        system_prompt = self.get_personalized_system_prompt()
        messages.append({"role": "system", "content": system_prompt})
        
        # Add memory context if enabled
        if self.memory_enabled and include_memory_context:
            try:
                # Get relevant context from Honcho
                memory_context = self.memory.get_session_context(
                    self.current_session_id,
                    max_tokens=2000
                )
                
                if memory_context:
                    messages.append({
                        "role": "system",
                        "content": f"## Conversation Context\n{memory_context}"
                    })
            except Exception as e:
                print(f"⚠️  Could not retrieve memory context: {e}")
        
        # Add current message
        messages.append({"role": "user", "content": user_message})
        
        # Get response from OpenAI
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1500
        )
        
        assistant_message = response.choices[0].message.content
        
        # Store assistant response in memory
        if self.memory_enabled:
            self.memory.add_message(
                self.current_session_id,
                "assistant",
                assistant_message,
                is_user=False
            )
        
        return assistant_message
    
    def show_research_insights(self):
        """Display insights Honcho has learned about this researcher"""
        if not self.memory_enabled:
            print("Memory system not available")
            return
        
        if self.console:
            self.console.print("\n[bold cyan]🧠 Research Profile Insights[/bold cyan]")
        else:
            print("\n🧠 Research Profile Insights")
        
        try:
            insights = self.memory.get_research_preferences(self.researcher_id)
            
            if self.console:
                for key, value in insights.items():
                    panel = Panel(
                        value,
                        title=f"[bold]{key.replace('_', ' ').title()}[/bold]",
                        border_style="cyan"
                    )
                    self.console.print(panel)
            else:
                for key, value in insights.items():
                    print(f"\n{key.replace('_', ' ').title()}:")
                    print(f"  {value}")
                    
        except Exception as e:
            print(f"Could not retrieve insights: {e}")
    
    def search_past_research(self, query: str) -> List[Dict]:
        """
        Search across all past research conversations
        
        Args:
            query: Search query
            
        Returns:
            Relevant past messages
        """
        if not self.memory_enabled:
            return []
        
        try:
            results = self.memory.search_memories(
                self.researcher_id,
                query
            )
            return results
        except Exception as e:
            print(f"Search failed: {e}")
            return []
    
    def run_interactive(self):
        """Run interactive chat loop"""
        if self.console:
            self.console.print(Panel(
                "[bold cyan]🛸 Disclosure Bot with Memory[/bold cyan]\n"
                f"Researcher ID: {self.researcher_id}\n"
                f"Memory: {'[green]Enabled[/green]' if self.memory_enabled else '[yellow]Disabled[/yellow]'}\n"
                f"Model: {self.model}",
                title="[bold]UFO/UAP Research Assistant[/bold]",
                border_style="bright_blue"
            ))
        else:
            print("="*60)
            print("🛸 Disclosure Bot with Memory")
            print(f"Researcher ID: {self.researcher_id}")
            print(f"Memory: {'Enabled' if self.memory_enabled else 'Disabled'}")
            print("="*60)
        
        # Start session
        self.start_research_session()
        
        print("\nCommands:")
        print("  /insights - Show your research profile")
        print("  /search <query> - Search past research")
        print("  /new - Start new session")
        print("  /quit - Exit")
        print()
        
        while True:
            try:
                if self.console:
                    user_input = Prompt.ask("[bold green]You[/bold green]")
                else:
                    user_input = input("You: ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.startswith("/"):
                    if user_input == "/quit":
                        print("👋 Goodbye!")
                        break
                    elif user_input == "/insights":
                        self.show_research_insights()
                        continue
                    elif user_input.startswith("/search "):
                        query = user_input[8:]
                        results = self.search_past_research(query)
                        print(f"\nFound {len(results)} results:")
                        for r in results[:5]:
                            print(f"  - {r.get('content', '')[:100]}...")
                        continue
                    elif user_input == "/new":
                        self.start_research_session()
                        continue
                    else:
                        print("Unknown command")
                        continue
                
                # Get response
                if self.console:
                    with self.console.status("[bold blue]Thinking..."):
                        response = self.chat(user_input)
                    
                    self.console.print(Panel(
                        Markdown(response),
                        title="[bold blue]Disclosure Bot[/bold blue]",
                        border_style="blue"
                    ))
                else:
                    response = self.chat(user_input)
                    print(f"\nBot: {response}\n")
                
            except KeyboardInterrupt:
                print("\n\n👋 Session ended")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Disclosure Bot with Memory")
    parser.add_argument(
        "--researcher-id",
        help="Your researcher ID (will be generated if not provided)"
    )
    parser.add_argument(
        "--workspace",
        default="disclosure-research",
        help="Honcho workspace name"
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run quick test"
    )
    
    args = parser.parse_args()
    
    # Initialize bot
    bot = DisclosureBotWithMemory(
        researcher_id=args.researcher_id,
        workspace=args.workspace
    )
    
    if args.test:
        # Quick test
        print("\n🧪 Running quick test...\n")
        
        bot.start_research_session(topic="Roswell Investigation")
        
        test_messages = [
            "Tell me about the Roswell incident",
            "Who was Jesse Marcel?",
            "What evidence exists for the crash?"
        ]
        
        for msg in test_messages:
            print(f"You: {msg}")
            response = bot.chat(msg)
            print(f"Bot: {response[:200]}...\n")
        
        print("\n📊 Showing learned insights...")
        bot.show_research_insights()
        
    else:
        # Interactive mode
        bot.run_interactive()


if __name__ == "__main__":
    main()
