#!/usr/bin/env python3
"""
Disclosure Bot Chat Interface
Modern chat interface using OpenAI Chat Completions API with RAG integration
Enhanced with Rich terminal UI for beautiful interactions
"""

import os
import json
import time
from typing import Optional, Dict, Any, List
from openai import OpenAI
from dotenv import load_dotenv
import argparse

# Rich terminal UI imports
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.text import Text
    from rich.prompt import Prompt
    from rich.markdown import Markdown
    from rich.spinner import Spinner
    from rich.live import Live
    from rich.syntax import Syntax
    from rich.table import Table
    from rich.columns import Columns
    from rich.layout import Layout
    from rich.align import Align
    from rich.progress import Progress, TextColumn, BarColumn, TaskProgressColumn, TimeRemainingColumn
    import textwrap
    RICH_AVAILABLE = True
except ImportError:
    RICH_AVAILABLE = False
    console = None

# Load environment
load_dotenv()

class DisclosureBotChat:
    """Modern chat interface with UFO/UAP knowledge integration"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.model = os.environ.get("OPENAI_MODEL", "gpt-5")
        self.conversation_history = []
        self.system_prompt = """You are the Disclosure Bot, an expert AI assistant with deep knowledge of UFO/UAP research material. 

You have comprehensive knowledge of:
- Government disclosure documents and testimonies
- Historical UFO events and cases  
- Key personnel in UFO research
- Organizations involved in UAP research
- Technical analysis of UAP capabilities
- Recent UAP congressional hearings and reports

Provide detailed, evidence-based responses citing specific cases, documents, or testimonies when relevant.
Maintain a serious, analytical tone while being accessible to researchers at all levels.
When appropriate, reference specific dates, locations, witnesses, and documentation."""
        
        # Initialize rich console if available
        if RICH_AVAILABLE:
            self.console = Console()
            self._show_rich_header()
        else:
            print(f"🛸 Disclosure Bot Chat Interface (Modern API)")
            print(f"Model: {self.model}")
            print("="*60)
    
    def _show_rich_header(self):
        """Display rich terminal header"""
        if not RICH_AVAILABLE:
            return
            
        # Create header layout
        layout = Layout()
        layout.split_column(
            Layout(name="header", size=8),
            Layout(name="info", size=3)
        )
        
        # Header panel
        header_text = Text()
        header_text.append("🛸 DISCLOSURE BOT ", style="bold cyan")
        header_text.append("CHAT INTERFACE", style="bold white")
        
        header_panel = Panel(
            Align.center(header_text),
            title="[bold green]UFO/UAP Research Assistant[/bold green]",
            border_style="bright_blue",
            padding=(1, 2)
        )
        
        # Info table
        info_table = Table(show_header=False, box=None, padding=(0, 1))
        info_table.add_column("Key", style="dim")
        info_table.add_column("Value", style="white")
        info_table.add_row("Model:", f"[green]{self.model}[/green]")
        info_table.add_row("Status:", "[green]Connected[/green]")
        info_table.add_row("Mode:", "[cyan]Interactive Chat[/cyan]")
        
        layout["header"].update(header_panel)
        layout["info"].update(Panel(info_table, border_style="dim"))
        
        self.console.print(layout)
        self.console.print()
    
    def create_thread(self) -> str:
        """Create a new conversation thread"""
        # Reset conversation history for new thread
        self.conversation_history = []
        conversation_id = f"thread_{int(time.time())}"
        
        if RICH_AVAILABLE:
            self.console.print(f"📡 New conversation thread created: [cyan]{conversation_id}[/cyan]")
        else:
            print(f"📡 New conversation thread created: {conversation_id}")
        return conversation_id
    
    def send_message(self, message: str, context: Optional[str] = None) -> str:
        """Send a message to the Disclosure Bot and get response"""
        # Add context if provided
        full_message = message
        if context:
            full_message = f"Context: {context}\n\nQuestion: {message}"
        
        # Add user message to conversation history
        self.conversation_history.append({
            "role": "user",
            "content": full_message
        })
        
        # Prepare messages for API call
        messages = [{"role": "system", "content": self.system_prompt}] + self.conversation_history
        
        try:
            # Show thinking indicator
            if RICH_AVAILABLE:
                with Live(Spinner("dots", text="[cyan]🤔 Analyzing UFO/UAP data...[/cyan]"), console=self.console):
                    # Use modern Chat Completions API
                    response = self.client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        temperature=0.7,
                        max_tokens=2000,
                        stream=False
                    )
            else:
                print("🤔 Thinking...", end="\r")
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=2000,
                    stream=False
                )
                print("\r" + " "*20 + "\r", end="")  # Clear thinking message
            
            assistant_response = response.choices[0].message.content
            
            # Add assistant response to conversation history
            self.conversation_history.append({
                "role": "assistant", 
                "content": assistant_response
            })
            
            # Keep conversation history manageable (last 10 exchanges)
            if len(self.conversation_history) > 20:  # 10 user + 10 assistant messages
                self.conversation_history = self.conversation_history[-20:]
            
            return assistant_response
            
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def interactive_chat(self):
        """Start interactive chat session with rich UI"""
        if RICH_AVAILABLE:
            self._rich_interactive_chat()
        else:
            self._simple_interactive_chat()
    
    def _rich_interactive_chat(self):
        """Rich terminal interactive chat"""
        # Welcome message
        welcome_panel = Panel(
            Text("🛸 Welcome to Disclosure Bot Chat!", justify="center", style="bold cyan"),
            subtitle="[dim]Your AI assistant for UFO/UAP research[/dim]",
            border_style="green"
        )
        self.console.print(welcome_panel)
        
        # Commands info
        commands_table = Table(show_header=False, box=None, padding=(0, 1))
        commands_table.add_column("Command", style="cyan")
        commands_table.add_column("Description", style="dim")
        commands_table.add_row("exit/quit/bye", "End the chat session")
        commands_table.add_row("new", "Start a new conversation thread")
        commands_table.add_row("history", "View conversation history")
        commands_table.add_row("help", "Show detailed help")
        
        self.console.print(Panel(commands_table, title="[cyan]Quick Commands[/cyan]", border_style="dim"))
        self.console.print()
        
        while True:
            try:
                # Rich prompt
                user_input = Prompt.ask("[bold blue]🔍 You[/bold blue]").strip()
                
                if user_input.lower() in ['exit', 'quit', 'bye']:
                    goodbye_panel = Panel(
                        Text("👋 Thank you for using Disclosure Bot!", justify="center", style="bold green"),
                        border_style="green"
                    )
                    self.console.print(goodbye_panel)
                    break
                
                if user_input.lower() == 'new':
                    self.create_thread()
                    self.console.print(Panel("✨ Started new conversation", style="green"))
                    continue
                
                if user_input.lower() == 'help':
                    self._show_rich_help()
                    continue
                
                if user_input.lower() == 'history':
                    self._show_rich_conversation_history()
                    continue
                
                if not user_input:
                    continue
                
                # Get response
                response = self.send_message(user_input)
                
                # Display response in rich format
                if response.startswith("❌ Error:"):
                    self.console.print(Panel(response, title="[red]Error[/red]", border_style="red"))
                else:
                    # Format response as markdown for better readability
                    response_panel = Panel(
                        Markdown(response),
                        title="[cyan]🛸 Disclosure Bot[/cyan]",
                        border_style="cyan",
                        padding=(1, 2)
                    )
                    self.console.print(response_panel)
                
                self.console.print()  # Add spacing
                
            except KeyboardInterrupt:
                self.console.print("\n\n[yellow]👋 Chat interrupted. Goodbye![/yellow]")
                break
            except Exception as e:
                error_panel = Panel(f"❌ Error: {e}", title="[red]Error[/red]", border_style="red")
                self.console.print(error_panel)
    
    def _simple_interactive_chat(self):
        """Simple terminal interactive chat (fallback)"""
        print("\n🛸 Welcome to Disclosure Bot Chat!")
        print("Type 'exit' to quit, 'new' for new thread, 'help' for commands\n")
        
        while True:
            try:
                user_input = input("🔍 You: ").strip()
                
                if user_input.lower() in ['exit', 'quit', 'bye']:
                    print("\n👋 Thank you for using Disclosure Bot!")
                    break
                
                if user_input.lower() == 'new':
                    self.create_thread()
                    print("✨ Started new conversation\n")
                    continue
                
                if user_input.lower() == 'help':
                    self._show_help()
                    continue
                
                if user_input.lower() == 'history':
                    self._show_conversation_history()
                    continue
                
                if not user_input:
                    continue
                
                response = self.send_message(user_input)
                print(f"🛸 Disclosure Bot:\n{response}\n")
                
            except KeyboardInterrupt:
                print("\n\n👋 Chat interrupted. Goodbye!")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}\n")
    
    def _show_help(self):
        """Show available commands (simple version)"""
        help_text = """
🛸 Disclosure Bot Commands:
        
• exit/quit/bye - End the chat session
• new - Start a new conversation thread
• history - View conversation history
• help - Show this help message

🔍 Example Questions:
• "What does the Pentagon's UAP report say about underwater sightings?"
• "Tell me about Luis Elizondo's role in AATIP"
• "What are the key findings from the Wilson-Davis memo?"
• "Analyze the Tic Tac UAP incident from the Nimitz encounter"
• "What evidence exists for crash retrieval programs?"

💡 Tips:
• Be specific in your questions for detailed responses
• Ask for citations when you need source verification
• Use follow-up questions to dive deeper into topics
        """
        print(help_text)
    
    def _show_rich_help(self):
        """Show rich formatted help"""
        if not RICH_AVAILABLE:
            self._show_help()
            return
        
        # Commands section
        commands_table = Table(title="🛸 Disclosure Bot Commands", show_header=True, header_style="bold cyan")
        commands_table.add_column("Command", style="cyan", width=15)
        commands_table.add_column("Description", style="white")
        
        commands_table.add_row("exit/quit/bye", "End the chat session")
        commands_table.add_row("new", "Start a new conversation thread")
        commands_table.add_row("history", "View conversation history")
        commands_table.add_row("help", "Show this help message")
        
        # Example questions
        examples_table = Table(title="🔍 Example Questions", show_header=False)
        examples_table.add_column("Question", style="dim")
        
        examples = [
            "What does the Pentagon's UAP report say about underwater sightings?",
            "Tell me about Luis Elizondo's role in AATIP",
            "What are the key findings from the Wilson-Davis memo?",
            "Analyze the Tic Tac UAP incident from the Nimitz encounter",
            "What evidence exists for crash retrieval programs?"
        ]
        
        for example in examples:
            examples_table.add_row(f"• {example}")
        
        # Tips section
        tips_table = Table(title="💡 Tips", show_header=False)
        tips_table.add_column("Tip", style="green")
        
        tips = [
            "Be specific in your questions for detailed responses",
            "Ask for citations when you need source verification",
            "Use follow-up questions to dive deeper into topics"
        ]
        
        for tip in tips:
            tips_table.add_row(f"• {tip}")
        
        # Create layout
        help_layout = Layout()
        help_layout.split_column(
            Layout(commands_table, size=8),
            Layout(examples_table, size=10),
            Layout(tips_table, size=6)
        )
        
        self.console.print(Panel(help_layout, title="[bold green]Help & Documentation[/bold green]", border_style="green"))
        self.console.print()
    
    def _show_conversation_history(self):
        """Display the current conversation history (simple version)"""
        if not self.conversation_history:
            print("📄 No conversation history available")
            return
        
        print("📄 Conversation History:")
        print("=" * 50)
        
        for i, message in enumerate(self.conversation_history, 1):
            role = message["role"].title()
            content = message["content"]
            
            # Truncate long messages
            if len(content) > 200:
                content = content[:200] + "..."
            
            print(f"{i}. {role}: {content}")
            print("-" * 30)
    
    def _show_rich_conversation_history(self):
        """Display rich formatted conversation history"""
        if not RICH_AVAILABLE:
            self._show_conversation_history()
            return
            
        if not self.conversation_history:
            self.console.print(Panel("📄 No conversation history available", style="dim"))
            return
        
        history_table = Table(title="📄 Conversation History", show_header=True, header_style="bold cyan")
        history_table.add_column("#", style="dim", width=3)
        history_table.add_column("Role", style="bold", width=10)
        history_table.add_column("Message", style="white")
        
        for i, message in enumerate(self.conversation_history, 1):
            role = message["role"].title()
            content = message["content"]
            
            # Truncate and wrap long messages
            if len(content) > 80:
                content = content[:80] + "..."
            
            # Style based on role
            role_style = "blue" if role == "User" else "cyan"
            
            history_table.add_row(
                str(i),
                f"[{role_style}]{role}[/{role_style}]",
                content
            )
        
        self.console.print(Panel(history_table, border_style="cyan"))
        self.console.print()
    
    def batch_questions(self, questions_file: str):
        """Process multiple questions from a file with rich progress display"""
        if not os.path.exists(questions_file):
            error_msg = f"❌ Questions file not found: {questions_file}"
            if RICH_AVAILABLE:
                self.console.print(Panel(error_msg, title="[red]Error[/red]", border_style="red"))
            else:
                print(error_msg)
            return
        
        with open(questions_file, 'r') as f:
            questions = [line.strip() for line in f if line.strip()]
        
        if RICH_AVAILABLE:
            # Rich progress display
            with Progress(
                TextColumn("[bold blue]Processing questions..."),
                BarColumn(),
                TaskProgressColumn(),
                TimeRemainingColumn(),
                console=self.console
            ) as progress:
                task = progress.add_task("Questions", total=len(questions))
                results = []
                
                for i, question in enumerate(questions, 1):
                    # Show current question
                    self.console.print(f"\n[cyan]📝 Question {i}/{len(questions)}:[/cyan] {question}")
                    
                    response = self.send_message(question)
                    results.append({
                        "question": question,
                        "response": response
                    })
                    
                    # Show truncated response
                    truncated_response = response[:100] + "..." if len(response) > 100 else response
                    self.console.print(f"[green]🛸 Response:[/green] {truncated_response}")
                    
                    progress.update(task, advance=1)
        else:
            # Simple progress display
            results = []
            for i, question in enumerate(questions, 1):
                print(f"\n📝 Question {i}/{len(questions)}: {question}")
                response = self.send_message(question)
                results.append({
                    "question": question,
                    "response": response
                })
                print(f"🛸 Response: {response[:100]}...")
        
        # Save results
        output_file = f"disclosure_bot_results_{int(time.time())}.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        success_msg = f"✅ Results saved to: {output_file}"
        if RICH_AVAILABLE:
            self.console.print(Panel(success_msg, title="[green]Success[/green]", border_style="green"))
        else:
            print(f"\n{success_msg}")


def main():
    parser = argparse.ArgumentParser(description="Disclosure Bot Chat Interface")
    parser.add_argument("--batch", help="Process questions from file")
    parser.add_argument("--question", help="Ask a single question")
    parser.add_argument("--context", help="Provide context for the question")
    
    args = parser.parse_args()
    
    try:
        bot = DisclosureBotChat()
        
        if args.batch:
            bot.batch_questions(args.batch)
        elif args.question:
            response = bot.send_message(args.question, args.context)
            if RICH_AVAILABLE:
                console = Console()
                response_panel = Panel(
                    Markdown(response),
                    title="[cyan]🛸 Disclosure Bot Response[/cyan]",
                    border_style="cyan",
                    padding=(1, 2)
                )
                console.print(response_panel)
            else:
                print(f"\n🛸 Disclosure Bot Response:\n{response}")
        else:
            bot.interactive_chat()
            
    except Exception as e:
        if RICH_AVAILABLE:
            console = Console()
            error_panel = Panel(
                "[red]Error initializing Disclosure Bot[/red]\n\n" +
                "Make sure your environment variables are set correctly:\n" +
                "[cyan]• OPENAI_API_KEY[/cyan]\n" +
                "[cyan]• OPENAI_MODEL[/cyan] (optional, defaults to gpt-5)",
                title="[red]Configuration Error[/red]",
                border_style="red"
            )
            console.print(error_panel)
        else:
            print(f"❌ Error initializing Disclosure Bot: {e}")
            print("Make sure your environment variables are set correctly:")
            print("- OPENAI_API_KEY")
            print("- OPENAI_MODEL (optional, defaults to gpt-5)")


if __name__ == "__main__":
    main()